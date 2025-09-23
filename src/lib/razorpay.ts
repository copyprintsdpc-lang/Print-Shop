// Razorpay payment integration
// Handles payment processing, order creation, and verification

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
  created_at: number
}

export interface RazorpayPayment {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export interface PaymentOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  theme?: {
    color: string
  }
  handler: (response: RazorpayPayment) => void
  modal?: {
    ondismiss: () => void
  }
}

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// Create Razorpay order
export const createRazorpayOrder = async (orderData: {
  amount: number
  currency: string
  receipt: string
  notes?: Record<string, string>
}): Promise<RazorpayOrder> => {
  const response = await fetch('/api/razorpay/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    throw new Error('Failed to create Razorpay order')
  }

  const data = await response.json()
  return data.order
}

// Verify Razorpay payment
export const verifyRazorpayPayment = async (paymentData: RazorpayPayment): Promise<boolean> => {
  const response = await fetch('/api/razorpay/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  })

  if (!response.ok) {
    return false
  }

  const data = await response.json()
  return data.success
}

// Open Razorpay checkout
export const openRazorpayCheckout = async (options: Omit<PaymentOptions, 'key'>): Promise<void> => {
  const scriptLoaded = await loadRazorpayScript()
  
  if (!scriptLoaded) {
    throw new Error('Failed to load Razorpay script')
  }

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY
  if (!razorpayKey) {
    throw new Error('Razorpay key not configured')
  }

  const razorpayOptions: PaymentOptions = {
    key: razorpayKey,
    ...options,
    theme: {
      color: '#F16E02',
      ...options.theme
    }
  }

  const razorpay = new window.Razorpay(razorpayOptions)
  razorpay.open()
}

// Format amount for Razorpay (convert to paise)
export const formatAmount = (amount: number): number => {
  return Math.round(amount * 100)
}

// Format amount for display (convert from paise)
export const formatDisplayAmount = (amount: number): number => {
  return amount / 100
}

// Generate receipt ID
export const generateReceiptId = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 5)
  return `rcpt_${timestamp}_${random}`
}

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  CAPTURED: 'captured',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const

// Payment method constants
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NETBANKING: 'netbanking',
  WALLET: 'wallet',
  EMI: 'emi',
  COD: 'cod'
} as const

export default {
  loadRazorpayScript,
  createRazorpayOrder,
  verifyRazorpayPayment,
  openRazorpayCheckout,
  formatAmount,
  formatDisplayAmount,
  generateReceiptId,
  PAYMENT_STATUS,
  ORDER_STATUS,
  PAYMENT_METHODS
}