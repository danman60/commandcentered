# CommandCentered - Specification v2.6 LOCKED

**Date:** 2025-01-08
**Status:** ✅ LOCKED - Ready for Implementation
**Previous Version:** v2.5 → v2.6 (Phase 3 decisions finalized)

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

### v2.3 → v2.5: Phase 3 - Client Management & Sales Pipeline

**Major Addition: Suite 1 (StreamStage Client-Facing)**

**New in v2.5:**
1. **Lead Management System** - Capture, track, nurture leads from inquiry to contract
2. **Proposal Builder Builder** - Meta-tool to create custom proposal builders (drag-and-drop)
3. **Contract Generation & E-Signature** - Auto-generate contracts from proposals, e-signature integration
4. **Payment Processing** - Stripe integration with payment schedules, webhooks, invoices
5. **Client Portal** - Client-facing portal (proposals, contracts, payments, questionnaires)
6. **Email Tracking** - Mailgun integration with open/click tracking for proposals/contracts
7. **Alerts & Notifications System** - 25+ alert types across client lifecycle (real-time + digest)
8. **Suite 1 ↔ Suite 2 Handoff** - Contract signed → Auto-create event in logistics system
9. **Google Drive Integration** - Auto-create organized project folders + email notifications on updates
10. **Dual Branding** - StreamStage (client-facing) + CommandCentered (internal operations)

### v2.5 → v2.6: Phase 3 Decisions Finalized

**Critical Changes:**
1. **Handoff Trigger Simplified** - Contract signed → Event created (payment NOT required)
2. **Email Service Changed** - Mailgun (user already set up) instead of SendGrid/Resend
3. **Proposal Expiration Removed** - Proposals never expire, active indefinitely
4. **Auto-Counter-Signature** - Contracts pre-signed by vendor when sent to client
5. **Domain Clarified** - streamstage.live (existing) + commandcentered.app (new)
6. **Service Templates Count** - 4 templates (Recital, Promo, Concert, Event) not 5

**New Features Added:**
1. **Auto-Deploy Proposals** - Publish template → Live URL on streamstage.live/proposals/{slug}
2. **Google Drive Email Notifications** - Watch folders, auto-email client when files added
3. **Client Touch Email Flow** - Contract signed → Questionnaire sent → Automated reminders
4. **Payment Schedule Builder** - Manual configuration like HoneyBook (50% signing, 50% delivery default)
5. **Alert for Missing Technical Info** - Constant alerts when event info incomplete

**Phase 3 Tables Added (18 new tables):**
- Lead management (leads, lead_notes)
- Proposal system (proposal_templates, proposals, proposal_config_items, proposal_submissions)
- Contracts (contracts, contract_signatures)
- Payments (payments, payment_schedules)
- Clients (clients)
- Email tracking (email_tracking)
- Alerts (alerts, alert_preferences)
- Integration logs (integration_logs)

**Critical Integration Points:**
- Contract signed → `events` table (Phase 2) auto-populated (payment NOT required)
- Event creation triggers: Google Drive folder, client questionnaire, confirmation email
- Stripe webhooks update payment status (tracked separately, informational only)
- Mailgun webhooks track proposal engagement, update lead status
- Google Drive webhooks email client when files added to project folder

**Service Types (No Weddings):**
1. Dance Recital Media
2. Dance Promo Videos
3. Concert Coverage
4. Event Videography

**Pricing Models Supported:**
1. Tiered by quantity (0-100: $15, 101-200: $12, 201+: $10)
2. Base day rate + add-ons ($750 + optional extras)
3. Fixed package tiers (Bronze/Silver/Gold)
4. Volume discounts ($2000+: 10%, $3000+: 15%)
5. Conditional pricing (IF video AND photo THEN 10% discount)

---

## 📊 Database Schema Summary

### Phase 2 Tables (Logistics - Suite 2) - 21 total ✅ UPDATED v2.3

**Phase 2 = CommandCentered Internal Operations (Tactical HUD aesthetic)**

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

### Phase 3 Tables (Client Management - Suite 1) - 18 new tables ✅ NEW v2.5

