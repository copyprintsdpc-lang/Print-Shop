import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageCircle,
  Send,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function StaticContactPage() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Location",
      details: [
        "Sri Datta Print Centre",
        "Bangalore, Karnataka",
        "India"
      ]
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        "Hotline: 00 1900 8188",
        "Mobile: +91 XXXXX XXXXX",
        "WhatsApp: +91 XXXXX XXXXX"
      ]
    },
    {
      icon: Mail,
      title: "Email Address",
      details: [
        "General: info@sridattaprintcentre.com",
        "Orders: orders@sridattaprintcentre.com",
        "Support: support@sridattaprintcentre.com"
      ]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9:00 AM - 7:00 PM",
        "Saturday: 9:00 AM - 5:00 PM",
        "Sunday: 10:00 AM - 4:00 PM"
      ]
    }
  ]

  const services = [
    "Digital Printing",
    "Business Cards",
    "Photo Printing",
    "Binding Services",
    "Same Day Delivery",
    "Online Ordering"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Get in touch with our team for all your printing needs. We're here to help 
              you with quality printing solutions and excellent customer service.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <div className="space-y-1">
                  {item.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-600">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Required
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell us about your printing requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  Send Message
                  <Send className="ml-2 w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Additional Information */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <Link 
                    href="https://app.sridattaprintcentre.com/quote"
                    className="flex items-center p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-900">Get Instant Quote</div>
                      <div className="text-sm text-gray-600">Upload files and get pricing</div>
                    </div>
                  </Link>
                  
                  <Link 
                    href="https://app.sridattaprintcentre.com/order"
                    className="flex items-center p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <Send className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-900">Place Order</div>
                      <div className="text-sm text-gray-600">Start your printing order</div>
                    </div>
                  </Link>

                  <Link 
                    href="https://app.sridattaprintcentre.com/login"
                    className="flex items-center p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <CheckCircle className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-900">Track Order</div>
                      <div className="text-sm text-gray-600">Login to track your orders</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">Same Day Delivery</div>
                      <div className="text-sm text-gray-600">Fast delivery across Bangalore</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">Quality Guarantee</div>
                      <div className="text-sm text-gray-600">100% satisfaction guaranteed</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">Expert Service</div>
                      <div className="text-sm text-gray-600">Professional team with experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
