import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Product from '@/models/Product'
import Order from '@/models/Order'
import User from '@/models/User'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  try {
    const { admin, error } = await requireAdminAuth(req, 'analytics.read')
    if (error) return error

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get overview statistics
    const [totalProducts, totalCustomers, totalOrders, totalRevenue] = await Promise.all([
      Product.countDocuments({ active: true }),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$pricing.grandTotal' } } }
      ])
    ])

    const currentRevenue = totalRevenue[0]?.total || 0

    // Get previous period for growth calculation
    const previousStartDate = new Date(startDate)
    const previousEndDate = new Date(startDate)
    previousStartDate.setDate(previousStartDate.getDate() - (range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365))

    const [previousOrders, previousRevenue] = await Promise.all([
      Order.countDocuments({ 
        createdAt: { $gte: previousStartDate, $lt: previousEndDate } 
      }),
      Order.aggregate([
        { $match: { createdAt: { $gte: previousStartDate, $lt: previousEndDate } } },
        { $group: { _id: null, total: { $sum: '$pricing.grandTotal' } } }
      ])
    ])

    const previousRevenueTotal = previousRevenue[0]?.total || 0

    // Calculate growth percentages
    const revenueGrowth = previousRevenueTotal > 0 
      ? ((currentRevenue - previousRevenueTotal) / previousRevenueTotal) * 100 
      : 0
    
    const ordersGrowth = previousOrders > 0 
      ? ((totalOrders - previousOrders) / previousOrders) * 100 
      : 0

    const customersGrowth = 0 // Would need historical customer data

    // Get revenue by month for the selected range
    const revenueByMonth = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$pricing.grandTotal' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const formattedRevenueByMonth = revenueByMonth.map(item => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: item.revenue
    }))

    // Get top products by revenue
    const topProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productName',
          orders: { $sum: 1 },
          revenue: { $sum: '$items.totalPrice' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ])

    // Get recent orders
    const recentOrders = await Order.find({ createdAt: { $gte: startDate } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customer', 'name email')
      .lean()

    const formattedRecentOrders = recentOrders.map((order: any) => ({
      id: String(order._id),
      customer: order.customer?.name || 'Unknown Customer',
      amount: order.pricing?.grandTotal || 0,
      status: order.status || 'pending',
      date: order.createdAt
    }))

    const analytics = {
      overview: {
        totalRevenue: currentRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        ordersGrowth: Math.round(ordersGrowth * 100) / 100,
        customersGrowth: Math.round(customersGrowth * 100) / 100
      },
      revenueByMonth: formattedRevenueByMonth,
      topProducts: topProducts.map(product => ({
        name: product._id,
        orders: product.orders,
        revenue: product.revenue
      })),
      recentOrders: formattedRecentOrders
    }

    return NextResponse.json({
      ok: true,
      analytics
    })
  } catch (error) {
    console.error('Admin analytics GET error:', error)
    return NextResponse.json(
      { ok: false, code: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
