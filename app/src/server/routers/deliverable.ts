import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const deliverableRouter = router({
  list: tenantProcedure
    .input(z.object({ eventId: z.string().uuid().optional(), status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'IN_REVIEW', 'DELIVERED', 'CANCELLED']).optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.deliverable.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.eventId && { eventId: input.eventId }),
          ...(input?.status && { status: input.status }),
        },
        include: { event: true, assignedEditor: true },
        orderBy: { dueDate: 'asc' },
      });
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.deliverable.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: { event: true, assignedEditor: true },
      });
    }),

  create: tenantProcedure
    .input(
      z.object({
        eventId: z.string().uuid(),
        deliverableType: z.string(),
        deliverableName: z.string(),
        dueDate: z.date(),
        assignedEditorId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findFirst({ where: { id: input.eventId, tenantId: ctx.tenantId } });
      if (!event) throw new Error('Event not found');
      return ctx.prisma.deliverable.create({
        data: { tenantId: ctx.tenantId, status: 'NOT_STARTED', ...input },
      });
    }),

  updateStatus: tenantProcedure
    .input(z.object({ id: z.string().uuid(), status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'IN_REVIEW', 'DELIVERED', 'CANCELLED']) }))
    .mutation(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!deliverable) throw new Error('Deliverable not found');
      return ctx.prisma.deliverable.update({ where: { id: input.id }, data: { status: input.status } });
    }),

  assignEditor: tenantProcedure
    .input(z.object({ id: z.string().uuid(), editorId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      const editor = await ctx.prisma.operator.findFirst({ where: { id: input.editorId, tenantId: ctx.tenantId } });
      if (!deliverable || !editor) throw new Error('Deliverable or editor not found');
      return ctx.prisma.deliverable.update({ where: { id: input.id }, data: { assignedEditorId: input.editorId } });
    }),
});
