'use client'

import { Star, Quote } from 'lucide-react'
import { Card } from './ui/Card'

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
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Trusted by thousands of travelers across Bangladesh
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Glassmorphism card */}
              <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/40 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl smooth-transition hover:-translate-y-2">
                <Quote className="absolute top-4 right-4 w-10 h-10 text-indigo-200 dark:text-indigo-900/40" />
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/50 dark:ring-gray-700/50">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
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
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
