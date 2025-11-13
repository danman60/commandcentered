# Phase 3 Final Questions List

**Project:** CommandCentered Phase 3 - Client Management & Sales Pipeline
**Created:** 2025-01-08
**Purpose:** Clarify remaining unknowns before implementation

---

## Overview

This document contains questions that couldn't be inferred from the overnight spec session. These require explicit answers before implementation begins.

**Question Categories:**
1. Feature Priority & MVP Scope
2. Integration Details
3. Business Rules & Edge Cases
4. UI/UX Decisions
5. Technical Architecture

---

## 1. Feature Priority & MVP Scope

### Q1.1: MVP Feature Set

**Context:** Phase 3 includes 10 major features + 18 database tables + 4 integrations.

**Question:** Which features are CRITICAL for Phase 3.0 MVP vs. Phase 3.5 enhancements?

**Proposed MVP (Phase 3.0):**
- ✅ Lead capture & management
- ✅ Proposal Builder Builder (meta-tool)
- ✅ Contract generation & e-signature
- ✅ Payment processing (Stripe)
- ✅ Suite 1 ↔ Suite 2 handoff (contract → event)
- ✅ Email tracking (SendGrid)
- ✅ Alerts system (basic)

**Proposed Phase 3.5:**
- Client portal (all pages fully built out)
- Client questionnaires
- Deliverables tracking
- Google Drive integration
- Advanced alerts (aggregation, digests)

**Answer Needed:**
- [ ] Approve MVP split above
- [ ] Move features between MVP and Phase 3.5
- [ ] Add/remove features

### Q1.2: Service Type Priority

**Context:** 5 service types defined (recital, event, corporate, concert, promo).

**Question:** Which service types should have pre-built proposal templates for MVP launch?

**Options:**
- A) All 5 service types (most work, widest appeal)
- B) Dance Recital only (narrowest focus, fastest to market)
- C) Dance Recital + Event Video (2 most common)

**Answer Needed:**
- [ ] Select option A, B, or C
- [ ] If C, which 2-3 service types?

### Q1.3: HoneyBook Feature Parity

**Context:** HoneyBook comparison shows 94% adjusted parity (excluding intentional exclusions).

**Question:** Are there any "intentionally excluded" features we should reconsider adding to MVP?

**Excluded Features:**
- Team collaboration (lead assignment, roles)
- Zapier integration
- Custom report builder
- Multi-currency support
- Appointment booking/scheduling
- In-app client messaging

**Answer Needed:**
- [ ] Keep all exclusions as-is
- [ ] Add specific excluded features to MVP
- [ ] Add specific excluded features to Phase 3.5

---

## 2. Integration Details

### Q2.1: E-Signature Service Choice

**Context:** Contract e-signature requires 3rd-party integration.

**Question:** Which e-signature service should we integrate?

**Options:**
| Service | Pros | Cons | Pricing |
|---------|------|------|---------|
| **DocuSign** | Industry standard, trusted brand | Most expensive, complex API | $25-40/month |
| **SignWell** | Modern API, good pricing | Less brand recognition | $8/month |
| **HelloSign (Dropbox Sign)** | Good balance, owned by Dropbox | Mid-tier pricing | $15-25/month |
| **PandaDoc** | All-in-one (proposals + contracts) | Redundant with our proposal builder | $19-49/month |

**Answer Needed:**
- [ ] Select e-signature service
- [ ] Budget allocation for this integration

### Q2.2: Google Drive vs. Dropbox vs. AWS S3

**Context:** Auto-folder creation requires cloud storage integration.

**Question:** Which storage provider for project folders?

**Options:**
| Provider | Pros | Cons |
|----------|------|------|
| **Google Drive** | Client familiarity, free tier generous | Service account setup complex |
| **Dropbox** | Excellent API, folder sharing | Less client familiarity |
| **AWS S3** | Cheapest at scale, full control | Not user-friendly for clients (no folder browsing) |

**Recommendation:** Google Drive (client familiarity + folder browsing)

**Answer Needed:**
- [ ] Approve Google Drive
- [ ] Select alternative (Dropbox or S3)

