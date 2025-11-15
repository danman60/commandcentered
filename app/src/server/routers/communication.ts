import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const communicationRouter = router({
  listTouchpoints: tenantProcedure
    .input(z.object({ clientId: z.string().uuid().optional(), leadId: z.string().uuid().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.communicationTouchpoint.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.clientId && { clientId: input.clientId }),
          ...(input?.leadId && { leadId: input.leadId }),
        },
        include: { client: true, lead: true },
        orderBy: { createdAt: 'desc' },
      });
    }),

  sendEmail: tenantProcedure
    .input(
      z.object({
        to: z.string().email(),
        subject: z.string().min(1),
        body: z.string().min(1),
        clientId: z.string().uuid().optional(),
        leadId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Integrate with Resend email service
      // For now, just log the touchpoint
      if (input.clientId) {
        await ctx.prisma.communicationTouchpoint.create({
          data: {
            tenantId: ctx.tenantId,
            clientId: input.clientId,
            touchpointType: 'INITIAL_CONTACT',
            status: 'COMPLETED',
            completedAt: new Date(),
            notes: `Email sent: ${input.subject}`,
          },
        });
      }
      return { success: true, message: 'Email sent' };
    }),

  createAutomatedEmail: tenantProcedure
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
        subject: z.string().min(1),
        bodyTemplate: z.string().min(1),
        sendDelay: z.number().int().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.automatedEmailConfig.create({
        data: {
          tenantId: ctx.tenantId,
          emailType: input.emailType,
          subject: input.subject,
          bodyTemplate: input.bodyTemplate,
          sendDelay: input.sendDelay,
          isActive: input.isActive,
        },
      });
    }),

  getAutomatedEmails: tenantProcedure.query(async ({ ctx }) => {
    return ctx.prisma.automatedEmailConfig.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }),

  toggleAutomatedEmail: tenantProcedure
    .input(z.object({ id: z.string().uuid(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const email = await ctx.prisma.automatedEmailConfig.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });
      if (!email) throw new Error('Automated email not found');
      return ctx.prisma.automatedEmailConfig.update({ where: { id: input.id }, data: { isActive: input.isActive } });
    }),
});
