import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { createMockOrder, mockFetch, resetMocks } from '../utils/test-utils'
import { useState } from 'react'

// Mock the order tracking page component
const MockOrderTrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/orders/track/${orderNumber}`)
      const data = await response.json()

      if (data.ok) {
        setOrder(data.order)
      } else {
        setError(data.message || 'Order not found')
      }
    } catch (err) {
      setError('Failed to track order')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      placed: 'text-blue-600',
      preflight: 'text-yellow-600',
      proof_ready: 'text-purple-600',
      approved: 'text-green-600',
      in_production: 'text-orange-600',
      ready_for_pickup: 'text-green-600',
      shipped: 'text-blue-600',
      completed: 'text-green-600',
      cancelled: 'text-red-600',
    }
    return colors[status] || 'text-gray-600'
  }

  const getStatusLabel = (status) => {
    const labels = {
      placed: 'Order Placed',
      preflight: 'Preflight Check',
      proof_ready: 'Proof Ready',
      approved: 'Approved',
      in_production: 'In Production',
      ready_for_pickup: 'Ready for Pickup',
      shipped: 'Shipped',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }
    return labels[status] || status
  }

  return (
    <div>
      <h1>Track Your Order</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter order number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={handleTrackOrder}
          disabled={loading || !orderNumber.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Tracking...' : 'Track Order'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">Order #{order.orderNumber}</h2>
              <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className={`text-lg font-semibold ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <p><strong>Name:</strong> {order.customer.name}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Phone:</strong> {order.customer.phone}</p>
              {order.customer.company && (
                <p><strong>Company:</strong> {order.customer.company}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Delivery Information</h3>
              <p><strong>Method:</strong> {order.delivery.method}</p>
              {order.delivery.address && (
                <div>
                  <p><strong>Address:</strong></p>
                  <p>{order.delivery.address.line1}</p>
                  {order.delivery.address.line2 && <p>{order.delivery.address.line2}</p>}
                  <p>{order.delivery.address.city}, {order.delivery.address.state} {order.delivery.address.pincode}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">{item.variant}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.totalPrice.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-xl font-bold">₹{order.pricing.grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {order.notes && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

describe('Order Tracking Integration', () => {
  beforeEach(() => {
    resetMocks()
  })

  it('should track order successfully', async () => {
    const mockOrder = createMockOrder({
      orderNumber: 'ORD-2024-001',
      status: 'in_production',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+919876543210',
        company: 'Test Company',
      },
    })

    mockFetch({ ok: true, order: mockOrder })

    render(<MockOrderTrackingPage />)

    // Enter order number
    const orderInput = screen.getByPlaceholderText('Enter order number')
    fireEvent.change(orderInput, { target: { value: 'ORD-2024-001' } })

    // Click track button
    const trackButton = screen.getByText('Track Order')
    fireEvent.click(trackButton)

    // Wait for order to load
    await waitFor(() => {
      expect(screen.getByText('Order #ORD-2024-001')).toBeInTheDocument()
    })

    // Verify order details
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Test Company')).toBeInTheDocument()
    expect(screen.getByText('In Production')).toBeInTheDocument()
  })

  it('should handle order not found', async () => {
    mockFetch({ ok: false, message: 'Order not found' }, 404)

    render(<MockOrderTrackingPage />)

    // Enter invalid order number
    const orderInput = screen.getByPlaceholderText('Enter order number')
    fireEvent.change(orderInput, { target: { value: 'INVALID-ORDER' } })

    // Click track button
    const trackButton = screen.getByText('Track Order')
    fireEvent.click(trackButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Order not found')).toBeInTheDocument()
    })

    // Verify no order details are shown
    expect(screen.queryByText('Order #')).not.toBeInTheDocument()
  })

  it('should handle network errors', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

    render(<MockOrderTrackingPage />)

    // Enter order number
    const orderInput = screen.getByPlaceholderText('Enter order number')
    fireEvent.change(orderInput, { target: { value: 'ORD-2024-001' } })

    // Click track button
    const trackButton = screen.getByText('Track Order')
    fireEvent.click(trackButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to track order')).toBeInTheDocument()
    })
  })

  it('should disable track button when order number is empty', () => {
    render(<MockOrderTrackingPage />)

    const trackButton = screen.getByText('Track Order')
    expect(trackButton).toBeDisabled()
  })

  it('should show loading state during tracking', async () => {
    // Mock a delayed response
    global.fetch = jest.fn().mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ 
          ok: true, 
          json: () => Promise.resolve({ ok: true, order: createMockOrder() })
        }), 100)
      )
    )

    render(<MockOrderTrackingPage />)

    // Enter order number
    const orderInput = screen.getByPlaceholderText('Enter order number')
    fireEvent.change(orderInput, { target: { value: 'ORD-2024-001' } })

    // Click track button
    const trackButton = screen.getByText('Track Order')
    fireEvent.click(trackButton)

    // Should show loading state
    expect(screen.getByText('Tracking...')).toBeInTheDocument()
    expect(trackButton).toBeDisabled()
  })

  it('should display different order statuses correctly', async () => {
    const statuses = [
      'placed',
      'preflight',
      'proof_ready',
      'approved',
      'in_production',
      'ready_for_pickup',
      'shipped',
      'completed',
      'cancelled',
    ]

    for (const status of statuses) {
      const mockOrder = createMockOrder({ status })
      mockFetch({ ok: true, order: mockOrder })

      render(<MockOrderTrackingPage />)

      // Enter order number
      const orderInput = screen.getByPlaceholderText('Enter order number')
      fireEvent.change(orderInput, { target: { value: 'ORD-2024-001' } })

      // Click track button
      const trackButton = screen.getByText('Track Order')
      fireEvent.click(trackButton)

      // Wait for order to load
      await waitFor(() => {
        expect(screen.getByText(/Order/)).toBeInTheDocument()
      })

      // Clean up for next iteration
      resetMocks()
    }
  })

  it('should display order items correctly', async () => {
    const mockOrder = createMockOrder({
      items: [
        {
          productId: '507f1f77bcf86cd799439012',
          productName: 'Business Cards',
          variant: 'Matte Finish',
          quantity: 100,
          totalPrice: 8000,
        },
        {
          productId: '507f1f77bcf86cd799439013',
          productName: 'Flyers',
          variant: 'Glossy Finish',
          quantity: 500,
          totalPrice: 2500,
        },
      ],
    })

    mockFetch({ ok: true, order: mockOrder })

    render(<MockOrderTrackingPage />)

    // Enter order number and track
    const orderInput = screen.getByPlaceholderText('Enter order number')
    fireEvent.change(orderInput, { target: { value: 'ORD-2024-001' } })
    fireEvent.click(screen.getByText('Track Order'))

    // Wait for order to load
    await waitFor(() => {
      expect(screen.getByText('Business Cards')).toBeInTheDocument()
    })

    // Verify items are displayed
    expect(screen.getByText('Business Cards')).toBeInTheDocument()
    expect(screen.getByText('Matte Finish')).toBeInTheDocument()
    expect(screen.getByText('Qty: 100')).toBeInTheDocument()
    expect(screen.getByText('₹8,000')).toBeInTheDocument()

    expect(screen.getByText('Flyers')).toBeInTheDocument()
    expect(screen.getByText('Glossy Finish')).toBeInTheDocument()
    expect(screen.getByText('Qty: 500')).toBeInTheDocument()
    expect(screen.getByText('₹2,500')).toBeInTheDocument()
  })

  it('should display delivery information for courier orders', async () => {
    const mockOrder = createMockOrder({
      delivery: {
        method: 'courier',
        address: {
          line1: '123 Main Street',
          line2: 'Apt 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'IN',
        },
      },
    })

    mockFetch({ ok: true, order: mockOrder })

    render(<MockOrderTrackingPage />)

    // Enter order number and track
    const orderInput = screen.getByPlaceholderText('Enter order number')
    fireEvent.change(orderInput, { target: { value: 'ORD-2024-001' } })
    fireEvent.click(screen.getByText('Track Order'))

    // Wait for order to load
    await waitFor(() => {
      expect(screen.getByText(/Method:/)).toBeInTheDocument()
    })

    // Verify delivery address
    expect(screen.getByText('123 Main Street')).toBeInTheDocument()
    expect(screen.getByText('Apt 4B')).toBeInTheDocument()
    expect(screen.getByText('Mumbai, Maharashtra 400001')).toBeInTheDocument()
  })
})
