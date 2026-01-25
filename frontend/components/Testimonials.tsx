'use client'

import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Fatima Rahman',
    location: 'Dhaka, Bangladesh',
    rating: 5,
    comment: 'Amazing platform! Booked a car and hotel for our family trip. Everything was perfect and the service was excellent.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format',
  },
  {
    name: 'Karim Uddin',
    location: 'Chittagong, Bangladesh',
    rating: 5,
    comment: 'Best travel booking site in Bangladesh! The tour guide we hired was fantastic. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
  },
  {
    name: 'Sadia Islam',
    location: 'Sylhet, Bangladesh',
    rating: 5,
    comment: 'Very user-friendly platform. Found great deals on hotels and the booking process was so smooth.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
  },
]

export function Testimonials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  const starVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    })
  }

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mb-4"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: "200% 200%" }}
          >
            What Our Customers Say
          </motion.h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Trusted by thousands of travelers across Bangladesh
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="relative group"
              variants={cardVariants}
            >
              {/* Glassmorphism card */}
              <motion.div 
                className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/40 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl"
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ rotate: 0, opacity: 0.2 }}
                  whileHover={{ rotate: 15, opacity: 0.4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Quote className="absolute top-4 right-4 w-10 h-10 text-indigo-200 dark:text-indigo-900/40" />
                </motion.div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <motion.div 
                    className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/50 dark:ring-gray-700/50"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={starVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
