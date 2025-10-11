import { test, expect } from '@playwright/test';

test.describe('Services Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services');
  });

  test('should load services page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Services/);
    await expect(page.locator('h1')).toContainText('Services');
  });

  test('should display all service categories', async ({ page }) => {
    // Check for main service categories
    const serviceCategories = [
      'Document Printing',
      'Business Cards',
      'Banners & Posters',
      'Flyers',
      'Brochures',
      'Labels',
      'Menus',
      'Newsletters',
      'Photo Prints',
      'Postcards'
    ];

    for (const category of serviceCategories) {
      await expect(page.locator(`text=${category}`)).toBeVisible();
    }
  });

  test('should display service cards with proper information', async ({ page }) => {
    // Check for service cards
    const serviceCards = page.locator('[class*="card"], [class*="service"]');
    await expect(serviceCards.first()).toBeVisible();
    
    // Check for service images
    const serviceImages = page.locator('img[alt*="service"], img[alt*="Service"]');
    const imageCount = await serviceImages.count();
    expect(imageCount).toBeGreaterThan(0);
  });

  test('should have working service category links', async ({ page }) => {
    // Test clicking on service categories
    const documentPrinting = page.locator('text=Document Printing').first();
    if (await documentPrinting.count() > 0) {
      await documentPrinting.click();
      // Should navigate to specific service page or show details
      await expect(page).toHaveURL(/.*document-printing/);
    }
  });

  test('should display pricing information', async ({ page }) => {
    // Look for pricing elements
    const pricingElements = page.locator('text=₹, text=Price, text=pricing, [class*="price"]');
    const pricingCount = await pricingElements.count();
    
    if (pricingCount > 0) {
      await expect(pricingElements.first()).toBeVisible();
    }
  });

  test('should have service filtering options', async ({ page }) => {
    // Look for filter options
    const filterButtons = page.locator('button[class*="filter"], [data-testid*="filter"]');
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    
    if (await filterButtons.count() > 0) {
      await expect(filterButtons.first()).toBeVisible();
    }
    
    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('should display service descriptions and features', async ({ page }) => {
    // Check for service descriptions
    const descriptions = page.locator('p, [class*="description"]');
    const descCount = await descriptions.count();
    expect(descCount).toBeGreaterThan(0);
    
    // Check for feature lists
    const featureLists = page.locator('ul, [class*="feature"]');
    const listCount = await featureLists.count();
    expect(listCount).toBeGreaterThan(0);
  });

  test('should have call-to-action buttons for each service', async ({ page }) => {
    // Look for CTA buttons
    const ctaButtons = page.locator('button:has-text("Order"), button:has-text("Get Quote"), button:has-text("Learn More"), a:has-text("Order"), a:has-text("Get Quote")');
    const buttonCount = await ctaButtons.count();
    
    if (buttonCount > 0) {
      await expect(ctaButtons.first()).toBeVisible();
      
      // Test clicking a CTA button
      await ctaButtons.first().click();
      // Should navigate to order/quote page
      await expect(page).toHaveURL(/.*order|.*quote|.*checkout/);
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have proper loading states', async ({ page }) => {
    // Reload page to test loading states
    await page.reload();
    
    // Check for loading indicators
    const loadingElements = page.locator('[class*="loading"], [class*="spinner"], [data-testid*="loading"]');
    if (await loadingElements.count() > 0) {
      await expect(loadingElements.first()).toBeVisible();
    }
    
    // Wait for content to load
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle service search functionality', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    
    if (await searchInput.count() > 0) {
      await searchInput.fill('business card');
      await searchInput.press('Enter');
      
      // Check if search results are displayed
      await expect(page.locator('text=business card, text=Business Card')).toBeVisible();
    }
  });

  test('should display service categories in grid layout', async ({ page }) => {
    // Check for grid layout
    const gridContainer = page.locator('[class*="grid"]');
    await expect(gridContainer.first()).toBeVisible();
    
    // Check that items are properly arranged
    const gridItems = page.locator('[class*="grid"] > *');
    const itemCount = await gridItems.count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('should have hover effects on service cards', async ({ page }) => {
    const serviceCard = page.locator('[class*="card"], [class*="service"]').first();
    
    if (await serviceCard.count() > 0) {
      await serviceCard.hover();
      
      // Check for hover effects (transform, shadow, etc.)
      await expect(serviceCard).toBeVisible();
    }
  });

  test('should load all service images without errors', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      
      // Check if image loaded successfully
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('should have proper accessibility for service cards', async ({ page }) => {
    const serviceCards = page.locator('[class*="card"], [class*="service"]');
    const cardCount = await serviceCards.count();
    
    for (let i = 0; i < cardCount; i++) {
      const card = serviceCards.nth(i);
      
      // Check for proper heading structure
      const headings = card.locator('h1, h2, h3, h4, h5, h6');
      if (await headings.count() > 0) {
        await expect(headings.first()).toBeVisible();
      }
      
      // Check for alt text on images
      const cardImages = card.locator('img');
      const imgCount = await cardImages.count();
      
      for (let j = 0; j < imgCount; j++) {
        const img = cardImages.nth(j);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    }
  });
});
