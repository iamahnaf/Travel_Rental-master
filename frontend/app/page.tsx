'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Hero } from '@/components/Hero'
import { StatsSection } from '@/components/StatsSection'
import { FeaturedVehicles } from '@/components/FeaturedVehicles'
import { FeaturedHostels } from '@/components/FeaturedHostels'
import { FeaturedDrivers } from '@/components/FeaturedDrivers'
import { FeaturedTourGuides } from '@/components/FeaturedTourGuides'
import { Testimonials } from '@/components/Testimonials'

export default function Home() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    // Redirect business users to dashboard
    if (isAuthenticated && user) {
      const businessRoles = ['car_owner', 'hotel_owner', 'driver', 'tour_guide']
      if (businessRoles.includes(user.role)) {
        router.replace('/dashboard')
      }
    }
  }, [isAuthenticated, user, router])

  // Show loading or nothing while redirecting business users
  if (isAuthenticated && user) {
    const businessRoles = ['car_owner', 'hotel_owner', 'driver', 'tour_guide']
    if (businessRoles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )
    }
  }

  return (
    <div>
      <Hero />
      <StatsSection />
      <FeaturedVehicles />
      <FeaturedHostels />
      <FeaturedDrivers />
      <FeaturedTourGuides />
      <Testimonials />
    </div>
  )
}
