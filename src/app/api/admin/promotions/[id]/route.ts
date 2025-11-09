import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Promotion from '@/models/Promotion'
import { requireAdminAuth } from '@/lib/adminAuth'
import mongoose from 'mongoose'

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
  } catch (error) {
    console.error('Admin promotion GET error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

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
      startDate,
      endDate,
      applicableProducts,
      applicableCategories,
      minOrderAmount,
      maxDiscountAmount,
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

    // Validate discount type
    if (discountType && !['percentage', 'fixed'].includes(discountType)) {
      return NextResponse.json(
        { ok: false, code: 'bad_request', message: 'Invalid discount type' },
        { status: 400 }
      )
    }

    // Validate discount value
    if (discount !== undefined) {
      if (discountType === 'percentage' && (discount < 0 || discount > 100)) {
        return NextResponse.json(
          { ok: false, code: 'bad_request', message: 'Percentage discount must be between 0 and 100' },
          { status: 400 }
        )
      }
      if (discountType === 'fixed' && discount < 0) {
        return NextResponse.json(
          { ok: false, code: 'bad_request', message: 'Fixed discount must be positive' },
          { status: 400 }
        )
      }
    }

    // Validate dates
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
    const updateData: any = { updatedAt: new Date() }
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (discount !== undefined) updateData.discount = discount
    if (discountType !== undefined) updateData.discountType = discountType
    if (startDate !== undefined) updateData.startDate = new Date(startDate)
    if (endDate !== undefined) updateData.endDate = new Date(endDate)
    if (applicableProducts !== undefined) updateData.applicableProducts = applicableProducts
    if (applicableCategories !== undefined) updateData.applicableCategories = applicableCategories
    if (minOrderAmount !== undefined) updateData.minOrderAmount = minOrderAmount
    if (maxDiscountAmount !== undefined) updateData.maxDiscountAmount = maxDiscountAmount
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit
    if (isActive !== undefined) updateData.isActive = isActive

    const updatedPromotion = await Promotion.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      ok: true,
      promotion: updatedPromotion,
      message: 'Promotion updated successfully'
    })
  } catch (error) {
    console.error('Admin promotion PUT error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

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
  } catch (error) {
    console.error('Admin promotion DELETE error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}