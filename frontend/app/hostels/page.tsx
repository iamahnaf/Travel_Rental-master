'use client'

import { useState, useMemo } from 'react'
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
import { motion, AnimatePresence } from 'framer-motion'

function HotelCard({ hotel, index }: { hotel: Hotel; index: number }) {
  return (
    <Link href={`/hotels/${hotel.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="h-full"
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 cursor-pointer overflow-hidden h-full"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          <motion.div 
            className="relative h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {hotel.images && hotel.images[0] ? (
              <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={hotel.images[0]}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <Bed className="w-16 h-16" />
              </div>
            )}
            {hotel.availableRooms > 0 && (
              <motion.div 
                className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.2 + index * 0.05 }}
              >
                {hotel.availableRooms} Rooms Available
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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 500 }}
                >
                  <Star
                    className={`w-4 h-4 ${
                      i < Math.floor(hotel.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </motion.div>
              ))}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                {hotel.rating}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Starting from</p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ৳{hotel.pricePerNight.toLocaleString()}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/night</span>
                </p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {hotel.availableRooms}/{hotel.totalRooms} rooms
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  )
}

export default function HostelsPage() {
  const [hotels] = useState<Hotel[]>(mockHotels)
  const [loading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
  })

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      if (filters.location && !hotel.city.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.minPrice && hotel.pricePerNight < parseInt(filters.minPrice)) return false
      if (filters.maxPrice && hotel.pricePerNight > parseInt(filters.maxPrice)) return false
      if (filters.minRating && hotel.rating < parseFloat(filters.minRating)) return false
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
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Browse Hotels
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find comfortable and affordable accommodation
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <motion.div 
            className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-24"
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Filters
                </h2>
                <motion.button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear
                </motion.button>
              </div>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <Input
                    placeholder="City name"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hotels Grid */}
          <div className="flex-1">
            <motion.div 
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-600 dark:text-gray-400">
                <motion.span
                  key={filteredHotels.length}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block"
                >
                  {filteredHotels.length}
                </motion.span>{' '}
                hotel{filteredHotels.length !== 1 ? 's' : ''} found
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </motion.div>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <HostelCardSkeleton />
                  </motion.div>
                ))}
              </div>
            ) : filteredHotels.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <EmptyState
                  icon={<Bed className="w-16 h-16" />}
                  title="No hotels found"
                  description="Try adjusting your filters to see more results"
                  action={
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  }
                />
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {filteredHotels.map((hotel, index) => (
                    <HotelCard key={hotel.id} hotel={hotel} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
