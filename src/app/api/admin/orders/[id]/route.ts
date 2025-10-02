import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Order from '@/models/Order'
import { requireAdminAuth } from '@/lib/adminAuth'
import mongoose from 'mongoose'

export const runtime = 'nodejs'

// GET /api/admin/orders/[id] - Get single order with full details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'orders.read')
    if (error) return error

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Invalid order ID' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const order = await Order.findById(params.id)
      .populate('userId', 'name email mobile businessProfile')
      .populate('items.productId', 'name slug images variants')
      .lean()
    
    if (!order) {
      return NextResponse.json(
        { ok: false, code: 'not_found', message: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ok: true,
      order
    })
  } catch (err) {
    console.error('Admin order GET error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/orders/[id] - Update order status and details
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'orders.update')
    if (error) return error

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Invalid order ID' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const {
      status,
      estimatedCompletion,
      actualCompletion,
      notes,
      courierDetails,
      trackingNumber,
      carrier
    } = body

    await connectToDatabase()

    const order = await Order.findById(params.id)
    if (!order) {
      return NextResponse.json(
        { ok: false, code: 'not_found', message: 'Order not found' },
        { status: 404 }
      )
    }

    // Update fields
    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (estimatedCompletion !== undefined) updateData.estimatedCompletion = new Date(estimatedCompletion)
    if (actualCompletion !== undefined) updateData.actualCompletion = new Date(actualCompletion)
    if (notes !== undefined) updateData.notes = notes

    // Update courier details
    if (courierDetails || trackingNumber || carrier) {
      if (!order.delivery.courierDetails) {
        order.delivery.courierDetails = {}
      }
      if (trackingNumber !== undefined) order.delivery.courierDetails.trackingNumber = trackingNumber
      if (carrier !== undefined) order.delivery.courierDetails.carrier = carrier
      if (courierDetails) {
        Object.assign(order.delivery.courierDetails, courierDetails)
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('userId', 'name email mobile')
    .populate('items.productId', 'name slug images')

    return NextResponse.json({
      ok: true,
      order: updatedOrder,
      message: 'Order updated successfully'
    })
  } catch (err) {
    console.error('Admin order PUT error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

