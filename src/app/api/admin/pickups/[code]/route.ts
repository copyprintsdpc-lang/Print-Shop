import { NextRequest, NextResponse } from 'next/server'

import { requireAdminAuth } from '@/lib/adminAuth'
import { connectToDatabase } from '@/lib/db'
import PickupRequest from '@/models/PickupRequest'
import { generateSignedCloudFrontUrl, getCloudFrontUrl, generatePresignedDownloadUrl } from '@/lib/aws'

export const runtime = 'nodejs'

async function buildDownloadUrl(key: string) {
  try {
    return generateSignedCloudFrontUrl(key, 60 * 60)
  } catch (error) {
    console.warn('Failed to generate CloudFront signed URL for pickup download, falling back to S3 presign.', error)
    const presigned = await generatePresignedDownloadUrl(key, 60 * 60)
    return presigned.downloadUrl
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const authResult = await requireAdminAuth(req, 'orders.read')
  if (authResult.error) return authResult.error

  try {
    await connectToDatabase()

    const { code } = params
    const pickup = await PickupRequest.findOne({ pickupCode: code }).lean()

    if (!pickup || Array.isArray(pickup)) {
      return NextResponse.json(
        { ok: false, message: 'Pickup code not found.' },
        { status: 404 }
      )
    }

    const files = await Promise.all(
      pickup.files.map(async (file: any) => {
        const downloadUrl = await buildDownloadUrl(file.key)
        return {
          ...file,
          downloadUrl,
          url: file.url || getCloudFrontUrl(file.key),
        }
      })
    )

    return NextResponse.json({
      ok: true,
      pickup: {
        pickupCode: pickup.pickupCode,
        customer: pickup.customer,
        status: pickup.status,
        files,
        createdAt: pickup.createdAt,
        updatedAt: pickup.updatedAt,
      },
    })
  } catch (error: any) {
    console.error('Admin pickup fetch error:', error)
    return NextResponse.json(
      { ok: false, message: error.message || 'Failed to load pickup request' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const authResult = await requireAdminAuth(req, 'orders.update')
  if (authResult.error) return authResult.error

  try {
    await connectToDatabase()

    const { code } = params
    const body = await req.json()
    const { status } = body || {}

    if (!['new', 'printed', 'collected'].includes(status)) {
      return NextResponse.json(
        { ok: false, message: 'Invalid status update.' },
        { status: 400 }
      )
    }

    const pickup = await PickupRequest.findOneAndUpdate(
      { pickupCode: code },
      { status },
      { new: true }
    ).lean()

    if (!pickup || Array.isArray(pickup)) {
      return NextResponse.json(
        { ok: false, message: 'Pickup code not found.' },
        { status: 404 }
      )
    }

    const files = await Promise.all(
      pickup.files.map(async (file: any) => {
        const downloadUrl = await buildDownloadUrl(file.key)
        return {
          ...file,
          downloadUrl,
          url: file.url || getCloudFrontUrl(file.key),
        }
      })
    )

    return NextResponse.json({
      ok: true,
      pickup: {
        pickupCode: pickup.pickupCode,
        customer: pickup.customer,
        status: pickup.status,
        files,
        createdAt: pickup.createdAt,
        updatedAt: pickup.updatedAt,
      },
    })
  } catch (error: any) {
    console.error('Admin pickup update error:', error)
    return NextResponse.json(
      { ok: false, message: error.message || 'Failed to update pickup request' },
      { status: 500 }
    )
  }
}

