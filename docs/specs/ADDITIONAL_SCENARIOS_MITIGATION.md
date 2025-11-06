# CommandCentered - Additional Scenarios & Mitigation Strategies

**Date:** 2025-11-06
**Purpose:** Document 12 additional uncovered scenarios with mitigation strategies
**Status:** Recommendations for spec v2.2

---

## 🔴 Critical Business Logic Scenarios

### Scenario 11: Operator Last-Minute Cancellation (Day-Of)

**Context:** John texts "I'm sick" 2 hours before shift starts

**Current Gap:** No emergency reassignment workflow

**Mitigation Strategy:**

**Option A: MVP - Manual Workflow with Helper Tools**
1. Add `shift_assignments.status` field:
   ```sql
   ALTER TABLE shift_assignments ADD COLUMN status TEXT NOT NULL DEFAULT 'confirmed'
   CHECK (status IN ('confirmed', 'cancelled', 'completed'));
   ```

2. When marking assignment as 'cancelled':
   - Show "Find Replacement" button
   - Query operators who:
     - Same or higher skill level for role
     - No conflicting shifts
     - Not on blackout
     - Close proximity (if vehicle/ride needed)
   - Display ranked list with availability + travel time
   - Owner manually selects replacement

3. Notification helper:
   - Generate draft text: "John cancelled. Can you cover [shift details]?"
   - Owner sends manually (SMS/call)

**Option B: Phase 8 - Automated**
- Auto-notify top 3 candidates
- First to accept gets assignment
- SMS integration for responses

**Recommendation:** Option A for MVP. Emergency cancellations rare enough (<5% of shifts) that manual process acceptable.

**Schema Changes Required:**
```sql
-- Add to shift_assignments table
ALTER TABLE shift_assignments ADD COLUMN status TEXT NOT NULL DEFAULT 'confirmed'
CHECK (status IN ('confirmed', 'cancelled', 'completed'));

ALTER TABLE shift_assignments ADD COLUMN cancelled_at TIMESTAMPTZ;
ALTER TABLE shift_assignments ADD COLUMN cancellation_reason TEXT;
ALTER TABLE shift_assignments ADD COLUMN replacement_assignment_id UUID REFERENCES shift_assignments(id);
```

**Implementation Priority:** 🟡 Phase 3 (Shift Assignment) - Add field, basic cancellation UI

---

### Scenario 12: Event Cancellation Mid-Event

**Context:** 3-day festival cancelled after Day 1 completes (Day 2-3 cancelled)

**Current Gap:** No partial completion logic

**Mitigation Strategy:**

**Shift-Based Model Solves This Naturally:**
- Day 1 shifts: Mark as 'completed', operators paid
- Day 2-3 shifts: Mark as 'cancelled', no payment
- Equipment: Already at venue from Day 1, needs retrieval

**Required Logic:**

1. Add cancellation workflow at shift level:
   ```typescript
   // Cancel remaining shifts for event
   async function cancelRemainingShifts(eventId: string, reason: string) {
     const now = new Date();

     // Find all future shifts
     const futureShifts = await prisma.shifts.findMany({
       where: { event_id: eventId, start_time: { gt: now } }
     });

     // Mark assignments as cancelled
     for (const shift of futureShifts) {
       await prisma.shift_assignments.updateMany({
         where: { shift_id: shift.id },
         data: {
           status: 'cancelled',
           cancellation_reason: reason,
           cancelled_at: now
         }
       });
     }
   }
   ```

2. Equipment retrieval workflow:
   - If ANY shift is 'completed' but event has cancelled shifts:
   - Flag equipment as 'needs_retrieval' instead of auto-return
   - Add manual "Equipment Retrieved" action

3. Financial tracking:
   - Revenue field remains full amount (what was contracted)
   - Add `actual_revenue` field for what was actually received
   - Add `cancellation_penalty` field (if client pays partial)

