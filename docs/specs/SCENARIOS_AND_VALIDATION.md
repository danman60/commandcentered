# CommandCentered - Scenario Validation

**Purpose:** Validate the specification against 10 realistic operational scenarios to identify gaps, inconsistencies, and edge cases.

**Date:** 2025-11-05

---

## Scenario 1: Simple Single Event

**Context:** First event of the season, straightforward dance competition

**Event Details:**
- **Event:** "Spring Showdown Dance Competition"
- **Type:** dance_competition
- **Date:** Saturday, February 15, 2025
- **Venue:** Lincoln High School Auditorium, 123 Main St
- **Times:**
  - Load-in: 7:00 AM
  - Event start: 9:00 AM
  - Event end: 6:00 PM
  - Load-out complete: 8:00 PM
- **Revenue:** $3,500

**Operators Needed:**
- 2 camera operators
- 1 audio technician
- 1 director

**Equipment Needed:**
- 3 camera bodies
- 5 lenses
- 2 audio packs
- 1 laptop for editing
- 3 tripods

**Vehicle:**
- Van A

**Steps to Test:**

1. **Create Event**
   - ✅ Validate: Times logical (load-in ≤ start ≤ end ≤ load-out)
   - ✅ Validate: Event type is valid enum
   - ✅ Result: Event created with status = 'confirmed'

2. **Apply Equipment Template**
   - User selects event type = 'dance_competition'
   - System suggests equipment from template
   - ✅ Validate: Template exists for this event type
   - ✅ Validate: All suggested equipment is 'available' status
   - ✅ Result: Equipment list pre-populated

3. **Assign Operators**
   - Assign John (camera skill: 9, hourly rate: $50)
   - Assign Sarah (camera skill: 8, hourly rate: $45)
   - Assign Mike (audio tech, hourly rate: $40)
   - Assign Lisa (director, hourly rate: $60)
   - ✅ Validate: All operators status = 'active'
   - ✅ Validate: No blackout dates for any operator on Feb 15
   - ✅ Validate: No time conflicts (first event)
   - ✅ Calculate: Estimated hours = 13 hours (7am-8pm)
   - ✅ Calculate: John's pay = $650, Sarah's pay = $585, Mike's pay = $520, Lisa's pay = $780
   - ✅ Calculate: Total operator cost = $2,535
   - ✅ Calculate: Profit margin = $3,500 - $2,535 = $965
   - ✅ Result: Event status changes to 'scheduled'

4. **Assign Equipment**
   - Assign Camera 1, Camera 2, Camera 3
   - Assign Lens A, Lens B, Lens C, Lens D, Lens E
   - Assign Audio Pack 1, Audio Pack 2
   - Assign Laptop 1
   - Assign Tripod 1, Tripod 2, Tripod 3
   - All assigned to Van A
   - ✅ Validate: All equipment status = 'available'
   - ✅ Validate: No time conflicts (first event)
   - ✅ Result: Equipment status changes to 'assigned'
   - ✅ Result: Equipment current_location = "Assigned to Spring Showdown"
   - ✅ Result: Equipment assignments created with pack_status = 'needs_packing'
   - ✅ Result: Vehicle A assigned to event

5. **Generate Packing List**
   - View packing list for event
   - ✅ Validate: All 14 items listed
   - ✅ Validate: Grouped by vehicle (Van A)
   - ✅ Validate: Pack status = 'needs_packing' for all

6. **Day Before Event - Pack Equipment**
   - User marks all equipment as 'packed'
   - ✅ Validate: Bulk status update works
   - ✅ Result: All equipment pack_status = 'packed'
   - ✅ Result: Location history entry created for each item: "Loaded in Van A"

7. **Event Day - Arrive at Venue**
   - User marks equipment as 'at_event'
   - ✅ Result: All equipment pack_status = 'at_event'
   - ✅ Result: Location history entry: "At Lincoln High School"

8. **Event Day - Mark Event In Progress**
   - User changes event status to 'in_progress'
   - ✅ Validate: Valid state transition (scheduled → in_progress)
   - ✅ Result: Event status = 'in_progress'

