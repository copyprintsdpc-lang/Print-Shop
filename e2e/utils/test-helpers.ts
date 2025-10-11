import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Fill form fields with data
   */
  async fillForm(formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      const input = this.page.locator(`input[name*="${field}"], input[placeholder*="${field}"], textarea[name*="${field}"]`);
      if (await input.count() > 0) {
        await input.fill(value);
      }
    }
  }

  /**
   * Click button by text content
   */
  async clickButton(buttonText: string) {
    const button = this.page.locator(`button:has-text("${buttonText}"), a:has-text("${buttonText}")`);
    await expect(button).toBeVisible();
    await button.click();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    return await this.page.locator(selector).count() > 0;
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }

  /**
   * Login as admin user
   */
  async loginAsAdmin(email = 'admin@test.com', password = 'admin123') {
    await this.page.goto('/admin/login');
    await this.fillForm({
      email,
      password
    });
    await this.clickButton('Login');
    await this.waitForPageLoad();
  }

  /**
   * Login as regular user
   */
  async loginAsUser(email = 'user@test.com', password = 'password123') {
    await this.page.goto('/login');
    await this.fillForm({
      email,
      password
    });
    await this.clickButton('Login');
    await this.waitForPageLoad();
  }

  /**
   * Add product to cart
   */
  async addProductToCart() {
    await this.page.goto('/services');
    const addToCartButton = this.page.locator('button:has-text("Add to Cart"), button:has-text("Order Now")').first();
    if (await this.elementExists('button:has-text("Add to Cart"), button:has-text("Order Now")')) {
      await addToCartButton.click();
    }
  }

  /**
   * Complete checkout flow
   */
  async completeCheckout(customerInfo = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890'
  }) {
    await this.page.goto('/checkout');
    
    // Step 1: Customer Info
    await this.fillForm(customerInfo);
    await this.clickButton('Next');
    
    // Step 2: Delivery
    const pickupOption = this.page.locator('input[value="pickup"], label:has-text("Pickup")');
    if (await this.elementExists('input[value="pickup"], label:has-text("Pickup")')) {
      await pickupOption.click();
    }
    await this.clickButton('Next');
    
    // Step 3: Artwork (skip)
    await this.clickButton('Next');
    
    // Step 4: Payment
    await this.clickButton('Next');
    
    // Step 5: Review
    await this.waitForElement('text=Review, text=Order Summary');
  }

  /**
   * Check for validation errors
   */
  async checkForValidationErrors() {
    const errorMessages = this.page.locator('[class*="error"], [class*="invalid"], .text-red-500, .text-red-600');
    return await errorMessages.count() > 0;
  }

  /**
   * Wait for API response
   */
  async waitForApiResponse(urlPattern: string) {
    await this.page.waitForResponse(response => 
      response.url().includes(urlPattern) && response.status() === 200
    );
  }

  /**
   * Mock API response
   */
  async mockApiResponse(url: string, response: any) {
    await this.page.route(url, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  /**
   * Check if page has proper meta tags
   */
  async checkMetaTags() {
    const title = await this.page.title();
    expect(title).toBeTruthy();
    
    const description = await this.page.locator('meta[name="description"]').getAttribute('content');
    if (description) {
      expect(description).toBeTruthy();
    }
  }

  /**
   * Check for broken images
   */
  async checkForBrokenImages() {
    const images = this.page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  }

  /**
   * Check for console errors
   */
  async checkForConsoleErrors() {
    const errors: string[] = [];
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    return errors;
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation() {
    await this.page.keyboard.press('Tab');
    const focusedElement = this.page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  }

  /**
   * Test mobile viewport
   */
  async testMobileViewport() {
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.waitForPageLoad();
  }

  /**
   * Test tablet viewport
   */
  async testTabletViewport() {
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.waitForPageLoad();
  }

  /**
   * Test desktop viewport
   */
  async testDesktopViewport() {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.waitForPageLoad();
  }
}

/**
 * Common test data
 */
export const testData = {
  admin: {
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Admin User'
  },
  user: {
    email: 'user@test.com',
    password: 'password123',
    name: 'Test User',
    phone: '1234567890'
  },
  product: {
    name: 'Test Product',
    price: '100',
    description: 'Test product description'
  },
  order: {
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890'
    },
    delivery: {
      method: 'pickup',
      address: {
        line1: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    }
  }
};

/**
 * Common selectors
 */
export const selectors = {
  navigation: {
    home: 'text=Home',
    services: 'text=Services',
    about: 'text=About',
    contact: 'text=Contact',
    login: 'text=Login',
    signup: 'text=Sign Up'
  },
  forms: {
    email: 'input[type="email"], input[placeholder*="email"]',
    password: 'input[type="password"], input[placeholder*="password"]',
    name: 'input[placeholder*="name"], input[name*="name"]',
    phone: 'input[placeholder*="phone"], input[name*="phone"]',
    submit: 'button[type="submit"]'
  },
  buttons: {
    addToCart: 'button:has-text("Add to Cart"), button:has-text("Order Now")',
    next: 'button:has-text("Next")',
    previous: 'button:has-text("Previous")',
    login: 'button:has-text("Login"), button:has-text("Sign In")',
    signup: 'button:has-text("Sign Up"), button:has-text("Register")'
  }
};