**Schema Changes Required:**
```sql
-- Add to events table
ALTER TABLE events ADD COLUMN actual_revenue DECIMAL(10,2);
ALTER TABLE events ADD COLUMN cancellation_penalty DECIMAL(10,2);
ALTER TABLE events ADD COLUMN cancellation_reason TEXT;

-- Add to equipment_assignments table
ALTER TABLE equipment_assignments ADD COLUMN needs_retrieval BOOLEAN DEFAULT false;
ALTER TABLE equipment_assignments ADD COLUMN retrieved_at TIMESTAMPTZ;
```

**Implementation Priority:** 🟢 Phase 2 (Core CRUD) - Add fields and basic cancellation logic

---

### Scenario 13: Impossible Conflicts with Travel Time

**Context:** John assigned to Event A (Downtown, 2pm-6pm) + Event B (Suburbs, 5pm-9pm). Travel time: 45 min.

**Current Gap:** System warns about overlap but doesn't validate travel time feasibility

**Mitigation Strategy:**

**Travel Time Validation Levels:**

**Level 1: HARD BLOCK - Physically Impossible**
- Shift A ends: 6pm
- Travel time: 45 min
- Arrival at Shift B: 6:45pm
- Shift B starts: 5pm
- **Impossible:** Can't arrive before shift starts

**Level 2: CAUTION - Tight Schedule**
- Shift A ends: 4pm
- Travel time: 45 min
- Arrival at Shift B: 4:45pm
- Shift B starts: 5pm
- **Tight:** Only 15 min buffer (warning + require confirmation)

**Level 3: REASONABLE**
- Shift A ends: 3pm
- Travel time: 45 min
- Arrival at Shift B: 3:45pm
- Shift B starts: 5pm
- **OK:** 1+ hour buffer (no warning)

**Validation Logic:**
```typescript
async function validateShiftConflict(
  operatorId: string,
  newShift: { start: Date; end: Date; venueId: string }
) {
  // Get operator's other shifts on same day
  const existingShifts = await getOperatorShiftsOnDate(operatorId, newShift.start);

  for (const existing of existingShifts) {
    // Check time overlap
    if (timesOverlap(existing, newShift)) {
      return {
        level: 'HARD_BLOCK',
        reason: 'Shifts overlap in time'
      };
    }

    // Check travel time feasibility
    if (existing.end < newShift.start) {
      // Existing shift ends before new one starts
      const travelTime = await getTravelTime(existing.venueId, newShift.venueId);
      const arrivalTime = addMinutes(existing.end, travelTime);
      const bufferMinutes = differenceInMinutes(newShift.start, arrivalTime);

      if (bufferMinutes < 0) {
        return {
          level: 'HARD_BLOCK',
          reason: `Cannot arrive in time. Travel takes ${travelTime} min, but shift starts ${Math.abs(bufferMinutes)} min before arrival.`
        };
      } else if (bufferMinutes < 30) {
        return {
          level: 'CAUTION',
          reason: `Tight schedule. Only ${bufferMinutes} min buffer after ${travelTime} min drive.`
        };
      }
    }
  }

  return { level: 'OK' };
}
```

**Schema Changes Required:**
```sql
-- Add to shifts table
ALTER TABLE shifts ADD COLUMN venue_id UUID REFERENCES venues(id); -- If venues become separate table
-- OR store venue lat/lng directly on shifts for travel calculation

-- Add to shift_assignments table
ALTER TABLE shift_assignments ADD COLUMN conflict_override_reason TEXT;
ALTER TABLE shift_assignments ADD COLUMN conflict_level TEXT CHECK (conflict_level IN ('none', 'caution', 'impossible'));
```

**Implementation Priority:** 🔴 Phase 3 (Shift Assignment & Conflicts) - CRITICAL for usability

---

### Scenario 14: Equipment Batch Check-Out/Check-In

**Context:** Packing 50 items for large event, need bulk operations

**Current Gap:** No bulk status updates, no "missing equipment" status

**Mitigation Strategy:**

