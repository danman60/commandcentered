# CommandCentered - Project Status

**Last Updated:** 2025-11-05
**Phase:** ✅ Specification v2.1 Complete - LOCKED & Ready for Implementation

## Current State

**SPEC v2.1 FINALIZED & LOCKED** - Major paradigm shift from event-based (v1.0) to shift-based model (v2.1) with 4 additional features.

**Project Overview:**
- Logistics command center for videography businesses
- Multi-tenant SaaS architecture with expandable skills
- Shift-based scheduling with operator personal equipment tracking
- Google Maps API integration for travel time calculation
- Target launch: January 2025 (before Feb-June event season)

## Session Summary

**What We Did:**
1. ✅ Created 10 detailed test scenarios
2. ✅ Validated spec against realistic workflows
3. ✅ Found and resolved 13 issues
4. ✅ Discovered shift-based workflow requirement (MAJOR)
5. ✅ Added 4 new features (personal equipment, hotels, expandable skills, maps API)
6. ✅ Answered 20+ clarifying questions
7. ✅ Redesigned schema from 11 tables → 17 tables
8. ✅ Locked spec v2.1 - ready for implementation

## Major Changes (v1.0 → v2.1)

### Paradigm Shift: Events → Shifts

**v1.0 (Original):**
- Operators assigned to entire events
- Single hourly rate
- Basic equipment tracking

**v2.1 (Current - LOCKED):**
- Events contain multiple **shifts** (multi-day breakdown)
- Operators assigned to **specific shifts** with **specific roles**
- **Hourly OR flat rate** pay per shift
- Shifts can **overlap** (for swing/breaks)
- Operators work **different roles per shift** (video → photo → video)
- **Travel time calculation** between shifts/events

### New Features Added

1. **Operator Personal Equipment** 🎒
   - Operators register own gear inventory
   - Request specific items per shift
   - Can borrow equipment when operator not working
   - Shows on gig sheet: "Bring Your Own"

2. **Hotel Opt-In Logic** 🏨
   - Event-level hotel info (shared Airbnb/hotel)
   - Operators opt-in or opt-out per shift
   - Travel time venue→hotel calculated
   - Shows on gig sheet with full travel itinerary

3. **Expandable Skill System** 📊
   - Skills are tenant-defined (not hardcoded)
   - Videography business: videography, photography, directing, professionalism
   - Other businesses can define custom skills
   - Training sessions with agendas
   - Manual skill upgrades with history tracking

4. **Google Maps API Integration** 🗺️
   - Batch travel time calculations (4 operators = 1 API call)
   - Historical traffic data (Saturday 9am typical traffic)
   - Rush hour warnings with caution levels
   - Cost: ~$1-8/month (within free tier)

## Schema v2.1 (17 Tables)

**Tenant & Auth:**
1. tenants
2. user_profiles

**Events & Shifts (NEW MODEL):**
3. events (updated with hotel fields)
4. shifts (NEW - core work unit)
5. shift_assignments (NEW - replaces operator_assignments)

**Operators:**
6. operators (updated with home address, lat/lng)
7. operator_blackout_dates
8. operator_skills (NEW - replaces hardcoded columns)
9. operator_skill_history (NEW)
10. operator_equipment (NEW - personal gear)
11. operator_equipment_requests (NEW)

**Skills & Training:**
12. skill_definitions (NEW - tenant-defined)
13. trainings (updated with agendas)
14. training_attendees
15. training_agenda_items (NEW)

**Equipment & Vehicles:**
16. equipment (updated categories)
17. equipment_location_history
18. equipment_assignments (updated for shifts)
19. vehicles
20. event_equipment_templates

## Key Decisions Locked

**From Initial Q&A (8 questions):**
1. ✅ Equipment location tracking - Full history table
2. ✅ Operator transportation - Track vehicles + ride coordination
3. ✅ Equipment kits - Tags with quick assign feature
4. ✅ Equipment templates - Auto-suggest based on event type
5. ✅ Hours tracking - Estimated + actual + overtime calculation
6. ✅ Client portal - NO (internal-only)
7. ✅ Recurring events - Duplicate feature only
8. ✅ Mobile strategy - Responsive web (no PWA/native)

