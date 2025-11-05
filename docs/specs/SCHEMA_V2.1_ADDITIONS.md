# CommandCentered - Schema v2.1: Additional Features

**Date:** 2025-11-05
**Status:** DRAFT - New features based on Q&A

---

## Summary of Answers (Q1-Q20)

**Q1:** Equipment → Entire event (setup to teardown)
**Q2:** Shift overlap → Validate reasonableness (warn if >50%)
**Q3:** Travel time → Google Maps API hybrid (auto-calc, can override)
**Q4:** Rush hour → Traffic API (historical data based on time/day)
**Q5:** Hotel → Track venue→hotel travel for gig sheet flow
**Q6:** Flat rate → Show hourly estimate first, then allow negotiation
**Q7:** Flat rate agreement → Offline negotiation (phone/text), enter in app
**Q8:** Shift conflicts → Warn but allow (show travel time)
**Q9:** Gig sheet → Full travel itinerary (home→venue→hotel)
**Q10:** Multi-shift → List chronologically with role per shift
**Q11:** Swing shifts → Mark as "overlap shift", operators figure it out on-site
**Q12:** Blackout override → Hard block (contact offline to remove blackout first)
**Q13:** Equipment conflict → Warn + require reason (never happens in practice)
**Q14:** Overlapping shifts different events → Warn + reason (never happens)
**Q15:** Travel time calc → On assignment (immediate feedback)
**Q16:** Rush hour warnings → Show range + caution/alert levels
**Q17:** Equipment on gig sheet → YES, show full list + operator's personal gear
**Q18:** Hotel → Shared hotel/Airbnb, operators opt-in/out
**Q19:** Training → Scheduled on calendar, operators RSVP
**Q20:** Skill upgrades → Manual approval after training

---

## New Feature 1: Operator Personal Equipment

### Overview

Operators own personal gear (cameras, lenses, batteries, etc.) that they can bring to gigs. Owner can:
- Request specific items from operator's inventory
- Track what operator is bringing vs company gear
- Borrow operator's equipment for other gigs

### New Tables

#### operator_equipment

```sql
CREATE TABLE operator_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,

  -- Same structure as company equipment
  name TEXT NOT NULL, -- e.g., "John's Sony A7III"
  category TEXT NOT NULL CHECK (category IN ('camera', 'lens', 'audio', 'computer', 'rigging', 'cable', 'lighting', 'other')),
  type TEXT NOT NULL, -- e.g., "Camera Body", "24-70mm Lens"

  -- Ownership
  owner_operator_id UUID NOT NULL REFERENCES operators(id), -- Redundant with operator_id for clarity

  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'needs_repair', 'unavailable')),

  notes TEXT,

  CONSTRAINT op_equipment_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT op_equipment_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES operators(id)
);

-- Indexes
CREATE INDEX op_equipment_tenant_id_idx ON operator_equipment(tenant_id);
CREATE INDEX op_equipment_operator_id_idx ON operator_equipment(operator_id);
CREATE INDEX op_equipment_category_idx ON operator_equipment(category);
CREATE INDEX op_equipment_status_idx ON operator_equipment(status);
```

#### operator_equipment_requests

```sql
CREATE TABLE operator_equipment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  operator_equipment_id UUID NOT NULL REFERENCES operator_equipment(id) ON DELETE CASCADE,

  request_status TEXT NOT NULL DEFAULT 'requested' CHECK (request_status IN ('requested', 'confirmed', 'declined', 'cancelled')),

  -- Can request equipment from operator even if they're not on the shift (borrowing)
  is_borrowing BOOLEAN DEFAULT false, -- True if operator not assigned to this shift

  notes TEXT,

  CONSTRAINT op_eq_requests_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT op_eq_requests_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES shifts(id),
  CONSTRAINT op_eq_requests_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES operators(id),
  CONSTRAINT op_eq_requests_equipment_id_fkey FOREIGN KEY (operator_equipment_id) REFERENCES operator_equipment(id)
);

-- Indexes
CREATE INDEX op_eq_requests_tenant_id_idx ON operator_equipment_requests(tenant_id);
CREATE INDEX op_eq_requests_shift_id_idx ON operator_equipment_requests(shift_id);
CREATE INDEX op_eq_requests_operator_id_idx ON operator_equipment_requests(operator_id);
CREATE INDEX op_eq_requests_status_idx ON operator_equipment_requests(request_status);
```

### Workflow: Requesting Operator Equipment

**Scenario:** John is assigned to Saturday shift as Videographer. You want him to bring his Sony A7III.

**Steps:**

1. **Assign John to Shift**
   - John assigned as Videographer, hourly $50 × 4hrs = $200

2. **View John's Equipment Inventory**
   - System shows John's registered equipment:
     - Sony A7III (Camera)
     - 24-70mm Lens
     - 2× Batteries
     - SD Cards

