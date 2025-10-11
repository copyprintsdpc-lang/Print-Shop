import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAdminAuth } from '@/lib/adminAuth'

// This is a simple in-memory settings store
// In production, you'd want to store this in a database
let settingsStore: any = {
  general: {
    siteName: 'Sri Datta Print Center',
    siteDescription: 'Professional Print Shop Services',
    siteUrl: 'http://localhost:3000',
    adminEmail: 'admin@sdpcprint.com',
    timezone: 'Asia/Kolkata',
    currency: 'INR'
  },
  email: {
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    fromEmail: '',
    fromName: 'Sri Datta Print Center'
  },
  payment: {
    razorpayKeyId: '',
    razorpayKeySecret: '',
    testMode: true
  },
  notifications: {
    orderNotifications: true,
    customerNotifications: true,
    adminNotifications: true,
    emailNotifications: true
  },
  security: {
    sessionTimeout: 24,
    requireEmailVerification: true,
    allowRegistration: true,
    maxLoginAttempts: 5
  }
}

export async function GET(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'settings.update')
    if (error) return error

    return NextResponse.json({
      ok: true,
      settings: settingsStore
    })
  } catch (error) {
    console.error('Admin settings GET error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'settings.update')
    if (error) return error

    const body = await req.json()
    const { section, data } = body

    if (!section || !data) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Section and data are required' },
        { status: 400 }
      )
    }

    // Validate section
    const validSections = ['general', 'email', 'payment', 'notifications', 'security']
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Invalid section' },
        { status: 400 }
      )
    }

    // Update the specific section
    settingsStore[section] = { ...settingsStore[section], ...data }

    // In production, you would save this to a database here
    // await SettingsModel.findOneAndUpdate(
    //   { section },
    //   { section, data: settingsStore[section] },
    //   { upsert: true }
    // )

    return NextResponse.json({
      ok: true,
      message: 'Settings updated successfully',
      settings: settingsStore
    })
  } catch (error) {
    console.error('Admin settings PUT error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
