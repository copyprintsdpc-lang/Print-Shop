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
  MapPin
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
  payment_status: string
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
}

const statusConfig = {
  placed: { label: 'Placed', color: 'bg-blue-100 text-blue-800', icon: Clock },
  preflight: { label: 'Preflight', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  proof_ready: { label: 'Proof Ready', color: 'bg-purple-100 text-purple-800', icon: Eye },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  in_production: { label: 'In Production', color: 'bg-orange-100 text-orange-800', icon: Package },
  ready_for_pickup: { label: 'Ready for Pickup', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  shipped: { label: 'Shipped', color: 'bg-blue-100 text-blue-800', icon: Truck },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle }
}

const paymentStatusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
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

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
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
          order._id === orderId ? { ...order, status: newStatus } : order
        ))
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      } else {
        alert('Failed to update order status: ' + data.message)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error updating order status')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || order.status === statusFilter
    const matchesPaymentStatus = !paymentStatusFilter || order.payment_status === paymentStatusFilter
    
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
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage and track customer orders</p>
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
                <option value="">All Statuses</option>
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
                <option value="">All Payment Statuses</option>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                  const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
                  const StatusIcon = statusInfo?.icon || Clock
                  const paymentInfo = paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig]
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.delivery.method === 'pickup' ? 'Store Pickup' : 'Courier'}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer.email}
                          </div>
                          {order.customer.company && (
                            <div className="text-sm text-gray-500">
                              {order.customer.company}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.reduce((total, item) => total + item.quantity, 0)} units
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.pricing.currency} {order.pricing.grandTotal.toFixed(2)}
                        </div>
                        {order.pricing.discountAmount > 0 && (
                          <div className="text-sm text-green-600">
                            -{order.pricing.currency} {order.pricing.discountAmount.toFixed(2)} discount
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${statusInfo?.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo?.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentInfo?.color}`}>
                          {paymentInfo?.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Update Status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {orders.length === 0 
                  ? "No orders have been placed yet."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => ['placed', 'preflight', 'proof_ready', 'approved', 'in_production'].includes(o.status)).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{orders.reduce((total, order) => total + order.pricing.grandTotal, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Order Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Order Number:</span> {selectedOrder.orderNumber}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        statusConfig[selectedOrder.status as keyof typeof statusConfig]?.color
                      }`}>
                        {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label}
                      </span>
                    </p>
                    <p><span className="font-medium">Payment:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        paymentStatusConfig[selectedOrder.payment_status as keyof typeof paymentStatusConfig]?.color
                      }`}>
                        {paymentStatusConfig[selectedOrder.payment_status as keyof typeof paymentStatusConfig]?.label}
                      </span>
                    </p>
                    <p><span className="font-medium">Created:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {selectedOrder.customer.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedOrder.customer.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {selectedOrder.customer.phone}
                    </p>
                    {selectedOrder.customer.company && (
                      <p className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {selectedOrder.customer.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {selectedOrder.delivery.method === 'courier' && selectedOrder.delivery.address && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                  <div className="text-sm text-gray-700">
                    <p>{selectedOrder.delivery.address.line1}</p>
                    {selectedOrder.delivery.address.line2 && <p>{selectedOrder.delivery.address.line2}</p>}
                    <p>{selectedOrder.delivery.address.city}, {selectedOrder.delivery.address.state}</p>
                    <p>{selectedOrder.delivery.address.pincode}, {selectedOrder.delivery.address.country}</p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">{item.variant}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{item.totalPrice.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">₹{item.unitPrice.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Pricing Summary</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.pricing.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{selectedOrder.pricing.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{selectedOrder.pricing.shippingAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{selectedOrder.pricing.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{selectedOrder.pricing.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Artwork Files */}
              {selectedOrder.artwork_files.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Artwork Files</h4>
                  <div className="space-y-2">
                    {selectedOrder.artwork_files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.split('/').pop()}</span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Update Order Status</h4>
                <div className="flex gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {statusConfig[status as keyof typeof statusConfig].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
