import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import Cart from '@/components/Cart'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Cart Component', () => {
  const mockOnClose = jest.fn()
  const mockOnCheckout = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('renders cart when open', () => {
    render(<Cart isOpen={true} onClose={mockOnClose} onCheckout={mockOnCheckout} />)
    
    expect(screen.getByText(/Shopping Cart/)).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<Cart isOpen={false} onClose={mockOnClose} onCheckout={mockOnCheckout} />)
    
    expect(screen.queryByText('Shopping Cart')).not.toBeInTheDocument()
  })

  it('displays empty cart message when no items', () => {
    render(<Cart isOpen={true} onClose={mockOnClose} onCheckout={mockOnCheckout} />)
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(screen.getByText('Add some products to get started')).toBeInTheDocument()
  })

  it('loads items from localStorage on mount', () => {
    const mockCartItems = [
      {
        id: '1',
        productId: '507f1f77bcf86cd799439012',
        productName: 'Test Product',
        variant: 'Standard',
        price: 100,
        quantity: 2,
        image: 'test-image.jpg',
      },
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems))
    
    render(<Cart isOpen={true} onClose={mockOnClose} onCheckout={mockOnCheckout} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('₹100.00')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('displays cart items correctly', () => {
    const mockCartItems = [
      {
        id: '1',
        productId: '507f1f77bcf86cd799439012',
        productName: 'Test Product',
        variant: 'Standard',
        price: 100,
        quantity: 2,
        image: 'test-image.jpg',
      },
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems))
    
    render(<Cart isOpen={true} onClose={mockOnClose} onCheckout={mockOnCheckout} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('₹100.00')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('clears cart when clear button is clicked', async () => {
    const mockCartItems = [
      {
        id: '1',
        productId: '507f1f77bcf86cd799439012',
        productName: 'Test Product',
        variant: 'Standard',
        price: 100,
        quantity: 1,
        image: 'test-image.jpg',
      },
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems))
    
    render(<Cart isOpen={true} onClose={mockOnClose} onCheckout={mockOnCheckout} />)
    
    const clearButton = screen.getByText('Clear Cart')
    fireEvent.click(clearButton)
    
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    })
  })

  it('calculates subtotal correctly', () => {
    const mockCartItems = [
      {
        id: '1',
        productId: '507f1f77bcf86cd799439012',
        productName: 'Product 1',
        variant: 'Standard',
        price: 100,
        quantity: 2,
        image: 'test-image.jpg',
      },
      {
        id: '2',
        productId: '507f1f77bcf86cd799439013',
        productName: 'Product 2',
        variant: 'Premium',
        price: 50,
        quantity: 3,
        image: 'test-image2.jpg',
      },
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems))
    
    render(<Cart isOpen={true} onClose={mockOnClose} onCheckout={mockOnCheckout} />)
    
    // Subtotal: (100 * 2) + (50 * 3) = 200 + 150 = 350
    expect(screen.getByText('₹350.00')).toBeInTheDocument()
  })

  it('calculates tax correctly (18% GST)', () => {
    const mockCartItems = [
      {
        id: '1',
        productId: '507f1f77bcf86cd799439012',
        productName: 'Test Product',
        variant: 'Standard',
        price: 100,
        quantity: 1,
        image: 'test-image.jpg',
      },
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems))
    
    render(<Cart isOpen={true} onClose={mockOnClose} onCheckout={mockOnCheckout} />)
    
    // Tax: 100 * 0.18 = 18
    expect(screen.getByText('₹18.00')).toBeInTheDocument()
  })

  it('calculates shipping correctly', () => {
    const mockCartItems = [
      {
        id: '1',
        productId: '507f1f77bcf86cd799439012',
        productName: 'Test Product',
        variant: 'Standard',
        price: 500, // Below 1000 threshold
        quantity: 1,
        image: 'test-image.jpg',
      },
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems))
    
    render(<Cart isOpen={true} onClose={mockOnClose} onCheckout={mockOnCheckout} />)
    
    // Shipping: 50 (below 1000 threshold)
    expect(screen.getByText('₹50.00')).toBeInTheDocument()
  })

  it('shows free shipping for orders over 1000', () => {
    const mockCartItems = [
      {
        id: '1',
        productId: '507f1f77bcf86cd799439012',
        productName: 'Test Product',
        variant: 'Standard',
        price: 1200, // Above 1000 threshold
        quantity: 1,
        image: 'test-image.jpg',
      },
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems))
    
    render(<Cart isOpen={true} onClose={mockOnClose} onCheckout={mockOnCheckout} />)
    
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('calls onCheckout when checkout button is clicked', () => {
    const mockCartItems = [
      {
        id: '1',
        productId: '507f1f77bcf86cd799439012',
        productName: 'Test Product',
        variant: 'Standard',
        price: 100,
        quantity: 1,
        image: 'test-image.jpg',
      },
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems))
    
    render(<Cart isOpen={true} onClose={mockOnClose} onCheckout={mockOnCheckout} />)
    
    const checkoutButton = screen.getByText('Proceed to Checkout')
    fireEvent.click(checkoutButton)
    
    expect(mockOnCheckout).toHaveBeenCalled()
  })

  it('calls onClose when close button is clicked', () => {
    render(<Cart isOpen={true} onClose={mockOnClose} onCheckout={mockOnCheckout} />)
    
    // Find the X button (close button) - it's the first button in the header
    const buttons = screen.getAllByRole('button')
    const closeButton = buttons[0] // The X button is the first button
    
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalled()
  })
})
