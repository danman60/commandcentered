# Phase 3 Implementation Plan

**Project:** CommandCentered Phase 3 - Client Management & Sales Pipeline
**Created:** 2025-01-08
**Status:** Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Implementation Phases](#implementation-phases)
3. [Sprint Breakdown](#sprint-breakdown)
4. [Database Migration Strategy](#database-migration-strategy)
5. [Integration Timeline](#integration-timeline)
6. [Testing Strategy](#testing-strategy)
7. [Deployment Plan](#deployment-plan)
8. [Success Metrics](#success-metrics)

---

## Overview

### Scope

**Phase 3 adds:**
- 18 new database tables
- 10 major features
- 4 external integrations (Stripe, Google Drive, SendGrid/Resend, E-signature)
- Dual branding (StreamStage + CommandCentered)
- Suite 1 ↔ Suite 2 handoff

### Timeline

**Target Launch:** April 2025 (12-week implementation)

**Milestones:**
- Week 1-2: Database schema + core models
- Week 3-4: Lead management + Proposal Builder Builder
- Week 5-6: Contract generation + E-signature
- Week 7-8: Payment processing (Stripe)
- Week 9-10: Suite 1 ↔ Suite 2 handoff + integrations
- Week 11-12: Alerts system + polish + testing

### Team

**Solo Developer:** Daniel Abrahamson

**Support:**
- Claude Code (AI pair programmer)
- Beta testers (TBD)

---

## Implementation Phases

### Phase 3.0: MVP (Core Features)

**Goal:** Minimum viable product for lead-to-contract workflow

**Features:**
1. ✅ Lead capture & management
2. ✅ Proposal Builder Builder (meta-tool)
3. ✅ Contract generation & e-signature
4. ✅ Payment processing (Stripe - basic)
5. ✅ Suite 1 ↔ Suite 2 handoff
6. ✅ Email tracking (SendGrid/Resend)
7. ✅ Alerts system (basic in-app alerts)

**Database Tables (18 new):**
- leads, lead_notes
- proposal_templates, proposals, proposal_config_items, proposal_submissions
- contracts, contract_signatures
- payments, payment_schedules
- clients
- email_tracking
- alerts, alert_preferences
- integration_logs
- questionnaires, questionnaire_responses
- deliverables

**Integrations:**
- Stripe (payment processing)
- SendGrid/Resend (email tracking)
- SignWell/DocuSign (e-signature)

**Timeline:** 10 weeks

### Phase 3.5: Enhancements (Post-MVP)

**Goal:** Polish and advanced features

**Features:**
1. Client portal (all pages fully built)
2. Client questionnaires (pre-event info gathering)
3. Deliverables tracking (post-event)
4. Google Drive integration (auto-folder creation)
5. Advanced alerts (aggregation, digests, email delivery)
6. Analytics dashboard (conversion rate, pipeline value)

**Timeline:** 4 weeks (after Phase 3.0 launch)

### Phase 4: Advanced Features (Future)

**Deferred to future:**
- Mobile app (iOS/Android)
- Public API for integrations
- White-label multi-brand support
- AI-powered proposal optimization
- Team collaboration features

---

## Sprint Breakdown

### Sprint 1 (Weeks 1-2): Foundation

**Goal:** Database schema, migrations, core models

**Tasks:**
1. Create Prisma schema for 18 new tables
2. Generate migrations
3. Apply migrations to staging database
4. Create Prisma client types
5. Set up RLS policies for tenant isolation
6. Create seed data for development

**Deliverables:**
- ✅ Prisma schema complete
- ✅ Migrations applied
- ✅ RLS policies active
- ✅ Seed data script

**Blockers:**
- None (independent work)

**Success Criteria:**
- `npm run db:migrate` succeeds
- Seed script creates sample leads, proposals, contracts
- RLS policies prevent cross-tenant queries

---

### Sprint 2 (Weeks 3-4): Lead Management + Proposal Builder Builder

**Goal:** Lead capture, CRM, and meta-tool for building proposal builders

**Tasks:**

**Lead Management:**
1. Lead capture API endpoint (`/api/leads/capture`)
2. Lead list page (CRM Targeting Interface - tactical aesthetic)
3. Lead detail view
4. Lead status transitions (new → contacted → proposal_sent → won/lost)
5. Email/phone validation
6. Duplicate detection

**Proposal Builder Builder:**
1. Proposal template list page
2. Drag-and-drop builder interface (3-column: palette → canvas → settings)
3. 17 element types implementation:
   - Hero section
   - Text blocks
   - Service toggle cards
   - Quantity inputs
   - Pricing calculator (5 models)
   - Date picker
   - Dropdown, text input, address input
   - File upload, checkboxes, radio buttons
   - Vimeo embed, image gallery
   - FAQ accordion, testimonials
   - Payment schedule display
4. Live preview pane
5. Publish/unpublish templates
6. Generate shareable proposal URL

**Deliverables:**
- ✅ Lead capture working (website form → database)
- ✅ CRM interface complete (tactical-13-crm-targeting.html implemented)
- ✅ Proposal Builder Builder functional
- ✅ At least 1 pre-built template (Dance Recital Media)

**Blockers:**
- None (can build in parallel)

**Success Criteria:**
- Lead form submission creates database record
- CRM shows all leads with filters (status, service type, date)
- Proposal Builder Builder allows creating new proposal template
- Published template generates working proposal URL

---

### Sprint 3 (Weeks 5-6): Contract Generation + E-Signature

**Goal:** Auto-generate contracts from proposals, e-signature integration

**Tasks:**

**Contract Generation:**
1. Contract template creation (Handlebars-based)
2. Auto-populate contract from proposal data
3. Contract viewer page (streamstage-02-contract-viewer.html implemented)
4. Contract status tracking (draft → sent → viewed → signed)
5. Email tracking for contract sends

**E-Signature Integration:**
1. Choose e-signature service (SignWell recommended)
2. API integration
3. E-signature flow:
   - Client clicks "Sign Contract"
   - Redirects to SignWell/DocuSign
   - Webhook receives signed contract
   - Updates contract status to 'signed'
4. Counter-signature logic (auto vs. manual)
5. PDF generation (Puppeteer)
6. Signature audit trail (`contract_signatures` table)

**Deliverables:**
- ✅ Contract auto-generation working
- ✅ E-signature integration complete
- ✅ Contract viewer page implemented
- ✅ PDF download functional

**Blockers:**
- Needs e-signature service decision (Q2.1 in Final Questions)

**Success Criteria:**
- Proposal submission → Contract generated
- Client can view contract at unique URL
- Client can e-sign contract
- Signed contract stored in database + PDF generated

---

### Sprint 4 (Weeks 7-8): Payment Processing (Stripe)

**Goal:** Payment schedules, Stripe integration, invoicing

**Tasks:**

**Stripe Setup:**
1. Stripe account configuration
2. API key storage (encrypted in `tenants` table)
3. Stripe.js integration (client-side)
4. PCI compliance verification

**Payment Schedules:**
1. Payment schedule creation (deposit, milestones, final)
2. Payment intent generation
3. Payment links (Stripe Checkout)
4. Payment portal page (streamstage-03-payment-portal.html implemented)

**Webhook Handling:**
1. Webhook endpoint (`/api/webhooks/stripe`)
2. Signature verification
3. Event handling:
   - `payment_intent.succeeded` → Update payment status
   - `payment_intent.payment_failed` → Alert user
   - `charge.refunded` → Update payment record
   - `charge.dispute.created` → CRITICAL alert
4. Idempotency (store Stripe event IDs in `integration_logs`)

**Invoicing:**
1. Stripe invoice generation
2. Invoice emails
3. Receipt generation

**Deliverables:**
- ✅ Stripe integration complete
- ✅ Payment schedules working
- ✅ Webhook handling functional
- ✅ Payment portal implemented

**Blockers:**
- Needs payment schedule rules (Q3.1 in Final Questions)

**Success Criteria:**
- Client can pay deposit via Stripe Checkout
- Webhook updates payment status in real-time
- Payment portal shows schedule + history
- Receipts sent automatically

---

### Sprint 5 (Weeks 9-10): Suite 1 ↔ Suite 2 Handoff + Integrations

**Goal:** Contract signed + paid → Auto-create event in logistics system

**Tasks:**

**Handoff Logic:**
1. Trigger: Contract status = 'signed' AND first payment status = 'completed'
2. Extract event data from proposal config (JSONB parsing)
3. Create event in `events` table (Phase 2)
4. Link: `events.contract_id` → `contracts.id`
5. Rollback strategy (orphaned contract detection)
6. Daily cron job (find orphaned contracts)

**Email Tracking (SendGrid/Resend):**
1. Choose email service (Resend recommended)
2. API integration
3. Email templates:
   - Proposal sent
   - Contract sent
   - Payment reminder
   - Payment received
   - Questionnaire sent
4. Webhook handling:
   - `email.open` → Update `email_tracking`, create alert
   - `email.click` → Update lead status to 'engaged'
   - `email.bounce` → Mark email invalid
5. Tracking pixel implementation

**Google Drive Integration (optional for MVP):**
1. Service account setup
2. Auto-folder creation on event creation
3. Folder structure:
   ```
   StreamStage Projects/
     2025/
       [Client] - [Service] - [Date]/
         01_Raw_Footage/
         02_Edited_Files/
         03_Final_Deliverables/
         04_Client_Questionnaire/
         05_Contract_Documents/
   ```
4. Share folder with client (view-only)
5. Error handling (retry 3x, alert if fails)

**Deliverables:**
- ✅ Suite handoff working (contract → event)
- ✅ Email tracking integrated
- ✅ Google Drive auto-folders (if included in MVP)

**Blockers:**
- Needs email service decision (Q2.3 in Final Questions)
- Needs Google Drive confirmation (Q2.2 in Final Questions)

**Success Criteria:**
- Contract signed + paid → Event appears in Phase 2 calendar
- Proposal emails tracked (opens, clicks)
- Google Drive folder created (if included)

---

### Sprint 6 (Weeks 11-12): Alerts System + Polish + Testing

**Goal:** Real-time alerts, UI polish, E2E testing

**Tasks:**

**Alerts System:**
1. Alert creation service (`createAlert()`)
2. Alert rules engine (25+ alert types)
3. Alert bell component (top-right dropdown)
4. Alert preferences (per-tenant, per-alert-type)
5. Email digest (daily/weekly)
6. Real-time updates (Supabase Realtime)
7. Alert Center page (full list with filters)

**Alert Types to Implement:**
- New lead captured (HIGH)
- Proposal viewed (MEDIUM)
- Proposal submitted (CRITICAL)
- Contract signed (HIGH)
- Payment received (MEDIUM)
- Payment overdue (HIGH)
- Payment disputed (CRITICAL)
- Operators not assigned 7 days before (CRITICAL)
- Event tomorrow (MEDIUM)

**UI Polish:**
1. Responsive design (mobile, tablet, desktop)
2. Loading states
3. Error states
4. Empty states
5. Accessibility (ARIA labels, keyboard navigation)
6. Dark mode (CommandCentered tactical aesthetic already dark)

**E2E Testing:**
1. Lead capture → Proposal sent
2. Proposal submission → Contract generation
3. Contract signing → Payment → Event creation
4. Stripe webhook → Payment status update

**Deliverables:**
- ✅ Alerts system complete
- ✅ UI polished and responsive
- ✅ E2E tests passing
- ✅ Ready for beta launch

**Blockers:**
- None (final polish)

**Success Criteria:**
- Alerts appear in real-time
- Email digests sent daily
- All E2E tests pass
- UI works on mobile/tablet/desktop

---

## Database Migration Strategy

### Migration Approach

**Strategy:** Feature-based migrations (add tables as features are built)

**Rationale:**
- Incremental changes easier to debug
- Can test each feature independently
- Rollback easier if issues arise

### Migration Sequence

**Migration 1: Lead Management Tables**
```sql
-- Sprint 2
CREATE TABLE leads (...);
CREATE TABLE lead_notes (...);
```

**Migration 2: Proposal System Tables**
```sql
-- Sprint 2
CREATE TABLE proposal_templates (...);
CREATE TABLE proposals (...);
CREATE TABLE proposal_config_items (...);
CREATE TABLE proposal_submissions (...);
```

**Migration 3: Contract Tables**
```sql
-- Sprint 3
CREATE TABLE contracts (...);
CREATE TABLE contract_signatures (...);
```

**Migration 4: Payment Tables**
```sql
-- Sprint 4
CREATE TABLE payments (...);
CREATE TABLE payment_schedules (...);
```

**Migration 5: Client + Integration Tables**
```sql
-- Sprint 4-5
CREATE TABLE clients (...);
CREATE TABLE email_tracking (...);
CREATE TABLE integration_logs (...);
```

**Migration 6: Alert Tables**
```sql
-- Sprint 6
CREATE TABLE alerts (...);
CREATE TABLE alert_preferences (...);
```

**Migration 7: Phase 3.5 Tables**
```sql
-- Post-MVP
CREATE TABLE questionnaires (...);
CREATE TABLE questionnaire_responses (...);
CREATE TABLE deliverables (...);
```

### RLS Policy Setup

**Applied per migration:**
```sql
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

CREATE POLICY [table_name]_tenant_isolation ON [table_name]
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

---

## Integration Timeline

### Stripe Integration

**Week:** Sprint 4 (Weeks 7-8)

**Setup:**
1. Create Stripe account (test + live)
2. Get API keys
3. Configure webhooks (`/api/webhooks/stripe`)
4. Test with Stripe test cards

**Testing:**
- Test successful payment
- Test failed payment
- Test refund
- Test dispute

### Email Service Integration

**Week:** Sprint 5 (Weeks 9-10)

**Setup (Resend recommended):**
1. Create Resend account
2. Verify domain (streamstage.app)
3. Create email templates
4. Configure webhooks (`/api/webhooks/resend`)
5. Test email tracking

**Testing:**
- Test email send
- Test open tracking
- Test click tracking
- Test bounce handling

### E-Signature Integration

**Week:** Sprint 3 (Weeks 5-6)

**Setup (SignWell recommended):**
1. Create SignWell account
2. Get API key
3. Configure webhook (`/api/webhooks/signwell`)
4. Test signature flow

**Testing:**
- Test contract send
- Test client signature
- Test counter-signature
- Test PDF download

### Google Drive Integration (Optional MVP)

**Week:** Sprint 5 (Week 10) or defer to Phase 3.5

**Setup:**
1. Create Google Cloud project
2. Enable Drive API
3. Create service account
4. Download credentials JSON
5. Encrypt and store in `tenants` table

**Testing:**
- Test folder creation
- Test folder sharing
- Test error handling (retry logic)

---

## Testing Strategy

### Unit Tests

**Tool:** Jest + React Testing Library

**Coverage:**
- Alert rules engine
- Pricing calculator logic
- Proposal config parser
- Payment schedule generator
- Email template renderer

**Target:** 80% code coverage on business logic

### Integration Tests

**Tool:** Jest + Supertest

**Coverage:**
- API endpoints (`/api/leads/capture`, `/api/proposals`, etc.)
- Webhook handlers (`/api/webhooks/stripe`, `/api/webhooks/resend`)
- Database transactions (contract → event)

**Target:** All API endpoints tested

### E2E Tests

**Tool:** Playwright

**Critical User Flows:**
1. **Lead to Contract Flow:**
   - Submit lead form
   - Verify lead appears in CRM
   - Send proposal email
   - Verify email tracking
   - Submit proposal
   - Verify contract generated

2. **Contract to Event Flow:**
   - View contract
   - Sign contract
   - Pay deposit
   - Verify event created in Phase 2 calendar

3. **Payment Flow:**
   - View payment portal
   - Pay via Stripe Checkout
   - Verify payment status updated
   - Verify receipt sent

4. **Webhook Flow:**
   - Simulate Stripe webhook (payment success)
   - Verify payment status updated
   - Verify alert created

**Target:** All critical flows pass

### Manual Testing

**Beta Testing:**
- Internal testing (use own leads)
- 5-10 invited beta users
- Collect feedback
- Fix critical bugs

**Testing Checklist:**
- [ ] Lead capture works on all devices
- [ ] Proposal Builder Builder functional
- [ ] Client can view/sign contract
- [ ] Payment processing works
- [ ] Event creation triggers correctly
- [ ] Alerts appear in real-time
- [ ] Email tracking works
- [ ] Mobile responsive
- [ ] No console errors

---

## Deployment Plan

### Environments

**Development:**
- Local (localhost:3000)
- Database: Local PostgreSQL or Supabase local
- Integrations: Test mode (Stripe test keys, SendGrid sandbox)

**Staging:**
- Vercel preview deployment
- Database: Supabase staging project
- Integrations: Test mode
- Domain: `staging.streamstage.app`

**Production:**
- Vercel production deployment
- Database: Supabase production project
- Integrations: Live mode
- Domains: `streamstage.app` + `commandcentered.app`

### Deployment Steps

**Pre-Deployment:**
1. [ ] All E2E tests pass
2. [ ] Manual testing complete
3. [ ] Database migrations tested on staging
4. [ ] Integrations configured (Stripe, email, e-signature)
5. [ ] RLS policies verified
6. [ ] Backup database

**Deployment:**
1. [ ] Run migrations on production database
2. [ ] Deploy to Vercel production
3. [ ] Verify deployment (smoke test)
4. [ ] Monitor logs for errors
5. [ ] Test critical flows in production

**Post-Deployment:**
1. [ ] Announce beta launch
2. [ ] Monitor alerts for issues
3. [ ] Collect user feedback
4. [ ] Create bug fix backlog

### Rollback Plan

**If critical issues detected:**
1. Rollback Vercel deployment to previous version
2. Rollback database migration (if schema change caused issue)
3. Notify users of downtime
4. Fix issue in staging
5. Re-deploy when fixed

---

## Success Metrics

### Phase 3.0 MVP Launch (April 2025)

**Technical Metrics:**
- [ ] 0 critical bugs
- [ ] <5 minor bugs
- [ ] 100% uptime (no outages)
- [ ] <2s page load time
- [ ] <500ms API response time

**Feature Adoption:**
- [ ] 10+ leads captured via website form
- [ ] 5+ proposals sent
- [ ] 2+ contracts signed
- [ ] 1+ contract → event handoff successful
- [ ] 1+ payment processed via Stripe

**User Satisfaction:**
- [ ] 5+ beta testers onboarded
- [ ] >80% positive feedback
- [ ] <3 feature requests for Phase 3.5

### Phase 3.5 Enhancements (June 2025)

**Feature Adoption:**
- [ ] Client portal used by 10+ clients
- [ ] Questionnaires completed by 5+ clients
- [ ] Google Drive folders created for 5+ events
- [ ] Analytics dashboard viewed 50+ times

### Long-Term (Q3 2025)

**Business Metrics:**
- [ ] 50+ leads in CRM
- [ ] 20+ proposals sent
- [ ] 10+ contracts signed
- [ ] $25k+ in revenue processed through Stripe
- [ ] 32%+ conversion rate (lead → won)

---

## Risk Mitigation

### High-Risk Areas

**1. Suite 1 ↔ Suite 2 Handoff**
- **Risk:** Event creation fails after payment received
- **Mitigation:** Retry logic (3x), orphaned contract detection, daily cron job

**2. Stripe Webhooks**
- **Risk:** Webhook not received, duplicate webhooks
- **Mitigation:** Idempotency keys, manual payment reconciliation UI, webhook retry mechanism

**3. Multi-Tenant Isolation**
- **Risk:** Cross-tenant data leak
- **Mitigation:** RLS policies enforced, audit queries, post-deploy verification

**4. E-Signature Integration**
- **Risk:** E-signature service downtime
- **Mitigation:** Manual signature fallback (upload signed PDF), service status monitoring

### Contingency Plans

**If Stripe integration delayed:**
- Launch with manual invoicing
- Add Stripe in Phase 3.5

**If e-signature integration delayed:**
- Launch with PDF download + manual signature
- Add e-signature in Phase 3.5

**If Google Drive integration delayed:**
- Defer to Phase 3.5 (not critical for MVP)

---

## Documentation Requirements

### Technical Documentation

**Code Documentation:**
- [ ] JSDoc comments on all public functions
- [ ] README.md updated with Phase 3 setup
- [ ] API endpoint documentation (OpenAPI/Swagger)
- [ ] Database schema diagram (ERD)

**Integration Documentation:**
- [ ] Stripe integration guide
- [ ] Email service integration guide
- [ ] E-signature integration guide
- [ ] Google Drive integration guide

### User Documentation

**User Guides:**
- [ ] Lead management guide
- [ ] Proposal Builder Builder tutorial
- [ ] Contract workflow guide
- [ ] Payment portal guide
- [ ] Alert preferences guide

**Video Tutorials:**
- [ ] Proposal Builder Builder walkthrough (5 min)
- [ ] Contract signing demo (3 min)
- [ ] Payment portal tour (3 min)

---

## Handoff Checklist

### For Implementation Start

- [x] Phase 3 spec complete (PHASE3_DATABASE_SCHEMA.md)
- [x] Workflows documented (PHASE3_WORKFLOWS.md)
- [x] Integration architecture defined (PHASE3_INTEGRATION_ARCHITECTURE.md)
- [x] Alerts system spec'd (PHASE3_ALERTS_NOTIFICATIONS.md)
- [x] HoneyBook parity validated (HONEYBOOK_FEATURE_PARITY.md)
- [x] Final questions compiled (PHASE3_FINAL_QUESTIONS.md)
- [x] Implementation plan ready (this document)
- [x] SPEC_V2_LOCKED.md updated to v2.5
- [x] UI mockups created (4 mockups)

### For MVP Launch

- [ ] All Sprint 1-6 tasks complete
- [ ] E2E tests passing
- [ ] Beta testing complete
- [ ] Documentation complete
- [ ] Deployment successful
- [ ] Metrics tracking live

---

## Next Steps

**Immediate (Week 1):**
1. Answer final questions (PHASE3_FINAL_QUESTIONS.md)
2. Choose integrations (e-signature, email service)
3. Create Prisma schema for 18 new tables
4. Generate migrations
5. Begin Sprint 1 (database foundation)

**Short-Term (Weeks 2-4):**
1. Complete Sprint 2 (lead management + Proposal Builder Builder)
2. Pre-build 1-2 proposal templates (Dance Recital, Event Video)
3. Test lead capture on staging

**Mid-Term (Weeks 5-10):**
1. Complete Sprints 3-5 (contracts, payments, handoff)
2. Integration testing (Stripe, email, e-signature)
3. Begin beta testing

**Long-Term (Weeks 11-12):**
1. Complete Sprint 6 (alerts + polish)
2. Final testing
3. Production deployment
4. Public launch (April 2025)

---

*Phase 3 Implementation Plan complete. Ready to build. 🚀*
