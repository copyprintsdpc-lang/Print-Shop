import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Product from '@/models/Product'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'products.update')
    if (error) return error

    const body = await req.json()
    const { updates } = body

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { ok: false, code: 'missing_updates', message: 'Updates are required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const updatePromises = updates.map(async (update: any) => {
      const { productId, basePrice, variants } = update

      const updateData: any = {}

      if (basePrice !== undefined) {
        updateData.basePrice = basePrice
      }

      if (variants && variants.length > 0) {
        // Update variant prices
        updateData.$set = {}
        variants.forEach((variant: any) => {
          updateData.$set[`variants.$.price`] = variant.newPrice
        })
      }

      return Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true }
      )
    })

    await Promise.all(updatePromises)

    return NextResponse.json({
      ok: true,
      message: `Updated ${updates.length} products successfully`
    })
  } catch (error) {
    console.error('Bulk pricing update error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}