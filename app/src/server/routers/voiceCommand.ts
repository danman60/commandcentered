import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';
import { CommandStatus } from '@prisma/client';

/**
 * Voice Command Router - AI Voice Agent System
 *
 * Manages voice command processing and execution:
 * - Create voice commands from transcriptions
 * - Parse natural language into structured commands
 * - Execute commands via tRPC procedures
 * - Track execution status and results
 */

export const voiceCommandRouter = router({
  /**
   * Create voice command from transcription
   */
  create: tenantProcedure
    .input(
      z.object({
        transcription: z.string().min(1),
        audioUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Parse the transcription into structured command
      const parsedCommand = parseNaturalLanguageCommand(input.transcription);

      return ctx.prisma.voiceCommand.create({
        data: {
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
          audioUrl: input.audioUrl,
          transcription: input.transcription,
          action: parsedCommand.action,
          entityType: parsedCommand.entityType,
          entityId: parsedCommand.entityId,
          parsedIntent: parsedCommand.parsedIntent,
          status: parsedCommand.requiresConfirmation ? CommandStatus.AWAITING_CONFIRMATION : CommandStatus.CONFIRMED,
          requiresConfirmation: parsedCommand.requiresConfirmation,
        },
      });
    }),

  /**
   * List voice commands for current user
   */
  list: tenantProcedure
    .input(
      z.object({
        status: z.enum(['PENDING', 'AWAITING_CONFIRMATION', 'CONFIRMED', 'EXECUTING', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
        limit: z.number().int().min(1).max(100).default(50),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.voiceCommand.findMany({
        where: {
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
          ...(input?.status && { status: input.status }),
        },
        include: {
          aiExecutions: true,
        },
        orderBy: { createdAt: 'desc' },
        take: input?.limit || 50,
      });
    }),

  /**
   * Get voice command by ID
   */
  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const command = await ctx.prisma.voiceCommand.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
        },
        include: {
          aiExecutions: true,
        },
      });

      if (!command) throw new Error('Voice command not found');
      return command;
    }),

  /**
   * Confirm voice command before execution
   */
  confirm: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const command = await ctx.prisma.voiceCommand.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
        },
      });

      if (!command) throw new Error('Voice command not found');
      if (command.status !== CommandStatus.AWAITING_CONFIRMATION) {
        throw new Error('Command does not require confirmation');
      }

      return ctx.prisma.voiceCommand.update({
        where: { id: input.id },
        data: {
          status: CommandStatus.CONFIRMED,
          confirmedAt: new Date(),
        },
      });
    }),

  /**
   * Cancel voice command
   */
  cancel: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const command = await ctx.prisma.voiceCommand.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
        },
      });

      if (!command) throw new Error('Voice command not found');
      if (command.status === CommandStatus.EXECUTING) {
        throw new Error('Cannot cancel command that is currently executing');
      }

      return ctx.prisma.voiceCommand.update({
        where: { id: input.id },
        data: { status: CommandStatus.CANCELLED },
      });
    }),

  /**
   * Execute voice command
   */
  execute: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const command = await ctx.prisma.voiceCommand.findFirst({
        where: {
          id: input.id,
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
        },
      });

      if (!command) throw new Error('Voice command not found');
      if (command.status !== CommandStatus.CONFIRMED) {
        throw new Error('Command must be confirmed before execution');
      }

      // Update status to executing
      await ctx.prisma.voiceCommand.update({
        where: { id: input.id },
        data: { status: CommandStatus.EXECUTING },
      });

      try {
        // Execute the command based on action and entityType
        const result = await executeCommand(ctx, command.action, command.entityType, command.parsedIntent as any);

        // Mark as completed
        await ctx.prisma.voiceCommand.update({
          where: { id: input.id },
          data: {
            status: CommandStatus.COMPLETED,
            executedAt: new Date(),
            success: true,
            result: result,
          },
        });

        return { success: true, result };
      } catch (error: any) {
        // Mark as failed
        await ctx.prisma.voiceCommand.update({
          where: { id: input.id },
          data: {
            status: CommandStatus.FAILED,
            executedAt: new Date(),
            success: false,
            errorMessage: error.message || 'Unknown error',
          },
        });

        throw error;
      }
    }),

  /**
   * Track AI execution metrics
   */
  logAIExecution: tenantProcedure
    .input(
      z.object({
        voiceCommandId: z.string().uuid().optional(),
        model: z.string(),
        executionType: z.enum(['transcription', 'parsing', 'generation']),
        inputTokens: z.number().int().optional(),
        outputTokens: z.number().int().optional(),
        cost: z.number().optional(),
        latencyMs: z.number().int().optional(),
        request: z.any(),
        response: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.aIExecution.create({
        data: {
          tenantId: ctx.tenantId,
          voiceCommandId: input.voiceCommandId,
          model: input.model,
          executionType: input.executionType,
          inputTokens: input.inputTokens,
          outputTokens: input.outputTokens,
          cost: input.cost,
          latencyMs: input.latencyMs,
          request: input.request,
          response: input.response,
        },
      });
    }),

  /**
   * Get AI execution metrics for a tenant
   */
  getMetrics: tenantProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        executionType: z.enum(['transcription', 'parsing', 'generation']).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const where: any = {
        tenantId: ctx.tenantId,
      };

      if (input?.startDate || input?.endDate) {
        where.createdAt = {};
        if (input.startDate) where.createdAt.gte = input.startDate;
        if (input.endDate) where.createdAt.lte = input.endDate;
      }

      if (input?.executionType) {
        where.executionType = input.executionType;
      }

      const executions = await ctx.prisma.aIExecution.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      // Calculate aggregated metrics
      const totalExecutions = executions.length;
      const totalCost = executions.reduce((sum, e) => sum + (e.cost || 0), 0);
      const totalTokens = executions.reduce(
        (sum, e) => sum + (e.inputTokens || 0) + (e.outputTokens || 0),
        0
      );
      const avgLatency =
        executions.reduce((sum, e) => sum + (e.latencyMs || 0), 0) / (totalExecutions || 1);

      return {
        totalExecutions,
        totalCost,
        totalTokens,
        avgLatency,
        executions,
      };
    }),
});

