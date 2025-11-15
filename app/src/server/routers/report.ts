import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const reportRouter = router({
  revenueReport: tenantProcedure
    .input(z.object({ startDate: z.date(), endDate: z.date() }))
    .query(async ({ ctx, input }) => {
      const events = await ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          loadInTime: { gte: input.startDate, lte: input.endDate },
          status: 'CONFIRMED',
        },
        select: { totalRevenue: true, loadInTime: true, eventType: true },
      });

      const total = events.reduce((sum, e) => sum + (e.totalRevenue?.toNumber() || 0), 0);
      return { total, events, count: events.length };
    }),

  eventSummary: tenantProcedure
    .input(z.object({ startDate: z.date(), endDate: z.date() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.event.findMany({
        where: { tenantId: ctx.tenantId, loadInTime: { gte: input.startDate, lte: input.endDate } },
        include: { client: true, _count: { select: { shifts: true } } },
        orderBy: { loadInTime: 'asc' },
      });
    }),

  operatorPerformance: tenantProcedure.query(async ({ ctx }) => {
    const operators = await ctx.prisma.operator.findMany({
      where: { tenantId: ctx.tenantId },
      include: { _count: { select: { shiftAssignments: true } } },
      orderBy: { shiftAssignments: { _count: 'desc' } },
    });
    return operators;
  }),

  gearUtilization: tenantProcedure.query(async ({ ctx }) => {
    const gear = await ctx.prisma.gear.findMany({
      where: { tenantId: ctx.tenantId },
      include: { _count: { select: { gearAssignments: true } } },
      orderBy: { gearAssignments: { _count: 'desc' } },
    });
    return gear;
  }),
});
