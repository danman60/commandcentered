import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

// Zod schemas matching Prisma enums exactly
const EventTypeEnum = z.enum([
  'DANCE_COMPETITION',
  'RECITAL',
  'CONCERT',
  'PLAY',
  'OTHER',
]);

const EventStatusEnum = z.enum([
  'CONFIRMED',
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'ARCHIVED',
  'CANCELLED',
  'PENDING_QUESTIONNAIRE',
  'PLANNING',
  'BOOKED',
  'TENTATIVE',
]);

export const eventRouter = router({
  list: tenantProcedure
    .input(
      z
        .object({
          status: EventStatusEnum.optional(),
          eventType: EventTypeEnum.optional(),
          upcoming: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      return ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.status && { status: input.status }),
          ...(input?.eventType && { eventType: input.eventType }),
          ...(input?.upcoming && { loadInTime: { gte: now } }),
        },
        include: {
          shifts: {
            select: {
              id: true,
              shiftName: true,
              startTime: true,
              endTime: true,
            },
          },
          deliverables: {
            select: {
              id: true,
              deliverableType: true,
              status: true,
              dueDate: true,
            },
          },
        },
        orderBy: { loadInTime: 'desc' },
      });
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
        include: {
          shifts: {
            include: {
              shiftAssignments: {
                include: {
                  operator: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
            orderBy: { startTime: 'asc' },
          },
          deliverables: {
            include: {
              assignedEditor: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: { dueDate: 'asc' },
          },
          gearAssignments: {
            include: {
              gear: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                },
              },
              kit: {
                select: {
                  id: true,
                  kitName: true,
                },
              },
            },
          },
          alerts: {
            orderBy: { createdAt: 'desc' },
          },
          communicationTouchpoints: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        });
      }

      return event;
    }),

  create: tenantProcedure
    .input(
      z.object({
        eventName: z.string().min(1),
        eventType: EventTypeEnum,
        venueName: z.string().min(1),
        venueAddress: z.string().min(1),
        venueLat: z.number().optional(),
        venueLng: z.number().optional(),
        parkingInstructions: z.string().optional(),
        clientName: z.string().optional(),
        clientEmail: z.string().email().optional(),
        clientPhone: z.string().optional(),
        clientId: z.string().uuid().optional(),
        loadInTime: z.date(),
        loadOutTime: z.date(),
        revenueAmount: z.number().optional(),
        status: EventStatusEnum.default('CONFIRMED'),
        hasHotel: z.boolean().default(false),
        hotelName: z.string().optional(),
        hotelAddress: z.string().optional(),
        hotelLat: z.number().optional(),
        hotelLng: z.number().optional(),
        hotelCheckInDate: z.date().optional(),
        hotelCheckInTime: z.date().optional(),
        hotelCheckOutDate: z.date().optional(),
        hotelNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.event.create({
        data: {
          tenantId: ctx.tenantId,
          eventName: input.eventName,
          eventType: input.eventType,
          venueName: input.venueName,
          venueAddress: input.venueAddress,
          venueLat: input.venueLat,
          venueLng: input.venueLng,
          parkingInstructions: input.parkingInstructions,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          clientPhone: input.clientPhone,
          clientId: input.clientId,
          loadInTime: input.loadInTime,
          loadOutTime: input.loadOutTime,
          revenueAmount: input.revenueAmount,
          status: input.status,
          hasHotel: input.hasHotel,
          hotelName: input.hotelName,
          hotelAddress: input.hotelAddress,
          hotelLat: input.hotelLat,
          hotelLng: input.hotelLng,
          hotelCheckInDate: input.hotelCheckInDate,
          hotelCheckInTime: input.hotelCheckInTime,
          hotelCheckOutDate: input.hotelCheckOutDate,
          hotelNotes: input.hotelNotes,
        },
        include: {
          shifts: true,
          deliverables: true,
        },
      });
    }),

  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        eventName: z.string().min(1).optional(),
        eventType: EventTypeEnum.optional(),
        venueName: z.string().min(1).optional(),
        venueAddress: z.string().min(1).optional(),
        venueLat: z.number().optional(),
        venueLng: z.number().optional(),
        parkingInstructions: z.string().optional(),
        clientName: z.string().optional(),
        clientEmail: z.string().email().optional(),
        clientPhone: z.string().optional(),
        clientId: z.string().uuid().optional(),
        loadInTime: z.date().optional(),
        loadOutTime: z.date().optional(),
        revenueAmount: z.number().optional(),
        actualRevenue: z.number().optional(),
        status: EventStatusEnum.optional(),
        hasHotel: z.boolean().optional(),
        hotelName: z.string().optional(),
        hotelAddress: z.string().optional(),
        hotelLat: z.number().optional(),
        hotelLng: z.number().optional(),
        hotelCheckInDate: z.date().optional(),
        hotelCheckInTime: z.date().optional(),
        hotelCheckOutDate: z.date().optional(),
        hotelNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Check if event exists and belongs to tenant
      const existingEvent = await ctx.prisma.event.findFirst({
        where: {
          id,
          tenantId: ctx.tenantId,
        },
      });

      if (!existingEvent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        });
      }

      return ctx.prisma.event.update({
        where: { id },
        data: updateData,
        include: {
          shifts: true,
          deliverables: true,
        },
      });
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Check if event exists and belongs to tenant
      const existingEvent = await ctx.prisma.event.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });

      if (!existingEvent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        });
      }

      // Soft delete: set status to CANCELLED
      return ctx.prisma.event.update({
        where: { id: input.id },
        data: {
          status: 'CANCELLED',
          cancellationReason: 'Deleted by user',
        },
      });
    }),

  getMonthView: tenantProcedure
    .input(
      z.object({
        year: z.number().int().min(2020).max(2100),
        month: z.number().int().min(1).max(12),
      })
    )
    .query(async ({ ctx, input }) => {
      const { year, month } = input;

      // Calculate date range for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      return ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          status: {
            notIn: ['CANCELLED', 'ARCHIVED'],
          },
          OR: [
            {
              loadInTime: {
                gte: startDate,
                lte: endDate,
              },
            },
            {
              loadOutTime: {
                gte: startDate,
                lte: endDate,
              },
            },
            {
              AND: [
                { loadInTime: { lte: startDate } },
                { loadOutTime: { gte: endDate } },
              ],
            },
          ],
        },
        include: {
          shifts: {
            select: {
              id: true,
              shiftName: true,
              startTime: true,
              endTime: true,
              _count: {
                select: {
                  shiftAssignments: true,
                },
              },
            },
          },
          gearAssignments: {
            select: {
              id: true,
            },
          },
        },
        orderBy: { loadInTime: 'asc' },
      });
    }),

  getUpcoming: tenantProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(100).default(10),
          status: EventStatusEnum.optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      return ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          loadInTime: { gte: now },
          ...(input?.status && { status: input.status }),
          status: {
            notIn: ['CANCELLED', 'ARCHIVED'],
          },
        },
        include: {
          shifts: {
            select: {
              id: true,
              shiftName: true,
              startTime: true,
              endTime: true,
            },
          },
          deliverables: {
            select: {
              id: true,
              deliverableType: true,
              status: true,
              dueDate: true,
            },
          },
        },
        orderBy: { loadInTime: 'asc' },
        take: input?.limit ?? 10,
      });
    }),

  getPast: tenantProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(100).default(10),
          status: EventStatusEnum.optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      return ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          loadOutTime: { lt: now },
          ...(input?.status && { status: input.status }),
        },
        include: {
          shifts: {
            select: {
              id: true,
              shiftName: true,
              startTime: true,
              endTime: true,
            },
          },
          deliverables: {
            select: {
              id: true,
              deliverableType: true,
              status: true,
              dueDate: true,
            },
          },
        },
        orderBy: { loadOutTime: 'desc' },
        take: input?.limit ?? 10,
      });
    }),

  updateStatus: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: EventStatusEnum,
        cancellationReason: z.string().optional(),
        cancellationPenalty: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if event exists and belongs to tenant
      const existingEvent = await ctx.prisma.event.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });

      if (!existingEvent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        });
      }

      return ctx.prisma.event.update({
        where: { id: input.id },
        data: {
          status: input.status,
          ...(input.status === 'CANCELLED' && {
            cancellationReason: input.cancellationReason,
            cancellationPenalty: input.cancellationPenalty,
          }),
        },
        include: {
          shifts: true,
          deliverables: true,
        },
      });
    }),

  getByDateRange: tenantProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        status: EventStatusEnum.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input.status && { status: input.status }),
          OR: [
            {
              loadInTime: {
                gte: input.startDate,
                lte: input.endDate,
              },
            },
            {
              loadOutTime: {
                gte: input.startDate,
                lte: input.endDate,
              },
            },
            {
              AND: [
                { loadInTime: { lte: input.startDate } },
                { loadOutTime: { gte: input.endDate } },
              ],
            },
          ],
        },
        include: {
          shifts: {
            include: {
              shiftAssignments: {
                include: {
                  operator: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
            orderBy: { startTime: 'asc' },
          },
          gearAssignments: {
            include: {
              gear: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                },
              },
              kit: {
                select: {
                  id: true,
                  kitName: true,
                },
              },
            },
          },
          deliverables: {
            select: {
              id: true,
              deliverableType: true,
              status: true,
              dueDate: true,
            },
          },
        },
        orderBy: { loadInTime: 'asc' },
      });
    }),

  getRevenueSummary: tenantProcedure
    .input(
      z
        .object({
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const events = await ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          status: {
            notIn: ['CANCELLED'],
          },
          ...(input?.startDate &&
            input?.endDate && {
              loadInTime: {
                gte: input.startDate,
                lte: input.endDate,
              },
            }),
        },
        select: {
          id: true,
          eventName: true,
          loadInTime: true,
          status: true,
          revenueAmount: true,
          actualRevenue: true,
        },
      });

      const summary = events.reduce(
        (acc, event) => {
          const projected = Number(event.revenueAmount ?? 0);
          const actual = Number(event.actualRevenue ?? 0);

          return {
            totalProjected: acc.totalProjected + projected,
            totalActual: acc.totalActual + actual,
            eventCount: acc.eventCount + 1,
            completedCount:
              acc.completedCount +
              (event.status === 'COMPLETED' ? 1 : 0),
          };
        },
        {
          totalProjected: 0,
          totalActual: 0,
          eventCount: 0,
          completedCount: 0,
        }
      );

      return {
        ...summary,
        events,
      };
    }),
});
