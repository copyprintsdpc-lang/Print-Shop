// Product catalog and pricing configuration
export interface ProductOption {
  name: string
  type: 'select' | 'boolean' | 'numeric' | 'dim2'
  required: boolean
  values: Array<{
    value: string
    label: string
    priceDelta: number
    priceDeltaType: 'flat' | 'percent'
  }>
}

export interface PricingTier {
  minQty: number
  unitPrice: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: 'documents' | 'business-cards' | 'posters-banners' | 'stickers-labels' | 'custom'
  images: string[]
  basePrice: number
  pricingMethod: 'flat' | 'tier' | 'area'
  sameDayEligible: boolean
  sameDayCutoff: string
  options: ProductOption[]
  pricingTiers: PricingTier[]
  areaPricing?: {
    pricePerSqFt: number
    minCharge: number
  }
  active: boolean
}

export const products: Product[] = [
  {
    id: 'documents-bw',
    name: 'Black & White Documents',
    slug: 'black-white-documents',
    description: 'Professional black and white document printing with multiple paper options',
    category: 'documents',
    images: ['/images/documents-bw.jpg'],
    basePrice: 1.5,
    pricingMethod: 'tier',
    sameDayEligible: true,
    sameDayCutoff: '14:00',
    options: [
      {
        name: 'paper_type',
        type: 'select',
        required: true,
        values: [
          { value: '80gsm', label: 'Standard (80gsm)', priceDelta: 0, priceDeltaType: 'flat' },
          { value: '100gsm', label: 'Premium (100gsm)', priceDelta: 0.5, priceDeltaType: 'flat' },
          { value: '130gsm', label: 'Heavy (130gsm)', priceDelta: 1, priceDeltaType: 'flat' }
        ]
      },
      {
        name: 'sides',
        type: 'select',
        required: true,
        values: [
          { value: 'single', label: 'Single Sided', priceDelta: 0, priceDeltaType: 'flat' },
          { value: 'double', label: 'Double Sided', priceDelta: 0.5, priceDeltaType: 'flat' }
        ]
      },
      {
        name: 'binding',
        type: 'select',
        required: false,
        values: [
          { value: 'none', label: 'No Binding', priceDelta: 0, priceDeltaType: 'flat' },
          { value: 'staples', label: 'Staples', priceDelta: 2, priceDeltaType: 'flat' },
          { value: 'coil', label: 'Coil Binding', priceDelta: 5, priceDeltaType: 'flat' },
          { value: 'perfect', label: 'Perfect Binding', priceDelta: 8, priceDeltaType: 'flat' }
        ]
      }
    ],
    pricingTiers: [
      { minQty: 1, unitPrice: 1.5 },
      { minQty: 50, unitPrice: 1.2 },
      { minQty: 100, unitPrice: 1.0 },
      { minQty: 500, unitPrice: 0.8 }
    ],
    active: true
  },
  {
    id: 'documents-color',
    name: 'Color Documents',
    slug: 'color-documents',
    description: 'High-quality color document printing for presentations and reports',
    category: 'documents',
    images: ['/images/documents-color.jpg'],
    basePrice: 3.0,
    pricingMethod: 'tier',
    sameDayEligible: true,
    sameDayCutoff: '12:00',
    options: [
      {
        name: 'paper_type',
        type: 'select',
        required: true,
        values: [
          { value: '80gsm', label: 'Standard (80gsm)', priceDelta: 0, priceDeltaType: 'flat' },
          { value: '100gsm', label: 'Premium (100gsm)', priceDelta: 1, priceDeltaType: 'flat' },
          { value: '130gsm', label: 'Heavy (130gsm)', priceDelta: 2, priceDeltaType: 'flat' }
        ]
      },
      {
        name: 'sides',
        type: 'select',
        required: true,
        values: [
          { value: 'single', label: 'Single Sided', priceDelta: 0, priceDeltaType: 'flat' },
          { value: 'double', label: 'Double Sided', priceDelta: 1, priceDeltaType: 'flat' }
        ]
      }
    ],
    pricingTiers: [
      { minQty: 1, unitPrice: 3.0 },
      { minQty: 25, unitPrice: 2.5 },
      { minQty: 50, unitPrice: 2.0 },
      { minQty: 100, unitPrice: 1.8 }
    ],
    active: true
  },
  {
    id: 'business-cards',
    name: 'Business Cards',
    slug: 'business-cards',
    description: 'Professional business cards with multiple finish options',
    category: 'business-cards',
    images: ['/images/business-cards.jpg'],
    basePrice: 0.8,
    pricingMethod: 'tier',
    sameDayEligible: true,
    sameDayCutoff: '15:00',
    options: [
      {
        name: 'finish',
        type: 'select',
        required: true,
        values: [
          { value: 'matte', label: 'Matte Finish', priceDelta: 0, priceDeltaType: 'flat' },
          { value: 'glossy', label: 'Glossy Finish', priceDelta: 0.2, priceDeltaType: 'flat' },
          { value: 'uv', label: 'UV Coating', priceDelta: 0.5, priceDeltaType: 'flat' }
        ]
      },
      {
        name: 'size',
        type: 'select',
        required: true,
        values: [
          { value: 'standard', label: 'Standard (3.5" x 2")', priceDelta: 0, priceDeltaType: 'flat' },
          { value: 'square', label: 'Square (2.5" x 2.5")', priceDelta: 0.1, priceDeltaType: 'flat' },
          { value: 'custom', label: 'Custom Size', priceDelta: 0.3, priceDeltaType: 'flat' }
        ]
      }
    ],
    pricingTiers: [
      { minQty: 100, unitPrice: 0.8 },
      { minQty: 250, unitPrice: 0.6 },
      { minQty: 500, unitPrice: 0.5 },
      { minQty: 1000, unitPrice: 0.4 }
    ],
    active: true
  },
  {
    id: 'banners',
    name: 'Banners & Posters',
    slug: 'banners-posters',
    description: 'Large format printing for events and marketing',
    category: 'posters-banners',
    images: ['/images/banners.jpg'],
    basePrice: 45,
    pricingMethod: 'area',
    sameDayEligible: false,
    sameDayCutoff: '10:00',
    options: [
      {
        name: 'material',
        type: 'select',
        required: true,
        values: [
          { value: 'vinyl', label: 'Vinyl (Outdoor)', priceDelta: 0, priceDeltaType: 'flat' },
          { value: 'paper', label: 'Paper (Indoor)', priceDelta: -10, priceDeltaType: 'flat' },
          { value: 'fabric', label: 'Fabric', priceDelta: 15, priceDeltaType: 'flat' }
        ]
      },
      {
        name: 'finishing',
        type: 'select',
        required: false,
        values: [
          { value: 'none', label: 'No Finishing', priceDelta: 0, priceDeltaType: 'flat' },
          { value: 'grommets', label: 'Grommets', priceDelta: 5, priceDeltaType: 'flat' },
          { value: 'hemming', label: 'Hemming', priceDelta: 8, priceDeltaType: 'flat' }
        ]
      }
    ],
    areaPricing: {
      pricePerSqFt: 45,
      minCharge: 200
    },
    pricingTiers: [],
    active: true
  },
  {
    id: 'stickers',
    name: 'Stickers & Labels',
    slug: 'stickers-labels',
    description: 'Custom stickers and labels for branding',
    category: 'stickers-labels',
    images: ['/images/stickers.jpg'],
    basePrice: 0.3,
    pricingMethod: 'tier',
    sameDayEligible: true,
    sameDayCutoff: '16:00',
    options: [
      {
        name: 'material',
        type: 'select',
        required: true,
        values: [
          { value: 'paper', label: 'Paper', priceDelta: 0, priceDeltaType: 'flat' },
          { value: 'vinyl', label: 'Vinyl (Waterproof)', priceDelta: 0.2, priceDeltaType: 'flat' },
          { value: 'clear', label: 'Clear Vinyl', priceDelta: 0.3, priceDeltaType: 'flat' }
        ]
      },
      {
        name: 'shape',
        type: 'select',
        required: true,
        values: [
          { value: 'rectangle', label: 'Rectangle', priceDelta: 0, priceDeltaType: 'flat' },
          { value: 'circle', label: 'Circle', priceDelta: 0.1, priceDeltaType: 'flat' },
          { value: 'custom', label: 'Custom Shape', priceDelta: 0.2, priceDeltaType: 'flat' }
        ]
      }
    ],
    pricingTiers: [
      { minQty: 50, unitPrice: 0.3 },
      { minQty: 100, unitPrice: 0.25 },
      { minQty: 250, unitPrice: 0.2 },
      { minQty: 500, unitPrice: 0.15 }
    ],
    active: true
  }
]

