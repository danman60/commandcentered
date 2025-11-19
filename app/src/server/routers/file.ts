import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const fileRouter = router({
  list: tenantProcedure
    .input(
      z
        .object({
          eventId: z.string().uuid().optional(),
          clientId: z.string().uuid().optional(),
          leadId: z.string().uuid().optional(),
          category: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.file.findMany({
        where: {
          tenantId: ctx.tenantId,
          eventId: input?.eventId,
          clientId: input?.clientId,
          leadId: input?.leadId,
          category: input?.category,
        },
        include: {
          event: { select: { eventName: true } },
          client: { select: { organization: true } },
          lead: { select: { organization: true } },
          uploadedBy: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.file.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: {
          event: { select: { eventName: true } },
          client: { select: { organization: true } },
          lead: { select: { organization: true } },
          uploadedBy: { select: { name: true, email: true } },
        },
      });
    }),

  getByEvent: tenantProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Verify event exists and belongs to tenant
      const event = await ctx.prisma.event.findFirst({
        where: { id: input.eventId, tenantId: ctx.tenantId },
      });
      if (!event) throw new Error('Event not found');

      return ctx.prisma.file.findMany({
        where: { eventId: input.eventId, tenantId: ctx.tenantId },
        include: {
          uploadedBy: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  create: tenantProcedure
    .input(
      z.object({
        fileName: z.string().min(1),
        fileType: z.string(),
        filePath: z.string(),
        fileSize: z.number().int(),
        category: z.string().optional(),
        description: z.string().optional(),
        eventId: z.string().uuid().optional(),
        clientId: z.string().uuid().optional(),
        leadId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify event exists if eventId provided
      if (input.eventId) {
        const event = await ctx.prisma.event.findFirst({
          where: { id: input.eventId, tenantId: ctx.tenantId },
        });
        if (!event) throw new Error('Event not found');
      }

      // Verify client exists if clientId provided
      if (input.clientId) {
        const client = await ctx.prisma.client.findFirst({
          where: { id: input.clientId, tenantId: ctx.tenantId },
        });
        if (!client) throw new Error('Client not found');
      }

      // Verify lead exists if leadId provided
      if (input.leadId) {
        const lead = await ctx.prisma.lead.findFirst({
          where: { id: input.leadId, tenantId: ctx.tenantId },
        });
        if (!lead) throw new Error('Lead not found');
      }

      return ctx.prisma.file.create({
        data: {
          fileName: input.fileName,
          fileType: input.fileType,
          filePath: input.filePath,
          fileSize: BigInt(input.fileSize),
          category: input.category || 'documents',
          description: input.description,
          eventId: input.eventId,
          clientId: input.clientId,
          leadId: input.leadId,
          tenantId: ctx.tenantId,
          uploadedById: ctx.user.id,
        },
        include: {
          event: { select: { eventName: true } },
          client: { select: { organization: true } },
          lead: { select: { organization: true } },
          uploadedBy: { select: { name: true, email: true } },
        },
      });
    }),

  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        fileName: z.string().min(1).optional(),
        description: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify file exists and belongs to tenant
      const file = await ctx.prisma.file.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!file) throw new Error('File not found');

      return ctx.prisma.file.update({
        where: { id: input.id },
        data: {
          fileName: input.fileName,
          description: input.description,
          category: input.category,
        },
      });
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify file exists and belongs to tenant
      const file = await ctx.prisma.file.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!file) throw new Error('File not found');

      // TODO: Also delete from Supabase Storage
      return ctx.prisma.file.delete({
        where: { id: input.id },
      });
    }),

  // Google Drive integration (keeps existing stub)
  createGoogleDriveFolder: tenantProcedure
    .input(z.object({ eventId: z.string().uuid(), folderName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findFirst({
        where: { id: input.eventId, tenantId: ctx.tenantId },
      });
      if (!event) throw new Error('Event not found');
      // TODO: Integrate with Google Drive API
      return { success: true, folderId: 'mock-folder-id', folderUrl: 'https://drive.google.com/...' };
    }),

  // Vimeo integration (keeps existing stub)
  listLivestreams: tenantProcedure.query(async ({ ctx }) => {
    // TODO: Integrate with Vimeo API
    return [];
  }),
});
