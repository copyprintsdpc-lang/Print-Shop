import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('Quote Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quote')
  })

  test('TC-QUOTE-001: 5-step quote flow happy path', async ({ page }) => {
    // Step 1: Contact Information
    await expect(page.locator('.quote-step[data-step="1"]')).toBeVisible()
    
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="company"]', 'Test Company')
    
    await page.click('button:has-text("Next")')
    
    // Step 2: Project Specifications
    await expect(page.locator('.quote-step[data-step="2"]')).toBeVisible()
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '1000')
    await page.selectOption('select[name="size"]', '3.5x2')
    await page.selectOption('select[name="paper"]', 'premium')
    await page.selectOption('select[name="finish"]', 'glossy')
    await page.fill('textarea[name="specialRequirements"]', 'Need spot UV on logo')
    
    await page.click('button:has-text("Next")')
    
    // Step 3: File Upload
    await expect(page.locator('.quote-step[data-step="3"]')).toBeVisible()
    
    // Upload a test file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file.pdf'))
    
    // Wait for upload to complete
    await expect(page.locator('.upload-success')).toBeVisible()
    
    await page.click('button:has-text("Next")')
    
    // Step 4: Deadline
    await expect(page.locator('.quote-step[data-step="4"]')).toBeVisible()
    
    await page.fill('input[name="deadline"]', '2024-02-15')
    await page.selectOption('select[name="urgency"]', 'normal')
    await page.fill('textarea[name="notes"]', 'Please deliver to our office')
    
    await page.click('button:has-text("Next")')
    
    // Step 5: Review & Submit
    await expect(page.locator('.quote-step[data-step="5"]')).toBeVisible()
    
    // Review all information
    await expect(page.locator('text=John Doe')).toBeVisible()
    await expect(page.locator('text=john@example.com')).toBeVisible()
    await expect(page.locator('text=Business Cards')).toBeVisible()
    await expect(page.locator('text=1000')).toBeVisible()
    
    // Submit quote
    await page.click('button:has-text("Submit Quote")')
    
    // Check for success message
    await expect(page.locator('text=Quote submitted successfully')).toBeVisible()
    
    // Check for quote number
    await expect(page.locator('.quote-number')).toBeVisible()
  })

  test('TC-QUOTE-002: Validation on each step', async ({ page }) => {
    // Step 1: Try to proceed without required fields
    await page.click('button:has-text("Next")')
    
    // Check for validation errors
    await expect(page.locator('.error-message')).toBeVisible()
    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Phone is required')).toBeVisible()
    
    // Fill invalid email
    await page.fill('input[name="email"]', 'invalid-email')
    await page.click('button:has-text("Next")')
    
    // Check for email validation error
    await expect(page.locator('text=Please enter a valid email')).toBeVisible()
    
    // Fill valid data
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    
    await page.click('button:has-text("Next")')
    
    // Step 2: Try to proceed without service selection
    await page.click('button:has-text("Next")')
    
    // Check for service validation error
    await expect(page.locator('text=Please select a service')).toBeVisible()
    
    // Fill valid specifications
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    
    await page.click('button:has-text("Next")')
    
    // Step 3: Try to proceed without file upload
    await page.click('button:has-text("Next")')
    
    // Check for file validation error
    await expect(page.locator('text=Please upload at least one file')).toBeVisible()
  })

  test('TC-QUOTE-003: File upload to S3 via signed URL shows progress', async ({ page }) => {
    // Navigate to file upload step
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    // Check for file upload area
    await expect(page.locator('.file-upload-area')).toBeVisible()
    
    // Upload a large file (simulate 200MB)
    const largeFile = path.join(__dirname, '../fixtures/large-file.pdf')
    const fileInput = page.locator('input[type="file"]')
    
    // Mock file size for testing
    await page.evaluate(() => {
      Object.defineProperty(File.prototype, 'size', {
        value: 200 * 1024 * 1024 // 200MB
      })
    })
    
    await fileInput.setInputFiles(largeFile)
    
    // Check for upload progress
    await expect(page.locator('.upload-progress')).toBeVisible()
    
    // Check for progress percentage
    await expect(page.locator('.progress-percentage')).toBeVisible()
    
    // Wait for upload to complete
    await expect(page.locator('.upload-success')).toBeVisible({ timeout: 30000 })
    
    // Check for file details
    await expect(page.locator('.file-name')).toBeVisible()
    await expect(page.locator('.file-size')).toBeVisible()
  })

  test('TC-QUOTE-004: Network drop mid-upload resume/retry UX', async ({ page }) => {
    // Navigate to file upload step
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    // Start file upload
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file.pdf'))
    
    // Simulate network failure
    await page.route('**/api/upload/**', route => route.abort())
    
    // Check for upload error
    await expect(page.locator('.upload-error')).toBeVisible()
    
    // Check for retry button
    await expect(page.locator('button:has-text("Retry Upload")')).toBeVisible()
    
    // Restore network
    await page.unroute('**/api/upload/**')
    
    // Click retry
    await page.click('button:has-text("Retry Upload")')
    
    // Check for successful upload
    await expect(page.locator('.upload-success')).toBeVisible()
  })

  test('TC-QUOTE-005: Multiple files attach; remove/replace works', async ({ page }) => {
    // Navigate to file upload step
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    // Upload multiple files
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles([
      path.join(__dirname, '../fixtures/test-file-1.pdf'),
      path.join(__dirname, '../fixtures/test-file-2.pdf')
    ])
    
    // Check that both files are shown
    await expect(page.locator('.file-item')).toHaveCount(2)
    
    // Check file names
    await expect(page.locator('.file-item:has-text("test-file-1.pdf")')).toBeVisible()
    await expect(page.locator('.file-item:has-text("test-file-2.pdf")')).toBeVisible()
    
    // Remove first file
    await page.click('.file-item:first-child .remove-file')
    await expect(page.locator('.file-item')).toHaveCount(1)
    
    // Add another file
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file-3.pdf'))
    await expect(page.locator('.file-item')).toHaveCount(2)
    
    // Replace a file
    const replaceButton = page.locator('.file-item:first-child .replace-file')
    await replaceButton.click()
    
    // Select new file
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file-4.pdf'))
    
    // Check that file was replaced
    await expect(page.locator('.file-item:has-text("test-file-4.pdf")')).toBeVisible()
  })

  test('TC-QUOTE-006: Confirmation page + email receipt', async ({ page }) => {
    // Complete the quote flow
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file.pdf'))
    await page.click('button:has-text("Next")')
    
    await page.fill('input[name="deadline"]', '2024-02-15')
    await page.click('button:has-text("Next")')
    
    await page.click('button:has-text("Submit Quote")')
    
    // Check for confirmation page
    await expect(page).toHaveURL(/.*quote-confirmation/)
    
    // Check for success message
    await expect(page.locator('text=Quote submitted successfully')).toBeVisible()
    
    // Check for quote number
    const quoteNumber = page.locator('.quote-number')
    await expect(quoteNumber).toBeVisible()
    
    // Check for email confirmation message
    await expect(page.locator('text=Confirmation email sent')).toBeVisible()
    
    // Check for quote details
    await expect(page.locator('.quote-details')).toBeVisible()
    await expect(page.locator('text=John Doe')).toBeVisible()
    await expect(page.locator('text=Business Cards')).toBeVisible()
    
    // Check for next steps
    await expect(page.locator('.next-steps')).toBeVisible()
    await expect(page.locator('text=We will contact you within 24 hours')).toBeVisible()
  })

  test('TC-QUOTE-007: Rate limit: max quotes per user per hour/day', async ({ page }) => {
    // Complete a quote
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file.pdf'))
    await page.click('button:has-text("Next")')
    
    await page.fill('input[name="deadline"]', '2024-02-15')
    await page.click('button:has-text("Next")')
    
    await page.click('button:has-text("Submit Quote")')
    
    // Wait for success
    await expect(page.locator('text=Quote submitted successfully')).toBeVisible()
    
    // Try to submit another quote immediately
    await page.goto('/quote')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'posters')
    await page.fill('input[name="quantity"]', '50')
    await page.click('button:has-text("Next")')
    
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file.pdf'))
    await page.click('button:has-text("Next")')
    
    await page.fill('input[name="deadline"]', '2024-02-20')
    await page.click('button:has-text("Next")')
    
    await page.click('button:has-text("Submit Quote")')
    
    // Check for rate limit message
    await expect(page.locator('text=Rate limit exceeded')).toBeVisible()
    await expect(page.locator('text=Please try again later')).toBeVisible()
  })

  test('TC-QUOTE-008: Spam protection: honeypot/captcha', async ({ page }) => {
    // Check for honeypot field (hidden)
    const honeypot = page.locator('input[name="website"]')
    await expect(honeypot).toBeHidden()
    
    // Fill honeypot field (should trigger spam protection)
    await honeypot.fill('spam@example.com')
    
    // Complete quote normally
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file.pdf'))
    await page.click('button:has-text("Next")')
    
    await page.fill('input[name="deadline"]', '2024-02-15')
    await page.click('button:has-text("Next")')
    
    await page.click('button:has-text("Submit Quote")')
    
    // Check for spam protection message
    await expect(page.locator('text=Submission blocked')).toBeVisible()
    
    // Test with captcha if present
    const captcha = page.locator('.captcha')
    const hasCaptcha = await captcha.isVisible()
    
    if (hasCaptcha) {
      // Complete captcha
      await page.click('.captcha-checkbox')
      await page.waitForTimeout(2000) // Wait for captcha to complete
      
      // Try to submit again
      await page.click('button:has-text("Submit Quote")')
      
      // Should work now
      await expect(page.locator('text=Quote submitted successfully')).toBeVisible()
    }
  })
})
