# SCHEMA DECISIONS REQUIRED

**Date:** 2025-01-09
**Status:** ⏳ Awaiting User Decisions
**Blocker:** Cannot lock schema until these are resolved

---

## 🚨 CRITICAL DECISIONS (Block Implementation)

### Decision 1: operator_skills Implementation
**Current Conflict:**
- SCHEMA_V2_SHIFTS has skills as columns on operators table (videography_skill, photography_skill, etc.)
- SCHEMA_V2.1_ADDITIONS creates separate operator_skills table with skill_definitions

**Options:**
1. **Keep as columns** - Simpler, fixed skills, faster queries
2. **Use separate tables** - Flexible, expandable skills, more complex

**Recommendation:** Option 2 (separate tables for flexibility)

**Your Decision:** _________________

---

### Decision 2: operator_gear vs operator_equipment
**Current Conflict:**
- SPEC_V2_LOCKED uses `operator_gear`
- SCHEMA_V2.1_ADDITIONS uses `operator_equipment`

**Options:**
1. **Use `operator_gear`** - Consistent with gear terminology
2. **Use `operator_equipment`** - More formal

**Recommendation:** Option 1 (operator_gear)

**Your Decision:** _________________

---

### Decision 3: Hotel Tracking Method
**Current Conflict:**
- SCHEMA_V2_SHIFTS defines `operator_hotels` table
- SCHEMA_V2.1_ADDITIONS adds hotel columns to events table
- Both exist in different specs

**Options:**
1. **Events table columns only** - Simpler, one hotel per event
2. **Separate operator_hotels table** - Complex, individual tracking
3. **Both** - Maximum flexibility but redundant

**Recommendation:** Option 1 (events columns only - matches your Q18 answer)

**Your Decision:** _________________

---

### Decision 4: Proposal Expiration Field
**Schema Has:** `proposals.expires_at TIMESTAMPTZ`
**Business Logic:** "Proposals don't expire" (PHASE3_DECISIONS_LOG:73)

**Options:**
1. **Remove expires_at field** - Matches business decision
2. **Keep but don't use** - Future flexibility
3. **Make optional with no default** - Compromise

**Recommendation:** Option 1 (remove field)

**Your Decision:** _________________

---

### Decision 5: Suite Handoff Trigger
**Original Design:** Contract signed + payment received triggers event
**Updated Decision:** Contract signed only (PHASE3_DECISIONS_LOG:137)

**Confirmation:**
- Event creation triggers on contract signature ONLY
- Payment is tracked separately
- No payment required to create event

**Confirm:** ✅ Yes / ❌ No

---

## ⚠️ NAMING DECISIONS (Important but Non-Blocking)

### Decision 6: History Table Suffix
**Current Inconsistency:**
- `operator_skill_history` ✅
- `gear_tracking_log` ⚠️
- `deliverable_revisions` ⚠️

**Options:**
1. **Standardize on `_history`** - gear_movement_history, deliverable_revision_history
2. **Keep as-is** - Mixed naming
3. **Use `_log` for all** - gear_tracking_log, deliverable_revision_log

**Recommendation:** Option 1 (standardize on _history)

**Your Decision:** _________________

---

### Decision 7: lead_notes Table
**Current Design:** Separate `lead_notes` table
**Alternative:** Merge into `client_notes` with polymorphic type

**Options:**
1. **Keep separate** - Clearer separation, simpler queries
2. **Merge into client_notes** - Single source of truth for all notes

**Recommendation:** Option 1 (keep separate)

**Your Decision:** _________________

---

### Decision 8: proposal_config_items vs proposal_line_items
**Confusion:** SPEC_V2_LOCKED mentions proposal_config_items
**Schema has:** proposal_line_items

**Question:** Are these:
1. **Same table** - proposal_line_items is correct name
2. **Two different tables** - config_items for template, line_items for submission
3. **Mistake** - Only need line_items

**Recommendation:** Option 1 (same table, use proposal_line_items)

**Your Decision:** _________________

---

## ❓ CLARIFICATION NEEDED

### Question 1: Missing Tables
These tables are referenced but not defined:
1. **integration_logs** - Referenced extensively in PHASE3_INTEGRATION_ARCHITECTURE
2. **alert_preferences** - User-level alert settings
3. **questionnaire_responses** - Where questionnaire answers go

**Should we:**
1. **Add all three tables** - Complete implementation
2. **Add integration_logs only** - Critical for audit
3. **Store in JSON columns** - Simpler but less queryable

**Your Decision:** _________________

---

### Question 2: Missing Indexes
The following performance-critical indexes are missing:
- Composite index on shift_assignments(operator_id, shift_id)
- Index on proposals(tenant_id, status, created_at)
- Composite on payments(contract_id, status)
- Index on deliverables(event_id, status)
- 8 more...

**Should we:**
1. **Add all missing indexes** - Better performance
2. **Add only critical ones** - Start lean
3. **Wait for performance issues** - YAGNI

**Your Decision:** _________________

---

### Question 3: Table Count Discrepancy
**Documentation says:** 39-45 tables
**Actual count:** 47 tables

**This is because:**
- Phase 2.4 deliverables tables (6) weren't in original count
- Some tables added during development
- Different docs have different counts

**Action:**
1. **Update all docs to say 47** - Accurate
2. **Don't worry about count** - Focus on implementation
3. **Remove extra tables** - Get back to 45

**Your Decision:** _________________

---

## ✅ ALREADY DECIDED (Confirming from docs)

Based on your previous decisions:

1. **Payment Schedule:** Manual only, not automated ✅
2. **E-Signature:** SignWell integration ✅
3. **Email Service:** Mailgun (existing) ✅
4. **Proposal Expiration:** No expiration ✅
5. **Duplicate Leads:** Merge and update ✅
6. **Contract Counter-sign:** Auto-sign when sent ✅
7. **Suite Handoff:** Contract signed triggers event ✅
8. **Domains:** streamstage.live + commandcentered.app ✅
9. **Google Drive:** Yes, Sprint 5 ✅

---

## 🎯 QUICK DECISION MATRIX

**Just answer these with numbers:**

1. operator_skills: **1** (columns) or **2** (tables)? _____
2. operator naming: **1** (gear) or **2** (equipment)? _____
3. Hotel tracking: **1** (events columns) or **2** (operator_hotels table)? _____
4. Remove expires_at: **Y** or **N**? _____
5. History suffix: **1** (_history) or **2** (keep mixed)? _____
6. lead_notes: **1** (separate) or **2** (merge)? _____
7. Missing tables: **1** (add all) or **2** (integration_logs only)? _____
8. Missing indexes: **1** (add all) or **2** (critical only)? _____

---

## NEXT STEPS

Once you provide decisions:

1. I'll update schema.prisma with your choices
2. Generate final migration SQL files
3. Lock the schema specification
4. Begin Sprint 1 implementation

**Estimated time to lock schema after decisions:** 30 minutes