import Link from 'next/link'
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Car className="w-8 h-8 text-orange-400" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 text-transparent bg-clip-text">
                TravelRen
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for car rentals, hotels, and tour guides across Bangladesh. Making travel easy and affordable.
            </p>
            <div className="flex space-x-3 pt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center smooth-transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center smooth-transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center smooth-transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-orange-400">Services</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/vehicles" className="text-gray-400 hover:text-white smooth-transition hover:translate-x-1 inline-block">
                  → Rent Car
                </Link>
              </li>
              <li>
                <Link href="/vehicles" className="text-gray-400 hover:text-white smooth-transition hover:translate-x-1 inline-block">
                  → Rent with Driver
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-gray-400 hover:text-white smooth-transition hover:translate-x-1 inline-block">
                  → Book Hotels
                </Link>
              </li>
              <li>
                <Link href="/drivers" className="text-gray-400 hover:text-white smooth-transition hover:translate-x-1 inline-block">
                  → Hire Drivers
                </Link>
              </li>
              <li>
                <Link href="/tour-guides" className="text-gray-400 hover:text-white smooth-transition hover:translate-x-1 inline-block">
                  → Tour Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-orange-400">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white smooth-transition hover:translate-x-1 inline-block">
                  → About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white smooth-transition hover:translate-x-1 inline-block">
                  → Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white smooth-transition hover:translate-x-1 inline-block">
                  → Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white smooth-transition hover:translate-x-1 inline-block">
                  → Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white smooth-transition hover:translate-x-1 inline-block">
                  → FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-orange-400">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>House 123, Road 12, Dhanmondi, Dhaka 1209, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-orange-400" />
                <span>+880 1712-345678</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-orange-400" />
                <span>info@travelren.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} TravelRen Bangladesh. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with ❤️ in Bangladesh</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