**Phase 3 = StreamStage Client-Facing (Professional aesthetic)**

**Lead Management:**
1. `leads` - Potential clients (inquiry → proposal → contract)
2. `lead_notes` - Notes & interactions per lead

**Proposal System:**
3. `proposal_templates` - Reusable proposal builders (drag-and-drop configs)
4. `proposals` - Generated proposals (sent to clients)
5. `proposal_config_items` - Individual elements in proposal (text, pricing, toggles, etc.)
6. `proposal_submissions` - Client-submitted proposal data

**Contracts:**
7. `contracts` - Generated contracts from proposals
8. `contract_signatures` - E-signature records (client + vendor)

**Payments:**
9. `payments` - Individual payment records (linked to Stripe)
10. `payment_schedules` - Payment milestones (deposit, milestone, final)

**Clients:**
11. `clients` - Converted leads → paying clients

**Email Tracking:**
12. `email_tracking` - Track proposal/contract opens, clicks

**Alerts (Shared):**
13. `alerts` - Expanded to include Phase 3 alerts (proposal viewed, payment due, etc.)
14. `alert_preferences` - Per-tenant, per-alert-type delivery settings

**Integration Logs:**
15. `integration_logs` - Audit trail for Stripe, Google Drive, SendGrid events

**Questionnaires (Phase 3.5):**
16. `questionnaires` - Client questionnaire templates (pre-event info gathering)
17. `questionnaire_responses` - Client answers per event

**Deliverables (Phase 3.5):**
18. `deliverables` - Final files to deliver (videos, photos, etc.)

**Critical Link:** `events.contract_id` (Phase 2) links back to `contracts.id` (Phase 3)

---

## 🎯 Key Features

### Phase 2 Features (Logistics - Suite 2)

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

## 🎬 Phase 2: Post-Production & Deliverables ✅ NEW v2.4

### Overview

After event capture, the post-production workflow manages editing, delivery tracking, and client communication. This phase tracks:
- Video editing projects (full shows, individual routines, highlight reels)
- Photo galleries and exports
- Asset completion progress
- Editor assignments and workload balancing
- Due dates and client deliverable schedules
- Bounty system for rush/quality work
- Client notes (email integration + manual entry)

### Database Schema

**New Tables (6 total):**

#### 22. `deliverables`
Parent deliverable tracking per event.

```sql
CREATE TABLE deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  event_id UUID NOT NULL REFERENCES events(id),
  deliverable_type TEXT NOT NULL, -- 'full_show' | 'routine_videos' | 'photo_gallery' | 'highlight_reel' | 'social_clips'
  deliverable_name TEXT NOT NULL, -- e.g., "Full Show Edit", "Routine Videos"
  due_date DATE NOT NULL,
  total_assets INTEGER NOT NULL DEFAULT 0, -- Total items to deliver (e.g., 127 routines)
  completed_assets INTEGER NOT NULL DEFAULT 0, -- Items completed
  assigned_editor_id UUID REFERENCES editors(id), -- Primary editor
  status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started' | 'in_progress' | 'in_review' | 'delivered' | 'cancelled'
  priority TEXT DEFAULT 'normal', -- 'low' | 'normal' | 'high' | 'urgent'
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deliverables_tenant ON deliverables(tenant_id);
CREATE INDEX idx_deliverables_event ON deliverables(event_id);
CREATE INDEX idx_deliverables_editor ON deliverables(assigned_editor_id);
CREATE INDEX idx_deliverables_due_date ON deliverables(due_date);
CREATE INDEX idx_deliverables_status ON deliverables(status);
```

#### 23. `deliverable_assets`
Individual items within a deliverable (each routine, each photo set).

