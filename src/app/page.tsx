import Link from 'next/link'
import { 
  Printer, 
  Clock, 
  Truck, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Globe
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 relative overflow-hidden">
        {/* Colorful background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-ping"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🎨 Professional Printing Services
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Printing Made
                </span>
                <span className="block bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                  Easier
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 max-w-2xl leading-relaxed mb-8">
                For all your printing prerequisites. What's more, we do it right! A full administration printing background.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/services" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/quote" 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Start A Project
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="/images/documents-hero.svg" 
                  alt="Printing Services" 
                  className="w-full h-auto max-w-lg mx-auto drop-shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl transform rotate-6 scale-105 opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-pink-400 to-orange-500 rounded-3xl transform -rotate-3 scale-110 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl transform rotate-2 scale-115 opacity-15"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20 relative overflow-hidden">
        {/* Colorful background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              How We Work
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We are professional. We're something other than duplicates… What's more, we do it right!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105">
              <div className="relative mb-6">
                <img 
                  src="/images/printme.svg" 
                  alt="Printing Services" 
                  className="w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Printer className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Printing Services</h3>
              <p className="text-blue-700">Fast print, flyer, and pamphlet printing. Pleased with our past. Printing for what's to come.</p>
            </div>
            
            <div className="text-center group bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105">
              <div className="relative mb-6">
                <img 
                  src="/images/paper-1.svg" 
                  alt="Digital Scanning" 
                  className="w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Digital Scanning</h3>
              <p className="text-green-700">Printing for what's to come. Fast print, flyer, and pamphlet printing. Pleased with our past.</p>
            </div>
            
            <div className="text-center group bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105">
              <div className="relative mb-6">
                <img 
                  src="/images/finish-1.svg" 
                  alt="Design Services" 
                  className="w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-2">Design Services</h3>
              <p className="text-purple-700">Fast print, flyer, and pamphlet printing. Pleased with our past. Printing for what's to come.</p>
            </div>
            
            <div className="text-center group bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105">
              <div className="relative mb-6">
                <img 
                  src="/images/binding-1.svg" 
                  alt="Copying Services" 
                  className="w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="bg-gradient-to-r from-orange-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Copying Services</h3>
              <p className="text-orange-700">Pleased with our past. Printing for what's to come. Fast print, flyer, and pamphlet printing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Service
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fast and quality service. Best shipping rates for print-on-demand services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-8 group hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="relative mb-6">
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  📄 POPULAR
                </div>
                <img 
                  src="/images/document-printing/doc-set-1.svg" 
                  alt="Document Printing" 
                  className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-xl"></div>
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Document Printing</h3>
              <p className="text-blue-700 mb-4">Professional documents, reports, and presentations with binding options</p>
              <ul className="space-y-2 text-sm text-blue-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Multiple paper options
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Binding & finishing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Same-day service available
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-200 rounded-2xl p-8 group hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="relative mb-6">
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  💳 PREMIUM
                </div>
                <img 
                  src="/images/doc-card-1.svg" 
                  alt="Business Cards" 
                  className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-xl"></div>
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-2">Business Cards</h3>
              <p className="text-purple-700 mb-4">Premium business cards that make lasting impressions</p>
              <ul className="space-y-2 text-sm text-purple-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  Multiple finishes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  Custom sizes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  Quick turnaround
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-8 group hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="relative mb-6">
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  🎯 LARGE FORMAT
                </div>
                <img 
                  src="/images/quick-print.svg" 
                  alt="Banners & Posters" 
                  className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent rounded-xl"></div>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Banners & Posters</h3>
              <p className="text-green-700 mb-4">Large format printing for events and marketing</p>
              <ul className="space-y-2 text-sm text-green-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Outdoor & indoor materials
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Grommets & finishing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Custom dimensions
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/services" 
              className="btn-secondary inline-flex items-center gap-2"
            >
              <span>View All Services</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 text-white">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">$2M</div>
                <p className="text-blue-100">invested in printing equipment</p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 text-white">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">$5M+</div>
                <p className="text-green-100">sold by customers through Sri Datta</p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 text-white">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">50+</div>
                <p className="text-purple-100">person team across India</p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 text-white">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">1M+</div>
                <p className="text-orange-100">items trusted to deliver</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 py-20 relative overflow-hidden">
        {/* Colorful background elements */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full animate-ping"></div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to get started?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Printed and shipped on demand!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/order" 
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Shop Now
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
