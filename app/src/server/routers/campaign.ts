import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

/**
 * Campaign Router - Phase 13
 *
 * Manages email marketing campaigns:
 * - Create/update/list campaigns
 * - Manage campaign steps (email sequence)
 * - Add/remove leads from campaigns
 * - Track email events (sent, opened, replied)
 * - Campaign status management
 */

const CampaignStatusEnum = z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED']);
const CampaignLeadStatusEnum = z.enum(['PENDING', 'SENT', 'OPENED', 'REPLIED', 'UNSUBSCRIBED']);

export const campaignRouter = router({
  /**
   * List all campaigns for tenant
   */
  list: tenantProcedure
    .input(
      z
        .object({
          status: CampaignStatusEnum.optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.campaign.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.status && { status: input.status }),
          ...(input?.search && {
            name: { contains: input.search, mode: 'insensitive' },
          }),
        },
        include: {
          _count: {
            select: {
              steps: true,
              campaignLeads: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  /**
   * Get campaign by ID with details
   */
  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.campaign.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
        include: {
          steps: {
            orderBy: { stepNumber: 'asc' },
          },
          campaignLeads: {
            include: {
              lead: {
                select: {
                  id: true,
                  organization: true,
                  contactName: true,
                  email: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }),

  /**
   * Create new campaign
   */
  create: tenantProcedure
    .input(
      z.object({
        name: z.string().min(1),
        status: CampaignStatusEnum.default('DRAFT'),
        steps: z
          .array(
            z.object({
              stepNumber: z.number().int().min(1),
              stepName: z.string().min(1),
              subject: z.string().min(1),
              bodyTemplate: z.string().min(1),
              delayDays: z.number().int().min(0).default(0),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { steps, ...campaignData } = input;

      return ctx.prisma.campaign.create({
        data: {
          tenantId: ctx.tenantId,
          ...campaignData,
          ...(steps && {
            steps: {
              create: steps.map((step) => ({
                tenantId: ctx.tenantId,
                ...step,
              })),
            },
          }),
        },
        include: {
          steps: true,
        },
      });
    }),

  /**
   * Update campaign
   */
  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        status: CampaignStatusEnum.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Verify campaign belongs to tenant
      const campaign = await ctx.prisma.campaign.findFirst({
        where: { id, tenantId: ctx.tenantId },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      return ctx.prisma.campaign.update({
        where: { id },
        data: updateData,
      });
    }),

  /**
   * Update campaign status (activate, pause, complete)
   */
  updateStatus: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: CampaignStatusEnum,
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify campaign belongs to tenant
      const campaign = await ctx.prisma.campaign.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      return ctx.prisma.campaign.update({
        where: { id: input.id },
        data: {
          status: input.status,
          ...(input.status === 'ACTIVE' && !campaign.lastSentAt && { lastSentAt: new Date() }),
        },
      });
    }),

  /**
   * Add campaign step
   */
  addStep: tenantProcedure
    .input(
      z.object({
        campaignId: z.string().uuid(),
        stepNumber: z.number().int().min(1),
        stepName: z.string().min(1),
        subject: z.string().min(1),
        bodyTemplate: z.string().min(1),
        delayDays: z.number().int().min(0).default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { campaignId, ...stepData } = input;

      // Verify campaign belongs to tenant
      const campaign = await ctx.prisma.campaign.findFirst({
        where: { id: campaignId, tenantId: ctx.tenantId },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      return ctx.prisma.campaignStep.create({
        data: {
          tenantId: ctx.tenantId,
          campaignId,
          ...stepData,
        },
      });
    }),

  /**
   * Update campaign step
   */
  updateStep: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        stepName: z.string().min(1).optional(),
        subject: z.string().min(1).optional(),
        bodyTemplate: z.string().min(1).optional(),
        delayDays: z.number().int().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Verify step belongs to tenant
      const step = await ctx.prisma.campaignStep.findFirst({
        where: { id, tenantId: ctx.tenantId },
      });

      if (!step) {
        throw new Error('Campaign step not found');
      }

      return ctx.prisma.campaignStep.update({
        where: { id },
        data: updateData,
      });
    }),

  /**
   * Add leads to campaign
   */
  addLeads: tenantProcedure
    .input(
      z.object({
        campaignId: z.string().uuid(),
        leadIds: z.array(z.string().uuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify campaign belongs to tenant
      const campaign = await ctx.prisma.campaign.findFirst({
        where: { id: input.campaignId, tenantId: ctx.tenantId },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Verify all leads belong to tenant
      const leads = await ctx.prisma.lead.findMany({
        where: {
          id: { in: input.leadIds },
          tenantId: ctx.tenantId,
        },
      });

      if (leads.length !== input.leadIds.length) {
        throw new Error('Some leads not found or do not belong to this tenant');
      }

      // Create campaign lead records (skip duplicates)
      const createPromises = input.leadIds.map((leadId) =>
        ctx.prisma.campaignLead.upsert({
          where: {
            campaignId_leadId: {
              campaignId: input.campaignId,
              leadId,
            },
          },
          create: {
            tenantId: ctx.tenantId,
            campaignId: input.campaignId,
            leadId,
            status: 'PENDING',
          },
          update: {}, // Do nothing if already exists
        })
      );

      await Promise.all(createPromises);

      // Update campaign total_leads count
      const totalLeads = await ctx.prisma.campaignLead.count({
        where: { campaignId: input.campaignId },
      });

      await ctx.prisma.campaign.update({
        where: { id: input.campaignId },
        data: { totalLeads },
      });

      return { success: true, added: input.leadIds.length };
    }),

  /**
   * Remove leads from campaign
   */
  removeLeads: tenantProcedure
    .input(
      z.object({
        campaignId: z.string().uuid(),
        leadIds: z.array(z.string().uuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify campaign belongs to tenant
      const campaign = await ctx.prisma.campaign.findFirst({
        where: { id: input.campaignId, tenantId: ctx.tenantId },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      await ctx.prisma.campaignLead.deleteMany({
        where: {
          campaignId: input.campaignId,
          leadId: { in: input.leadIds },
          tenantId: ctx.tenantId,
        },
      });

      // Update campaign total_leads count
      const totalLeads = await ctx.prisma.campaignLead.count({
        where: { campaignId: input.campaignId },
      });

      await ctx.prisma.campaign.update({
        where: { id: input.campaignId },
        data: { totalLeads },
      });

      return { success: true, removed: input.leadIds.length };
    }),

  /**
   * Track email event (sent, opened, replied)
   * This would be called by Mailgun webhooks
   */
  trackEmailEvent: tenantProcedure
    .input(
      z.object({
        campaignId: z.string().uuid(),
        leadId: z.string().uuid(),
        event: z.enum(['sent', 'opened', 'replied', 'unsubscribed']),
        timestamp: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const timestamp = input.timestamp || new Date();

      // Find campaign lead record
      const campaignLead = await ctx.prisma.campaignLead.findFirst({
        where: {
          campaignId: input.campaignId,
          leadId: input.leadId,
          tenantId: ctx.tenantId,
        },
      });

      if (!campaignLead) {
        throw new Error('Campaign lead not found');
      }

      // Update campaign lead based on event
      const updates: any = {};

      switch (input.event) {
        case 'sent':
          updates.status = 'SENT';
          updates.lastSentAt = timestamp;
          break;
        case 'opened':
          updates.status = 'OPENED';
          updates.lastOpenedAt = timestamp;
          break;
        case 'replied':
          updates.status = 'REPLIED';
          updates.repliedAt = timestamp;
          break;
        case 'unsubscribed':
          updates.status = 'UNSUBSCRIBED';
          updates.unsubscribedAt = timestamp;
          break;
      }

      await ctx.prisma.campaignLead.update({
        where: { id: campaignLead.id },
        data: updates,
      });

      // Update campaign counters
      const counts = await ctx.prisma.campaignLead.groupBy({
        by: ['status'],
        where: { campaignId: input.campaignId },
        _count: true,
      });

      const sentCount = counts.find((c) => c.status === 'SENT')?._count || 0;
      const openedCount = counts.find((c) => c.status === 'OPENED')?._count || 0;
      const repliedCount = counts.find((c) => c.status === 'REPLIED')?._count || 0;

      await ctx.prisma.campaign.update({
        where: { id: input.campaignId },
        data: {
          sentCount: sentCount + openedCount + repliedCount, // Total sent includes opened and replied
          openedCount: openedCount + repliedCount, // Total opened includes replied
          repliedCount,
          lastSentAt: input.event === 'sent' ? timestamp : undefined,
        },
      });

      return { success: true };
    }),

  /**
   * Delete campaign
   */
  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify campaign belongs to tenant
      const campaign = await ctx.prisma.campaign.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      await ctx.prisma.campaign.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
