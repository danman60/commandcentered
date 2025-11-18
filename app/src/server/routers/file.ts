import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const fileRouter = router({
  list: tenantProcedure
    .input(z.object({ eventId: z.string().uuid().optional(), fileType: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      // TODO: Add FileAsset model to schema
      return [];
    }),

  create: tenantProcedure
    .input(
      z.object({
        fileName: z.string().min(1),
        fileType: z.string(),
        fileUrl: z.string().url(),
        fileSize: z.number().optional(),
        eventId: z.string().uuid().optional(),
        googleDriveUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Add FileAsset model to schema
      throw new Error('File creation not yet implemented');
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Add FileAsset model to schema
      throw new Error('File deletion not yet implemented');
    }),

  createGoogleDriveFolder: tenantProcedure
    .input(z.object({ eventId: z.string().uuid(), folderName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findFirst({ where: { id: input.eventId, tenantId: ctx.tenantId } });
      if (!event) throw new Error('Event not found');
      // TODO: Integrate with Google Drive API
      return { success: true, folderId: 'mock-folder-id', folderUrl: 'https://drive.google.com/...' };
    }),

  listLivestreams: tenantProcedure.query(async ({ ctx }) => {
    // TODO: Integrate with Vimeo API
    return [];
  }),
});
