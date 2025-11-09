'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Eye, 
  Edit, 
  Download,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

interface Order {
  _id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
    company?: string
  }
  status: string
  payment: {
    method: string
    status: string
    transactionId?: string
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
  artworkFiles: string[]
  notes?: string
  trackingInfo?: {
    courier: string
    trackingNumber: string
    estimatedDelivery: string
  }
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-orange-100 text-orange-800', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle }
}

const paymentStatusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState('')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      
      if (data.ok) {
        setOrders(data.orders)
      } else {
        console.error('Failed to fetch orders:', data.message)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId)
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.ok) {
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        ))
        
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus, updatedAt: new Date().toISOString() })
        }
      } else {
        alert('Failed to update order status: ' + data.message)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error updating order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleBulkStatusUpdate = async () => {
    if (!bulkAction || selectedOrders.length === 0) return

    try {
      const response = await fetch('/api/admin/orders/bulk-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderIds: selectedOrders,
          status: bulkAction
        }),
      })

      const data = await response.json()

      if (data.ok) {
        setOrders(orders.map(order => 
          selectedOrders.includes(order._id)
            ? { ...order, status: bulkAction, updatedAt: new Date().toISOString() }
            : order
        ))
        setSelectedOrders([])
        setBulkAction('')
        setShowBulkActions(false)
        alert(`Updated ${selectedOrders.length} orders successfully!`)
      } else {
        alert('Failed to update orders: ' + data.message)
      }
    } catch (error) {
      console.error('Error updating orders:', error)
      alert('Error updating orders')
    }
  }

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(order => order._id))
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || order.status === statusFilter
    const matchesPaymentStatus = !paymentStatusFilter || order.payment.status === paymentStatusFilter
    
    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  const statusOptions = Object.keys(statusConfig)
  const paymentStatusOptions = Object.keys(paymentStatusConfig)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600 mt-2">Manage and track customer orders</p>
            </div>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Processing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'processing').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {statusConfig[status as keyof typeof statusConfig].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Payment Status</option>
                {paymentStatusOptions.map(status => (
                  <option key={status} value={status}>
                    {paymentStatusConfig[status as keyof typeof paymentStatusConfig].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                  setPaymentStatusFilter('')
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-800">
                  {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Action</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      Update to {statusConfig[status as keyof typeof statusConfig].label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleBulkStatusUpdate}
                  disabled={!bulkAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Apply
                </button>
                <button
                  onClick={() => setSelectedOrders([])}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Orders ({filteredOrders.length})
            </h3>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock
                    const statusColor = statusConfig[order.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'
                    const paymentColor = paymentStatusConfig[order.payment.status as keyof typeof paymentStatusConfig]?.color || 'bg-gray-100 text-gray-800'
                    
                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => handleSelectOrder(order._id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.delivery.method === 'pickup' ? 'Pickup' : 'Delivery'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.pricing.grandTotal.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <StatusIcon className="w-4 h-4 mr-2" />
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                              {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentColor}`}>
                            {paymentStatusConfig[order.payment.status as keyof typeof paymentStatusConfig]?.label || order.payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              disabled={updatingStatus === order._id}
                              className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status}>
                                  {statusConfig[status as keyof typeof statusConfig].label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedOrder(null)}></div>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{selectedOrder.orderNumber}
                    </h3>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Customer Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{selectedOrder.customer.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{selectedOrder.customer.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{selectedOrder.customer.phone}</span>
                        </div>
                        {selectedOrder.customer.company && (
                          <div className="text-sm text-gray-900">
                            Company: {selectedOrder.customer.company}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Information */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Order Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[selectedOrder.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'}`}>
                            {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label || selectedOrder.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Payment:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusConfig[selectedOrder.payment.status as keyof typeof paymentStatusConfig]?.color || 'bg-gray-100 text-gray-800'}`}>
                            {paymentStatusConfig[selectedOrder.payment.status as keyof typeof paymentStatusConfig]?.label || selectedOrder.payment.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Method:</span>
                          <span className="text-sm text-gray-900">{selectedOrder.payment.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Delivery:</span>
                          <span className="text-sm text-gray-900">{selectedOrder.delivery.method}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {selectedOrder.delivery.address && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Delivery Address</h4>
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                          <div className="text-sm text-gray-900">
                            <div>{selectedOrder.delivery.address.line1}</div>
                            {selectedOrder.delivery.address.line2 && (
                              <div>{selectedOrder.delivery.address.line2}</div>
                            )}
                            <div>
                              {selectedOrder.delivery.address.city}, {selectedOrder.delivery.address.state} {selectedOrder.delivery.address.pincode}
                            </div>
                            <div>{selectedOrder.delivery.address.country}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <div>
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-gray-500">{item.variant} x {item.quantity}</div>
                            </div>
                            <div className="text-right">
                              <div>₹{item.unitPrice.toFixed(2)}</div>
                              <div className="font-medium">₹{item.totalPrice.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className="lg:col-span-2">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Pricing Summary</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Subtotal:</span>
                            <span className="text-sm text-gray-900">₹{selectedOrder.pricing.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Tax:</span>
                            <span className="text-sm text-gray-900">₹{selectedOrder.pricing.taxAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Shipping:</span>
                            <span className="text-sm text-gray-900">₹{selectedOrder.pricing.shippingAmount.toFixed(2)}</span>
                          </div>
                          {selectedOrder.pricing.discountAmount > 0 && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Discount:</span>
                              <span className="text-sm text-green-600">-₹{selectedOrder.pricing.discountAmount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="border-t border-gray-200 pt-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-900">Total:</span>
                              <span className="text-sm font-medium text-gray-900">₹{selectedOrder.pricing.grandTotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Information */}
                    {selectedOrder.trackingInfo && (
                      <div className="lg:col-span-2">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Tracking Information</h4>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-gray-600">Courier</div>
                              <div className="text-sm font-medium text-gray-900">{selectedOrder.trackingInfo.courier}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Tracking Number</div>
                              <div className="text-sm font-medium text-gray-900">{selectedOrder.trackingInfo.trackingNumber}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Estimated Delivery</div>
                              <div className="text-sm font-medium text-gray-900">
                                {new Date(selectedOrder.trackingInfo.estimatedDelivery).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedOrder.notes && (
                      <div className="lg:col-span-2">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Notes</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-900">{selectedOrder.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}