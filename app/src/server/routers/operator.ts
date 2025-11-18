import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

/**
 * Operator Router - 12 procedures
 *
 * Manages operators (freelance videographers/crew):
 * - Create/update/list operators
 * - Manage availability and blackout dates
 * - Track skills and assignment history
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
        availableType: z.enum(['full_day', 'morning', 'afternoon', 'evening', 'custom']),
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

  /**
   * Get operator's assignment history
   */
  getAssignmentHistory: tenantProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
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

      return ctx.prisma.shiftAssignment.findMany({
        where: {
          operatorId: input.operatorId,
          tenantId: ctx.tenantId,
          shift: {
            endTime: {
              lt: new Date(), // Only past shifts
            },
          },
        },
        include: {
          shift: {
            include: {
              event: {
                select: {
                  id: true,
                  eventName: true,
                  eventType: true,
                  clientName: true,
                },
              },
            },
          },
        },
        orderBy: {
          shift: {
            startTime: 'desc',
          },
        },
        take: input.limit || 50,
      });
    }),

  /**
   * Get operator's upcoming assignments
   */
  getUpcomingAssignments: tenantProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
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

      return ctx.prisma.shiftAssignment.findMany({
        where: {
          operatorId: input.operatorId,
          tenantId: ctx.tenantId,
          shift: {
            startTime: {
              gte: new Date(), // Only future shifts
            },
          },
        },
        include: {
          shift: {
            include: {
              event: {
                select: {
                  id: true,
                  eventName: true,
                  eventType: true,
                  clientName: true,
                  venueName: true,
                  venueAddress: true,
                },
              },
            },
          },
        },
        orderBy: {
          shift: {
            startTime: 'asc',
          },
        },
      });
    }),

  /**
   * Update operator skills
   */
  updateSkills: tenantProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
        skills: z.array(
          z.object({
            skillDefinitionId: z.string().uuid(),
            skillLevel: z.number().min(1).max(10),
          })
        ),
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

      // Delete existing skills and create new ones
      await ctx.prisma.operatorSkill.deleteMany({
        where: {
          operatorId: input.operatorId,
          tenantId: ctx.tenantId,
        },
      });

      // Create new skills
      const createdSkills = await ctx.prisma.$transaction(
        input.skills.map((skill) =>
          ctx.prisma.operatorSkill.create({
            data: {
              tenantId: ctx.tenantId,
              operatorId: input.operatorId,
              skillDefinitionId: skill.skillDefinitionId,
              skillLevel: skill.skillLevel,
            },
          })
        )
      );

      return createdSkills;
    }),

  /**
   * Add blackout dates for operator
   */
  addBlackoutDate: tenantProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
        startDate: z.date(),
        endDate: z.date(),
        reason: z.string().optional(),
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

      return ctx.prisma.operatorBlackoutDate.create({
        data: {
          tenantId: ctx.tenantId,
          operatorId: input.operatorId,
          startDate: input.startDate,
          endDate: input.endDate,
          reason: input.reason,
        },
      });
    }),

  /**
   * Get operator blackout dates
   */
  getBlackoutDates: tenantProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.operatorBlackoutDate.findMany({
        where: {
          operatorId: input.operatorId,
          tenantId: ctx.tenantId,
        },
        orderBy: {
          startDate: 'asc',
        },
      });
    }),

  /**
   * Delete blackout date
   */
  deleteBlackoutDate: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify blackout belongs to tenant
      const blackout = await ctx.prisma.operatorBlackoutDate.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });

      if (!blackout) {
        throw new Error('Blackout date not found');
      }

      return ctx.prisma.operatorBlackoutDate.delete({
        where: { id: input.id },
      });
    }),
});
