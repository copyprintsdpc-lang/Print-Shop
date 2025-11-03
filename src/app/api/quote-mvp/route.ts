import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { connectToDatabase } from '@/lib/db'
import Order from '@/models/Order'
import { sendEmail } from '@/lib/mailer'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const address = formData.get('address') as string
    const message = formData.get('message') as string
    const size = formData.get('size') as string
    const deliveryMethod = formData.get('deliveryMethod') as string

    // Validate required fields
    if (!phone || !size || !deliveryMethod) {
      return NextResponse.json({ 
        ok: false, 
        message: 'Phone number, paper size, and delivery method are required' 
      }, { status: 400 })
    }

    // Handle file uploads
    const uploadedFiles: string[] = []
    const files = formData.getAll('files') as File[]
    
    if (files.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        message: 'Please upload at least one file' 
      }, { status: 400 })
    }

    // Save uploaded files
    if (files.length > 0) {
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'quotes')
      
      for (const file of files) {
        if (file && file.size > 0) {
          try {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            
            // Create upload directory if it doesn't exist
            const { mkdir } = await import('fs/promises')
            await mkdir(uploadDir, { recursive: true })
            
            // Save file with timestamp
            const timestamp = Date.now()
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
            const filename = `${timestamp}_${sanitizedName}`
            const filepath = join(uploadDir, filename)
            
            await writeFile(filepath, buffer)
            uploadedFiles.push(`/uploads/quotes/${filename}`)
          } catch (fileError) {
            console.error('File upload error:', fileError)
            // Continue processing even if file upload fails
          }
        }
      }
    }

    // Connect to database and save quote request as order
    await connectToDatabase()
    
    const order = await Order.create({
      customerInfo: {
        name: 'Quote Request',
        email: email || '',
        phone: phone,
      },
      deliveryInfo: {
        method: deliveryMethod as 'pickup' | 'courier',
        address: {
          line1: address || '',
          city: '',
          state: '',
          pincode: '',
          country: 'India'
        }
      },
      status: 'quote_requested',
      totalAmount: 0, // Will be set after quote
      notes: `Paper Size: ${size}\n${message ? `Notes: ${message}` : ''}`,
      files: uploadedFiles,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Prepare email content for notification
    const adminEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_FROM || 'copyprintsdpc@gmail.com'
    const emailSubject = `New Quote Request - ${phone}`
    const emailHtml = `
      <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto">
        <h2 style="color:#111827;border-bottom:2px solid #3b82f6;padding-bottom:10px;margin-bottom:20px">
          New Quote Request Received
        </h2>
        
        <div style="background:#f9fafb;padding:20px;border-radius:8px;margin-bottom:20px">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;width:150px">Order ID:</td>
              <td style="padding:8px 0;color:#111827;font-weight:700">${order._id}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Phone:</td>
              <td style="padding:8px 0;color:#111827">
                <a href="tel:${phone}" style="color:#3b82f6;text-decoration:none;font-weight:600">${phone}</a>
              </td>
            </tr>
            ${email ? `
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Email:</td>
              <td style="padding:8px 0;color:#111827">
                <a href="mailto:${email}" style="color:#3b82f6;text-decoration:none">${email}</a>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Paper Size:</td>
              <td style="padding:8px 0;color:#111827;font-weight:600">${size}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Delivery:</td>
              <td style="padding:8px 0;color:#111827">
                <span style="background:#3b82f6;color:#fff;padding:4px 12px;border-radius:4px;font-size:12px;font-weight:600">
                  ${deliveryMethod === 'pickup' ? '📍 Store Pickup' : '🚚 Home Delivery'}
                </span>
              </td>
            </tr>
            ${address ? `
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;vertical-align:top">Address:</td>
              <td style="padding:8px 0;color:#111827">${address}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:20px">
          <h3 style="color:#111827;margin-top:0;margin-bottom:10px">Files Attached (${uploadedFiles.length}):</h3>
          <ul style="margin:0;padding-left:20px">
            ${uploadedFiles.map(file => `
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

        ${message ? `
        <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:20px">
          <h3 style="color:#111827;margin-top:0;margin-bottom:10px">Customer Notes:</h3>
          <p style="color:#4b5563;line-height:1.6;white-space:pre-wrap;margin:0">${message}</p>
        </div>
        ` : ''}

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
        
        <div style="text-align:center;padding:20px;background:#f9fafb;border-radius:8px">
          <p style="color:#6b7280;font-size:14px;margin:0">
            Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>

        <div style="margin-top:30px;text-align:center">
          <a href="tel:${phone}" 
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

    // Send notification email to admin
    try {
      await sendEmail(adminEmail, emailSubject, emailHtml)
    } catch (emailError) {
      console.error('Failed to send quote request notification email:', emailError)
      // Don't fail the request if email fails
    }

    // Send confirmation to customer if email provided
    if (email) {
      const customerHtml = `
        <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto">
          <h2 style="color:#111827;border-bottom:2px solid #10b981;padding-bottom:10px;margin-bottom:20px">
            Quote Request Received!
          </h2>
          
          <p style="color:#4b5563;line-height:1.6;margin-bottom:20px">
            Thank you for your quote request.
          </p>
          
          <div style="background:#ecfdf5;padding:20px;border-radius:8px;border:1px solid #86efac;margin-bottom:20px">
            <h3 style="color:#065f46;margin-top:0;margin-bottom:10px">Your Request:</h3>
            <p style="color:#047857;margin:5px 0"><strong>Paper Size:</strong> ${size}</p>
            <p style="color:#047857;margin:5px 0"><strong>Delivery:</strong> ${deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'}</p>
            <p style="color:#047857;margin:5px 0"><strong>Files:</strong> ${uploadedFiles.length} uploaded</p>
          </div>

          <div style="background:#f0f9ff;padding:20px;border-radius:8px;margin-bottom:20px">
            <h3 style="color:#0369a1;margin-top:0;margin-bottom:10px">What's Next?</h3>
            <ul style="color:#0369a1;margin:0;padding-left:20px">
              <li>Our team will review your files</li>
              <li>You'll receive a detailed quote within 24 hours</li>
              <li>We may call you on ${phone} for clarifications</li>
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

      try {
        await sendEmail(email, 'Quote Request Received - Sri Datta Print Center', customerHtml)
      } catch (emailError) {
        console.error('Failed to send customer confirmation:', emailError)
      }
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Quote request submitted successfully!',
      orderId: order._id
    })

  } catch (error: any) {
    console.error('Quote request error:', error)
    return NextResponse.json({ 
      ok: false, 
      message: error.message || 'Failed to submit quote request. Please try again.' 
    }, { status: 500 })
  }
}

