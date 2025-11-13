# CommandCentered - Schema Naming Convention LOCKED

**Date:** 2025-01-09
**Status:** 🔒 LOCKED - Ready for Implementation Review
**Purpose:** Enforce consistent naming across 39 database tables

---

## 🚨 CRITICAL ISSUES FOUND

### Issue 1: Singular vs Plural Inconsistency

**Current State:**
- Phase 2: PLURAL (operators, vehicles, events, shifts, drills)
- Phase 3: SINGULAR (leads, proposals, contracts, clients, invoices, payments)

**Decision Required:** Pick ONE convention for ALL entity tables.

**Recommendation:** **PLURAL** (industry standard: Rails, Laravel, Django)

### Issue 2: Junction Table Naming

**Current Patterns:**
- Descriptive: `shift_assignments`, `gear_assignments` ✅
- Entity-Entity: `drill_attendees` (was training_attendees) ✅
- Possessive: `operator_gear`, `operator_skills` ⚠️

**Decision Required:** Clarify when to use each pattern.

### Issue 3: History/Tracking Table Suffixes

**Current Patterns:**
- `operator_skill_history` (suffix: _history)
- `gear_tracking_log` (suffix: _tracking_log)
- `deliverable_revisions` (suffix: _revisions)
- `email_tracking` (no suffix, just tracking)

**Decision Required:** Standardize suffix naming.

---

## 📋 PROPOSED NAMING CONVENTION

### Rule 1: Entity Tables = PLURAL

**All main entity tables use plural names.**

✅ **Correct:**
```
operators
events
shifts
gear
vehicles
clients
contracts
```

❌ **Incorrect:**
```
operator
event
shift
equipment (singular form)
client
contract
```

### Rule 2: Junction/Join Tables = Descriptive Action

**Use descriptive action names that clarify the relationship.**

✅ **Correct:**
```
shift_assignments (operators assigned to shifts)
gear_assignments (gear assigned to events)
drill_attendees (operators attending drills)
contract_signatures (signatures on contracts)
```

❌ **Incorrect:**
```
shifts_operators (unclear relationship)
gear_events (unclear relationship)
operators_drills (unclear relationship)
```

### Rule 3: Owned/Related Data = `parent_attribute` Pattern

**When data belongs to a parent entity, use prefix pattern.**

✅ **Correct:**
```
operator_skills (skills belonging to operators)
operator_gear (gear owned by operators)
operator_blackout_dates (blackout dates for operators)
proposal_line_items (line items in proposals)
invoice_line_items (line items in invoices)
```

### Rule 4: History/Audit Tables = `_history` Suffix

**All audit trail tables use `_history` suffix.**

✅ **Correct:**
```
operator_skill_history
gear_movement_history (instead of gear_tracking_log)
deliverable_revision_history (instead of deliverable_revisions)
```

❌ **Incorrect:**
```
gear_tracking_log (inconsistent suffix)
deliverable_revisions (no _history suffix)
```

### Rule 5: Configuration Tables = PLURAL

**All configuration/definition tables use plural.**

✅ **Correct:**
```
skill_definitions
proposal_templates
gear_kits
system_settings (exception: settings is already plural-ish)
```

### Rule 6: Tracking Tables = `_tracking` Suffix

**Tables that track engagement/status use `_tracking` suffix.**

✅ **Correct:**
```
email_tracking
payment_tracking (if we had one)
```

---

## 🗄️ COMPLETE TABLE LIST (39 Tables)

### Phase 1: Foundation (2 tables)

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 1 | `tenants` | PLURAL | ✅ Correct | Multi-tenant isolation |
| 2 | `user_profiles` | PLURAL | ✅ Correct | Auth.users extension |

### Phase 2: Logistics - Suite 2 (25 tables) ✅ Updated v2.3

**Events & Shifts:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 3 | `events` | PLURAL | ✅ Correct | Main event records |
| 4 | `shifts` | PLURAL | ✅ Correct | Work sessions within events |
| 5 | `shift_assignments` | DESCRIPTIVE | ✅ Correct | Operators → Shifts with role & pay |

**Operators:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 6 | `operators` | PLURAL | ✅ Correct | Crew members |
| 7 | `operator_blackout_dates` | OWNED DATA | ✅ Correct | Unavailable periods |
| 8 | `operator_skills` | OWNED DATA | ✅ Correct | Skill ratings per operator |
| 9 | `operator_skill_history` | HISTORY | ✅ Correct | Skill upgrade audit trail |
| 10 | `operator_gear` | OWNED DATA | ✅ Correct | Personal gear inventory |
| 11 | `operator_gear_requests` | OWNED DATA | ✅ Correct | Requests for personal gear per shift |

**Skills & Drills:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 12 | `skill_definitions` | CONFIG | ✅ Correct | Tenant-defined skills |
| 13 | `drills` | PLURAL | ✅ Correct | Training sessions (was trainings) |
| 14 | `drill_attendees` | JUNCTION | ✅ Correct | Who attended which drill |
| 15 | `drill_agenda_items` | OWNED DATA | ✅ Correct | Drill curriculum line items |

