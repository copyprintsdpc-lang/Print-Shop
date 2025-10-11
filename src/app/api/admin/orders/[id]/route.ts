import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Order from '@/models/Order'
import { requireAdminAuth } from '@/lib/adminAuth'
import mongoose from 'mongoose'

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
  } catch (error) {
    console.error('Admin order GET error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

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
    const { status, trackingInfo, notes } = body

    await connectToDatabase()

    const order = await Order.findById(params.id)
    if (!order) {
      return NextResponse.json(
        { ok: false, code: 'not_found', message: 'Order not found' },
        { status: 404 }
      )
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { ok: false, code: 'bad_request', message: 'Invalid status' },
          { status: 400 }
        )
      }
    }

    // Update fields
    const updateData: any = { updatedAt: new Date() }
    if (status !== undefined) updateData.status = status
    if (trackingInfo !== undefined) updateData.trackingInfo = trackingInfo
    if (notes !== undefined) updateData.notes = notes

    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      ok: true,
      order: updatedOrder,
      message: 'Order updated successfully'
    })
  } catch (error) {
    console.error('Admin order PUT error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'orders.delete')
    if (error) return error

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Invalid order ID' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const order = await Order.findById(params.id)
    if (!order) {
      return NextResponse.json(
        { ok: false, code: 'not_found', message: 'Order not found' },
        { status: 404 }
      )
    }

    await Order.findByIdAndDelete(params.id)

    return NextResponse.json({
      ok: true,
      message: 'Order deleted successfully'
    })
  } catch (error) {
    console.error('Admin order DELETE error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}