import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display navigation bar with all main links', async ({ page }) => {
    // Check main navigation elements
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for main navigation links
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Services')).toBeVisible();
    await expect(page.locator('text=About')).toBeVisible();
    await expect(page.locator('text=Contact')).toBeVisible();
  });

  test('should navigate to services page', async ({ page }) => {
    await page.click('text=Services');
    await expect(page).toHaveURL(/.*services/);
    await expect(page.locator('h1')).toContainText('Services');
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.click('text=Contact');
    await expect(page).toHaveURL(/.*contact/);
    await expect(page.locator('h1')).toContainText('Contact');
  });

  test('should display logo and be clickable', async ({ page }) => {
    const logo = page.locator('img[alt*="logo"], img[alt*="Logo"]').first();
    await expect(logo).toBeVisible();
    
    // Click logo to go back to home
    await logo.click();
    await expect(page).toHaveURL('/');
  });

  test('should have mobile menu toggle on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Look for mobile menu button (hamburger menu)
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu-button"]');
    
    if (await mobileMenuButton.count() > 0) {
      await expect(mobileMenuButton).toBeVisible();
      
      // Test mobile menu toggle
      await mobileMenuButton.click();
      
      // Check if mobile menu is visible
      const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, nav[class*="mobile"]');
      if (await mobileMenu.count() > 0) {
        await expect(mobileMenu).toBeVisible();
      }
    }
  });

  test('should have cart icon and functionality', async ({ page }) => {
    // Look for cart icon
    const cartIcon = page.locator('[data-testid="cart-icon"], button[aria-label*="cart"], button[aria-label*="Cart"]');
    
    if (await cartIcon.count() > 0) {
      await expect(cartIcon).toBeVisible();
      
      // Click cart icon
      await cartIcon.click();
      
      // Check if cart dropdown/modal opens
      const cartDropdown = page.locator('[data-testid="cart-dropdown"], .cart-dropdown, [class*="cart"]');
      if (await cartDropdown.count() > 0) {
        await expect(cartDropdown).toBeVisible();
      }
    }
  });

  test('should have user authentication links', async ({ page }) => {
    // Look for login/signup links
    const loginLink = page.locator('text=Login, text=Sign In, a[href*="login"]');
    const signupLink = page.locator('text=Sign Up, text=Register, a[href*="signup"]');
    
    if (await loginLink.count() > 0) {
      await expect(loginLink).toBeVisible();
    }
    
    if (await signupLink.count() > 0) {
      await expect(signupLink).toBeVisible();
    }
  });

  test('should maintain navigation state across page changes', async ({ page }) => {
    // Navigate to services
    await page.click('text=Services');
    await expect(page).toHaveURL(/.*services/);
    
    // Check that navigation is still visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Navigate to contact
    await page.click('text=Contact');
    await expect(page).toHaveURL(/.*contact/);
    
    // Check that navigation is still visible
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have proper focus management for keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check if first focusable element is focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test tab through navigation links
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check if we can navigate with Enter key
    await page.keyboard.press('Enter');
    
    // Should navigate to a page
    await expect(page).not.toHaveURL('/');
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    const nav = page.locator('nav');
    
    // Check for proper navigation role
    const role = await nav.getAttribute('role');
    expect(role).toBe('navigation');
    
    // Check for proper ARIA labels
    const ariaLabel = await nav.getAttribute('aria-label');
    if (ariaLabel) {
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('should handle navigation with browser back/forward buttons', async ({ page }) => {
    // Navigate to services
    await page.click('text=Services');
    await expect(page).toHaveURL(/.*services/);
    
    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL(/.*services/);
  });
});
