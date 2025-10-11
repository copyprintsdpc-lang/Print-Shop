# Test Suite Documentation

This directory contains comprehensive tests for the Print Shop application.

## Test Structure

```
src/__tests__/
├── api/                    # API route tests
│   ├── auth.test.ts       # Authentication endpoints
│   ├── products.test.ts   # Product endpoints
│   └── orders.test.ts     # Order and payment endpoints
├── components/            # Component tests
│   ├── Navigation.test.tsx
│   ├── Cart.test.tsx
│   └── PricingCalculator.test.tsx
├── models/                # Database model tests
│   ├── User.test.ts
│   └── Product.test.ts
├── integration/           # Integration tests
│   ├── checkout-flow.test.tsx
│   └── order-tracking.test.tsx
├── utils/                 # Test utilities
│   └── test-utils.tsx
├── setup.ts              # Test setup configuration
└── README.md             # This file
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### CI Mode
```bash
npm run test:ci
```

## Test Categories

### 1. API Tests (`/api/`)
Tests for all API endpoints including:
- Authentication (login, signup, me)
- Products (CRUD operations, search, filtering)
- Orders (creation, tracking, management)
- Payments (Razorpay integration)

### 2. Component Tests (`/components/`)
Tests for React components including:
- Navigation component with mobile menu and cart
- Shopping cart with add/remove/update functionality
- Pricing calculator with dynamic pricing
- File upload component
- Auth guard component

### 3. Model Tests (`/models/`)
Tests for database models including:
- User model validation and schema
- Product model with variants and options
- Order model with complex pricing
- Admin and promotion models

### 4. Integration Tests (`/integration/`)
End-to-end workflow tests including:
- Complete checkout flow from cart to payment
- Order tracking and status updates
- User authentication flows
- File upload and processing

## Test Utilities

### `test-utils.tsx`
Provides:
- Custom render function with providers
- Mock data factories for users, products, orders
- API response mocking utilities
- Common test helpers

### Mock Data Factories
- `createMockUser()` - Creates test user data
- `createMockProduct()` - Creates test product data
- `createMockOrder()` - Creates test order data

### API Mocking
- `mockFetch()` - Mocks fetch responses
- `mockApiResponse()` - Creates API response objects
- `resetMocks()` - Cleans up mocks between tests

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Uses Next.js Jest configuration
- Sets up jsdom environment
- Configures module path mapping
- Sets coverage thresholds

### Setup Files
- `jest.setup.js` - Global test setup
- `src/__tests__/setup.ts` - Additional test configuration

## Coverage Requirements

The test suite maintains the following coverage thresholds:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking
- Mock external dependencies
- Use factory functions for test data
- Reset mocks between tests

### 3. Async Testing
- Use `waitFor` for async operations
- Test loading states
- Handle error scenarios

### 4. Component Testing
- Test user interactions
- Verify prop handling
- Test conditional rendering

### 5. API Testing
- Test success and error cases
- Verify request/response formats
- Test authentication requirements

## Debugging Tests

### Running Specific Tests
```bash
# Run specific test file
npm test Navigation.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Run tests in specific directory
npm test -- src/__tests__/api/
```

### Debug Mode
```bash
# Run tests in debug mode
npm test -- --detectOpenHandles --forceExit
```

### Coverage Debugging
```bash
# Generate detailed coverage report
npm run test:coverage

# Open coverage report in browser
open coverage/lcov-report/index.html
```

## Common Issues

### 1. Mock Issues
- Ensure mocks are reset between tests
- Check mock implementation matches actual usage
- Verify mock return values

### 2. Async Issues
- Use `waitFor` for async operations
- Check for proper cleanup
- Handle promise rejections

### 3. Component Issues
- Ensure proper provider wrapping
- Check for missing props
- Verify event handlers

### 4. API Issues
- Mock fetch responses correctly
- Check request format
- Verify error handling

## Contributing

When adding new tests:
1. Follow existing patterns
2. Add appropriate mocks
3. Test both success and error cases
4. Update this documentation if needed
5. Ensure tests pass in CI
