# CommandCentered - Schema v2: Shifts-Based Model

**Date:** 2025-11-05
**Status:** DRAFT - Rethinking based on shift workflow

---

## Problem Statement

**Original assumption:** Operators assigned to entire event (load-in to load-out).

**Reality:** Multi-day events divided into **shifts/sessions**. Operators work specific shifts, not entire events. Key workflow:
- Event spans 3 days (Friday-Sunday)
- Each day has multiple shifts (morning, afternoon, evening)
- Operators assigned to specific shifts with specific roles
- Shifts can overlap (for swing/breaks)
- Operators can work shift at Event A, then shift at Event B same day

**Example:**
- **Event:** "Summer Festival" (Friday-Sunday)
- **Friday Shifts:**
  - Shift 1: Setup (2pm-6pm) - Video crew only
  - Shift 2: Evening (6pm-11pm) - Photo + Video
- **Saturday Shifts:**
  - Shift 1: Morning (9am-1pm) - Photo + Video
  - Shift 2: Afternoon (1pm-5pm) - Photo + Video (overlaps with Shift 1 for swing)
  - Shift 3: Evening (5pm-11pm) - Photo + Video
- **Sunday Shifts:**
  - Shift 1: Morning (9am-1pm) - Video only
  - Shift 2: Teardown (1pm-5pm) - Minimal crew

**Operator Assignment:**
- John: Saturday Shift 1 (9am-1pm) as Videographer, Saturday Shift 2 (1pm-5pm) as Photographer
- Sarah: Friday Shift 2 (6pm-11pm) as Photographer, Saturday Shift 1 (9am-1pm) as Photographer
- Mike: Saturday Shift 2 (1pm-5pm) as Videographer (swings in to give John a break)

---

## New Schema Design

### Core Hierarchy

```
Event (Summer Festival, Friday-Sunday)
  ├── Shift 1 (Friday 2pm-6pm, Setup)
  │   ├── Operator Assignment: John as Videographer
  │   └── Equipment Assignment: Camera 1, Lens A, B
  ├── Shift 2 (Friday 6pm-11pm, Evening)
  │   ├── Operator Assignment: Sarah as Photographer
  │   ├── Operator Assignment: John as Videographer
  │   └── Equipment Assignment: Camera 1, 2, Lenses...
  ├── Shift 3 (Saturday 9am-1pm, Morning)
  │   ├── Operator Assignment: John as Videographer
  │   ├── Operator Assignment: Sarah as Photographer
  │   └── Equipment Assignment: (same, stays at venue)
  └── ... more shifts
```

---

## Updated Database Schema

### events table (unchanged structure, different semantics)

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('dance_competition', 'recital', 'concert', 'play', 'other')),

  -- Venue details
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  venue_lat DECIMAL(10, 8), -- For travel time calculation
  venue_lng DECIMAL(11, 8),
  parking_instructions TEXT,

  -- Client info
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,

  -- Timing (FULL EVENT SPAN - load-in to load-out)
  load_in_time TIMESTAMPTZ NOT NULL,
  load_out_time TIMESTAMPTZ NOT NULL,

  -- Financial
  revenue_amount DECIMAL(10,2), -- Actual (not estimated)

  -- Notes
  special_notes TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'scheduled', 'in_progress', 'completed', 'archived', 'cancelled')),

  -- Multi-day flag
  is_multi_day BOOLEAN DEFAULT false,

  CONSTRAINT events_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT events_times_logical CHECK (load_in_time <= load_out_time)
);
```

### NEW: shifts table (Core Unit of Work)

```sql
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  shift_name TEXT NOT NULL, -- e.g., "Friday Evening", "Saturday Morning", "Setup", "Main Event"

  -- Timing
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,

  -- Break/Overlap
  is_overlap_shift BOOLEAN DEFAULT false, -- True for "swing" shifts that overlap for breaks

  -- Roles needed for this shift
  roles_needed JSONB, -- e.g., {"videographer": 2, "photographer": 1, "director": 1}

  notes TEXT,

  CONSTRAINT shifts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT shifts_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id),
  CONSTRAINT shifts_times_logical CHECK (start_time < end_time)
);

