import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import OtpChallenge from '@/models/OtpChallenge'
import User from '@/models/User'
import { verifyOTP, generateToken, isOTPExpired, isRateLimited } from '@/lib/auth'
import { formatMobileNumber } from '@/lib/otpService'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { mobile, otp, name, email } = await request.json()

    // Validate input
    if (!mobile || !otp) {
      return NextResponse.json(
        { error: 'Mobile number and OTP are required' },
        { status: 400 }
      )
    }

    // Format mobile number
    let formattedMobile: string
    try {
      formattedMobile = formatMobileNumber(mobile)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 400 }
      )
    }

    // Find the most recent OTP challenge for this mobile
    const otpChallenge = await OtpChallenge.findOne({
      mobile: formattedMobile,
      status: 'pending'
    }).sort({ createdAt: -1 })

    if (!otpChallenge) {
      return NextResponse.json(
        { error: 'No OTP found for this mobile number' },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    if (isOTPExpired(otpChallenge.expiresAt)) {
      otpChallenge.status = 'expired'
      await otpChallenge.save()
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check rate limiting
    if (isRateLimited(otpChallenge.attempts)) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      )
    }

    // Verify OTP
    const isValidOTP = verifyOTP(otp, otpChallenge.codeHash)

    if (!isValidOTP) {
      // Increment attempts
      otpChallenge.attempts += 1
      await otpChallenge.save()

      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // OTP is valid, mark as verified
    otpChallenge.status = 'verified'
    await otpChallenge.save()

    // Find or create user
    let user = await User.findOne({ mobile: formattedMobile })

    if (!user) {
      // Create new user
      user = new User({
        mobile: formattedMobile,
        name: name || 'User',
        email: email || `${formattedMobile}@temp.com`, // Temporary email
        role: 'customer'
      })
      await user.save()
    } else {
      // Update last login
      user.updatedAt = new Date()
      await user.save()
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      mobile: formattedMobile,
      role: user.role
    })

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
