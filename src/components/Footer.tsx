import Link from 'next/link'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Linkedin,
  Printer,
  FileText,
  Star,
  Truck
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/sdpclogo.png" 
                alt="Sri Datta Print Centre" 
                className="header-logo h-12 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Professional digital printing services with same-day delivery options. 
              Quality prints for businesses and individuals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#documents" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Document Printing
                </Link>
              </li>
              <li>
                <Link href="/services#business-cards" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Business Cards
                </Link>
              </li>
              <li>
                <Link href="/services#banners" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Banners & Posters
                </Link>
              </li>
              <li>
                <Link href="/services#stickers" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Stickers & Labels
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/quote" className="text-gray-300 hover:text-white transition-colors">
                  Get Quote
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-gray-300 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">+91 8897379737</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">info@sridattaprintcentre.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-1" />
                <span className="text-gray-300 text-sm">
                  Shop No. 2, Cellar Floor,<br />
                  Siri Plaza, KPHB Main,<br />
                  Kukatpally, Hyderabad,<br />
                  Telangana 500072
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">Mon-Sat: 9AM-9PM<br />Sun: 10:30AM-7PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gradient-to-r from-orange-500/20 via-pink-500/20 to-transparent mt-8 pt-8" style={{borderImageSource: 'linear-gradient(to right, rgba(255, 69, 0, 0.2), rgba(255, 105, 180, 0.2), transparent)', borderImageSlice: 1}}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 Sri Datta Print Center. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-600 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-gray-600 hover:text-white text-sm transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
