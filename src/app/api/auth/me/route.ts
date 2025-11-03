import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(_req: NextRequest) {
  try {
    const token = (await cookies()).get('sdp_session')?.value
    if (!token) return NextResponse.json({ ok: false }, { status: 401 })
    
    const payload = verifyJwt(token)
    if (!payload) return NextResponse.json({ ok: false }, { status: 401 })
    
    // Fetch full user data from database
    await dbConnect()
    const user = await User.findOne({ email: payload.email }).select('-passwordHash')
    
    if (!user) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    // Calculate verification status
    const hasVerifiedAddress = user.addresses.some((addr: any) => addr.isVerified)
    const profileComplete = user.verified && user.mobileVerified && user.addresses.length > 0
    const canOrder = user.verified && user.mobileVerified && hasVerifiedAddress

    // Update canOrder if it doesn't match
    if (user.canOrder !== canOrder) {
      user.canOrder = canOrder
      user.profileComplete = profileComplete
      await user.save()
    }
    
    return NextResponse.json({ 
      ok: true, 
      user: {
        id: user._id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        mobile: user.mobile,
        role: user.role || 'customer',
        verified: user.verified,
        emailVerifiedAt: user.emailVerifiedAt,
        mobileVerified: user.mobileVerified,
        mobileVerifiedAt: user.mobileVerifiedAt,
        profileComplete: profileComplete,
        canOrder: canOrder,
        hasVerifiedAddress: hasVerifiedAddress,
        addressCount: user.addresses.length,
        verification: {
          email: user.verified,
          phone: user.mobileVerified,
          address: hasVerifiedAddress,
          complete: canOrder
        }
      } 
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ ok: false }, { status: 401 })
  }
}
