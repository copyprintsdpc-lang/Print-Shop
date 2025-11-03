#!/usr/bin/env node

/**
 * Test Verification Email Script
 * 
 * Sends a test verification email to check if email system is working
 * 
 * Usage:
 *   node scripts/test-verification-email.js your-email@example.com
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

async function sendTestVerificationEmail() {
  try {
    console.log(`\n${colors.cyan}📧 Test Verification Email${colors.reset}\n`)
    console.log('=' .repeat(80))
    
    // Get email from command line
    const testEmail = process.argv[2]
    
    if (!testEmail || !testEmail.includes('@')) {
      console.error(`\n${colors.red}❌ Error: Please provide a valid email address${colors.reset}`)
      console.log(`\n${colors.yellow}Usage:${colors.reset}`)
      console.log(`   node scripts/test-verification-email.js your-email@example.com\n`)
      process.exit(1)
    }

    // Check SMTP configuration
    const smtpHost = process.env.SMTP_HOST || process.env.BREVO_SMTP_HOST
    const smtpPort = process.env.SMTP_PORT || process.env.BREVO_SMTP_PORT
    const smtpUser = process.env.SMTP_USER || process.env.BREVO_SMTP_USER
    const smtpPass = process.env.SMTP_PASS || process.env.BREVO_SMTP_PASS
    const emailFrom = process.env.EMAIL_FROM || 'noreply@example.com'
    const emailFromName = process.env.EMAIL_FROM_NAME || 'Sri Datta Print Center'
    
    console.log(`\n${colors.blue}📋 SMTP Configuration:${colors.reset}`)
    console.log(`   Host:     ${smtpHost}`)
    console.log(`   Port:     ${smtpPort}`)
    console.log(`   Secure:   ${process.env.SMTP_SECURE || 'false'}`)
    console.log(`   User:     ${smtpUser}`)
    console.log(`   From:     "${emailFromName}" <${emailFrom}>`)
    console.log(`   To:       ${testEmail}`)
    console.log('=' .repeat(80))
    
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error(`\n${colors.red}❌ Error: Missing SMTP configuration in .env.local${colors.reset}\n`)
      process.exit(1)
    }

    // Create transporter
    console.log(`\n${colors.yellow}⏳ Creating SMTP connection...${colors.reset}`)
    
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false // For testing
      }
    })

    // Verify connection
    console.log(`${colors.yellow}⏳ Verifying SMTP connection...${colors.reset}`)
    try {
      await transporter.verify()
      console.log(`${colors.green}✅ SMTP connection verified!${colors.reset}`)
    } catch (error) {
      console.error(`${colors.red}❌ SMTP verification failed:${colors.reset}`, error.message)
      console.log(`\n${colors.yellow}💡 Common fixes:${colors.reset}`)
      console.log(`   1. Check username and password are correct`)
      console.log(`   2. Try port 587 with SMTP_SECURE=false`)
      console.log(`   3. Try port 465 with SMTP_SECURE=true`)
      console.log(`   4. Verify you can login at: https://secureserver.titan.email/mail/\n`)
      process.exit(1)
    }

    // Create verification link
    const verificationLink = `http://localhost:3000/verify?token=TEST_TOKEN_${Date.now()}`
    
    // Email template
    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb">
        <div style="background:#111827;padding:30px;text-align:center;border-radius:12px 12px 0 0">
          <h2 style="color:#fff;margin:0">Sri Datta Print Center</h2>
        </div>
        <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <h3 style="color:#111827;margin-top:0">Welcome!</h3>
          <p style="color:#4b5563;line-height:1.6">Thanks for signing up. Please verify your email address to activate your account:</p>
          <div style="text-align:center;margin:30px 0">
            <a href="${verificationLink}" style="background:#111827;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">Verify My Email</a>
          </div>
          <p style="color:#6b7280;font-size:14px;line-height:1.6">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="color:#3b82f6;font-size:14px;word-break:break-all">${verificationLink}</p>
          <p style="color:#ef4444;font-size:13px;margin-top:20px">This link will expire in 24 hours.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0">
          <p style="color:#9ca3af;font-size:12px;margin:0">This is an automated email. Please do not reply to this message.</p>
          <p style="color:#9ca3af;font-size:12px;margin:5px 0 0 0">© ${new Date().getFullYear()} Sri Datta Print Center. All rights reserved.</p>
        </div>
      </div>
    `

    // Send email
    console.log(`\n${colors.yellow}⏳ Sending verification email...${colors.reset}`)
    
    const info = await transporter.sendMail({
      from: `"${emailFromName}" <${emailFrom}>`,
      to: testEmail,
      subject: 'Verify your account - Sri Datta Print Center',
      html: html,
    })

    console.log(`${colors.green}✅ Email sent successfully!${colors.reset}`)
    console.log(`\n${colors.cyan}📧 Email Details:${colors.reset}`)
    console.log(`   Message ID:    ${info.messageId}`)
    console.log(`   From:          "${emailFromName}" <${emailFrom}>`)
    console.log(`   To:            ${testEmail}`)
    console.log(`   Subject:       Verify your account - Sri Datta Print Center`)
    console.log(`   Response:      ${info.response}`)
    
    console.log(`\n${'='.repeat(80)}`)
    console.log(`${colors.green}✅ SUCCESS! Verification email sent.${colors.reset}`)
    console.log('=' .repeat(80))
    
    console.log(`\n${colors.cyan}📬 Next Steps:${colors.reset}`)
    console.log(`   1. Check your inbox: ${testEmail}`)
    console.log(`   2. Check spam/junk folder if not in inbox`)
    console.log(`   3. Wait 1-2 minutes for delivery`)
    console.log(`   4. Click the "Verify My Email" button in the email`)
    console.log(`\n${colors.yellow}💡 Note: This is a test email. The verification link won't actually work.${colors.reset}\n`)
    
  } catch (error) {
    console.error(`\n${colors.red}❌ Error:${colors.reset}`, error.message)
    console.log(`\n${colors.yellow}🔧 Troubleshooting:${colors.reset}`)
    console.log(`   1. Check your SMTP credentials in .env.local`)
    console.log(`   2. Make sure you can login at: https://secureserver.titan.email/mail/`)
    console.log(`   3. Try different port (587 or 465)`)
    console.log(`   4. Check firewall is not blocking SMTP ports`)
    console.log(`\n${colors.cyan}For detailed help, see: GODADDY_EMAIL_SETUP.md${colors.reset}\n`)
    process.exit(1)
  }
}

// Run the script
sendTestVerificationEmail()

