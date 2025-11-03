import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import OtpChallenge from '@/models/OtpChallenge'
import { generateOTP, hashOTP } from '@/lib/auth'
import { otpService } from '@/lib/otpService'

export const runtime = 'nodejs'

// Request OTP for phone verification
export async function POST(request: NextRequest) {
  try {
    // Get user from session
    const token = (await cookies()).get('sdp_session')?.value
    const payload = token ? verifyJwt(token) : null
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { mobile, action } = await request.json()

    if (!mobile) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    // Validate mobile format
    const cleanMobile = mobile.replace(/\D/g, '')
    if (cleanMobile.length !== 10 || !/^[6-9]/.test(cleanMobile)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
    }

    await dbConnect()

    // Check rate limiting (max 3 OTPs per hour per mobile)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentOTPs = await OtpChallenge.countDocuments({
      mobile: cleanMobile,
      createdAt: { $gte: oneHourAgo }
    })

    if (recentOTPs >= 3) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const hashedOTP = hashOTP(otp)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create OTP challenge
    const otpChallenge = new OtpChallenge({
      mobile: cleanMobile,
      channel: 'sms',
      codeHash: hashedOTP,
      expiresAt,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    })

    await otpChallenge.save()

    // Send OTP via SMS
    const message = `Your Sri Datta Print Center verification code is ${otp}. Valid for 10 minutes.`
    const sent = await otpService.sendSMS(cleanMobile, message)

    if (!sent) {
      await OtpChallenge.findByIdAndDelete(otpChallenge._id)
      return NextResponse.json(
        { error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      )
    }

    // In development, log the OTP
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 Phone Verification OTP for ${cleanMobile}: ${otp}`)
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 600
    })

  } catch (error) {
    console.error('Phone verification OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Verify OTP and update phone number
export async function PATCH(request: NextRequest) {
  try {
    // Get user from session
    const token = (await cookies()).get('sdp_session')?.value
    const payload = token ? verifyJwt(token) : null
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { mobile, otp } = await request.json()

    if (!mobile || !otp) {
      return NextResponse.json({ error: 'Phone and OTP are required' }, { status: 400 })
    }

    const cleanMobile = mobile.replace(/\D/g, '')

    await dbConnect()

    // Find and verify OTP
    const hashedOTP = hashOTP(otp)
    const otpChallenge = await OtpChallenge.findOne({
      mobile: cleanMobile,
      codeHash: hashedOTP
    })

    if (!otpChallenge) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    if (otpChallenge.expiresAt.getTime() < Date.now()) {
      await otpChallenge.deleteOne()
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 })
    }

    if (otpChallenge.attempts >= 3) {
      await otpChallenge.deleteOne()
      return NextResponse.json({ error: 'Too many attempts' }, { status: 400 })
    }

    // Update user phone and mark as verified
    const user = await User.findOne({ email: payload.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    user.mobile = cleanMobile
    user.mobileVerified = true
    user.mobileVerifiedAt = new Date()
    
    // Check if profile is complete
    user.profileComplete = user.verified && user.mobileVerified && user.addresses.length > 0
    user.canOrder = user.profileComplete

    await user.save()
    await otpChallenge.deleteOne()

    return NextResponse.json({
      success: true,
      message: 'Phone verified successfully',
      profileComplete: user.profileComplete,
      canOrder: user.canOrder
    })

  } catch (error) {
    console.error('Phone verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

