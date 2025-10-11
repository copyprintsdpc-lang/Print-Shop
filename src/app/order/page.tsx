'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle, Clock, Truck, CreditCard, MapPin, User, Phone, Mail } from 'lucide-react'
import FileUpload from '@/components/FileUpload'
import AuthGuard from '@/components/AuthGuard'
import { useAuth } from '@/contexts/AuthContext'

export default function OrderPage() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [orderData, setOrderData] = useState({
    files: [] as any[],
    product: null as any,
    quantity: 1,
    options: {} as Record<string, string>,
    customerInfo: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: ''
    },
    deliveryInfo: {
      method: 'pickup' as 'pickup' | 'courier',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      }
    },
    paymentMethod: 'razorpay' as 'razorpay' | 'cod'
  })

  const steps = [
    { id: 1, name: 'Upload Files', icon: Upload },
    { id: 2, name: 'Product Details', icon: FileText },
    { id: 3, name: 'Customer Info', icon: User },
    { id: 4, name: 'Delivery', icon: Truck },
    { id: 5, name: 'Payment', icon: CreditCard }
  ]
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

  const handleSubmit = () => {
    // Handle order submission
    console.log('Order submitted:', orderData)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Files</h3>
              <FileUpload
                onFilesChange={(files) => setOrderData(prev => ({ ...prev, files }))}
                maxFiles={10}
                maxSize={20}
                acceptedTypes={['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-4">Product Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Type
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white/90 text-black">
                    <option className="text-black">Select Product</option>
                    <option className="text-black">Black & White Documents</option>
                    <option className="text-black">Color Documents</option>
                    <option className="text-black">Business Cards</option>
                    <option className="text-black">Banners & Posters</option>
                    <option className="text-black">Stickers & Labels</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={orderData.quantity}
                    onChange={(e) => setOrderData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white/90 text-black"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={orderData.customerInfo.name}
                    onChange={(e) => setOrderData(prev => ({
                      ...prev,
                      customerInfo: { ...prev.customerInfo, name: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={orderData.customerInfo.email}
                    onChange={(e) => setOrderData(prev => ({
                      ...prev,
                      customerInfo: { ...prev.customerInfo, email: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={orderData.customerInfo.phone}
                    onChange={(e) => setOrderData(prev => ({
                      ...prev,
                      customerInfo: { ...prev.customerInfo, phone: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderData.customerInfo.company}
                    onChange={(e) => setOrderData(prev => ({
                      ...prev,
                      customerInfo: { ...prev.customerInfo, company: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Method
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className={`p-4 border rounded-lg cursor-pointer ${
                      orderData.deliveryInfo.method === 'pickup' ? 'border-orange-400 bg-white/10 backdrop-blur-sm/20 backdrop-blur-sm' : 'border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="pickup"
                        checked={orderData.deliveryInfo.method === 'pickup'}
                        onChange={(e) => setOrderData(prev => ({
                          ...prev,
                          deliveryInfo: { ...prev.deliveryInfo, method: e.target.value as 'pickup' | 'courier' }
                        }))}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <p className="font-medium">Store Pickup</p>
                        <p className="text-sm text-gray-800">Free</p>
                      </div>
                    </label>
                    <label className={`p-4 border rounded-lg cursor-pointer ${
                      orderData.deliveryInfo.method === 'courier' ? 'border-orange-400 bg-white/10 backdrop-blur-sm/20 backdrop-blur-sm' : 'border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="courier"
                        checked={orderData.deliveryInfo.method === 'courier'}
                        onChange={(e) => setOrderData(prev => ({
                          ...prev,
                          deliveryInfo: { ...prev.deliveryInfo, method: e.target.value as 'pickup' | 'courier' }
                        }))}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <p className="font-medium">Courier Delivery</p>
                        <p className="text-sm text-gray-800">₹50 - ₹100</p>
                      </div>
                    </label>
                  </div>
                </div>

                {orderData.deliveryInfo.method === 'courier' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Delivery Address</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          value={orderData.deliveryInfo.address.line1}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            deliveryInfo: {
                              ...prev.deliveryInfo,
                              address: { ...prev.deliveryInfo.address, line1: e.target.value }
                            }
                          }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          value={orderData.deliveryInfo.address.line2}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            deliveryInfo: {
                              ...prev.deliveryInfo,
                              address: { ...prev.deliveryInfo.address, line2: e.target.value }
                            }
                          }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={orderData.deliveryInfo.address.city}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            deliveryInfo: {
                              ...prev.deliveryInfo,
                              address: { ...prev.deliveryInfo.address, city: e.target.value }
                            }
                          }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={orderData.deliveryInfo.address.state}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            deliveryInfo: {
                              ...prev.deliveryInfo,
                              address: { ...prev.deliveryInfo.address, state: e.target.value }
                            }
                          }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={orderData.deliveryInfo.address.pincode}
                          onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            deliveryInfo: {
                              ...prev.deliveryInfo,
                              address: { ...prev.deliveryInfo.address, pincode: e.target.value }
                            }
                          }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-black mb-4" style={{ color: '#000000' }}>Payment Method</h3>
              <div className="space-y-4">
                <label className={`p-4 border rounded-lg cursor-pointer relative ${
                  orderData.paymentMethod === 'razorpay' 
                    ? 'border-blue-500 bg-white/30 backdrop-blur-sm' 
                    : 'border-gray-300 bg-white/20 backdrop-blur-sm'
                }`}>
                  <input
                    type="radio"
                    value="razorpay"
                    checked={orderData.paymentMethod === 'razorpay'}
                    onChange={(e) => setOrderData(prev => ({
                      ...prev,
                      paymentMethod: e.target.value as 'razorpay' | 'cod'
                    }))}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    {/* Selection indicator */}
                    {orderData.paymentMethod === 'razorpay' && (
                      <div className="w-4 h-4 bg-blue-500 rounded-sm flex-shrink-0"></div>
                    )}
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-black" style={{ color: '#000000' }}>Online Payment</p>
                      <p className="text-sm text-gray-700" style={{ color: '#374151' }}>Credit/Debit Card, UPI, Net Banking</p>
                    </div>
                  </div>
                </label>
                <label className={`p-4 border rounded-lg cursor-pointer relative ${
                  orderData.paymentMethod === 'cod' 
                    ? 'border-blue-500 bg-white/30 backdrop-blur-sm' 
                    : 'border-gray-300 bg-white/20 backdrop-blur-sm'
                }`}>
                  <input
                    type="radio"
                    value="cod"
                    checked={orderData.paymentMethod === 'cod'}
                    onChange={(e) => setOrderData(prev => ({
                      ...prev,
                      paymentMethod: e.target.value as 'razorpay' | 'cod'
                    }))}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    {/* Selection indicator */}
                    {orderData.paymentMethod === 'cod' && (
                      <div className="w-4 h-4 bg-blue-500 rounded-sm flex-shrink-0"></div>
                    )}
                    <Truck className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-black" style={{ color: '#000000' }}>Cash on Delivery</p>
                      <p className="text-sm text-gray-700" style={{ color: '#374151' }}>Pay when you receive your order</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-6">
              <h4 className="font-semibold text-black mb-4" style={{ color: '#000000' }}>Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-400">
                  <span className="text-black" style={{ color: '#000000' }}>Subtotal</span>
                  <span className="font-medium text-black" style={{ color: '#000000' }}>₹500.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-400">
                  <span className="text-black" style={{ color: '#000000' }}>Delivery</span>
                  <span className="font-medium text-black" style={{ color: '#000000' }}>₹50.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-400">
                  <span className="text-black" style={{ color: '#000000' }}>GST (18%)</span>
                  <span className="font-medium text-black" style={{ color: '#000000' }}>₹99.00</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-black text-lg" style={{ color: '#000000' }}>Total</span>
                    <span className="font-bold text-black text-lg" style={{ color: '#000000' }}>₹649.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return <div className="min-h-screen order-page">
      {/* Hero Section */}
      <section className="bg-transparent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Place Your Order
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Complete your printing order in just a few simple steps
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-transparent border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        ? 'bg-[#F16E02] border-blue-600 text-white'
                        : 'bg-white/10 backdrop-blur-sm border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-700'
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
      </section>

      {/* Order Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-8">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-300">
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
                  className="px-6 py-2 bg-[#F16E02] text-white rounded-lg font-medium hover:bg-[#F16518]"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                >
                  Place Order
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
  </div>
}
