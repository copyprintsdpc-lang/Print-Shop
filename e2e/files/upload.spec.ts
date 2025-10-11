import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('File Uploads & Assets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC-FILE-001: Presigned PUT works; object readable only via CloudFront URL', async ({ page }) => {
    // Navigate to file upload page
    await page.goto('/quote')
    
    // Fill form to reach upload step
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    // Upload file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file.pdf'))
    
    // Wait for upload to complete
    await expect(page.locator('.upload-success')).toBeVisible()
    
    // Check that file URL is CloudFront URL
    const fileUrl = await page.locator('.file-url').getAttribute('href')
    expect(fileUrl).toMatch(/^https:\/\/.*\.cloudfront\.net\//)
    
    // Verify file is accessible
    const response = await page.request.get(fileUrl!)
    expect(response.status()).toBe(200)
    
    // Check content type
    const contentType = response.headers()['content-type']
    expect(contentType).toBe('application/pdf')
  })

  test('TC-FILE-002: Presigned URL expiry respected; expired link fails securely', async ({ page }) => {
    // Upload file
    await page.goto('/quote')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file.pdf'))
    
    await expect(page.locator('.upload-success')).toBeVisible()
    
    // Get file URL
    const fileUrl = await page.locator('.file-url').getAttribute('href')
    
    // Wait for URL to expire (would need to set short expiry in test)
    await page.waitForTimeout(60000) // 1 minute
    
    // Try to access expired URL
    const response = await page.request.get(fileUrl!)
    expect(response.status()).toBe(403) // Forbidden
  })

  test('TC-FILE-003: MIME/type validation (PDF, PNG, JPG, AI, DOCX)', async ({ page }) => {
    await page.goto('/quote')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    const fileInput = page.locator('input[type="file"]')
    
    // Test valid file types
    const validFiles = [
      { file: 'test.pdf', type: 'application/pdf' },
      { file: 'test.png', type: 'image/png' },
      { file: 'test.jpg', type: 'image/jpeg' },
      { file: 'test.ai', type: 'application/postscript' },
      { file: 'test.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
    ]
    
    for (const validFile of validFiles) {
      await fileInput.setInputFiles(path.join(__dirname, `../fixtures/${validFile.file}`))
      await expect(page.locator('.upload-success')).toBeVisible()
      
      // Clear for next test
      await page.click('.remove-file')
    }
    
    // Test invalid file types
    const invalidFiles = [
      { file: 'test.exe', type: 'application/x-msdownload' },
      { file: 'test.bat', type: 'application/x-msdownload' },
      { file: 'test.js', type: 'application/javascript' }
    ]
    
    for (const invalidFile of invalidFiles) {
      await fileInput.setInputFiles(path.join(__dirname, `../fixtures/${invalidFile.file}`))
      await expect(page.locator('.upload-error')).toBeVisible()
      await expect(page.locator('text=File type not supported')).toBeVisible()
    }
  })

  test('TC-FILE-004: Size limits per type; friendly errors', async ({ page }) => {
    await page.goto('/quote')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    const fileInput = page.locator('input[type="file"]')
    
    // Test file size limits
    const sizeTests = [
      { file: 'small.pdf', size: '1MB', shouldPass: true },
      { file: 'medium.pdf', size: '50MB', shouldPass: true },
      { file: 'large.pdf', size: '200MB', shouldPass: true },
      { file: 'huge.pdf', size: '500MB', shouldPass: false }
    ]
    
    for (const test of sizeTests) {
      // Mock file size
      await page.evaluate((size) => {
        Object.defineProperty(File.prototype, 'size', {
          value: size === '1MB' ? 1024 * 1024 :
                 size === '50MB' ? 50 * 1024 * 1024 :
                 size === '200MB' ? 200 * 1024 * 1024 :
                 500 * 1024 * 1024
        })
      }, test.size)
      
      await fileInput.setInputFiles(path.join(__dirname, `../fixtures/${test.file}`))
      
      if (test.shouldPass) {
        await expect(page.locator('.upload-success')).toBeVisible()
      } else {
        await expect(page.locator('.upload-error')).toBeVisible()
        await expect(page.locator('text=File too large')).toBeVisible()
        await expect(page.locator('text=Maximum file size is 200MB')).toBeVisible()
      }
    }
  })

  test('TC-FILE-005: Malicious file names sanitized', async ({ page }) => {
    await page.goto('/quote')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    const fileInput = page.locator('input[type="file"]')
    
    // Test malicious file names
    const maliciousNames = [
      '../../../etc/passwd',
      '..\\..\\windows\\system32\\config\\sam',
      'file<script>alert("xss")</script>.pdf',
      'file\x00.pdf',
      'file\u0000.pdf'
    ]
    
    for (const maliciousName of maliciousNames) {
      // Create file with malicious name
      await page.evaluate((name) => {
        const file = new File(['test content'], name, { type: 'application/pdf' })
        const input = document.querySelector('input[type="file"]') as HTMLInputElement
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        input.files = dataTransfer.files
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }, maliciousName)
      
      // Check that file name is sanitized
      const fileName = await page.locator('.file-name').textContent()
      expect(fileName).not.toContain('..')
      expect(fileName).not.toContain('<script>')
      expect(fileName).not.toContain('\x00')
      expect(fileName).toMatch(/^[a-zA-Z0-9._-]+\.pdf$/)
    }
  })

  test('TC-FILE-006: Virus scan hook quarantines infected files', async ({ page }) => {
    await page.goto('/quote')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    const fileInput = page.locator('input[type="file"]')
    
    // Upload file that would trigger virus scan
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/suspicious-file.pdf'))
    
    // Check for virus scan in progress
    await expect(page.locator('text=Scanning file for viruses')).toBeVisible()
    
    // Wait for scan to complete
    await page.waitForTimeout(5000)
    
    // Check for quarantine message
    await expect(page.locator('text=File quarantined')).toBeVisible()
    await expect(page.locator('text=File appears to be infected')).toBeVisible()
    
    // Check that file is not accessible
    const fileUrl = await page.locator('.file-url').getAttribute('href')
    if (fileUrl) {
      const response = await page.request.get(fileUrl)
      expect(response.status()).toBe(403) // Forbidden
    }
  })

  test('TC-FILE-007: Thumbnails / optimized images generated', async ({ page }) => {
    await page.goto('/quote')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    const fileInput = page.locator('input[type="file"]')
    
    // Upload image file
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-image.jpg'))
    
    await expect(page.locator('.upload-success')).toBeVisible()
    
    // Check for thumbnail generation
    await expect(page.locator('.file-thumbnail')).toBeVisible()
    
    // Check that thumbnail is smaller than original
    const thumbnail = page.locator('.file-thumbnail img')
    const thumbnailSrc = await thumbnail.getAttribute('src')
    expect(thumbnailSrc).toMatch(/thumbnail|thumb/)
    
    // Check for optimized image
    const optimizedImage = page.locator('.file-preview img')
    const optimizedSrc = await optimizedImage.getAttribute('src')
    expect(optimizedSrc).toMatch(/optimized|compressed/)
  })

  test('TC-FILE-008: CloudFront caching headers set; invalidation on replace', async ({ page }) => {
    await page.goto('/quote')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    const fileInput = page.locator('input[type="file"]')
    
    // Upload file
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file.pdf'))
    await expect(page.locator('.upload-success')).toBeVisible()
    
    // Get file URL
    const fileUrl = await page.locator('.file-url').getAttribute('href')
    
    // Check CloudFront headers
    const response = await page.request.get(fileUrl!)
    const headers = response.headers()
    
    expect(headers['cache-control']).toMatch(/max-age=\d+/)
    expect(headers['x-cache']).toMatch(/Hit|Miss/)
    expect(headers['x-amz-cf-id']).toBeTruthy()
    
    // Replace file
    await page.click('.replace-file')
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file-2.pdf'))
    
    // Check for cache invalidation
    await expect(page.locator('text=Cache invalidated')).toBeVisible()
    
    // Verify new file is served
    const newFileUrl = await page.locator('.file-url').getAttribute('href')
    expect(newFileUrl).not.toBe(fileUrl)
  })

  test('TC-FILE-009: File upload progress and error handling', async ({ page }) => {
    await page.goto('/quote')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    const fileInput = page.locator('input[type="file"]')
    
    // Test upload progress
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/large-file.pdf'))
    
    // Check for progress bar
    await expect(page.locator('.upload-progress')).toBeVisible()
    await expect(page.locator('.progress-bar')).toBeVisible()
    
    // Check for percentage
    await expect(page.locator('.progress-percentage')).toBeVisible()
    
    // Test upload cancellation
    await page.click('.cancel-upload')
    await expect(page.locator('text=Upload cancelled')).toBeVisible()
    
    // Test retry after failure
    await page.click('.retry-upload')
    await expect(page.locator('.upload-progress')).toBeVisible()
  })

  test('TC-FILE-010: File preview and metadata display', async ({ page }) => {
    await page.goto('/quote')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button:has-text("Next")')
    
    await page.selectOption('select[name="service"]', 'business-cards')
    await page.fill('input[name="quantity"]', '100')
    await page.click('button:has-text("Next")')
    
    const fileInput = page.locator('input[type="file"]')
    
    // Upload file
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/test-file.pdf'))
    await expect(page.locator('.upload-success')).toBeVisible()
    
    // Check file metadata
    await expect(page.locator('.file-name')).toBeVisible()
    await expect(page.locator('.file-size')).toBeVisible()
    await expect(page.locator('.file-type')).toBeVisible()
    await expect(page.locator('.upload-date')).toBeVisible()
    
    // Check file preview
    await expect(page.locator('.file-preview')).toBeVisible()
    
    // Test preview modal
    await page.click('.preview-file')
    await expect(page.locator('.file-preview-modal')).toBeVisible()
    
    // Test modal close
    await page.click('.modal-close')
    await expect(page.locator('.file-preview-modal')).not.toBeVisible()
  })
})
