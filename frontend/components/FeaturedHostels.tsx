'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Hotel } from '@/types'
import { MapPin, Star, Bed } from 'lucide-react'
import { Card } from './ui/Card'

function HotelCard({ hotel }: { hotel: any }) {
  const images = Array.isArray(hotel.image_urls) ? hotel.image_urls : (typeof hotel.image_urls === 'string' ? JSON.parse(hotel.image_urls) : [])
  
  return (
    <Link href={`/hotels/${hotel.id}`}>
      <Card hover className="overflow-hidden">
        <div className="relative h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
          {images[0] ? (
            <Image
              src={images[0]}
              alt={hotel.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Bed className="w-16 h-16" />
            </div>
          )}
          {hotel.available_rooms > 0 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
              {hotel.available_rooms} Rooms Available
            </div>
          )}
        </div>
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
      </Card>
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

  if (loading) return null

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Featured Hotels
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Comfortable stays at great prices
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/hotels"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 smooth-transition font-medium"
          >
            View All Hotels →
          </Link>
        </div>
      </div>
    </section>
  )
}