3. **Request Equipment**
   - Owner clicks "Request Equipment from John"
   - Selects: Sony A7III, 24-70mm Lens
   - Request created with status = 'requested'

4. **John Confirms** (offline communication)
   - Owner texts John: "Can you bring your Sony + 24-70mm?"
   - John confirms
   - Owner marks requests as 'confirmed' in app

5. **Gig Sheet Generation**
   - John's gig sheet shows:
     - **Company Equipment:** Camera 1, Lens A, B
     - **Bring Your Own:** Sony A7III, 24-70mm Lens ⚠️

6. **Equipment Tracking**
   - operator_equipment status changes to 'in_use' during shift
   - Returns to 'available' after shift completes

### Workflow: Borrowing Operator Equipment

**Scenario:** You need John's Sony A7III for Saturday shift, but John is NOT working that shift.

**Steps:**

1. **Request Equipment**
   - Owner creates shift for Saturday
   - Owner requests John's Sony A7III
   - is_borrowing = true (John not assigned to shift)

2. **John Confirms**
   - Owner contacts John: "Can I borrow your Sony on Saturday?"
   - John agrees
   - Owner marks as 'confirmed'

3. **Logistics**
   - Owner arranges pickup from John
   - Equipment assigned to shift (via operator_equipment_requests)
   - John's Sony tracked as 'in_use' during shift
   - Owner returns to John after

---

## New Feature 2: Hotel Opt-In Logic

### Overview

