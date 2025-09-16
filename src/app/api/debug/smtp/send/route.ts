import { NextRequest, NextResponse } from 'next/server'
import { transporter } from '@/lib/mailer'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const to = searchParams.get('to')
    if (!to) return NextResponse.json({ ok: false, error: 'Missing to param' }, { status: 400 })

    const from = process.env.EMAIL_FROM ?? 'copyprintsdpc@gmail.com'
    const info = await transporter.sendMail({
      from,
      to,
      subject: 'SMTP test - Sri Datta Print Center',
      text: 'This is a simple test message from the debug endpoint.',
    })
    return NextResponse.json({ ok: true, messageId: info.messageId, response: info.response, envelope: info.envelope })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'send failed' }, { status: 500 })
  }
}


