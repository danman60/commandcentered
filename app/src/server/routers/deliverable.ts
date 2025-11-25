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
        include: { event: true, client: true, assignedEditor: true },
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
          client: true,
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
        include: { event: true, client: true, assignedEditor: true },
        orderBy: { dueDate: 'asc' },
      });
    }),

  create: tenantProcedure
    .input(
      z.object({
        eventId: z.string().uuid().optional(),
        clientId: z.string().uuid().optional(),
        deliverableType: z.string(),
        deliverableName: z.string(),
        dueDate: z.date(),
        assignedEditorId: z.string().uuid().optional(),
        priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT', 'CRITICAL']).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate that exactly one of eventId or clientId is provided
      if (!input.eventId && !input.clientId) {
        throw new Error('Either eventId or clientId must be provided');
      }
      if (input.eventId && input.clientId) {
        throw new Error('Cannot provide both eventId and clientId');
      }

      // Validate event if provided
      if (input.eventId) {
        const event = await ctx.prisma.event.findFirst({
          where: { id: input.eventId, tenantId: ctx.tenantId }
        });
        if (!event) throw new Error('Event not found');
      }

      // Validate client if provided
      if (input.clientId) {
        const client = await ctx.prisma.client.findFirst({
          where: { id: input.clientId, tenantId: ctx.tenantId }
        });
        if (!client) throw new Error('Client not found');
      }

      // Validate editor if assigned
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
          clientId: input.clientId,
          deliverableType: input.deliverableType,
          deliverableName: input.deliverableName,
          dueDate: input.dueDate,
          assignedEditorId: input.assignedEditorId,
          priority: input.priority || 'NORMAL',
          notes: input.notes,
          status: 'NOT_STARTED',
        },
        include: { event: true, client: true, assignedEditor: true },
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
        include: { event: true, client: true, assignedEditor: true },
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
        include: { event: true, client: true, assignedEditor: true },
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
        include: { event: true, client: true, assignedEditor: true },
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
        include: { event: true, client: true, assignedEditor: true },
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
        include: { event: true, client: true, assignedEditor: true },
      });
    }),

  getStats: tenantProcedure
    .query(async ({ ctx }) => {
      const now = new Date();
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const allDeliverables = await ctx.prisma.deliverable.findMany({
        where: {
          tenantId: ctx.tenantId,
          status: { notIn: ['DELIVERED', 'CANCELLED'] },
        },
        include: { event: true, client: true },
        orderBy: { dueDate: 'asc' },
      });

      const overdue = allDeliverables.filter(d => d.dueDate < now).length;
      const dueThisWeek = allDeliverables.filter(d => d.dueDate >= now && d.dueDate <= oneWeekFromNow).length;
      const inProgress = allDeliverables.filter(d => d.status === 'IN_PROGRESS').length;

      const nextUp = allDeliverables.slice(0, 2).map(d => {
        const daysUntilDue = Math.floor((d.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          id: d.id,
          title: d.deliverableName,
          eventName: d.event?.eventName || d.client?.organization || 'Unknown',
          dueInDays: daysUntilDue,
        };
      });

      return {
        overdue,
        dueThisWeek,
        inProgress,
        nextUp,
      };
    }),
});
