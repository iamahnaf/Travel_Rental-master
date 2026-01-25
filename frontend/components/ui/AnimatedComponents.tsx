'use client'

import { ReactNode, useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { staggerContainer, fadeInUp, staggerItem } from '@/lib/animations'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

// Wrapper for sections with scroll-triggered animations
export function AnimatedSection({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6, 
            delay,
            ease: [0.4, 0, 0.2, 1]
          }
        }
      }}
    >
      {children}
    </motion.section>
  )
}

// Container that staggers children animations
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({ children, className = '', staggerDelay = 0.1 }: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

// Individual stagger item
export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={staggerItem}
    >
      {children}
    </motion.div>
  )
}

// Animated counter for stats
interface AnimatedCounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({ 
  end, 
  suffix = '', 
  prefix = '',
  duration = 2,
  className = '' 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      
      // Easing: ease-out-quart
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, isInView])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      {prefix}{count}{suffix}
    </motion.span>
  )
}

// Success animation with checkmark
export function SuccessAnimation({ size = 64 }: { size?: number }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.path
          d="M8 12l2.5 2.5L16 9"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
        />
      </motion.svg>
    </motion.div>
  )
}

// Loading spinner with animation
export function LoadingSpinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity={0.25}
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  )
}

// Skeleton with shimmer effect
export function ShimmerSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

// Price change animation
interface AnimatedPriceProps {
  price: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedPrice({ price, prefix = '৳', suffix = '', className = '' }: AnimatedPriceProps) {
  const [displayPrice, setDisplayPrice] = useState(price)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (price !== displayPrice) {
      setIsAnimating(true)
      setDisplayPrice(price)
      setTimeout(() => setIsAnimating(false), 500)
    }
  }, [price, displayPrice])

  return (
    <motion.span
      className={className}
      animate={isAnimating ? { 
        scale: [1, 1.1, 1],
        color: ['inherit', '#10b981', 'inherit']
      } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}{displayPrice.toLocaleString()}{suffix}
    </motion.span>
  )
}
