/**
 * tRPC Router: Operator Availability
 *
 * Procedures:
 * - list: Get availability for an operator
 * - create: Add availability entry
 * - update: Update availability entry
 * - delete: Remove availability entry
 * - getByDateRange: Get availability within date range
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { prisma } from '@/lib/prisma';

export const operatorAvailabilityRouter = router({
  /**
   * List availability for an operator
   */
  list: protectedProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {
        tenantId: ctx.user.tenantId,
        operatorId: input.operatorId,
      };

      if (input.startDate && input.endDate) {
        whereClause.date = {
          gte: new Date(input.startDate),
          lte: new Date(input.endDate),
        };
      }

      return await prisma.operatorAvailability.findMany({
        where: whereClause,
        orderBy: {
          date: 'asc',
        },
      });
    }),

  /**
   * Get availability by date range
   */
  getByDateRange: protectedProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await prisma.operatorAvailability.findMany({
        where: {
          tenantId: ctx.user.tenantId,
          operatorId: input.operatorId,
          date: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
        },
        orderBy: {
          date: 'asc',
        },
      });
    }),

  /**
   * Create availability entry
   */
  create: protectedProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
        date: z.string(),
        availableType: z.enum(['full_day', 'partial', 'unavailable']),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { operatorId, date, availableType, startTime, endTime, notes } = input;

      // Convert time strings to DateTime if provided
      const startDateTime = startTime ? new Date(`1970-01-01T${startTime}`) : null;
      const endDateTime = endTime ? new Date(`1970-01-01T${endTime}`) : null;

      return await prisma.operatorAvailability.create({
        data: {
          tenantId: ctx.user.tenantId,
          operatorId,
          date: new Date(date),
          availableType,
          startTime: startDateTime,
          endTime: endDateTime,
          notes,
        },
      });
    }),

  /**
   * Update availability entry
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        availableType: z.enum(['full_day', 'partial', 'unavailable']).optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, availableType, startTime, endTime, notes } = input;

      // Convert time strings to DateTime if provided
      const updateData: any = {};

      if (availableType) updateData.availableType = availableType;
      if (startTime !== undefined) {
        updateData.startTime = startTime ? new Date(`1970-01-01T${startTime}`) : null;
      }
      if (endTime !== undefined) {
        updateData.endTime = endTime ? new Date(`1970-01-01T${endTime}`) : null;
      }
      if (notes !== undefined) updateData.notes = notes;

      return await prisma.operatorAvailability.update({
        where: {
          id,
          tenantId: ctx.user.tenantId,
        },
        data: updateData,
      });
    }),

  /**
   * Delete availability entry
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.operatorAvailability.delete({
        where: {
          id: input.id,
          tenantId: ctx.user.tenantId,
        },
      });
    }),

  /**
   * Batch create availability (for setting multiple dates at once)
   */
  batchCreate: protectedProcedure
    .input(
      z.object({
        operatorId: z.string().uuid(),
        dates: z.array(z.string()),
        availableType: z.enum(['full_day', 'partial', 'unavailable']),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { operatorId, dates, availableType, startTime, endTime, notes } = input;

      // Convert time strings to DateTime if provided
      const startDateTime = startTime ? new Date(`1970-01-01T${startTime}`) : null;
      const endDateTime = endTime ? new Date(`1970-01-01T${endTime}`) : null;

      const data = dates.map((date) => ({
        tenantId: ctx.user.tenantId,
        operatorId,
        date: new Date(date),
        availableType,
        startTime: startDateTime,
        endTime: endDateTime,
        notes,
      }));

      return await prisma.operatorAvailability.createMany({
        data,
        skipDuplicates: true,
      });
    }),
});
