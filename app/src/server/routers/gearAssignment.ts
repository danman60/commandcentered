import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

const PackStatusEnum = z.enum([
  'NEEDS_PACKING',
  'PACKED',
  'AT_EVENT',
  'RETURNED',
]);

export const gearAssignmentRouter = router({
  // List assignments with flexible filters
  list: tenantProcedure
    .input(
      z.object({
        eventId: z.string().uuid().optional(),
        gearId: z.string().uuid().optional(),
        shiftId: z.string().uuid().optional(),
        kitId: z.string().uuid().optional(),
        packStatus: PackStatusEnum.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gearAssignment.findMany({
        where: {
          tenantId: ctx.tenantId,
          eventId: input.eventId,
          gearId: input.gearId,
          shiftId: input.shiftId,
          kitId: input.kitId,
          packStatus: input.packStatus,
        },
        include: {
          gear: true,
          event: true,
          kit: true,
          shift: true,
          vehicle: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  // Get single assignment by ID
  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.gearAssignment.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: {
          gear: true,
          event: true,
          kit: true,
          shift: true,
          vehicle: true,
        },
      });
      if (!assignment) throw new Error('Assignment not found');
      return assignment;
    }),

  // Assign gear to event (with optional kit, shift, vehicle)
  assign: tenantProcedure
    .input(
      z.object({
        gearId: z.string().uuid(),
        eventId: z.string().uuid(),
        kitId: z.string().uuid().optional(),
        shiftId: z.string().uuid().optional(),
        vehicleId: z.string().uuid().optional(),
        packStatus: PackStatusEnum.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify gear and event belong to tenant
      const gear = await ctx.prisma.gear.findFirst({
        where: { id: input.gearId, tenantId: ctx.tenantId },
      });
      const event = await ctx.prisma.event.findFirst({
        where: { id: input.eventId, tenantId: ctx.tenantId },
      });
      if (!gear || !event) throw new Error('Gear or event not found');

      // Verify optional relations if provided
      if (input.kitId) {
        const kit = await ctx.prisma.gearKit.findFirst({
          where: { id: input.kitId, tenantId: ctx.tenantId },
        });
        if (!kit) throw new Error('Kit not found');
      }

      if (input.shiftId) {
        const shift = await ctx.prisma.shift.findFirst({
          where: { id: input.shiftId, tenantId: ctx.tenantId },
        });
        if (!shift) throw new Error('Shift not found');
      }

      if (input.vehicleId) {
        const vehicle = await ctx.prisma.vehicle.findFirst({
          where: { id: input.vehicleId, tenantId: ctx.tenantId },
        });
        if (!vehicle) throw new Error('Vehicle not found');
      }

      return ctx.prisma.gearAssignment.create({
        data: {
          tenantId: ctx.tenantId,
          gearId: input.gearId,
          eventId: input.eventId,
          kitId: input.kitId,
          shiftId: input.shiftId,
          vehicleId: input.vehicleId,
          packStatus: input.packStatus || 'NEEDS_PACKING',
        },
        include: {
          gear: true,
          event: true,
          kit: true,
          shift: true,
          vehicle: true,
        },
      });
    }),

  // Unassign gear from event
  unassign: tenantProcedure
    .input(z.object({ assignmentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.gearAssignment.findFirst({
        where: { id: input.assignmentId, tenantId: ctx.tenantId },
      });
      if (!assignment) throw new Error('Assignment not found');
      return ctx.prisma.gearAssignment.delete({ where: { id: input.assignmentId } });
    }),

  // Reassign gear to different event
  reassign: tenantProcedure
    .input(
      z.object({
        assignmentId: z.string().uuid(),
        newEventId: z.string().uuid(),
        newShiftId: z.string().uuid().optional(),
        newKitId: z.string().uuid().optional(),
        newVehicleId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify assignment exists and belongs to tenant
      const assignment = await ctx.prisma.gearAssignment.findFirst({
        where: { id: input.assignmentId, tenantId: ctx.tenantId },
      });
      if (!assignment) throw new Error('Assignment not found');

      // Verify new event belongs to tenant
      const newEvent = await ctx.prisma.event.findFirst({
        where: { id: input.newEventId, tenantId: ctx.tenantId },
      });
      if (!newEvent) throw new Error('New event not found');

      // Verify optional new relations if provided
      if (input.newShiftId) {
        const newShift = await ctx.prisma.shift.findFirst({
          where: { id: input.newShiftId, tenantId: ctx.tenantId },
        });
        if (!newShift) throw new Error('New shift not found');
      }

      if (input.newKitId) {
        const newKit = await ctx.prisma.gearKit.findFirst({
          where: { id: input.newKitId, tenantId: ctx.tenantId },
        });
        if (!newKit) throw new Error('New kit not found');
      }

      if (input.newVehicleId) {
        const newVehicle = await ctx.prisma.vehicle.findFirst({
          where: { id: input.newVehicleId, tenantId: ctx.tenantId },
        });
        if (!newVehicle) throw new Error('New vehicle not found');
      }

      return ctx.prisma.gearAssignment.update({
        where: { id: input.assignmentId },
        data: {
          eventId: input.newEventId,
          shiftId: input.newShiftId,
          kitId: input.newKitId,
          vehicleId: input.newVehicleId,
        },
        include: {
          gear: true,
          event: true,
          kit: true,
          shift: true,
          vehicle: true,
        },
      });
    }),

  // Check if gear is available for a date range (not assigned to any event in that range)
  checkAvailability: tenantProcedure
    .input(
      z.object({
        gearId: z.string().uuid(),
        startDate: z.date(),
        endDate: z.date(),
        excludeEventId: z.string().uuid().optional(), // Exclude specific event (useful for editing)
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify gear exists and belongs to tenant
      const gear = await ctx.prisma.gear.findFirst({
        where: { id: input.gearId, tenantId: ctx.tenantId },
      });
      if (!gear) throw new Error('Gear not found');

      // Find overlapping assignments
      const overlappingAssignments = await ctx.prisma.gearAssignment.findMany({
        where: {
          tenantId: ctx.tenantId,
          gearId: input.gearId,
          eventId: input.excludeEventId ? { not: input.excludeEventId } : undefined,
          event: {
            OR: [
              {
                AND: [
                  { loadInTime: { lte: input.endDate } },
                  { loadOutTime: { gte: input.startDate } },
                ],
              },
            ],
          },
        },
        include: {
          event: true,
          shift: true,
        },
      });

      return {
        isAvailable: overlappingAssignments.length === 0,
        conflictingAssignments: overlappingAssignments,
      };
    }),

  // Bulk assign multiple gear items to an event
  bulkAssign: tenantProcedure
    .input(
      z.object({
        gearIds: z.array(z.string().uuid()).min(1),
        eventId: z.string().uuid(),
        kitId: z.string().uuid().optional(),
        shiftId: z.string().uuid().optional(),
        vehicleId: z.string().uuid().optional(),
        packStatus: PackStatusEnum.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify event belongs to tenant
      const event = await ctx.prisma.event.findFirst({
        where: { id: input.eventId, tenantId: ctx.tenantId },
      });
      if (!event) throw new Error('Event not found');

      // Verify all gear items belong to tenant
      const gearItems = await ctx.prisma.gear.findMany({
        where: {
          id: { in: input.gearIds },
          tenantId: ctx.tenantId,
        },
      });
      if (gearItems.length !== input.gearIds.length) {
        throw new Error('Some gear items not found or do not belong to tenant');
      }

      // Verify optional relations if provided
      if (input.kitId) {
        const kit = await ctx.prisma.gearKit.findFirst({
          where: { id: input.kitId, tenantId: ctx.tenantId },
        });
        if (!kit) throw new Error('Kit not found');
      }

      if (input.shiftId) {
        const shift = await ctx.prisma.shift.findFirst({
          where: { id: input.shiftId, tenantId: ctx.tenantId },
        });
        if (!shift) throw new Error('Shift not found');
      }

      if (input.vehicleId) {
        const vehicle = await ctx.prisma.vehicle.findFirst({
          where: { id: input.vehicleId, tenantId: ctx.tenantId },
        });
        if (!vehicle) throw new Error('Vehicle not found');
      }

      // Create all assignments
      const assignments = await ctx.prisma.$transaction(
        input.gearIds.map((gearId) =>
          ctx.prisma.gearAssignment.create({
            data: {
              tenantId: ctx.tenantId,
              gearId,
              eventId: input.eventId,
              kitId: input.kitId,
              shiftId: input.shiftId,
              vehicleId: input.vehicleId,
              packStatus: input.packStatus || 'NEEDS_PACKING',
            },
            include: {
              gear: true,
              event: true,
              kit: true,
              shift: true,
              vehicle: true,
            },
          })
        )
      );

      return assignments;
    }),

  // Update assignment details (pack status, vehicle, etc)
  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        packStatus: PackStatusEnum.optional(),
        vehicleId: z.string().uuid().optional().nullable(),
        shiftId: z.string().uuid().optional().nullable(),
        kitId: z.string().uuid().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify assignment exists and belongs to tenant
      const assignment = await ctx.prisma.gearAssignment.findFirst({
        where: { id, tenantId: ctx.tenantId },
      });
      if (!assignment) throw new Error('Assignment not found');

      // Verify optional relations if provided
      if (data.vehicleId) {
        const vehicle = await ctx.prisma.vehicle.findFirst({
          where: { id: data.vehicleId, tenantId: ctx.tenantId },
        });
        if (!vehicle) throw new Error('Vehicle not found');
      }

      if (data.shiftId) {
        const shift = await ctx.prisma.shift.findFirst({
          where: { id: data.shiftId, tenantId: ctx.tenantId },
        });
        if (!shift) throw new Error('Shift not found');
      }

      if (data.kitId) {
        const kit = await ctx.prisma.gearKit.findFirst({
          where: { id: data.kitId, tenantId: ctx.tenantId },
        });
        if (!kit) throw new Error('Kit not found');
      }

      return ctx.prisma.gearAssignment.update({
        where: { id },
        data,
        include: {
          gear: true,
          event: true,
          kit: true,
          shift: true,
          vehicle: true,
        },
      });
    }),

  // Legacy procedures for backward compatibility
  listByEvent: tenantProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gearAssignment.findMany({
        where: { eventId: input.eventId, tenantId: ctx.tenantId },
        include: { gear: true, kit: true, shift: true, vehicle: true },
      });
    }),

  listByGear: tenantProcedure
    .input(z.object({ gearId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gearAssignment.findMany({
        where: { gearId: input.gearId, tenantId: ctx.tenantId },
        include: { event: true, kit: true, shift: true, vehicle: true },
        orderBy: { createdAt: 'desc' },
      });
    }),
});
