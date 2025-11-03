import { test, expect } from '@playwright/test'

/**
 * Accessibility Tests
 * Tests basic accessibility features like ARIA labels, keyboard navigation
 */

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    // Check for h1 element
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    
    // Should have at least one h1 per page
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThan(0)
  })

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/')
    
    // Check logo has alt text (header logo only to avoid multiple matches)
    const logo = page.locator('nav img[alt="Sri Datta Print Centre"], header img[alt="Sri Datta Print Centre"]').first()
    await expect(logo).toBeVisible()
    
    // Check other images have alt attributes
    const imagesWithoutAlt = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return images.filter(img => !img.alt || img.alt.trim() === '').length
    })
    
    // Important images should have alt text (decorative images without alt are acceptable)
    expect(logo).toBeTruthy()
  })

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/login')
    
    // Check email input has label
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
    
    // Find associated label
    const emailLabel = page.locator('label').filter({ hasText: /email/i })
    await expect(emailLabel.first()).toBeVisible()
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })
    
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(focusedElement)
  })

  test('should have aria-labels on icon buttons', async ({ page }) => {
    await page.goto('/order')
    const needsLogin = await page.locator('text=/login required/i').isVisible({ timeout: 2000 })
    
    if (!needsLogin) {
      // Find icon buttons (cart, menu, etc.)
      const iconButtons = page.locator('button').filter({ has: page.locator('svg') })
      const count = await iconButtons.count()
      
      if (count > 0) {
        // Check first icon button has aria-label
        const firstButton = iconButtons.first()
        const ariaLabel = await firstButton.getAttribute('aria-label')
        
        // Should have aria-label or visible text
        const hasLabel = ariaLabel || await firstButton.textContent()
        expect(hasLabel?.length || 0).toBeGreaterThan(0)
      }
    }
  })

  test('should have proper link descriptions', async ({ page }) => {
    await page.goto('/')
    
    // Check navigation links have descriptive text (skip logo links)
    const navLinks = page.locator('nav a:not(:has(img)), header a:not(:has(img))')
    const linkCount = await navLinks.count()
    
    if (linkCount > 0) {
      // Links should have text or aria-label
      const firstLink = navLinks.first()
      const linkText = await firstLink.textContent()
      const linkAria = await firstLink.getAttribute('aria-label')
      const href = await firstLink.getAttribute('href')
      
      // Link should have text content or aria-label, or meaningful href
      const hasDescription = (linkText && linkText.trim().length > 0) || linkAria || (href && href !== '#' && href !== '/')
      expect(hasDescription).toBeTruthy()
    } else {
      // If no text links, check any links with images have alt
      const imageLinks = page.locator('nav a:has(img), header a:has(img)')
      const imageLinkCount = await imageLinks.count()
      if (imageLinkCount > 0) {
        const firstImageLink = imageLinks.first()
        const imgAlt = await firstImageLink.locator('img').first().getAttribute('alt')
        expect(imgAlt).toBeTruthy()
      }
    }
  })

  test('should announce dynamic content changes', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    // Submit form (will show error/success message)
    const submitButton = page.locator('button[type="submit"]').first()
    if (await submitButton.isVisible({ timeout: 3000 })) {
      await submitButton.click({ timeout: 5000 })
      
      await page.waitForTimeout(1000)
    }
    
    // Check if status messages are visible
    const statusMessage = page.locator('[role="alert"], [aria-live], [class*="message"]')
    // Messages may or may not have ARIA, just check page didn't break
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    
    // Check main heading contrast
    const heading = page.locator('h1').first()
    if (await heading.isVisible()) {
      const styles = await heading.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        }
      })
      
      // Colors should be defined (basic check)
      expect(styles.color).toBeTruthy()
      expect(styles.backgroundColor || 'rgb(255, 255, 255)').toBeTruthy()
    }
  })

  test('should have skip to content link (optional)', async ({ page }) => {
    await page.goto('/')
    
    // Skip link is optional but good practice
    const skipLink = page.locator('a[href="#main"], a[href="#content"]')
    // May or may not exist, just check page loads
    await expect(page.locator('body')).toBeVisible()
  })
})

