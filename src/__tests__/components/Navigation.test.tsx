import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import Navigation from '@/components/Navigation'

// Mock the Cart component
jest.mock('@/components/Cart', () => {
  return function MockCart({ isOpen, onClose, onCheckout }: any) {
    return isOpen ? (
      <div data-testid="cart-modal">
        <button onClick={onClose}>Close Cart</button>
        <button onClick={onCheckout}>Checkout</button>
      </div>
    ) : null
  }
})

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    logout: jest.fn(),
    isAuthenticated: false,
  }),
}))

// Mock the useCart hook
jest.mock('@/components/Cart', () => ({
  useCart: () => ({
    getItemCount: () => 0,
  }),
}))

describe('Navigation Component', () => {
  it('renders navigation links', () => {
    render(<Navigation />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Quote')).toBeInTheDocument()
    expect(screen.getByText('Order')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders contact information', () => {
    render(<Navigation />)
    
    expect(screen.getByText('+91 98765 43210')).toBeInTheDocument()
    expect(screen.getByText('info@sdpcprint.com')).toBeInTheDocument()
  })

  it('toggles mobile menu', () => {
    render(<Navigation />)
    
    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i })
    expect(mobileMenuButton).toBeInTheDocument()
    
    fireEvent.click(mobileMenuButton)
    
    // Check if mobile menu is open
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()
  })

  it('opens and closes cart', async () => {
    render(<Navigation />)
    
    const cartButton = screen.getByRole('button', { name: /cart/i })
    expect(cartButton).toBeInTheDocument()
    
    // Open cart
    fireEvent.click(cartButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('cart-modal')).toBeInTheDocument()
    })
    
    // Close cart
    const closeButton = screen.getByText('Close Cart')
    fireEvent.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByTestId('cart-modal')).not.toBeInTheDocument()
    })
  })

  it('shows login/signup buttons when not authenticated', () => {
    render(<Navigation />)
    
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })

  it('shows user menu when authenticated', () => {
    // Mock authenticated user
    jest.doMock('@/contexts/AuthContext', () => ({
      useAuth: () => ({
        user: { name: 'Test User', email: 'test@example.com' },
        logout: jest.fn(),
        isAuthenticated: true,
      }),
    }))

    render(<Navigation />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('handles dropdown menu interactions', () => {
    render(<Navigation />)
    
    const servicesButton = screen.getByText('Services')
    fireEvent.mouseEnter(servicesButton)
    
    // Check if dropdown appears
    expect(screen.getByText('Document Printing')).toBeInTheDocument()
    expect(screen.getByText('Business Cards')).toBeInTheDocument()
  })

  it('navigates to correct pages', () => {
    render(<Navigation />)
    
    const homeLink = screen.getByRole('link', { name: /home/i })
    expect(homeLink).toHaveAttribute('href', '/')
    
    const servicesLink = screen.getByRole('link', { name: /services/i })
    expect(servicesLink).toHaveAttribute('href', '/services')
  })

  it('displays cart item count', () => {
    // Mock cart with items
    jest.doMock('@/components/Cart', () => ({
      useCart: () => ({
        getItemCount: () => 3,
      }),
    }))

    render(<Navigation />)
    
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
