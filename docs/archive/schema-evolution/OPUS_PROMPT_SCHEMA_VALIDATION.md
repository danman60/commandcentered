# OPUS RUN: Schema Cross-Validation & Prisma Generation

**Goal:** Validate schema consistency across all spec documents, identify conflicts, and generate production-ready Prisma schema

**Duration:** 1-2 Opus runs (within expiring credits)

**DO NOT lock in naming yet** - Flag ambiguities and propose options, user will decide

---

## TASK 1: Cross-Reference Schema Validation

### Input Documents (Load ALL)

**Primary Schema Definitions:**
1. `SPEC_V2_LOCKED.md` (~2500 lines) - Master spec with Phase 2 + Phase 3 tables
2. `PHASE3_DATABASE_SCHEMA.md` (~1000 lines) - Phase 3 detailed schema
3. `SCHEMA_NAMING_LOCKED.md` (~450 lines) - Naming conventions + table list
4. `docs/specs/SCHEMA_V2_SHIFTS.md` - Phase 2 shift-based model
5. `docs/specs/SCHEMA_V2.1_ADDITIONS.md` - Phase 2 additions (skills, personal gear)

**Supporting Documents:**
6. `PHASE3_WORKFLOWS.md` - 11 workflows with database operations
7. `PHASE3_ALERTS_NOTIFICATIONS.md` - Alerts table variations
8. `PHASE3_INTEGRATION_ARCHITECTURE.md` - Integration tables
9. `PHASE3_DECISIONS_LOG.md` - Recent schema decisions

### Validation Checklist

For each table mentioned in ANY document, verify:

#### A. Table Definition Consistency
- [ ] Table name appears in at least 2 documents with same spelling
- [ ] CREATE TABLE statement exists (not just mentioned in concept)
- [ ] Column names match across all references
- [ ] Data types match (UUID vs VARCHAR, TEXT vs JSONB, etc.)
- [ ] NOT NULL constraints consistent
- [ ] DEFAULT values consistent
- [ ] CHECK constraints documented

#### B. Foreign Key Integrity
- [ ] Referenced table exists (contracts.id → events.contract_id)
- [ ] FK column data type matches parent PK data type
- [ ] ON DELETE behavior specified (CASCADE, RESTRICT, SET NULL)
- [ ] ON DELETE logic matches business rules in workflows
- [ ] Circular dependencies identified (if any)

#### C. Relationship Symmetry
- [ ] If Table A references Table B, is reverse documented?
- [ ] One-to-many relationships clear (parent → children)
- [ ] Many-to-many junction tables identified
- [ ] Polymorphic relationships documented (related_entity_type/id)

#### D. Index Coverage
- [ ] Foreign keys have indexes (performance)
- [ ] tenant_id indexed on ALL tables (RLS requirement)
- [ ] Workflow queries covered by indexes
- [ ] Composite indexes for common query patterns

#### E. Business Logic Alignment
- [ ] Required fields (NOT NULL) match workflow "must provide"
- [ ] Optional fields (nullable) match workflow "can be empty"
- [ ] Status enums match workflow state machines
- [ ] Timestamps match workflow event tracking

#### F. Naming Conflicts
- [ ] No ambiguous names (is "operator_skills" junction or owned data?)
- [ ] Suffix consistency (_history, _tracking, _log)
- [ ] Plural vs singular consistency
- [ ] Junction table naming pattern consistent

### Output Format

```markdown
## SCHEMA CROSS-VALIDATION REPORT

### Executive Summary
- Tables Validated: X / Y (expected 47)
- Critical Conflicts: X
- Naming Ambiguities: X
- Missing Tables: X
- Missing Indexes: X
- Business Logic Mismatches: X

### Section 1: Table Inventory
[Table-by-table status: ✅ Validated, ⚠️ Conflicts, ❌ Missing]

### Section 2: Critical Conflicts
[High-priority issues that block implementation]

### Section 3: Naming Ambiguities
[Tables/columns with unclear or inconsistent names - DO NOT decide, just flag]

### Section 4: Missing Foreign Keys
[Relationships mentioned in workflows but no FK constraint]

### Section 5: Missing Indexes
[Queries in workflows that would benefit from indexes]

### Section 6: Business Logic Mismatches
[Schema says optional but workflow says required, etc.]

### Section 7: Recommendations (NOT LOCKED)
[Proposed fixes with options - user will choose]
```

