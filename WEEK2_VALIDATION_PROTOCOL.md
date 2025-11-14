# Week 2 Validation Protocol - Schema to Mockup Alignment

**Date:** November 13, 2025
**Purpose:** Ensure first build matches mockups perfectly
**Status:** Ready for execution after interview answers

---

## Overview

Week 2 is the **CRITICAL GATE** between design and implementation. We will validate that:
1. Every UI element in mockups has a database home
2. Every API endpoint is documented
3. Multi-tenant isolation is bulletproof
4. All integrations work before coding begins

**If Week 2 validation fails → DO NOT proceed to Week 3 backend build.**

---

## Validation Checklist (Must Complete ALL)

### Phase 1: Mockup-to-Schema Mapping (Days 1-2)

**Create:** `MOCKUP_SCHEMA_CROSSCHECK.md`

For EVERY mockup page, document:

```markdown
## Dashboard Page

### Event Pipeline Widget
- [ ] Event name → events.name (VARCHAR)
- [ ] Event status → events.status (ENUM: proposal_sent, contract_signed, etc.)
- [ ] Client name → clients.company_name (VARCHAR)
- [ ] Stage count → COUNT(*) GROUP BY events.status
- [ ] Click event → Navigate to /planning?event_id={id}
- [ ] Drag to reorder → user_preferences.dashboard_layout (JSONB)

### Annual Revenue Widget
- [ ] Total revenue → SUM(invoices.amount_paid WHERE tenant_id = current_tenant)
- [ ] Monthly breakdown → GROUP BY MONTH(invoices.paid_at)
- [ ] Progress bar calculation → (current_revenue / user_preferences.annual_goal) * 100
- [ ] Goal amount → user_preferences.annual_revenue_goal (JSONB)
```

**Repeat for ALL 11 main pages + 4 operator portal pages = 15 total pages**

**Output:** List of any fields without a schema home → add to schema

---

### Phase 2: Multi-Tenant Verification (Day 2)

**Verify EVERY table has tenant_id:**

```bash
# Run this query on schema.prisma
grep -n "model " schema.prisma | while read line; do
  model_name=$(echo $line | awk '{print $2}')
  has_tenant=$(grep -A 20 "model $model_name" schema.prisma | grep "tenant_id")

  if [ -z "$has_tenant" ] && [ "$model_name" != "Tenant" ]; then
    echo "❌ MISSING tenant_id: $model_name"
  else
    echo "✅ $model_name"
  fi
done
```

**Expected exceptions (no tenant_id):**
- `Tenant` (the tenant table itself)
- `AuditLog` (cross-tenant audit, has tenant_id reference but not filtered)

**All other tables MUST have:**
```prisma
model Event {
  id        String   @id @default(uuid())
  tenant_id String   // REQUIRED
  tenant    Tenant   @relation(fields: [tenant_id], references: [id], onDelete: Cascade)
  // ... other fields

  @@index([tenant_id])  // Performance index
}
```

---

### Phase 3: RLS Policy Creation (Day 2-3)

**Create RLS policies for ALL tables:**

```sql
-- Template for each table
CREATE POLICY tenant_isolation_events ON events
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
```

**Script to generate all policies:**
```bash
# scripts/generate_rls_policies.sh
#!/bin/bash

TABLES=$(psql $DATABASE_URL -t -c "
  SELECT tablename FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename NOT IN ('tenants', 'audit_log')
")

for table in $TABLES; do
  echo "CREATE POLICY tenant_isolation_${table} ON ${table}
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

  ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;
  "
done
```

**Test isolation:**
```sql
-- Test script: scripts/test_tenant_isolation.sql
BEGIN;

-- Create 2 test tenants
INSERT INTO tenants (id, subdomain, company_name) VALUES
  ('test-a', 'testa', 'Test A'),
  ('test-b', 'testb', 'Test B');

-- Create test events
INSERT INTO events (id, tenant_id, name) VALUES
  ('event-a1', 'test-a', 'Event A1'),
  ('event-b1', 'test-b', 'Event B1');

-- Set context to tenant A
SELECT set_config('app.current_tenant_id', 'test-a', false);

-- Query should only see Event A1
SELECT COUNT(*) FROM events;  -- Expected: 1

-- Direct query for B1 should be blocked
SELECT COUNT(*) FROM events WHERE id = 'event-b1';  -- Expected: 0

-- Switch to tenant B
SELECT set_config('app.current_tenant_id', 'test-b', false);

-- Now should only see Event B1
SELECT COUNT(*) FROM events;  -- Expected: 1

ROLLBACK;  -- Clean up test data
```

---

