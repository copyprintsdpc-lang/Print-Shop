import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 py-20 relative overflow-hidden">
        {/* Colorful background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-white/10 rounded-full animate-ping"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-lg font-semibold mb-6">
              📞 Get in Touch
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Contact
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Us
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Get in touch with our team for any questions, quotes, or support. 
              We're here to help with all your printing needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105 group">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">Phone</h3>
                    <p className="text-blue-700 font-medium">+91 98765 43210</p>
                    <p className="text-sm text-blue-600">Available Mon-Sat, 9AM-7PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105 group">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Email</h3>
                    <p className="text-green-700 font-medium">info@copyprintshop.com</p>
                    <p className="text-sm text-green-600">We'll respond within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105 group">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800">Address</h3>
                    <p className="text-purple-700">
                      123 Printing Street<br />
                      Bangalore, Karnataka 560001<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105 group">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800">Business Hours</h3>
                    <div className="text-orange-700">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 9:00 AM - 5:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="tel:+919876543210" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105"
                  >
                    Call Now
                  </a>
                  <a 
                    href="mailto:info@copyprintshop.com" 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form Placeholder */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Send us a Message
              </h2>
              
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 border-2 border-blue-100">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">
                    Contact Form Coming Soon
                  </h3>
                  <p className="text-blue-700 mb-6">
                    We're building a contact form that will allow you to send us messages directly. 
                    For now, please use the phone or email above.
                  </p>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 text-left border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">What you'll be able to do:</h4>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Send messages directly from the website
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        Upload files for quote requests
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Select inquiry type (quote, support, etc.)
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Get instant confirmation
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                        Track your inquiry status
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Colorful background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-ping"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Find Us
            </h2>
            <p className="text-xl text-gray-600">
              Visit our store for in-person assistance
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl h-96 flex items-center justify-center border-2 border-blue-200 shadow-xl">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Interactive Map Coming Soon
              </h3>
              <p className="text-blue-600">
                We'll add an interactive map showing our location and directions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                What file formats do you accept?
              </h3>
              <p className="text-blue-700">
                We accept PDF, JPG, PNG, and other common print formats. For best results, 
                we recommend PDF files with high resolution (300 DPI or higher).
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Do you offer same-day printing?
              </h3>
              <p className="text-green-700">
                Yes! We offer same-day printing for most services if you place your order 
                before 12:00 PM. Contact us to confirm availability for your specific project.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                What are your payment options?
              </h3>
              <p className="text-purple-700">
                We accept all major credit/debit cards, UPI, net banking, and cash on delivery. 
                We also provide GST-compliant invoices for business customers.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                Do you deliver outside Bangalore?
              </h3>
              <p className="text-orange-700">
                Yes, we provide courier delivery across India. Delivery charges and timeframes 
                vary by location. Contact us for specific delivery quotes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
