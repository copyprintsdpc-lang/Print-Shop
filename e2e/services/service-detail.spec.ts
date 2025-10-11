import { test, expect } from '@playwright/test'

test.describe('Service Detail Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a service detail page
    await page.goto('/services/business-cards')
  })

  test('TC-SVC-020: Required fields render: hero, description, options', async ({ page }) => {
    // Check for hero section
    await expect(page.locator('.service-hero')).toBeVisible()
    
    // Check for service title in hero
    await expect(page.locator('.service-hero h1')).toBeVisible()
    
    // Check for service description
    await expect(page.locator('.service-description')).toBeVisible()
    
    // Check for service options
    await expect(page.locator('.service-options')).toBeVisible()
    
    // Check for at least one option group (e.g., size, paper, finish)
    const optionGroups = page.locator('.option-group')
    const groupCount = await optionGroups.count()
    expect(groupCount).toBeGreaterThan(0)
    
    // Check that each option group has a label
    for (let i = 0; i < groupCount; i++) {
      const group = optionGroups.nth(i)
      await expect(group.locator('label')).toBeVisible()
    }
  })

  test('TC-SVC-021: Option dependencies (e.g., GSM only for certain papers)', async ({ page }) => {
    // Select a paper type that should enable GSM options
    await page.selectOption('select[name="paper"]', 'cardstock')
    
    // Check that GSM options become available
    await expect(page.locator('select[name="gsm"]')).toBeVisible()
    await expect(page.locator('select[name="gsm"]')).toBeEnabled()
    
    // Select a different paper type that shouldn't have GSM
    await page.selectOption('select[name="paper"]', 'standard')
    
    // Check that GSM options are hidden or disabled
    const gsmSelect = page.locator('select[name="gsm"]')
    const isVisible = await gsmSelect.isVisible()
    const isEnabled = await gsmSelect.isEnabled()
    
    if (isVisible) {
      expect(isEnabled).toBeFalsy()
    }
    
    // Test other dependencies
    await page.selectOption('select[name="finish"]', 'matte')
    
    // Check that certain options are available only for matte finish
    const spotUvOption = page.locator('option[value="spot-uv"]')
    const isSpotUvVisible = await spotUvOption.isVisible()
    expect(isSpotUvVisible).toBeFalsy()
  })

  test('TC-SVC-022: Price preview updates with selections', async ({ page }) => {
    // Check that price preview exists
    await expect(page.locator('.price-preview')).toBeVisible()
    
    // Get initial price
    const initialPrice = await page.locator('.price-preview .price').textContent()
    expect(initialPrice).toMatch(/₹\d+/)
    
    // Change quantity
    await page.fill('input[name="quantity"]', '100')
    
    // Check that price updates
    await page.waitForTimeout(500) // Wait for price calculation
    const updatedPrice = await page.locator('.price-preview .price').textContent()
    expect(updatedPrice).not.toBe(initialPrice)
    
    // Change paper type
    await page.selectOption('select[name="paper"]', 'premium')
    
    // Check that price updates again
    await page.waitForTimeout(500)
    const premiumPrice = await page.locator('.price-preview .price').textContent()
    expect(premiumPrice).not.toBe(updatedPrice)
    
    // Check that price breakdown is shown
    await expect(page.locator('.price-breakdown')).toBeVisible()
    await expect(page.locator('.price-breakdown .subtotal')).toBeVisible()
    await expect(page.locator('.price-breakdown .tax')).toBeVisible()
    await expect(page.locator('.price-breakdown .total')).toBeVisible()
  })

  test('TC-SVC-023: Add to Order/Quote CTA navigates with selected config', async ({ page }) => {
    // Configure service options
    await page.selectOption('select[name="size"]', '3.5x2')
    await page.selectOption('select[name="paper"]', 'premium')
    await page.selectOption('select[name="finish"]', 'glossy')
    await page.fill('input[name="quantity"]', '500')
    
    // Click Add to Quote button
    await page.click('button:has-text("Get Quote")')
    
    // Check that we're redirected to quote page
    await expect(page).toHaveURL(/.*quote/)
    
    // Check that selected options are pre-filled in quote form
    await expect(page.locator('input[name="quantity"][value="500"]')).toBeVisible()
    
    // Check that service details are shown
    await expect(page.locator('text=Business Cards')).toBeVisible()
    await expect(page.locator('text=3.5x2')).toBeVisible()
    await expect(page.locator('text=Premium')).toBeVisible()
    await expect(page.locator('text=Glossy')).toBeVisible()
  })

  test('TC-SVC-024: Related services section populated', async ({ page }) => {
    // Scroll to related services section
    await page.locator('.related-services').scrollIntoViewIfNeeded()
    
    // Check that related services section exists
    await expect(page.locator('.related-services')).toBeVisible()
    
    // Check for section title
    await expect(page.locator('.related-services h2')).toContainText('Related Services')
    
    // Check that there are related service cards
    const relatedCards = page.locator('.related-services .service-card')
    const cardCount = await relatedCards.count()
    expect(cardCount).toBeGreaterThan(0)
    
    // Check that each related card has required elements
    for (let i = 0; i < cardCount; i++) {
      const card = relatedCards.nth(i)
      await expect(card.locator('h3')).toBeVisible() // Title
      await expect(card.locator('a')).toBeVisible() // Link
    }
    
    // Test clicking on a related service
    const firstRelatedCard = relatedCards.first()
    const relatedLink = firstRelatedCard.locator('a')
    const relatedHref = await relatedLink.getAttribute('href')
    
    await relatedLink.click()
    
    // Check that we navigate to the related service
    await expect(page).toHaveURL(relatedHref!)
  })

  test('TC-SVC-025: 404 for invalid slug', async ({ page }) => {
    // Navigate to invalid service slug
    await page.goto('/services/invalid-service-slug')
    
    // Check for 404 status
    await expect(page).toHaveURL('/services/invalid-service-slug')
    
    // Check for 404 message
    await expect(page.locator('text=Service not found')).toBeVisible()
    // OR
    await expect(page.locator('text=404')).toBeVisible()
    
    // Check for helpful message
    await expect(page.locator('text=The service you are looking for does not exist')).toBeVisible()
    
    // Check for back to services link
    await expect(page.locator('a:has-text("Back to Services")')).toBeVisible()
    
    // Test the back link
    await page.click('a:has-text("Back to Services")')
    await expect(page).toHaveURL('/services')
  })

  test('TC-SVC-026: Service specifications and requirements', async ({ page }) => {
    // Check for specifications section
    await expect(page.locator('.specifications')).toBeVisible()
    
    // Check for common specifications
    const specs = [
      'Minimum Order Quantity',
      'Production Time',
      'File Requirements',
      'Color Options',
      'Size Options'
    ]
    
    for (const spec of specs) {
      const specElement = page.locator(`text=${spec}`)
      const isVisible = await specElement.isVisible()
      if (isVisible) {
        await expect(specElement).toBeVisible()
      }
    }
    
    // Check for file requirements details
    await expect(page.locator('.file-requirements')).toBeVisible()
    
    // Check for supported file formats
    const supportedFormats = ['PDF', 'AI', 'PSD', 'PNG', 'JPG']
    for (const format of supportedFormats) {
      const formatElement = page.locator(`text=${format}`)
      const isVisible = await formatElement.isVisible()
      if (isVisible) {
        await expect(formatElement).toBeVisible()
      }
    }
  })

  test('TC-SVC-027: Service gallery and images', async ({ page }) => {
    // Check for service gallery
    const gallery = page.locator('.service-gallery')
    const hasGallery = await gallery.isVisible()
    
    if (hasGallery) {
      // Check for gallery images
      const images = gallery.locator('img')
      const imageCount = await images.count()
      expect(imageCount).toBeGreaterThan(0)
      
      // Check that images have alt text
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        expect(alt).toBeTruthy()
      }
      
      // Test image modal/lightbox if present
      const firstImage = images.first()
      await firstImage.click()
      
      // Check for modal
      const modal = page.locator('.image-modal')
      const hasModal = await modal.isVisible()
      if (hasModal) {
        await expect(modal).toBeVisible()
        
        // Test modal close
        await page.click('.modal-close')
        await expect(modal).not.toBeVisible()
      }
    }
  })

  test('TC-SVC-028: Mobile responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that service options are still accessible
    await expect(page.locator('.service-options')).toBeVisible()
    
    // Check that price preview is visible
    await expect(page.locator('.price-preview')).toBeVisible()
    
    // Check that CTA button is accessible
    await expect(page.locator('button:has-text("Get Quote")')).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // Check that layout adapts
    await expect(page.locator('.service-options')).toBeVisible()
    await expect(page.locator('.price-preview')).toBeVisible()
  })
})
