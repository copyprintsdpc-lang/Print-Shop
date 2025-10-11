import mongoose from 'mongoose'
import User from '@/models/User'

// Mock mongoose connection
jest.mock('mongoose', () => ({
  connection: {
    db: {
      collection: jest.fn(),
    },
  },
  Types: {
    ObjectId: jest.fn((id) => id),
  },
}))

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a user with valid data', () => {
    const userData = {
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      name: 'Test User',
      mobile: '+919876543210',
      role: 'customer',
      verified: true,
    }

    const user = new User(userData)

    expect(user.email).toBe('test@example.com')
    expect(user.name).toBe('Test User')
    expect(user.mobile).toBe('+919876543210')
    expect(user.role).toBe('customer')
    expect(user.verified).toBe(true)
  })

  it('should create a user with business profile', () => {
    const userData = {
      email: 'business@example.com',
      passwordHash: 'hashed-password',
      name: 'Business User',
      role: 'customer',
      businessProfile: {
        companyName: 'Test Company',
        gstin: '29ABCDE1234F1Z5',
        pan: 'ABCDE1234F',
        address: {
          line1: '123 Business Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'IN',
        },
      },
    }

    const user = new User(userData)

    expect(user.businessProfile.companyName).toBe('Test Company')
    expect(user.businessProfile.gstin).toBe('29ABCDE1234F1Z5')
    expect(user.businessProfile.address.city).toBe('Mumbai')
  })

  it('should create a user with multiple addresses', () => {
    const userData = {
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      name: 'Test User',
      addresses: [
        {
          type: 'billing',
          line1: '123 Billing Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'IN',
          isDefault: true,
        },
        {
          type: 'shipping',
          line1: '456 Shipping Street',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          country: 'IN',
          isDefault: false,
        },
      ],
    }

    const user = new User(userData)

    expect(user.addresses).toHaveLength(2)
    expect(user.addresses[0].type).toBe('billing')
    expect(user.addresses[1].type).toBe('shipping')
    expect(user.addresses[0].isDefault).toBe(true)
  })

  it('should handle user without email (OTP flow)', () => {
    const userData = {
      mobile: '+919876543210',
      name: 'Mobile User',
      role: 'customer',
    }

    const user = new User(userData)

    expect(user.email).toBeUndefined()
    expect(user.mobile).toBe('+919876543210')
    expect(user.name).toBe('Mobile User')
  })

  it('should handle user without mobile (email flow)', () => {
    const userData = {
      email: 'email@example.com',
      passwordHash: 'hashed-password',
      name: 'Email User',
      role: 'customer',
    }

    const user = new User(userData)

    expect(user.email).toBe('email@example.com')
    expect(user.mobile).toBeUndefined()
    expect(user.name).toBe('Email User')
  })

  it('should set default values correctly', () => {
    const userData = {
      email: 'test@example.com',
      passwordHash: 'hashed-password',
    }

    const user = new User(userData)

    expect(user.verified).toBe(false)
    expect(user.role).toBe('customer')
    expect(user.businessProfile).toBeUndefined()
    expect(user.addresses).toEqual([])
  })

  it('should handle admin role', () => {
    const userData = {
      email: 'admin@example.com',
      passwordHash: 'hashed-password',
      name: 'Admin User',
      role: 'admin',
    }

    const user = new User(userData)

    expect(user.role).toBe('admin')
  })

  it('should handle staff role', () => {
    const userData = {
      email: 'staff@example.com',
      passwordHash: 'hashed-password',
      name: 'Staff User',
      role: 'staff',
    }

    const user = new User(userData)

    expect(user.role).toBe('staff')
  })

  it('should trim and lowercase email', () => {
    const userData = {
      email: '  TEST@EXAMPLE.COM  ',
      passwordHash: 'hashed-password',
    }

    const user = new User(userData)

    expect(user.email).toBe('test@example.com')
  })

  it('should trim mobile number', () => {
    const userData = {
      mobile: '  +919876543210  ',
      name: 'Test User',
    }

    const user = new User(userData)

    expect(user.mobile).toBe('+919876543210')
  })

  it('should handle empty business profile', () => {
    const userData = {
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      businessProfile: {},
    }

    const user = new User(userData)

    expect(user.businessProfile).toEqual({})
  })

  it('should handle empty addresses array', () => {
    const userData = {
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      addresses: [],
    }

    const user = new User(userData)

    expect(user.addresses).toEqual([])
  })
})
