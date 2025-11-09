'use client'

import { useState } from 'react'
import { 
  Printer, 
  FileText, 
  Star, 
  Truck, 
  Clock, 
  Shield,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Camera,
  Tag,
  CreditCard,
  BookOpen,
  Scan,
  Gift,
  Shirt,
  Coffee,
  Ruler,
  Layers,
  Wifi,
  Upload,
  FileImage,
  MapPin,
  User,
  Phone,
  Mail,
  Copy
} from 'lucide-react'
import Link from 'next/link'

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Printing')

  const allServices = [
    { name: "Jumbo Colour Printing", description: "Extra-large vibrant prints", icon: Printer, category: "Printing", image: "/images/service-banners-outdoor.jpg" },
    { name: "Digital Colour Printing", description: "Professional digital prints", icon: FileText, category: "Printing", image: "/images/service-document-printing-hero.jpg" },
    { name: "Photocopy (B/W & Colour)", description: "Fast, reliable copies", icon: Copy, category: "Printing", image: "/images/service-document-printing-products.jpg" },
    { name: "Internet Prints", description: "Print from email or cloud", icon: Wifi, category: "Printing", image: "/images/icon-digital-scanning.jpg" },
    { name: "Project Prints", description: "Quality printing for reports", icon: BookOpen, category: "Printing", image: "/images/service-brochures-hero.jpg" },
    { name: "Tracing / Blue Prints", description: "Precise architectural drawings", icon: Ruler, category: "Printing", image: "/images/service-posters-display.jpg" },
    { name: "Auto CAD Printing", description: "Scale-accurate CAD drawings", icon: Layers, category: "Printing", image: "/images/icon-design-services.jpg" },
    { name: "WhatsApp Print", description: "Convenient WhatsApp printing", icon: Smartphone, category: "Specialty", image: "/images/icon-digital-scanning.jpg" },
    { name: "Photo Prints", description: "High-quality glossy prints", icon: Camera, category: "Specialty", image: "/images/service-photo-prints-hero.jpg" },
    { name: "Sticker Prints", description: "Custom labels and stickers", icon: Tag, category: "Specialty", image: "/images/service-labels-hero.jpg" },
    { name: "Visiting Cards", description: "Premium business cards", icon: CreditCard, category: "Cards", image: "/images/service-business-cards-hero.jpg" },
    { name: "Smart Cards", description: "Custom PVC access cards", icon: CreditCard, category: "Cards", image: "/images/service-business-cards-varieties.jpg" },
    { name: "ID Cards", description: "Durable staff/student IDs", icon: User, category: "Cards", image: "/images/service-business-cards-varieties.jpg" },
    { name: "Lamination", description: "Protect with lamination", icon: Shield, category: "Finishing", image: "/images/service-brochures-folding.jpg" },
    { name: "Binding", description: "Professional binding options", icon: BookOpen, category: "Finishing", image: "/images/service-brochures-hero.jpg" },
    { name: "Project Binding", description: "Thesis and report binding", icon: FileText, category: "Finishing", image: "/images/service-document-printing-products.jpg" },
    { name: "Scanning", description: "High-resolution scanning", icon: Scan, category: "Digital", image: "/images/icon-digital-scanning.jpg" },
    { name: "Mug Printing", description: "Personalized mugs", icon: Coffee, category: "Custom", image: "/images/team-professional.jpg" },
    { name: "T-Shirt Printing", description: "Custom T-shirts", icon: Shirt, category: "Custom", image: "/images/team-professional.jpg" }
  ]

  const categories = ['Printing', 'Specialty', 'Cards', 'Finishing', 'Digital', 'Custom']
  const filteredServices = allServices.filter(service => service.category === selectedCategory)

  const colorThemes = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-emerald-600', 
    'from-purple-500 to-pink-600',
    'from-orange-500 to-red-600',
    'from-cyan-500 to-blue-600',
    'from-pink-500 to-rose-600'
  ]

  const categoryColors: Record<string, string> = {
    'Printing': 'from-blue-500 to-purple-600',
    'Specialty': 'from-purple-500 to-pink-600',
    'Cards': 'from-green-500 to-emerald-600',
    'Finishing': 'from-orange-500 to-red-600',
    'Digital': 'from-cyan-500 to-blue-600',
    'Custom': 'from-pink-500 to-rose-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Compact Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-12 relative overflow-hidden">
        <div className="absolute top-10 right-20 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Professional Printing Services
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Quality guaranteed with fast turnaround
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs - Horizontal Tab Style */}
      <section className="bg-gray-100 border-b border-gray-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 font-semibold text-sm whitespace-nowrap relative transition-all duration-300 border-b-3 ${
                  selectedCategory === category
                    ? 'text-blue-600 bg-white border-b-3 border-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 border-b-3 border-transparent'
                }`}
                style={selectedCategory === category ? { borderBottomWidth: '3px' } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid for Selected Category */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map((service, index) => {
              const IconComponent = service.icon
              const themeIndex = index % colorThemes.length
              
              return (
                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden hover:scale-105 transition-all duration-300 group">
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute top-2 right-2 bg-gradient-to-r ${categoryColors[service.category]} p-2 rounded-lg shadow-lg`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1 text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      {service.description}
                    </p>
                    <Link
                      href="/quote"
                      className={`inline-flex items-center bg-gradient-to-r ${categoryColors[service.category]} text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:shadow-lg transition-all`}
                    >
                      Get Quote
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Compact */}
      <section className="py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Why Choose Us?
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Printer className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-blue-800 mb-1">Premium Quality</h3>
              <p className="text-xs text-blue-600">State-of-the-art tech</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-green-800 mb-1">Fast Turnaround</h3>
              <p className="text-xs text-green-600">Same-day available</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-purple-800 mb-1">GST Compliant</h3>
              <p className="text-xs text-purple-600">Proper invoices</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-orange-800 mb-1">Reliable Delivery</h3>
              <p className="text-xs text-orange-600">Fast & secure</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Footer - Compact */}
      <section className="bg-gradient-to-br from-gray-800 to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-white" />
              <span className="text-gray-300 text-sm">Kukatpally, Hyderabad</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-white" />
              <a href="tel:+918897379737" className="text-white text-sm hover:text-yellow-300">+91 8897379737</a>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-white" />
              <span className="text-gray-300 text-sm">Mon-Sat: 9AM-9PM</span>
            </div>
          </div>
          <Link 
            href="/quote" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            Get Quote Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