### Phase 4: API Endpoint Documentation (Day 3)

**Create:** `API_SPEC.md`

Document EVERY API endpoint the frontend will call:

```typescript
// Dashboard
GET    /api/dashboard/events-pipeline
  → Returns: { proposal_sent: Event[], contract_signed: Event[], ... }
  → Filters: tenant_id (from auth context)

GET    /api/dashboard/annual-revenue
  → Returns: { total: number, monthly: { month: string, amount: number }[] }
  → Filters: tenant_id, year (optional)

// Pipeline
GET    /api/leads
  → Returns: Lead[] (filtered by tenant_id)

PATCH  /api/leads/{id}
  → Body: { field: string, value: any }
  → Updates: Single field inline edit
  → Validates: tenant_id matches

POST   /api/leads
  → Body: Partial<Lead>
  → Returns: Lead
  → Auto-sets: tenant_id from auth

// Planning
GET    /api/events?view=calendar&month=2026-03
  → Returns: Event[] with operators/kits

POST   /api/events/{id}/assign-operator
  → Body: { operator_id: string, shift_id?: string }
  → Returns: { success: boolean, conflicts?: Conflict[] }
  → Validates: operator.tenant_id === event.tenant_id

GET    /api/operators/availability?date=2026-03-15
  → Returns: { operator_id: string, available: boolean, conflicts: Event[] }[]

// Deliverables
GET    /api/deliverables
  → Returns: Deliverable[] with folder links

GET    /api/deliverables/{id}/folder-link
  → Returns: { folder_url: string, folder_id: string }
  → Calls: Google Drive API

// Integrations
POST   /api/integrations/vimeo/create-livestream
  → Body: { event_id: string }
  → Returns: { vimeo_event_id, stream_key, rtmp_url, embed_code }
  → Calls: Vimeo API

POST   /api/integrations/telegram/create-group
  → Body: { event_id: string, operator_ids: string[] }
  → Returns: { group_id: string, invite_link: string }
  → Calls: Telegram API
```

**Total estimated endpoints:** ~80-100 across all pages

---

### Phase 5: Integration Smoke Tests (Day 3-4)

**Test EVERY external integration BEFORE building UI:**

**Vimeo API:**
```bash
# Test script: scripts/test_vimeo_integration.sh
#!/bin/bash

VIMEO_TOKEN="your_vimeo_token"

# Create livestream event
curl -X POST https://api.vimeo.com/me/live_events \
  -H "Authorization: Bearer $VIMEO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "streaming_privacy": "unlisted"
  }'

# Expected: 201 Created with stream_key, rtmp_url
# If fail: Check token permissions, Vimeo plan tier
```

**Google Drive API:**
```bash
# Test script: scripts/test_drive_integration.sh
#!/bin/bash

DRIVE_TOKEN="your_drive_token"

# Create folder
curl -X POST https://www.googleapis.com/drive/v3/files \
  -H "Authorization: Bearer $DRIVE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "mimeType": "application/vnd.google-apps.folder"
  }'

# Expected: 200 OK with folder id
# If fail: Check OAuth scopes, API enabled
```

**Telegram API:**
```bash
# Test script: scripts/test_telegram_integration.sh
#!/bin/bash

BOT_TOKEN="your_telegram_bot_token"

# Create group
curl "https://api.telegram.org/bot$BOT_TOKEN/createGroup" \
  -d "name=Test Event Group"

# Expected: Success with group_id
# If fail: Check bot token, bot permissions
```

**Gmail API:**
```bash
# Test script: scripts/test_gmail_integration.sh
#!/bin/bash

GMAIL_TOKEN="your_gmail_token"

# Watch for emails
curl -X POST https://www.googleapis.com/gmail/v1/users/me/watch \
  -H "Authorization: Bearer $GMAIL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topicName": "projects/your-project/topics/gmail-events",
    "labelIds": ["SENT"]
  }'

# Expected: 200 OK with history_id
# If fail: Check OAuth scopes, Pub/Sub topic exists
```

**ALL integrations must pass before Week 3.**

---

### Phase 6: Prisma Schema Validation (Day 4)

**Run validation commands:**

```bash
cd backend

# 1. Validate schema syntax
npx prisma validate
# Expected: ✅ "The schema is valid"

# 2. Format schema
npx prisma format
# Expected: ✅ "Formatted 1 file"

# 3. Generate Prisma Client
npx prisma generate
# Expected: ✅ "Generated Prisma Client"

# 4. Create migration (don't apply yet, just test)
npx prisma migrate dev --create-only --name week2_validation
# Expected: Migration file created, inspect for errors

# 5. Check migration SQL
cat prisma/migrations/*/migration.sql
# Look for:
# - All tables have tenant_id
# - All indexes include tenant_id
# - All foreign keys reference tenant_id
```

