'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Heart,
  Shield,
  Truck,
  CreditCard,
  Lock,
  Star,
  CheckCircle
} from 'lucide-react'

const cartItems = [
  {
    id: 1,
    name: 'Standard Business Cards',
    variant: 'Matte Finish',
    size: 'Standard (3.5" x 2")',
    quantity: 250,
    price: 0.80,
    total: 200.00,
    image: '/images/business-card-1.jpg',
    estimatedDelivery: 'Tomorrow',
    inStock: true
  },
  {
    id: 2,
    name: 'Professional Flyers',
    variant: 'Glossy Finish',
    size: 'A4 (8.3" x 11.7")',
    quantity: 100,
    price: 2.50,
    total: 250.00,
    image: '/images/flyer-1.jpg',
    estimatedDelivery: '2-3 days',
    inStock: true
  },
  {
    id: 3,
    name: 'Company Letterheads',
    variant: 'Premium Paper',
    size: 'A4 (8.3" x 11.7")',
    quantity: 500,
    price: 1.20,
    total: 600.00,
    image: '/images/letterhead-1.jpg',
    estimatedDelivery: '3-4 days',
    inStock: false
  }
]

const deliveryOptions = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    price: 0,
    estimatedDays: '3-5 days',
    description: 'Free delivery on orders above ₹500'
  },
  {
    id: 'express',
    name: 'Express Delivery',
    price: 50,
    estimatedDays: '1-2 days',
    description: 'Priority processing and delivery'
  },
  {
    id: 'same-day',
    name: 'Same Day Delivery',
    price: 100,
    estimatedDays: 'Same day',
    description: 'Order by 2 PM, delivered by 8 PM'
  }
]

export default function CartPage() {
  const [items, setItems] = useState(cartItems)
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0])
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [couponCode, setCouponCode] = useState('')

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity, total: item.price * newQuantity } : item
    ))
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const applyCoupon = () => {
    if (couponCode === 'WELCOME10') {
      setAppliedCoupon(couponCode)
      setCouponCode('')
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const deliveryFee = selectedDelivery.price
  const discount = appliedCoupon ? subtotal * 0.1 : 0
  const total = subtotal + deliveryFee - discount

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Shopping Cart</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your
              <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Cart
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Review your items and proceed to checkout
            </p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="relative py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-16 h-16 text-white/50" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-white/70 mb-8">Add some products to get started</p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Card</span>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                            <p className="text-white/70 text-sm">{item.variant}</p>
                            <p className="text-white/60 text-sm">{item.size}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-white/60 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 bg-white/10 border border-white/20 rounded hover:bg-white/20 transition-colors"
                            >
                              <Minus className="w-4 h-4 text-white" />
                            </button>
                            <span className="text-white font-semibold px-3">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 bg-white/10 border border-white/20 rounded hover:bg-white/20 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-white" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {item.inStock ? (
                              <div className="flex items-center gap-1 text-green-400 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                <span>In Stock</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                                <Star className="w-4 h-4" />
                                <span>Pre-order</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-white/70 text-sm">
                            Est. delivery: {item.estimatedDelivery}
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">₹{item.total.toFixed(2)}</div>
                            <div className="text-white/60 text-sm">₹{item.price}/piece</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sticky top-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                  {/* Delivery Options */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Delivery Options</h3>
                    <div className="space-y-2">
                      {deliveryOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedDelivery.id === option.id
                              ? 'border-orange-500 bg-orange-500/10'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            value={option.id}
                            checked={selectedDelivery.id === option.id}
                            onChange={() => setSelectedDelivery(option)}
                            className="sr-only"
                          />
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-white font-medium">{option.name}</div>
                              <div className="text-white/70 text-sm">{option.description}</div>
                              <div className="text-white/60 text-xs">{option.estimatedDays}</div>
                            </div>
                            <div className="text-white font-semibold">
                              {option.price === 0 ? 'Free' : `₹${option.price}`}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Coupon Code</h3>
                    {appliedCoupon ? (
                      <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-medium">{appliedCoupon} applied</span>
                        <button
                          onClick={() => setAppliedCoupon('')}
                          className="ml-auto text-green-400 hover:text-green-300"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                          onClick={applyCoupon}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-white/80">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Delivery</span>
                      <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount ({appliedCoupon})</span>
                        <span>-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3">
                      <div className="flex justify-between text-white font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 transform flex items-center justify-center gap-2 mb-4"
                  >
                    <Lock className="w-5 h-5" />
                    Proceed to Checkout
                  </Link>

                  {/* Security Badges */}
                  <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      <span>Easy Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Shop With Us?
            </h2>
            <p className="text-xl text-white/80">
              Your satisfaction is our priority
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">100% Secure</h3>
              <p className="text-white/70">Your payment and personal information is always protected</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Delivery</h3>
              <p className="text-white/70">Same day and express delivery options available</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quality Guarantee</h3>
              <p className="text-white/70">Not satisfied? We'll make it right or refund your money</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}