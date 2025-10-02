import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Admin from '@/models/Admin'
import { signJwt, setAuthCookie } from '@/lib/auth'
import { rateLimitIP } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'ip:' + req.ip || 'unknown'
    const ipLimit = rateLimitIP(ip, 5, 60_000)
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { ok: false, code: 'rate_limited', message: 'Too many login attempts' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { email, password } = body as { email?: string; password?: string }
    
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Email and password are required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const admin = await Admin.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    })
    
    if (!admin) {
      return NextResponse.json(
        { ok: false, code: 'invalid_credentials', message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValidPassword = await admin.comparePassword(password)
    if (!isValidPassword) {
      return NextResponse.json(
        { ok: false, code: 'invalid_credentials', message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login
    admin.lastLogin = new Date()
    await admin.save()

    // Generate JWT token
    const jwt = signJwt({ 
      sub: String(admin._id), 
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    })
    
    await setAuthCookie(jwt)

    return NextResponse.json({
      ok: true,
      message: 'Login successful',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin
      }
    })
  } catch (err) {
    console.error('Admin login error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

