# CommandCentered - Specification v2.1 LOCKED

**Date:** 2025-11-05
**Status:** ✅ LOCKED - Ready for Implementation
**Previous Version:** v1.0 (event-based) → v2.1 (shift-based with 4 major additions)

---

## 🔒 SPEC LOCKED - What Changed from v1.0

### Major Paradigm Shift: Events → Shifts

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
- **Operator personal equipment** tracking
- **Hotel opt-in** logic
- **Expandable skill system**
- **Google Maps API** integration with batching

---

## 📊 Database Schema Summary

### Core Tables (17 total)

**Tenant & Auth:**
1. `tenants` - Multi-tenant isolation
2. `user_profiles` - User accounts

**Events & Shifts:**
3. `events` - Videography jobs (multi-day capable, includes hotel info)
4. `shifts` - Individual work sessions within events
5. `shift_assignments` - Operators → Shifts (with role, pay, hotel opt-in, travel times)

**Operators:**
6. `operators` - Crew members (rates, transportation, home address)
7. `operator_blackout_dates` - Unavailable periods (HARD BLOCK)
8. `operator_skills` - Skill ratings per operator (expandable)
9. `operator_skill_history` - Skill upgrade audit trail
10. `operator_equipment` - Operator's personal gear inventory
11. `operator_equipment_requests` - Requests per shift (can borrow)

**Skills & Training:**
12. `skill_definitions` - Tenant-defined skills (videography, photography, etc.)
13. `trainings` - Training sessions (scheduled on calendar)
14. `training_attendees` - Who attended which training
15. `training_agenda_items` - Training curriculum line items

**Equipment & Vehicles:**
16. `equipment` - Company equipment (cameras, lenses, etc.)
17. `equipment_location_history` - Movement audit trail
18. `equipment_assignments` - Equipment → Events (stays for all shifts)
19. `vehicles` - Company vehicles
20. `event_equipment_templates` - Pre-defined equipment lists per event type

**REMOVED from v1.0:**
- `operator_assignments` → Replaced by `shift_assignments`
- `operator_hotels` → Merged into `events` table

---

## 🎯 Key Features

### 1. Multi-Day Events with Shifts ✅

**Example:** Summer Festival (Friday-Sunday)
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

### 3. Operator Personal Equipment ✅

**Scenario:** John owns Sony A7III. You want him to bring it to gig.

**Workflow:**
1. John registers equipment in inventory: "Sony A7III" (camera)
2. Owner assigns John to shift as Videographer
3. Owner requests: "Bring your Sony A7III + 24-70mm Lens"
4. John confirms offline
5. Gig sheet shows:
   ```
   Company Equipment: Camera 1, Lens A, B
   🎒 BRING YOUR OWN:
   ⚠️ Sony A7III (requested)
   ⚠️ 24-70mm Lens (requested)
   ```

**Borrowing:**
- Can request operator's equipment even when they're NOT working that shift
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

**Training system:**
- Schedule trainings on calendar (like shifts)
- Create training agenda (line items of curriculum)
- Operators RSVP to training
- Owner manually upgrades skills after training
- History tracked in `operator_skill_history`

### 6. Google Maps API Integration ✅

**Features:**
- **Travel time calculation:** Home → Venue, Venue → Hotel, Between shifts
- **Historical traffic data:** Saturday 9am typical traffic (not live)
- **Batch requests:** 4 operators = 1 API call (75% cost savings)
- **Rush hour warnings:** "⚠️ CAUTION: Rush hour possible 8-9am"

**Cost:** ~$1-8/month (within $200 free tier)

**Displays:**
- "Travel time: 25-40 min (depending on traffic)"
- "🔵 Info" / "🟡 Caution" / "🔴 Alert" based on buffer time

### 7. Equipment Categories ✅

Updated from v1.0:
```
camera       → Cameras + drones
lens         → Lenses
audio        → Audio equipment
computer     → Laptops, desktops, monitors, storage devices
rigging      → Stands, tripods, gimbals, stabilizers
cable        → Cables
lighting     → Lighting
other        → Everything else
```

### 8. Conflict Detection ✅

**Operator Conflicts:**
- ✅ Time overlap between shifts (WARN + show travel time)
- ✅ Blackout dates (HARD BLOCK - must remove blackout first)
- ✅ Overlapping shifts at different events (WARN + require reason)

**Equipment Conflicts:**
- ✅ Double-booking (WARN + require reason, but never happens)

**Vehicle Conflicts:**
- ✅ Double-booking (WARN + cascade)

**Shift Overlap Validation:**
- ✅ Validate overlap <50% of shift duration (for swing shifts)
- ✅ Flag unreasonable overlaps

### 9. Travel Itinerary on Gig Sheet ✅

