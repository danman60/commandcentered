# Phase 3 Implementation Questions - REVISED
# CommandCentered Phase 3 - Client Management & Sales Pipeline

**Project:** CommandCentered Phase 3
**Created:** 2025-01-08
**Status:** Ready for User Review
**Purpose:** Critical decision points before Sprint 1

---

## How to Use This Document

This document contains **35 questions** organized by urgency and domain. Answer questions in order of priority:

1. **CRITICAL** (Q1-Q8) - Must answer before Sprint 1 starts
2. **HIGH** (Q9-Q18) - Should answer during Sprint 1-2
3. **MEDIUM** (Q19-Q28) - Can answer during implementation
4. **LOW** (Q29-35) - Defer to Phase 3.5 or later

For each question, pick the recommended option or specify custom behavior.

---

## CRITICAL PRIORITY - Answer Before Sprint 1

### Q1: Payment Schedule Default Rules

**Context:** Contracts have deposit + final payment. Need exact timing rules.

**Question:** What are the default payment schedule rules?

**Options:**

**A) Simple 50/50 Split (Recommended for MVP)**
- Deposit: 50% due immediately upon contract signing
- Final: 50% due on event day (or 0 days before event)
- Pros: Simple, predictable, easy to understand
- Cons: Final payment risk (client might not pay before event)

**B) Conservative 50/50 with Buffer**
- Deposit: 50% due immediately upon contract signing
- Final: 50% due 7 days before event
- Pros: Ensures payment before crew shows up
- Cons: Requires follow-up if client misses deadline

**C) Progressive Payment (3 milestones)**
- Deposit: 30% due immediately upon contract signing
- Milestone: 40% due 14 days before event
- Final: 30% due 3 days before event
- Pros: Spreads risk, easier for clients
- Cons: More complex, more invoicing work

**D) Custom Rules Per Service Type**
- Dance Recitals: 50% signing, 50% day-of
- Corporate: 30% signing, 30% pre-production, 40% day-of
- Concerts: 100% upfront (high cancellation risk)
- Pros: Optimized per service
- Cons: Complex configuration

**Your Answer:** _________________

**Follow-up:** If final payment is not received by due date, what happens?
- [ ] Block event creation (no payment = no event)
- [ ] Allow event but send CRITICAL alert
- [ ] Auto-cancel event 24h before if unpaid
- [ ] Manual decision (Commander decides)

---

### Q2: E-Signature Service Selection

**Context:** Contracts need e-signature integration. Three viable options.

**Question:** Which e-signature service should we integrate?

**Comparison:**

| Feature | SignWell | DocuSign | HelloSign |
|---------|----------|----------|-----------|
| **Monthly Cost** | $8/month | $25-40/month | $15-25/month |
| **API Quality** | Modern, simple | Enterprise, complex | Good, Dropbox-backed |
| **Brand Recognition** | Low | Very high | Medium |
| **Ease of Integration** | Very easy | Moderate | Easy |
| **Audit Trail** | Yes | Yes (certified) | Yes |
| **Mobile Signing** | Yes | Yes | Yes |
| **Template Management** | Yes | Yes | Yes |

**Recommendation:** SignWell (cheapest, easiest integration, sufficient for MVP)

**Your Answer:**
- [ ] SignWell ($8/month) ← Recommended
- [ ] DocuSign ($25-40/month)
- [ ] HelloSign ($15-25/month)
- [ ] Other: _________________

**Follow-up:** Do you need legal compliance certification (ESIGN Act, UETA)?
- [ ] No, basic e-signature is fine (SignWell OK)
- [ ] Yes, need certified audit trail (DocuSign preferred)

---

### Q3: Email Service Selection

**Context:** Need email service for proposal/contract sending + tracking.

**Question:** Which email service should we integrate?

**Comparison:**

| Feature | Resend | SendGrid | Mailgun |
|---------|--------|----------|---------|
| **Monthly Cost** | Free: 3k/mo, $20: 50k/mo | Free: 100/day, $15: 40k/mo | Free: 5k/mo, $35: 50k/mo |
| **Next.js Integration** | Excellent (built for it) | Good | Good |
| **API Simplicity** | Very simple | Moderate | Moderate |
| **Tracking (opens/clicks)** | Yes | Yes (excellent) | Yes |
| **Template Management** | Yes | Yes (dynamic) | Yes |
| **Deliverability** | Excellent | Excellent | Excellent |

**Recommendation:** Resend (modern, Next.js-native, best DX, free tier sufficient)

**Your Answer:**
- [ ] Resend ← Recommended
- [ ] SendGrid
- [ ] Mailgun
- [ ] Other: _________________

---

### Q4: Proposal Expiration Handling

**Context:** Proposals have 30-day validity. Need to decide what happens when expired.

**Question:** When a proposal link expires, what should happen?

