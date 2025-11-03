#!/usr/bin/env node

/**
 * GoDaddy SMTP Testing Script
 * 
 * Tests multiple GoDaddy SMTP configurations to find the working one
 * 
 * Usage:
 *   node scripts/test-godaddy-smtp.js
 */

require('dotenv').config({ path: '.env.local' })
const nodemailer = require('nodemailer')

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

// GoDaddy SMTP configurations to test
const configurations = [
  {
    name: 'GoDaddy Titan Email - Port 465 (SSL)',
    host: 'smtp.titan.email',
    port: 465,
    secure: true,
  },
  {
    name: 'GoDaddy Titan Email - Port 587 (TLS)',
    host: 'smtp.titan.email',
    port: 587,
    secure: false,
  },
  {
    name: 'GoDaddy Standard SMTP - Port 465 (SSL)',
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true,
  },
  {
    name: 'GoDaddy Standard SMTP - Port 587 (TLS)',
    host: 'smtpout.secureserver.net',
    port: 587,
    secure: false,
  },
  {
    name: 'Domain-based SMTP - Port 465 (SSL)',
    host: 'smtp.sridattaprintcentre.com',
    port: 465,
    secure: true,
  },
  {
    name: 'Domain-based SMTP - Port 587 (TLS)',
    host: 'smtp.sridattaprintcentre.com',
    port: 587,
    secure: false,
  },
]

async function testConfiguration(config, user, pass) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    })

    await transporter.verify()
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function testAllConfigurations() {
  console.log(`\n${colors.cyan}🔧 GoDaddy SMTP Configuration Tester${colors.reset}\n`)
  console.log('=' .repeat(80))
  
  // Get credentials
  const user = process.env.SMTP_USER || 'no-reply@sridattaprintcentre.com'
  const pass = process.env.SMTP_PASS || 'Sdpc@54312'
  
  console.log(`\n${colors.blue}📋 Testing with credentials:${colors.reset}`)
  console.log(`   User: ${user}`)
  console.log(`   Pass: ${pass.substring(0, 4)}${'*'.repeat(pass.length - 4)}`)
  console.log('=' .repeat(80))
  
  console.log(`\n${colors.yellow}⏳ Testing ${configurations.length} configurations...${colors.reset}\n`)
  
  let workingConfig = null
  
  for (let i = 0; i < configurations.length; i++) {
    const config = configurations[i]
    process.stdout.write(`${colors.cyan}[${i + 1}/${configurations.length}]${colors.reset} ${config.name}... `)
    
    const result = await testConfiguration(config, user, pass)
    
    if (result.success) {
      console.log(`${colors.green}✅ WORKS!${colors.reset}`)
      workingConfig = config
      break // Found working config, stop testing
    } else {
      console.log(`${colors.red}❌ Failed${colors.reset}`)
      console.log(`     ${colors.gray}Error: ${result.error}${colors.reset}`)
    }
  }
  
  console.log('\n' + '=' .repeat(80))
  
  if (workingConfig) {
    console.log(`\n${colors.green}🎉 SUCCESS! Found working configuration:${colors.reset}\n`)
    console.log(`   Name:     ${workingConfig.name}`)
    console.log(`   Host:     ${workingConfig.host}`)
    console.log(`   Port:     ${workingConfig.port}`)
    console.log(`   Secure:   ${workingConfig.secure}`)
    
    console.log(`\n${colors.cyan}📝 Update your .env.local with:${colors.reset}\n`)
    console.log(`${colors.yellow}SMTP_HOST=${workingConfig.host}${colors.reset}`)
    console.log(`${colors.yellow}SMTP_PORT=${workingConfig.port}${colors.reset}`)
    console.log(`${colors.yellow}SMTP_SECURE=${workingConfig.secure}${colors.reset}`)
    console.log(`${colors.yellow}SMTP_USER=${user}${colors.reset}`)
    console.log(`${colors.yellow}SMTP_PASS=${pass}${colors.reset}`)
    console.log(`${colors.yellow}EMAIL_FROM=${user}${colors.reset}`)
    console.log(`${colors.yellow}EMAIL_FROM_NAME=Sri Datta Print Center${colors.reset}`)
    
    console.log(`\n${'='.repeat(80)}\n`)
  } else {
    console.log(`\n${colors.red}❌ No working configuration found!${colors.reset}\n`)
    console.log(`${colors.yellow}💡 Possible issues:${colors.reset}`)
    console.log(`   1. Wrong password - verify you can login at: https://secureserver.titan.email/mail/`)
    console.log(`   2. SMTP not enabled - check GoDaddy email settings`)
    console.log(`   3. Account locked - too many failed login attempts`)
    console.log(`   4. 2FA enabled - may need app-specific password`)
    console.log(`   5. Firewall blocking - check Windows Firewall settings`)
    
    console.log(`\n${colors.cyan}🔧 Next steps:${colors.reset}`)
    console.log(`   1. Login to GoDaddy: https://account.godaddy.com`)
    console.log(`   2. Go to Email & Office Dashboard`)
    console.log(`   3. Check email account settings`)
    console.log(`   4. Look for "Enable SMTP" or "App Passwords"`)
    console.log(`   5. Contact GoDaddy support if needed`)
    
    console.log(`\n${'='.repeat(80)}\n`)
  }
}

// Run the tests
testAllConfigurations()

