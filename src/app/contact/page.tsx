import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Get in touch with our team for any questions, quotes, or support. 
              We're here to help with all your printing needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-800">+91 98765 43210</p>
                    <p className="text-sm text-gray-500">Available Mon-Sat, 9AM-7PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-800">info@copyprintshop.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-800">
                      123 Printing Street<br />
                      Bangalore, Karnataka 560001<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                    <div className="text-gray-800">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 9:00 AM - 5:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="tel:+919876543210" 
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                  >
                    Call Now
                  </a>
                  <a 
                    href="mailto:info@copyprintshop.com" 
                    className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors text-center"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form Placeholder */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Send us a Message
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Contact Form Coming Soon
                  </h3>
                  <p className="text-gray-800 mb-6">
                    We're building a contact form that will allow you to send us messages directly. 
                    For now, please use the phone or email above.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <h4 className="font-semibold text-gray-900 mb-2">What you'll be able to do:</h4>
                    <ul className="text-sm text-gray-800 space-y-1">
                      <li>• Send messages directly from the website</li>
                      <li>• Upload files for quote requests</li>
                      <li>• Select inquiry type (quote, support, etc.)</li>
                      <li>• Get instant confirmation</li>
                      <li>• Track your inquiry status</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Us
            </h2>
            <p className="text-xl text-gray-800">
              Visit our store for in-person assistance
            </p>
          </div>
          
          <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Interactive Map Coming Soon
              </h3>
              <p className="text-gray-500">
                We'll add an interactive map showing our location and directions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-800">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What file formats do you accept?
              </h3>
              <p className="text-gray-800">
                We accept PDF, JPG, PNG, and other common print formats. For best results, 
                we recommend PDF files with high resolution (300 DPI or higher).
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer same-day printing?
              </h3>
              <p className="text-gray-800">
                Yes! We offer same-day printing for most services if you place your order 
                before 12:00 PM. Contact us to confirm availability for your specific project.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What are your payment options?
              </h3>
              <p className="text-gray-800">
                We accept all major credit/debit cards, UPI, net banking, and cash on delivery. 
                We also provide GST-compliant invoices for business customers.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you deliver outside Bangalore?
              </h3>
              <p className="text-gray-800">
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