**Bulk Operations API:**
```typescript
// Bulk pack equipment for event
async function bulkPackEquipment(eventId: string, equipmentIds: string[]) {
  await prisma.$transaction(async (tx) => {
    // Update all equipment assignments
    await tx.equipment_assignments.updateMany({
      where: {
        event_id: eventId,
        equipment_id: { in: equipmentIds }
      },
      data: { pack_status: 'packed' }
    });

    // Create location history entries (bulk)
    const historyEntries = equipmentIds.map(id => ({
      equipment_id: id,
      location: 'Loaded in [Vehicle]',
      timestamp: new Date()
    }));

    await tx.equipment_location_history.createMany({
      data: historyEntries
    });
  });
}

// Report missing equipment
async function reportMissingEquipment(equipmentId: string, eventId: string) {
  await prisma.equipment.update({
    where: { id: equipmentId },
    data: {
      status: 'missing',
      last_seen_location: 'Expected for [Event Name]',
      missing_since: new Date()
    }
  });

  // Remove from event assignment (can't pack what's missing)
  await prisma.equipment_assignments.update({
    where: { event_id: eventId, equipment_id: equipmentId },
    data: {
      pack_status: 'not_packed',
      notes: 'Equipment missing during pack, removed from event'
    }
  });
}
```

**UI Features:**
- Checkbox list: Select all / Select none
- Bulk actions: "Mark all as Packed", "Mark all as At Venue", "Mark all as Returned"
- Missing item flow: "Can't find item" button → marks missing, removes from event, suggests replacement

**Schema Changes Required:**
```sql
-- Update equipment table
ALTER TABLE equipment ADD CONSTRAINT status_check CHECK (
  status IN ('available', 'assigned', 'needs_repair', 'out_of_service', 'missing')
);

ALTER TABLE equipment ADD COLUMN missing_since TIMESTAMPTZ;
ALTER TABLE equipment ADD COLUMN last_seen_location TEXT;
ALTER TABLE equipment ADD COLUMN found_at TIMESTAMPTZ; -- When missing item is found
```

**Implementation Priority:** 🟡 Phase 7 (Polish & Launch) - Nice to have, but manual one-by-one works for MVP

---

## 🟡 Financial & Payment Scenarios

### Scenario 15: Operator Requests Pay Advance

**Context:** John asks "Can you pay me half upfront for this festival?"

**Current Gap:** No advance payment tracking

**Mitigation Strategy:**

**Option A: Simple Notes Field (MVP)**
- Add `payment_notes` field to shift_assignments
- Owner manually records: "Paid $300 advance, $200 remaining"
- No automatic calculation

**Option B: Structured Tracking (Phase 8)**
- Add payment tracking table with multiple payment records per assignment

**Recommendation:** Option A for MVP. Advance payments are rare and handled offline anyway.

**Schema Changes Required:**
```sql
-- Add to shift_assignments table
ALTER TABLE shift_assignments ADD COLUMN payment_notes TEXT;
ALTER TABLE shift_assignments ADD COLUMN advance_paid DECIMAL(10,2) DEFAULT 0;
ALTER TABLE shift_assignments ADD COLUMN balance_due DECIMAL(10,2) GENERATED ALWAYS AS (
  calculated_pay - COALESCE(advance_paid, 0)
) STORED;
```

**Implementation Priority:** 🟢 Phase 5 (Gig Sheets) - Add field, display on operator payment view

---

### Scenario 16: Multiple Operators Share Flat Rate

**Context:** John + Sarah: "We'll do Saturday together for $800 total" (John $450, Sarah $350)

**Current Gap:** No shared payment logic

**Mitigation Strategy:**

**Option A: Manual Split (MVP)**
- Create two separate assignments:
  - John: `pay_type = 'flat'`, `flat_rate = $450`
  - Sarah: `pay_type = 'flat'`, `flat_rate = $350`
- Add shared_payment_note: "Split from $800 total"
- Owner manually calculates split

**Option B: Linked Payments (Phase 8)**
- Add `payment_group_id` to link related assignments
- Show grouped total on UI

**Recommendation:** Option A for MVP. Shared rates rare (<10% of assignments).

