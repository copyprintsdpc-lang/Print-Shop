'use client'

import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Upload, 
  Package, 
  FolderOpen, 
  MapPin, 
  Settings,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Store,
  CreditCard,
  Star,
  Download,
  Repeat,
  X,
  Plus,
  FileText,
  AlertCircle
} from 'lucide-react'
import {
  ProfileVerificationBanner,
  VerificationStatusCards,
  PhoneVerificationSection,
  AddressManagement
} from '@/components/ProfileVerification'

type TabType = 'overview' | 'new-order' | 'orders' | 'files' | 'addresses' | 'settings'

interface UserProfile {
  email: string
  name?: string
  mobile?: string
  mobileVerified: boolean
  verified: boolean
  verification: {
    email: boolean
    phone: boolean
    address: boolean
    complete: boolean
  }
  canOrder: boolean
  addressCount: number
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      if (data.ok && data.user) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Failed to load user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile</p>
        </div>
      </div>
    )
  }

  // Mock data
  const stats = {
    activeOrders: 2,
    completedOrders: 24,
    savedQuotes: 3,
    uploadedFiles: 12
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'new-order' as TabType, label: 'New Order', icon: Upload },
    { id: 'orders' as TabType, label: 'My Orders', icon: Package },
    { id: 'files' as TabType, label: 'My Files', icon: FolderOpen },
    { id: 'addresses' as TabType, label: 'Addresses', icon: MapPin },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab stats={stats} user={user} />}
        {activeTab === 'new-order' && <NewOrderTab user={user} />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'files' && <FilesTab />}
        {activeTab === 'addresses' && <AddressesTab user={user} onRefresh={loadUserProfile} />}
        {activeTab === 'settings' && <SettingsTab user={user} onRefresh={loadUserProfile} />}
      </div>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ stats, user }: { stats: any; user: UserProfile }) {
  return (
    <div className="space-y-6">
      {/* Show verification banner if not complete */}
      <ProfileVerificationBanner user={user} />
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-blue-100 mb-6">Ready to start your next print order?</p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Start New Order
            </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.activeOrders}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Active Orders</h3>
          <p className="text-sm text-gray-500 mt-1">Currently in progress</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.completedOrders}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Completed</h3>
          <p className="text-sm text-gray-500 mt-1">Total orders delivered</p>
              </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.savedQuotes}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Saved Quotes</h3>
          <p className="text-sm text-gray-500 mt-1">Pending decisions</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.uploadedFiles}</span>
          </div>
          <h3 className="text-gray-600 font-medium">My Files</h3>
          <p className="text-sm text-gray-500 mt-1">Uploaded documents</p>
        </div>
      </div>

      {/* Active Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Active Orders</h2>
        </div>
        <div className="p-6 space-y-4">
          <OrderCard
            id="J-2481"
            fileName="Project Proposal.pdf"
            specs="100 copies • A4 • Color • Double-sided"
            status="processing"
            amount="₹450"
            deliveryType="delivery"
          />
          <OrderCard
            id="J-2479"
            fileName="Invoice_Sept.xlsx"
            specs="50 copies • A4 • B&W • Single-sided"
            status="ready"
            amount="₹200"
            deliveryType="pickup"
          />
        </div>
      </div>

      {/* Recent Orders - Quick Reorder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <p className="text-sm text-gray-600 mt-1">Quick reorder your previous prints</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          <ReorderCard
            fileName="Business Cards"
            specs="500 cards • Premium Matte"
            amount="₹800"
            rating={5}
          />
          <ReorderCard
            fileName="Flyers A5"
            specs="1000 copies • Glossy"
            amount="₹1,200"
            rating={4}
          />
          <ReorderCard
            fileName="Poster A2"
            specs="10 copies • Photo Paper"
            amount="₹600"
            rating={5}
          />
        </div>
      </div>
    </div>
  )
}

// New Order Tab Component
function NewOrderTab({ user }: { user: UserProfile }) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  
  return (
    <div className="space-y-6">
      {/* Verification Check */}
      {!user.canOrder && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 text-lg mb-2">⚠️ Complete Profile to Place Orders</h3>
              <p className="text-amber-800 mb-3">
                To ensure smooth delivery and communication, please complete your profile verification:
              </p>
              <ul className="space-y-1 text-sm text-amber-700 mb-4">
                {!user.verification.email && <li>• ✉️ Verify your email address</li>}
                {!user.verification.phone && <li>• 📱 Verify your phone number</li>}
                {!user.verification.address && <li>• 📍 Add and verify a delivery address</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Print Order</h2>
        <p className="text-gray-600 mb-6">Upload your file and get an instant quote</p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Drag & Drop your files here</h3>
          <p className="text-gray-600 mb-4">or click to browse</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Browse Files
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Supported formats: PDF, JPG, PNG, AI, PSD (Max 50MB)
          </p>
        </div>

        {/* Quick Service Templates */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Business Cards', 'Flyers', 'Brochures', 'Posters'].map((service) => (
              <button
                key={service}
                className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all text-center"
              >
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <span className="font-medium text-gray-900">{service}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Calculator Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Configure Your Print</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paper Size</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>A4 (210 × 297 mm)</option>
                <option>A3 (297 × 420 mm)</option>
                <option>Letter (8.5 × 11 in)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input 
                type="number" 
                defaultValue="100"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="grid grid-cols-2 gap-3">
                <button className="border-2 border-blue-600 bg-blue-50 rounded-lg px-4 py-2.5 font-medium text-blue-600">
                  Color
                </button>
                <button className="border-2 border-gray-300 rounded-lg px-4 py-2.5 font-medium text-gray-700 hover:border-gray-400">
                  B&W
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paper Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Standard (80gsm)</option>
                <option>Premium (120gsm)</option>
                <option>Glossy Photo Paper</option>
              </select>
            </div>

              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sides</label>
              <div className="grid grid-cols-2 gap-3">
                <button className="border-2 border-blue-600 bg-blue-50 rounded-lg px-4 py-2.5 font-medium text-blue-600">
                  Double
                </button>
                <button className="border-2 border-gray-300 rounded-lg px-4 py-2.5 font-medium text-gray-700 hover:border-gray-400">
                  Single
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Binding</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>No Binding</option>
                <option>Staple</option>
                <option>Spiral Binding</option>
                <option>Perfect Binding</option>
              </select>
            </div>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Delivery Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="border-2 border-blue-600 bg-blue-50 rounded-lg p-4 text-left">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
              <div>
                    <div className="font-semibold text-gray-900">Home Delivery</div>
                    <div className="text-sm text-gray-600">Delivered to your address</div>
                      </div>
                    </div>
                <span className="text-sm font-medium text-blue-600">+ ₹50</span>
              </div>
            </button>

            <button className="border-2 border-gray-300 rounded-lg p-4 text-left hover:border-gray-400">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Store className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Store Pickup</div>
                    <div className="text-sm text-gray-600">Collect from our shop</div>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Free</span>
              </div>
            </button>
          </div>
        </div>

        {/* Price Summary */}
        <div className="mt-6 p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">₹450</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-semibold text-gray-900">₹50</span>
          </div>
          <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-blue-600">₹500</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5" />
            Place Order
          </button>
          <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Save Quote
          </button>
        </div>
      </div>
    </div>
  )
}

// Orders Tab Component  
function OrdersTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <select className="border border-gray-300 rounded-lg px-4 py-2">
          <option>All Orders</option>
          <option>Active</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Active Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Active Orders (2)</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <OrderDetailCard />
          <OrderDetailCard />
                </div>
              </div>

      {/* Past Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Past Orders (24)</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <OrderDetailCard completed />
          <OrderDetailCard completed />
          <OrderDetailCard completed />
                      </div>
                      </div>
                    </div>
  )
}

// Files Tab Component
function FilesTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Files</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Upload New File
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <FileCard key={i} />
                  ))}
                </div>
              </div>
  )
}

// Addresses Tab Component
function AddressesTab({ user, onRefresh }: { user: UserProfile; onRefresh: () => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Delivery Addresses</h2>
      <AddressManagement user={user} onRefresh={onRefresh} />
    </div>
  )
}

// Settings Tab Component
function SettingsTab({ user, onRefresh }: { user: UserProfile; onRefresh: () => void }) {
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>

      {/* Profile Completion Banner */}
      <ProfileVerificationBanner user={user} />

      {/* Verification Status Cards */}
      <VerificationStatusCards user={user} onRefresh={onRefresh} />

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input 
              type="text"
              defaultValue={user.name || user.email.split('@')[0]}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Email
              {user.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
            </label>
            <input 
              type="email"
              value={user.email}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-600"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Phone Verification */}
      <PhoneVerificationSection user={user} onRefresh={onRefresh} />

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Email Notifications</div>
              <div className="text-sm text-gray-600">Receive order updates via email</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">SMS Notifications</div>
              <div className="text-sm text-gray-600">Receive order updates via SMS</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Order Status Updates</div>
              <div className="text-sm text-gray-600">Get notified when order status changes</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
        <button 
          onClick={handleSignOut}
          className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

// Reusable Components
function OrderCard({ id, fileName, specs, status, amount, deliveryType }: any) {
  const statusConfig = {
    processing: { color: 'bg-blue-100 text-blue-700', label: 'Processing' },
    ready: { color: 'bg-green-100 text-green-700', label: 'Ready for Pickup' },
    completed: { color: 'bg-gray-100 text-gray-700', label: 'Completed' },
    delivered: { color: 'bg-purple-100 text-purple-700', label: 'Delivered' },
  }

  const config = statusConfig[status as keyof typeof statusConfig]

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900">{fileName}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        </div>
        <div className="text-sm text-gray-600">{id} • {specs}</div>
        <div className="flex items-center gap-2 mt-2">
          {deliveryType === 'delivery' ? (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Truck className="w-3 h-3" /> Home Delivery
            </span>
          ) : (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Store className="w-3 h-3" /> Store Pickup
            </span>
          )}
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs font-medium text-gray-900">{amount}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
          Track
        </button>
      </div>
    </div>
  )
}

function ReorderCard({ fileName, specs, amount, rating }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{fileName}</h4>
      <p className="text-sm text-gray-600 mb-3">{specs}</p>
      <div className="flex items-center justify-between">
        <span className="font-bold text-blue-600">{amount}</span>
        <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
          <Repeat className="w-4 h-4" />
          Reorder
        </button>
      </div>
    </div>
  )
}

