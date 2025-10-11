'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Package, 
  ShoppingCart, 
  Percent, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  DollarSign,
  RefreshCw
} from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
}

interface DashboardStats {
  products: number
  orders: number
  customers: number
  revenue: number
  recentOrders: any[]
  topProducts: any[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
    recentOrders: [],
    topProducts: []
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (admin) {
      fetchDashboardStats()
    }
  }, [admin])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me')
      const data = await response.json()
      
      if (data.ok) {
        setAdmin(data.admin)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true)
      
      // Fetch products count
      const productsResponse = await fetch('/api/admin/products')
      const productsData = await productsResponse.json()
      
      // Fetch orders count and revenue
      const ordersResponse = await fetch('/api/admin/orders')
      const ordersData = await ordersResponse.json()
      
      // Calculate revenue from orders
      const revenue = ordersData.orders?.reduce((total: number, order: any) => {
        return total + (order.pricing?.grandTotal || 0)
      }, 0) || 0
      
      // Fetch customers count (we'll estimate from orders for now)
      const customers = ordersData.orders?.length || 0
      
      setStats({
        products: productsData.products?.length || 0,
        orders: ordersData.orders?.length || 0,
        customers: customers,
        revenue: revenue,
        recentOrders: ordersData.orders?.slice(0, 5) || [],
        topProducts: productsData.products?.slice(0, 5) || []
      })
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  const menuItems = [
    {
      name: 'Dashboard',
      icon: BarChart3,
      href: '/admin',
      permission: 'dashboard.read'
    },
    {
      name: 'Products',
      icon: Package,
      href: '/admin/products',
      permission: 'products.read'
    },
    {
      name: 'Orders',
      icon: ShoppingCart,
      href: '/admin/orders',
      permission: 'orders.read'
    },
    {
      name: 'Promotions',
      icon: Percent,
      href: '/admin/promotions',
      permission: 'promotions.read'
    },
    {
      name: 'Bulk Pricing',
      icon: DollarSign,
      href: '/admin/products/bulk-pricing',
      permission: 'products.update'
    },
    {
      name: 'Customers',
      icon: Users,
      href: '/admin/customers',
      permission: 'users.read'
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      permission: 'analytics.read'
    },
    {
      name: 'Settings',
      icon: Settings,
      href: '/admin/settings',
      permission: 'settings.update'
    }
  ].filter(item => admin.permissions.includes(item.permission) || admin.role === 'super_admin')

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex-shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900">Admin CMS</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

          <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                  <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
              </a>
            )
          })}
        </nav>

          <div className="p-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{admin.name}</p>
              <p className="text-xs text-gray-500 capitalize">{admin.role}</p>
            </div>
            <button
              onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-3 flex-shrink-0"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 truncate">Dashboard</h2>
            </div>
            <button
              onClick={fetchDashboardStats}
              disabled={statsLoading}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm flex-shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Products</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-6 sm:h-8 w-12 sm:w-16 rounded"></div>
                  ) : (
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.products}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Orders</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-6 sm:h-8 w-12 sm:w-16 rounded"></div>
                  ) : (
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.orders}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Customers</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-6 sm:h-8 w-12 sm:w-16 rounded"></div>
                  ) : (
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.customers}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 flex-shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Revenue</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-6 sm:h-8 w-16 sm:w-20 rounded"></div>
                  ) : (
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">₹{stats.revenue.toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent Orders</h3>
              </div>
              <div className="p-4 sm:p-6">
                {statsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-12 sm:h-16 rounded"></div>
                    ))}
                  </div>
                ) : stats.recentOrders.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {stats.recentOrders.map((order: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm sm:text-base font-medium text-gray-900 truncate">Order #{order.orderNumber || order._id?.slice(-6)}</p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{order.customer?.name || 'Unknown Customer'}</p>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <p className="text-sm sm:text-base font-medium text-gray-900">₹{order.pricing?.grandTotal?.toFixed(2) || '0.00'}</p>
                          <p className="text-xs sm:text-sm text-gray-500 capitalize">{order.status || 'Pending'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <ShoppingCart className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-gray-500">No recent orders</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => router.push('/admin/products/new')}
                    className="flex items-center justify-center p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 flex-shrink-0" />
                    <span className="text-blue-700 font-medium text-sm sm:text-base">Add Product</span>
                  </button>
                  
                  <button
                    onClick={() => router.push('/admin/orders')}
                    className="flex items-center justify-center p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-green-700 font-medium text-sm sm:text-base">View Orders</span>
                  </button>
                  
                  <button
                    onClick={() => router.push('/admin/promotions')}
                    className="flex items-center justify-center p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Percent className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2 flex-shrink-0" />
                    <span className="text-purple-700 font-medium text-sm sm:text-base">Create Promotion</span>
                  </button>
                  
                  <button
                    onClick={() => router.push('/admin/products/bulk-pricing')}
                    className="flex items-center justify-center p-3 sm:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mr-2 flex-shrink-0" />
                    <span className="text-orange-700 font-medium text-sm sm:text-base">Bulk Pricing</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Welcome to Sri Datta Print Center Admin</h3>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Manage your print shop operations from this dashboard. You can:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-1 sm:space-y-2">
                <li>Add and manage products with variants and pricing</li>
                <li>Track and update order statuses</li>
                <li>Create and manage promotions and discounts</li>
                <li>View customer information and order history</li>
                <li>Monitor sales analytics and performance</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

