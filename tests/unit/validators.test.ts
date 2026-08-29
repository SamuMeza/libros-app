import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isValidRole,
  isValidPassword,
  isValidFullName,
  isValidPhoneVE,
  isValidPhoneInternational,
} from '@/lib/utils/validators'

describe('isValidEmail', () => {
  it('should return true for valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
  })

  it('should return true for email with subdomain', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true)
  })

  it('should return false for empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('should return false for string without @', () => {
    expect(isValidEmail('testexample.com')).toBe(false)
  })

  it('should return false for string without domain', () => {
    expect(isValidEmail('test@')).toBe(false)
  })

  it('should return false for string without TLD', () => {
    expect(isValidEmail('test@example')).toBe(false)
  })

  it('should return false for non-string input', () => {
    expect(isValidEmail(null as unknown as string)).toBe(false)
    expect(isValidEmail(undefined as unknown as string)).toBe(false)
  })

  it('should trim whitespace before validation', () => {
    expect(isValidEmail('  test@example.com  ')).toBe(true)
  })
})

describe('isValidRole', () => {
  it('should return true for customer', () => {
    expect(isValidRole('customer')).toBe(true)
  })

  it('should return true for admin_hl', () => {
    expect(isValidRole('admin_hl')).toBe(true)
  })

  it('should return true for admin_kc', () => {
    expect(isValidRole('admin_kc')).toBe(true)
  })

  it('should return true for superadmin', () => {
    expect(isValidRole('superadmin')).toBe(true)
  })

  it('should return false for invalid role', () => {
    expect(isValidRole('admin')).toBe(false)
    expect(isValidRole('user')).toBe(false)
    expect(isValidRole('')).toBe(false)
  })
})

describe('isValidPassword', () => {
  it('should return true for password with 8 characters', () => {
    expect(isValidPassword('12345678')).toBe(true)
  })

  it('should return true for longer password', () => {
    expect(isValidPassword('password123')).toBe(true)
  })

  it('should return false for password shorter than 8', () => {
    expect(isValidPassword('1234567')).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isValidPassword('')).toBe(false)
  })

  it('should return false for non-string input', () => {
    expect(isValidPassword(null as unknown as string)).toBe(false)
  })
})

describe('isValidFullName', () => {
  it('should return true for valid name', () => {
    expect(isValidFullName('John Doe')).toBe(true)
  })

  it('should return true for name with 2 characters', () => {
    expect(isValidFullName('AB')).toBe(true)
  })

  it('should return true for name with 100 characters', () => {
    expect(isValidFullName('A'.repeat(100))).toBe(true)
  })

  it('should return false for name shorter than 2 characters', () => {
    expect(isValidFullName('A')).toBe(false)
  })

  it('should return false for name longer than 100 characters', () => {
    expect(isValidFullName('A'.repeat(101))).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isValidFullName('')).toBe(false)
  })

  it('should trim whitespace before validation', () => {
    expect(isValidFullName('  John Doe  ')).toBe(true)
  })
})

describe('isValidPhoneVE', () => {
  it('should return true for valid Venezuelan phone', () => {
    expect(isValidPhoneVE('0414123456')).toBe(true)
  })

  it('should return true for phone without spaces', () => {
    expect(isValidPhoneVE('0414123456')).toBe(true)
  })

  it('should return false for phone shorter than 10 digits', () => {
    expect(isValidPhoneVE('041412345')).toBe(false)
  })

  it('should return false for phone longer than 10 digits', () => {
    expect(isValidPhoneVE('041412345678')).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isValidPhoneVE('')).toBe(false)
  })
})

describe('isValidPhoneInternational', () => {
  it('should return true for valid international phone', () => {
    expect(isValidPhoneInternational('+1234567890')).toBe(true)
  })

  it('should return true for phone with country code', () => {
    expect(isValidPhoneInternational('+584141234567')).toBe(true)
  })

  it('should return false for phone without +', () => {
    expect(isValidPhoneInternational('1234567890')).toBe(false)
  })

  it('should return false for phone shorter than 7 digits', () => {
    expect(isValidPhoneInternational('+123456')).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isValidPhoneInternational('')).toBe(false)
  })
})
