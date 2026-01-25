'use client'

import { useState, useMemo, useEffect } from 'react'
import { Vehicle } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { Car, Users, Fuel, Calendar, Filter, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { VehicleCardSkeleton } from '@/components/ui/LoadingSkeleton'
import { motion, AnimatePresence } from 'framer-motion'

function VehicleCard({ vehicle, index }: { vehicle: any; index: number }) {
  // Handle images - could be JSON string, array, or null
  let imageUrl = vehicle.image_url
  if (vehicle.images) {
    const imagesArray = typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images
    if (Array.isArray(imagesArray) && imagesArray.length > 0) {
      imageUrl = imagesArray[0]
    }
  }
  
  return (
    <Link href={`/vehicles/${vehicle.id}`}>
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
            className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {imageUrl ? (
              <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={imageUrl}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <Car className="w-16 h-16" />
              </div>
            )}
            {vehicle.available && (
              <motion.div 
                className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.2 + index * 0.05 }}
              >
                Available
              </motion.div>
            )}
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {vehicle.brand} {vehicle.model}
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <motion.div 
                className="flex items-center space-x-1"
                whileHover={{ scale: 1.05 }}
              >
                <Fuel className="w-4 h-4" />
                <span>{vehicle.fuel_type}</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-1"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="w-4 h-4" />
                <span>{vehicle.seats} seats</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-1"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="w-4 h-4" />
                <span>{vehicle.year}</span>
              </motion.div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Starting from</p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ৳{vehicle.price_per_day.toLocaleString()}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/day</span>
                </p>
              </div>
              <div className="flex gap-2">
                {vehicle.price_per_day !== vehicle.with_driver_price && (
                  <motion.span 
                    className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    Driver Available
                  </motion.span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  )
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    fuelType: '',
    transmission: '',
    driverAvailable: '',
  })

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/vehicles')
        if (response.ok) {
          const data = await response.json()
          setVehicles(data.data)
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (filters.minPrice && vehicle.price_per_day < parseInt(filters.minPrice)) return false
      if (filters.maxPrice && vehicle.price_per_day > parseInt(filters.maxPrice)) return false
      if (filters.fuelType && vehicle.fuel_type !== filters.fuelType) return false
      if (filters.transmission && vehicle.transmission !== filters.transmission) return false
      if (filters.driverAvailable === 'yes' && vehicle.price_per_day === vehicle.with_driver_price) return false
      if (filters.driverAvailable === 'no' && vehicle.price_per_day !== vehicle.with_driver_price) return false
      return true
    })
  }, [vehicles, filters])

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      fuelType: '',
      transmission: '',
      driverAvailable: '',
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
            Browse Vehicles
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find the perfect vehicle for your journey
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
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
                      Price Range
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
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fuel Type
                    </label>
                    <select
                      value={filters.fuelType}
                      onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Transmission
                    </label>
                    <select
                      value={filters.transmission}
                      onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All</option>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Driver Available
                    </label>
                    <select
                      value={filters.driverAvailable}
                      onChange={(e) => setFilters({ ...filters, driverAvailable: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Vehicles Grid */}
          <div className="flex-1">
            <motion.div 
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-600 dark:text-gray-400">
                <motion.span
                  key={filteredVehicles.length}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block"
                >
                  {filteredVehicles.length}
                </motion.span>{' '}
                vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
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
                    <VehicleCardSkeleton />
                  </motion.div>
                ))}
              </div>
            ) : filteredVehicles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <EmptyState
                  icon={<Car className="w-16 h-16" />}
                  title="No vehicles found"
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
                  {filteredVehicles.map((vehicle, index) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
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
