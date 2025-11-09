import { NextRequest, NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import Service from '@/models/Service'
import { requireAdminAuth } from '@/lib/adminAuth'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req, 'products.read')
  if (authResult.error) return authResult.error

  try {
    await connectToDatabase()

    const services = await Service.find().sort({ title: 1 }).lean()

    return NextResponse.json({
      ok: true,
      services: services.map((service: any) => {
        const normalizedId =
          typeof service._id === 'string'
            ? service._id
            : typeof service._id === 'object' && service._id !== null && 'toString' in service._id
              ? (service._id as { toString: () => string }).toString()
              : ''
        return {
          ...service,
          _id: normalizedId,
        }
      }),
    })
  } catch (error: any) {
    console.error('Failed to load services:', error)
    return NextResponse.json(
      { ok: false, message: error.message || 'Failed to load services' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req, 'products.update')
  if (authResult.error) return authResult.error

  const { admin } = authResult

  try {
    await connectToDatabase()

    const body = await req.json()
    const { title, description, priceRange, isActive = true } = body || {}

    if (!title || !title.trim()) {
      return NextResponse.json(
        { ok: false, message: 'Title is required' },
        { status: 400 }
      )
    }

    const existing = await Service.findOne({ title: title.trim() })
    if (existing) {
      return NextResponse.json(
        { ok: false, message: 'Service with this title already exists' },
        { status: 409 }
      )
    }

    const service = await Service.create({
      title: title.trim(),
      description: description?.trim() || undefined,
      priceRange: priceRange?.trim() || undefined,
      isActive: Boolean(isActive),
      updatedBy: admin?.email,
    })

    return NextResponse.json({
      ok: true,
      service: {
        ...service.toObject(),
        _id: service._id.toString(),
      },
      message: 'Service created successfully',
    })
  } catch (error: any) {
    console.error('Failed to create service:', error)
    return NextResponse.json(
      { ok: false, message: error.message || 'Failed to create service' },
      { status: 500 }
    )
  }
}

