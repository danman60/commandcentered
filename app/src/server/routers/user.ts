import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const userRouter = router({
  list: tenantProcedure.query(async ({ ctx }) => {
    return ctx.prisma.userProfile.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }),

  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.userProfile.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: { tenant: true },
      });
    }),

  getCurrent: tenantProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return null;
    return ctx.prisma.userProfile.findFirst({
      where: { authUserId: ctx.userId, tenantId: ctx.tenantId },
      include: { tenant: true },
    });
  }),

  invite: tenantProcedure
    .input(z.object({ email: z.string().email(), role: z.enum(['ADMIN', 'MEMBER']) }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Integrate with Supabase Auth admin API to send magic link
      return { success: true, email: input.email };
    }),

  updateRole: tenantProcedure
    .input(z.object({ userId: z.string().uuid(), role: z.enum(['ADMIN', 'MEMBER']) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.userProfile.findFirst({
        where: { id: input.userId, tenantId: ctx.tenantId },
      });
      if (!user) throw new Error('User not found');
      return ctx.prisma.userProfile.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
    }),

  delete: tenantProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.userProfile.findFirst({
        where: { id: input.userId, tenantId: ctx.tenantId },
      });
      if (!user) throw new Error('User not found');
      return ctx.prisma.userProfile.delete({ where: { id: input.userId } });
    }),
});
