import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

import { connectToDatabase } from '@/lib/db'
import QuoteRequest from '@/models/QuoteRequest'
import { generateSignedCloudFrontUrl, getCloudFrontUrl } from '@/lib/aws'
import { requireAdminAuth } from '@/lib/adminAuth'

export const runtime = 'nodejs'

// GET /api/admin/quotes/[id] - Get single quote by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAdminAuth(req, 'orders.read')
  if (authResult.error) return authResult.error

  try {
    await connectToDatabase()

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: 'Invalid quote ID' },
        { status: 400 }
      )
    }

    const quote = await QuoteRequest.findById(id).lean()

    if (!quote || Array.isArray(quote)) {
      return NextResponse.json(
        { ok: false, message: 'Quote not found' },
        { status: 404 }
      )
    }

    const filesWithSignedUrls = (quote.files || []).map((file: any) => {
      const baseUrl = file.url || (file.key ? getCloudFrontUrl(file.key) : undefined)
      let downloadUrl = baseUrl

      if (file.key) {
        try {
          downloadUrl = generateSignedCloudFrontUrl(file.key, 60 * 60)
        } catch (error) {
          console.warn('Failed to generate signed CloudFront URL for admin download (GET):', error)
        }
      }

      return {
        ...file,
        downloadUrl: downloadUrl || null
      }
    })

    const normalizedId =
      typeof quote._id === 'string'
        ? quote._id
        : typeof quote._id === 'object' && quote._id !== null && 'toString' in quote._id
          ? (quote._id as { toString: () => string }).toString()
          : ''

    return NextResponse.json({
      ok: true,
      quote: {
        ...quote,
        _id: normalizedId,
        files: filesWithSignedUrls
      }
    })

  } catch (error: any) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error.message || 'Failed to fetch quote'
      },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/quotes/[id] - Update quote status and admin notes
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAdminAuth(req, 'orders.update')
  if (authResult.error) return authResult.error

  const { admin } = authResult

  try {
    await connectToDatabase()

    const { id } = params
    const body = await req.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: 'Invalid quote ID' },
        { status: 400 }
      )
    }

    const quote = await QuoteRequest.findById(id)

    if (!quote) {
      return NextResponse.json(
        { ok: false, message: 'Quote not found' },
        { status: 404 }
      )
    }

    // Update fields
    const updateData: any = {}
    
    if (body.status && ['new', 'reviewed', 'replied', 'completed'].includes(body.status)) {
      updateData.status = body.status
      
      // Add audit trail entry for status change
      const auditEntry = {
        action: `Status changed to ${body.status}`,
        performedBy: body.performedBy || admin?.email || 'admin',
        timestamp: new Date(),
        notes: body.notes || undefined
      }
      
      if (!quote.auditTrail) {
        quote.auditTrail = []
      }
      quote.auditTrail.push(auditEntry)
    }

    if (body.deliveryStatus && ['pending', 'completed'].includes(body.deliveryStatus)) {
      updateData.deliveryStatus = body.deliveryStatus
    }

    if (body.deliveryStatus && ['pending', 'completed'].includes(body.deliveryStatus)) {
      updateData.deliveryStatus = body.deliveryStatus
    }

    if (body.adminNotes !== undefined) {
      updateData.adminNotes = body.adminNotes
    }

    if (body.quotedAmount !== undefined) {
      const parsedAmount = Number(body.quotedAmount)
      if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
        return NextResponse.json(
          { ok: false, message: 'Quoted amount must be a positive number' },
          { status: 400 }
        )
      }
      updateData.quotedAmount = parsedAmount
      updateData.quotedAt = new Date()

      const auditEntry = {
        action: 'Quote amount updated',
        performedBy: admin?.email || 'admin',
        timestamp: new Date(),
        notes: body.notes || `Quoted amount set to ${parsedAmount}`,
      }

      if (!quote.auditTrail) {
        quote.auditTrail = []
      }
      quote.auditTrail.push(auditEntry)
    }

    // Update the quote
    Object.assign(quote, updateData)
    await quote.save()

    const quoteObject = quote.toObject()
    const filesWithSignedUrls = (quoteObject.files || []).map((file: any) => {
      const baseUrl = file.url || (file.key ? getCloudFrontUrl(file.key) : undefined)
      let downloadUrl = baseUrl

      if (file.key) {
        try {
          downloadUrl = generateSignedCloudFrontUrl(file.key, 60 * 60)
        } catch (error) {
          console.warn('Failed to generate signed CloudFront URL for admin download (PATCH):', error)
        }
      }

      return {
        ...file,
        downloadUrl: downloadUrl || null
      }
    })

    const normalizedId =
      typeof quoteObject._id === 'string'
        ? quoteObject._id
        : typeof quoteObject._id === 'object' && quoteObject._id !== null && 'toString' in quoteObject._id
          ? (quoteObject._id as { toString: () => string }).toString()
          : quote._id.toString()

    return NextResponse.json({
      ok: true,
      message: 'Quote updated successfully',
      quote: {
        ...quoteObject,
        _id: normalizedId,
        files: filesWithSignedUrls
      }
    })

  } catch (error: any) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      {
        ok: false,
        message: error.message || 'Failed to update quote'
      },
      { status: 500 }
    )
  }
}

