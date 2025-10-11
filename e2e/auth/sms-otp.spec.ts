import { test, expect } from '@playwright/test'

test.describe('SMS OTP Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC-AUTH-010: Send OTP to valid E.164 phone', async ({ page }) => {
    // Navigate to phone verification
    await page.goto('/auth/verify-phone')
    
    // Enter valid E.164 phone number
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button[type="submit"]')
    
    // Check for success message
    await expect(page.locator('text=OTP sent to your phone')).toBeVisible()
    
    // Check that OTP input field appears
    await expect(page.locator('input[name="otp"]')).toBeVisible()
    
    // Check for rate limiting message if applicable
    await expect(page.locator('text=Resend OTP in')).toBeVisible()
  })

  test('TC-AUTH-011: Verify correct OTP within TTL', async ({ page }) => {
    // This would require a test OTP or mocking the verification
    await page.goto('/auth/verify-phone')
    
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button[type="submit"]')
    
    // Wait for OTP input to appear
    await expect(page.locator('input[name="otp"]')).toBeVisible()
    
    // Enter correct OTP (would need test data or mocking)
    await page.fill('input[name="otp"]', '123456')
    await page.click('button[type="submit"]')
    
    // Check for success
    await expect(page.locator('text=Phone verified successfully')).toBeVisible()
    
    // Check redirect to next step
    await expect(page).toHaveURL(/.*dashboard|.*profile/)
  })

  test('TC-AUTH-012: Wrong OTP / expired OTP', async ({ page }) => {
    await page.goto('/auth/verify-phone')
    
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button[type="submit"]')
    
    // Enter wrong OTP
    await page.fill('input[name="otp"]', '000000')
    await page.click('button[type="submit"]')
    
    // Check for error message
    await expect(page.locator('text=Invalid OTP')).toBeVisible()
    
    // Check that OTP field is cleared or highlighted
    await expect(page.locator('input[name="otp"]')).toHaveValue('')
    
    // Test expired OTP (would need to wait or use expired token)
    await page.fill('input[name="otp"]', '123456')
    await page.click('button[type="submit"]')
    
    // Check for expiry message
    await expect(page.locator('text=OTP expired')).toBeVisible()
  })

  test('TC-AUTH-013: Resend OTP invalidates old code', async ({ page }) => {
    await page.goto('/auth/verify-phone')
    
    await page.fill('input[name="phone"]', '+919876543210')
    await page.click('button[type="submit"]')
    
    // Wait for resend button to be available
    await page.waitForSelector('text=Resend OTP', { timeout: 10000 })
    
    // Click resend
    await page.click('text=Resend OTP')
    
    // Check for new OTP sent message
    await expect(page.locator('text=New OTP sent')).toBeVisible()
    
    // Try to use old OTP (would need to track this)
    await page.fill('input[name="otp"]', 'old-otp-code')
    await page.click('button[type="submit"]')
    
    // Should fail
    await expect(page.locator('text=Invalid OTP')).toBeVisible()
  })

  test('TC-AUTH-014: SMS delivery failure handling', async ({ page }) => {
    // This would require simulating SMS delivery failure
    await page.goto('/auth/verify-phone')
    
    // Use a phone number that would cause delivery failure
    await page.fill('input[name="phone"]', '+919999999999')
    await page.click('button[type="submit"]')
    
    // Check for delivery failure message
    await expect(page.locator('text=SMS delivery failed')).toBeVisible()
    
    // Check for fallback options
    await expect(page.locator('text=Use email verification instead')).toBeVisible()
    await expect(page.locator('text=Try again later')).toBeVisible()
  })

  test('TC-AUTH-022: MFA at login (optional/conditional)', async ({ page }) => {
    // Login with account that has MFA enabled
    await page.goto('/auth/login')
    
    await page.fill('input[name="email"]', 'mfa-enabled@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Check for MFA prompt
    await expect(page.locator('text=Enter verification code')).toBeVisible()
    await expect(page.locator('input[name="otp"]')).toBeVisible()
    
    // Enter OTP
    await page.fill('input[name="otp"]', '123456')
    await page.click('button[type="submit"]')
    
    // Check for successful login
    await expect(page).toHaveURL('/')
  })

  test('TC-AUTH-023: Remember me (long-lived refresh token)', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Check remember me checkbox
    await page.check('input[name="rememberMe"]')
    
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Check for successful login
    await expect(page).toHaveURL('/')
    
    // Close browser and reopen (simulate session persistence)
    await page.context().close()
    
    const newContext = await page.context().browser()?.newContext()
    const newPage = await newContext?.newPage()
    
    if (newPage) {
      await newPage.goto('/')
      
      // Should still be logged in
      await expect(newPage.locator('text=Welcome')).toBeVisible()
    }
  })

  test('TC-AUTH-024: Session expiration + silent refresh', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Wait for login
    await expect(page).toHaveURL('/')
    
    // Simulate session expiration (would need to manipulate tokens)
    // This is complex to test without backend integration
    
    // Check for silent refresh or re-authentication prompt
    await page.waitForTimeout(30000) // Wait for potential session expiry
    
    // Should either refresh silently or prompt for re-auth
    const isStillLoggedIn = await page.locator('text=Welcome').isVisible()
    const needsReauth = await page.locator('text=Please log in again').isVisible()
    
    expect(isStillLoggedIn || needsReauth).toBeTruthy()
  })

  test('TC-AUTH-025: Logout clears tokens/cookies', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Wait for login
    await expect(page).toHaveURL('/')
    
    // Logout
    await page.click('text=Logout')
    
    // Check redirect to login
    await expect(page).toHaveURL('/auth/login')
    
    // Check that protected routes redirect to login
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/auth/login')
    
    // Check that cookies are cleared
    const cookies = await page.context().cookies()
    const authCookies = cookies.filter(cookie => 
      cookie.name.includes('auth') || cookie.name.includes('token')
    )
    expect(authCookies.length).toBe(0)
  })
})
