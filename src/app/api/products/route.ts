import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Product from '@/models/Product'
import Promotion from '@/models/Promotion'

export const runtime = 'nodejs'

// GET /api/products - Get products for customer storefront
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'createdAt'

    await connectToDatabase()

    // Build query
    const query: any = { active: true }
    if (category) query.category = category
    if (featured === 'true') query.featured = true
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { metaTitle: { $regex: search, $options: 'i' } },
        { metaDescription: { $regex: search, $options: 'i' } }
      ]
    }

    // Build sort object
    let sortObj: any = {}
    switch (sort) {
      case 'name':
        sortObj = { name: 1 }
        break
      case 'price-low':
        sortObj = { basePrice: 1 }
        break
      case 'price-high':
        sortObj = { basePrice: -1 }
        break
      case 'newest':
      default:
        sortObj = { createdAt: -1 }
        break
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      Product.find(query)
        .select('-__v -updatedAt')
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ])

    // Get active promotions
    const now = new Date()
    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).lean()

    // Apply promotions to products
    const productsWithPromotions = products.map(product => {
      const applicablePromotions = promotions.filter(promo => 
        promo.applicableProducts.includes(product._id) ||
        promo.applicableCategories.includes(product.category)
      )

      if (applicablePromotions.length > 0) {
        const bestPromo = applicablePromotions.reduce((best, current) => 
          current.discount > best.discount ? current : best
        )
        
        let discountAmount = 0
        if (bestPromo.discountType === 'percentage') {
          discountAmount = (product.basePrice * bestPromo.discount) / 100
        } else {
          discountAmount = bestPromo.discount
        }

        return {
          ...product,
          promotion: {
            title: bestPromo.title,
            discount: bestPromo.discount,
            discountType: bestPromo.discountType,
            originalPrice: product.basePrice,
            discountedPrice: Math.max(0, product.basePrice - discountAmount)
          }
        }
      }

      return product
    })

    return NextResponse.json({
      ok: true,
      products: productsWithPromotions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        categories: await Product.distinct('category', { active: true }),
        priceRange: await Product.aggregate([
          { $match: { active: true } },
          { $group: { _id: null, min: { $min: '$basePrice' }, max: { $max: '$basePrice' } } }
        ])
      }
    })
  } catch (err) {
    console.error('Products GET error:', err)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

