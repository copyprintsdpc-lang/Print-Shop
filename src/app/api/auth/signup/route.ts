import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import VerificationToken from '@/models/VerificationToken'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/lib/mailer'
import { rateLimitIP, rateLimitKey } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'ip:' + req.ip || 'unknown'
    const ipLimit = rateLimitIP(ip, 5, 60_000)
    if (!ipLimit.allowed) return NextResponse.json({ ok: false, code: 'rate_limited', message: 'Too many requests' }, { status: 429 })

    const body = await req.json()
    const { email, password, firstName, lastName } = body as { email?: string; password?: string; firstName?: string; lastName?: string }
    if (!email || !password) return NextResponse.json({ ok: false, code: 'bad_request', message: 'Email and password are required' }, { status: 400 })

    await connectToDatabase()

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) return NextResponse.json({ ok: false, code: 'user_exists', message: 'Email already registered' }, { status: 400 })

    const passwordHash = await bcrypt.hash(password, 12)
    const name = [firstName, lastName].filter(Boolean).join(' ').trim() || undefined
    const user = await User.create({ email: email.toLowerCase(), passwordHash, verified: false, name })

    const raw = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(raw).digest('hex')
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000)
    await VerificationToken.create({ userId: user._id, tokenHash, expiresAt })

    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    const link = `${appUrl}/verify?token=${encodeURIComponent(raw)}&email=${encodeURIComponent(user.email)}`
    if (process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_PASS) {
      await sendVerificationEmail(user.email, link)
    } else {
      console.info('[DEV] Verification link (no SMTP configured):', link)
    }

    return NextResponse.json({ ok: true, message: 'Check your inbox to verify your email.' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, code: 'internal_error', message: 'Something went wrong' }, { status: 500 })
  }
}


