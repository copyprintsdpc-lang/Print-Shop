'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Star, 
  ArrowRight, 
  Heart, 
  Share2, 
  Download,
  Upload,
  Palette,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  Shield,
  Award,
  Zap,
  Eye,
  ZoomIn
} from 'lucide-react'
import { getProductImageUrls, getPlaceholderImageUrl } from '@/lib/cloudinary'

interface ProductVariant {
  id: number
  size: string
  material: string
  finish: string
  price: number
}

interface ProductImage {
  id: number
  url: string
  alternativeText: string
}

interface Product {
  id: number
  name: string
  slug: string
  description: string
  base_price: number
  category: {
    name: string
    slug: string
  }
  images: ProductImage[]
  variants: ProductVariant[]
  featured: boolean
  popular: boolean
  specifications: string[]
  features: string[]
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description')

  useEffect(() => {
    fetchProduct()
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${params.slug}`)
      
      if (response.ok) {
        const productData = await response.json()
        setProduct(productData)
        
        // Set default variant
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const calculatePrice = () => {
    if (!selectedVariant) return product?.base_price || 0
    return selectedVariant.price * quantity
  }

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return
    
    // Add to cart logic here
    console.log('Adding to cart:', {
      product: product.id,
      variant: selectedVariant.id,
      quantity: quantity
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <Link href="/services" className="text-orange-400 hover:text-orange-300">
            Back to Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      {/* Breadcrumb */}
      <section className="relative py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-white/60 hover:text-white">Home</Link>
            <ArrowRight className="w-4 h-4 text-white/60" />
            <Link href="/services" className="text-white/60 hover:text-white">Services</Link>
            <ArrowRight className="w-4 h-4 text-white/60" />
            <Link href={`/category/${product.category.slug}`} className="text-white/60 hover:text-white">
              {product.category.name}
            </Link>
            <ArrowRight className="w-4 h-4 text-white/60" />
            <span className="text-white">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="relative py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="animate-slide-in-left">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden cursor-pointer group"
                     onClick={() => setShowImageModal(true)}>
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={getProductImageUrls(product.images[selectedImage].url, 'business-card').gallery}
                      alt={product.images[selectedImage].alternativeText || product.name}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">No Image</span>
                    </div>
                  )}
                  
                  {/* Zoom Icon */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ZoomIn className="w-12 h-12 text-white" />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.featured && (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    )}
                    {product.popular && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index 
                            ? 'border-orange-500' 
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <Image
                          src={getProductImageUrls(image.url, 'business-card').thumbnail}
                          alt={image.alternativeText || product.name}
                          width={150}
                          height={150}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="animate-slide-in-right">
              <div className="space-y-6">
                {/* Category */}
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/category/${product.category.slug}`}
                    className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                  >
                    {product.category.name}
                  </Link>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="text-white/80 text-lg leading-relaxed">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-orange-400">
                    ₹{selectedVariant ? selectedVariant.price : product.base_price}
                  </div>
                  <div className="text-white/60 line-through">
                    ₹{Math.round((selectedVariant ? selectedVariant.price : product.base_price) * 1.2)}
                  </div>
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    Save 20%
                  </div>
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Choose Options</h3>
                    
                    {/* Size */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Size</label>
                      <div className="grid grid-cols-2 gap-3">
                        {Array.from(new Set(product.variants.map(v => v.size))).map(size => (
                          <button
                            key={size}
                            onClick={() => {
                              const variant = product.variants.find(v => v.size === size)
                              if (variant) handleVariantChange(variant)
                            }}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedVariant?.size === size
                                ? 'border-orange-500 bg-orange-500/10'
                                : 'border-white/20 hover:border-white/40'
                            }`}
                          >
                            <div className="text-white font-medium">{size}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Material */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Material</label>
                      <div className="grid grid-cols-2 gap-3">
                        {Array.from(new Set(product.variants.map(v => v.material))).map(material => (
                          <button
                            key={material}
                            onClick={() => {
                              const variant = product.variants.find(v => v.material === material)
                              if (variant) handleVariantChange(variant)
                            }}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedVariant?.material === material
                                ? 'border-orange-500 bg-orange-500/10'
                                : 'border-white/20 hover:border-white/40'
                            }`}
                          >
                            <div className="text-white font-medium">{material}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Finish */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Finish</label>
                      <div className="grid grid-cols-2 gap-3">
                        {Array.from(new Set(product.variants.map(v => v.finish))).map(finish => (
                          <button
                            key={finish}
                            onClick={() => {
                              const variant = product.variants.find(v => v.finish === finish)
                              if (variant) handleVariantChange(variant)
                            }}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedVariant?.finish === finish
                                ? 'border-orange-500 bg-orange-500/10'
                                : 'border-white/20 hover:border-white/40'
                            }`}
                          >
                            <div className="text-white font-medium">{finish}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-white">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-white font-semibold px-4">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 transform flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart - ₹{calculatePrice()}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                      <Upload className="w-5 h-5" />
                      Upload Design
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                      <Palette className="w-5 h-5" />
                      Design Online
                    </button>
                  </div>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-3 rounded-lg transition-colors ${
                      isFavorited 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 bg-white/10 rounded-lg text-white/70 hover:bg-white/20 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-white/10 rounded-lg text-white/70 hover:bg-white/20 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="relative py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-white/20">
              {[
                { id: 'description', label: 'Description', icon: Eye },
                { id: 'specifications', label: 'Specifications', icon: CheckCircle },
                { id: 'reviews', label: 'Reviews', icon: Star }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/80 text-lg leading-relaxed">
                    {product.description}
                  </p>
                  
                  {product.features && product.features.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-white/80">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Product Specifications</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/70">Category</span>
                        <span className="text-white">{product.category.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/70">Base Price</span>
                        <span className="text-white">₹{product.base_price}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/70">Available Variants</span>
                        <span className="text-white">{product.variants?.length || 0}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/70">Featured</span>
                        <span className="text-white">{product.featured ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/70">Popular</span>
                        <span className="text-white">{product.popular ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/70">Images</span>
                        <span className="text-white">{product.images?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Customer Reviews</h3>
                  
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/70">No reviews yet. Be the first to review this product!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Our Products?
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
    </div>
  )
}
