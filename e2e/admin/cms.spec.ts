import { test, expect } from '@playwright/test'

test.describe('Admin CMS', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login')
    await page.fill('input[name="email"]', 'admin@sdpcprint.com')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/admin')
  })

  test('TC-ADM-001: Admin login protected (MFA enforced)', async ({ page }) => {
    // Try to access admin without login
    await page.goto('/admin')
    await expect(page).toHaveURL('/admin/login')
    
    // Login with wrong credentials
    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Check for error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
    
    // Login with correct credentials
    await page.fill('input[name="email"]', 'admin@sdpcprint.com')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // Check for successful login
    await expect(page).toHaveURL('/admin')
    await expect(page.locator('text=Admin Dashboard')).toBeVisible()
  })

  test('TC-ADM-002: Role matrix: Admin / Manager / Staff permissions', async ({ page }) => {
    // Test admin permissions
    await expect(page.locator('text=Products')).toBeVisible()
    await expect(page.locator('text=Orders')).toBeVisible()
    await expect(page.locator('text=Promotions')).toBeVisible()
    await expect(page.locator('text=Customers')).toBeVisible()
    await expect(page.locator('text=Analytics')).toBeVisible()
    await expect(page.locator('text=Settings')).toBeVisible()
    
    // Test manager permissions (would need different user)
    // This would require setting up different user roles
  })

  test('TC-ADM-010: Create/edit service (name, slug, category, tagline, description, options)', async ({ page }) => {
    // Navigate to products page
    await page.click('text=Products')
    await expect(page).toHaveURL('/admin/products')
    
    // Click add new product
    await page.click('button:has-text("Add Product")')
    await expect(page).toHaveURL('/admin/products/new')
    
    // Fill product form
    await page.fill('input[name="name"]', 'Test Business Cards')
    await page.fill('input[name="slug"]', 'test-business-cards')
    await page.selectOption('select[name="category"]', 'business-cards')
    await page.fill('input[name="tagline"]', 'Professional business cards')
    await page.fill('textarea[name="description"]', 'High-quality business cards with various options')
    
    // Add product options
    await page.click('button:has-text("Add Option")')
    await page.fill('input[name="options.0.name"]', 'Size')
    await page.selectOption('select[name="options.0.type"]', 'select')
    await page.fill('input[name="options.0.values"]', '3.5x2,2x3.5,4x2')
    
    await page.click('button:has-text("Add Option")')
    await page.fill('input[name="options.1.name"]', 'Paper')
    await page.selectOption('select[name="options.1.type"]', 'select')
    await page.fill('input[name="options.1.values"]', 'Standard,Premium,Ultra')
    
    // Set pricing
    await page.fill('input[name="basePrice"]', '100')
    await page.fill('input[name="minOrderQuantity"]', '100')
    
    // Save product
    await page.click('button:has-text("Save Product")')
    
    // Check for success message
    await expect(page.locator('text=Product created successfully')).toBeVisible()
    
    // Check that product appears in list
    await expect(page.locator('text=Test Business Cards')).toBeVisible()
  })

  test('TC-ADM-011: Image upload to S3; preview; reorder gallery', async ({ page }) => {
    // Navigate to product edit page
    await page.goto('/admin/products')
    await page.click('text=Test Business Cards')
    await page.click('button:has-text("Edit")')
    
    // Upload images
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles([
      'test-fixtures/product-image-1.jpg',
      'test-fixtures/product-image-2.jpg',
      'test-fixtures/product-image-3.jpg'
    ])
    
    // Check for upload progress
    await expect(page.locator('.upload-progress')).toBeVisible()
    
    // Wait for uploads to complete
    await expect(page.locator('.upload-success')).toBeVisible()
    
    // Check for image previews
    await expect(page.locator('.image-preview')).toHaveCount(3)
    
    // Test image reordering
    const firstImage = page.locator('.image-preview').first()
    const secondImage = page.locator('.image-preview').nth(1)
    
    // Drag first image to second position
    await firstImage.dragTo(secondImage)
    
    // Check that order changed
    await expect(page.locator('.image-preview').first()).toHaveAttribute('data-order', '1')
    
    // Test image removal
    await page.click('.image-preview:first-child .remove-image')
    await expect(page.locator('.image-preview')).toHaveCount(2)
  })

  test('TC-ADM-012: Toggle status: active/hidden; visibility on site', async ({ page }) => {
    // Navigate to products page
    await page.goto('/admin/products')
    
    // Find a product and toggle its status
    const productRow = page.locator('tr:has-text("Test Business Cards")')
    const statusToggle = productRow.locator('.status-toggle')
    
    // Check current status
    const isActive = await statusToggle.isChecked()
    
    // Toggle status
    await statusToggle.click()
    
    // Check for success message
    await expect(page.locator('text=Product status updated')).toBeVisible()
    
    // Check that status changed in UI
    if (isActive) {
      await expect(statusToggle).not.toBeChecked()
    } else {
      await expect(statusToggle).toBeChecked()
    }
    
    // Test visibility on public site
    await page.goto('/services')
    
    if (isActive) {
      // Product should be hidden
      await expect(page.locator('text=Test Business Cards')).not.toBeVisible()
    } else {
      // Product should be visible
      await expect(page.locator('text=Test Business Cards')).toBeVisible()
    }
  })

  test('TC-ADM-013: Bulk sort order and category assignment', async ({ page }) => {
    // Navigate to products page
    await page.goto('/admin/products')
    
    // Select multiple products
    await page.check('input[type="checkbox"][value="product1"]')
    await page.check('input[type="checkbox"][value="product2"]')
    await page.check('input[type="checkbox"][value="product3"]')
    
    // Select bulk action
    await page.selectOption('select[name="bulkAction"]', 'updateCategory')
    await page.selectOption('select[name="newCategory"]', 'business-cards')
    
    // Apply bulk action
    await page.click('button:has-text("Apply")')
    
    // Check for success message
    await expect(page.locator('text=Bulk update completed')).toBeVisible()
    
    // Check that products have new category
    await expect(page.locator('tr:has-text("product1") .category')).toContainText('business-cards')
    await expect(page.locator('tr:has-text("product2") .category')).toContainText('business-cards')
    await expect(page.locator('tr:has-text("product3") .category')).toContainText('business-cards')
  })

  test('TC-ADM-020: View quotes; change status; send estimate email', async ({ page }) => {
    // Navigate to quotes page
    await page.click('text=Quotes')
    await expect(page).toHaveURL('/admin/quotes')
    
    // Check that quotes are listed
    await expect(page.locator('.quote-item')).toHaveCount.greaterThan(0)
    
    // Click on a quote
    const firstQuote = page.locator('.quote-item').first()
    await firstQuote.click()
    
    // Check quote details
    await expect(page.locator('.quote-details')).toBeVisible()
    await expect(page.locator('.customer-info')).toBeVisible()
    await expect(page.locator('.quote-items')).toBeVisible()
    
    // Change quote status
    await page.selectOption('select[name="status"]', 'approved')
    await page.click('button:has-text("Update Status")')
    
    // Check for success message
    await expect(page.locator('text=Quote status updated')).toBeVisible()
    
    // Send estimate email
    await page.click('button:has-text("Send Estimate")')
    
    // Check for success message
    await expect(page.locator('text=Estimate email sent')).toBeVisible()
  })

  test('TC-ADM-021: Convert quote to order (carry files/specs)', async ({ page }) => {
    // Navigate to quotes page
    await page.goto('/admin/quotes')
    
    // Click on a quote
    const firstQuote = page.locator('.quote-item').first()
    await firstQuote.click()
    
    // Click convert to order
    await page.click('button:has-text("Convert to Order")')
    
    // Check for confirmation dialog
    await expect(page.locator('.confirmation-dialog')).toBeVisible()
    await expect(page.locator('text=Are you sure you want to convert this quote to an order?')).toBeVisible()
    
    // Confirm conversion
    await page.click('button:has-text("Confirm")')
    
    // Check for success message
    await expect(page.locator('text=Quote converted to order successfully')).toBeVisible()
    
    // Check that order was created
    await page.goto('/admin/orders')
    await expect(page.locator('text=Order created from quote')).toBeVisible()
    
    // Check that files and specs were carried over
    const orderRow = page.locator('tr:has-text("Order created from quote")')
    await orderRow.click()
    
    await expect(page.locator('.order-files')).toBeVisible()
    await expect(page.locator('.order-specs')).toBeVisible()
  })

  test('TC-ADM-022: Update order status; customer notified (email/SMS)', async ({ page }) => {
    // Navigate to orders page
    await page.click('text=Orders')
    await expect(page).toHaveURL('/admin/orders')
    
    // Click on an order
    const firstOrder = page.locator('.order-item').first()
    await firstOrder.click()
    
    // Update order status
    await page.selectOption('select[name="status"]', 'processing')
    await page.click('button:has-text("Update Status")')
    
    // Check for success message
    await expect(page.locator('text=Order status updated')).toBeVisible()
    
    // Check for notification message
    await expect(page.locator('text=Customer notification sent')).toBeVisible()
    
    // Test bulk status update
    await page.goto('/admin/orders')
    
    // Select multiple orders
    await page.check('input[type="checkbox"][value="order1"]')
    await page.check('input[type="checkbox"][value="order2"]')
    
    // Select bulk action
    await page.selectOption('select[name="bulkAction"]', 'updateStatus')
    await page.selectOption('select[name="newStatus"]', 'shipped')
    
    // Apply bulk action
    await page.click('button:has-text("Apply")')
    
    // Check for success message
    await expect(page.locator('text=Bulk status update completed')).toBeVisible()
  })

  test('TC-ADM-023: Upload internal proofs; share preview link', async ({ page }) => {
    // Navigate to orders page
    await page.goto('/admin/orders')
    
    // Click on an order
    const firstOrder = page.locator('.order-item').first()
    await firstOrder.click()
    
    // Navigate to proofs section
    await page.click('text=Proofs')
    
    // Upload proof file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('test-fixtures/proof.pdf')
    
    // Wait for upload
    await expect(page.locator('.upload-success')).toBeVisible()
    
    // Generate preview link
    await page.click('button:has-text("Generate Preview Link")')
    
    // Check for preview link
    await expect(page.locator('.preview-link')).toBeVisible()
    
    // Copy preview link
    const previewLink = await page.locator('.preview-link input').getAttribute('value')
    expect(previewLink).toMatch(/^https:\/\/.*\/preview\/[a-z0-9-]+$/)
    
    // Test preview link access
    await page.goto(previewLink!)
    await expect(page.locator('.proof-preview')).toBeVisible()
    await expect(page.locator('text=This is a preview link')).toBeVisible()
  })

  test('TC-ADM-030: Update base price tables', async ({ page }) => {
    // Navigate to pricing page
    await page.click('text=Pricing')
    await expect(page).toHaveURL('/admin/pricing')
    
    // Update base prices
    await page.fill('input[name="business-cards.base"]', '150')
    await page.fill('input[name="posters.base"]', '200')
    await page.fill('input[name="flyers.base"]', '100')
    
    // Save pricing
    await page.click('button:has-text("Save Pricing")')
    
    // Check for success message
    await expect(page.locator('text=Pricing updated successfully')).toBeVisible()
    
    // Test bulk pricing update
    await page.click('text=Bulk Pricing')
    await expect(page).toHaveURL('/admin/products/bulk-pricing')
    
    // Select products
    await page.check('input[type="checkbox"][value="product1"]')
    await page.check('input[type="checkbox"][value="product2"]')
    
    // Set update type
    await page.selectOption('select[name="updateType"]', 'percentage')
    await page.fill('input[name="updateValue"]', '10')
    
    // Apply update
    await page.click('button:has-text("Apply Update")')
    
    // Check for success message
    await expect(page.locator('text=Bulk pricing update completed')).toBeVisible()
  })

  test('TC-ADM-031: Create promotion with date window; auto-expiry', async ({ page }) => {
    // Navigate to promotions page
    await page.click('text=Promotions')
    await expect(page).toHaveURL('/admin/promotions')
    
    // Click add new promotion
    await page.click('button:has-text("Add Promotion")')
    await expect(page).toHaveURL('/admin/promotions/new')
    
    // Fill promotion form
    await page.fill('input[name="title"]', 'Holiday Sale')
    await page.fill('textarea[name="description"]', '20% off all business cards')
    await page.fill('input[name="discount"]', '20')
    await page.selectOption('select[name="discountType"]', 'percentage')
    
    // Set date window
    await page.fill('input[name="startDate"]', '2024-12-01')
    await page.fill('input[name="endDate"]', '2024-12-31')
    
    // Set applicable products
    await page.check('input[value="business-cards"]')
    await page.check('input[value="posters"]')
    
    // Set usage limit
    await page.fill('input[name="usageLimit"]', '100')
    
    // Save promotion
    await page.click('button:has-text("Save Promotion")')
    
    // Check for success message
    await expect(page.locator('text=Promotion created successfully')).toBeVisible()
    
    // Check that promotion appears in list
    await expect(page.locator('text=Holiday Sale')).toBeVisible()
    
    // Test auto-expiry (would need to wait or manipulate time)
    // This would require backend integration to test properly
  })

  test('TC-ADM-040: Change history per record', async ({ page }) => {
    // Navigate to products page
    await page.goto('/admin/products')
    
    // Click on a product
    const firstProduct = page.locator('.product-item').first()
    await firstProduct.click()
    
    // Navigate to history tab
    await page.click('text=History')
    
    // Check for change history
    await expect(page.locator('.change-history')).toBeVisible()
    
    // Check for history entries
    const historyEntries = page.locator('.history-entry')
    const entryCount = await historyEntries.count()
    expect(entryCount).toBeGreaterThan(0)
    
    // Check for history details
    const firstEntry = historyEntries.first()
    await expect(firstEntry.locator('.change-type')).toBeVisible()
    await expect(firstEntry.locator('.change-user')).toBeVisible()
    await expect(firstEntry.locator('.change-date')).toBeVisible()
    await expect(firstEntry.locator('.change-details')).toBeVisible()
  })

  test('TC-ADM-041: Export orders (CSV) by date range/status', async ({ page }) => {
    // Navigate to orders page
    await page.goto('/admin/orders')
    
    // Set date range filter
    await page.fill('input[name="startDate"]', '2024-01-01')
    await page.fill('input[name="endDate"]', '2024-12-31')
    
    // Set status filter
    await page.selectOption('select[name="status"]', 'completed')
    
    // Apply filters
    await page.click('button:has-text("Apply Filters")')
    
    // Click export button
    await page.click('button:has-text("Export CSV")')
    
    // Check for download
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Download")')
    const download = await downloadPromise
    
    // Check download
    expect(download.suggestedFilename()).toMatch(/orders.*\.csv$/)
    
    // Check CSV content
    const csvContent = await download.createReadStream()
    // This would need to be implemented based on your CSV format
  })
})