-- Indexes
CREATE INDEX shifts_tenant_id_idx ON shifts(tenant_id);
CREATE INDEX shifts_event_id_idx ON shifts(event_id);
CREATE INDEX shifts_start_time_idx ON shifts(start_time);
```

### operators table (UPDATED with new skills)

```sql
CREATE TABLE operators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Rates
  hourly_rate DECIMAL(10,2) NOT NULL, -- Default hourly rate
  accepts_flat_rate BOOLEAN DEFAULT true, -- Can negotiate flat rates

  -- Skills (1-10)
  videography_skill INTEGER NOT NULL DEFAULT 5 CHECK (videography_skill >= 1 AND videography_skill <= 10),
  photography_skill INTEGER NOT NULL DEFAULT 5 CHECK (photography_skill >= 1 AND photography_skill <= 10),
  directing_skill INTEGER NOT NULL DEFAULT 5 CHECK (directing_skill >= 1 AND directing_skill <= 10),
  professionalism_skill INTEGER NOT NULL DEFAULT 5 CHECK (professionalism_skill >= 1 AND professionalism_skill <= 10), -- Punctuality + client care

  -- Transportation
  has_vehicle BOOLEAN NOT NULL DEFAULT false,
  vehicle_description TEXT,
  home_address TEXT, -- For travel time calculation
  home_lat DECIMAL(10, 8),
  home_lng DECIMAL(11, 8),

  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

  CONSTRAINT operators_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT operators_tenant_email_unique UNIQUE (tenant_id, email)
);
```

### NEW: operator_skill_history (Track skill upgrades)

```sql
CREATE TABLE operator_skill_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,

  skill_type TEXT NOT NULL CHECK (skill_type IN ('videography', 'photography', 'directing', 'professionalism')),

  old_value INTEGER NOT NULL,
  new_value INTEGER NOT NULL,

  reason TEXT, -- e.g., "Completed training", "Performance review", "Manual upgrade"
  training_id UUID REFERENCES trainings(id) ON DELETE SET NULL, -- If linked to training

  updated_by UUID REFERENCES auth.users(id),

  CONSTRAINT skill_history_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT skill_history_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES operators(id)
);
```

### NEW: trainings table (Track training sessions)

```sql
CREATE TABLE trainings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  training_name TEXT NOT NULL, -- e.g., "Advanced Camera Techniques"
  training_type TEXT NOT NULL, -- e.g., "videography", "photography", "directing", "professionalism"

  training_date DATE NOT NULL,
  duration_hours DECIMAL(4,2),

  skill_increase INTEGER DEFAULT 1, -- How many skill points operators gain

  notes TEXT,

  CONSTRAINT trainings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Many-to-many: operators who attended training