**Options:**

**A) Hard Block (Secure)**
- Proposal link shows "This proposal has expired"
- Client cannot submit
- Must contact you for new proposal
- Pros: Clean, prevents stale submissions
- Cons: Client friction if they were about to submit

**B) Soft Warning (Lenient)**
- Proposal still works, but shows warning banner
- "This proposal expired on [date]. Please contact us to confirm pricing."
- Client can still submit
- Pros: Don't lose interested clients
- Cons: Might accept outdated pricing

**C) Auto-Extend (Forgiving)**
- When client opens expired proposal, auto-extend by 15 days
- No disruption to client experience
- Pros: Zero client friction
- Cons: Proposals never truly expire

**D) Manual Approval (Control)**
- Expired proposals still submittable
- Submission creates alert: "Expired proposal submitted - approve?"
- Commander can accept/reject manually
- Pros: Total control
- Cons: Extra work per submission

**Recommendation:** Option B (Soft Warning) - Good balance of flexibility + awareness

**Your Answer:** _________________

---

### Q5: Duplicate Lead Handling

**Context:** Lead submits inquiry form, but email already exists in database.

**Question:** How should duplicate leads be handled?

**Options:**

**A) Block + Notify (Strict)**
- Show error: "You've already submitted an inquiry. We'll be in touch soon!"
- Don't create duplicate lead
- Update existing lead's `last_contacted_at`
- Pros: Clean database, no duplicates
- Cons: Client might think submission failed

**B) Allow + Flag (Tracking)**
- Create new lead anyway
- Flag as duplicate: `is_duplicate = true`
- Link to original: `original_lead_id`
- Append notes to original
- Pros: Track multiple inquiry attempts, shows interest
- Cons: Duplicate data

**C) Merge + Update (Smart)**
- Don't create new lead
- Update existing lead:
  - Append new message to notes
  - Update `last_contacted_at`
  - Bump status to 'new' if was 'lost'
- Send alert: "Lead re-inquired: [Name]"
- Pros: Clean database + tracks re-engagement
- Cons: Lose some context (separate inquiries not tracked)

**Recommendation:** Option C (Merge + Update) - Best data hygiene + re-engagement tracking

**Your Answer:** _________________

---

### Q6: Contract Counter-Signature Timing

**Context:** Contracts require client signature + vendor counter-signature.

**Question:** When should you (vendor) counter-sign the contract?

**Options:**

**A) Auto-Counter-Sign Immediately**
- When client signs, system auto-countersigns as you
- Contract fully executed instantly
- Pros: Zero friction, instant execution
- Cons: No review before commitment

**B) Manual Counter-Sign (Review First)**
- Client signs → Contract status = 'pending_counter_signature'
- You review, then manually click "Counter-Sign"
- Pros: Final review before legal commitment
- Cons: Adds step, delay before contract executed

**C) Auto-Counter-Sign After Payment**
- Client signs → Contract status = 'signed_awaiting_payment'
- First payment received → Auto-countersign
- Pros: Only commit after money received
- Cons: Legally questionable (contract not executed until paid?)

**D) Hybrid: Auto-Countersign for Deposits <$X, Manual for >$X**
- Small contracts (<$2000): Auto-countersign
- Large contracts (>$2000): Manual review
- Pros: Efficiency for small deals, control for big ones
- Cons: Complex logic

**Recommendation:** Option A (Auto-Counter-Sign) for MVP - You're sending the contract, approval is implicit

**Your Answer:** _________________

---

### Q7: Suite 1 ↔ Suite 2 Handoff Trigger

**Context:** Contract signed + paid → Create event in logistics system. Need precise trigger.

**Question:** What EXACT conditions must be met before auto-creating event?

**Current Spec:** Contract status = 'signed' AND first payment status = 'completed'

**Clarifications Needed:**

**A) Payment Timing**
- [ ] First payment = deposit (could be 30%, 50%, any %)
- [ ] First payment = specific milestone named "Deposit"
- [ ] ANY payment received (even if partial)

**B) Contract Status**
- [ ] Contract must be 'signed' by client only
- [ ] Contract must be counter-signed by vendor too
- [ ] Contract must be 'signed' + counter-signed + at least 24h old (cooling-off period)

**C) Orphaned Contract Handling**
If event creation fails (Google Drive error, database timeout, etc.):
- [ ] Daily cron job finds orphaned contracts, sends report
- [ ] Automatic retry (3x with exponential backoff)
- [ ] Manual event creation button in admin panel
- [ ] All of the above

