import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('UAT Scenarios - End-to-End', () => {
  test('TC-UAT-001: New user registers, verifies email, verifies phone via OTP, logs in', async ({ page }) => {
    // Step 1: Register new user
    await page.goto('/signup')
    
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="password"]', 'SecurePassword123!')
    await page.fill('input[name="confirmPassword"]', 'SecurePassword123!')
    
    await page.click('button[type="submit"]')
    
    // Check for verification email sent
    await expect(page.locator('text=Verification email sent')).toBeVisible()
    await expect(page).toHaveURL(/.*verify-email/)
    
    // Step 2: Verify email (simulate clicking verification link)
    await page.goto('/auth/verify-email?token=test-verification-token')
    await expect(page.locator('text=Email verified successfully')).toBeVisible()
    
    // Step 3: Verify phone via OTP
    await page.goto('/auth/verify-phone')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button[type="submit"]')
    
    // Check for OTP sent message
    await expect(page.locator('text=OTP sent to your phone')).toBeVisible()
    
    // Enter OTP (simulate receiving SMS)
    await page.fill('input[name="otp"]', '123456')
    await page.click('button[type="submit"]')
    
    // Check for phone verification success
    await expect(page.locator('text=Phone verified successfully')).toBeVisible()
    
    // Step 4: Login
    await page.goto('/login')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="password"]', 'SecurePassword123!')
    await page.click('button[type="submit"]')
    
    // Check for successful login
    await expect(page).toHaveURL('/')
    await expect(page.locator('text=Welcome, John')).toBeVisible()
  })

  test('TC-UAT-002: Browses services, selects Visiting Cards, configures options, requests quote with 2 files', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="password"]', 'SecurePassword123!')
    await page.click('button[type="submit"]')
    
    // Step 1: Browse services
    await page.goto('/services')
    await expect(page.locator('text=Our Services')).toBeVisible()
    
    // Filter by category
    await page.click('.category-filter button:has-text("Business Cards")')
    await expect(page.locator('.service-card')).toBeVisible()
    
    // Step 2: Select Visiting Cards service
    await page.click('text=Business Cards')
    await expect(page).toHaveURL(/.*services\/business-cards/)
    
    // Check service details
    await expect(page.locator('text=Business Cards')).toBeVisible()
    await expect(page.locator('.service-options')).toBeVisible()
    
    // Step 3: Configure options
    await page.selectOption('select[name="size"]', '3.5x2')
    await page.selectOption('select[name="paper"]', 'premium')
    await page.selectOption('select[name="finish"]', 'glossy')
    await page.fill('input[name="quantity"]', '1000')
    
    // Check price preview updates
    await expect(page.locator('.price-preview')).toBeVisible()
    const price = await page.locator('.price-preview .price').textContent()
    expect(price).toMatch(/₹\d+/)
    
    // Step 4: Request quote
    await page.click('button:has-text("Get Quote")')
    await expect(page).toHaveURL(/.*quote/)
    
    // Fill quote form
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="company"]', 'Test Company')
    await page.click('button:has-text("Next")')
    
    // Verify service configuration is pre-filled
    await expect(page.locator('text=Business Cards')).toBeVisible()
    await expect(page.locator('text=3.5x2')).toBeVisible()
    await expect(page.locator('text=Premium')).toBeVisible()
    await expect(page.locator('text=Glossy')).toBeVisible()
    await expect(page.locator('input[name="quantity"][value="1000"]')).toBeVisible()
    
    await page.click('button:has-text("Next")')
    
    // Step 5: Upload 2 files
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles([
      path.join(__dirname, '../fixtures/design-1.pdf'),
      path.join(__dirname, '../fixtures/design-2.pdf')
    ])
    
    // Check for upload success
    await expect(page.locator('.upload-success')).toBeVisible()
    await expect(page.locator('.file-item')).toHaveCount(2)
    
    await page.click('button:has-text("Next")')
    
    // Step 6: Set deadline
    await page.fill('input[name="deadline"]', '2024-02-15')
    await page.selectOption('select[name="urgency"]', 'normal')
    await page.fill('textarea[name="notes"]', 'Please deliver to our office')
    await page.click('button:has-text("Next")')
    
    // Step 7: Review and submit
    await expect(page.locator('text=Review Your Quote')).toBeVisible()
    await expect(page.locator('text=John Doe')).toBeVisible()
    await expect(page.locator('text=Business Cards')).toBeVisible()
    await expect(page.locator('text=1000')).toBeVisible()
    
    await page.click('button:has-text("Submit Quote")')
    
    // Check for success
    await expect(page.locator('text=Quote submitted successfully')).toBeVisible()
    await expect(page.locator('.quote-number')).toBeVisible()
  })

  test('TC-UAT-003: Places an order for Posters, uploads 200MB PDF, pays via Razorpay, receives confirmations', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="password"]', 'SecurePassword123!')
    await page.click('button[type="submit"]')
    
    // Step 1: Select Posters service
    await page.goto('/services/posters')
    await expect(page.locator('text=Posters')).toBeVisible()
    
    // Configure poster options
    await page.selectOption('select[name="size"]', 'A1')
    await page.selectOption('select[name="paper"]', 'glossy')
    await page.selectOption('select[name="finish"]', 'laminated')
    await page.fill('input[name="quantity"]', '50')
    
    // Add to cart
    await page.click('button:has-text("Add to Cart")')
    await expect(page.locator('text=Added to cart')).toBeVisible()
    
    // Step 2: Go to checkout
    await page.click('.cart-icon')
    await page.click('button:has-text("Checkout")')
    await expect(page).toHaveURL('/checkout')
    
    // Step 3: Fill checkout form
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="address"]', '123 Main Street')
    await page.fill('input[name="city"]', 'Mumbai')
    await page.fill('input[name="state"]', 'Maharashtra')
    await page.fill('input[name="pincode"]', '400001')
    
    // Step 4: Upload large file (200MB)
    const fileInput = page.locator('input[type="file"]')
    
    // Mock large file size
    await page.evaluate(() => {
      Object.defineProperty(File.prototype, 'size', {
        value: 200 * 1024 * 1024 // 200MB
      })
    })
    
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/large-poster.pdf'))
    
    // Check for upload progress
    await expect(page.locator('.upload-progress')).toBeVisible()
    await expect(page.locator('.progress-percentage')).toBeVisible()
    
    // Wait for upload to complete
    await expect(page.locator('.upload-success')).toBeVisible({ timeout: 30000 })
    
    // Step 5: Select payment method
    await page.click('input[value="razorpay"]')
    
    // Step 6: Place order
    await page.click('button:has-text("Place Order")')
    
    // Check for Razorpay checkout
    await expect(page.locator('.razorpay-checkout')).toBeVisible()
    
    // Step 7: Mock successful payment
    await page.evaluate(() => {
      window.razorpaySuccessCallback({
        razorpay_payment_id: 'pay_test123',
        razorpay_order_id: 'order_test123',
        razorpay_signature: 'test_signature'
      })
    })
    
    // Wait for payment processing
    await page.waitForTimeout(2000)
    
    // Step 8: Check for success page
    await expect(page).toHaveURL(/.*order-success/)
    await expect(page.locator('text=Payment successful')).toBeVisible()
    await expect(page.locator('text=Order confirmed')).toBeVisible()
    await expect(page.locator('.order-number')).toBeVisible()
    
    // Step 9: Check for confirmations
    await expect(page.locator('text=Order confirmation email sent')).toBeVisible()
    await expect(page.locator('text=SMS confirmation sent')).toBeVisible()
    
    // Step 10: Verify order in account
    await page.goto('/dashboard')
    await page.click('text=My Orders')
    
    await expect(page.locator('text=Order #')).toBeVisible()
    await expect(page.locator('text=Posters')).toBeVisible()
    await expect(page.locator('text=Confirmed')).toBeVisible()
  })

  test('TC-UAT-004: Admin adds new service (T-Shirt Printing) with images; it appears on site', async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login')
    await page.fill('input[name="email"]', 'admin@sdpcprint.com')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/admin')
    
    // Step 1: Navigate to products
    await page.click('text=Products')
    await expect(page).toHaveURL('/admin/products')
    
    // Step 2: Add new product
    await page.click('button:has-text("Add Product")')
    await expect(page).toHaveURL('/admin/products/new')
    
    // Step 3: Fill product details
    await page.fill('input[name="name"]', 'T-Shirt Printing')
    await page.fill('input[name="slug"]', 't-shirt-printing')
    await page.selectOption('select[name="category"]', 'custom')
    await page.fill('input[name="tagline"]', 'Custom printed t-shirts')
    await page.fill('textarea[name="description"]', 'High-quality custom t-shirt printing with various design options')
    
    // Add product options
    await page.click('button:has-text("Add Option")')
    await page.fill('input[name="options.0.name"]', 'Size')
    await page.selectOption('select[name="options.0.type"]', 'select')
    await page.fill('input[name="options.0.values"]', 'S,M,L,XL,XXL')
    
    await page.click('button:has-text("Add Option")')
    await page.fill('input[name="options.1.name"]', 'Color')
    await page.selectOption('select[name="options.1.type"]', 'select')
    await page.fill('input[name="options.1.values"]', 'White,Black,Red,Blue,Green')
    
    // Set pricing
    await page.fill('input[name="basePrice"]', '299')
    await page.fill('input[name="minOrderQuantity"]', '10')
    
    // Step 4: Upload images
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles([
      path.join(__dirname, '../fixtures/t-shirt-1.jpg'),
      path.join(__dirname, '../fixtures/t-shirt-2.jpg'),
      path.join(__dirname, '../fixtures/t-shirt-3.jpg')
    ])
    
    // Wait for uploads
    await expect(page.locator('.upload-success')).toBeVisible()
    await expect(page.locator('.image-preview')).toHaveCount(3)
    
    // Step 5: Set as active
    await page.check('input[name="isActive"]')
    
    // Step 6: Save product
    await page.click('button:has-text("Save Product")')
    
    // Check for success
    await expect(page.locator('text=Product created successfully')).toBeVisible()
    
    // Step 7: Verify product appears in admin list
    await expect(page.locator('text=T-Shirt Printing')).toBeVisible()
    
    // Step 8: Check product appears on public site
    await page.goto('/services')
    
    // Filter by custom category
    await page.click('.category-filter button:has-text("Custom")')
    
    // Check that T-Shirt Printing appears
    await expect(page.locator('text=T-Shirt Printing')).toBeVisible()
    
    // Step 9: Test product detail page
    await page.click('text=T-Shirt Printing')
    await expect(page).toHaveURL(/.*services\/t-shirt-printing/)
    
    // Check product details
    await expect(page.locator('text=T-Shirt Printing')).toBeVisible()
    await expect(page.locator('text=Custom printed t-shirts')).toBeVisible()
    await expect(page.locator('text=Size')).toBeVisible()
    await expect(page.locator('text=Color')).toBeVisible()
    
    // Check images
    await expect(page.locator('.service-gallery img')).toHaveCount(3)
    
    // Check pricing
    await expect(page.locator('.price-preview')).toBeVisible()
    await expect(page.locator('text=₹299')).toBeVisible()
  })

  test('TC-UAT-005: Admin converts a quote to order; customer notified; files preserved', async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login')
    await page.fill('input[name="email"]', 'admin@sdpcprint.com')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/admin')
    
    // Step 1: Navigate to quotes
    await page.click('text=Quotes')
    await expect(page).toHaveURL('/admin/quotes')
    
    // Step 2: Find a quote
    await expect(page.locator('.quote-item')).toHaveCount.greaterThan(0)
    const firstQuote = page.locator('.quote-item').first()
    await firstQuote.click()
    
    // Step 3: Review quote details
    await expect(page.locator('.quote-details')).toBeVisible()
    await expect(page.locator('.customer-info')).toBeVisible()
    await expect(page.locator('.quote-items')).toBeVisible()
    await expect(page.locator('.quote-files')).toBeVisible()
    
    // Step 4: Convert quote to order
    await page.click('button:has-text("Convert to Order")')
    
    // Check for confirmation dialog
    await expect(page.locator('.confirmation-dialog')).toBeVisible()
    await expect(page.locator('text=Are you sure you want to convert this quote to an order?')).toBeVisible()
    
    // Confirm conversion
    await page.click('button:has-text("Confirm")')
    
    // Check for success
    await expect(page.locator('text=Quote converted to order successfully')).toBeVisible()
    
    // Step 5: Verify order was created
    await page.goto('/admin/orders')
    await expect(page.locator('text=Order created from quote')).toBeVisible()
    
    // Click on the new order
    const newOrder = page.locator('tr:has-text("Order created from quote")')
    await newOrder.click()
    
    // Step 6: Verify order details
    await expect(page.locator('.order-details')).toBeVisible()
    await expect(page.locator('.customer-info')).toBeVisible()
    await expect(page.locator('.order-items')).toBeVisible()
    
    // Step 7: Verify files were preserved
    await expect(page.locator('.order-files')).toBeVisible()
    const fileCount = await page.locator('.file-item').count()
    expect(fileCount).toBeGreaterThan(0)
    
    // Step 8: Check customer notification
    await expect(page.locator('text=Customer notification sent')).toBeVisible()
    
    // Step 9: Verify customer can see the order
    // Switch to customer view (would need separate browser context)
    const customerPage = await page.context().newPage()
    await customerPage.goto('/login')
    await customerPage.fill('input[name="email"]', 'john.doe@example.com')
    await customerPage.fill('input[name="password"]', 'SecurePassword123!')
    await customerPage.click('button[type="submit"]')
    
    await customerPage.goto('/dashboard')
    await customerPage.click('text=My Orders')
    
    // Check that order appears in customer's order list
    await expect(customerPage.locator('text=Order #')).toBeVisible()
    await expect(customerPage.locator('text=Confirmed')).toBeVisible()
    
    await customerPage.close()
  })

  test('TC-UAT-006: Complete customer journey from discovery to order completion', async ({ page }) => {
    // Step 1: Discover service through search
    await page.goto('/')
    await page.fill('input[placeholder*="search" i]', 'business cards')
    await page.keyboard.press('Enter')
    
    // Check search results
    await expect(page.locator('.search-results')).toBeVisible()
    await expect(page.locator('text=Business Cards')).toBeVisible()
    
    // Step 2: Browse services
    await page.goto('/services')
    await page.click('.category-filter button:has-text("Business Cards")')
    
    // Step 3: Select service and configure
    await page.click('text=Business Cards')
    await page.selectOption('select[name="size"]', '3.5x2')
    await page.selectOption('select[name="paper"]', 'premium')
    await page.fill('input[name="quantity"]', '500')
    
    // Step 4: Add to cart
    await page.click('button:has-text("Add to Cart")')
    await expect(page.locator('text=Added to cart')).toBeVisible()
    
    // Step 5: Proceed to checkout
    await page.click('.cart-icon')
    await page.click('button:has-text("Checkout")')
    
    // Step 6: Login/Register
    await page.click('text=Login')
    await page.fill('input[name="email"]', 'newuser@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Step 7: Complete checkout
    await page.fill('input[name="name"]', 'New User')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="address"]', '456 New Street')
    await page.fill('input[name="city"]', 'Delhi')
    await page.fill('input[name="pincode"]', '110001')
    
    // Upload file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/design.pdf'))
    await expect(page.locator('.upload-success')).toBeVisible()
    
    // Select payment
    await page.click('input[value="razorpay"]')
    await page.click('button:has-text("Place Order")')
    
    // Mock payment success
    await page.evaluate(() => {
      window.razorpaySuccessCallback({
        razorpay_payment_id: 'pay_test456',
        razorpay_order_id: 'order_test456',
        razorpay_signature: 'test_signature'
      })
    })
    
    // Step 8: Verify success
    await expect(page).toHaveURL(/.*order-success/)
    await expect(page.locator('text=Payment successful')).toBeVisible()
    await expect(page.locator('.order-number')).toBeVisible()
    
    // Step 9: Check order in account
    await page.goto('/dashboard')
    await page.click('text=My Orders')
    await expect(page.locator('text=Order #')).toBeVisible()
    await expect(page.locator('text=Business Cards')).toBeVisible()
  })
})
