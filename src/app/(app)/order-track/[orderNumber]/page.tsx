'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  Search
} from 'lucide-react'
import Link from 'next/link'

interface Order {
  _id: string
  orderNumber: string
  status: string
  customer: {
    name: string
    email: string
    phone: string
    company?: string
  }
  items: Array<{
    productName: string
    variant: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  pricing: {
    subtotal: number
    taxAmount: number
    shippingAmount: number
    discountAmount: number
    grandTotal: number
    currency: string
  }
  delivery: {
    method: string
    address?: {
      line1: string
      line2?: string
      city: string
      state: string
      pincode: string
      country: string
    }
  }
  artwork_files: string[]
  createdAt: string
  updatedAt: string
  estimatedCompletion?: string
  actualCompletion?: string
}

const statusConfig = {
  placed: { 
    label: 'Order Placed', 
    color: 'bg-blue-100 text-blue-800', 
    icon: Package,
    description: 'Your order has been received and is being processed'
  },
  preflight: { 
    label: 'Preflight Check', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: AlertCircle,
    description: 'We\'re reviewing your artwork files'
  },
  proof_ready: { 
    label: 'Proof Ready', 
    color: 'bg-purple-100 text-purple-800', 
    icon: FileText,
    description: 'Your proof is ready for approval'
  },
  approved: { 
    label: 'Approved', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle,
    description: 'Your order has been approved and is ready for production'
  },
  in_production: { 
    label: 'In Production', 
    color: 'bg-orange-100 text-orange-800', 
    icon: Package,
    description: 'Your order is currently being printed'
  },
  ready_for_pickup: { 
    label: 'Ready for Pickup', 
    color: 'bg-indigo-100 text-indigo-800', 
    icon: Truck,
    description: 'Your order is ready for pickup or delivery'
  },
  shipped: { 
    label: 'Shipped', 
    color: 'bg-blue-100 text-blue-800', 
    icon: Truck,
    description: 'Your order has been shipped'
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle,
    description: 'Your order has been completed'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-800', 
    icon: AlertCircle,
    description: 'Your order has been cancelled'
  }
}

export default function OrderTrackPage() {
  const params = useParams()
  const orderNumber = params.orderNumber as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState(orderNumber || '')

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails(orderNumber)
    } else {
      setLoading(false)
    }
  }, [orderNumber])

  const fetchOrderDetails = async (orderNum: string) => {
    try {
      const response = await fetch(`/api/orders/track/${orderNum}`)
      const data = await response.json()
      
      if (data.ok) {
        setOrder(data.order)
        setError(null)
      } else {
        setError(data.message || 'Order not found')
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      setError('Failed to fetch order details')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      fetchOrderDetails(searchInput.trim())
    }
  }

  const getStatusProgress = (status: string) => {
    const statusOrder = [
      'placed', 'preflight', 'proof_ready', 'approved', 
      'in_production', 'ready_for_pickup', 'shipped', 'completed'
    ]
    
    const currentIndex = statusOrder.indexOf(status)
    return currentIndex >= 0 ? currentIndex + 1 : 0
  }

  const getEstimatedDelivery = (createdAt: string, status: string) => {
    const created = new Date(createdAt)
    const estimatedDays = status === 'completed' ? 0 : 
                         status === 'shipped' ? 1 : 
                         status === 'ready_for_pickup' ? 1 :
                         status === 'in_production' ? 2 :
                         status === 'approved' ? 3 :
                         status === 'proof_ready' ? 4 :
                         status === 'preflight' ? 5 : 7
    
    const estimatedDate = new Date(created.getTime() + (estimatedDays * 24 * 60 * 60 * 1000))
    return estimatedDate.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600 mb-6">Enter your order number to track your printing order</p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter order number (e.g., CP241201001)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Track
              </button>
            </div>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Order Not Found</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="space-y-8">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
                  <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${
                  statusConfig[order.status as keyof typeof statusConfig]?.color
                }`}>
                  {(() => {
                    const config = statusConfig[order.status as keyof typeof statusConfig]
                    const IconComponent = config?.icon || Package
                    return (
                      <>
                        <IconComponent className="w-4 h-4" />
                        {config?.label}
                      </>
                    )
                  })()}
                </span>
              </div>

              {/* Status Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Order Progress</span>
                  <span className="text-sm text-gray-500">
                    Step {getStatusProgress(order.status)} of 8
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(getStatusProgress(order.status) / 8) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  {statusConfig[order.status as keyof typeof statusConfig]?.description}
                </p>
                {order.estimatedCompletion && (
                  <p className="text-sm text-gray-600 mt-2">
                    Estimated completion: {new Date(order.estimatedCompletion).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Customer & Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span>{order.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{order.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>{order.customer.phone}</span>
                  </div>
                  {order.customer.company && (
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span>{order.customer.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-400" />
                    <span>
                      {order.delivery.method === 'pickup' ? 'Store Pickup' : 'Courier Delivery'}
                    </span>
                  </div>
                  {order.delivery.method === 'courier' && order.delivery.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="text-sm">
                        <p>{order.delivery.address.line1}</p>
                        {order.delivery.address.line2 && <p>{order.delivery.address.line2}</p>}
                        <p>{order.delivery.address.city}, {order.delivery.address.state}</p>
                        <p>{order.delivery.address.pincode}, {order.delivery.address.country}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">{item.variant}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{item.totalPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.pricing.subtotal.toFixed(2)}</span>
                </div>
                {order.pricing.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{order.pricing.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.pricing.shippingAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{order.pricing.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{order.pricing.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Artwork Files */}
            {order.artwork_files && order.artwork_files.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Artwork Files</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {order.artwork_files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm truncate">{file.split('/').pop()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-gray-600">{getEstimatedDelivery(order.createdAt, order.status)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Need Help?</h3>
              <p className="text-blue-700 mb-4">
                If you have any questions about your order, please contact our support team:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>+91 8897379737</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>support@sridattaprintcentre.com</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Back to Home
              </Link>
              
              <Link
                href="/services"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                Browse Services
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