### Q2.3: Email Service Choice

**Context:** Email tracking requires SendGrid, Mailgun, or Resend.

**Question:** Which email service for proposal/contract emails?

**Options:**
| Service | Pros | Cons | Pricing |
|---------|------|------|---------|
| **SendGrid** | Industry standard, great tracking | Steeper learning curve | Free tier: 100/day, $15/month: 40k/month |
| **Mailgun** | Developer-friendly, excellent deliverability | Less marketing features | Free tier: 5k/month, $35/month: 50k |
| **Resend** | Modern, excellent DX, built for Next.js | Newer (less proven) | Free tier: 3k/month, $20/month: 50k |

**Recommendation:** Resend (modern API, Next.js optimized)

**Answer Needed:**
- [ ] Approve Resend
- [ ] Select alternative (SendGrid or Mailgun)

### Q2.4: Stripe Integration Scope

**Context:** Stripe handles payment processing.

**Question:** Which Stripe features should MVP support?

**Proposed MVP Features:**
- ✅ Payment intents (one-time payments)
- ✅ Customers (client records)
- ✅ Invoices (automated billing)
- ✅ Webhooks (payment status updates)
- ✅ Refunds

**Phase 3.5 Features:**
- Payment schedules (auto-charge on milestones)
- Subscription billing (if offering retainer packages)
- ACH payments (bank transfer, not just credit cards)
- Apple Pay / Google Pay

**Answer Needed:**
- [ ] Approve MVP scope above
- [ ] Move features between MVP and Phase 3.5

---

## 3. Business Rules & Edge Cases

### Q3.1: Payment Schedule Logic

**Context:** Contracts have payment schedules (deposit, milestones, final).

**Question:** What are the EXACT rules for payment schedules?

**Scenarios:**
1. **Default schedule:** 50% deposit, 50% final (on event day? 7 days before? configurable?)
2. **Milestone payments:** When are they due? (e.g., "25% after pre-production meeting")
3. **Overdue payments:** What happens if final payment not received before event?
   - Block event? (harsh)
   - Allow event but withhold deliverables? (reasonable)
   - Continue but send alerts? (lenient)

**Answer Needed:**
- [ ] Default schedule timing (deposit: signing, final: X days before event)
- [ ] Milestone payment rules (when due, what triggers them)
- [ ] Overdue payment policy (block event? withhold deliverables? alert only?)

### Q3.2: Proposal Expiration Logic

**Context:** Proposals have 30-day default validity.

**Question:** What happens when proposal expires?

**Options:**
- A) Hard block submission (proposal link dead)
- B) Allow submission but alert user (soft reminder)
- C) Auto-extend by 15 days (automatically renew)

**Answer Needed:**
- [ ] Select option A, B, or C
- [ ] Specify custom expiration handling

### Q3.3: Contract Counter-Signature Timing

**Context:** Contracts require client signature + vendor counter-signature.

**Question:** When does vendor (you) counter-sign?

**Options:**
- A) Auto-counter-sign immediately when client signs
- B) Manual counter-sign (you review first, then sign)
- C) Auto-counter-sign only if payment received

**Answer Needed:**
- [ ] Select option A, B, or C

### Q3.4: Lead Duplicate Detection

**Context:** Duplicate leads should be detected by email.

**Question:** What happens when duplicate lead detected?

**Options:**
- A) Block creation, show error to user
- B) Allow creation, flag as duplicate (let user decide)
- C) Auto-merge into existing lead, append new notes

**Answer Needed:**
- [ ] Select option A, B, or C

### Q3.5: Orphaned Contract Handling

**Context:** Contract signed + paid but event creation fails.

**Question:** How should orphaned contracts be resolved?

**Current Plan:**
- Daily cron job detects orphaned contracts
- Admin alert sent with list
- Manual event creation required

**Alternative:**
- Retry event creation automatically (3x with exponential backoff)
- Only alert if all retries fail

**Answer Needed:**
- [ ] Approve current plan (daily cron + manual fix)
- [ ] Approve automatic retry plan

---

## 4. UI/UX Decisions

