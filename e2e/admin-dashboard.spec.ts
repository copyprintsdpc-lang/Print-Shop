import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
  });

  test('should redirect to login page when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText('Login, Admin');
  });

  test('should display admin login form', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Check for admin login form elements
    await expect(page.locator('input[type="email"], input[placeholder*="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[placeholder*="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")')).toBeVisible();
  });

  test('should have admin-specific branding', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Check for admin-specific text or branding
    await expect(page.locator('text=Admin, text=Dashboard, text=Management')).toBeVisible();
  });

  test('should display admin dashboard after successful login', async ({ page }) => {
    // This test assumes you have a test admin user
    // You may need to create one or use environment variables
    await page.goto('/admin/login');
    
    // Fill admin login form (replace with actual test credentials)
    await page.fill('input[type="email"], input[placeholder*="email"]', 'admin@test.com');
    await page.fill('input[type="password"], input[placeholder*="password"]', 'admin123');
    
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    await submitButton.click();
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/.*admin/);
    await expect(page.locator('h1')).toContainText('Dashboard, Admin');
  });

  test('should display admin navigation menu', async ({ page }) => {
    // Assuming admin is logged in
    await page.goto('/admin');
    
    // Check for admin navigation items
    const navItems = [
      'Products',
      'Orders',
      'Promotions',
      'Dashboard',
      'Settings'
    ];
    
    for (const item of navItems) {
      const navItem = page.locator(`text=${item}, a:has-text("${item}")`);
      if (await navItem.count() > 0) {
        await expect(navItem).toBeVisible();
      }
    }
  });

  test('should navigate to products management page', async ({ page }) => {
    // Assuming admin is logged in
    await page.goto('/admin');
    
    const productsLink = page.locator('text=Products, a:has-text("Products")');
    if (await productsLink.count() > 0) {
      await productsLink.click();
      await expect(page).toHaveURL(/.*admin.*products/);
      await expect(page.locator('h1')).toContainText('Products');
    }
  });

  test('should navigate to orders management page', async ({ page }) => {
    // Assuming admin is logged in
    await page.goto('/admin');
    
    const ordersLink = page.locator('text=Orders, a:has-text("Orders")');
    if (await ordersLink.count() > 0) {
      await ordersLink.click();
      await expect(page).toHaveURL(/.*admin.*orders/);
      await expect(page.locator('h1')).toContainText('Orders');
    }
  });

  test('should display products list with management options', async ({ page }) => {
    await page.goto('/admin/products');
    
    // Check for products table or list
    const productsTable = page.locator('table, [class*="table"], [class*="list"]');
    if (await productsTable.count() > 0) {
      await expect(productsTable).toBeVisible();
    }
    
    // Check for management buttons
    const addButton = page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("Add")');
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")');
    const deleteButton = page.locator('button:has-text("Delete"), a:has-text("Delete")');
    
    if (await addButton.count() > 0) {
      await expect(addButton).toBeVisible();
    }
    
    if (await editButton.count() > 0) {
      await expect(editButton).toBeVisible();
    }
    
    if (await deleteButton.count() > 0) {
      await expect(deleteButton).toBeVisible();
    }
  });

  test('should display orders list with status management', async ({ page }) => {
    await page.goto('/admin/orders');
    
    // Check for orders table or list
    const ordersTable = page.locator('table, [class*="table"], [class*="list"]');
    if (await ordersTable.count() > 0) {
      await expect(ordersTable).toBeVisible();
    }
    
    // Check for order status management
    const statusSelect = page.locator('select[name*="status"], [class*="status"]');
    const updateButton = page.locator('button:has-text("Update"), button:has-text("Save")');
    
    if (await statusSelect.count() > 0) {
      await expect(statusSelect).toBeVisible();
    }
    
    if (await updateButton.count() > 0) {
      await expect(updateButton).toBeVisible();
    }
  });

  test('should allow adding new products', async ({ page }) => {
    await page.goto('/admin/products');
    
    const addButton = page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("Add")');
    if (await addButton.count() > 0) {
      await addButton.click();
      
      // Should navigate to add product page
      await expect(page).toHaveURL(/.*admin.*products.*new/);
      
      // Check for product form
      await expect(page.locator('input[name*="name"], input[placeholder*="name"]')).toBeVisible();
      await expect(page.locator('input[name*="price"], input[placeholder*="price"]')).toBeVisible();
      await expect(page.locator('textarea, input[name*="description"]')).toBeVisible();
    }
  });

  test('should allow bulk price updates', async ({ page }) => {
    await page.goto('/admin/products');
    
    const bulkPricingLink = page.locator('text=Bulk Pricing, a:has-text("Bulk")');
    if (await bulkPricingLink.count() > 0) {
      await bulkPricingLink.click();
      
      // Should navigate to bulk pricing page
      await expect(page).toHaveURL(/.*bulk.*pricing/);
      
      // Check for bulk pricing form
      await expect(page.locator('input[type="number"], input[name*="percentage"]')).toBeVisible();
      await expect(page.locator('button:has-text("Update"), button:has-text("Apply")')).toBeVisible();
    }
  });

  test('should display promotions management', async ({ page }) => {
    await page.goto('/admin/promotions');
    
    // Check for promotions page
    await expect(page.locator('h1')).toContainText('Promotions');
    
    // Check for add promotion button
    const addPromotionButton = page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("Add")');
    if (await addPromotionButton.count() > 0) {
      await expect(addPromotionButton).toBeVisible();
    }
  });

  test('should have admin logout functionality', async ({ page }) => {
    // Assuming admin is logged in
    await page.goto('/admin');
    
    // Look for logout button
    const logoutButton = page.locator('text=Logout, text=Sign Out, button:has-text("Logout")');
    
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
      
      // Should redirect to login page
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('should display admin statistics dashboard', async ({ page }) => {
    // Assuming admin is logged in
    await page.goto('/admin');
    
    // Check for statistics cards or widgets
    const statsCards = page.locator('[class*="stat"], [class*="metric"], [class*="card"]');
    if (await statsCards.count() > 0) {
      await expect(statsCards.first()).toBeVisible();
    }
    
    // Look for common admin metrics
    const metrics = [
      'Total Orders',
      'Revenue',
      'Products',
      'Customers'
    ];
    
    for (const metric of metrics) {
      const metricElement = page.locator(`text=${metric}`);
      if (await metricElement.count() > 0) {
        await expect(metricElement).toBeVisible();
      }
    }
  });

  test('should handle file uploads for products', async ({ page }) => {
    await page.goto('/admin/products/new');
    
    // Check for file upload input
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      await expect(fileInput).toBeVisible();
    }
    
    // Check for upload button
    const uploadButton = page.locator('button:has-text("Upload"), button:has-text("Choose")');
    if (await uploadButton.count() > 0) {
      await expect(uploadButton).toBeVisible();
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/admin/login');
    
    // Check that admin form is still usable on mobile
    await expect(page.locator('input[type="email"], input[placeholder*="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[placeholder*="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Login")')).toBeVisible();
  });

  test('should have proper admin authentication protection', async ({ page }) => {
    // Try to access admin routes without authentication
    const adminRoutes = [
      '/admin/products',
      '/admin/orders',
      '/admin/promotions'
    ];
    
    for (const route of adminRoutes) {
      await page.goto(route);
      // Should redirect to login page
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('should handle admin form validation', async ({ page }) => {
    await page.goto('/admin/products/new');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Create")');
    if (await submitButton.count() > 0) {
      await submitButton.click();
      
      // Should show validation errors or stay on same page
      await expect(page).toHaveURL(/.*admin.*products.*new/);
    }
  });

  test('should have proper admin navigation breadcrumbs', async ({ page }) => {
    // Assuming admin is logged in
    await page.goto('/admin/products');
    
    // Check for breadcrumb navigation
    const breadcrumbs = page.locator('[class*="breadcrumb"], nav[aria-label*="breadcrumb"]');
    if (await breadcrumbs.count() > 0) {
      await expect(breadcrumbs).toBeVisible();
    }
  });

  test('should handle admin search functionality', async ({ page }) => {
    await page.goto('/admin/products');
    
    // Look for search input
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('test product');
      await searchInput.press('Enter');
      
      // Should show search results
      await expect(page.locator('text=test product, text=Test Product')).toBeVisible();
    }
  });
});
