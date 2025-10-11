import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from services page and add items to cart
    await page.goto('/services');
    
    // Add a product to cart (assuming there's an "Add to Cart" button)
    const addToCartButton = page.locator('button:has-text("Add to Cart"), button:has-text("Order Now")').first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
    }
    
    // Navigate to checkout
    await page.goto('/checkout');
  });

  test('should load checkout page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Checkout/);
    await expect(page.locator('h1')).toContainText('Checkout');
  });

  test('should display checkout steps progress', async ({ page }) => {
    // Check for step indicators
    const steps = page.locator('[class*="step"], [data-testid*="step"]');
    const stepCount = await steps.count();
    expect(stepCount).toBeGreaterThan(0);
    
    // Check for step names
    await expect(page.locator('text=Customer Info, text=Delivery, text=Artwork, text=Payment, text=Review')).toBeVisible();
  });

  test('should complete customer information step', async ({ page }) => {
    // Fill customer information
    await page.fill('input[placeholder*="name"], input[name*="name"]', 'John Doe');
    await page.fill('input[placeholder*="email"], input[name*="email"]', 'john@example.com');
    await page.fill('input[placeholder*="phone"], input[name*="phone"]', '1234567890');
    
    // Click next button
    const nextButton = page.locator('button:has-text("Next")');
    await nextButton.click();
    
    // Should move to next step
    await expect(page.locator('text=Delivery')).toBeVisible();
  });

  test('should complete delivery information step', async ({ page }) => {
    // Complete customer info first
    await page.fill('input[placeholder*="name"], input[name*="name"]', 'John Doe');
    await page.fill('input[placeholder*="email"], input[name*="email"]', 'john@example.com');
    await page.fill('input[placeholder*="phone"], input[name*="phone"]', '1234567890');
    await page.click('button:has-text("Next")');
    
    // Select delivery method
    const pickupOption = page.locator('input[value="pickup"], label:has-text("Pickup")');
    const courierOption = page.locator('input[value="courier"], label:has-text("Courier")');
    
    if (await pickupOption.count() > 0) {
      await pickupOption.click();
    } else if (await courierOption.count() > 0) {
      await courierOption.click();
      
      // Fill delivery address if courier is selected
      await page.fill('input[placeholder*="address"], input[name*="address"]', '123 Main St');
      await page.fill('input[placeholder*="city"], input[name*="city"]', 'Mumbai');
      await page.fill('input[placeholder*="state"], input[name*="state"]', 'Maharashtra');
      await page.fill('input[placeholder*="pincode"], input[name*="pincode"]', '400001');
    }
    
    // Click next
    await page.click('button:has-text("Next")');
    
    // Should move to artwork step
    await expect(page.locator('text=Artwork, text=Upload')).toBeVisible();
  });

  test('should handle artwork upload step', async ({ page }) => {
    // Complete previous steps
    await page.fill('input[placeholder*="name"], input[name*="name"]', 'John Doe');
    await page.fill('input[placeholder*="email"], input[name*="email"]', 'john@example.com');
    await page.fill('input[placeholder*="phone"], input[name*="phone"]', '1234567890');
    await page.click('button:has-text("Next")');
    
    // Select delivery method
    const pickupOption = page.locator('input[value="pickup"], label:has-text("Pickup")');
    if (await pickupOption.count() > 0) {
      await pickupOption.click();
    }
    await page.click('button:has-text("Next")');
    
    // Check for file upload area
    const fileUpload = page.locator('input[type="file"], [class*="upload"], [data-testid*="upload"]');
    if (await fileUpload.count() > 0) {
      await expect(fileUpload).toBeVisible();
    }
    
    // Check for upload guidelines
    await expect(page.locator('text=Artwork Guidelines, text=Upload')).toBeVisible();
    
    // Click next (artwork is optional)
    await page.click('button:has-text("Next")');
    
    // Should move to payment step
    await expect(page.locator('text=Payment')).toBeVisible();
  });

  test('should complete payment method selection', async ({ page }) => {
    // Complete previous steps
    await page.fill('input[placeholder*="name"], input[name*="name"]', 'John Doe');
    await page.fill('input[placeholder*="email"], input[name*="email"]', 'john@example.com');
    await page.fill('input[placeholder*="phone"], input[name*="phone"]', '1234567890');
    await page.click('button:has-text("Next")');
    
    const pickupOption = page.locator('input[value="pickup"], label:has-text("Pickup")');
    if (await pickupOption.count() > 0) {
      await pickupOption.click();
    }
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Next")');
    
    // Select payment method
    const onlinePayment = page.locator('input[value="razorpay"], label:has-text("Online Payment")');
    const codPayment = page.locator('input[value="cod"], label:has-text("Cash on Delivery")');
    
    if (await onlinePayment.count() > 0) {
      await onlinePayment.click();
    } else if (await codPayment.count() > 0) {
      await codPayment.click();
    }
    
    // Click next
    await page.click('button:has-text("Next")');
    
    // Should move to review step
    await expect(page.locator('text=Review, text=Order')).toBeVisible();
  });

  test('should display order summary in review step', async ({ page }) => {
    // Complete all previous steps
    await page.fill('input[placeholder*="name"], input[name*="name"]', 'John Doe');
    await page.fill('input[placeholder*="email"], input[name*="email"]', 'john@example.com');
    await page.fill('input[placeholder*="phone"], input[name*="phone"]', '1234567890');
    await page.click('button:has-text("Next")');
    
    const pickupOption = page.locator('input[value="pickup"], label:has-text("Pickup")');
    if (await pickupOption.count() > 0) {
      await pickupOption.click();
    }
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Next")');
    
    // Check for order summary
    await expect(page.locator('text=Order Summary, text=Review')).toBeVisible();
    
    // Check for order items
    await expect(page.locator('text=Order Items, text=Items')).toBeVisible();
    
    // Check for pricing breakdown
    await expect(page.locator('text=Subtotal, text=Total, text=₹')).toBeVisible();
  });

  test('should allow going back to previous steps', async ({ page }) => {
    // Complete first step
    await page.fill('input[placeholder*="name"], input[name*="name"]', 'John Doe');
    await page.fill('input[placeholder*="email"], input[name*="email"]', 'john@example.com');
    await page.fill('input[placeholder*="phone"], input[name*="phone"]', '1234567890');
    await page.click('button:has-text("Next")');
    
    // Go back to previous step
    const previousButton = page.locator('button:has-text("Previous")');
    if (await previousButton.count() > 0) {
      await previousButton.click();
      
      // Should be back to customer info step
      await expect(page.locator('text=Customer Info')).toBeVisible();
    }
  });

  test('should validate required fields', async ({ page }) => {
    // Try to proceed without filling required fields
    const nextButton = page.locator('button:has-text("Next")');
    await nextButton.click();
    
    // Should show validation errors or stay on same step
    await expect(page.locator('text=Customer Info')).toBeVisible();
  });

  test('should display order summary sidebar', async ({ page }) => {
    // Check for order summary sidebar
    const orderSummary = page.locator('[class*="summary"], [class*="sidebar"]');
    await expect(orderSummary).toBeVisible();
    
    // Check for pricing details
    await expect(page.locator('text=Subtotal, text=Shipping, text=GST, text=Total')).toBeVisible();
  });

  test('should handle payment integration', async ({ page }) => {
    // Complete all steps to reach payment
    await page.fill('input[placeholder*="name"], input[name*="name"]', 'John Doe');
    await page.fill('input[placeholder*="email"], input[name*="email"]', 'john@example.com');
    await page.fill('input[placeholder*="phone"], input[name*="phone"]', '1234567890');
    await page.click('button:has-text("Next")');
    
    const pickupOption = page.locator('input[value="pickup"], label:has-text("Pickup")');
    if (await pickupOption.count() > 0) {
      await pickupOption.click();
    }
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Next")');
    
    // Check for place order button
    const placeOrderButton = page.locator('button:has-text("Place Order"), button:has-text("Complete Order")');
    await expect(placeOrderButton).toBeVisible();
    
    // Note: We won't actually click place order to avoid real payment
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that checkout form is still usable
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[placeholder*="name"], input[name*="name"]')).toBeVisible();
    
    // Check that steps are still visible
    const steps = page.locator('[class*="step"], [data-testid*="step"]');
    await expect(steps.first()).toBeVisible();
  });

  test('should handle form validation errors gracefully', async ({ page }) => {
    // Try to submit with invalid email
    await page.fill('input[placeholder*="name"], input[name*="name"]', 'John Doe');
    await page.fill('input[placeholder*="email"], input[name*="email"]', 'invalid-email');
    await page.fill('input[placeholder*="phone"], input[name*="phone"]', '1234567890');
    
    const nextButton = page.locator('button:has-text("Next")');
    await nextButton.click();
    
    // Should show validation error or stay on same step
    await expect(page.locator('text=Customer Info')).toBeVisible();
  });
});
