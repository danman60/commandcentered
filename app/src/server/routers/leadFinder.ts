import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

/**
 * Lead Finder Router - Phase 12
 *
 * Manages external lead search and import:
 * - Search for leads (Apollo.io integration placeholder)
 * - Export leads to CRM
 * - Manage saved searches
 * - Configure lead source APIs
 */

// Lead search result schema (Apollo.io format)
const LeadSearchResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  website: z.string().optional(),
  email: z.string().email().optional(),
  employees: z.string().optional(),
  revenue: z.string().optional(),
  tags: z.array(z.string()),
});

export const leadFinderRouter = router({
  /**
   * Search for leads using external API (Apollo.io)
   * Currently returns mock data - API integration pending
   */
  search: tenantProcedure
    .input(
      z.object({
        businessTypes: z.array(z.string()).optional(),
        location: z.string().optional(),
        keywords: z.string().optional(),
        minEmployees: z.string().optional(),
        maxEmployees: z.string().optional(),
        minRevenue: z.string().optional(),
        maxRevenue: z.string().optional(),
        hasWebsite: z.boolean().optional(),
        skipExisting: z.boolean().default(true),
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO: Integrate Apollo.io API
      // For now, return mock data matching the Lead Finder UI expectations

      const mockResults = [
        {
          id: 'lead-1',
          name: 'Woodstock School of Dance & Yoga',
          location: 'Woodstock, ON',
          website: 'woodstockdanceyoga.com',
          email: 'info@woodstockdanceyoga.com',
          employees: '10-50 employees',
          revenue: 'Est. $100K-500K',
          tags: ['Dance Studio', 'Yoga', 'Performing Arts'],
        },
        {
          id: 'lead-2',
          name: 'EMPWR Dance Experience',
          location: 'Guelph, ON',
          website: 'empwrdance.com',
          email: 'empwrdance@gmail.com',
          employees: '10-50 employees',
          revenue: 'Est. $100K-500K',
          tags: ['Dance Studio', 'Competitions', 'Training'],
        },
        {
          id: 'lead-3',
          name: 'Grand River Dance Company',
          location: 'Cambridge, ON',
          website: 'grandriverdance.com',
          email: 'info@grandriverdance.com',
          employees: '10-50 employees',
          revenue: 'Est. $50K-250K',
          tags: ['Dance School', 'Performance Company'],
        },
      ];

      // Filter by location if provided
      const results = input.location
        ? mockResults.filter((r) =>
            r.location.toLowerCase().includes(input.location!.toLowerCase())
          )
        : mockResults;

      return results;
    }),

  /**
   * Export selected leads to CRM (create Lead records)
   */
  exportToCRM: tenantProcedure
    .input(
      z.object({
        leads: z.array(
          z.object({
            name: z.string(),
            email: z.string().email().optional(),
            location: z.string().optional(),
            website: z.string().optional(),
            tags: z.array(z.string()).optional(),
          })
        ),
        source: z.string().default('Apollo.io'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create Lead records from external search results
      const created = await Promise.all(
        input.leads.map((lead) =>
          ctx.prisma.lead.create({
            data: {
              tenantId: ctx.tenantId,
              organization: lead.name,
              email: lead.email || '',
              contactName: lead.name,
              source: input.source,
              sourceDetails: JSON.stringify({
                location: lead.location,
                website: lead.website,
                tags: lead.tags,
              }),
              status: 'NEW',
            },
          })
        )
      );

      return {
        success: true,
        count: created.length,
        leads: created,
      };
    }),

  /**
   * Get user's saved searches
   */
  getSavedSearches: tenantProcedure.query(async ({ ctx }) => {
    return ctx.prisma.savedLeadSearch.findMany({
      where: {
        tenantId: ctx.tenantId,
        userId: ctx.user?.id,
      },
      orderBy: { lastRunAt: 'desc' },
    });
  }),

  /**
   * Save search criteria for reuse
   */
  saveSearch: tenantProcedure
    .input(
      z.object({
        searchName: z.string().min(1),
        searchCriteria: z.record(z.string(), z.any()),
        resultCount: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new Error('User not authenticated');
      }

      return ctx.prisma.savedLeadSearch.create({
        data: {
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
          searchName: input.searchName,
          searchCriteria: input.searchCriteria,
          resultCount: input.resultCount,
          lastRunAt: new Date(),
        },
      });
    }),

  /**
   * Delete saved search
   */
  deleteSavedSearch: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.savedLeadSearch.delete({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });

      return { success: true };
    }),

  /**
   * Get lead source configuration (API keys, etc.)
   */
  getSourceConfig: tenantProcedure
    .input(z.object({ sourceName: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.sourceName) {
        return ctx.prisma.leadSourceConfig.findFirst({
          where: {
            tenantId: ctx.tenantId,
            sourceName: input.sourceName,
          },
        });
      }

      return ctx.prisma.leadSourceConfig.findMany({
        where: {
          tenantId: ctx.tenantId,
        },
      });
    }),

  /**
   * Update lead source configuration
   */
  updateSourceConfig: tenantProcedure
    .input(
      z.object({
        sourceName: z.string(),
        apiKey: z.string().optional(),
        apiSecret: z.string().optional(),
        configJson: z.record(z.string(), z.any()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.leadSourceConfig.upsert({
        where: {
          tenantId_sourceName: {
            tenantId: ctx.tenantId,
            sourceName: input.sourceName,
          },
        },
        create: {
          tenantId: ctx.tenantId,
          sourceName: input.sourceName,
          apiKey: input.apiKey,
          apiSecret: input.apiSecret,
          configJson: input.configJson,
          isActive: input.isActive ?? false,
        },
        update: {
          apiKey: input.apiKey,
          apiSecret: input.apiSecret,
          configJson: input.configJson,
          isActive: input.isActive,
        },
      });
    }),
});