```sql
CREATE TABLE deliverable_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  deliverable_id UUID NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
  asset_name TEXT NOT NULL, -- e.g., "Solo - Emma Johnson - Titanium"
  asset_type TEXT, -- 'video' | 'photo' | 'audio' | 'graphic'
  file_path TEXT, -- Storage path or URL
  file_size_mb DECIMAL(10,2),
  duration_seconds INTEGER, -- For video/audio
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  assigned_editor_id UUID REFERENCES editors(id), -- Can differ from parent deliverable
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deliverable_assets_tenant ON deliverable_assets(tenant_id);
CREATE INDEX idx_deliverable_assets_deliverable ON deliverable_assets(deliverable_id);
CREATE INDEX idx_deliverable_assets_editor ON deliverable_assets(assigned_editor_id);
CREATE INDEX idx_deliverable_assets_completed ON deliverable_assets(completed);
```

#### 24. `editors`
People who perform post-production work (can be same as operators or separate).

```sql
CREATE TABLE editors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  specialties TEXT[], -- ['video_editing', 'color_grading', 'photo_retouching', 'motion_graphics']
  hourly_rate DECIMAL(10,2), -- Editing rate
  flat_rate_per_project DECIMAL(10,2), -- Alternative pricing
  max_concurrent_projects INTEGER DEFAULT 3, -- Workload cap
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_editors_tenant ON editors(tenant_id);
CREATE INDEX idx_editors_active ON editors(is_active);
CREATE UNIQUE INDEX idx_editors_email_per_tenant ON editors(tenant_id, email);
```

#### 25. `bounties`
Incentive system for rush/quality editing work.

```sql
CREATE TABLE bounties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  deliverable_id UUID REFERENCES deliverables(id) ON DELETE CASCADE, -- Can be deliverable-wide
  deliverable_asset_id UUID REFERENCES deliverable_assets(id) ON DELETE CASCADE, -- Or specific asset
  bounty_type TEXT NOT NULL, -- 'rush' | 'backlog_clear' | 'quality_bonus' | 'weekend_work'
  bounty_amount DECIMAL(10,2) NOT NULL, -- Dollar value
  bounty_criteria TEXT NOT NULL, -- Requirements to claim bounty
  expires_at TIMESTAMPTZ, -- Deadline to complete
  claimed_by UUID REFERENCES editors(id), -- Editor who accepted
  claimed_at TIMESTAMPTZ,
  bounty_status TEXT NOT NULL DEFAULT 'open', -- 'open' | 'claimed' | 'completed' | 'paid' | 'expired'
  completed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bounties_tenant ON bounties(tenant_id);
CREATE INDEX idx_bounties_deliverable ON bounties(deliverable_id);
CREATE INDEX idx_bounties_asset ON bounties(deliverable_asset_id);
CREATE INDEX idx_bounties_status ON bounties(bounty_status);
CREATE INDEX idx_bounties_claimed_by ON bounties(claimed_by);
```

#### 26. `client_notes`
Client communication tracking (email integration + manual entry).

```sql
CREATE TABLE client_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  event_id UUID REFERENCES events(id), -- Can be event-specific or general
  source TEXT NOT NULL DEFAULT 'manual', -- 'email' | 'manual' | 'telegram' | 'phone'
  subject TEXT,
  content TEXT NOT NULL,
  email_from TEXT, -- If source = email
  email_subject TEXT, -- Original email subject
  email_received_at TIMESTAMPTZ, -- When email was received
  priority TEXT DEFAULT 'normal', -- 'low' | 'normal' | 'high' | 'urgent'
  is_action_required BOOLEAN NOT NULL DEFAULT FALSE,
  action_status TEXT DEFAULT 'pending', -- 'pending' | 'in_progress' | 'completed' | 'ignored'
  created_by UUID REFERENCES user_profiles(id), -- Who created manual note
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_client_notes_tenant ON client_notes(tenant_id);
CREATE INDEX idx_client_notes_event ON client_notes(event_id);
CREATE INDEX idx_client_notes_source ON client_notes(source);
CREATE INDEX idx_client_notes_action_required ON client_notes(is_action_required);
CREATE INDEX idx_client_notes_created_at ON client_notes(created_at DESC);
```

#### 27. `deliverable_revisions`
Track revision requests and approval workflow.

