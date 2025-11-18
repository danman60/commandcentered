import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';
import { OperatorRole, PayType, Prisma } from '@prisma/client';

/**
 * Shift Router - 11 procedures
 *
 * Manages shifts within events:
 * - Create/update/list/delete shifts
 * - Assign/unassign operators to shifts
 * - Check scheduling conflicts
 * - Get shifts by event or operator
 */
export const shiftRouter = router({
  /**
   * List shifts with filters
   */
  list: tenantProcedure
    .input(
      z
        .object({
          eventId: z.string().uuid().optional(),
          operatorId: z.string().uuid().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.shift.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.eventId && { eventId: input.eventId }),
          ...(input?.operatorId && {
            shiftAssignments: {
              some: {
                operatorId: input.operatorId,
              },
            },
          }),
          ...(input?.startDate &&
            input?.endDate && {
              startTime: {
                gte: input.startDate,
                lte: input.endDate,
              },
            }),
        },
        include: {
          event: true,
          shiftAssignments: {
            include: {
              operator: true,
            },
          },
          _count: {
            select: {
              shiftAssignments: true,
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
          tenantId: ctx.tenantId,
        },
        include: {
          event: true,
          shiftAssignments: {
            include: {
              operator: true,
              rideProvider: true,
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
        isOverlapShift: z.boolean().default(false),
        rolesNeeded: z.any().optional(),
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
          tenantId: ctx.tenantId,
          ...input,
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
        isOverlapShift: z.boolean().optional(),
        rolesNeeded: z.any().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify shift belongs to tenant
      const shift = await ctx.prisma.shift.findFirst({
        where: {
          id,
          tenantId: ctx.tenantId,
        },
      });

      if (!shift) {
        throw new Error('Shift not found');
      }

      return ctx.prisma.shift.update({
        where: { id },
        data,
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
      // Verify shift belongs to tenant
      const shift = await ctx.prisma.shift.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });

      if (!shift) {
        throw new Error('Shift not found');
      }

      // Check if shift has assignments
      const assignmentCount = await ctx.prisma.shiftAssignment.count({
        where: { shiftId: input.id },
      });

      if (assignmentCount > 0) {
        throw new Error(
          'Cannot delete shift with assignments. Remove assignments first.'
        );
      }

      return ctx.prisma.shift.delete({
        where: { id: input.id },
      });
    }),

  /**
   * Get shifts by event
   */
  getByEvent: tenantProcedure
    .input(
      z.object({
        eventId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
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

      return ctx.prisma.shift.findMany({
        where: {
          eventId: input.eventId,
          tenantId: ctx.tenantId,
        },
        include: {
          shiftAssignments: {
            include: {
              operator: true,
            },
          },
          _count: {
            select: {
              shiftAssignments: true,
            },
          },
        },
        orderBy: { startTime: 'asc' },
      });
    }),

  /**
   * Get shifts by operator
   */
  getByOperator: tenantProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify operator belongs to tenant
      const operator = await ctx.prisma.operator.findFirst({
        where: {
          id: input.operatorId,
          tenantId: ctx.tenantId,
        },
      });

      if (!operator) {
        throw new Error('Operator not found');
      }

      return ctx.prisma.shift.findMany({
        where: {
          tenantId: ctx.tenantId,
          shiftAssignments: {
            some: {
              operatorId: input.operatorId,
            },
          },
          ...(input.startDate &&
            input.endDate && {
              startTime: {
                gte: input.startDate,
                lte: input.endDate,
              },
            }),
        },
        include: {
          event: true,
          shiftAssignments: {
            where: {
              operatorId: input.operatorId,
            },
            include: {
              operator: true,
            },
          },
        },
        orderBy: { startTime: 'asc' },
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
        role: z.nativeEnum(OperatorRole),
        payType: z.nativeEnum(PayType).default('HOURLY'),
        hourlyRate: z.number().optional(),
        estimatedHours: z.number().optional(),
        flatRate: z.number().optional(),
        needsRide: z.boolean().default(false),
        rideProviderId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify shift belongs to tenant
      const shift = await ctx.prisma.shift.findFirst({
        where: {
          id: input.shiftId,
          tenantId: ctx.tenantId,
        },
      });

      if (!shift) {
        throw new Error('Shift not found');
      }

      // Verify operator belongs to tenant
      const operator = await ctx.prisma.operator.findFirst({
        where: {
          id: input.operatorId,
          tenantId: ctx.tenantId,
        },
      });

      if (!operator) {
        throw new Error('Operator not found');
      }

      // Verify ride provider if specified
      if (input.rideProviderId) {
        const rideProvider = await ctx.prisma.operator.findFirst({
          where: {
            id: input.rideProviderId,
            tenantId: ctx.tenantId,
          },
        });

        if (!rideProvider) {
          throw new Error('Ride provider not found');
        }
      }

      // Check for existing assignment
      const existingAssignment = await ctx.prisma.shiftAssignment.findFirst({
        where: {
          shiftId: input.shiftId,
          operatorId: input.operatorId,
        },
      });

      if (existingAssignment) {
        throw new Error('Operator already assigned to this shift');
      }

      // Calculate pay based on type
      let calculatedPay = 0;
      if (input.payType === 'HOURLY') {
        if (!input.hourlyRate || !input.estimatedHours) {
          throw new Error(
            'Hourly rate and estimated hours required for hourly pay type'
          );
        }
        calculatedPay = input.hourlyRate * input.estimatedHours;
      } else if (input.payType === 'FLAT') {
        if (!input.flatRate) {
          throw new Error('Flat rate required for flat pay type');
        }
        calculatedPay = input.flatRate;
      }

      return ctx.prisma.shiftAssignment.create({
        data: {
          tenantId: ctx.tenantId,
          shiftId: input.shiftId,
          operatorId: input.operatorId,
          role: input.role,
          payType: input.payType,
          hourlyRate: input.hourlyRate,
          estimatedHours: input.estimatedHours,
          flatRate: input.flatRate,
          calculatedPay,
          needsRide: input.needsRide,
          rideProviderId: input.rideProviderId,
        },
        include: {
          operator: true,
          shift: true,
        },
      });
    }),

  /**
   * Unassign operator from shift
   */
  unassignOperator: tenantProcedure
    .input(
      z.object({
        assignmentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify assignment belongs to tenant
      const assignment = await ctx.prisma.shiftAssignment.findFirst({
        where: {
          id: input.assignmentId,
          tenantId: ctx.tenantId,
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
   * Check for scheduling conflicts for an operator
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
      // Verify operator belongs to tenant
      const operator = await ctx.prisma.operator.findFirst({
        where: {
          id: input.operatorId,
          tenantId: ctx.tenantId,
        },
      });

      if (!operator) {
        throw new Error('Operator not found');
      }

      // Find overlapping shifts
      const conflicts = await ctx.prisma.shift.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input.excludeShiftId && {
            id: { not: input.excludeShiftId },
          }),
          shiftAssignments: {
            some: {
              operatorId: input.operatorId,
            },
          },
          OR: [
            {
              // Shift starts during the time range
              startTime: {
                gte: input.startTime,
                lt: input.endTime,
              },
            },
            {
              // Shift ends during the time range
              endTime: {
                gt: input.startTime,
                lte: input.endTime,
              },
            },
            {
              // Shift completely encompasses the time range
              AND: [
                { startTime: { lte: input.startTime } },
                { endTime: { gte: input.endTime } },
              ],
            },
          ],
        },
        include: {
          event: true,
          shiftAssignments: {
            where: {
              operatorId: input.operatorId,
            },
          },
        },
        orderBy: { startTime: 'asc' },
      });

      // Check blackout dates
      const blackoutDates = await ctx.prisma.operatorBlackoutDate.findMany({
        where: {
          operatorId: input.operatorId,
          tenantId: ctx.tenantId,
          OR: [
            {
              // Blackout period overlaps with shift start
              AND: [
                { startDate: { lte: input.startTime } },
                { endDate: { gte: input.startTime } },
              ],
            },
            {
              // Blackout period overlaps with shift end
              AND: [
                { startDate: { lte: input.endTime } },
                { endDate: { gte: input.endTime } },
              ],
            },
            {
              // Shift completely encompasses blackout period
              AND: [
                { startDate: { gte: input.startTime } },
                { endDate: { lte: input.endTime } },
              ],
            },
          ],
        },
      });

      return {
        hasConflicts: conflicts.length > 0 || blackoutDates.length > 0,
        shiftConflicts: conflicts,
        blackoutConflicts: blackoutDates,
      };
    }),

  /**
   * Update shift assignment details
   */
  updateAssignment: tenantProcedure
    .input(
      z.object({
        assignmentId: z.string().uuid(),
        role: z.nativeEnum(OperatorRole).optional(),
        payType: z.nativeEnum(PayType).optional(),
        hourlyRate: z.number().optional(),
        estimatedHours: z.number().optional(),
        actualHours: z.number().optional(),
        flatRate: z.number().optional(),
        needsRide: z.boolean().optional(),
        rideProviderId: z.string().uuid().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { assignmentId, ...data } = input;

      // Verify assignment belongs to tenant
      const assignment = await ctx.prisma.shiftAssignment.findFirst({
        where: {
          id: assignmentId,
          tenantId: ctx.tenantId,
        },
      });

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      // Verify ride provider if specified
      if (data.rideProviderId) {
        const rideProvider = await ctx.prisma.operator.findFirst({
          where: {
            id: data.rideProviderId,
            tenantId: ctx.tenantId,
          },
        });

        if (!rideProvider) {
          throw new Error('Ride provider not found');
        }
      }

      // Recalculate pay if relevant fields changed
      let calculatedPay = assignment.calculatedPay;
      const payType = data.payType ?? assignment.payType;

      if (payType === 'HOURLY') {
        const hourlyRate = data.hourlyRate ?? assignment.hourlyRate;
        const hours =
          data.actualHours ??
          data.estimatedHours ??
          assignment.actualHours ??
          assignment.estimatedHours;

        if (hourlyRate && hours) {
          calculatedPay = new Prisma.Decimal(
            Number(hourlyRate) * Number(hours)
          );
        }
      } else if (payType === 'FLAT') {
        const flatRate = data.flatRate ?? assignment.flatRate;
        if (flatRate) {
          calculatedPay = new Prisma.Decimal(Number(flatRate));
        }
      }

      return ctx.prisma.shiftAssignment.update({
        where: { id: assignmentId },
        data: {
          ...data,
          calculatedPay,
        },
        include: {
          operator: true,
          shift: true,
        },
      });
    }),
});