CREATE TABLE training_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,

  attended BOOLEAN DEFAULT true,
  skill_upgraded BOOLEAN DEFAULT false, -- Whether skill was actually upgraded after training

  CONSTRAINT attendees_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT attendees_training_id_fkey FOREIGN KEY (training_id) REFERENCES trainings(id),
  CONSTRAINT attendees_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES operators(id),
  CONSTRAINT attendees_unique UNIQUE (training_id, operator_id)
);
```

### UPDATED: operator_assignments → shift_assignments

```sql
CREATE TABLE shift_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,

  -- Role for THIS SHIFT (can be different per shift)
  role TEXT NOT NULL CHECK (role IN ('videographer', 'photographer', 'director', 'assistant', 'other')),

  -- Pay: EITHER hourly OR flat rate
  pay_type TEXT NOT NULL DEFAULT 'hourly' CHECK (pay_type IN ('hourly', 'flat')),

  -- If pay_type = 'hourly'
  hourly_rate DECIMAL(10,2), -- Defaults to operator.hourly_rate, can override
  estimated_hours DECIMAL(5,2), -- Calculated from shift start/end
  actual_hours DECIMAL(5,2), -- Entered after shift completes

  -- If pay_type = 'flat'
  flat_rate DECIMAL(10,2), -- Negotiated flat rate for this shift

  -- Calculated pay (based on pay_type)
  calculated_pay DECIMAL(10,2) NOT NULL,

  -- Overtime (only applies to hourly)
  overtime_hours DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE
      WHEN pay_type = 'hourly' AND actual_hours IS NOT NULL AND actual_hours > estimated_hours
      THEN actual_hours - estimated_hours
      ELSE 0
    END
  ) STORED,

  -- Transportation
  needs_ride BOOLEAN NOT NULL DEFAULT false,
  ride_provider_id UUID REFERENCES operators(id) ON DELETE SET NULL,

  -- Travel
  travel_time_to_shift_minutes INTEGER, -- Calculated travel time to venue
  travel_time_from_previous_shift_minutes INTEGER, -- If operator working multiple shifts same day

  -- Audit
  actual_hours_updated_at TIMESTAMPTZ,
  actual_hours_updated_by UUID REFERENCES auth.users(id),
  actual_hours_notes TEXT,

  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'completed', 'cancelled')),

  notes TEXT,

  CONSTRAINT shift_assignments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT shift_assignments_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES shifts(id),
  CONSTRAINT shift_assignments_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES operators(id),
  CONSTRAINT shift_assignments_ride_provider_fkey FOREIGN KEY (ride_provider_id) REFERENCES operators(id),

  -- Validation: If hourly, hourly_rate and estimated_hours required
  CONSTRAINT shift_assignments_hourly_check CHECK (
    (pay_type = 'hourly' AND hourly_rate IS NOT NULL AND estimated_hours IS NOT NULL)
    OR pay_type = 'flat'
  ),

  -- Validation: If flat, flat_rate required
  CONSTRAINT shift_assignments_flat_check CHECK (
    (pay_type = 'flat' AND flat_rate IS NOT NULL)
    OR pay_type = 'hourly'
  )
);

-- Indexes
CREATE INDEX shift_assignments_tenant_id_idx ON shift_assignments(tenant_id);
CREATE INDEX shift_assignments_shift_id_idx ON shift_assignments(shift_id);
CREATE INDEX shift_assignments_operator_id_idx ON shift_assignments(operator_id);
CREATE INDEX shift_assignments_status_idx ON shift_assignments(status);
CREATE INDEX shift_assignments_needs_ride_idx ON shift_assignments(needs_ride);
```

### NEW: operator_hotels (Track hotel stays)

```sql
CREATE TABLE operator_hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,

  hotel_name TEXT NOT NULL,
  hotel_address TEXT NOT NULL,
  hotel_lat DECIMAL(10, 8), -- For travel time calculation
  hotel_lng DECIMAL(11, 8),

  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,

  room_number TEXT,
  confirmation_number TEXT,

  notes TEXT,

  CONSTRAINT hotels_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT hotels_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id),
  CONSTRAINT hotels_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES operators(id)
);

-- Indexes
CREATE INDEX hotels_tenant_id_idx ON operator_hotels(tenant_id);
CREATE INDEX hotels_event_id_idx ON operator_hotels(event_id);
CREATE INDEX hotels_operator_id_idx ON operator_hotels(operator_id);
```

### UPDATED: equipment categories

```sql
-- Update equipment category enum
ALTER TABLE equipment DROP CONSTRAINT equipment_category_check;
ALTER TABLE equipment ADD CONSTRAINT equipment_category_check CHECK (
  category IN (
    'camera',           -- Cameras + drones
    'lens',
    'audio',
    'computer',         -- Laptops, desktops, monitors, storage devices
    'rigging',          -- Stands, tripods, gimbals, stabilizers
    'cable',
    'lighting',
    'other'
  )
);
```

### equipment_assignments (UPDATED - assigned to shifts OR events)

```sql
-- Equipment can be assigned to:
-- A. Specific shift (shift_id NOT NULL, event_id NULL) - equipment needed for just that shift
-- B. Entire event (event_id NOT NULL, shift_id NULL) - equipment stays at venue for all shifts

