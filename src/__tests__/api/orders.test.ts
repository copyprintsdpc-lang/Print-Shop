import { NextRequest } from 'next/server'
import { POST as createOrderHandler } from '@/app/api/payments/create-order/route'
import { GET as getMyOrdersHandler } from '@/app/api/orders/my-orders/route'
import { GET as trackOrderHandler } from '@/app/api/orders/track/[orderNumber]/route'
import { createMockOrder, createMockProduct, resetMocks } from '../utils/test-utils'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  connectToDatabase: jest.fn(),
}))

jest.mock('@/lib/middleware', () => ({
  withAuth: (handler: any) => handler,
}))

jest.mock('@/lib/razorpay', () => ({
  createRazorpayOrder: jest.fn(() => ({
    id: 'order_test123',
    amount: 9440,
    currency: 'INR',
  })),
}))

jest.mock('@/models/Order', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
}))

jest.mock('@/models/Product', () => ({
  find: jest.fn(),
}))

jest.mock('mongoose', () => ({
  Types: {
    ObjectId: jest.fn((id) => id),
  },
}))

describe('/api/payments/create-order', () => {
  beforeEach(() => {
    resetMocks()
  })

  it('should create order with valid data', async () => {
    const mockProduct = createMockProduct()
    const mockOrder = createMockOrder()
    const Product = require('@/models/Product')
    const Order = require('@/models/Order')

    Product.find.mockResolvedValue([mockProduct])
    Order.create.mockResolvedValue(mockOrder)

    const orderData = {
      customer: {
        name: 'Test Customer',
        email: 'customer@example.com',
        phone: '+919876543210',
      },
      delivery: {
        method: 'pickup',
        address: {
          line1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456',
          country: 'IN',
        },
      },
      payment: {
        method: 'razorpay',
      },
      items: [
        {
          productId: '507f1f77bcf86cd799439012',
          quantity: 100,
          specifications: { finish: 'Matte' },
        },
      ],
      artworkFiles: [],
      pricing: {
        subtotal: 8000,
        taxAmount: 1440,
        shippingAmount: 0,
        discountAmount: 0,
        grandTotal: 9440,
        currency: 'INR',
      },
      notes: 'Test order',
    }

    const request = new NextRequest('http://localhost:3000/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })

    // Mock authenticated user
    request.user = { userId: '507f1f77bcf86cd799439011' }

    const response = await createOrderHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.order).toBeDefined()
    expect(data.razorpayOrder).toBeDefined()
  })

  it('should reject order with missing required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({
        customer: { name: 'Test' },
        // Missing items and pricing
      }),
    })

    request.user = { userId: '507f1f77bcf86cd799439011' }

    const response = await createOrderHandler(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('missing_fields')
  })

  it('should reject order with invalid products', async () => {
    const Product = require('@/models/Product')
    Product.find.mockResolvedValue([]) // No products found

    const orderData = {
      customer: { name: 'Test', email: 'test@example.com', phone: '+919876543210' },
      items: [{ productId: 'invalid-id', quantity: 1, specifications: {} }],
      pricing: { subtotal: 100, taxAmount: 18, shippingAmount: 0, discountAmount: 0, grandTotal: 118, currency: 'INR' },
    }

    const request = new NextRequest('http://localhost:3000/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })

    request.user = { userId: '507f1f77bcf86cd799439011' }

    const response = await createOrderHandler(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('invalid_products')
  })

  it('should require authentication', async () => {
    const request = new NextRequest('http://localhost:3000/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({
        customer: { name: 'Test', email: 'test@example.com', phone: '+919876543210' },
        items: [{ productId: '507f1f77bcf86cd799439012', quantity: 1, specifications: {} }],
        pricing: { subtotal: 100, taxAmount: 18, shippingAmount: 0, discountAmount: 0, grandTotal: 118, currency: 'INR' },
      }),
    })

    // No user attached to request

    const response = await createOrderHandler(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('unauthorized')
  })
})

describe('/api/orders/my-orders', () => {
  beforeEach(() => {
    resetMocks()
  })

  it('should return user orders', async () => {
    const mockOrders = [createMockOrder(), createMockOrder({ orderNumber: 'ORD-2024-002' })]
    const Order = require('@/models/Order')

    Order.find.mockResolvedValue(mockOrders)

    const request = new NextRequest('http://localhost:3000/api/orders/my-orders')
    request.user = { userId: '507f1f77bcf86cd799439011' }

    const response = await getMyOrdersHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.orders).toHaveLength(2)
  })

  it('should filter orders by status', async () => {
    const mockOrders = [createMockOrder({ status: 'completed' })]
    const Order = require('@/models/Order')

    Order.find.mockResolvedValue(mockOrders)

    const request = new NextRequest('http://localhost:3000/api/orders/my-orders?status=completed')
    request.user = { userId: '507f1f77bcf86cd799439011' }

    const response = await getMyOrdersHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.orders).toHaveLength(1)
  })

  it('should require authentication', async () => {
    const request = new NextRequest('http://localhost:3000/api/orders/my-orders')

    const response = await getMyOrdersHandler(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('unauthorized')
  })
})

describe('/api/orders/track/[orderNumber]', () => {
  beforeEach(() => {
    resetMocks()
  })

  it('should return order tracking information', async () => {
    const mockOrder = createMockOrder()
    const Order = require('@/models/Order')

    Order.findOne.mockResolvedValue(mockOrder)

    const request = new NextRequest('http://localhost:3000/api/orders/track/ORD-2024-001')
    const response = await trackOrderHandler(request, { params: { orderNumber: 'ORD-2024-001' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.order.orderNumber).toBe('ORD-2024-001')
  })

  it('should return 404 for non-existent order', async () => {
    const Order = require('@/models/Order')
    Order.findOne.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/orders/track/NON-EXISTENT')
    const response = await trackOrderHandler(request, { params: { orderNumber: 'NON-EXISTENT' } })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('not_found')
  })
})
