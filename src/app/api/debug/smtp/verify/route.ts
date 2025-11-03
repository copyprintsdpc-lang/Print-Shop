import { NextRequest, NextResponse } from 'next/server'
import { verifyConnection } from '@/lib/mailer'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest) {
  try {
    // Check which SMTP configuration is being used
    const host = process.env.SMTP_HOST ?? process.env.BREVO_SMTP_HOST ?? 'smtp-relay.brevo.com'
    const port = Number(process.env.SMTP_PORT ?? process.env.BREVO_SMTP_PORT ?? 587)
    const secure = process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465'
    const user = process.env.SMTP_USER ?? process.env.BREVO_SMTP_USER
    const pass = process.env.SMTP_PASS ?? process.env.BREVO_SMTP_PASS
    const from = process.env.EMAIL_FROM ?? 'copyprintsdpc@gmail.com'
    const fromName = process.env.EMAIL_FROM_NAME ?? 'Sri Datta Print Center'

    // Check for credentials
    if (!user || !pass) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing SMTP credentials', 
        config: {
          host,
          port,
          secure,
          from: `"${fromName}" <${from}>`,
          haveUser: !!user, 
          havePass: !!pass 
        }
      }, { status: 400 })
    }

    // Test SMTP connection
    const result = await verifyConnection()
    
    if (result.success) {
      return NextResponse.json({ 
        ok: true, 
        message: result.message,
        config: {
          host,
          port,
          secure,
          user,
          from: `"${fromName}" <${from}>`,
        }
      })
    } else {
      return NextResponse.json({ 
        ok: false, 
        error: result.message,
        config: {
          host,
          port,
          secure,
          user,
          from: `"${fromName}" <${from}>`,
        }
      }, { status: 500 })
    }
  } catch (e: any) {
    return NextResponse.json({ 
      ok: false, 
      error: e?.message || 'SMTP verification failed',
      stack: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 })
  }
}


