'use client'

import CardArt from '@/components/illustrations/CardArt'
import HeroArt from '@/components/illustrations/HeroArt'
import Link from 'next/link'

export default function PhotoPrintsPage() {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Photo Prints</h1>
              <p className="mt-3 text-gray-800">From wallet-sized wonders to wall‑worthy masterpieces, print your pics your way—fast, easy, and fuss‑free.</p>
            </div>
            <div className="h-44 md:h-48 lg:h-56 rounded-xl overflow-hidden">
              <HeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* Specialty prints */}
      <section className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Specialty prints for extra‑special moments</h2>
          <p className="text-sm text-gray-800 mb-6">Go beyond the standard. Choose panoramic, retro, or square prints, or turn your moments into a stunning photobook—because your memories deserve more than a screen.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Enlargements and Posters', price: 'Starting at ₹13.99', cta: 'Create Poster and Enlargement' },
              { name: 'Fujifilm Retro Prints', price: 'Starting at ₹0.49', cta: 'Create Fujifilm Retro Print' },
              { name: 'Panoramic Photo Prints', price: 'Starting at ₹4.99', cta: 'Create Panoramic Photo Print' },
              { name: 'Square Photo Prints', price: 'Starting at ₹0.89', cta: 'Create Square Photo Print' }
            ].map((p, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="h-40 bg-white/10 backdrop-blur-sm"><CardArt theme={i === 0 ? 'blue' : i === 1 ? 'rose' : i === 2 ? 'teal' : 'blue'} /></div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-800 mt-2">{p.price}</p>
                  <Link href="/quote" className="mt-4 inline-block bg-[#F16E02] border border-orange-300/30 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#F16518] transition-all duration-300">
                    {p.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frames/Photobooks callouts */}
      <section className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-xl p-6 flex items-center gap-6">
              <div className="w-32 h-24 flex-shrink-0"><CardArt theme='rose'/></div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Don’t just print it—frame it!</h3>
                <p className="text-sm text-gray-800 mt-1">Elevate your prints with our frames. Find the perfect frame to showcase your best moments in style.</p>
                <Link href="/quote" className="text-sm text-blue-600 mt-2 inline-block">Shop Frames</Link>
              </div>
            </div>
            <div className="border rounded-xl p-6 flex items-center gap-6">
              <div className="w-32 h-24 flex-shrink-0"><CardArt theme='teal'/></div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Your story, printed.</h3>
                <p className="text-sm text-gray-800 mt-1">Capture your favourite moments in a photobook. Choose from soft, hard, or leather covers.</p>
                <Link href="/quote" className="text-sm text-blue-600 mt-2 inline-block">Shop Photobooks</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wall decor */}
      <section className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Wall decor worth talking about</h2>
          <p className="text-sm text-gray-800 mb-6">Fill your space with memories. Choose from canvas prints, framed photos and more to create the perfect backdrop for your life’s moments.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Canvas Prints', cta: 'Create Canvas Print' },
              { name: 'Framed Prints', cta: 'Create Framed Print' },
              { name: 'Wood Mount Photos', cta: 'Create Wood Mount Photo' },
              { name: 'Metal Photo Panel', cta: 'Create Metal Photo Panel' }
            ].map((p, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="h-40 bg-white/10 backdrop-blur-sm"><CardArt theme={i === 0 ? 'rose' : i === 1 ? 'blue' : i === 2 ? 'teal' : 'rose'} /></div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-800 mt-2">Designs that make your walls deserve more—crafted to stand out.</p>
                  <Link href="/quote" className="mt-4 inline-block bg-[#F16E02] border border-orange-300/30 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#F16518] transition-all duration-300">
                    {p.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Delivery or Pickup', text: 'Order online for delivery or pick up free at your nearest store.' },
              { title: 'Same‑Day Printing', text: 'Order online by noon; pick up in‑store by closing—same day.' },
              { title: 'Instant Print', text: 'Print 4x6 photos instantly at any store with our self‑serve kiosks.' }
            ].map((s, i) => (
              <div key={i} className="bg-transparent border rounded-xl p-5">
                <div className="h-24 mb-3"><CardArt theme={i === 0 ? 'teal' : i === 1 ? 'rose' : 'blue'} /></div>
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-800 mt-1">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product cards */}
      <section className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Picture‑perfect photo prints</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Same‑Day Premium Photo Prints', price: 'Starting at ₹0.31', cta: 'Shop Premium Photo Prints' },
              { name: 'Premium Photo Prints', price: 'Starting at ₹0.24', cta: 'Shop Premium Photo Prints' },
              { name: 'Same‑Day Value Enlargement', price: 'Starting at ₹3.00', cta: 'Create Same‑Day Value Enlargements' },
              { name: 'Value Enlargement', price: 'Starting at ₹574.9', cta: 'Shop Value Enlargements' }
            ].map((p, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="h-40 bg-white/10 backdrop-blur-sm"><CardArt theme={i % 2 === 0 ? 'teal' : 'rose'} /></div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-800 mt-2">{p.price}</p>
                  <Link href="/quote" className="mt-4 inline-block bg-[#F16E02] border border-orange-300/30 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#F16518] transition-all duration-300">
                    {p.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