**Schema Changes Required:**
```sql
-- Add to shift_assignments table
ALTER TABLE shift_assignments ADD COLUMN payment_group_id UUID;
ALTER TABLE shift_assignments ADD COLUMN payment_group_notes TEXT; -- "Split $800: John $450, Sarah $350"
```

**Implementation Priority:** 🟢 Phase 5 (Gig Sheets) - Add field, show on payment summary

---

### Scenario 17: Event Revenue Changes After Completion

**Context:** Event completed, then client adds $500 bonus OR disputes and pays $500 less

**Current Gap:** No post-completion financial adjustments

**Mitigation Strategy:**

**Use existing fields differently:**
- `revenue_amount` = Original contracted amount
- `actual_revenue` = What was actually received (from Scenario 12)

**Add adjustment tracking:**
```typescript
interface RevenueAdjustment {
  original: number;
  adjustment: number; // positive = bonus, negative = dispute
  actual: number;
  reason: string;
  adjusted_at: Date;
}
```

**Profit Recalculation:**
```typescript
function calculateProfitMargin(event: Event) {
  const revenue = event.actual_revenue ?? event.revenue_amount;
  const totalOperatorCost = sumShiftAssignmentPay(event.id);
  const profit = revenue - totalOperatorCost;
  const margin = (profit / revenue) * 100;

  return { profit, margin };
}
```

**Schema Changes Required:**
```sql
-- Already added in Scenario 12
-- ALTER TABLE events ADD COLUMN actual_revenue DECIMAL(10,2);

-- Add adjustment tracking
ALTER TABLE events ADD COLUMN revenue_adjusted_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN revenue_adjustment_reason TEXT;
```

**Implementation Priority:** 🟢 Phase 5 (Gig Sheets) - Financial reporting needs this

---

## 🟢 Equipment & Logistics Scenarios

### Scenario 18: Equipment Borrowed for Personal Project

**Context:** Operator wants to borrow Camera 2 for personal weekend shoot

**Current Gap:** No personal borrowing workflow, no liability tracking

**Mitigation Strategy:**

**Option A: Treat as "Pseudo-Event" (MVP)**
1. Create special event type: 'personal_borrowing'
2. Create event: "John - Personal Shoot"
3. Assign equipment normally
4. Mark as personal borrowing with liability note

**Option B: Separate Borrowing System (Phase 8)**
- New table: `equipment_personal_borrows`
- Insurance waiver checkbox
- Damage deposit tracking

**Recommendation:** Option A for MVP unless personal borrowing is >25% of equipment usage.

**Schema Changes Required:**
```sql
-- Add new event type
ALTER TABLE events DROP CONSTRAINT events_event_type_check;
ALTER TABLE events ADD CONSTRAINT events_event_type_check CHECK (
  event_type IN ('dance_competition', 'recital', 'concert', 'play', 'personal_borrowing', 'other')
);

-- Add to equipment_assignments
ALTER TABLE equipment_assignments ADD COLUMN is_personal_borrow BOOLEAN DEFAULT false;
ALTER TABLE equipment_assignments ADD COLUMN liability_waiver_signed BOOLEAN;
ALTER TABLE equipment_assignments ADD COLUMN damage_deposit_amount DECIMAL(10,2);
```

**Implementation Priority:** 🟡 Phase 7 (Polish) - Only if user confirms this is common workflow

---

### Scenario 19: Equipment Upgrade/Replacement Mid-Season

**Context:** Camera 1 retired, replaced with Camera 4. Camera 1 was in 3 templates.

**Current Gap:** No equipment retirement workflow, no template migration

**Mitigation Strategy:**

**Soft Retirement Process:**
1. Mark equipment as 'retired' (new status)
2. Show warning on templates: "Camera 1 (retired) - Replace with Camera 4?"
3. Bulk replace tool: "Replace Camera 1 with Camera 4 in all templates"

