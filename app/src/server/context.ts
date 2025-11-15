import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
  const supabase = await createClient()
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
