import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const serviceTemplateRouter = router({
  // List all service templates for current tenant
  list: tenantProcedure
    .input(
      z.object({
        includeInactive: z.boolean().optional().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.serviceTemplate.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input.includeInactive ? {} : { isActive: true }),
        },
        orderBy: [{ name: 'asc' }],
      });
    }),

  // Get single service template by ID
  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.serviceTemplate.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });
    }),

  // Create new service template
  create: tenantProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional().nullable(),
        defaultDurationHours: z.number().int().positive(),
        defaultPrice: z.number().positive(),
        defaultOperatorCount: z.number().int().positive(),
        deliverableTypes: z.array(z.string()),
        eventType: z.string().max(100).optional().nullable(),
        isActive: z.boolean().optional().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.serviceTemplate.create({
        data: {
          ...input,
          tenantId: ctx.tenantId,
        },
      });
    }),

  // Update existing service template
  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional().nullable(),
        defaultDurationHours: z.number().int().positive().optional(),
        defaultPrice: z.number().positive().optional(),
        defaultOperatorCount: z.number().int().positive().optional(),
        deliverableTypes: z.array(z.string()).optional(),
        eventType: z.string().max(100).optional().nullable(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify template belongs to tenant
      const existing = await ctx.prisma.serviceTemplate.findFirst({
        where: { id, tenantId: ctx.tenantId },
      });

      if (!existing) {
        throw new Error('Service template not found');
      }

      return ctx.prisma.serviceTemplate.update({
        where: { id },
        data,
      });
    }),

  // Soft delete (mark inactive)
  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify template belongs to tenant
      const existing = await ctx.prisma.serviceTemplate.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });

      if (!existing) {
        throw new Error('Service template not found');
      }

      return ctx.prisma.serviceTemplate.update({
        where: { id: input.id },
        data: { isActive: false },
      });
    }),

  // Restore (mark active)
  restore: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify template belongs to tenant
      const existing = await ctx.prisma.serviceTemplate.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });

      if (!existing) {
        throw new Error('Service template not found');
      }

      return ctx.prisma.serviceTemplate.update({
        where: { id: input.id },
        data: { isActive: true },
      });
    }),
});
