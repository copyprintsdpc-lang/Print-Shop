'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Phone, MapPin, Mail, Shield, Loader2 } from 'lucide-react'

interface VerificationStatus {
  email: boolean
  phone: boolean
  address: boolean
  complete: boolean
}

interface UserProfile {
  email: string
  name?: string
  mobile?: string
  mobileVerified: boolean
  verified: boolean
  verification: VerificationStatus
  canOrder: boolean
  addressCount: number
}

interface Address {
  _id: string
  label: string
  contactName: string
  contactPhone: string
  line1: string
  line2?: string
  landmark?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
  isVerified: boolean
  verifiedAt?: string
}

export function ProfileVerificationBanner({ user }: { user: UserProfile }) {
  if (user.canOrder) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">Profile Verified ✅</h4>
            <p className="text-sm text-green-700 mt-1">Your profile is complete and you can place orders!</p>
          </div>
        </div>
      </div>
    )
  }

  const incomplete = []
  if (!user.verification.email) incomplete.push('email')
  if (!user.verification.phone) incomplete.push('phone number')
  if (!user.verification.address) incomplete.push('delivery address')

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-amber-900">Complete Your Profile to Order</h4>
          <p className="text-sm text-amber-700 mt-1">
            Please verify your {incomplete.join(', ')} to start placing orders.
          </p>
        </div>
      </div>
    </div>
  )
}

export function VerificationStatusCards({ user, onRefresh }: { user: UserProfile; onRefresh: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Email Verification */}
      <div className={`p-4 rounded-xl border-2 ${user.verified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className={`w-5 h-5 ${user.verified ? 'text-green-600' : 'text-gray-400'}`} />
            <div>
              <div className="text-sm font-medium text-gray-900">Email</div>
              <div className="text-xs text-gray-600">{user.email}</div>
            </div>
          </div>
          {user.verified ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Phone Verification */}
      <div className={`p-4 rounded-xl border-2 ${user.mobileVerified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className={`w-5 h-5 ${user.mobileVerified ? 'text-green-600' : 'text-gray-400'}`} />
            <div>
              <div className="text-sm font-medium text-gray-900">Phone</div>
              <div className="text-xs text-gray-600">
                {user.mobile ? `+91 ${user.mobile}` : 'Not added'}
              </div>
            </div>
          </div>
          {user.mobileVerified ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Address Verification */}
      <div className={`p-4 rounded-xl border-2 ${user.verification.address ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className={`w-5 h-5 ${user.verification.address ? 'text-green-600' : 'text-gray-400'}`} />
            <div>
              <div className="text-sm font-medium text-gray-900">Address</div>
              <div className="text-xs text-gray-600">
                {user.addressCount} address{user.addressCount !== 1 ? 'es' : ''}
              </div>
            </div>
          </div>
          {user.verification.address ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  )
}

export function PhoneVerificationSection({ user, onRefresh }: { user: UserProfile; onRefresh: () => void }) {
  const [phone, setPhone] = useState(user.mobile || '')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSendOTP = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/profile/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phone })
      })

      const data = await response.json()

      if (response.ok) {
        setOtpSent(true)
        setSuccess('OTP sent successfully! Check your phone.')
      } else {
        setError(data.error || 'Failed to send OTP')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/profile/verify-phone', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phone, otp })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Phone verified successfully! ✅')
        setTimeout(() => {
          onRefresh()
        }, 1500)
      } else {
        setError(data.error || 'Invalid OTP')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (user.mobileVerified) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Phone Verified: +91 {user.mobile}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">Verify Your Phone Number</h4>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex gap-2">
            <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
              +91
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="9876543210"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
              disabled={otpSent || loading}
              maxLength={10}
            />
          </div>
        </div>

        {otpSent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit OTP"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              disabled={loading}
              maxLength={6}
            />
          </div>
        )}

        <div className="flex gap-2">
          {!otpSent ? (
            <button
              onClick={handleSendOTP}
              disabled={loading || phone.length !== 10}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Send OTP
            </button>
          ) : (
            <>
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Verify OTP
              </button>
              <button
                onClick={() => {
                  setOtpSent(false)
                  setOtp('')
                  setError('')
                }}
                disabled={loading}
                className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50"
              >
                Change Number
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function AddressManagement({ user, onRefresh }: { user: UserProfile; onRefresh: () => void }) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    label: 'Home',
    contactName: user.name || '',
    contactPhone: user.mobile || '',
    line1: '',
    line2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  })

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      const response = await fetch('/api/profile/addresses')
      const data = await response.json()
      if (response.ok) {
        setAddresses(data.addresses || [])
      }
    } catch (err) {
      console.error('Failed to load addresses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = async () => {
    try {
      const response = await fetch('/api/profile/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await loadAddresses()
        onRefresh()
        setShowAddForm(false)
        setFormData({
          label: 'Home',
          contactName: user.name || '',
          contactPhone: user.mobile || '',
          line1: '',
          line2: '',
          landmark: '',
          city: '',
          state: '',
          pincode: '',
          isDefault: false
        })
      }
    } catch (err) {
      console.error('Failed to add address:', err)
    }
  }

  const handleVerifyAddress = async (addressId: string) => {
    try {
      const response = await fetch('/api/profile/addresses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId, method: 'manual' })
      })

      if (response.ok) {
        await loadAddresses()
        onRefresh()
      }
    } catch (err) {
      console.error('Failed to verify address:', err)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Delete this address?')) return

    try {
      const response = await fetch(`/api/profile/addresses?id=${addressId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadAddresses()
        onRefresh()
      }
    } catch (err) {
      console.error('Failed to delete address:', err)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading addresses...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">Delivery Addresses</h4>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {showAddForm ? 'Cancel' : '+ Add Address'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h5 className="font-medium text-gray-900 mb-4">New Address</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <select
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option>Home</option>
                <option>Office</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1*</label>
              <input
                type="text"
                value={formData.line1}
                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                placeholder="House/Flat number, Street name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
              <input
                type="text"
                value={formData.line2}
                onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                placeholder="Area, Colony"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="Near temple, hospital, etc."
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode*</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                maxLength={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>
          <button
            onClick={handleAddAddress}
            disabled={!formData.line1 || !formData.city || !formData.state || !formData.pincode}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Save Address
          </button>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No addresses added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`border rounded-lg p-4 ${
                address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{address.label}</span>
                  {address.isDefault && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Default</span>
                  )}
                  {address.isVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-700 space-y-1">
                <p>{address.contactName}</p>
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                {address.landmark && <p className="text-gray-500">Landmark: {address.landmark}</p>}
                <p>{address.city}, {address.state} - {address.pincode}</p>
                <p className="text-gray-600">📞 {address.contactPhone}</p>
              </div>

              <div className="mt-3 flex gap-2">
                {!address.isVerified && (
                  <button
                    onClick={() => handleVerifyAddress(address._id)}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
                  >
                    Verify
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAddress(address._id)}
                  className="text-xs border border-red-300 text-red-600 px-3 py-1.5 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!user.verification.address && addresses.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            ℹ️ Please verify at least one address to place orders. Click "Verify" button on any address.
            <br />
            <span className="text-xs text-amber-600 mt-1 block">
              Note: Addresses will be automatically verified after your first successful delivery.
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

