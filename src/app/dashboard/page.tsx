'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  LogOut,
  Settings,
  FileText,
  Download
} from 'lucide-react'

interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  role: {
    name: string;
  };
  created_at: string;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile'>('overview')

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/strapi/me')
      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        // TODO: Fetch user orders from Strapi
        setOrders([])
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/strapi/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'processing':
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Package className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'processing':
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Account</h1>
            <p className="text-white/70">Welcome back, {user.username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
            </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-orange-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-orange-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-orange-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Profile
          </button>
            </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-white/70 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{orders.length}</p>
                </div>
                <Package className="w-8 h-8 text-orange-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-white/70 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-white">
                    {orders.filter(o => o.status.toLowerCase() === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-white/70 text-sm">Processing</p>
                  <p className="text-2xl font-bold text-white">
                    {orders.filter(o => ['processing', 'pending'].includes(o.status.toLowerCase())).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-white/70 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-white">
                    ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </div>
        </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Order History</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70 mb-4">No orders yet</p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white">Order #{order.orderNumber}</h3>
                        <p className="text-white/70 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">₹{order.total.toLocaleString()}</p>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm text-white/80">
                          <span>{item.product.name} × {item.quantity}</span>
                          <span>₹{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="flex items-center gap-1 px-3 py-1 text-sm bg-white/10 text-white/80 rounded hover:bg-white/20 transition-colors">
                        <Download className="w-4 h-4" />
                        Invoice
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-sm bg-white/10 text-white/80 rounded hover:bg-white/20 transition-colors">
                        Track Order
                      </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Username</label>
                <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                  {user.username}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                  {user.email}
                </div>
              </div>
              
                      <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Account Status</label>
                <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                  {user.confirmed ? 'Verified' : 'Unverified'}
                      </div>
                    </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Member Since</label>
                <div className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <Settings className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}