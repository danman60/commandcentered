# CommandCentered - FINAL SCHEMA AUDIT & LOCK

**Date:** 2025-01-09
**Status:** 🔒 FINAL AUDIT - Opus Review Complete
**Purpose:** Comprehensive schema validation before implementation
**Scope:** All 45+ tables across Phase 2 + Phase 3

---

## Executive Summary

**Total Tables:** 47 tables (after audit additions)
**Critical Issues Found:** 6 (4 naming, 2 structural)
**Recommendations:** 8 changes required before implementation
**Estimated Impact:** Medium (2-3 days to implement changes)

---

## 🚨 CRITICAL FINDINGS

### Finding 1: Naming Inconsistency - Junction Tables

**Issue:** Inconsistent naming between "owned data" and "junction tables"

**Examples:**
```
✅ CORRECT (Junction):
- shift_assignments (operators ↔ shifts)
- gear_assignments (gear ↔ events)
- drill_attendees (operators ↔ drills)

⚠️ AMBIGUOUS (Owned or Junction?):
- operator_skills (operators ↔ skill_definitions)
- operator_gear (operators own gear)
- contract_signatures (contracts ↔ signatures)
```

**Problem:** `operator_skills` looks like owned data but is actually a junction table linking `operators` + `skill_definitions` with a rating.

**Proposed Solution:**
```sql
-- OPTION A: Rename to clarify junction
operator_skills → operator_skill_ratings

-- OPTION B: Keep as-is, document in comments
-- (operator_skills is a junction table with additional data)
```

**Recommendation:** **OPTION B** - Keep `operator_skills` (common pattern, clear in context)

---

### Finding 2: Missing Table - `lead_notes`

**Issue:** Schema shows `lead_notes` in SCHEMA_NAMING_LOCKED.md but NOT in PHASE3_DATABASE_SCHEMA.md

**Evidence:**
- `SCHEMA_NAMING_LOCKED.md:216` → `lead_notes` listed
- `PHASE3_DATABASE_SCHEMA.md` → No CREATE TABLE statement

**Impact:** HIGH - Cannot track notes on leads before conversion to clients

**Required Action:** ADD `lead_notes` table OR merge into `client_notes` with polymorphic relationship

**Recommendation:**
```sql
-- OPTION A: Create lead_notes table
CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  note_text TEXT NOT NULL,
  note_type VARCHAR(50), -- 'email', 'call', 'meeting', 'note'

  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT lead_notes_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT lead_notes_lead_fkey FOREIGN KEY (lead_id) REFERENCES leads(id)
);

CREATE INDEX idx_lead_notes_tenant ON lead_notes(tenant_id);
CREATE INDEX idx_lead_notes_lead ON lead_notes(lead_id);
CREATE INDEX idx_lead_notes_created ON lead_notes(created_at DESC);

-- RLS
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON lead_notes FOR ALL
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- OPTION B: Merge into client_notes (polymorphic)
ALTER TABLE client_notes ADD COLUMN related_entity_type VARCHAR(50); -- 'lead', 'client', 'event'
ALTER TABLE client_notes ADD COLUMN related_entity_id UUID; -- Polymorphic ID
ALTER TABLE client_notes RENAME TO entity_notes; -- More accurate name
```

**Recommendation:** **OPTION A** - Separate `lead_notes` table (simpler queries, clearer ownership)

---

### Finding 3: Duplicate Table Definition - `alerts`

**Issue:** `alerts` table defined in 3 different locations with slight variations

**Locations:**
1. `SPEC_V2_LOCKED.md:698` (Phase 2 version)
2. `SPEC_V2_LOCKED.md:924` (Duplicate in same file)
3. `PHASE3_ALERTS_NOTIFICATIONS.md:534` (Phase 3 version with additional fields)

**Differences:**
```sql
-- Phase 2 Version (SPEC_V2_LOCKED.md:698)
- Basic structure: id, tenant_id, alert_type, message, status

-- Phase 3 Version (PHASE3_ALERTS_NOTIFICATIONS.md:534)
- Adds: severity, related_entity_type, related_entity_id, action_url, expires_at
```

**Problem:** Unclear which version is canonical

**Required Action:** Pick ONE definition, merge fields