---

## TASK 2: Generate Prisma Schema (Draft)

### Instructions

1. **For each validated table**, create Prisma model:

```prisma
model TableName {
  // Identity
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Tenant isolation (required on ALL tables)
  tenantId  String   @map("tenant_id") @db.Uuid
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Restrict)

  // Fields...

  // Relationships...

  // Indexes
  @@index([tenantId])
  @@map("table_name")
}
```

2. **For relationships**, use proper Prisma syntax:

```prisma
// One-to-Many (Parent)
model Event {
  shifts Shift[] // One event has many shifts
}

// One-to-Many (Child)
model Shift {
  eventId String @map("event_id") @db.Uuid
  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)
}

// Many-to-Many (Junction)
model ShiftAssignment {
  shiftId    String   @map("shift_id") @db.Uuid
  operatorId String   @map("operator_id") @db.Uuid
  shift      Shift    @relation(fields: [shiftId], references: [id], onDelete: Cascade)
  operator   Operator @relation(fields: [operatorId], references: [id], onDelete: Cascade)
}
```

3. **For enums**, extract from CHECK constraints:

```prisma
enum EventStatus {
  confirmed
  scheduled
  in_progress
  completed
  archived
  cancelled
}

model Event {
  status EventStatus @default(confirmed)
}
```

4. **For JSONB fields**, use Prisma Json type:

```prisma
model ProposalTemplate {
  configJson Json @map("config_json") @db.JsonB
}
```

5. **For polymorphic relationships**, document in comments:

```prisma
model Alert {
  // Polymorphic relationship - can reference events, contracts, payments, etc.
  relatedEntityType String? @map("related_entity_type") @db.VarChar(50)
  relatedEntityId   String? @map("related_entity_id") @db.Uuid

  /// NOTE: No FK constraint - polymorphic relationship
  /// Cleanup handled by triggers (see SCHEMA_FINAL_AUDIT.md Finding 5)
}
```

### Validation Steps

After generating Prisma schema:

1. **Syntax check** - Does it match Prisma schema format?
2. **Relationship symmetry** - If Event has shifts[], does Shift have event?
3. **Enum extraction** - All status fields use enums (not strings)?
4. **Index coverage** - All tenant_id fields have @@index?
5. **Map directives** - All snake_case DB columns have @map?

### Output Format

```prisma
// CommandCentered - Complete Prisma Schema
// Generated: 2025-01-09
// Status: DRAFT - Review required before locking

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// PHASE 1: FOUNDATION (2 tables)
// ============================================

model Tenant {
  // ... complete definition
}

model UserProfile {
  // ... complete definition
}

// ============================================
// PHASE 2: LOGISTICS - SUITE 2 (27 tables)
// ============================================

// Events & Shifts
model Event { ... }
model Shift { ... }
model ShiftAssignment { ... }

// Operators
model Operator { ... }
// ... etc for all 47 tables

// ============================================
// ENUMS
// ============================================

enum EventStatus { ... }
enum ShiftAssignmentStatus { ... }
// ... all enums extracted from CHECK constraints
```

---

## TASK 3: Flag Ambiguities (DO NOT DECIDE)

### Naming Ambiguities to Flag

For each ambiguous name, provide:

1. **What's ambiguous** - "operator_skills: junction table but named like owned data"
2. **Where it appears** - List files + line numbers
3. **Options** - Propose 2-3 alternatives with pros/cons
4. **Impact** - LOW/MEDIUM/HIGH (how hard to change later)
5. **Recommendation** - Your opinion, but make clear it's NOT locked

**Example Format:**

```markdown
### Ambiguity #3: `gear_tracking_log` suffix inconsistency

**Issue:** Uses `_tracking_log` suffix, but other history tables use `_history`

**Locations:**
- SPEC_V2_LOCKED.md:149 (CREATE TABLE gear_tracking_log)
- SCHEMA_NAMING_LOCKED.md:186 (flagged for rename)

**Options:**
1. **Keep as-is** (`gear_tracking_log`)
   - Pro: Already in spec, no changes needed
   - Con: Inconsistent with operator_skill_history pattern

2. **Rename to `gear_movement_history`**
   - Pro: Consistent with _history suffix pattern
   - Con: Requires find/replace across docs + code

3. **Rename to `gear_movements`** (no suffix)
   - Pro: Simple, clear
   - Con: Doesn't indicate it's historical/audit data

**Impact:** LOW (audit table, not heavily referenced)

**Recommendation:** Option 2 (rename to gear_movement_history) for consistency

**User Decision Required:** ⬜ Option 1  ⬜ Option 2  ⬜ Option 3
```

