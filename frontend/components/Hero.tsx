'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, Car, Building2, User, MapPin, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Hero() {
  const router = useRouter()
  const [searchType, setSearchType] = useState<'car' | 'car-driver' | 'hotel' | 'tour-guide' | 'driver'>('car')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSearch = () => {
    if (searchType === 'hotel') {
      router.push(`/hotels?location=${location}&startDate=${startDate}&endDate=${endDate}`)
    } else if (searchType === 'tour-guide') {
      router.push(`/tour-guides?location=${location}&startDate=${startDate}&endDate=${endDate}`)
    } else if (searchType === 'driver') {
      router.push(`/drivers?location=${location}&startDate=${startDate}&endDate=${endDate}`)
    } else {
      router.push(`/vehicles?type=${searchType}&startDate=${startDate}&endDate=${endDate}`)
    }
  }

  return (
    <div className="relative h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&auto=format"
          alt="Beautiful beach destination"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Better overlay - darker and more neutral */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl animate-fade-in">
            Discover Your Perfect
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
              Travel Experience
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 drop-shadow-lg">
            Book vehicles, hotels, drivers, and tour guides all in one place. Start your unforgettable journey today.
          </p>
        </div>

        {/* Glassmorphism Search Widget */}
        <div className="max-w-5xl mx-auto w-full">
          <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 p-6 md:p-8">
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Search Type Tabs - Glassmorphism */}
              <div className="flex flex-wrap justify-center gap-3 mb-6 pb-4 border-b border-white/20">
                <button
                  onClick={() => setSearchType('car')}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl smooth-transition font-medium backdrop-blur-md ${
                    searchType === 'car'
                      ? 'bg-white/30 dark:bg-white/20 text-white shadow-lg ring-2 ring-white/40'
                      : 'bg-white/10 dark:bg-white/5 text-white/90 hover:bg-white/20'
                  }`}
                >
                  <Car className="w-5 h-5" />
                  <span>Vehicles</span>
                </button>
                <button
                  onClick={() => setSearchType('hotel')}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl smooth-transition font-medium backdrop-blur-md ${
                    searchType === 'hotel'
                      ? 'bg-white/30 dark:bg-white/20 text-white shadow-lg ring-2 ring-white/40'
                      : 'bg-white/10 dark:bg-white/5 text-white/90 hover:bg-white/20'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span>Hotels</span>
                </button>
                <button
                  onClick={() => setSearchType('driver')}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl smooth-transition font-medium backdrop-blur-md ${
                    searchType === 'driver'
                      ? 'bg-white/30 dark:bg-white/20 text-white shadow-lg ring-2 ring-white/40'
                      : 'bg-white/10 dark:bg-white/5 text-white/90 hover:bg-white/20'
                  }`}
                >
                  <Car className="w-5 h-5" />
                  <span>Drivers</span>
                </button>
                <button
                  onClick={() => setSearchType('tour-guide')}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl smooth-transition font-medium backdrop-blur-md ${
                    searchType === 'tour-guide'
                      ? 'bg-white/30 dark:bg-white/20 text-white shadow-lg ring-2 ring-white/40'
                      : 'bg-white/10 dark:bg-white/5 text-white/90 hover:bg-white/20'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Guides</span>
                </button>
              </div>

              {/* Search Form - Glassmorphism inputs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="text"
                    placeholder="Enter city or location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:ring-2 focus:ring-white/40 focus:border-transparent smooth-transition"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:ring-2 focus:ring-white/40 focus:border-transparent smooth-transition [color-scheme:dark]"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:ring-2 focus:ring-white/40 focus:border-transparent smooth-transition [color-scheme:dark]"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl smooth-transition flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistics - Glassmorphism cards */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-2xl px-8 py-4 shadow-lg hover:bg-white/20 smooth-transition">
              <div className="text-3xl md:text-4xl font-bold mb-1 text-white">500+</div>
              <div className="text-sm md:text-base text-white/80">Vehicles</div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-2xl px-8 py-4 shadow-lg hover:bg-white/20 smooth-transition">
              <div className="text-3xl md:text-4xl font-bold mb-1 text-white">200+</div>
              <div className="text-sm md:text-base text-white/80">Hotels</div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-2xl px-8 py-4 shadow-lg hover:bg-white/20 smooth-transition">
              <div className="text-3xl md:text-4xl font-bold mb-1 text-white">100+</div>
              <div className="text-sm md:text-base text-white/80">Guides</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
