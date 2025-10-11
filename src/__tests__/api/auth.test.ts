import { NextRequest } from 'next/server'
import { POST as loginHandler } from '@/app/api/auth/login/route'
import { POST as signupHandler } from '@/app/api/auth/signup/route'
import { GET as meHandler } from '@/app/api/auth/me/route'
import { createMockUser, mockFetch, resetMocks } from '../utils/test-utils'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  connectToDatabase: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  signJwt: jest.fn(() => 'mock-jwt-token'),
  verifyJwt: jest.fn(() => ({ userId: '507f1f77bcf86cd799439011' })),
}))

jest.mock('@/lib/rateLimit', () => ({
  rateLimitIP: jest.fn(() => ({ allowed: true })),
}))

jest.mock('@/models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}))

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(() => 'hashed-password'),
}))

describe('/api/auth/login', () => {
  beforeEach(() => {
    resetMocks()
  })

  it('should login with valid email and password', async () => {
    const mockUser = createMockUser()
    const bcrypt = require('bcryptjs')
    const User = require('@/models/User')

    User.findOne.mockResolvedValue(mockUser)
    bcrypt.compare.mockResolvedValue(true)

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        loginMethod: 'email',
      }),
    })

    const response = await loginHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.user.email).toBe('test@example.com')
    expect(data.token).toBe('mock-jwt-token')
  })

  it('should reject invalid credentials', async () => {
    const User = require('@/models/User')
    const bcrypt = require('bcryptjs')

    User.findOne.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'password123',
        loginMethod: 'email',
      }),
    })

    const response = await loginHandler(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('invalid_credentials')
  })

  it('should reject unverified email', async () => {
    const mockUser = createMockUser({ verified: false })
    const User = require('@/models/User')

    User.findOne.mockResolvedValue(mockUser)

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'unverified@example.com',
        password: 'password123',
        loginMethod: 'email',
      }),
    })

    const response = await loginHandler(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('not_verified')
  })

  it('should handle rate limiting', async () => {
    const rateLimit = require('@/lib/rateLimit')
    rateLimit.rateLimitIP.mockReturnValue({ allowed: false })

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        loginMethod: 'email',
      }),
    })

    const response = await loginHandler(request)
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('rate_limited')
  })
})

describe('/api/auth/signup', () => {
  beforeEach(() => {
    resetMocks()
  })

  it('should create new user with valid data', async () => {
    const User = require('@/models/User')
    const bcrypt = require('bcryptjs')

    User.findOne.mockResolvedValue(null) // User doesn't exist
    User.create.mockResolvedValue(createMockUser())

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        mobile: '+919876543210',
      }),
    })

    const response = await signupHandler(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.ok).toBe(true)
    expect(data.message).toContain('User created successfully')
  })

  it('should reject duplicate email', async () => {
    const User = require('@/models/User')

    User.findOne.mockResolvedValue(createMockUser()) // User already exists

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123',
        mobile: '+919876543210',
      }),
    })

    const response = await signupHandler(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('user_exists')
  })

  it('should validate required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'New User',
        // Missing email and password
      }),
    })

    const response = await signupHandler(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('validation_error')
  })
})

describe('/api/auth/me', () => {
  beforeEach(() => {
    resetMocks()
  })

  it('should return user data for authenticated user', async () => {
    const mockUser = createMockUser()
    const User = require('@/models/User')

    User.findById.mockResolvedValue(mockUser)

    const request = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'GET',
      headers: {
        authorization: 'Bearer mock-jwt-token',
      },
    })

    // Mock the middleware to add user to request
    request.user = { userId: '507f1f77bcf86cd799439011' }

    const response = await meHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.user.email).toBe('test@example.com')
  })

  it('should return 401 for unauthenticated request', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'GET',
    })

    const response = await meHandler(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.ok).toBe(false)
    expect(data.code).toBe('unauthorized')
  })
})
