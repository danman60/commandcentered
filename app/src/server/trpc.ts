import { initTRPC, TRPCError } from '@trpc/server'
import { Context } from './context'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

export const router = t.router
export const publicProcedure = t.procedure

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Now guaranteed to be non-null
    },
  })
})

// Tenant procedure - requires authentication + tenant context
// TEMPORARILY DISABLED AUTH FOR TESTING
export const tenantProcedure = publicProcedure.use(async ({ ctx, next }) => {
  // Just use a default tenant ID for testing
  return next({
    ctx: {
      ...ctx,
      tenantId: '00000000-0000-0000-0000-000000000001', // Default tenant
      userId: '00000000-0000-0000-0000-000000000001', // Default user
    },
  })
})

// Admin procedure - requires admin role
// TEMPORARILY DISABLED AUTH FOR TESTING
export const adminProcedure = tenantProcedure.use(async ({ ctx, next }) => {
  // Skip admin check during testing
  // if (!ctx.user || (ctx.user.role !== 'SUPER_ADMIN' && ctx.user.role !== 'COMPETITION_DIRECTOR')) {
  //   throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' })
  // }
  return next()
})
