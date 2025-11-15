import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

/**
 * Shift Router - 8 procedures
 *
 * Manages shifts within events:
 * - Create/update/delete shifts
 * - Assign operators to shifts
 * - Track shift conflicts
 */
export const shiftRouter = router({
  /**
   * List all shifts for an event
   */
  listByEvent: tenantProcedure
    .input(
      z.object({
        eventId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.shift.findMany({
        where: {
          eventId: input.eventId,
          event: { tenantId: ctx.tenantId }, // Ensure tenant isolation
        },
        include: {
          shiftAssignments: {
            include: {
              operator: true,
            },
          },
          gearAssignments: {
            include: {
              gear: true,
              kit: true,
            },
          },
        },
        orderBy: { startTime: 'asc' },
      });
    }),

  /**
   * Get shift by ID
   */
  getById: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.shift.findFirst({
        where: {
          id: input.id,
          event: { tenantId: ctx.tenantId },
        },
        include: {
          event: true,
          shiftAssignments: {
            include: {
              operator: true,
            },
          },
          gearAssignments: {
            include: {
              gear: true,
              kit: true,
            },
          },
        },
      });
    }),

  /**
   * Create new shift
   */
  create: tenantProcedure
    .input(
      z.object({
        eventId: z.string().uuid(),
        shiftName: z.string().min(1),
        startTime: z.date(),
        endTime: z.date(),
        requiredOperators: z.number().int().min(1).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify event belongs to tenant
      const event = await ctx.prisma.event.findFirst({
        where: {
          id: input.eventId,
          tenantId: ctx.tenantId,
        },
      });

      if (!event) {
        throw new Error('Event not found');
      }

      return ctx.prisma.shift.create({
        data: {
          eventId: input.eventId,
          shiftName: input.shiftName,
          startTime: input.startTime,
          endTime: input.endTime,
          requiredOperators: input.requiredOperators,
          notes: input.notes,
        },
        include: {
          event: true,
        },
      });
    }),

  /**
   * Update shift
   */
  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        shiftName: z.string().min(1).optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        requiredOperators: z.number().int().min(1).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify shift belongs to tenant's event
      const shift = await ctx.prisma.shift.findFirst({
        where: {
          id,
          event: { tenantId: ctx.tenantId },
        },
      });

      if (!shift) {
        throw new Error('Shift not found');
      }

      return ctx.prisma.shift.update({
        where: { id },
        data,
        include: {
          event: true,
          shiftAssignments: {
            include: {
              operator: true,
            },
          },
        },
      });
    }),

  /**
   * Delete shift
   */
  delete: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify shift belongs to tenant's event
      const shift = await ctx.prisma.shift.findFirst({
        where: {
          id: input.id,
          event: { tenantId: ctx.tenantId },
        },
      });

      if (!shift) {
        throw new Error('Shift not found');
      }

      return ctx.prisma.shift.delete({
        where: { id: input.id },
      });
    }),

  /**
   * Assign operator to shift
   */
  assignOperator: tenantProcedure
    .input(
      z.object({
        shiftId: z.string().uuid(),
        operatorId: z.string().uuid(),
        role: z.string().optional(),
        payRate: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify shift and operator belong to tenant
      const shift = await ctx.prisma.shift.findFirst({
        where: {
          id: input.shiftId,
          event: { tenantId: ctx.tenantId },
        },
      });

      const operator = await ctx.prisma.operator.findFirst({
        where: {
          id: input.operatorId,
          tenantId: ctx.tenantId,
        },
      });

      if (!shift || !operator) {
        throw new Error('Shift or operator not found');
      }

      return ctx.prisma.shiftAssignment.create({
        data: {
          shiftId: input.shiftId,
          operatorId: input.operatorId,
          role: input.role,
          payRate: input.payRate,
        },
        include: {
          shift: true,
          operator: true,
        },
      });
    }),

  /**
   * Remove operator from shift
   */
  removeOperator: tenantProcedure
    .input(
      z.object({
        assignmentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify assignment belongs to tenant's shift
      const assignment = await ctx.prisma.shiftAssignment.findFirst({
        where: {
          id: input.assignmentId,
          shift: {
            event: { tenantId: ctx.tenantId },
          },
        },
      });

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      return ctx.prisma.shiftAssignment.delete({
        where: { id: input.assignmentId },
      });
    }),

  /**
   * Check for operator conflicts (overlapping shifts)
   */
  checkConflicts: tenantProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
        startTime: z.date(),
        endTime: z.date(),
        excludeShiftId: z.string().uuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conflicts = await ctx.prisma.shiftAssignment.findMany({
        where: {
          operatorId: input.operatorId,
          shift: {
            id: input.excludeShiftId ? { not: input.excludeShiftId } : undefined,
            event: { tenantId: ctx.tenantId },
            OR: [
              {
                // Shift starts during this time
                startTime: {
                  gte: input.startTime,
                  lt: input.endTime,
                },
              },
              {
                // Shift ends during this time
                endTime: {
                  gt: input.startTime,
                  lte: input.endTime,
                },
              },
              {
                // Shift encompasses this time
                AND: [{ startTime: { lte: input.startTime } }, { endTime: { gte: input.endTime } }],
              },
            ],
          },
        },
        include: {
          shift: {
            include: {
              event: true,
            },
          },
          operator: true,
        },
      });

      return conflicts;
    }),
});
