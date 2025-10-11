import { NextRequest } from 'next/server'
import { GET as getProductsHandler } from '@/app/api/products/route'
import { GET as getProductHandler } from '@/app/api/products/[slug]/route'
import { createMockProduct, resetMocks } from '../utils/test-utils'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  connectToDatabase: jest.fn(),
}))

jest.mock('mongoose', () => ({
  connection: {
    db: {
      collection: jest.fn(() => ({
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn(),
        countDocuments: jest.fn(),
      })),
    },
  },
}))

describe('/api/products', () => {
  beforeEach(() => {
    resetMocks()
  })

  it('should return products with pagination', async () => {
    const mockProducts = [createMockProduct(), createMockProduct({ _id: '507f1f77bcf86cd799439013' })]
    const mongoose = require('mongoose')
    
    mongoose.connection.db.collection().find().toArray.mockResolvedValue(mockProducts)
    mongoose.connection.db.collection().countDocuments.mockResolvedValue(2)

    const request = new NextRequest('http://localhost:3000/api/products?page=1&limit=10')
    const response = await getProductsHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.products).toHaveLength(2)
    expect(data.pagination.page).toBe(1)
    expect(data.pagination.total).toBe(2)
  })

  it('should filter products by category', async () => {
    const mockProducts = [createMockProduct({ category: 'business-cards' })]
    const mongoose = require('mongoose')
    
    mongoose.connection.db.collection().find().toArray.mockResolvedValue(mockProducts)
    mongoose.connection.db.collection().countDocuments.mockResolvedValue(1)

    const request = new NextRequest('http://localhost:3000/api/products?category=business-cards')
    const response = await getProductsHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.products).toHaveLength(1)
  })

  it('should search products by query', async () => {
    const mockProducts = [createMockProduct({ name: 'Business Card' })]
    const mongoose = require('mongoose')
    
    mongoose.connection.db.collection().find().toArray.mockResolvedValue(mockProducts)
    mongoose.connection.db.collection().countDocuments.mockResolvedValue(1)

    const request = new NextRequest('http://localhost:3000/api/products?search=business')
    const response = await getProductsHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.products).toHaveLength(1)
  })

  it('should sort products by price', async () => {
    const mockProducts = [
      createMockProduct({ basePrice: 50 }),
      createMockProduct({ basePrice: 100 }),
    ]
    const mongoose = require('mongoose')
    
    mongoose.connection.db.collection().find().toArray.mockResolvedValue(mockProducts)
    mongoose.connection.db.collection().countDocuments.mockResolvedValue(2)

    const request = new NextRequest('http://localhost:3000/api/products?sort=price-low')
    const response = await getProductsHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.products).toHaveLength(2)
  })

  it('should handle database errors', async () => {
    const mongoose = require('mongoose')
    mongoose.connection.db.collection().find().toArray.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/products')
    const response = await getProductsHandler(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('internal_error')
  })
})

describe('/api/products/[slug]', () => {
  beforeEach(() => {
    resetMocks()
  })

  it('should return product by slug', async () => {
    const mockProduct = createMockProduct({ slug: 'test-business-card' })
    const mongoose = require('mongoose')
    
    mongoose.connection.db.collection().findOne.mockResolvedValue(mockProduct)

    const request = new NextRequest('http://localhost:3000/api/products/test-business-card')
    const response = await getProductHandler(request, { params: { slug: 'test-business-card' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.product.slug).toBe('test-business-card')
  })

  it('should return 404 for non-existent product', async () => {
    const mongoose = require('mongoose')
    mongoose.connection.db.collection().findOne.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/products/non-existent')
    const response = await getProductHandler(request, { params: { slug: 'non-existent' } })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('not_found')
  })

  it('should return 404 for inactive product', async () => {
    const mockProduct = createMockProduct({ active: false })
    const mongoose = require('mongoose')
    
    mongoose.connection.db.collection().findOne.mockResolvedValue(mockProduct)

    const request = new NextRequest('http://localhost:3000/api/products/inactive-product')
    const response = await getProductHandler(request, { params: { slug: 'inactive-product' } })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('not_found')
  })
})
