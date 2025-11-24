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
export const tenantProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user || !ctx.tenantId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required. Please log in.',
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Now guaranteed to be non-null
      tenantId: ctx.tenantId, // Now guaranteed to be non-null
    },
  })
})

// Admin procedure - requires admin role (SUPER_ADMIN or COMPETITION_DIRECTOR)
export const adminProcedure = tenantProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user || (ctx.user.role !== 'SUPER_ADMIN' && ctx.user.role !== 'COMPETITION_DIRECTOR')) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required. This action requires SUPER_ADMIN or COMPETITION_DIRECTOR role.',
    })
  }

  return next()
})
