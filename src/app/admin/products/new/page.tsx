'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  Package,
  DollarSign,
  Tag
} from 'lucide-react'

interface ProductVariant {
  size: string
  material: string
  finish: string
  price: number
  sku?: string
  inStock: boolean
  name?: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: 'documents',
    basePrice: 0,
    sameDayEligible: false,
    sameDayCutoff: '12:00',
    featured: false,
    active: true,
    metaTitle: '',
    metaDescription: '',
    tags: [] as string[],
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    }
  })
  
  const [variants, setVariants] = useState<ProductVariant[]>([
    { size: '', material: '', finish: '', price: 0, sku: '', inStock: true, name: '' }
  ])
  
  const [images, setImages] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)

  const categories = [
    'documents',
    'business-cards',
    'posters-banners',
    'stickers-labels',
    'stationery',
    'custom'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...product,
        variants,
        images,
        pricingMethod: 'flat' as const,
        options: [],
        pricingTiers: []
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (data.ok) {
        router.push('/admin/products')
      } else {
        alert('Failed to create product: ' + data.message)
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error creating product')
    } finally {
      setLoading(false)
    }
  }

  const addVariant = () => {
    setVariants([...variants, { size: '', material: '', finish: '', price: 0, sku: '', inStock: true, name: '' }])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updatedVariants = variants.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    )
    setVariants(updatedVariants)
  }

  const addTag = () => {
    if (newTag.trim() && !product.tags.includes(newTag.trim())) {
      setProduct({ ...product, tags: [...product.tags, newTag.trim()] })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setProduct({ ...product, tags: product.tags.filter(tag => tag !== tagToRemove) })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const newImages: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'sdpc-print-media/products')
        formData.append('type', 'product')

        const response = await fetch('/api/admin/products/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (data.ok) {
          newImages.push(data.url)
        } else {
          console.error('Upload failed:', data.message)
        }
      } catch (error) {
        console.error('Upload error:', error)
      }
    }

    setImages(prev => [...prev, ...newImages])
    setUploadingImages(false)
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600 mt-2">Create a new product for your catalog</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={product.category}
                  onChange={(e) => setProduct({ ...product, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={product.basePrice}
                  onChange={(e) => setProduct({ ...product, basePrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (grams)
                </label>
                <input
                  type="number"
                  min="0"
                  value={product.weight}
                  onChange={(e) => setProduct({ ...product, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Length</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={product.dimensions.length}
                    onChange={(e) => setProduct({ 
                      ...product, 
                      dimensions: { ...product.dimensions, length: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Width</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={product.dimensions.width}
                    onChange={(e) => setProduct({ 
                      ...product, 
                      dimensions: { ...product.dimensions, width: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Height</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={product.dimensions.height}
                    onChange={(e) => setProduct({ 
                      ...product, 
                      dimensions: { ...product.dimensions, height: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Product Variants</h2>
              <button
                type="button"
                onClick={addVariant}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Variant {index + 1}</h3>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Variant Name
                      </label>
                      <input
                        type="text"
                        value={variant.name || ''}
                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Premium Matte"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size
                      </label>
                      <input
                        type="text"
                        required
                        value={variant.size}
                        onChange={(e) => updateVariant(index, 'size', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 3.5x2 inches"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Material
                      </label>
                      <input
                        type="text"
                        required
                        value={variant.material}
                        onChange={(e) => updateVariant(index, 'material', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Cardstock"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Finish
                      </label>
                      <input
                        type="text"
                        required
                        value={variant.finish}
                        onChange={(e) => updateVariant(index, 'finish', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Matte"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={variant.sku || ''}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Optional SKU"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      id={`inStock-${index}`}
                      checked={variant.inStock}
                      onChange={(e) => updateVariant(index, 'inStock', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`inStock-${index}`} className="ml-2 text-sm text-gray-700">
                      In Stock
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h2>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Product Images</h4>
              <p className="text-sm text-gray-600">
                Upload high-quality images for your product. Recommended size: 800x600px
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Product Images</h3>
                <p className="text-gray-500 mb-4">
                  Drag and drop images here, or click to select files
                </p>
                <p className="text-sm text-green-600 font-medium mb-4">
                  ✅ Powered by Cloudinary - Ready to upload!
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                  id="product-images"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="product-images"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                >
                  Select Images
                </label>
              </div>

              {/* Display uploaded images */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tags</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sameDayEligible"
                  checked={product.sameDayEligible}
                  onChange={(e) => setProduct({ ...product, sameDayEligible: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sameDayEligible" className="ml-2 text-sm text-gray-700">
                  Same Day Service Available
                </label>
              </div>
              
              {product.sameDayEligible && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Same Day Cutoff Time
                  </label>
                  <input
                    type="time"
                    value={product.sameDayCutoff}
                    onChange={(e) => setProduct({ ...product, sameDayCutoff: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={product.featured}
                  onChange={(e) => setProduct({ ...product, featured: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Featured Product
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={product.active}
                  onChange={(e) => setProduct({ ...product, active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                  Active Product
                </label>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={product.metaTitle}
                  onChange={(e) => setProduct({ ...product, metaTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SEO title for search engines"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={product.metaDescription}
                  onChange={(e) => setProduct({ ...product, metaDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SEO description for search engines"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