```sql
CREATE TABLE deliverable_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  deliverable_id UUID REFERENCES deliverables(id) ON DELETE CASCADE,
  deliverable_asset_id UUID REFERENCES deliverable_assets(id) ON DELETE CASCADE,
  revision_type TEXT NOT NULL, -- 'client_request' | 'internal_qa' | 'technical_fix'
  requested_by TEXT, -- Client name or "Internal QA"
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revision_notes TEXT NOT NULL,
  assigned_editor_id UUID REFERENCES editors(id),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'in_progress' | 'completed' | 'rejected'
  completed_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deliverable_revisions_tenant ON deliverable_revisions(tenant_id);
CREATE INDEX idx_deliverable_revisions_deliverable ON deliverable_revisions(deliverable_id);
CREATE INDEX idx_deliverable_revisions_asset ON deliverable_revisions(deliverable_asset_id);
CREATE INDEX idx_deliverable_revisions_status ON deliverable_revisions(status);
```

### Workflows

#### 1. Post-Event Deliverable Creation

**Trigger:** Event status changes to 'completed' (all shifts done)

**Auto-create deliverable templates based on event type:**
```javascript
// After event completes
const event = await getEvent(eventId);

// Auto-create standard deliverables
await createDeliverables([
  {
    type: 'full_show',
    name: 'Full Show Edit',
    due_date: addDays(event.end_date, 14), // 2 weeks
    total_assets: 1
  },
  {
    type: 'routine_videos',
    name: 'Individual Routine Videos',
    due_date: addDays(event.end_date, 30), // 4 weeks
    total_assets: event.estimated_routine_count // From event metadata
  },
  {
    type: 'photo_gallery',
    name: 'Event Photo Gallery',
    due_date: addDays(event.end_date, 7), // 1 week
    total_assets: 1
  }
]);
```

#### 2. Asset Upload & Assignment

**Commander uploads captured footage:**
```
1. Upload files to storage (Dropbox/S3/Google Drive)
2. Parse filename metadata: "Solo - Emma Johnson - Titanium.mp4"
3. Auto-create deliverable_assets entries
4. Link to parent deliverable (routine_videos)
5. Suggest editor based on workload balance
```

**Editor Assignment Logic:**
```javascript
// Find editor with lowest current workload
const editors = await getActiveEditors();
const workloads = await getEditorWorkloads(editors);

const suggestedEditor = editors.reduce((best, current) => {
  const currentLoad = workloads[current.id].pending_assets;
  const bestLoad = workloads[best.id].pending_assets;
  return currentLoad < bestLoad ? current : best;
});
```

#### 3. Editor Progress Tracking

**Editors check off completed assets:**
```
1. Editor views assigned assets
2. Clicks checkbox to mark completed
3. System updates:
   - deliverable_assets.completed = true
   - deliverable_assets.completed_at = NOW()
   - deliverables.completed_assets += 1
   - Recalculate deliverables.status based on progress
```

**Progress % Calculation:**
```javascript
const progress = (deliverable.completed_assets / deliverable.total_assets) * 100;

// Auto-update status
if (progress === 0) deliverable.status = 'not_started';
else if (progress < 100) deliverable.status = 'in_progress';
else deliverable.status = 'in_review'; // Ready for QA
```

#### 4. Bounty System

**Create Rush Bounty:**
```javascript
await createBounty({
  deliverable_id: routineVideosDeliverableId,
  bounty_type: 'rush',
  bounty_amount: 750, // $750 total
  bounty_criteria: '15 routine videos edited by tomorrow 5PM with color grading',
  expires_at: tomorrow_5pm,
  bounty_status: 'open'
});

// Calculate per-asset value
const perAssetValue = 750 / 15; // $50 per video
```

**Claim Bounty:**
```
1. Editor views open bounties
2. Clicks "Claim Bounty"
3. System updates:
   - bounty.claimed_by = editorId
   - bounty.claimed_at = NOW()
   - bounty.bounty_status = 'claimed'
   - Assign all related assets to editor
```

**Complete Bounty:**
```
1. Editor completes all bounty assets before expiration
2. System auto-detects completion
3. bounty.bounty_status = 'completed'
4. Notify Commander for payment approval
5. Commander marks bounty.bounty_status = 'paid'
```

#### 5. Client Note Integration (Email)

