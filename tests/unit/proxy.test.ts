import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

vi.mock('@/lib/supabase/middleware', () => ({
  createClient: vi.fn(),
  getUserRole: vi.fn(),
}))

import { proxy } from '@/proxy'
import { createClient, getUserRole } from '@/lib/supabase/middleware'

describe('proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect authenticated users from auth routes', async () => {
    const mockRequest = {
      nextUrl: { pathname: '/login' },
      url: 'http://localhost:3000/login',
      headers: new Headers(),
      cookies: { get: vi.fn(), set: vi.fn() },
    } as unknown as NextRequest

    vi.mocked(createClient).mockReturnValue({
      supabase: {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null }) },
      } as unknown as ReturnType<typeof createClient>['supabase'],
      supabaseResponse: NextResponse.next({ request: mockRequest }),
    })

    const response = await proxy(mockRequest)
    expect(response.status).toBe(302)
  })

  it('should allow unauthenticated users to access auth routes', async () => {
    const mockRequest = {
      nextUrl: { pathname: '/login' },
      url: 'http://localhost:3000/login',
      headers: new Headers(),
      cookies: { get: vi.fn(), set: vi.fn() },
    } as unknown as NextRequest

    vi.mocked(createClient).mockReturnValue({
      supabase: {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
      } as unknown as ReturnType<typeof createClient>['supabase'],
      supabaseResponse: NextResponse.next({ request: mockRequest }),
    })

    const response = await proxy(mockRequest)
    expect(response.status).toBe(200)
  })

  it('should redirect unauthenticated users from protected routes', async () => {
    const mockRequest = {
      nextUrl: { pathname: '/perfil' },
      url: 'http://localhost:3000/perfil',
      headers: new Headers(),
      cookies: { get: vi.fn(), set: vi.fn() },
    } as unknown as NextRequest

    vi.mocked(createClient).mockReturnValue({
      supabase: {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
      } as unknown as ReturnType<typeof createClient>['supabase'],
      supabaseResponse: NextResponse.next({ request: mockRequest }),
    })

    const response = await proxy(mockRequest)
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toContain('/login')
  })

  it('should allow authenticated users to access protected routes', async () => {
    const mockRequest = {
      nextUrl: { pathname: '/perfil' },
      url: 'http://localhost:3000/perfil',
      headers: new Headers(),
      cookies: { get: vi.fn(), set: vi.fn() },
    } as unknown as NextRequest

    vi.mocked(createClient).mockReturnValue({
      supabase: {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null }) },
      } as unknown as ReturnType<typeof createClient>['supabase'],
      supabaseResponse: NextResponse.next({ request: mockRequest }),
    })

    const response = await proxy(mockRequest)
    expect(response.status).toBe(200)
  })

  it('should redirect non-admin users from admin routes', async () => {
    const mockRequest = {
      nextUrl: { pathname: '/admin' },
      url: 'http://localhost:3000/admin',
      headers: new Headers(),
      cookies: { get: vi.fn(), set: vi.fn() },
    } as unknown as NextRequest

    vi.mocked(createClient).mockReturnValue({
      supabase: {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null }) },
      } as unknown as ReturnType<typeof createClient>['supabase'],
      supabaseResponse: NextResponse.next({ request: mockRequest }),
    })

    vi.mocked(getUserRole).mockResolvedValue('customer')

    const response = await proxy(mockRequest)
    expect(response.status).toBe(302)
  })

  it('should allow admin users to access admin routes', async () => {
    const mockRequest = {
      nextUrl: { pathname: '/admin/libros' },
      url: 'http://localhost:3000/admin/libros',
      headers: new Headers(),
      cookies: { get: vi.fn(), set: vi.fn() },
    } as unknown as NextRequest

    vi.mocked(createClient).mockReturnValue({
      supabase: {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null }) },
      } as unknown as ReturnType<typeof createClient>['supabase'],
      supabaseResponse: NextResponse.next({ request: mockRequest }),
    })

    vi.mocked(getUserRole).mockResolvedValue('admin_hl')

    const response = await proxy(mockRequest)
    expect(response.status).toBe(200)
  })

  it('should redirect admin_hl from admin/productos', async () => {
    const mockRequest = {
      nextUrl: { pathname: '/admin/productos' },
      url: 'http://localhost:3000/admin/productos',
      headers: new Headers(),
      cookies: { get: vi.fn(), set: vi.fn() },
    } as unknown as NextRequest

    vi.mocked(createClient).mockReturnValue({
      supabase: {
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null }) },
      } as unknown as ReturnType<typeof createClient>['supabase'],
      supabaseResponse: NextResponse.next({ request: mockRequest }),
    })

    vi.mocked(getUserRole).mockResolvedValue('admin_hl')

    const response = await proxy(mockRequest)
    expect(response.status).toBe(302)
  })
})
