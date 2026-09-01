import { type NextRequest } from 'next/server'
import { createClient, getUserRole } from '@/lib/supabase/middleware'

const protectedRoutes = ['/perfil', '/checkout']
const adminRoutes = ['/admin']
const authRoutes = ['/login', '/register', '/forgot-password']

export async function proxy(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Redirect authenticated users away from auth routes
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (user) {
      return Response.redirect(new URL('/', request.url))
    }
    return supabaseResponse
  }

  // Check protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (error || !user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return Response.redirect(redirectUrl)
    }
  }

  // Check admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (error || !user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return Response.redirect(redirectUrl)
    }

    const role = await getUserRole(supabase)

    if (!role) {
      return Response.redirect(new URL('/', request.url))
    }

    // Admin route isolation
    if (pathname.startsWith('/admin/libros') && role !== 'admin_hl' && role !== 'superadmin') {
      return Response.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/admin/productos') && role !== 'admin_kc' && role !== 'superadmin') {
      return Response.redirect(new URL('/', request.url))
    }

    if (pathname === '/admin' && !['admin_hl', 'admin_kc', 'superadmin'].includes(role)) {
      return Response.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
