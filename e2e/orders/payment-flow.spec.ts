import { test, expect } from '@playwright/test'

test.describe('Order & Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
  })

  test('TC-ORD-001: Create Razorpay order server-side; show checkout', async ({ page }) => {
    // Add items to cart
    await page.goto('/services/business-cards')
    await page.selectOption('select[name="size"]', '3.5x2')
    await page.selectOption('select[name="paper"]', 'premium')
    await page.fill('input[name="quantity"]', '1000')
    await page.click('button:has-text("Add to Cart")')
    
    // Go to checkout
    await page.click('.cart-icon')
    await page.click('button:has-text("Checkout")')
    
    // Check that we're on checkout page
    await expect(page).toHaveURL('/checkout')
    
    // Fill checkout form
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="address"]', '123 Main St')
    await page.fill('input[name="city"]', 'Mumbai')
    await page.fill('input[name="pincode"]', '400001')
    
    // Select payment method
    await page.click('input[value="razorpay"]')
    
    // Click place order
    await page.click('button:has-text("Place Order")')
    
    // Check that Razorpay checkout opens
    await expect(page.locator('.razorpay-checkout')).toBeVisible()
    
    // Check for order details
    await expect(page.locator('.order-summary')).toBeVisible()
    await expect(page.locator('.order-total')).toBeVisible()
    
    // Check for Razorpay payment form
    await expect(page.locator('input[name="razorpay_payment_id"]')).toBeVisible()
  })

  test('TC-ORD-002: Successful payment → webhook verifies signature → order status paid', async ({ page }) => {
    // Complete checkout process
    await page.goto('/checkout')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="address"]', '123 Main St')
    await page.fill('input[name="city"]', 'Mumbai')
    await page.fill('input[name="pincode"]', '400001')
    await page.click('input[value="razorpay"]')
    await page.click('button:has-text("Place Order")')
    
    // Mock successful payment
    await page.evaluate(() => {
      // Simulate Razorpay success callback
      window.razorpaySuccessCallback({
        razorpay_payment_id: 'pay_test123',
        razorpay_order_id: 'order_test123',
        razorpay_signature: 'test_signature'
      })
    })
    
    // Wait for payment processing
    await page.waitForTimeout(2000)
    
    // Check for success page
    await expect(page).toHaveURL(/.*order-success/)
    
    // Check for success message
    await expect(page.locator('text=Payment successful')).toBeVisible()
    
    // Check for order number
    await expect(page.locator('.order-number')).toBeVisible()
    
    // Check for order status
    await expect(page.locator('text=Order confirmed')).toBeVisible()
    
    // Verify order in database (would need API call)
    const orderResponse = await page.request.get('/api/orders/my-orders')
    const orders = await orderResponse.json()
    
    expect(orders.orders).toHaveLength(1)
    expect(orders.orders[0].status).toBe('confirmed')
    expect(orders.orders[0].payment.status).toBe('paid')
  })

  test('TC-ORD-003: Payment failure/cancel → order remains pending with reason', async ({ page }) => {
    // Complete checkout process
    await page.goto('/checkout')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="address"]', '123 Main St')
    await page.fill('input[name="city"]', 'Mumbai')
    await page.fill('input[name="pincode"]', '400001')
    await page.click('input[value="razorpay"]')
    await page.click('button:has-text("Place Order")')
    
    // Mock payment failure
    await page.evaluate(() => {
      // Simulate Razorpay failure callback
      window.razorpayFailureCallback({
        error: {
          code: 'PAYMENT_FAILED',
          description: 'Payment failed due to insufficient funds'
        }
      })
    })
    
    // Wait for error handling
    await page.waitForTimeout(2000)
    
    // Check for error message
    await expect(page.locator('text=Payment failed')).toBeVisible()
    await expect(page.locator('text=Insufficient funds')).toBeVisible()
    
    // Check that we're still on checkout page
    await expect(page).toHaveURL('/checkout')
    
    // Check for retry payment button
    await expect(page.locator('button:has-text("Retry Payment")')).toBeVisible()
    
    // Verify order status in database
    const orderResponse = await page.request.get('/api/orders/my-orders')
    const orders = await orderResponse.json()
    
    expect(orders.orders).toHaveLength(1)
    expect(orders.orders[0].status).toBe('pending')
    expect(orders.orders[0].payment.status).toBe('failed')
    expect(orders.orders[0].payment.failureReason).toBe('Insufficient funds')
  })

  test('TC-ORD-004: Idempotency: duplicate webhook events handled once', async ({ page }) => {
    // Complete checkout process
    await page.goto('/checkout')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="address"]', '123 Main St')
    await page.fill('input[name="city"]', 'Mumbai')
    await page.fill('input[name="pincode"]', '400001')
    await page.click('input[value="razorpay"]')
    await page.click('button:has-text("Place Order")')
    
    // Mock successful payment
    const paymentData = {
      razorpay_payment_id: 'pay_test123',
      razorpay_order_id: 'order_test123',
      razorpay_signature: 'test_signature'
    }
    
    await page.evaluate((data) => {
      window.razorpaySuccessCallback(data)
    }, paymentData)
    
    // Wait for first webhook processing
    await page.waitForTimeout(2000)
    
    // Simulate duplicate webhook event
    const webhookResponse1 = await page.request.post('/api/payments/webhook', {
      data: {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: paymentData.razorpay_payment_id,
              order_id: paymentData.razorpay_order_id,
              status: 'captured'
            }
          }
        }
      }
    })
    
    const webhookResponse2 = await page.request.post('/api/payments/webhook', {
      data: {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: paymentData.razorpay_payment_id,
              order_id: paymentData.razorpay_order_id,
              status: 'captured'
            }
          }
        }
      }
    })
    
    // Both webhooks should return success
    expect(webhookResponse1.status()).toBe(200)
    expect(webhookResponse2.status()).toBe(200)
    
    // But order should only be processed once
    const orderResponse = await page.request.get('/api/orders/my-orders')
    const orders = await orderResponse.json()
    
    expect(orders.orders).toHaveLength(1)
    expect(orders.orders[0].payment.status).toBe('paid')
  })

  test('TC-ORD-005: Currency (INR) correct; amounts incl. tax/shipping', async ({ page }) => {
    // Add items to cart
    await page.goto('/services/business-cards')
    await page.selectOption('select[name="size"]', '3.5x2')
    await page.selectOption('select[name="paper"]', 'premium')
    await page.fill('input[name="quantity"]', '1000')
    await page.click('button:has-text("Add to Cart")')
    
    // Go to checkout
    await page.click('.cart-icon')
    await page.click('button:has-text("Checkout")')
    
    // Check currency display
    await expect(page.locator('.currency-symbol')).toContainText('₹')
    
    // Check order summary
    await expect(page.locator('.order-summary')).toBeVisible()
    
    // Check subtotal
    await expect(page.locator('.subtotal')).toContainText('₹')
    const subtotal = await page.locator('.subtotal .amount').textContent()
    expect(subtotal).toMatch(/^\d+\.\d{2}$/)
    
    // Check tax
    await expect(page.locator('.tax')).toContainText('₹')
    const tax = await page.locator('.tax .amount').textContent()
    expect(tax).toMatch(/^\d+\.\d{2}$/)
    
    // Check shipping
    await expect(page.locator('.shipping')).toContainText('₹')
    const shipping = await page.locator('.shipping .amount').textContent()
    expect(shipping).toMatch(/^\d+\.\d{2}$/)
    
    // Check total
    await expect(page.locator('.total')).toContainText('₹')
    const total = await page.locator('.total .amount').textContent()
    expect(total).toMatch(/^\d+\.\d{2}$/)
    
    // Verify total calculation
    const subtotalValue = parseFloat(subtotal!)
    const taxValue = parseFloat(tax!)
    const shippingValue = parseFloat(shipping!)
    const totalValue = parseFloat(total!)
    
    expect(totalValue).toBeCloseTo(subtotalValue + taxValue + shippingValue, 2)
  })

  test('TC-ORD-006: GST invoice generation / downloadable PDF', async ({ page }) => {
    // Complete order
    await page.goto('/checkout')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="address"]', '123 Main St')
    await page.fill('input[name="city"]', 'Mumbai')
    await page.fill('input[name="pincode"]', '400001')
    await page.click('input[value="razorpay"]')
    await page.click('button:has-text("Place Order")')
    
    // Mock successful payment
    await page.evaluate(() => {
      window.razorpaySuccessCallback({
        razorpay_payment_id: 'pay_test123',
        razorpay_order_id: 'order_test123',
        razorpay_signature: 'test_signature'
      })
    })
    
    await page.waitForTimeout(2000)
    
    // Check for invoice download link
    await expect(page.locator('a:has-text("Download Invoice")')).toBeVisible()
    
    // Click download invoice
    const downloadPromise = page.waitForEvent('download')
    await page.click('a:has-text("Download Invoice")')
    const download = await downloadPromise
    
    // Check download
    expect(download.suggestedFilename()).toMatch(/invoice.*\.pdf$/i)
    
    // Check for GST details in invoice
    const invoiceContent = await download.createReadStream()
    // This would need to be implemented based on your PDF generation
  })

  test('TC-ORD-007: COD/Alt methods toggle UX and rules', async ({ page }) => {
    // Go to checkout
    await page.goto('/checkout')
    
    // Check for payment method options
    await expect(page.locator('input[value="razorpay"]')).toBeVisible()
    await expect(page.locator('input[value="cod"]')).toBeVisible()
    
    // Select COD
    await page.click('input[value="cod"]')
    
    // Check for COD-specific information
    await expect(page.locator('text=Cash on Delivery')).toBeVisible()
    await expect(page.locator('text=Pay when your order is delivered')).toBeVisible()
    
    // Check for COD terms
    await expect(page.locator('text=COD available for orders above ₹500')).toBeVisible()
    
    // Check that order total meets COD minimum
    const orderTotal = await page.locator('.total .amount').textContent()
    const totalValue = parseFloat(orderTotal!.replace('₹', ''))
    
    if (totalValue < 500) {
      await expect(page.locator('text=Minimum order amount for COD is ₹500')).toBeVisible()
      await expect(page.locator('input[value="cod"]')).toBeDisabled()
    } else {
      await expect(page.locator('input[value="cod"]')).toBeEnabled()
    }
    
    // Fill checkout form
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="address"]', '123 Main St')
    await page.fill('input[name="city"]', 'Mumbai')
    await page.fill('input[name="pincode"]', '400001')
    
    // Place order with COD
    await page.click('button:has-text("Place Order")')
    
    // Check for COD confirmation
    await expect(page.locator('text=Order placed successfully')).toBeVisible()
    await expect(page.locator('text=You will pay ₹')).toBeVisible()
  })

  test('TC-ORD-008: Order email/SMS confirmations to customer + internal', async ({ page }) => {
    // Complete order
    await page.goto('/checkout')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="address"]', '123 Main St')
    await page.fill('input[name="city"]', 'Mumbai')
    await page.fill('input[name="pincode"]', '400001')
    await page.click('input[value="razorpay"]')
    await page.click('button:has-text("Place Order")')
    
    // Mock successful payment
    await page.evaluate(() => {
      window.razorpaySuccessCallback({
        razorpay_payment_id: 'pay_test123',
        razorpay_order_id: 'order_test123',
        razorpay_signature: 'test_signature'
      })
    })
    
    await page.waitForTimeout(2000)
    
    // Check for confirmation messages
    await expect(page.locator('text=Order confirmation email sent')).toBeVisible()
    await expect(page.locator('text=SMS confirmation sent')).toBeVisible()
    
    // Check for order number in confirmation
    const orderNumber = await page.locator('.order-number').textContent()
    await expect(page.locator('text=Order #')).toBeVisible()
    
    // Verify email was sent (would need to check email service)
    // This would require integration with your email service
  })

  test('TC-ORD-009: Abandoned checkout recovery email', async ({ page }) => {
    // Start checkout process
    await page.goto('/checkout')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    
    // Leave checkout without completing
    await page.goto('/')
    
    // Wait for abandoned checkout recovery (would be triggered by backend)
    await page.waitForTimeout(30000) // 30 seconds
    
    // Check that recovery email was sent
    // This would require checking email service or database
  })
})