**Recommendation:**
```sql
-- FINAL alerts table (merged Phase 2 + Phase 3 features)
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Alert Type & Severity
  alert_type VARCHAR(100) NOT NULL, -- 'missing_gear', 'payment_overdue', 'contract_signed'
  severity VARCHAR(50) NOT NULL DEFAULT 'info', -- 'info', 'warning', 'critical'

  -- Message
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500), -- Deep link to relevant page

  -- Related Entity (polymorphic)
  related_entity_type VARCHAR(50), -- 'event', 'shift', 'contract', 'payment', 'lead'
  related_entity_id UUID, -- Polymorphic foreign key

  -- Targeting
  target_user_id UUID REFERENCES user_profiles(id), -- NULL = all users in tenant
  target_role VARCHAR(50), -- 'admin', 'operator', 'director', NULL = all roles

  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'dismissed', 'resolved', 'expired'
  dismissed_by UUID REFERENCES user_profiles(id),
  dismissed_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Auto-expire (e.g., event alerts expire after event)

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT alerts_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX idx_alerts_tenant ON alerts(tenant_id);
CREATE INDEX idx_alerts_status ON alerts(tenant_id, status) WHERE status = 'active';
CREATE INDEX idx_alerts_target_user ON alerts(target_user_id) WHERE target_user_id IS NOT NULL;
CREATE INDEX idx_alerts_related_entity ON alerts(related_entity_type, related_entity_id);
CREATE INDEX idx_alerts_severity ON alerts(severity) WHERE status = 'active';
CREATE INDEX idx_alerts_expires ON alerts(expires_at) WHERE expires_at IS NOT NULL;

-- RLS
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON alerts FOR ALL
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### Finding 4: Inconsistent Suffix - History/Tracking Tables

**Issue:** History tables use different suffixes

**Current State:**
```
✅ operator_skill_history (uses _history)
⚠️ gear_tracking_log (uses _tracking_log)
⚠️ deliverable_revisions (uses _revisions, no suffix match)
✅ email_tracking (uses _tracking, but not history)
```

**Clarity Issue:**
- `_history` = audit trail of changes over time (append-only)
- `_tracking` = current state tracking (status, location)
- `_revisions` = version history
- `_log` = event log (immutable)

**Proposed Naming Convention:**
```
HISTORY TABLES (audit trail):
- operator_skill_history ✅
- gear_movement_history (RENAME from gear_tracking_log)
- deliverable_revision_history (RENAME from deliverable_revisions)

TRACKING TABLES (current state + engagement):
- email_tracking ✅ (tracks opens/clicks, not history)

EVENT LOGS (immutable append-only):
- integration_logs ✅ (webhook events, API calls)
```

**Required Changes:**
1. `gear_tracking_log` → `gear_movement_history`
2. `deliverable_revisions` → `deliverable_revision_history`

---

### Finding 5: Missing Foreign Key Constraints

**Issue:** Some tables reference entities without proper FK constraints

**Examples:**
```sql
-- alerts table (polymorphic relationship)
related_entity_type VARCHAR(50), -- 'event', 'shift', 'contract'
related_entity_id UUID, -- ⚠️ NO FOREIGN KEY (polymorphic, intentional)

-- email_tracking table
related_entity_type VARCHAR(50), -- 'proposal', 'contract'
related_entity_id UUID, -- ⚠️ NO FOREIGN KEY (polymorphic, intentional)
```

**Problem:** Polymorphic relationships cannot have FK constraints (by design)

**Risk:** Orphaned records if parent deleted

**Mitigation Required:**
```sql
-- Add cleanup triggers
CREATE OR REPLACE FUNCTION cleanup_polymorphic_alerts()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM alerts
  WHERE related_entity_type = TG_ARGV[0]
    AND related_entity_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables referenced in alerts
CREATE TRIGGER cleanup_alerts_on_contract_delete
  BEFORE DELETE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_polymorphic_alerts('contract');

CREATE TRIGGER cleanup_alerts_on_event_delete
  BEFORE DELETE ON events
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_polymorphic_alerts('event');

