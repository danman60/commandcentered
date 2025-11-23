/**
 * tRPC Router: Saved Search
 *
 * Procedures:
 * - list: Get user's saved searches
 * - create: Save a new search
 * - update: Update saved search
 * - delete: Remove saved search
 * - updateLastUsed: Update last used timestamp
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { prisma } from '@/lib/prisma';

export const savedSearchRouter = router({
  /**
   * List user's saved searches
   */
  list: protectedProcedure
    .input(
      z.object({
        searchType: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {
        tenantId: ctx.user.tenantId,
        userId: ctx.user.id,
      };

      if (input.searchType) {
        whereClause.searchType = input.searchType;
      }

      return await prisma.savedSearch.findMany({
        where: whereClause,
        orderBy: {
          lastUsedAt: 'desc',
        },
      });
    }),

  /**
   * Create saved search
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        searchType: z.string().default('lead_finder'),
        filters: z.any(),
        resultCount: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.savedSearch.create({
        data: {
          tenantId: ctx.user.tenantId,
          userId: ctx.user.id,
          name: input.name,
          searchType: input.searchType,
          filters: input.filters,
          resultCount: input.resultCount,
        },
      });
    }),

  /**
   * Update saved search
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        filters: z.any().optional(),
        resultCount: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      return await prisma.savedSearch.update({
        where: {
          id,
          tenantId: ctx.user.tenantId,
          userId: ctx.user.id,
        },
        data: updateData,
      });
    }),

  /**
   * Delete saved search
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.savedSearch.delete({
        where: {
          id: input.id,
          tenantId: ctx.user.tenantId,
          userId: ctx.user.id,
        },
      });
    }),

  /**
   * Update last used timestamp
   */
  updateLastUsed: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.savedSearch.update({
        where: {
          id: input.id,
          tenantId: ctx.user.tenantId,
          userId: ctx.user.id,
        },
        data: {
          lastUsedAt: new Date(),
        },
      });
    }),
});