**Email Forwarding Setup:**
```
1. Setup email forwarding: client@studio.com → notes@commandcentered.com
2. Webhook receives email (SendGrid/Mailgun)
3. Parse email headers + body
4. Extract event reference (subject line keywords, sender email)
5. Create client_note entry:
   - source = 'email'
   - email_from = sender
   - email_subject = original subject
   - content = email body (strip HTML)
   - event_id = matched event (if found)
   - is_action_required = detect keywords ("URGENT", "ASAP", "CHANGE")
6. Notify Commander: "New client note from XYZ Studio"
```

**Manual Note Creation:**
```
1. Commander clicks "Add Client Note"
2. Select event (optional)
3. Enter subject + content
4. Mark as action required (checkbox)
5. Save with source = 'manual'
```

#### 6. Revision Request Workflow

**Client Requests Revision:**
```
1. Client emails: "Please re-edit routine #47, music sync is off"
2. Email → client_note created with is_action_required = true
3. Commander creates deliverable_revision:
   - Links to specific deliverable_asset
   - revision_type = 'client_request'
   - revision_notes = "Music sync issue - routine #47"
   - Assigns to editor
4. Editor completes revision
5. Marks deliverable_revision.status = 'completed'
6. Asset sent back to client for approval
```

### UI Components

**Main Dashboard Additions:**

1. **Deliverables Overview Card:**
```
DELIVERABLES - ACTIVE (12)
┌─────────────────────────────────────┐
│ ⚠️ 3 overdue | 🟡 5 due this week   │
│ ✅ 4 on track                       │
│ [View All Deliverables]             │
└─────────────────────────────────────┘
```

2. **Client Notes Widget:**
```
CLIENT NOTES - RECENT (5)
┌─────────────────────────────────────┐
│ 📧 Studio X - Urgent music change   │
│    2 hours ago • Action Required    │
│ 📧 Dance Co - Approved full show    │
│    Yesterday • No action needed     │
│ 📝 Phone: Client wants highlight    │
│    3 days ago • In progress         │
│ [View All Notes]                    │
└─────────────────────────────────────┘
```

3. **Bounties Widget:**
```
ACTIVE BOUNTIES (2)
┌─────────────────────────────────────┐
│ 🎯 Rush: 15 Routines - $750         │
│    Due: Tomorrow 5PM • Unclaimed    │
│    [Claim Bounty]                   │
│ 🎯 Weekend Work - $200 bonus        │
│    Claimed by Mike R. • 60% done    │
└─────────────────────────────────────┘
```

**Deliverables Detail View:**

See mockup tactical-09-deliverables-dashboard.html (to be created)

### Alert Integration

**New Alert Types:**

```javascript
// Deliverable approaching due date
{
  alert_type: 'deliverable_due_soon',
  severity: 'caution',
  message: 'Routine Videos due in 2 days - 38/127 remaining',
  event_id: eventId,
  deliverable_id: deliverableId
}

// Overdue deliverable
{
  alert_type: 'deliverable_overdue',
  severity: 'critical',
  message: 'Full Show Edit is 3 days overdue',
  event_id: eventId,
  deliverable_id: deliverableId
}

// Bounty expiring
{
  alert_type: 'bounty_expiring',
  severity: 'caution',
  message: 'Rush bounty expires in 6 hours - unclaimed',
  bounty_id: bountyId
}

// Client action required
{
  alert_type: 'client_action_required',
  severity: 'high',
  message: 'Client note requires response - Studio X',
  client_note_id: noteId
}
```

### Business Rules

1. **Auto-status Updates:**
   - `completed_assets / total_assets = 0%` → status = 'not_started'
   - `0% < progress < 100%` → status = 'in_progress'
   - `progress = 100%` → status = 'in_review' (requires manual 'delivered' confirmation)

2. **Editor Workload Limits:**
   - Track `max_concurrent_projects` per editor
   - Prevent over-assignment (alert if limit exceeded)
   - Suggest editors with capacity when assigning

3. **Bounty Expiration:**
   - If `expires_at` passes and status = 'open' → status = 'expired'
   - If `expires_at` passes and status = 'claimed' but not completed → revert to 'open', notify original claimer