---

## DELIVERABLES

### File 1: `SCHEMA_CROSS_VALIDATION_REPORT.md`
- Comprehensive validation report
- Conflicts identified with severity
- Ambiguities flagged (not decided)
- Recommendations with options

### File 2: `schema.prisma` (DRAFT)
- Complete Prisma schema for all 47 tables
- All relationships defined
- All enums extracted
- All indexes specified
- Comments for complex relationships

### File 3: `SCHEMA_DECISIONS_REQUIRED.md`
- Numbered list of decisions user must make
- Each decision has 2-4 options with pros/cons
- Priority ranking (CRITICAL → Nice to have)
- Estimated impact of each decision

### File 4: `SCHEMA_IMPLEMENTATION_BLOCKERS.md`
- Issues that MUST be resolved before any code written
- Missing table definitions
- Circular dependencies
- Business logic conflicts

---

## SUCCESS CRITERIA

✅ **Complete when:**
1. All 47 tables validated across all documents
2. All conflicts identified and documented
3. All ambiguities flagged with options (NOT decided)
4. Prisma schema generated and syntax-valid
5. Decision list ready for user review
6. No assumptions made - only facts and options presented

❌ **DO NOT:**
- Lock in any naming decisions without user approval
- Make assumptions about business logic
- Choose between options (present all, let user decide)
- Skip documenting a conflict because it seems minor

---

## EXAMPLE WORKFLOW

```
Step 1: Load all 9 input documents
Step 2: Extract all table names → Create master inventory (expect ~47)
Step 3: For each table, find all references across documents
Step 4: Compare definitions, flag conflicts
Step 5: Generate Prisma model for each table
Step 6: Validate Prisma schema syntax
Step 7: Create decision list (ambiguities + conflicts)
Step 8: Write all 4 deliverables
Step 9: Self-review: Did I make any decisions? (Should be NO)
```

---

## TONE & STYLE

- **Objective** - Present facts, not opinions (except in "Recommendation" sections)
- **Comprehensive** - Don't skip minor issues, document everything
- **Actionable** - Every finding has clear "what needs to happen"
- **Options-focused** - For ambiguities, give 2-4 options with trade-offs
- **No locks** - Everything is "proposed" or "draft" until user approves

---

## COPY THIS PROMPT TO OPUS

```
I need you to perform a comprehensive schema cross-validation for the CommandCentered project. This is a multi-tenant SaaS application with 47 database tables across two major phases (logistics + client management).

Your task:
1. Load 9 specification documents (listed below)
2. Validate every table definition for consistency
3. Generate a complete Prisma schema (draft)
4. Flag all naming ambiguities with options (DO NOT decide)
5. Create decision list for me to review

CRITICAL: Do NOT lock in any naming decisions. Present options with pros/cons and let me choose.

Documents to load:
1. SPEC_V2_LOCKED.md (master spec)
2. PHASE3_DATABASE_SCHEMA.md (Phase 3 tables)
3. SCHEMA_NAMING_LOCKED.md (naming conventions)
4. PHASE3_WORKFLOWS.md (business logic)
5. PHASE3_ALERTS_NOTIFICATIONS.md (alerts variations)
6. docs/specs/SCHEMA_V2_SHIFTS.md (Phase 2 core)
7. docs/specs/SCHEMA_V2.1_ADDITIONS.md (Phase 2 additions)
8. PHASE3_INTEGRATION_ARCHITECTURE.md (integration tables)
9. PHASE3_DECISIONS_LOG.md (recent decisions)

Deliverables:
1. SCHEMA_CROSS_VALIDATION_REPORT.md (comprehensive validation)
2. schema.prisma (complete, syntax-valid draft)
3. SCHEMA_DECISIONS_REQUIRED.md (numbered list with options)
4. SCHEMA_IMPLEMENTATION_BLOCKERS.md (must-fix before coding)

Full instructions in: OPUS_PROMPT_SCHEMA_VALIDATION.md

Begin by loading all 9 documents, then follow the validation checklist systematically.
```

---

**Ready to run:** ✅ Copy prompt above to Opus
