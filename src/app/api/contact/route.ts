import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { sendEmail } from '@/lib/mailer'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const subject = formData.get('subject') as string
    const inquiryType = formData.get('inquiryType') as string
    const message = formData.get('message') as string

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json({ 
        ok: false, 
        message: 'All required fields must be filled' 
      }, { status: 400 })
    }

    // Handle file uploads
    const uploadedFiles: string[] = []
    const files = formData.getAll('files') as File[]
    
    if (files.length > 0) {
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'contact')
      
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
          uploadedFiles.push(`/uploads/contact/${filename}`)
          } catch (fileError) {
            console.error('File upload error:', fileError)
            // Continue processing even if file upload fails
          }
        }
      }
    }

    // Prepare email content
    const inquiryTypeLabels: Record<string, string> = {
      general: 'General Inquiry',
      quote: 'Request Quote',
      support: 'Customer Support',
      bulk: 'Bulk Order',
      partnership: 'Partnership',
      other: 'Other'
    }

    const emailSubject = `New Contact Form: ${subject}`
    const emailHtml = `
      <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto">
        <h2 style="color:#111827;border-bottom:2px solid #3b82f6;padding-bottom:10px;margin-bottom:20px">
          New Contact Form Submission
        </h2>
        
        <div style="background:#f9fafb;padding:20px;border-radius:8px;margin-bottom:20px">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;width:150px">Name:</td>
              <td style="padding:8px 0;color:#111827">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Email:</td>
              <td style="padding:8px 0;color:#111827">
                <a href="mailto:${email}" style="color:#3b82f6;text-decoration:none">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Phone:</td>
              <td style="padding:8px 0;color:#111827">
                <a href="tel:${phone}" style="color:#3b82f6;text-decoration:none">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600">Inquiry Type:</td>
              <td style="padding:8px 0;color:#111827">
                <span style="background:#3b82f6;color:#fff;padding:4px 12px;border-radius:4px;font-size:12px">
                  ${inquiryTypeLabels[inquiryType] || inquiryType}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;vertical-align:top">Subject:</td>
              <td style="padding:8px 0;color:#111827">${subject}</td>
            </tr>
          </table>
        </div>

        <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:20px">
          <h3 style="color:#111827;margin-top:0;margin-bottom:10px">Message:</h3>
          <p style="color:#4b5563;line-height:1.6;white-space:pre-wrap;margin:0">${message}</p>
        </div>

        ${uploadedFiles.length > 0 ? `
          <div style="background:#f0f9ff;padding:20px;border-radius:8px;border:1px solid #bae6fd;margin-bottom:20px">
            <h3 style="color:#0369a1;margin-top:0;margin-bottom:10px">Attached Files (${uploadedFiles.length}):</h3>
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
        ` : ''}

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
        
        <div style="text-align:center;padding:20px;background:#f9fafb;border-radius:8px">
          <p style="color:#6b7280;font-size:14px;margin:0">
            Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>

        <div style="margin-top:30px;text-align:center">
          <a href="mailto:${email}" 
             style="background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">
            Reply to ${name}
          </a>
        </div>
      </div>
    `

    // Send email to business
    const businessEmail = 'support@sridattaprintcentre.com'
    
    try {
      await sendEmail(businessEmail, emailSubject, emailHtml, {
        replyTo: email
      })
    } catch (emailError) {
      console.error('Failed to send contact form email:', emailError)
      // Continue even if email fails - don't fail the request
    }

    // Send confirmation email to customer
    const customerHtml = `
      <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto">
        <h2 style="color:#111827;border-bottom:2px solid #10b981;padding-bottom:10px;margin-bottom:20px">
          Thank You for Contacting Us!
        </h2>
        
        <p style="color:#4b5563;line-height:1.6;margin-bottom:20px">
          Hi ${name},
        </p>
        
        <p style="color:#4b5563;line-height:1.6;margin-bottom:20px">
          We've received your message about <strong>"${subject}"</strong> and one of our team members will get back to you within 2 hours during business hours.
        </p>
        
        <div style="background:#ecfdf5;padding:20px;border-radius:8px;border:1px solid #86efac;margin-bottom:20px">
          <h3 style="color:#065f46;margin-top:0;margin-bottom:10px">Your Inquiry Details:</h3>
          <p style="color:#047857;margin:5px 0"><strong>Type:</strong> ${inquiryTypeLabels[inquiryType] || inquiryType}</p>
          <p style="color:#047857;margin:5px 0"><strong>Subject:</strong> ${subject}</p>
          ${uploadedFiles.length > 0 ? `<p style="color:#047857;margin:5px 0"><strong>Files:</strong> ${uploadedFiles.length} attached</p>` : ''}
        </div>

        <div style="background:#f0f9ff;padding:20px;border-radius:8px;margin-bottom:20px">
          <h3 style="color:#0369a1;margin-top:0;margin-bottom:10px">What's Next?</h3>
          <ul style="color:#0369a1;margin:0;padding-left:20px">
            <li>Our team will review your inquiry</li>
            <li>You'll receive a response within 2 hours</li>
            <li>We may call you on ${phone} for quick clarifications</li>
          </ul>
        </div>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0">
        
        <div style="text-align:center;padding:20px;background:#f9fafb;border-radius:8px">
          <p style="color:#6b7280;font-size:14px;margin:0">Need immediate assistance?</p>
          <p style="color:#6b7280;font-size:14px;margin:5px 0">Call us: <strong>+91 8897379737</strong></p>
          <p style="color:#6b7280;font-size:14px;margin:0">Business Hours: Mon-Sat, 9AM-9PM</p>
        </div>

        <p style="color:#9ca3af;font-size:12px;margin-top:30px;text-align:center">
          © ${new Date().getFullYear()} Sri Datta Print Center. All rights reserved.
        </p>
      </div>
    `

    try {
      await sendEmail(email, 'We\'ve Received Your Message - Sri Datta Print Center', customerHtml)
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Continue even if confirmation email fails
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Your message has been sent successfully!',
      hasFiles: uploadedFiles.length > 0
    })

  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json({ 
      ok: false, 
      message: error.message || 'Failed to process your message. Please try again.' 
    }, { status: 500 })
  }
}

