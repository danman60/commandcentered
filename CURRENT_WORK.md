# CommandCentered - Current Work

**Last Updated:** 2025-11-05
**Current Phase:** ✅ Specification Complete - Ready for Phase 1 Implementation
**Session:** 2

---

## Session 1 Summary (COMPLETED)

**Status:** ✅ Specification v2.1 finalized and locked

**Major Achievement:** Discovered shift-based workflow requirement through scenario validation, preventing weeks of refactoring later.

**Deliverables:**
- Complete spec v2.1 (shift-based model)
- 17 tables designed with RLS policies
- 10 test scenarios validated
- 13 issues found and resolved
- 4 major features added (personal equipment, hotels, expandable skills, maps API)
- 28 clarifying questions answered

**Files Created:**
- `SPEC_V2_LOCKED.md` - Primary source of truth
- `docs/specs/COMMANDCENTERED_SPEC_V1.md` - Original event-based spec (60 pages)
- `docs/specs/SCHEMA_V2_SHIFTS.md` - Shift-based redesign
- `docs/specs/SCHEMA_V2.1_ADDITIONS.md` - 4 new features detailed
- `docs/specs/SCENARIOS_AND_VALIDATION.md` - Test scenarios + validation

**Archived:**
- `docs/archive/SESSION_1_COMPLETE.md` - Full session notes

---

## Current Status (Session 2)

**Mockups Complete:** 25 HTML mockups created covering all workflows ✅

**Achievements:**
- Created 25 responsive HTML mockups using Tailwind CSS
- Demonstrated all key features (shifts, conflicts, pay, travel, skills)
- Visual workflow validation against spec v2.1
- Ready for stakeholder review and Phase 1 implementation

**Ready to Start:** Phase 1 Implementation (Foundation - Weeks 1-2)

**No blockers.** All design decisions finalized. Spec is battle-tested. UI patterns established.

---

## Next Steps (Awaiting User Direction)

**When user is ready, Phase 1 implementation tasks:**

1. [ ] Initialize Next.js 14 project with TypeScript
2. [ ] Create Supabase project (database + auth)
3. [ ] Implement Prisma schema (17 tables with RLS)
4. [ ] Setup Google Maps API credentials
5. [ ] Setup tRPC with auth context
6. [ ] Implement authentication (login/signup)
7. [ ] Seed default skill_definitions for new tenants
8. [ ] Create base layout and navigation
9. [ ] Setup testing infrastructure (Vitest + Playwright)
10. [ ] Verify multi-tenant isolation

**Estimated Duration:** 2 weeks full-time (or 10 focused sessions)

---

## Key Decisions Locked (Reference)

### Schema v2.1 (17 Tables)

**Core Model:**
- Events contain multiple shifts (multi-day capable)
- Operators assigned to specific shifts with specific roles
- Equipment assigned to entire events (setup to teardown)
- Shifts can overlap for breaks (swing operators)

**Major Features:**
1. Operator personal equipment inventory
2. Hotel opt-in logic (event-level with operator opt-in)
3. Expandable skill system (tenant-defined)
4. Google Maps API integration (batch travel time calculation)

**Business Rules:**
- Blackout dates = HARD BLOCK (no override)
- Hourly OR flat rate pay per shift
- Offline negotiation for flat rates (no in-app approval)
- Soft delete only (status = 'cancelled')
- Multi-tenant isolation (RLS enforced)

---

## Implementation Roadmap (10 Weeks)

**Phase 1:** Foundation (Weeks 1-2)
- Next.js 14 + TypeScript + Tailwind
- Supabase (database + auth)
- Prisma schema (17 tables with RLS)
- tRPC with auth context
- Testing infrastructure

**Phase 2:** Core CRUD (Weeks 3-4)
- Events, Shifts, Operators, Equipment, Vehicles

**Phase 3:** Shift Assignment & Conflicts (Weeks 5-6)
- Assignment workflow
- Conflict detection
- Travel time calculation
- Equipment requests

**Phase 4:** Calendar & Scheduling (Week 7)
- Visual calendar with drag-drop
- Shift overlap visualization
- Hotel management

**Phase 5:** Gig Sheets & Email (Weeks 8-9)
- Gig sheet generation
- Email templates
- Calendar file generation

**Phase 6:** Training & Skills (Week 9)
- Training sessions
- Skill upgrades
- History tracking

**Phase 7:** Polish & Launch (Week 10)
- Equipment location tracking
- Packing lists
- Analytics dashboard
- Mobile optimization

**Target Launch:** January 2025 (before Feb-June event season)

---

## Tech Stack (Finalized)

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, @dnd-kit/core, react-big-calendar
- **Backend:** tRPC, Prisma, PostgreSQL (Supabase), Supabase Auth, RLS
- **APIs:** Google Maps API (Distance Matrix + Geocoding)
- **Infrastructure:** Vercel, Supabase, Resend
- **Testing:** Vitest (unit), Playwright (E2E)

**Monthly Operating Costs:** ~$67/month
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Resend Email: $20/month
- Google Maps API: ~$1-8/month (within free tier)
- Domain: ~$1/month

---

## Quick Reference

**Primary Spec:** `SPEC_V2_LOCKED.md` (source of truth)

**Key Schema Tables:**
- `events` - Videography jobs (multi-day capable)
- `shifts` - Individual work sessions within events
- `shift_assignments` - Operators → Shifts (with role, pay, hotel opt-in, travel times)
- `operators` - Crew members (rates, transportation, home address)
- `operator_equipment` - Operator's personal gear inventory
- `operator_equipment_requests` - Requests per shift
- `skill_definitions` - Tenant-defined skills
- `trainings` - Training sessions
- `equipment` - Company equipment
- `vehicles` - Company vehicles

**Multi-Day Event Example:**
```
Summer Festival (Friday-Sunday)
├─ Friday Setup (2pm-6pm)
├─ Friday Evening (6pm-11pm)
├─ Saturday Morning (9am-1pm)
├─ Saturday Afternoon (12:30pm-5pm) ← overlaps for swing
├─ Saturday Evening (5pm-11pm)
├─ Sunday Morning (9am-1pm)
└─ Sunday Teardown (1pm-5pm)

Equipment: Assigned to entire event (Friday 2pm - Sunday 5pm)
Operators: Assigned to specific shifts with specific roles
```

---

## Notes for Next Session

**Context Efficiency:**
- Start with this file + PROJECT_STATUS.md + SPEC_V2_LOCKED.md (~3k tokens)
- Grep-first strategy for implementation questions
- Reference spec line numbers when implementing features
- Use SESSION_1_COMPLETE.md (archived) only if historical context needed

**Development Approach:**
- Spec-first development (already done ✅)
- Complete data model before UI
- Business logic defined upfront with test scenarios
- Battle-tested against 10 realistic workflows
- Zero guesswork remaining

**Ready to code when user gives the word. 🚀**
