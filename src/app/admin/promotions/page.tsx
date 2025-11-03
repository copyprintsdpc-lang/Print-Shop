'use client'

import { useState, useEffect } from 'react'
import { 
  Percent, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Calendar,
  Tag,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface Promotion {
  _id: string
  title: string
  description?: string
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

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/admin/promotions')
      const data = await response.json()
      
      if (data.ok) {
        setPromotions(data.promotions)
      } else {
        console.error('Failed to fetch promotions:', data.message)
      }
    } catch (error) {
      console.error('Error fetching promotions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (promotionId: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return

    try {
      const response = await fetch(`/api/admin/promotions/${promotionId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.ok) {
        setPromotions(promotions.filter(p => p._id !== promotionId))
      } else {
        alert('Failed to delete promotion: ' + data.message)
      }
    } catch (error) {
      console.error('Error deleting promotion:', error)
      alert('Error deleting promotion')
    }
  }

  const togglePromotionStatus = async (promotionId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/promotions/${promotionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      const data = await response.json()
      
      if (data.ok) {
        setPromotions(promotions.map(p => 
          p._id === promotionId ? { ...p, isActive: !currentStatus } : p
        ))
      } else {
        alert('Failed to update promotion status: ' + data.message)
      }
    } catch (error) {
      console.error('Error updating promotion status:', error)
      alert('Error updating promotion status')
    }
  }

  const getPromotionStatus = (promotion: Promotion) => {
    const now = new Date()
    const startDate = new Date(promotion.startDate)
    const endDate = new Date(promotion.endDate)
    
    if (!promotion.isActive) return 'inactive'
    if (now < startDate) return 'scheduled'
    if (now > endDate) return 'expired'
    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) return 'limit_reached'
    return 'active'
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle }
      case 'scheduled':
        return { label: 'Scheduled', color: 'bg-blue-100 text-blue-800', icon: Clock }
      case 'expired':
        return { label: 'Expired', color: 'bg-gray-100 text-gray-800', icon: XCircle }
      case 'inactive':
        return { label: 'Inactive', color: 'bg-red-100 text-red-800', icon: XCircle }
      case 'limit_reached':
        return { label: 'Limit Reached', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: Clock }
    }
  }

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = 
      promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (promotion.description && promotion.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const status = getPromotionStatus(promotion)
    const matchesStatus = !statusFilter || status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const statusOptions = ['active', 'scheduled', 'expired', 'inactive', 'limit_reached']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading promotions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
              <p className="text-gray-600 mt-2">Manage discounts and special offers</p>
            </div>
            <button
              onClick={() => window.location.href = '/admin/promotions/new'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Promotion
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search promotions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {getStatusConfig(status).label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Promotions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promotion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPromotions.map((promotion) => {
                  const status = getPromotionStatus(promotion)
                  const statusInfo = getStatusConfig(status)
                  const StatusIcon = statusInfo.icon
                  
                  return (
                    <tr key={promotion._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {promotion.title}
                          </div>
                          {promotion.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {promotion.description}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {promotion.discountType === 'percentage' 
                            ? `${promotion.discount}% off`
                            : `₹${promotion.discount} off`
                          }
                        </div>
                        {promotion.minOrderAmount && (
                          <div className="text-sm text-gray-500">
                            Min order: ₹{promotion.minOrderAmount}
                          </div>
                        )}
                        {promotion.maxDiscountAmount && (
                          <div className="text-sm text-gray-500">
                            Max discount: ₹{promotion.maxDiscountAmount}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <div>
                            <div>{new Date(promotion.startDate).toLocaleDateString()}</div>
                            <div className="text-gray-500">to</div>
                            <div>{new Date(promotion.endDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {promotion.usedCount}
                          {promotion.usageLimit ? ` / ${promotion.usageLimit}` : ''} uses
                        </div>
                        {promotion.usageLimit && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(100, (promotion.usedCount / promotion.usageLimit) * 100)}%` }}
                            ></div>
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(promotion.createdAt).toLocaleDateString()}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedPromotion(promotion)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.location.href = `/admin/promotions/${promotion._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit Promotion"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => togglePromotionStatus(promotion._id, promotion.isActive)}
                            className={promotion.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                            title={promotion.isActive ? "Deactivate" : "Activate"}
                          >
                            {promotion.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(promotion._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Promotion"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredPromotions.length === 0 && (
            <div className="text-center py-12">
              <Percent className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No promotions found</h3>
              <p className="text-gray-500 mb-4">
                {promotions.length === 0 
                  ? "Create your first promotion to attract customers."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {promotions.length === 0 && (
                <button
                  onClick={() => window.location.href = '/admin/promotions/new'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Promotion
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Percent className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Promotions</p>
                <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Promotions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promotions.filter(p => getPromotionStatus(p) === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Scheduled Promotions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promotions.filter(p => getPromotionStatus(p) === 'scheduled').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Uses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promotions.reduce((total, p) => total + p.usedCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Details Modal */}
      {selectedPromotion && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Promotion Details</h3>
              <button
                onClick={() => setSelectedPromotion(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Promotion Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Title:</span> {selectedPromotion.title}</p>
                  {selectedPromotion.description && (
                    <p><span className="font-medium">Description:</span> {selectedPromotion.description}</p>
                  )}
                  <p><span className="font-medium">Discount:</span> 
                    {selectedPromotion.discountType === 'percentage' 
                      ? ` ${selectedPromotion.discount}% off`
                      : ` ₹${selectedPromotion.discount} off`
                    }
                  </p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusConfig(getPromotionStatus(selectedPromotion)).color
                    }`}>
                      {getStatusConfig(getPromotionStatus(selectedPromotion)).label}
                    </span>
                  </p>
                </div>
              </div>

              {/* Period */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Promotion Period</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Start Date:</span> {new Date(selectedPromotion.startDate).toLocaleString()}</p>
                  <p><span className="font-medium">End Date:</span> {new Date(selectedPromotion.endDate).toLocaleString()}</p>
                </div>
              </div>

              {/* Conditions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Conditions</h4>
                <div className="space-y-1 text-sm">
                  {selectedPromotion.minOrderAmount && (
                    <p><span className="font-medium">Minimum Order:</span> ₹{selectedPromotion.minOrderAmount}</p>
                  )}
                  {selectedPromotion.maxDiscountAmount && (
                    <p><span className="font-medium">Maximum Discount:</span> ₹{selectedPromotion.maxDiscountAmount}</p>
                  )}
                  {selectedPromotion.usageLimit && (
                    <p><span className="font-medium">Usage Limit:</span> {selectedPromotion.usageLimit} uses</p>
                  )}
                </div>
              </div>

              {/* Usage Stats */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Usage Statistics</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Used:</span> {selectedPromotion.usedCount} times</p>
                  {selectedPromotion.usageLimit && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Usage Progress</span>
                        <span>{Math.round((selectedPromotion.usedCount / selectedPromotion.usageLimit) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (selectedPromotion.usedCount / selectedPromotion.usageLimit) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Applicable Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Applicable Items</h4>
                <div className="space-y-2 text-sm">
                  {selectedPromotion.applicableProducts.length > 0 && (
                    <div>
                      <p className="font-medium">Specific Products:</p>
                      <p className="text-gray-600">{selectedPromotion.applicableProducts.length} product(s)</p>
                    </div>
                  )}
                  {selectedPromotion.applicableCategories.length > 0 && (
                    <div>
                      <p className="font-medium">Categories:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedPromotion.applicableCategories.map((category, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => setSelectedPromotion(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.location.href = `/admin/promotions/${selectedPromotion._id}/edit`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Promotion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
