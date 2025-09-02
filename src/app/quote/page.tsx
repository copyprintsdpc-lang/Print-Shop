'use client'

import { useState } from 'react'
import { Calculator, FileText, Star, Truck, Printer, ArrowRight, Upload } from 'lucide-react'
import Link from 'next/link'
import { getAllProducts, getProductsByCategory, Product } from '@/lib/products'
import PricingCalculator from '@/components/PricingCalculator'
import FileUpload from '@/components/FileUpload'
import { formatINR } from '@/lib/currency'

export default function QuotePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  const products = getAllProducts()
  const categories = [
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'business-cards', name: 'Business Cards', icon: Star },
    { id: 'posters-banners', name: 'Banners & Posters', icon: Truck },
    { id: 'stickers-labels', name: 'Stickers & Labels', icon: Printer }
  ]

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setCalculatedPrice(0)
    setSelectedOptions({})
  }

  const handlePriceChange = (price: number, options: Record<string, string>) => {
    setCalculatedPrice(price)
    setSelectedOptions(options)
  }

  const handleFilesChange = (files: any[]) => {
    setUploadedFiles(files)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center">
                <Calculator className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get Instant Quote
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Select your printing service and get an instant quote. 
              No hidden charges, transparent pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Services Selection */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Service
            </h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto">
              Select the type of printing service you need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              const categoryProducts = getProductsByCategory(category.id)
              const minPrice = Math.min(...categoryProducts.map(p => p.basePrice))
              
              return (
                <div 
                  key={category.id} 
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => {
                    if (categoryProducts.length > 0) {
                      handleProductSelect(categoryProducts[0])
                    }
                  }}
                >
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-800 mb-4">
                      {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} available
                    </p>
                    <div className="text-center">
                      <p className="text-sm text-gray-700">Starting from</p>
                      <p className="text-2xl font-bold text-blue-600">{formatINR(minPrice)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Product Selection and Configuration */}
      {selectedProduct && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Product Details */}
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-800 mb-4">{selectedProduct.description}</p>
                  
                  {/* Product Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Available Products:</h3>
                    <div className="space-y-2">
                      {getProductsByCategory(selectedProduct.category).map((product) => (
                        <div
                          key={product.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedProduct.id === product.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-800">Starting from {formatINR(product.basePrice)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600">{formatINR(product.basePrice)}</p>
                              {product.sameDayEligible && (
                                <p className="text-xs text-green-600">Same Day Available</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Files</h3>
                  <FileUpload
                    onFilesChange={handleFilesChange}
                    maxFiles={5}
                    maxSize={10}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']}
                  />
                </div>
              </div>

              {/* Pricing Calculator */}
              <div>
                <PricingCalculator
                  product={selectedProduct}
                  onPriceChange={handlePriceChange}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Order Summary and Checkout */}
      {selectedProduct && calculatedPrice > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-800">
                      {Object.entries(selectedOptions).map(([key, value]) => (
                        <span key={key} className="mr-2">
                          {key.replace('_', ' ')}: {value}
                        </span>
                      ))}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">₹{calculatedPrice.toFixed(2)}</span>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="py-3 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Uploaded Files ({uploadedFiles.length})</h4>
                    <div className="space-y-1">
                      {uploadedFiles.map((file, index) => (
                        <p key={index} className="text-sm text-gray-800">
                          • {file.file.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/order"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Proceed to Order
                </Link>
                <button
                  onClick={() => {
                    setSelectedProduct(null)
                    setCalculatedPrice(0)
                    setUploadedFiles([])
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Showcase */}
      {!selectedProduct && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Professional Printing Made Simple
              </h2>
              <p className="text-xl text-gray-800 mb-8">
                Get instant quotes, upload files, and place orders in minutes
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Pricing</h3>
                  <p className="text-gray-800">Real-time quotes based on your specifications</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Upload</h3>
                  <p className="text-gray-800">Drag & drop files with instant preview</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Order</h3>
                  <p className="text-gray-800">Seamless checkout and order tracking</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Need a Custom Quote?
          </h2>
          <p className="text-xl text-gray-800 mb-8">
            Contact us directly for complex projects or bulk orders
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+919876543210" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Call Now: +91 98765 43210
            </a>
            <a 
              href="mailto:info@copyprintshop.com" 
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
