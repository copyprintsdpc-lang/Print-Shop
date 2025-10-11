import Product from '@/models/Product'

describe('Product Model', () => {
  it('should create a product with valid data', () => {
    const productData = {
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
    }

    const product = new Product(productData)

    expect(product.name).toBe('Test Business Card')
    expect(product.slug).toBe('test-business-card')
    expect(product.category).toBe('business-cards')
    expect(product.basePrice).toBe(100)
    expect(product.pricingMethod).toBe('flat')
    expect(product.sameDayEligible).toBe(true)
    expect(product.sameDayCutoff).toBe('12:00')
    expect(product.featured).toBe(false)
    expect(product.active).toBe(true)
  })

  it('should create a product with tier pricing', () => {
    const productData = {
      name: 'Tier Product',
      slug: 'tier-product',
      description: 'A product with tier pricing',
      category: 'documents',
      images: ['https://example.com/image1.jpg'],
      basePrice: 50,
      pricingMethod: 'tier',
      pricingTiers: [
        { minQty: 1, unitPrice: 50 },
        { minQty: 100, unitPrice: 40 },
        { minQty: 500, unitPrice: 30 },
      ],
    }

    const product = new Product(productData)

    expect(product.pricingMethod).toBe('tier')
    expect(product.pricingTiers).toHaveLength(3)
    expect(product.pricingTiers[0].minQty).toBe(1)
    expect(product.pricingTiers[0].unitPrice).toBe(50)
  })

  it('should create a product with area pricing', () => {
    const productData = {
      name: 'Area Product',
      slug: 'area-product',
      description: 'A product with area pricing',
      category: 'posters-banners',
      images: ['https://example.com/image1.jpg'],
      basePrice: 0,
      pricingMethod: 'area',
      areaPricing: {
        pricePerSqFt: 25,
        minCharge: 100,
      },
    }

    const product = new Product(productData)

    expect(product.pricingMethod).toBe('area')
    expect(product.areaPricing.pricePerSqFt).toBe(25)
    expect(product.areaPricing.minCharge).toBe(100)
  })

  it('should create a product with promotion', () => {
    const productData = {
      name: 'Promo Product',
      slug: 'promo-product',
      description: 'A product with promotion',
      category: 'business-cards',
      images: ['https://example.com/image1.jpg'],
      basePrice: 100,
      pricingMethod: 'flat',
      promotion: {
        discount: 20,
        validUntil: new Date('2024-12-31'),
        isActive: true,
        title: '20% Off',
        description: 'Limited time offer',
      },
    }

    const product = new Product(productData)

    expect(product.promotion.discount).toBe(20)
    expect(product.promotion.isActive).toBe(true)
    expect(product.promotion.title).toBe('20% Off')
  })

  it('should create a product with multiple variants', () => {
    const productData = {
      name: 'Multi Variant Product',
      slug: 'multi-variant-product',
      description: 'A product with multiple variants',
      category: 'business-cards',
      images: ['https://example.com/image1.jpg'],
      basePrice: 100,
      pricingMethod: 'flat',
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
        {
          size: '3.5x2',
          material: 'Cardstock',
          finish: 'Glossy',
          price: 120,
          sku: 'BC-002',
          inStock: true,
          name: 'Standard Glossy',
        },
        {
          size: '3.5x2',
          material: 'Premium',
          finish: 'Matte',
          price: 150,
          sku: 'BC-003',
          inStock: false,
          name: 'Premium Matte',
        },
      ],
    }

    const product = new Product(productData)

    expect(product.variants).toHaveLength(3)
    expect(product.variants[0].finish).toBe('Matte')
    expect(product.variants[1].finish).toBe('Glossy')
    expect(product.variants[2].inStock).toBe(false)
  })

  it('should create a product with multiple options', () => {
    const productData = {
      name: 'Multi Option Product',
      slug: 'multi-option-product',
      description: 'A product with multiple options',
      category: 'business-cards',
      images: ['https://example.com/image1.jpg'],
      basePrice: 100,
      pricingMethod: 'flat',
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
        {
          name: 'Rush Order',
          type: 'boolean',
          required: false,
          values: [
            { value: 'true', label: 'Yes', priceDelta: 50, priceDeltaType: 'flat' },
            { value: 'false', label: 'No', priceDelta: 0, priceDeltaType: 'flat' },
          ],
        },
      ],
    }

    const product = new Product(productData)

    expect(product.options).toHaveLength(3)
    expect(product.options[0].name).toBe('Quantity')
    expect(product.options[0].required).toBe(true)
    expect(product.options[1].name).toBe('Finish')
    expect(product.options[1].required).toBe(false)
    expect(product.options[2].type).toBe('boolean')
  })

  it('should set default values correctly', () => {
    const productData = {
      name: 'Default Product',
      slug: 'default-product',
      description: 'A product with default values',
      category: 'documents',
      images: ['https://example.com/image1.jpg'],
      basePrice: 50,
      pricingMethod: 'flat',
    }

    const product = new Product(productData)

    expect(product.sameDayEligible).toBe(false)
    expect(product.sameDayCutoff).toBe('12:00')
    expect(product.featured).toBe(false)
    expect(product.active).toBe(true)
    expect(product.variants).toEqual([])
    expect(product.options).toEqual([])
    expect(product.pricingTiers).toEqual([])
  })

  it('should handle different categories', () => {
    const categories = ['documents', 'business-cards', 'posters-banners', 'stickers-labels', 'stationery', 'custom']
    
    categories.forEach(category => {
      const productData = {
        name: `${category} Product`,
        slug: `${category}-product`,
        description: `A ${category} product`,
        category,
        images: ['https://example.com/image1.jpg'],
        basePrice: 100,
        pricingMethod: 'flat',
      }

      const product = new Product(productData)
      expect(product.category).toBe(category)
    })
  })

  it('should handle different pricing methods', () => {
    const pricingMethods = ['flat', 'tier', 'area']
    
    pricingMethods.forEach(method => {
      const productData = {
        name: `${method} Product`,
        slug: `${method}-product`,
        description: `A ${method} pricing product`,
        category: 'documents',
        images: ['https://example.com/image1.jpg'],
        basePrice: 100,
        pricingMethod: method,
      }

      const product = new Product(productData)
      expect(product.pricingMethod).toBe(method)
    })
  })

  it('should handle different option types', () => {
    const optionTypes = ['select', 'boolean', 'numeric', 'dim2']
    
    optionTypes.forEach(type => {
      const productData = {
        name: `${type} Product`,
        slug: `${type}-product`,
        description: `A product with ${type} option`,
        category: 'documents',
        images: ['https://example.com/image1.jpg'],
        basePrice: 100,
        pricingMethod: 'flat',
        options: [
          {
            name: 'Test Option',
            type,
            required: false,
            values: [
              { value: 'test', label: 'Test', priceDelta: 0, priceDeltaType: 'flat' },
            ],
          },
        ],
      }

      const product = new Product(productData)
      expect(product.options[0].type).toBe(type)
    })
  })
})
