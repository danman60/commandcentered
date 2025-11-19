import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // Extract subdomain
  const subdomain = hostname.split('.')[0]

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // TEMPORARILY DISABLED AUTH FOR TESTING
  // Protected routes - require authentication
  // if (
  //   !user &&
  //   !url.pathname.startsWith('/login') &&
  //   !url.pathname.startsWith('/signup') &&
  //   !url.pathname.startsWith('/api') &&
  //   !url.pathname.startsWith('/_next') &&
  //   url.pathname !== '/'
  // ) {
  //   // Redirect to login if not authenticated
  //   url.pathname = '/login'
  //   url.searchParams.set('redirectedFrom', request.nextUrl.pathname)
  //   return NextResponse.redirect(url)
  // }

  // Redirect authenticated users away from auth pages
  if (user && (url.pathname === '/login' || url.pathname === '/signup')) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // TODO: Multi-tenant subdomain verification
  // Extract subdomain and verify user belongs to tenant
  // This will be implemented after tenant/organization system is set up

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
