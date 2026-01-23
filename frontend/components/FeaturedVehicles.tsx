'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Vehicle } from '@/types'
import { Car, Users, Fuel, Calendar, Star } from 'lucide-react'
import { Card } from './ui/Card'
import { LoadingSkeleton } from './ui/LoadingSkeleton'

function VehicleCard({ vehicle }: { vehicle: any }) {
  return (
    <Link href={`/vehicles/${vehicle.id}`}>
      <Card hover className="overflow-hidden">
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
          {vehicle.image_url ? (
            <img
              src={vehicle.image_url}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Car className="w-16 h-16" />
            </div>
          )}
          {vehicle.available && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
              Available
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {vehicle.brand} {vehicle.model}
            </h3>
            {vehicle.rating > 0 && (
              <div className="flex items-center text-yellow-500 text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 font-bold">{Number(vehicle.rating).toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
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
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Starting from</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                ৳{Number(vehicle.price_per_day).toLocaleString()}
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/day</span>
              </p>
            </div>
          </div>
        </div>
      </Card>
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
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <LoadingSkeleton className="h-64" />
        <LoadingSkeleton className="h-64" />
        <LoadingSkeleton className="h-64" />
      </div>
    </section>
  )

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Featured Vehicles
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose from our premium collection of vehicles
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/vehicles"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 smooth-transition font-medium"
          >
            View All Vehicles →
          </Link>
        </div>
      </div>
    </section>
  )
}
