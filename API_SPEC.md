# CommandCentered API Specification v1.0

**Date:** November 14, 2025
**Tech Stack:** Next.js 14 + tRPC v10 + Prisma + Supabase
**Total Endpoints:** ~110 procedures across 15 routers

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication & Context](#authentication--context)
3. [tRPC Router Structure](#trpc-router-structure)
4. [Router Specifications](#router-specifications)
   - [Event Router](#event-router)
   - [Shift Router](#shift-router)
   - [Operator Router](#operator-router)
   - [Gear Router](#gear-router)
   - [Kit Router](#kit-router)
   - [Lead Router](#lead-router)
   - [Communication Router](#communication-router)
   - [Dashboard Router](#dashboard-router)
   - [Deliverable Router](#deliverable-router)
   - [File Router](#file-router)
   - [Report Router](#report-router)
   - [Settings Router](#settings-router)
   - [OperatorPortal Router](#operatorportal-router)
   - [ShiftTemplate Router](#shifttemplate-router)
   - [GearDependency Router](#geardependency-router)
5. [Error Handling](#error-handling)
6. [Permissions](#permissions)
7. [Multi-Tenant Isolation](#multi-tenant-isolation)

---

## Architecture Overview

### tRPC Setup

```typescript
// src/server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server'
import { Context } from './context'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson, // Handles Date, BigInt, etc.
  errorFormatter({ shape }) {
    return shape
  },
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({ ctx: { ...ctx, user: ctx.user } })
})
export const tenantProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.tenantId) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'No tenant selected' })
  }
  return next({ ctx: { ...ctx, tenantId: ctx.tenantId } })
})
```

### Context

```typescript
// src/server/context.ts
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  let user = null
  let tenantId = null

  if (session?.user) {
    // Get UserProfile with tenantId
    const userProfile = await prisma.userProfile.findUnique({
      where: { authUserId: session.user.id },
      select: { id: true, tenantId: true, role: true, email: true }
    })

    user = userProfile
    tenantId = userProfile?.tenantId
  }

  return {
    prisma,
    user,
    tenantId,
    supabase,
    req,
    resHeaders,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
```

---

## tRPC Router Structure

```typescript
// src/server/routers/_app.ts
import { router } from '../trpc'
import { eventRouter } from './event'
import { shiftRouter } from './shift'
import { operatorRouter } from './operator'
import { gearRouter } from './gear'
import { kitRouter } from './kit'
import { leadRouter } from './lead'
import { communicationRouter } from './communication'
import { dashboardRouter } from './dashboard'
import { deliverableRouter } from './deliverable'
import { fileRouter } from './file'
import { reportRouter } from './report'
import { settingsRouter } from './settings'
import { operatorPortalRouter } from './operatorPortal'
import { shiftTemplateRouter } from './shiftTemplate'
import { gearDependencyRouter } from './gearDependency'

export const appRouter = router({
  event: eventRouter,
  shift: shiftRouter,
  operator: operatorRouter,
  gear: gearRouter,
  kit: kitRouter,
  lead: leadRouter,
  communication: communicationRouter,
  dashboard: dashboardRouter,
  deliverable: deliverableRouter,
  file: fileRouter,
  report: reportRouter,
  settings: settingsRouter,
  operatorPortal: operatorPortalRouter,
  shiftTemplate: shiftTemplateRouter,
  gearDependency: gearDependencyRouter,
})

export type AppRouter = typeof appRouter
```

---

## Router Specifications

### Event Router

**Used by:** Planning Page, Event Detail Modal

**Endpoints:** 10 procedures

```typescript
// src/server/routers/event.ts
import { router, tenantProcedure } from '../trpc'
import { z } from 'zod'

export const eventRouter = router({
  // List events (Planning Calendar)
  list: tenantProcedure
    .input(z.object({
      month: z.date().optional(),
      status: z.enum(['CONFIRMED', 'BOOKED', 'TENTATIVE', 'PROPOSAL']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          status: input.status,
          loadInTime: input.month ? {
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
      if (!event) throw new TRPCError({ code: 'NOT_FOUND' })
      return event
    }),

  // Create event
  create: tenantProcedure
    .input(z.object({
      eventName: z.string().min(1),
      eventType: z.enum(['RECITAL', 'CORPORATE', 'CONCERT', 'COMPETITION', 'OTHER']),
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
      eventType: z.enum(['RECITAL', 'CORPORATE', 'CONCERT', 'COMPETITION', 'OTHER']).optional(),
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

  // Get conflicts for event (date/time overlaps with operator assignments)
  getConflicts: tenantProcedure
    .input(z.object({
      eventId: z.string().uuid(),
      loadInTime: z.date(),
      loadOutTime: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      // Find all events that overlap with this time range
      const overlappingEvents = await ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          id: { not: input.eventId },
          OR: [
            { loadInTime: { lte: input.loadOutTime }, loadOutTime: { gte: input.loadInTime } }
          ]
        },
        include: {
          shifts: { include: { shiftAssignments: { include: { operator: true } } } }
        }
      })
      // Extract operators who are already assigned
      const busyOperators = overlappingEvents.flatMap(e =>
        e.shifts.flatMap(s => s.shiftAssignments.map(sa => sa.operator))
      )
      return { busyOperators, overlappingEvents }
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
        }
      })
    }),

  // Get missing alerts (missing operators or kits)
  getMissingAlerts: tenantProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findFirst({
        where: { id: input.eventId, tenantId: ctx.tenantId },
        include: {
          shifts: { include: { shiftAssignments: true } },
          gearAssignments: { include: { kit: true } }
        }
      })
      if (!event) throw new TRPCError({ code: 'NOT_FOUND' })

      const missingOperators = event.shifts.filter(s => s.shiftAssignments.length === 0)
      const missingKits = event.shifts.filter(s =>
        event.gearAssignments.filter(ga => ga.shiftId === s.id).length === 0
      )

      return { missingOperators, missingKits }
    }),
})
```

---

### Shift Router

**Used by:** Event Detail Modal (Shift Builder)

**Endpoints:** 8 procedures

```typescript
// src/server/routers/shift.ts
export const shiftRouter = router({
  // Create shift manually
  create: tenantProcedure
    .input(z.object({
      eventId: z.string().uuid(),
      shiftName: z.string().min(1),
      startTime: z.date(),
      endTime: z.date(),
      rolesNeeded: z.array(z.enum(['LEAD', 'CAMERA_OP', 'AUDIO', 'LIGHTING'])).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.shift.create({
        data: { ...input, tenantId: ctx.tenantId }
      })
    }),

  // Create shifts from template (Q2, Q5: Shift builder templates)
  createFromTemplate: tenantProcedure
    .input(z.object({
      eventId: z.string().uuid(),
      templateId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get template
      const template = await ctx.prisma.shiftTemplate.findFirst({
        where: { id: input.templateId, tenantId: ctx.tenantId }
      })
      if (!template) throw new TRPCError({ code: 'NOT_FOUND' })

      // Get event for date context
      const event = await ctx.prisma.event.findFirst({
        where: { id: input.eventId, tenantId: ctx.tenantId }
      })
      if (!event) throw new TRPCError({ code: 'NOT_FOUND' })

      // Parse shiftsConfig and create shifts
      const shiftsConfig = template.shiftsConfig as Array<{
        shiftName: string
        offsetMinutes: number // Minutes from event loadInTime
        durationMinutes: number
        rolesNeeded: string[]
      }>

      const shifts = await Promise.all(
        shiftsConfig.map(config =>
          ctx.prisma.shift.create({
            data: {
              tenantId: ctx.tenantId,
              eventId: input.eventId,
              shiftName: config.shiftName,
              startTime: new Date(event.loadInTime.getTime() + config.offsetMinutes * 60000),
              endTime: new Date(event.loadInTime.getTime() + (config.offsetMinutes + config.durationMinutes) * 60000),
              rolesNeeded: config.rolesNeeded,
            }
          })
        )
      )

      return shifts
    }),

  // Assign operator to shift
  assign: tenantProcedure
    .input(z.object({
      shiftId: z.string().uuid(),
      operatorId: z.string().uuid(),
      role: z.enum(['LEAD', 'CAMERA_OP', 'AUDIO', 'LIGHTING', 'ASSISTANT']),
      payType: z.enum(['HOURLY', 'FLAT_RATE']),
      hourlyRate: z.number().optional(),
      estimatedHours: z.number().optional(),
      flatRate: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { shiftId, operatorId, role, payType, ...payFields } = input

      // Calculate pay
      let calculatedPay = 0
      if (payType === 'HOURLY' && payFields.hourlyRate && payFields.estimatedHours) {
        calculatedPay = payFields.hourlyRate * payFields.estimatedHours
      } else if (payType === 'FLAT_RATE' && payFields.flatRate) {
        calculatedPay = payFields.flatRate
      }

      return ctx.prisma.shiftAssignment.create({
        data: {
          tenantId: ctx.tenantId,
          shiftId,
          operatorId,
          role,
          payType,
          ...payFields,
          calculatedPay,
        }
      })
    }),

  // Unassign operator from shift
  unassign: tenantProcedure
    .input(z.object({ shiftAssignmentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.shiftAssignment.delete({
        where: { id: input.shiftAssignmentId, tenantId: ctx.tenantId }
      })
    }),

  // Update shift
  update: tenantProcedure
    .input(z.object({
      id: z.string().uuid(),
      shiftName: z.string().optional(),
      startTime: z.date().optional(),
      endTime: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.shift.update({
        where: { id, tenantId: ctx.tenantId },
        data
      })
    }),

  // Delete shift
  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.shift.delete({
        where: { id: input.id, tenantId: ctx.tenantId }
      })
    }),

  // Get conflicts for shift (Q4: Overlap-only logic)
  getConflicts: tenantProcedure
    .input(z.object({
      shiftId: z.string().uuid().optional(),
      operatorId: z.string().uuid(),
      startTime: z.date(),
      endTime: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      // Find overlapping shift assignments for this operator
      const conflicts = await ctx.prisma.shiftAssignment.findMany({
        where: {
          tenantId: ctx.tenantId,
          operatorId: input.operatorId,
          shift: {
            id: input.shiftId ? { not: input.shiftId } : undefined,
            // Overlap logic: startTime < input.endTime AND endTime > input.startTime
            startTime: { lt: input.endTime },
            endTime: { gt: input.startTime }
          }
        },
        include: {
          shift: { include: { event: true } },
          operator: true
        }
      })

      return conflicts
    }),
})
```

---

### Kit Router

**Used by:** Kit Creation Modal, Planning Page

**Endpoints:** 7 procedures

```typescript
// src/server/routers/kit.ts
export const kitRouter = router({
  // List kits
  list: tenantProcedure
    .input(z.object({
      isActive: z.boolean().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gearKit.findMany({
        where: {
          tenantId: ctx.tenantId,
          isActive: input.isActive,
        },
        orderBy: { kitName: 'asc' }
      })
    }),

  // Get kit by ID
  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const kit = await ctx.prisma.gearKit.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId }
      })
      if (!kit) throw new TRPCError({ code: 'NOT_FOUND' })

      // Get actual gear items
      const gear = await ctx.prisma.gear.findMany({
        where: { id: { in: kit.gearIds }, tenantId: ctx.tenantId },
        include: {
          gearDependencies: { include: { dependentGear: true } }
        }
      })

      return { ...kit, gear }
    }),

  // Create kit (Q11: Step-by-step kit creation)
  create: tenantProcedure
    .input(z.object({
      kitName: z.string().min(1),
      description: z.string().optional(),
      gearIds: z.array(z.string().uuid()),
      linkToEventId: z.string().uuid().optional(), // Q11: Instant assignment
    }))
    .mutation(async ({ ctx, input }) => {
      const { linkToEventId, ...kitData } = input

      // Create kit
      const kit = await ctx.prisma.gearKit.create({
        data: {
          ...kitData,
          tenantId: ctx.tenantId,
        }
      })

      // If linked to event, create gear assignments
      if (linkToEventId) {
        await Promise.all(
          input.gearIds.map(gearId =>
            ctx.prisma.gearAssignment.create({
              data: {
                tenantId: ctx.tenantId,
                eventId: linkToEventId,
                gearId,
                kitId: kit.id,
                packStatus: 'NEEDS_PACKING',
              }
            })
          )
        )
      }

      return kit
    }),

  // Update kit
  update: tenantProcedure
    .input(z.object({
      id: z.string().uuid(),
      kitName: z.string().optional(),
      description: z.string().optional(),
      gearIds: z.array(z.string().uuid()).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.gearKit.update({
        where: { id, tenantId: ctx.tenantId },
        data
      })
    }),

  // Delete kit
  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.gearKit.delete({
        where: { id: input.id, tenantId: ctx.tenantId }
      })
    }),

  // Get recommendations for event type (Q9: Event-type suggestions)
  getRecommendations: tenantProcedure
    .input(z.object({
      eventType: z.enum(['RECITAL', 'CORPORATE', 'CONCERT', 'COMPETITION', 'OTHER']),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.eventTypeGearRecommendation.findMany({
        where: {
          tenantId: ctx.tenantId,
          eventType: input.eventType,
        },
        include: { gear: true },
        orderBy: { priority: 'desc' }
      })
    }),
})
```

---

### Lead Router

**Used by:** Pipeline Page

**Endpoints:** 8 procedures

```typescript
// src/server/routers/lead.ts
export const leadRouter = router({
  // List leads
  list: tenantProcedure
    .input(z.object({
      status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'ENGAGED', 'WON', 'LOST']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.lead.findMany({
        where: {
          tenantId: ctx.tenantId,
          status: input.status,
        },
        include: {
          leadProducts: true, // Q6, Q7: 4-product tracking
          communicationTouchpoints: true, // Q13: 8 touchpoints
        },
        orderBy: { nextFollowUpAt: 'asc' }
      })
    }),

  // Get lead by ID
  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.findFirst({
        where: { id: input.id, tenantId: ctx.tenantId },
        include: {
          leadProducts: true,
          communicationTouchpoints: true,
          notes: { orderBy: { createdAt: 'desc' } },
          proposals: true,
        }
      })
      if (!lead) throw new TRPCError({ code: 'NOT_FOUND' })
      return lead
    }),

  // Create lead
  create: tenantProcedure
    .input(z.object({
      email: z.string().email(),
      organization: z.string().optional(),
      contactName: z.string().optional(),
      phone: z.string().optional(),
      source: z.string().optional(),
      productNames: z.array(z.string()).optional(), // Q6: Which products they're interested in
    }))
    .mutation(async ({ ctx, input }) => {
      const { productNames, ...leadData } = input

      // Create lead
      const lead = await ctx.prisma.lead.create({
        data: {
          ...leadData,
          tenantId: ctx.tenantId,
          status: 'NEW',
        }
      })

      // Create LeadProduct records for interested products (Q10: 4-product tracking)
      if (productNames && productNames.length > 0) {
        await Promise.all(
          productNames.map(productName =>
            ctx.prisma.leadProduct.create({
              data: {
                tenantId: ctx.tenantId,
                leadId: lead.id,
                productName,
                isInterested: true,
                status: 'DISCUSSING',
              }
            })
          )
        )
      }

      return lead
    }),

  // Update lead
  update: tenantProcedure
    .input(z.object({
      id: z.string().uuid(),
      status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'ENGAGED', 'WON', 'LOST']).optional(),
      lastContactedAt: z.date().optional(),
      nextFollowUpAt: z.date().optional(),
      contactFrequency: z.string().optional(), // Q13: CRM field
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.lead.update({
        where: { id, tenantId: ctx.tenantId },
        data
      })
    }),

  // Update product status (Q7: Multi-depth product tracking)
  updateProductStatus: tenantProcedure
    .input(z.object({
      leadId: z.string().uuid(),
      productName: z.string(),
      isInterested: z.boolean().optional(),
      status: z.enum(['NOT_INTERESTED', 'DISCUSSING', 'PROPOSAL', 'WON', 'LOST']).optional(),
      revenueAmount: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { leadId, productName, ...data } = input

      // Upsert (create or update)
      return ctx.prisma.leadProduct.upsert({
        where: {
          leadId_productName: { leadId, productName }
        },
        update: data,
        create: {
          tenantId: ctx.tenantId,
          leadId,
          productName,
          ...data,
        }
      })
    }),

  // Log contact (Q13: Communication touchpoints)
  logContact: tenantProcedure
    .input(z.object({
      leadId: z.string().uuid(),
      touchpointType: z.enum([
        'INITIAL_CONTACT', 'PROPOSAL_SENT', 'CONTRACT_SENT', 'CONTRACT_SIGNED',
        'QUESTIONNAIRE_SENT', 'QUESTIONNAIRE_COMPLETED', 'INVOICE_SENT', 'INVOICE_PAID',
        'PRE_EVENT_REMINDER', 'POST_EVENT_FOLLOWUP', 'REBOOKING_OUTREACH'
      ]),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.communicationTouchpoint.create({
        data: {
          ...input,
          tenantId: ctx.tenantId,
          status: 'COMPLETED',
          completedAt: new Date(),
        }
      })
    }),
})
```

---

### Dashboard Router

**Used by:** Dashboard Page

**Endpoints:** 5 procedures

```typescript
// src/server/routers/dashboard.ts
export const dashboardRouter = router({
  // Get widget preferences (Q15: Dashboard customization)
  getWidgetPreferences: tenantProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.dashboardWidgetPreference.findMany({
        where: {
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
        },
        orderBy: { sortOrder: 'asc' }
      })
    }),

  // Update widget preference (Q15: Show/hide widgets)
  updateWidgetPreference: tenantProcedure
    .input(z.object({
      widgetType: z.string(),
      isVisible: z.boolean().optional(),
      position: z.object({ x: z.number(), y: z.number() }).optional(),
      size: z.object({ w: z.number(), h: z.number() }).optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { widgetType, ...data } = input

      return ctx.prisma.dashboardWidgetPreference.upsert({
        where: {
          userId_widgetType: { userId: ctx.user.id, widgetType }
        },
        update: data,
        create: {
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
          widgetType,
          ...data,
        }
      })
    }),

  // Get event pipeline stats
  getEventPipeline: tenantProcedure
    .query(async ({ ctx }) => {
      const counts = await ctx.prisma.event.groupBy({
        by: ['status'],
        where: { tenantId: ctx.tenantId },
        _count: true
      })
      return counts
    }),

  // Get annual revenue
  getAnnualRevenue: tenantProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      const startDate = new Date(input.year, 0, 1)
      const endDate = new Date(input.year + 1, 0, 1)

      const result = await ctx.prisma.event.aggregate({
        where: {
          tenantId: ctx.tenantId,
          loadInTime: { gte: startDate, lt: endDate },
          status: 'COMPLETED',
        },
        _sum: { actualRevenue: true }
      })

      return result._sum.actualRevenue || 0
    }),

  // Get upcoming events (next 7 days)
  getUpcomingEvents: tenantProcedure
    .query(async ({ ctx }) => {
      const today = new Date()
      const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

      return ctx.prisma.event.findMany({
        where: {
          tenantId: ctx.tenantId,
          loadInTime: { gte: today, lt: next7Days }
        },
        include: {
          shifts: { include: { shiftAssignments: { include: { operator: true } } } }
        },
        orderBy: { loadInTime: 'asc' },
        take: 3
      })
    }),
})
```

---

## Error Handling

### Standard Error Codes

```typescript
// TRPCError codes we use
type ErrorCode =
  | 'UNAUTHORIZED'      // Not logged in
  | 'FORBIDDEN'         // No permission (wrong tenant)
  | 'NOT_FOUND'         // Resource doesn't exist
  | 'BAD_REQUEST'       // Invalid input
  | 'CONFLICT'          // Resource conflict (e.g., double booking)
  | 'INTERNAL_SERVER_ERROR' // Something broke

// Example usage
if (!event) {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: 'Event not found'
  })
}

if (conflicts.length > 0) {
  throw new TRPCError({
    code: 'CONFLICT',
    message: 'Operator already assigned to another shift at this time',
    cause: conflicts
  })
}
```

### Client-Side Error Handling

```typescript
// In React component
const createEvent = trpc.event.create.useMutation({
  onSuccess: () => {
    toast.success('Event created!')
    router.push('/dashboard/planning')
  },
  onError: (error) => {
    if (error.data?.code === 'CONFLICT') {
      toast.error('Time conflict detected')
    } else {
      toast.error(error.message || 'Failed to create event')
    }
  }
})
```

---

## Permissions

### Role-Based Access

```typescript
// User roles (from schema.prisma)
enum UserRole {
  SUPER_ADMIN        // Full access, can impersonate
  ADMIN              // Tenant admin
  OPERATOR           // Can view/update own shifts
}

// Permission middleware
const adminProcedure = tenantProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== 'ADMIN' && ctx.user.role !== 'SUPER_ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next()
})

// Example usage
export const settingsRouter = router({
  update: adminProcedure // Only admins can update settings
    .input(...)
    .mutation(...)
})
```

---

## Multi-Tenant Isolation

### Automatic Filtering

**CRITICAL: Every query MUST filter by tenantId**

```typescript
// ❌ BAD - No tenant filter
await ctx.prisma.event.findMany()

// ✅ GOOD - Tenant filtered
await ctx.prisma.event.findMany({
  where: { tenantId: ctx.tenantId }
})

// ✅ BETTER - Use tenantProcedure (enforces tenantId in context)
tenantProcedure
  .query(async ({ ctx }) => {
    // ctx.tenantId is guaranteed to exist
    return ctx.prisma.event.findMany({
      where: { tenantId: ctx.tenantId }
    })
  })
```

### RLS Policies (Supabase)

**Backup defense:** Even if application code fails to filter, database RLS blocks cross-tenant access.

```sql
-- Example RLS policy for events table
CREATE POLICY "Users can only see events from their tenant"
ON events
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM user_profiles
    WHERE auth_user_id = auth.uid()
  )
);
```

---

## Next Steps

**Day 3-5:** Implement these routers one by one
**Week 3:** Build frontend pages that call these endpoints
**Week 4:** Add remaining routers (Deliverable, File, Report, Settings, etc.)

**Total Implementation:** ~2,500 lines of tRPC code across 15 routers

---

**Status:** ✅ SPECIFICATION COMPLETE
**Ready for implementation:** YES
**Next:** Create AUTH_DESIGN.md
