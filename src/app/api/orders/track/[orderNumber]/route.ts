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
    return NextResponse.json({
      ok: true,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        customer: order.customer,
        items: order.items,
        pricing: order.pricing,
        delivery: order.delivery,
        artwork_files: order.artwork_files,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        estimatedCompletion: order.estimatedCompletion,
        actualCompletion: order.actualCompletion,
        notes: order.notes
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