import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock AuthProvider for testing
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockAuthValue = {
    user: null,
    loading: false,
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
    signup: jest.fn(),
    verifyEmail: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
  }

  return (
    <AuthProvider value={mockAuthValue}>
      {children}
    </AuthProvider>
  )
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <MockAuthProvider>{children}</MockAuthProvider>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock data factories
export const createMockUser = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  name: 'Test User',
  mobile: '+919876543210',
  role: 'customer',
  verified: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

export const createMockProduct = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439012',
  name: 'Test Business Card',
  slug: 'test-business-card',
  description: 'A test business card product',
  category: 'business-cards',
  images: ['https://example.com/image1.jpg'],
  basePrice: 100,
  pricingMethod: 'flat',
  sameDayEligible: true,
  sameDayCutoff: '12:00',
  variants: [
    {
      size: '3.5x2',
      material: 'Cardstock',
      finish: 'Matte',
      price: 100,
      sku: 'BC-001',
      inStock: true,
      name: 'Standard Matte',
    },
  ],
  options: [
    {
      name: 'Quantity',
      type: 'select',
      required: true,
      values: [
        { value: '100', label: '100 cards', priceDelta: 0, priceDeltaType: 'flat' },
        { value: '500', label: '500 cards', priceDelta: -20, priceDeltaType: 'percent' },
      ],
    },
  ],
  pricingTiers: [
    { minQty: 1, unitPrice: 100 },
    { minQty: 100, unitPrice: 80 },
    { minQty: 500, unitPrice: 60 },
  ],
  featured: false,
  active: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

export const createMockOrder = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439013',
  orderNumber: 'ORD-2024-001',
  userId: '507f1f77bcf86cd799439011',
  customer: {
    name: 'Test Customer',
    email: 'customer@example.com',
    phone: '+919876543210',
    company: 'Test Company',
  },
  status: 'placed',
  items: [
    {
      productId: '507f1f77bcf86cd799439012',
      productName: 'Test Business Card',
      variant: 'Standard Matte',
      quantity: 100,
      specifications: { quantity: '100', finish: 'Matte' },
      unitPrice: 80,
      totalPrice: 8000,
      files: [],
    },
  ],
  artwork_files: [],
  pricing: {
    subtotal: 8000,
    taxAmount: 1440,
    shippingAmount: 0,
    discountAmount: 0,
    grandTotal: 9440,
    currency: 'INR',
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
    status: 'pending',
    amount: 9440,
  },
  payment_status: 'pending',
  gst: {
    cgst: 720,
    sgst: 720,
    igst: 0,
    totalTax: 1440,
  },
  notes: 'Test order notes',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

// Mock API responses
export const mockApiResponse = (data: any, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(data),
})

// Mock fetch with default responses
export const mockFetch = (response: any, status = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve(mockApiResponse(response, status))
  ) as jest.Mock
}

// Reset mocks
export const resetMocks = () => {
  jest.clearAllMocks()
  global.fetch = jest.fn()
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
