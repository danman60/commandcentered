# CommandCentered - Specification v2.3 LOCKED

**Date:** 2025-11-06
**Status:** ✅ LOCKED - Ready for Implementation
**Previous Version:** v2.2 → v2.3 (enhanced terminology for command center theme)

---

## 🔒 SPEC LOCKED - What Changed

### v1.0 → v2.1: Major Paradigm Shift (Events → Shifts)

**v1.0 Model:**
- Operators assigned to entire events (load-in to load-out)
- Equipment assigned to events
- Simple hourly pay calculation

**v2.1 Model:**
- Events contain **multiple shifts** (multi-day breakdown)
- Operators assigned to **specific shifts** with **specific roles**
- Shifts can **overlap** (for swing/breaks)
- Operators can work **different roles per shift**
- **Hourly OR flat rate** pay per shift
- **Operator personal gear** tracking
- **Hotel opt-in** logic
- **Expandable skill system**
- **Google Maps API** integration with batching

### v2.1 → v2.2: Critical Edge Cases & Communication

**New in v2.2:**
1. **Impossible Conflict Detection** - Travel time validation prevents physically impossible schedules
2. **Last-Minute Cancellation Workflow** - Operator cancellation with replacement suggestions
3. **Mid-Event Cancellation Support** - Partial event completion with revenue tracking
4. **Assignment Status Tracking** - Track cancelled/completed shifts separately
5. **Gear Retrieval Workflow** - Handle gear stuck at venue after cancellation
6. **Telegram Integration** - Per-event group chat for real-time crew communication
7. **At-a-Glance Dashboard** - Single dashboard with clickable event cards, quick navigation

### v2.2 → v2.3: Enhanced Terminology

