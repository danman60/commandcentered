import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const clientRouter = router({
  list: tenantProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.client.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.search && { organization: { contains: input.search, mode: 'insensitive' } }),
        },
        orderBy: { organization: 'asc' },
      });
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.client.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
    }),

  create: tenantProcedure
    .input(
      z.object({
        organization: z.string().min(1),
        contactName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.client.create({ data: { tenantId: ctx.tenantId, ...input } });
    }),

  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        organization: z.string().min(1).optional(),
        contactName: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const client = await ctx.prisma.client.findFirst({ where: { id, tenantId: ctx.tenantId } });
      if (!client) throw new Error('Client not found');
      return ctx.prisma.client.update({ where: { id }, data });
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.prisma.client.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!client) throw new Error('Client not found');
      return ctx.prisma.client.delete({ where: { id: input.id } });
    }),

  getEvents: tenantProcedure
    .input(z.object({ clientId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.event.findMany({
        where: { clientId: input.clientId, tenantId: ctx.tenantId },
        orderBy: { loadInTime: 'desc' },
      });
    }),
});
