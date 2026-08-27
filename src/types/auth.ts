export type UserRole = 'customer' | 'admin_hl' | 'admin_kc' | 'superadmin'

export interface AuthResponse {
  success: boolean
  data?: {
    user: {
      id: string
      email: string
      user_metadata: Record<string, unknown>
    }
    session: {
      access_token: string
      refresh_token: string
      expires_in: number
      expires_at: number
    }
  }
  error?: string
}

export interface SignInData {
  email: string
  password: string
  rememberMe: boolean
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
}

export interface ResetPasswordData {
  email: string
}
