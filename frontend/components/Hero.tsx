'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, Car, Building2, User, MapPin, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export function Hero() {
  const router = useRouter()
  const [searchType, setSearchType] = useState<'car' | 'car-driver' | 'hotel' | 'tour-guide' | 'driver'>('car')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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

  // Animation variants
  const heroTextContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      }
    }
  }

  const heroTextItem = {
    hidden: { 
      opacity: 0, 
      y: 40,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  const searchWidgetVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.2,
      }
    }
  }

  const statItem = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <div className="relative h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background Image with parallax effect */}
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&auto=format"
          alt="Beautiful beach destination"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Text with staggered reveal */}
        <motion.div 
          className="text-center mb-12 max-w-4xl mx-auto"
          variants={heroTextContainer}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
            variants={heroTextItem}
          >
            Discover Your Perfect
            <br />
            <motion.span 
              className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-300 text-transparent bg-clip-text inline-block"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Travel Experience
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/95 mb-8 drop-shadow-lg"
            variants={heroTextItem}
          >
            Book vehicles, hotels, drivers, and tour guides all in one place. Start your unforgettable journey today.
          </motion.p>
        </motion.div>

        {/* Glassmorphism Search Widget */}
        <motion.div 
          className="max-w-5xl mx-auto w-full"
          variants={searchWidgetVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <motion.div 
            className="relative backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 p-6 md:p-8"
            whileHover={{ boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.4)" }}
            transition={{ duration: 0.3 }}
          >
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              {/* Search Type Tabs with animation */}
              <div className="flex flex-wrap justify-center gap-3 mb-6 pb-4 border-b border-white/20">
                {[
                  { id: 'car', icon: Car, label: 'Vehicles' },
                  { id: 'hotel', icon: Building2, label: 'Hotels' },
                  { id: 'driver', icon: Car, label: 'Drivers' },
                  { id: 'tour-guide', icon: User, label: 'Guides' },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setSearchType(tab.id as typeof searchType)}
                    className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium backdrop-blur-md ${
                      searchType === tab.id
                        ? 'bg-white/30 dark:bg-white/20 text-white shadow-lg ring-2 ring-white/40'
                        : 'bg-white/10 dark:bg-white/5 text-white/90'
                    }`}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Search Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="text"
                    placeholder="Enter city or location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-300 [color-scheme:dark]"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-300 [color-scheme:dark]"
                  />
                </div>
                <motion.button
                  onClick={handleSearch}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold shadow-lg flex items-center justify-center space-x-2"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 20px 40px -10px rgba(15, 118, 110, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Statistics with stagger animation */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mt-8"
            variants={statsVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            {[
              { value: '500+', label: 'Vehicles' },
              { value: '200+', label: 'Hotels' },
              { value: '100+', label: 'Guides' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-2xl px-8 py-4 shadow-lg"
                variants={statItem}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  y: -5
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="text-3xl md:text-4xl font-bold mb-1 text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm md:text-base text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-orange-400/20 to-pink-400/20 blur-xl pointer-events-none"
        animate={{ 
          y: [-10, 10, -10],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-400/20 blur-xl pointer-events-none"
        animate={{ 
          y: [10, -10, 10],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}
