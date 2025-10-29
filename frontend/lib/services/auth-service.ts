import { apiClient, ApiResponse } from './api-client'

// Types for authentication - aligned with backend
export interface User {
  _id: string
  firstname: string
  lastname: string
  email: string
  phone: string
  role: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
    token: string
    refreshToken: string
  }
  error?: string
}

export interface SignupData {
  firstname: string
  lastname: string
  email: string
  password: string
}

export interface SigninData {
  email: string
  password: string
}

export interface VerifyEmailData {
  token: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  newPassword: string
}

// Auth Service Class - Using centralized API client
export class AuthService {
  private static instance: AuthService
  private tokenManager = apiClient.getTokenManager()

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Sign up a new user
  async signup(userData: SignupData): Promise<AuthResponse> {
    const response = await apiClient.post<{ user: User; token: string; refreshToken: string }>('/api/v1/auth/signup', userData, {
      requireAuth: false,
    })
    
    if (response.success && response.data) {
      this.tokenManager.setTokens(response.data.token, response.data.refreshToken)
      this.tokenManager.setUser(response.data.user)
    }
    
    return {
      success: response.success,
      message: response.message,
      data: response.data,
      error: response.error
    }
  }

  // Sign in an existing user
  async signin(credentials: SigninData): Promise<AuthResponse> {
    const response = await apiClient.post<{ user: User; token: string; refreshToken: string }>('/api/v1/auth/signin', credentials, {
      requireAuth: false,
    })
    
    if (response.success && response.data) {
      this.tokenManager.setTokens(response.data.token, response.data.refreshToken)
      this.tokenManager.setUser(response.data.user)
    }
    
    return {
      success: response.success,
      message: response.message,
      data: response.data,
      error: response.error
    }
  }

  // Verify email with token
  async verifyEmail(token: VerifyEmailData): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/api/v1/auth/verify-email', { token }, {
      requireAuth: false,
    })
  }

  // Request password reset
  async requestPasswordReset(email: ForgotPasswordData): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/api/v1/auth/request-password-reset', { email }, {
      requireAuth: false,
    })
  }

  // Reset password with token
  async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/api/v1/auth/reset-password', { data }, {
      requireAuth: false,
    })
  }

  // Refresh access token (handled automatically by API client)
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.tokenManager.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<{ user: User; token: string; refreshToken: string }>('/api/v1/auth/refresh-token', { refreshToken }, {
      requireAuth: false,
    })
    
    if (response.success && response.data) {
      this.tokenManager.setTokens(response.data.token, response.data.refreshToken)
    }
    
    return {
      success: response.success,
      message: response.message,
      data: response.data,
      error: response.error
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/api/v1/users/profile')
  }

  // Update user profile
  async updateProfile(data: { firstname?: string; lastname?: string; phone?: string }): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/api/v1/users/profile', data)
  }

  // Change password
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/api/v1/users/change-password', data)
  }

  // Sign out (clear tokens and invalidate on server)
  async signout(): Promise<void> {
    try {
      const refreshToken = this.tokenManager.getRefreshToken()
      
      // Call backend logout endpoint to invalidate refresh token
      if (refreshToken) {
        await apiClient.post('/api/v1/auth/logout', { refreshToken }, {
          requireAuth: false
        })
      }
    } catch (error) {
      // Even if server call fails, we still want to clear local tokens
      console.warn('Failed to logout on server, clearing local tokens anyway:', error)
    } finally {
      // Always clear local tokens regardless of server response
      this.tokenManager.clearTokens()
    }
  }

  // Token management (delegated to token manager)
  setTokens(token: string, refreshToken: string): void {
    this.tokenManager.setTokens(token, refreshToken)
  }

  getToken(): string | null {
    return this.tokenManager.getAccessToken()
  }

  getRefreshToken(): string | null {
    return this.tokenManager.getRefreshToken()
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false
    return !this.tokenManager.isTokenExpired(token)
  }

  // Get stored user data
  getUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  // Set user data
  setUser(user: User): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('user', JSON.stringify(user))
  }
}

// Export singleton instance
export const authService = AuthService.getInstance()
