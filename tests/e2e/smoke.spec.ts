import { test, expect } from '@playwright/test'

/**
 * Smoke Tests
 * Basic tests to ensure application loads and critical paths work
 */

test.describe('Smoke Tests', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    await expect(page).toHaveTitle(/Sri Datta Print Center/i)
  })

  test('should load services page', async ({ page }) => {
    await page.goto('/services')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should load contact page', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should load login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]').or(page.locator('input[type="tel"]'))).toBeVisible()
  })

  test('should load signup page', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.locator('input[type="text"]').first()).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')
    
    // Test navigation links don't break
    const links = [
      { text: 'Home', url: '/' },
      { text: 'Services', url: '/services' },
      { text: 'Contact', url: '/contact' },
    ]
    
    for (const link of links) {
      await page.click(`text=${link.text}`)
      await expect(page).toHaveURL(new RegExp(link.url))
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('should not have console errors on load', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Filter out known acceptable errors (like API calls)
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('api') &&
      !e.includes('404')
    )
    
    expect(criticalErrors.length).toBe(0)
  })

  test('should load images properly', async ({ page }) => {
    await page.goto('/')
    
    // Check logo loads (header logo)
    const logo = page.locator('img[alt="Sri Datta Print Centre"]').first()
    await expect(logo).toBeVisible()
    
    // Check image loads (not broken)
    const logoSrc = await logo.getAttribute('src')
    expect(logoSrc).toBeTruthy()
  })
})

