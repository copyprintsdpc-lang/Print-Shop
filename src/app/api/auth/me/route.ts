import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/auth'

export async function GET(_req: NextRequest) {
  const token = cookies().get('sdp_session')?.value
  if (!token) return NextResponse.json({ ok: false }, { status: 401 })
  const payload = verifyJwt(token)
  if (!payload) return NextResponse.json({ ok: false }, { status: 401 })
  return NextResponse.json({ ok: true, user: { id: payload.sub, email: payload.email } })
}

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { withAuth } from '@/lib/middleware'

async function handler(request: NextRequest) {
  try {
    await dbConnect()

    const userId = request.user?.userId

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 400 }
      )
    }

    const user = await User.findById(userId).select('-password')

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        businessProfile: user.businessProfile,
        addresses: user.addresses,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(handler)
