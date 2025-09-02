'use client'

import Link from 'next/link'
import CardArt from '@/components/illustrations/CardArt'
import HeroArt from '@/components/illustrations/HeroArt'
import FileUpload from '@/components/FileUpload'

export default function PrintMePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">PrintMe</h1>
              <p className="mt-3 text-gray-800">Our simplified print options allow you to print what you need when you need it.</p>
            </div>
            <div className="h-44 md:h-48 lg:h-56 rounded-xl overflow-hidden bg-red-700">
              <HeroArt className="opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* 3 ways to upload */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm text-gray-800 mb-4">Print conveniently from wherever suits you with our 3 easy ways to print.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[{
              title: 'Email Upload',
              desc: 'Email your file. Get an 8‑digit code and release at any self‑serve copier.',
              cta: 'Send Now'
            }, {
              title: 'Web Upload',
              desc: 'Upload your file to the web. Get an 8‑digit code and release in‑store.',
              cta: 'Upload Now'
            }, {
              title: 'Download Print Driver',
              desc: 'Print from your desktop via the driver. Get a release code and print in‑store.',
              cta: 'Download Now'
            }].map((card, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="h-44 bg-gray-100">
                  <CardArt theme={i === 0 ? 'rose' : i === 1 ? 'teal' : 'blue'} />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{card.title}</h3>
                  <p className="text-sm text-gray-800 mt-2">{card.desc}</p>
                  <div className="mt-4">
                    <Link href="#upload" className="inline-block bg-teal-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-teal-700">
                      {card.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload area */}
      <section id="upload" className="bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">Upload files or drag and drop onto this page</h2>
          <div className="bg-white border rounded-xl p-6">
            <FileUpload
              onFilesChange={() => {}}
              maxFiles={10}
              maxSize={25}
              acceptedTypes={['application/pdf','image/jpeg','image/png']}
            />
            <div className="mt-6 grid gap-4">
              <input type="email" placeholder="Enter email address for release code" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              <button className="w-full bg-red-500 text-white rounded-md px-4 py-2 font-medium hover:bg-red-600">Send</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


