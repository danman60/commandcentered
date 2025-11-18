import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const dashboardRouter = router({
  getWidgets: tenantProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    return ctx.prisma.dashboardWidgetPreference.findMany({
      where: { tenantId: ctx.tenantId, userId: ctx.user.id },
      orderBy: { sortOrder: 'asc' },
    });
  }),

  updateWidgetVisibility: tenantProcedure
    .input(z.object({ widgetType: z.string(), isVisible: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error('User not authenticated');
      return ctx.prisma.dashboardWidgetPreference.upsert({
        where: { userId_widgetType: { userId: ctx.user.id, widgetType: input.widgetType } },
        create: {
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
          widgetType: input.widgetType,
          isVisible: input.isVisible,
          sortOrder: 0,
        },
        update: { isVisible: input.isVisible },
      });
    }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const [upcomingEvents, totalOperators, totalGear, totalRevenue] = await Promise.all([
      ctx.prisma.event.count({
        where: { tenantId: ctx.tenantId, loadInTime: { gte: new Date() } },
      }),
      ctx.prisma.operator.count({ where: { tenantId: ctx.tenantId } }),
      ctx.prisma.gear.count({ where: { tenantId: ctx.tenantId } }),
      ctx.prisma.client.aggregate({
        where: { tenantId: ctx.tenantId },
        _sum: { totalRevenue: true },
      }),
    ]);
    return { upcomingEvents, totalOperators, totalGear, totalRevenue: totalRevenue._sum.totalRevenue?.toNumber() || 0 };
  }),

  getRecentActivity: tenantProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).default(10) }))
    .query(async ({ ctx, input }) => {
      const events = await ctx.prisma.event.findMany({
        where: { tenantId: ctx.tenantId },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        select: { id: true, eventName: true, createdAt: true },
      });
      return events.map((e) => ({ type: 'event_created', data: e, timestamp: e.createdAt }));
    }),

  getUpcomingEvents: tenantProcedure
    .input(z.object({ limit: z.number().int().min(1).max(10).default(3) }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.event.findMany({
        where: { tenantId: ctx.tenantId, loadInTime: { gte: new Date() } },
        orderBy: { loadInTime: 'asc' },
        take: input.limit,
        include: { _count: { select: { shifts: true } } },
      });
    }),
});
