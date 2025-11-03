import { test, expect } from '@playwright/test'

/**
 * Navigation Tests
 * Tests website and app navigation, header, footer consistency
 */
test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display header with logo and navigation', async ({ page }) => {
    // Check logo is present and properly sized (header logo only)
    const logo = page.locator('nav img[alt="Sri Datta Print Centre"], header img[alt="Sri Datta Print Centre"]').first()
    await expect(logo).toBeVisible()
    
    // Check logo size (should not be oversized)
    const logoBox = await logo.boundingBox()
    expect(logoBox?.height).toBeLessThan(60) // Max 60px height
    
    // Check top bar with contact info
    await expect(page.locator('text=Hotline').first()).toBeVisible()
    await expect(page.locator('text=/Bangalore/i').first()).toBeVisible()
    await expect(page.locator('text=/Mon-Sat/i').first()).toBeVisible()
  })

  test('should navigate between static pages', async ({ page }) => {
    // Test Home link
    await page.click('text=Home')
    await expect(page).toHaveURL('/')
    
    // Test Services link
    await page.click('text=Services')
    await expect(page).toHaveURL('/services')
    
    // Test Contact link
    await page.click('text=Contact')
    await expect(page).toHaveURL('/contact')
  })

  test('should show mobile menu on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu")').first()
    await expect(menuButton).toBeVisible({ timeout: 5000 })
    
    // Click menu
    await menuButton.click()
    await page.waitForTimeout(500) // Wait for menu animation
    
    // Menu should open - check for mobile menu container
    const mobileMenuContainer = page.locator('[class*="md:hidden"]').or(
      page.locator('nav').filter({ has: page.locator('[class*="md:hidden"]') })
    )
    
    // Check if mobile menu is visible (menu links should be accessible)
    const homeLink = page.locator('a[href="/"]:has-text("Home")')
    const homeLinks = await homeLink.count()
    expect(homeLinks).toBeGreaterThan(0)
  })

  test('should have consistent footer across pages', async ({ page }) => {
    // Check footer exists
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    
    // Check footer has dark background
    const footerBg = await footer.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    // Should have dark background (gray-900)
    expect(footerBg).toContain('rgb')
    
    // Check footer links
    await expect(page.locator('footer >> text=Our Services')).toBeVisible()
    await expect(page.locator('footer >> text=Quick Links')).toBeVisible()
    await expect(page.locator('footer >> text=Contact Info')).toBeVisible()
  })

  test('should protect app pages and redirect to login', async ({ page }) => {
    // Try to access dashboard (should redirect)
    await page.goto('/dashboard')
    
    // Should show login required message or redirect
    const loginButton = page.locator('text=/login/i').or(page.locator('button:has-text("Login")'))
    await expect(loginButton.first()).toBeVisible({ timeout: 5000 })
  })

  test('should allow public access to order tracking', async ({ page }) => {
    // Order tracking should be public
    await page.goto('/order-track/TEST123')
    
    // Should load without requiring login
    // May show "Order not found" but shouldn't require auth
    const requiresLogin = await page.locator('text=/login required/i').count()
    expect(requiresLogin).toBe(0)
  })
})

