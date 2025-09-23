'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Shield,
  CheckCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Truck,
  Star
} from 'lucide-react'

const paymentMethods = [
  {
    id: 'razorpay',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
    popular: true
  },
  {
    id: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm',
    icon: CreditCard,
    popular: true
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All major banks',
    icon: CreditCard,
    popular: false
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive',
    icon: CreditCard,
    popular: false
  }
]

const deliverySlots = [
  {
    id: 'today',
    date: 'Today',
    time: '2:00 PM - 6:00 PM',
    available: true,
    popular: true
  },
  {
    id: 'tomorrow-morning',
    date: 'Tomorrow',
    time: '9:00 AM - 12:00 PM',
    available: true,
    popular: false
  },
  {
    id: 'tomorrow-evening',
    date: 'Tomorrow',
    time: '2:00 PM - 6:00 PM',
    available: true,
    popular: false
  },
  {
    id: 'day-after',
    date: 'Day After',
    time: '9:00 AM - 6:00 PM',
    available: true,
    popular: false
  }
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Delivery Address
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    
    // Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Preferences
    saveAddress: true,
    newsletter: false
  })
  
  const [selectedPayment, setSelectedPayment] = useState('razorpay')
  const [selectedDelivery, setSelectedDelivery] = useState('today')
  const [showCVV, setShowCVV] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      // Redirect to success page
      window.location.href = '/order-success'
    }, 3000)
  }

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Delivery', icon: MapPin },
    { number: 3, title: 'Payment', icon: CreditCard }
  ]

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Secure Checkout</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Complete Your
              <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Order
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Secure checkout with multiple payment options
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="relative py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.number
                const isCompleted = currentStep > step.number
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isActive 
                        ? 'border-orange-500 bg-orange-500 text-white' 
                        : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-white/30 text-white/50'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-white' : 'text-white/70'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="relative py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="animate-slide-in-left">
                      <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your first name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your last name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Delivery Address */}
                  {currentStep === 2 && (
                    <div className="animate-slide-in-left">
                      <h2 className="text-2xl font-bold text-white mb-6">Delivery Address</h2>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Complete Address *
                          </label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your complete address"
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Enter city"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Enter state"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              Pincode *
                            </label>
                            <input
                              type="text"
                              name="pincode"
                              value={formData.pincode}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Enter pincode"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Landmark (Optional)
                          </label>
                          <input
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter landmark"
                          />
                        </div>

                        {/* Delivery Time Slots */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">Choose Delivery Time</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {deliverySlots.map((slot) => (
                              <label
                                key={slot.id}
                                className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                                  selectedDelivery === slot.id
                                    ? 'border-orange-500 bg-orange-500/10'
                                    : 'border-white/20 hover:border-white/40'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="delivery"
                                  value={slot.id}
                                  checked={selectedDelivery === slot.id}
                                  onChange={(e) => setSelectedDelivery(e.target.value)}
                                  className="sr-only"
                                />
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="text-white font-medium">{slot.date}</div>
                                    <div className="text-white/70 text-sm">{slot.time}</div>
                                  </div>
                                  {slot.popular && (
                                    <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">
                                      Popular
                                    </span>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {currentStep === 3 && (
                    <div className="animate-slide-in-left">
                      <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
                      
                      {/* Payment Methods */}
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {paymentMethods.map((method) => {
                            const Icon = method.icon
                            return (
                              <label
                                key={method.id}
                                className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                                  selectedPayment === method.id
                                    ? 'border-orange-500 bg-orange-500/10'
                                    : 'border-white/20 hover:border-white/40'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="payment"
                                  value={method.id}
                                  checked={selectedPayment === method.id}
                                  onChange={(e) => setSelectedPayment(e.target.value)}
                                  className="sr-only"
                                />
                                <div className="flex items-center gap-3">
                                  <Icon className="w-6 h-6 text-white" />
                                  <div>
                                    <div className="text-white font-medium">{method.name}</div>
                                    <div className="text-white/70 text-sm">{method.description}</div>
                                  </div>
                                  {method.popular && (
                                    <span className="ml-auto bg-orange-500 text-white px-2 py-1 rounded text-xs">
                                      Popular
                                    </span>
                                  )}
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      </div>

                      {/* Card Details (if card payment selected) */}
                      {selectedPayment === 'razorpay' && (
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-white mb-4">Card Details</h3>
                          
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              Card Number *
                            </label>
                            <input
                              type="text"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Expiry Date *
                              </label>
                              <input
                                type="text"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="MM/YY"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                CVV *
                              </label>
                              <div className="relative">
                                <input
                                  type={showCVV ? 'text' : 'password'}
                                  name="cvv"
                                  value={formData.cvv}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  placeholder="123"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCVV(!showCVV)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                                >
                                  {showCVV ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              Cardholder Name *
                            </label>
                            <input
                              type="text"
                              name="cardName"
                              value={formData.cardName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Enter cardholder name"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Previous
                      </button>
                    )}
                    
                    <div className="ml-auto">
                      {currentStep < 3 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                        >
                          Next Step
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              Complete Order
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sticky top-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium">Business Cards</div>
                        <div className="text-white/70 text-sm">250 pieces</div>
                      </div>
                      <div className="text-white font-semibold">₹200.00</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium">Professional Flyers</div>
                        <div className="text-white/70 text-sm">100 pieces</div>
                      </div>
                      <div className="text-white font-semibold">₹250.00</div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-white/80">
                      <span>Subtotal</span>
                      <span>₹450.00</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Delivery</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-green-400">
                      <span>Discount (WELCOME10)</span>
                      <span>-₹45.00</span>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <div className="flex justify-between text-white font-semibold text-lg">
                        <span>Total</span>
                        <span>₹405.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Badges */}
                  <div className="flex items-center justify-center gap-4 text-white/60 text-sm mb-6">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      <span>256-bit</span>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-white/70 text-sm mb-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>4.9/5 Customer Rating</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
                      <Truck className="w-4 h-4 text-green-400" />
                      <span>10,000+ Orders Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}