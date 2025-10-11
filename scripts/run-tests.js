#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Test categories
const TEST_CATEGORIES = {
  'auth': 'Authentication & Account Tests',
  'services': 'Services Catalog Tests',
  'quote': 'Quote Flow Tests',
  'orders': 'Order & Payment Tests',
  'files': 'File Upload Tests',
  'admin': 'Admin CMS Tests',
  'performance': 'Performance Tests',
  'accessibility': 'Accessibility Tests',
  'uat': 'UAT End-to-End Tests'
}

// Test priorities
const TEST_PRIORITIES = {
  'P0': 'Critical (Blockers)',
  'P1': 'High Priority',
  'P2': 'Normal Priority',
  'P3': 'Low Priority'
}

function runCommand(command, description) {
  console.log(`\n🚀 ${description}...`)
  console.log(`Command: ${command}\n`)
  
  try {
    execSync(command, { stdio: 'inherit' })
    console.log(`✅ ${description} completed successfully\n`)
    return true
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message)
    return false
  }
}

function createTestReport() {
  const reportDir = 'test-results'
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }
  
  const reportPath = path.join(reportDir, 'test-summary.md')
  const report = `# Test Execution Summary

## Test Categories
${Object.entries(TEST_CATEGORIES).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

## Test Priorities
${Object.entries(TEST_PRIORITIES).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

## Execution Details
- **Date**: ${new Date().toISOString()}
- **Environment**: ${process.env.NODE_ENV || 'development'}
- **Browser**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

## Test Results
See individual test reports in the \`test-results/\` directory.

## Coverage
- **Authentication**: Email verification, SMS OTP, login/logout
- **Services**: Catalog browsing, filtering, search, detail pages
- **Quote Flow**: 5-step process, file uploads, validation
- **Orders**: Payment processing, order management, confirmations
- **File Uploads**: S3 integration, validation, security
- **Admin CMS**: Product management, order tracking, promotions
- **Performance**: Lighthouse scores, load times, optimization
- **Accessibility**: WCAG compliance, keyboard navigation
- **UAT**: End-to-end user journeys

## Next Steps
1. Review failed tests and fix issues
2. Update test data if needed
3. Run specific test categories as needed
4. Monitor performance metrics
5. Validate accessibility compliance
`
  
  fs.writeFileSync(reportPath, report)
  console.log(`📊 Test report created: ${reportPath}`)
}

function main() {
  console.log('🧪 SDPC Web Application - Comprehensive Test Suite')
  console.log('=' .repeat(60))
  
  const args = process.argv.slice(2)
  const category = args[0]
  const priority = args[1]
  
  if (category && !TEST_CATEGORIES[category]) {
    console.error(`❌ Invalid test category: ${category}`)
    console.log(`Available categories: ${Object.keys(TEST_CATEGORIES).join(', ')}`)
    process.exit(1)
  }
  
  if (priority && !TEST_PRIORITIES[priority]) {
    console.error(`❌ Invalid test priority: ${priority}`)
    console.log(`Available priorities: ${Object.keys(TEST_PRIORITIES).join(', ')}`)
    process.exit(1)
  }
  
  // Build test command
  let testCommand = 'npx playwright test'
  
  if (category) {
    testCommand += ` --project=${category}`
    console.log(`🎯 Running ${TEST_CATEGORIES[category]} tests`)
  }
  
  if (priority) {
    testCommand += ` --grep="${priority}"`
    console.log(`⚡ Filtering by priority: ${TEST_PRIORITIES[priority]}`)
  }
  
  // Add additional options
  if (args.includes('--headed')) {
    testCommand += ' --headed'
  }
  
  if (args.includes('--debug')) {
    testCommand += ' --debug'
  }
  
  if (args.includes('--ui')) {
    testCommand += ' --ui'
  }
  
  // Run tests
  const success = runCommand(testCommand, 'Running Playwright Tests')
  
  // Create test report
  createTestReport()
  
  // Show results
  if (success) {
    console.log('🎉 All tests completed successfully!')
    console.log('📊 Check test-results/ directory for detailed reports')
  } else {
    console.log('❌ Some tests failed. Check the output above for details.')
    process.exit(1)
  }
}

// Show help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🧪 SDPC Web Application - Test Runner

Usage: node scripts/run-tests.js [category] [priority] [options]

Categories:
${Object.entries(TEST_CATEGORIES).map(([key, value]) => `  ${key.padEnd(12)} - ${value}`).join('\n')}

Priorities:
${Object.entries(TEST_PRIORITIES).map(([key, value]) => `  ${key.padEnd(12)} - ${value}`).join('\n')}

Options:
  --headed      Run tests in headed mode (visible browser)
  --debug       Run tests in debug mode
  --ui          Run tests with UI mode
  --help, -h    Show this help message

Examples:
  node scripts/run-tests.js                    # Run all tests
  node scripts/run-tests.js auth               # Run authentication tests
  node scripts/run-tests.js uat P0             # Run P0 UAT tests
  node scripts/run-tests.js performance --ui   # Run performance tests with UI
  node scripts/run-tests.js --headed           # Run all tests in headed mode
`)
  process.exit(0)
}

main()
