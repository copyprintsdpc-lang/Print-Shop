// Notification service for sending emails and WhatsApp messages
// This service handles notifications to both customers and print centre

import { sendEmail } from './mailer'
import { otpService, formatMobileNumber } from './otpService'
import QRCode from 'qrcode'

const PRINT_CENTRE_EMAIL = process.env.PRINT_CENTRE_EMAIL || 'support@sridattaprintcentre.com'
const PRINT_CENTRE_PHONE = process.env.PRINT_CENTRE_PHONE || '8897379737'

/**
 * Send notifications to print centre (email + WhatsApp)
 */
interface NotificationFileDetail {
  name: string
  url?: string
  downloadUrl?: string
  copies?: number | string
  colorMode?: string
  paperSize?: string
}

type NotificationType = 'quote' | 'contact' | 'order' | 'pickup'

async function generateQrDataUrl(text?: string | null): Promise<string | null> {
  if (!text) return null
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 220,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#111827',
        light: '#ffffffff'
      }
    })
  } catch (error) {
    console.error('Failed to generate QR code data URL:', error)
    return null
  }
}

type NotificationData = {
  quoteNumber?: string
  customerPhone?: string
  customerEmail?: string
  customerName?: string
  paperSize?: string
  quantity?: number | string
  deliveryMethod?: 'pickup' | 'delivery'
  deliveryAddress?: string
  message?: string
  files?: string[]
  fileDetails?: string
  subject?: string
  inquiryType?: string
  orderNumber?: string
  pickupCode?: string
  pickupUrl?: string
  qrData?: string
  pickupFiles?: NotificationFileDetail[]
}

