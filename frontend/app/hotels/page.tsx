'use client'

import { useState, useMemo, useEffect } from 'react'
import { mockHotels } from '@/lib/mockData'
import { Hotel } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Bed, Filter } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { HostelCardSkeleton } from '@/components/ui/LoadingSkeleton'

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
              {hotel.rating} {hotel.reviews && hotel.reviews.length > 0 && `(${hotel.reviews.length} reviews)`}
            </span>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Starting from</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                ৳{parseFloat(hotel.price_per_night || hotel.pricePerNight).toLocaleString()}
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/night</span>
              </p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {hotel.available_rooms}/{hotel.total_rooms} rooms
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
  })

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/hotels')
        if (response.ok) {
          const data = await response.json()
          setHotels(data.data)
        }
      } catch (error) {
        console.error('Error fetching hotels:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [])

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const price = parseFloat(hotel.price_per_night || hotel.pricePerNight)
      const rating = parseFloat(hotel.rating)
      const city = hotel.city || ''

      if (filters.location && !city.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.minPrice && price < parseInt(filters.minPrice)) return false
      if (filters.maxPrice && price > parseInt(filters.maxPrice)) return false
      if (filters.minRating && rating < parseFloat(filters.minRating)) return false
      return true
    })
  }, [hotels, filters])

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Browse Hotels
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find comfortable and affordable accommodation
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
                    Price Range (per night)
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
              </div>
            </Card>
          </div>

          {/* Hotels Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <HostelCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredHotels.length === 0 ? (
              <EmptyState
                icon={<Bed className="w-16 h-16" />}
                title="No hotels found"
                description="Try adjusting your filters to see more results"
                action={
                  <Button onClick={clearFilters}>Clear Filters</Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