**Terminology Updates:**
- `equipment` → `gear` (command center theme)
- `templates` → `kits` (tactical terminology)
- `equipment_templates` → `gear_kits` (pre-defined gear sets)
- `addresses` → `locations` (formal location references)
- `home_address` → `base_location` (operator's base of operations)
- `trainings` → `drills` (training operations)
- `equipment_location_history` → `gear_tracking_log` (audit trail)
- `operator_equipment` → `operator_gear` (personal loadouts)
- Equipment sets → `loadouts` (not "loadout kits")

---

## 📊 Database Schema Summary

### Core Tables (18 total) ✅ UPDATED v2.2

**Tenant & Auth:**
1. `tenants` - Multi-tenant isolation
2. `user_profiles` - User accounts

**Events & Shifts:**
3. `events` - Videography jobs (multi-day capable, includes hotel info, cancellation tracking, Telegram groups)
4. `shifts` - Individual work sessions within events (required for multi-day, optional for single-day)
5. `shift_assignments` - Operators → Shifts (with role, pay, status, conflict tracking, hotel opt-in, travel times)

**Operators:**
6. `operators` - Crew members (rates, transportation, base location)
7. `operator_blackout_dates` - Unavailable periods (HARD BLOCK)
8. `operator_skills` - Skill ratings per operator (expandable)
9. `operator_skill_history` - Skill upgrade audit trail
10. `operator_gear` - Operator's personal gear inventory
11. `operator_gear_requests` - Requests per shift (can borrow)

**Skills & Drills:**
12. `skill_definitions` - Tenant-defined skills (videography, photography, etc.)
13. `drills` - Training sessions (scheduled on calendar)
14. `drill_attendees` - Who attended which drill
15. `drill_agenda_items` - Drill curriculum line items

**Gear & Vehicles:**
16. `gear` - Company gear (cameras, lenses, etc.)
17. `gear_tracking_log` - Movement audit trail
18. `gear_assignments` - Gear → Events (stays for all shifts, retrieval tracking)
19. `vehicles` - Company vehicles (with status/availability tracking)
20. `gear_kits` - Pre-defined gear loadouts per event type

**Alerts & Notifications:** ✅ NEW v2.2
21. `alerts` - System-wide alerts (no operators, missing gear, impossible schedules, etc.)

**REMOVED from v1.0:**
- `operator_assignments` → Replaced by `shift_assignments`
- `operator_hotels` → Merged into `events` table

**NEW in v2.2:**
- Assignment status tracking (confirmed/cancelled/completed)
- Conflict level tracking (none/caution/impossible)
- Mid-event cancellation support
- Gear retrieval workflow
- Vehicle availability status
- Telegram group integration per event
- System-wide alerts & notifications
- At-a-glance dashboard UX pattern
- Flexible shift rules (required for multi-day, optional for single-day)

**UPDATED in v2.3:**
- Enhanced command center terminology throughout
- `gear` replaces `equipment` (8 table/field renames)
- `drills` replaces `trainings` (4 table renames)
- `base_location` replaces `home_address` (operator base)
- `gear_kits` replaces `equipment_templates` (pre-defined loadouts)

---

## 🎯 Key Features

### 1. Multi-Day Events with Shifts ✅ UPDATED v2.2

**Shift Rules:**
- **Multi-day events (2+ days):** MUST have shifts (required for crew rotation, breaks, travel)
- **Single-day events <8 hours:** Single shift covering entire event (optional to subdivide)
- **Single-day events >8 hours:** Recommended to create shifts for crew breaks, but not required
- **Same operator(s) for entire event:** Allowed - create shifts, assign same operator to all

**Example 1:** Summer Festival (Friday-Sunday)
- Event: Load-in Friday 2pm → Load-out Sunday 9pm
- Shifts:
  - Friday Setup (2pm-6pm)
  - Friday Evening (6pm-11pm)
  - Saturday Morning (9am-1pm)
  - Saturday Afternoon (12:30pm-5pm) ← overlaps with morning (swing)
  - Saturday Evening (5pm-11pm)
  - Sunday Morning (9am-1pm)
  - Sunday Teardown (1pm-5pm)

**Operators assigned to specific shifts:**
- John: Sat Morning (Videographer), Sat Afternoon (Photographer)
- Sarah: Sat Morning (Photographer), Sat Evening (Photographer)
- Mike: Sat Afternoon (Videographer) ← swings in to give John break

**Equipment assigned to event:** Stays at venue for all shifts

**Example 2:** Single-Day Competition (Full Day)
- Event: Saturday 7am-8pm (13 hours)
- **Option A:** Single shift (same operator works entire event)
  - Shift 1: Full Event (7am-8pm) - John as Videographer
- **Option B:** Multiple shifts (crew rotation)
  - Shift 1: Morning (7am-2pm) - John as Videographer
  - Shift 2: Afternoon (2pm-8pm) - Sarah as Videographer

**Example 3:** Short Event (No Shifts Needed)
- Event: Saturday 9am-1pm (4 hours)
- Single shift covering entire event
- Shift 1: Main Event (9am-1pm) - John as Videographer

### 2. Flexible Pay: Hourly + Flat Rate ✅

**Workflow:**
1. Assign operator to shift
2. System calculates: $50/hr × 4hrs = $200 (estimated)
3. Owner can negotiate flat rate: "Will you take $175?"
4. Agreement offline (phone/text), enter in app
5. Assignment saved as: `pay_type = 'flat'`, `flat_rate = $175`
6. Gig sheet shows: "Flat Rate: $175.00"

**Actual hours tracked after shift:**
- Hourly: Track actual vs estimated, calculate overtime
- Flat: No overtime (fixed price regardless of hours)

### 3. Operator Personal Gear ✅

**Scenario:** John owns Sony A7III. You want him to bring it to gig.

**Workflow:**
1. John registers gear in inventory: "Sony A7III" (camera)
2. Owner assigns John to shift as Videographer
3. Owner requests: "Bring your Sony A7III + 24-70mm Lens"
4. John confirms offline
5. Gig sheet shows:
   ```
   Company Gear: Camera 1, Lens A, B
   🎒 BRING YOUR OWN:
   ⚠️ Sony A7III (requested)
   ⚠️ 24-70mm Lens (requested)
   ```

**Borrowing:**
- Can request operator's gear even when they're NOT working that shift
- Example: "Can I borrow your Sony on Saturday?" (John not working)
- `is_borrowing = true` flag tracks this

### 4. Hotel Opt-In Logic ✅

**Event-level hotel:**
- Event has hotel info: name, address, check-in/out dates
- Geocoded for travel time calculation

**Operator opt-in:**
- John (lives 200 miles away): `hotel_needed = true` → opts in
- Mike (lives locally): `hotel_needed = false` → no hotel
- Typically shared: John + Sarah + Lisa all at same Airbnb

**Gig sheet shows:**
```
🏨 ACCOMMODATION
Downtown Airbnb
123 Main St
Check-in: Friday 6pm
Check-out: Sunday 10am

Travel: Venue → Hotel (15 min)
```

### 5. Expandable Skill System ✅

**Tenant-defined skills** (not hardcoded):

**Videography Business (you):**
- Videography (1-10)
- Photography (1-10)
- Directing (1-10)
- Professionalism (1-10) - punctuality, client care

**Photography Studio:**
- Portrait Photography
- Event Photography
- Editing
- Client Relations

**AV Production Company:**
- Audio Engineering
- Lighting Design
- Stage Management
- Technical Setup

**Drill system:**
- Schedule drills on calendar (like shifts)
- Create drill agenda (line items of curriculum)
- Operators RSVP to drill
- Owner manually upgrades skills after drill
- History tracked in `operator_skill_history`

### 6. Google Maps API Integration ✅

**Features:**
- **Travel time calculation:** Base → Venue, Venue → Hotel, Between shifts
- **Historical traffic data:** Saturday 9am typical traffic (not live)
- **Batch requests:** 4 operators = 1 API call (75% cost savings)
- **Rush hour warnings:** "⚠️ CAUTION: Rush hour possible 8-9am"

**Cost:** ~$1-8/month (within $200 free tier)

**Displays:**
- "Travel time: 25-40 min (depending on traffic)"
- "🔵 Info" / "🟡 Caution" / "🔴 Alert" based on buffer time

### 7. Gear Categories ✅

Updated from v1.0:
```
camera       → Cameras + drones
lens         → Lenses
audio        → Audio gear
computer     → Laptops, desktops, monitors, storage devices
rigging      → Stands, tripods, gimbals, stabilizers
cable        → Cables
lighting     → Lighting
other        → Everything else
```

### 8. Conflict Detection & Validation ✅ NEW v2.2

**Three-Level Conflict System:**

**🔴 HARD BLOCK - Cannot Proceed:**
1. **Blackout dates** - Must remove blackout first, no override
2. **Impossible travel time** - Physically cannot arrive in time
   - Example: Shift A ends 6pm, Shift B starts 5pm (45 min away)
   - System calculates: Arrival at 6:45pm > Start at 5pm = IMPOSSIBLE
   - Block assignment, show error: "Cannot arrive in time"

**🟡 CAUTION - Requires Confirmation:**
1. **Tight schedule** - Can arrive but minimal buffer (<30 min)
   - Example: Shift A ends 4pm, travel 45 min, Shift B starts 5pm
   - Arrival: 4:45pm, Buffer: 15 min
   - Show warning: "Only 15 min buffer after 45 min drive"
   - Require confirmation + optional override reason

**🟢 REASONABLE - Proceed with Info:**
1. **Same-day shifts with adequate buffer** (30+ min)
2. **Overlapping shifts at same venue** (for swing/breaks)
   - Validate overlap <50% of shift duration
   - Flag unreasonable overlaps (>50%)

**Validation Logic:**
```typescript
// Travel Time Validation (NEW v2.2)
if (existingShift.end < newShift.start) {
  travelTime = await getTravelTime(existingVenue, newVenue);
  arrivalTime = existingShift.end + travelTime;
  buffer = newShift.start - arrivalTime;

  if (buffer < 0) {
    return 'HARD_BLOCK'; // Impossible
  } else if (buffer < 30 min) {
    return 'CAUTION'; // Tight
  } else {
    return 'REASONABLE'; // OK
  }
}
```

**Gear Conflicts:**
- ✅ Double-booking (WARN + require reason)

**Vehicle Conflicts:**
- ✅ Can mark as unavailable/out_of_service
- ✅ Double-booking detected (WARN)

### 9. Travel Itinerary on Gig Sheet ✅

**Complete travel flow:**
```
🏠 8:15 AM - Leave Base
   ↓ 25-40 min (traffic)

📍 9:00 AM - Shift 1 (Videographer)
   Downtown Venue

   (1 hour break)

📍 2:00 PM - Shift 2 (Photographer)
   Same venue

🏨 6:00 PM - End of Day
   ↓ 15 min
   Downtown Airbnb
```

### 10. Gear Tracking ✅

**Location history:**
- "In Shop"
- "Packed for [Event Name]"
- "Loaded in Van A"
- "At [Venue Name]"
- "Returned to Shop"

**Broken during event:**
- Flag: `broken_during_event = true`
- When event completes, stays as 'needs_repair' (doesn't auto-return)

### 11. Last-Minute Cancellation Workflow ✅ NEW v2.2

**Context:** Operator texts "I'm sick, can't work today" 2 hours before shift

**Workflow:**

1. **Owner marks assignment as cancelled:**
   - `shift_assignments.status = 'cancelled'`
   - Record `cancellation_reason` and `cancelled_at` timestamp
   - Assignment no longer counts toward operator pay

2. **System suggests replacements:**
   ```typescript
   findReplacements(cancelledAssignment) {
     // Query operators who:
     // - Same or higher skill level for the role
     // - No conflicting shifts (use travel time validation)
     // - Not on blackout dates
     // - Close proximity (if ride coordination needed)

     // Rank by:
     // 1. Skill match
     // 2. Availability
     // 3. Travel distance from base

     return rankedOperators;
   }
   ```

3. **Owner selects replacement:**
   - Create new assignment with `replacement_assignment_id` linking to cancelled one
   - Owner contacts replacement manually (SMS/call)
   - System shows draft message: "John cancelled [shift]. Can you cover?"

4. **Gig sheet automatically regenerated** with new operator

**No automatic notifications in MVP** - Owner handles communication manually.

### 12. Mid-Event Cancellation Support ✅ NEW v2.2

**Context:** 3-day festival cancelled after Day 1 (Day 2-3 cancelled)

**Workflow:**

1. **Cancel remaining shifts:**
   - Find all future shifts for event
   - Mark shift_assignments as 'cancelled' with reason
   - Operators not paid for cancelled shifts

2. **Financial tracking:**
   - `events.revenue_amount` = Original contracted revenue
   - `events.actual_revenue` = What was actually received
   - `events.cancellation_penalty` = Partial payment from client
   - `events.cancellation_reason` = Why cancelled

3. **Gear retrieval:**
   - Gear already at venue from Day 1
   - Flag `gear_assignments.needs_retrieval = true`
   - Manual action required: "Gear Retrieved" button
   - When retrieved: Update location history, return to 'available'

**Shift-based model handles this naturally** - completed shifts stay completed, future shifts cancelled.

### 13. Telegram Integration for Event Communication ✅ NEW v2.2

**Context:** Owner needs real-time communication with crew during events

**Architecture:**

**Per-Event Telegram Groups:**
- Each event automatically gets a Telegram group when scheduled
- Group name: "[Event Name] - [Date]"
- Owner can quickly click into event → send messages to entire crew
- Operators receive invite link via gig sheet email

**Integration Approach:**
```typescript
// Telegram Bot API (free, unlimited messages)
const TelegramBot = require('node-telegram-bot-api');

// When event is scheduled
async function createEventTelegramGroup(event: Event) {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

  // Create group
  const group = await bot.createGroup({
    title: `${event.event_name} - ${formatDate(event.load_in_time)}`,
    description: `Crew communication for ${event.event_name}`
  });

  // Store group ID
  await prisma.events.update({
    where: { id: event.id },
    data: { telegram_group_id: group.id }
  });

  // Generate invite link
  const inviteLink = await bot.exportChatInviteLink(group.id);

  return { groupId: group.id, inviteLink };
}
```

**Features:**
1. **At-a-Glance Dashboard:**
   - Click event card → Opens Telegram chat modal
   - Send quick messages without leaving app
   - See unread message count on event cards

2. **Automatic Invites:**
   - Gig sheet includes Telegram invite link
   - Operators click to join group
   - Owner sends updates: "Running 15 min late", "Setup complete", etc.

3. **Post-Event Cleanup:**
   - When event status = 'completed' → Archive group
   - When event status = 'archived' → Delete group (optional)

**Schema Changes:**
```sql
ALTER TABLE events ADD COLUMN telegram_group_id TEXT;
ALTER TABLE events ADD COLUMN telegram_invite_link TEXT;
ALTER TABLE events ADD COLUMN telegram_group_created_at TIMESTAMPTZ;
```

**Dashboard UX:**
- Main dashboard shows "in_progress" events as cards
- Each card shows unread message badge
- Click card → Inline Telegram chat (embedded via Telegram Widgets)
- Quick nav back to dashboard

**Implementation Notes:**
- Free tier: Unlimited messages
- No phone numbers needed (users join via invite link)
- Works on mobile + desktop
- No separate app required (Telegram handles it)

### 14. Alerts & Notifications System ✅ NEW v2.2

**Context:** Proactive warnings for issues that could cause event failures

**Alert Types (Dashboard + Telegram + Email):**

**🔴 CRITICAL ALERTS (Block event start):**
1. **No operators assigned** - Event < 48 hours, zero operators assigned
2. **No gear assigned** - Event < 48 hours, zero gear assigned
3. **Impossible arrival** - Operator cannot arrive on time based on travel calculation
4. **Missing vehicle** - Gear assigned but no vehicle for transport

**🟡 WARNING ALERTS (Fix recommended):**
1. **Shift too long** - Single shift >12 hours (fatigue risk)
2. **Understaffed** - Roles needed > operators assigned
3. **Tight schedule** - Travel buffer <30 min between shifts
4. **Gear conflict** - Double-booking detected

**🔵 INFO ALERTS:**
1. **Event tomorrow** - Reminder 24 hours before
2. **Gig sheets pending** - Not yet sent to operators
3. **Actual hours missing** - Event completed, hours not entered

**Alert Delivery:**
```typescript
interface Alert {
  id: string;
  tenant_id: string;
  event_id: string;
  level: 'critical' | 'warning' | 'info';
  type: 'no_operators' | 'no_gear' | 'impossible_arrival' | 'shift_too_long' | etc.;
  message: string;
  created_at: Date;
  acknowledged_at?: Date;
  resolved_at?: Date;
}

// Dashboard: Badge count on main nav
// Telegram: Auto-post to event group (for event-specific alerts)
// Email: Daily digest (for non-urgent)
```

**Dashboard Alert Panel:**
- Always visible at top of dashboard
- Click to see full list
- Acknowledge to dismiss
- Auto-resolve when condition fixed

**Alert Rules:**
```typescript
// Run every hour
async function checkEventAlerts() {
  const upcomingEvents = await getEventsNext48Hours();

  for (const event of upcomingEvents) {
    // Check operators
    const operatorCount = await countAssignedOperators(event.id);
    if (operatorCount === 0) {
      createAlert({
        event_id: event.id,
        level: 'critical',
        type: 'no_operators',
        message: `${event.event_name} has NO operators assigned (${hoursUntil(event.load_in_time)}h away)`
      });
    }

    // Check gear
    const gearCount = await countAssignedGear(event.id);
    if (gearCount === 0) {
      createAlert({
        event_id: event.id,
        level: 'critical',
        type: 'no_gear',
        message: `${event.event_name} has NO gear assigned`
      });
    }

    // Check shift lengths
    const shifts = await getShiftsForEvent(event.id);
    for (const shift of shifts) {
      const duration = differenceInHours(shift.end_time, shift.start_time);
      if (duration > 12) {
        createAlert({
          event_id: event.id,
          level: 'warning',
          type: 'shift_too_long',
          message: `Shift "${shift.shift_name}" is ${duration} hours (>12h, fatigue risk)`
        });
      }
    }
  }
}
```

**Schema Changes:**
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id),
  event_id UUID REFERENCES events(id),

  level TEXT NOT NULL CHECK (level IN ('critical', 'warning', 'info')),
  type TEXT NOT NULL,
  message TEXT NOT NULL,

  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,

  CONSTRAINT alerts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX alerts_tenant_unresolved_idx ON alerts(tenant_id, resolved_at) WHERE resolved_at IS NULL;
```

---

## 🚫 Hard Rules (Non-Negotiable)

1. **Blackout dates = HARD BLOCK**
   - Cannot override in app
   - Must contact operator offline to remove blackout first

2. **Impossible travel conflicts = HARD BLOCK** ✅ NEW v2.2
   - System prevents physically impossible schedules
   - Travel time validation enforced
   - Tight schedules require confirmation

3. **Equipment assigned to entire event**
   - Setup to teardown
   - Cannot remove mid-event (rare exception possible in schema)

4. **Subcontractors, not employees**
   - Operators are independent contractors
   - No overtime pay rules (track for reference only)

5. **Multi-tenant isolation**
   - ALL tables have `tenant_id`
   - RLS enforced at database level
   - No cross-tenant data leakage

6. **Offline negotiation for flat rates**
   - No in-app approval workflow for MVP
   - Individual rates only (no shared/split rates)
   - Owner negotiates via phone/text, enters result in app

7. **Google Maps API for travel time**
   - No manual estimation
   - Batch requests to minimize cost
   - Historical traffic data (not live)

8. **Manual communication for emergencies** ✅ NEW v2.2
   - No automatic SMS/email for cancellations
   - System suggests replacements, owner contacts manually
   - Draft messages provided for convenience

---

## 📋 Implementation Phases (Updated)

### Phase 1: Foundation (Weeks 1-2)
- Next.js 14 + TypeScript + Tailwind
- Supabase (database + auth)
- Prisma schema (17 tables with RLS)
- tRPC with auth context
- Testing infrastructure (Vitest + Playwright)

### Phase 2: Core CRUD (Weeks 3-4)
- Events CRUD
- Shifts CRUD (within events)
- Operators CRUD (with expandable skills)
- Equipment CRUD (company + operator personal)
- Vehicles CRUD

### Phase 3: Shift Assignment & Conflicts (Weeks 5-6) ✅ UPDATED v2.2
- Shift assignment workflow
- Hourly + flat rate pay calculation
- **Three-level conflict detection** (HARD BLOCK / CAUTION / OK)
- **Travel time validation** (impossible schedule prevention)
- **Last-minute cancellation** with replacement suggestions
- Travel time calculation (Google Maps API)
- Equipment request workflow (personal gear)

### Phase 4: Calendar & Scheduling (Week 7)
- Visual calendar (month/week/day views)
- Drag & drop shift assignment
- Shift overlap visualization
- Hotel opt-in management

### Phase 5: Gig Sheets & Email (Weeks 8-9)
- Gig sheet generation (travel itinerary, gear, hotel)
- HTML email templates
- .ics calendar file generation
- Manual email sending (Resend)

### Phase 6: Drills & Skills (Week 9)
- Drill sessions (scheduled on calendar)
- Drill agendas
- Skill upgrades (manual approval)
- Skill history tracking

### Phase 7: Polish & Launch (Week 10)
- Gear location tracking
- Packing lists
- Analytics dashboard
- Mobile optimization
- Documentation

### Phase 8: Future Enhancements
- In-app flat rate negotiation
- Operator self-service (view schedules)
- Live traffic data
- Advanced reporting
- White-label branding per tenant

---

## 🧪 Test Scenarios Validated

**10 scenarios tested against spec:**
1. ✅ Simple single event
2. ✅ Overlapping events (conflict detection)
3. ✅ Blackout date conflicts (hard block)
4. ✅ Ride coordination
5. ✅ Gear kit quick assign
6. ✅ Gear kit auto-suggest
7. ✅ Event duplication (annual events)
8. ✅ Multi-day events with shifts
9. ✅ Gear breaks during event
10. ✅ Overtime and pay disputes (audit trail)

**13 issues found and resolved in v2.1:**
- Gear location history (added table)
- Multi-day events (shift model)
- Gear breaking (broken_during_event flag)
- Audit trail for pay (updated_at, updated_by, notes)
- Blackout override (removed, hard block)
- Conflict warnings (overlap calculation, reason required)
- Kit validation (filter deleted gear)
- Ride provider removal (cascade + warning)
- Hotel opt-in logic (event-level + operator opt-in)
- Operator personal gear (new tables)
- Expandable skills (skill_definitions table)

**NEW v2.2 - Additional scenarios validated:**
11. ✅ Last-minute cancellation with replacement workflow
12. ✅ Mid-event cancellation with partial completion
13. ✅ Impossible travel conflicts (physics-based validation)
14. ✅ Vehicle availability tracking (out_of_service status)

---

## 💰 Estimated Costs

**Development:**
- 10 weeks full-time equivalent
- $15k-25k if outsourced (at $50-75/hr)

**Monthly Operating Costs:**
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Resend Email: $20/month
- Google Maps API: ~$1-8/month (within free tier)
- Domain: $12/year (~$1/month)
- **Total: ~$67/month**

---

## 🗄️ Schema Changes for v2.2

### Critical Additions (Phase 1 - Must Implement)

```sql
-- ============================================
-- shift_assignments: Status & Conflict Tracking
-- ============================================

ALTER TABLE shift_assignments ADD COLUMN status TEXT NOT NULL DEFAULT 'confirmed'
CHECK (status IN ('confirmed', 'cancelled', 'completed'));

ALTER TABLE shift_assignments ADD COLUMN cancelled_at TIMESTAMPTZ;
ALTER TABLE shift_assignments ADD COLUMN cancellation_reason TEXT;
ALTER TABLE shift_assignments ADD COLUMN replacement_assignment_id UUID REFERENCES shift_assignments(id);

ALTER TABLE shift_assignments ADD COLUMN conflict_level TEXT NOT NULL DEFAULT 'none'
CHECK (conflict_level IN ('none', 'caution', 'impossible'));
ALTER TABLE shift_assignments ADD COLUMN conflict_override_reason TEXT;

-- ============================================
-- events: Cancellation, Revenue & Telegram
-- ============================================

ALTER TABLE events ADD COLUMN actual_revenue DECIMAL(10,2);
ALTER TABLE events ADD COLUMN cancellation_penalty DECIMAL(10,2);
ALTER TABLE events ADD COLUMN cancellation_reason TEXT;

ALTER TABLE events ADD COLUMN telegram_group_id TEXT;
ALTER TABLE events ADD COLUMN telegram_invite_link TEXT;
ALTER TABLE events ADD COLUMN telegram_group_created_at TIMESTAMPTZ;

-- ============================================
-- gear_assignments: Retrieval Workflow
-- ============================================

ALTER TABLE gear_assignments ADD COLUMN needs_retrieval BOOLEAN DEFAULT false;
ALTER TABLE gear_assignments ADD COLUMN retrieved_at TIMESTAMPTZ;

-- ============================================
-- vehicles: Availability Tracking
-- ============================================

ALTER TABLE vehicles ADD COLUMN status TEXT NOT NULL DEFAULT 'available'
CHECK (status IN ('available', 'in_use', 'out_of_service', 'in_repair'));

ALTER TABLE vehicles ADD COLUMN out_of_service_at TIMESTAMPTZ;
ALTER TABLE vehicles ADD COLUMN out_of_service_reason TEXT;

-- ============================================
-- alerts: Proactive Notifications
-- ============================================

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,

  level TEXT NOT NULL CHECK (level IN ('critical', 'warning', 'info')),
  type TEXT NOT NULL, -- 'no_operators', 'no_gear', 'impossible_arrival', 'shift_too_long', etc.
  message TEXT NOT NULL,

  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,

  CONSTRAINT alerts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT alerts_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id)
);
```

### Indexes for Performance

```sql
-- Improve conflict detection queries
CREATE INDEX shift_assignments_operator_date_idx ON shift_assignments(operator_id, (start_time::date));
CREATE INDEX shift_assignments_status_idx ON shift_assignments(status);

