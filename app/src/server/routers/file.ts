import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';
import { createClient } from '@/lib/supabase/server';

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

      // Delete from Supabase Storage if filePath is a storage URL
      if (file.filePath) {
        try {
          const supabase = await createClient();

          // Extract storage path from filePath
          // Format: https://netbsyvxrhrqxyzqflmd.supabase.co/storage/v1/object/public/files/path/to/file.pdf
          // Or: files/path/to/file.pdf (direct path)
          let storagePath = file.filePath;

          // If it's a full URL, extract the path after the bucket name
          if (storagePath.includes('supabase.co/storage')) {
            const match = storagePath.match(/\/files\/(.+)$/);
            if (match) {
              storagePath = match[1];
            }
          } else if (storagePath.startsWith('files/')) {
            // Remove bucket prefix if present
            storagePath = storagePath.replace(/^files\//, '');
          }

          // Delete from storage bucket
          const { error: storageError } = await supabase.storage
            .from('files')
            .remove([storagePath]);

          if (storageError) {
            console.error('Supabase Storage deletion error:', storageError);
            // Continue with database deletion even if storage deletion fails
          }
        } catch (error) {
          console.error('Error deleting file from Supabase Storage:', error);
          // Continue with database deletion even if storage deletion fails
        }
      }

      // Delete database record
      return ctx.prisma.file.delete({
        where: { id: input.id },
      });
    }),

  // Google Drive integration - Create folder for event
  createGoogleDriveFolder: tenantProcedure
    .input(z.object({ eventId: z.string().uuid(), folderName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findFirst({
        where: { id: input.eventId, tenantId: ctx.tenantId },
      });
      if (!event) throw new Error('Event not found');

      // Import Google Drive client dynamically
      const { createGoogleDriveClient, getGoogleDriveCredentialsFromEnv } = await import('@/lib/google/drive');

      // Get credentials from environment variables
      const credentials = getGoogleDriveCredentialsFromEnv();

      if (!credentials) {
        // Return fallback response if credentials not configured
        return {
          success: false,
          folderId: null,
          folderUrl: null,
          message: 'Google Drive not configured. Add GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_KEY to environment variables.',
        };
      }

      try {
        // Create Google Drive client and folder
        const driveClient = createGoogleDriveClient(credentials);
        const folder = await driveClient.createFolder(input.folderName);

        return {
          success: true,
          folderId: folder.id,
          folderUrl: folder.webViewLink,
          message: 'Folder created successfully',
        };
      } catch (error: any) {
        console.error('Google Drive folder creation error:', error);
        return {
          success: false,
          folderId: null,
          folderUrl: null,
          message: `Failed to create folder: ${error.message}`,
        };
      }
    }),

  // Vimeo integration
  // Full implementation requires Vimeo OAuth token
  listLivestreams: tenantProcedure.query(async ({ ctx }) => {
    // Vimeo integration structure ready
    // To enable:
    // 1. Create Vimeo app at https://developer.vimeo.com
    // 2. Add access token to environment variables
    // 3. Update this procedure to use real Vimeo API
    //
    // Example implementation:
    // const vimeoToken = process.env.VIMEO_ACCESS_TOKEN;
    // if (vimeoToken) {
    //   const response = await fetch('https://api.vimeo.com/me/live_events', {
    //     headers: {
    //       'Authorization': `Bearer ${vimeoToken}`,
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   const data = await response.json();
    //   return data.data || [];
    // }

    return [];
  }),
});