**Recommendation:** First payment = ANY payment received, Contract = 'signed' (don't wait for counter-sign), Automatic retry 3x + daily cron

**Your Answers:**
- Payment Timing: _________________
- Contract Status: _________________
- Orphaned Handling: _________________

---

### Q8: Domain Strategy for Dual Branding

**Context:** StreamStage (client-facing) + CommandCentered (internal) need separate aesthetics.

**Question:** How should the two brands be separated?

**Options:**

**A) Two Separate Domains (Recommended)**
- `streamstage.app` - Client portal (proposals, contracts, payments)
- `commandcentered.app` - Internal ops (CRM, scheduling, logistics)
- Pros: True brand separation, independent deployment
- Cons: Two domains to buy (~$24/year), two SSL certs

**B) Subdomain for Internal**
- `streamstage.app` - Client portal
- `app.streamstage.app` - Internal ops
- Pros: Single domain, clear hierarchy
- Cons: Internal ops still under "streamstage" domain

**C) Single Domain with Routes**
- `streamstage.app/portal/*` - Client portal
- `streamstage.app/dashboard/*` - Internal ops
- Pros: Single domain, simplest
- Cons: URL leakage (clients see /dashboard exists)

**D) Subdomain for Client Portal**
- `commandcentered.app` - Internal ops (primary brand)
- `portal.commandcentered.app` - Client portal
- Pros: CommandCentered is primary brand
- Cons: Clients see "commandcentered" (might not match business name)

**Recommendation:** Option A (Two Domains) - Cleanest separation, worth $24/year

**Your Answer:** _________________

**Follow-up:** If two domains, which is the primary business brand?
- [ ] StreamStage (public-facing business name)
- [ ] CommandCentered (internal tool name)
- [ ] They're equal (different brands for different audiences)

---

## HIGH PRIORITY - Answer During Sprint 1-2

### Q9: Google Drive Integration Scope

**Context:** Auto-create project folders when contract signed.

**Question:** Should Google Drive integration be in MVP or Phase 3.5?

**MVP (Sprint 5):**
- [ ] Yes, auto-folder creation is critical for handoff
- Justification: Immediate value, workflow improvement

**Phase 3.5 (Later):**
- [ ] No, defer to post-MVP enhancements
- Justification: Manual folder creation works for MVP

**Your Answer:** _________________

**If YES to MVP, follow-up questions:**

1. **Folder Sharing Permissions:**
   - [ ] Client gets view-only access (can't edit/upload)
   - [ ] Client gets edit access (can upload files)
   - [ ] Client gets comment-only access

2. **Parent Folder:**
   - [ ] Create in tenant's Google Drive root
   - [ ] Create under specific parent folder (you specify folder ID)
   - [ ] Ask tenant to specify parent folder in settings

3. **Failure Handling:**
   - [ ] Block event creation if folder creation fails (HARD BLOCK)
   - [ ] Create event anyway, send alert to create folder manually (RECOMMENDED)
   - [ ] Retry 3x, then fail gracefully

---

### Q10: Client Questionnaire Scope

**Context:** Post-contract questionnaire gathers event details (timeline, VIPs, special requests).

**Question:** Should client questionnaires be in MVP or Phase 3.5?

**MVP (Sprint 5):**
- [ ] Yes, critical for event planning
- Justification: Replaces back-and-forth emails

**Phase 3.5 (Later):**
- [ ] No, defer to post-MVP
- Justification: Can use Google Forms for MVP

**Your Answer:** _________________

**If YES to MVP, follow-up questions:**

1. **Questionnaire Trigger:**
   - [ ] Auto-send when contract signed
   - [ ] Auto-send when first payment received
   - [ ] Manual send (Commander clicks "Send Questionnaire")

2. **Incomplete Questionnaire Handling:**
   - [ ] Block event start if incomplete
   - [ ] Send reminders (3 days, 1 day before event)
   - [ ] Alert only, don't block

3. **Question Templates:**
   How many pre-built questionnaire templates do you need?
   - [ ] 1 generic template (all service types)
   - [ ] 5 templates (one per service type: Recital, Event, Corporate, Concert, Promo)
   - [ ] Start with 1, add more later

---

### Q11: Stripe Payment Features for MVP

**Context:** Stripe integration has many features. Need to scope MVP.

**Question:** Which Stripe features are MUST-HAVE for MVP?

**Check all that apply:**

MVP Features:
- [ ] Payment Intents (one-time payments) ← REQUIRED
- [ ] Customers (client records) ← REQUIRED
- [ ] Invoices (automated billing) ← REQUIRED
- [ ] Webhooks (payment status updates) ← REQUIRED
- [ ] Refunds (cancellation handling)
- [ ] Payment Schedules (auto-charge milestones)
- [ ] ACH payments (bank transfer, not just cards)
- [ ] Apple Pay / Google Pay
- [ ] Subscription billing (retainer packages)

**Recommendation:** First 5 checkboxes (Intents, Customers, Invoices, Webhooks, Refunds) are MVP. Rest are Phase 3.5.

**Your Selections:** _________________

---

### Q12: Proposal Builder Builder UX Pattern

**Context:** Admin creates proposal builders via drag-and-drop interface.

**Question:** Which UI pattern for the Proposal Builder Builder?

**Options:**

**A) 3-Column Layout (Webflow-style)**
```
┌──────────┬────────────────┬──────────┐
│ Elements │ Canvas Preview │ Settings │
│ Palette  │                │ Panel    │
└──────────┴────────────────┴──────────┘
```
- Pros: Professional, all controls visible
- Cons: Complex for beginners

