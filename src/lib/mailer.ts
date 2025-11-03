export const runtime = 'nodejs'

import nodemailer from 'nodemailer'

// Generic SMTP configuration - supports any email provider
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? process.env.BREVO_SMTP_HOST ?? 'smtp-relay.brevo.com',
  port: Number(process.env.SMTP_PORT ?? process.env.BREVO_SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER ?? process.env.BREVO_SMTP_USER!,
    pass: process.env.SMTP_PASS ?? process.env.BREVO_SMTP_PASS!,
  },
  // Additional options for better compatibility
  tls: {
    // Do not fail on invalid certs (useful for some providers)
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  }
})

// Email template wrapper
function emailTemplate(title: string, content: string): string {
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

// Send verification email for new user signup
export async function sendVerificationEmail(to: string, link: string) {
  const fromEmail = process.env.EMAIL_FROM ?? 'copyprintsdpc@gmail.com'
  const fromName = process.env.EMAIL_FROM_NAME ?? 'Sri Datta Print Center'
  
  const content = `
    <h3 style="color:#111827;margin-top:0">Welcome!</h3>
    <p style="color:#4b5563;line-height:1.6">Thanks for signing up. Please verify your email address to activate your account:</p>
    <div style="text-align:center;margin:30px 0">
      <a href="${link}" style="background:#111827;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">Verify My Email</a>
    </div>
    <p style="color:#6b7280;font-size:14px;line-height:1.6">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="color:#3b82f6;font-size:14px;word-break:break-all">${link}</p>
    <p style="color:#ef4444;font-size:13px;margin-top:20px">This link will expire in 24 hours.</p>`
  
  const html = emailTemplate('Sri Datta Print Center', content)
  
  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject: 'Verify your account - Sri Datta Print Center',
    html,
  })
}

// Send OTP via email (alternative to SMS)
export async function sendOTPEmail(to: string, otp: string) {
  const fromEmail = process.env.EMAIL_FROM ?? 'copyprintsdpc@gmail.com'
  const fromName = process.env.EMAIL_FROM_NAME ?? 'Sri Datta Print Center'
  
  const content = `
    <h3 style="color:#111827;margin-top:0">Your Login OTP</h3>
    <p style="color:#4b5563;line-height:1.6">Use this One-Time Password to complete your login:</p>
    <div style="text-align:center;margin:30px 0">
      <div style="background:#f3f4f6;padding:20px;border-radius:8px;display:inline-block">
        <span style="font-size:32px;font-weight:700;color:#111827;letter-spacing:8px">${otp}</span>
      </div>
    </div>
    <p style="color:#6b7280;font-size:14px;line-height:1.6">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
    <p style="color:#ef4444;font-size:13px;margin-top:20px">If you didn't request this OTP, please ignore this email.</p>`
  
  const html = emailTemplate('Sri Datta Print Center', content)
  
  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject: `Your OTP: ${otp} - Sri Datta Print Center`,
    html,
  })
}

// Send password reset email
export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const fromEmail = process.env.EMAIL_FROM ?? 'copyprintsdpc@gmail.com'
  const fromName = process.env.EMAIL_FROM_NAME ?? 'Sri Datta Print Center'
  
  const content = `
    <h3 style="color:#111827;margin-top:0">Reset Your Password</h3>
    <p style="color:#4b5563;line-height:1.6">We received a request to reset your password. Click the button below to create a new password:</p>
    <div style="text-align:center;margin:30px 0">
      <a href="${resetLink}" style="background:#111827;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">Reset Password</a>
    </div>
    <p style="color:#6b7280;font-size:14px;line-height:1.6">Or copy and paste this link into your browser:</p>
    <p style="color:#3b82f6;font-size:14px;word-break:break-all">${resetLink}</p>
    <p style="color:#ef4444;font-size:13px;margin-top:20px">This link will expire in 1 hour.</p>
    <p style="color:#6b7280;font-size:13px">If you didn't request a password reset, please ignore this email.</p>`
  
  const html = emailTemplate('Sri Datta Print Center', content)
  
  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject: 'Reset Your Password - Sri Datta Print Center',
    html,
  })
}

