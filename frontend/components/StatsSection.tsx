'use client'

import { useRef } from 'react'
import { Car, Building2, User, CarFront } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { AnimatedCounter } from './ui/AnimatedComponents'

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    {
      icon: Car,
      value: 500,
      suffix: '+',
      label: 'Vehicles',
      iconBg: 'bg-primary-100 dark:bg-primary-900/20',
      iconColor: 'text-primary-600 dark:text-primary-400',
    },
    {
      icon: Building2,
      value: 200,
      suffix: '+',
      label: 'Hotels',
      iconBg: 'bg-accent-100 dark:bg-accent-900/20',
      iconColor: 'text-accent-600 dark:text-accent-400',
    },
    {
      icon: User,
      value: 100,
      suffix: '+',
      label: 'Tour Guides',
      iconBg: 'bg-primary-100 dark:bg-primary-900/20',
      iconColor: 'text-primary-500 dark:text-primary-400',
    },
    {
      icon: CarFront,
      value: 150,
      suffix: '+',
      label: 'Drivers',
      iconBg: 'bg-accent-100 dark:bg-accent-900/20',
      iconColor: 'text-accent-700 dark:text-accent-500',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
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
    <section className="py-16 bg-gradient-to-br from-surface-50 to-primary-50/30 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-border-light dark:border-gray-700"
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className={`inline-flex p-4 rounded-full mb-4 ${stat.iconBg}`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                </motion.div>
                <div className="text-4xl font-bold text-text-primary dark:text-gray-100 mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2} />
                </div>
                <div className="text-text-muted dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
