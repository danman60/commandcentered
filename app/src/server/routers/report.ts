import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

// Return type interfaces for structured data
interface RevenueReportRow {
  period: string; // "2025-01" or "2025-W01" or "2025-01-15"
  projectedRevenue: number;
  actualRevenue: number;
  variance: number;
  eventCount: number;
}

interface GearUtilizationRow {
  gearId: string;
  gearName: string;
  category: string;
  daysAssigned: number;
  totalDays: number;
  utilizationPercent: number;
}

interface OperatorPerformanceRow {
  operatorId: string;
  operatorName: string;
  shiftsWorked: number;
  totalHours: number;
  totalPay: number;
  avgHourlyRate: number;
}

interface EventSummaryRow {
  eventType: string;
  count: number;
  totalRevenue: number;
  avgRevenue: number;
  totalEvents: number;
}

export const reportRouter = router({
  /**
   * Revenue Report - Analyze projected vs actual revenue over time
   * Supports month/week/day grouping
   */
  getRevenueReport: tenantProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        groupBy: z.enum(['month', 'week', 'day']).default('month'),
      }),
    )
    .query(async ({ ctx, input }): Promise<RevenueReportRow[]> => {
      const { startDate, endDate, groupBy } = input;

      // Validate date range
      if (startDate >= endDate) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'startDate must be before endDate',
        });
      }

      // Fetch events in date range (using loadInTime as event date)
      const events = await ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          loadInTime: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          id: true,
          loadInTime: true,
          revenueAmount: true,
          actualRevenue: true,
        },
      });

      // Group events by period
      const periodMap = new Map<string, RevenueReportRow>();

      events.forEach((event) => {
        const date = new Date(event.loadInTime);
        let period: string;

        if (groupBy === 'month') {
          // Format: "2025-01"
          period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else if (groupBy === 'week') {
          // ISO week format: "2025-W01"
          const weekNumber = getISOWeek(date);
          period = `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
        } else {
          // Format: "2025-01-15"
          period = date.toISOString().split('T')[0]!;
        }

        const existing = periodMap.get(period) || {
          period,
          projectedRevenue: 0,
          actualRevenue: 0,
          variance: 0,
          eventCount: 0,
        };

        const projected = Number(event.revenueAmount || 0);
        const actual = Number(event.actualRevenue || 0);

        existing.projectedRevenue += projected;
        existing.actualRevenue += actual;
        existing.eventCount += 1;

        periodMap.set(period, existing);
      });

      // Calculate variance for each period
      const result = Array.from(periodMap.values()).map((row) => ({
        ...row,
        variance: row.actualRevenue - row.projectedRevenue,
      }));

      // Sort by period chronologically
      return result.sort((a, b) => a.period.localeCompare(b.period));
    }),

  /**
   * Gear Utilization Report - Calculate usage statistics for gear
   * Shows days assigned vs total days in date range
   */
  getGearUtilization: tenantProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        gearId: z.string().optional(), // Optional filter for specific gear
      }),
    )
    .query(async ({ ctx, input }): Promise<GearUtilizationRow[]> => {
      const { startDate, endDate, gearId } = input;

      // Validate date range
      if (startDate >= endDate) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'startDate must be before endDate',
        });
      }

      // Calculate total days in range
      const totalDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Fetch gear with assignments in date range
      const gearItems = await ctx.prisma.gear.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(gearId && { id: gearId }),
        },
        select: {
          id: true,
          name: true,
          category: true,
          assignments: {
            where: {
              event: {
                loadInTime: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
            select: {
              event: {
                select: {
                  loadInTime: true,
                  loadOutTime: true,
                },
              },
            },
          },
        },
      });

      // Calculate utilization for each gear item
      const result: GearUtilizationRow[] = gearItems.map((gear) => {
        // Calculate unique days where gear was assigned
        const assignedDates = new Set<string>();

        gear.assignments.forEach((assignment) => {
          const loadIn = new Date(assignment.event.loadInTime);
          const loadOut = new Date(assignment.event.loadOutTime);

          // Add all dates between loadIn and loadOut
          for (
            let d = new Date(loadIn);
            d <= loadOut;
            d.setDate(d.getDate() + 1)
          ) {
            const dateStr = d.toISOString().split('T')[0]!;
            assignedDates.add(dateStr);
          }
        });

        const daysAssigned = assignedDates.size;
        const utilizationPercent =
          totalDays > 0 ? (daysAssigned / totalDays) * 100 : 0;

        return {
          gearId: gear.id,
          gearName: gear.name,
          category: gear.category,
          daysAssigned,
          totalDays,
          utilizationPercent: Math.round(utilizationPercent * 100) / 100, // Round to 2 decimals
        };
      });

      // Sort by utilization percent (descending)
      return result.sort(
        (a, b) => b.utilizationPercent - a.utilizationPercent,
      );
    }),

  /**
   * Operator Performance Report - Aggregate shift stats per operator
   * Shows shifts worked, hours, and pay
   */
  getOperatorPerformance: tenantProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        operatorId: z.string().optional(), // Optional filter for specific operator
      }),
    )
    .query(async ({ ctx, input }): Promise<OperatorPerformanceRow[]> => {
      const { startDate, endDate, operatorId } = input;

      // Validate date range
      if (startDate >= endDate) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'startDate must be before endDate',
        });
      }

      // Fetch operators with their shift assignments in date range
      const operators = await ctx.prisma.operator.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(operatorId && { id: operatorId }),
        },
        select: {
          id: true,
          name: true,
          shiftAssignments: {
            where: {
              shift: {
                startTime: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
            select: {
              actualHours: true,
              estimatedHours: true,
              calculatedPay: true,
            },
          },
        },
      });

      // Aggregate performance metrics per operator
      const result: OperatorPerformanceRow[] = operators.map((operator) => {
        const shiftsWorked = operator.shiftAssignments.length;
        let totalHours = 0;
        let totalPay = 0;

        operator.shiftAssignments.forEach((assignment) => {
          // Use actualHours if available, otherwise estimatedHours
          const hours = Number(
            assignment.actualHours || assignment.estimatedHours || 0,
          );
          totalHours += hours;
          totalPay += Number(assignment.calculatedPay || 0);
        });

        const avgHourlyRate = totalHours > 0 ? totalPay / totalHours : 0;

        return {
          operatorId: operator.id,
          operatorName: operator.name,
          shiftsWorked,
          totalHours: Math.round(totalHours * 100) / 100, // Round to 2 decimals
          totalPay: Math.round(totalPay * 100) / 100,
          avgHourlyRate: Math.round(avgHourlyRate * 100) / 100,
        };
      });

      // Sort by total pay (descending)
      return result.sort((a, b) => b.totalPay - a.totalPay);
    }),

  /**
   * Event Summary Report - Group events by type or status
   * Shows counts and revenue aggregates
   */
  getEventSummary: tenantProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        groupBy: z.enum(['eventType', 'status']).default('eventType'),
      }),
    )
    .query(async ({ ctx, input }): Promise<EventSummaryRow[]> => {
      const { startDate, endDate, groupBy } = input;

      // Validate date range
      if (startDate >= endDate) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'startDate must be before endDate',
        });
      }

      // Fetch events in date range
      const events = await ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          loadInTime: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          eventType: true,
          status: true,
          revenueAmount: true,
          actualRevenue: true,
        },
      });

      // Group events
      const groupMap = new Map<string, EventSummaryRow>();

      events.forEach((event) => {
        const key = groupBy === 'eventType' ? event.eventType : event.status;

        const existing = groupMap.get(key) || {
          eventType: key,
          count: 0,
          totalRevenue: 0,
          avgRevenue: 0,
          totalEvents: 0,
        };

        // Use actualRevenue if available, otherwise revenueAmount
        const revenue = Number(
          event.actualRevenue || event.revenueAmount || 0,
        );

        existing.count += 1;
        existing.totalRevenue += revenue;
        existing.totalEvents += 1;

        groupMap.set(key, existing);
      });

      // Calculate averages
      const result = Array.from(groupMap.values()).map((row) => ({
        ...row,
        avgRevenue:
          row.totalEvents > 0
            ? Math.round((row.totalRevenue / row.totalEvents) * 100) / 100
            : 0,
      }));

      // Sort by total revenue (descending)
      return result.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }),

  /**
   * Export Report - Generate CSV/Excel data for download
   * (Basic implementation - returns data structure suitable for export)
   */
  exportReport: tenantProcedure
    .input(
      z.object({
        reportType: z.enum([
          'revenue',
          'gearUtilization',
          'operatorPerformance',
          'eventSummary',
        ]),
        startDate: z.date(),
        endDate: z.date(),
        groupBy: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { reportType, startDate, endDate, groupBy } = input;

      // Validate date range
      if (startDate >= endDate) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'startDate must be before endDate',
        });
      }

      // Route to appropriate report procedure
      // (In a full implementation, this would generate actual CSV/Excel files)
      let data: unknown;

      switch (reportType) {
        case 'revenue':
          data = await ctx.prisma.event.findMany({
            where: {
              tenantId: ctx.tenantId,
              loadInTime: { gte: startDate, lte: endDate },
            },
            select: {
              eventName: true,
              loadInTime: true,
              revenueAmount: true,
              actualRevenue: true,
              status: true,
            },
          });
          break;

        case 'gearUtilization':
          data = await ctx.prisma.gear.findMany({
            where: { tenantId: ctx.tenantId },
            select: {
              name: true,
              category: true,
              status: true,
              assignments: {
                where: {
                  event: {
                    loadInTime: { gte: startDate, lte: endDate },
                  },
                },
                select: { eventId: true },
              },
            },
          });
          break;

        case 'operatorPerformance':
          data = await ctx.prisma.operator.findMany({
            where: { tenantId: ctx.tenantId },
            select: {
              name: true,
              email: true,
              hourlyRate: true,
              shiftAssignments: {
                where: {
                  shift: {
                    startTime: { gte: startDate, lte: endDate },
                  },
                },
                select: {
                  actualHours: true,
                  estimatedHours: true,
                  calculatedPay: true,
                },
              },
            },
          });
          break;

        case 'eventSummary':
          data = await ctx.prisma.event.findMany({
            where: {
              tenantId: ctx.tenantId,
              loadInTime: { gte: startDate, lte: endDate },
            },
            select: {
              eventName: true,
              eventType: true,
              status: true,
              loadInTime: true,
              loadOutTime: true,
              revenueAmount: true,
              actualRevenue: true,
            },
          });
          break;

        default:
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Unknown report type: ${reportType}`,
          });
      }

      // Return data structure (frontend can convert to CSV/Excel)
      return {
        reportType,
        dateRange: { startDate, endDate },
        data,
      };
    }),
});

/**
 * Helper: Calculate ISO week number from date
 * ISO 8601 week-numbering year
 */
function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}
