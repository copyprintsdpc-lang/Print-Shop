import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import OtpChallenge from '@/models/OtpChallenge'
import User from '@/models/User'
import { generateOTP, hashOTP } from '@/lib/auth'
import { otpService, formatMobileNumber, validateMobileNumber } from '@/lib/otpService'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { mobile, channel = 'sms' } = await request.json()

    // Validate input
    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      )
    }

    // Format and validate mobile number
    let formattedMobile: string
    try {
      formattedMobile = formatMobileNumber(mobile)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 400 }
      )
    }

    if (!validateMobileNumber(formattedMobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number' },
        { status: 400 }
      )
    }

    // Check for rate limiting (max 3 OTPs per hour per mobile)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentOTPs = await OtpChallenge.countDocuments({
      mobile: formattedMobile,
      createdAt: { $gte: oneHourAgo }
    })

    if (recentOTPs >= 3) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Check for rate limiting by IP
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1'
    
    const recentIPOTPs = await OtpChallenge.countDocuments({
      ipAddress: clientIP,
      createdAt: { $gte: oneHourAgo }
    })

    if (recentIPOTPs >= 10) {
      return NextResponse.json(
        { error: 'Too many requests from this IP. Please try again later.' },
        { status: 429 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const hashedOTP = hashOTP(otp)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create OTP challenge
    const otpChallenge = new OtpChallenge({
      mobile: formattedMobile,
      channel,
      codeHash: hashedOTP,
      expiresAt,
      ipAddress: clientIP,
      userAgent: request.headers.get('user-agent') || 'Unknown'
    })

    await otpChallenge.save()

    // Send OTP via SMS or WhatsApp
    const message = `Your CopyPrint Shop OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`
    
    let sent = false
    if (channel === 'sms') {
      sent = await otpService.sendSMS(formattedMobile, message)
    } else if (channel === 'whatsapp') {
      sent = await otpService.sendWhatsApp(formattedMobile, message)
    }

    if (!sent) {
      // If sending failed, delete the OTP challenge
      await OtpChallenge.findByIdAndDelete(otpChallenge._id)
      return NextResponse.json(
        { error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      )
    }

    // In development, also log the OTP to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 OTP for ${formattedMobile}: ${otp}`)
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      mobile: formattedMobile,
      expiresIn: 600 // 10 minutes in seconds
    })

  } catch (error) {
    console.error('OTP request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
