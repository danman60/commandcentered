import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

/**
 * Client Router - 8 procedures
 *
 * Manages clients (converted from leads):
 * - Create/update/list/delete clients
 * - Search and filter clients
 * - Get events by client
 * - Update client status
 */
export const clientRouter = router({
  /**
   * List all clients for tenant
   */
  list: tenantProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          status: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.client.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.search && {
            OR: [
              { organization: { contains: input.search, mode: 'insensitive' } },
              { contactName: { contains: input.search, mode: 'insensitive' } },
              { email: { contains: input.search, mode: 'insensitive' } },
            ],
          }),
        },
        include: {
          lead: true,
          _count: {
            select: {
              contracts: true,
            },
          },
        },
        orderBy: { organization: 'asc' },
      });
    }),

  /**
   * Get client by ID
   */
  getById: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.client.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
        include: {
          lead: true,
          contracts: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          _count: {
            select: {
              contracts: true,
            },
          },
        },
      });
    }),

  /**
   * Create new client
   */
  create: tenantProcedure
    .input(
      z.object({
        leadId: z.string().uuid().optional(),
        organization: z.string().min(1),
        contactName: z.string().optional(),
        email: z.string().email(),
        phone: z.string().optional(),
        website: z.string().url().optional().or(z.literal('')),
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        industry: z.string().optional(),
        size: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.client.create({
        data: {
          tenantId: ctx.tenantId,
          ...input,
        },
      });
    }),

  /**
   * Update client
   */
  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        organization: z.string().min(1).optional(),
        contactName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        website: z.string().url().optional().or(z.literal('')),
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        industry: z.string().optional(),
        size: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify client belongs to tenant
      const client = await ctx.prisma.client.findFirst({
        where: {
          id,
          tenantId: ctx.tenantId,
        },
      });

      if (!client) {
        throw new Error('Client not found');
      }

      return ctx.prisma.client.update({
        where: { id },
        data,
      });
    }),

  /**
   * Delete client (soft delete by removing sensitive data or hard delete)
   */
  delete: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify client belongs to tenant
      const client = await ctx.prisma.client.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });

      if (!client) {
        throw new Error('Client not found');
      }

      // Hard delete - check if they have contracts first
      const contractCount = await ctx.prisma.contract.count({
        where: { clientId: input.id },
      });

      if (contractCount > 0) {
        throw new Error(
          'Cannot delete client with existing contracts. Archive them instead.'
        );
      }

      return ctx.prisma.client.delete({
        where: { id: input.id },
      });
    }),

  /**
   * Search clients
   */
  search: tenantProcedure
    .input(
      z.object({
        query: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.client.findMany({
        where: {
          tenantId: ctx.tenantId,
          OR: [
            { organization: { contains: input.query, mode: 'insensitive' } },
            { contactName: { contains: input.query, mode: 'insensitive' } },
            { email: { contains: input.query, mode: 'insensitive' } },
          ],
        },
        include: {
          _count: {
            select: {
              contracts: true,
            },
          },
        },
        orderBy: { organization: 'asc' },
        take: 20,
      });
    }),

  /**
   * Get events associated with client (via clientId field on Event)
   */
  getEvents: tenantProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify client belongs to tenant
      const client = await ctx.prisma.client.findFirst({
        where: {
          id: input.clientId,
          tenantId: ctx.tenantId,
        },
      });

      if (!client) {
        throw new Error('Client not found');
      }

      // Get events where clientId matches
      return ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          clientId: input.clientId,
        },
        orderBy: { loadInTime: 'desc' },
        include: {
          shifts: {
            include: {
              _count: {
                select: {
                  shiftAssignments: true,
                },
              },
            },
          },
        },
      });
    }),

  /**
   * Get contracts for client
   */
  getContracts: tenantProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify client belongs to tenant
      const client = await ctx.prisma.client.findFirst({
        where: {
          id: input.clientId,
          tenantId: ctx.tenantId,
        },
      });

      if (!client) {
        throw new Error('Client not found');
      }

      return ctx.prisma.contract.findMany({
        where: {
          clientId: input.clientId,
        },
        orderBy: { createdAt: 'desc' },
      });
    }),
});
