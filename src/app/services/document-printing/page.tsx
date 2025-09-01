'use client'

import Link from 'next/link'
import PlaceholderImage from '@/components/PlaceholderImage'
import HeroArt from '@/components/illustrations/HeroArt'
import CardArt from '@/components/illustrations/CardArt'
import { formatINR } from '@/lib/currency'

export default function DocumentPrintingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Document Printing</h1>
              <p className="mt-3 text-gray-600">
                Big or small, we print documents with expert care, premium stock, and finishing touches your office printer can’t match.
              </p>
            </div>
            <div className="h-44 md:h-48 lg:h-56 rounded-xl overflow-hidden">
              <HeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* 3 easy ways */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">3 easy ways to print</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{
              title: 'Same‑Day Printing*',
              desc: 'Need it now? Order by noon for same‑day pickup by store closing. Choose from a variety of paper and finishes to bring your documents to life—border included.',
              cta: 'Print Now'
            }, {
              title: 'Complete Print Solution*',
              desc: 'Pro‑quality prints, smart pricing. Choose paper, finishes, and delivery or pickup—ready in 1‑3 days, always with care in‑store.',
              cta: 'Print Now'
            }, {
              title: 'In‑Store Printing',
              desc: 'Walk in. Print out. Get fast, easy prints while you shop. Our print pros and self‑serve stations are ready when you are—no appointment needed.',
              cta: 'Find a Store'
            }].map((card, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="h-44 bg-gray-100">
                  <CardArt theme={i === 0 ? 'blue' : i === 1 ? 'teal' : 'rose'} />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{card.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{card.desc}</p>
                  <div className="mt-4">
                    <Link href="/quote?category=documents" className="inline-block border rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50">
                      {card.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paper. Price. Perfection. */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Paper. Price. Perfection.</h2>
          <p className="text-gray-600 mb-6">Explore top‑tier papers and pricing plans designed to make your prints—and wallet—happy.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Letter', size: '8.5” × 11”' },
              { name: 'Legal', size: '8.5” × 14”' },
              { name: 'Ledger', size: '11” × 17”' },
            ].map((col, idx) => (
              <div key={idx} className="border rounded-xl p-4">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-500">{col.name}</div>
                  <div className="text-xs text-gray-400">{col.size}</div>
                  <Link href="/quote?category=documents" className="mt-3 inline-block border rounded-md px-4 py-1 text-sm font-medium hover:bg-gray-50">Print Now</Link>
                </div>
                <div className="space-y-5 text-sm">
                  <div>
                    <div className="font-medium text-gray-800">Black and White Pricing</div>
                    <ul className="mt-2 divide-y">
                      {[
                        ['1‑499', 0.19],
                        ['500‑999', 0.12],
                        ['1,000‑9,999', 0.08],
                        ['10,000‑10,999', 0.08],
                        ['20,000+', 0.06],
                      ].map(([label, price]) => (
                        <li key={label as string} className="flex justify-between py-1 text-gray-600"><span>{label as string}</span><span>{formatINR(price as number)}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Rich Black</div>
                    <ul className="mt-2 divide-y">
                      {[
                        ['1‑499', 0.39],
                        ['500‑999', 0.33],
                        ['1,000‑2,999', 0.32],
                        ['3,000+', 0.21],
                      ].map(([label, price]) => (
                        <li key={label as string} className="flex justify-between py-1 text-gray-600"><span>{label as string}</span><span>{formatINR(price as number)}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Colour Pricing</div>
                    <ul className="mt-2 divide-y">
                      {[
                        ['1‑499', 0.59],
                        ['500‑999', 0.48],
                        ['1,000‑2,999', 0.42],
                        ['3,000‑4,999', 0.35],
                        ['5,000‑7,999', 0.30],
                        ['8,000+', 0.22],
                      ].map(([label, price]) => (
                        <li key={label as string} className="flex justify-between py-1 text-gray-600"><span>{label as string}</span><span>{formatINR(price as number)}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">Note: Prices shown apply to standard service levels only. Same‑day and 1‑hour services are available at an additional cost. Final pricing may vary based on job specifications.</p>
        </div>
      </section>

      {/* Paper types */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Paper so good, you'll feel fancy</h2>
          <p className="text-gray-600 mb-6">From everyday prints to big‑deal projects, choose from standard, premium, or specialty paper that makes your documents pop (and impress).</p>
          <div className="grid md:grid-cols-3 gap-6">
            {['Standard Paper','Business Paper','Premium Paper'].map((title, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="h-40"><CardArt theme={i === 0 ? 'blue' : i === 1 ? 'teal' : 'rose'} /></div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 mt-2">Sample descriptive copy for {title.toLowerCase()}.</p>
                  <Link href="/quote?category=documents" className="mt-4 inline-block text-sm text-blue-600">View All</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Binding */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Bound to impress</h2>
          <p className="text-gray-600 mb-6">From cerlox to coil, wireless to saddle stitch, bind your documents with the perfect finish to match your style—and keep things together.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {['Coil Binding','Cerlox Binding','Wireless Binding','Saddle Stitching'].map((title, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="h-36"><CardArt theme={i % 2 === 0 ? 'blue' : 'teal'} /></div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 mt-2">Short description for {title.toLowerCase()}.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cutting */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Cut to perfection, your way</h2>
          <p className="text-gray-600 mb-6">From bulk cuts to intricate designs, we offer precise finishing options tailored to your project’s exact requirements.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {['Bulk Cuts','Complex Cutting'].map((title, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="h-40"><CardArt theme={i % 2 === 0 ? 'rose' : 'teal'} /></div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 mt-2">Short description for {title.toLowerCase()}.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Folding */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sharp folds, smooth finish</h2>
          <p className="text-gray-600 mb-6">Get brochures, flyers, and letters pre‑folded and ready for action—skip the hassle and let us do the folding for you.</p>
        
          <div className="grid md:grid-cols-4 gap-6">
            {['Half‑fold','Tri‑fold','Z‑fold','Custom fold'].map((title, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="h-36"><CardArt theme={i} /></div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 mt-2">Short description for {title.toLowerCase()}.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More finishing */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">More finishing options to choose</h2>
          <p className="text-gray-600 mb-6">Choose from a range of high‑quality finishes for your prints—all in one go.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {['Laminating','Foam Core','Hole Punching','Stapling'].map((title, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="h-36"><CardArt theme={i % 2 === 0 ? 'teal' : 'rose'} /></div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 mt-2">Short description for {title.toLowerCase()}.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* You can count on us */}
      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { title: 'Speed', text: 'Printing how you want it and when you want it with 1‑hour and same‑day service.' },
              { title: 'Quality', text: 'Expert high‑quality printing always getting the job done right.' },
              { title: 'Convenience', text: 'Order online 24/7 and pick up in store.' },
            ].map((b, i) => (
              <div key={i} className="p-6">
                <div className="text-2xl text-red-600 mb-2">●</div>
                <div className="font-semibold text-gray-900">{b.title}</div>
                <div className="text-sm text-gray-600 mt-1">{b.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


