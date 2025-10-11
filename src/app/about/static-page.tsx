import { 
  Star, 
  Users, 
  Award, 
  Clock,
  CheckCircle,
  ArrowRight,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'

export default function StaticAboutPage() {
  const stats = [
    { number: "10+", label: "Years Experience", icon: Award },
    { number: "5000+", label: "Happy Customers", icon: Users },
    { number: "50,000+", label: "Orders Completed", icon: Star },
    { number: "24/7", label: "Online Support", icon: Clock }
  ]

  const values = [
    {
      icon: Star,
      title: "Quality First",
      description: "We never compromise on quality. Every print job is carefully inspected to ensure it meets our high standards."
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Same-day delivery across Bangalore with efficient logistics and reliable service."
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Your satisfaction is our priority. We listen to your needs and deliver exactly what you want."
    },
    {
      icon: Award,
      title: "Expert Team",
      description: "Our experienced professionals bring years of printing expertise to every project."
    }
  ]

  const timeline = [
    {
      year: "2014",
      title: "Founded",
      description: "Started as a small printing shop in Bangalore with a vision to provide quality printing services."
    },
    {
      year: "2018",
      title: "Digital Expansion",
      description: "Launched online ordering system and expanded our service offerings."
    },
    {
      year: "2020",
      title: "Same Day Delivery",
      description: "Introduced same-day delivery service across Bangalore to serve customers better."
    },
    {
      year: "2024",
      title: "Modern Platform",
      description: "Launched our new web platform with advanced features and improved user experience."
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
              About Sri Datta Print Centre
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Your trusted partner for all printing needs in Bangalore. We've been delivering 
              quality printing solutions with exceptional service for over a decade.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            <p className="text-xl text-gray-600">
              From humble beginnings to becoming Bangalore's trusted printing partner
            </p>
          </div>

          <div className="prose prose-lg mx-auto">
            <p className="text-gray-700 mb-6">
              Founded in 2014, Sri Datta Print Centre started as a small printing shop with a 
              simple mission: to provide high-quality printing services with exceptional customer 
              care. Over the years, we've grown from a local print shop to a comprehensive 
              printing solutions provider serving businesses and individuals across Bangalore.
            </p>
            
            <p className="text-gray-700 mb-6">
              Our commitment to quality, innovation, and customer satisfaction has helped us 
              build lasting relationships with our clients. We understand that every print job 
              is important, whether it's a single business card or a large marketing campaign.
            </p>

            <p className="text-gray-700">
              Today, we combine traditional printing expertise with modern technology to deliver 
              fast, reliable, and cost-effective printing solutions. Our same-day delivery service 
              and online ordering platform make it easier than ever for our customers to get 
              exactly what they need, when they need it.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {item.year}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Experience the difference that quality, service, and reliability can make for your printing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="https://app.sridattaprintcentre.com/quote"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
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
