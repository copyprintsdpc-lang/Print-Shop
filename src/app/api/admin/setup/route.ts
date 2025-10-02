import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Admin from '@/models/Admin'

export const runtime = 'nodejs'

// POST /api/admin/setup - Create initial admin user
export async function POST(req: NextRequest) {
  try {
    // Only allow in development or with special setup token
    const setupToken = req.headers.get('x-setup-token')
    const expectedToken = process.env.ADMIN_SETUP_TOKEN || 'setup123'
    
    if (process.env.NODE_ENV === 'production' && setupToken !== expectedToken) {
      return NextResponse.json(
        { ok: false, code: 'forbidden', message: 'Setup not allowed in production' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({})
    if (existingAdmin) {
      return NextResponse.json(
        { ok: false, code: 'conflict', message: 'Admin user already exists' },
        { status: 409 }
      )
    }

    // Create super admin
    const admin = await Admin.create({
      email: email.toLowerCase(),
      passwordHash: password, // Will be hashed by pre-save hook
      name,
      role: 'super_admin',
      permissions: [
        'products.create',
        'products.read',
        'products.update',
        'products.delete',
        'orders.read',
        'orders.update',
        'promotions.create',
        'promotions.read',
        'promotions.update',
        'promotions.delete',
        'users.read',
        'analytics.read',
        'settings.update'
      ],
      isActive: true
    })

    return NextResponse.json({
      ok: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      message: 'Admin user created successfully'
    })
  } catch (err) {
    console.error('Admin setup error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// GET /api/admin/setup - Check if setup is needed
export async function GET() {
  try {
    await connectToDatabase()
    
    const adminCount = await Admin.countDocuments()
    
    return NextResponse.json({
      ok: true,
      setupNeeded: adminCount === 0,
      adminCount
    })
  } catch (err) {
    console.error('Admin setup check error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

