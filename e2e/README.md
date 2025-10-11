# End-to-End Testing with Playwright

This directory contains comprehensive end-to-end tests for the Sri Datta Print Center application using Playwright.

## 🚀 Quick Start

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Tests with UI
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode
```bash
npm run test:e2e:headed
```

### Debug Tests
```bash
npm run test:e2e:debug
```

### View Test Report
```bash
npm run test:e2e:report
```

## 📁 Test Structure

```
e2e/
├── homepage.spec.ts          # Homepage functionality tests
├── navigation.spec.ts        # Navigation and menu tests
├── services.spec.ts          # Services page tests
├── checkout-flow.spec.ts     # Complete checkout process tests
├── authentication.spec.ts    # Login/signup functionality tests
├── admin-dashboard.spec.ts   # Admin panel tests
├── utils/
│   └── test-helpers.ts       # Test utilities and helpers
└── README.md                 # This file
```

## 🧪 Test Categories

### 1. Homepage Tests (`homepage.spec.ts`)
- Page loading and title verification
- Hero section display and functionality
- Service cards and call-to-action buttons
- Statistics section
- Responsive design testing
- Image loading verification
- Accessibility features

### 2. Navigation Tests (`navigation.spec.ts`)
- Main navigation menu functionality
- Mobile menu toggle
- Cart icon and functionality
- User authentication links
- Focus management for keyboard navigation
- Browser back/forward button handling

### 3. Services Tests (`services.spec.ts`)
- Service page loading
- Service category display
- Service card information
- Pricing display
- Filtering and search functionality
- Call-to-action buttons
- Responsive design

### 4. Checkout Flow Tests (`checkout-flow.spec.ts`)
- Multi-step checkout process
- Customer information validation
- Delivery method selection
- Artwork upload functionality
- Payment method selection
- Order review and summary
- Form validation and error handling

### 5. Authentication Tests (`authentication.spec.ts`)
- Login form functionality
- Signup form functionality
- Form validation
- Password visibility toggle
- Forgot password functionality
- User menu and logout
- Protected route access

### 6. Admin Dashboard Tests (`admin-dashboard.spec.ts`)
- Admin login functionality
- Dashboard navigation
- Products management
- Orders management
- Promotions management
- Admin authentication protection
- Responsive admin interface

## 🛠️ Test Utilities

### TestHelpers Class
Located in `utils/test-helpers.ts`, provides common testing utilities:

- `waitForPageLoad()` - Wait for page to be fully loaded
- `fillForm(formData)` - Fill form fields with data
- `clickButton(buttonText)` - Click button by text content
- `loginAsAdmin()` - Login as admin user
- `loginAsUser()` - Login as regular user
- `addProductToCart()` - Add product to cart
- `completeCheckout()` - Complete checkout flow
- `checkForValidationErrors()` - Check for form validation errors
- `testMobileViewport()` - Test mobile responsiveness
- `testTabletViewport()` - Test tablet responsiveness
- `testDesktopViewport()` - Test desktop responsiveness

### Test Data
Common test data is available in `test-helpers.ts`:

```typescript
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
  // ... more test data
};
```

### Common Selectors
Reusable selectors for common elements:

```typescript
export const selectors = {
  navigation: {
    home: 'text=Home',
    services: 'text=Services',
    // ... more navigation selectors
  },
  forms: {
    email: 'input[type="email"], input[placeholder*="email"]',
    password: 'input[type="password"], input[placeholder*="password"]',
    // ... more form selectors
  },
  // ... more selector categories
};
```

## 🎯 Test Configuration

### Playwright Configuration (`playwright.config.ts`)
- **Test Directory**: `./e2e`
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Testing**: Pixel 5, iPhone 12
- **Parallel Execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

### Test Environment
- **Development Server**: Automatically started before tests
- **Database**: Uses test database (configure in `.env.test`)
- **File Uploads**: Mocked for testing
- **API Calls**: Can be mocked using `mockApiResponse()`

## 🔧 Running Tests

### Prerequisites
1. Install dependencies: `npm install`
2. Set up environment variables in `.env.test`
3. Start the development server: `npm run dev`

