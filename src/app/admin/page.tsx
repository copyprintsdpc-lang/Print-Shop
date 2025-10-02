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
  DollarSign
} from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

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
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin CMS</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <IconComponent className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{admin.name}</p>
              <p className="text-xs text-gray-500 capitalize">{admin.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Products</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ShoppingCart className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Welcome to Sri Datta Print Center Admin</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Manage your print shop operations from this dashboard. You can:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
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

