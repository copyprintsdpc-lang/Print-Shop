'use client'

import CardArt from '@/components/illustrations/CardArt'
import Link from 'next/link'

export default function BusinessCardsPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shop business cards by quality</h1>
          <div className="mt-6 grid md:grid-cols-4 gap-6">
            {[
              { name: 'Economy Same‑day', details: 'Single‑sided only. Packs 20‑1,000.', price: '20 starting at ₹9.99', cta: 'Create Economy Cards' },
              { name: 'Standard', details: 'Single or double‑sided. Packs 100‑1,000.', price: '100 cards starting at ₹18.99', cta: 'Create Standard Cards' },
              { name: 'Premium', details: 'Wider selection of print finishes. Packs 100‑1,000.', price: '100 cards starting at ₹26.99', cta: 'Create Premium Cards' },
              { name: 'Specialty', details: 'Specialty print finishes that stand out. Packs 100‑1,000.', price: '250 cards starting at ₹56.99', cta: 'Create Specialty Cards' }
            ].map((p, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="h-40 bg-gray-100"><CardArt theme={i % 2 === 0 ? 'teal' : 'rose'} /></div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-800 mt-2">{p.details}</p>
                  <p className="text-sm text-gray-800 mt-2">{p.price}*</p>
                  <Link href="/quote" className="mt-3 inline-block bg-orange-500/80 backdrop-blur-sm border border-orange-400/30 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-orange-400/80 transition-all duration-300">{p.cta}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special textures and finishes */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Special textures and finishes</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {['Matte','Gloss','Recycled Matte','Linen','Felt','Raised Ink','UV Coated'].map((n, i) => (
              <div key={n} className="border rounded-xl overflow-hidden">
                <div className="h-36 bg-gray-100"><CardArt theme={i % 2 === 0 ? 'blue' : 'rose'} /></div>
                <div className="p-5"><h3 className="font-semibold text-gray-900">{n}</h3></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