CREATE TABLE equipment_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- EITHER shift OR event (not both)
  shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,

  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,

  pack_status TEXT NOT NULL DEFAULT 'needs_packing' CHECK (pack_status IN ('needs_packing', 'packed', 'at_event', 'returned')),

  broken_during_event BOOLEAN DEFAULT false, -- If equipment breaks during event

  notes TEXT,

  CONSTRAINT eq_assignments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT eq_assignments_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES shifts(id),
  CONSTRAINT eq_assignments_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id),
  CONSTRAINT eq_assignments_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  CONSTRAINT eq_assignments_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),

  -- Validation: Must have EITHER shift_id OR event_id (not both, not neither)
  CONSTRAINT eq_assignments_shift_or_event CHECK (
    (shift_id IS NOT NULL AND event_id IS NULL)
    OR (event_id IS NOT NULL AND shift_id IS NULL)
  ),

  -- Prevent duplicate assignments
  CONSTRAINT eq_assignments_shift_equipment_unique UNIQUE NULLS NOT DISTINCT (shift_id, equipment_id),
  CONSTRAINT eq_assignments_event_equipment_unique UNIQUE NULLS NOT DISTINCT (event_id, equipment_id)
);
```

---

## Updated Workflows

### Workflow 1: Create Multi-Day Event with Shifts

**Steps:**

1. **Create Event**
   - Event: "Summer Festival"
   - is_multi_day = true
   - load_in_time = Friday 2pm
   - load_out_time = Sunday 9pm
   - venue_address = "123 Main St" (geocoded to lat/lng)

2. **Create Shifts**
   - Shift 1: "Friday Setup" (Friday 2pm-6pm)
   - Shift 2: "Friday Evening" (Friday 6pm-11pm)
   - Shift 3: "Saturday Morning" (Saturday 9am-1pm)
   - Shift 4: "Saturday Afternoon" (Saturday 12:30pm-5pm) - overlaps with Shift 3 for swing
   - Shift 5: "Saturday Evening" (Saturday 5pm-11pm)
   - Shift 6: "Sunday Morning" (Sunday 9am-1pm)
   - Shift 7: "Sunday Teardown" (Sunday 1pm-5pm)

3. **Assign Equipment to Event** (stays for all shifts)
   - Camera 1, Camera 2, Lens A, B, C, D
   - All assigned to event (event_id NOT NULL, shift_id NULL)
   - Pack status: needs_packing → packed → at_event → returned

4. **Assign Operators to Shifts**
   - John → Shift 3 (Sat Morning) as Videographer (hourly: $50 × 4hrs = $200)
   - John → Shift 4 (Sat Afternoon) as Photographer (flat rate: $175)
   - Sarah → Shift 3 (Sat Morning) as Photographer (hourly: $45 × 4hrs = $180)
   - Mike → Shift 4 (Sat Afternoon) as Videographer (hourly: $40 × 4.5hrs = $180) - swings in

5. **Check Conflicts**
   - ✅ John assigned to both Shift 3 and Shift 4 (no conflict - different times)
   - ✅ Mike's Shift 4 overlaps with John's Shift 3 by 30 min (valid - swing shift)
   - ✅ Camera 1 assigned to event (available for all shifts)

6. **Calculate Travel Times**
   - John's home → Venue: 25 minutes (normal), 40 minutes (rush hour)
   - Show warning: "Shift 3 starts 9am (Saturday). John's travel time: 25-40 min. Rush hour possible."

7. **Track Hotel**
   - Sarah staying at "Holiday Inn" (address geocoded)
   - Check-in Friday, Check-out Sunday
   - Travel time from hotel → venue: 10 minutes

---

## Key Questions for Clarification

**Q1: Equipment Assignment Granularity**

For multi-day events, is equipment typically:
- A. **Assigned to entire event** (arrives Friday, stays all weekend, leaves Sunday)
- B. **Assigned to specific shifts** (Camera 1 needed for Shift 3 and 5, but not Shift 4)
- C. **Both** (some gear stays whole time, some gear only for specific shifts)

I'm guessing **A**, but want to confirm. Schema supports both.

**Q2: Shift Overlap Validation**

When creating overlapping shifts (for swing):
- Should system ALLOW any overlap (trust you)?
- Or VALIDATE that overlap is reasonable (e.g., < 50% of shift duration)?

Example:
- Shift 3: 9am-1pm (4 hours)
- Shift 4: 12:30pm-5pm (4.5 hours)
- Overlap: 30 minutes (12:30pm-1pm)

Is 30-minute overlap for swing reasonable? Or do you sometimes do longer overlaps?

**Q3: Travel Time Calculation**

For travel time warnings, should the app:
- A. **Manual entry** - You enter travel time estimates manually
- B. **API integration** - Use Google Maps API to calculate travel times
- C. **Hybrid** - API calculates, but you can override

Option B requires Google Maps API key + costs per request. Option A is free but manual.

**Q4: Rush Hour Detection**

How should app detect "rush hour" for warnings?

- A. **Time-based heuristic** - 7-9am and 4-7pm weekdays = rush hour
- B. **Ask user** - "Is this during rush hour?" checkbox when creating shift
- C. **API integration** - Google Maps traffic data (costs money)

**Q5: Hotel Tracking - What's Needed?**

When tracking operator hotels, what info do you need?
- [x] Hotel name, address
- [x] Check-in/out dates
- [ ] Travel time hotel → venue (calculated)?
- [ ] Room number / confirmation number (for reference)?
- [ ] Cost tracking (reimbursement)?

**Q6: Flat Rate Negotiation Workflow**

When assigning operator to shift:

1. System calculates hourly estimate: $50 × 4hrs = $200
2. You want to negotiate flat rate instead

Should the workflow be:
- **Option A:** Show hourly estimate, button "Negotiate Flat Rate" → modal to enter flat rate + reason
- **Option B:** Always show both options: "Hourly ($200 est)" or "Flat Rate $___"
- **Option C:** Default hourly, you can manually edit and change to flat rate

**Q7: Operator Agreeing to Flat Rate**

You mentioned "they can agree to a flat rate."

Does this mean:
- A. **You negotiate offline** (email/text), then enter agreed flat rate in app
- B. **In-app workflow** - Operator receives notification, accepts/counters flat rate proposal
- C. **Just tracking** - You enter flat rate, it goes on gig sheet, operator sees it

For MVP, I'm assuming **A** (negotiate offline, enter in app). Phase 8 could add in-app negotiation.

**Q8: Shift Conflicts - How Strict?**

Operator works Shift A (Event 1, Saturday 9am-1pm) then Shift B (Event 2, Saturday 2pm-6pm).

That's 1 hour gap. Should system:
- A. **Allow** - No conflict (shifts don't overlap)
- B. **Warn** - "John has 1 hour between shifts. Check travel time between venues."
- C. **Block** - "Not enough time between shifts (need 2+ hours)"

I'm thinking **B** (warn with travel time check).

**Q9: Shift Status Tracking**

Do you need per-shift status? Or just event-level status?

- Event status: confirmed → scheduled → in_progress → completed
- Shift status: assigned → in_progress → completed?

Or simpler: Just track operator assignment status per shift (assigned → confirmed → completed)?

**Q10: Gig Sheet - What to Include?**

When generating schedule email for operator, should it include:

For each shift they're assigned to:
- [x] Shift name, date, times
- [x] Venue name, address, parking
- [x] Their role for that shift
- [x] Pay (hourly rate + estimated hours, OR flat rate)
- [x] Other operators on that shift
- [ ] Equipment list for that shift?
- [x] Travel time estimate (from home or previous shift)
- [x] Hotel info (if applicable)
- [ ] Break/meal times?

---

Let me know answers to these 10 questions and I'll finalize the schema!
