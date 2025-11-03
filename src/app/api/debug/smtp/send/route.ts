import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mailer'

export const runtime = 'nodejs'

// Send test email via GET (query params)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const to = searchParams.get('to')
    
    if (!to) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing "to" parameter',
        usage: 'GET /api/debug/smtp/send?to=email@example.com'
      }, { status: 400 })
    }

    const from = process.env.EMAIL_FROM ?? 'copyprintsdpc@gmail.com'
    const fromName = process.env.EMAIL_FROM_NAME ?? 'Sri Datta Print Center'
    
    const html = `
      <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto">
        <h2>✅ SMTP Test Successful!</h2>
        <p>This is a test email from <strong>${fromName}</strong>.</p>
        <p>If you're reading this, your SMTP configuration is working correctly.</p>
        <hr style="margin:20px 0;border:none;border-top:1px solid #ccc">
        <p style="color:#666;font-size:12px">
          From: ${from}<br>
          Sent: ${new Date().toLocaleString()}<br>
          Environment: ${process.env.NODE_ENV || 'development'}
        </p>
      </div>
    `
    
    await sendEmail(to, 'SMTP Test - Sri Datta Print Center', html)
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Test email sent successfully',
      to,
      from: `"${fromName}" <${from}>`,
      timestamp: new Date().toISOString()
    })
  } catch (e: any) {
    return NextResponse.json({ 
      ok: false, 
      error: e?.message || 'Failed to send email',
      stack: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 })
  }
}

// Send test email via POST (JSON body)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { to, subject, text, html } = body
    
    if (!to) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing "to" field in request body',
        usage: {
          method: 'POST',
          url: '/api/debug/smtp/send',
          body: {
            to: 'email@example.com',
            subject: 'Optional subject',
            text: 'Optional plain text',
            html: 'Optional HTML content'
          }
        }
      }, { status: 400 })
    }

    const from = process.env.EMAIL_FROM ?? 'copyprintsdpc@gmail.com'
    const fromName = process.env.EMAIL_FROM_NAME ?? 'Sri Datta Print Center'
    
    const emailSubject = subject || 'SMTP Test - Sri Datta Print Center'
    const emailHtml = html || `
      <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto">
        <h2>✅ SMTP Test Successful!</h2>
        <p>${text || 'This is a test email from <strong>' + fromName + '</strong>.'}</p>
        <p>If you're reading this, your SMTP configuration is working correctly.</p>
        <hr style="margin:20px 0;border:none;border-top:1px solid #ccc">
        <p style="color:#666;font-size:12px">
          From: ${from}<br>
          Sent: ${new Date().toLocaleString()}<br>
          Environment: ${process.env.NODE_ENV || 'development'}
        </p>
      </div>
    `
    
    await sendEmail(to, emailSubject, emailHtml)
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Test email sent successfully',
      to,
      subject: emailSubject,
      from: `"${fromName}" <${from}>`,
      timestamp: new Date().toISOString()
    })
  } catch (e: any) {
    return NextResponse.json({ 
      ok: false, 
      error: e?.message || 'Failed to send email',
      stack: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 })
  }
}


