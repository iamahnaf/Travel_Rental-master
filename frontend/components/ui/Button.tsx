import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = `
    font-medium rounded-xl smooth-transition 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    transform active:scale-[0.98]
  `.replace(/\s+/g, ' ').trim()
  
  const variants = {
    primary: `
      bg-primary-600 text-white 
      hover:bg-primary-700 hover:shadow-glow hover:-translate-y-0.5
      focus:ring-primary-500 
      shadow-soft
    `.replace(/\s+/g, ' ').trim(),
    secondary: `
      bg-white dark:bg-gray-800 
      text-text-primary dark:text-gray-100 
      border border-border-light dark:border-gray-600
      hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500
      focus:ring-gray-400
    `.replace(/\s+/g, ' ').trim(),
    outline: `
      border-2 border-primary-600 text-primary-600 
      dark:border-primary-400 dark:text-primary-400 
      hover:bg-primary-50 dark:hover:bg-primary-900/20
      focus:ring-primary-500
    `.replace(/\s+/g, ' ').trim(),
    ghost: `
      hover:bg-gray-100 dark:hover:bg-gray-800 
      text-text-secondary dark:text-gray-300
      focus:ring-gray-400
    `.replace(/\s+/g, ' ').trim(),
    accent: `
      bg-accent-200 text-text-primary 
      hover:bg-accent-300 hover:-translate-y-0.5
      focus:ring-accent-400
      shadow-soft
    `.replace(/\s+/g, ' ').trim(),
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
