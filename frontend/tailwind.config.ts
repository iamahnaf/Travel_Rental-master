import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern Travel Luxury - Teal + Sand
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0F766E', // Main primary
          700: '#0d6560',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        accent: {
          50: '#fefcf3',
          100: '#fdf8e3',
          200: '#F5E6C8', // Main accent (sand)
          300: '#edd9a8',
          400: '#e3c87e',
          500: '#d4b05c',
          600: '#c19643',
          700: '#a47938',
          800: '#866133',
          900: '#6e502d',
        },
        surface: {
          50: '#FAFAFA', // Main background
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
        },
        text: {
          primary: '#1F2933', // Main text
          secondary: '#52606D',
          muted: '#9CA3AF', // Muted text
          inverse: '#FFFFFF',
        },
        border: {
          light: '#E5E7EB',
          DEFAULT: '#D1D5DB',
          dark: '#9CA3AF',
        },
        // Status colors
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 2px 10px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(15, 118, 110, 0.15)',
        'glow-accent': '0 0 20px rgba(245, 230, 200, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-luxury': 'linear-gradient(135deg, #0F766E 0%, #134e4a 100%)',
        'gradient-sand': 'linear-gradient(135deg, #F5E6C8 0%, #edd9a8 100%)',
      },
    },
  },
  plugins: [],
}
export default config
