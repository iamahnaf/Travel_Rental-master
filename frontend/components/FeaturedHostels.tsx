'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Hotel } from '@/types'
import { MapPin, Star, Bed } from 'lucide-react'
import { motion } from 'framer-motion'
import { ShimmerSkeleton } from './ui/AnimatedComponents'

function HotelCard({ hotel, index }: { hotel: any; index: number }) {
  const images = Array.isArray(hotel.image_urls) ? hotel.image_urls : (typeof hotel.image_urls === 'string' ? JSON.parse(hotel.image_urls) : [])
  
  return (
    <Link href={`/hotels/${hotel.id}`}>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 cursor-pointer overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ 
          y: -8, 
          scale: 1.02,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div 
          className="relative h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden"
          whileHover="hover"
          initial="rest"
        >
          {images[0] ? (
            <motion.div className="w-full h-full">
              <Image
                src={images[0]}
                alt={hotel.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <motion.div
                className="absolute inset-0"
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.08 }
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Bed className="w-16 h-16" />
            </div>
          )}
          {hotel.available_rooms > 0 && (
            <motion.div 
              className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.3 + index * 0.1 }}
            >
              {hotel.available_rooms} Rooms Available
            </motion.div>
          )}
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {hotel.name}
          </h3>
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{hotel.city}</span>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(hotel.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              {hotel.rating}
            </span>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Starting from</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                ৳{parseFloat(hotel.price_per_night || 0).toLocaleString()}
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/night</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export function FeaturedHostels() {
  const [featuredHotels, setFeaturedHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/hotels')
        if (response.ok) {
          const data = await response.json()
          setFeaturedHotels(data.data.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching featured hotels:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [])

  if (loading) return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <ShimmerSkeleton className="h-96 rounded-xl" />
        <ShimmerSkeleton className="h-96 rounded-xl" />
        <ShimmerSkeleton className="h-96 rounded-xl" />
      </div>
    </section>
  )

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Featured Hotels
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Comfortable stays at great prices
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHotels.map((hotel, index) => (
            <HotelCard key={hotel.id} hotel={hotel} index={index} />
          ))}
        </div>
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/hotels"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
            >
              View All Hotels →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
