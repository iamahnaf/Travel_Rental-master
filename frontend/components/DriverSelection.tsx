'use client'

import { Driver } from '@/types'
import { X, Star, Check } from 'lucide-react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface DriverSelectionProps {
  drivers: any[]
  selectedDriver: any | null
  onSelectDriver: (driver: any | null) => void
  onClose: () => void
  onConfirm: () => void
}

export function DriverSelection({
  drivers,
  selectedDriver,
  onSelectDriver,
  onClose,
  onConfirm,
}: DriverSelectionProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Select a Driver
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg smooth-transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <button
              onClick={() => onSelectDriver(null)}
              className={`w-full p-4 rounded-lg border-2 smooth-transition text-left ${
                selectedDriver === null
                  ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Skip Driver Selection
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    We'll assign a driver automatically
                  </p>
                </div>
                {selectedDriver === null && (
                  <Check className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                )}
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {drivers.map((driver) => (
              <button
                key={driver.id}
                onClick={() => onSelectDriver(driver)}
                className={`p-4 rounded-lg border-2 smooth-transition text-left ${
                  selectedDriver?.id === driver.id
                    ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                      {driver.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {driver.name}
                      </h3>
                      {selectedDriver?.id === driver.id && (
                        <Check className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(driver.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        {driver.rating} ({driver.total_rides || 0} rides)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {driver.experience_years || 0} years experience
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(Array.isArray(driver.languages) ? driver.languages : (typeof driver.languages === 'string' ? JSON.parse(driver.languages) : ['Bengali', 'English'])).map((lang: string) => (
                        <span
                          key={lang}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-600 dark:text-gray-400"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex space-x-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="flex-1">
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
