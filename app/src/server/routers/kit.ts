import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const kitRouter = router({
  list: tenantProcedure.query(async ({ ctx }) => {
    return ctx.prisma.gearKit.findMany({
      where: { tenantId: ctx.tenantId },
      include: {
        gearAssignments: { include: { gear: true } },
        _count: { select: { gearAssignments: true } },
      },
      orderBy: { kitName: 'asc' },
    });
  }),

  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gearKit.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: {
          gearAssignments: { include: { gear: true, event: true, shift: true } },
        },
      });
    }),

  create: tenantProcedure
    .input(
      z.object({
        kitName: z.string().min(1),
        description: z.string().optional(),
        gearIds: z.array(z.string().uuid()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.gearKit.create({
        data: {
          tenantId: ctx.tenantId,
          kitName: input.kitName,
          description: input.description,
          gearIds: input.gearIds || [],
        },
      });
    }),

  update: tenantProcedure
    .input(z.object({ id: z.string().uuid(), kitName: z.string().min(1).optional(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const kit = await ctx.prisma.gearKit.findFirst({ where: { id, tenantId: ctx.tenantId } });
      if (!kit) throw new Error('Kit not found');
      return ctx.prisma.gearKit.update({ where: { id }, data });
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const kit = await ctx.prisma.gearKit.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!kit) throw new Error('Kit not found');
      return ctx.prisma.gearKit.delete({ where: { id: input.id } });
    }),

  addGear: tenantProcedure
    .input(z.object({ kitId: z.string().uuid(), gearId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: GearAssignments require eventId - update to use gearIds array on GearKit instead
      throw new Error('Add gear to kit not yet implemented');
    }),

  removeGear: tenantProcedure
    .input(z.object({ assignmentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: GearAssignments are event-specific - update to remove from gearIds array instead
      throw new Error('Remove gear from kit not yet implemented');
    }),
});
