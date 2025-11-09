'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Percent, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar,
  Tag,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

interface Promotion {
  _id: string
  title: string
  description: string
  discount: number
  discountType: 'percentage' | 'fixed'
  startDate: string
  endDate: string
  applicableProducts: string[]
  applicableCategories: string[]
  minOrderAmount?: number
  maxDiscountAmount?: number
  usageLimit?: number
  usedCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ViewPromotionPage() {
  const router = useRouter()
  const params = useParams()
  const promotionId = params.id as string
  
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (promotionId) {
      fetchPromotion()
    }
  }, [promotionId])

  const fetchPromotion = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/promotions/${promotionId}`)
      const data = await response.json()
      
      if (data.ok) {
        setPromotion(data.promotion)
      } else {
        setError(data.message || 'Failed to fetch promotion')
      }
    } catch (error) {
      console.error('Error fetching promotion:', error)
      setError('Error fetching promotion')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this promotion? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/promotions/${promotionId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.ok) {
        router.push('/admin/promotions')
      } else {
        alert('Failed to delete promotion: ' + data.message)
      }
    } catch (error) {
      console.error('Error deleting promotion:', error)
      alert('Error deleting promotion')
    }
  }

  const getStatusInfo = (promotion: Promotion) => {
    const now = new Date()
    const startDate = new Date(promotion.startDate)
    const endDate = new Date(promotion.endDate)

    if (!promotion.isActive) {
      return { status: 'inactive', color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Inactive' }
    }

    if (now < startDate) {
      return { status: 'upcoming', color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Upcoming' }
    }

    if (now > endDate) {
      return { status: 'expired', color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Expired' }
    }

    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
      return { status: 'limit-reached', color: 'bg-orange-100 text-orange-800', icon: AlertCircle, label: 'Limit Reached' }
    }

    return { status: 'active', color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading promotion...</p>
        </div>
      </div>
    )
  }

  if (!promotion) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error || 'Promotion not found'}</p>
          <button
            onClick={() => router.push('/admin/promotions')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Promotions
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(promotion)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/admin/promotions')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Promotions
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/admin/promotions/${promotionId}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                Edit Promotion
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
          
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Percent className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{promotion.title}</h1>
              <p className="text-gray-600 mb-4">{promotion.description}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full ${statusInfo.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusInfo.label}
                </span>
                
                <span className="text-sm text-gray-500">
                  Created: {new Date(promotion.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Discount Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Discount Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Discount Type</label>
                  <p className="text-lg font-medium text-gray-900 capitalize">{promotion.discountType}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Discount Value</label>
                  <p className="text-lg font-medium text-gray-900">
                    {promotion.discountType === 'percentage' 
                      ? `${promotion.discount}%` 
                      : `₹${promotion.discount.toFixed(2)}`
                    }
                  </p>
                </div>
                
                {promotion.minOrderAmount && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Minimum Order Amount</label>
                    <p className="text-lg font-medium text-gray-900">₹{promotion.minOrderAmount.toFixed(2)}</p>
                  </div>
                )}
                
                {promotion.maxDiscountAmount && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Maximum Discount Amount</label>
                    <p className="text-lg font-medium text-gray-900">₹{promotion.maxDiscountAmount.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Validity Period */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Validity Period</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(promotion.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(promotion.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Applicable Categories */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Applicable Categories</h2>
              
              {promotion.applicableCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {promotion.applicableCategories.map(category => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No categories specified (applies to all products)</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Statistics</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Usage Limit</label>
                  <p className="text-lg font-medium text-gray-900">
                    {promotion.usageLimit ? promotion.usageLimit.toLocaleString() : 'Unlimited'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Times Used</label>
                  <p className="text-lg font-medium text-gray-900">{promotion.usedCount.toLocaleString()}</p>
                </div>
                
                {promotion.usageLimit && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Remaining</label>
                    <p className="text-lg font-medium text-gray-900">
                      {Math.max(0, promotion.usageLimit - promotion.usedCount).toLocaleString()}
                    </p>
                  </div>
                )}
                
                {promotion.usageLimit && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (promotion.usedCount / promotion.usageLimit) * 100)}%` 
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* Promotion Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    promotion.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {promotion.isActive ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Created</label>
                  <p className="text-sm text-gray-900">
                    {new Date(promotion.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
                  <p className="text-sm text-gray-900">
                    {new Date(promotion.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/admin/promotions/${promotionId}/edit`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4" />
                  Edit Promotion
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/promo/${promotionId}`)
                    alert('Promotion link copied to clipboard!')
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <Tag className="w-4 h-4" />
                  Copy Link
                </button>
                
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Promotion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
