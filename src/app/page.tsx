import Link from 'next/link'
import { 
  Printer, 
  Clock, 
  Truck, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  Search,
  ShoppingCart,
  User,
  Heart,
  Award,
  Zap,
  Palette,
  Upload,
  Download,
  FileText
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen text-white">

      {/* Hero Section with Product Showcase */}
      <section className="relative z-10 min-h-screen overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-6xl mx-auto">
            {/* Logo/Brand */}
            <div className="mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <Printer className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold">Sri Datta Print Centre</span>
              </div>
            </div>

            <div className="mb-8 animate-slide-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                For Businesses with
                <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  purpose
                </span>
                <span className="block text-3xl md:text-4xl lg:text-5xl font-normal text-white/80 mt-4">
                  explore printing solutions to power your journey
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                Professional printing services that elevate your brand with quality, speed, and innovation
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-300">
              <Link 
                href="/services" 
                className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-2 hover:scale-105 transform"
              >
                <span>Explore All Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/quote" 
                className="group text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-orange-500/50 border border-orange-300/30 hover:bg-[#F16518] hover:scale-105 transform"
                style={{ backgroundColor: '#F16E02' }}
              >
                Ask For Quote
                <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 animate-fade-in delay-500">
              <p className="text-white/60 text-sm mb-6">Trusted by businesses across India</p>
              <div className="flex justify-center items-center gap-8 opacity-60">
                <div className="text-white/40 text-2xl font-bold">500+</div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="text-white/40 text-2xl font-bold">10K+</div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="text-white/40 text-2xl font-bold">24/7</div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="text-white/40 text-2xl font-bold">99%</div>
              </div>
              <div className="flex justify-center items-center gap-8 mt-2 text-white/40 text-xs">
                <span>Happy Customers</span>
                <span>Orders Completed</span>
                <span>Support</span>
                <span>Satisfaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Product Showcase Sections */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Business Cards Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1 group">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-500 hover:scale-105 transform">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-orange-400 font-semibold text-sm uppercase tracking-wide">Featured Product</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Elevate your professional image
                </h2>
                <p className="text-xl text-white/90 mb-6">
                  Premium business cards with multiple finish options and custom designs
                </p>
                
                {/* Features List */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Spot UV Finish</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Custom Sizes</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Same Day Print</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Free Design</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl font-bold text-white">Starts at</span>
                  <span className="text-3xl font-bold text-orange-400">₹0.80</span>
                  <span className="text-white/60 line-through">₹1.20</span>
                </div>
                <Link 
                  href="/services/business-cards"
                  className="group inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 transform"
                >
                  Shop the collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* 3D Card Mockup */}
                <div className="relative w-full h-80 perspective-1000">
                  <div className="absolute inset-0 transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700">
                    <div className="w-64 h-40 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl shadow-2xl mx-auto relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <div className="absolute top-4 left-4 right-4">
                        <div className="h-2 bg-white/30 rounded mb-2"></div>
                        <div className="h-1 bg-white/20 rounded w-3/4 mb-1"></div>
                        <div className="h-1 bg-white/20 rounded w-1/2"></div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-1 bg-white/20 rounded w-1/3 mb-1"></div>
                        <div className="h-1 bg-white/20 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 transform -rotate-y-12 hover:rotate-y-0 transition-transform duration-700 delay-100">
                    <div className="w-64 h-40 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-2xl mx-auto relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <div className="absolute top-4 left-4 right-4">
                        <div className="h-2 bg-white/30 rounded mb-2"></div>
                        <div className="h-1 bg-white/20 rounded w-3/4 mb-1"></div>
                        <div className="h-1 bg-white/20 rounded w-1/2"></div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-1 bg-white/20 rounded w-1/3 mb-1"></div>
                        <div className="h-1 bg-white/20 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <p className="text-white/80 text-lg">Professional business cards</p>
                  <p className="text-white/60 text-sm">Multiple finishes & custom designs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative">
                {/* Document Mockup */}
                <div className="relative w-full h-80">
                  <div className="absolute inset-0 transform -rotate-6 hover:rotate-0 transition-transform duration-700">
                    <div className="w-64 h-80 bg-white rounded-lg shadow-2xl mx-auto relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-green-500 to-blue-600"></div>
                      <div className="absolute top-4 left-4 right-4">
                        <div className="h-3 bg-white/80 rounded mb-2"></div>
                        <div className="h-2 bg-white/60 rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-white/60 rounded w-1/2"></div>
                      </div>
                      <div className="absolute top-20 left-4 right-4 space-y-2">
                        <div className="h-1 bg-gray-300 rounded"></div>
                        <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-1 bg-gray-300 rounded w-4/6"></div>
                        <div className="h-1 bg-gray-300 rounded w-3/6"></div>
                        <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-1 bg-gray-300 rounded w-2/6"></div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 transform rotate-6 hover:rotate-0 transition-transform duration-700 delay-100">
                    <div className="w-64 h-80 bg-white rounded-lg shadow-2xl mx-auto relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                      <div className="absolute top-4 left-4 right-4">
                        <div className="h-3 bg-white/80 rounded mb-2"></div>
                        <div className="h-2 bg-white/60 rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-white/60 rounded w-1/2"></div>
                      </div>
                      <div className="absolute top-20 left-4 right-4 space-y-2">
                        <div className="h-1 bg-gray-300 rounded"></div>
                        <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-1 bg-gray-300 rounded w-4/6"></div>
                        <div className="h-1 bg-gray-300 rounded w-3/6"></div>
                        <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-1 bg-gray-300 rounded w-2/6"></div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <p className="text-white/80 text-lg">Professional documents</p>
                  <p className="text-white/60 text-sm">Reports, presentations & binding</p>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-500 hover:scale-105 transform">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-orange-400 font-semibold text-sm uppercase tracking-wide">Popular Service</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Professional document printing
                </h2>
                <p className="text-xl text-white/90 mb-6">
                  High-quality documents, reports, and presentations with binding options
                </p>
                
                {/* Features List */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Color & B&W</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Binding Options</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Same Day</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Bulk Orders</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl font-bold text-white">Starts at</span>
                  <span className="text-3xl font-bold text-orange-400">₹1.50</span>
                  <span className="text-white/60 line-through">₹2.00</span>
                </div>
                <Link 
                  href="/services/document-printing"
                  className="group inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 transform"
                >
                  Shop the collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* People's Top Choices */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              People's Top Choices
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Explore a curated selection of high-quality products designed to elevate your experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Professional Business Cards</h3>
              <p className="text-white/80 mb-4">Business Cards</p>
              <p className="text-2xl font-bold text-orange-400">Starts from ₹0.80</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Printer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Elegant Tri-fold Brochure</h3>
              <p className="text-white/80 mb-4">Brochures</p>
              <p className="text-2xl font-bold text-orange-400">Starts from ₹2.50</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Professional Envelopes</h3>
              <p className="text-white/80 mb-4">Envelopes</p>
              <p className="text-2xl font-bold text-orange-400">Starts from ₹1.20</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Promotional Flyers</h3>
              <p className="text-white/80 mb-4">Flyers</p>
              <p className="text-2xl font-bold text-orange-400">Starts from ₹1.50</p>
            </div>
          </div>
        </div>
      </section>

      {/* Design Studio Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Design Your Signature Style in 3 Ways!
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Choose the design method that works best for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center hover:bg-white/15 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Design with Sri Datta Print Centre</h3>
              <p className="text-white/80 mb-6">From Business Cards to Banners, personalize all products using our Design Studio</p>
              <Link 
                href="/design-studio"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300"
              >
                Start Designing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center hover:bg-white/15 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pick & Personalize</h3>
              <p className="text-white/80 mb-6">Explore a range of professionally designed templates and easily customize them to your needs</p>
              <Link 
                href="/templates"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300"
              >
                Browse Templates
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center hover:bg-white/15 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Upload Artwork & Design</h3>
              <p className="text-white/80 mb-6">Upload your artwork to get a vivid preview of how it looks on your selected product</p>
              <Link 
                href="/upload"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300"
              >
                Upload Now
                <ArrowRight className="w-4 h-4" />
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
              Why Choose Sri Datta Print Center?
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

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Voices of Delight
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Testimonials That Speak Volumes!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Antonio Lopez</h4>
                  <p className="text-white/70 text-sm">Business Owner</p>
                </div>
              </div>
              <p className="text-white/90 italic">
                "I was impressed by the excellent quality of cards and brochures and quick delivery. 
                The professional service exceeded my expectations."
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Henry Roberts</h4>
                  <p className="text-white/70 text-sm">Marketing Manager</p>
                </div>
              </div>
              <p className="text-white/90 italic">
                "I must tell that I am much pleased with the quality of printed cards and their 
                prompt and professional service. Good luck to your business."
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Kenneth</h4>
                  <p className="text-white/70 text-sm">Realtor</p>
                </div>
              </div>
              <p className="text-white/90 italic">
                "As a realtor I am in regular need of business cards. I appreciate your professional 
                service and fast delivery. The online printing facility surely does away with all hassles."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Free Shipping</h3>
              <p className="text-white/80">On orders above ₹500</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">100% Guarantee</h3>
              <p className="text-white/80">Satisfaction guaranteed on all products</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Lowest Price</h3>
              <p className="text-white/80">Best prices in the market</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to kickstart your print projects?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Let's roll with our tailored solutions curated just for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/quote" 
              className="text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/50 border border-orange-300/30 hover:bg-[#F16518]"
              style={{ backgroundColor: '#F16E02' }}
            >
              Get Custom Quote
            </Link>
            <Link 
              href="/design-studio" 
              className="border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 hover:border-white hover:scale-105 transition-all duration-300"
            >
              Hire a Designer
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
