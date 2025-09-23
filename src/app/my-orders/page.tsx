'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  Download,
  Eye,
  RefreshCw,
  Calendar,
  MapPin,
  CreditCard,
  FileText
} from 'lucide-react'

interface OrderItem {
  id: number
  product: {
    name: string
    slug: string
    image?: string
  }
  variant: {
    size: string
    material: string
    finish: string
  }
  quantity: number
  price: number
}

interface Order {
  id: number
  orderNumber: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  total: number
  subtotal: number
  deliveryFee: number
  discount: number
  createdAt: string
  updatedAt: string
  estimatedDelivery: string
  deliveryAddress: {
    name: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  items: OrderItem[]
  artworkFiles: Array<{
    id: number
    name: string
    url: string
    type: string
  }>
  trackingNumber?: string
  courierName?: string
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const mockOrders: Order[] = [
        {
          id: 1,
          orderNumber: 'SDPC-2024-001',
          status: 'delivered',
          paymentStatus: 'paid',
          total: 450.00,
          subtotal: 500.00,
          deliveryFee: 0,
          discount: 50.00,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-18T14:20:00Z',
          estimatedDelivery: '2024-01-18',
          deliveryAddress: {
            name: 'John Doe',
            address: '123 Main Street, Apartment 4B',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            phone: '+91 98765 43210'
          },
          items: [
            {
              id: 1,
              product: {
                name: 'Standard Business Cards',
                slug: 'standard-business-cards',
                image: '/images/business-card-1.jpg'
              },
              variant: {
                size: '3.5" x 2"',
                material: '300 GSM Matte',
                finish: 'Standard'
              },
              quantity: 250,
              price: 200.00
            },
            {
              id: 2,
              product: {
                name: 'Professional Flyers',
                slug: 'professional-flyers',
                image: '/images/flyer-1.jpg'
              },
              variant: {
                size: 'A4',
                material: '170 GSM Glossy',
                finish: 'Standard'
              },
              quantity: 100,
              price: 250.00
            }
          ],
          artworkFiles: [
            {
              id: 1,
              name: 'business-card-design.pdf',
              url: 'https://example.com/files/business-card-design.pdf',
              type: 'application/pdf'
            }
          ],
          trackingNumber: 'TRK123456789',
          courierName: 'Blue Dart'
        },
        {
          id: 2,
          orderNumber: 'SDPC-2024-002',
          status: 'processing',
          paymentStatus: 'paid',
          total: 300.00,
          subtotal: 300.00,
          deliveryFee: 0,
          discount: 0,
          createdAt: '2024-01-20T15:45:00Z',
          updatedAt: '2024-01-21T09:15:00Z',
          estimatedDelivery: '2024-01-25',
          deliveryAddress: {
            name: 'Jane Smith',
            address: '456 Park Avenue, Floor 2',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            phone: '+91 87654 32109'
          },
          items: [
            {
              id: 3,
              product: {
                name: 'Company Letterheads',
                slug: 'company-letterheads',
                image: '/images/letterhead-1.jpg'
              },
              variant: {
                size: 'A4',
                material: '100 GSM Bond',
                finish: 'Standard'
              },
              quantity: 500,
              price: 300.00
            }
          ],
          artworkFiles: []
        }
      ]
      
      setOrders(mockOrders)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'shipped':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'refunded':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    }
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading your orders...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">My Orders</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Order
              <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                History
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Track your orders and view order details
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="relative py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setFilterStatus('processing')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'processing'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Processing ({orders.filter(o => o.status === 'processing').length})
              </button>
              <button
                onClick={() => setFilterStatus('shipped')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'shipped'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Shipped ({orders.filter(o => o.status === 'shipped').length})
              </button>
              <button
                onClick={() => setFilterStatus('delivered')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'delivered'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Delivered ({orders.filter(o => o.status === 'delivered').length})
              </button>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-16 h-16 text-white/50" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">No orders found</h2>
              <p className="text-white/70 mb-8">You haven't placed any orders yet</p>
              <Link
                href="/services"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <div
                  key={order.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Order #{order.orderNumber}
                      </h3>
                      <div className="flex items-center gap-4 text-white/70 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-400 mb-2">
                        ₹{order.total.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getPaymentStatusColor(order.paymentStatus)}`}>
                          <CreditCard className="w-3 h-3" />
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">IMG</span>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.product.name}</h4>
                          <p className="text-white/70 text-sm">
                            {item.variant.size} • {item.variant.material} • {item.variant.finish}
                          </p>
                          <p className="text-white/60 text-sm">Qty: {item.quantity}</p>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-white font-semibold">₹{item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      
                      {order.status === 'delivered' && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                          <Download className="w-4 h-4" />
                          Invoice
                        </button>
                      )}
                      
                      {order.trackingNumber && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                          <Truck className="w-4 h-4" />
                          Track
                        </button>
                      )}
                    </div>
                    
                    <div className="text-white/70 text-sm">
                      Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Order #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Order Status */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Order Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Status</span>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Payment</span>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                      <CreditCard className="w-3 h-3" />
                      {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Total</span>
                    <span className="text-white font-semibold">₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Delivery Address</h3>
                <div className="text-white/70 space-y-1">
                  <p>{selectedOrder.deliveryAddress.name}</p>
                  <p>{selectedOrder.deliveryAddress.address}</p>
                  <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.pincode}</p>
                  <p>{selectedOrder.deliveryAddress.phone}</p>
                </div>
              </div>
            </div>

            {/* Artwork Files */}
            {selectedOrder.artworkFiles.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Artwork Files</h3>
                <div className="space-y-2">
                  {selectedOrder.artworkFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <FileText className="w-5 h-5 text-orange-400" />
                      <span className="text-white">{file.name}</span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-orange-400 hover:text-orange-300"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items Details */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">IMG</span>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.product.name}</h4>
                      <p className="text-white/70 text-sm">
                        {item.variant.size} • {item.variant.material} • {item.variant.finish}
                      </p>
                      <p className="text-white/60 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-semibold">₹{item.price.toFixed(2)}</div>
                      <div className="text-white/60 text-sm">per piece</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
