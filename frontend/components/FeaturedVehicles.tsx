'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Vehicle } from '@/types'
import { Car, Users, Fuel, Calendar, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { ShimmerSkeleton } from './ui/AnimatedComponents'

function VehicleCard({ vehicle, index }: { vehicle: any; index: number }) {
  return (
    <Link href={`/vehicles/${vehicle.id}`}>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-border-light dark:border-gray-700 cursor-pointer overflow-hidden shadow-soft"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ 
          y: -8, 
          scale: 1.02,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
        }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div 
          className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 overflow-hidden"
          whileHover="hover"
          initial="rest"
        >
          {vehicle.image_url ? (
            <motion.img
              src={vehicle.image_url}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.08 }
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Car className="w-16 h-16" />
            </div>
          )}
          {vehicle.available && (
            <motion.div 
              className="absolute top-3 right-3 bg-success-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.3 + index * 0.1 }}
            >
              Available
            </motion.div>
          )}
        </motion.div>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-text-primary dark:text-gray-100">
              {vehicle.brand} {vehicle.model}
            </h3>
            {vehicle.rating > 0 && (
              <motion.div 
                className="flex items-center text-yellow-500 text-sm"
                whileHover={{ scale: 1.1 }}
              >
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 font-bold">{Number(vehicle.rating).toFixed(1)}</span>
              </motion.div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-text-muted dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Fuel className="w-4 h-4" />
              <span>{vehicle.fuel_type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{vehicle.seats} seats</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{vehicle.year}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-gray-700">
            <div>
              <p className="text-sm text-text-muted dark:text-gray-400">Starting from</p>
              <div className="price-badge mt-1">
                ৳{Number(vehicle.price_per_day).toLocaleString()}
                <span className="text-xs font-normal opacity-70">/day</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5001/api/vehicles')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVehicles(data.data.slice(0, 3))
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <section className="py-20 bg-surface-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <ShimmerSkeleton className="h-80 rounded-2xl" />
        <ShimmerSkeleton className="h-80 rounded-2xl" />
        <ShimmerSkeleton className="h-80 rounded-2xl" />
      </div>
    </section>
  )

  return (
    <section className="py-20 bg-surface-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="divider-accent mx-auto mb-4"></div>
          <h2 className="text-4xl font-bold text-text-primary dark:text-gray-100 mb-4">
            Featured Vehicles
          </h2>
          <p className="text-xl text-text-muted dark:text-gray-400">
            Choose from our premium collection of vehicles
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
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
              href="/vehicles"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
            >
              View All Vehicles →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
