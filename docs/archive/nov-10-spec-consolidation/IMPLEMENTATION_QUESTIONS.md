# Implementation Questions - Build Fast & Accurate

**Purpose:** Quick-fire questions to clarify implementation details before Sprint 1
**Format:** Voice-friendly - just give quick answers

---

## DATABASE & SCHEMA QUESTIONS

### D1: Shared Drive Configuration
**Context:** You have existing shared drive for Google Drive integration

**Questions:**
1. What's your Google Shared Drive ID? (Need this for folder creation)
2. What's the parent folder ID where project folders should be created? (Or use shared drive root?)
3. Do you want year-based organization? (e.g., `2025/Client Name - Event`)

**Your Answers:**
```
[Paste here]
```

---

### D2: Mailgun Configuration
**Context:** You're already set up with Mailgun

**Questions:**
1. What's your Mailgun domain? (e.g., `mg.streamstage.live`)
2. Do you have separate domains for transactional vs. marketing emails?
3. What's your "From" email for proposals? (e.g., `proposals@streamstage.live`)
4. What's your "From" email for contracts? (e.g., `contracts@streamstage.live`)

**Your Answers:**
```
[Paste here]
```

---

### D3: Stripe Configuration
**Context:** Manual credit card processing via Stripe

**Questions:**
1. Do you already have a Stripe account?
2. Should invoices be sent from Stripe UI or from CommandCentered app?
3. What currency? (USD, CAD, other?)
4. Tax handling: Do you need to collect sales tax? (If yes, which states/provinces?)

**Your Answers:**
```
[Paste here]
```

---

### D4: Contract Template Source
**Context:** Need base contract text for auto-generation

