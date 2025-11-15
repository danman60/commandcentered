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
export const tenantProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.tenantId) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'No tenant selected' })
  }
  return next({
    ctx: {
      ...ctx,
      tenantId: ctx.tenantId, // Now guaranteed to be non-null
    },
  })
})

// Admin procedure - requires admin role
export const adminProcedure = tenantProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== 'SUPER_ADMIN' && ctx.user.role !== 'COMPETITION_DIRECTOR') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' })
  }
  return next()
})
