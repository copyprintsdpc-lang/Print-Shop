import { test, expect } from '@playwright/test'

test.describe('Email Authentication & Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC-AUTH-001: Register with valid email/password', async ({ page }) => {
    // Navigate to registration
    await page.click('text=Sign up')
    await expect(page).toHaveURL('/auth/register')

    // Fill registration form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'SecurePassword123!')
    await page.fill('input[name="confirmPassword"]', 'SecurePassword123!')
    
    // Submit registration
    await page.click('button[type="submit"]')
    
    // Check for success message
    await expect(page.locator('text=Verification email sent')).toBeVisible()
    
    // Check that user is redirected to verification page
    await expect(page).toHaveURL(/.*verify-email/)
  })

  test('TC-AUTH-002: Register with existing email', async ({ page }) => {
    // First registration
    await page.click('text=Sign up')
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'existing@example.com')
    await page.fill('input[name="password"]', 'SecurePassword123!')
    await page.fill('input[name="confirmPassword"]', 'SecurePassword123!')
    await page.click('button[type="submit"]')
    
    // Wait for success
    await expect(page.locator('text=Verification email sent')).toBeVisible()
    
    // Try to register again with same email
    await page.goto('/auth/register')
    await page.fill('input[name="name"]', 'Another User')
    await page.fill('input[name="email"]', 'existing@example.com')
    await page.fill('input[name="password"]', 'AnotherPassword123!')
    await page.fill('input[name="confirmPassword"]', 'AnotherPassword123!')
    await page.click('button[type="submit"]')
    
    // Check for error message
    await expect(page.locator('text=Email already in use')).toBeVisible()
  })

  test('TC-AUTH-003: Verification link expiry', async ({ page }) => {
    // This would require setting up expired tokens in test data
    // For now, we'll test the UI behavior
    await page.goto('/auth/verify-email?token=expired-token')
    
    // Check for expiry message
    await expect(page.locator('text=Link expired')).toBeVisible()
    await expect(page.locator('text=Resend verification email')).toBeVisible()
  })

  test('TC-AUTH-004: Resend verification', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login')
    
    // Fill login form with unverified email
    await page.fill('input[name="email"]', 'unverified@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Check for verification required message
    await expect(page.locator('text=Please verify your email')).toBeVisible()
    
    // Click resend button
    await page.click('text=Resend verification email')
    
    // Check for success message
    await expect(page.locator('text=Verification email sent')).toBeVisible()
  })

  test('TC-AUTH-005: Password policy & strength meter', async ({ page }) => {
    await page.goto('/auth/register')
    
    // Test weak password
    await page.fill('input[name="password"]', '123')
    
    // Check for validation message
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible()
    
    // Check strength meter shows weak
    await expect(page.locator('.password-strength.weak')).toBeVisible()
    
    // Test strong password
    await page.fill('input[name="password"]', 'SecurePassword123!')
    
    // Check strength meter shows strong
    await expect(page.locator('.password-strength.strong')).toBeVisible()
    
    // Check that form can be submitted
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="confirmPassword"]', 'SecurePassword123!')
    
    // Submit button should be enabled
    await expect(page.locator('button[type="submit"]')).toBeEnabled()
  })

  test('TC-AUTH-020: Login success (verified account)', async ({ page }) => {
    // This would require a verified test account
    await page.goto('/auth/login')
    
    await page.fill('input[name="email"]', 'verified@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Check for successful login redirect
    await expect(page).toHaveURL('/')
    await expect(page.locator('text=Welcome')).toBeVisible()
  })

  test('TC-AUTH-021: Login blocked until email verified', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.fill('input[name="email"]', 'unverified@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Check for verification required message
    await expect(page.locator('text=Please verify your email')).toBeVisible()
    await expect(page).toHaveURL(/.*verify-email/)
  })

  test('TC-AUTH-026: Brute-force protection', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Attempt multiple failed logins
    for (let i = 0; i < 5; i++) {
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'WrongPassword')
      await page.click('button[type="submit"]')
      
      // Wait for error message
      await expect(page.locator('text=Invalid credentials')).toBeVisible()
    }
    
    // Check for rate limiting or captcha
    await expect(page.locator('text=Too many attempts')).toBeVisible()
    // OR
    await expect(page.locator('.captcha')).toBeVisible()
  })

  test('TC-AUTH-027: Password reset flow', async ({ page }) => {
    // Navigate to forgot password
    await page.goto('/auth/forgot-password')
    
    // Enter email
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button[type="submit"]')
    
    // Check for success message
    await expect(page.locator('text=Password reset email sent')).toBeVisible()
    
    // Simulate clicking reset link (would need test email handling)
    await page.goto('/auth/reset-password?token=valid-token')
    
    // Fill new password
    await page.fill('input[name="password"]', 'NewPassword123!')
    await page.fill('input[name="confirmPassword"]', 'NewPassword123!')
    await page.click('button[type="submit"]')
    
    // Check for success
    await expect(page.locator('text=Password updated successfully')).toBeVisible()
    
    // Try to login with new password
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'NewPassword123!')
    await page.click('button[type="submit"]')
    
    // Should login successfully
    await expect(page).toHaveURL('/')
  })
})
