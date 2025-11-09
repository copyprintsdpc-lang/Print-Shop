'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  FileText,
  CheckCircle,
  AlertCircle,
  Package,
  DollarSign
} from 'lucide-react'
import FileUpload from '@/components/FileUpload'
import { useCart } from '@/components/Cart'
import { useAuth } from '@/contexts/AuthContext'

interface CustomerInfo {
  name: string
  email: string
  phone: string
  company: string
}

interface DeliveryInfo {
  method: 'pickup' | 'courier'
  address: {
    line1: string
    line2: string
    city: string
    state: string
    pincode: string
    country: string
  }
}

interface PaymentInfo {
  method: 'razorpay' | 'cod'
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal } = useCart()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: ''
  })
  
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    method: 'pickup',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  })
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'razorpay'
  })
  
  const [artworkFiles, setArtworkFiles] = useState<any[]>([])
  const [orderNotes, setOrderNotes] = useState('')

  const steps = [
    { id: 1, name: 'Customer Info', icon: User },
    { id: 2, name: 'Delivery', icon: Truck },
    { id: 3, name: 'Artwork', icon: FileText },
    { id: 4, name: 'Payment', icon: CreditCard },
    { id: 5, name: 'Review', icon: CheckCircle }
  ]

  useEffect(() => {
    if (items.length === 0) {
      router.push('/')
    }
  }, [items, router])

  // Update customer info when user data is available
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }))
    }
  }, [user])

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmitOrder = async () => {
    setLoading(true)
    
    try {
      // Create order data
      const orderData = {
        customer: customerInfo,
        delivery: deliveryInfo,
        payment: paymentInfo,
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          variant: item.variant,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity
        })),
        artworkFiles: artworkFiles.map(file => file.url || file.preview),
        notes: orderNotes,
        pricing: {
          subtotal: items.reduce((total, item) => total + (item.price * item.quantity), 0),
          taxAmount: items.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.18,
          shippingAmount: deliveryInfo.method === 'courier' ? 50 : 0,
          discountAmount: 0,
          grandTotal: getTotal(),
          currency: 'INR'
        }
      }

      // Create Razorpay order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (data.ok) {
        // Initialize Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'Sri Datta Print Center',
          description: 'Printing Services Order',
          order_id: data.order.id,
          handler: async function (response: any) {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...response,
                orderData
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.ok) {
              // Clear cart and redirect to success page
              localStorage.removeItem('cart')
              router.push(`/order-success?orderNumber=${verifyData.order.orderNumber}`)
            } else {
              alert('Payment verification failed. Please try again.')
            }
          },
          prefill: {
            name: customerInfo.name,
            email: customerInfo.email,
            contact: customerInfo.phone,
          },
          theme: {
            color: '#F16E02'
          }
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.on('payment.failed', function (response: any) {
          alert('Payment failed. Please try again.')
        })
        rzp.open()
      } else {
        alert('Failed to create order: ' + data.message)
      }
    } catch (error) {
      console.error('Order submission error:', error)
      alert('Error submitting order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTax = () => {
    return getSubtotal() * 0.18
  }

  const getShipping = () => {
    return deliveryInfo.method === 'courier' ? 50 : 0
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={customerInfo.company}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Delivery Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  deliveryInfo.method === 'pickup' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    value="pickup"
                    checked={deliveryInfo.method === 'pickup'}
                    onChange={(e) => setDeliveryInfo({ 
                      ...deliveryInfo, 
                      method: e.target.value as 'pickup' | 'courier' 
                    })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium">Store Pickup</p>
                    <p className="text-sm text-gray-600">Free pickup at our location</p>
                  </div>
                </label>
                
                <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  deliveryInfo.method === 'courier' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    value="courier"
                    checked={deliveryInfo.method === 'courier'}
                    onChange={(e) => setDeliveryInfo({ 
                      ...deliveryInfo, 
                      method: e.target.value as 'pickup' | 'courier' 
                    })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium">Courier Delivery</p>
                    <p className="text-sm text-gray-600">{getShipping() === 0 ? 'Free' : `₹${getShipping().toFixed(2)} delivery charge`}</p>
                  </div>
                </label>
              </div>
            </div>

            {deliveryInfo.method === 'courier' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Delivery Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryInfo.address.line1}
                      onChange={(e) => setDeliveryInfo({
                        ...deliveryInfo,
                        address: { ...deliveryInfo.address, line1: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter address line 1"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.address.line2}
                      onChange={(e) => setDeliveryInfo({
                        ...deliveryInfo,
                        address: { ...deliveryInfo.address, line2: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter address line 2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryInfo.address.city}
                      onChange={(e) => setDeliveryInfo({
                        ...deliveryInfo,
                        address: { ...deliveryInfo.address, city: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryInfo.address.state}
                      onChange={(e) => setDeliveryInfo({
                        ...deliveryInfo,
                        address: { ...deliveryInfo.address, state: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter state"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryInfo.address.pincode}
                      onChange={(e) => setDeliveryInfo({
                        ...deliveryInfo,
                        address: { ...deliveryInfo.address, pincode: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Upload Artwork</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">Artwork Guidelines</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Upload high-resolution files (300 DPI or higher)</li>
                    <li>• Supported formats: PDF, JPEG, PNG, TIFF</li>
                    <li>• Maximum file size: 50MB per file</li>
                    <li>• Include crop marks for bleed areas</li>
                  </ul>
                </div>
              </div>
            </div>

            <FileUpload
              onFilesChange={setArtworkFiles}
              maxFiles={10}
              maxSize={50}
              acceptedTypes={[
                'image/jpeg',
                'image/png',
                'image/tiff',
                'application/pdf'
              ]}
              showUploadButton={true}
              folder="sdpc-print-media/artwork"
              uploadEndpoint="/api/artwork/upload"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                rows={4}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special instructions for your order..."
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
            
            <div className="space-y-4">
              <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentInfo.method === 'razorpay' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  value="razorpay"
                  checked={paymentInfo.method === 'razorpay'}
                  onChange={(e) => setPaymentInfo({ 
                    method: e.target.value as 'razorpay' | 'cod' 
                  })}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium">Online Payment</p>
                    <p className="text-sm text-gray-600">
                      Credit/Debit Card, UPI, Net Banking, Wallets
                    </p>
                  </div>
                </div>
              </label>
              
              <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentInfo.method === 'cod' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  value="cod"
                  checked={paymentInfo.method === 'cod'}
                  onChange={(e) => setPaymentInfo({ 
                    method: e.target.value as 'razorpay' | 'cod' 
                  })}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">
                      Pay when you receive your order
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Payment Security</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All payments are processed securely through Razorpay</li>
                <li>• We never store your payment information</li>
                <li>• SSL encrypted checkout process</li>
                <li>• PCI DSS compliant payment gateway</li>
              </ul>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Your Order</h3>
            
            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">{item.variant}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Info Summary */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <p><strong>Name:</strong> {customerInfo.name}</p>
                <p><strong>Email:</strong> {customerInfo.email}</p>
                <p><strong>Phone:</strong> {customerInfo.phone}</p>
                {customerInfo.company && <p><strong>Company:</strong> {customerInfo.company}</p>}
              </div>
            </div>

            {/* Delivery Summary */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Delivery Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <p><strong>Method:</strong> {deliveryInfo.method === 'pickup' ? 'Store Pickup' : 'Courier Delivery'}</p>
                {deliveryInfo.method === 'courier' && (
                  <div>
                    <p><strong>Address:</strong></p>
                    <p>{deliveryInfo.address.line1}</p>
                    {deliveryInfo.address.line2 && <p>{deliveryInfo.address.line2}</p>}
                    <p>{deliveryInfo.address.city}, {deliveryInfo.address.state}</p>
                    <p>{deliveryInfo.address.pincode}, {deliveryInfo.address.country}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Artwork Files */}
            {artworkFiles.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Uploaded Artwork ({artworkFiles.length})</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {artworkFiles.map((file, index) => (
                      <p key={index} className="truncate">
                        • {file.file?.name || `File ${index + 1}`}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Order Notes */}
            {orderNotes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Special Instructions</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm">{orderNotes}</p>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-2">Complete your order</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const IconComponent = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500 text-white'
                          : isActive 
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <IconComponent className="w-5 h-5" />
                        )}
                      </div>
                      <div className="ml-3 hidden sm:block">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow p-6">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                
                {currentStep < steps.length ? (
                  <button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && (!customerInfo.name || !customerInfo.email || !customerInfo.phone)) ||
                      (currentStep === 2 && deliveryInfo.method === 'courier' && (!deliveryInfo.address.line1 || !deliveryInfo.address.city || !deliveryInfo.address.state || !deliveryInfo.address.pincode))
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="px-8 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Place Order
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-gray-600">{item.variant}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{getShipping() === 0 ? 'Free' : `₹${getShipping().toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>₹{getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>₹{getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  {paymentInfo.method === 'razorpay' ? (
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Truck className="w-4 h-4 text-blue-600" />
                  )}
                  <span className="font-medium">
                    {paymentInfo.method === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  )
}
