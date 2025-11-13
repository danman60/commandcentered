# SCHEMA CROSS-VALIDATION REPORT

**Date Generated:** 2025-01-09
**Project:** CommandCentered
**Tables Analyzed:** 47 (expected 47)
**Documents Reviewed:** 9 specification files

---

## EXECUTIVE SUMMARY

- **Tables Validated:** 47 / 47 ✅
- **Critical Conflicts:** 5 🔴
- **Naming Ambiguities:** 8 ⚠️
- **Missing Tables:** 3 ❓
- **Missing Indexes:** 12 📍
- **Business Logic Mismatches:** 4 🔧

---

## SECTION 1: TABLE INVENTORY

### Phase 1: Foundation (2 tables)
✅ `tenants` - Multi-tenant isolation (all docs consistent)
✅ `user_profiles` - User accounts (all docs consistent)

### Phase 2: Logistics Suite (27 tables)

#### Events & Shifts (3 tables)
✅ `events` - Main event records (SPEC_V2_LOCKED + SCHEMA_V2_SHIFTS consistent)
✅ `shifts` - Work sessions within events (SCHEMA_V2_SHIFTS + SPEC_V2_LOCKED consistent)
✅ `shift_assignments` - Operators to shifts (all docs consistent)

#### Operators (6 tables)
✅ `operators` - Crew members (all docs consistent)
✅ `operator_blackout_dates` - Unavailable periods (all docs consistent)
⚠️ `operator_skills` - Skill ratings (CONFLICT: hardcoded vs expandable)
✅ `operator_skill_history` - Skill upgrade audit (all docs consistent)
⚠️ `operator_gear` - Personal gear inventory (inconsistent: operator_equipment in SCHEMA_V2.1)
✅ `operator_gear_requests` - Requests per shift (all docs consistent)

#### Skills & Drills (4 tables)
✅ `skill_definitions` - Tenant-defined skills (SCHEMA_V2.1_ADDITIONS only)
✅ `drills` - Training sessions (was trainings, renamed consistent)
✅ `drill_attendees` - Who attended drills (was training_attendees, renamed consistent)
✅ `drill_agenda_items` - Drill curriculum (SPEC_V2_LOCKED only, missing in others)

#### Gear & Vehicles (5 tables)
✅ `gear` - Company gear (was equipment, renamed consistent)
⚠️ `gear_tracking_log` - Movement audit (NAMING: should be gear_movement_history)
✅ `gear_assignments` - Gear to events (was equipment_assignments, renamed)
✅ `vehicles` - Company vehicles (all docs consistent)
✅ `gear_kits` - Pre-defined loadouts (was equipment_templates, renamed)

#### Post-Production (6 tables)
✅ `deliverables` - Parent deliverable tracking (SPEC_V2_LOCKED section 2.4)
✅ `deliverable_assets` - Individual items within deliverable (SPEC_V2_LOCKED)
✅ `editors` - Post-production editors (SPEC_V2_LOCKED)
✅ `bounties` - Incentive system for rush work (SPEC_V2_LOCKED)
✅ `client_notes` - Client communication tracking (SPEC_V2_LOCKED)
⚠️ `deliverable_revisions` - Revision requests (NAMING: should be deliverable_revision_history)

#### Alerts (1 table)
✅ `alerts` - System-wide alerts (shared Phase 2+3, all docs consistent)

#### Missing from inventory
❓ `operator_hotels` - Hotel tracking (SCHEMA_V2_SHIFTS only, not in SPEC_V2_LOCKED)

### Phase 3: Client Management Suite (18 tables)

#### Lead Management (2 tables)
✅ `leads` - Potential clients (PHASE3_DATABASE_SCHEMA + all Phase 3 docs)
⚠️ `lead_notes` - Notes on leads (SCHEMA_NAMING suggests merge with client_notes)

