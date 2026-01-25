import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  variant?: 'default' | 'elevated' | 'accent'
}

export function Card({ children, className = '', hover = false, variant = 'default' }: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-soft-lg border-0',
    accent: 'bg-accent-50 dark:bg-accent-900/10 border border-accent-200 dark:border-accent-800/30',
  }
  
  return (
    <div
      className={`
        rounded-2xl p-6 
        ${variants[variant]}
        ${hover ? 'card-shadow cursor-pointer hover:-translate-y-1 transition-all duration-300' : 'transition-colors duration-200'}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {children}
    </div>
  )
}
