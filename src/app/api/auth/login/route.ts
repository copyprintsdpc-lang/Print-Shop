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
    const { email, password } = body as { email?: string; password?: string }
    if (!email || !password) return NextResponse.json({ ok: false, code: 'bad_request', message: 'Email and password are required' }, { status: 400 })

    await connectToDatabase()
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return NextResponse.json({ ok: false, code: 'invalid_credentials', message: 'Invalid credentials' }, { status: 400 })
    if (!user.verified) return NextResponse.json({ ok: false, code: 'not_verified', message: 'Please verify your email' }, { status: 400 })

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return NextResponse.json({ ok: false, code: 'invalid_credentials', message: 'Invalid credentials' }, { status: 400 })

    const jwt = signJwt({ sub: String(user._id), email: user.email })
    setAuthCookie(jwt)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, code: 'internal_error', message: 'Something went wrong' }, { status: 500 })
  }
}


