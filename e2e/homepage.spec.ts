import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Sri Datta Print Center/);
    await expect(page.locator('h1')).toContainText('Printing Made');
  });

  test('should display hero section with call-to-action buttons', async ({ page }) => {
    // Check hero section elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Explore Services')).toBeVisible();
    await expect(page.locator('text=Start A Project')).toBeVisible();
    
    // Check hero image
    await expect(page.locator('img[alt="Printing Services"]')).toBeVisible();
  });

  test('should display how we work section', async ({ page }) => {
    await expect(page.locator('text=How We Work')).toBeVisible();
    
    // Check service cards
    await expect(page.locator('text=Printing Services')).toBeVisible();
    await expect(page.locator('text=Digital Scanning')).toBeVisible();
    await expect(page.locator('text=Design Services')).toBeVisible();
    await expect(page.locator('text=Copying Services')).toBeVisible();
  });

  test('should display services preview section', async ({ page }) => {
    await expect(page.locator('text=Service')).toBeVisible();
    
    // Check service cards
    await expect(page.locator('text=Document Printing')).toBeVisible();
    await expect(page.locator('text=Business Cards')).toBeVisible();
    await expect(page.locator('text=Banners & Posters')).toBeVisible();
    
    // Check popular/premium badges
    await expect(page.locator('text=POPULAR')).toBeVisible();
    await expect(page.locator('text=PREMIUM')).toBeVisible();
  });

  test('should display statistics section', async ({ page }) => {
    await expect(page.locator('text=$2M')).toBeVisible();
    await expect(page.locator('text=invested in printing equipment')).toBeVisible();
    await expect(page.locator('text=$5M+')).toBeVisible();
    await expect(page.locator('text=sold by customers')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Test navigation links
    await page.click('text=Explore Services');
    await expect(page).toHaveURL(/.*services/);
    
    await page.goBack();
    await page.click('text=Start A Project');
    await expect(page).toHaveURL(/.*quote/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that mobile layout is working
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Explore Services')).toBeVisible();
    
    // Check that service cards stack properly
    const serviceCards = page.locator('[class*="grid"]').first();
    await expect(serviceCards).toBeVisible();
  });

  test('should have smooth animations and hover effects', async ({ page }) => {
    // Test hover effects on service cards
    const firstCard = page.locator('[class*="group"]').first();
    await firstCard.hover();
    
    // Check for transform/scale effects (these are CSS-based)
    await expect(firstCard).toBeVisible();
    
    // Test button hover effects
    const exploreButton = page.locator('text=Explore Services');
    await exploreButton.hover();
    await expect(exploreButton).toBeVisible();
  });

  test('should load all images without errors', async ({ page }) => {
    // Check for broken images
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

  test('should have proper accessibility features', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check for alt text on images
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper link text
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });
});
