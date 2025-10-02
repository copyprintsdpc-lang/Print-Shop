import { NextRequest, NextResponse } from 'next/server'
import { transporter } from '@/lib/mailer'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest) {
  try {
    const host = process.env.BREVO_SMTP_HOST ?? 'smtp-relay.brevo.com'
    const port = Number(process.env.BREVO_SMTP_PORT ?? 587)
    const user = process.env.BREVO_SMTP_USER
    const pass = process.env.BREVO_SMTP_PASS

    if (!user || !pass) {
      return NextResponse.json({ ok: false, error: 'Missing SMTP creds', host, port, haveUser: !!user, havePass: !!pass }, { status: 400 })
    }

    const verified = await transporter.verify()
    return NextResponse.json({ ok: true, verified, host, port })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'SMTP verify failed' }, { status: 500 })
  }
}