/**
 * Parse natural language command into structured format
 */
function parseNaturalLanguageCommand(transcription: string): {
  action: string;
  entityType: string | null;
  entityId: string | null;
  parsedIntent: Record<string, any>;
  requiresConfirmation: boolean;
} {
  const lowerText = transcription.toLowerCase().trim();

  // Create event command
  if (lowerText.includes('create') && lowerText.includes('event')) {
    return {
      action: 'create',
      entityType: 'event',
      entityId: null,
      parsedIntent: { intent: 'Create a new event', transcription },
      requiresConfirmation: true,
    };
  }

  // List events command
  if (
    (lowerText.includes('show') || lowerText.includes('list') || lowerText.includes('get')) &&
    lowerText.includes('event')
  ) {
    return {
      action: 'query',
      entityType: 'event',
      entityId: null,
      parsedIntent: { intent: 'List all events', transcription },
      requiresConfirmation: false,
    };
  }

  // Create shift command
  if (lowerText.includes('create') && lowerText.includes('shift')) {
    return {
      action: 'create',
      entityType: 'shift',
      entityId: null,
      parsedIntent: { intent: 'Create a new shift', transcription },
      requiresConfirmation: true,
    };
  }

  // Assign operator command
  if (lowerText.includes('assign') && lowerText.includes('operator')) {
    return {
      action: 'update',
      entityType: 'shift',
      entityId: null,
      parsedIntent: { intent: 'Assign operator to shift', transcription },
      requiresConfirmation: true,
    };
  }

  // Check availability command
  if (lowerText.includes('check') && lowerText.includes('availab')) {
    return {
      action: 'query',
      entityType: 'operator',
      entityId: null,
      parsedIntent: { intent: 'Check operator availability', transcription },
      requiresConfirmation: false,
    };
  }

  // Default: unknown command
  return {
    action: 'query',
    entityType: null,
    entityId: null,
    parsedIntent: { intent: 'Unknown command', transcription },
    requiresConfirmation: true,
  };
}

/**
 * Execute parsed command via appropriate tRPC procedure
 */
async function executeCommand(
  ctx: any,
  action: string,
  entityType: string | null,
  parsedIntent: Record<string, any>
): Promise<any> {
  // Query actions
  if (action === 'query') {
    switch (entityType) {
      case 'event':
        return ctx.prisma.event.findMany({
          where: { tenantId: ctx.tenantId },
          include: { client: true },
          orderBy: { eventDate: 'asc' },
          take: 10,
        });

      case 'shift':
        return ctx.prisma.shift.findMany({
          where: { tenantId: ctx.tenantId },
          include: { event: true },
          orderBy: { startTime: 'desc' },
          take: 10,
        });

      case 'operator':
        return ctx.prisma.operator.findMany({
          where: {
            tenantId: ctx.tenantId,
            isActive: true,
          },
          take: 10,
        });

      default:
        throw new Error(`Unknown entity type for query: ${entityType}`);
    }
  }

  // Create actions
  if (action === 'create') {
    throw new Error(`Creation via voice for ${entityType} requires manual data entry`);
  }

  // Update actions
  if (action === 'update') {
    throw new Error(`Update via voice for ${entityType} requires manual data entry`);
  }

  // Delete actions
  if (action === 'delete') {
    throw new Error(`Deletion via voice requires confirmation and manual review`);
  }

  throw new Error(`Unknown action: ${action}`);
}
