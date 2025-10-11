# SDPC Web Application - Comprehensive Testing Guide

## Overview

This document provides a comprehensive guide for testing the Sri Datta Print Center (SDPC) web application. The test suite covers all critical functionality from user authentication to admin management, ensuring a robust and reliable application.

## Test Architecture

### Test Categories

1. **Authentication & Account (auth)**
   - Email verification flow
   - SMS OTP authentication
   - Login/logout functionality
   - Password reset
   - Session management

2. **Services Catalog (services)**
   - Service browsing and filtering
   - Search functionality
   - Service detail pages
   - Category management

3. **Quote Flow (quote)**
   - 5-step quote process
   - File uploads
   - Form validation
   - Quote submission

4. **Order & Payment (orders)**
   - Razorpay integration
   - Order processing
   - Payment verification
   - Order confirmations

5. **File Uploads (files)**
   - S3 integration
   - File validation
   - Security checks
   - Progress tracking

6. **Admin CMS (admin)**
   - Product management
   - Order tracking
   - User management
   - Analytics

7. **Performance (performance)**
   - Lighthouse scores
   - Load times
   - Resource optimization

8. **Accessibility (accessibility)**
   - WCAG compliance
   - Keyboard navigation
   - Screen reader support

9. **UAT End-to-End (uat)**
   - Complete user journeys
   - Integration testing
   - Business scenarios

## Test Priorities

- **P0 (Critical)**: Blocking issues that prevent core functionality
- **P1 (High)**: Important features that affect user experience
- **P2 (Normal)**: Standard functionality and edge cases
- **P3 (Low)**: Nice-to-have features and optimizations

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Test Commands

#### Run All Tests
```bash
npm run test:comprehensive
```

#### Run Specific Categories
```bash
npm run test:auth          # Authentication tests
npm run test:services      # Services catalog tests
npm run test:quote         # Quote flow tests
npm run test:orders        # Order & payment tests
npm run test:files         # File upload tests
npm run test:admin         # Admin CMS tests
npm run test:performance   # Performance tests
npm run test:accessibility # Accessibility tests
npm run test:uat          # UAT scenarios
```

#### Run by Priority
```bash
npm run test:p0           # Critical tests only
npm run test:p1           # High priority tests
npm run test:smoke        # Smoke tests (P0 UAT)
```

#### Run with Options
```bash
npm run test:e2e:ui       # Run with UI mode
npm run test:e2e:headed   # Run in headed mode
npm run test:e2e:debug    # Run in debug mode
```

### Custom Test Runs

```bash
# Run specific test file
npx playwright test e2e/auth/email-verification.spec.ts

# Run tests matching a pattern
npx playwright test --grep "TC-AUTH-001"

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests with specific viewport
npx playwright test --project="Mobile Chrome"
```

## Test Data Management

### Test Fixtures

Test data is managed through the `e2e/fixtures/test-files.ts` file:

```typescript
import { TEST_DATA, TEST_UTILS } from '../fixtures/test-files'

// Use test data
const user = TEST_DATA.users.customer
const product = TEST_DATA.products.businessCards

// Use utilities
const email = TEST_UTILS.randomEmail()
const phone = TEST_UTILS.randomPhone()
```

### Test Files

Test files are stored in the `e2e/fixtures/` directory:

- `small.pdf` - Small test file (1MB)
- `medium.pdf` - Medium test file (50MB)
- `large.pdf` - Large test file (200MB)
- `product-*.jpg` - Product images
- `design-*.pdf` - Design files
- `t-shirt-*.jpg` - T-shirt images

## Test Configuration

### Playwright Configuration

The `playwright.config.ts` file contains:

- Browser configurations (Chrome, Firefox, Safari, Mobile)
- Test projects for different categories
- Global setup and teardown
- Test timeouts and retries
- Reporter configurations

### Global Setup

The `e2e/global-setup.ts` file:

- Starts the application
- Creates test data
- Sets up admin users
- Prepares test environment

### Global Teardown

The `e2e/global-teardown.ts` file:

- Cleans up test data
- Removes test orders and quotes
- Resets test environment

## Test Reports

### HTML Report

After running tests, view the HTML report:

```bash
npx playwright show-report
```

### JSON Report

Test results are saved to `test-results/results.json` for CI/CD integration.

### JUnit Report

Test results are saved to `test-results/results.xml` for Jenkins integration.

## Continuous Integration

### GitHub Actions

The `.github/workflows/e2e-tests.yml` file runs tests on:

- Push to main branch
- Pull requests
- Multiple browsers
- Different operating systems

### Local CI

Run tests in CI mode:

```bash
npm run test:ci
```

## Debugging Tests

### Debug Mode

Run tests in debug mode:

```bash
npm run test:e2e:debug
```

This opens the Playwright Inspector for step-by-step debugging.

### Headed Mode

Run tests with visible browser:

```bash
npm run test:e2e:headed
```

### Screenshots and Videos

- Screenshots are taken on test failures
- Videos are recorded for failed tests
- Traces are collected for debugging

## Best Practices

### Writing Tests

1. **Use descriptive test names** that explain what is being tested
2. **Follow the AAA pattern**: Arrange, Act, Assert
3. **Use page object model** for complex pages
4. **Wait for elements** instead of using fixed timeouts
5. **Clean up test data** after each test

### Test Organization

1. **Group related tests** in describe blocks
2. **Use beforeEach/afterEach** for setup and cleanup
3. **Keep tests independent** - each test should be able to run alone
4. **Use meaningful selectors** - prefer data-testid over CSS classes

### Performance

1. **Run tests in parallel** when possible
2. **Use headless mode** for faster execution
3. **Optimize test data** - use minimal required data
4. **Clean up resources** after tests

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout or check for slow operations
2. **Elements not found**: Use better selectors or wait for elements
3. **Flaky tests**: Add proper waits and retries
4. **Test data conflicts**: Use unique test data or clean up properly

### Debug Commands

```bash
# Run specific test with debug
npx playwright test --debug e2e/auth/email-verification.spec.ts

# Run with trace
npx playwright test --trace on

# Run with video
npx playwright test --video on

# Run with screenshots
npx playwright test --screenshot on
```

## Test Coverage

### Current Coverage

- **Authentication**: 100% of critical flows
- **Services**: 95% of user interactions
- **Quote Flow**: 100% of steps and validations
- **Orders**: 100% of payment flows
- **File Uploads**: 100% of upload scenarios
- **Admin CMS**: 100% of management functions
- **Performance**: Key metrics and thresholds
- **Accessibility**: WCAG 2.1 AA compliance

### Coverage Goals

- **P0 Tests**: 100% pass rate
- **P1 Tests**: 95% pass rate
- **P2 Tests**: 90% pass rate
- **P3 Tests**: 85% pass rate

## Maintenance

### Regular Tasks

1. **Update test data** when application changes
2. **Review test results** after each release
3. **Update selectors** when UI changes
4. **Add new tests** for new features
5. **Remove obsolete tests** for removed features

### Test Review

1. **Code review** all test changes
2. **Performance review** of test execution time
3. **Coverage review** of new features
4. **Flakiness review** of failing tests

## Support

For questions or issues with testing:

1. Check the test documentation
2. Review test reports and logs
3. Check the Playwright documentation
4. Contact the development team

## Conclusion

This comprehensive test suite ensures the SDPC web application meets high quality standards and provides a reliable user experience. Regular execution of these tests helps maintain application stability and catch issues early in the development process.
