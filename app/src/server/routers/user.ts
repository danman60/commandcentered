import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';
import { UserRole } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const userRouter = router({
  // List all users for tenant
  list: tenantProcedure.query(async ({ ctx }) => {
    return ctx.prisma.userProfile.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }),

  // Get user by ID
  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.userProfile.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          authUserId: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      return user;
    }),

  // Get current user's profile
  getCurrent: tenantProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
    }

    const user = await ctx.prisma.userProfile.findFirst({
      where: { id: ctx.user.id, tenantId: ctx.tenantId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        authUserId: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User profile not found' });
    }

    return user;
  }),

  // Create new user with Supabase Auth integration
  create: tenantProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
        role: z.nativeEnum(UserRole).default(UserRole.OPERATOR),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists in tenant
      const existingEmail = await ctx.prisma.userProfile.findUnique({
        where: { tenantId_email: { tenantId: ctx.tenantId, email: input.email } },
      });

      if (existingEmail) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this email already exists in tenant',
        });
      }

      // Create Supabase Auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true, // Auto-confirm email for admin-created users
      });

      if (authError || !authData.user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create auth user: ${authError?.message || 'Unknown error'}`,
        });
      }

      // Create UserProfile with auth user ID
      try {
        return await ctx.prisma.userProfile.create({
          data: {
            tenantId: ctx.tenantId,
            authUserId: authData.user.id,
            email: input.email,
            name: input.name,
            role: input.role,
            isActive: true,
          },
        });
      } catch (error) {
        // If profile creation fails, delete the auth user to maintain consistency
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create user profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }),

  // Update user profile
  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify user exists in tenant
      const user = await ctx.prisma.userProfile.findFirst({
        where: { id, tenantId: ctx.tenantId },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      // If email is being changed, check for conflicts
      if (data.email && data.email !== user.email) {
        const existingEmail = await ctx.prisma.userProfile.findUnique({
          where: { tenantId_email: { tenantId: ctx.tenantId, email: data.email } },
        });

        if (existingEmail && existingEmail.id !== id) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists in tenant',
          });
        }
      }

      return ctx.prisma.userProfile.update({
        where: { id },
        data,
      });
    }),

  // Update user role
  updateRole: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        role: z.nativeEnum(UserRole),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user exists in tenant
      const user = await ctx.prisma.userProfile.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      return ctx.prisma.userProfile.update({
        where: { id: input.id },
        data: { role: input.role },
      });
    }),

  // Soft delete - deactivate user account
  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user exists in tenant
      const user = await ctx.prisma.userProfile.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      // Soft delete by setting isActive to false
      return ctx.prisma.userProfile.update({
        where: { id: input.id },
        data: { isActive: false },
      });
    }),

  // Reactivate user account
  reactivate: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user exists in tenant
      const user = await ctx.prisma.userProfile.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      return ctx.prisma.userProfile.update({
        where: { id: input.id },
        data: { isActive: true },
      });
    }),
});
