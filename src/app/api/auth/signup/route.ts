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
    const { email, phone, password, firstName, lastName } = body as { 
      email?: string; 
      phone?: string; 
      password?: string; 
      firstName?: string; 
      lastName?: string 
    }
    
    // Validate that either email or phone is provided
    if (!password) return NextResponse.json({ ok: false, code: 'bad_request', message: 'Password is required' }, { status: 400 })
    if (!email && !phone) return NextResponse.json({ ok: false, code: 'bad_request', message: 'Email or phone number is required' }, { status: 400 })

    await connectToDatabase()

    // Check for existing email (if provided, must be unique)
    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() })
      if (existingEmail) return NextResponse.json({ ok: false, code: 'user_exists', message: 'Email already registered' }, { status: 400 })
    }

    // Check for existing phone (if provided, must be unique)
    let mobile = undefined
    if (phone) {
      mobile = phone.replace(/\D/g, '') // Remove non-digits
      const existingPhone = await User.findOne({ mobile })
      if (existingPhone) return NextResponse.json({ ok: false, code: 'phone_exists', message: 'Phone number already registered' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const name = [firstName, lastName].filter(Boolean).join(' ').trim() || undefined
    const user = await User.create({ 
      email: email?.toLowerCase(), 
      passwordHash, 
      verified: email ? false : true, // Phone signups are automatically verified
      name,
      mobile
    })

    // Only create verification token and send email for email signups
    if (email) {
      const raw = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(raw).digest('hex')
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000)
      await VerificationToken.create({ userId: user._id, tokenHash, expiresAt })

      const appUrl = process.env.APP_URL || 'http://localhost:3000'
      const link = `${appUrl}/verify?token=${encodeURIComponent(raw)}&email=${encodeURIComponent(user.email)}`
      
      // Check if SMTP is properly configured (not placeholder values)
      const smtpConfigured = process.env.BREVO_SMTP_USER && 
                            process.env.BREVO_SMTP_PASS && 
                            process.env.BREVO_SMTP_USER !== 'your-brevo-username' &&
                            process.env.BREVO_SMTP_PASS !== 'your-brevo-password'
      
      if (smtpConfigured) {
        try {
          await sendVerificationEmail(user.email, link)
        } catch (emailError) {
          console.error('Email sending failed:', emailError.message)
          // Don't fail the signup if email fails, just log it
        }
      } else {
        console.info('[DEV] Verification link (no SMTP configured):', link)
      }

      return NextResponse.json({ ok: true, message: 'Check your inbox to verify your email.' })
    } else {
      // Phone signup - no email verification needed
      return NextResponse.json({ ok: true, message: 'Account created successfully. You can now login with your phone number.' })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, code: 'internal_error', message: 'Something went wrong' }, { status: 500 })
  }
}


