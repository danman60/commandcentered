# CommandCentered - Terminology Reference

**Version:** v2.3
**Date:** 2025-11-06
**Status:** ✅ Finalized

---

## 🎯 Overview

CommandCentered uses tactical, command center-inspired terminology to create an immersive mission control experience for videography and event production businesses.

---

## 📋 Complete Terminology Map

### Core Terms (Keep As-Is)

| Term | Context | Notes |
|------|---------|-------|
| **venue** | Event location | External client terminology, keep familiar |
| **events** | Production jobs | Core business concept, widely understood |
| **shifts** | Work sessions | Industry-standard scheduling term |
| **alerts** | System notifications | Clear, actionable term |
| **conflict** | Schedule overlap | Military/tactical term, appropriate |
| **cancelled** | Assignment status | Standard operational term |
| **hotel** | Lodging | External booking term, keep familiar |
| **operators** | Crew members | Command center / military terminology |
| **clients** | External customers | Business terminology, keep familiar |

### Enhanced Terms (Updated in v2.3)

| Old Term | New Term | Rationale | Database Impact |
|----------|----------|-----------|-----------------|
| `equipment` | `gear` | More tactical, command center theme | 8 table/field renames |
| `templates` | `kits` | Military supply terminology | Conceptual rename |
| `equipment_templates` | `gear_kits` | Pre-defined loadout sets | 1 table rename |
| `addresses` | `locations` | More formal, tactical | Field rename |
| `home_address` | `base_location` | Operator's base of operations | 1 field rename |
| `trainings` | `drills` | Military training terminology | 4 table renames |
| `equipment_location_history` | `gear_tracking_log` | Tactical audit trail | 1 table rename |
| `operator_equipment` | `operator_gear` | Personal loadouts | 2 table renames |
| Equipment sets | `loadouts` | Tactical gear configurations | Conceptual term |

---

## 🗂️ Database Schema Updates

### Tables Renamed (12 total)

**From v2.2 to v2.3:**

```sql
-- Gear-related tables (8 renames)
equipment                    → gear
equipment_location_history   → gear_tracking_log
equipment_assignments        → gear_assignments
equipment_templates          → gear_kits
operator_equipment           → operator_gear
operator_equipment_requests  → operator_gear_requests

-- Drill-related tables (4 renames)
trainings                    → drills
training_attendees           → drill_attendees
training_agenda_items        → drill_agenda_items
```

### Fields Renamed

```sql
-- Operators table
operators.home_address       → operators.base_location

-- Alert types
'no_equipment'               → 'no_gear'
'equipment_conflict'         → 'gear_conflict'

-- Various references
equipment_*                  → gear_*
training_*                   → drill_*
```

---

## 💬 User-Facing Terminology

### UI Labels

**Navigation:**
- Main Console (not "Dashboard")
- Planning Centre (not "Calendar" or "Scheduler")
- Gear Locker (not "Equipment Manager")
- Operator Barracks (not "Crew Manager")

**Actions:**
- "Assign Gear" (not "Add Equipment")
- "Deploy Loadout" (not "Use Template")
- "Schedule Drill" (not "Create Training")
- "Operator Base" (not "Home Address")

**Status Messages:**
- "Gear deployed" (not "Equipment assigned")
- "Drill scheduled" (not "Training created")
- "Gear conflict detected" (not "Equipment double-booked")
- "Base location required" (not "Home address missing")

---

## 🎨 Context-Specific Usage

### Alerts & Notifications

**Critical Alerts:**
- ❌ "Event has NO equipment assigned"
- ✅ "Event has NO gear assigned"

**Warning Alerts:**
- ❌ "Equipment conflict detected"
- ✅ "Gear conflict detected"

**Info Alerts:**
- ❌ "Training scheduled tomorrow"
- ✅ "Drill scheduled tomorrow"

### Gig Sheets & Communication

**Company Resources:**
- "Company Gear: Camera 1, Lens A, B" (not "Company Equipment")
- "Bring Your Own: Sony A7III" (operator gear)

**Travel Itinerary:**
- "🏠 8:15 AM - Leave Base" (not "Leave Home")
- "📦 Gear loaded in Van A" (not "Equipment loaded")

### Planning Centre

**Assignment Workflow:**
- "Click 'Assign Gear'" (not "Assign Equipment")
- "Choose loadout" (pre-configured gear set)
- "Select gear kit" (event type template)
- "Gear assigned to ENTIRE EVENT"

---

## 🔍 Search & Filter Terms

**Gear Locker Filters:**
- Status: Available / Assigned / Needs Repair / Out of Service
- Category: Camera / Lens / Audio Gear / Computer / Rigging / Cable / Lighting
- Type: Company Gear / Operator Gear

**Operator Barracks:**
- Base Location (home city/address)
- Transportation (has vehicle / needs ride)
- Skill Ratings (1-10 scale)
- Drill Attendance (history)

---

## 🚀 Migration Notes

### Code Changes Required

**Database Migration:**
```sql
-- Rename tables (12 total)
ALTER TABLE equipment RENAME TO gear;
ALTER TABLE equipment_location_history RENAME TO gear_tracking_log;
-- ... (see full list above)

-- Rename columns
ALTER TABLE operators RENAME COLUMN home_address TO base_location;

-- Update enum values
UPDATE alerts SET type = 'no_gear' WHERE type = 'no_equipment';
UPDATE alerts SET type = 'gear_conflict' WHERE type = 'equipment_conflict';
```

**Frontend Components:**
- Update all UI labels in React components
- Search & replace `equipment` → `gear` in user-facing strings
- Update icon sets (📦 for Gear Locker)
- Update navigation labels

**API Endpoints:**
- `/api/equipment/*` → `/api/gear/*`
- `/api/trainings/*` → `/api/drills/*`
- Update GraphQL schema (if used)
- Update tRPC routers

**Documentation:**
- Update all user-facing docs
- Update API documentation
- Update onboarding materials

---

## 📊 Terminology Impact Summary

**Tables affected:** 12 (57% of schema)
**Fields affected:** 20+ field renames
**UI components:** 30+ label updates estimated
**API endpoints:** 8-10 endpoint renames
**Alert types:** 3 type renames

**Development effort:** ~4-6 hours (database + API + frontend)

---

## ✅ Implementation Checklist

**Phase 1 - Database:**
- [ ] Create migration script with table renames
- [ ] Update Prisma schema definitions
- [ ] Regenerate Prisma client types
- [ ] Run migration on development database
- [ ] Verify foreign key constraints intact

**Phase 2 - Backend:**
- [ ] Update tRPC/API route names
- [ ] Update service layer function names
- [ ] Update validation schemas (Zod)
- [ ] Update seed data scripts
- [ ] Run backend test suite

**Phase 3 - Frontend:**
- [ ] Update navigation labels
- [ ] Update form field labels
- [ ] Update alert message templates
- [ ] Update table column headers
- [ ] Update search/filter UI
- [ ] Run frontend test suite

**Phase 4 - Documentation:**
- [ ] Update user guides
- [ ] Update developer docs
- [ ] Update API documentation
- [ ] Update onboarding materials

---

**This terminology creates a cohesive command center experience while maintaining clarity and usability.**
