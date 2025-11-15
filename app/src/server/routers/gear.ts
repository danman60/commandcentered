import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const gearRouter = router({
  list: tenantProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE']).optional(),
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
              { gearName: { contains: input.search, mode: 'insensitive' } },
              { serialNumber: { contains: input.search, mode: 'insensitive' } },
            ],
          }),
        },
        include: {
          currentEvent: true,
          _count: { select: { gearAssignments: true } },
        },
        orderBy: { gearName: 'asc' },
      });
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gear.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: {
          currentEvent: true,
          gearAssignments: { include: { event: true, kit: true }, orderBy: { createdAt: 'desc' }, take: 10 },
        },
      });
    }),

  create: tenantProcedure
    .input(
      z.object({
        gearName: z.string().min(1),
        category: z.string(),
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
        gearName: z.string().min(1).optional(),
        status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE']).optional(),
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
    .input(z.object({ id: z.string().uuid(), status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE']) }))
    .mutation(async ({ ctx, input }) => {
      const gear = await ctx.prisma.gear.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!gear) throw new Error('Gear not found');
      return ctx.prisma.gear.update({ where: { id: input.id }, data: { status: input.status } });
    }),

  trackLocation: tenantProcedure
    .input(z.object({ id: z.string().uuid(), location: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const gear = await ctx.prisma.gear.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!gear) throw new Error('Gear not found');
      return ctx.prisma.gear.update({ where: { id: input.id }, data: { currentLocation: input.location } });
    }),
});
