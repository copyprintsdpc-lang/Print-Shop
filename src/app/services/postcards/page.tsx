'use client'

import Link from 'next/link'
import CardArt from '@/components/illustrations/CardArt'
import { formatINR } from '@/lib/currency'

export default function PostcardsPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-2 gap-8 items-start">
          <div className="border rounded-xl overflow-hidden h-64 bg-white/10 backdrop-blur-sm">
            <CardArt theme='blue' />
          </div>
          <div>
            <p className="text-sm text-green-700 font-medium mb-1">Same‑day available</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Postcards</h1>
            <p className="text-lg font-semibold text-gray-900 mt-2">{formatINR(19.99)}*</p>

            <ul className="mt-4 space-y-1 text-sm text-gray-700 list-disc list-inside">
              <li>Standard delivery in 5–7 business days</li>
              <li>Express delivery in 2–3 business days</li>
              <li>Order by noon for same‑day pickup by store closing</li>
              <li>Pickup in 5–7 business days</li>
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <div className="font-semibold">Size</div>
                <div className="flex gap-2 mt-1">
                  <span className="inline-block border rounded px-3 py-1 bg-transparent">4” × 6”</span>
                  <span className="inline-block border rounded px-3 py-1 bg-transparent">4” × 8”</span>
                  <span className="inline-block border rounded px-3 py-1 bg-transparent">5” × 7”</span>
                </div>
              </div>
              <div>
                <div className="font-semibold">Orientation</div>
                <div className="flex gap-2 mt-1">
                  <span className="inline-block border rounded px-3 py-1 bg-transparent">Horizontal</span>
                  <span className="inline-block border rounded px-3 py-1 bg-transparent">Vertical</span>
                </div>
              </div>
              <div>
                <div className="font-semibold">Sides</div>
                <div className="flex gap-2 mt-1">
                  <span className="inline-block border rounded px-3 py-1 bg-transparent">1‑Sided</span>
                  <span className="inline-block border rounded px-3 py-1 bg-transparent">2‑Sided</span>
                </div>
              </div>
            </div>

            <Link href="/quote" className="mt-5 inline-block bg-red-600 text-white rounded-md px-6 py-2 font-semibold hover:bg-red-700">Create Now</Link>

            <div className="mt-6 text-sm text-gray-800">
              <div className="font-semibold">How to get your order</div>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Delivery in 5–7 business days</li>
                <li>{formatINR(9.99)} shipping fee. Free on orders over {formatINR(75)}.</li>
                <li>Express delivery in 2–3 business days</li>
                <li>{formatINR(24.99)} shipping fee</li>
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
              <p>Postcards make your message pop right away—no envelope needed! Perfect for promotions, invites, and thank‑yous. Affordable to print and mail, especially in bulk, for any occasion or campaign.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Product Dimensions</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Sizes: 4” × 6”, 4” × 8”, 5” × 7”</li>
                <li>Orientation: Horizontal or Vertical</li>
                <li>Sides: 1‑Sided or 2‑Sided</li>
                <li>Paper stocks: Standard & Premium options</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Return Policy</h3>
              <p>Customized items are made specifically for you and are not returnable. If there’s an issue with print quality or damage, contact us within 7 days.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


