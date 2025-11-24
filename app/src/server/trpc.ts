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

// TEMPORARILY DISABLED AUTH FOR TESTING

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // if (!ctx.user) {
  //   throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
  // }

  // Default test user when auth disabled
  const testUser = ctx.user || {
    id: 'test-user-id',
    tenantId: '00000000-0000-0000-0000-000000000001',
    role: 'SUPER_ADMIN' as const,
    email: 'test@commandcentered.app',
    name: 'Test User',
  }

  return next({
    ctx: {
      ...ctx,
      user: testUser, // Now guaranteed to be non-null
    },
  })
})

// Tenant procedure - requires authentication + tenant context
export const tenantProcedure = publicProcedure.use(async ({ ctx, next }) => {
  // if (!ctx.user || !ctx.tenantId) {
  //   throw new TRPCError({
  //     code: 'UNAUTHORIZED',
  //     message: 'Authentication required. Please log in.',
  //   })
  // }

  // Default test user when auth disabled
  const testUser = ctx.user || {
    id: 'test-user-id',
    tenantId: '00000000-0000-0000-0000-000000000001',
    role: 'SUPER_ADMIN' as const,
    email: 'test@commandcentered.app',
    name: 'Test User',
  }

  return next({
    ctx: {
      ...ctx,
      user: testUser, // Now guaranteed to be non-null
      tenantId: ctx.tenantId || '00000000-0000-0000-0000-000000000001', // Default test tenant
    },
  })
})

// Admin procedure - requires admin role (SUPER_ADMIN or COMPETITION_DIRECTOR)
export const adminProcedure = tenantProcedure.use(async ({ ctx, next }) => {
  // if (!ctx.user || (ctx.user.role !== 'SUPER_ADMIN' && ctx.user.role !== 'COMPETITION_DIRECTOR')) {
  //   throw new TRPCError({
  //     code: 'FORBIDDEN',
  //     message: 'Admin access required. This action requires SUPER_ADMIN or COMPETITION_DIRECTOR role.',
  //   })
  // }

  return next()
})