**Schema Changes Required:**
```sql
-- Update equipment status constraint
ALTER TABLE equipment DROP CONSTRAINT status_check;
ALTER TABLE equipment ADD CONSTRAINT status_check CHECK (
  status IN ('available', 'assigned', 'needs_repair', 'out_of_service', 'missing', 'retired')
);

ALTER TABLE equipment ADD COLUMN retired_at TIMESTAMPTZ;
ALTER TABLE equipment ADD COLUMN replacement_equipment_id UUID REFERENCES equipment(id);
ALTER TABLE equipment ADD COLUMN retirement_reason TEXT;

-- Template migration
CREATE TABLE equipment_template_replacements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id),
  template_id UUID NOT NULL REFERENCES event_equipment_templates(id),

  old_equipment_id UUID NOT NULL REFERENCES equipment(id),
  new_equipment_id UUID NOT NULL REFERENCES equipment(id),
  replaced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Implementation Priority:** 🟢 Phase 7 (Polish) - Equipment lifecycle management

---

### Scenario 20: Vehicle Breakdown Day-Of

**Context:** Van A breaks down, equipment needs re-routing to Van B

**Current Gap:** No vehicle failure workflow

**Mitigation Strategy:**

**Emergency Re-routing Process:**
1. Mark Van A as 'out_of_service'
2. Show all equipment assigned to Van A
3. Bulk reassign to Van B (or mark as "Owner will transport")
4. Show all operators expecting rides in Van A
5. Bulk reassign ride providers

**Schema Changes Required:**
```sql
-- Add to vehicles table
ALTER TABLE vehicles ADD COLUMN status TEXT NOT NULL DEFAULT 'available'
CHECK (status IN ('available', 'in_use', 'out_of_service', 'in_repair'));

ALTER TABLE vehicles ADD COLUMN breakdown_at TIMESTAMPTZ;
ALTER TABLE vehicles ADD COLUMN breakdown_reason TEXT;

-- Cascade logic handled in application layer, not database
```

**Implementation Priority:** 🟢 Phase 4 (Calendar) - Logistics management

---

### Scenario 21: Operator Brings Wrong Equipment

**Context:** John brings Sony A7III instead of requested A7IV

**Current Gap:** No equipment verification at venue, no mismatch tracking

**Mitigation Strategy:**

**Option A: Manual Notes (MVP)**
- Add notes field to operator_equipment_requests
- Owner records: "Brought A7III instead of A7IV - worked fine"

**Option B: Check-in Verification (Phase 8)**
- Mobile checklist at venue
- Scan QR codes on equipment
- Flag mismatches automatically

**Recommendation:** Option A for MVP. Verification overhead not worth it unless frequent mismatches.

**Schema Changes Required:**
```sql
-- Add to operator_equipment_requests table
ALTER TABLE operator_equipment_requests ADD COLUMN verified_at TIMESTAMPTZ;
ALTER TABLE operator_equipment_requests ADD COLUMN actual_brought TEXT; -- If different from requested
ALTER TABLE operator_equipment_requests ADD COLUMN verification_notes TEXT;
```

**Implementation Priority:** 🔵 Phase 8 (Future) - Low priority unless user reports frequent issues

---

## 🔵 Skills & Training Scenarios

### Scenario 22: Operator Skill Degradation

**Context:** Sarah hasn't done photography in 6 months, only video work

**Current Gap:** No skill decay or "rustiness" tracking

**Mitigation Strategy:**

**Option A: No Automatic Decay (MVP)**
- Skills are manually managed
- Owner adjusts if they notice degradation
- Use operator_skill_history to track changes

**Option B: Activity Tracking (Phase 8)**
- Track last time operator worked each role
- Show "Last photography gig: 6 months ago" warning
- Optional: Auto-suggest skill review if >6 months inactive

**Recommendation:** Option A for MVP. Skills are subjective and owner knows operators personally.

**Schema Changes Required:**
```sql
-- Add to operators table (if implementing Option B later)
ALTER TABLE operators ADD COLUMN last_videography_shift TIMESTAMPTZ;
ALTER TABLE operators ADD COLUMN last_photography_shift TIMESTAMPTZ;
ALTER TABLE operators ADD COLUMN last_directing_shift TIMESTAMPTZ;