9. **After Event - Complete Event**
   - User marks event as 'completed'
   - ✅ Validate: Valid state transition (in_progress → completed)
   - ✅ Result: Event status = 'completed'
   - ✅ Result: All equipment_assignments pack_status = 'returned'
   - ✅ Result: All equipment status = 'available'
   - ✅ Result: All equipment current_location = "In Shop"
   - ✅ Result: Location history entry: "Returned to Shop"

10. **Enter Actual Hours**
    - John worked 13.5 hours (30 min overtime)
    - Sarah worked 13 hours (no overtime)
    - Mike worked 12.5 hours (0.5 hours under)
    - Lisa worked 14 hours (1 hour overtime)
    - ✅ Calculate: John overtime = 0.5 hours
    - ✅ Calculate: Sarah overtime = 0 hours
    - ✅ Calculate: Mike overtime = 0 hours (negative doesn't count)
    - ✅ Calculate: Lisa overtime = 1 hour
    - ✅ Calculate: Total actual cost = (13.5×$50) + (13×$45) + (12.5×$40) + (14×$60) = $2,600
    - ✅ Calculate: Total overtime = 1.5 hours
    - ✅ Result: Actual profit = $3,500 - $2,600 = $900

**Spec Validation:**
- ✅ Event creation workflow works
- ✅ Template suggestion works
- ✅ Operator assignment with pay calculation works
- ✅ Equipment assignment works
- ✅ Packing list generation works
- ✅ Status transitions work
- ✅ Equipment location tracking works
- ✅ Overtime calculation works

**Issues Found:** None

---

## Scenario 2: Overlapping Events - Conflict Detection

**Context:** Two dance competitions on the same day, need to detect conflicts

**Event A: "Morning Competition"**
- Date: Saturday, March 1, 2025
- Load-in: 7:00 AM
- Event: 9:00 AM - 1:00 PM
- Load-out: 3:00 PM

**Event B: "Afternoon Recital"**
- Date: Saturday, March 1, 2025
- Load-in: 2:00 PM
- Event: 4:00 PM - 8:00 PM
- Load-out: 10:00 PM

**Steps to Test:**

1. **Create Event A**
   - ✅ Event A created successfully

2. **Assign John to Event A (7am-3pm)**
   - ✅ John assigned, no conflicts

3. **Create Event B**
   - ✅ Event B created successfully

4. **Try to Assign John to Event B (2pm-10pm)**
   - ⚠️ System detects time overlap: Event A (7am-3pm) overlaps with Event B (2pm-10pm)
   - ⚠️ Conflict window: 2pm-3pm (1 hour overlap)
   - ✅ System shows warning modal: "John is already assigned to Morning Competition (7am-3pm). There is a 1-hour conflict (2pm-3pm)."
   - ✅ Options: "Cancel" or "Override (assign anyway)"
   - User clicks "Override" with confirmation checkbox
   - ✅ Result: John assigned to both events (override recorded)

5. **Try to Assign Camera 1 to Event B**
   - Camera 1 already assigned to Event A (7am-3pm)
   - ⚠️ System detects equipment conflict
   - ✅ System shows warning: "Camera 1 is already assigned to Morning Competition (7am-3pm)."
   - ✅ Options: "Cancel" or "Override (assuming you have backup)"
   - User cancels, uses Camera 2 instead
   - ✅ Result: Camera 1 stays with Event A, Camera 2 assigned to Event B

6. **Try to Assign Van A to Event B**
   - Van A already assigned via equipment for Event A
   - ⚠️ System detects vehicle conflict
   - ✅ System shows warning: "Van A is already transporting equipment for Morning Competition (7am-3pm)."
   - User assigns equipment for Event B to Van B instead
   - ✅ Result: Event A uses Van A, Event B uses Van B

**Spec Validation:**
- ✅ Operator time conflict detection works
- ✅ Equipment double-booking detection works
- ✅ Vehicle conflict detection works
- ✅ Override mechanism works
- ✅ Conflict warnings show details (which event, time overlap)

**Issues Found:**

❌ **ISSUE 1:** Spec doesn't clearly define how to calculate "overlap window" for display.

**Proposed Fix:** Add to spec:
```
Overlap calculation:
overlap_start = MAX(event_a.load_in, event_b.load_in)
overlap_end = MIN(event_a.load_out, event_b.load_out)
overlap_duration = overlap_end - overlap_start (if positive)
```

❌ **ISSUE 2:** Spec doesn't specify if override should be logged/audited.

**Proposed Fix:** Add `override_reason TEXT` field to operator_assignments and equipment_assignments, log when user overrides conflict.

---

## Scenario 3: Operator Blackout Date Conflict

**Context:** Operator requested time off, but owner needs to schedule them anyway (emergency)

**Setup:**
- Sarah has blackout date: March 10-17, 2025 (vacation)
- Event: "State Championship" on March 15, 2025

**Steps to Test:**

1. **Create Event for March 15**
   - ✅ Event created

2. **Try to Assign Sarah**
   - ⚠️ System detects blackout conflict
   - ✅ System shows warning: "Sarah has requested time off March 10-17 (vacation). This event falls within that period."
   - ✅ Options: "Cancel" or "Emergency Override"
   - User clicks "Emergency Override" (enters reason: "State championship, critical event")
   - ✅ Result: Sarah assigned with override flag

3. **Send Schedule Email**
   - ✅ Email includes note: "⚠️ This assignment conflicts with your requested time off (March 10-17). Please contact owner if this is an issue."

**Spec Validation:**
- ✅ Blackout date conflict detection works
- ✅ Override mechanism works

**Issues Found:**

❌ **ISSUE 3:** Should blackout date override send notification to operator automatically?

**Proposed Fix:** Add to spec: When blackout override occurs, log it and optionally flag for manual communication (don't auto-send email, but show warning to owner: "Remember to contact Sarah about this conflict").

---

## Scenario 4: Ride Coordination

**Context:** 4 operators assigned, 2 have vehicles, 2 need rides

**Operators:**
- John: has_vehicle = true, vehicle = "Honda Civic", address = "123 North St"
- Sarah: has_vehicle = true, vehicle = "Toyota Camry", address = "456 South St"
- Mike: has_vehicle = false, address = "150 North St" (near John)
- Lisa: has_vehicle = false, address = "500 South St" (near Sarah)

**Event:**
- "Downtown Competition" - 50 miles from city

**Steps to Test:**

1. **Assign All 4 Operators to Event**
   - John assigned: needs_ride = false (auto-set based on has_vehicle)
   - Sarah assigned: needs_ride = false
   - Mike assigned: needs_ride = true (auto-set)
   - Lisa assigned: needs_ride = true
   - ✅ System shows: "2 operators need rides"

2. **View Ride Coordination Dashboard**
   - System shows:
     - **Need Rides:** Mike (150 North St), Lisa (500 South St)
     - **Have Vehicles:** John (123 North St), Sarah (456 South St)
   - ✅ UI suggests: "Mike is near John (same area)" based on address

3. **Assign Ride Providers**
   - Set Mike's ride_provider_id = John
   - Set Lisa's ride_provider_id = Sarah
   - ✅ Result: Assignments updated

4. **Send Schedule Email**
   - John's email includes: "🚗 You're giving Mike a ride. Pickup: 150 North St"
   - Mike's email includes: "🚗 John is driving. Pickup location: Meet at 150 North St"
   - Sarah's email includes: "🚗 You're giving Lisa a ride. Pickup: 500 South St"
   - Lisa's email includes: "🚗 Sarah is driving. Pickup location: Meet at 500 South St"

**Spec Validation:**
- ✅ needs_ride auto-detection works
- ✅ ride_provider_id linking works
- ✅ Email includes ride info

**Issues Found:**

❌ **ISSUE 4:** Address field is just text - no geocoding or distance calculation.

**Question:** Should we add lat/lng fields for better "near" detection?

**Proposed Fix:** For MVP, keep addresses as text. Owner can visually see addresses and manually assign rides. Phase 8: Add geocoding API integration.

❌ **ISSUE 5:** What if ride provider is removed from event? Should their passengers be flagged?

**Proposed Fix:** Add validation: When removing operator who is ride_provider for others, show warning: "John is giving Mike a ride. If you remove John, you'll need to reassign Mike's ride." Cascade: Set ride_provider_id = NULL when provider removed.

---

## Scenario 5: Equipment Kit Quick Assign

**Context:** Owner has pre-configured "Kit A" with standard competition gear

**Kit A:**
- Camera 1, Camera 2 (tagged "Kit A")
- Lens A, Lens B, Lens C, Lens D (tagged "Kit A")
- Audio Pack 1, Audio Pack 2 (tagged "Kit A")
- Tripod 1, Tripod 2 (tagged "Kit A")

**Event:**
- "Quick Competition" - needs standard kit

**Steps to Test:**

1. **Create Event**
   - ✅ Event created

2. **Quick Assign Kit A**
   - User clicks "Assign Kit" button
   - Selects "Kit A" from dropdown
   - ✅ System finds all equipment with tag "Kit A" (10 items)
   - ✅ System checks: All items status = 'available'
   - ✅ System assigns all 10 items to event at once
   - ✅ Result: 10 equipment_assignments created
   - ✅ Result: Packing list shows all 10 items

3. **Kit Item Unavailable**
   - Camera 1 marked as 'needs_repair'
   - User tries to assign Kit A to new event
   - ⚠️ System shows warning: "Kit A contains Camera 1 (needs_repair). This item will be skipped. Continue?"
   - User clicks "Yes"
   - ✅ Result: 9 items assigned (Camera 1 skipped)

**Spec Validation:**
- ✅ Tag-based filtering works
- ✅ Bulk assignment works
- ✅ Conflict detection for unavailable items works

**Issues Found:**

❌ **ISSUE 6:** If 1 item in kit is unavailable, should we:
  A. Skip just that item and assign the rest?
  B. Block entire kit assignment?
  C. Show warning and let user decide?

**Proposed Fix:** Option C - Show warning listing unavailable items, let user decide to proceed or cancel.

---

## Scenario 6: Equipment Template Auto-Suggest

**Context:** Creating new dance competition, system suggests equipment based on template

**Setup:**
- Template: "Dance Competition Standard" linked to event_type = 'dance_competition'
- Template includes tags: ["Kit A", "Audio Standard"]
- Template includes specific IDs: [Laptop 1, Laptop 2]

**Steps to Test:**

1. **Create Event**
   - Event type = 'dance_competition'
   - ✅ System finds template for 'dance_competition'
   - ✅ System gathers equipment:
     - All items tagged "Kit A"
     - All items tagged "Audio Standard"
     - Laptop 1, Laptop 2 (by ID)
   - ✅ System shows suggestion modal: "Suggested equipment for Dance Competition: [list]. Assign all?"

2. **User Accepts Suggestion**
   - User clicks "Assign All"
   - ✅ System assigns all suggested equipment
   - ✅ Result: Equipment assignments created

3. **User Modifies Suggestion**
   - User unchecks Camera 3 (don't need it)
   - User adds extra Lens E (not in template)
   - User clicks "Assign Selected"
   - ✅ Result: Selected items assigned

**Spec Validation:**
- ✅ Template lookup by event_type works
- ✅ Tag-based gathering works
- ✅ ID-based gathering works
- ✅ User can modify before assigning

**Issues Found:**

❌ **ISSUE 7:** If template references equipment that no longer exists (deleted), what happens?

**Proposed Fix:** Filter out non-existent equipment IDs. Show warning: "Template references 2 items that no longer exist. They have been removed from suggestions."

❌ **ISSUE 8:** Can templates reference equipment from other tenants? (Security concern)

**Proposed Fix:** Add validation: When applying template, verify ALL suggested equipment belongs to same tenant_id. RLS should handle this, but double-check in application logic.

---

## Scenario 7: Event Duplication for Annual Event

**Context:** Spring Showdown happens every year, duplicate from last year

**Last Year's Event:**
- "Spring Showdown 2024" on February 17, 2024
- Had 4 operators assigned (John, Sarah, Mike, Lisa)
- Had 15 pieces of equipment assigned
- Revenue was $3,500

**Steps to Test:**

1. **Duplicate Event**
   - User clicks "Duplicate Event" on Spring Showdown 2024
   - System shows modal:
     - New event name: "Spring Showdown 2025" (auto-incremented year)
     - New date: [blank - user must set]
     - "Copy operator assignments?" checkbox (checked by default)
     - "Copy equipment assignments?" checkbox (checked by default)
   - User sets date to February 15, 2025
   - User clicks "Duplicate"

2. **System Creates New Event**
   - ✅ New event created with same:
     - Event type
     - Venue details
     - Client info
     - Revenue (as starting point)
     - Special notes
   - ✅ New event has NEW times (user sets based on new date)
   - ✅ Status = 'confirmed' (not scheduled yet)

3. **Copy Operator Assignments**
   - ✅ System checks operator availability on new date
   - ⚠️ Mike has blackout date on February 15, 2025
   - ✅ System creates assignments for John, Sarah, Lisa
   - ✅ System shows warning: "Mike was assigned to original event but has a blackout date on February 15. Assignment skipped."
   - ✅ Estimated hours recalculated based on new event times
   - ✅ Pay recalculated based on current operator hourly rates (rates may have changed)

4. **Copy Equipment Assignments**
   - ✅ System checks equipment availability
   - ⚠️ Camera 3 is 'out_of_service'
   - ✅ System assigns 14 equipment items (skips Camera 3)
   - ✅ System shows warning: "Camera 3 was assigned to original event but is currently out of service. Assignment skipped."

**Spec Validation:**
- ✅ Event duplication works
- ✅ Conflict detection during duplication works
- ✅ Partial copy with warnings works

**Issues Found:**

❌ **ISSUE 9:** Should duplicate copy actual_hours from previous event? (For reference)

**Proposed Fix:** No - actual_hours are specific to that event instance. But could add a "notes" field that says "Last year: John worked 13.5 hours" for reference.

❌ **ISSUE 10:** Should duplicate copy pack_status from previous event?

**Proposed Fix:** No - pack_status should always start as 'needs_packing' for new event.

---

## Scenario 8: Multi-Day Event

**Context:** Large festival spanning 3 days

**Event Details:**
- "Summer Dance Festival 2025"
- Friday June 6: Load-in 2pm, Event 6pm-11pm, Load-out 1am
- Saturday June 7: Event 9am-11pm, Load-out 1am
- Sunday June 8: Event 9am-6pm, Load-out 9pm

**Question:** How to model this?

**Option A:** Single event with very long duration (Friday 2pm - Sunday 9pm)
- Pros: Simple, one event entry
- Cons: Operator hour calculation complex, can't track per-day status

**Option B:** Three separate events (Friday, Saturday, Sunday)
- Pros: Can track daily, clearer operator hours
- Cons: Need to link them somehow, equipment stays "at event" across all 3

**Option C:** Single event with custom "multi-day" flag
- Pros: Single entry, can add custom per-day breakdown
- Cons: Adds complexity to schema

**Steps to Test:**

1. **Using Option A (Single Long Event)**
   - Create event with load_in = Friday 2pm, load_out = Sunday 9pm
   - ✅ Event created
   - Assign operators
   - ✅ Estimated hours = 79 hours (Friday 2pm - Sunday 9pm)
   - ❌ Problem: Operators don't work 79 hours straight
   - ❌ Problem: Can't track actual hours per day

2. **Using Option B (Three Separate Events)**
   - Create "Summer Dance Festival - Friday"
   - Create "Summer Dance Festival - Saturday"
   - Create "Summer Dance Festival - Sunday"
   - Assign same operators to all 3
   - ✅ System detects "conflict" (overlapping times)
   - User overrides (they're the same festival)
   - Assign equipment to Friday event only
   - ✅ Equipment marked 'at_event' on Friday
   - ❌ Problem: Need to manually return equipment after Sunday, not Friday
   - ❌ Problem: Equipment shows as "unavailable" for Saturday/Sunday even though it's still at festival

**Spec Validation:**
- ❌ Multi-day events not handled well by current spec

**Issues Found:**

❌ **ISSUE 11:** Multi-day events not properly modeled.

**Proposed Fix Options:**

**Option A:** Keep as-is, document that multi-day festivals should be single event with manual hour tracking per day (use notes field).

**Option B:** Add `is_multi_day` boolean flag + `daily_breakdown` JSONB field:
```json
{
  "days": [
    {"date": "2025-06-06", "start": "18:00", "end": "23:00"},
    {"date": "2025-06-07", "start": "09:00", "end": "23:00"},
    {"date": "2025-06-08", "start": "09:00", "end": "18:00"}
  ]
}
```

**Option C:** Create `event_days` child table (normalized):
```sql
CREATE TABLE event_days (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  day_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);
```

**Recommendation:** Ask user - How often do multi-day events happen? If rare (1-2 per year), Option A (manual notes). If common (monthly), Option C (proper schema support).

---

## Scenario 9: Equipment Breaks During Event

**Context:** Camera 1 breaks during event, need to track repair

**Event:** "Saturday Competition" in progress

**Steps to Test:**

1. **Event In Progress**
   - Event status = 'in_progress'
   - Camera 1 assigned to event, pack_status = 'at_event'

2. **Camera 1 Breaks**
   - User marks Camera 1 as 'needs_repair'
   - ✅ Equipment status changes to 'needs_repair'
   - ❌ Problem: Camera 1 still assigned to event
   - ❌ Problem: Equipment assignment still shows pack_status = 'at_event'

3. **Complete Event**
   - User marks event as 'completed'
   - System auto-returns all equipment to 'available'
   - ❌ Problem: Camera 1 should stay 'needs_repair', not return to 'available'

**Spec Validation:**
- ❌ Equipment breaking during event not handled properly

**Issues Found:**

❌ **ISSUE 12:** When marking equipment 'needs_repair', should it affect current assignments?

**Proposed Fix:**
1. Add validation: If equipment currently assigned to active event (status = 'in_progress'), show warning: "Camera 1 is currently at an event. Are you marking it for repair after the event, or did it break during the event?"
2. If broken during event: Keep assignment, but add flag `broken_during_event = true`
3. On event completion: Check for `broken_during_event` flag, keep status as 'needs_repair' instead of auto-returning to 'available'

Update operator_assignments table:
```sql
ALTER TABLE equipment_assignments ADD COLUMN broken_during_event BOOLEAN DEFAULT false;
```

Update event completion logic:
```sql
-- When completing event
UPDATE equipment e
SET status = CASE
  WHEN ea.broken_during_event THEN 'needs_repair'
  ELSE 'available'
END
FROM equipment_assignments ea
WHERE ea.equipment_id = e.id AND ea.event_id = :event_id;
```

---

## Scenario 10: Overtime and Pay Disputes

**Context:** Operator disputes actual hours recorded

**Event:** "State Finals" completed

**Setup:**
- John was assigned with estimated_hours = 13
- Owner entered actual_hours = 12 (less than estimated)
- John claims he worked 14 hours

**Steps to Test:**

1. **Owner Enters Actual Hours**
   - Event completed
   - Owner enters actual_hours = 12 for John
   - ✅ System calculates overtime = 0 (12 < 13 estimated)
   - ✅ System calculates pay = 12 × $50 = $600

2. **John Disputes**
   - John contacts owner: "I worked 14 hours, not 12"
   - Owner updates actual_hours = 14
   - ✅ System recalculates overtime = 1 hour (14 - 13)
   - ✅ System recalculates pay = 14 × $50 = $700

3. **Audit Trail**
   - ❌ Problem: No record of previous value (12 hours) or who changed it
   - ❌ Problem: Can't see history of edits

**Spec Validation:**
- ❌ No audit trail for actual_hours changes

**Issues Found:**

❌ **ISSUE 13:** Need audit trail for financial fields (actual_hours, calculated_pay).

**Proposed Fix:** Add `operator_assignment_history` table:
```sql
CREATE TABLE operator_assignment_history (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id),
  assignment_id UUID NOT NULL REFERENCES operator_assignments(id),

  field_changed TEXT NOT NULL, -- 'actual_hours', 'calculated_pay', etc.
  old_value TEXT,
  new_value TEXT,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,

  CONSTRAINT history_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
```

Or simpler: Add updated_at timestamp + updated_by user_id to operator_assignments, and require "reason" field when editing actual_hours:
```sql
ALTER TABLE operator_assignments ADD COLUMN actual_hours_updated_at TIMESTAMPTZ;
ALTER TABLE operator_assignments ADD COLUMN actual_hours_updated_by UUID REFERENCES auth.users(id);
ALTER TABLE operator_assignments ADD COLUMN actual_hours_notes TEXT; -- "Operator requested correction"
```

---

## Summary of Issues Found

### Critical Issues (Must Fix Before Implementation)

1. ❌ **ISSUE 11:** Multi-day events not properly modeled
   - **Impact:** Can't handle festivals or multi-day shoots
   - **Fix Required:** Ask user about frequency, add schema support if needed

2. ❌ **ISSUE 12:** Equipment breaking during event not handled
   - **Impact:** Broken equipment auto-returns to available
   - **Fix Required:** Add `broken_during_event` flag + update completion logic

3. ❌ **ISSUE 13:** No audit trail for actual_hours changes
   - **Impact:** Can't track payroll disputes or corrections
   - **Fix Required:** Add audit fields or history table

### Medium Issues (Should Fix)

4. ❌ **ISSUE 2:** Override not logged/audited
   - **Impact:** Can't track why conflicts were overridden
   - **Fix Required:** Add `override_reason` field + audit log

5. ❌ **ISSUE 5:** Ride provider removal not validated
   - **Impact:** Orphaned passengers if driver removed
   - **Fix Required:** Add cascade validation + warning

6. ❌ **ISSUE 7:** Template references non-existent equipment
   - **Impact:** Errors when applying old templates
   - **Fix Required:** Add validation + filter deleted items

### Low Issues (Nice to Have)

7. ❌ **ISSUE 1:** Overlap window calculation not specified
   - **Impact:** Minor - UI display only
   - **Fix Required:** Add formula to spec

8. ❌ **ISSUE 3:** Blackout override notification unclear
   - **Impact:** Minor - communication issue
   - **Fix Required:** Clarify in spec (manual communication vs auto)

9. ❌ **ISSUE 4:** Address field text-only (no geocoding)
   - **Impact:** Minor - manual ride coordination
   - **Fix Required:** Document as Phase 8 enhancement

10. ❌ **ISSUE 6:** Kit unavailable item handling not specified
    - **Impact:** Minor - UX clarity
    - **Fix Required:** Specify behavior in spec

11. ❌ **ISSUE 8:** Template tenant isolation
    - **Impact:** Security - RLS should handle, but verify
    - **Fix Required:** Add explicit validation in code

12. ❌ **ISSUE 9-10:** Duplicate event copying behavior
    - **Impact:** Minor - feature clarity
    - **Fix Required:** Document in spec

---

## Questions for User

1. **Multi-day events:** How often do you have festivals/shoots spanning multiple days?
   - If rare: Keep simple (single event + notes)
   - If common: Add proper schema support

2. **Equipment breaking during event:** Do you need to track this separately, or just mark as needs_repair after event ends?

3. **Audit trail:** Do you need full history tracking for payroll disputes, or just last-updated timestamp sufficient?

4. **Blackout overrides:** Should system notify operator automatically when their blackout is overridden, or manual communication only?

5. **Kit assignment:** If one item in kit is unavailable, should we:
   - A. Skip that item and assign the rest?
   - B. Block entire kit assignment?
   - C. Show warning and let you decide?

---

## Next Steps

1. User answers questions above
2. Update spec with fixes for critical issues
3. Add missing validation rules
4. Add missing fields (broken_during_event, override_reason, audit fields)
5. Update business logic workflows with new scenarios
6. Re-finalize spec v1.1

**After fixes:** Spec will be battle-tested against realistic scenarios and ready for implementation.
