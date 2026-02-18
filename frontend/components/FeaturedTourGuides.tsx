'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TourGuide } from '@/types'
import { MapPin, Star, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { ShimmerSkeleton } from './ui/AnimatedComponents'

function TourGuideCard({ guide, index }: { guide: any; index: number }) {
  return (
    <Link href={`/tour-guides/${guide.id}`}>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 cursor-pointer overflow-hidden"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)"
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <motion.div 
            className="relative w-full md:w-32 h-48 md:h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {guide.photo_url ? (
              <Image
                src={guide.photo_url}
                alt={guide.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 128px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <User className="w-16 h-16" />
              </div>
            )}
            {guide.available && (
              <motion.div 
                className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.3 + index * 0.1 }}
              >
                Available
              </motion.div>
            )}
          </motion.div>
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {guide.name}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{guide.city}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(guide.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                {guide.rating} ({guide.total_tours || 0} tours)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(() => {
                let specialties: string[] = [];
                if (Array.isArray(guide.specialties)) {
                  specialties = guide.specialties;
                } else if (typeof guide.specialties === 'string') {
                  try {
                    const parsed = JSON.parse(guide.specialties);
                    specialties = Array.isArray(parsed) ? parsed : [];
                  } catch {
                    specialties = [];
                  }
                }
                return specialties.slice(0, 2).map((specialty: string, i: number) => (
                <motion.span
                  key={specialty}
                  className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-xs"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {specialty}
                </motion.span>
                ));
              })()}
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Starting from</p>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  ৳{parseFloat(guide.price_per_day || 2000).toLocaleString()}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/day</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export function FeaturedTourGuides() {
  const [featuredGuides, setFeaturedGuides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/tour-guides')
        if (response.ok) {
          const data = await response.json()
          setFeaturedGuides(data.data.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching featured tour guides:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGuides()
  }, [])

  if (loading) return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        <ShimmerSkeleton className="h-40 rounded-xl" />
        <ShimmerSkeleton className="h-40 rounded-xl" />
        <ShimmerSkeleton className="h-40 rounded-xl" />
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
            Featured Tour Guides
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Experienced local guides to explore Bangladesh
          </p>
        </motion.div>
        <div className="space-y-4 max-w-4xl mx-auto">
          {featuredGuides.map((guide, index) => (
            <TourGuideCard key={guide.id} guide={guide} index={index} />
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
              href="/tour-guides"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
            >
              View All Tour Guides →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