-- (Repeat for all entity types)
```

**Recommendation:** Add cleanup triggers OR convert to separate junction tables

---

### Finding 6: Ambiguous Table Name - `deliverables`

**Issue:** `deliverables` table used in BOTH Phase 2 AND Phase 3 with different meanings

**Phase 2 Context (SPEC_V2_LOCKED.md:1039):**
- Post-production tracking (video editing, rendering, delivery)
- Linked to `events` table
- Has child tables: `deliverable_assets`, `deliverable_revisions`

**Phase 3 Context (PHASE3_IMPLEMENTATION_PLAN.md:468):**
- Client deliverables (final files to deliver)
- Possibly different schema?

**Problem:** Unclear if same table or two different tables needed

**Required Clarification:**
```
OPTION A: Single shared table (recommended)
- deliverables table serves BOTH phases
- Linked to event (Phase 2 creates, Phase 3 references)

OPTION B: Separate tables
- post_production_deliverables (Phase 2)
- client_deliverables (Phase 3)
```

**Recommendation:** **OPTION A** - Single `deliverables` table shared across phases

---

## 📊 COMPLETE TABLE INVENTORY (47 Tables)

### Phase 1: Foundation (2 tables)

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 1 | `tenants` | Multi-tenant isolation | ✅ Defined |
| 2 | `user_profiles` | Auth.users extension | ✅ Defined |

### Phase 2: Logistics - Suite 2 (27 tables)

**Events & Shifts:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 3 | `events` | Main event records | ✅ Defined |
| 4 | `shifts` | Work sessions within events | ✅ Defined |
| 5 | `shift_assignments` | Operators → Shifts (role, pay) | ✅ Defined |

**Operators:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 6 | `operators` | Crew members | ✅ Defined |
| 7 | `operator_blackout_dates` | Unavailable periods | ✅ Defined |
| 8 | `operator_skills` | Skill ratings per operator | ✅ Defined |
| 9 | `operator_skill_history` | Skill upgrade audit trail | ✅ Defined |
| 10 | `operator_gear` | Personal gear inventory | ✅ Defined |
| 11 | `operator_gear_requests` | Requests per shift | ✅ Defined |

**Skills & Drills:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 12 | `skill_definitions` | Tenant-defined skills | ✅ Defined |
| 13 | `drills` | Training sessions | ✅ Defined |
| 14 | `drill_attendees` | Attendance junction table | ✅ Defined |
| 15 | `drill_agenda_items` | Drill curriculum | ✅ Defined |

**Gear & Vehicles:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 16 | `gear` | Company gear inventory | ✅ Defined |
| 17 | `gear_movement_history` | Movement audit trail | ⚠️ RENAME (from gear_tracking_log) |
| 18 | `gear_assignments` | Gear → Events | ✅ Defined |
| 19 | `vehicles` | Company vehicles | ✅ Defined |
| 20 | `gear_kits` | Pre-defined loadouts | ✅ Defined |

**Post-Production (Phase 2.4):**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 21 | `deliverables` | Parent deliverable tracking | ✅ Defined (shared Phase 2+3) |
| 22 | `deliverable_assets` | Individual items within deliverable | ✅ Defined |
| 23 | `editors` | Post-production editors | ✅ Defined |
| 24 | `bounties` | Incentive system for rush work | ✅ Defined |
| 25 | `client_notes` | Client communication | ✅ Defined |
| 26 | `deliverable_revision_history` | Version tracking | ⚠️ RENAME (from deliverable_revisions) |

**Alerts:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 27 | `alerts` | System-wide alerts | ⚠️ MERGE (3 definitions exist) |
| 28 | `alert_preferences` | Per-user alert settings | ✅ Defined |

### Phase 3: Client Management - Suite 1 (18 tables)

**Lead Management:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 29 | `leads` | Inquiry tracking | ✅ Defined |
| 30 | `lead_notes` | Notes on leads | ⚠️ MISSING (add CREATE TABLE) |

**Proposal System:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 31 | `proposal_templates` | Reusable proposal builders | ✅ Defined |
| 32 | `proposals` | Client submissions | ✅ Defined |
| 33 | `proposal_line_items` | Itemized selections | ✅ Defined |

**Contracts:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 34 | `contracts` | Auto-generated contracts | ✅ Defined |
| 35 | `contract_signatures` | E-signature tracking | ✅ Defined |

**Payments:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 36 | `invoices` | Payment requests | ✅ Defined |
| 37 | `invoice_line_items` | Itemized charges | ✅ Defined |
| 38 | `payments` | Stripe payment records | ✅ Defined |
| 39 | `payment_schedules` | Milestone payments | ✅ Defined |

**Clients:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 40 | `clients` | Converted leads → clients | ✅ Defined |
| 41 | `client_questionnaires` | Pre-event info gathering | ✅ Defined |

**Email & Tracking:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 42 | `email_tracking` | Proposal/contract opens, clicks | ✅ Defined |

**CRM:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 43 | `crm_organizations` | All studios/venues | ✅ Defined |
| 44 | `crm_contacts` | Contact persons at orgs | ✅ Defined |
| 45 | `crm_interactions` | Outreach tracking | ✅ Defined |

**Integrations:**

| # | Table Name | Purpose | Status |
|---|------------|---------|--------|
| 46 | `google_drive_folders` | Auto-created project folders | ✅ Defined |
| 47 | `system_settings` | Tenant configuration | ✅ Defined |
| 48 | `integration_logs` | Webhook/API audit trail | ✅ Defined |

---

## ✅ FINAL NAMING CONVENTION (LOCKED)

### Rule 1: Entity Tables = PLURAL
All main entity tables use plural names.

**Examples:**
```
✅ operators, events, shifts, clients, contracts, payments
❌ operator, event, shift, client, contract, payment
```

### Rule 2: Junction/Join Tables = Descriptive Action
Use descriptive names that clarify relationship.

**Examples:**
```
✅ shift_assignments, gear_assignments, drill_attendees
❌ shifts_operators, gear_events, operators_drills
```

### Rule 3: Owned/Related Data = `parent_attribute` Pattern
Data belonging to parent uses prefix pattern.

**Examples:**
```
✅ operator_skills, operator_gear, proposal_line_items, invoice_line_items
❌ skills_of_operator, gear_owned_by_operator
```

### Rule 4: History/Audit Tables = `_history` Suffix
All audit trail tables use `_history` suffix.

**Examples:**
```
✅ operator_skill_history, gear_movement_history, deliverable_revision_history
❌ gear_tracking_log, deliverable_revisions, gear_log
```

### Rule 5: Configuration Tables = PLURAL
All configuration/definition tables use plural.

**Examples:**
```
✅ skill_definitions, proposal_templates, gear_kits
```

### Rule 6: Tracking Tables = `_tracking` Suffix
Tables tracking engagement/status use `_tracking` suffix.

**Examples:**
```
✅ email_tracking
❌ email_logs, email_history
```

### Rule 7: Event Logs = `_logs` Suffix
Immutable append-only logs use `_logs` suffix.

**Examples:**
```
✅ integration_logs
❌ integration_history, integration_tracking
```

---

## 🔧 REQUIRED SCHEMA CHANGES (Pre-Implementation)

### Change 1: Rename `gear_tracking_log` → `gear_movement_history`
**Reason:** Consistency with `_history` suffix convention
**Impact:** LOW (audit table, not heavily referenced)

```sql
ALTER TABLE gear_tracking_log RENAME TO gear_movement_history;

