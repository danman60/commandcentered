import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

/**
 * Proposal Router - 7 procedures
 *
 * Manages proposals (quotes for leads):
 * - Create/update/list proposals
 * - Update proposal status (submitted/reviewing/accepted/rejected)
 * - Convert accepted proposals to contracts
 * - Manage proposal line items
 */

// Proposal Status Enum (matches schema.prisma:1352-1360)
const ProposalStatusEnum = z.enum(['SUBMITTED', 'REVIEWING', 'ACCEPTED', 'REJECTED']);

export const proposalRouter = router({
  /**
   * List all proposals for tenant
   */
  list: tenantProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          status: ProposalStatusEnum.optional(),
          leadId: z.string().uuid().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.proposal.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.status && { status: input.status }),
          ...(input?.leadId && { leadId: input.leadId }),
          ...(input?.search && {
            OR: [
              { lead: { organization: { contains: input.search, mode: 'insensitive' } } },
              { lead: { contactName: { contains: input.search, mode: 'insensitive' } } },
              { eventVenue: { contains: input.search, mode: 'insensitive' } },
            ],
          }),
        },
        include: {
          lead: {
            select: {
              id: true,
              organization: true,
              contactName: true,
              email: true,
            },
          },
          template: {
            select: {
              id: true,
              name: true,
              serviceType: true,
            },
          },
          _count: {
            select: {
              lineItems: true,
              contracts: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  /**
   * Get proposal by ID
   */
  getById: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.proposal.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
        include: {
          lead: true,
          template: true,
          lineItems: {
            orderBy: { createdAt: 'asc' },
          },
          contracts: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }),

  /**
   * Create new proposal
   */
  create: tenantProcedure
    .input(
      z.object({
        leadId: z.string().uuid().optional(),
        templateId: z.string().uuid(),
        selectionsJson: z.record(z.string(), z.any()).optional(),
        eventDate: z.date().optional(),
        eventStartTime: z.string().optional(), // Time string (HH:MM:SS)
        eventVenue: z.string().optional(),
        eventNotes: z.string().optional(),
        subtotalAmount: z.number().default(0),
        discountAmount: z.number().default(0),
        totalAmount: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify template belongs to tenant
      const template = await ctx.prisma.proposalTemplate.findFirst({
        where: {
          id: input.templateId,
          tenantId: ctx.tenantId,
        },
      });

      if (!template) {
        throw new Error('Proposal template not found');
      }

      // If leadId provided, verify it belongs to tenant
      if (input.leadId) {
        const lead = await ctx.prisma.lead.findFirst({
          where: {
            id: input.leadId,
            tenantId: ctx.tenantId,
          },
        });

        if (!lead) {
          throw new Error('Lead not found');
        }
      }

      // Convert time string to DateTime for Prisma
      let eventStartTime: Date | undefined;
      if (input.eventStartTime) {
        const [hours, minutes, seconds] = input.eventStartTime.split(':').map(Number);
        eventStartTime = new Date();
        eventStartTime.setHours(hours, minutes, seconds || 0);
      }

      return ctx.prisma.proposal.create({
        data: {
          tenantId: ctx.tenantId,
          leadId: input.leadId,
          templateId: input.templateId,
          selectionsJson: input.selectionsJson || {},
          eventDate: input.eventDate,
          eventStartTime,
          eventVenue: input.eventVenue,
          eventNotes: input.eventNotes,
          subtotalAmount: input.subtotalAmount,
          discountAmount: input.discountAmount,
          totalAmount: input.totalAmount,
          status: 'SUBMITTED',
        },
        include: {
          lead: true,
          template: true,
        },
      });
    }),

  /**
   * Update proposal
   */
  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        selectionsJson: z.record(z.string(), z.any()).optional(),
        eventDate: z.date().optional(),
        eventStartTime: z.string().optional(),
        eventVenue: z.string().optional(),
        eventNotes: z.string().optional(),
        subtotalAmount: z.number().optional(),
        discountAmount: z.number().optional(),
        totalAmount: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, eventStartTime, ...restData } = input;

      // Verify proposal belongs to tenant
      const proposal = await ctx.prisma.proposal.findFirst({
        where: {
          id,
          tenantId: ctx.tenantId,
        },
      });

      if (!proposal) {
        throw new Error('Proposal not found');
      }

      // Convert time string to DateTime for Prisma
      let eventStartTimeDate: Date | undefined;
      if (eventStartTime) {
        const [hours, minutes, seconds] = eventStartTime.split(':').map(Number);
        eventStartTimeDate = new Date();
        eventStartTimeDate.setHours(hours, minutes, seconds || 0);
      }

      return ctx.prisma.proposal.update({
        where: { id },
        data: {
          ...restData,
          ...(eventStartTimeDate && { eventStartTime: eventStartTimeDate }),
        },
      });
    }),

  /**
   * Update proposal status
   */
  updateStatus: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: ProposalStatusEnum,
        reviewNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify proposal belongs to tenant
      const proposal = await ctx.prisma.proposal.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });

      if (!proposal) {
        throw new Error('Proposal not found');
      }

      const updateData: any = { status: input.status };

      // Set reviewedAt and reviewedBy when status changes
      if (input.status !== 'SUBMITTED' && proposal.status === 'SUBMITTED') {
        updateData.reviewedAt = new Date();
        updateData.reviewedBy = ctx.user?.id; // From tRPC context
        updateData.reviewNotes = input.reviewNotes;
      }

      return ctx.prisma.proposal.update({
        where: { id: input.id },
        data: updateData,
      });
    }),

  /**
   * Add line item to proposal
   */
  addLineItem: tenantProcedure
    .input(
      z.object({
        proposalId: z.string().uuid(),
        serviceName: z.string().min(1),
        serviceDescription: z.string().optional(),
        quantity: z.number().int().min(1).default(1),
        unitPrice: z.number(),
        totalPrice: z.number(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { proposalId, ...lineItemData } = input;

      // Verify proposal belongs to tenant
      const proposal = await ctx.prisma.proposal.findFirst({
        where: {
          id: proposalId,
          tenantId: ctx.tenantId,
        },
      });

      if (!proposal) {
        throw new Error('Proposal not found');
      }

      return ctx.prisma.proposalLineItem.create({
        data: {
          proposalId,
          tenantId: ctx.tenantId,
          ...lineItemData,
        },
      });
    }),

  /**
   * Convert accepted proposal to contract
   */
  convertToContract: tenantProcedure
    .input(
      z.object({
        proposalId: z.string().uuid(),
        contractNumber: z.string().min(1),
        contractText: z.string().min(1),
        clientId: z.string().uuid().optional(),
        depositAmount: z.number().optional(),
        paymentTerms: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify proposal is accepted and belongs to tenant
      const proposal = await ctx.prisma.proposal.findFirst({
        where: {
          id: input.proposalId,
          tenantId: ctx.tenantId,
        },
      });

      if (!proposal) {
        throw new Error('Proposal not found');
      }

      if (proposal.status !== 'ACCEPTED') {
        throw new Error('Only accepted proposals can be converted to contracts');
      }

      // Create contract from proposal
      return ctx.prisma.contract.create({
        data: {
          tenantId: ctx.tenantId,
          proposalId: input.proposalId,
          leadId: proposal.leadId,
          clientId: input.clientId,
          contractNumber: input.contractNumber,
          contractText: input.contractText,
          totalAmount: Number(proposal.totalAmount),
          depositAmount: input.depositAmount,
          paymentTerms: input.paymentTerms,
          status: 'DRAFT',
        },
        include: {
          proposal: {
            include: {
              lineItems: true,
            },
          },
          client: true,
          lead: true,
        },
      });
    }),
});
