import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import PricingCalculator from '@/components/PricingCalculator'
import { createMockProduct } from '../utils/test-utils'

// Mock the calculatePrice function
jest.mock('@/lib/products', () => ({
  calculatePrice: jest.fn((product, quantity, options) => {
    const basePrice = product.basePrice
    const qty = quantity || 1
    return basePrice * qty
  }),
}))

describe('PricingCalculator Component', () => {
  const mockProduct = createMockProduct({
    name: 'Test Business Card',
    basePrice: 100,
    sameDayEligible: true,
    sameDayCutoff: '12:00',
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
      {
        name: 'Finish',
        type: 'select',
        required: false,
        values: [
          { value: 'matte', label: 'Matte', priceDelta: 0, priceDeltaType: 'flat' },
          { value: 'glossy', label: 'Glossy', priceDelta: 10, priceDeltaType: 'flat' },
        ],
      },
    ],
  })

  const mockOnPriceChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders product information', () => {
    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    expect(screen.getByText('Test Business Card')).toBeInTheDocument()
    expect(screen.getByText('₹100.00')).toBeInTheDocument()
  })

  it('displays quantity selector', () => {
    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    const quantityInput = screen.getByDisplayValue('1')
    expect(quantityInput).toBeInTheDocument()
  })

  it('updates quantity when changed', async () => {
    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    const quantityInput = screen.getByDisplayValue('1')
    fireEvent.change(quantityInput, { target: { value: '5' } })

    await waitFor(() => {
      expect(mockOnPriceChange).toHaveBeenCalledWith(500, expect.any(Object))
    })
  })

  it('displays product options', () => {
    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    expect(screen.getByText('Quantity')).toBeInTheDocument()
    expect(screen.getByText('Finish')).toBeInTheDocument()
  })

  it('handles option selection', async () => {
    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    const finishSelect = screen.getByDisplayValue('Matte')
    fireEvent.change(finishSelect, { target: { value: 'glossy' } })

    await waitFor(() => {
      expect(mockOnPriceChange).toHaveBeenCalledWith(100, expect.objectContaining({
        Finish: 'glossy',
      }))
    })
  })

  it('shows delivery time for same-day eligible products', () => {
    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    expect(screen.getByText('Same Day')).toBeInTheDocument()
  })

  it('shows next day delivery when past cutoff time', () => {
    // Mock current time to be after cutoff
    const mockDate = new Date('2024-01-01T15:00:00') // 3 PM
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate)

    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    expect(screen.getByText('Next Day')).toBeInTheDocument()
  })

  it('shows 2-3 business days for non-same-day products', () => {
    const nonSameDayProduct = {
      ...mockProduct,
      sameDayEligible: false,
    }

    render(
      <PricingCalculator
        product={nonSameDayProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    expect(screen.getByText('2-3 Business Days')).toBeInTheDocument()
  })

  it('displays price breakdown', () => {
    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    expect(screen.getByText('Price Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Base Price:')).toBeInTheDocument()
    expect(screen.getByText('Quantity:')).toBeInTheDocument()
  })

  it('calls onPriceChange on mount', () => {
    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    expect(mockOnPriceChange).toHaveBeenCalledWith(100, expect.any(Object))
  })

  it('handles required options with default values', () => {
    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    // Required option should have default value selected
    const quantitySelect = screen.getByDisplayValue('100 cards')
    expect(quantitySelect).toBeInTheDocument()
  })

  it('updates price when options change', async () => {
    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    // Change quantity
    const quantitySelect = screen.getByDisplayValue('100 cards')
    fireEvent.change(quantitySelect, { target: { value: '500' } })

    await waitFor(() => {
      expect(mockOnPriceChange).toHaveBeenCalledWith(100, expect.objectContaining({
        Quantity: '500',
      }))
    })
  })

  it('displays selected option labels correctly', () => {
    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    expect(screen.getByText('100 cards')).toBeInTheDocument()
    expect(screen.getByText('Matte')).toBeInTheDocument()
  })

  it('handles products without options', () => {
    const productWithoutOptions = {
      ...mockProduct,
      options: [],
    }

    render(
      <PricingCalculator
        product={productWithoutOptions}
        onPriceChange={mockOnPriceChange}
      />
    )

    expect(screen.getByText('Test Business Card')).toBeInTheDocument()
    expect(screen.getByText('₹100.00')).toBeInTheDocument()
  })

  it('validates minimum quantity', () => {
    render(
      <PricingCalculator
        product={mockProduct}
        onPriceChange={mockOnPriceChange}
      />
    )

    const quantityInput = screen.getByDisplayValue('1')
    fireEvent.change(quantityInput, { target: { value: '0' } })

    // Should not allow quantity less than 1
    expect(quantityInput).toHaveValue(1)
  })
})
