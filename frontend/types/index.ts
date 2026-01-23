export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'
  transmission: 'Manual' | 'Automatic'
  seats: number
  pricePerDay: number
  withDriverPrice: number
  image: string
  images?: string[]
  available: boolean
  defaultFuelIncluded: boolean
  description?: string
}

export interface Driver {
  id: string
  name: string
  photo: string
  experience: number
  rating: number
  totalRides: number
  languages: string[]
  location?: string
  city?: string
  bio?: string
  reviews?: Review[]
  available?: boolean
  pricePerDay?: number
}

export interface Hotel {
  id: string
  name: string
  location: string
  city: string
  pricePerNight: number
  images: string[]
  availableRooms: number
  totalRooms: number
  rating: number
  amenities: string[]
  description?: string
  reviews?: Review[]
}

export interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
}

export interface TourGuide {
  id: string
  name: string
  photo: string
  location: string
  city: string
  languages: string[]
  specialties: string[]
  experience: number
  rating: number
  totalTours: number
  pricePerDay: number
  bio?: string
  reviews?: Review[]
  available: boolean
}

export interface Booking {
  id: string
  type: 'vehicle' | 'hotel' | 'tour-guide' | 'driver'
  vehicleId?: string
  hotelId?: string
  tourGuideId?: string
  driverId?: string
  startDate: string
  endDate: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  drivingLicense?: {
    file: string
    uploadedAt: string
    verified: boolean
  }
  nidCard?: {
    number: string
    file: string
    uploadedAt: string
    verified: boolean
  }
}
