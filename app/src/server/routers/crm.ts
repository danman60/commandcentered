import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

/**
 * CRM Router
 *
 * Manages CRM interactions for tracking client communications
 */
export const crmRouter = router({
  /**
   * Create a new interaction log
   */
  logInteraction: tenantProcedure
    .input(
      z.object({
        organizationId: z.string().uuid(),
        contactId: z.string().uuid().optional(),
        interactionType: z.string(),
        subject: z.string().optional(),
        notes: z.string().optional(),
        outcome: z.string().optional(),
        requiresFollowUp: z.boolean().optional(),
        followUpDate: z.date().optional(),
        followUpNotes: z.string().optional(),
        interactionDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify organization belongs to tenant
      const organization = await ctx.prisma.crmOrganization.findFirst({
        where: {
          id: input.organizationId,
          tenantId: ctx.tenantId,
        },
      });

      if (!organization) {
        throw new Error('Organization not found');
      }

      // If contactId provided, verify it belongs to the organization
      if (input.contactId) {
        const contact = await ctx.prisma.crmContact.findFirst({
          where: {
            id: input.contactId,
            organizationId: input.organizationId,
            tenantId: ctx.tenantId,
          },
        });

        if (!contact) {
          throw new Error('Contact not found');
        }
      }

      return ctx.prisma.crmInteraction.create({
        data: {
          tenantId: ctx.tenantId,
          organizationId: input.organizationId,
          contactId: input.contactId,
          interactionType: input.interactionType,
          subject: input.subject,
          notes: input.notes,
          outcome: input.outcome,
          requiresFollowUp: input.requiresFollowUp || false,
          followUpDate: input.followUpDate,
          followUpNotes: input.followUpNotes,
          interactionDate: input.interactionDate || new Date(),
        },
      });
    }),

  /**
   * Get interactions for an organization
   */
  getInteractions: tenantProcedure
    .input(
      z.object({
        organizationId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.crmInteraction.findMany({
        where: {
          organizationId: input.organizationId,
          tenantId: ctx.tenantId,
        },
        include: {
          contact: true,
        },
        orderBy: {
          interactionDate: 'desc',
        },
      });
    }),

  /**
   * Get latest interaction for an organization
   */
  getLatestInteraction: tenantProcedure
    .input(
      z.object({
        organizationId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.crmInteraction.findFirst({
        where: {
          organizationId: input.organizationId,
          tenantId: ctx.tenantId,
        },
        orderBy: {
          interactionDate: 'desc',
        },
        include: {
          contact: true,
        },
      });
    }),
});
