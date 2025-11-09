'use client'

import { Upload, CheckCircle, Clock, Package, Phone, Info } from 'lucide-react'
import QuoteFormMVP from '@/components/QuoteFormMVP'

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Compact Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 py-12 relative overflow-hidden">
        <div className="absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Get Your Quote
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Upload files, select details, and receive pricing
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column: Quote Form */}
            <div className="lg:w-3/4 w-full flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 lg:p-12 border-2 border-blue-100">
                <QuoteFormMVP />
              </div>
            </div>

            {/* Right Column: Paper Size Guide Image & Table */}
            <div className="lg:w-1/4 w-full flex-shrink-0 lg:sticky lg:top-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-blue-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Paper Size Guide (A-Series)
                </h2>
                
                {/* Paper Size Guide Image */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3 text-center">
                    A-series paper size guide with dimensions showing A0 to A7 sizes
                  </p>
                  <img
                    src="/images/paper-size-guide.png"
                    alt="A-series paper size guide with dimensions showing A0 to A7 sizes"
                    className="w-full h-auto rounded-lg border border-gray-200"
                    onError={(e) => {
                      // Hide image if it fails to load
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>

                {/* Paper Sizes Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">Format</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">Width × Height (mm)</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">Width × Height (cm)</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">Width × Height (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">A0</td>
                        <td className="border border-gray-300 px-3 py-2">841 × 1189</td>
                        <td className="border border-gray-300 px-3 py-2">84.1 × 118.9</td>
                        <td className="border border-gray-300 px-3 py-2">33.1 × 46.8</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">A1</td>
                        <td className="border border-gray-300 px-3 py-2">594 × 841</td>
                        <td className="border border-gray-300 px-3 py-2">59.5 × 84.1</td>
                        <td className="border border-gray-300 px-3 py-2">23.4 × 33.1</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">A2</td>
                        <td className="border border-gray-300 px-3 py-2">420 × 594</td>
                        <td className="border border-gray-300 px-3 py-2">42 × 59.4</td>
                        <td className="border border-gray-300 px-3 py-2">16.5 × 23.4</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">A3</td>
                        <td className="border border-gray-300 px-3 py-2">297 × 420</td>
                        <td className="border border-gray-300 px-3 py-2">29.7 × 42</td>
                        <td className="border border-gray-300 px-3 py-2">11.7 × 16.5</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">A4</td>
                        <td className="border border-gray-300 px-3 py-2">210 × 297</td>
                        <td className="border border-gray-300 px-3 py-2">21 × 29.7</td>
                        <td className="border border-gray-300 px-3 py-2">8.3 × 11.7</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">A5</td>
                        <td className="border border-gray-300 px-3 py-2">148 × 210</td>
                        <td className="border border-gray-300 px-3 py-2">14.8 × 21</td>
                        <td className="border border-gray-300 px-3 py-2">5.8 × 8.3</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">A6</td>
                        <td className="border border-gray-300 px-3 py-2">105 × 148</td>
                        <td className="border border-gray-300 px-3 py-2">10.5 × 14.8</td>
                        <td className="border border-gray-300 px-3 py-2">4.1 × 5.8</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">A7</td>
                        <td className="border border-gray-300 px-3 py-2">74 × 105</td>
                        <td className="border border-gray-300 px-3 py-2">7.4 × 10.5</td>
                        <td className="border border-gray-300 px-3 py-2">2.9 × 4.1</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">A8</td>
                        <td className="border border-gray-300 px-3 py-2">52 × 74</td>
                        <td className="border border-gray-300 px-3 py-2">5.2 × 7.4</td>
                        <td className="border border-gray-300 px-3 py-2">2.0 × 2.9</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">A9</td>
                        <td className="border border-gray-300 px-3 py-2">37 × 52</td>
                        <td className="border border-gray-300 px-3 py-2">3.7 × 5.3</td>
                        <td className="border border-gray-300 px-3 py-2">1.5 × 2.0</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">A10</td>
                        <td className="border border-gray-300 px-3 py-2">26 × 37</td>
                        <td className="border border-gray-300 px-3 py-2">2.6 × 3.7</td>
                        <td className="border border-gray-300 px-3 py-2">1.0 × 1.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                  Paper sizes chart of the A series in mm, cm and inches
                </p>
              </div>
            </div>
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
          <p className="text-white/90 text-sm mb-4">
            Need immediate assistance? Call us now!
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
            <p className="text-yellow-800 text-sm flex items-center justify-center gap-2">
              <Info className="w-4 h-4" />
              If something goes wrong with quote submission, please call customer care for assistance.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