4. **Client Note Priorities:**
   - Email keywords trigger auto-priority:
     - "URGENT", "ASAP", "EMERGENCY" → priority = 'urgent'
     - "IMPORTANT", "PLEASE" → priority = 'high'
     - Default → priority = 'normal'

5. **Revision Tracking:**
   - Unlimited revisions allowed per asset
   - Track revision count per asset for billing purposes
   - Alert if single asset has 3+ revision requests (quality issue?)

### Integration Points

**Email → Client Notes:**
- SendGrid Inbound Parse webhook
- Mailgun Routes
- Custom email parser microservice

**Storage Integration:**
- Dropbox API for file uploads
- Google Drive API
- AWS S3 with signed URLs
- Store `file_path` as full URL or storage key

**Notification Channels:**
- Email to Commander when client note arrives
- Telegram message when bounty claimed
- Dashboard alert for overdue deliverables

---

## Phase 3 Features (Client Management - Suite 1)

### 1. Lead Management System ✅ NEW v2.5

**Lead Lifecycle:**
```
New → Contacted → Proposal Sent → Proposal Viewed → Engaged →
Proposal Submitted → Contract Sent → Won (signed + paid) / Lost / Disqualified
```

**Lead Capture:**
- Website form → API endpoint → Database
- Auto-send proposal if service type matches published template
- Track lead source (website_form, referral, repeat_client, social_media)

**Lead Dashboard:**
- CRM Targeting Interface (internal, tactical aesthetic)
- Filter by status, service type, date range
- Bulk actions (send proposal, mark contacted, disqualify)
- Duplicate detection (email-based)

**Alerts:**
- New lead captured (high priority)
- Lead inactive 7 days (medium priority)
- Proposal unopened 14 days (low priority)

### 2. Proposal Builder Builder ✅ NEW v2.5

**Meta-Tool Concept:**
- Build the tool that creates proposal builders
- Drag-and-drop element palette (text blocks, pricing calculators, toggles, media embeds)
- Live preview as you build
- Publish → Generate shareable proposal URL

**Element Types (17 total):**
1. Hero section (title, subtitle, background image)
2. Text blocks (rich text, markdown support)
3. Service toggle cards (on/off with pricing)
4. Quantity inputs (dancer count, video count, etc.)
5. Pricing calculator (tiered, volume, conditional, fixed packages, base+addons)
6. Date picker (event date)
7. Dropdown select (venue type, event type)
8. Text input (venue name, contact info)
9. Address input (venue address with Google Maps autocomplete)
10. File upload (reference photos, shot list PDFs)
11. Checkbox group (add-ons, extras)
12. Radio buttons (package tiers: Bronze/Silver/Gold)
13. Vimeo embed (promo videos, samples)
14. Image gallery (portfolio samples)
15. FAQ accordion (common questions)
16. Testimonials carousel (client reviews)
17. Payment schedule display (deposit 50%, final 50%)

**Pricing Models:**
1. **Tiered by quantity:** 0-100 dancers: $15/ea, 101-200: $12/ea, 201+: $10/ea
2. **Base rate + add-ons:** $750 base + drone ($200) + same-day edit ($300)
3. **Fixed packages:** Bronze ($1500), Silver ($2500), Gold ($4000)
4. **Volume discounts:** Total >$2000: 10% off, >$3000: 15% off
5. **Conditional pricing:** IF video AND photo THEN 10% discount

**Live Calculation:**
- Client-side JavaScript calculates totals in real-time
- Server-side validation on submission (prevent tampering)
- Display itemized breakdown (subtotal, discounts, taxes, total)

### 3. Contract Generation & E-Signature ✅ NEW v2.5

**Auto-Generation:**
- Proposal submitted → Generate contract
- Populate contract with proposal data (services, pricing, event details)
- Handlebars templates with merge fields: `{{client_name}}`, `{{total_amount}}`, `{{event_date}}`

**E-Signature Integration:**
- SignWell API or DocuSign integration
- Client signature + vendor counter-signature
- Audit trail: `signed_at`, `signature_ip`, `signature_user_agent`

