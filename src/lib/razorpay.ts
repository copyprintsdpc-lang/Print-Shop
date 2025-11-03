import Razorpay from 'razorpay'

// Initialize Razorpay instance lazily
let razorpayInstance: Razorpay | null = null

function getRazorpayInstance(): Razorpay {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    
    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.')
    }
    
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  }
  
  return razorpayInstance
}

// Interface for order creation
export interface CreateOrderData {
  amount: number
  currency?: string
  receipt: string
  notes?: Record<string, any>
}

// Interface for payment verification
export interface PaymentVerificationData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

// Create Razorpay order
export async function createRazorpayOrder(data: CreateOrderData) {
  try {
    const razorpay = getRazorpayInstance()
    const options = {
      amount: Math.round(data.amount * 100), // Convert to paise
      currency: data.currency || 'INR',
      receipt: data.receipt,
      notes: data.notes || {}
    }

    const order = await razorpay.orders.create(options)
    return {
      success: true,
      order
    }
  } catch (error) {
    console.error('Razorpay order creation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order'
    }
  }
}

// Verify payment signature
export function verifyPaymentSignature(data: PaymentVerificationData): boolean {
  try {
    const crypto = require('crypto')
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    hmac.update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
    const generatedSignature = hmac.digest('hex')
    
    return generatedSignature === data.razorpay_signature
  } catch (error) {
    console.error('Payment verification error:', error)
    return false
  }
}

// Fetch payment details
export async function getPaymentDetails(paymentId: string) {
  try {
    const razorpay = getRazorpayInstance()
    const payment = await razorpay.payments.fetch(paymentId)
    return {
      success: true,
      payment
    }
  } catch (error) {
    console.error('Razorpay payment fetch error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch payment'
    }
  }
}

// Refund payment
export async function refundPayment(paymentId: string, amount?: number, notes?: string) {
  try {
    const razorpay = getRazorpayInstance()
    const refundData: any = {
      payment_id: paymentId
    }
    
    if (amount) refundData.amount = Math.round(amount * 100)
    if (notes) refundData.notes = { reason: notes }

    const refund = await razorpay.payments.refund(paymentId, refundData)
    return {
      success: true,
      refund
    }
  } catch (error) {
    console.error('Razorpay refund error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process refund'
    }
  }
}

// Get order details
export async function getOrderDetails(orderId: string) {
  try {
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.fetch(orderId)
    return {
      success: true,
      order
    }
  } catch (error) {
    console.error('Razorpay order fetch error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch order'
    }
  }
}

