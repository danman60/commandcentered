import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

  // // Protected routes - require authentication
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

  // // Redirect authenticated users away from auth pages
  // if (user && (url.pathname === '/login' || url.pathname === '/signup')) {
  //   url.pathname = '/dashboard'
  //   return NextResponse.redirect(url)
  // }

  // Multi-tenant subdomain verification
  if (user && subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
    try {
      // Look up tenant by subdomain
      const tenant = await prisma.tenant.findUnique({
        where: { subdomain },
        select: { id: true, subdomain: true },
      });

      if (!tenant) {
        // Subdomain doesn't exist - show 404 or redirect
        return new NextResponse('Tenant not found', { status: 404 });
      }

      // Look up user's profile
      const userProfile = await prisma.userProfile.findUnique({
        where: { authUserId: user.id },
        select: { tenantId: true },
      });

      if (!userProfile) {
        // User profile doesn't exist - needs to complete signup
        if (url.pathname !== '/signup') {
          url.pathname = '/signup';
          return NextResponse.redirect(url);
        }
      } else if (userProfile.tenantId !== tenant.id) {
        // User belongs to different tenant - redirect to their tenant
        const userTenant = await prisma.tenant.findUnique({
          where: { id: userProfile.tenantId },
          select: { subdomain: true },
        });

        if (userTenant) {
          const correctUrl = url.clone();
          correctUrl.host = `${userTenant.subdomain}.${hostname.split('.').slice(1).join('.')}`;
          return NextResponse.redirect(correctUrl);
        }
      }
    } catch (error) {
      console.error('Subdomain verification error:', error);
      // Continue on error to avoid breaking the app
    }
  }

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
