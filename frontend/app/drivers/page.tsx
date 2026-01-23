'use client'

import { useState, useMemo, useEffect } from 'react'
import { mockDrivers } from '@/lib/mockData'
import { Driver } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Car, Filter, Languages } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'

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
                  ৳{parseFloat(driver.price_per_day || driver.pricePerDay || 1500).toLocaleString()}
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

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    language: '',
  })

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/drivers')
        if (response.ok) {
          const data = await response.json()
          setDrivers(data.data)
        }
      } catch (error) {
        console.error('Error fetching drivers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDrivers()
  }, [])

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const price = parseFloat(driver.price_per_day || driver.pricePerDay || 1500)
      const rating = parseFloat(driver.rating)
      const city = driver.city || ''
      const languages = Array.isArray(driver.languages) ? driver.languages : (typeof driver.languages === 'string' ? JSON.parse(driver.languages) : [])

      if (filters.location && !city.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.minPrice && price < parseInt(filters.minPrice)) return false
      if (filters.maxPrice && price > parseInt(filters.maxPrice)) return false
      if (filters.minRating && rating < parseFloat(filters.minRating)) return false
      if (filters.language && !languages.some((l: string) => l.toLowerCase().includes(filters.language.toLowerCase()))) return false
      return true
    })
  }, [drivers, filters])

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      language: '',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Browse Drivers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find professional drivers for your vehicle
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <Input
                    placeholder="City name"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Range (per day)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Any</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <Input
                    placeholder="e.g., English"
                    value={filters.language}
                    onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Drivers Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {filteredDrivers.length} driver{filteredDrivers.length !== 1 ? 's' : ''} found
              </p>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <div className="animate-pulse flex gap-4">
                      <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredDrivers.length === 0 ? (
              <EmptyState
                icon={<Car className="w-16 h-16" />}
                title="No drivers found"
                description="Try adjusting your filters to see more results"
                action={
                  <Button onClick={clearFilters}>Clear Filters</Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {filteredDrivers.map((driver) => (
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
