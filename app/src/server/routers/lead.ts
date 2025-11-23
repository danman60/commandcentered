import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const leadRouter = router({
  list: tenantProcedure
    .input(
      z
        .object({
          status: z
            .enum([
              'NEW',
              'CONTACTED',
              'QUALIFIED',
              'PROPOSAL_SENT',
              'PROPOSAL_VIEWED',
              'ENGAGED',
              'PROPOSAL_SUBMITTED',
              'CONTRACT_SENT',
              'CONVERTED',
              'LOST',
            ])
            .optional(),
          productName: z.string().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.lead.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.status && { status: input.status }),
          ...(input?.productName && {
            leadProducts: {
              some: {
                productName: input.productName,
                isInterested: true,
              },
            },
          }),
          ...(input?.search && {
            OR: [
              { organization: { contains: input.search, mode: 'insensitive' } },
              { contactName: { contains: input.search, mode: 'insensitive' } },
              { email: { contains: input.search, mode: 'insensitive' } },
            ],
          }),
        },
        include: {
          leadProducts: true,
          communicationTouchpoints: {
            orderBy: { createdAt: 'desc' },
            take: 5, // Show last 5 touchpoints
          },
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
          leadProducts: true,
          notes: true,
          communicationTouchpoints: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });
    }),

  create: tenantProcedure
    .input(
      z.object({
        organization: z.string().min(1),
        contactName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        status: z
          .enum([
            'NEW',
            'CONTACTED',
            'QUALIFIED',
            'PROPOSAL_SENT',
            'PROPOSAL_VIEWED',
            'ENGAGED',
            'PROPOSAL_SUBMITTED',
            'CONTRACT_SENT',
            'CONVERTED',
            'LOST',
          ])
          .optional(),
        source: z.string().optional(),
        sourceDetails: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.lead.create({
        data: {
          tenantId: ctx.tenantId,
          status: input.status || 'NEW',
          lastContactedAt: new Date(),
          ...input,
        },
      });
    }),

  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        organization: z.string().min(1).optional(),
        contactName: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        status: z
          .enum([
            'NEW',
            'CONTACTED',
            'QUALIFIED',
            'PROPOSAL_SENT',
            'PROPOSAL_VIEWED',
            'ENGAGED',
            'PROPOSAL_SUBMITTED',
            'CONTRACT_SENT',
            'CONVERTED',
            'LOST',
          ])
          .optional(),
        statusReason: z.string().optional(),
        source: z.string().optional(),
        sourceDetails: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const lead = await ctx.prisma.lead.findFirst({ where: { id, tenantId: ctx.tenantId } });
      if (!lead) throw new Error('Lead not found');
      return ctx.prisma.lead.update({ where: { id }, data });
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!lead) throw new Error('Lead not found');
      return ctx.prisma.lead.update({
        where: { id: input.id },
        data: { status: 'LOST', statusReason: 'Deleted by user' },
      });
    }),

  updateProduct: tenantProcedure
    .input(
      z.object({
        leadId: z.string().uuid(),
        productName: z.string(),
        isInterested: z.boolean(),
        status: z.enum(['NOT_INTERESTED', 'DISCUSSING', 'PROPOSAL', 'WON', 'LOST', 'NOT_APPLICABLE']),
        revenueAmount: z.number().optional(),
        projectedRevenue: z.number().optional(), // Round 7 - Product Pipeline
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
          projectedRevenue: input.projectedRevenue,
          notes: input.notes,
        },
        update: {
          isInterested: input.isInterested,
          status: input.status,
          revenueAmount: input.revenueAmount,
          projectedRevenue: input.projectedRevenue,
          notes: input.notes,
        },
      });
    }),

  getProducts: tenantProcedure
    .input(z.object({ leadId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.findFirst({ where: { id: input.leadId, tenantId: ctx.tenantId } });
      if (!lead) throw new Error('Lead not found');

      return ctx.prisma.leadProduct.findMany({
        where: { leadId: input.leadId, tenantId: ctx.tenantId },
        orderBy: { productName: 'asc' },
      });
    }),

  bulkUpdateProducts: tenantProcedure
    .input(
      z.object({
        leadId: z.string().uuid(),
        products: z.array(
          z.object({
            productName: z.string(),
            isInterested: z.boolean(),
            status: z.enum(['NOT_INTERESTED', 'DISCUSSING', 'PROPOSAL', 'WON', 'LOST', 'NOT_APPLICABLE']),
            revenueAmount: z.number().optional(),
            projectedRevenue: z.number().optional(), // Round 7 - Product Pipeline
            notes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.findFirst({ where: { id: input.leadId, tenantId: ctx.tenantId } });
      if (!lead) throw new Error('Lead not found');

      const updates = input.products.map((product) =>
        ctx.prisma.leadProduct.upsert({
          where: { leadId_productName: { leadId: input.leadId, productName: product.productName } },
          create: {
            leadId: input.leadId,
            tenantId: ctx.tenantId,
            productName: product.productName,
            isInterested: product.isInterested,
            status: product.status,
            revenueAmount: product.revenueAmount,
            projectedRevenue: product.projectedRevenue,
            notes: product.notes,
          },
          update: {
            isInterested: product.isInterested,
            status: product.status,
            revenueAmount: product.revenueAmount,
            projectedRevenue: product.projectedRevenue,
            notes: product.notes,
          },
        })
      );

      return ctx.prisma.$transaction(updates);
    }),

  updateStage: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum([
          'NEW',
          'CONTACTED',
          'QUALIFIED',
          'PROPOSAL_SENT',
          'PROPOSAL_VIEWED',
          'ENGAGED',
          'PROPOSAL_SUBMITTED',
          'CONTRACT_SENT',
          'CONVERTED',
          'LOST',
        ]),
        statusReason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const lead = await ctx.prisma.lead.findFirst({ where: { id, tenantId: ctx.tenantId } });
      if (!lead) throw new Error('Lead not found');
      return ctx.prisma.lead.update({ where: { id }, data });
    }),

  getByStage: tenantProcedure
    .input(
      z.object({
        status: z.enum([
          'NEW',
          'CONTACTED',
          'QUALIFIED',
          'PROPOSAL_SENT',
          'PROPOSAL_VIEWED',
          'ENGAGED',
          'PROPOSAL_SUBMITTED',
          'CONTRACT_SENT',
          'CONVERTED',
          'LOST',
        ]),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.lead.findMany({
        where: {
          tenantId: ctx.tenantId,
          status: input.status,
        },
        include: {
          leadProducts: true,
        },
        orderBy: { lastContactedAt: 'desc' },
      });
    }),

  updateContactInfo: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        lastContactedAt: z.date().optional(),
        nextFollowUpAt: z.date().optional(),
        typeOfContact: z.string().optional(),
        contactFrequency: z.string().optional(),
        temperature: z.enum(['Hot Lead', 'Warm Lead', 'Cold Lead']).optional(), // Round 7 - Product Pipeline
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const lead = await ctx.prisma.lead.findFirst({ where: { id, tenantId: ctx.tenantId } });
      if (!lead) throw new Error('Lead not found');
      return ctx.prisma.lead.update({ where: { id }, data });
    }),

  updateTemperature: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        temperature: z.enum(['Hot Lead', 'Warm Lead', 'Cold Lead']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, temperature } = input;
      const lead = await ctx.prisma.lead.findFirst({ where: { id, tenantId: ctx.tenantId } });
      if (!lead) throw new Error('Lead not found');
      return ctx.prisma.lead.update({
        where: { id },
        data: { temperature },
      });
    }),

  convertToClient: tenantProcedure
    .input(
      z.object({
        leadId: z.string().uuid(),
        clientData: z.object({
          organization: z.string().min(1),
          contactName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.findFirst({ where: { id: input.leadId, tenantId: ctx.tenantId } });
      if (!lead) throw new Error('Lead not found');

      const client = await ctx.prisma.client.create({
        data: {
          tenantId: ctx.tenantId,
          leadId: input.leadId,
          organization: input.clientData.organization,
          contactName: input.clientData.contactName,
          email: input.clientData.email,
          phone: input.clientData.phone,
          status: 'ACTIVE',
        },
      });

      await ctx.prisma.lead.update({
        where: { id: input.leadId },
        data: { status: 'CONVERTED' },
      });

      return client;
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
