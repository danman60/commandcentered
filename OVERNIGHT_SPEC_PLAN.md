# CommandCentered - Overnight Spec Build Plan
# Phase 3: Client Management & Sales Pipeline

**Date:** 2025-11-08
**Status:** 🚀 IN PROGRESS - Multi-session overnight build
**Goal:** Complete end-to-end business system spec (Lead → Booking → Logistics → Delivery)

---

## 📋 USER REQUIREMENTS (Captured 2025-11-08)

### Lead & Inquiry Flow
- Leads come from: Referrals, advertising → Website inquiry form
- Currently: HoneyBook integration for inquiry submission
- **NEW TARGET:** CommandCentered becomes inquiry endpoint
- Discovery call happens FIRST, then proposal sent
- Proposal contains pricing, client picks options
- Proposal confirmation → Project created

### Proposal Builder
- **CLIENT-FACING:** Clients fill out proposal builders themselves
- Gets all deliverables they want
- Current: N8N webhook → HTML email → Manual data entry
- **NEW TARGET:** CommandCentered endpoint → Auto-create contract
- Pricing calculated in proposal builder (see RecitalBuilder example)
- Dance recitals = standardized pricing, other events = custom

### Contracts & E-Signature
- **CRITICAL:** Auto-generate contracts from accepted proposals
- E-signature required (HoneyBook-style)
- Reminder emails for unsigned contracts
- Contract signed → Alerts for info gathering
- Client questionnaires to collect event details

### Payments
- Payment schedules on invoices (see HoneyBook example)
- **STRIPE INTEGRATION REQUIRED** - Take credit cards directly
- Milestone-based: Deposit → Pre-event → Final
- Auto payment reminders

### File Management
- **Google Drive integration** - Auto-create folders with sharing permissions
- No need for in-app file storage (Google Drive handles it)
- Client uploads: Shot lists, music, venue details

### Communication
- Email-based (no in-app messaging needed)
- System tracks emails sent/received
- Clients receive links, no login required

### CRM & Targeting
- Track ALL studios in Canada (finite list)
- "Military nomenclature" = CRM interface aesthetic
- Outreach tracking → Convert to logistics when booked
- Track products sold to organizations
- Look for cross-sell opportunities
- Simple marketing automation (not complex funnel builder)

### Integration Philosophy
- **UNIFIED APP** with different sections
- Client-facing: Clean, professional (use HTML proposal builder aesthetic)
- Internal: Tactical/military (logistics suite aesthetic)
- Contract signed → Auto-creates event in logistics system
- Alerts for missing info, upcoming deadlines

### Biggest Pain Points (Priority Order)
1. Disparate systems causing information leaks
2. Things falling through cracks
3. Can't track everything → Not maximizing revenue
4. Manual data entry between systems

### What's Missing from HoneyBook
- Integration into logistics calendar
- Integration into delivery system
- Consistent workflow end-to-end

