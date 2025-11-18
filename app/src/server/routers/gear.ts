import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const gearRouter = router({
  list: tenantProcedure
    .input(
      z
        .object({
          category: z.enum(['CAMERA', 'LENS', 'AUDIO', 'COMPUTER', 'RIGGING', 'CABLE', 'LIGHTING', 'ACCESSORIES', 'STABILIZERS', 'DRONES', 'MONITORS', 'OTHER']).optional(),
          status: z.enum(['AVAILABLE', 'IN_USE', 'NEEDS_REPAIR', 'IN_REPAIR', 'RETIRED', 'UNAVAILABLE', 'OUT_OF_SERVICE']).optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gear.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.category && { category: input.category }),
          ...(input?.status && { status: input.status }),
          ...(input?.search && {
            OR: [
              { name: { contains: input.search, mode: 'insensitive' } },
              { serialNumber: { contains: input.search, mode: 'insensitive' } },
            ],
          }),
        },
        orderBy: { name: 'asc' },
      });
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gear.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
    }),

  create: tenantProcedure
    .input(
      z.object({
        name: z.string().min(1),
        category: z.enum(['CAMERA', 'LENS', 'AUDIO', 'COMPUTER', 'RIGGING', 'CABLE', 'LIGHTING', 'ACCESSORIES', 'STABILIZERS', 'DRONES', 'MONITORS', 'OTHER']),
        type: z.string(),
        manufacturer: z.string().optional(),
        model: z.string().optional(),
        serialNumber: z.string().optional(),
        purchaseDate: z.date().optional(),
        purchasePrice: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.gear.create({
        data: { tenantId: ctx.tenantId, status: 'AVAILABLE', ...input },
      });
    }),

  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        status: z.enum(['AVAILABLE', 'IN_USE', 'NEEDS_REPAIR', 'IN_REPAIR', 'RETIRED', 'UNAVAILABLE', 'OUT_OF_SERVICE']).optional(),
        serialNumber: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const gear = await ctx.prisma.gear.findFirst({ where: { id, tenantId: ctx.tenantId } });
      if (!gear) throw new Error('Gear not found');
      return ctx.prisma.gear.update({ where: { id }, data });
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const gear = await ctx.prisma.gear.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!gear) throw new Error('Gear not found');
      return ctx.prisma.gear.delete({ where: { id: input.id } });
    }),

  updateStatus: tenantProcedure
    .input(z.object({ id: z.string().uuid(), status: z.enum(['AVAILABLE', 'IN_USE', 'NEEDS_REPAIR', 'IN_REPAIR', 'RETIRED', 'UNAVAILABLE', 'OUT_OF_SERVICE']) }))
    .mutation(async ({ ctx, input }) => {
      const gear = await ctx.prisma.gear.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!gear) throw new Error('Gear not found');
      return ctx.prisma.gear.update({ where: { id: input.id }, data: { status: input.status } });
    }),

  /**
   * Get gear by category
   */
  getByCategory: tenantProcedure
    .input(
      z.object({
        category: z.enum([
          'CAMERA',
          'LENS',
          'AUDIO',
          'COMPUTER',
          'RIGGING',
          'CABLE',
          'LIGHTING',
          'ACCESSORIES',
          'STABILIZERS',
          'DRONES',
          'MONITORS',
          'OTHER',
        ]),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gear.findMany({
        where: {
          tenantId: ctx.tenantId,
          category: input.category,
        },
        orderBy: { name: 'asc' },
      });
    }),

  /**
   * Get available gear (status = AVAILABLE)
   */
  getAvailable: tenantProcedure
    .input(
      z
        .object({
          category: z
            .enum([
              'CAMERA',
              'LENS',
              'AUDIO',
              'COMPUTER',
              'RIGGING',
              'CABLE',
              'LIGHTING',
              'ACCESSORIES',
              'STABILIZERS',
              'DRONES',
              'MONITORS',
              'OTHER',
            ])
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gear.findMany({
        where: {
          tenantId: ctx.tenantId,
          status: 'AVAILABLE',
          ...(input?.category && { category: input.category }),
        },
        orderBy: { name: 'asc' },
      });
    }),

  /**
   * Get gear utilization - show current assignments
   */
  getUtilization: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const gear = await ctx.prisma.gear.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });

      if (!gear) throw new Error('Gear not found');

      // Get current assignments (events that haven't ended yet)
      const currentAssignments = await ctx.prisma.gearAssignment.findMany({
        where: {
          gearId: input.id,
          tenantId: ctx.tenantId,
          event: {
            loadOutTime: {
              gte: new Date(), // Current or future events
            },
          },
        },
        include: {
          event: {
            select: {
              id: true,
              eventName: true,
              eventType: true,
              loadInTime: true,
              loadOutTime: true,
              venueName: true,
            },
          },
          shift: {
            select: {
              id: true,
              shiftName: true,
              startTime: true,
              endTime: true,
            },
          },
        },
        orderBy: {
          event: {
            loadInTime: 'asc',
          },
        },
      });

      return {
        gear,
        currentAssignments,
        isAvailable: currentAssignments.length === 0 && gear.status === 'AVAILABLE',
      };
    }),

  /**
   * Get gear assignment history
   */
  getHistory: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const gear = await ctx.prisma.gear.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });

      if (!gear) throw new Error('Gear not found');

      // Get past assignments
      const assignments = await ctx.prisma.gearAssignment.findMany({
        where: {
          gearId: input.id,
          tenantId: ctx.tenantId,
        },
        include: {
          event: {
            select: {
              id: true,
              eventName: true,
              eventType: true,
              loadInTime: true,
              loadOutTime: true,
              clientName: true,
            },
          },
          shift: {
            select: {
              id: true,
              shiftName: true,
              startTime: true,
              endTime: true,
            },
          },
        },
        orderBy: {
          event: {
            loadInTime: 'desc',
          },
        },
        take: input.limit || 50,
      });

      // Get movement history
      const movements = await ctx.prisma.gearMovementHistory.findMany({
        where: {
          gearId: input.id,
          tenantId: ctx.tenantId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: input.limit || 50,
      });

      return {
        gear,
        assignments,
        movements,
      };
    }),
});
