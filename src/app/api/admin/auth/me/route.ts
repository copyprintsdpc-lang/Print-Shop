import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Admin from '@/models/Admin'
import { verifyJwt } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('sdp_session')?.value
    
    if (!token) {
      return NextResponse.json(
        { ok: false, code: 'unauthorized', message: 'No authentication token' },
        { status: 401 }
      )
    }

    const payload = verifyJwt(token)
    if (!payload) {
      return NextResponse.json(
        { ok: false, code: 'invalid_token', message: 'Invalid token' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const admin = await Admin.findById(payload.sub)
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { ok: false, code: 'admin_not_found', message: 'Admin not found or inactive' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ok: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
      }
    })
  } catch (err) {
    console.error('Admin me error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

