'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Percent, 
  Save, 
  ArrowLeft, 
  Calendar,
  Tag,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle
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

export default function EditPromotionPage() {
  const router = useRouter()
  const params = useParams()
  const promotionId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const categories = [
    'documents',
    'business-cards',
    'posters-banners',
    'stickers-labels',
    'stationery',
    'custom'
  ]

  useEffect(() => {
    if (promotionId) {
      fetchPromotion()
    }
  }, [promotionId])

  const fetchPromotion = async () => {
    try {
      setFetching(true)
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
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promotion) return

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`/api/admin/promotions/${promotionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promotion),
      })

      const data = await response.json()

      if (data.ok) {
        setMessage('Promotion updated successfully!')
        setTimeout(() => {
          router.push('/admin/promotions')
        }, 1500)
      } else {
        setError(data.message || 'Failed to update promotion')
      }
    } catch (error) {
      console.error('Error updating promotion:', error)
      setError('Error updating promotion')
    } finally {
      setLoading(false)
    }
  }

  const updatePromotion = (field: keyof Promotion, value: any) => {
    if (promotion) {
      setPromotion({ ...promotion, [field]: value })
    }
  }

  const addCategory = (category: string) => {
    if (promotion && !promotion.applicableCategories.includes(category)) {
      updatePromotion('applicableCategories', [...promotion.applicableCategories, category])
    }
  }

  const removeCategory = (category: string) => {
    if (promotion) {
      updatePromotion('applicableCategories', promotion.applicableCategories.filter(c => c !== category))
    }
  }

  if (fetching) {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push('/admin/promotions')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Promotions
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Promotion</h1>
          <p className="text-gray-600 mt-2">Update promotion details and settings</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-800">{message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Title *
                </label>
                <input
                  type="text"
                  value={promotion.title}
                  onChange={(e) => updatePromotion('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={promotion.description}
                  onChange={(e) => updatePromotion('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Discount Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Discount Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type *
                </label>
                <select
                  value={promotion.discountType}
                  onChange={(e) => updatePromotion('discountType', e.target.value as 'percentage' | 'fixed')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {promotion.discountType === 'percentage' ? (
                      <Percent className="w-5 h-5 text-gray-400" />
                    ) : (
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="number"
                    min="0"
                    step={promotion.discountType === 'percentage' ? '0.01' : '0.01'}
                    max={promotion.discountType === 'percentage' ? '100' : undefined}
                    value={promotion.discount}
                    onChange={(e) => updatePromotion('discount', parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={promotion.minOrderAmount || ''}
                    onChange={(e) => updatePromotion('minOrderAmount', parseFloat(e.target.value) || undefined)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Discount Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={promotion.maxDiscountAmount || ''}
                    onChange={(e) => updatePromotion('maxDiscountAmount', parseFloat(e.target.value) || undefined)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Validity Period */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Validity Period</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    value={new Date(promotion.startDate).toISOString().slice(0, 16)}
                    onChange={(e) => updatePromotion('startDate', new Date(e.target.value).toISOString())}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    value={new Date(promotion.endDate).toISOString().slice(0, 16)}
                    onChange={(e) => updatePromotion('endDate', new Date(e.target.value).toISOString())}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Applicable Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Applicable Categories</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => addCategory(category)}
                    disabled={promotion.applicableCategories.includes(category)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      promotion.applicableCategories.includes(category)
                        ? 'bg-blue-100 text-blue-800 border-blue-300 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {promotion.applicableCategories.map(category => (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Limits</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Limit
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={promotion.usageLimit || ''}
                    onChange={(e) => updatePromotion('usageLimit', parseInt(e.target.value) || undefined)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited usage</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Usage
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                  <span className="text-sm text-gray-900">{promotion.usedCount} / {promotion.usageLimit || '∞'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Status</h2>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={promotion.isActive}
                onChange={(e) => updatePromotion('isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active Promotion
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/promotions')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Promotion
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
