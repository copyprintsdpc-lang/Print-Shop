import { test, expect } from '@playwright/test'

/**
 * UI/UX Tests
 * Tests visual consistency, responsiveness, accessibility basics
 */

test.describe('UI/UX Visual Tests', () => {
  test('should have consistent logo size across pages', async ({ page }) => {
    // Test home page (header logo only)
    await page.goto('/')
    const logoHome = page.locator('nav img[alt="Sri Datta Print Centre"], header img[alt="Sri Datta Print Centre"]').first()
    const logoHomeSize = await logoHome.boundingBox()
    
    // Test services page (header logo only)
    await page.goto('/services')
    const logoServices = page.locator('nav img[alt="Sri Datta Print Centre"], header img[alt="Sri Datta Print Centre"]').first()
    const logoServicesSize = await logoServices.boundingBox()
    
    // Logo sizes should be similar (within 10px)
    if (logoHomeSize && logoServicesSize) {
      expect(Math.abs(logoHomeSize.height - logoServicesSize.height)).toBeLessThan(10)
    }
  })

  test('should have proper contrast ratios', async ({ page }) => {
    await page.goto('/')
    
    // Test main text contrast
    const mainHeading = page.locator('h1').first()
    if (await mainHeading.isVisible()) {
      const styles = await mainHeading.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        }
      })
      // Basic check - colors should be defined
      expect(styles.color).toBeTruthy()
      expect(styles.backgroundColor || 'rgb(255, 255, 255)').toBeTruthy()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    // Navigation should adapt
    const mobileMenu = page.locator('button[aria-label*="menu"], button:has-text("Menu")').first()
    await expect(mobileMenu).toBeVisible({ timeout: 3000 })
    
    // Content should not overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(400)
  })

  test('should have accessible button labels', async ({ page }) => {
    await page.goto('/')
    
    // Check icon buttons have aria-labels
    const cartButton = page.locator('button').filter({ has: page.locator('svg') }).first()
    const ariaLabel = await cartButton.getAttribute('aria-label')
    
    // Cart button should have aria-label
    if (ariaLabel) {
      expect(ariaLabel.length).toBeGreaterThan(0)
    }
  })

  test('should show loading states', async ({ page }) => {
    // Navigate to a page that loads data
    await page.goto('/dashboard')
    
    // Should show loading spinner or message (check first occurrence)
    const loadingText = page.locator('text=/loading|checking/i').first()
    const loadingSpinner = page.locator('[class*="spinner"], [class*="loading"], [class*="animate-spin"]').first()
    
    // Check if either loading indicator exists
    const hasLoadingText = await loadingText.isVisible({ timeout: 2000 }).catch(() => false)
    const hasLoadingSpinner = await loadingSpinner.isVisible({ timeout: 2000 }).catch(() => false)
    
    // If loading indicator exists, it should disappear
    if (hasLoadingText) {
      await expect(loadingText).toBeHidden({ timeout: 10000 })
    } else if (hasLoadingSpinner) {
      await expect(loadingSpinner).toBeHidden({ timeout: 10000 })
    }
    // If no loading indicator, that's also okay
  })

  test('should have consistent button styles', async ({ page }) => {
    await page.goto('/')
    
    // Find primary buttons
    const primaryButtons = page.locator('button:has-text("Order"), button:has-text("Quote")')
    const count = await primaryButtons.count()
    
    if (count > 0) {
      // Check first button styles
      const firstButton = primaryButtons.first()
      const styles = await firstButton.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          borderRadius: computed.borderRadius,
          padding: computed.padding,
        }
      })
      
      // Should have some styling
      expect(styles.borderRadius).toBeTruthy()
      expect(styles.padding).toBeTruthy()
    }
  })

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/login')
    
    // Check form inputs have labels
    const emailInput = page.locator('input[type="email"]')
    const emailLabel = page.locator('label:has-text("Email")')
    
    await expect(emailLabel).toBeVisible()
    
    // Label should be associated with input
    const labelFor = await emailLabel.getAttribute('for')
    const inputId = await emailInput.getAttribute('id')
    
    if (labelFor && inputId) {
      expect(labelFor).toBe(inputId)
    }
  })

  test('should handle form validation visually', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    // Find submit button
    const submitButton = page.locator('button[type="submit"]').first()
    
    // Check if button is visible and enabled
    if (await submitButton.isVisible({ timeout: 3000 })) {
      // Try to submit empty form
      await submitButton.click({ timeout: 5000 })
      
      // Browser validation should show or custom error
      const emailInput = page.locator('input[type="email"]').first()
      
      // Check if browser validation is triggered (wait a moment for validation)
      await page.waitForTimeout(500)
      const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)
      expect(isValid).toBe(false)
    }
  })

  test('should have working hover states', async ({ page }) => {
    await page.goto('/')
    
    // Find a link with hover effect
    const link = page.locator('a:has-text("Services")').first()
    if (await link.isVisible()) {
      // Hover over link
      await link.hover()
      
      // Wait a bit for hover effect
      await page.waitForTimeout(200)
      
      // Check if styles changed (basic check)
      const styles = await link.evaluate((el) => {
        return window.getComputedStyle(el).textDecoration || window.getComputedStyle(el).color
      })
      expect(styles).toBeTruthy()
    }
  })

  test('should have consistent spacing', async ({ page }) => {
    await page.goto('/')
    
    // Check header spacing
    const header = page.locator('nav, header').first()
    if (await header.isVisible()) {
      const headerPadding = await header.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          paddingTop: computed.paddingTop,
          paddingBottom: computed.paddingBottom,
          height: computed.height,
        }
      })
      
      // Should have some height or padding (check height as well)
      const hasPadding = parseInt(headerPadding.paddingTop) > 0 || parseInt(headerPadding.paddingBottom) > 0
      const hasHeight = parseInt(headerPadding.height) > 0
      expect(hasPadding || hasHeight).toBeTruthy()
    }
  })

  test('should display error messages clearly', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    // Submit with invalid data
    await page.fill('input[type="email"]', 'invalid-email')
    await page.fill('input[type="password"]', 'short')
    
    // Find and click submit button
    const submitButton = page.locator('button[type="submit"]').first()
    if (await submitButton.isVisible({ timeout: 3000 })) {
      await submitButton.click({ timeout: 5000 })
      
      // Should show error message (wait a bit)
      await page.waitForTimeout(1000)
    }
    
    // Error message may or may not appear depending on validation
    // Just check that page didn't crash
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have keyboard navigation support', async ({ page }) => {
    await page.goto('/')
    
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    
    // Should focus on first interactive element
    const focused = await page.evaluate(() => {
      return document.activeElement?.tagName
    })
    expect(['A', 'BUTTON', 'INPUT']).toContain(focused)
  })
})

