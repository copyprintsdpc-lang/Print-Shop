'use client'

import Link from 'next/link'
import CardArt from '@/components/illustrations/CardArt'
import { formatINR } from '@/lib/currency'

export default function LabelsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Mailing and Organization Labels</h1>
          <p className="text-gray-600">From return address labels to extra‑large labels, find a size that works for you.</p>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Labels that deliver (literally)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Mailing Labels */}
            <div className="border rounded-xl overflow-hidden">
              <div className="h-40 bg-gray-100"><CardArt theme='rose' /></div>
              <div className="p-5">
                <p className="text-xs text-green-700 font-semibold mb-2">Same‑day available</p>
                <h3 className="text-lg font-semibold text-gray-900">Mailing Labels</h3>
                <p className="text-sm text-gray-600 mt-2">Whether you’re shipping, sorting, or just trying to look tidy, these durable, easy‑to‑apply mailing labels get it done.</p>
                <ul className="mt-3 text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Available in 3 sizes: Small (1" × 2‑5/8"), Medium (2" × 4"), Large (3‑1/3" × 4")</li>
                  <li>Matte or Gloss finish</li>
                  <li>Order by noon for same‑day pickup by store closing</li>
                </ul>
                <p className="text-sm text-gray-700 mt-3">Starting at <span className="font-semibold">{formatINR(2.99)}</span>*</p>
                <Link href="/quote" className="mt-4 inline-block bg-red-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-red-700">Create Mailing Label</Link>
              </div>
            </div>

            {/* Index Labels */}
            <div className="border rounded-xl overflow-hidden">
              <div className="h-40 bg-gray-100"><CardArt theme='teal' /></div>
              <div className="p-5">
                <p className="text-xs text-green-700 font-semibold mb-2">Same‑day available</p>
                <h3 className="text-lg font-semibold text-gray-900">Index Labels</h3>
                <p className="text-sm text-gray-600 mt-2">Tidy binders, big organization energy. Durable, easy‑write labels for tabs, files, and more.</p>
                <ul className="mt-3 text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Multiple sizes to fit most office systems</li>
                  <li>Matte finish for easy writing</li>
                  <li>Order by noon for same‑day pickup by store closing</li>
                </ul>
                <p className="text-sm text-gray-700 mt-3">Starting at <span className="font-semibold">{formatINR(2.99)}</span>*</p>
                <Link href="/quote" className="mt-4 inline-block bg-red-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-red-700">Create Index Label</Link>
              </div>
            </div>

            {/* Return Address Labels */}
            <div className="border rounded-xl overflow-hidden">
              <div className="h-40 bg-gray-100"><CardArt theme='blue' /></div>
              <div className="p-5">
                <p className="text-xs text-green-700 font-semibold mb-2">Same‑day available</p>
                <h3 className="text-lg font-semibold text-gray-900">Return Address Labels</h3>
                <p className="text-sm text-gray-600 mt-2">Small but mighty. These labels save you from hand‑writing addresses and tough return mail days. Professional and smudge‑resistant.</p>
                <ul className="mt-3 text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Popular size: 1" × 2‑5/8"</li>
                  <li>Permanent adhesive, inkjet/laser compatible</li>
                  <li>Order by noon for same‑day pickup by store closing</li>
                </ul>
                <p className="text-sm text-gray-700 mt-3">Starting at <span className="font-semibold">{formatINR(2.99)}</span>*</p>
                <Link href="/quote" className="mt-4 inline-block bg-red-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-red-700">Create Return Address Label</Link>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">*Plus service fee up to {formatINR(2.99)} per order.</p>
        </div>
      </section>
    </div>
  )
}


