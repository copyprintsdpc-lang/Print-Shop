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

export default function ServicesPageCreative() {
  const serviceCategories = [
    {
      title: "🔹 Printing",
      services: [
        { name: "Jumbo Colour Printing", description: "Extra-large vibrant prints for posters and displays", icon: Printer },
        { name: "Digital Colour Printing", description: "Professional digital prints for brochures and reports", icon: FileText },
        { name: "Photocopy (B/W & Colour)", description: "Fast, reliable copies for study and office use", icon: Copy },
        { name: "Internet Prints", description: "Print directly from email, cloud, or uploads", icon: Wifi },
        { name: "Project Prints", description: "Quality printing for reports, theses, and manuals", icon: BookOpen },
        { name: "Tracing / Blue Prints", description: "Precise architectural & engineering drawings", icon: Ruler },
        { name: "Auto CAD Printing", description: "Scale-accurate CAD drawings with sharp detail", icon: Layers }
      ]
    },
    {
      title: "🔹 Specialty Prints",
      services: [
        { name: "WhatsApp Print", description: "Convenient printing of files sent via WhatsApp", icon: Smartphone },
        { name: "Photo Prints", description: "High-quality glossy or matte photo prints", icon: Camera },
        { name: "Sticker Prints", description: "Custom labels and stickers in sheets or die-cut", icon: Tag }
      ]
    },
    {
      title: "🔹 Cards & Identity",
      services: [
        { name: "Visiting Cards", description: "Premium business cards with modern finishes", icon: CreditCard },
        { name: "Smart Cards", description: "Custom PVC smart cards for access or loyalty", icon: CreditCard },
        { name: "ID Cards", description: "Durable staff and student ID cards with lanyards", icon: User }
      ]
    },
    {
      title: "🔹 Finishing & Binding",
      services: [
        { name: "Lamination", description: "Protect documents with matte or gloss lamination", icon: Shield },
        { name: "Binding", description: "Spiral, wiro, thermal, and perfect binding options", icon: BookOpen },
        { name: "Project Binding", description: "Submission-ready thesis and report binding", icon: FileText }
      ]
    },
    {
      title: "🔹 Digital & Scanning",
      services: [
        { name: "Scanning", description: "High-resolution scans of documents, photos, and blueprints", icon: Scan }
      ]
    },
    {
      title: "🔹 Customized Gifts & Apparel",
      services: [
        { name: "Mug Printing", description: "Personalized mugs with photos or logos", icon: Coffee },
        { name: "T-Shirt Printing", description: "Custom T-shirts with vibrant designs", icon: Shirt }
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-white/10 rounded-full animate-ping"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-lg font-semibold mb-6">
              🎨 Professional Printing Services
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Our Printing
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Professional printing solutions for all your business and personal needs. 
              Quality guaranteed with fast turnaround times.
            </p>
          </div>
        </div>
      </section>

      {/* Services by Category - Ultra Creative Responsive Layouts */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {serviceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
                {category.title}
              </h2>
              
              {/* Layout 1: Zigzag pattern for large categories */}
              {category.services.length > 4 ? (
                <div className="space-y-8">
                  {category.services.map((service, serviceIndex) => {
                    const IconComponent = service.icon
                    const colorThemes = [
                      'from-blue-500 to-purple-600',
                      'from-green-500 to-emerald-600', 
                      'from-purple-500 to-pink-600',
                      'from-orange-500 to-red-600',
                      'from-cyan-500 to-blue-600',
                      'from-pink-500 to-rose-600',
                      'from-indigo-500 to-purple-600'
                    ]
                    
                    const textColors = [
                      'text-blue-800',
                      'text-green-800',
                      'text-purple-800', 
                      'text-orange-800',
                      'text-blue-800',
                      'text-pink-800',
                      'text-indigo-800'
                    ]
                    
                    const bgColors = [
                      'from-blue-50 to-blue-100',
                      'from-green-50 to-green-100',
                      'from-purple-50 to-purple-100',
                      'from-orange-50 to-orange-100', 
                      'from-cyan-50 to-cyan-100',
                      'from-pink-50 to-pink-100',
                      'from-indigo-50 to-indigo-100'
                    ]
                    
                    const borderColors = [
                      'border-blue-200',
                      'border-green-200',
                      'border-purple-200',
                      'border-orange-200',
                      'border-cyan-200', 
                      'border-pink-200',
                      'border-indigo-200'
                    ]
                    
                    const themeIndex = serviceIndex % colorThemes.length
                    const isEven = serviceIndex % 2 === 0
                    
                    return (
                      <div key={serviceIndex} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8`}>
                        <div className={`flex-1 ${isEven ? 'lg:pr-8' : 'lg:pl-8'}`}>
                          <div className={`bg-gradient-to-br ${bgColors[themeIndex]} border-2 ${borderColors[themeIndex]} rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl group`}>
                            <div className="text-center lg:text-left">
                              <div className={`bg-gradient-to-r ${colorThemes[themeIndex]} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                                <IconComponent className="w-10 h-10 text-white" />
                              </div>
                              <h3 className={`text-2xl font-bold ${textColors[themeIndex]} mb-4`}>
                                {service.name}
                              </h3>
                              <p className={`text-lg ${textColors[themeIndex].replace('800', '600')} mb-6`}>
                                {service.description}
                              </p>
                              <Link
                                href="/quote"
                                className={`inline-flex items-center bg-gradient-to-r ${colorThemes[themeIndex]} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                              >
                                Get Quote
                                <ArrowRight className="w-5 h-5 ml-2" />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <IconComponent className="w-24 h-24 mx-auto mb-4 opacity-50" />
                              <p className="text-lg font-medium">Service Preview</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : category.services.length === 1 ? (
                /* Layout 2: Full-width hero card */
                <div className="w-full">
                  {category.services.map((service, serviceIndex) => {
                    const IconComponent = service.icon
                    const colorThemes = ['from-blue-500 to-purple-600']
                    const textColors = ['text-blue-800']
                    const bgColors = ['from-blue-50 to-blue-100']
                    const borderColors = ['border-blue-200']
                    
                    return (
                      <div key={serviceIndex} className={`bg-gradient-to-br ${bgColors[0]} border-2 ${borderColors[0]} rounded-3xl p-12 hover:scale-105 transition-all duration-300 hover:shadow-2xl group`}>
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                          <div className="flex-1 text-center lg:text-left">
                            <div className={`bg-gradient-to-r ${colorThemes[0]} w-24 h-24 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-8 shadow-lg group-hover:shadow-xl transition-shadow`}>
                              <IconComponent className="w-12 h-12 text-white" />
                            </div>
                            <h3 className={`text-4xl font-bold ${textColors[0]} mb-6`}>
                              {service.name}
                            </h3>
                            <p className={`text-xl ${textColors[0].replace('800', '600')} mb-8`}>
                              {service.description}
                            </p>
                            <Link
                              href="/quote"
                              className={`inline-flex items-center bg-gradient-to-r ${colorThemes[0]} text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-lg`}
                            >
                              Get Quote
                              <ArrowRight className="w-6 h-6 ml-3" />
                            </Link>
                          </div>
                          <div className="flex-1">
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <IconComponent className="w-32 h-32 mx-auto mb-4 opacity-50" />
                                <p className="text-xl font-medium">Service Preview</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : category.services.length === 2 ? (
                /* Layout 3: Stacked cards on mobile, side-by-side on desktop */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {category.services.map((service, serviceIndex) => {
                    const IconComponent = service.icon
                    const colorThemes = ['from-blue-500 to-purple-600', 'from-green-500 to-emerald-600']
                    const textColors = ['text-blue-800', 'text-green-800']
                    const bgColors = ['from-blue-50 to-blue-100', 'from-green-50 to-green-100']
                    const borderColors = ['border-blue-200', 'border-green-200']
                    
                    const themeIndex = serviceIndex % colorThemes.length
                    
                    return (
                      <div key={serviceIndex} className={`bg-gradient-to-br ${bgColors[themeIndex]} border-2 ${borderColors[themeIndex]} rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl group`}>
                        <div className="text-center">
                          <div className={`bg-gradient-to-r ${colorThemes[themeIndex]} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <IconComponent className="w-10 h-10 text-white" />
                          </div>
                          <h3 className={`text-2xl font-bold ${textColors[themeIndex]} mb-4`}>
                            {service.name}
                          </h3>
                          <p className={`text-lg ${textColors[themeIndex].replace('800', '600')} mb-6`}>
                            {service.description}
                          </p>
                          <Link
                            href="/quote"
                            className={`inline-flex items-center bg-gradient-to-r ${colorThemes[themeIndex]} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                          >
                            Get Quote
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* Layout 4: Triangle formation for 3 services */
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                  {category.services.map((service, serviceIndex) => {
                    const IconComponent = service.icon
                    const colorThemes = [
                      'from-blue-500 to-purple-600',
                      'from-green-500 to-emerald-600', 
                      'from-purple-500 to-pink-600'
                    ]
                    
                    const textColors = [
                      'text-blue-800',
                      'text-green-800',
                      'text-purple-800'
                    ]
                    
                    const bgColors = [
                      'from-blue-50 to-blue-100',
                      'from-green-50 to-green-100',
                      'from-purple-50 to-purple-100'
                    ]
                    
                    const borderColors = [
                      'border-blue-200',
                      'border-green-200',
                      'border-purple-200'
                    ]
                    
                    const themeIndex = serviceIndex % colorThemes.length
                    const positions = [
                      'lg:order-1', // Top
                      'lg:order-2 lg:mt-16', // Bottom left
                      'lg:order-3 lg:mt-16'  // Bottom right
                    ]
                    
                    return (
                      <div key={serviceIndex} className={`${positions[serviceIndex]} w-full lg:w-80`}>
                        <div className={`bg-gradient-to-br ${bgColors[themeIndex]} border-2 ${borderColors[themeIndex]} rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl group`}>
                          <div className="text-center">
                            <div className={`bg-gradient-to-r ${colorThemes[themeIndex]} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <h3 className={`text-lg font-bold ${textColors[themeIndex]} mb-2`}>
                              {service.name}
                            </h3>
                            <p className={`text-sm ${textColors[themeIndex].replace('800', '600')} mb-4`}>
                              {service.description}
                            </p>
                            <Link
                              href="/quote"
                              className={`inline-flex items-center bg-gradient-to-r ${colorThemes[themeIndex]} text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm`}
                            >
                              Get Quote
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us - Creative Layout */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-ping"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Sri Datta Print Center?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with traditional craftsmanship
            </p>
          </div>
          
          {/* Creative responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Printer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Premium Quality</h3>
              <p className="text-blue-700">State-of-the-art printing technology for crisp, vibrant results</p>
            </div>
            
            <div className="text-center group bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Fast Turnaround</h3>
              <p className="text-green-700">Same-day service available for most products</p>
            </div>
            
            <div className="text-center group bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-2">GST Compliant</h3>
              <p className="text-purple-700">Professional invoicing with proper tax documentation</p>
            </div>
            
            <div className="text-center group bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Reliable Delivery</h3>
              <p className="text-orange-700">Fast and secure delivery or convenient pickup options</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info - Creative Layout */}
      <section className="bg-gradient-to-br from-gray-800 to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Contact us today for a quote or visit our store
            </p>
          </div>
          
          {/* Creative contact layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow group-hover:scale-110">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Visit Our Store</h3>
              <p className="text-gray-300 text-lg">123 Main Street, City, State 12345</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow group-hover:scale-110">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Call Us</h3>
              <p className="text-gray-300 text-lg">+1 (555) 123-4567</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow group-hover:scale-110">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Email Us</h3>
              <p className="text-gray-300 text-lg">info@sridattaprint.com</p>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Link 
              href="/quote" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-6 rounded-2xl font-semibold text-xl hover:shadow-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center gap-3"
            >
              Get Instant Quote
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
