# SCHEMA QUICK REFERENCE - LOCKED ✅

**Status:** FINAL - All decisions made
**Date:** 2025-01-09
**Tables:** 47 (final count)

---

## ✅ DECISIONS SUMMARY (From Voice Interview)

### Schema Decisions
1. **operator_skills:** Separate tables ✅
2. **Personal gear:** operator_equipment (not gear) ✅
3. **Hotels:** Events table fields only ✅
4. **Proposal expiration:** Keep expires_at field ✅
5. **Event trigger:** Contract signature only ✅

### Business Logic
6. **Payments:** Manual only, no auto-charge ✅
7. **Reminders:** Fully configurable ✅
8. **Leads:** Single commander default ✅
9. **Pricing:** Full complexity ✅
10. **Contracts:** Dynamic with riders ✅

### Integrations
11. **Google Drive:** Client/Event folders ✅
12. **Email:** Two-way sync ✅
13. **Payments:** Credit + e-transfer ✅
14. **Signatures:** Basic only ✅
15. **Notifications:** Configurable routing ✅

### UI/UX
16. **Proposal Builder:** Drag-and-drop ✅
17. **Mobile:** Desktop-first + dashboard ✅
18. **Client:** No portal, magic links ✅
19. **Dashboard:** Configurable cards ✅

### New Features
20. **Voice Assistant:** Natural language queries ✅
21. **E-transfer:** Auto-recognition ✅
22. **Telegram:** Event groups ✅
23. **Multi-tenant:** Full support ✅

---

## 📊 FINAL TABLE LIST (47 Tables)

### Phase 1: Foundation (2)
```
✅ tenants
✅ user_profiles
```

### Phase 2: Logistics (27)
```
Events & Shifts (3):
✅ events
✅ shifts
✅ shift_assignments

Operators (6):
✅ operators
✅ operator_blackout_dates
✅ operator_skills
✅ operator_skill_history
✅ operator_equipment (was operator_gear)
✅ operator_equipment_requests

Skills & Training (4):
✅ skill_definitions
✅ drills (was trainings)
✅ drill_attendees
✅ drill_agenda_items

Gear & Vehicles (5):
✅ gear (was equipment)
✅ gear_movement_history (was gear_tracking_log)
✅ gear_assignments
✅ vehicles
✅ gear_kits

Post-Production (6):
✅ deliverables
✅ deliverable_assets
✅ editors
✅ bounties
✅ client_notes
✅ deliverable_revision_history (was deliverable_revisions)

Alerts (3):
✅ alerts
✅ alert_preferences
✅ email_templates (NEW)
```

### Phase 3: Client Management (18)
```
Leads (2):
✅ leads
✅ lead_notes

Proposals (3):
✅ proposal_templates
✅ proposals
✅ proposal_line_items

Contracts (2):
✅ contracts
✅ contract_signatures

Payments (4):
✅ invoices
✅ invoice_line_items
✅ payments
✅ payment_schedules

Clients (2):
✅ clients
✅ client_questionnaires

Email & CRM (4):
✅ email_tracking
✅ crm_organizations
✅ crm_contacts
✅ crm_interactions

Integrations (1):
✅ google_drive_folders
✅ system_settings
✅ integration_logs
```

---

## 🔄 NAMING CHANGES APPLIED

### Renamed Tables:
- `equipment` → `gear`
- `trainings` → `drills`
- `training_attendees` → `drill_attendees`
- `operator_gear` → `operator_equipment`
- `gear_tracking_log` → `gear_movement_history`
- `deliverable_revisions` → `deliverable_revision_history`

### Removed Tables:
- ❌ `operator_hotels` (using events.hotel_* fields instead)

### Added Tables:
- ✅ `integration_logs` (audit trail)
- ✅ `alert_preferences` (user settings)
- ✅ `email_templates` (configurable emails)

---

## 🎯 KEY WORKFLOWS

### 1. Lead → Client Journey
```
leads → proposals → contracts → clients → events
```

### 2. Event → Logistics Flow
```
events → shifts → shift_assignments → operator_equipment_requests
```

### 3. Payment Flow
```
contracts → payment_schedules → invoices → payments
```

### 4. Deliverable Flow
```
events → deliverables → deliverable_assets → bounties → revisions
```

---

## 🔑 CRITICAL RELATIONSHIPS

### Multi-Tenant Isolation
- Every table has `tenant_id`
- RLS policies enforce isolation
- No cross-tenant data leakage

### Suite 1 ↔ Suite 2 Handoff
- `contracts.event_id` links to logistics
- `events.contract_id` links back
- Triggered on signature, not payment

### Operator Assignment
- Operators → Shifts (not Events)
- Multiple roles per operator
- Shift overlap for swing coverage

### Equipment Tracking
- Company `gear` vs personal `operator_equipment`
- Assigned to events (stays whole time)
- Movement tracked in history table

---

## 🚀 IMPLEMENTATION ORDER

### Week 1-2: Foundation
1. Create Supabase project
2. Run migrations (all 47 tables)
3. Set up RLS policies
4. Generate TypeScript types

### Week 3-4: Core CRUD
1. Basic table operations
2. tRPC procedures
3. Form components
4. List/detail views

### Week 5-6: Workflows
1. Lead capture
2. Proposal submission
3. Contract generation
4. Event creation

### Week 7-8: Integrations
1. Stripe payments
2. SignWell signatures
3. Mailgun email
4. Google Drive

### Week 9-10: UI Polish
1. Proposal builder
2. Dashboard cards
3. Mobile views
4. Voice assistant

### Week 11-12: Launch
1. Data migration
2. Testing
3. Documentation
4. Deployment

---

## ⚡ QUICK LOOKUPS

### Critical Enums
```typescript
LeadStatus: new | contacted | qualified | proposal_sent | converted | lost
ProposalStatus: submitted | reviewing | accepted | rejected
ContractStatus: draft | sent | signed | cancelled
PaymentStatus: pending | succeeded | failed | refunded
EventStatus: pending_questionnaire | planning | confirmed | completed
ShiftAssignmentStatus: assigned | confirmed | completed | cancelled
```

### Required Integrations
- **Stripe:** Payments (manual)
- **SignWell:** E-signatures ($8/mo)
- **Mailgun:** Email (existing)
- **Google Drive:** Folders (OAuth)
- **Telegram:** Event groups (bot)

### Key Configuration
- Proposals don't hard-expire
- Events created on signature
- Payments are manual
- Email reminders configurable
- Multi-tenant from day 1

---

**This is your source of truth. All specifications are locked. Begin coding.**