**Contract States:**
```
Draft → Sent → Viewed → Signed → Paid (triggers event creation)
```

**Alerts:**
- Contract pending signature 48h (medium priority)
- Contract signed (high priority)
- Contract viewed 3x but not signed (medium priority)

### 4. Payment Processing (Stripe) ✅ NEW v2.5

**Payment Schedules:**
- Deposit (50% upfront)
- Milestone payments (e.g., 25% after pre-production meeting)
- Final payment (25% before event day)

**Stripe Integration:**
- Create Stripe customer on first payment
- Generate payment intents for each milestone
- Webhook handling:
  - `payment_intent.succeeded` → Update payment status, trigger event creation if first payment
  - `payment_intent.payment_failed` → Alert user, send retry link to client
  - `charge.refunded` → Update payment status
  - `charge.dispute.created` → CRITICAL alert, evidence due date

**Invoicing:**
- Auto-generate Stripe invoices
- Send to client via email
- Track paid/pending/overdue status

**Alerts:**
- Payment received (medium priority)
- Payment due in 3 days (medium priority)
- Payment overdue (high priority)
- Payment failed (critical priority)
- Payment disputed (critical priority)

### 5. Client Portal ✅ NEW v2.5

**Client-Facing Pages (StreamStage branding):**
1. **Proposal Builder** - Interactive proposal form with live pricing
2. **Contract Viewer** - View contract, e-sign, download PDF
3. **Payment Portal** - View invoices, payment schedule, pay online
4. **Questionnaire** - Pre-event info gathering (timeline, VIPs, special requests)
5. **Project Portal** - View deliverables, download files, Google Drive access

**Authentication:**
- Magic link login (email-based, no password)
- Session management
- Client-specific data isolation

### 6. Email Tracking (SendGrid) ✅ NEW v2.5

**Tracked Events:**
- Proposal sent
- Proposal opened (via tracking pixel)
- Proposal link clicked
- Contract sent
- Contract opened
- Contract link clicked

**Webhook Handling:**
- `email.open` → Update `email_tracking.opened_at`, create alert
- `email.click` → Update `email_tracking.clicked_at`, update lead status to 'engaged'
- `email.bounce` → Mark email as invalid
- `email.spam_report` → Auto-unsubscribe lead

**Lead Status Updates:**
- Proposal opened → Status: 'proposal_viewed'
- Link clicked → Status: 'engaged'
- Proposal submitted → Status: 'proposal_submitted'

### 7. Alerts & Notifications System ✅ NEW v2.5

**25+ Alert Types:**

**Lead Alerts:**
- New lead captured
- Lead inactive 7 days
- Lead going cold 14 days

**Proposal Alerts:**
- Proposal viewed
- Proposal link clicked
- Proposal submitted (CRITICAL)
- Proposal expiring in 3 days

**Contract Alerts:**
- Contract pending signature 48h
- Contract signed
- Contract viewed but not signed

**Payment Alerts:**
- Payment received
- Payment due in 3 days
- Payment overdue
- Payment failed (CRITICAL)
- Payment disputed (CRITICAL)

**Questionnaire Alerts:**
- Questionnaire incomplete 7 days before event
- Questionnaire partially completed
- Questionnaire completed

**Pre-Event Alerts:**
- Missing event info 14 days before
- Gear not assigned 7 days before
- Operators not assigned 7 days before (CRITICAL)
- Event tomorrow

**Deliverable Alerts:**
- Deliverable due in 3 days
- Deliverable overdue (CRITICAL)
- Deliverable completed

**System Alerts:**
- Integration failure (Stripe/Google Drive/SendGrid)
- Database backup failed
- Orphaned contract detected (signed + paid but no event)

**Priority Levels:**
- **CRITICAL** (red) - Immediate action required (payment disputed, no operators assigned)
- **HIGH** (orange) - Action within 24h (proposal submitted, payment overdue)
- **MEDIUM** (yellow) - Action within 48-72h (proposal viewed, payment due soon)
- **LOW** (green) - Informational (deliverable completed, lead going cold)

