# CommandCentered - Specification Summary

**Status:** ✅ FINALIZED - Ready for Implementation
**Date:** 2025-11-05

---

## Quick Overview

CommandCentered is a **logistics command center for videography businesses** managing multi-event operations.

**Core Features:**
- Visual calendar with drag-and-drop operator/equipment assignment
- Automatic conflict detection (operators, equipment, vehicles)
- Operator scheduling with skill tracking and overtime calculation
- Equipment management with location history and kit assignments
- Ride coordination for operators without vehicles
- One-click schedule emails with calendar attachments
- Mobile-friendly packing lists
- Multi-tenant SaaS architecture

---

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- @dnd-kit/core (drag & drop)
- react-big-calendar

**Backend:**
- tRPC (type-safe API)
- Prisma ORM
- PostgreSQL (Supabase)
- Supabase Auth
- Row Level Security (RLS)

**Infrastructure:**
- Vercel (hosting)
- Supabase (database + auth)
- Resend (email)

---

## Database Tables (11 tables)

1. **tenants** - Multi-tenant isolation
2. **user_profiles** - Extends Supabase auth.users
3. **events** - Videography jobs (confirmed bookings)
4. **operators** - Crew members with skills, rates, vehicles
5. **operator_blackout_dates** - Unavailable periods
6. **operator_assignments** - Operators assigned to events with roles, hours, pay, rides
7. **equipment** - Cameras, lenses, audio, etc. with tags/kits
8. **equipment_location_history** - Equipment movement audit trail
9. **vehicles** - Company vehicles for equipment transport
10. **equipment_assignments** - Equipment assigned to events with packing status
11. **event_equipment_templates** - Pre-defined equipment lists per event type

---

## Key Decisions

### ✅ Equipment Location Tracking
- Full history table (`equipment_location_history`)
- Tracks: "In Shop" → "Loaded in Van A" → "At Event X" → "Returned to Shop"

### ✅ Operator Transportation
- Track which operators have personal vehicles
- Track which operators need rides
- Link ride providers: operator A drives operator B

### ✅ Equipment Kits
- Tags on equipment (e.g., "Kit A", "Primary", "Backup")
- Quick assign feature: assign all items tagged "Kit A" to event at once

### ✅ Equipment Templates
- Pre-defined equipment lists per event type (dance_competition, recital, etc.)
- Auto-suggest equipment when creating events

### ✅ Hours Tracking
- **Estimated hours** - Calculated from event load_in to load_out
- **Actual hours** - Manually entered after event completion
- **Overtime hours** - Auto-calculated (actual - estimated if positive)

### ✅ Client Portal
- **NO** client access - Internal-only system
- Owner sends schedules/details via email/PDF

### ✅ Recurring Events
- **NO** complex recurrence rules
- **YES** "Duplicate Event" button for annual events

### ✅ Mobile Strategy
- Responsive web only (no PWA, no native app for MVP)
- Mobile-first CSS with Tailwind

---

## Event States

```
confirmed → scheduled → in_progress → completed → archived
    ↓           ↓            ↓
    └───────────┴────────────┴──────> cancelled
```

---

## Implementation Phases (10 Weeks)

**Phase 1-2: Foundation + CRUD** (Weeks 1-4)
- Project setup, auth, database schema
- CRUD for events, operators, equipment, vehicles

**Phase 3-4: Calendar + Conflicts** (Weeks 5-7)
- Visual calendar with drag & drop
- Conflict detection and warnings

**Phase 5-6: Packing + Emails** (Weeks 8-9)
- Packing lists with status tracking
- Email generation and sending

**Phase 7: Polish + Launch** (Week 10)
- Analytics dashboard
- Performance optimization
- Documentation

---

## Conflict Detection Rules

**Operator Conflicts:**
- Time overlap (operator assigned to overlapping events)
- Blackout dates (operator requested off)

**Equipment Conflicts:**
- Double-booking (equipment assigned to overlapping events)
- Unavailable status (needs_repair, out_of_service)

**Vehicle Conflicts:**
- Double-booking (vehicle assigned to overlapping events)

**Action:** System WARNS but allows override with confirmation

---

## Email & Communications

**Operator Schedule Email Includes:**
- Event details (name, venue, address, parking)
- Timeline (load-in, event start/end, load-out)
- Operator's role and estimated hours
- Calculated pay
- Other operators on the job
- Equipment list for event
- Special notes
- .ics calendar attachment (importable to Google Calendar, Outlook)

**Sending:** Manual trigger by owner (no auto-send)

---

## Multi-Tenant Security

**Database Level:**
- ALL tables have `tenant_id` column
- RLS policies enforce tenant isolation
- No query can access another tenant's data

**Application Level:**
- tRPC context auto-injects `tenant_id`
- All queries auto-filtered by tenant

**Future:** Subdomain routing (`client.commandcentered.com`)

---

## Testing Strategy

**Unit Tests (Vitest):**
- 80%+ coverage for service layer
- Test all business logic in isolation

**Integration Tests:**
- Test tRPC API with real database
- Verify tenant isolation

**E2E Tests (Playwright):**
- Test critical workflows
- Event creation + assignment
- Conflict detection
- Email sending

---

## Next Steps

1. ✅ Spec finalized - All questions answered
2. 🔜 Begin Phase 1 implementation
3. 🔜 Setup Next.js project
4. 🔜 Create Supabase database
5. 🔜 Implement Prisma schema
6. 🔜 Setup authentication
7. 🔜 Write first tests

---

## Files

**Main Spec:** `docs/specs/COMMANDCENTERED_SPEC_V1.md` (60 pages, comprehensive)
**This Summary:** Quick reference guide
**Project Config:** `PROJECT.md`
**Status Tracker:** `PROJECT_STATUS.md`

---

**Ready to build! 🚀**
