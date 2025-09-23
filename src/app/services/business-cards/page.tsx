'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Heart, 
  Share2, 
  Download,
  Upload,
  Palette,
  Zap,
  Shield,
  Truck,
  Award,
  Minus,
  Plus,
  ShoppingCart
} from 'lucide-react'

const productVariants = [
  {
    id: 1,
    name: 'Standard Business Cards',
    price: 0.80,
    originalPrice: 1.20,
    description: 'High-quality matte finish business cards',
    features: ['Matte Finish', 'Standard Size', 'Same Day Print', 'Free Design'],
    image: '/images/business-card-1.jpg',
    popular: true
  },
  {
    id: 2,
    name: 'Spot UV Business Cards',
    price: 1.50,
    originalPrice: 2.00,
    description: 'Premium cards with selective glossy UV coating',
    features: ['Spot UV Finish', 'Premium Paper', 'Custom Design', 'Express Delivery'],
    image: '/images/business-card-2.jpg',
    popular: false
  },
  {
    id: 3,
    name: 'Raised Foil Business Cards',
    price: 2.50,
    originalPrice: 3.00,
    description: 'Luxury cards with raised metallic foil elements',
    features: ['Raised Foil', 'Luxury Paper', 'Premium Design', 'White Glove Service'],
    image: '/images/business-card-3.jpg',
    popular: false
  },
  {
    id: 4,
    name: 'Embossed Business Cards',
    price: 2.00,
    originalPrice: 2.50,
    description: 'Elegant cards with embossed text and logos',
    features: ['Embossed Text', 'Premium Finish', 'Custom Logo', 'Fast Turnaround'],
    image: '/images/business-card-4.jpg',
    popular: false
  }
]

const sizes = [
  { name: 'Standard (3.5" x 2")', value: 'standard', popular: true },
  { name: 'Square (2.5" x 2.5")', value: 'square', popular: false },
  { name: 'Mini (2" x 1.5")', value: 'mini', popular: false },
  { name: 'Custom Size', value: 'custom', popular: false }
]

const quantities = [
  { value: 100, price: 0.80, popular: false },
  { value: 250, price: 0.70, popular: true },
  { value: 500, price: 0.60, popular: false },
  { value: 1000, price: 0.50, popular: false },
  { value: 2000, price: 0.45, popular: false }
]

export default function BusinessCardsPage() {
  const [selectedVariant, setSelectedVariant] = useState(productVariants[0])
  const [selectedSize, setSelectedSize] = useState(sizes[0])
  const [selectedQuantity, setSelectedQuantity] = useState(quantities[1])
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)

  const calculatePrice = () => {
    const basePrice = selectedVariant.price
    const quantityPrice = selectedQuantity.price
    return (basePrice * quantityPrice * quantity).toFixed(2)
  }

  const calculateSavings = () => {
    const originalPrice = selectedVariant.originalPrice * selectedQuantity.value * quantity
    const currentPrice = parseFloat(calculatePrice())
    return (originalPrice - currentPrice).toFixed(2)
  }

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Business Cards</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional
              <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Business Cards
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Make a lasting impression with our premium business cards. Choose from multiple finishes, 
              sizes, and designs to create the perfect card for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Product Variants */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Style
            </h2>
            <p className="text-xl text-white/80">
              Select from our range of premium business card options
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productVariants.map((variant) => (
              <div
                key={variant.id}
                className={`relative bg-white/10 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedVariant.id === variant.id
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-white/20 hover:border-white/40'
                }`}
                onClick={() => setSelectedVariant(variant)}
              >
                {variant.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="w-24 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">Card</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{variant.name}</h3>
                  <p className="text-white/70 text-sm mb-4">{variant.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {variant.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-white/80 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-orange-400">₹{variant.price}</span>
                    <span className="text-white/60 line-through">₹{variant.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Configuration */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="animate-slide-in-left">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="absolute top-8 left-8 right-8">
                    <div className="h-3 bg-white/30 rounded mb-3"></div>
                    <div className="h-2 bg-white/20 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-white/20 rounded w-1/2"></div>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="h-2 bg-white/20 rounded w-1/3 mb-2"></div>
                    <div className="h-2 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 mt-6">
                  <button className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                    <Heart className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-white'}`} />
                  </button>
                  <button className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="animate-slide-in-right">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-orange-400 font-semibold text-sm uppercase tracking-wide">Featured Product</span>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">{selectedVariant.name}</h2>
                <p className="text-white/80 mb-6">{selectedVariant.description}</p>

                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Size</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size.value}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedSize.value === size.value
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        <div className="text-white font-medium">{size.name}</div>
                        {size.popular && (
                          <div className="text-orange-400 text-xs mt-1">Popular</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {quantities.map((qty) => (
                      <button
                        key={qty.value}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          selectedQuantity.value === qty.value
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                        onClick={() => setSelectedQuantity(qty)}
                      >
                        <div className="text-white font-medium">{qty.value}</div>
                        <div className="text-white/60 text-sm">₹{qty.price}/card</div>
                        {qty.popular && (
                          <div className="text-orange-400 text-xs mt-1">Best Value</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Multiplier */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Sets</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-white font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80">Total Cards</span>
                    <span className="text-white font-semibold">{selectedQuantity.value * quantity}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80">Price per card</span>
                    <span className="text-white font-semibold">₹{selectedVariant.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80">You save</span>
                    <span className="text-green-400 font-semibold">₹{calculateSavings()}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold text-lg">Total</span>
                      <span className="text-orange-400 font-bold text-2xl">₹{calculatePrice()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 transform flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Design
                  </button>
                  <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                    <Palette className="w-5 h-5" />
                    Design Online
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Our Business Cards?
            </h2>
            <p className="text-xl text-white/80">
              Premium quality and professional service guaranteed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Same Day Print</h3>
              <p className="text-white/70">Order by noon, ready by evening</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quality Guarantee</h3>
              <p className="text-white/70">100% satisfaction or money back</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Free Delivery</h3>
              <p className="text-white/70">On orders above ₹500</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Materials</h3>
              <p className="text-white/70">Only the finest paper and finishes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to create your perfect business card?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Start designing now and get your professional business cards delivered tomorrow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/quote" 
              className="text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/50 border border-orange-300/30 hover:bg-[#F16518]"
              style={{ backgroundColor: '#F16E02' }}
            >
              Get Instant Quote
            </Link>
            <Link 
              href="/design-studio" 
              className="border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 hover:border-white hover:scale-105 transition-all duration-300"
            >
              Start Designing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}