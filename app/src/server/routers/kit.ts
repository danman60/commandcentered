import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const kitRouter = router({
  list: tenantProcedure.query(async ({ ctx }) => {
    return ctx.prisma.gearKit.findMany({
      where: { tenantId: ctx.tenantId },
      include: {
        kitGearAssignments: { include: { gear: true } },
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
          kitGearAssignments: { include: { gear: true } },
          gearAssignments: { include: { event: true, shift: true } },
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
      const kit = await ctx.prisma.gearKit.create({
        data: { tenantId: ctx.tenantId, kitName: input.kitName, description: input.description },
      });

      if (input.gearIds && input.gearIds.length > 0) {
        await ctx.prisma.kitGearAssignment.createMany({
          data: input.gearIds.map((gearId) => ({ kitId: kit.id, gearId })),
        });
      }

      return kit;
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
      const kit = await ctx.prisma.gearKit.findFirst({ where: { id: input.kitId, tenantId: ctx.tenantId } });
      const gear = await ctx.prisma.gear.findFirst({ where: { id: input.gearId, tenantId: ctx.tenantId } });
      if (!kit || !gear) throw new Error('Kit or gear not found');
      return ctx.prisma.kitGearAssignment.create({ data: { kitId: input.kitId, gearId: input.gearId } });
    }),

  removeGear: tenantProcedure
    .input(z.object({ assignmentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.kitGearAssignment.findFirst({
        where: { id: input.assignmentId, kit: { tenantId: ctx.tenantId } },
      });
      if (!assignment) throw new Error('Assignment not found');
      return ctx.prisma.kitGearAssignment.delete({ where: { id: input.assignmentId } });
    }),
});
