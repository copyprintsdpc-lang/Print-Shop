import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Order from '@/models/Order'
import { verifyJwt } from '@/lib/auth'

export const runtime = 'nodejs'

// GET /api/orders/my-orders - Get customer's orders
export async function GET(req: NextRequest) {
  try {
    // Verify user authentication
    const token = req.cookies.get('sdp_session')?.value
    if (!token) {
      return NextResponse.json(
        { ok: false, code: 'unauthorized', message: 'Authentication required' },
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

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    await connectToDatabase()

    // Build query
    const query: any = { userId: payload.sub }
    if (status) query.status = status

    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('items.productId', 'name slug images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ])

    return NextResponse.json({
      ok: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    console.error('My orders GET error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

