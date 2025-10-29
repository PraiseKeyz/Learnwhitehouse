const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface ApiError {
  message: string
  status: number
  data?: any
}

export interface RequestConfig extends RequestInit {
  requireAuth?: boolean
  retries?: number
}

// Token management
class TokenManager {
  private static instance: TokenManager
  private refreshPromise: Promise<string> | null = null

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refresh_token')
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
  }

  setUser(user: any): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('user', JSON.stringify(user))
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Date.now() / 1000
      return payload.exp < now
    } catch {
      return true
    }
  }

  async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performTokenRefresh()
    
    try {
      const newToken = await this.refreshPromise
      return newToken
    } finally {
      this.refreshPromise = null
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = this.getRefreshToken()
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data: ApiResponse<{ accessToken: string; refreshToken: string }> = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Token refresh failed')
      }

      // Update stored tokens
      this.setTokens(data.data.accessToken, data.data.refreshToken)
      
      return data.data.accessToken
    } catch (error) {
      // Clear tokens on refresh failure
      this.clearTokens()
      throw error
    }
  }
}

// Global error handler
class ErrorHandler {
  private static instance: ErrorHandler

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  handleError(error: ApiError): void {
    console.error('API Error:', error)

    // Handle different error types
    switch (error.status) {
      case 401:
        // Unauthorized - redirect to login
        this.handleUnauthorized()
        break
      case 403:
        // Forbidden - show access denied message
        this.showError('Access denied. You do not have permission to perform this action.', 403)
        break
      case 404:
        // Not found
        this.showError('The requested resource was not found.', 404)
        break
      case 422:
        // Validation error
        this.showError(error.message || 'Validation failed. Please check your input.', 422)
        break
      case 429:
        // Rate limited
        this.showError('Too many requests. Please try again later.', 429)
        break
      case 500:
        // Server error
        this.showError('Server error. Please try again later.', 500)
        break
      default:
        this.showError(error.message || 'An unexpected error occurred.', error.status)
    }
  }

  private handleUnauthorized(): void {
    // Clear tokens and redirect to login
    const tokenManager = TokenManager.getInstance()
    tokenManager.clearTokens()
    
    // Only redirect if we're not already on an auth page
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
      window.location.href = '/auth/login'
    }
  }

  private showError(message: string, status?: number): void {
    // This will be integrated with your toast system
    if (typeof window !== 'undefined') {
      // Dispatch custom event for toast notification
      window.dispatchEvent(new CustomEvent('api-error', { detail: { message, status } }))
    }
  }
}

// Main API Client
class ApiClient {
  private static instance: ApiClient
  private tokenManager: TokenManager
  private errorHandler: ErrorHandler

  constructor() {
    this.tokenManager = TokenManager.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      requireAuth = true,
      retries = 1,
      ...requestConfig
    } = config

    const url = `${API_BASE_URL}${endpoint}`
    
    // Prepare headers
    const headers: Record<string, string> = {}

    // Only set Content-Type to application/json if not already specified
    // For FormData, skip setting Content-Type to let browser set multipart/form-data automatically
    const existingHeaders = requestConfig.headers as Record<string, string> | undefined
    const isFormData = requestConfig.body instanceof FormData

    if (!isFormData && !existingHeaders?.['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    // Add other headers
    if (existingHeaders) {
      Object.assign(headers, existingHeaders)
    }

    // Add authentication header if required
    if (requireAuth) {
      const accessToken = this.tokenManager.getAccessToken()
      
      if (!accessToken) {
        throw new Error('No access token available')
      }

      // Check if token is expired
      if (this.tokenManager.isTokenExpired(accessToken)) {
        try {
          const newToken = await this.tokenManager.refreshAccessToken()
          headers.Authorization = `Bearer ${newToken}`
        } catch (error) {
          throw new Error('Authentication failed')
        }
      } else {
        headers.Authorization = `Bearer ${accessToken}`
      }
    }

    try {
      const response = await fetch(url, {
        ...requestConfig,
        headers,
      })

      const data: ApiResponse<T> = await response.json()

      if (!response.ok) {
        // Handle 401 errors with token refresh
        if (response.status === 401 && requireAuth && retries > 0) {
          try {
            const newToken = await this.tokenManager.refreshAccessToken()
             // Retry the request with new token
             return this.request(endpoint, {
               ...config,
               retries: retries - 1,
               headers: {
                 ...headers,
                 Authorization: `Bearer ${newToken}`,
               },
             })
          } catch (refreshError) {
            // Token refresh failed, handle as unauthorized
            this.errorHandler.handleError({
              message: 'Authentication failed',
              status: 401,
            })
            throw new Error('Authentication failed')
          }
        }

        // Handle other errors
        this.errorHandler.handleError({
          message: data.error || data.message || 'Request failed',
          status: response.status,
          data,
        })

        throw new Error(data.error || data.message || 'Request failed')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  async post<T = any>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    // Handle FormData differently - don't JSON.stringify it
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined)

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body,
    })
  }

  async put<T = any>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    // Handle FormData differently - don't JSON.stringify it
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined)

    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body,
    })
  }

  async patch<T = any>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T = any>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  // Public access to token manager for auth context
  getTokenManager(): TokenManager {
    return this.tokenManager
  }
}

// Public API client for non-authenticated requests
class PublicApiClient {
  async request<T = any>(endpoint: string, config: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(config.headers as Record<string, string>),
    };

    try {
      const response = await fetch(url, {
        ...config,
        headers,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Convenience methods for public endpoints
  async get<T = any>(endpoint: string, config: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any, config: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Export both clients
export const apiClient = ApiClient.getInstance();
export const publicApiClient = new PublicApiClient();
