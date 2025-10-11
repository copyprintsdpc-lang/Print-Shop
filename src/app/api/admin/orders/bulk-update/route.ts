import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Order from '@/models/Order'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function PUT(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'orders.update')
    if (error) return error

    const body = await req.json()
    const { orderIds, status } = body

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Order IDs are required' },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Invalid status' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Update all orders
    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({
      ok: true,
      message: `Updated ${result.modifiedCount} orders successfully`,
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Admin orders bulk update error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
