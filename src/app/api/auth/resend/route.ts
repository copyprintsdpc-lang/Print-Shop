import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import VerificationToken from '@/models/VerificationToken'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/mailer'
import { rateLimitIP, rateLimitKey } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'ip:' + req.ip || 'unknown'
    const ipLimit = rateLimitIP(ip, 5, 60_000)
    if (!ipLimit.allowed) return NextResponse.json({ ok: false, code: 'rate_limited', message: 'Too many requests' }, { status: 429 })

    const body = await req.json()
    const { email } = body as { email?: string }
    if (!email) return NextResponse.json({ ok: false, code: 'bad_request', message: 'Email is required' }, { status: 400 })

    const perEmail = rateLimitKey(`resend:${email.toLowerCase()}`, 1, 10 * 60_000)
    if (!perEmail.allowed) return NextResponse.json({ ok: false, code: 'rate_limited', message: 'Please try again later' }, { status: 429 })

    await connectToDatabase()
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return NextResponse.json({ ok: true }) // do not reveal
    if (user.verified) return NextResponse.json({ ok: true })

    await VerificationToken.deleteMany({ userId: user._id })
    const raw = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(raw).digest('hex')
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000)
    await VerificationToken.create({ userId: user._id, tokenHash, expiresAt })

    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    const link = `${appUrl}/verify?token=${encodeURIComponent(raw)}&email=${encodeURIComponent(user.email)}`
    
    // Check if SMTP is properly configured (generic SMTP or Brevo)
    const smtpUser = process.env.SMTP_USER || process.env.BREVO_SMTP_USER
    const smtpPass = process.env.SMTP_PASS || process.env.BREVO_SMTP_PASS
    
    if (smtpUser && smtpPass) {
      try {
        await sendVerificationEmail(user.email, link)
        console.info('✅ Verification email resent to:', user.email)
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError)
      }
    } else {
      console.info('[DEV] Verification link (no SMTP configured):', link)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, code: 'internal_error', message: 'Something went wrong' }, { status: 500 })
  }
}