### Q4.1: Proposal Builder Builder UX

**Context:** Drag-and-drop tool to create proposal builders.

**Question:** Which UI pattern for the builder?

**Options:**
| Pattern | Example | Pros | Cons |
|---------|---------|------|------|
| **3-Column Layout** | Webflow, Framer | Professional, clear separation | Complex for beginners |
| **2-Column Layout** | Notion, WordPress | Simpler, less overwhelming | Less room for settings |
| **Modal-Based** | Typeform builder | Clean, focused | More clicks to configure |

**Recommendation:** 3-column (palette → canvas → settings) - matches tactical-10 mockup

**Answer Needed:**
- [ ] Approve 3-column layout
- [ ] Select alternative pattern

### Q4.2: Client Portal Navigation

**Context:** Client portal has 5 pages (proposals, contracts, payments, questionnaire, deliverables).

**Question:** How should client portal navigation work?

**Options:**
- A) Top nav bar (Proposals | Contracts | Payments | Questionnaire | Files)
- B) Side nav (vertical menu)
- C) Dashboard with cards (click into each section)

**Answer Needed:**
- [ ] Select option A, B, or C

### Q4.3: CRM Table vs. Kanban View

**Context:** Lead management needs a primary view.

**Question:** Should CRM have table view, kanban view, or both?

**Options:**
- A) Table only (faster to build, more data-dense)
- B) Kanban only (visual, drag-and-drop status changes)
- C) Both views with toggle (most flexible, more work)

**Mockup shows:** Table view (tactical-13-crm-targeting.html)

**Answer Needed:**
- [ ] Approve table-only view
- [ ] Add kanban view to MVP
- [ ] Add kanban view to Phase 3.5

### Q4.4: Alert Notification Sound

**Context:** Critical alerts (payment disputed, operators not assigned) should be attention-grabbing.

**Question:** Should critical alerts play a notification sound?

**Options:**
- A) Yes, play sound for CRITICAL alerts only
- B) Yes, play sound for CRITICAL + HIGH alerts
- C) No sound, visual-only notifications
- D) User-configurable (let user choose per alert type)

**Answer Needed:**
- [ ] Select option A, B, C, or D

---

## 5. Technical Architecture

### Q5.1: Proposal Config Storage Format

**Context:** Proposal templates store drag-and-drop configurations.

**Question:** How should `proposal_templates.config_json` be structured?

**Proposed Structure:**
```json
{
  "elements": [
    {
      "id": "elem_001",
      "element_type": "hero_section",
      "order": 1,
      "config": {
        "title": "Dance Recital Media Package",
        "subtitle": "Custom proposal for your recital",
        "background_image": "https://..."
      }
    },
    {
      "id": "elem_002",
      "element_type": "pricing_calculator",
      "order": 2,
      "config": {
        "pricing_model": "tiered_quantity",
        "tiers": [
          {"min": 0, "max": 100, "price": 15},
          {"min": 101, "max": 200, "price": 12},
          {"min": 201, "max": 999999, "price": 10}
        ]
      }
    }
  ],
  "theme": {
    "primary_color": "#00bcd4",
    "font_family": "Inter"
  }
}
```

**Answer Needed:**
- [ ] Approve structure above
- [ ] Suggest modifications

### Q5.2: Multi-Tenant Isolation Strategy

**Context:** CommandCentered is multi-tenant SaaS.

**Question:** Which tenant isolation pattern?

**Options:**
| Pattern | Pros | Cons |
|---------|------|------|
| **Row-Level Security (RLS)** | Database-enforced, secure | Complex policies, potential perf impact |
| **Application-level filtering** | Simple, fast | Must remember `tenant_id` everywhere |
| **Separate schemas per tenant** | Full isolation | Migrations harder, connection pooling complex |

**Current spec assumes:** RLS policies on all tables (Phase 2 pattern)

**Answer Needed:**
- [ ] Approve RLS policies
- [ ] Select alternative pattern

### Q5.3: Real-Time Updates Architecture

**Context:** Alerts should appear in real-time without page refresh.

**Question:** Which real-time technology?

