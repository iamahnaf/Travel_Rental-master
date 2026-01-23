'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TourGuide } from '@/types'
import { MapPin, Star, User } from 'lucide-react'
import { Card } from './ui/Card'

function TourGuideCard({ guide }: { guide: any }) {
  return (
    <Link href={`/tour-guides/${guide.id}`}>
      <Card hover className="overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-32 h-48 md:h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
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
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
                Available
              </div>
            )}
          </div>
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
              {(Array.isArray(guide.specialties) ? guide.specialties : (typeof guide.specialties === 'string' ? JSON.parse(guide.specialties) : [])).slice(0, 2).map((specialty: string) => (
                <span
                  key={specialty}
                  className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-xs"
                >
                  {specialty}
                </span>
              ))}
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
      </Card>
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

  if (loading) return null

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Featured Tour Guides
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Experienced local guides to explore Bangladesh
          </p>
        </div>
        <div className="space-y-4 max-w-4xl mx-auto">
          {featuredGuides.map((guide) => (
            <TourGuideCard key={guide.id} guide={guide} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/tour-guides"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 smooth-transition font-medium"
          >
            View All Tour Guides →
          </Link>
        </div>
      </div>
    </section>
  )
}
