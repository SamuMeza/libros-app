import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import signIn from '@/lib/actions/sign-in'
import signUp from '@/lib/actions/sign-up'
import signOut from '@/lib/actions/sign-out'
import resetPassword from '@/lib/actions/reset-password'
import { createClient } from '@/lib/supabase/server'

describe('signIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return error for missing email', async () => {
    const result = await signIn({ email: '', password: 'password', rememberMe: false })
    expect(result.success).toBe(false)
    expect(result.error).toContain('requeridos')
  })

  it('should return error for missing password', async () => {
    const result = await signIn({ email: 'test@example.com', password: '', rememberMe: false })
    expect(result.success).toBe(false)
    expect(result.error).toContain('requeridos')
  })

  it('should return error for invalid email format', async () => {
    const result = await signIn({ email: 'invalid-email', password: 'password', rememberMe: false })
    expect(result.success).toBe(false)
    expect(result.error).toContain('válido')
  })

  it('should call Supabase signInWithPassword', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: { user: { id: '1', email: 'test@example.com' }, session: {} },
      error: null,
    })
    vi.mocked(createClient).mockResolvedValue({
      auth: { signInWithPassword: mockSignIn },
    } as never)

    const result = await signIn({ email: 'test@example.com', password: 'password', rememberMe: false })
    expect(result.success).toBe(true)
    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    })
  })

  it('should return error from Supabase', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Invalid login credentials' },
    })
    vi.mocked(createClient).mockResolvedValue({
      auth: { signInWithPassword: mockSignIn },
    } as never)

    const result = await signIn({ email: 'test@example.com', password: 'wrong', rememberMe: false })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid login credentials')
  })
})

describe('signUp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return error for missing fields', async () => {
    const result = await signUp({ email: '', password: '', fullName: '' })
    expect(result.success).toBe(false)
    expect(result.error).toContain('requeridos')
  })

  it('should return error for invalid email', async () => {
    const result = await signUp({ email: 'invalid', password: 'password123', fullName: 'John' })
    expect(result.success).toBe(false)
    expect(result.error).toContain('válido')
  })

  it('should return error for short password', async () => {
    const result = await signUp({ email: 'test@example.com', password: '123', fullName: 'John' })
    expect(result.success).toBe(false)
    expect(result.error).toContain('8 caracteres')
  })

  it('should return error for invalid name', async () => {
    const result = await signUp({ email: 'test@example.com', password: 'password123', fullName: '' })
    expect(result.success).toBe(false)
    expect(result.error).toContain('requeridos')
  })

  it('should call Supabase signUp and create profile', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({
      data: { user: { id: '1', email: 'test@example.com' }, session: {} },
      error: null,
    })
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    vi.mocked(createClient).mockResolvedValue({
      auth: { signUp: mockSignUp },
      from: vi.fn().mockReturnValue({ insert: mockInsert }),
    } as never)

    const result = await signUp({ email: 'test@example.com', password: 'password123', fullName: 'John Doe' })
    expect(result.success).toBe(true)
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      options: {
        data: { full_name: 'John Doe' },
      },
    })
    expect(mockInsert).toHaveBeenCalledWith({
      id: '1',
      full_name: 'John Doe',
      role: 'customer',
    })
  })

  it('should return error if profile creation fails', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({
      data: { user: { id: '1', email: 'test@example.com' }, session: {} },
      error: null,
    })
    const mockInsert = vi.fn().mockResolvedValue({ error: { message: 'RLS policy violation' } })
    vi.mocked(createClient).mockResolvedValue({
      auth: { signUp: mockSignUp },
      from: vi.fn().mockReturnValue({ insert: mockInsert }),
    } as never)

    const result = await signUp({ email: 'test@example.com', password: 'password123', fullName: 'John Doe' })
    expect(result.success).toBe(false)
    expect(result.error).toContain('perfil')
  })
})

describe('signOut', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call Supabase signOut', async () => {
    const mockSignOut = vi.fn().mockResolvedValue({ error: null })
    vi.mocked(createClient).mockResolvedValue({
      auth: { signOut: mockSignOut },
    } as never)

    const result = await signOut()
    expect(result.success).toBe(true)
    expect(mockSignOut).toHaveBeenCalled()
  })

  it('should return error from Supabase', async () => {
    const mockSignOut = vi.fn().mockResolvedValue({
      error: { message: 'Error signing out' },
    })
    vi.mocked(createClient).mockResolvedValue({
      auth: { signOut: mockSignOut },
    } as never)

    const result = await signOut()
    expect(result.success).toBe(false)
    expect(result.error).toBe('Error signing out')
  })
})

describe('resetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return error for missing email', async () => {
    const result = await resetPassword({ email: '' })
    expect(result.success).toBe(false)
    expect(result.error).toContain('requerido')
  })

  it('should return error for invalid email', async () => {
    const result = await resetPassword({ email: 'invalid' })
    expect(result.success).toBe(false)
    expect(result.error).toContain('válido')
  })

  it('should call Supabase resetPasswordForEmail', async () => {
    const mockResetPassword = vi.fn().mockResolvedValue({ error: null })
    vi.mocked(createClient).mockResolvedValue({
      auth: { resetPasswordForEmail: mockResetPassword },
    } as never)

    const result = await resetPassword({ email: 'test@example.com' })
    expect(result.success).toBe(true)
    expect(mockResetPassword).toHaveBeenCalled()
  })
})
