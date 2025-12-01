import { z } from 'zod';
import { router, tenantProcedure, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

/**
 * Proposal Template Router
 *
 * Manages proposal builder templates:
 * - CRUD operations for templates
 * - Publish/unpublish templates
 * - Get published template by slug (public endpoint)
 * - Duplicate templates
 *
 * Templates use configJson (JSONB) to store element configurations
 */

// Element type validation
const ElementTypeEnum = z.enum([
  'hero',
  'rich_text',
  'image',
  'video',
  'number_input',
  'text_input',
  'textarea',
  'date_picker',
  'dropdown',
  'service_toggles',
  'checkbox_group',
  'radio_group',
  'pricing_tiers',
  'package_tiers',
  'pricing_summary',
  'submit_button',
  'divider',
]);

// Base element schema (all elements extend this)
const BaseElementSchema = z.object({
  id: z.string(),
  type: ElementTypeEnum,
  order: z.number().int().min(0),
  config: z.record(z.string(), z.any()), // Element-specific configuration
});

// Template configuration schema
const TemplateConfigSchema = z.object({
  elements: z.array(BaseElementSchema),
  theme_config: z
    .object({
      primaryColor: z.string().optional(),
      fontFamily: z.string().optional(),
      borderRadius: z.string().optional(),
    })
    .optional(),
});

export const proposalTemplateRouter = router({
  /**
   * List all templates for tenant
   */
  list: tenantProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          serviceType: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.proposalTemplate.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.serviceType && { serviceType: input.serviceType }),
          ...(input?.search && {
            OR: [
              { name: { contains: input.search, mode: 'insensitive' } },
              { description: { contains: input.search, mode: 'insensitive' } },
            ],
          }),
        },
        include: {
          _count: {
            select: {
              proposals: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  /**
   * Get template by ID (requires authentication)
   */
  getById: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const template = await ctx.prisma.proposalTemplate.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
        include: {
          _count: {
            select: {
              proposals: true,
            },
          },
        },
      });

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Proposal template not found',
        });
      }

      return template;
    }),

  /**
   * Get published template by slug (PUBLIC - no auth required)
   * Used by client-facing proposal preview page
   */
  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const template = await ctx.prisma.proposalTemplate.findFirst({
        where: {
          slug: input.slug,
          publishedAt: { not: null }, // Only return published templates
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          configJson: true,
          publishedAt: true,
          tenantId: true, // Needed to create submission
        },
      });

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Published template not found',
        });
      }

      return template;
    }),

  /**
   * Create new template
   */
  create: tenantProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
        serviceType: z.string().max(100).optional(),
        description: z.string().optional(),
        configJson: TemplateConfigSchema.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if slug is unique within tenant
      const existing = await ctx.prisma.proposalTemplate.findFirst({
        where: {
          tenantId: ctx.tenantId,
          slug: input.slug,
        },
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A template with this slug already exists',
        });
      }

      return ctx.prisma.proposalTemplate.create({
        data: {
          tenantId: ctx.tenantId,
          name: input.name,
          slug: input.slug,
          serviceType: input.serviceType,
          description: input.description,
          configJson: input.configJson || { elements: [] },
          createdBy: ctx.user?.id,
        },
      });
    }),

  /**
   * Update template
   */
  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
        serviceType: z.string().max(100).optional(),
        description: z.string().optional(),
        configJson: TemplateConfigSchema.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, slug, ...restData } = input;

      // Verify template belongs to tenant
      const template = await ctx.prisma.proposalTemplate.findFirst({
        where: {
          id,
          tenantId: ctx.tenantId,
        },
      });

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Proposal template not found',
        });
      }

      // If slug is changing, check uniqueness
      if (slug && slug !== template.slug) {
        const existing = await ctx.prisma.proposalTemplate.findFirst({
          where: {
            tenantId: ctx.tenantId,
            slug,
          },
        });

        if (existing) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A template with this slug already exists',
          });
        }
      }

      return ctx.prisma.proposalTemplate.update({
        where: { id },
        data: {
          ...restData,
          ...(slug && { slug }),
        },
      });
    }),

  /**
   * Publish template (makes it accessible via public URL)
   */
  publish: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify template belongs to tenant
      const template = await ctx.prisma.proposalTemplate.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Proposal template not found',
        });
      }

      // Validate that template has at least one element
      const config = template.configJson as { elements?: any[] };
      if (!config.elements || config.elements.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot publish template without any elements',
        });
      }

      const publishedUrl = `/proposals/preview/${template.slug}`;

      return ctx.prisma.proposalTemplate.update({
        where: { id: input.id },
        data: {
          publishedAt: new Date(),
          publishedUrl,
        },
      });
    }),

  /**
   * Unpublish template (makes it inaccessible)
   */
  unpublish: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify template belongs to tenant
      const template = await ctx.prisma.proposalTemplate.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Proposal template not found',
        });
      }

      return ctx.prisma.proposalTemplate.update({
        where: { id: input.id },
        data: {
          publishedAt: null,
          publishedUrl: null,
        },
      });
    }),

  /**
   * Duplicate template
   */
  duplicate: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        newName: z.string().min(1).max(255),
        newSlug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify original template belongs to tenant
      const original = await ctx.prisma.proposalTemplate.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
      });

      if (!original) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Original template not found',
        });
      }

      // Check if new slug is unique
      const existing = await ctx.prisma.proposalTemplate.findFirst({
        where: {
          tenantId: ctx.tenantId,
          slug: input.newSlug,
        },
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A template with this slug already exists',
        });
      }

      // Create copy (unpublished by default)
      return ctx.prisma.proposalTemplate.create({
        data: {
          tenantId: ctx.tenantId,
          name: input.newName,
          slug: input.newSlug,
          serviceType: original.serviceType,
          description: original.description,
          configJson: original.configJson as any, // JsonValue to InputJsonValue
          createdBy: ctx.user?.id,
          // Don't copy publishedAt or publishedUrl
        },
      });
    }),

  /**
   * Delete template
   */
  delete: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify template belongs to tenant
      const template = await ctx.prisma.proposalTemplate.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
        },
        include: {
          _count: {
            select: {
              proposals: true,
            },
          },
        },
      });

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Proposal template not found',
        });
      }

      // Prevent deletion if template has proposals
      if (template._count.proposals > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot delete template with ${template._count.proposals} existing proposal(s). Unpublish instead.`,
        });
      }

      return ctx.prisma.proposalTemplate.delete({
        where: { id: input.id },
      });
    }),
});