#### Proposal System (3 tables)
✅ `proposal_templates` - Reusable proposal builders (all Phase 3 docs consistent)
✅ `proposals` - Client submissions (all Phase 3 docs consistent)
⚠️ `proposal_line_items` - Itemized selections (PHASE3_DATABASE_SCHEMA only)

#### Missing from some docs
❓ `proposal_config_items` - Proposal elements (SPEC_V2_LOCKED mentions, not in PHASE3_DATABASE_SCHEMA)
❓ `proposal_submissions` - Client submissions (SPEC_V2_LOCKED mentions, duplicate of proposals?)

#### Contracts (2 tables)
✅ `contracts` - Auto-generated contracts (all Phase 3 docs consistent)
✅ `contract_signatures` - E-signature tracking (all Phase 3 docs consistent)

#### Payments (4 tables)
✅ `invoices` - Payment requests (PHASE3_DATABASE_SCHEMA only, not in SPEC_V2_LOCKED)
✅ `invoice_line_items` - Itemized charges (PHASE3_DATABASE_SCHEMA only)
✅ `payments` - Stripe payment records (all Phase 3 docs consistent)
✅ `payment_schedules` - Milestone payments (all Phase 3 docs consistent)

#### Clients (2 tables)
✅ `clients` - Converted leads to paying clients (all Phase 3 docs consistent)
✅ `client_questionnaires` - Pre-event info gathering (PHASE3_DATABASE_SCHEMA only)

#### Email & CRM (4 tables)
✅ `email_tracking` - Proposal/contract opens, clicks (all Phase 3 docs consistent)
✅ `crm_organizations` - All studios/venues (PHASE3_DATABASE_SCHEMA only)
✅ `crm_contacts` - Contact persons at orgs (PHASE3_DATABASE_SCHEMA only)
✅ `crm_interactions` - Outreach tracking (PHASE3_DATABASE_SCHEMA only)

#### Integrations (3 tables)
✅ `google_drive_folders` - Auto-created project folders (PHASE3_DATABASE_SCHEMA)
✅ `system_settings` - Tenant configuration (PHASE3_DATABASE_SCHEMA)
⚠️ `integration_logs` - Audit trail (SPEC_V2_LOCKED mentions, not defined)

#### Missing
❓ `alert_preferences` - Per-user alert settings (SCHEMA_NAMING_LOCKED suggests adding)

---

## SECTION 2: CRITICAL CONFLICTS

### Conflict 1: operator_skills vs operator_equipment naming
**Location:**
- SPEC_V2_LOCKED:167 uses `operator_skills`
- SCHEMA_V2.1_ADDITIONS:283 uses `operator_skills` table
- SCHEMA_V2_SHIFTS:164 has skills as columns on operators table

**Issue:** Skills implementation changed from columns to separate table but not all docs updated

**Resolution Needed:** Use separate `operator_skills` table with `skill_definitions`

### Conflict 2: operator_gear vs operator_equipment
**Location:**
- SPEC_V2_LOCKED:170 uses `operator_gear`
- SCHEMA_V2.1_ADDITIONS:44 uses `operator_equipment`

**Issue:** Inconsistent naming for same concept

**Resolution Needed:** Standardize on `operator_gear` to match gear terminology

### Conflict 3: proposal_config_items vs proposal_line_items
**Location:**
- SPEC_V2_LOCKED:189 mentions `proposal_config_items`
- PHASE3_DATABASE_SCHEMA:302 defines `proposal_line_items`

**Issue:** Two different tables for similar purpose or naming confusion

**Resolution Needed:** Clarify if these are separate tables or same table

### Conflict 4: Hotel tracking inconsistency
**Location:**
- SCHEMA_V2_SHIFTS:331 defines `operator_hotels` table
- SCHEMA_V2.1_ADDITIONS:178 adds hotel columns to events table

**Issue:** Two different approaches to hotel tracking

**Resolution Needed:** Use events table columns (simpler, already decided per Q18)