**B) 2-Column Layout (Simpler)**
```
┌──────────┬────────────────┐
│ Elements │ Canvas Preview │
│ Palette  │ + Settings     │
└──────────┴────────────────┘
```
- Selected element shows settings inline
- Pros: Simpler, less overwhelming
- Cons: Settings hidden when not selected

**C) Modal-Based (Typeform-style)**
```
┌────────────────────────────┐
│ Canvas Preview             │
│ Click element → Modal pops │
└────────────────────────────┘
```
- Pros: Clean, focused
- Cons: More clicks to configure

**Recommendation:** Option A (3-Column) - Matches tactical-10 mockup, professional workflow

**Your Answer:** _________________

---

### Q13: CRM Organization View

**Context:** CRM table shows leads/prospects. Need to decide primary view.

**Question:** Should CRM have table view, kanban board, or both?

**Options:**

**A) Table View Only (Faster to Build)**
- Rows = leads, Columns = fields
- Sort/filter by status, service type, date
- Bulk actions (select rows, apply action)
- Pros: Fast to build, data-dense
- Cons: Less visual, no drag-and-drop status changes

**B) Kanban Board Only (Visual)**
- Columns = statuses (New, Contacted, Proposal Sent, Won, Lost)
- Cards = leads, drag to change status
- Pros: Visual pipeline, intuitive
- Cons: Harder to see all data at once

**C) Both with Toggle (Flexible)**
- Toggle between Table and Kanban
- Same data, different views
- Pros: Best of both worlds
- Cons: More development work

**Recommendation:** Option A (Table Only) for MVP, add Kanban in Phase 3.5

**Your Answer:** _________________

---

### Q14: Alert Notification Sounds

**Context:** Critical alerts should grab attention. Need to decide on sound notifications.

**Question:** Should critical alerts play notification sounds?

**Options:**

**A) Sound for CRITICAL Alerts Only**
- CRITICAL alerts (payment disputed, no operators assigned) = sound
- All others = silent
- Pros: Attention-grabbing for emergencies
- Cons: Might be annoying if many criticals

**B) Sound for CRITICAL + HIGH Alerts**
- CRITICAL + HIGH alerts = sound
- MEDIUM + LOW = silent
- Pros: More comprehensive notifications
- Cons: More interruptions

**C) No Sounds (Visual Only)**
- All alerts silent, badge count + panel only
- Pros: Less intrusive, professional
- Cons: Might miss urgent alerts

**D) User-Configurable (Recommended)**
- Global setting: Enable/disable alert sounds
- Per-alert-type setting: Sound on/off
- Pros: User control, accessibility
- Cons: More settings to manage

**Recommendation:** Option D (User-Configurable) with defaults: CRITICAL = sound ON, all others OFF

**Your Answer:** _________________

---

### Q15: Lead Source Tracking

**Context:** Track where leads come from for marketing analysis.

**Question:** Which lead sources should be tracked?

**Proposed List:**
- [ ] Website Form
- [ ] Referral (Existing Client)
- [ ] Repeat Client
- [ ] Instagram
- [ ] Facebook
- [ ] TikTok
- [ ] Google Search (Organic)
- [ ] Google Ads
- [ ] Email Campaign
- [ ] Trade Show / Event
- [ ] Cold Outreach
- [ ] Other (Free Text)

**Check all that apply, or add your own:**

Your Sources: _________________

---

### Q16: Email Template Management

**Context:** Proposal/contract emails need templates (subject, body, styling).

**Question:** How should email templates be managed?

**Options:**

**A) Stored in Code (TypeScript + React Email)**
```typescript
const ProposalSentEmail = ({ client_name, proposal_url }) => (
  <Email>
    <Text>Hi {client_name},</Text>
    <Button href={proposal_url}>View Proposal</Button>
  </Email>
);
```
- Pros: Version controlled, type-safe, preview in dev
- Cons: Requires deploy to change template

**B) Stored in Database (WYSIWYG Editor)**
- Templates table: `email_templates(subject, body_html, variables)`
- Edit templates in admin panel
- Pros: No deploy needed, non-technical edits
- Cons: No version control, harder to preview

**C) Stored in SendGrid/Resend Dashboard (External)**
- Create templates in email service UI
- Reference by template ID in code
- Pros: Robust editor, built-in preview
- Cons: External dependency, harder to track changes