// Send order confirmation email (after payment)
export async function sendOrderConfirmationEmail(
  to: string,
  orderDetails: {
    orderNumber: string
    customerName: string
    items: Array<{
      name: string
      quantity: number
      specs: string
      price: string
    }>
    subtotal: string
    deliveryFee?: string
    total: string
    paymentMethod: string
    deliveryType: 'pickup' | 'delivery'
    deliveryAddress?: string
    estimatedCompletion?: string
  }
) {
  const fromEmail = process.env.EMAIL_FROM ?? 'no-reply@sridattaprintcentre.com'
  const fromName = process.env.EMAIL_FROM_NAME ?? 'Sri Datta Print Center'
  
  const itemsList = orderDetails.items.map(item => 
    `<tr>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb">
        <div style="font-weight:600;color:#111827">${item.name}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:4px">${item.specs}</div>
      </td>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:center;color:#6b7280">${item.quantity}</td>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;color:#111827">${item.price}</td>
    </tr>`
  ).join('')
  
  const deliverySection = orderDetails.deliveryType === 'delivery'
    ? `<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:15px;border-radius:8px;margin:20px 0">
         <div style="font-weight:600;color:#92400e;margin-bottom:5px">🚚 Home Delivery</div>
         <div style="color:#78350f;font-size:14px">${orderDetails.deliveryAddress}</div>
       </div>`
    : `<div style="background:#dbeafe;border-left:4px solid #3b82f6;padding:15px;border-radius:8px;margin:20px 0">
         <div style="font-weight:600;color:#1e3a8a;margin-bottom:5px">🏪 Store Pickup</div>
         <div style="color:#1e40af;font-size:14px">Sri Datta Print Center, Kukatpally, Hyderabad</div>
         <div style="color:#1e40af;font-size:12px;margin-top:5px">📞 Hotline: +91 8897379737</div>
       </div>`
  
  const trackingLink = `${process.env.APP_URL || 'http://localhost:3000'}/order-track/${orderDetails.orderNumber}`
  
  const content = `
    <div style="text-align:center;margin-bottom:20px">
      <div style="display:inline-block;background:#10b981;color:#fff;padding:8px 16px;border-radius:20px;font-size:14px;font-weight:600">
        ✓ Payment Confirmed
      </div>
    </div>
    <h3 style="color:#111827;margin-top:0">Thank you for your order, ${orderDetails.customerName}!</h3>
    <p style="color:#4b5563;line-height:1.6">Your payment has been received and your order is now being prepared for printing.</p>
    
    <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0;text-align:center">
      <p style="color:#6b7280;font-size:14px;margin:0 0 8px 0">Order Number</p>
      <p style="color:#111827;font-size:24px;font-weight:700;margin:0">#${orderDetails.orderNumber}</p>
      ${orderDetails.estimatedCompletion ? `<p style="color:#6b7280;font-size:13px;margin:10px 0 0 0">⏱️ Estimated completion: ${orderDetails.estimatedCompletion}</p>` : ''}
    </div>

    ${deliverySection}

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
        <span style="color:#111827;font-weight:600">${orderDetails.subtotal}</span>
      </div>
      ${orderDetails.deliveryFee ? `
      <div style="display:flex;justify-content:space-between;margin-bottom:10px">
        <span style="color:#6b7280">Delivery Fee:</span>
        <span style="color:#111827;font-weight:600">${orderDetails.deliveryFee}</span>
      </div>` : ''}
      <div style="border-top:2px solid #e5e7eb;margin:10px 0;padding-top:10px;display:flex;justify-content:space-between">
        <span style="color:#111827;font-size:18px;font-weight:700">Total Paid:</span>
        <span style="color:#10b981;font-size:24px;font-weight:700">${orderDetails.total}</span>
      </div>
      <div style="margin-top:10px;font-size:12px;color:#6b7280">
        💳 Paid via ${orderDetails.paymentMethod}
      </div>
    </div>

    <div style="text-align:center;margin:30px 0">
      <a href="${trackingLink}" style="background:#2563eb;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;font-size:16px">
        📦 Track Your Order
      </a>
    </div>

    <div style="background:#f0f9ff;border:1px solid #bfdbfe;padding:15px;border-radius:8px;margin-top:20px">
      <p style="color:#1e40af;font-size:14px;margin:0;line-height:1.6">
        <strong>What's Next?</strong><br>
        1. We'll start printing your order immediately<br>
        2. You'll receive an email when it's ready<br>
        3. ${orderDetails.deliveryType === 'delivery' ? 'Your order will be delivered to your address' : 'You can collect it from our store'}
      </p>
    </div>

    <p style="color:#6b7280;font-size:14px;margin-top:20px">
      Need help? Call us at <strong style="color:#111827">+91 8897379737</strong> or reply to this email.
    </p>`
  
  const html = emailTemplate('Sri Datta Print Center', content)
  
  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject: `Order Confirmed #${orderDetails.orderNumber} - Payment Received`,
    html,
  })
}