**Gear & Vehicles:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 16 | `gear` | PLURAL | ✅ Correct | Company gear (was equipment) |
| 17 | `gear_tracking_log` | HISTORY | ⚠️ RENAME | → `gear_movement_history` |
| 18 | `gear_assignments` | DESCRIPTIVE | ✅ Correct | Gear → Events |
| 19 | `vehicles` | PLURAL | ✅ Correct | Company vehicles |
| 20 | `gear_kits` | CONFIG | ✅ Correct | Pre-defined loadouts (was equipment_templates) |

**Post-Production (Phase 2.4):**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 21 | `deliverables` | PLURAL | ✅ Correct | Parent deliverable tracking |
| 22 | `deliverable_assets` | OWNED DATA | ✅ Correct | Individual items within deliverable |
| 23 | `editors` | PLURAL | ✅ Correct | Post-production editors |
| 24 | `bounties` | PLURAL | ✅ Correct | Incentive system for rush work |
| 25 | `client_notes` | OWNED DATA | ✅ Correct | Client communication tracking |
| 26 | `deliverable_revisions` | OWNED DATA | ⚠️ RENAME | → `deliverable_revision_history` |

**Alerts:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 27 | `alerts` | PLURAL | ✅ Correct | System-wide alerts (shared Phase 2 + 3) |

### Phase 3: Client Management - Suite 1 (18 tables) ✅ NEW v2.5

**Lead Management:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 28 | `leads` | PLURAL | ✅ Correct | Inquiry tracking |
| 29 | `lead_notes` | OWNED DATA | ⚠️ OPTIONAL | Alternative: merge into client_notes |

**Proposal System:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 30 | `proposal_templates` | CONFIG | ✅ Correct | Reusable proposal builders |
| 31 | `proposals` | PLURAL | ✅ Correct | Client submissions |
| 32 | `proposal_line_items` | OWNED DATA | ✅ Correct | Itemized selections |

**Contracts:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 33 | `contracts` | PLURAL | ✅ Correct | Auto-generated contracts |
| 34 | `contract_signatures` | OWNED DATA | ✅ Correct | E-signature tracking |

**Payments:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 35 | `invoices` | PLURAL | ✅ Correct | Payment requests |
| 36 | `invoice_line_items` | OWNED DATA | ✅ Correct | Itemized charges |
| 37 | `payments` | PLURAL | ✅ Correct | Stripe payment records |
| 38 | `payment_schedules` | OWNED DATA | ✅ Correct | Milestone payments |

**Clients:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 39 | `clients` | PLURAL | ✅ Correct | Converted leads → paying clients |
| 40 | `client_questionnaires` | OWNED DATA | ✅ Correct | Pre-event info gathering |

**Email & Tracking:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 41 | `email_tracking` | TRACKING | ✅ Correct | Proposal/contract opens, clicks |

**CRM:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 42 | `crm_organizations` | PLURAL | ✅ Correct | All studios/venues (not just clients) |
| 43 | `crm_contacts` | PLURAL | ✅ Correct | Contact persons at orgs |
| 44 | `crm_interactions` | PLURAL | ✅ Correct | Outreach tracking (calls, emails, meetings) |

**Integrations:**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 45 | `google_drive_folders` | PLURAL | ✅ Correct | Auto-created project folders |
| 46 | `system_settings` | CONFIG | ✅ Correct | Tenant configuration (Stripe, email, branding) |

**Alerts (Shared):**

| # | Current Name | Convention | Status | Notes |
|---|--------------|------------|--------|-------|
| 47 | `alert_preferences` | CONFIG | ⚠️ MISSING | Should exist for user-level alert settings |

---

## 🔧 REQUIRED CHANGES

### Change 1: Rename `gear_tracking_log` → `gear_movement_history`

**Reason:** Consistency with `_history` suffix convention.

**SQL:**
```sql
ALTER TABLE gear_tracking_log RENAME TO gear_movement_history;

-- Update all indexes
ALTER INDEX gear_tracking_log_tenant_id_idx RENAME TO gear_movement_history_tenant_id_idx;
ALTER INDEX gear_tracking_log_gear_id_idx RENAME TO gear_movement_history_gear_id_idx;
```

**Impact:** LOW (audit table, not heavily referenced in app logic)

### Change 2: Rename `deliverable_revisions` → `deliverable_revision_history`

**Reason:** Consistency with `_history` suffix convention.

**SQL:**
```sql
ALTER TABLE deliverable_revisions RENAME TO deliverable_revision_history;

-- Update all indexes
ALTER INDEX idx_deliverable_revisions_tenant RENAME TO idx_deliverable_revision_history_tenant;
ALTER INDEX idx_deliverable_revisions_deliverable RENAME TO idx_deliverable_revision_history_deliverable;
ALTER INDEX idx_deliverable_revisions_asset RENAME TO idx_deliverable_revision_history_asset;
ALTER INDEX idx_deliverable_revisions_status RENAME TO idx_deliverable_revision_history_status;
```

