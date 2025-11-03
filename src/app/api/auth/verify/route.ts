import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/models/User'
import VerificationToken from '@/models/VerificationToken'
import crypto from 'crypto'
import { signJwt, setAuthCookie } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token')
    if (!email || !token) return NextResponse.json({ ok: false, code: 'bad_request', message: 'Missing token or email' }, { status: 400 })

    await connectToDatabase()

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return NextResponse.json({ ok: false, code: 'not_found', message: 'User not found' }, { status: 404 })

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const vt = await VerificationToken.findOne({ userId: user._id, tokenHash })
    if (!vt) return NextResponse.json({ ok: false, code: 'invalid_token', message: 'Invalid token' }, { status: 400 })
    if (vt.expiresAt.getTime() < Date.now()) {
      await vt.deleteOne()
      return NextResponse.json({ ok: false, code: 'expired', message: 'Token expired' }, { status: 400 })
    }

    user.verified = true
    user.emailVerifiedAt = new Date()
    
    // Check if profile is complete
    user.profileComplete = user.verified && user.mobileVerified && user.addresses.length > 0
    user.canOrder = user.verified && user.mobileVerified && user.addresses.some((addr: any) => addr.isVerified)
    
    await user.save()
    await vt.deleteOne()

    console.log(`✅ Email verified for ${user.email}`)

    const jwt = signJwt({ sub: String(user._id), email: user.email })
    await setAuthCookie(jwt)

    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    return NextResponse.redirect(`${appUrl}/dashboard`)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, code: 'internal_error', message: 'Something went wrong' }, { status: 500 })
  }
}


