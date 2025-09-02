'use client'

import CardArt from '@/components/illustrations/CardArt'
import HeroArt from '@/components/illustrations/HeroArt'
import Link from 'next/link'

export default function BannersPostersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Make a BIG statement with banners</h1>
          <p className="mt-2 text-gray-800 max-w-3xl">Get noticed near and far. Our banners stand out indoors or out, with sizes up to 48” × 144”.</p>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="border rounded-xl overflow-hidden">
              <div className="h-44 bg-gray-100"><CardArt theme='teal' /></div>
            </div>
            <div className="border rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900">Standard Banners</h3>
              <p className="text-sm text-gray-800 mt-2">Make a lasting impact with high‑quality banners. Ideal for grand openings, trade shows, or sales events—designed to grab attention and drive real results.</p>
              <Link href="/quote" className="mt-4 inline-block text-sm text-blue-600">Create Standard Banner</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Banner types */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-6">
          {[
            { name: 'Outdoor Banners', desc: 'Ideal for storefronts, festivals and sports events. Stand not included. Sizes up to 48” × 120”. Finished with hem and grommets.', price: 'Starting at ₹84.99', cta: 'Create Outdoor Banner' },
            { name: 'Hanging Banners', desc: 'Perfect for malls, exhibitions, and ceiling displays. Printed on vinyl. Includes plastic rails, 2 clips and 2 suction cups.', price: 'Starting at ₹84.99', cta: 'Create Hanging Banner' },
            { name: 'Banners with L‑Stand', desc: 'Perfect for trade shows and promotions. Easy setup and high visibility. Printed on durable vinyl or poly.', price: 'Starting at ₹99.99', cta: 'Create Banner with L Stand' },
            { name: 'Banners with Retractable Stand', desc: 'Great for conferences and events. Portable with easy setup and storage. Printed on durable vinyl or poly.', price: 'Starting at ₹119.99', cta: 'Create Banner with Retractable Stand' }
          ].map((p, i) => (
            <div key={i} className="border rounded-xl overflow-hidden">
              <div className="h-40 bg-gray-100"><CardArt theme={i % 2 === 0 ? 'blue' : 'rose'} /></div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                <p className="text-sm text-gray-800 mt-2">{p.desc}</p>
                <p className="text-sm text-gray-800 mt-2">{p.price}*</p>
                <Link href="/quote" className="mt-3 inline-block bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700">{p.cta}</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Posters highlight */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-6">
          <div className="border rounded-xl overflow-hidden">
            <div className="h-44 bg-gray-100"><CardArt theme='rose' /></div>
          </div>
          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Posters that speak volumes</h2>
            <p className="text-sm text-gray-800">Grab attention, spread the word, or make an announcement loud and clear. Posters up to 40” × 60” with finishes and mounts to match your message.</p>
            <Link href="/quote" className="mt-3 inline-block text-sm text-blue-600">Create Poster</Link>
          </div>
        </div>
      </section>

      {/* Signs grid */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your (signs) to stand out</h2>
          <p className="text-sm text-gray-800 mb-6">Whether it’s for events, everyday use, or special signage like magnetic or thick plastic, we’ve got the perfect solution to make your business shine.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Banners with Retractable Stand', price: 'Starting at ₹119.99', cta: 'Create Retractable Stand' },
              { name: 'A‑Frame Signs', price: 'Starting at ₹124.99', cta: 'Create A‑Frame Sign' },
              { name: 'Coroplast Yard Signs', price: 'Starting at ₹21.49', cta: 'Create Yard Sign' },
              { name: 'Flexible Plastic Signs', price: 'Starting at ₹18.99', cta: 'Create Flexible Sign' }
            ].map((p, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="h-40 bg-gray-100"><CardArt theme={i === 1 ? 'teal' : 'blue'} /></div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-800 mt-2">{p.price}*</p>
                  <Link href="/quote" className="mt-3 inline-block bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700">{p.cta}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More signs */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-6">
          {[
            { name: 'Thick Plastic Signs', price: 'Starting at ₹26.99', cta: 'Create Thick Sign' },
            { name: 'Metal Signs', price: 'Starting at ₹35.99', cta: 'Create Metal Sign' },
            { name: 'Acrylic Signs', price: 'Starting at ₹38.99', cta: 'Create Acrylic Sign' },
            { name: 'Magnetic Signs', price: 'Starting at ₹52.99', cta: 'Create Magnetic Sign' }
          ].map((p, i) => (
            <div key={i} className="border rounded-xl overflow-hidden">
              <div className="h-40 bg-gray-100"><CardArt theme={i % 2 === 0 ? 'rose' : 'teal'} /></div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                <p className="text-sm text-gray-800 mt-2">{p.price}*</p>
                <Link href="/quote" className="mt-3 inline-block bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700">{p.cta}</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Poster finishes */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pick your perfect finish for your posters</h2>
          <p className="text-sm text-gray-800 mb-6">Choose matte or gloss for texture, or go with poly or vinyl for extra durability. Add lamination or foamcore mounting to finish your look.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {['Gloss Paper','Matte Paper','Poly','Vinyl'].map((name, i) => (
              <div key={name} className="border rounded-xl overflow-hidden">
                <div className="h-36 bg-gray-100"><CardArt theme={i % 2 === 0 ? 'blue' : 'rose'} /></div>
                <div className="p-5"><h3 className="font-semibold text-gray-900">{name}</h3></div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {['Lamination','Foamcore'].map((name, i) => (
              <div key={name} className="border rounded-xl overflow-hidden">
                <div className="h-36 bg-gray-100"><CardArt theme={i === 0 ? 'teal' : 'rose'} /></div>
                <div className="p-5"><h3 className="font-semibold text-gray-900">{name}</h3></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


