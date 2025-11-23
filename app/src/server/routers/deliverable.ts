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
      const deliverable = await ctx.prisma.deliverable.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: {
          event: true,
          assignedEditor: true,
          assets: true,
        },
      });
      if (!deliverable) throw new Error('Deliverable not found');
      return deliverable;
    }),

  getByEvent: tenantProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.deliverable.findMany({
        where: {
          eventId: input.eventId,
          tenantId: ctx.tenantId,
        },
        include: { event: true, assignedEditor: true },
        orderBy: { dueDate: 'asc' },
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
        priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT', 'CRITICAL']).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findFirst({
        where: { id: input.eventId, tenantId: ctx.tenantId }
      });
      if (!event) throw new Error('Event not found');

      if (input.assignedEditorId) {
        const editor = await ctx.prisma.editor.findFirst({
          where: { id: input.assignedEditorId, tenantId: ctx.tenantId }
        });
        if (!editor) throw new Error('Assigned editor not found');
      }

      return ctx.prisma.deliverable.create({
        data: {
          tenantId: ctx.tenantId,
          eventId: input.eventId,
          deliverableType: input.deliverableType,
          deliverableName: input.deliverableName,
          dueDate: input.dueDate,
          assignedEditorId: input.assignedEditorId,
          priority: input.priority || 'NORMAL',
          notes: input.notes,
          status: 'NOT_STARTED',
        },
        include: { event: true, assignedEditor: true },
      });
    }),

  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        deliverableType: z.string().optional(),
        deliverableName: z.string().optional(),
        dueDate: z.date().optional(),
        assignedEditorId: z.string().uuid().optional().nullable(),
        priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT', 'CRITICAL']).optional(),
        notes: z.string().optional().nullable(),
        completionPercentage: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId }
      });
      if (!deliverable) throw new Error('Deliverable not found');

      if (input.assignedEditorId) {
        const editor = await ctx.prisma.editor.findFirst({
          where: { id: input.assignedEditorId, tenantId: ctx.tenantId }
        });
        if (!editor) throw new Error('Assigned editor not found');
      }

      const { id, ...updateData } = input;
      return ctx.prisma.deliverable.update({
        where: { id },
        data: updateData,
        include: { event: true, assignedEditor: true },
      });
    }),

  updateStatus: tenantProcedure
    .input(z.object({
      id: z.string().uuid(),
      status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'IN_REVIEW', 'DELIVERED', 'CANCELLED'])
    }))
    .mutation(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId }
      });
      if (!deliverable) throw new Error('Deliverable not found');

      return ctx.prisma.deliverable.update({
        where: { id: input.id },
        data: { status: input.status },
        include: { event: true, assignedEditor: true },
      });
    }),

  assignEditor: tenantProcedure
    .input(z.object({
      id: z.string().uuid(),
      editorId: z.string().uuid()
    }))
    .mutation(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId }
      });
      if (!deliverable) throw new Error('Deliverable not found');

      const editor = await ctx.prisma.editor.findFirst({
        where: { id: input.editorId, tenantId: ctx.tenantId }
      });
      if (!editor) throw new Error('Editor not found');

      return ctx.prisma.deliverable.update({
        where: { id: input.id },
        data: { assignedEditorId: input.editorId },
        include: { event: true, assignedEditor: true },
      });
    }),

  markComplete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId }
      });
      if (!deliverable) throw new Error('Deliverable not found');

      return ctx.prisma.deliverable.update({
        where: { id: input.id },
        data: { status: 'DELIVERED' },
        include: { event: true, assignedEditor: true },
      });
    }),

  updateGoogleDriveFolder: tenantProcedure
    .input(z.object({
      id: z.string().uuid(),
      googleDriveFolderId: z.string().optional().nullable(),
      googleDriveFolderUrl: z.string().url().optional().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      const deliverable = await ctx.prisma.deliverable.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId }
      });
      if (!deliverable) throw new Error('Deliverable not found');

      const { id, ...data } = input;
      return ctx.prisma.deliverable.update({
        where: { id },
        data,
        include: { event: true, assignedEditor: true },
      });
    }),
});
