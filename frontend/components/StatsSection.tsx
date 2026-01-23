'use client'

import { Car, Building2, User, CarFront } from 'lucide-react'

export function StatsSection() {
  const stats = [
    {
      icon: Car,
      value: '500+',
      label: 'Vehicles',
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-500',
    },
    {
      icon: Building2,
      value: '200+',
      label: 'Hotels',
      iconBg: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-500',
    },
    {
      icon: User,
      value: '100+',
      label: 'Tour Guides',
      iconBg: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-500',
    },
    {
      icon: CarFront,
      value: '150+',
      label: 'Drivers',
      iconBg: 'bg-orange-100 dark:bg-orange-900/20',
      iconColor: 'text-orange-500',
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl smooth-transition"
              >
                <div className={`inline-flex p-4 rounded-full mb-4 ${stat.iconBg}`}>
                  <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