**Recommendation:** Option A (Code) for MVP - Better DX, type-safe, version controlled. Move to B or C later if needed.

**Your Answer:** _________________

---

### Q17: Pre-Built Proposal Templates

**Context:** Proposal Builder Builder is a meta-tool, but need starter templates.

**Question:** How many pre-built proposal templates should ship with MVP?

**Options:**

**A) Zero (Build from Scratch)**
- Tenant starts with blank slate
- Builds first template via Builder
- Pros: Forces learning, custom from start
- Cons: High activation barrier

**B) One Generic Template**
- "Videography Services" template
- Works for all service types
- Tenant customizes from there
- Pros: Quick start, example to learn from
- Cons: Might not fit specific needs

**C) Five Service-Specific Templates (Recommended)**
- Dance Recital Media
- Event Videography
- Corporate Video Production
- Concert Coverage
- Dance Promo Videos
- Pros: Tailored, professional, ready to use
- Cons: More upfront work

**D) One Template + Clone Feature**
- Ship 1 template
- Add "Duplicate Template" button
- Tenant clones and modifies
- Pros: Balance of guidance + flexibility
- Cons: Still requires customization

**Recommendation:** Option C (Five Templates) - Best onboarding, matches your service types

**Your Answer:** _________________

---

### Q18: Analytics Dashboard Scope

**Context:** User needs visibility into sales pipeline metrics.

**Question:** Should analytics dashboard be in MVP or Phase 3.5+?

**Proposed Metrics:**
- Lead conversion rate (lead → won)
- Avg. time to conversion (days)
- Pipeline value (total $ of active proposals)
- Revenue by service type
- Monthly recurring revenue (MRR) projection
- Proposal view rate (sent → viewed)
- Contract signature rate (sent → signed)

**Options:**

**A) MVP (Sprint 6 - Polish)**
- Include basic dashboard with 3-5 key metrics
- Pros: Immediate business intelligence
- Cons: More scope for MVP

**B) Phase 3.5 (Post-MVP)**
- Defer to enhancements phase
- Focus MVP on workflow completion
- Pros: Faster MVP launch
- Cons: No early insights

**C) Phase 4+ (Later)**
- Build after both Suite 1 + Suite 2 operational
- Comprehensive cross-suite analytics
- Pros: More complete picture
- Cons: Long wait for insights

**Recommendation:** Option B (Phase 3.5) - MVP focus on workflow, analytics come after validation

**Your Answer:** _________________

---

## MEDIUM PRIORITY - Answer During Implementation

### Q19: Proposal Preview vs. Submission Fields

**Context:** Proposal Builder has many fields. Some for admin reference, some for client submission.

**Question:** When client views proposal, which fields should be visible vs. hidden?

**Example Scenario:**
Admin creates proposal with these elements:
- Internal note: "This client haggles, stick to $15/dancer minimum"
- Hero section: "Dance Recital Media Package"
- Pricing calculator: Dancer count → Tiered pricing
- Service toggles: Video, Photo, Drone
- Internal cost estimate: "$1200 cost, $2500 price, $1300 profit"

**Which should client see?**
- [ ] Hero section ← Definitely YES
- [ ] Pricing calculator ← Definitely YES
- [ ] Service toggles ← Definitely YES
- [ ] Internal note ← Definitely NO
- [ ] Internal cost estimate ← Definitely NO

**But what about:**
- [ ] Admin contact info (your email/phone)
- [ ] Proposal validity date ("Expires in 30 days")
- [ ] Payment schedule preview ("50% deposit, 50% on event day")
- [ ] FAQ section
- [ ] Testimonials

**Your Guidance:**
Should we have a "Visibility" toggle per element type?
- [ ] Yes, every element has "Show to Client" checkbox
- [ ] No, element types are inherently visible or hidden
  - If No, which types are always hidden?

**Recommendation:** Element types are inherently visible/hidden. "Internal Note" element type is always hidden, everything else visible.

**Your Answer:** _________________

---

### Q20: Proposal Submission Required Fields

**Context:** Client fills proposal form. Need validation rules.

**Question:** Which fields should be required vs. optional?

**Typical Proposal Form:**
- [ ] Organization Name - Required or Optional?
- [ ] Contact Name - Required or Optional?
- [ ] Email Address - ← ALWAYS REQUIRED
- [ ] Phone Number - Required or Optional?
- [ ] Event Date - Required or Optional?
- [ ] Event Venue Name - Required or Optional?
- [ ] Event Venue Address - Required or Optional?
- [ ] Service Selections (toggles) - Required or Optional?
- [ ] Quantities (dancer count, etc.) - Required or Optional?
- [ ] Special Requests (text area) - Required or Optional?

**Your Guidance:**
List which fields above should be REQUIRED: _________________