**Options:**
| Tech | Pros | Cons |
|------|------|------|
| **Supabase Realtime** | Built-in, PostgreSQL native | Supabase-specific |
| **Pusher** | Mature, easy to use | External service, cost |
| **Socket.io** | Full control, self-hosted | More infrastructure |
| **SSE (Server-Sent Events)** | Simple, HTTP-based | One-way only |

**Recommendation:** Supabase Realtime (already using Supabase)

**Answer Needed:**
- [ ] Approve Supabase Realtime
- [ ] Select alternative

### Q5.4: Stripe Webhook Idempotency

**Context:** Stripe webhooks can be delivered multiple times (network retries).

**Question:** How should we handle duplicate webhook events?

**Proposed Solution:**
```typescript
// Store Stripe event ID in integration_logs table
await db.integration_logs.create({
  data: {
    tenant_id,
    integration_type: 'stripe',
    event_type: 'payment_intent.succeeded',
    stripe_event_id: event.id, // <-- UNIQUE constraint
    // ... other fields
  }
});
// If duplicate, UNIQUE constraint throws error, ignore gracefully
```

**Answer Needed:**
- [ ] Approve solution above
- [ ] Suggest alternative idempotency strategy

### Q5.5: Email Template Management

**Context:** SendGrid/Resend requires email templates (proposal sent, contract sent, etc.).

**Question:** How should email templates be managed?

**Options:**
- A) Store in SendGrid dashboard (external)
- B) Store in database (`email_templates` table)
- C) Store in code (TypeScript files with React Email)

**Answer Needed:**
- [ ] Select option A, B, or C

---

## 6. Deployment & Infrastructure

### Q6.1: Separate Domains for Dual Branding

**Context:** StreamStage (client) vs. CommandCentered (internal).

**Question:** Should these be separate domains or subdomains?

**Options:**
- A) `streamstage.app` + `commandcentered.app` (2 separate domains)
- B) `streamstage.app` + `app.streamstage.app` (subdomain for internal)
- C) `streamstage.app` with different routes (/portal for client, /dashboard for internal)

**Answer Needed:**
- [ ] Select option A, B, or C

### Q6.2: Environment Strategy

**Context:** Need staging environment for testing Phase 3 before production.

**Question:** How many environments?

**Proposed:**
- **Development:** Local (localhost)
- **Staging:** Vercel preview deployment + Supabase staging project
- **Production:** Vercel production + Supabase production project

**Answer Needed:**
- [ ] Approve 3 environments above
- [ ] Add additional environments (e.g., QA)

### Q6.3: Database Migration Strategy

**Context:** Phase 3 adds 18 new tables to existing Phase 2 database.

**Question:** Should Phase 3 tables be added incrementally or all at once?

**Options:**
- A) Single migration (all 18 tables at once)
- B) Feature-based migrations (add tables as features are built)
- C) Parallel development (separate branch, merge when complete)

**Answer Needed:**
- [ ] Select option A, B, or C

---

## 7. Testing & Quality

### Q7.1: E2E Testing Scope

**Context:** E2E tests ensure critical workflows work end-to-end.

**Question:** Which workflows need E2E tests for Phase 3 MVP?

**Proposed Critical Workflows:**
1. Lead capture → Proposal sent → Email tracking
2. Proposal submission → Contract generation
3. Contract signing → Payment → Event creation (Suite 1 → Suite 2 handoff)
4. Stripe webhook → Payment status update

**Answer Needed:**
- [ ] Approve workflows above
- [ ] Add additional workflows
- [ ] Remove workflows

### Q7.2: Stripe Testing Strategy

**Context:** Stripe has test mode with test credit cards.

**Question:** How should Stripe testing be structured?

**Options:**
- A) Separate Stripe test account for staging
- B) Use Stripe test mode in same account
- C) Mock Stripe webhooks (no real Stripe in staging)

**Answer Needed:**
- [ ] Select option A, B, or C

---

## 8. Data & Analytics

### Q8.1: Lead Source Tracking

**Context:** Track where leads come from (website, referral, social media, etc.).

**Question:** Which lead sources should be tracked?