### Test Commands

#### Run All Tests
```bash
npm run test:e2e
```

#### Run Specific Test File
```bash
npx playwright test homepage.spec.ts
```

#### Run Tests Matching Pattern
```bash
npx playwright test --grep "should load homepage"
```

#### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
```

#### Run Tests in Headed Mode
```bash
npx playwright test --headed
```

#### Debug Tests
```bash
npx playwright test --debug
```

#### Run Tests with UI
```bash
npx playwright test --ui
```

## 📊 Test Reports

### HTML Report
After running tests, view the HTML report:
```bash
npm run test:e2e:report
```

### JSON Report
Test results are saved to `test-results/results.json`

### JUnit Report
Test results are saved to `test-results/results.xml` for CI integration

## 🐛 Debugging Tests

### Debug Mode
Run tests in debug mode to step through them:
```bash
npx playwright test --debug
```

### Screenshots
Screenshots are automatically taken on test failures and saved to `test-results/`

### Videos
Videos are recorded for failed tests and saved to `test-results/`

### Traces
Traces are generated for failed tests and can be viewed with:
```bash
npx playwright show-trace test-results/trace.zip
```

## 🚀 CI/CD Integration

### GitHub Actions
Add to `.github/workflows/e2e.yml`:

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Environment Variables
Set up these environment variables for CI:

```env
# Test Database
MONGODB_URI=mongodb://localhost:27017/test-db

# Test Admin User
TEST_ADMIN_EMAIL=admin@test.com
TEST_ADMIN_PASSWORD=admin123

# Test User
TEST_USER_EMAIL=user@test.com
TEST_USER_PASSWORD=password123
```

## 📝 Writing New Tests

### Test Structure
```typescript
import { test, expect } from '@playwright/test';
import { TestHelpers, testData } from './utils/test-helpers';

test.describe('Feature Name', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Best Practices
1. **Use descriptive test names** that explain what the test does
2. **Group related tests** in `describe` blocks
3. **Use page object model** for complex pages
4. **Mock external dependencies** when possible
5. **Test both success and error cases**
6. **Use data attributes** for reliable selectors
7. **Clean up after tests** to avoid test pollution

### Common Patterns

#### Testing Form Submissions
```typescript
test('should submit form successfully', async ({ page }) => {
  await helpers.fillForm({
    name: 'Test User',
    email: 'test@example.com'
  });
  await helpers.clickButton('Submit');
  await expect(page).toHaveURL(/.*success/);
});
```

#### Testing Responsive Design
```typescript
test('should be responsive on mobile', async ({ page }) => {
  await helpers.testMobileViewport();
  await expect(page.locator('h1')).toBeVisible();
});
```

#### Testing API Integration
```typescript
test('should handle API errors gracefully', async ({ page }) => {
  await helpers.mockApiResponse('/api/products', { error: 'Server error' });
  await page.goto('/products');
  await expect(page.locator('text=Error loading products')).toBeVisible();
});
```

## 🔍 Troubleshooting

### Common Issues

#### Tests Failing Due to Timing
- Use `waitForPageLoad()` or `waitForElement()`
- Increase timeout if needed
- Check for loading states

#### Element Not Found
- Use more specific selectors
- Check if element is visible
- Wait for element to appear

#### Authentication Issues
- Ensure test users exist in database
- Check authentication flow
- Use `loginAsAdmin()` or `loginAsUser()` helpers

#### Mobile Tests Failing
- Check viewport size
- Test touch interactions
- Verify responsive CSS

### Debug Commands
```bash
# Run specific test in debug mode
npx playwright test --debug homepage.spec.ts

# Run with verbose output
npx playwright test --reporter=line

# Run with trace
npx playwright test --trace=on
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Test Selectors Guide](https://playwright.dev/docs/selectors)

## 🤝 Contributing

When adding new tests:
1. Follow the existing test structure
2. Use the TestHelpers class for common operations
3. Add appropriate test data to `test-helpers.ts`
4. Update this documentation if needed
5. Ensure tests pass in CI

---

**Happy Testing! 🚀**