**Complete travel flow:**
```
🏠 8:15 AM - Leave Home
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

### 10. Equipment Tracking ✅

**Location history:**
- "In Shop"
- "Packed for [Event Name]"
- "Loaded in Van A"
- "At [Venue Name]"
- "Returned to Shop"

**Broken during event:**
- Flag: `broken_during_event = true`
- When event completes, stays as 'needs_repair' (doesn't auto-return)

---

## 🚫 Hard Rules (Non-Negotiable)

1. **Blackout dates = HARD BLOCK**
   - Cannot override in app
   - Must contact operator offline to remove blackout first

2. **Equipment assigned to entire event**
   - Setup to teardown
   - Cannot remove mid-event (rare exception possible in schema)

3. **Subcontractors, not employees**
   - Operators are independent contractors
   - No overtime pay rules (track for reference only)

4. **Multi-tenant isolation**
   - ALL tables have `tenant_id`
   - RLS enforced at database level
   - No cross-tenant data leakage

5. **Offline negotiation for flat rates**
   - No in-app approval workflow for MVP
   - Owner negotiates via phone/text, enters result in app

6. **Google Maps API for travel time**
   - No manual estimation
   - Batch requests to minimize cost
   - Historical traffic data (not live)

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

### Phase 3: Shift Assignment & Conflicts (Weeks 5-6)
- Shift assignment workflow
- Hourly + flat rate pay calculation
- Conflict detection (operators, equipment, vehicles, blackout)
- Travel time calculation (Google Maps API)
- Equipment request workflow (personal gear)

### Phase 4: Calendar & Scheduling (Week 7)
- Visual calendar (month/week/day views)
- Drag & drop shift assignment
- Shift overlap visualization
- Hotel opt-in management

### Phase 5: Gig Sheets & Email (Weeks 8-9)
- Gig sheet generation (travel itinerary, equipment, hotel)
- HTML email templates
- .ics calendar file generation
- Manual email sending (Resend)

### Phase 6: Training & Skills (Week 9)
- Training sessions (scheduled on calendar)
- Training agendas
- Skill upgrades (manual approval)
- Skill history tracking

### Phase 7: Polish & Launch (Week 10)
- Equipment location tracking
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
5. ✅ Equipment kit quick assign
6. ✅ Equipment template auto-suggest
7. ✅ Event duplication (annual events)
8. ✅ Multi-day events with shifts
9. ✅ Equipment breaks during event
10. ✅ Overtime and pay disputes (audit trail)

**13 issues found and resolved:**
- Equipment location history (added table)
- Multi-day events (shift model)
- Equipment breaking (broken_during_event flag)
- Audit trail for pay (updated_at, updated_by, notes)
- Blackout override (removed, hard block)
- Conflict warnings (overlap calculation, reason required)
- Template validation (filter deleted equipment)
- Ride provider removal (cascade + warning)
- Hotel opt-in logic (event-level + operator opt-in)
- Operator personal equipment (new tables)
- Expandable skills (skill_definitions table)

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

## 📂 Documentation Files

**Main Spec:**
- `docs/specs/COMMANDCENTERED_SPEC_V1.md` - Original event-based spec (60 pages)
- `docs/specs/SCHEMA_V2_SHIFTS.md` - Shift-based redesign with Q&A
- `docs/specs/SCHEMA_V2.1_ADDITIONS.md` - 4 new features (personal equipment, hotels, skills, maps)
- `docs/specs/SCENARIOS_AND_VALIDATION.md` - 10 test scenarios with issue tracking
- **`SPEC_V2_LOCKED.md`** - This file (comprehensive summary)

**Quick Reference:**
- `SPEC_SUMMARY.md` - Quick reference (needs update for v2.1)
- `PROJECT_STATUS.md` - Current status
- `PROJECT.md` - Project configuration
- `README.md` - Project overview

---

## ✅ Ready for Implementation

**Schema:** 17 tables fully defined with RLS
**Workflows:** All major workflows documented
**Conflicts:** Detection and resolution logic specified
**Pay:** Hourly + flat rate system designed
**Travel:** Google Maps API integration planned
**Equipment:** Company + operator personal tracking
**Skills:** Expandable tenant-defined system
**Training:** Scheduled with agendas
**Hotels:** Event-level with opt-in
**Testing:** 10 scenarios validated, 13 issues resolved

**No guesswork remaining. Spec is battle-tested against realistic workflows.**

---

## 🚀 Next Steps

1. ✅ Spec v2.1 finalized and locked
2. 🔜 Begin Phase 1 implementation
3. 🔜 Initialize Next.js 14 project
4. 🔜 Create Supabase project
5. 🔜 Implement Prisma schema (17 tables)
6. 🔜 Setup authentication
7. 🔜 Write first tests

**Target Launch:** January 2025 (before Feb-June event season)

---

**Spec locked. Ready to build. 🎬**
