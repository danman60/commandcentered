import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const communicationRouter = router({
  // CommunicationTouchpoint procedures
  listTouchpoints: tenantProcedure
    .input(
      z.object({
        eventId: z.string().uuid().optional(),
        clientId: z.string().uuid().optional(),
        leadId: z.string().uuid().optional(),
        touchpointType: z.enum([
          'INITIAL_CONTACT',
          'PROPOSAL_SENT',
          'CONTRACT_SENT',
          'CONTRACT_SIGNED',
          'QUESTIONNAIRE_SENT',
          'QUESTIONNAIRE_COMPLETED',
          'INVOICE_SENT',
          'INVOICE_PAID',
          'PRE_EVENT_REMINDER',
          'POST_EVENT_FOLLOWUP',
        ]).optional(),
        status: z.enum(['PENDING', 'SCHEDULED', 'COMPLETED', 'SKIPPED']).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.communicationTouchpoint.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.eventId && { eventId: input.eventId }),
          ...(input?.clientId && { clientId: input.clientId }),
          ...(input?.leadId && { leadId: input.leadId }),
          ...(input?.touchpointType && { touchpointType: input.touchpointType }),
          ...(input?.status && { status: input.status }),
        },
        include: {
          event: true,
          client: true,
          lead: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  getTouchpointById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const touchpoint = await ctx.prisma.communicationTouchpoint.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: {
          event: true,
          client: true,
          lead: true,
        },
      });
      if (!touchpoint) throw new Error('Communication touchpoint not found');
      return touchpoint;
    }),

  createTouchpoint: tenantProcedure
    .input(
      z.object({
        eventId: z.string().uuid().optional(),
        clientId: z.string().uuid().optional(),
        leadId: z.string().uuid().optional(),
        touchpointType: z.enum([
          'INITIAL_CONTACT',
          'PROPOSAL_SENT',
          'CONTRACT_SENT',
          'CONTRACT_SIGNED',
          'QUESTIONNAIRE_SENT',
          'QUESTIONNAIRE_COMPLETED',
          'INVOICE_SENT',
          'INVOICE_PAID',
          'PRE_EVENT_REMINDER',
          'POST_EVENT_FOLLOWUP',
        ]),
        status: z.enum(['PENDING', 'SCHEDULED', 'COMPLETED', 'SKIPPED']).optional(),
        completedAt: z.date().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate that at least one of eventId, clientId, or leadId is provided
      if (!input.eventId && !input.clientId && !input.leadId) {
        throw new Error('At least one of eventId, clientId, or leadId must be provided');
      }

      // Validate referenced entities exist and belong to tenant
      if (input.eventId) {
        const event = await ctx.prisma.event.findFirst({
          where: { id: input.eventId, tenantId: ctx.tenantId }
        });
        if (!event) throw new Error('Event not found');
      }

      if (input.clientId) {
        const client = await ctx.prisma.client.findFirst({
          where: { id: input.clientId, tenantId: ctx.tenantId }
        });
        if (!client) throw new Error('Client not found');
      }

      if (input.leadId) {
        const lead = await ctx.prisma.lead.findFirst({
          where: { id: input.leadId, tenantId: ctx.tenantId }
        });
        if (!lead) throw new Error('Lead not found');
      }

      return ctx.prisma.communicationTouchpoint.create({
        data: {
          tenantId: ctx.tenantId,
          eventId: input.eventId,
          clientId: input.clientId,
          leadId: input.leadId,
          touchpointType: input.touchpointType,
          status: input.status || 'PENDING',
          completedAt: input.completedAt,
          notes: input.notes,
        },
        include: {
          event: true,
          client: true,
          lead: true,
        },
      });
    }),

  updateTouchpoint: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum(['PENDING', 'SCHEDULED', 'COMPLETED', 'SKIPPED']).optional(),
        completedAt: z.date().optional().nullable(),
        notes: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const touchpoint = await ctx.prisma.communicationTouchpoint.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId }
      });
      if (!touchpoint) throw new Error('Communication touchpoint not found');

      const { id, ...updateData } = input;
      return ctx.prisma.communicationTouchpoint.update({
        where: { id },
        data: updateData,
        include: {
          event: true,
          client: true,
          lead: true,
        },
      });
    }),

  // AutomatedEmailConfig procedures
  listEmailConfigs: tenantProcedure
    .input(
      z.object({
        emailType: z.enum([
          'SHOW_PROGRAM_REMINDER',
          'REBOOKING_FOLLOWUP',
          'CONTRACT_REMINDER',
          'QUESTIONNAIRE_REMINDER',
          'PAYMENT_REMINDER',
          'DELIVERY_NOTIFICATION',
          'THANK_YOU_FEEDBACK',
        ]).optional(),
        isActive: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.automatedEmailConfig.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.emailType && { emailType: input.emailType }),
          ...(input?.isActive !== undefined && { isActive: input.isActive }),
        },
        orderBy: { emailType: 'asc' },
      });
    }),

  getEmailConfig: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const config = await ctx.prisma.automatedEmailConfig.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!config) throw new Error('Email config not found');
      return config;
    }),

  createEmailConfig: tenantProcedure
    .input(
      z.object({
        emailType: z.enum([
          'SHOW_PROGRAM_REMINDER',
          'REBOOKING_FOLLOWUP',
          'CONTRACT_REMINDER',
          'QUESTIONNAIRE_REMINDER',
          'PAYMENT_REMINDER',
          'DELIVERY_NOTIFICATION',
          'THANK_YOU_FEEDBACK',
        ]),
        subject: z.string().max(255),
        bodyTemplate: z.string(),
        isActive: z.boolean().optional(),
        sendDelay: z.number().int().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if config already exists for this email type
      const existing = await ctx.prisma.automatedEmailConfig.findFirst({
        where: {
          tenantId: ctx.tenantId,
          emailType: input.emailType,
        },
      });

      if (existing) {
        throw new Error(`Email config for type ${input.emailType} already exists`);
      }

      return ctx.prisma.automatedEmailConfig.create({
        data: {
          tenantId: ctx.tenantId,
          emailType: input.emailType,
          subject: input.subject,
          bodyTemplate: input.bodyTemplate,
          isActive: input.isActive ?? true,
          sendDelay: input.sendDelay,
        },
      });
    }),

  updateEmailConfig: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        subject: z.string().max(255).optional(),
        bodyTemplate: z.string().optional(),
        isActive: z.boolean().optional(),
        sendDelay: z.number().int().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const config = await ctx.prisma.automatedEmailConfig.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId }
      });
      if (!config) throw new Error('Email config not found');

      const { id, ...updateData } = input;
      return ctx.prisma.automatedEmailConfig.update({
        where: { id },
        data: updateData,
      });
    }),
});
