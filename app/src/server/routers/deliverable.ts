import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const deliverableRouter = router({
  list: tenantProcedure
    .input(z.object({ eventId: z.string().uuid().optional(), status: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.deliverable.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.eventId && { eventId: input.eventId }),
          ...(input?.status && { status: input.status }),
        },
        include: { event: { include: { client: true } }, assignedEditor: true },
        orderBy: { dueDate: 'asc' },
      });
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.deliverable.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: { event: { include: { client: true } }, assignedEditor: true },
      });
    }),

  create: tenantProcedure
    .input(
      z.object({
        eventId: z.string().uuid(),
        deliverableType: z.string(),
        dueDate: z.date(),
        assignedEditorId: z.string().uuid().optional(),
        googleDriveUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findFirst({ where: { id: input.eventId, tenantId: ctx.tenantId } });
      if (!event) throw new Error('Event not found');
      return ctx.prisma.deliverable.create({
        data: { tenantId: ctx.tenantId, status: 'PENDING', ...input },
      });
    }),

  updateStatus: tenantProcedure
    .input(z.object({ id: z.string().uuid(), status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']) }))
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

  updateGoogleDriveUrl: tenantProcedure
    .input(z.object({ id: z.string().uuid(), url: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!deliverable) throw new Error('Deliverable not found');
      return ctx.prisma.deliverable.update({ where: { id: input.id }, data: { googleDriveUrl: input.url } });
    }),
});
