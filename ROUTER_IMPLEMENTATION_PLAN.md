# Router Implementation Plan - Nov 17, 2025

## Context

Bootstrap build revealed that routers were created with TypeScript errors and missing procedures. All routers need to be properly implemented against the Prisma schema before frontend development can proceed.

## Current State Analysis

### Routers with Issues (15 total)

**Properly Implemented:**
- ✅ dashboard.ts - Has getSettings procedure (partial)

**Partially Fixed (compilation works, missing procedures):**
- ⚠️ deliverable.ts - Fixed types, needs full CRUD
- ⚠️ gear.ts - Fixed types, needs full CRUD
- ⚠️ gearAssignment.ts - Fixed types, needs full CRUD
- ⚠️ kit.ts - Fixed types, stubbed addGear/removeGear
- ⚠️ lead.ts - Fixed types, needs full CRUD
- ⚠️ operator.ts - Fixed types, needs full CRUD

**Stubbed (needs complete implementation):**
- ❌ event.ts - Only has list, needs 10+ procedures
- ❌ shift.ts - Only has list stub
- ❌ client.ts - Only has list stub
- ❌ communication.ts - Only has list stub
- ❌ settings.ts - Only has list stub
- ❌ user.ts - Only has list stub
- ❌ file.ts - All procedures stubbed/throw errors
- ❌ report.ts - All procedures stubbed

## Implementation Strategy

### Phase 0.7: Implement All tRPC Routers (NEW - HIGHEST PRIORITY)

**Goal:** Implement all 15 routers properly with full CRUD operations matching Prisma schema

**Approach:**
1. For each router, analyze Prisma schema to understand:
   - Required fields vs optional
   - Relations and includes
   - Enum values
   - Unique constraints

2. Implement standard CRUD procedures:
   - `list` - findMany with tenant filtering
   - `getById` - findFirst with tenant check
   - `create` - create with validation
   - `update` - update with ownership check
   - `delete` - soft delete (status = 'cancelled') or hard delete if appropriate

3. Implement domain-specific procedures based on schema relations

4. Write each procedure with:
   - Proper zod input validation
   - Tenant isolation (tenantId filter)
   - Error handling
   - Relation includes where needed

### Router-by-Router Implementation Order

**Priority 1: Core Entity Routers (Foundation)**
1. **event.ts** - Events are central to the system
   - list, getById, create, update, delete
   - getMonthView (for calendar)
   - getUpcoming, getPast
   - updateStatus (for event lifecycle)

2. **operator.ts** - Already partially done, complete it
   - Finish availability procedures
   - Add assignment history procedures

3. **gear.ts** - Inventory management
   - Complete CRUD
   - Add search/filter procedures
   - Add status tracking procedures

4. **client.ts** - Client/Lead management
   - Full CRUD
   - Search procedures
   - Contact history procedures

**Priority 2: Relationship Routers**
5. **shift.ts** - Event scheduling
   - Full CRUD
   - Assignment procedures
   - Conflict detection

6. **gearAssignment.ts** - Gear-to-event assignments
   - Complete assignment/unassignment
   - Availability checking

7. **kit.ts** - Fix addGear/removeGear properly
   - Use gearIds array manipulation
   - Validation procedures

**Priority 3: Supporting Routers**
8. **deliverable.ts** - Complete procedures
9. **lead.ts** - Complete CRM procedures
10. **communication.ts** - Email/messaging
11. **file.ts** - File management (may need FileAsset model added to schema)
12. **settings.ts** - Tenant settings CRUD
13. **user.ts** - User management CRUD

**Priority 4: Analytics**
14. **dashboard.ts** - Complete widget data procedures
15. **report.ts** - Revenue, utilization, performance reporting

### Procedure Count Estimate

Based on original BUILD_PROTOCOL comment "15 routers, ~110 procedures":
- Average 7 procedures per router
- Critical routers (event, operator, gear): 10-12 procedures each
- Simple routers (settings, user): 4-6 procedures each

### Success Criteria

For each router to be considered "complete":
- ✅ All procedures properly typed with zod schemas
- ✅ All procedures filter by tenantId
- ✅ All procedures handle errors appropriately
- ✅ All enum values match Prisma schema exactly
- ✅ All field names match Prisma schema exactly
- ✅ All relations properly included when needed
- ✅ Build passes TypeScript check
- ✅ No stub procedures or TODO comments

### Timeline Estimate

- Per router (simple): 30-45 minutes
- Per router (complex): 1-2 hours
- Total: 15-20 hours of implementation

**Recommendation:** Break into 3-4 sessions, 4-5 routers per session

## Post-Router Frontend Work

Once all routers are properly implemented:
- Frontend pages can be built knowing procedures exist
- Components can use tRPC hooks without errors
- Integration testing becomes possible

## Notes

This work should have been done during Phase 0 setup. The routers were created but never validated against the schema, causing cascade of TypeScript errors and missing functionality.