-- Update automatically when shift completes
```

**Implementation Priority:** 🔵 Phase 8 (Future) - Nice to have, not critical

---

### Scenario 23: Training Attendance Without Skill Upgrade

**Context:** Mike attends training but owner decides "no improvement, no upgrade"

**Current Gap:** Training attendance assumes automatic skill upgrade

**Mitigation Strategy:**

**Decouple Attendance from Upgrade:**
1. Mark attendance in `training_attendees` table: `attended = true`
2. Separately approve skill upgrade: `skill_upgraded = false` by default
3. Owner reviews after training, manually upgrades skills
4. Skill upgrade creates entry in `operator_skill_history` linked to training

**This is ALREADY supported in current schema:**
```sql
-- training_attendees table has:
attended BOOLEAN DEFAULT true,
skill_upgraded BOOLEAN DEFAULT false,  -- ✅ Already supports this!
```

**No schema changes needed!** Just clarify in spec that:
- Attendance ≠ automatic upgrade
- Owner reviews and manually approves upgrades
- training_attendees.skill_upgraded tracks if upgrade was given

**Implementation Priority:** ✅ Already supported in spec - just document workflow clearly

---

## Summary: Implementation Priority Matrix

### 🔴 MUST FIX - Phase 1-3 (Before Launch)

| Scenario | Impact | Complexity | Phase | Schema Changes |
|----------|--------|-----------|-------|----------------|
| #13: Impossible Conflicts | HIGH | Medium | Phase 3 | Add conflict_level, override fields |
| #12: Mid-Event Cancellation | HIGH | Low | Phase 2 | Add actual_revenue, cancellation fields |
| #11: Last-Minute Cancellation | MEDIUM | Medium | Phase 3 | Add assignment status, cancellation tracking |

### 🟡 SHOULD ADD - Phase 4-6

| Scenario | Impact | Complexity | Phase | Schema Changes |
|----------|--------|-----------|-------|----------------|
| #15: Pay Advances | LOW | Low | Phase 5 | Add advance_paid, balance_due |
| #16: Shared Flat Rates | LOW | Low | Phase 5 | Add payment_group_id |
| #17: Revenue Adjustments | MEDIUM | Low | Phase 5 | Already added in #12 |
| #19: Equipment Retirement | MEDIUM | Medium | Phase 7 | Add retired status, replacement tracking |
| #20: Vehicle Breakdown | MEDIUM | Medium | Phase 4 | Add vehicle status, breakdown tracking |

### 🟢 NICE TO HAVE - Phase 7+

| Scenario | Impact | Complexity | Phase | Schema Changes |
|----------|--------|-----------|-------|----------------|
| #14: Bulk Equipment Ops | LOW | Medium | Phase 7 | Add missing status, bulk history |
| #18: Personal Borrowing | LOW | Medium | Phase 7 | Add personal_borrowing event type |
| #21: Equipment Verification | LOW | High | Phase 8 | Add verification fields |

### 🔵 FUTURE ENHANCEMENTS - Phase 8+

| Scenario | Impact | Complexity | Phase | Schema Changes |
|----------|--------|-----------|-------|----------------|
| #22: Skill Degradation | LOW | Low | Phase 8 | Add last_used timestamps |
| #23: Training No-Upgrade | ✅ | None | N/A | Already supported! |

---

## Recommended Schema Updates for v2.2

### Critical Additions (Before Implementation)

```sql
-- SCENARIO 13: Impossible Conflicts
ALTER TABLE shift_assignments ADD COLUMN conflict_level TEXT
CHECK (conflict_level IN ('none', 'caution', 'impossible'));
ALTER TABLE shift_assignments ADD COLUMN conflict_override_reason TEXT;

-- SCENARIO 12: Mid-Event Cancellation
ALTER TABLE events ADD COLUMN actual_revenue DECIMAL(10,2);
ALTER TABLE events ADD COLUMN cancellation_penalty DECIMAL(10,2);
ALTER TABLE events ADD COLUMN cancellation_reason TEXT;

