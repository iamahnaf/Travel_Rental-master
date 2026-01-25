'use client'

import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'
import { cardHover, imageZoom } from '@/lib/animations'

interface MotionCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  delay?: number
}

export function MotionCard({ children, className = '', hover = false, delay = 0 }: MotionCardProps) {
  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  if (hover) {
    return (
      <motion.div
        className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 cursor-pointer ${className}`}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ 
          y: -8, 
          scale: 1.02,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg ${className}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  )
}

// Image container with zoom effect on hover
export function MotionImageContainer({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <motion.div 
      className={`overflow-hidden ${className}`}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <motion.div variants={imageZoom}>
        {children}
      </motion.div>
    </motion.div>
  )
}
