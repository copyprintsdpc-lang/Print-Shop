import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { signJwt, setAuthCookie } from '@/lib/auth'
import { rateLimitIP } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'ip:' + req.ip || 'unknown'
    const ipLimit = rateLimitIP(ip, 5, 60_000)
    if (!ipLimit.allowed) return NextResponse.json({ ok: false, code: 'rate_limited', message: 'Too many requests' }, { status: 429 })

    const body = await req.json()
    const { email, phone, password, loginMethod } = body as { 
      email?: string; 
      phone?: string; 
      password?: string; 
      loginMethod?: 'email' | 'phone' 
    }
    
    if (!password) return NextResponse.json({ ok: false, code: 'bad_request', message: 'Password is required' }, { status: 400 })
    
    // Determine login method and validate input
    let loginField: string
    let loginValue: string
    
    if (loginMethod === 'phone') {
      if (!phone) return NextResponse.json({ ok: false, code: 'bad_request', message: 'Phone number is required' }, { status: 400 })
      loginField = 'mobile'
      loginValue = phone.replace(/\D/g, '') // Remove non-digits
    } else {
      if (!email) return NextResponse.json({ ok: false, code: 'bad_request', message: 'Email is required' }, { status: 400 })
      loginField = 'email'
      loginValue = email.toLowerCase()
    }

    await connectToDatabase()
    
    // Find user by email or phone
    const user = await User.findOne({ [loginField]: loginValue })
    if (!user) return NextResponse.json({ ok: false, code: 'invalid_credentials', message: 'Invalid credentials' }, { status: 400 })
    
    // Check if user is verified (only required for email login)
    if (loginMethod !== 'phone' && !user.verified) {
      return NextResponse.json({ ok: false, code: 'not_verified', message: 'Please verify your email' }, { status: 400 })
    }

    // Check password
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return NextResponse.json({ ok: false, code: 'invalid_credentials', message: 'Invalid credentials' }, { status: 400 })

    // Generate JWT token
    const jwt = signJwt({ 
      sub: String(user._id), 
      email: user.email,
      phone: user.mobile 
    })
    setAuthCookie(jwt)
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.mobile,
        role: user.role
      }
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, code: 'internal_error', message: 'Something went wrong' }, { status: 500 })
  }
}


