import { NextRequest, NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import PickupRequest from '@/models/PickupRequest'
import { generatePickupCode } from '@/lib/pickup'
import { generateSignedCloudFrontUrl, getCloudFrontUrl, generatePresignedDownloadUrl } from '@/lib/aws'
import { notifyPrintCentre, notifyCustomer } from '@/lib/notifications'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const body = await req.json()
    const { contact, files } = body || {}

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { ok: false, message: 'Please attach at least one uploaded file.' },
        { status: 400 }
      )
    }

    if (!contact || (!contact.phone && !contact.email)) {
      return NextResponse.json(
        { ok: false, message: 'Please provide a phone number or an email address.' },
        { status: 400 }
      )
    }

    const normalizedFiles = files.map((file: any) => {
      if (!file.key || !file.name) {
        throw new Error('Uploaded file is missing required properties.')
      }

      return {
        key: file.key,
        url: file.url || undefined,
        name: file.name,
        size: file.size || undefined,
        colorMode: file.colorMode === 'grayscale' ? 'grayscale' : 'color',
        paperSize: file.paperSize || 'A4 (8.3" × 11.7")',
        copies: Math.max(1, parseInt(file.copies, 10) || 1),
      }
    })

    let pickupCode = generatePickupCode()
    let attempts = 0
    while (attempts < 5) {
      const exists = await PickupRequest.exists({ pickupCode })
      if (!exists) break
      pickupCode = generatePickupCode()
      attempts += 1
    }

    const pickupRequest = await PickupRequest.create({
      pickupCode,
      customer: {
        phone: contact.phone || undefined,
        email: contact.email || undefined,
      },
      files: normalizedFiles,
    })

    const pickupUrlBase = process.env.APP_URL || 'http://localhost:3000'
    const qrData = `${pickupUrlBase.replace(/\/$/, '')}/pickup/${pickupCode}`

    const pickupFilesWithUrls = await Promise.all(normalizedFiles.map(async (file) => {
      let downloadUrl: string
      try {
        downloadUrl = generateSignedCloudFrontUrl(file.key, 60 * 60)
      } catch (error) {
        console.warn('Failed to generate CloudFront URL for pickup notification, trying S3 presign.', error)
        const presigned = await generatePresignedDownloadUrl(file.key, 60 * 60)
        downloadUrl = presigned.downloadUrl
      }

      return {
        name: file.name,
        copies: file.copies,
        colorMode: file.colorMode,
        paperSize: file.paperSize,
        url: file.url || getCloudFrontUrl(file.key),
        downloadUrl,
      }
    }))

    const fileDetails = pickupFilesWithUrls.map(file =>
      `${file.name} (${file.copies} copies, ${file.colorMode === 'grayscale' ? 'B/W' : 'Colour'}, ${file.paperSize || 'A4'})`
    ).join(', ')

    // Send notifications (non-blocking but awaited for completion)
    await Promise.all([
      notifyPrintCentre('pickup', {
        pickupCode,
        customerPhone: contact.phone,
        customerEmail: contact.email,
        pickupFiles: pickupFilesWithUrls,
        fileDetails,
        pickupUrl: qrData,
        qrData,
      }),
      notifyCustomer('pickup', {
        pickupCode,
        customerPhone: contact.phone,
        customerEmail: contact.email,
        pickupFiles: pickupFilesWithUrls,
        pickupUrl: qrData,
        qrData,
      }),
    ])

    return NextResponse.json(
      {
        ok: true,
        pickupCode,
        qrData,
        createdAt: pickupRequest.createdAt,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Pickup request error:', error)
    return NextResponse.json(
      { ok: false, message: error.message || 'Failed to create pickup request' },
      { status: 500 }
    )
  }
}