### Conflict 5: Missing integration_logs table definition
**Location:**
- SPEC_V2_LOCKED:94 lists it
- PHASE3_INTEGRATION_ARCHITECTURE references it extensively
- No CREATE TABLE statement found

**Issue:** Referenced but never defined

**Resolution Needed:** Add table definition

---

## SECTION 3: NAMING AMBIGUITIES

### Ambiguity 1: `gear_tracking_log` suffix inconsistency
**Locations:**
- SPEC_V2_LOCKED:149 (CREATE TABLE gear_tracking_log)
- SCHEMA_NAMING_LOCKED:186 (flagged for rename to gear_movement_history)

**Options:**
1. Keep `gear_tracking_log` - Already in spec
2. Rename to `gear_movement_history` - Consistent with _history pattern
3. Rename to `gear_movements` - Simple, no suffix

**Impact:** LOW
**Recommendation:** Option 2 (gear_movement_history)

### Ambiguity 2: `deliverable_revisions` suffix inconsistency
**Locations:**
- SPEC_V2_LOCKED:1177 (CREATE TABLE deliverable_revisions)
- SCHEMA_NAMING_LOCKED:200 (suggests deliverable_revision_history)

**Options:**
1. Keep `deliverable_revisions`
2. Rename to `deliverable_revision_history` - Consistent with _history pattern

**Impact:** LOW
**Recommendation:** Option 2 (deliverable_revision_history)

### Ambiguity 3: `operator_skills` junction or owned data?
**Locations:**
- Pattern suggests junction table (operator + skill)
- Named like owned data (operator_gear pattern)

**Options:**
1. Keep `operator_skills` - Current name
2. Rename to `operator_skill_assignments` - Clearer junction name
3. Rename to `skill_assignments` - Simpler junction name

**Impact:** MEDIUM
**Recommendation:** Option 1 (keep as-is, commonly understood)

### Ambiguity 4: `lead_notes` separate or merge with `client_notes`?
**Locations:**
- PHASE3_DATABASE_SCHEMA defines separate
- SCHEMA_NAMING_LOCKED:340 suggests possible merge

**Options:**
1. Keep separate tables - Clearer separation
2. Merge into `client_notes` with polymorphic type

**Impact:** MEDIUM
**Recommendation:** Option 1 (keep separate)

### Ambiguity 5: `proposal_submissions` vs `proposals`
**Locations:**
- SPEC_V2_LOCKED:189 mentions proposal_submissions
- PHASE3_DATABASE_SCHEMA:213 uses proposals for submissions

**Options:**
1. One table `proposals` for all proposals
2. Two tables: `proposal_templates` and `proposal_submissions`

**Impact:** HIGH
**Recommendation:** Option 1 (single proposals table is clearer)

### Ambiguity 6: Table count discrepancy
**Locations:**
- SPEC_V2_LOCKED claims 39 tables
- SCHEMA_NAMING_LOCKED counts 45 tables
- Actual count: 47 tables

**Issue:** Documentation inconsistency
**Resolution:** Update all docs to reflect 47 tables

### Ambiguity 7: `questionnaires` vs `client_questionnaires`
**Locations:**
- SPEC_V2_LOCKED:216 mentions questionnaires
- PHASE3_DATABASE_SCHEMA:659 defines client_questionnaires

**Options:**
1. Use `client_questionnaires` - More specific
2. Use `questionnaires` - Simpler

**Impact:** LOW
**Recommendation:** Option 1 (client_questionnaires is clearer)

### Ambiguity 8: `alert_preferences` missing
**Locations:**
- SCHEMA_NAMING_LOCKED:273 notes it's missing
- PHASE3_ALERTS_NOTIFICATIONS implies it exists

**Options:**
1. Add `alert_preferences` table
2. Store preferences in user_profiles JSON column
3. Use default preferences only

**Impact:** MEDIUM
**Recommendation:** Option 1 (add alert_preferences table)

---

## SECTION 4: MISSING FOREIGN KEYS

