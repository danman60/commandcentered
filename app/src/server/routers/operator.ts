import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

/**
 * Operator Router - 6 procedures
 *
 * Manages operators (freelance videographers/crew):
 * - Create/update/list operators
 * - Manage availability
 * - Track skills and equipment
 */
export const operatorRouter = router({
  /**
   * List all operators for tenant
   */
  list: tenantProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          role: z.string().optional(),
          available: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.operator.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.search && {
            OR: [
              { name: { contains: input.search, mode: 'insensitive' } },
              { email: { contains: input.search, mode: 'insensitive' } },
            ],
          }),
          ...(input?.role && { primaryRole: input.role }),
        },
        include: {
          skills: true,
          availability: true,
          _count: {
            select: {
              shiftAssignments: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });
    }),

  /**
   * Get operator by ID
   */
  getById: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.operator.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
        include: {
          skills: true,
          availability: true,
          shiftAssignments: {
            include: {
              shift: {
                include: {
                  event: true,
                },
              },
            },
            orderBy: {
              shift: {
                startTime: 'desc',
              },
            },
            take: 10, // Last 10 shifts
          },
          _count: {
            select: {
              shiftAssignments: true,
            },
          },
        },
      });
    }),

  /**
   * Create new operator
   */
  create: tenantProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        primaryRole: z.string().optional(),
        hourlyRate: z.number(),
        bio: z.string().optional(),
        portfolioUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.operator.create({
        data: {
          tenantId: ctx.tenantId,
          ...input,
        },
      });
    }),

  /**
   * Update operator
   */
  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        primaryRole: z.string().optional(),
        hourlyRate: z.number().optional(),
        bio: z.string().optional(),
        portfolioUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify operator belongs to tenant
      const operator = await ctx.prisma.operator.findFirst({
        where: {
          id,
          tenantId: ctx.tenantId,
        },
      });

      if (!operator) {
        throw new Error('Operator not found');
      }

      return ctx.prisma.operator.update({
        where: { id },
        data,
      });
    }),

  /**
   * Set operator availability for date range
   */
  setAvailability: tenantProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
        date: z.date(),
        availableType: z.enum(['AVAILABLE', 'UNAVAILABLE', 'PARTIAL']),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify operator belongs to tenant
      const operator = await ctx.prisma.operator.findFirst({
        where: {
          id: input.operatorId,
          tenantId: ctx.tenantId,
        },
      });

      if (!operator) {
        throw new Error('Operator not found');
      }

      return ctx.prisma.operatorAvailability.create({
        data: {
          tenantId: ctx.tenantId,
          operatorId: input.operatorId,
          date: input.date,
          availableType: input.availableType,
          startTime: input.startTime,
          endTime: input.endTime,
          notes: input.notes,
        },
      });
    }),

  /**
   * Get operator availability for date range
   */
  getAvailability: tenantProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
        date: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.operatorAvailability.findMany({
        where: {
          operatorId: input.operatorId,
          operator: { tenantId: ctx.tenantId },
          date: input.date,
        },
        orderBy: { date: 'asc' },
      });
    }),
});
