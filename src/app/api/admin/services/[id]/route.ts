import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

import { connectToDatabase } from '@/lib/db'
import Service from '@/models/Service'
import { requireAdminAuth } from '@/lib/adminAuth'

export const runtime = 'nodejs'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAdminAuth(req, 'products.update')
  if (authResult.error) return authResult.error

  const { admin } = authResult

  try {
    await connectToDatabase()

    const { id } = params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, message: 'Invalid service ID' }, { status: 400 })
    }

    const body = await req.json()
    const { title, description, priceRange, isActive } = body || {}

    const update: Record<string, any> = {}

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return NextResponse.json(
          { ok: false, message: 'Title cannot be empty' },
          { status: 400 }
        )
      }
      update.title = title.trim()
      update.slug = title
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    if (description !== undefined) {
      update.description = description?.trim() || undefined
    }

    if (priceRange !== undefined) {
      update.priceRange = priceRange?.trim() || undefined
    }

    if (isActive !== undefined) {
      update.isActive = Boolean(isActive)
    }

    if (admin?.email) {
      update.updatedBy = admin.email
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    )

    if (!service) {
      return NextResponse.json(
        { ok: false, message: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ok: true,
      service: {
        ...service.toObject(),
        _id: service._id.toString(),
      },
      message: 'Service updated successfully',
    })
  } catch (error: any) {
    console.error('Failed to update service:', error)
    return NextResponse.json(
      { ok: false, message: error.message || 'Failed to update service' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAdminAuth(req, 'products.update')
  if (authResult.error) return authResult.error

  try {
    await connectToDatabase()

    const { id } = params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, message: 'Invalid service ID' }, { status: 400 })
    }

    const result = await Service.findByIdAndDelete(id)

    if (!result) {
      return NextResponse.json(
        { ok: false, message: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: 'Service removed successfully',
    })
  } catch (error: any) {
    console.error('Failed to delete service:', error)
    return NextResponse.json(
      { ok: false, message: error.message || 'Failed to delete service' },
      { status: 500 }
    )
  }
}

