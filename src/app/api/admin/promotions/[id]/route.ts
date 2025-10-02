import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Promotion from '@/models/Promotion'
import { requireAdminAuth } from '@/lib/adminAuth'
import mongoose from 'mongoose'

export const runtime = 'nodejs'

// GET /api/admin/promotions/[id] - Get single promotion
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'promotions.read')
    if (error) return error

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Invalid promotion ID' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const promotion = await Promotion.findById(params.id)
      .populate('applicableProducts', 'name')
    
    if (!promotion) {
      return NextResponse.json(
        { ok: false, code: 'not_found', message: 'Promotion not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ok: true,
      promotion
    })
  } catch (err) {
    console.error('Admin promotion GET error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/promotions/[id] - Update promotion
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'promotions.update')
    if (error) return error

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Invalid promotion ID' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      discount,
      discountType,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      applicableProducts,
      applicableCategories,
      usageLimit,
      isActive
    } = body

    await connectToDatabase()

    const promotion = await Promotion.findById(params.id)
    if (!promotion) {
      return NextResponse.json(
        { ok: false, code: 'not_found', message: 'Promotion not found' },
        { status: 404 }
      )
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (start >= end) {
        return NextResponse.json(
          { ok: false, code: 'bad_request', message: 'End date must be after start date' },
          { status: 400 }
        )
      }
    }

    // Update fields
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (discount !== undefined) updateData.discount = discount
    if (discountType !== undefined) updateData.discountType = discountType
    if (minOrderAmount !== undefined) updateData.minOrderAmount = minOrderAmount
    if (maxDiscountAmount !== undefined) updateData.maxDiscountAmount = maxDiscountAmount
    if (startDate !== undefined) updateData.startDate = new Date(startDate)
    if (endDate !== undefined) updateData.endDate = new Date(endDate)
    if (applicableProducts !== undefined) updateData.applicableProducts = applicableProducts
    if (applicableCategories !== undefined) updateData.applicableCategories = applicableCategories
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit
    if (isActive !== undefined) updateData.isActive = isActive

    const updatedPromotion = await Promotion.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('applicableProducts', 'name')

    return NextResponse.json({
      ok: true,
      promotion: updatedPromotion,
      message: 'Promotion updated successfully'
    })
  } catch (err) {
    console.error('Admin promotion PUT error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/promotions/[id] - Delete promotion
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'promotions.delete')
    if (error) return error

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Invalid promotion ID' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const promotion = await Promotion.findById(params.id)
    if (!promotion) {
      return NextResponse.json(
        { ok: false, code: 'not_found', message: 'Promotion not found' },
        { status: 404 }
      )
    }

    await Promotion.findByIdAndDelete(params.id)

    return NextResponse.json({
      ok: true,
      message: 'Promotion deleted successfully'
    })
  } catch (err) {
    console.error('Admin promotion DELETE error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