**From Scenario Validation (20 questions):**
1. ✅ Multi-day events - Shift-based model (common workflow)
2. ✅ Equipment assignment - Entire event (setup to teardown)
3. ✅ Shift overlap - Validate reasonableness (<50% overlap)
4. ✅ Travel time - Google Maps API hybrid (auto-calc + manual override)
5. ✅ Rush hour - Traffic API with historical data
6. ✅ Flat rate workflow - Show hourly estimate, negotiate offline
7. ✅ Flat rate agreement - Offline negotiation, enter in app
8. ✅ Shift conflicts - Warn with travel time but allow
9. ✅ Gig sheet - Full travel itinerary + equipment + hotel
10. ✅ Blackout override - HARD BLOCK (must remove blackout first)
11. ✅ Equipment conflict - Warn + require reason
12. ✅ Overlapping shifts different events - Warn + reason
13. ✅ Hotel - Event-level with operator opt-in/out
14. ✅ Training - Scheduled on calendar with agendas
15. ✅ Skill upgrades - Manual approval after training
16. ✅ Equipment on gig sheet - YES, show full list + personal gear
17. ✅ Operator personal equipment - Full inventory system
18. ✅ Equipment categories - Updated (camera, lens, audio, computer, rigging, cable, lighting)

## Tech Stack (Finalized)

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, @dnd-kit/core, react-big-calendar
- **Backend:** tRPC, Prisma, PostgreSQL (Supabase), Supabase Auth, RLS
- **APIs:** Google Maps API (Distance Matrix + Geocoding)
- **Infrastructure:** Vercel, Supabase, Resend
- **Testing:** Vitest (unit), Playwright (E2E)

## Test Scenarios Validated

**10 scenarios tested:**
1. ✅ Simple single event
2. ✅ Overlapping events (conflict detection)
3. ✅ Blackout date conflicts
4. ✅ Ride coordination
5. ✅ Equipment kit quick assign
6. ✅ Equipment template auto-suggest
7. ✅ Event duplication
8. ✅ Multi-day events with shifts
9. ✅ Equipment breaks during event
10. ✅ Overtime and pay disputes

**13 issues found and fixed:**
- Equipment location history table added
- Multi-day event shift model designed
- Equipment broken_during_event flag added
- Audit trail for actual_hours added
- Blackout override removed (hard block)
- Conflict warnings with reasons
- Template validation for deleted equipment
- Ride provider cascade + warning
- Hotel opt-in logic designed
- Operator personal equipment system added
- Expandable skill system designed
- Travel time API integration planned
- All conflict scenarios validated

## Next Steps (Phase 1 - Weeks 1-2)

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

## Implementation Timeline (Updated)

- **Phase 1:** Foundation (Weeks 1-2)
- **Phase 2:** Core CRUD (Weeks 3-4)
- **Phase 3:** Shift Assignment & Conflicts (Weeks 5-6)
- **Phase 4:** Calendar & Scheduling (Week 7)
- **Phase 5:** Gig Sheets & Email (Weeks 8-9)
- **Phase 6:** Training & Skills (Week 9)
- **Phase 7:** Polish & Launch (Week 10)

## Monthly Operating Costs

- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Resend Email: $20/month
- Google Maps API: ~$1-8/month (within free tier)
- Domain: ~$1/month
- **Total: ~$67/month**

## Blockers

None - Spec v2.1 finalized and locked, ready to code!

## Files

**Specifications:**
- `docs/specs/COMMANDCENTERED_SPEC_V1.md` - Original 60-page spec (event-based)
- `docs/specs/SCHEMA_V2_SHIFTS.md` - Shift-based redesign with Q&A
- `docs/specs/SCHEMA_V2.1_ADDITIONS.md` - 4 new features detailed
- `docs/specs/SCENARIOS_AND_VALIDATION.md` - 10 test scenarios + 13 issues
- **`SPEC_V2_LOCKED.md`** - Comprehensive v2.1 summary (THIS IS THE SOURCE OF TRUTH)

**Quick Reference:**
- `SPEC_SUMMARY.md` - Quick reference (needs update for v2.1)
- `PROJECT.md` - Project configuration
- `README.md` - Project overview
- This file - Current status tracker

## Notes

**Session Achievements:**
- Validated spec against realistic workflows (excellent catch!)
- Discovered shift-based workflow requirement early (saved weeks of refactoring)
- Added 4 major features through collaborative Q&A
- Answered 20+ questions to eliminate all ambiguity
- Redesigned schema to support complex multi-day operations
- Created comprehensive gig sheet example
- Planned Google Maps API integration with cost optimization

**Development Approach:**
- Spec-first development (learned from CompPortal)
- Complete data model before UI
- Business logic defined upfront with test scenarios
- Battle-tested against 10 realistic workflows
- Zero guesswork remaining

**Ready Status:**
- ✅ Schema designed (17 tables, all fields defined)
- ✅ Workflows documented (shift assignment, conflicts, pay, travel)
- ✅ Conflicts resolved (all 13 issues fixed)
- ✅ Features locked (personal equipment, hotels, skills, maps)
- ✅ Test scenarios validated (10/10 passing)
- ✅ Cost estimates confirmed (~$67/month)

**Spec v2.1 is production-ready. No more design needed. Time to build! 🚀**
