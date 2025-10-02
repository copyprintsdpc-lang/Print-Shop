'use client'

import Link from 'next/link'
import CardArt from '@/components/illustrations/CardArt'

export default function BrochuresPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-2 gap-8 items-start">
          <div className="border rounded-xl overflow-hidden h-64 bg-gray-100">
            <CardArt theme='rose' />
          </div>
          <div>
            <p className="text-sm text-green-700 font-medium mb-1">Same‑day available</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Brochures</h1>
            <p className="text-lg font-semibold text-gray-900 mt-2">₹28.99*</p>
            <ul className="mt-4 space-y-1 text-sm text-gray-700 list-disc list-inside">
              <li>Standard delivery in 5–7 business days</li>
              <li>Express delivery in 2–3 business days</li>
              <li>Order by noon for same‑day pickup by store closing</li>
              <li>Pickup in 5–7 business days</li>
            </ul>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <div className="font-semibold">Size</div>
                <div>8.5” × 11”</div>
              </div>
              <div>
                <div className="font-semibold">Orientation</div>
                <div>Horizontal</div>
              </div>
              <div>
                <div className="font-semibold">Sides</div>
                <div>2‑Sided</div>
              </div>
            </div>
            <Link href="/quote" className="mt-5 inline-block bg-red-600 text-white rounded-md px-6 py-2 font-semibold hover:bg-red-700">Create Now</Link>
            <div className="mt-6 text-sm text-gray-800">
              <div className="font-semibold">How to get your order</div>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Delivery in 5–7 business days</li>
                <li>₹9.99 shipping fee. Free on orders over ₹75.</li>
                <li>Express delivery in 2–3 business days</li>
                <li>₹24.99 shipping fee</li>
                <li>Free pickup in‑store today</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p>Need a simple, polished way to share your message? Our custom tri‑fold brochures pack your visuals and text into one easy‑to‑read piece—perfect for events, mailers, or office displays.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Product Dimensions</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Size: 11” × 8.5” Landscape</li>
                <li>Orientation: Tri‑fold, Double‑sided</li>
                <li>Finish options: Matte (32lb paper) or Gloss (80lb Text Gloss)</li>
                <li>Available for same‑day service</li>
                <li>Ideal for events, storefronts, direct mail, and more</li>
                <li>Available in packs of 25 to 1000</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


