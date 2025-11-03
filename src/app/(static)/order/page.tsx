'use client'

import { Upload, CheckCircle, Clock, Package, Phone, Info } from 'lucide-react'
import QuoteFormMVP from '@/components/QuoteFormMVP'
import PaperSizeGuide from '@/components/PaperSizeGuide'

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Compact Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-12 relative overflow-hidden">
        <div className="absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Place Your Order
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Submit your request and get pricing
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Form First */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-blue-100">
            <QuoteFormMVP />
          </div>
        </div>
      </section>

      {/* Compact How It Works */}
      <section className="py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Easy Ordering
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload Files</h3>
              <p className="text-sm text-gray-600">JPG, PNG, PDF, SVG</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Select Details</h3>
              <p className="text-sm text-gray-600">Size & delivery</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Receive Quote</h3>
              <p className="text-sm text-gray-600">Quick turnaround</p>
            </div>
          </div>
        </div>
      </section>

      {/* Paper Size Guide */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Need Help Choosing Size?</h3>
            </div>
            <PaperSizeGuide />
          </div>
        </div>
      </section>

      {/* Compact Contact Footer */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-8">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Phone className="w-6 h-6 text-white" />
            <a 
              href="tel:+918897379737" 
              className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors"
            >
              +91 8897379737
            </a>
          </div>
          <p className="text-white/90 text-sm">
            Need immediate assistance? Call us now!
          </p>
        </div>
      </section>
    </div>
  )
}
