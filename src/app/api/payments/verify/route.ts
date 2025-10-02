import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature, getPaymentDetails } from '@/lib/razorpay'
import { connectToDatabase } from '@/lib/db'
import Order from '@/models/Order'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderData 
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { ok: false, code: 'missing_fields', message: 'Payment verification fields are missing' },
        { status: 400 }
      )
    }

    // Verify payment signature
    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    })

    if (!isValid) {
      return NextResponse.json(
        { ok: false, code: 'invalid_signature', message: 'Payment verification failed' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Get payment details from Razorpay
    const paymentResult = await getPaymentDetails(razorpay_payment_id)

    if (!paymentResult.success) {
      return NextResponse.json(
        { ok: false, code: 'payment_fetch_failed', message: paymentResult.error },
        { status: 500 }
      )
    }

    // Find and update the order
    const order = await Order.findOne({ 
      'payment.razorpayOrderId': razorpay_order_id 
    })

    if (!order) {
      return NextResponse.json(
        { ok: false, code: 'order_not_found', message: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order with payment details
    order.payment.status = 'completed'
    order.payment.razorpayPaymentId = razorpay_payment_id
    order.payment_status = 'paid'
    order.status = 'preflight' // Move to next status after payment

    await order.save()

    // TODO: Send confirmation email
    // TODO: Update inventory if needed
    // TODO: Notify admin about new order

    return NextResponse.json({
      ok: true,
      payment: paymentResult.payment,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        customer: order.customer
      }
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}