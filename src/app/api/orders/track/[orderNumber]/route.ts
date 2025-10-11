import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Order from '@/models/Order'

export async function GET(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params

    if (!orderNumber) {
      return NextResponse.json(
        { ok: false, code: 'missing_order_number', message: 'Order number is required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Find order by order number
    const order = await Order.findOne({ orderNumber })
      .populate('items.productId', 'name images')
      .lean()

    if (!order) {
      return NextResponse.json(
        { ok: false, code: 'order_not_found', message: 'Order not found' },
        { status: 404 }
      )
    }

    // Return order details (excluding sensitive information)
    const o = order as any
    return NextResponse.json({
      ok: true,
      order: {
        _id: String(o._id),
        orderNumber: o.orderNumber,
        status: o.status,
        customer: o.customer,
        items: o.items,
        pricing: o.pricing,
        delivery: o.delivery,
        artwork_files: o.artwork_files,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        estimatedCompletion: o.estimatedCompletion,
        actualCompletion: o.actualCompletion,
        notes: o.notes
      }
    })
  } catch (error) {
    console.error('Order tracking error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}