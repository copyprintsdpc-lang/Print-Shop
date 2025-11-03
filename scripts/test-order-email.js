#!/usr/bin/env node

/**
 * Test Order Emails Script
 * 
 * Tests order confirmation and status emails using GoDaddy SMTP
 * 
 * Usage:
 *   node scripts/test-order-email.js your-email@example.com
 */

require('dotenv').config({ path: '.env.local' })
const nodemailer = require('nodemailer')

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
}

// Email template wrapper
function emailTemplate(title, content) {
  return `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb">
      <div style="background:#111827;padding:30px;text-align:center;border-radius:12px 12px 0 0">
        <h2 style="color:#fff;margin:0">${title}</h2>
      </div>
      <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
        ${content}
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0">
        <p style="color:#9ca3af;font-size:12px;margin:0">This is an automated email. Please do not reply to this message.</p>
        <p style="color:#9ca3af;font-size:12px;margin:5px 0 0 0">© ${new Date().getFullYear()} Sri Datta Print Center. All rights reserved.</p>
      </div>
    </div>`
}

async function sendTestOrderEmail(testEmail) {
  try {
    console.log(`\n${colors.cyan}📧 Testing Order Emails${colors.reset}\n`)
    console.log('=' .repeat(70))

    // Setup SMTP
    const smtpHost = process.env.SMTP_HOST || process.env.BREVO_SMTP_HOST
    const smtpPort = process.env.SMTP_PORT || process.env.BREVO_SMTP_PORT
    const smtpUser = process.env.SMTP_USER || process.env.BREVO_SMTP_USER
    const smtpPass = process.env.SMTP_PASS || process.env.BREVO_SMTP_PASS
    const emailFrom = process.env.EMAIL_FROM || 'no-reply@sridattaprintcentre.com'
    const emailFromName = process.env.EMAIL_FROM_NAME || 'Sri Datta Print Center'

    console.log(`\n${colors.blue}SMTP Configuration:${colors.reset}`)
    console.log(`   Host: ${smtpHost}`)
    console.log(`   Port: ${smtpPort}`)
    console.log(`   From: "${emailFromName}" <${emailFrom}>`)
    console.log(`   To:   ${testEmail}`)
    console.log('=' .repeat(70))

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: process.env.SMTP_SECURE === 'true' || smtpPort === '465',
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false }
    })

    // Test connection
    console.log(`\n${colors.yellow}⏳ Verifying SMTP...${colors.reset}`)
    await transporter.verify()
    console.log(`${colors.green}✅ SMTP verified${colors.reset}`)

    // Mock order data
    const orderNumber = 'J-' + Math.floor(Math.random() * 10000)
    
    // Test 1: Order Confirmation Email
    console.log(`\n${colors.yellow}⏳ Sending Order Confirmation Email...${colors.reset}`)
    
    const itemsList = [
      { name: 'Business Cards', quantity: 500, specs: 'Premium Matte • 90x50mm', price: '₹800' },
      { name: 'Flyers A4', quantity: 100, specs: 'Color • Glossy • Double-sided', price: '₹450' }
    ].map(item => 
      `<tr>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb">
          <div style="font-weight:600;color:#111827">${item.name}</div>
          <div style="font-size:12px;color:#6b7280;margin-top:4px">${item.specs}</div>
        </td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:center;color:#6b7280">${item.quantity}</td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;color:#111827">${item.price}</td>
      </tr>`
    ).join('')

    const confirmationContent = `
      <div style="text-align:center;margin-bottom:20px">
        <div style="display:inline-block;background:#10b981;color:#fff;padding:8px 16px;border-radius:20px;font-size:14px;font-weight:600">
          ✓ Payment Confirmed
        </div>
      </div>
      <h3 style="color:#111827;margin-top:0">Thank you for your order, Vamsi!</h3>
      <p style="color:#4b5563;line-height:1.6">Your payment has been received and your order is now being prepared for printing.</p>
      
      <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0;text-align:center">
        <p style="color:#6b7280;font-size:14px;margin:0 0 8px 0">Order Number</p>
        <p style="color:#111827;font-size:24px;font-weight:700;margin:0">#${orderNumber}</p>
        <p style="color:#6b7280;font-size:13px;margin:10px 0 0 0">⏱️ Estimated completion: 2-3 hours</p>
      </div>

      <div style="background:#dbeafe;border-left:4px solid #3b82f6;padding:15px;border-radius:8px;margin:20px 0">
        <div style="font-weight:600;color:#1e3a8a;margin-bottom:5px">🏪 Store Pickup</div>
        <div style="color:#1e40af;font-size:14px">Sri Datta Print Center, Bangalore</div>
        <div style="color:#1e40af;font-size:12px;margin-top:5px">📞 Hotline: 00 1900 8188</div>
      </div>

      <h4 style="color:#111827;margin:25px 0 15px 0">Order Details</h4>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <thead>
          <tr style="background:#f9fafb">
            <th style="padding:12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600">ITEM</th>
            <th style="padding:12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600">QTY</th>
            <th style="padding:12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600">PRICE</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
      </table>

      <div style="margin-top:20px;padding:20px;background:#f9fafb;border-radius:8px">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px">
          <span style="color:#6b7280">Subtotal:</span>
          <span style="color:#111827;font-weight:600">₹1,250</span>
        </div>
        <div style="border-top:2px solid #e5e7eb;margin:10px 0;padding-top:10px;display:flex;justify-content:space-between">
          <span style="color:#111827;font-size:18px;font-weight:700">Total Paid:</span>
          <span style="color:#10b981;font-size:24px;font-weight:700">₹1,250</span>
        </div>
        <div style="margin-top:10px;font-size:12px;color:#6b7280">
          💳 Paid via Razorpay
        </div>
      </div>

      <div style="text-align:center;margin:30px 0">
        <a href="http://localhost:3000/order-track/${orderNumber}" style="background:#2563eb;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;font-size:16px">
          📦 Track Your Order
        </a>
      </div>

      <div style="background:#f0f9ff;border:1px solid #bfdbfe;padding:15px;border-radius:8px;margin-top:20px">
        <p style="color:#1e40af;font-size:14px;margin:0;line-height:1.6">
          <strong>What's Next?</strong><br>
          1. We'll start printing your order immediately<br>
          2. You'll receive an email when it's ready<br>
          3. You can collect it from our store
        </p>
      </div>

      <p style="color:#6b7280;font-size:14px;margin-top:20px">
        Need help? Call us at <strong style="color:#111827">00 1900 8188</strong> or reply to this email.
      </p>`

    await transporter.sendMail({
      from: `"${emailFromName}" <${emailFrom}>`,
      to: testEmail,
      subject: `Order Confirmed #${orderNumber} - Payment Received`,
      html: emailTemplate('Sri Datta Print Center', confirmationContent),
    })

    console.log(`${colors.green}✅ Order Confirmation Email sent!${colors.reset}`)

    // Test 2: Order Ready Email
    console.log(`\n${colors.yellow}⏳ Sending Order Ready Email...${colors.reset}`)
    
    const readyContent = `
      <div style="text-align:center;margin-bottom:25px">
        <div style="display:inline-block;background:#d1fae5;color:#10b981;padding:12px 24px;border-radius:12px;font-size:18px;font-weight:700">
          ✅ Your Order is Ready for Pickup!
        </div>
      </div>

      <p style="color:#4b5563;font-size:16px;line-height:1.6">Hi Vamsi,</p>
      <p style="color:#4b5563;font-size:16px;line-height:1.6">Your order is ready! You can collect it from our store during business hours (Mon-Sat: 9AM-7PM).</p>

      <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:25px 0;text-align:center">
        <p style="color:#6b7280;font-size:14px;margin:0 0 8px 0">Order Number</p>
        <p style="color:#111827;font-size:22px;font-weight:700;margin:0">#${orderNumber}</p>
      </div>

      <div style="background:#f0f9ff;border:1px solid #bfdbfe;padding:20px;border-radius:8px;margin:25px 0">
        <h4 style="color:#1e40af;margin:0 0 10px 0">📍 Pickup Location</h4>
        <p style="color:#1e3a8a;margin:0;line-height:1.6">
          <strong>Sri Datta Print Center</strong><br>
          Bangalore, Karnataka<br>
          📞 Hotline: 00 1900 8188
        </p>
        <p style="color:#1e40af;font-size:13px;margin:10px 0 0 0">
          ⏰ Mon-Sat: 9AM-7PM
        </p>
      </div>

      <p style="color:#6b7280;font-size:14px;margin-top:25px">
        Questions? Contact us at <strong style="color:#111827">00 1900 8188</strong>
      </p>`

    await transporter.sendMail({
      from: `"${emailFromName}" <${emailFrom}>`,
      to: testEmail,
      subject: `✅ Order #${orderNumber} - Your Order is Ready for Pickup!`,
      html: emailTemplate('Sri Datta Print Center', readyContent),
    })

    console.log(`${colors.green}✅ Order Ready Email sent!${colors.reset}`)

    // Summary
    console.log(`\n${'='.repeat(70)}`)
    console.log(`${colors.green}✅ All test emails sent successfully!${colors.reset}`)
    console.log('=' .repeat(70))
    console.log(`\n${colors.cyan}📬 Check your inbox:${colors.reset} ${testEmail}`)
    console.log(`   1. Order Confirmation (#${orderNumber})`)
    console.log(`   2. Order Ready Notification (#${orderNumber})`)
    console.log(`\n${colors.yellow}💡 Check spam folder if not in inbox!${colors.reset}\n`)

  } catch (error) {
    console.error(`\n${colors.red}❌ Error:${colors.reset}`, error.message)
    process.exit(1)
  }
}

// Run
const testEmail = process.argv[2]
if (!testEmail || !testEmail.includes('@')) {
  console.log(`\n${colors.yellow}Usage:${colors.reset}`)
  console.log(`   node scripts/test-order-email.js your-email@example.com\n`)
  process.exit(1)
}

sendTestOrderEmail(testEmail)

