'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Driver } from '@/types'
import { MapPin, Star, Car, Languages } from 'lucide-react'
import { Card } from './ui/Card'

function DriverCard({ driver }: { driver: any }) {
  return (
    <Link href={`/drivers/${driver.id}`}>
      <Card hover className="overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-32 h-48 md:h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            {driver.photo_url ? (
              <Image
                src={driver.photo_url}
                alt={driver.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 128px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <Car className="w-16 h-16" />
              </div>
            )}
            {driver.available && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
                Available
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {driver.name}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{driver.city || 'Dhaka'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(driver.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                {driver.rating} ({driver.total_rides || 0} rides)
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Languages className="w-4 h-4" />
              <span>{Array.isArray(driver.languages) ? driver.languages.join(', ') : (typeof driver.languages === 'string' ? JSON.parse(driver.languages).join(', ') : 'Bengali, English')}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Starting from</p>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  ৳{parseFloat(driver.price_per_day || 1500).toLocaleString()}
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

export function FeaturedDrivers() {
  const [featuredDrivers, setFeaturedDrivers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/drivers')
        if (response.ok) {
          const data = await response.json()
          setFeaturedDrivers(data.data.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching featured drivers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDrivers()
  }, [])

  if (loading) return null

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Featured Drivers
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Professional drivers for your vehicle
          </p>
        </div>
        <div className="space-y-4 max-w-4xl mx-auto">
          {featuredDrivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/drivers"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 smooth-transition font-medium"
          >
            View All Drivers →
          </Link>
        </div>
      </div>
    </section>
  )
}
