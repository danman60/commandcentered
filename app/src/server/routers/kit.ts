import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const kitRouter = router({
  // List all kits for tenant
  list: tenantProcedure
    .input(
      z
        .object({
          isActive: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gearKit.findMany({
        where: {
          tenantId: ctx.tenantId,
          isActive: input?.isActive,
        },
        include: {
          gearAssignments: { include: { gear: true } },
          _count: { select: { gearAssignments: true } },
        },
        orderBy: { kitName: 'asc' },
      });
    }),

  // Get single kit by ID
  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const kit = await ctx.prisma.gearKit.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: {
          gearAssignments: { include: { gear: true, event: true, shift: true } },
        },
      });
      if (!kit) throw new Error('Kit not found');
      return kit;
    }),

  // Create new kit
  create: tenantProcedure
    .input(
      z.object({
        kitName: z.string().min(1),
        description: z.string().optional(),
        gearIds: z.array(z.string().uuid()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify all gear IDs belong to tenant if provided
      if (input.gearIds && input.gearIds.length > 0) {
        const gearItems = await ctx.prisma.gear.findMany({
          where: {
            id: { in: input.gearIds },
            tenantId: ctx.tenantId,
          },
        });
        if (gearItems.length !== input.gearIds.length) {
          throw new Error('Some gear items not found or do not belong to tenant');
        }
      }

      return ctx.prisma.gearKit.create({
        data: {
          tenantId: ctx.tenantId,
          kitName: input.kitName,
          description: input.description,
          gearIds: input.gearIds || [],
          isActive: input.isActive ?? true,
        },
        include: {
          gearAssignments: true,
        },
      });
    }),

  // Update kit details
  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        kitName: z.string().min(1).optional(),
        description: z.string().optional().nullable(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify kit exists and belongs to tenant
      const kit = await ctx.prisma.gearKit.findFirst({
        where: { id, tenantId: ctx.tenantId },
      });
      if (!kit) throw new Error('Kit not found');

      return ctx.prisma.gearKit.update({
        where: { id },
        data,
        include: {
          gearAssignments: true,
        },
      });
    }),

  // Delete kit (soft delete by setting isActive to false is recommended in production)
  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify kit exists and belongs to tenant
      const kit = await ctx.prisma.gearKit.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!kit) throw new Error('Kit not found');

      // Delete the kit (this will set kitId to NULL in related GearAssignments due to SetNull cascade)
      return ctx.prisma.gearKit.delete({ where: { id: input.id } });
    }),

  // Soft delete kit (recommended for production)
  archive: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify kit exists and belongs to tenant
      const kit = await ctx.prisma.gearKit.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!kit) throw new Error('Kit not found');

      return ctx.prisma.gearKit.update({
        where: { id: input.id },
        data: { isActive: false },
        include: {
          gearAssignments: true,
        },
      });
    }),

  // Restore archived kit
  restore: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify kit exists and belongs to tenant
      const kit = await ctx.prisma.gearKit.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!kit) throw new Error('Kit not found');

      return ctx.prisma.gearKit.update({
        where: { id: input.id },
        data: { isActive: true },
        include: {
          gearAssignments: true,
        },
      });
    }),

  // Add gear to kit (add to gearIds array)
  addGear: tenantProcedure
    .input(z.object({ kitId: z.string().uuid(), gearId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify kit belongs to tenant
      const kit = await ctx.prisma.gearKit.findFirst({
        where: { id: input.kitId, tenantId: ctx.tenantId },
      });
      if (!kit) throw new Error('Kit not found');

      // Verify gear belongs to tenant
      const gear = await ctx.prisma.gear.findFirst({
        where: { id: input.gearId, tenantId: ctx.tenantId },
      });
      if (!gear) throw new Error('Gear not found');

      // Check if gear is already in the kit
      if (kit.gearIds.includes(input.gearId)) {
        throw new Error('Gear is already in this kit');
      }

      // Add gear ID to gearIds array
      return ctx.prisma.gearKit.update({
        where: { id: input.kitId },
        data: {
          gearIds: {
            push: input.gearId,
          },
        },
        include: {
          gearAssignments: true,
        },
      });
    }),

  // Remove gear from kit (remove from gearIds array)
  removeGear: tenantProcedure
    .input(z.object({ kitId: z.string().uuid(), gearId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify kit belongs to tenant
      const kit = await ctx.prisma.gearKit.findFirst({
        where: { id: input.kitId, tenantId: ctx.tenantId },
      });
      if (!kit) throw new Error('Kit not found');

      // Check if gear is in the kit
      if (!kit.gearIds.includes(input.gearId)) {
        throw new Error('Gear is not in this kit');
      }

      // Remove gear ID from gearIds array
      const updatedGearIds = kit.gearIds.filter((id) => id !== input.gearId);

      return ctx.prisma.gearKit.update({
        where: { id: input.kitId },
        data: {
          gearIds: updatedGearIds,
        },
        include: {
          gearAssignments: true,
        },
      });
    }),

  // Get full gear objects for all gearIds in a kit
  getGearItems: tenantProcedure
    .input(z.object({ kitId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Verify kit belongs to tenant
      const kit = await ctx.prisma.gearKit.findFirst({
        where: { id: input.kitId, tenantId: ctx.tenantId },
      });
      if (!kit) throw new Error('Kit not found');

      // If no gear IDs, return empty array
      if (kit.gearIds.length === 0) {
        return [];
      }

      // Fetch all gear items by IDs
      return ctx.prisma.gear.findMany({
        where: {
          id: { in: kit.gearIds },
          tenantId: ctx.tenantId,
        },
        orderBy: { name: 'asc' },
      });
    }),

  // Bulk add multiple gear items to kit
  bulkAddGear: tenantProcedure
    .input(
      z.object({
        kitId: z.string().uuid(),
        gearIds: z.array(z.string().uuid()).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify kit belongs to tenant
      const kit = await ctx.prisma.gearKit.findFirst({
        where: { id: input.kitId, tenantId: ctx.tenantId },
      });
      if (!kit) throw new Error('Kit not found');

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

      // Filter out gear IDs that are already in the kit
      const newGearIds = input.gearIds.filter((id) => !kit.gearIds.includes(id));

      if (newGearIds.length === 0) {
        throw new Error('All provided gear items are already in this kit');
      }

      // Add new gear IDs to gearIds array
      return ctx.prisma.gearKit.update({
        where: { id: input.kitId },
        data: {
          gearIds: [...kit.gearIds, ...newGearIds],
        },
        include: {
          gearAssignments: true,
        },
      });
    }),

  // Bulk remove multiple gear items from kit
  bulkRemoveGear: tenantProcedure
    .input(
      z.object({
        kitId: z.string().uuid(),
        gearIds: z.array(z.string().uuid()).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify kit belongs to tenant
      const kit = await ctx.prisma.gearKit.findFirst({
        where: { id: input.kitId, tenantId: ctx.tenantId },
      });
      if (!kit) throw new Error('Kit not found');

      // Remove all specified gear IDs from gearIds array
      const updatedGearIds = kit.gearIds.filter((id) => !input.gearIds.includes(id));

      return ctx.prisma.gearKit.update({
        where: { id: input.kitId },
        data: {
          gearIds: updatedGearIds,
        },
        include: {
          gearAssignments: true,
        },
      });
    }),
});