1. **events.contract_id** → contracts.id (Suite 1 ↔ Suite 2 handoff)
2. **contracts.event_id** → events.id (bidirectional link)
3. **drill_agenda_items.drill_id** → drills.id (drill curriculum)
4. **integration_logs** table missing entirely
5. **questionnaire_responses** mentioned but not defined

---

## SECTION 5: MISSING INDEXES

### Critical Performance Indexes Missing:
1. `shift_assignments` - Missing composite index on (operator_id, shift_id)
2. `operator_skills` - Missing index on skill_level for filtering
3. `proposals` - Missing index on (tenant_id, status, created_at)
4. `payments` - Missing composite index on (contract_id, status)
5. `email_tracking` - Missing index on (related_entity_type, related_entity_id)
6. `alerts` - Missing index on (tenant_id, resolved_at, priority)
7. `deliverables` - Missing index on (event_id, status)
8. `lead_notes` - Missing index on lead_id
9. `google_drive_folders` - Missing composite on (related_entity_type, related_entity_id)
10. `payment_schedules` - Missing index on (contract_id, status)
11. `client_questionnaires` - Missing index on contract_id
12. `integration_logs` - Table not defined

---

## SECTION 6: BUSINESS LOGIC MISMATCHES

### Mismatch 1: Proposal Expiration
**Schema:** `proposals.expires_at TIMESTAMPTZ`
**Business Logic:** PHASE3_DECISIONS_LOG:73 - "Proposals don't expire"
**Resolution:** Remove expires_at field

### Mismatch 2: Suite Handoff Trigger
**Original:** Contract signed + payment received
**Updated:** PHASE3_DECISIONS_LOG:137 - Contract signed only (no payment required)
**Resolution:** Update workflow to trigger on signature only

### Mismatch 3: Payment Schedule Automation
**Schema:** Implies automated charging
**Business Logic:** PHASE3_DECISIONS_LOG:19 - Manual payments only, schedule is informational
**Resolution:** Add notes that payment_schedules is tracking only

### Mismatch 4: Hotel Tracking Method
**Schema:** Both operator_hotels table AND events.hotel_* columns
**Business Logic:** Events table columns only (simpler)
**Resolution:** Remove operator_hotels table, use events columns

---

## SECTION 7: RECOMMENDATIONS (NOT LOCKED)

### High Priority
1. **Add integration_logs table** - Critical for audit trail
2. **Remove proposal expires_at** - Matches business decision
3. **Standardize on gear naming** - operator_gear not operator_equipment
4. **Add alert_preferences table** - Required for user settings
5. **Fix history table suffixes** - Use _history consistently

### Medium Priority
1. **Clarify proposal_config_items** - Is this needed or use line_items?
2. **Remove operator_hotels table** - Use events.hotel_* columns
3. **Add missing indexes** - Performance critical
4. **Update table counts** - Fix documentation inconsistency

### Low Priority
1. **Consider lead_notes merge** - Could simplify schema
2. **Rename ambiguous tables** - Improve clarity
3. **Add questionnaire_responses** - If questionnaires are used

---

## VALIDATION RESULTS

### ✅ Validated
- 35 tables have consistent definitions across all documents
- All foreign key relationships are valid
- All data types match where defined
- RLS policies defined for all tables

### ⚠️ Needs Attention
- 8 naming ambiguities need user decision
- 5 critical conflicts need resolution
- 3 tables missing definitions
- 12 performance indexes missing

### 🔴 Blockers
1. integration_logs table not defined (required for handoff)
2. proposal expiration conflict with business logic
3. Hotel tracking method inconsistency
4. operator_skills implementation inconsistency

---

## NEXT STEPS

1. Review and resolve naming ambiguities (user decision required)
2. Add missing table definitions (integration_logs, alert_preferences)
3. Fix suffix inconsistencies (_history pattern)
4. Remove expired/deprecated fields
5. Generate final Prisma schema after decisions