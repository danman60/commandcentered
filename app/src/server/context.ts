import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// TEMPORARILY DISABLED AUTH FOR TESTING
const TESTING_MODE = true

export async function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
  const supabase = await createClient()

  // Default test user for when auth is disabled
  if (TESTING_MODE) {
    return {
      prisma,
      user: {
        id: 'test-user-id',
        tenantId: '00000000-0000-0000-0000-000000000001',
        role: 'SUPER_ADMIN' as const,
        email: 'test@commandcentered.app',
        name: 'Test User',
      },
      tenantId: '00000000-0000-0000-0000-000000000001',
      supabase,
      req,
      resHeaders,
    }
  }

  const { data: { session } } = await supabase.auth.getSession()

  let user = null
  let tenantId = null

  if (session?.user) {
    // Get UserProfile with tenantId
    const userProfile = await prisma.userProfile.findUnique({
      where: { authUserId: session.user.id },
      select: { id: true, tenantId: true, role: true, email: true, name: true }
    })

    user = userProfile
    tenantId = userProfile?.tenantId
  }

  return {
    prisma,
    user,
    tenantId,
    supabase,
    req,
    resHeaders,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
