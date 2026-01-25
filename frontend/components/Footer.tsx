'use client'

import Link from 'next/link'
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const columnVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
}

const linkVariants = {
  rest: { x: 0 },
  hover: { x: 6, transition: { duration: 0.2 } }
}

const socialVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.15, rotate: 5, transition: { type: "spring", stiffness: 400 } }
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Brand Section */}
          <motion.div className="space-y-4" variants={columnVariants}>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              >
                <Car className="w-8 h-8 text-primary-400" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-300 text-transparent bg-clip-text">
                TravelRen
              </h3>
            </motion.div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for car rentals, hotels, and tour guides across Bangladesh. Making travel easy and affordable.
            </p>
            <div className="flex space-x-3 pt-4">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-600/50 transition-colors"
                  variants={socialVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={columnVariants}>
            <h4 className="font-semibold text-lg mb-4 text-primary-400">Services</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/vehicles', label: 'Rent Car' },
                { href: '/vehicles', label: 'Rent with Driver' },
                { href: '/hotels', label: 'Book Hotels' },
                { href: '/drivers', label: 'Hire Drivers' },
                { href: '/tour-guides', label: 'Tour Guides' },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <motion.div
                    variants={linkVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <Link href={link.href} className="text-gray-400 hover:text-primary-300 transition-colors inline-block">
                      → {link.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={columnVariants}>
            <h4 className="font-semibold text-lg mb-4 text-primary-400">Company</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/terms', label: 'Terms & Conditions' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/faq', label: 'FAQ' },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <motion.div
                    variants={linkVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <Link href={link.href} className="text-gray-400 hover:text-primary-300 transition-colors inline-block">
                      → {link.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={columnVariants}>
            <h4 className="font-semibold text-lg mb-4 text-primary-400">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              {[
                { icon: MapPin, text: 'House 123, Road 12, Dhanmondi, Dhaka 1209, Bangladesh', isAddress: true },
                { icon: Phone, text: '+880 1712-345678' },
                { icon: Mail, text: 'info@travelren.com' },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className={`flex ${item.isAddress ? 'items-start' : 'items-center'} space-x-3 text-gray-400`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 3 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <item.icon className={`w-5 h-5 text-primary-400 flex-shrink-0 ${item.isAddress ? 'mt-0.5' : ''}`} />
                  </motion.div>
                  <span>{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="pt-8 border-t border-gray-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
            >
              &copy; {new Date().getFullYear()} TravelRen Bangladesh. All rights reserved.
            </motion.p>
            <motion.p 
              className="mt-2 md:mt-0"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
            >
              Made with{' '}
              <motion.span
                className="inline-block"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                ❤️
              </motion.span>{' '}
              in Bangladesh
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