**Delivery Channels:**
- In-app alerts (primary) - Real-time dropdown panel, badge count
- Email notifications (secondary) - Immediate or daily digest

**User Preferences:**
- Configure per alert type (enable/disable, immediate vs digest)
- Do Not Disturb mode
- Quiet hours (no emails 10pm-8am)

### 8. Suite 1 ↔ Suite 2 Handoff ✅ NEW v2.5

**Critical Integration Point:**

**Trigger:** Contract status = 'signed' AND first payment status = 'completed'

**Workflow:**
```
1. Stripe webhook: payment_intent.succeeded
2. Update payment record: status = 'completed'
3. Check if first payment + contract signed
4. IF YES:
   a. Create event in Phase 2 events table
   b. Populate event fields from proposal config:
      - service_type
      - event_date (from proposal date picker)
      - venue_name (from proposal text input)
      - venue_address (from proposal address input)
      - total_amount (from contract)
   c. Link: events.contract_id = contracts.id
   d. Create Google Drive project folder
   e. Send client questionnaire email
   f. Send confirmation email
   g. Create alert: "New event created from contract"
```

**Data Extraction:**
- Proposal config items stored as JSONB
- Extract by `element_type` and `config.label`
- Fallback to default values if missing

**Rollback Strategy:**
- If event creation fails → Log to `integration_logs`
- Payment status remains 'completed' (money collected)
- Admin alert: "Orphaned contract - manual event creation required"
- Daily cron job finds orphaned contracts, sends report

### 9. Google Drive Integration ✅ NEW v2.5

**Auto-Folder Creation:**

**Folder Structure:**
```
StreamStage Projects/
  2025/
    [Client Name] - [Service Type] - [Event Date]/
      01_Raw_Footage/
      02_Edited_Files/
      03_Final_Deliverables/
      04_Client_Questionnaire/
      05_Contract_Documents/
```

**Integration:**
- Google Drive API via service account
- Tenant-specific service account credentials (encrypted)
- Auto-create folders when contract signed + paid
- Share folder with client (view-only)
- Store folder ID and URL in `events.google_drive_folder_id`

**Error Handling:**
- Retry 3x with exponential backoff
- If all retries fail → Admin alert, don't block event creation
- Manual folder creation required

### 10. Dual Branding Strategy ✅ NEW v2.5

**StreamStage (Client-Facing):**
- Professional, clean aesthetic
- CSS variables: `--streamstage-primary`, `--streamstage-accent`
- White background, minimal design
- Proposal builders, contracts, client portal

**CommandCentered (Internal Operations):**
- Tactical HUD aesthetic (neon green, grid backgrounds, corner frames)
- Military-inspired terminology
- CRM Targeting Interface, Lead Dashboard, Admin Tools
- Weekend timeline, operator scheduling, gear tracking

**Routing:**
- `streamstage.app/*` → Client-facing (Suite 1)
- `commandcentered.app/dashboard/*` → Internal operations (Suite 2)

---

## 🚀 Next Steps

1. ✅ Spec v2.2 finalized and locked (Phase 2: Logistics)
2. ✅ UX specification created (Commander-centric dashboard)
3. ✅ Deliverables & Post-Production spec added (v2.4)
4. ✅ Phase 3 specification complete (v2.5: Client Management & Sales Pipeline)
5. 🔜 Begin Phase 2 implementation (Logistics - Suite 2)
6. 🔜 Initialize Next.js 14 project
7. 🔜 Create Supabase project
8. 🔜 Implement Prisma schema (39 tables total: 21 Phase 2 + 18 Phase 3)
9. 🔜 Setup authentication
10. 🔜 Write first tests

**Phase 2 Implementation Priority:** Weekend timeline, operator scheduling, gear tracking
**Phase 3 Implementation Priority:** Lead capture, Proposal Builder Builder, contract handoff

**Target Launch:**
- Phase 2 MVP: February 2025 (before Feb-June event season)
- Phase 3 MVP: April 2025 (sales pipeline for summer/fall events)

---

**Spec v2.5 locked. Ready to build. 🎬**
