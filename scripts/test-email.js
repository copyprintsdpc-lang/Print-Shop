#!/usr/bin/env node

/**
 * Email Configuration Test Script
 * 
 * This script tests your SMTP configuration by:
 * 1. Verifying the SMTP connection
 * 2. Sending a test email
 * 
 * Usage:
 *   node scripts/test-email.js your-email@example.com
 */

const readline = require('readline')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function testEmailConfiguration() {
  console.log('\n🚀 Email Configuration Test\n')
  console.log('=' .repeat(50))
  
  // Check environment variables
  const smtpHost = process.env.SMTP_HOST || process.env.BREVO_SMTP_HOST
  const smtpPort = process.env.SMTP_PORT || process.env.BREVO_SMTP_PORT
  const smtpUser = process.env.SMTP_USER || process.env.BREVO_SMTP_USER
  const smtpPass = process.env.SMTP_PASS || process.env.BREVO_SMTP_PASS
  const emailFrom = process.env.EMAIL_FROM
  const emailFromName = process.env.EMAIL_FROM_NAME
  
  console.log('\n📧 Current Configuration:')
  console.log(`   Host: ${smtpHost || '❌ NOT SET'}`)
  console.log(`   Port: ${smtpPort || '❌ NOT SET'}`)
  console.log(`   User: ${smtpUser || '❌ NOT SET'}`)
  console.log(`   Pass: ${smtpPass ? '✅ SET' : '❌ NOT SET'}`)
  console.log(`   From: "${emailFromName}" <${emailFrom}>`)
  console.log('=' .repeat(50))
  
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.error('\n❌ Error: Missing SMTP configuration!')
    console.log('\nPlease configure your SMTP settings in .env.local:')
    console.log('   SMTP_HOST=smtpout.secureserver.net')
    console.log('   SMTP_PORT=465')
    console.log('   SMTP_SECURE=true')
    console.log('   SMTP_USER=your-email@yourdomain.com')
    console.log('   SMTP_PASS=your-password')
    console.log('   EMAIL_FROM=your-email@yourdomain.com')
    console.log('   EMAIL_FROM_NAME=Your Business Name')
    console.log('\nSee GODADDY_EMAIL_SETUP.md for detailed instructions.')
    process.exit(1)
  }
  
  // Get test email address
  const testEmail = process.argv[2]
  
  if (!testEmail || !testEmail.includes('@')) {
    console.error('\n❌ Error: Please provide a valid test email address')
    console.log('\nUsage:')
    console.log('   node scripts/test-email.js your-email@example.com')
    process.exit(1)
  }
  
  console.log(`\n📬 Test email will be sent to: ${testEmail}`)
  
  // Start the Next.js app in background for API testing
  console.log('\n⏳ Testing SMTP connection...')
  
  try {
    // Test 1: Verify SMTP Connection
    const verifyResponse = await fetch('http://localhost:3000/api/debug/smtp/verify')
    const verifyData = await verifyResponse.json()
    
    if (verifyData.ok) {
      console.log('✅ SMTP Connection: SUCCESS')
      console.log(`   Message: ${verifyData.message}`)
    } else {
      console.log('❌ SMTP Connection: FAILED')
      console.log(`   Error: ${verifyData.error}`)
      process.exit(1)
    }
    
    // Test 2: Send Test Email
    console.log('\n⏳ Sending test email...')
    const sendResponse = await fetch(`http://localhost:3000/api/debug/smtp/send?to=${encodeURIComponent(testEmail)}`)
    const sendData = await sendResponse.json()
    
    if (sendData.ok) {
      console.log('✅ Test Email: SENT')
      console.log(`   To: ${sendData.to}`)
      console.log(`   From: ${sendData.from}`)
      console.log(`   Time: ${sendData.timestamp}`)
      console.log('\n✅ Email configuration is working correctly!')
      console.log('   Check your inbox (and spam folder) for the test email.')
    } else {
      console.log('❌ Test Email: FAILED')
      console.log(`   Error: ${sendData.error}`)
      process.exit(1)
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('✅ All tests passed!')
    console.log('=' .repeat(50) + '\n')
    
  } catch (error) {
    console.error('\n❌ Error running tests:', error.message)
    console.log('\nMake sure your Next.js app is running:')
    console.log('   npm run dev')
    console.log('\nThen run this script again.')
    process.exit(1)
  }
  
  rl.close()
}

// Run the test
testEmailConfiguration()

