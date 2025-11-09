import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export const runtime = 'nodejs'

// Manually verify an address (can be called after successful delivery)
export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get('sdp_session')?.value
    const payload = token ? verifyJwt(token) : null
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { addressId, method } = await request.json()

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 })
    }

    await dbConnect()
    const user = await User.findOne({ email: payload.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const address = user.addresses.id(addressId)
    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // Mark address as verified
    address.isVerified = true
    address.verifiedAt = new Date()
    address.verificationMethod = method || 'manual'

    // Update canOrder status
    user.canOrder = user.verified && user.mobileVerified && user.addresses.some((a: any) => a.isVerified)

    await user.save()

    return NextResponse.json({
      success: true,
      message: 'Address verified successfully',
      address,
      canOrder: user.canOrder
    })

  } catch (error) {
    console.error('Verify address error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

