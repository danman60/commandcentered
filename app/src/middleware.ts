import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

  // Protect dashboard routes
  if (url.pathname.startsWith('/dashboard')) {
    if (!session) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // TODO: Verify user belongs to subdomain's tenant
    // This will be implemented after RLS policies are set up
  }

  // Redirect authenticated users away from auth pages
  if (session && (url.pathname === '/login' || url.pathname === '/signup')) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
