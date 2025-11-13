# CommandCentered - FINAL SCHEMA DECISIONS
## From Voice Interview Session

**Date:** 2025-01-09
**Status:** ✅ ALL DECISIONS CAPTURED - Ready to lock schema
**Source:** Voice interview transcript

---

## SECTION 1: CRITICAL SCHEMA DECISIONS ✅

### 1. Operator Skills Storage
**Decision:** Use separate tables (Option 2)
> "We have the time to develop this, and I want to make sure it can serve other tenants."

**Implementation:**
- Create `operator_skills` table
- Create `skill_definitions` table
- Support custom skills beyond core 4
- Multi-tenant flexible

---

### 2. Personal Gear Naming
**Decision:** Use `operator_equipment` (not `operator_gear`)
> "We're going to need to differentiate what belongs to the operator and what belongs to our company."

**Implementation:**
- Company gear: `gear` table
- Personal gear: `operator_equipment` table
- Clear naming distinction

---

### 3. Hotel Tracking
**Decision:** Simple - fields on events table
> "I would say the simpler option. It's more of a yes/no toggle."

**Implementation:**
- Add hotel fields to `events` table
- Remove `operator_hotels` table
- One accommodation per event

---

### 4. Proposal Expiration
**Decision:** Keep `expires_at` field
> "Let's keep it just in case. I may want automations that increase frequency as proposal expires."

**Implementation:**
- Keep `proposals.expires_at`
- Use for reminder automation
- Not hard expiration

---

### 5. Event Creation Trigger
**Decision:** Contract signature only
> "Yes, 100%."

**Implementation:**
- Event created on contract.status = 'signed'
- No payment requirement
- Immediate creation

---

## SECTION 2: BUSINESS LOGIC DECISIONS ✅

### 6. Payment Processing
**Decision:** Manual payments only
> "I send an invoice, I can break up the payments prior to sending, and the customer can pay any of the installments as they need. I don't need automatic charging schedules."

**Implementation:**
- No auto-charging
- Manual invoice generation
- Client-initiated payments
- Flexible installments

---

### 7. Email Reminder System
**Decision:** Fully configurable
> "The reminders and email communication suite shouldn't be hard-coded. They need to be parameters I can set inside a CRM view."

**Implementation:**
- Editable trigger conditions
- Editable message templates
- Configurable timing
- Per-workflow customization

---

### 8. Lead Assignment
**Decision:** Single commander default, multi-user capable
> "Default that there's one commander and no sales team at this point, but the schema should support more users later."

**Implementation:**
- Default assign to admin
- Schema supports team assignment
- Future round-robin capability

---

### 9. Pricing Rules
**Decision:** Full complexity from existing templates
> "All of the pricing and packages and items are best built off the existing templates I have."

**Implementation:**
- Import existing pricing logic
- Support all current complexity
- No MVP simplification

---

### 10. Contract Templates
**Decision:** Dynamic generation with riders
> "There are sections that are always in every contract, and then riders or options I can click to dump big blocks into the contract."

**Implementation:**
- Core template + optional riders
- Manual editing capability
- Auto-populate from proposal
- Merge proposal selections

---

## SECTION 3: INTEGRATION DECISIONS ✅

### 11. Google Drive Structure
**Decision:** Client root folders with event subfolders
> "Root folder = client name, then subfolder per event date with folders like raw footage, reels, etc."

**Implementation:**
```
ClientName/
  └── 2025-06-15_Dance_Recital/
      ├── Raw_Footage/
      ├── Reels/
      ├── Finals/
      └── Client_Deliverables/
```
- Auto-create on client onboarding
- Email notification on new files

---

### 12. Email Sync
**Decision:** Two-way sync with voice agent
> "Email syncing is pretty key. I can imagine a client notes section syncing with my email and reading changes to date or location so they auto-update."

**Implementation:**
- Full two-way email sync
- Parse updates from emails
- Voice assistant query capability
- Auto-update event details

---

### 13. Payment Methods
**Decision:** Credit cards + e-transfers only
> "They just want to pay with a credit card or with e-transfer."

**E-transfer Automation:**
> "App scans incoming e-transfer emails, notifies me, lets me assign it to a client invoice, and remembers the client."

**Implementation:**
- Stripe for credit cards
- Email parsing for e-transfers
- Auto-assignment after first mapping
- Payment recognition system

---

### 14. E-Signatures
**Decision:** Basic signatures only
> "Just a signature for both me and the client and signature tracking."

**Implementation:**
- SignWell integration
- Auto-fill from proposal data
- Basic signature fields only
- No initials or complex routing

---

### 15. Notifications
**Decision:** Fully configurable routing
> "There should be a notification dashboard with toggles for what goes where: SMS, email, Telegram."

**Implementation:**
- Per-event-type routing
- Multiple channel support
- Granular configuration
- User preference overrides

---

## SECTION 4: UI/UX DECISIONS ✅

### 16. Proposal Builder
**Decision:** Drag-and-drop like Squarespace
> "Drag and drop with sections that can be titled, pricing with quantities. Similar to my existing templates, but easier."