**If ANY validation fails → fix schema before Week 3.**

---

### Phase 7: TypeScript Type Safety (Day 4-5)

**Create component stubs to verify types:**

```typescript
// components/Dashboard/EventPipelineWidget.tsx
import { Event } from '@prisma/client';

interface EventPipelineProps {
  events: Event[];  // Generated from Prisma schema
}

export function EventPipelineWidget({ events }: EventPipelineProps) {
  // Stub implementation
  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          {event.name} - {event.status}
          {/* TypeScript will error if event.name or event.status don't exist */}
        </div>
      ))}
    </div>
  );
}
```

**Run type check:**
```bash
npm run type-check
# Expected: ✅ No errors

# If errors: Schema doesn't match component expectations
# Fix schema or component types
```

---

### Phase 8: Missing Fields Report (Day 5)

**Create:** `SCHEMA_GAPS_REPORT.md`

```markdown
## Fields in Mockups NOT in Schema

### Dashboard
- ❌ user_preferences.annual_revenue_goal (JSONB field needed)
  - Action: Add to user_preferences JSONB column
  - Migration: None (JSONB is flexible)

### Deliverables
- ❌ deliverables.folder_link (VARCHAR needed)
  - Action: Add column to deliverables table
  - Migration: ALTER TABLE deliverables ADD COLUMN folder_link VARCHAR(500);

### Planning
- ❌ event_shifts table (NEW TABLE needed)
  - Action: Create event_shifts table with shift times
  - Migration: CREATE TABLE event_shifts (...)

- ❌ shift_operators junction table (NEW TABLE needed)
  - Action: Create shift_operators for many-to-many
  - Migration: CREATE TABLE shift_operators (...)

## Schema Changes Needed

1. Add deliverables.folder_link column
2. Create event_shifts table
3. Create shift_operators table
4. Add gear_dependencies table (if interview confirms)
5. Add client_products table (if interview confirms)

## Estimated Impact
- New tables: 2-4
- New columns: 5-10
- Migration complexity: Low
- Breaking changes: None (additive only)
```

---

## Week 2 Final Checklist

**Day 1-2: Schema Mapping**
- [ ] MOCKUP_SCHEMA_CROSSCHECK.md complete (15 pages)
- [ ] All UI elements mapped to schema fields
- [ ] SCHEMA_GAPS_REPORT.md created

**Day 2-3: Multi-Tenant Setup**
- [ ] Every table has tenant_id (verified)
- [ ] RLS policies created for ALL tables
- [ ] RLS isolation tested (tenant A can't see tenant B)
- [ ] StreamStage seed script ready

**Day 3-4: Integration Testing**
- [ ] Vimeo API smoke test passes
- [ ] Google Drive API smoke test passes
- [ ] Telegram API smoke test passes
- [ ] Gmail API smoke test passes

**Day 4: Schema Validation**
- [ ] `npx prisma validate` passes
- [ ] `npx prisma generate` succeeds
- [ ] TypeScript type check passes
- [ ] Test migration created successfully

**Day 5: Documentation & Approval**
- [ ] API_SPEC.md complete (~80-100 endpoints)
- [ ] SCHEMA_GAPS_REPORT.md reviewed
- [ ] All gaps fixed in schema
- [ ] User reviews and approves

**GATE: If ANY item above fails → DO NOT proceed to Week 3.**

---

## Success Criteria

✅ **Every mockup element has database home**
✅ **Multi-tenant isolation proven**
✅ **All integrations working**
✅ **Schema validates**
✅ **Types compile**
✅ **User approves**

**Result:** Week 3 Day 1 first migration runs successfully, no Prisma errors.

---

## Estimated Time

- Day 1: Mockup mapping (4-6 hours)
- Day 2: Multi-tenant verification (4-6 hours)
- Day 3: Integration testing (4-6 hours)
- Day 4: Prisma validation (2-4 hours)
- Day 5: Gaps report + fixes (4-6 hours)

**Total:** 18-28 hours (aggressive but doable in 5 days)

---

## Risk Mitigation

**If integration fails:**
- Document blocker in BLOCKER_WEEK2.md
- Research alternative approach
- Ask user for clarification
- Don't block on single integration

**If schema gaps are large:**
- Prioritize by mockup page (Dashboard first)
- Add tables incrementally
- Test each migration before proceeding

**If types don't match:**
- Fix schema first (source of truth)
- Regenerate types
- Update component stubs

---

**This protocol ensures first build matches mockups perfectly.**
