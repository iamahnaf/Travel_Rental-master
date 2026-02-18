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
import { motion, AnimatePresence } from 'framer-motion'

function DriverCard({ driver, index }: { driver: any; index: number }) {
  return (
    <Link href={`/drivers/${driver.id}`}>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.4, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ x: 8 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 cursor-pointer overflow-hidden"
          whileHover={{ boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <motion.div 
              className="relative w-full md:w-32 h-48 md:h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
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
                <motion.div 
                  className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.2 + index * 0.05 }}
                >
                  Available
                </motion.div>
              )}
            </motion.div>
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
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.05, type: "spring", stiffness: 500 }}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        i < Math.floor(driver.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </motion.div>
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  {driver.rating} ({driver.total_rides || 0} rides)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Languages className="w-4 h-4" />
                <span>{(() => {
                  if (Array.isArray(driver.languages)) return driver.languages.join(', ');
                  if (typeof driver.languages === 'string') {
                    try {
                      const parsed = JSON.parse(driver.languages);
                      if (Array.isArray(parsed)) return parsed.join(', ');
                      return driver.languages;
                    } catch {
                      return driver.languages;
                    }
                  }
                  return 'Bengali, English';
                })()}</span>
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
        </motion.div>
      </motion.div>
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
      let languages: string[] = []
      if (Array.isArray(driver.languages)) {
        languages = driver.languages
      } else if (typeof driver.languages === 'string') {
        try {
          const parsed = JSON.parse(driver.languages)
          languages = Array.isArray(parsed) ? parsed : [driver.languages]
        } catch {
          languages = [driver.languages]
        }
      }

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
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Browse Drivers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find professional drivers for your vehicle
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

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <Input
                    placeholder="e.g., English"
                    value={filters.language}
                    onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Drivers Grid */}
          <div className="flex-1">
            <motion.div 
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-600 dark:text-gray-400">
                <motion.span
                  key={filteredDrivers.length}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block"
                >
                  {filteredDrivers.length}
                </motion.span>{' '}
                driver{filteredDrivers.length !== 1 ? 's' : ''} found
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
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="animate-pulse flex gap-4">
                      <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : filteredDrivers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <EmptyState
                  icon={<Car className="w-16 h-16" />}
                  title="No drivers found"
                  description="Try adjusting your filters to see more results"
                  action={
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  }
                />
              </motion.div>
            ) : (
              <motion.div className="space-y-4" layout>
                <AnimatePresence mode="popLayout">
                  {filteredDrivers.map((driver, index) => (
                    <DriverCard key={driver.id} driver={driver} index={index} />
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
