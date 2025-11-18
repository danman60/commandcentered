import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

/**
 * Contract Router - 6 procedures
 *
 * Manages contracts (generated from proposals):
 * - Create/update/list contracts
 * - Update contract status (draft/sent/signed/cancelled)
 * - Link to proposals, leads, clients
 */

// Contract Status Enum (matches schema.prisma:1435-1443)
const ContractStatusEnum = z.enum(['DRAFT', 'SENT', 'SIGNED', 'CANCELLED']);

export const contractRouter = router({
  /**
   * List all contracts for tenant
   */
  list: tenantProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          status: ContractStatusEnum.optional(),
          clientId: z.string().uuid().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.contract.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.status && { status: input.status }),
          ...(input?.clientId && { clientId: input.clientId }),
          ...(input?.search && {
            OR: [
              { contractNumber: { contains: input.search, mode: 'insensitive' } },
              { client: { organization: { contains: input.search, mode: 'insensitive' } } },
              { lead: { organization: { contains: input.search, mode: 'insensitive' } } },
            ],
          }),
        },
        include: {
          client: {
            select: {
              id: true,
              organization: true,
              contactName: true,
              email: true,
            },
          },
          lead: {
            select: {
              id: true,
              organization: true,
              contactName: true,
            },
          },
          proposal: {
            select: {
              id: true,
              status: true,
            },
          },
          _count: {
            select: {
              signatures: true,
              invoices: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  /**
   * Get contract by ID
   */
  getById: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.contract.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
        include: {
          client: true,
          lead: true,
          proposal: {
            include: {
              lineItems: true,
            },
          },
          signatures: {
            orderBy: { createdAt: 'desc' },
          },
          invoices: {
            orderBy: { createdAt: 'desc' },
          },
          paymentSchedules: {
            orderBy: { dueDate: 'asc' },
          },
        },
      });
    }),

  /**
   * Create new contract from proposal
   */
  create: tenantProcedure
    .input(
      z.object({
        proposalId: z.string().uuid(),
        clientId: z.string().uuid().optional(),
        leadId: z.string().uuid().optional(),
        contractNumber: z.string().min(1),
        contractText: z.string().min(1),
        contractPdfUrl: z.string().url().optional(),
        totalAmount: z.number(),
        depositAmount: z.number().optional(),
        paymentTerms: z.string().optional(),
        eventId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify proposal belongs to tenant
      const proposal = await ctx.prisma.proposal.findFirst({
        where: {
          id: input.proposalId,
          tenantId: ctx.tenantId,
        },
      });

      if (!proposal) {
        throw new Error('Proposal not found');
      }

      return ctx.prisma.contract.create({
        data: {
          tenantId: ctx.tenantId,
          proposalId: input.proposalId,
          clientId: input.clientId,
          leadId: input.leadId,
          contractNumber: input.contractNumber,
          contractText: input.contractText,
          contractPdfUrl: input.contractPdfUrl,
          totalAmount: input.totalAmount,
          depositAmount: input.depositAmount,
          paymentTerms: input.paymentTerms,
          eventId: input.eventId,
          status: 'DRAFT',
        },
        include: {
          client: true,
          lead: true,
          proposal: true,
        },
      });
    }),

  /**
   * Update contract
   */
  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        contractText: z.string().optional(),
        contractPdfUrl: z.string().url().optional(),
        totalAmount: z.number().optional(),
        depositAmount: z.number().optional(),
        paymentTerms: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify contract belongs to tenant
      const contract = await ctx.prisma.contract.findFirst({
        where: {
          id,
          tenantId: ctx.tenantId,
        },
      });

      if (!contract) {
        throw new Error('Contract not found');
      }

      return ctx.prisma.contract.update({
        where: { id },
        data,
      });
    }),

  /**
   * Update contract status
   */
  updateStatus: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: ContractStatusEnum,
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify contract belongs to tenant
      const contract = await ctx.prisma.contract.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });

      if (!contract) {
        throw new Error('Contract not found');
      }

      const updateData: any = { status: input.status };

      // Set sentAt timestamp when status changes to SENT
      if (input.status === 'SENT' && contract.status !== 'SENT') {
        updateData.sentAt = new Date();
      }

      // Set signedAt timestamp when status changes to SIGNED
      if (input.status === 'SIGNED' && contract.status !== 'SIGNED') {
        updateData.signedAt = new Date();
      }

      return ctx.prisma.contract.update({
        where: { id: input.id },
        data: updateData,
      });
    }),

  /**
   * Delete contract (soft delete by setting status to CANCELLED)
   */
  delete: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify contract belongs to tenant
      const contract = await ctx.prisma.contract.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });

      if (!contract) {
        throw new Error('Contract not found');
      }

      // Soft delete by updating status to CANCELLED
      return ctx.prisma.contract.update({
        where: { id: input.id },
        data: { status: 'CANCELLED' },
      });
    }),
});