### HoneyBook Features Used
- ✅ Contracts (heavy use)
- ✅ E-signatures (heavy use)
- ✅ Templates (heavy use)
- ✅ Invoices (heavy use)
- ❌ Projects/Client Management (don't use)
- ❌ Scheduler (don't use)
- ❌ Files (don't use - prefer Google Drive)
- ❌ In-app messaging (don't use - prefer email)

---

## 🎯 OVERNIGHT TASKS (Multi-Session)

### Session 1: File Analysis & Research
- [x] Read RecitalBuilderFrontend.html - Analyze proposal structure
- [ ] Read MusicSite.html - Understand service offerings
- [ ] Read CRM Data.html - Understand targeting data structure
- [ ] Continue HoneyBook exploration (contracts, payments, templates)
- [ ] Document HoneyBook feature parity matrix

### Session 2: Database Schema Design
- [ ] Design Phase 3 tables:
  - `leads` - Inquiry tracking
  - `proposals` - Client proposal builder submissions
  - `proposal_line_items` - Selected services/deliverables
  - `contracts` - Generated from proposals
  - `contract_signatures` - E-signature tracking
  - `invoices` - Payment requests
  - `invoice_line_items` - Itemized charges
  - `payments` - Payment tracking (Stripe)
  - `payment_schedules` - Milestone-based payments
  - `clients` - Master client records
  - `client_questionnaires` - Post-booking info gathering
  - `email_tracking` - Email communication log
  - `crm_organizations` - Studio/venue CRM
  - `crm_contacts` - Contact persons at organizations
  - `crm_interactions` - Outreach tracking
  - `google_drive_folders` - Auto-created folder tracking
- [ ] Define relationships to existing Phase 1 & 2 tables
- [ ] RLS policies for tenant isolation

### Session 3: Workflow Specification
- [ ] Lead Capture Workflow (Website form → CommandCentered)
- [ ] Proposal Builder Workflow (Client fills → Pricing calc → Confirmation)
- [ ] Contract Generation Workflow (Proposal accepted → Auto-create contract)
- [ ] E-Signature Workflow (Send → Remind → Track → Complete)
- [ ] Payment Schedule Workflow (Deposit → Milestones → Final)
- [ ] Stripe Integration Workflow (Charge → Track → Webhook → Update)
- [ ] Event Creation Workflow (Contract signed → Logistics event created)
- [ ] Client Questionnaire Workflow (Contract signed → Send questionnaire → Gather details)
- [ ] CRM Outreach Workflow (Prospect → Contact → Follow-up → Convert)
- [ ] Google Drive Workflow (Project created → Auto-create folder → Share)
- [ ] Email Tracking Workflow (Send → Track opens/clicks → Log)

### Session 4: UI Mockup Design
- [ ] Proposal Builder (Client-facing) - Based on RecitalBuilder aesthetic
  - Service selection interface
  - Pricing calculator
  - Add-ons selection
  - Review & confirm page
- [ ] Contract Viewer (Client-facing)
  - Clean professional design
  - E-signature interface
  - Download PDF option
- [ ] Payment Portal (Client-facing)
  - Invoice display
  - Payment schedule timeline
  - Stripe checkout integration
  - Payment history
- [ ] CRM Targeting Interface (Internal - Tactical aesthetic)
  - Studio list with filters
  - Outreach tracking
  - Opportunity pipeline
  - Product tracking matrix
- [ ] Lead Dashboard (Internal)
  - New inquiries
  - Active proposals
  - Pending contracts
  - Payment reminders
- [ ] Client Portal Overview (Client-facing)
  - Project status
  - Documents (contracts, invoices)
  - Questionnaires
  - Communication history

### Session 5: Integration Architecture
- [ ] Design Suite 1 (Client-facing) ↔ Suite 2 (Logistics) handoff
  - Contract signed trigger
  - Event auto-creation
  - Client data sync
  - Deliverable requirements flow
- [ ] Stripe webhook handling
  - Payment success
  - Payment failure
  - Refunds
  - Disputes
- [ ] Google Drive API integration
  - Folder creation
  - Permission management
  - File organization structure
- [ ] Email tracking integration
  - SendGrid/Mailgun
  - Open/click tracking
  - Reply detection
- [ ] N8N replacement plan
  - What CommandCentered handles natively
  - What still needs automation platform

### Session 6: Alerts & Notifications System
- [ ] New lead alerts
- [ ] Proposal viewed/accepted alerts
- [ ] Contract unsigned reminders
- [ ] Payment due reminders
- [ ] Payment received confirmations
- [ ] Missing info alerts (questionnaires incomplete)
- [ ] Pre-event checklist alerts
- [ ] Deliverable deadline alerts

### Session 7: Spec Documentation
- [ ] Add Phase 3 to SPEC_V2_LOCKED.md (v2.5)
- [ ] Document all workflows with pseudocode
- [ ] Create HoneyBook feature parity matrix
- [ ] Document Stripe integration requirements
- [ ] Document Google Drive integration requirements
- [ ] Create integration diagram (Lead → Logistics flow)
- [ ] Business rules documentation
- [ ] Security considerations (PCI compliance for payments)

### Session 8: Mockup Creation
- [ ] tactical-10-proposal-builder.html (client-facing)
- [ ] tactical-11-contract-viewer.html (client-facing)
- [ ] tactical-12-payment-portal.html (client-facing)
- [ ] tactical-13-crm-targeting.html (internal - military aesthetic)
- [ ] tactical-14-lead-dashboard.html (internal)
- [ ] tactical-15-client-portal.html (client-facing)

### Session 9: Final Questions List
- [ ] Compile anything that couldn't be inferred
- [ ] Edge cases that need clarification
- [ ] Feature priority order for implementation
- [ ] MVP vs. Nice-to-have delineation

### Session 10: Documentation & Handoff
- [ ] Update CURRENT_WORK.md
- [ ] Update PROJECT_STATUS.md
- [ ] Create PHASE3_IMPLEMENTATION_PLAN.md
- [ ] Commit all work to git
- [ ] Create summary for user

---

## 🔍 FILES TO ANALYZE

1. **D:\ClaudeCode\RecitalBuilderFrontend.html**
   - Extract: Proposal structure, pricing logic, service options
   - Note: Client-facing aesthetic to replicate

2. **C:\Users\Danie\OneDrive\Desktop\MusicSite.html**
   - Extract: Service catalog, pricing tiers
   - Note: Marketing positioning

3. **C:\Users\Danie\Downloads\CRM Data.html**
   - Extract: Organization data structure, targeting fields
   - Note: CRM interface requirements

---

## 🎨 DESIGN DIRECTION

### Client-Facing (Suite 1)
- **Aesthetic:** Clean, professional, modern
- **Reference:** RecitalBuilderFrontend.html design
- **Colors:** Professional blues, whites, clean typography
- **No tactical/military theme on client side**

### Internal/Logistics (Suite 2)
- **Aesthetic:** Tactical HUD, military command center
- **Reference:** tactical-01-dashboard.html (existing)
- **Colors:** Neon green (#00ff9d), black, angular shapes
- **CRM "Targeting" interface uses military nomenclature**

---

## ✅ SUCCESS CRITERIA

By morning, deliver:
- [ ] Complete Phase 3 spec in SPEC_V2_LOCKED.md (v2.5)
- [ ] 6 new UI mockups (proposal, contract, payment, CRM, lead dash, client portal)
- [ ] Database schema (15+ new tables)
- [ ] All workflows documented with pseudocode
- [ ] Integration architecture diagram
- [ ] HoneyBook feature parity matrix
- [ ] Stripe integration plan
- [ ] Google Drive integration plan
- [ ] Final questions list (if any)
- [ ] Implementation roadmap

---

## 🚀 SESSION CONTINUATION PROTOCOL

**When continuing across sessions:**
1. Read this file first (OVERNIGHT_SPEC_PLAN.md)
2. Check off completed tasks
3. Continue with next uncompleted task
4. Update status as you go
5. Commit progress after each major milestone
6. When ALL tasks complete → Update user with summary

**Stop conditions:**
- All checkboxes marked complete
- All deliverables created
- All files committed to git
- Summary created for user

**User will say "continue" repeatedly until work is done.**

---

**READY TO BUILD. Starting Session 1...**