ALTER TABLE equipment_assignments ADD COLUMN needs_retrieval BOOLEAN DEFAULT false;
ALTER TABLE equipment_assignments ADD COLUMN retrieved_at TIMESTAMPTZ;

-- SCENARIO 11: Last-Minute Cancellation
ALTER TABLE shift_assignments ADD COLUMN status TEXT NOT NULL DEFAULT 'confirmed'
CHECK (status IN ('confirmed', 'cancelled', 'completed'));
ALTER TABLE shift_assignments ADD COLUMN cancelled_at TIMESTAMPTZ;
ALTER TABLE shift_assignments ADD COLUMN cancellation_reason TEXT;
ALTER TABLE shift_assignments ADD COLUMN replacement_assignment_id UUID REFERENCES shift_assignments(id);
```

### Important Additions (Phase 4-6)

```sql
-- SCENARIO 15: Pay Advances
ALTER TABLE shift_assignments ADD COLUMN advance_paid DECIMAL(10,2) DEFAULT 0;
ALTER TABLE shift_assignments ADD COLUMN payment_notes TEXT;

-- SCENARIO 16: Shared Flat Rates
ALTER TABLE shift_assignments ADD COLUMN payment_group_id UUID;
ALTER TABLE shift_assignments ADD COLUMN payment_group_notes TEXT;

-- SCENARIO 19: Equipment Retirement
ALTER TABLE equipment ADD CONSTRAINT status_check CHECK (
  status IN ('available', 'assigned', 'needs_repair', 'out_of_service', 'missing', 'retired')
);
ALTER TABLE equipment ADD COLUMN retired_at TIMESTAMPTZ;
ALTER TABLE equipment ADD COLUMN replacement_equipment_id UUID REFERENCES equipment(id);

-- SCENARIO 20: Vehicle Breakdown
ALTER TABLE vehicles ADD COLUMN status TEXT NOT NULL DEFAULT 'available'
CHECK (status IN ('available', 'in_use', 'out_of_service', 'in_repair'));
ALTER TABLE vehicles ADD COLUMN breakdown_at TIMESTAMPTZ;
```

### Optional Additions (Phase 7+)

```sql
-- SCENARIO 14: Bulk Operations & Missing Equipment
ALTER TABLE equipment ADD COLUMN missing_since TIMESTAMPTZ;
ALTER TABLE equipment ADD COLUMN last_seen_location TEXT;
ALTER TABLE equipment ADD COLUMN found_at TIMESTAMPTZ;

-- SCENARIO 18: Personal Borrowing
ALTER TABLE equipment_assignments ADD COLUMN is_personal_borrow BOOLEAN DEFAULT false;
ALTER TABLE equipment_assignments ADD COLUMN liability_waiver_signed BOOLEAN;
ALTER TABLE equipment_assignments ADD COLUMN damage_deposit_amount DECIMAL(10,2);

-- SCENARIO 21: Equipment Verification
ALTER TABLE operator_equipment_requests ADD COLUMN verified_at TIMESTAMPTZ;
ALTER TABLE operator_equipment_requests ADD COLUMN actual_brought TEXT;
ALTER TABLE operator_equipment_requests ADD COLUMN verification_notes TEXT;
```

---

## Next Steps

1. **User Review:** Which scenarios are realistic for your business?
2. **Prioritize:** Confirm which are MVP (Phase 1-3) vs. future
3. **Update Spec:** Incorporate critical schema changes into v2.2
4. **Proceed:** Begin Phase 1 implementation with complete schema

**Questions for User:**
1. How often do last-minute cancellations happen? (Daily? Monthly? Rarely?)
2. Have you ever had mid-event cancellations? (Could it happen?)
3. Do you allow personal equipment borrowing? (If yes, how often?)
4. Do operators ever share flat rates, or always individual negotiation?
5. How often do vehicles break down day-of? (Never? Rare? Occasional?)

---

**Session Complete - 12 scenarios documented with mitigation strategies**
