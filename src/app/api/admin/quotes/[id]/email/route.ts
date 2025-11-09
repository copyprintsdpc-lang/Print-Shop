import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

import { connectToDatabase } from '@/lib/db'
import QuoteRequest from '@/models/QuoteRequest'
import { requireAdminAuth } from '@/lib/adminAuth'
import { sendEmail } from '@/lib/mailer'

export const runtime = 'nodejs'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAdminAuth(req, 'orders.update')
  if (authResult.error) return authResult.error

  const { admin } = authResult

  try {
    await connectToDatabase()

    const { id } = params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, message: 'Invalid quote ID' }, { status: 400 })
    }

    const quote = await QuoteRequest.findById(id)
    if (!quote) {
      return NextResponse.json({ ok: false, message: 'Quote not found' }, { status: 404 })
    }

    if (!quote.customer?.email) {
      return NextResponse.json(
        { ok: false, message: 'Customer email unavailable for this quote' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const {
      subject,
      message,
      quotedAmount,
      currencySymbol = '₹',
      additionalNotes,
    } = body || {}

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { ok: false, message: 'Email subject is required' },
        { status: 400 }
      )
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { ok: false, message: 'Email message is required' },
        { status: 400 }
      )
    }

    let parsedAmount: number | undefined
    if (quotedAmount !== undefined && quotedAmount !== null && quotedAmount !== '') {
      parsedAmount = Number(quotedAmount)
      if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
        return NextResponse.json(
          { ok: false, message: 'Quoted amount must be a positive number' },
          { status: 400 }
        )
      }
    }

    const filesSummary = quote.files
      .map(
        (file: { name: string; quantity: number; colorMode: 'color' | 'grayscale'; paperSize?: string }) =>
          `${file.name} – ${file.quantity} copies, ${file.colorMode === 'color' ? 'Colour' : 'B/W'}, ${
            file.paperSize
          }`
      )
      .join('<br/>')

    const emailHtml = `
      <div style="font-family:Inter,system-ui,sans-serif;padding:24px;max-width:640px;margin:0 auto;background:#f9fafb;">
        <div style="background:#111827;padding:20px 24px;border-radius:16px 16px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Quote #${quote.quoteNumber}</h1>
          <p style="color:#e5e7eb;margin:6px 0 0 0;font-size:14px;">Sri Datta Print Center</p>
        </div>
        <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;padding:24px;">
          <p style="color:#111827;font-size:15px;line-height:1.6;white-space:pre-line;">${message.trim()}</p>

           ${
             parsedAmount !== undefined
               ? `
                 <div style="margin:24px 0;padding:16px;border-radius:12px;background:#ecfdf5;border:1px solid #86efac;">
                   <p style="margin:0;color:#047857;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;">Estimated Amount</p>
                   <p style="margin:6px 0 0 0;font-size:24px;font-weight:700;color:#065f46;">${currencySymbol}${parsedAmount.toLocaleString(
                     'en-IN',
                     { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                   )}</p>
                 </div>
               `
               : ''
           }

          <div style="margin:24px 0;padding:16px;border-radius:12px;background:#eef2ff;border:1px solid #c7d2fe;">
            <p style="margin:0 0 12px 0;color:#3730a3;font-weight:600;">Files & Specifications</p>
            <p style="margin:0;color:#312e81;font-size:14px;line-height:1.6;">${filesSummary}</p>
            <p style="margin:12px 0 0 0;color:#3730a3;font-size:13px;">Total quantity: <strong>${quote.quantity} copies</strong></p>
          </div>

          ${
            additionalNotes
              ? `<div style="margin:24px 0;padding:16px;border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;">
                  <p style="margin:0 0 8px 0;color:#9a3412;font-weight:600;">Notes</p>
                  <p style="margin:0;color:#7c2d12;font-size:14px;line-height:1.6;">${additionalNotes}</p>
                </div>`
              : ''
          }

          <div style="margin-top:32px;padding:16px;border-radius:12px;background:#f3f4f6;text-align:center;">
            <p style="margin:0;color:#4b5563;font-size:14px;">Questions? Call us at <strong>+91 8897379737</strong></p>
            <p style="margin:6px 0 0 0;color:#6b7280;font-size:12px;">Mon – Sat, 9:00 AM to 9:00 PM</p>
          </div>
        </div>
      </div>
    `

    await sendEmail(quote.customer.email, subject.trim(), emailHtml)

    if (parsedAmount !== undefined) {
      quote.quotedAmount = parsedAmount
      quote.quotedAt = new Date()
    }

    quote.status = 'replied'
    quote.auditTrail = quote.auditTrail || []
    quote.auditTrail.push({
      action: 'Quote emailed to customer',
      performedBy: admin?.email || 'admin',
      timestamp: new Date(),
      notes: parsedAmount !== undefined ? `Quoted ${currencySymbol}${parsedAmount}` : undefined,
    })

    await quote.save()

    return NextResponse.json({
      ok: true,
      message: 'Quote emailed successfully',
      quotedAmount: quote.quotedAmount,
      status: quote.status,
    })
  } catch (error: any) {
    console.error('Failed to email quote:', error)
    return NextResponse.json(
      { ok: false, message: error.message || 'Failed to send quote email' },
      { status: 500 }
    )
  }
}