**Implementation:**
- Visual drag-and-drop builder
- Live preview
- Section-based structure
- Quantity-based pricing

---

### 17. Mobile Strategy
**Decision:** Desktop-first with mobile dashboard
> "A mobile dashboard that's distinct from desktop. Voice agent button, notifications, schedule view."

**Implementation:**
- Desktop primary interface
- Mobile dashboard for quick access
- Voice agent integration
- Notification center

---

### 18. Client Access
**Decision:** No portal, one-off links only
> "Keep it simple. One-off links for signing contracts, viewing proposal, downloading deliverables."

**Implementation:**
- Secure magic links
- No client accounts
- Direct access to specific items
- Time-limited tokens

---

### 19. Dashboard Design
**Decision:** Configurable cards
> "Configurable dashboard with cards: revenue, CRM quick actions, logistics, calendar."

**Implementation:**
- Modular card system
- Drag to rearrange
- User preferences saved
- Expandable card library

---

## SECTION 5: OPERATOR WORKFLOW ✅

### 20. Operator Interaction
**Decision:** Telegram + Email only
> "Operators interact via Telegram groups and email gig sheets. No operator portal required."

**Implementation:**
- Auto-create Telegram groups per event
- Email gig sheets with all info
- Training docs linked
- No operator login needed

---

## SECTION 6: ADDITIONAL REQUIREMENTS ✅

### 21. Accounting Export
**Decision:** Revenue reports by client
> "I'd love a report for my accountant that shows revenue by client."

**Implementation:**
- Monthly/quarterly/annual reports
- Revenue by client breakdown
- Export to CSV/Excel
- Manual expense tracking

---

### 22. Multi-Tenant Architecture
**Decision:** Build for scale
> "Build for my company, but I want other tenants. Everything should be configurable, scoped by tenant ID."

**Implementation:**
- Full multi-tenant support
- Tenant-scoped everything
- No hard-coded values
- White-label capable

---

### 23. Analytics Requirements
**Decision:** Basic analytics sufficient
> "That's not complicated—booking trends, event types, revenue by month."

**Implementation:**
- Revenue trends
- Booking patterns
- Event type distribution
- Monthly/yearly comparisons

---

## SECTION 7: VOICE AGENT INTEGRATION 🎯

### 24. Voice Assistant
**New Requirement:** Voice-queryable database
> "There should be a voice assistant layer able to answer questions like 'Where is the recital gig today?'"

**Implementation:**
- Natural language queries
- Database search capability
- Schedule lookups
- Status updates
- Mobile voice button

---

## SCHEMA CHANGES REQUIRED

Based on these decisions:

### Tables to Rename:
1. `operator_gear` → `operator_equipment`
2. `operator_gear_requests` → `operator_equipment_requests`
3. `gear_tracking_log` → `gear_movement_history`
4. `deliverable_revisions` → `deliverable_revision_history`

### Tables to Remove:
1. ❌ `operator_hotels` (use events.hotel_* fields)

### Tables to Add:
1. ✅ `integration_logs` (critical for audit)
2. ✅ `alert_preferences` (user settings)
3. ✅ `email_templates` (configurable reminders)
4. ✅ `email_reminder_rules` (trigger configuration)
5. ✅ `voice_queries` (voice assistant logs)

### Fields to Keep:
1. ✅ `proposals.expires_at` (for automation)

### Fields to Add:
1. ✅ `events.telegram_group_id`
2. ✅ `events.telegram_invite_link`
3. ✅ `payments.e_transfer_email`
4. ✅ `payments.e_transfer_mapping`

---

## IMPLEMENTATION PRIORITIES

### Sprint 1 (Weeks 1-2): Database Foundation
- Create all 47 tables with decisions applied
- Set up multi-tenant RLS
- Generate TypeScript types
- Basic CRUD operations

### Sprint 2 (Weeks 3-4): Core Workflows
- Lead → Proposal → Contract → Event flow
- Payment tracking (manual)
- Basic email templates

### Sprint 3 (Weeks 5-6): Integrations
- SignWell for e-signatures
- Stripe for payments
- Mailgun for email
- Google Drive folders

### Sprint 4 (Weeks 7-8): UI/UX
- Drag-and-drop proposal builder
- Configurable dashboard
- Mobile dashboard

### Sprint 5 (Weeks 9-10): Advanced Features
- Email sync/parsing
- E-transfer recognition
- Telegram integration
- Voice assistant

### Sprint 6 (Weeks 11-12): Polish & Launch
- Analytics dashboards
- Accounting reports
- Testing & refinement
- Production deployment

---

## SUCCESS CRITERIA

Per your interview:
- Time saved on admin tasks
- Reduction in double-entry
- Automated client communication
- Unified system replacing multiple tools
- Voice-queryable information
- Multi-tenant scalability

---

## NEXT STEPS

1. ✅ Update schema.prisma with all decisions
2. ✅ Generate migration files
3. ✅ Lock specification document
4. ✅ Begin Sprint 1 implementation

---

**All critical decisions have been captured. Schema can now be locked.**