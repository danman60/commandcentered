import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';
import { EventStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const dashboardRouter = router({
  // Get user's widget preferences
  getWidgets: tenantProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    return ctx.prisma.dashboardWidgetPreference.findMany({
      where: { tenantId: ctx.tenantId, userId: ctx.user.id },
      orderBy: { sortOrder: 'asc' },
    });
  }),

  // Update widget visibility
  updateWidgetVisibility: tenantProcedure
    .input(z.object({ widgetType: z.string(), isVisible: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
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

  // Update widget settings (visibility, position, size, sort order)
  updateSettings: tenantProcedure
    .input(
      z.object({
        widgetType: z.string(),
        isVisible: z.boolean().optional(),
        position: z.object({ x: z.number(), y: z.number() }).optional(),
        size: z.object({ w: z.number(), h: z.number() }).optional(),
        sortOrder: z.number().int().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });

      const { widgetType, ...data } = input;

      return ctx.prisma.dashboardWidgetPreference.upsert({
        where: { userId_widgetType: { userId: ctx.user.id, widgetType } },
        create: {
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
          widgetType,
          isVisible: data.isVisible ?? true,
          position: data.position,
          size: data.size,
          sortOrder: data.sortOrder ?? 0,
        },
        update: data,
      });
    }),

  // Get dashboard stats (total counts + revenue)
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
    return {
      upcomingEvents,
      totalOperators,
      totalGear,
      totalRevenue: totalRevenue._sum.totalRevenue?.toNumber() || 0,
    };
  }),

  // Get event pipeline (event counts by status)
  getEventPipeline: tenantProcedure.query(async ({ ctx }) => {
    const eventsByStatus = await ctx.prisma.event.groupBy({
      by: ['status'],
      where: { tenantId: ctx.tenantId },
      _count: { id: true },
    });

    // Transform into map for easy access
    const pipeline: Record<EventStatus, number> = {
      CONFIRMED: 0,
      SCHEDULED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      ARCHIVED: 0,
      CANCELLED: 0,
      PENDING_QUESTIONNAIRE: 0,
      PLANNING: 0,
      BOOKED: 0,
      TENTATIVE: 0,
      PROPOSAL: 0,
    };

    eventsByStatus.forEach((item) => {
      pipeline[item.status] = item._count.id;
    });

    return pipeline;
  }),

  // Get revenue stats (sum of revenueAmount and actualRevenue)
  getRevenueStats: tenantProcedure.query(async ({ ctx }) => {
    const [expectedRevenue, actualRevenue, cancelledRevenue] = await Promise.all([
      ctx.prisma.event.aggregate({
        where: {
          tenantId: ctx.tenantId,
          status: { notIn: [EventStatus.CANCELLED, EventStatus.ARCHIVED] },
        },
        _sum: { revenueAmount: true },
      }),
      ctx.prisma.event.aggregate({
        where: {
          tenantId: ctx.tenantId,
          status: EventStatus.COMPLETED,
        },
        _sum: { actualRevenue: true },
      }),
      ctx.prisma.event.aggregate({
        where: {
          tenantId: ctx.tenantId,
          status: EventStatus.CANCELLED,
        },
        _sum: { cancellationPenalty: true },
      }),
    ]);

    return {
      expectedRevenue: expectedRevenue._sum.revenueAmount?.toNumber() || 0,
      actualRevenue: actualRevenue._sum.actualRevenue?.toNumber() || 0,
      cancelledPenalty: cancelledRevenue._sum.cancellationPenalty?.toNumber() || 0,
    };
  }),

  // Get recent activity
  getRecentActivity: tenantProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).default(10) }))
    .query(async ({ ctx, input }) => {
      const events = await ctx.prisma.event.findMany({
        where: { tenantId: ctx.tenantId },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        select: { id: true, eventName: true, createdAt: true, status: true },
      });
      return events.map((e) => ({
        type: 'event_created',
        data: e,
        timestamp: e.createdAt,
      }));
    }),

  // Get upcoming events (next 7 days for dashboard widget)
  getUpcomingEvents: tenantProcedure
    .input(z.object({ limit: z.number().int().min(1).max(10).default(5) }))
    .query(async ({ ctx, input }) => {
      const now = new Date();
      const sevenDaysFromNow = new Date(now);
      sevenDaysFromNow.setDate(now.getDate() + 7);

      return ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          loadInTime: { gte: now, lte: sevenDaysFromNow },
          status: { notIn: [EventStatus.CANCELLED, EventStatus.ARCHIVED] },
        },
        orderBy: { loadInTime: 'asc' },
        take: input.limit,
        include: {
          _count: {
            select: {
              shifts: true,
              gearAssignments: true,
            },
          },
        },
      });
    }),

  // Get critical alerts (events missing operators or kits)
  getCriticalAlerts: tenantProcedure.query(async ({ ctx }) => {
    const now = new Date();

    // Find upcoming events (next 30 days) with missing requirements
    const upcomingEvents = await ctx.prisma.event.findMany({
      where: {
        tenantId: ctx.tenantId,
        loadInTime: { gte: now },
        status: { in: [EventStatus.CONFIRMED, EventStatus.SCHEDULED, EventStatus.BOOKED] },
      },
      include: {
        _count: {
          select: {
            shifts: true,
            gearAssignments: true,
          },
        },
        shifts: {
          select: {
            id: true,
            shiftAssignments: {
              select: {
                operatorId: true,
              },
            },
          },
        },
      },
      orderBy: { loadInTime: 'asc' },
      take: 50,
    });

    const alerts = upcomingEvents
      .map((event) => {
        const issues: string[] = [];

        // Check for shifts without operators
        const shiftsWithoutOperators = event.shifts.filter(
          (shift) => shift.shiftAssignments.length === 0
        ).length;
        if (shiftsWithoutOperators > 0) {
          issues.push(`${shiftsWithoutOperators} shift(s) missing operators`);
        }

        // Check for events without any gear
        if (event._count.gearAssignments === 0) {
          issues.push('No gear assigned');
        }

        if (issues.length > 0) {
          return {
            eventId: event.id,
            eventName: event.eventName,
            loadInTime: event.loadInTime,
            issues,
          };
        }
        return null;
      })
      .filter((alert) => alert !== null);

    return alerts;
  }),
});
