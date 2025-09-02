import Link from 'next/link'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  Linkedin,
  Printer,
  FileText,
  Star,
  Truck
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative text-white overflow-hidden">
      {/* Dreamy Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_50%_120%,#ff4500_0%,#ff6347_20%,#ff7f50_35%,#ff69b4_50%,rgba(255,105,180,0)_70%),linear-gradient(180deg,#1a1a2e_0%,#16213e_30%,#0f3460_60%,#533483_80%,#16213e_100%)]"></div>
      
      {/* Subtle Noise/Grain Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
      
      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(26,26,46,0.3)_100%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-300 to-pink-300 bg-clip-text text-transparent">CopyPrint Shop</span>
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
                <Twitter className="w-5 h-5" />
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
                <Link href="/order" className="text-gray-300 hover:text-white transition-colors">
                  Place Order
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
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">info@copyprintshop.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">Bangalore, Karnataka</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">Mon-Sat: 9AM-7PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gradient-to-r from-orange-500/20 via-pink-500/20 to-transparent mt-8 pt-8" style={{borderImageSource: 'linear-gradient(to right, rgba(255, 69, 0, 0.2), rgba(255, 105, 180, 0.2), transparent)', borderImageSlice: 1}}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 CopyPrint Shop. All rights reserved.
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
