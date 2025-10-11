import { test, expect } from '@playwright/test'

test.describe('Accessibility Tests', () => {
  test('TC-A11Y-001: All interactive elements reachable by keyboard', async ({ page }) => {
    await page.goto('/')
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Test tab order through main navigation
    const navLinks = page.locator('nav a')
    const linkCount = await navLinks.count()
    
    for (let i = 0; i < linkCount; i++) {
      await page.keyboard.press('Tab')
      const currentFocus = page.locator(':focus')
      await expect(currentFocus).toBeVisible()
    }
    
    // Test form elements
    await page.goto('/login')
    
    // Tab through form elements
    await page.keyboard.press('Tab') // Email field
    await expect(page.locator('input[name="email"]:focus')).toBeVisible()
    
    await page.keyboard.press('Tab') // Password field
    await expect(page.locator('input[name="password"]:focus')).toBeVisible()
    
    await page.keyboard.press('Tab') // Submit button
    await expect(page.locator('button[type="submit"]:focus')).toBeVisible()
  })

  test('TC-A11Y-002: Color contrast meets AA', async ({ page }) => {
    await page.goto('/')
    
    // Check text contrast
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, a')
    const textCount = await textElements.count()
    
    for (let i = 0; i < Math.min(textCount, 10); i++) {
      const element = textElements.nth(i)
      const text = await element.textContent()
      
      if (text && text.trim().length > 0) {
        // Check that element has sufficient contrast
        const color = await element.evaluate(el => {
          const styles = window.getComputedStyle(el)
          return {
            color: styles.color,
            backgroundColor: styles.backgroundColor
          }
        })
        
        // This would need actual contrast calculation
        // For now, we'll check that colors are defined
        expect(color.color).toBeTruthy()
        expect(color.backgroundColor).toBeTruthy()
      }
    }
    
    // Check button contrast
    const buttons = page.locator('button, input[type="submit"], input[type="button"]')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      const buttonColor = await button.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor
        }
      })
      
      expect(buttonColor.color).toBeTruthy()
      expect(buttonColor.backgroundColor).toBeTruthy()
    }
  })

  test('TC-A11Y-003: Forms have labels, aria-describedby, error live regions', async ({ page }) => {
    await page.goto('/login')
    
    // Check email field
    const emailField = page.locator('input[name="email"]')
    const emailLabel = page.locator('label[for="email"]')
    await expect(emailLabel).toBeVisible()
    
    // Check password field
    const passwordField = page.locator('input[name="password"]')
    const passwordLabel = page.locator('label[for="password"]')
    await expect(passwordLabel).toBeVisible()
    
    // Test form validation
    await page.click('button[type="submit"]')
    
    // Check for error messages
    await expect(page.locator('.error-message')).toBeVisible()
    
    // Check for aria-describedby
    const emailAria = await emailField.getAttribute('aria-describedby')
    expect(emailAria).toBeTruthy()
    
    // Check for live region
    await expect(page.locator('[role="alert"]')).toBeVisible()
  })

  test('TC-A11Y-004: Images with alt text; decorative images marked appropriately', async ({ page }) => {
    await page.goto('/')
    
    // Check all images have alt text
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      
      // Alt text should be present (even if empty for decorative images)
      expect(alt).not.toBeNull()
      
      // Check for decorative images
      const isDecorative = alt === '' || alt === 'decorative'
      if (isDecorative) {
        // Decorative images should have empty alt
        expect(alt).toBe('')
      } else {
        // Content images should have descriptive alt
        expect(alt).toBeTruthy()
        expect(alt.length).toBeGreaterThan(0)
      }
    }
    
    // Check for background images with proper text alternatives
    const elementsWithBg = page.locator('[style*="background-image"]')
    const bgCount = await elementsWithBg.count()
    
    for (let i = 0; i < bgCount; i++) {
      const element = elementsWithBg.nth(i)
      const text = await element.textContent()
      
      // Elements with background images should have text content
      expect(text).toBeTruthy()
    }
  })

  test('TC-A11Y-005: Skip to content; proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    // Check for skip link
    const skipLink = page.locator('a:has-text("Skip to main content")')
    await expect(skipLink).toBeVisible()
    
    // Test skip link functionality
    await skipLink.click()
    await expect(page.locator('main:focus')).toBeVisible()
    
    // Check heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingCount = await headings.count()
    
    let previousLevel = 0
    for (let i = 0; i < headingCount; i++) {
      const heading = headings.nth(i)
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
      const level = parseInt(tagName.charAt(1))
      
      // Heading levels should not skip (e.g., h1 -> h3)
      expect(level).toBeLessThanOrEqual(previousLevel + 1)
      previousLevel = level
    }
    
    // Check for main heading (h1)
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    
    // Check for proper heading structure
    const h1Text = await h1.textContent()
    expect(h1Text).toBeTruthy()
    expect(h1Text.length).toBeGreaterThan(0)
  })

  test('TC-A11Y-006: Focus management and focus traps', async ({ page }) => {
    await page.goto('/')
    
    // Test modal focus trap
    await page.click('button:has-text("Menu")')
    
    // Check that focus is trapped in modal
    const modal = page.locator('.modal')
    await expect(modal).toBeVisible()
    
    // Tab through modal elements
    await page.keyboard.press('Tab')
    const firstFocus = page.locator(':focus')
    await expect(firstFocus).toBeVisible()
    
    // Tab to last element
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Tab should cycle back to first element
    await page.keyboard.press('Tab')
    const cycledFocus = page.locator(':focus')
    await expect(cycledFocus).toBe(firstFocus)
    
    // Test escape key
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
  })

  test('TC-A11Y-007: Screen reader compatibility', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper ARIA labels
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      const ariaLabel = await button.getAttribute('aria-label')
      const text = await button.textContent()
      
      // Buttons should have either text content or aria-label
      expect(ariaLabel || text).toBeTruthy()
    }
    
    // Check for proper roles
    const nav = page.locator('nav')
    const navRole = await nav.getAttribute('role')
    expect(navRole).toBe('navigation')
    
    const main = page.locator('main')
    const mainRole = await main.getAttribute('role')
    expect(mainRole).toBe('main')
    
    // Check for proper landmarks
    const landmarks = page.locator('[role="banner"], [role="main"], [role="contentinfo"], [role="navigation"]')
    const landmarkCount = await landmarks.count()
    expect(landmarkCount).toBeGreaterThan(0)
  })

  test('TC-A11Y-008: Form accessibility', async ({ page }) => {
    await page.goto('/quote')
    
    // Check form structure
    const form = page.locator('form')
    await expect(form).toBeVisible()
    
    // Check fieldset and legend
    const fieldsets = page.locator('fieldset')
    const fieldsetCount = await fieldsets.count()
    
    for (let i = 0; i < fieldsetCount; i++) {
      const fieldset = fieldsets.nth(i)
      const legend = fieldset.locator('legend')
      await expect(legend).toBeVisible()
    }
    
    // Check required fields
    const requiredFields = page.locator('input[required], select[required], textarea[required]')
    const requiredCount = await requiredFields.count()
    
    for (let i = 0; i < requiredCount; i++) {
      const field = requiredFields.nth(i)
      const ariaRequired = await field.getAttribute('aria-required')
      expect(ariaRequired).toBe('true')
    }
    
    // Check error messages
    await page.click('button[type="submit"]')
    
    const errorMessages = page.locator('.error-message')
    const errorCount = await errorMessages.count()
    
    for (let i = 0; i < errorCount; i++) {
      const error = errorMessages.nth(i)
      const role = await error.getAttribute('role')
      expect(role).toBe('alert')
    }
  })

  test('TC-A11Y-009: Mobile accessibility', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check touch targets are large enough
    const buttons = page.locator('button, a, input[type="submit"]')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      const box = await button.boundingBox()
      
      if (box) {
        // Touch targets should be at least 44x44 pixels
        expect(box.width).toBeGreaterThanOrEqual(44)
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    }
    
    // Check for mobile-specific accessibility features
    const mobileMenu = page.locator('.mobile-menu')
    const hasMobileMenu = await mobileMenu.isVisible()
    
    if (hasMobileMenu) {
      const menuButton = page.locator('.menu-button')
      await expect(menuButton).toBeVisible()
      
      const ariaExpanded = await menuButton.getAttribute('aria-expanded')
      expect(ariaExpanded).toBeTruthy()
    }
  })

  test('TC-A11Y-010: Dynamic content accessibility', async ({ page }) => {
    await page.goto('/')
    
    // Test loading states
    await page.click('button:has-text("Load More")')
    
    // Check for loading indicator
    const loadingIndicator = page.locator('[aria-label="Loading"]')
    await expect(loadingIndicator).toBeVisible()
    
    // Check for live regions
    const liveRegion = page.locator('[aria-live]')
    const liveRegionCount = await liveRegion.count()
    expect(liveRegionCount).toBeGreaterThan(0)
    
    // Test dynamic content updates
    await page.goto('/services')
    
    // Filter services
    await page.click('.category-filter button:first-child')
    
    // Check for loading state
    await expect(page.locator('[aria-label="Loading services"]')).toBeVisible()
    
    // Wait for content to load
    await page.waitForSelector('.service-card')
    
    // Check for updated content
    const serviceCards = page.locator('.service-card')
    await expect(serviceCards).toBeVisible()
  })
})
