'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'traveler' | 'driver' | 'tour_guide' | 'car_owner' | 'hotel_owner' | 'admin'
  drivingLicense?: {
    file: string
    uploadedAt: string
    verified: boolean
  }
  nidCard?: {
    number: string
    file: string
    uploadedAt: string
    verified: boolean
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: Omit<User, 'drivingLicense' | 'nidCard'> & { password: string }) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          // Verify token by fetching profile
          const response = await fetch('http://localhost:5001/api/auth/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            const mappedUser = {
              id: userData.data.id,
              name: userData.data.name,
              email: userData.data.email,
              phone: userData.data.phone,
              role: userData.data.role || 'traveler',
              drivingLicense: userData.data.drivingLicense ? {
                file: userData.data.drivingLicense.file_path,
                uploadedAt: userData.data.drivingLicense.uploaded_at,
                verified: userData.data.drivingLicense.status === 'approved'
              } : undefined,
              nidCard: userData.data.nidCard ? {
                number: userData.data.nidCard.number,
                file: userData.data.nidCard.file_path,
                uploadedAt: userData.data.nidCard.uploaded_at,
                verified: userData.data.nidCard.status === 'approved'
              } : undefined
            };
            setUser(mappedUser);
            localStorage.setItem('user', JSON.stringify(mappedUser));
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [])

  const register = async (userData: any) => {
    const { name, email, phone, password, role, businessData } = userData;
    const response = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone, password, role, businessData }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    const registerData = await response.json();
    
    // Store token
    if (registerData.data && registerData.data.token) {
      localStorage.setItem('token', registerData.data.token);
    }
    
    // Set user data
    const user = {
      id: registerData.data.id,
      name: registerData.data.name,
      email: registerData.data.email,
      phone: registerData.data.phone,
      role: registerData.data.role,
    };
    
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Login failed')
    }

    const userData = await response.json()
    
    // Store token
    if (userData.data && userData.data.token) {
      localStorage.setItem('token', userData.data.token)
    }
    
    // Set user data
    const user = {
      id: userData.data.id,
      name: userData.data.name,
      email: userData.data.email,
      phone: userData.data.phone,
      role: userData.data.role,
    }

    setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/login')
  }

  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const mappedUser = {
          id: userData.data.id,
          name: userData.data.name,
          email: userData.data.email,
          phone: userData.data.phone,
          role: userData.data.role || 'traveler',
          drivingLicense: userData.data.drivingLicense ? {
            file: userData.data.drivingLicense.file_path,
            uploadedAt: userData.data.drivingLicense.uploaded_at,
            verified: userData.data.drivingLicense.status === 'approved'
          } : undefined,
          nidCard: userData.data.nidCard ? {
            number: userData.data.nidCard.number,
            file: userData.data.nidCard.file_path,
            uploadedAt: userData.data.nidCard.uploaded_at,
            verified: userData.data.nidCard.status === 'approved'
          } : undefined
        };
        setUser(mappedUser);
        localStorage.setItem('user', JSON.stringify(mappedUser));
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
