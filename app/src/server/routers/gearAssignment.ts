import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const gearAssignmentRouter = router({
  assign: tenantProcedure
    .input(
      z.object({
        gearId: z.string().uuid(),
        eventId: z.string().uuid(),
        kitId: z.string().uuid().optional(),
        shiftId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify gear, event, kit, shift all belong to tenant
      const gear = await ctx.prisma.gear.findFirst({ where: { id: input.gearId, tenantId: ctx.tenantId } });
      const event = await ctx.prisma.event.findFirst({ where: { id: input.eventId, tenantId: ctx.tenantId } });
      if (!gear || !event) throw new Error('Gear or event not found');

      if (input.kitId) {
        const kit = await ctx.prisma.gearKit.findFirst({ where: { id: input.kitId, tenantId: ctx.tenantId } });
        if (!kit) throw new Error('Kit not found');
      }

      if (input.shiftId) {
        const shift = await ctx.prisma.shift.findFirst({
          where: { id: input.shiftId, event: { tenantId: ctx.tenantId } },
        });
        if (!shift) throw new Error('Shift not found');
      }

      return ctx.prisma.gearAssignment.create({
        data: {
          tenantId: ctx.tenantId,
          gearId: input.gearId,
          eventId: input.eventId,
          kitId: input.kitId,
          shiftId: input.shiftId,
        },
        include: { gear: true, event: true, kit: true, shift: true },
      });
    }),

  unassign: tenantProcedure
    .input(z.object({ assignmentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.gearAssignment.findFirst({
        where: { id: input.assignmentId, event: { tenantId: ctx.tenantId } },
      });
      if (!assignment) throw new Error('Assignment not found');
      return ctx.prisma.gearAssignment.delete({ where: { id: input.assignmentId } });
    }),

  listByEvent: tenantProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gearAssignment.findMany({
        where: { eventId: input.eventId, event: { tenantId: ctx.tenantId } },
        include: { gear: true, kit: true, shift: true },
      });
    }),

  listByGear: tenantProcedure
    .input(z.object({ gearId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gearAssignment.findMany({
        where: { gearId: input.gearId, event: { tenantId: ctx.tenantId } },
        include: { event: true, kit: true, shift: true },
        orderBy: { createdAt: 'desc' },
      });
    }),
});