-- Improve replacement search queries
CREATE INDEX operators_status_idx ON operators(status) WHERE status = 'active';
CREATE INDEX operator_blackout_dates_date_idx ON operator_blackout_dates(start_date, end_date);

-- Improve alert queries
CREATE INDEX alerts_tenant_unresolved_idx ON alerts(tenant_id, resolved_at) WHERE resolved_at IS NULL;
CREATE INDEX alerts_event_idx ON alerts(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX alerts_level_idx ON alerts(level, created_at);
```

---

## 📂 Documentation Files

**Main Spec:**
- `docs/specs/COMMANDCENTERED_SPEC_V1.md` - Original event-based spec (60 pages)
- `docs/specs/SCHEMA_V2_SHIFTS.md` - Shift-based redesign with Q&A
- `docs/specs/SCHEMA_V2.1_ADDITIONS.md` - 4 new features (personal gear, hotels, skills, maps)
- `docs/specs/SCENARIOS_AND_VALIDATION.md` - 10 test scenarios with issue tracking
- `docs/specs/ADDITIONAL_SCENARIOS_MITIGATION.md` - 12 additional edge cases + mitigation strategies
- **`SPEC_V2_LOCKED.md`** - This file (comprehensive v2.2 summary)

**Quick Reference:**
- `SPEC_SUMMARY.md` - Quick reference (needs update for v2.2)
- `PROJECT_STATUS.md` - Current status
- `PROJECT.md` - Project configuration
- `README.md` - Project overview

---

## ✅ Ready for Implementation

**Schema:** 17 tables fully defined with RLS + v2.2 additions
**Workflows:** All major workflows documented
**Conflicts:** Three-level validation (HARD BLOCK / CAUTION / OK)
**Cancellations:** Last-minute + mid-event workflows specified
**Pay:** Hourly + flat rate system designed
**Travel:** Google Maps API integration planned
**Gear:** Company + operator personal tracking
**Skills:** Expandable tenant-defined system
**Drills:** Scheduled with agendas
**Hotels:** Event-level with opt-in
**Testing:** 14 scenarios validated, 13+ issues resolved

**No guesswork remaining. Spec is battle-tested against realistic workflows including critical edge cases.**

---

## 🎯 User Roles

### The Commander (Tenant/Owner)
- **Primary user** of CommandCentered
- Coordinates all operations
- Liaises with clients for event details
- Assigns operators to shifts
- Assigns gear to events
- Sends gig sheets to crew
- Monitors active operations via Main Console
- Responds to critical alerts

### Operators (Crew)
- Receive gig sheets via email
- Join event Telegram groups
- Report to assigned shifts
- No system login required (MVP)

---

## 🚀 Next Steps

1. ✅ Spec v2.2 finalized and locked
2. ✅ UX specification created (Commander-centric dashboard)
3. 🔜 Begin Phase 1 implementation
5. 🔜 Initialize Next.js 14 project
6. 🔜 Create Supabase project
7. 🔜 Implement Prisma schema (17 tables + v2.2 fields)
8. 🔜 Setup authentication
9. 🔜 Write first tests

**Target Launch:** January 2025 (before Feb-June event season)

---

**Spec v2.2 locked. Ready to build. 🎬**
