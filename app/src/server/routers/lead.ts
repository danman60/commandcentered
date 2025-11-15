import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const leadRouter = router({
  list: tenantProcedure
    .input(
      z
        .object({
          status: z.enum(['HOT', 'WARM', 'COLD']).optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.lead.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.status && { leadStatus: input.status }),
          ...(input?.search && { companyName: { contains: input.search, mode: 'insensitive' } }),
        },
        include: {
          products: true,
          touchpoints: true,
        },
        orderBy: { lastContactedAt: 'desc' },
      });
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.lead.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: {
          products: true,
          touchpoints: { orderBy: { touchpointDate: 'desc' } },
        },
      });
    }),

  create: tenantProcedure
    .input(
      z.object({
        companyName: z.string().min(1),
        contactName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        leadStatus: z.enum(['HOT', 'WARM', 'COLD']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.lead.create({
        data: { tenantId: ctx.tenantId, leadStatus: 'WARM', lastContactedAt: new Date(), ...input },
      });
    }),

  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        companyName: z.string().min(1).optional(),
        contactName: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        leadStatus: z.enum(['HOT', 'WARM', 'COLD']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const lead = await ctx.prisma.lead.findFirst({ where: { id, tenantId: ctx.tenantId } });
      if (!lead) throw new Error('Lead not found');
      return ctx.prisma.lead.update({ where: { id }, data });
    }),

  updateProduct: tenantProcedure
    .input(
      z.object({
        leadId: z.string().uuid(),
        productName: z.string(),
        isInterested: z.boolean(),
        status: z.enum(['NOT_INTERESTED', 'DISCUSSING', 'PROPOSAL', 'WON', 'LOST']),
        revenueAmount: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.findFirst({ where: { id: input.leadId, tenantId: ctx.tenantId } });
      if (!lead) throw new Error('Lead not found');

      return ctx.prisma.leadProduct.upsert({
        where: { leadId_productName: { leadId: input.leadId, productName: input.productName } },
        create: {
          leadId: input.leadId,
          tenantId: ctx.tenantId,
          productName: input.productName,
          isInterested: input.isInterested,
          status: input.status,
          revenueAmount: input.revenueAmount,
          notes: input.notes,
        },
        update: {
          isInterested: input.isInterested,
          status: input.status,
          revenueAmount: input.revenueAmount,
          notes: input.notes,
        },
      });
    }),

  logTouchpoint: tenantProcedure
    .input(
      z.object({
        leadId: z.string().uuid(),
        touchpointType: z.enum([
          'INITIAL_CONTACT',
          'PROPOSAL_SENT',
          'CONTRACT_SENT',
          'QUESTIONNAIRE_SENT',
          'INVOICE_SENT',
          'PRE_EVENT_REMINDER',
          'POST_EVENT_FOLLOWUP',
          'REBOOKING_OUTREACH',
        ]),
        notes: z.string().optional(),
        completedAt: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.findFirst({ where: { id: input.leadId, tenantId: ctx.tenantId } });
      if (!lead) throw new Error('Lead not found');

      return ctx.prisma.communicationTouchpoint.create({
        data: {
          leadId: input.leadId,
          tenantId: ctx.tenantId,
          touchpointType: input.touchpointType,
          status: 'COMPLETED',
          completedAt: input.completedAt || new Date(),
          notes: input.notes,
        },
      });
    }),

  getTouchpoints: tenantProcedure
    .input(z.object({ leadId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.communicationTouchpoint.findMany({
        where: { leadId: input.leadId, tenantId: ctx.tenantId },
        orderBy: { createdAt: 'desc' },
      });
    }),
});