**Proposed:**
- Website form
- Referral (existing client)
- Repeat client
- Social media (Instagram, Facebook, TikTok)
- Google search
- Email campaign
- Other

**Answer Needed:**
- [ ] Approve list above
- [ ] Add additional sources

### Q8.2: Analytics Dashboard

**Context:** User needs visibility into sales pipeline metrics.

**Question:** Should Phase 3 include an analytics dashboard?

**Metrics:**
- Lead conversion rate (lead → won)
- Avg. time to conversion (days)
- Pipeline value (total $ of active proposals)
- Revenue by service type
- Monthly recurring revenue (MRR) projection

**Options:**
- A) Yes, include analytics dashboard in MVP
- B) Yes, but Phase 3.5
- C) No, defer to Phase 4+

**Answer Needed:**
- [ ] Select option A, B, or C

---

## 9. Security & Compliance

### Q9.1: PCI Compliance Verification

**Context:** Stripe handles payments, but we must ensure PCI compliance.

**Question:** Do we need formal PCI compliance audit?

**Current Plan:**
- Use Stripe.js for card input (never touch card data)
- Never log card numbers
- HTTPS enforced everywhere
- No card data in database

**Answer Needed:**
- [ ] Current plan sufficient (Stripe handles PCI)
- [ ] Need formal PCI compliance audit

### Q9.2: GDPR Compliance

**Context:** Storing client data (emails, names, phone numbers).

**Question:** Which GDPR features needed for MVP?

**Proposed:**
- Data export (client can download their data)
- Data deletion (soft delete, not hard delete)
- Privacy policy + terms of service
- Cookie consent banner (if using analytics)

**Answer Needed:**
- [ ] Approve features above
- [ ] Add additional GDPR features
- [ ] GDPR not needed (US/Canada only, no EU customers)

---

## 10. Launch & Marketing

### Q10.1: Beta Testing Strategy

**Context:** Phase 3 is new suite, needs real-world testing.

**Question:** Should we run a beta program before public launch?

**Options:**
- A) Internal beta only (test with own leads)
- B) Closed beta (5-10 invited users)
- C) Public beta (open signup, marked as "beta")

**Answer Needed:**
- [ ] Select option A, B, or C
- [ ] If B, how many beta users?

### Q10.2: Pricing Strategy

**Context:** CommandCentered needs pricing tiers.

**Question:** What should Phase 3 pricing be?

**Proposed (from HoneyBook comparison):**
- **Solo:** $29/month (1 tenant, unlimited leads/projects, no logistics)
- **Studio:** $79/month (includes Phase 2 logistics, gear tracking)
- **Enterprise:** Custom (white-label, multi-brand)

**Answer Needed:**
- [ ] Approve pricing above
- [ ] Adjust pricing tiers

### Q10.3: Launch Timeline

**Context:** Current target is Phase 2 Feb 2025, Phase 3 Apr 2025.

**Question:** Should Phase 3 MVP launch be:

**Options:**
- A) April 2025 (as planned)
- B) March 2025 (earlier, for March-April event bookings)
- C) May 2025 (later, more polish time)

**Answer Needed:**
- [ ] Select option A, B, or C

---

## Summary

**Total Questions:** 33 across 10 categories

**Priority Questions (answer before implementation):**
1. Q1.1: MVP Feature Set
2. Q2.1: E-Signature Service Choice
3. Q2.3: Email Service Choice
4. Q3.1: Payment Schedule Logic
5. Q6.1: Separate Domains for Dual Branding

**Medium Priority (answer during implementation):**
- All Section 4 (UI/UX Decisions)
- Q3.3, Q3.4, Q3.5 (Edge cases)
- Q5.1, Q5.3 (Technical architecture)

**Low Priority (can defer):**
- Q8.2: Analytics Dashboard
- Q10.1: Beta Testing Strategy
- Q10.2: Pricing Strategy

---

**Next Steps:**
1. Review all questions
2. Provide answers in separate document or inline
3. Update spec documents with answers
4. Begin Phase 3 implementation

---

*Phase 3 Final Questions compiled. Ready for user review.*
