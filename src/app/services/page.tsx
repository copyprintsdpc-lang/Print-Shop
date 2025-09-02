import { 
  Printer, 
  FileText, 
  Star, 
  Truck, 
  Clock, 
  Shield,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function ServicesPage() {
  const services = [
    {
      id: 'documents',
      name: 'Document Printing',
      description: 'Professional documents, reports, and presentations with binding options',
      icon: FileText,
      features: [
        'Multiple paper options (80gsm, 100gsm, 130gsm)',
        'Single & double-sided printing',
        'Binding options (staples, coil, perfect binding)',
        'Lamination available',
        'Same-day service available'
      ],
      startingPrice: '₹2 per page',
      sameDay: true
    },
    {
      id: 'photo-prints',
      name: 'Photo Prints',
      description: 'Fast, high‑quality photo prints and enlargements',
      icon: Printer,
      features: [
        'Same‑day pickup available',
        'Instant kiosk prints',
        'Wallet to wall‑size options',
        'Glossy & matte finishes',
        'Value enlargements'
      ],
      startingPrice: '₹0.24 per photo',
      sameDay: true
    },
    {
      id: 'business-cards',
      name: 'Business Cards',
      description: 'Premium business cards that make lasting impressions',
      icon: Star,
      features: [
        'Multiple finishes (matte, glossy, UV)',
        'Standard & custom sizes',
        'Spot UV and foil stamping',
        'Quick turnaround (24-48 hours)',
        'Bulk discounts available'
      ],
      startingPrice: '₹1 per card',
      sameDay: true
    },
    {
      id: 'menus',
      name: 'Menus',
      description: 'Custom menus with multiple sizes and finishes',
      icon: FileText,
      features: [
        '8.5×11”, 8.5×14”, 11×17”',
        'Standard, Deluxe, Premium',
        '1‑Sided or 2‑Sided',
        'Same‑day available',
        'Great for dine‑in and takeout'
      ],
      startingPrice: '₹0.99',
      sameDay: true
    },
    {
      id: 'newsletters',
      name: 'Newsletters',
      description: 'Custom newsletters for updates and promotions',
      icon: FileText,
      features: [
        '8.5×11”, 8.5×14”, 11×17”',
        'Matte or Gloss finish',
        '1‑Sided or 2‑Sided',
        'Same‑day available',
        'Great pricing in bulk'
      ],
      startingPrice: '₹0.56',
      sameDay: true
    },
    {
      id: 'postcards',
      name: 'Postcards',
      description: 'Affordable postcards for promos, invites, and thank‑yous',
      icon: FileText,
      features: [
        '4×6, 4×8, 5×7',
        'Horizontal or Vertical',
        '1‑Sided or 2‑Sided',
        'Bulk friendly',
        'Fast turnaround'
      ],
      startingPrice: '₹19.99',
      sameDay: true
    },
    {
      id: 'banners',
      name: 'Banners & Posters',
      description: 'Large format printing for events and marketing',
      icon: Truck,
      features: [
        'Outdoor & indoor materials',
        'Custom dimensions available',
        'Grommets & finishing included',
        'Weather-resistant options',
        'Fast delivery available'
      ],
      startingPrice: '₹50 per sq ft',
      sameDay: false
    },
    {
      id: 'flyers',
      name: 'Flyers',
      description: 'Custom flyers to promote events, services, or products',
      icon: FileText,
      features: [
        '8.5×11” and 11×17” sizes',
        'Matte & Gloss options',
        '1‑Sided or 2‑Sided',
        'Same‑day available',
        'Bulk packs available'
      ],
      startingPrice: '₹26.99',
      sameDay: true
    },
    {
      id: 'brochures',
      name: 'Brochures',
      description: 'Tri-fold brochures with standard or express delivery',
      icon: FileText,
      features: [
        'Tri‑fold, double‑sided',
        'Matte or Gloss finishes',
        'Packs from 25 to 1000',
        'Same‑day available'
      ],
      startingPrice: '₹28.99',
      sameDay: true
    },
    {
      id: 'printme',
      name: 'PrintMe',
      description: 'Simplified print options to print what you need when you need it',
      icon: Printer,
      features: [
        'Email, Web, or Driver upload',
        'Self-serve release code',
        'Fast in-store printing',
        'Simple pricing',
        'Assisted finishing options'
      ],
      startingPrice: '₹2 per page',
      sameDay: true
    },
    {
      id: 'stickers',
      name: 'Stickers & Labels',
      description: 'Custom stickers and labels for branding and packaging',
      icon: Printer,
      features: [
        'Vinyl and paper options',
        'Waterproof materials',
        'Custom shapes and sizes',
        'Bulk quantities welcome',
        'Quick production time'
      ],
      startingPrice: '₹0.50 per sticker',
      sameDay: true
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Printing Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Professional printing solutions for all your business and personal needs. 
              Quality guaranteed with fast turnaround times.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <div key={service.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                      <p className="text-gray-800">{service.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-800">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Starting from</p>
                      <p className="text-2xl font-bold text-blue-600">{service.startingPrice}</p>
                    </div>
                    <div className="text-right">
                      {service.sameDay && (
                        <div className="flex items-center text-green-600 mb-2">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Same Day</span>
                        </div>
                      )}
                      <Link
                        href={service.id === 'documents' ? '/services/document-printing' : service.id === 'printme' ? '/services/printme' : service.id === 'photo-prints' ? '/services/photo-prints' : service.id === 'banners' ? '/services/banners-posters' : service.id === 'business-cards' ? '/services/business-cards' : service.id === 'brochures' ? '/services/brochures' : service.id === 'flyers' ? '/services/flyers' : service.id === 'stickers' ? '/services/labels' : service.id === 'menus' ? '/services/menus' : service.id === 'newsletters' ? '/services/newsletters' : service.id === 'postcards' ? '/services/postcards' : `/quote?service=${service.id}`}
                        className="inline-flex items-center bg-[#F16E02] border border-orange-300/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#F16518] transition-all duration-300 transition-colors"
                      >
                        {service.id === 'documents' || service.id === 'printme' || service.id === 'photo-prints' || service.id === 'banners' || service.id === 'business-cards' || service.id === 'brochures' || service.id === 'flyers' || service.id === 'stickers' || service.id === 'menus' || service.id === 'newsletters' || service.id === 'postcards' ? 'View' : 'Get Quote'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Sri Datta Print Center?
            </h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto">
              We combine cutting-edge technology with traditional craftsmanship
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Printer className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-800">State-of-the-art printing technology for crisp, vibrant results</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Turnaround</h3>
              <p className="text-gray-800">Same-day service available for most products</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">GST Compliant</h3>
              <p className="text-gray-800">Professional invoicing with proper tax documentation</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliable Delivery</h3>
              <p className="text-gray-800">Fast and secure delivery or convenient pickup options</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#F16E02] border border-orange-300/30 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get an instant quote for your printing needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/quote" 
              className="bg-white/95 backdrop-blur-sm text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Get Instant Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 hover:border-white hover:scale-105 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
