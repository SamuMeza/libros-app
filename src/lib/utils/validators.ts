import type { UserRole } from '@/types/auth'

const VALID_ROLES: UserRole[] = ['customer', 'admin_hl', 'admin_kc', 'superadmin']

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export function isValidRole(role: string): role is UserRole {
  return VALID_ROLES.includes(role as UserRole)
}

export function isValidPassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false
  return password.length >= 8
}

export function isValidFullName(fullName: string): boolean {
  if (!fullName || typeof fullName !== 'string') return false
  const trimmed = fullName.trim()
  return trimmed.length >= 2 && trimmed.length <= 100
}

export function isValidPhoneVE(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false
  const phoneRegex = /^\d{10}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function isValidPhoneInternational(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false
  const phoneRegex = /^\+\d{1,3}\d{6,14}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}