Events may have hotel/Airbnb assigned. Operators can opt-in (need accommodation) or opt-out (local, don't need). Operators typically share same hotel.

### Schema Updates

#### events table - Add hotel info

```sql
ALTER TABLE events ADD COLUMN has_hotel BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN hotel_name TEXT;
ALTER TABLE events ADD COLUMN hotel_address TEXT;
ALTER TABLE events ADD COLUMN hotel_lat DECIMAL(10, 8);
ALTER TABLE events ADD COLUMN hotel_lng DECIMAL(11, 8);
ALTER TABLE events ADD COLUMN hotel_check_in_date DATE;
ALTER TABLE events ADD COLUMN hotel_check_out_date DATE;
ALTER TABLE events ADD COLUMN hotel_notes TEXT; -- Confirmation #, room arrangements, etc.
```

#### shift_assignments table - Add hotel opt-in

```sql
ALTER TABLE shift_assignments ADD COLUMN hotel_needed BOOLEAN DEFAULT false;
ALTER TABLE shift_assignments ADD COLUMN hotel_opted_in BOOLEAN DEFAULT false; -- Operator confirmed they'll use hotel
```

### Workflow: Hotel Management

**Scenario:** Summer Festival (Fri-Sun) in different city. You book Airbnb for crew.

**Steps:**

1. **Create Event with Hotel**
   - Event: Summer Festival
   - has_hotel = true
   - hotel_name = "Downtown Airbnb"
   - hotel_address = "123 Main St"
   - hotel_check_in_date = Friday
   - hotel_check_out_date = Sunday
   - System geocodes address to lat/lng

2. **Assign Operators**
   - John (lives 200 miles away) → hotel_needed = true
   - Sarah (lives 200 miles away) → hotel_needed = true
   - Mike (lives locally, 15 min away) → hotel_needed = false

3. **Operator Opt-In** (offline)
   - Owner: "John/Sarah, hotel booked for Fri-Sun. Will you use it?"
   - John: "Yes"
   - Sarah: "Yes"
   - Owner marks: hotel_opted_in = true for both

4. **Gig Sheet Generation**
   - John's gig sheet:
     ```
     🏨 ACCOMMODATION
     Downtown Airbnb
     123 Main St
     Check-in: Friday 6pm (after shift)
     Check-out: Sunday 10am

     Travel: Venue → Hotel (15 min)
     ```
   - Mike's gig sheet: No hotel section

5. **Travel Time Calculation**
   - John's Saturday shifts: Hotel → Venue (15 min)
   - Mike's Saturday shifts: Home → Venue (15 min)

---

## New Feature 3: Expandable Skill System

### Overview

Different tenants track different skills. Core skills for videography business: videography, photography, directing, professionalism. Other businesses (photographers, event planners, etc.) might track different skills.

### Schema Updates

#### NEW: skill_definitions table

```sql
CREATE TABLE skill_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  skill_name TEXT NOT NULL, -- e.g., "videography", "photography", "lighting_design"
  display_name TEXT NOT NULL, -- e.g., "Videography", "Photography", "Lighting Design"
  description TEXT, -- e.g., "Camera operation, composition, video editing"

  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0, -- Display order

  CONSTRAINT skills_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT skills_tenant_name_unique UNIQUE (tenant_id, skill_name)
);

-- Default skills for new tenants (seed data)
INSERT INTO skill_definitions (tenant_id, skill_name, display_name, description, sort_order) VALUES
  (:tenant_id, 'videography', 'Videography', 'Camera operation, composition, video editing', 1),
  (:tenant_id, 'photography', 'Photography', 'Photo capture, editing, client delivery', 2),
  (:tenant_id, 'directing', 'Directing', 'Event coordination, crew management', 3),
  (:tenant_id, 'professionalism', 'Professionalism', 'Punctuality, client care, communication', 4);
```

#### NEW: operator_skills table (replaces hardcoded skill columns)

```sql
CREATE TABLE operator_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  skill_definition_id UUID NOT NULL REFERENCES skill_definitions(id) ON DELETE CASCADE,

  skill_level INTEGER NOT NULL DEFAULT 5 CHECK (skill_level >= 1 AND skill_level <= 10),

  CONSTRAINT op_skills_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT op_skills_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES operators(id),
  CONSTRAINT op_skills_skill_id_fkey FOREIGN KEY (skill_definition_id) REFERENCES skill_definitions(id),
  CONSTRAINT op_skills_unique UNIQUE (operator_id, skill_definition_id)
);

-- Indexes
CREATE INDEX op_skills_tenant_id_idx ON operator_skills(tenant_id);
CREATE INDEX op_skills_operator_id_idx ON operator_skills(operator_id);
CREATE INDEX op_skills_skill_id_idx ON operator_skills(skill_definition_id);
```

#### REMOVE from operators table:

```sql
-- These columns NO LONGER EXIST (moved to operator_skills table)
-- videography_skill
-- photography_skill
-- directing_skill
-- professionalism_skill
```

#### UPDATE: operator_skill_history

```sql
ALTER TABLE operator_skill_history DROP COLUMN skill_type;
ALTER TABLE operator_skill_history ADD COLUMN skill_definition_id UUID NOT NULL REFERENCES skill_definitions(id);
```

#### UPDATE: trainings table

```sql
ALTER TABLE trainings DROP COLUMN training_type;
ALTER TABLE trainings ADD COLUMN skill_definition_id UUID REFERENCES skill_definitions(id); -- Which skill this training improves
```

#### NEW: training_agenda_items

```sql
CREATE TABLE training_agenda_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,

  item_order INTEGER NOT NULL, -- 1, 2, 3...
  item_title TEXT NOT NULL, -- e.g., "Camera basics", "Composition techniques"
  item_description TEXT,
  duration_minutes INTEGER, -- How long this agenda item takes

  CONSTRAINT agenda_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT agenda_training_id_fkey FOREIGN KEY (training_id) REFERENCES trainings(id)
);

-- Indexes
CREATE INDEX agenda_tenant_id_idx ON training_agenda_items(tenant_id);
CREATE INDEX agenda_training_id_idx ON training_agenda_items(training_id);
CREATE INDEX agenda_order_idx ON training_agenda_items(training_id, item_order);
```

### Benefits of Expandable Skills

**Videography Business (you):**
- Skills: Videography, Photography, Directing, Professionalism

**Photography Studio:**
- Skills: Portrait Photography, Event Photography, Editing, Client Relations

**Event Planning Company:**
- Skills: Coordination, Vendor Management, Design, Client Communication

**AV Production Company:**
- Skills: Audio Engineering, Lighting Design, Stage Management, Technical Setup

Each tenant defines their own skills. Operators get rated on those skills. Trainings improve those skills.

---

## New Feature 4: Google Maps API Optimization

### Batch Requests

**Problem:** Each operator assignment = 1 API call for travel time. Expensive if done individually.

**Solution:** Batch all travel time calculations for event/shift.

```typescript
// Instead of:
for (const assignment of assignments) {
  const travelTime = await googleMaps.calculateTravelTime(
    assignment.operator.home_address,
    event.venue_address
  );
}

// Do this:
const origins = assignments.map(a => a.operator.home_address);
const destination = event.venue_address;

// Single API call via Distance Matrix API
const travelTimes = await googleMaps.distanceMatrix({
  origins, // Array of operator addresses
  destinations: [destination], // Event venue
  departure_time: shift.start_time, // For traffic data
  traffic_model: 'best_guess' // or 'pessimistic' for rush hour
});
```

**Savings:**
- 4 operators = 1 API call (instead of 4)
- 75% cost reduction

### Historical Traffic Data

Google Maps API includes `departure_time` parameter:
- Calculates typical travel time for that day/time
- Factors in historical traffic patterns
- Returns: `duration` (no traffic) + `duration_in_traffic` (with typical traffic)

**Implementation:**

```typescript
const result = await googleMaps.distanceMatrix({
  origins: [operator.home_address],
  destinations: [venue.address],
  departure_time: shift.start_time, // e.g., Saturday 9:00 AM
  traffic_model: 'best_guess'
});

const normalTime = result.rows[0].elements[0].duration.value; // seconds
const trafficTime = result.rows[0].elements[0].duration_in_traffic.value; // seconds

// Store both
shift_assignment.travel_time_minutes = Math.ceil(normalTime / 60); // 25 min
shift_assignment.travel_time_traffic_minutes = Math.ceil(trafficTime / 60); // 40 min

// Display on gig sheet
// "Travel time: 25-40 min (depending on traffic)"
```

### When to Calculate

**Option 1: On Assignment (Immediate)**
- Pro: Instant feedback while scheduling
- Con: More API calls (but batched per shift)

**Option 2: Calculate All (Batch Button)**
- Pro: Fewest API calls
- Con: Requires manual action

**Option 3: Smart Hybrid**
- Calculate on assignment (immediate feedback)
- Re-calculate all nightly (update for traffic changes, address changes)
- Cache results for 24 hours

**Recommendation: Option 3** (smart hybrid)

### Cost Optimization

**Current estimate:**
- 50 shifts/month
- 4 operators/shift average
- 1 batch call per shift = 50 API calls/month
- **Cost: ~$0.25/month** (well within $200 free tier)

**With nightly recalculation:**
- 50 shifts/month × 30 days = 1500 calls
- **Cost: ~$7.50/month** (still within free tier)

Still essentially free!

---

## Updated Gig Sheet Example

**John's Gig Sheet - Saturday, March 15**

```
═══════════════════════════════════════════════════════
         SUMMER FESTIVAL - SATURDAY SCHEDULE
═══════════════════════════════════════════════════════

📍 TRAVEL ITINERARY

🏠 8:15 AM - Leave Home
   Address: 123 North St
   ↓ 25-40 min (depending on traffic, Saturday morning)
   ⚠️ CAUTION: Rush hour possible 8-9am

📍 9:00 AM - 1:00 PM | SHIFT 1: MORNING SESSION
   Role: Videographer
   Pay: $50/hr × 4hrs = $200.00

   Venue: Downtown Convention Center
   Address: 456 Main St
   Parking: Lot B (validation provided)

   Other Operators:
   • Sarah (Photographer)
   • Mike (Audio Tech)

   ═══ EQUIPMENT ═══
   Company Equipment:
   ✓ Camera 1 (Sony A7SIII)
   ✓ Lens A (24-70mm)
   ✓ Lens B (70-200mm)
   ✓ Tripod 1

   🎒 BRING YOUR OWN:
   ⚠️ Sony A7III (requested)
   ⚠️ 24-70mm Lens (requested)
   ⚠️ 2× Batteries (requested)

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🕐 1:00 PM - 2:00 PM | BREAK
   ↓ Stay at venue (no travel)

📍 2:00 PM - 6:00 PM | SHIFT 2: AFTERNOON SESSION
   Role: Photographer
   Pay: Flat Rate $175.00

   Same venue (Downtown Convention Center)

   Other Operators:
   • Sarah (Photographer)
   • Lisa (Director)

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏨 6:00 PM - End of Day
   ↓ 15 min

   Hotel: Downtown Airbnb
   Address: 789 Hotel St
   Check-in: Friday (already checked in)
   Check-out: Sunday 10am
   Room: Shared with Sarah, Mike

═══════════════════════════════════════════════════════

💰 TOTAL ESTIMATED PAY: $375.00
   (Hourly: $200 + Flat: $175)

📝 NOTES:
• Bring extra batteries (long day!)
• Meal break: 1-2pm (catered lunch provided)
• Client contact: Jane Doe (555-1234)

Questions? Contact Owner: (555-5678)

═══════════════════════════════════════════════════════
```

---

## Summary of New Features

1. ✅ **Operator Personal Equipment**
   - Operators register their own gear
   - Owner requests specific items for gigs
   - Can borrow equipment even when operator not working
   - Shows on gig sheet: "Bring Your Own"

2. ✅ **Hotel Opt-In Logic**
   - Event-level hotel info
   - Operators opt-in/opt-out per shift
   - Shared accommodations (multiple operators)
   - Hotel→venue travel time calculated

3. ✅ **Expandable Skill System**
   - Tenant-defined skills (not hardcoded)
   - Videography business: video, photo, directing, professionalism
   - Other businesses: custom skills
   - Training agendas with line items

4. ✅ **Google Maps API Optimization**
   - Batch requests per shift (4 operators = 1 call)
   - Historical traffic data (day/time specific)
   - Smart caching (24 hour TTL)
   - Cost: ~$1-8/month (within free tier)

---

## Next Steps

1. Review these new features
2. Any additional edge cases?
3. Finalize schema v2.1
4. Update all workflows
5. Create complete specification v2.0

Ready to proceed?
