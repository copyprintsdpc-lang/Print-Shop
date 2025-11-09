'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Package, 
  DollarSign,
  Percent,
  Plus,
  Trash2,
  Search,
  Filter
} from 'lucide-react'

interface Product {
  _id: string
  name: string
  category: string
  basePrice: number
  variants: Array<{
    _id?: string
    size: string
    material: string
    finish: string
    price: number
    sku?: string
    inStock: boolean
    name?: string
  }>
  active: boolean
}

interface BulkPriceUpdate {
  productId: string
  productName: string
  basePrice?: number
  variants: Array<{
    variantId?: string
    size: string
    material: string
    finish: string
    newPrice: number
    oldPrice: number
    name?: string
  }>
}

export default function BulkPricingPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [updates, setUpdates] = useState<BulkPriceUpdate[]>([])
  const [updateType, setUpdateType] = useState<'percentage' | 'fixed'>('percentage')
  const [updateValue, setUpdateValue] = useState(0)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      
      if (data.ok) {
        setProducts(data.products)
      } else {
        console.error('Failed to fetch products:', data.message)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map(p => p.category))]

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id))
    }
  }

  const applyBulkUpdate = () => {
    if (updateValue === 0) return

    const newUpdates: BulkPriceUpdate[] = []
    
    selectedProducts.forEach(productId => {
      const product = products.find(p => p._id === productId)
      if (!product) return

      const productUpdate: BulkPriceUpdate = {
        productId: product._id,
        productName: product.name,
        variants: []
      }

      // Calculate new base price
      if (updateType === 'percentage') {
        productUpdate.basePrice = product.basePrice * (1 + updateValue / 100)
      } else {
        productUpdate.basePrice = product.basePrice + updateValue
      }

      // Calculate new variant prices
      product.variants.forEach(variant => {
        let newPrice = variant.price
        
        if (updateType === 'percentage') {
          newPrice = variant.price * (1 + updateValue / 100)
        } else {
          newPrice = variant.price + updateValue
        }

        productUpdate.variants.push({
          variantId: variant._id,
          size: variant.size,
          material: variant.material,
          finish: variant.finish,
          newPrice: Math.max(0, newPrice), // Ensure price doesn't go below 0
          oldPrice: variant.price,
          name: variant.name
        })
      })

      newUpdates.push(productUpdate)
    })

    setUpdates(newUpdates)
  }

  const handleSaveUpdates = async () => {
    if (updates.length === 0) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/products/bulk-pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      })

      const data = await response.json()

      if (data.ok) {
        alert('Prices updated successfully!')
        setUpdates([])
        setSelectedProducts([])
        setUpdateValue(0)
        fetchProducts() // Refresh products
      } else {
        alert('Failed to update prices: ' + data.message)
      }
    } catch (error) {
      console.error('Error updating prices:', error)
      alert('Error updating prices')
    } finally {
      setSaving(false)
    }
  }

  const clearUpdates = () => {
    setUpdates([])
    setSelectedProducts([])
    setUpdateValue(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Bulk Price Editor</h1>
              <p className="text-gray-600 mt-2">Update prices for multiple products at once</p>
            </div>
          </div>
        </div>

        {/* Bulk Update Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bulk Price Update</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Type
              </label>
              <select
                value={updateType}
                onChange={(e) => setUpdateType(e.target.value as 'percentage' | 'fixed')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {updateType === 'percentage' ? 'Percentage Change' : 'Amount to Add/Subtract'}
              </label>
              <div className="relative">
                {updateType === 'percentage' ? (
                  <Percent className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                ) : (
                  <DollarSign className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                )}
                <input
                  type="number"
                  value={updateValue}
                  onChange={(e) => setUpdateValue(parseFloat(e.target.value) || 0)}
                  className={`w-full ${updateType === 'percentage' ? 'pl-10' : 'pl-10'} pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder={updateType === 'percentage' ? '10' : '50'}
                />
              </div>
            </div>
            
            <div>
              <button
                onClick={applyBulkUpdate}
                disabled={selectedProducts.length === 0 || updateValue === 0}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Update
              </button>
            </div>
            
            <div>
              <button
                onClick={clearUpdates}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>
              {updateType === 'percentage' 
                ? `Selected products will have their prices ${updateValue >= 0 ? 'increased' : 'decreased'} by ${Math.abs(updateValue)}%`
                : `Selected products will have ₹${updateValue} ${updateValue >= 0 ? 'added to' : 'subtracted from'} their prices`
              }
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleSelectAll}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{product.basePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Updates Preview */}
        {updates.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Price Updates Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveUpdates}
                  disabled={saving}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save All Updates
                    </>
                  )}
                </button>
                <button
                  onClick={clearUpdates}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {updates.map((update, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{update.productName}</h3>
                    <div className="text-sm text-gray-500">
                      {update.basePrice && (
                        <span>
                          Base Price: ₹{update.basePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {update.variants.map((variant, variantIndex) => (
                      <div key={variantIndex} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          {variant.name || `${variant.size} - ${variant.material} - ${variant.finish}`}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">₹{variant.oldPrice.toFixed(2)}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium text-green-600">₹{variant.newPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Filter className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Selected Products</p>
                <p className="text-2xl font-bold text-gray-900">{selectedProducts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Updates</p>
                <p className="text-2xl font-bold text-gray-900">{updates.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
