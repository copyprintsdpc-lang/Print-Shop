'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Star, 
  ArrowRight, 
  Filter, 
  Grid, 
  List,
  Search,
  SortAsc,
  SortDesc,
  Heart,
  ShoppingCart,
  Eye
} from 'lucide-react'
import { getProductImageUrls, getPlaceholderImageUrl } from '@/lib/cloudinary'

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
  images: Array<{
    id: number
    url: string
    alternativeText: string
  }>
  variants: Array<{
    id: number
    size: string
    material: string
    finish: string
    price: number
  }>
  featured: boolean
  popular: boolean
}

interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: {
    url: string
    alternativeText: string
  }
}

export default function CategoryPage() {
  const params = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popular'>('popular')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])

  useEffect(() => {
    fetchCategoryData()
  }, [params.slug])

  const fetchCategoryData = async () => {
    try {
      setLoading(true)
      
      // Fetch category details
      const categoryResponse = await fetch(`/api/categories/${params.slug}`)
      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json()
        setCategory(categoryData)
      }

      // Fetch products for this category
      const productsResponse = await fetch(`/api/categories/${params.slug}/products`)
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData)
      }
    } catch (error) {
      console.error('Failed to fetch category data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPrice = product.base_price >= priceRange.min && product.base_price <= priceRange.max
    
    const matchesMaterial = selectedMaterials.length === 0 || 
                           product.variants.some(variant => selectedMaterials.includes(variant.material))
    
    const matchesSize = selectedSizes.length === 0 || 
                       product.variants.some(variant => selectedSizes.includes(variant.size))

    return matchesSearch && matchesPrice && matchesMaterial && matchesSize
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'price':
        comparison = a.base_price - b.base_price
        break
      case 'popular':
        comparison = (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const uniqueMaterials = [...new Set(products.flatMap(p => p.variants.map(v => v.material)))]
  const uniqueSizes = [...new Set(products.flatMap(p => p.variants.map(v => v.size)))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Category not found</h1>
          <Link href="/services" className="text-orange-400 hover:text-orange-300">
            Back to Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      {/* Category Header */}
      <section className="relative py-20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">{category.name}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {category.name}
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {category.description || `Explore our collection of ${category.name.toLowerCase()} products`}
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="relative py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="flex gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="popular">Popular</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-3 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
                </button>
              </div>

              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Materials */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Materials</label>
                <div className="flex flex-wrap gap-2">
                  {uniqueMaterials.map(material => (
                    <button
                      key={material}
                      onClick={() => {
                        setSelectedMaterials(prev => 
                          prev.includes(material) 
                            ? prev.filter(m => m !== material)
                            : [...prev, material]
                        )
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedMaterials.includes(material)
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {uniqueSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSizes(prev => 
                          prev.includes(size) 
                            ? prev.filter(s => s !== size)
                            : [...prev, size]
                        )
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={`${
            viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-6'
          }`}>
            {sortedProducts.map((product, index) => (
              <div
                key={product.id}
                className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 transform animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {viewMode === 'grid' ? (
                  <div className="p-6">
                    {/* Product Image */}
                    <div className="relative mb-4">
                      <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={getProductImageUrls(product.images[0].url, 'business-card').card}
                            alt={product.images[0].alternativeText || product.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">No Image</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex gap-2">
                        {product.featured && (
                          <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </span>
                        )}
                        {product.popular && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Popular
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <Heart className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-white/70 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Variants */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.variants.slice(0, 3).map((variant, idx) => (
                          <span key={idx} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
                            {variant.size}
                          </span>
                        ))}
                        {product.variants.length > 3 && (
                          <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
                            +{product.variants.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-orange-400">₹{product.base_price}</div>
                        <div className="text-white/60 text-sm">Starting from</div>
                      </div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1"
                      >
                        View
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex p-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={getProductImageUrls(product.images[0].url, 'business-card').card}
                          alt={product.images[0].alternativeText || product.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 ml-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{product.name}</h3>
                          <p className="text-white/70 text-sm mb-3">{product.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-400">₹{product.base_price}</div>
                          <div className="text-white/60 text-sm">Starting from</div>
                        </div>
                      </div>

                      {/* Variants */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.variants.map((variant, idx) => (
                          <span key={idx} className="text-sm bg-white/10 text-white/70 px-3 py-1 rounded-full">
                            {variant.size} - {variant.material} - ₹{variant.price}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Link
                          href={`/product/${product.slug}`}
                          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                          <Heart className="w-5 h-5 text-white" />
                        </button>
                        <button className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-16 h-16 text-white/50" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">No products found</h2>
              <p className="text-white/70 mb-8">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setPriceRange({ min: 0, max: 1000 })
                  setSelectedMaterials([])
                  setSelectedSizes([])
                }}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
