import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const settingsRouter = router({
  getTenant: tenantProcedure.query(async ({ ctx }) => {
    return ctx.prisma.tenant.findUnique({
      where: { id: ctx.tenantId },
    });
  }),

  updateTenant: tenantProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        subdomain: z.string().min(1).optional(),
        logoUrl: z.string().url().optional(),
        primaryColor: z.string().optional(),
        timezone: z.string().optional(),
        currency: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.tenant.update({
        where: { id: ctx.tenantId },
        data: input,
      });
    }),

  getNotificationSettings: tenantProcedure.query(async ({ ctx }) => {
    // TODO: Implement notification settings table
    return { emailNotifications: true, smsNotifications: false };
  }),

  updateNotificationSettings: tenantProcedure
    .input(z.object({ emailNotifications: z.boolean(), smsNotifications: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement notification settings update
      return input;
    }),
});