**Questions:**
1. Do you have an existing contract template (Word/PDF/Google Doc)?
   - If YES: Can you share it? (I'll convert to Handlebars template)
   - If NO: Should I use generic videography contract template?

2. Key contract clauses needed:
   - Cancellation policy? (e.g., "50% refund if cancelled 30+ days before")
   - Liability limitations? (e.g., "Max liability = contract value")
   - Delivery timeline? (e.g., "Final videos delivered within 4 weeks")
   - Usage rights? (e.g., "Client receives full rights, vendor retains portfolio rights")

**Your Answers:**
```
[Paste here]
```

---

### D5: Payment Schedule Customization
**Context:** Default is 50% signing, 50% delivery - but you want it customizable

**Questions:**
1. Should payment schedules be per-contract (custom each time) or per-service-type (template)?
2. Common milestones you use:
   - Deposit (on signing)
   - Pre-production (X days before event)
   - Day of event
   - On delivery
   - Other: _______

3. Do you ever do milestone-based payments? (e.g., 30% / 40% / 30%)

**Your Answers:**
```
[Paste here]
```

---

## WORKFLOW & BUSINESS LOGIC QUESTIONS

### W1: Lead Capture Form Fields
**Context:** Website form on streamstage.live captures leads

**Questions:**
1. Which fields should the lead form have?
   - Organization Name (required/optional?)
   - Contact Name (required/optional?)
   - Email (always required)
   - Phone (required/optional?)
   - Service Type (dropdown, required/optional?)
   - Event Date (required/optional?)
   - Message/Notes (required/optional?)

2. Should there be a "How did you hear about us?" field?

**Your Answers:**
```
[Paste here]
```

---

### W2: Questionnaire Questions
**Context:** Client fills questionnaire after contract signed

**Questions:**
For each service type, what info do you need BEFORE the event?

**Dance Recital Media:**
- Event timeline? (doors open, show start, intermission, end)
- Number of performers?
- Specific routines to highlight?
- VIP dancers (solos, group numbers)?
- Special requests?
- Other: _______

**Dance Promo Videos:**
- Video purpose? (competition entry, marketing, social media)
- Key moves to feature?
- Music preference?
- Length preference? (30s, 60s, 90s, full routine)
- Other: _______

**Concert Coverage:**
- Artist/band name?
- Set list (if available)?
- Key songs to prioritize?
- Multi-camera or single?
- Live stream needed?
- Other: _______

**Event Videography:**
- Event type? (conference, gala, corporate, other)
- Key moments to capture? (speeches, awards, etc.)
- Interviewees?
- B-roll locations?
- Other: _______

**Your Answers:**
```
[Paste here for each service type - or say "start with generic, refine later"]
```

---

### W3: Alert Thresholds
**Context:** You want constant alerts for missing technical info

**Questions:**
1. How many days before event should you get alerted about:
   - Incomplete questionnaire? (e.g., 14 days, 7 days, 3 days?)
   - Missing venue address?
   - No operators assigned?
   - No gear assigned?

2. Should incomplete questionnaire BLOCK event from proceeding? Or just alert?

**Your Answers:**
```
[Paste here]
```

---

### W4: Email Reminder Cadence
**Context:** Automated email reminders for incomplete questionnaires

**Questions:**
1. Reminder schedule:
   - First reminder: X days after contract signed?
   - Second reminder: X days before event?
   - Third reminder: X days before event?

2. Should reminders stop after X attempts? Or keep sending until completed?

**Your Answers:**
```
[Paste here]
```

---

### W5: Google Drive Folder Notification Triggers
**Context:** Email client when files added to their folder

**Questions:**
1. Notify on:
   - Any file added?
   - Only when YOU add files (not when client uploads)?
   - Files added to specific subfolders only? (e.g., only `03_Final_Deliverables/`)

2. Notification email:
   - Immediate (every file addition)?
   - Daily digest (once per day summary)?
   - Manual trigger (you click "Notify client of updates")?

**Your Answers:**
```
[Paste here]
```

---

## UI/UX QUESTIONS

### U1: CRM Default Filters
**Context:** CRM table shows all leads - need sensible defaults

**Questions:**
1. Default view on CRM load:
   - Show all leads?
   - Show only active (status != 'lost' and != 'disqualified')?
   - Show only leads from last 30 days?

2. Default sort:
   - Newest first (created_at DESC)?
   - Last contacted (last_contacted_at DESC)?
   - Status priority (new → contacted → proposal_sent)?

**Your Answers:**
```
[Paste here]
```

---

### U2: Proposal Builder Preview
**Context:** Admin building proposal in 3-column interface

**Questions:**
1. Should preview show:
   - Exact client view (what they'll see)?
   - Admin view (with internal notes visible)?
   - Toggle between both?

2. Should preview update live as you drag elements? Or click "Refresh Preview"?

**Your Answers:**
```
[Paste here]
```

---

### U3: Contract Viewer Layout
**Context:** Client views contract on streamstage.live

**Questions:**
1. Contract format:
   - Full-width document?
   - Sidebar with summary (left) + contract text (right)?
   - Scrollable with sticky signature section at bottom?

2. Should client be able to:
   - Download PDF before signing?
   - Print contract?
   - Comment/ask questions inline?

**Your Answers:**
```
[Paste here]
```

---

### U4: Dashboard Widget Priority
**Context:** CommandCentered main dashboard - what's most important?

**Questions:**
Rank these widgets by importance (1 = most important):

- [ ] New Leads (uncontacted leads)
- [ ] Active Proposals (sent, not yet submitted)
- [ ] Pending Contracts (sent, not yet signed)
- [ ] Upcoming Events (next 7 days)
- [ ] Incomplete Questionnaires (overdue)
- [ ] Overdue Payments
- [ ] Critical Alerts

**Your Ranking:**
```
[Paste here: 1. New Leads, 2. Upcoming Events, etc.]
```

---

### U5: Mobile Optimization Priority
**Context:** Will you use CommandCentered on mobile/tablet?

**Questions:**
1. Do you need mobile-optimized admin interface?
   - Full mobile support (responsive design)?
   - Desktop-only is fine (mobile view basic)?
   - Specific features mobile-critical (e.g., check alerts on-site)?

2. Client portal mobile priority:
   - CRITICAL (clients fill proposals on phones)?
   - NICE-TO-HAVE (most use desktop)?

**Your Answers:**
```
[Paste here]
```

---

## INTEGRATION QUESTIONS

### I1: SignWell Integration Details
**Context:** E-signature via SignWell API

**Questions:**
1. Do you already have SignWell account? (Or should I set up test account for MVP?)
2. Should signature requests expire? (e.g., "Please sign within 30 days")
3. Signature order:
   - Client signs first, then auto-countersign?
   - Send pre-signed (you already signed)?

**Your Answers:**
```
[Paste here]
```

---

### I2: Supabase Project Details
**Context:** Database will be Supabase PostgreSQL

**Questions:**
1. Do you have existing Supabase project for this? Or create new?
2. Region preference? (US East, US West, EU, other - affects latency)
3. Do you need separate staging + production databases?

**Your Answers:**
```
[Paste here]
```

---

### I3: Vercel Deployment
**Context:** Next.js app deployed to Vercel

**Questions:**
1. Do you have Vercel account? (Free tier is fine for MVP)
2. Should I set up:
   - Auto-deploy from main branch (every push goes live)?
   - Manual deploy (you trigger deploys)?
   - Preview deployments on PRs?

**Your Answers:**
```
[Paste here]
```

---

## DATA & CONTENT QUESTIONS

### C1: Proposal Template Seed Data
**Context:** 4 pre-built proposal templates ship with MVP

**Questions:**
For each service type, what should the DEFAULT proposal include?

**Dance Recital Media:**
- Pricing: Tiered by dancer count? Fixed packages? Base rate + addons?
- Default add-ons: Drone footage, same-day edit, multi-camera, photo package?
- Default payment: 50/50 signing/delivery?

**Dance Promo Videos:**
- Pricing: Per video? Package deals?
- Length options: 30s, 60s, 90s, full routine?
- Add-ons: Slow-mo, drone, multiple versions?

**Concert Coverage:**
- Pricing: Per hour? Flat rate? Tiered by duration?
- Deliverables: Full show, highlight reel, social clips?
- Add-ons: Multi-camera, live stream, audio mixing?

**Event Videography:**
- Pricing: Per hour? Day rate? Tiered by duration?
- Deliverables: Full event, highlight reel, interviews?
- Add-ons: Drone, same-day edit, photo package?

**Your Answers:**
```
[Paste here for each - or say "I'll configure manually after MVP"]
```

---

### C2: Email Template Copy
**Context:** Need email copy for automated emails

**Questions:**
1. Should I write generic professional copy? Or do you want to provide specific messaging?

**Emails needed:**
- Proposal sent ("Your custom proposal is ready")
- Contract sent ("Please review and sign your contract")
- Payment reminder ("Payment due in 3 days")
- Questionnaire sent ("Help us prepare for your event")
- Folder notification ("New files in your project folder")

2. Tone preference:
   - Professional/formal?
   - Friendly/casual?
   - Somewhere in between?

**Your Answers:**
```
[Paste here]
```

---

## TECHNICAL ARCHITECTURE QUESTIONS

### T1: Authentication Strategy
**Context:** Admin (you) vs. Client authentication

**Questions:**
1. Admin login:
   - Email + password (Supabase Auth)?
   - Magic link only?
   - Google OAuth?

2. Client login (for portal):
   - Magic link (no password)?
   - Email + password?
   - Session duration: 7 days? 30 days? Until manual logout?

**Your Answers:**
```
[Paste here]
```

---

### T2: File Storage
**Context:** Proposal builder might have images, contract PDFs, etc.

**Questions:**
1. Where to store files:
   - Supabase Storage (built-in)?
   - Your existing Google Drive?
   - AWS S3?
   - Vercel Blob Storage?

2. Size limits per file: 10MB? 50MB? 100MB?

**Your Answers:**
```
[Paste here]
```

---

### T3: Environment Variables Management
**Context:** API keys for Stripe, Mailgun, Google Drive, SignWell, Supabase

**Questions:**
1. How should I provide environment variable template?
   - `.env.example` file with all required keys?
   - Documentation in README?
   - Setup script to validate all keys present?

2. Who sets up production API keys?
   - You'll create accounts and provide keys?
   - I should create test accounts for you?

**Your Answers:**
```
[Paste here]
```

---

## TESTING & VALIDATION QUESTIONS

### V1: Test Data Strategy
**Context:** Need test data for development

**Questions:**
1. Should I create seed script with fake data?
   - Fake leads, proposals, contracts?
   - Or prefer to test with real data from start?

2. Test client emails:
   - Use your personal email for testing?
   - Use Mailgun sandbox mode (no real emails)?
   - Create test Gmail accounts?

**Your Answers:**
```
[Paste here]
```

---

### V2: Critical Path Testing
**Context:** What workflows are most critical to test?

**Questions:**
Rank these workflows for E2E testing priority (1 = test first):

- [ ] Lead capture → Proposal sent
- [ ] Proposal submission → Contract generation
- [ ] Contract signing → Event creation (Suite 1 → Suite 2 handoff)
- [ ] Payment processing (Stripe)
- [ ] Questionnaire sent → Filled → Alerts
- [ ] Google Drive folder creation
- [ ] Email notifications

**Your Ranking:**
```
[Paste here]
```

---

## DEPLOYMENT & TIMELINE QUESTIONS

### P1: MVP Launch Target
**Context:** When do you need this operational?

**Questions:**
1. Hard deadline? Or flexible timeline?
2. Can we launch with partial features and iterate?
   - MVP 1: Lead capture, proposals, contracts (no payments, no Drive)
   - MVP 2: Add payments + Google Drive
   - MVP 3: Add questionnaires + email flow
   - OR: Launch with everything at once?

**Your Answers:**
```
[Paste here]
```

---

### P2: Development Approach
**Context:** Should I build incrementally or build complete then deploy?

**Questions:**
1. Do you want to see progress on staging environment as I build?
   - Daily deploys to staging (see progress daily)?
   - Weekly deploys (feature-complete increments)?
   - Single deploy when MVP complete?

2. Your involvement during development:
   - Test and give feedback as features complete?
   - Hands-off until MVP ready?
   - Daily check-ins?

**Your Answers:**
```
[Paste here]
```

---

## SUMMARY

**Total Questions:** 28 across 7 categories
- Database & Schema (5)
- Workflow & Business Logic (5)
- UI/UX (5)
- Integrations (3)
- Data & Content (2)
- Technical Architecture (3)
- Testing & Validation (2)
- Deployment & Timeline (2)

**How to Answer:**
1. Record voice memo going through each section
2. Quick answers are fine ("use your judgment", "default is fine", "skip for now")
3. Detail where you have strong preferences
4. Flag anything unclear or missing

**After Answers:**
I'll build with confidence - no guessing, no assumptions, no rework.

**Ready when you are!** 🎤
