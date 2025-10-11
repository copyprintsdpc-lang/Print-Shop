import { test as base } from '@playwright/test'
import path from 'path'

// Test file paths
export const TEST_FILES = {
  // Small files for quick tests
  smallPdf: path.join(__dirname, 'small.pdf'),
  smallImage: path.join(__dirname, 'small.jpg'),
  
  // Medium files for normal tests
  mediumPdf: path.join(__dirname, 'medium.pdf'),
  mediumImage: path.join(__dirname, 'medium.jpg'),
  
  // Large files for stress tests
  largePdf: path.join(__dirname, 'large.pdf'),
  largeImage: path.join(__dirname, 'large.jpg'),
  
  // Product images
  productImage1: path.join(__dirname, 'product-1.jpg'),
  productImage2: path.join(__dirname, 'product-2.jpg'),
  productImage3: path.join(__dirname, 'product-3.jpg'),
  
  // Design files
  design1: path.join(__dirname, 'design-1.pdf'),
  design2: path.join(__dirname, 'design-2.pdf'),
  design3: path.join(__dirname, 'design-3.pdf'),
  
  // T-shirt images
  tshirt1: path.join(__dirname, 't-shirt-1.jpg'),
  tshirt2: path.join(__dirname, 't-shirt-2.jpg'),
  tshirt3: path.join(__dirname, 't-shirt-3.jpg'),
  
  // Proof files
  proof: path.join(__dirname, 'proof.pdf'),
  
  // Malicious files for security tests
  maliciousFile: path.join(__dirname, 'malicious.pdf'),
  suspiciousFile: path.join(__dirname, 'suspicious.pdf'),
  
  // Invalid files
  invalidFile: path.join(__dirname, 'invalid.exe'),
  corruptFile: path.join(__dirname, 'corrupt.pdf'),
}

// Test data
export const TEST_DATA = {
  users: {
    admin: {
      email: 'admin@sdpcprint.com',
      password: 'admin123',
      name: 'Test Admin'
    },
    customer: {
      email: 'customer@example.com',
      password: 'Password123!',
      name: 'Test Customer',
      phone: '+919876543210'
    },
    newUser: {
      email: 'newuser@example.com',
      password: 'Password123!',
      name: 'New User',
      phone: '+919876543211'
    }
  },
  
  products: {
    businessCards: {
      name: 'Business Cards',
      slug: 'business-cards',
      category: 'business-cards',
      tagline: 'Professional business cards',
      description: 'High-quality business cards with various options',
      basePrice: 100,
      minOrderQuantity: 100
    },
    posters: {
      name: 'Posters',
      slug: 'posters',
      category: 'posters-banners',
      tagline: 'Large format posters',
      description: 'Eye-catching posters for events and promotions',
      basePrice: 200,
      minOrderQuantity: 10
    },
    flyers: {
      name: 'Flyers',
      slug: 'flyers',
      category: 'flyers',
      tagline: 'Marketing flyers',
      description: 'Effective marketing flyers for your business',
      basePrice: 50,
      minOrderQuantity: 100
    }
  },
  
  orders: {
    businessCards: {
      items: [
        {
          productName: 'Business Cards',
          variant: '3.5x2 - Premium - Glossy',
          quantity: 1000,
          unitPrice: 100,
          totalPrice: 100000
        }
      ],
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+919876543210',
        company: 'Test Company'
      },
      delivery: {
        method: 'delivery',
        address: {
          line1: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        }
      }
    }
  },
  
  quotes: {
    businessCards: {
      customer: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+919876543211',
        company: 'Test Company 2'
      },
      service: 'business-cards',
      specifications: {
        size: '3.5x2',
        paper: 'premium',
        finish: 'glossy',
        quantity: 500
      },
      deadline: '2024-02-15',
      urgency: 'normal',
      notes: 'Please deliver to our office'
    }
  }
}

// Test utilities
export const TEST_UTILS = {
  // Generate random email
  randomEmail: () => `test-${Date.now()}@example.com`,
  
  // Generate random phone
  randomPhone: () => `+9198765${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
  
  // Generate random string
  randomString: (length: number = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },
  
  // Wait for file upload
  waitForUpload: async (page: any, timeout: number = 30000) => {
    await page.waitForSelector('.upload-success', { timeout })
  },
  
  // Wait for API response
  waitForAPI: async (page: any, url: string, timeout: number = 10000) => {
    return page.waitForResponse(response => 
      response.url().includes(url) && response.status() === 200,
      { timeout }
    )
  },
  
  // Mock payment success
  mockPaymentSuccess: async (page: any) => {
    await page.evaluate(() => {
      if (window.razorpaySuccessCallback) {
        window.razorpaySuccessCallback({
          razorpay_payment_id: 'pay_test123',
          razorpay_order_id: 'order_test123',
          razorpay_signature: 'test_signature'
        })
      }
    })
  },
  
  // Mock payment failure
  mockPaymentFailure: async (page: any) => {
    await page.evaluate(() => {
      if (window.razorpayFailureCallback) {
        window.razorpayFailureCallback({
          error: {
            code: 'PAYMENT_FAILED',
            description: 'Payment failed due to insufficient funds'
          }
        })
      }
    })
  }
}

// Extend base test with fixtures
export const test = base.extend({
  // Add custom fixtures here if needed
})

export { expect } from '@playwright/test'