export async function notifyPrintCentre(
  type: NotificationType,
  data: {
    // Preserved for backward compatibility
  } & NotificationData
) {
  const notifications = []

  // Prepare email content
  let emailSubject = ''
  let emailHtml = ''

  if (type === 'quote') {
    emailSubject = `New Quote Request - ${data.quoteNumber || data.customerPhone}`
    emailHtml = `
      <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto">
        <h2 style="color:#111827;border-bottom:2px solid #3b82f6;padding-bottom:10px;margin-bottom:20px">
          📋 New Quote Request Received
        </h2>
        
        <div style="background:#f9fafb;padding:20px;border-radius:8px;margin-bottom:20px">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;width:150px">Quote Number:</td>
              <td style="padding:8px 0;color:#111827;font-weight:700;font-size:18px">${data.quoteNumber || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Customer Phone:</td>
              <td style="padding:8px 0;color:#111827">
                <a href="tel:${data.customerPhone}" style="color:#3b82f6;text-decoration:none;font-weight:600">${data.customerPhone || 'N/A'}</a>
              </td>
            </tr>
            ${data.customerEmail ? `
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Customer Email:</td>
              <td style="padding:8px 0;color:#111827">
                <a href="mailto:${data.customerEmail}" style="color:#3b82f6;text-decoration:none">${data.customerEmail}</a>
              </td>
            </tr>
            ` : ''}
            ${data.customerName ? `
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Customer Name:</td>
              <td style="padding:8px 0;color:#111827">${data.customerName}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Paper Size:</td>
              <td style="padding:8px 0;color:#111827;font-weight:600">${data.paperSize || 'N/A'}</td>
            </tr>
            ${data.quantity ? `
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Quantity:</td>
              <td style="padding:8px 0;color:#111827;font-weight:600">${data.quantity}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Delivery:</td>
              <td style="padding:8px 0;color:#111827">
                <span style="background:#3b82f6;color:#fff;padding:4px 12px;border-radius:4px;font-size:12px;font-weight:600">
                  ${data.deliveryMethod === 'pickup' ? '📍 Store Pickup' : '🚚 Home Delivery'}
                </span>
              </td>
            </tr>
            ${data.deliveryAddress ? `
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;vertical-align:top">Delivery Address:</td>
              <td style="padding:8px 0;color:#111827">${data.deliveryAddress}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        ${data.files && data.files.length > 0 ? `
        <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:20px">
          <h3 style="color:#111827;margin-top:0;margin-bottom:10px">Files Attached (${data.files.length}):</h3>
          ${data.fileDetails ? `
          <p style="color:#0369a1;margin-bottom:10px;font-weight:600">${data.fileDetails}</p>
          ` : ''}
          <ul style="margin:0;padding-left:20px">
            ${data.files.map(file => `
              <li style="color:#0369a1;margin-bottom:8px">
                <a href="${file.startsWith('http') ? file : (process.env.APP_URL || 'http://localhost:3000') + file}" 
                   style="color:#3b82f6;text-decoration:underline" 
                   target="_blank">
                  ${file.split('/').pop()}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
        ` : ''}

        ${data.message ? `
        <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:20px">
          <h3 style="color:#111827;margin-top:0;margin-bottom:10px">Customer Notes:</h3>
          <p style="color:#4b5563;line-height:1.6;white-space:pre-wrap;margin:0">${data.message}</p>
        </div>
        ` : ''}

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
        
        <div style="text-align:center;padding:20px;background:#f9fafb;border-radius:8px">
          <p style="color:#6b7280;font-size:14px;margin:0">
            Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>

        <div style="margin-top:30px;text-align:center">
          <a href="tel:${data.customerPhone}" 
             style="background:#10b981;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;margin-right:10px">
            📞 Call Customer
          </a>
          <a href="${process.env.APP_URL || 'http://localhost:3000'}/admin/orders" 
             style="background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">
            View in Admin
          </a>
        </div>
      </div>
    `
  } else if (type === 'contact') {
    const inquiryTypeLabels: Record<string, string> = {
      general: 'General Inquiry',
      quote: 'Request Quote',
      support: 'Customer Support',
      bulk: 'Bulk Order',
      partnership: 'Partnership',
      other: 'Other'
    }

    emailSubject = `New Contact Form: ${data.subject || 'Inquiry'}`
    emailHtml = `
      <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto">
        <h2 style="color:#111827;border-bottom:2px solid #3b82f6;padding-bottom:10px;margin-bottom:20px">
          📧 New Contact Form Submission
        </h2>
        
        <div style="background:#f9fafb;padding:20px;border-radius:8px;margin-bottom:20px">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;width:150px">Name:</td>
              <td style="padding:8px 0;color:#111827">${data.customerName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Email:</td>
              <td style="padding:8px 0;color:#111827">
                <a href="mailto:${data.customerEmail}" style="color:#3b82f6;text-decoration:none">${data.customerEmail || 'N/A'}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Phone:</td>
              <td style="padding:8px 0;color:#111827">
                <a href="tel:${data.customerPhone}" style="color:#3b82f6;text-decoration:none">${data.customerPhone || 'N/A'}</a>
              </td>
            </tr>
            ${data.inquiryType ? `
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Inquiry Type:</td>
              <td style="padding:8px 0;color:#111827">
                <span style="background:#3b82f6;color:#fff;padding:4px 12px;border-radius:4px;font-size:12px">
                  ${inquiryTypeLabels[data.inquiryType] || data.inquiryType}
                </span>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;vertical-align:top">Subject:</td>
              <td style="padding:8px 0;color:#111827">${data.subject || 'N/A'}</td>
            </tr>
          </table>
        </div>

        ${data.message ? `
        <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:20px">
          <h3 style="color:#111827;margin-top:0;margin-bottom:10px">Message:</h3>
          <p style="color:#4b5563;line-height:1.6;white-space:pre-wrap;margin:0">${data.message}</p>
        </div>
        ` : ''}

        ${data.files && data.files.length > 0 ? `
          <div style="background:#f0f9ff;padding:20px;border-radius:8px;border:1px solid #bae6fd;margin-bottom:20px">
            <h3 style="color:#0369a1;margin-top:0;margin-bottom:10px">Attached Files (${data.files.length}):</h3>
            <ul style="margin:0;padding-left:20px">
              ${data.files.map(file => `
                <li style="color:#0369a1;margin-bottom:8px">
                  <a href="${process.env.APP_URL || 'http://localhost:3000'}${file}" 
                     style="color:#3b82f6;text-decoration:underline" 
                     target="_blank">
                    ${file.split('/').pop()}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
        
        <div style="text-align:center;padding:20px;background:#f9fafb;border-radius:8px">
          <p style="color:#6b7280;font-size:14px;margin:0">
            Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>

        <div style="margin-top:30px;text-align:center">
          <a href="mailto:${data.customerEmail}" 
             style="background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">
            Reply to ${data.customerName || 'Customer'}
          </a>
        </div>
      </div>
    `
  } else if (type === 'pickup') {
    emailSubject = `New Pickup Request - ${data.pickupCode || data.customerPhone || 'Unknown Customer'}`
    const files = data.pickupFiles || []
    const pickupLink = data.pickupUrl || `${(process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '')}/pickup/${data.pickupCode}`
    const qrCodeDataUrl = await generateQrDataUrl(data.qrData || pickupLink)
    const fileItems = files.length > 0
      ? files.map(file => `
          <li style="margin-bottom:12px;color:#0369a1;">
            <div style="font-weight:600;color:#0f172a;">${file.name}</div>
            <div style="color:#475569;font-size:14px;margin:4px 0;">
              ${file.colorMode === 'grayscale' ? 'Black & White' : 'Colour'} • ${file.paperSize || 'A4'} • ${file.copies || 1} copy${(file.copies && Number(file.copies) !== 1) ? 'ies' : 'y'}
            </div>
            ${file.downloadUrl ? `
              <a href="${file.downloadUrl}" target="_blank" style="color:#2563eb;text-decoration:underline;font-size:14px;">Download file</a>
            ` : ''}
          </li>
        `).join('')
      : '<li style="color:#6b7280;">No files attached.</li>'

    emailHtml = `
      <div style="font-family:sans-serif;padding:20px;max-width:640px;margin:0 auto;background:#fff;">
        <h2 style="color:#111827;border-bottom:2px solid #16a34a;padding-bottom:10px;margin-bottom:20px">
          📦 New Pickup Request Received
        </h2>

        <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-bottom:20px;border:1px solid #e5e7eb;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;width:160px;">Pickup Code:</td>
              <td style="padding:8px 0;color:#111827;font-size:18px;font-weight:700;">${data.pickupCode || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;">Customer Phone:</td>
              <td style="padding:8px 0;">
                ${data.customerPhone
                  ? `<a href="tel:${data.customerPhone}" style="color:#2563eb;text-decoration:none;font-weight:600;">${data.customerPhone}</a>`
                  : '<span style="color:#6b7280;">N/A</span>'}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;">Customer Email:</td>
              <td style="padding:8px 0;">
                ${data.customerEmail
                  ? `<a href="mailto:${data.customerEmail}" style="color:#2563eb;text-decoration:none;">${data.customerEmail}</a>`
                  : '<span style="color:#6b7280;">N/A</span>'}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;">Total Files:</td>
              <td style="padding:8px 0;color:#111827;font-weight:600;">${files.length}</td>
            </tr>
          </table>
        </div>

        <div style="background:#fff7ed;padding:16px;border-radius:8px;border:1px solid #fed7aa;margin-bottom:24px;">
          <h3 style="color:#c2410c;margin-top:0;margin-bottom:12px;">Files Ready for Printing</h3>
          <ul style="padding-left:18px;margin:0;list-style:disc;">
            ${fileItems}
          </ul>
        </div>

        ${data.message ? `
          <div style="background:#f8fafc;padding:16px;border-radius:8px;border:1px solid #cbd5f5;margin-bottom:24px;">
            <h3 style="color:#1d4ed8;margin-top:0;margin-bottom:12px;">Customer Notes</h3>
            <p style="color:#334155;line-height:1.6;margin:0;">${data.message}</p>
          </div>
        ` : ''}

        ${qrCodeDataUrl ? `
          <div style="background:#ecfdf5;padding:20px;border-radius:12px;border:1px solid #bbf7d0;margin-bottom:24px;text-align:center;">
            <h3 style="color:#047857;margin:0 0 12px 0;">Scan at Counter</h3>
            <div style="display:inline-block;padding:12px;border-radius:16px;background:#fff;">
              <img src="${qrCodeDataUrl}" alt="Pickup QR Code" style="width:180px;height:180px;display:block;" />
            </div>
            <p style="color:#16a34a;font-size:14px;margin:12px 0 0 0;">Pickup Link: <a href="${pickupLink}" style="color:#15803d;text-decoration:underline;">${pickupLink}</a></p>
          </div>
        ` : ''}

        <div style="text-align:center;margin-top:30px;">
          <a href="${(process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '')}/admin/pickups" 
             style="background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;margin-bottom:10px;">
            Open Pickup Console
          </a>
          <p style="color:#6b7280;font-size:14px;margin:0;">
            Login required • Use pickup code <strong>${data.pickupCode || ''}</strong>
          </p>
        </div>
      </div>
    `
  }

  // Send email notification
  try {
    await sendEmail(PRINT_CENTRE_EMAIL, emailSubject, emailHtml)
    notifications.push('email')
  } catch (emailError) {
    console.error('Failed to send email notification to print centre:', emailError)
  }

  // Send WhatsApp notification
  try {
    let whatsappMessage = ''
    if (type === 'quote') {
      whatsappMessage = `📋 *New Quote Request*\n\n` +
        `Quote Number: *${data.quoteNumber}*\n` +
        `Phone: ${data.customerPhone}\n` +
        `${data.customerEmail ? `Email: ${data.customerEmail}\n` : ''}` +
        `Paper Size: ${data.paperSize}\n` +
        `${data.quantity ? `Total Quantity: ${data.quantity}\n` : ''}` +
        `${data.fileDetails ? `Files: ${data.fileDetails}\n` : (data.files && data.files.length > 0 ? `Files: ${data.files.length} attached\n` : '')}` +
        `Delivery: ${data.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'}\n` +
        `${data.deliveryAddress ? `Address: ${data.deliveryAddress}\n` : ''}` +
        `\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n` +
        `\nView in admin: ${process.env.APP_URL || 'http://localhost:3000'}/admin/orders`
    } else if (type === 'contact') {
      whatsappMessage = `📧 *New Contact Form Submission*\n\n` +
        `Name: ${data.customerName}\n` +
        `Phone: ${data.customerPhone}\n` +
        `Email: ${data.customerEmail}\n` +
        `${data.inquiryType ? `Type: ${data.inquiryType}\n` : ''}` +
        `Subject: ${data.subject}\n` +
        `${data.message ? `Message: ${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}\n` : ''}` +
        `${data.files && data.files.length > 0 ? `Files: ${data.files.length} attached\n` : ''}` +
        `\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
    } else if (type === 'pickup') {
      const fileSummary = data.pickupFiles && data.pickupFiles.length > 0
        ? data.pickupFiles.map(file => `${file.name} (${file.copies || 1} copies, ${file.colorMode === 'grayscale' ? 'B/W' : 'Colour'}, ${file.paperSize || 'A4'})`).join('\n')
        : 'No files listed'

      whatsappMessage = `📦 *New Pickup Upload*\n\n` +
        `Pickup Code: *${data.pickupCode || 'N/A'}*\n` +
        `${data.customerPhone ? `Phone: ${data.customerPhone}\n` : ''}` +
        `${data.customerEmail ? `Email: ${data.customerEmail}\n` : ''}` +
        `Files:\n${fileSummary}\n\n` +
        `View in admin: ${(process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '')}/admin/pickups\n` +
        `Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
    }

    const formattedPhone = formatMobileNumber(PRINT_CENTRE_PHONE)
    await otpService.sendWhatsApp(formattedPhone, whatsappMessage)
    notifications.push('whatsapp')
  } catch (whatsappError) {
    console.error('Failed to send WhatsApp notification to print centre:', whatsappError)
  }

  return notifications
}

/**
 * Send confirmation to customer (email and/or WhatsApp)
 */
export async function notifyCustomer(
  type: NotificationType,
  data: {
  } & NotificationData
) {
  const notifications = []

  // Send email if provided
  if (data.customerEmail && type === 'quote') {
    try {
      const customerHtml = `
        <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto">
          <h2 style="color:#111827;border-bottom:2px solid #10b981;padding-bottom:10px;margin-bottom:20px">
            Quote Request Received!
          </h2>
          
          <p style="color:#4b5563;line-height:1.6;margin-bottom:20px">
            Thank you for your quote request. We've received your order and will process it shortly.
          </p>
          
          <div style="background:#ecfdf5;padding:20px;border-radius:8px;border:1px solid #86efac;margin-bottom:20px">
            <h3 style="color:#065f46;margin-top:0;margin-bottom:10px">Your Order Details:</h3>
            <p style="color:#047857;margin:5px 0"><strong>Order Number:</strong> <span style="font-size:18px;font-weight:700">${data.quoteNumber}</span></p>
            <p style="color:#047857;margin:5px 0"><strong>Paper Size:</strong> ${data.paperSize}</p>
            ${data.quantity ? `<p style="color:#047857;margin:5px 0"><strong>Total Quantity:</strong> ${data.quantity} copies</p>` : ''}
            ${data.fileDetails ? `<p style="color:#047857;margin:5px 0"><strong>Files:</strong> ${data.fileDetails}</p>` : `<p style="color:#047857;margin:5px 0"><strong>Files:</strong> ${data.files?.length || 0} uploaded</p>`}
            <p style="color:#047857;margin:5px 0"><strong>Delivery:</strong> ${data.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'}</p>
          </div>

          <div style="background:#f0f9ff;padding:20px;border-radius:8px;margin-bottom:20px">
            <h3 style="color:#0369a1;margin-top:0;margin-bottom:10px">What's Next?</h3>
            <ul style="color:#0369a1;margin:0;padding-left:20px">
              <li>Our team will review your files</li>
              <li>You'll receive a detailed quote within 24 hours</li>
              <li>We may call you on ${data.customerPhone} for clarifications</li>
              <li>Once approved, we'll proceed with printing</li>
            </ul>
          </div>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0">
          
          <div style="text-align:center;padding:20px;background:#f9fafb;border-radius:8px">
            <p style="color:#6b7280;font-size:14px;margin:0">Need immediate assistance?</p>
            <p style="color:#6b7280;font-size:14px;margin:5px 0">Call us: <strong>+91 8897379737</strong></p>
            <p style="color:#6b7280;font-size:14px;margin:0">Mon-Sat, 9AM-9PM</p>
          </div>

          <p style="color:#9ca3af;font-size:12px;margin-top:30px;text-align:center">
            © ${new Date().getFullYear()} Sri Datta Print Center. All rights reserved.
          </p>
        </div>
      `
      await sendEmail(data.customerEmail, 'Quote Request Received - Sri Datta Print Center', customerHtml)
      notifications.push('email')
    } catch (emailError) {
      console.error('Failed to send customer email:', emailError)
    }
  }

  // Send WhatsApp if phone provided
  if (data.customerPhone && type === 'quote') {
    try {
      const formattedPhone = formatMobileNumber(data.customerPhone)
      const whatsappMessage = `✅ *Your Quote Request has been Received!*\n\n` +
        `Order Number: *${data.quoteNumber}*\n\n` +
        `Paper Size: ${data.paperSize}\n` +
        `${data.quantity ? `Total Quantity: ${data.quantity} copies\n` : ''}` +
        `${data.fileDetails ? `Files: ${data.fileDetails}\n` : `Files: ${data.files?.length || 0} uploaded\n`}` +
        `Delivery: ${data.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'}\n\n` +
        `Our team will review your files and send you a detailed quote within 24 hours.\n\n` +
        `For urgent queries, call us: +91 8897379737\n` +
        `Mon-Sat: 9AM-9PM\n\n` +
        `Thank you for choosing Sri Datta Print Center! 🎉`
      
      await otpService.sendWhatsApp(formattedPhone, whatsappMessage)
      notifications.push('whatsapp')
    } catch (whatsappError) {
      console.error('Failed to send customer WhatsApp:', whatsappError)
    }
  }

  if (data.customerEmail && type === 'pickup') {
    try {
      const pickupLink = data.pickupUrl || `${(process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '')}/pickup/${data.pickupCode}`
      const fileSummary = data.pickupFiles && data.pickupFiles.length > 0
        ? data.pickupFiles.map(file =>
            `<li style="margin-bottom:8px;">
              <strong>${file.name}</strong>
              <div style="color:#4b5563;font-size:13px;margin-top:4px;">
                ${file.colorMode === 'grayscale' ? 'Black & White' : 'Colour'} • ${file.paperSize || 'A4'} • ${file.copies || 1} copy${(file.copies && Number(file.copies) !== 1) ? 'ies' : 'y'}
              </div>
            </li>`
          ).join('')
        : ''
      const qrCodeDataUrl = await generateQrDataUrl(data.qrData || pickupLink)

      const customerHtml = `
        <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto;background:#fff;">
          <h2 style="color:#111827;border-bottom:2px solid #16a34a;padding-bottom:10px;margin-bottom:20px;">
            Pickup Request Received!
          </h2>

          <p style="color:#4b5563;line-height:1.6;margin-bottom:20px;">
            Thank you for sending your files to Sri Datta Print Center. Your pickup request has been created successfully.
          </p>

          <div style="background:#ecfdf5;padding:16px;border-radius:8px;border:1px solid #86efac;margin-bottom:20px;">
            <p style="color:#047857;font-size:14px;margin:0 0 8px;">Your pickup code</p>
            <p style="color:#064e3b;font-size:24px;font-weight:700;letter-spacing:1px;margin:0;">${data.pickupCode || 'N/A'}</p>
          </div>

          ${fileSummary ? `
            <div style="background:#f1f5f9;padding:16px;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:20px;">
              <h3 style="color:#0f172a;margin-top:0;margin-bottom:12px;font-size:16px;">Files Submitted</h3>
              <ul style="margin:0;padding-left:18px;color:#1e293b;font-size:14px;">
                ${fileSummary}
              </ul>
            </div>
          ` : ''}

          ${qrCodeDataUrl ? `
            <div style="background:#ecfdf5;padding:18px;border-radius:12px;border:1px solid #bbf7d0;margin-bottom:20px;text-align:center;">
              <h3 style="color:#047857;margin:0 0 12px 0;font-size:16px;">Show this QR at the Store</h3>
              <div style="display:inline-block;padding:10px;border-radius:16px;background:#fff;">
                <img src="${qrCodeDataUrl}" alt="Pickup QR Code" style="width:200px;height:200px;display:block;" />
              </div>
              <p style="color:#065f46;font-size:13px;margin:12px 0 0 0;">Pickup link: <a href="${pickupLink}" style="color:#047857;text-decoration:underline;">${pickupLink}</a></p>
            </div>
          ` : ''}

          <div style="background:#f0f9ff;padding:16px;border-radius:8px;border:1px solid #bae6fd;margin-bottom:20px;">
            <h3 style="color:#0369a1;margin-top:0;margin-bottom:12px;font-size:16px;">What Happens Next?</h3>
            <ul style="color:#0369a1;margin:0;padding-left:18px;font-size:14px;line-height:1.6;">
              <li>Visit our store and share the pickup code with the staff.</li>
              <li>We will retrieve your files and get them printed.</li>
              <li>For large orders, please call ahead so we can prepare in advance.</li>
            </ul>
          </div>

          <div style="text-align:center;margin:24px 0;">
            <a href="${pickupLink}"
               style="background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
              View Pickup Details
            </a>
          </div>

          <p style="color:#6b7280;font-size:13px;text-align:center;margin-top:24px;">
            Need help? Call us at <strong>+91 8897379737</strong><br/>
            Monday - Saturday, 9:00 AM to 9:00 PM
          </p>

          <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:30px;">
            © ${new Date().getFullYear()} Sri Datta Print Center. All rights reserved.
          </p>
        </div>
      `

      await sendEmail(data.customerEmail, 'Pickup Request Received - Sri Datta Print Center', customerHtml)
      notifications.push('email')
    } catch (emailError) {
      console.error('Failed to send pickup confirmation email:', emailError)
    }
  }

  if (data.customerPhone && type === 'pickup') {
    try {
      const formattedPhone = formatMobileNumber(data.customerPhone)
      const pickupLink = data.pickupUrl || `${(process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '')}/pickup/${data.pickupCode}`
      const whatsappMessage = `✅ *Your Pickup Request has been Received!*\n\n` +
        `Pickup Code: *${data.pickupCode || 'N/A'}*\n` +
        `Files submitted: ${data.pickupFiles?.length || 0}\n\n` +
        `Show this code at the store counter to retrieve your files.\n\n` +
        `Pickup details: ${pickupLink}\n\n` +
        `Need help? Call +91 8897379737\n` +
        `Thank you for choosing Sri Datta Print Center!`

      await otpService.sendWhatsApp(formattedPhone, whatsappMessage)
      notifications.push('whatsapp')
    } catch (whatsappError) {
      console.error('Failed to send pickup confirmation WhatsApp:', whatsappError)
    }
  }

  return notifications
}

