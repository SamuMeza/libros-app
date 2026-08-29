import type { UserRole } from './auth'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string | null
  street: string
  city: string
  state: string
  zip_code: string | null
  phone: string | null
  is_default: boolean
  created_at: string
}

export type PhoneFormat = 've' | 'international'

export interface ProfileUpdateData {
  full_name?: string
  phone?: string | null
}

export interface AddressCreateData {
  label?: string
  street: string
  city: string
  state: string
  zip_code?: string
  phone?: string
  is_default?: boolean
}

export interface AddressUpdateData {
  label?: string
  street?: string
  city?: string
  state?: string
  zip_code?: string
  phone?: string
  is_default?: boolean
}
