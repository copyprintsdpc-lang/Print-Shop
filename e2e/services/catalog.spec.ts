import { test, expect } from '@playwright/test'

test.describe('Services Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services')
  })

  test('TC-SVC-001: Services page loads with categories & counts', async ({ page }) => {
    // Check page loads
    await expect(page).toHaveURL('/services')
    
    // Check for page title
    await expect(page.locator('h1')).toContainText('Our Services')
    
    // Check for category filters
    await expect(page.locator('.category-filter')).toBeVisible()
    
    // Check for service cards
    await expect(page.locator('.service-card')).toHaveCount.greaterThan(0)
    
    // Check for category counts
    const categoryButtons = page.locator('.category-filter button')
    const count = await categoryButtons.count()
    expect(count).toBeGreaterThan(0)
    
    // Check that each category shows count
    for (let i = 0; i < count; i++) {
      const button = categoryButtons.nth(i)
      const text = await button.textContent()
      expect(text).toMatch(/\d+/) // Should contain a number
    }
  })

  test('TC-SVC-002: Category filter chips filter correctly', async ({ page }) => {
    // Get initial service count
    const initialCount = await page.locator('.service-card').count()
    
    // Click on a category filter
    await page.click('.category-filter button:has-text("Printing")')
    
    // Wait for filtering to complete
    await page.waitForLoadState('networkidle')
    
    // Check that service count changed (unless all services are in that category)
    const filteredCount = await page.locator('.service-card').count()
    expect(filteredCount).toBeLessThanOrEqual(initialCount)
    
    // Check that active filter is highlighted
    await expect(page.locator('.category-filter button.active')).toBeVisible()
    
    // Click another category
    await page.click('.category-filter button:has-text("Specialty")')
    
    // Check that previous filter is no longer active
    await expect(page.locator('.category-filter button:has-text("Printing").active')).not.toBeVisible()
    
    // Check that new filter is active
    await expect(page.locator('.category-filter button:has-text("Specialty").active')).toBeVisible()
    
    // Click "All" to clear filters
    await page.click('.category-filter button:has-text("All")')
    
    // Check that all services are shown again
    const allCount = await page.locator('.service-card').count()
    expect(allCount).toBe(initialCount)
  })

  test('TC-SVC-003: Search by name/tags', async ({ page }) => {
    // Test search by name
    await page.fill('input[placeholder*="search" i]', 'CAD')
    await page.keyboard.press('Enter')
    
    // Wait for search results
    await page.waitForLoadState('networkidle')
    
    // Check that results contain search term
    const serviceCards = page.locator('.service-card')
    const count = await serviceCards.count()
    
    for (let i = 0; i < count; i++) {
      const card = serviceCards.nth(i)
      const title = await card.locator('h3').textContent()
      const description = await card.locator('p').textContent()
      
      expect(title?.toLowerCase().includes('cad') || 
             description?.toLowerCase().includes('cad')).toBeTruthy()
    }
    
    // Clear search
    await page.fill('input[placeholder*="search" i]', '')
    await page.keyboard.press('Enter')
    
    // Test search by tags
    await page.fill('input[placeholder*="search" i]', 'stickers')
    await page.keyboard.press('Enter')
    
    await page.waitForLoadState('networkidle')
    
    // Check that results contain tag
    const stickerCards = page.locator('.service-card')
    const stickerCount = await stickerCards.count()
    expect(stickerCount).toBeGreaterThan(0)
  })

  test('TC-SVC-004: Sorting by sort field is respected', async ({ page }) => {
    // Check default sorting (should be by sort field)
    const serviceCards = page.locator('.service-card')
    const firstCard = serviceCards.first()
    const lastCard = serviceCards.last()
    
    // Get titles to verify order
    const firstTitle = await firstCard.locator('h3').textContent()
    const lastTitle = await lastCard.locator('h3').textContent()
    
    // Test different sorting options
    await page.selectOption('select[name="sort"]', 'name-asc')
    await page.waitForLoadState('networkidle')
    
    // Check that order changed
    const newFirstTitle = await firstCard.locator('h3').textContent()
    expect(newFirstTitle).not.toBe(firstTitle)
    
    // Test descending order
    await page.selectOption('select[name="sort"]', 'name-desc')
    await page.waitForLoadState('networkidle')
    
    const descFirstTitle = await firstCard.locator('h3').textContent()
    expect(descFirstTitle).not.toBe(newFirstTitle)
  })

  test('TC-SVC-005: Each card has name, single-line tagline, image/icon, CTA', async ({ page }) => {
    const serviceCards = page.locator('.service-card')
    const firstCard = serviceCards.first()
    
    // Check for name/title
    await expect(firstCard.locator('h3')).toBeVisible()
    
    // Check for tagline/description
    await expect(firstCard.locator('p')).toBeVisible()
    
    // Check for image or icon
    const hasImage = await firstCard.locator('img').isVisible()
    const hasIcon = await firstCard.locator('.icon').isVisible()
    expect(hasImage || hasIcon).toBeTruthy()
    
    // Check for CTA button
    await expect(firstCard.locator('button, a')).toBeVisible()
    
    // Check that CTA has appropriate text
    const ctaText = await firstCard.locator('button, a').textContent()
    expect(ctaText?.toLowerCase()).toMatch(/view|details|learn|more/)
  })

  test('TC-SVC-006: Pagination/infinite scroll works and preserves filters', async ({ page }) => {
    // Apply a filter first
    await page.click('.category-filter button:has-text("Printing")')
    await page.waitForLoadState('networkidle')
    
    // Check if pagination exists
    const pagination = page.locator('.pagination')
    const hasPagination = await pagination.isVisible()
    
    if (hasPagination) {
      // Test pagination
      const nextButton = pagination.locator('button:has-text("Next")')
      if (await nextButton.isVisible()) {
        await nextButton.click()
        await page.waitForLoadState('networkidle')
        
        // Check that filter is still applied
        await expect(page.locator('.category-filter button.active')).toBeVisible()
        
        // Check that we're on page 2
        await expect(page.locator('.pagination .active')).toContainText('2')
      }
    } else {
      // Test infinite scroll
      const initialCount = await page.locator('.service-card').count()
      
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1000)
      
      // Check if more services loaded
      const newCount = await page.locator('.service-card').count()
      expect(newCount).toBeGreaterThanOrEqual(initialCount)
    }
  })

  test('TC-SVC-007: No services (empty state) message', async ({ page }) => {
    // Search for something that doesn't exist
    await page.fill('input[placeholder*="search" i]', 'nonexistentservice')
    await page.keyboard.press('Enter')
    await page.waitForLoadState('networkidle')
    
    // Check for empty state message
    await expect(page.locator('text=No services found')).toBeVisible()
    
    // Check for helpful message
    await expect(page.locator('text=Try adjusting your search')).toBeVisible()
    
    // Check for clear search button
    await expect(page.locator('button:has-text("Clear search")')).toBeVisible()
  })

  test('TC-SVC-008: Deep link /services/[slug] SSR/ISR renders correctly', async ({ page }) => {
    // Get a service slug from the main page
    const firstServiceCard = page.locator('.service-card').first()
    const serviceLink = firstServiceCard.locator('a').first()
    const href = await serviceLink.getAttribute('href')
    
    expect(href).toMatch(/^\/services\/[a-z0-9-]+$/)
    
    // Navigate to the service detail page
    await serviceLink.click()
    
    // Check that page loads correctly
    await expect(page).toHaveURL(href!)
    
    // Check for service title
    await expect(page.locator('h1')).toBeVisible()
    
    // Check for service description
    await expect(page.locator('.service-description')).toBeVisible()
    
    // Check for service options if applicable
    const hasOptions = await page.locator('.service-options').isVisible()
    if (hasOptions) {
      await expect(page.locator('.service-options')).toBeVisible()
    }
    
    // Check for CTA button
    await expect(page.locator('button:has-text("Get Quote"), button:has-text("Order Now")')).toBeVisible()
  })
})
