import Link from 'next/link'
import { 
  Printer, 
  Clock, 
  Truck, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen text-white">

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen">
        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-orange-100 bg-clip-text text-transparent leading-tight">
                Build something
                <span className="block bg-gradient-to-r from-orange-300 via-pink-300 to-white bg-clip-text text-transparent">
                  Beautiful
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Create stunning prints and designs by working with our professional printing services
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/services" 
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-2 group"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/quote" 
                className="bg-orange-500/80 backdrop-blur-sm border border-orange-400/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-400/80 transition-all duration-300 shadow-lg shadow-orange-500/25"
              >
                Get Instant Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose CopyPrint Shop?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              We combine cutting-edge technology with traditional craftsmanship to deliver exceptional results
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Printer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Quality</h3>
              <p className="text-white/80">State-of-the-art printing technology for crisp, vibrant results</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Same Day Service</h3>
              <p className="text-white/80">Urgent orders completed within hours, not days</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Delivery</h3>
              <p className="text-white/80">Reliable courier service or convenient store pickup</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">GST Compliant</h3>
              <p className="text-white/80">Professional invoicing with proper tax documentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Printing Services
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Comprehensive printing solutions for every business and personal need
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Printer className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Document Printing</h3>
              <p className="text-white/80 mb-4">Professional documents, reports, and presentations with binding options</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Multiple paper options
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Binding & finishing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Same-day service available
                </li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Business Cards</h3>
              <p className="text-white/80 mb-4">Premium business cards that make lasting impressions</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Multiple finishes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Custom sizes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Quick turnaround
                </li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Banners & Posters</h3>
              <p className="text-white/80 mb-4">Large format printing for events and marketing</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Outdoor & indoor materials
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Grommets & finishing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Custom dimensions
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 group"
            >
              <span>View All Services</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Upload your files, get instant quotes, and have your prints ready in no time
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/order" 
              className="bg-white/95 backdrop-blur-sm text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Your Order
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 hover:border-white hover:scale-105 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
