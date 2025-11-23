import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { router, protectedProcedure } from '../trpc';

export const userPreferencesRouter = router({
  // Get user preferences (creates default if not exists)
  get: protectedProcedure.query(async ({ ctx }) => {
    let preferences = await ctx.prisma.userPreferences.findUnique({
      where: { userId: ctx.user.id },
    });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await ctx.prisma.userPreferences.create({
        data: {
          userId: ctx.user.id,
          dashboardLayout: Prisma.JsonNull,
          visibleWidgets: [],
          navigationCollapsed: false,
          navigationOrder: Prisma.JsonNull,
          navigationLabels: Prisma.JsonNull,
          defaultViewTypes: Prisma.JsonNull,
          panelSizes: Prisma.JsonNull,
          theme: 'dark',
          notificationsEnabled: true,
        },
      });
    }

    return preferences;
  }),

  // Update dashboard layout
  updateDashboardLayout: protectedProcedure
    .input(
      z.object({
        dashboardLayout: z.any(), // React Grid Layout config
        visibleWidgets: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.userPreferences.upsert({
        where: { userId: ctx.user.id },
        create: {
          userId: ctx.user.id,
          dashboardLayout: input.dashboardLayout,
          visibleWidgets: input.visibleWidgets || [],
        },
        update: {
          dashboardLayout: input.dashboardLayout,
          ...(input.visibleWidgets && { visibleWidgets: input.visibleWidgets }),
        },
      });
    }),

  // Update navigation preferences
  updateNavigation: protectedProcedure
    .input(
      z.object({
        navigationCollapsed: z.boolean().optional(),
        navigationOrder: z.any().optional(),
        navigationLabels: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.userPreferences.upsert({
        where: { userId: ctx.user.id },
        create: {
          userId: ctx.user.id,
          ...input,
        },
        update: input,
      });
    }),

  // Update view preferences (card/table/calendar defaults)
  updateViewTypes: protectedProcedure
    .input(
      z.object({
        defaultViewTypes: z.any(), // { events: 'calendar', gear: 'table', etc }
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.userPreferences.upsert({
        where: { userId: ctx.user.id },
        create: {
          userId: ctx.user.id,
          defaultViewTypes: input.defaultViewTypes,
        },
        update: {
          defaultViewTypes: input.defaultViewTypes,
        },
      });
    }),

  // Update panel sizes (for resizable panels)
  updatePanelSizes: protectedProcedure
    .input(
      z.object({
        panelSizes: z.any(), // { leftPanel: 300, rightPanel: 400, etc }
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.userPreferences.upsert({
        where: { userId: ctx.user.id },
        create: {
          userId: ctx.user.id,
          panelSizes: input.panelSizes,
        },
        update: {
          panelSizes: input.panelSizes,
        },
      });
    }),

  // Update theme
  updateTheme: protectedProcedure
    .input(
      z.object({
        theme: z.enum(['light', 'dark', 'tactical']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.userPreferences.upsert({
        where: { userId: ctx.user.id },
        create: {
          userId: ctx.user.id,
          theme: input.theme,
        },
        update: {
          theme: input.theme,
        },
      });
    }),

  // Update notification settings
  updateNotifications: protectedProcedure
    .input(
      z.object({
        notificationsEnabled: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.userPreferences.upsert({
        where: { userId: ctx.user.id },
        create: {
          userId: ctx.user.id,
          notificationsEnabled: input.notificationsEnabled,
        },
        update: {
          notificationsEnabled: input.notificationsEnabled,
        },
      });
    }),

  // Reset to defaults
  resetToDefaults: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.prisma.userPreferences.upsert({
      where: { userId: ctx.user.id },
      create: {
        userId: ctx.user.id,
        dashboardLayout: Prisma.JsonNull,
        visibleWidgets: [],
        navigationCollapsed: false,
        navigationOrder: Prisma.JsonNull,
        navigationLabels: Prisma.JsonNull,
        defaultViewTypes: Prisma.JsonNull,
        panelSizes: Prisma.JsonNull,
        theme: 'dark',
        notificationsEnabled: true,
      },
      update: {
        dashboardLayout: Prisma.JsonNull,
        visibleWidgets: [],
        navigationCollapsed: false,
        navigationOrder: Prisma.JsonNull,
        navigationLabels: Prisma.JsonNull,
        defaultViewTypes: Prisma.JsonNull,
        panelSizes: Prisma.JsonNull,
        theme: 'dark',
        notificationsEnabled: true,
      },
    });
  }),
});
