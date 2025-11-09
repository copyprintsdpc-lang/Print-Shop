import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { connectToDatabase } from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import mongoose from 'mongoose'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'

async function createOrderHandler(req: AuthenticatedRequest) {
  try {
    const body = await req.json()
    const { 
      customer, 
      delivery, 
      payment, 
      items, 
      artworkFiles, 
      notes, 
      pricing 
    } = body

    if (!customer || !items || !pricing) {
      return NextResponse.json(
        { ok: false, code: 'missing_fields', message: 'Required fields are missing' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Validate products exist
    const productIds = items.map((item: any) => item.productId)
    const products = await Product.find({ _id: { $in: productIds } })
    
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { ok: false, code: 'invalid_products', message: 'Some products not found' },
        { status: 400 }
      )
    }

    // Get user ID from authenticated request
    const userId = req.user?.userId
    if (!userId) {
      return NextResponse.json(
        { ok: false, code: 'unauthorized', message: 'User authentication required' },
        { status: 401 }
      )
    }

    // Create order in database first
    const order = new Order({
      customer,
      delivery,
      payment,
      items,
      artwork_files: artworkFiles || [],
      pricing,
      notes,
      userId: new mongoose.Types.ObjectId(userId),
      status: 'placed'
    })

    await order.save()

    // Create Razorpay order
    const result = await createRazorpayOrder({
      amount: Math.round(pricing.grandTotal * 100), // Convert to paise
      currency: pricing.currency || 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        customerEmail: customer.email,
        customerPhone: customer.phone
      }
    })

    if (result.success && result.order) {
      // Update order with Razorpay order ID
      order.payment.razorpayOrderId = result.order.id
      await order.save()

      return NextResponse.json({
        ok: true,
        order: {
          id: result.order.id,
          amount: result.order.amount,
          currency: result.order.currency,
          receipt: result.order.receipt
        },
        orderNumber: order.orderNumber,
        orderId: order._id
      })
    } else {
      // Delete the order if payment creation fails
      await Order.findByIdAndDelete(order._id)
      
      return NextResponse.json(
        { ok: false, code: 'payment_creation_failed', message: result.error || 'Unknown error creating payment order' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Payment order creation error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// Export the wrapped handler with authentication
export const POST = withAuth(createOrderHandler)