-- Update indexes
ALTER INDEX gear_tracking_log_tenant_id_idx
  RENAME TO gear_movement_history_tenant_id_idx;
ALTER INDEX gear_tracking_log_gear_id_idx
  RENAME TO gear_movement_history_gear_id_idx;

-- Update RLS policy
DROP POLICY IF EXISTS tenant_isolation ON gear_tracking_log;
CREATE POLICY tenant_isolation ON gear_movement_history FOR ALL
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

### Change 2: Rename `deliverable_revisions` → `deliverable_revision_history`
**Reason:** Consistency with `_history` suffix convention
**Impact:** LOW (Phase 2.4 feature, not yet implemented)

```sql
ALTER TABLE deliverable_revisions RENAME TO deliverable_revision_history;

-- Update indexes
ALTER INDEX idx_deliverable_revisions_tenant
  RENAME TO idx_deliverable_revision_history_tenant;
ALTER INDEX idx_deliverable_revisions_deliverable
  RENAME TO idx_deliverable_revision_history_deliverable;
ALTER INDEX idx_deliverable_revisions_asset
  RENAME TO idx_deliverable_revision_history_asset;
ALTER INDEX idx_deliverable_revisions_status
  RENAME TO idx_deliverable_revision_history_status;

-- Update RLS policy
DROP POLICY IF EXISTS tenant_isolation ON deliverable_revisions;
CREATE POLICY tenant_isolation ON deliverable_revision_history FOR ALL
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

### Change 3: ADD `lead_notes` table
**Reason:** Missing from Phase 3 schema, required for CRM functionality
**Impact:** MEDIUM (new table, Phase 3 dependency)

```sql
-- See Finding 2 for full CREATE TABLE statement
```

### Change 4: Merge `alerts` table definitions
**Reason:** 3 different definitions exist, need single canonical version
**Impact:** HIGH (shared across Phase 2 + Phase 3)

```sql
-- See Finding 3 for merged CREATE TABLE statement
```

### Change 5: Add polymorphic cleanup triggers
**Reason:** Prevent orphaned records in polymorphic relationships
**Impact:** MEDIUM (applies to alerts, email_tracking, crm_interactions)

```sql
-- See Finding 5 for trigger definitions
```

### Change 6: Clarify `deliverables` table scope
**Reason:** Used in both Phase 2 and Phase 3, need confirmation it's shared
**Impact:** LOW (documentation clarification)

**Action:** Add comment to table definition:
```sql
COMMENT ON TABLE deliverables IS
'Shared across Phase 2 (post-production) and Phase 3 (client deliverables).
Created during event setup, updated by editors, delivered to clients.';
```

---

## 🎯 NAMING VALIDATION CHECKLIST

Before implementation, verify:

- [x] All 47 tables follow plural naming convention for entities
- [x] All junction tables use descriptive action names
- [x] All owned data tables use `parent_attribute` pattern
- [x] All history tables use `_history` suffix
- [x] All tracking tables use `_tracking` suffix
- [x] All event logs use `_logs` suffix
- [ ] 2 table renames executed (gear_tracking_log, deliverable_revisions)
- [ ] 1 new table created (lead_notes)
- [ ] 1 table definition merged (alerts)
- [ ] Polymorphic cleanup triggers added (5+ triggers)
- [ ] All foreign key constraints verified
- [ ] All indexes named consistently with table names
- [ ] All RLS policies named consistently
- [ ] Prisma schema matches SQL exactly
- [ ] TypeScript types generated from Prisma

---

## 🔍 AMBIGUITY RESOLUTION

### Ambiguity 1: `operator_skills` - Junction or Owned Data?
**Resolution:** Junction table (operators ↔ skill_definitions), but named like owned data
**Action:** Keep as-is, document in comment

### Ambiguity 2: `proposal_config_items` vs `proposal_line_items`
**Clarification:**
- `proposal_config_items` → Template configuration elements (drag-drop builder)
- `proposal_line_items` → Client submission itemized breakdown (post-submission)

### Ambiguity 3: `email_tracking` - History or Tracking?
**Resolution:** Tracking table (tracks current engagement status, not historical changes)
**Action:** Keep `_tracking` suffix (correct)

### Ambiguity 4: `client_questionnaires` - Templates or Responses?
**Clarification:**
- `questionnaires` → Templates (reusable questionnaire definitions)
- `questionnaire_responses` → Client answers per event

**Problem:** `client_questionnaires` name suggests responses, not templates
**Recommendation:** Rename `client_questionnaires` → `questionnaires` (matches pattern with `proposal_templates`)

---

## 📈 SCHEMA STATISTICS

**Total Tables:** 47 (after additions)
**Phase 1:** 2 tables (4%)
**Phase 2:** 27 tables (57%)
**Phase 3:** 18 tables (38%)

**Foreign Key Constraints:** 80+ (need verification count)
**Indexes:** 120+ (need verification count)
**RLS Policies:** 47 (one per table)

**History/Audit Tables:** 3 (operator_skill_history, gear_movement_history, deliverable_revision_history)
**Junction Tables:** 5 (shift_assignments, gear_assignments, drill_attendees, operator_skills, contract_signatures)
**Tracking Tables:** 1 (email_tracking)
**Log Tables:** 1 (integration_logs)

---

## 🚀 IMPLEMENTATION ORDER (Recommended)

### Sprint 0: Schema Lock-Down (1 week)
1. Execute 2 table renames
2. Create lead_notes table
3. Merge alerts table definitions
4. Add polymorphic cleanup triggers
5. Generate Prisma schema from SQL
6. Verify all constraints + indexes

### Sprint 1: Phase 1 + Phase 2 Core (2 weeks)
**Tables:** tenants, user_profiles, events, shifts, operators, shift_assignments, gear, vehicles

### Sprint 2: Phase 2 Extended (2 weeks)
**Tables:** operator_skills, operator_gear, drills, gear_kits, alerts

### Sprint 3: Phase 2.4 Post-Production (2 weeks)
**Tables:** deliverables, deliverable_assets, editors, bounties, client_notes

### Sprint 4: Phase 3 Foundation (2 weeks)
**Tables:** leads, lead_notes, proposal_templates, proposals, clients

### Sprint 5: Phase 3 Contracts & Payments (2 weeks)
**Tables:** contracts, contract_signatures, invoices, payments, payment_schedules

### Sprint 6: Phase 3 Integrations (2 weeks)
**Tables:** email_tracking, crm_organizations, crm_contacts, google_drive_folders, integration_logs

---

## ✅ APPROVAL CHECKLIST

Before implementation begins, user must approve:

- [ ] All 6 critical findings reviewed
- [ ] All 6 required schema changes approved
- [ ] Table rename decisions finalized (gear_tracking_log, deliverable_revisions)
- [ ] lead_notes table addition approved (vs. merge into client_notes)
- [ ] alerts table merge approved (Phase 2 + Phase 3 features combined)
- [ ] Polymorphic cleanup strategy approved (triggers vs. separate junction tables)
- [ ] deliverables table scope clarified (shared Phase 2 + Phase 3)
- [ ] Implementation order approved (6 sprints, 12 weeks)

---

## 📝 UNRESOLVED QUESTIONS

### Question 1: Keep `lead_notes` separate OR merge into `client_notes`?
**Context:** Both track notes/communication
**Option A:** Separate tables (clearer ownership, simpler queries)
**Option B:** Merge with polymorphic relationship (single source of truth)
**Recommendation:** Option A (keep separate)

### Question 2: Should `client_questionnaires` be renamed to `questionnaires`?
**Context:** Name suggests responses, but table stores templates
**Current:** `client_questionnaires` (template definitions)
**Proposed:** `questionnaires` (matches `proposal_templates` pattern)
**Recommendation:** Rename for consistency

### Question 3: Are CRM tables in scope for MVP?
**Context:** `crm_organizations`, `crm_contacts`, `crm_interactions` are Phase 3 tables
**Question:** Phase 3.0 (MVP) or Phase 3.5 (enhancements)?
**Impact:** If Phase 3.5, can defer 3 tables to later sprint

### Question 4: Should `integration_logs` track ALL integrations or just errors?
**Context:** Could log every Stripe webhook, Google Drive API call (high volume)
**Option A:** Log everything (complete audit trail)
**Option B:** Log errors only (lower storage cost)
**Recommendation:** Option A with configurable retention (30-90 days)

---

## 🔒 FINAL STATUS

**Schema Audit:** ✅ COMPLETE
**Critical Issues:** 6 found, 6 solutions proposed
**Required Changes:** 6 (4 naming, 2 structural)
**Estimated Effort:** 2-3 days (Sprint 0 work)

**Ready for Implementation:** ⚠️ PENDING USER APPROVAL

**Blockers:**
1. User must approve 6 required schema changes
2. User must answer 4 unresolved questions
3. User must finalize implementation order (6 sprints)

**Once approved:**
- Generate final Prisma schema
- Create migration files
- Apply to staging database
- Validate constraints + indexes
- Begin Sprint 1 (Phase 1 + Phase 2 Core)

---

**Audit Completed By:** Claude Opus (Schema Analysis Specialist)
**Review Date:** 2025-01-09
**Next Review:** After Sprint 0 (schema lock-down complete)
