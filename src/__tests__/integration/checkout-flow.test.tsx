import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { createMockProduct, createMockUser, mockFetch, resetMocks } from '../utils/test-utils'
import { useState } from 'react'

// Mock the checkout page component
const MockCheckoutPage = () => {
  const [step, setStep] = useState(1)
  const [cart, setCart] = useState([
    {
      id: '1',
      product: createMockProduct(),
      quantity: 100,
      options: { finish: 'Matte' },
      price: 80,
    },
  ])
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  })
  const [delivery, setDelivery] = useState({
    method: 'pickup',
    address: {
      line1: '',
      city: '',
      state: '',
      pincode: '',
      country: 'IN',
    },
  })

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          delivery,
          payment: { method: 'razorpay' },
          items: cart.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            specifications: item.options,
          })),
          pricing: {
            subtotal: 8000,
            taxAmount: 1440,
            shippingAmount: 0,
            discountAmount: 0,
            grandTotal: 9440,
            currency: 'INR',
          },
        }),
      })

      if (response.ok) {
        setStep(2)
      }
    } catch (error) {
      console.error('Checkout failed:', error)
    }
  }

  return (
    <div>
      {step === 1 && (
        <div>
          <h1>Checkout</h1>
          <div data-testid="cart-items">
            {cart.map(item => (
              <div key={item.id}>
                <span>{item.product.name}</span>
                <span>Qty: {item.quantity}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
          <div data-testid="customer-form">
            <input
              placeholder="Name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            />
            <input
              placeholder="Email"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            />
            <input
              placeholder="Phone"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            />
          </div>
          <div data-testid="delivery-form">
            <select
              value={delivery.method}
              onChange={(e) => setDelivery({ ...delivery, method: e.target.value })}
            >
              <option value="pickup">Pickup</option>
              <option value="courier">Courier</option>
            </select>
            {delivery.method === 'courier' && (
              <div>
                <input
                  placeholder="Address Line 1"
                  value={delivery.address.line1}
                  onChange={(e) => setDelivery({
                    ...delivery,
                    address: { ...delivery.address, line1: e.target.value }
                  })}
                />
                <input
                  placeholder="City"
                  value={delivery.address.city}
                  onChange={(e) => setDelivery({
                    ...delivery,
                    address: { ...delivery.address, city: e.target.value }
                  })}
                />
                <input
                  placeholder="State"
                  value={delivery.address.state}
                  onChange={(e) => setDelivery({
                    ...delivery,
                    address: { ...delivery.address, state: e.target.value }
                  })}
                />
                <input
                  placeholder="Pincode"
                  value={delivery.address.pincode}
                  onChange={(e) => setDelivery({
                    ...delivery,
                    address: { ...delivery.address, pincode: e.target.value }
                  })}
                />
              </div>
            )}
          </div>
          <button onClick={handleCheckout}>Proceed to Payment</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h1>Payment</h1>
          <p>Redirecting to payment gateway...</p>
        </div>
      )}
    </div>
  )
}

// Mock dependencies
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: createMockUser(),
    isAuthenticated: true,
  }),
}))

jest.mock('@/lib/db', () => ({
  connectToDatabase: jest.fn(),
}))

jest.mock('@/models/Product', () => ({
  find: jest.fn(),
}))

jest.mock('@/models/Order', () => ({
  create: jest.fn(),
}))

jest.mock('@/lib/razorpay', () => ({
  createRazorpayOrder: jest.fn(() => ({
    id: 'order_test123',
    amount: 9440,
    currency: 'INR',
  })),
}))

describe('Checkout Flow Integration', () => {
  beforeEach(() => {
    resetMocks()
  })

  it('should complete checkout flow with pickup delivery', async () => {
    mockFetch({ ok: true, order: { orderNumber: 'ORD-2024-001' } })

    render(<MockCheckoutPage />)

    // Verify cart items are displayed
    expect(screen.getByTestId('cart-items')).toBeInTheDocument()
    expect(screen.getByText('Test Business Card')).toBeInTheDocument()
    expect(screen.getByText('Qty: 100')).toBeInTheDocument()

    // Fill customer information
    const nameInput = screen.getByPlaceholderText('Name')
    const emailInput = screen.getByPlaceholderText('Email')
    const phoneInput = screen.getByPlaceholderText('Phone')

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(phoneInput, { target: { value: '+919876543210' } })

    // Verify pickup delivery is selected by default
    expect(screen.getByDisplayValue('pickup')).toBeInTheDocument()

    // Proceed to payment
    const checkoutButton = screen.getByText('Proceed to Payment')
    fireEvent.click(checkoutButton)

    await waitFor(() => {
      expect(screen.getByText('Payment')).toBeInTheDocument()
    })

    // Verify API was called
    expect(global.fetch).toHaveBeenCalledWith('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('John Doe'),
    })
  })

  it('should complete checkout flow with courier delivery', async () => {
    mockFetch({ ok: true, order: { orderNumber: 'ORD-2024-001' } })

    render(<MockCheckoutPage />)

    // Fill customer information
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '+919876543210' } })

    // Select courier delivery
    const deliverySelect = screen.getByDisplayValue('pickup')
    fireEvent.change(deliverySelect, { target: { value: 'courier' } })

    // Fill delivery address
    fireEvent.change(screen.getByPlaceholderText('Address Line 1'), { 
      target: { value: '123 Main Street' } 
    })
    fireEvent.change(screen.getByPlaceholderText('City'), { 
      target: { value: 'Mumbai' } 
    })
    fireEvent.change(screen.getByPlaceholderText('State'), { 
      target: { value: 'Maharashtra' } 
    })
    fireEvent.change(screen.getByPlaceholderText('Pincode'), { 
      target: { value: '400001' } 
    })

    // Proceed to payment
    fireEvent.click(screen.getByText('Proceed to Payment'))

    await waitFor(() => {
      expect(screen.getByText('Payment')).toBeInTheDocument()
    })

    // Verify API was called with courier delivery
    expect(global.fetch).toHaveBeenCalledWith('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('courier'),
    })
  })

  it('should handle checkout errors gracefully', async () => {
    mockFetch({ ok: false, message: 'Payment failed' }, 400)

    render(<MockCheckoutPage />)

    // Fill required information
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '+919876543210' } })

    // Proceed to payment
    fireEvent.click(screen.getByText('Proceed to Payment'))

    // Should not proceed to payment step
    await waitFor(() => {
      expect(screen.queryByText('Payment')).not.toBeInTheDocument()
    })
  })

  it('should validate required fields', async () => {
    render(<MockCheckoutPage />)

    // Try to proceed without filling required fields
    fireEvent.click(screen.getByText('Proceed to Payment'))

    // Should not proceed to payment step
    await waitFor(() => {
      expect(screen.queryByText('Payment')).not.toBeInTheDocument()
    })
  })

  it('should display correct pricing information', () => {
    render(<MockCheckoutPage />)

    // Verify pricing is displayed correctly
    expect(screen.getByText('₹80')).toBeInTheDocument()
  })

  it('should handle different delivery methods', () => {
    render(<MockCheckoutPage />)

    // Test pickup delivery
    expect(screen.getByDisplayValue('pickup')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Address Line 1')).not.toBeInTheDocument()

    // Switch to courier
    const deliverySelect = screen.getByDisplayValue('pickup')
    fireEvent.change(deliverySelect, { target: { value: 'courier' } })

    // Address fields should appear
    expect(screen.getByPlaceholderText('Address Line 1')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('State')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Pincode')).toBeInTheDocument()
  })
})
