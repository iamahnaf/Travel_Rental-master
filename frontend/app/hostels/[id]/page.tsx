'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HostelDetailsPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/hotels')
  }, [router])
  
  return null
}
