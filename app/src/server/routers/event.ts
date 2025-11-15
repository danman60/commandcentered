import { router, tenantProcedure } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const eventRouter = router({
  // List events (Planning Calendar)
  list: tenantProcedure
    .input(z.object({
      month: z.date().optional(),
      status: z.enum(['CONFIRMED', 'BOOKED', 'TENTATIVE', 'PROPOSAL', 'CANCELLED', 'COMPLETED']).optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          status: input?.status,
          loadInTime: input?.month ? {
            gte: input.month,
            lt: new Date(input.month.getFullYear(), input.month.getMonth() + 1, 1)
          } : undefined,
        },
        include: {
          shifts: {
            include: {
              shiftAssignments: {
                include: { operator: true }
              }
            }
          },
          gearAssignments: {
            include: { kit: true }
          }
        },
        orderBy: { loadInTime: 'asc' }
      })
    }),

  // Get single event (Event Detail Modal)
  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: {
          shifts: {
            include: {
              shiftAssignments: { include: { operator: true } },
              gearAssignments: { include: { gear: true, kit: true } }
            }
          },
          gearAssignments: { include: { gear: true, kit: true } },
          communicationTouchpoints: true,
        }
      })
      if (!event) throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      return event
    }),

  // Create event
  create: tenantProcedure
    .input(z.object({
      eventName: z.string().min(1),
      eventType: z.enum(['DANCE_COMPETITION', 'RECITAL', 'CONCERT', 'PLAY', 'OTHER']),
      venueName: z.string().min(1),
      venueAddress: z.string().min(1),
      loadInTime: z.date(),
      loadOutTime: z.date(),
      clientName: z.string().optional(),
      clientEmail: z.string().email().optional(),
      clientPhone: z.string().optional(),
      hasHotel: z.boolean().default(false),
      hotelName: z.string().optional(),
      hotelAddress: z.string().optional(),
      status: z.enum(['CONFIRMED', 'BOOKED', 'TENTATIVE', 'PROPOSAL']).default('BOOKED'),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.event.create({
        data: {
          ...input,
          tenantId: ctx.tenantId,
        }
      })
    }),

  // Update event
  update: tenantProcedure
    .input(z.object({
      id: z.string().uuid(),
      eventName: z.string().min(1).optional(),
      eventType: z.enum(['DANCE_COMPETITION', 'RECITAL', 'CONCERT', 'PLAY', 'OTHER']).optional(),
      venueName: z.string().optional(),
      venueAddress: z.string().optional(),
      loadInTime: z.date().optional(),
      loadOutTime: z.date().optional(),
      status: z.enum(['CONFIRMED', 'BOOKED', 'TENTATIVE', 'PROPOSAL', 'CANCELLED']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.event.update({
        where: { id, tenantId: ctx.tenantId },
        data
      })
    }),

  // Delete event
  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.event.delete({
        where: { id: input.id, tenantId: ctx.tenantId }
      })
    }),

  // Get calendar month view (optimized query)
  getMonthView: tenantProcedure
    .input(z.object({
      year: z.number(),
      month: z.number().min(1).max(12),
    }))
    .query(async ({ ctx, input }) => {
      const startDate = new Date(input.year, input.month - 1, 1)
      const endDate = new Date(input.year, input.month, 1)

      return ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          loadInTime: { gte: startDate, lt: endDate }
        },
        select: {
          id: true,
          eventName: true,
          eventType: true,
          status: true,
          clientName: true,
          loadInTime: true,
          loadOutTime: true,
          shifts: {
            select: {
              id: true,
              shiftAssignments: {
                select: { operator: { select: { id: true, name: true } } }
              }
            }
          },
          gearAssignments: {
            select: { kit: { select: { id: true, kitName: true } } }
          }
        },
        orderBy: { loadInTime: 'asc' }
      })
    }),
})
