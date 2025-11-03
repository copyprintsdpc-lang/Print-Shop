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

export default function StaticServicesPage() {
  const serviceCategories = [
    {
      title: "🔹 Printing Services",
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
        { name: "Business Cards", description: "Professional business cards with various finishes", icon: CreditCard },
        { name: "ID Cards", description: "Durable ID cards for offices and institutions", icon: User },
        { name: "Laminated Cards", description: "Long-lasting laminated identification cards", icon: Shield }
      ]
    },
    {
      title: "🔹 Binding & Finishing",
      services: [
        { name: "Spiral Binding", description: "Durable spiral binding for reports and manuals", icon: Layers },
        { name: "Perfect Binding", description: "Professional book-style binding", icon: BookOpen },
        { name: "Stapling", description: "Quick stapling for documents and booklets", icon: FileText }
      ]
    }
  ]

  const features = [
    {
      icon: Truck,
      title: "Same Day Delivery",
      description: "Fast delivery across Bangalore with same-day options"
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee on all printing services"
    },
    {
      icon: Clock,
      title: "24/7 Online Orders",
      description: "Order anytime through our online portal"
    },
    {
      icon: Star,
      title: "Expert Service",
      description: "Professional team with years of printing experience"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Professional Printing Services
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              From business cards to large format prints, we deliver quality printing solutions 
              with same-day delivery across Bangalore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="https://app.sridattaprintcentre.com/quote"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
              >
                Get Instant Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="https://app.sridattaprintcentre.com/order"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
              >
                Place Order
                <Upload className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Printing Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive printing solutions for all your business and personal needs
            </p>
          </div>

          <div className="space-y-12">
            {serviceCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-purple-50 transition-colors">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <service.icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of satisfied customers who trust us with their printing needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="https://app.sridattaprintcentre.com/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
            >
              Create Account
              <User className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
            >
              Contact Us
              <Phone className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