function OrderDetailCard({ completed }: { completed?: boolean }) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-gray-900">Project Proposal.pdf</h4>
            {!completed && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Processing
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">J-2481 • Today, 10:12 AM</p>
          <p className="text-sm text-gray-600 mt-1">100 copies • A4 • Color • Double-sided</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">₹450</div>
          <div className="text-sm text-gray-600">Home Delivery</div>
        </div>
      </div>
      
      {!completed && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <span className="text-sm text-gray-600">60%</span>
          </div>
          <p className="text-sm text-gray-600">Estimated completion: 2 hours</p>
        </div>
      )}
      
      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
          <Repeat className="w-4 h-4" />
          Reorder
        </button>
        {!completed && (
          <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        )}
        <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  )
}

function FileCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
        <FileText className="w-12 h-12 text-gray-400" />
      </div>
      <h4 className="font-medium text-gray-900 truncate mb-1">document.pdf</h4>
      <p className="text-xs text-gray-500">2.5 MB • Oct 13, 2024</p>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Use
        </button>
        <button className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function AddressCard({ title, address, phone, isDefault }: any) {
  return (
    <div className={`bg-white border-2 rounded-lg p-6 ${isDefault ? 'border-blue-600' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            {isDefault && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                Default
              </span>
            )}
          </div>
        </div>
        <MapPin className="w-5 h-5 text-gray-400" />
      </div>
      <p className="text-gray-600 mb-2">{address}</p>
      <p className="text-sm text-gray-500 mb-4">Phone: {phone}</p>
      <div className="flex gap-2">
        <button className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
          Edit
        </button>
        {!isDefault && (
          <button className="flex-1 text-sm px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Set Default
          </button>
        )}
      </div>
    </div>
  )
}