// Helper functions for pricing calculations
export function calculatePrice(product: Product, quantity: number, options: Record<string, string>): number {
  let basePrice = product.basePrice

  // Apply tier pricing
  if (product.pricingMethod === 'tier') {
    const applicableTier = product.pricingTiers
      .sort((a, b) => b.minQty - a.minQty)
      .find(tier => quantity >= tier.minQty)
    
    if (applicableTier) {
      basePrice = applicableTier.unitPrice
    }
  }

  // Apply area pricing
  if (product.pricingMethod === 'area' && product.areaPricing) {
    // For area pricing, we need dimensions - this would come from the order
    // For now, return minimum charge
    basePrice = product.areaPricing.minCharge
  }

  // Apply option price deltas
  let totalPrice = basePrice * quantity

  for (const option of product.options) {
    const selectedValue = options[option.name]
    if (selectedValue) {
      const optionValue = option.values.find(v => v.value === selectedValue)
      if (optionValue) {
        if (optionValue.priceDeltaType === 'flat') {
          totalPrice += optionValue.priceDelta
        } else if (optionValue.priceDeltaType === 'percent') {
          totalPrice += (totalPrice * optionValue.priceDelta) / 100
        }
      }
    }
  }

  return Math.round(totalPrice * 100) / 100 // Round to 2 decimal places
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category && product.active)
}

export function getAllProducts(): Product[] {
  return products.filter(product => product.active)
}