// Send order status update email
export async function sendOrderStatusEmail(
  to: string,
  orderDetails: {
    orderNumber: string
    customerName: string
    status: 'processing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled'
    deliveryType: 'pickup' | 'delivery'
    statusMessage?: string
    trackingLink?: string
  }
) {
  const fromEmail = process.env.EMAIL_FROM ?? 'no-reply@sridattaprintcentre.com'
  const fromName = process.env.EMAIL_FROM_NAME ?? 'Sri Datta Print Center'
  
  const statusConfig = {
    processing: {
      icon: '🖨️',
      title: 'Your Order is Being Printed',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      message: 'Good news! We\'ve started printing your order. Our team is working on it right now.'
    },
    ready: {
      icon: '✅',
      title: orderDetails.deliveryType === 'pickup' ? 'Your Order is Ready for Pickup!' : 'Your Order is Ready!',
      color: '#10b981',
      bgColor: '#d1fae5',
      message: orderDetails.deliveryType === 'pickup' 
        ? 'Your order is ready! You can collect it from our store during business hours (Mon-Sat: 9AM-7PM).'
        : 'Your order is ready and will be dispatched for delivery soon.'
    },
    out_for_delivery: {
      icon: '🚚',
      title: 'Your Order is Out for Delivery',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      message: 'Your order is on its way! Our delivery partner will reach you shortly.'
    },
    completed: {
      icon: '🎉',
      title: 'Order Delivered Successfully!',
      color: '#10b981',
      bgColor: '#d1fae5',
      message: 'Your order has been delivered. Thank you for choosing Sri Datta Print Center!'
    },
    cancelled: {
      icon: '❌',
      title: 'Order Cancelled',
      color: '#ef4444',
      bgColor: '#fee2e2',
      message: 'Your order has been cancelled. If you have any questions, please contact us.'
    }
  }
  
  const config = statusConfig[orderDetails.status]
  const trackingLink = orderDetails.trackingLink || `${process.env.APP_URL || 'http://localhost:3000'}/order-track/${orderDetails.orderNumber}`
  
  let actionButton = ''
  if (orderDetails.status === 'ready' && orderDetails.deliveryType === 'pickup') {
    actionButton = `
      <div style="background:#f0f9ff;border:1px solid #bfdbfe;padding:20px;border-radius:8px;margin:25px 0">
        <h4 style="color:#1e40af;margin:0 0 10px 0">📍 Pickup Location</h4>
        <p style="color:#1e3a8a;margin:0;line-height:1.6">
          <strong>Sri Datta Print Center</strong><br>
          Shop No. 2, Cellar Floor, Siri Plaza<br>
          KPHB Main, Kukatpally, Hyderabad<br>
          Telangana 500072<br>
          📞 Hotline: +91 8897379737
        </p>
        <p style="color:#1e40af;font-size:13px;margin:10px 0 0 0">
          ⏰ Mon-Sat: 9AM-9PM | Sun: 10:30AM-7PM
        </p>
      </div>`
  } else if (orderDetails.status === 'completed') {
    actionButton = `
      <div style="text-align:center;margin:30px 0">
        <p style="color:#6b7280;margin-bottom:15px">How was your experience?</p>
        <a href="${process.env.APP_URL}/rate-order/${orderDetails.orderNumber}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">
          ⭐ Rate Your Order
        </a>
      </div>`
  }
  
  const content = `
    <div style="text-align:center;margin-bottom:25px">
      <div style="display:inline-block;background:${config.bgColor};color:${config.color};padding:12px 24px;border-radius:12px;font-size:18px;font-weight:700">
        ${config.icon} ${config.title}
      </div>
    </div>

    <p style="color:#4b5563;font-size:16px;line-height:1.6">Hi ${orderDetails.customerName},</p>
    <p style="color:#4b5563;font-size:16px;line-height:1.6">${orderDetails.statusMessage || config.message}</p>

    <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:25px 0;text-align:center">
      <p style="color:#6b7280;font-size:14px;margin:0 0 8px 0">Order Number</p>
      <p style="color:#111827;font-size:22px;font-weight:700;margin:0">#${orderDetails.orderNumber}</p>
    </div>

    ${actionButton}

    ${orderDetails.status !== 'cancelled' && orderDetails.status !== 'completed' ? `
    <div style="text-align:center;margin:30px 0">
      <a href="${trackingLink}" style="background:#111827;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">
        📦 Track Order
      </a>
    </div>` : ''}

    <p style="color:#6b7280;font-size:14px;margin-top:25px">
      Questions? Contact us at <strong style="color:#111827">+91 8897379737</strong>
    </p>`
  
  const html = emailTemplate('Sri Datta Print Center', content)
  
  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject: `${config.icon} Order #${orderDetails.orderNumber} - ${config.title}`,
    html,
  })
}

// Generic email sender (for custom emails)
export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  options?: {
    from?: string
    replyTo?: string
    cc?: string
    bcc?: string
  }
) {
  const fromEmail = options?.from ?? process.env.EMAIL_FROM ?? 'copyprintsdpc@gmail.com'
  const fromName = process.env.EMAIL_FROM_NAME ?? 'Sri Datta Print Center'
  
  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html: htmlContent,
    replyTo: options?.replyTo,
    cc: options?.cc,
    bcc: options?.bcc,
  })
}

// Verify SMTP connection (for testing)
export async function verifyConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await transporter.verify()
    return { success: true, message: 'SMTP connection verified successfully' }
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}


