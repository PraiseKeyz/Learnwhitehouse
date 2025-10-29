'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService, User, SignupData, SigninData, VerifyEmailData, ForgotPasswordData, ResetPasswordData } from '@/lib/services/auth-service'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  signup: (data: SignupData) => Promise<{ success: boolean; message: string; error?: string }>
  signin: (data: SigninData) => Promise<{ success: boolean; message: string; data?: { user: User; token: string; refreshToken: string }; error?: string }>
  signout: () => Promise<void>
  verifyEmail: (data: VerifyEmailData) => Promise<{ success: boolean; message: string; error?: string }>
  requestPasswordReset: (email: ForgotPasswordData) => Promise<{ success: boolean; message: string; error?: string }>
  resetPassword: (data: ResetPasswordData) => Promise<{ success: boolean; message: string; error?: string }>
  getCurrentUser: () => Promise<{ success: boolean; message: string; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken()
        const storedUser = authService.getUser()

        if (token && storedUser && authService.isAuthenticated()) {
          setUser(storedUser)
        } else {
          // Try to refresh token if we have a refresh token
          const refreshToken = authService.getRefreshToken()
          if (refreshToken) {
            try {
              const response = await authService.refreshToken()
              if (response.success && response.data) {
                setUser(response.data.user)
                authService.setTokens(response.data.token, response.data.refreshToken)
                authService.setUser(response.data.user)
              } else {
                authService.signout()
              }
            } catch {
              authService.signout()
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        authService.signout()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true)
      const response = await authService.signup(data)
      
      if (response.success) {
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Signup failed' }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed'
      return { success: false, message, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const signin = async (data: SigninData) => {
    try {
      setIsLoading(true)
      const response = await authService.signin(data)
      
      if (response.success && response.data) {
        setUser(response.data.user)
        authService.setTokens(response.data.token, response.data.refreshToken)
        authService.setUser(response.data.user)
        return { 
          success: true, 
          message: response.message,
          data: response.data
        }
      } else {
        return { 
          success: false, 
          message: response.message || 'Signin failed',
          error: response.error
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signin failed'
      return { success: false, message, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const signout = async () => {
    setUser(null)
    await authService.signout()
  }

  const verifyEmail = async (token: VerifyEmailData) => {
    try {
      const response = await authService.verifyEmail(token)
      return { success: response.success, message: response.message }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email verification failed'
      return { success: false, message, error: message }
    }
  }

  const requestPasswordReset = async (email: ForgotPasswordData) => {
    try {
      const response = await authService.requestPasswordReset(email)
      return { success: response.success, message: response.message }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset request failed'
      return { success: false, message, error: message }
    }
  }

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      const response = await authService.resetPassword(data)
      return { success: response.success, message: response.message }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed'
      return { success: false, message, error: message }
    }
  }

  const getCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser()
      if (response.success && response.data) {
        setUser(response.data)
        authService.setUser(response.data)
      }
      return { success: response.success, message: response.message }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get user profile'
      return { success: false, message, error: message }
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    signup,
    signin,
    signout,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    getCurrentUser,
  }

  return (
    <AuthContext.Provider value={value}>
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
