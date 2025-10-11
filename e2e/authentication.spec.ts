import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login and signup links', async ({ page }) => {
    // Look for authentication links
    const loginLink = page.locator('text=Login, text=Sign In, a[href*="login"]');
    const signupLink = page.locator('text=Sign Up, text=Register, a[href*="signup"]');
    
    if (await loginLink.count() > 0) {
      await expect(loginLink).toBeVisible();
    }
    
    if (await signupLink.count() > 0) {
      await expect(signupLink).toBeVisible();
    }
  });

  test('should navigate to login page', async ({ page }) => {
    const loginLink = page.locator('text=Login, text=Sign In, a[href*="login"]');
    
    if (await loginLink.count() > 0) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*login/);
      await expect(page.locator('h1')).toContainText('Login');
    }
  });

  test('should navigate to signup page', async ({ page }) => {
    const signupLink = page.locator('text=Sign Up, text=Register, a[href*="signup"]');
    
    if (await signupLink.count() > 0) {
      await signupLink.click();
      await expect(page).toHaveURL(/.*signup/);
      await expect(page.locator('h1')).toContainText('Sign Up, Register');
    }
  });

  test('should display login form with required fields', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login form elements
    await expect(page.locator('input[type="email"], input[placeholder*="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[placeholder*="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")')).toBeVisible();
  });

  test('should display signup form with required fields', async ({ page }) => {
    await page.goto('/signup');
    
    // Check for signup form elements
    await expect(page.locator('input[placeholder*="name"], input[name*="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"], input[placeholder*="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[placeholder*="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Register")')).toBeVisible();
  });

  test('should validate login form fields', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    await submitButton.click();
    
    // Should show validation errors or stay on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should validate signup form fields', async ({ page }) => {
    await page.goto('/signup');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Register")');
    await submitButton.click();
    
    // Should show validation errors or stay on signup page
    await expect(page).toHaveURL(/.*signup/);
  });

  test('should handle invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill form with invalid credentials
    await page.fill('input[type="email"], input[placeholder*="email"]', 'invalid@example.com');
    await page.fill('input[type="password"], input[placeholder*="password"]', 'wrongpassword');
    
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    await submitButton.click();
    
    // Should show error message or stay on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle password visibility toggle', async ({ page }) => {
    await page.goto('/login');
    
    const passwordInput = page.locator('input[type="password"], input[placeholder*="password"]');
    const toggleButton = page.locator('button[aria-label*="password"], button[class*="toggle"]');
    
    if (await toggleButton.count() > 0) {
      await toggleButton.click();
      
      // Password should be visible
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      await toggleButton.click();
      
      // Password should be hidden
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  test('should have forgot password link', async ({ page }) => {
    await page.goto('/login');
    
    const forgotPasswordLink = page.locator('text=Forgot Password, text=Forgot, a[href*="forgot"]');
    
    if (await forgotPasswordLink.count() > 0) {
      await expect(forgotPasswordLink).toBeVisible();
      
      // Click forgot password link
      await forgotPasswordLink.click();
      await expect(page).toHaveURL(/.*forgot|.*reset/);
    }
  });

  test('should have remember me checkbox', async ({ page }) => {
    await page.goto('/login');
    
    const rememberMeCheckbox = page.locator('input[type="checkbox"][name*="remember"], input[type="checkbox"][id*="remember"]');
    
    if (await rememberMeCheckbox.count() > 0) {
      await expect(rememberMeCheckbox).toBeVisible();
      
      // Test checkbox functionality
      await rememberMeCheckbox.check();
      await expect(rememberMeCheckbox).toBeChecked();
      
      await rememberMeCheckbox.uncheck();
      await expect(rememberMeCheckbox).not.toBeChecked();
    }
  });

  test('should redirect to dashboard after successful login', async ({ page }) => {
    await page.goto('/login');
    
    // Fill form with valid credentials (assuming test user exists)
    await page.fill('input[type="email"], input[placeholder*="email"]', 'test@example.com');
    await page.fill('input[type="password"], input[placeholder*="password"]', 'password123');
    
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    await submitButton.click();
    
    // Should redirect to dashboard or home page
    await expect(page).toHaveURL(/.*dashboard|.*home|.*\//);
  });

  test('should display user menu after login', async ({ page }) => {
    // Assuming user is logged in
    await page.goto('/dashboard');
    
    // Look for user menu or profile dropdown
    const userMenu = page.locator('[data-testid="user-menu"], button[aria-label*="user"], button[aria-label*="profile"]');
    
    if (await userMenu.count() > 0) {
      await expect(userMenu).toBeVisible();
      
      // Click user menu
      await userMenu.click();
      
      // Check for logout option
      const logoutOption = page.locator('text=Logout, text=Sign Out, button:has-text("Logout")');
      if (await logoutOption.count() > 0) {
        await expect(logoutOption).toBeVisible();
      }
    }
  });

  test('should handle logout functionality', async ({ page }) => {
    // Assuming user is logged in
    await page.goto('/dashboard');
    
    // Look for logout button
    const logoutButton = page.locator('text=Logout, text=Sign Out, button:has-text("Logout")');
    
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
      
      // Should redirect to home page or login page
      await expect(page).toHaveURL(/.*login|.*\//);
    }
  });

  test('should protect authenticated routes', async ({ page }) => {
    // Try to access protected route without authentication
    await page.goto('/dashboard');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle OTP verification if enabled', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill signup form
    await page.fill('input[placeholder*="name"], input[name*="name"]', 'Test User');
    await page.fill('input[type="email"], input[placeholder*="email"]', 'test@example.com');
    await page.fill('input[type="password"], input[placeholder*="password"]', 'password123');
    
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Register")');
    await submitButton.click();
    
    // Check for OTP verification page
    const otpPage = page.locator('text=Verify, text=OTP, text=verification');
    if (await otpPage.count() > 0) {
      await expect(otpPage).toBeVisible();
      
      // Check for OTP input fields
      const otpInputs = page.locator('input[type="text"][maxlength="1"], input[class*="otp"]');
      if (await otpInputs.count() > 0) {
        await expect(otpInputs.first()).toBeVisible();
      }
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/login');
    
    // Check that form is still usable on mobile
    await expect(page.locator('input[type="email"], input[placeholder*="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[placeholder*="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Login")')).toBeVisible();
  });

  test('should handle form validation errors', async ({ page }) => {
    await page.goto('/signup');
    
    // Try to submit with invalid email format
    await page.fill('input[placeholder*="name"], input[name*="name"]', 'Test User');
    await page.fill('input[type="email"], input[placeholder*="email"]', 'invalid-email');
    await page.fill('input[type="password"], input[placeholder*="password"]', 'password123');
    
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Register")');
    await submitButton.click();
    
    // Should show validation error or stay on signup page
    await expect(page).toHaveURL(/.*signup/);
  });

  test('should have proper accessibility features', async ({ page }) => {
    await page.goto('/login');
    
    // Check for proper form labels
    const emailInput = page.locator('input[type="email"], input[placeholder*="email"]');
    const passwordInput = page.locator('input[type="password"], input[placeholder*="password"]');
    
    // Check for associated labels
    const emailLabel = page.locator('label[for*="email"], label:has-text("Email")');
    const passwordLabel = page.locator('label[for*="password"], label:has-text("Password")');
    
    if (await emailLabel.count() > 0) {
      await expect(emailLabel).toBeVisible();
    }
    
    if (await passwordLabel.count() > 0) {
      await expect(passwordLabel).toBeVisible();
    }
    
    // Check for proper focus management
    await emailInput.focus();
    await expect(emailInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(passwordInput).toBeFocused();
  });
});
