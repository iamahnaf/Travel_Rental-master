'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Leaflet needs to be loaded client-side only (SSR issue with window object)
const MapPicker = dynamic(
  () => import('./MapPicker').then((mod) => mod.MapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    ),
  }
)

export { MapPicker }
