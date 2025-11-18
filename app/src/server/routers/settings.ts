import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const settingsRouter = router({
  // Get all system settings for current tenant
  get: tenantProcedure.query(async ({ ctx }) => {
    const settings = await ctx.prisma.systemSettings.findUnique({
      where: { tenantId: ctx.tenantId },
    });

    // If no settings exist, return defaults
    if (!settings) {
      return {
        id: '',
        tenantId: ctx.tenantId,
        stripePublishableKey: null,
        stripeSecretKey: null,
        stripeWebhookSecret: null,
        emailProvider: null,
        emailApiKey: null,
        emailFromAddress: null,
        emailFromName: null,
        googleDriveEnabled: false,
        googleDriveParentFolderId: null,
        googleDriveCredentials: null,
        companyName: null,
        companyLogoUrl: null,
        primaryColor: null,
        secondaryColor: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return settings;
  }),

  // Update system settings
  update: tenantProcedure
    .input(
      z.object({
        // Stripe settings
        stripePublishableKey: z.string().max(500).optional().nullable(),
        stripeSecretKey: z.string().max(500).optional().nullable(),
        stripeWebhookSecret: z.string().max(500).optional().nullable(),

        // Email settings
        emailProvider: z.string().max(50).optional().nullable(),
        emailApiKey: z.string().max(500).optional().nullable(),
        emailFromAddress: z.string().max(255).email().optional().nullable(),
        emailFromName: z.string().max(255).optional().nullable(),

        // Google Drive settings
        googleDriveEnabled: z.boolean().optional(),
        googleDriveParentFolderId: z.string().max(255).optional().nullable(),
        googleDriveCredentials: z.any().optional().nullable(),

        // Company branding
        companyName: z.string().max(255).optional().nullable(),
        companyLogoUrl: z.string().max(500).url().optional().nullable(),
        primaryColor: z.string().max(7).optional().nullable(),
        secondaryColor: z.string().max(7).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if settings exist
      const existing = await ctx.prisma.systemSettings.findUnique({
        where: { tenantId: ctx.tenantId },
      });

      if (existing) {
        // Update existing settings
        return ctx.prisma.systemSettings.update({
          where: { tenantId: ctx.tenantId },
          data: input,
        });
      } else {
        // Create new settings
        return ctx.prisma.systemSettings.create({
          data: {
            ...input,
            tenantId: ctx.tenantId,
          },
        });
      }
    }),

  // Get company info only (subset of settings)
  getCompanyInfo: tenantProcedure.query(async ({ ctx }) => {
    const settings = await ctx.prisma.systemSettings.findUnique({
      where: { tenantId: ctx.tenantId },
      select: {
        companyName: true,
        companyLogoUrl: true,
        primaryColor: true,
        secondaryColor: true,
      },
    });

    return (
      settings || {
        companyName: null,
        companyLogoUrl: null,
        primaryColor: null,
        secondaryColor: null,
      }
    );
  }),

  // Update company info only
  updateCompanyInfo: tenantProcedure
    .input(
      z.object({
        companyName: z.string().max(255).optional().nullable(),
        companyLogoUrl: z.string().max(500).url().optional().nullable(),
        primaryColor: z.string().max(7).optional().nullable(),
        secondaryColor: z.string().max(7).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if settings exist
      const existing = await ctx.prisma.systemSettings.findUnique({
        where: { tenantId: ctx.tenantId },
      });

      if (existing) {
        // Update existing settings
        return ctx.prisma.systemSettings.update({
          where: { tenantId: ctx.tenantId },
          data: input,
        });
      } else {
        // Create new settings with company info
        return ctx.prisma.systemSettings.create({
          data: {
            ...input,
            tenantId: ctx.tenantId,
          },
        });
      }
    }),

  // Get billing/payment settings only
  getBillingInfo: tenantProcedure.query(async ({ ctx }) => {
    const settings = await ctx.prisma.systemSettings.findUnique({
      where: { tenantId: ctx.tenantId },
      select: {
        stripePublishableKey: true,
        stripeSecretKey: true,
        stripeWebhookSecret: true,
      },
    });

    return (
      settings || {
        stripePublishableKey: null,
        stripeSecretKey: null,
        stripeWebhookSecret: null,
      }
    );
  }),

  // Update billing/payment settings only
  updateBillingInfo: tenantProcedure
    .input(
      z.object({
        stripePublishableKey: z.string().max(500).optional().nullable(),
        stripeSecretKey: z.string().max(500).optional().nullable(),
        stripeWebhookSecret: z.string().max(500).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if settings exist
      const existing = await ctx.prisma.systemSettings.findUnique({
        where: { tenantId: ctx.tenantId },
      });

      if (existing) {
        // Update existing settings
        return ctx.prisma.systemSettings.update({
          where: { tenantId: ctx.tenantId },
          data: input,
        });
      } else {
        // Create new settings with billing info
        return ctx.prisma.systemSettings.create({
          data: {
            ...input,
            tenantId: ctx.tenantId,
          },
        });
      }
    }),
});