**Impact:** LOW (Phase 2.4 feature, not yet implemented)

### Change 3: ADD `alert_preferences` table (Phase 3)

**Reason:** Missing from schema, required for per-user alert settings.

**SQL:**
```sql
CREATE TABLE alert_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  alert_type TEXT NOT NULL, -- e.g., 'payment_received', 'contract_signed'
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  delivery_method TEXT NOT NULL DEFAULT 'in_app', -- 'in_app', 'email_immediate', 'email_digest'

  CONSTRAINT alert_prefs_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT alert_prefs_user_fkey FOREIGN KEY (user_id) REFERENCES user_profiles(id),
  CONSTRAINT alert_prefs_unique UNIQUE (user_id, alert_type)
);

CREATE INDEX idx_alert_preferences_tenant ON alert_preferences(tenant_id);
CREATE INDEX idx_alert_preferences_user ON alert_preferences(user_id);
```

**Impact:** MEDIUM (new table, required for Phase 3 alerts system)

### Change 4: OPTIONAL - Consolidate `lead_notes` into `client_notes`

**Reason:** Both track notes/communication. Could use polymorphic `related_entity_type`.

**Decision Required:** Keep separate OR merge?

**Option A: Keep Separate**
- `lead_notes` - Notes on leads before conversion
- `client_notes` - Notes on clients after conversion

**Option B: Merge into `client_notes`**
- Add `related_entity_type` field: 'lead' | 'client' | 'event'
- Add `related_entity_id` field (polymorphic)
- Single source of truth for all notes

**Recommendation:** **Option A** (keep separate) - Simpler queries, clearer ownership.

---

## 📊 FINAL TABLE COUNT

**Total Tables:** 45 (not 39 as originally stated)

**Breakdown:**
- Phase 1: 2 tables (tenants, user_profiles)
- Phase 2: 27 tables (events, operators, gear, deliverables, alerts)
- Phase 3: 16 tables (leads, proposals, contracts, payments, clients, CRM, integrations)

**Note:** Discrepancy from original count (39) due to:
1. Deliverables tables (6 total) not counted in Phase 2 original spec
2. `alert_preferences` missing from Phase 3 count
3. `lead_notes` added but not in original count

---

## ✅ NAMING RULES SUMMARY

1. **Entity Tables:** PLURAL (`operators`, `events`, `shifts`, `clients`, `contracts`)
2. **Junction Tables:** DESCRIPTIVE ACTION (`shift_assignments`, `gear_assignments`, `drill_attendees`)
3. **Owned Data:** `parent_attribute` (`operator_skills`, `proposal_line_items`, `contract_signatures`)
4. **History/Audit:** `_history` suffix (`operator_skill_history`, `gear_movement_history`)
5. **Configuration:** PLURAL (`skill_definitions`, `proposal_templates`, `gear_kits`)
6. **Tracking:** `_tracking` suffix (`email_tracking`)

---

## 🔍 VALIDATION CHECKLIST

Before implementation, verify:

- [ ] All 45 tables follow naming convention
- [ ] 2 rename migrations created (`gear_tracking_log`, `deliverable_revisions`)
- [ ] 1 new table migration created (`alert_preferences`)
- [ ] All foreign key constraints updated
- [ ] All indexes renamed to match new table names
- [ ] All RLS policies renamed to match new table names
- [ ] Prisma schema matches SQL exactly
- [ ] TypeScript types generated from Prisma
- [ ] No hardcoded table names in app code

---

## 🚀 NEXT STEPS

1. **Review this document** - Approve naming decisions
2. **Resolve open questions:**
   - Keep `lead_notes` separate OR merge into `client_notes`?
   - Any other missing tables?
3. **Create migration order:**
   - Phase 1: Foundation (2 tables)
   - Phase 2a: Logistics Core (20 tables)
   - Phase 2b: Deliverables (6 tables)
   - Phase 3a: Sales Pipeline (12 tables)
   - Phase 3b: Integrations (4 tables)
4. **Lock Prisma schema** - Generate from SQL definitions
5. **Begin implementation** - Supabase project + migrations

---

## 📝 NOTES

**Why PLURAL for entity tables?**
- Industry standard (Rails, Laravel, Django)
- More natural SQL: `SELECT * FROM operators` (reading from a collection)
- Clearer intent: "This table contains multiple operators"

**Why DESCRIPTIVE for junction tables?**
- Clarifies relationship type
- `shift_assignments` is clearer than `shifts_operators`
- Allows for additional context (role, pay, status)

**Why `_history` suffix for audit tables?**
- Immediately recognizable as historical data
- Distinguishes from current state tables
- Consistent with time-series data patterns

**Why `parent_attribute` for owned data?**
- Natural ownership direction (operator owns skills)
- Groups related tables in alphabetical file lists
- Easier to find related tables

---

**Status:** 🔒 READY FOR USER APPROVAL

**Blockers:**
1. User decision: Keep `lead_notes` OR merge into `client_notes`?
2. User approval of 2 table renames + 1 new table

**Once approved:** Generate Prisma schema → Create migrations → Begin implementation
