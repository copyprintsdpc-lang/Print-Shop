/**
 * Test Data Fixtures
 * Centralized test data for E2E tests
 */

export const testUsers = {
  customer: {
    email: 'test@example.com',
    password: 'Test123456!',
    phone: '+919876543210',
    name: 'Test User',
  },
  admin: {
    email: 'admin@example.com',
    password: 'Admin123456!',
  },
}

export const testProducts = {
  document: {
    name: 'Document Printing',
    category: 'documents',
  },
  businessCard: {
    name: 'Business Cards',
    category: 'business-cards',
  },
}

export const testOrders = {
  sampleOrderNumber: 'CP241201234',
}

export const waitConfig = {
  short: 1000,
  medium: 3000,
  long: 5000,
  network: 10000,
}