**OR:**
- [ ] Use smart defaults (email required, everything else optional)
- [ ] Let admin configure required fields per template (Builder has "Required" checkbox)

**Recommendation:** Smart defaults (email + service selections + quantities required), admin can make others required via Builder

**Your Answer:** _________________

---

### Q21: Contract Template Customization

**Context:** Contracts auto-generate from proposals. Need base contract text.

**Question:** How should contract templates be managed?

**Options:**

**A) Single Global Template**
- One contract template for all service types
- Merge fields: {{client_name}}, {{total_amount}}, etc.
- Pros: Simplest, one template to maintain
- Cons: Might not fit all services

**B) Per-Service-Type Templates**
- Separate contract for Recital, Corporate, Concert, etc.
- Customized terms per service
- Pros: Tailored, professional
- Cons: More templates to maintain

**C) Modular Sections (Combine Clauses)**
- Base contract + optional sections
- E.g., "Drone Liability" section added if drone service selected
- Pros: Flexible, DRY
- Cons: Complex to build

**Recommendation:** Option A (Single Global) for MVP, split later if needed

**Your Answer:** _________________

**Follow-up:** Who writes the initial contract template text?
- [ ] You provide, I include in seed data
- [ ] Use generic placeholder, you edit in admin panel later
- [ ] Pull from existing contract you have (attach file)

---

### Q22: JSONB Structure for Proposal Configs

**Context:** Proposal templates stored as JSONB. Need to validate structure.

**Proposed Structure (from PHASE3_DATABASE_SCHEMA.md):**
```json
{
  "branding": {
    "primaryColor": "#00bcd4",
    "logo": "https://..."
  },
  "elements": [
    {
      "id": "hero-1",
      "type": "hero",
      "position": 0,
      "config": { "title": "...", "description": "..." }
    },
    {
      "id": "dancer-count-1",
      "type": "number_input",
      "position": 1,
      "config": { "label": "Number of Dancers", "min": 0, "max": 999 }
    }
  ],
  "pricing": {
    "baseCurrency": "CAD",
    "rules": [
      { "type": "tiered", "field": "dancer-count-1", "tiers": [...] }
    ]
  }
}
```

**Question:** Does this structure make sense? Any changes needed?

**Your Feedback:**
- [ ] Looks good, no changes
- [ ] Needs changes (specify): _________________

---

### Q23: Multi-Tenant Isolation Strategy

**Context:** CommandCentered is multi-tenant SaaS. Need database isolation.

**Question:** Confirm tenant isolation pattern.

**Current Plan:** Row-Level Security (RLS) policies on all tables

**Implementation:**
```sql
CREATE POLICY tenant_isolation ON leads
FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

**Alternative Patterns:**
- Application-level filtering (add `WHERE tenant_id = ?` to all queries)
- Separate schemas per tenant (schema = namespace per tenant)

**Is RLS acceptable?**
- [ ] Yes, RLS is fine (database-enforced security)
- [ ] No, prefer application-level filtering (more control)
- [ ] No, prefer separate schemas (full isolation)

**Your Answer:** _________________

---

### Q24: Real-Time Alerts Technology

**Context:** Alerts should appear without page refresh.

**Question:** Which real-time technology for alerts?

**Options:**

**A) Supabase Realtime (Recommended)**
- Built-in to Supabase
- WebSocket-based
- Subscribe to `alerts` table changes
- Pros: Already using Supabase, no extra service
- Cons: Tied to Supabase

**B) Pusher**
- External WebSocket service
- Well-documented, mature
- Pros: Reliable, good DX
- Cons: Extra $10-50/month, external dependency

**C) Socket.io**
- Self-hosted WebSocket server
- Full control
- Pros: No recurring cost
- Cons: More infrastructure, maintenance

**D) Server-Sent Events (SSE)**
- HTTP-based, one-way
- Simpler than WebSockets
- Pros: Easier to implement
- Cons: One-way only (server → client)

**Recommendation:** Option A (Supabase Realtime) - Already paying for it, native integration

**Your Answer:** _________________

---

### Q25: Stripe Webhook Idempotency

**Context:** Stripe webhooks can be delivered multiple times. Need duplicate detection.

**Proposed Solution:**
```typescript
await db.integration_logs.create({
  data: {
    stripe_event_id: event.id, // UNIQUE constraint
    // ... other fields
  }
});
// If duplicate, UNIQUE constraint throws error, ignore gracefully
```

**Question:** Is this idempotency strategy acceptable?

**Alternative Strategies:**
- Check if event.id exists before processing
- Use Stripe idempotency keys for API calls
- Combination of both

**Your Answer:**
- [ ] Proposed solution is fine
- [ ] Use alternative: _________________

---

### Q26: Lead Assignment Strategy

**Context:** New leads should be assigned to a user for follow-up.

**Question:** How should leads be auto-assigned?

**Options:**

**A) Round-Robin**
- Cycle through active admins
- Lead 1 → User A, Lead 2 → User B, Lead 3 → User A
- Pros: Even distribution
- Cons: Ignores workload, skill

**B) Load-Based**
- Assign to user with fewest active leads
- Balances workload
- Pros: Fair distribution
- Cons: More complex query

**C) Manual Assignment Only**
- All leads start unassigned
- Admin manually assigns
- Pros: Full control
- Cons: Requires manual work

**D) Single Default User (Solopreneur)**
- Always assign to tenant owner
- Pros: Simplest (you're the only user)
- Cons: Not scalable if you hire

**Recommendation:** Option D (Single Default) for MVP - You're the only user. Upgrade to B (Load-Based) later.

**Your Answer:** _________________

---

### Q27: Client Portal Authentication

**Context:** Clients need to log in to view proposals, contracts, payments.

**Question:** How should clients authenticate?

**Options:**

**A) Magic Link (Email-Based, No Password)**
- Client enters email → Receives login link
- Click link → Logged in
- Pros: No password to remember, secure, modern
- Cons: Requires email access

**B) Email + Password (Traditional)**
- Client creates account with password
- Standard login form
- Pros: Familiar, works offline
- Cons: Password management, security risk

**C) OAuth (Google, Facebook, Apple)**
- "Sign in with Google"
- Pros: No password, convenient
- Cons: Requires social account

**D) Hybrid (Magic Link + Password Optional)**
- Default to magic link
- Allow password creation if client prefers
- Pros: Best of both
- Cons: More complex

**Recommendation:** Option A (Magic Link) for MVP - Simplest, most secure, best UX

**Your Answer:** _________________

---

### Q28: Overdue Payment Policy

**Context:** Client misses payment deadline (e.g., final payment due 7 days before event, but not received).

**Question:** What should happen when payment is overdue?

**Options:**

**A) Alert Only (Lenient)**
- Send alert to Commander
- Send reminder email to client
- Allow event to proceed
- Pros: Maintains relationship, flexible
- Cons: Risk of non-payment

**B) Withhold Deliverables (Conditional)**
- Event proceeds as scheduled
- Deliverables not released until payment received
- Pros: Leverage, incentive to pay
- Cons: Client frustration

**C) Cancel Event (Strict)**
- Auto-cancel event if final payment not received 48h before
- Crew assignments cancelled
- Alert client
- Pros: Protects you from working for free
- Cons: Harsh, might lose client

**D) Manual Decision (Flexible)**
- Alert Commander: "Payment overdue - proceed with event?"
- Commander decides case-by-case
- Pros: Contextual decisions
- Cons: Requires manual intervention

**Recommendation:** Option D (Manual Decision) for MVP - Gives you control, can automate later based on patterns

**Your Answer:** _________________

---

## LOW PRIORITY - Defer to Phase 3.5 or Later

### Q29: Beta Testing Strategy

**Context:** Phase 3 is new suite, needs real-world testing.

**Question:** Should we run a beta program before public launch?

**Options:**

**A) Internal Beta Only (Use for Own Leads)**
- Test with your real leads
- No external users
- Pros: Full control, real data
- Cons: Limited feedback

**B) Closed Beta (5-10 Invited Users)**
- Invite videographer friends/colleagues
- Controlled group
- Pros: Real feedback, diverse use cases
- Cons: Requires support, onboarding

**C) Public Beta (Open Signup, "Beta" Badge)**
- Anyone can sign up
- Mark as beta in UI
- Pros: Wide feedback, market validation
- Cons: Support burden, reputation risk

**Recommendation:** Option A (Internal Beta) for MVP - Use it yourself first, invite others in Phase 3.5

**Your Answer:** _________________

**If B or C, how many beta users?** _________________

---

### Q30: Pricing Strategy

**Context:** CommandCentered needs pricing tiers for public launch.

**Question:** What should pricing be?

**Proposed (from HoneyBook comparison):**
- **Solo:** $29/month (1 tenant, unlimited leads/projects, Suite 1 only)
- **Studio:** $79/month (Suite 1 + Suite 2 logistics, gear tracking)
- **Enterprise:** Custom (white-label, multi-brand)

**Your Feedback:**
- [ ] Pricing looks good
- [ ] Too expensive, should be: _________________
- [ ] Too cheap, should be: _________________
- [ ] Different tier structure: _________________

**Note:** This is for public launch, not MVP. Defer to Phase 3.5+.

---

### Q31: Deployment Environment Strategy

**Context:** Need staging environment for testing before production.

**Proposed Environments:**
- **Development:** Local (localhost)
- **Staging:** Vercel preview deployment + Supabase staging project
- **Production:** Vercel production + Supabase production project

**Question:** Is 3 environments sufficient, or need more?

**Your Answer:**
- [ ] 3 environments is fine
- [ ] Add QA environment (4 total)
- [ ] Add Demo environment (show to prospects)
- [ ] Other: _________________

---

### Q32: Database Migration Strategy

**Context:** Phase 3 adds 18 new tables. Need migration approach.

**Question:** Should Phase 3 tables be added all at once or incrementally?

**Options:**

**A) Single Migration (All 18 Tables at Once)**
- One big migration: `20250115_phase3_schema.sql`
- Pros: Clean, atomic
- Cons: Big change, harder to debug

**B) Feature-Based Migrations (7 migrations)**
- Sprint 1: Auth + Tenants (already exist)
- Sprint 2: Leads + Proposals (6 tables)
- Sprint 3: Contracts + Signatures (2 tables)
- Sprint 4: Payments + Schedules (2 tables)
- Sprint 5: Integrations + Alerts (4 tables)
- Sprint 6: Questionnaires + Deliverables (4 tables)
- Pros: Incremental, matches sprints
- Cons: More migration files

**C) Parallel Development (Branch, Merge Later)**
- Develop in `phase3` branch
- Merge to `main` when complete
- Apply all migrations together
- Pros: Isolation during development
- Cons: Merge conflicts

**Recommendation:** Option B (Feature-Based) - Matches sprint workflow, easier to track

**Your Answer:** _________________

---

### Q33: E2E Testing Scope

**Context:** End-to-end tests ensure critical workflows work.

**Proposed Critical Workflows:**
1. Lead capture → Proposal sent → Email tracking
2. Proposal submission → Contract generation
3. Contract signing → Payment → Event creation (Suite 1 → Suite 2 handoff)
4. Stripe webhook → Payment status update

**Question:** Are these 4 workflows sufficient for MVP E2E tests?

**Your Answer:**
- [ ] Yes, these 4 are sufficient
- [ ] Add more: _________________
- [ ] Remove some: _________________

---

### Q34: Stripe Testing Strategy

**Context:** Need to test Stripe payments without real money.

**Question:** How should Stripe testing be structured?

**Options:**

**A) Separate Stripe Test Account for Staging**
- Create second Stripe account in test mode
- Staging uses test account, production uses live account
- Pros: Complete isolation
- Cons: Two accounts to manage

**B) Use Stripe Test Mode in Same Account**
- Single Stripe account, toggle test/live mode
- Staging = test keys, production = live keys
- Pros: Single account, simpler
- Cons: Both environments in one account

**C) Mock Stripe Webhooks (No Real Stripe in Staging)**
- Staging doesn't connect to Stripe
- Manual webhook simulation
- Pros: No Stripe dependency in staging
- Cons: Less realistic testing

**Recommendation:** Option B (Test Mode, Same Account) - Standard practice, good balance

**Your Answer:** _________________

---

### Q35: GDPR Compliance

**Context:** Storing client data (emails, names, phone numbers).

**Question:** Which GDPR features are needed?

**Proposed (if serving EU customers):**
- [ ] Data export (client can download their data)
- [ ] Data deletion (soft delete on request)
- [ ] Privacy policy + Terms of service
- [ ] Cookie consent banner (if using analytics)

**Clarifications:**

1. **Do you have EU customers?**
   - [ ] Yes, need full GDPR compliance
   - [ ] No, US/Canada only → GDPR not needed (but good practice)
   - [ ] Unsure, implement anyway to be safe

2. **Data Retention Policy:**
   - Leads inactive 2 years → Auto-soft delete?
   - Email tracking 1 year → Purge?
   - Integration logs 90 days → Archive to S3?

**Your Answers:**
- EU Customers: _________________
- Retention Policy: _________________

---

## Summary & Next Steps

**Total Questions:** 35

**Critical (Must Answer Before Sprint 1):** Q1-Q8 (8 questions)
**High (Answer During Sprint 1-2):** Q9-Q18 (10 questions)
**Medium (Answer During Implementation):** Q19-Q28 (10 questions)
**Low (Defer to Phase 3.5+):** Q29-Q35 (7 questions)

**Recommended Approach:**

1. **This Week:** Answer Q1-Q8 (Critical)
2. **Sprint 1 (Weeks 1-2):** Answer Q9-Q18 while building foundation
3. **Sprints 2-5:** Answer Q19-Q28 as features are implemented
4. **Phase 3.5:** Revisit Q29-Q35 based on MVP learnings

**How to Submit Answers:**

Option A: Reply inline in this file
Option B: Create `PHASE3_ANSWERS.md` with your responses
Option C: Schedule 30-60min call to discuss (I'll document)

**After Answers Received:**

1. Update spec documents with decisions
2. Update SPEC_V2_LOCKED.md to v2.6
3. Begin Sprint 1 (Database foundation)

---

*Questions revised 2025-01-08. Ready for your answers! 🚀*
