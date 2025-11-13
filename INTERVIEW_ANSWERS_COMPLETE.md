# CommandCentered Interview - Complete Answers

**Date:** November 12, 2025
**Source:** Vision & Priorities Interview (Round 3)
**Status:** Complete answers extracted from transcript

---

## SECTION 1: VISION & BUSINESS MODEL

### Q1: What's the core problem CommandCentered solves?

**Answer:** CommandCentered consolidates all scattered systems (HoneyBook, Google Drive, emails, spreadsheets) into a single coherent hub that handles scheduling, logistics, and communication without chaos. The current manual process causes unnecessary stress and confusion.

**Impact if left for another year:** Business would continue running inefficiently with too many disconnected tools and repetitive manual inputs.

---

### Q2: Who are the primary users and what do they care about most?

**Answers:**

**Daniel (Operations Manager):**
- Wants everything in one clear system
- Reduce manual coordination
- Manage client progress, contracts, logistics, and deliverables from one dashboard
- Less mental load

**Operators:**
- Simple access to event info: when, where, what gear, payment
- Don't need to see other operators' details
- Just need their gig sheets

**Clients:**
- Care about clarity and communication
- DON'T want to log in anywhere
- Just want professional automated emails with everything they need

---

### Q3: Success metrics - how will you know this is working?

**Answer:** Success measured by **calm efficiency**, not data volume:
- No more scrambling for contract or event details
- Seamless automated client communication
- Minimal manual scheduling friction
- Operators always know their assignments
- Daniel can manage weekends at a glance without stress

**Key metric:** "Less mental load" - if system reduces stress, it's working.

---

### Q4: Revenue model for CommandCentered itself

**Answer:**
- **Internal-first SaaS**
- **Multi-tenant from day one** (Daniel is first tenant)
- Future model: Monthly SaaS pricing scaled by company size or revenue tiers
- Smaller companies: base fee
- Larger operations: proportional pricing
- Goal: Sellable to other production companies eventually

---

## SECTION 2: WORKFLOW PRIORITIES

### Q5: Phase sequencing - which order should we build?

**Answer:** Phase priority CHANGED:

**NEW ORDER:**
1. **Scheduling** (immediate value - biggest pain point)
2. **Execution**
3. **Delivery**
4. **Registration** (can stay manual until later)

**Reasoning:** Registration can remain manual; scheduling must be solid first.

---

### Q6: What's the MINIMUM you need to replace spreadsheets?

**Answer:** Daniel prefers a **FULL WATERFALL LAUNCH**, not barebones MVP:
- Complete ecosystem live at once
- Entire pipeline (proposal → delivery) runs smoothly and consistently
- Don't want partial system

**Minimum Day-1 Features (if forced to choose 3):**
1. **Scheduling Dashboard** - operator & event management
2. **AI Voice Agent** - full CRUD voice control
3. **Email Automation** - proposal → contract → execution → delivery flow

These three make the system operationally independent from spreadsheets.

---

### Q7: Walk through typical event workflow

**Answer:** [From transcript]

**Current Flow:**
1. Client reaches out via email/Instagram/referral
2. Initial call to understand needs
3. Send proposal (currently HoneyBook)
4. If accepted → send contract
5. Collect deposit
6. Send questionnaire (48 hours before for dance recitals - show program)
7. Create Vimeo livestream manually
8. Create Telegram group manually
9. Send gig sheets to operators
10. Event happens
11. Collect footage from operators
12. Edit and deliver via Google Drive
13. Send final invoice
14. Follow-up for rebooking

**Biggest bottlenecks:**
- Manual Vimeo setup every event
- Manual Telegram group creation
- Chasing operators for footage
- Manual follow-ups for questionnaires and payments

---

### Q8: Operator scheduling - current process

**Answer:**
- Currently manual via spreadsheets + text messages
- Check who's available via text or Telegram
- Assign based on availability + skill match
- Send gig sheets via Telegram
- Confusion happens when double-bookings occur
- Need Doodle-style availability system with partial-day support ("available 2-6pm")

---

### Q9: Equipment management - biggest challenge

**Answer:**
- Track **kits** primarily (not individual items as much)
- Kits are sometimes standard, sometimes customized per event
- Biggest issue: knowing what gear is where, and conflicts
- Need to see which kit is assigned to which event
- Conflict detection critical

---

## SECTION 3: CLIENT EXPERIENCE

### Q10: Should clients have a login?

**Answer:** **NO LOGIN for clients**
- Clients only receive beautiful HTML emails
- All interactions via email links:
  - Contract signing → link in email
  - Invoice payment → link in email
  - Questionnaire → link in email
  - Deliverable download → link in email

**Reasoning:** Simpler for clients, less to build, more professional

---

### Q11: Questionnaire workflow

**Answer:**
- **Automatic trigger:** After deposit paid → send questionnaire
- **Dance Recitals specific:** 48 hours before event → auto-send reminder for show program PDF upload
- Track upload status (who uploaded vs. not uploaded)
- Automatic reminders if not completed
- Questionnaires customizable per event type

---

### Q12: Proposal/Contract workflow

**Answer:**
- Current tool: HoneyBook (annoying)
- Want proposals generated from **standardized service templates**
- Templates should be reusable but customizable per event
- Full service library: "1-Minute Highlight", "Full Event Recording", etc.
- Each service has default duration, price, deliverables
- **E-signature:** Can integrate later, PDF + email sufficient for now

---

### Q13: Payment workflow

**Answer:**
- **Payment methods:** Stripe (credit card) + e-transfer logging (optional)
- **Payment milestones:** Deposit → Balance (simple 2-step for now)
- **Automatic reminders:** Yes - overdue invoice reminders
- Track payment status in dashboard

---

## SECTION 4: OPERATOR EXPERIENCE

### Q14: What do operators need when they log in?

**Answer:**
- Upcoming assignments
- Arrival time, call time
- Hotel info (if multi-day event)
- Venue location + client contact
- Gear list
- Payment details
- **Direct upload links for footage** (auto-generated Google Drive links)

**Portal needs:** Simple, mobile-friendly view

---

### Q15: Operator availability - how should this work?

**Answer:**
- Operators set their own availability
- **Partial-day support:** "Available 2-6pm" not just full-day yes/no
- **Doodle-style interface** (already in Planning mockup Tab 2)
- Symbols: ✅ (all day), 🕐 (partial), ❌ (unavailable), ⚪ (no response)
- Make this **fully functional** (not just visual)

---

### Q16: Operator communication

**Answer:**
- **Primary channel:** Telegram
- Gig sheets automatically post in Telegram group chats
- **Auto-create Telegram group per event** with assigned operators
- Daniel + operators in group
- Event updates post automatically
- No in-app chat needed (Telegram handles it)

---

### Q17: Operator performance tracking

**Answer:**
- **Not a priority** for now
- Can track hours/events later if needed
- Focus on scheduling and logistics first

---

## SECTION 5: INTEGRATIONS & AUTOMATION

### Q18: Current tools to integrate with

**Answer:**

**REQUIRED:**
1. **Vimeo API** - Livestream creation (CRITICAL)
2. **Google Drive API** - Deliverable folders + operator upload links (CRITICAL)
3. **Mailgun/Gmail API** - All email communications (CRITICAL)
4. **Telegram Bot API** - Notifications + auto-group creation (CRITICAL)
5. **Stripe** - Payment handling (CRITICAL)

**OPTIONAL (Future):**
- Calendar apps (Google Calendar sync)
- Accounting software (QuickBooks)

---

### Q19: Email automation triggers

**Answer:** Full automation flow:

1. **Contract signed** → send deposit invoice
2. **Deposit paid** → send technical questionnaire
3. **1 month before event** → missing info reminders
4. **48 hours before dance recital** → request show program PDF
5. **48 hours before event** → operator details + schedule
6. **After event** → thank-you + replay/deliverable notice
7. **2-4 weeks after delivery** → rebooking reminder

---

### Q20: Telegram bot vision

**Answer:**
- **Auto-create group per event** when operators assigned
- **Group members:** Daniel + assigned operators (NOT clients)
- **Notifications:** Gig sheets, schedule changes, event updates
- **After event:** Archive groups (don't delete - keep for reference)

---

### Q21: AI features - most useful

**Answer:**
- **Voice commands for common tasks** (PRIMARY USE CASE)
  - "Assign John to Saturday's event"
  - "What's the status of ABC Dance contract?"
  - "Send reminder to Metro Promo about their invoice"
- Full CRUD operations via voice
- **Requires internet** (not offline)
- Accessible from every page (floating button)

---

## SECTION 6: DATA & REPORTING

### Q22: Weekly/monthly reports needed

**Answer:**
- **Simple, motivational dashboard** (not deep analytics)
- Annual total revenue summary
- Status of upcoming events
- Client pipeline overview (proposal → contract → execution → delivery)
- **NOT needed:** Complex analytics, operator performance deep-dives

---

### Q23: Historical data

**Answer:**
- Keep historical data **indefinitely**
- No GDPR deletion tools required unless requested later
- Start fresh with new system (no old spreadsheet import needed initially)

---

## SECTION 7: TECHNICAL DECISIONS

### Q24: Who needs access?

**Answer:**
- **Daniel:** Full administrative access
- **Operators:** Scoped to their gig sheets only (can't see others' pay/assignments)
- **Clients:** Email interactions only (NO portal)
- **Editors (future):** Limited access to footage folders + delivery status

---

### Q25: Mobile vs. Desktop

**Answer:**
- **Daniel:** Uses both - needs mobile voice controls
- **Operators:** Primarily mobile view/uploads
- **No standalone mobile app required** at launch
- Responsive web UI sufficient

---

### Q26: Offline capability

**Answer:**
- **NOT needed** for Daniel
- Operators might need offline gig sheet access (can screenshot)
- Voice agent requires internet
- Not a priority

---

### Q27: Security & privacy

**Answer:**
- Standard data protection
- Payment data via Stripe (PCI compliant)
- No special compliance requirements (GDPR, etc.) currently
- Keep client/operator data secure

---

## SECTION 8: CUSTOMIZATION & FLEXIBILITY

### Q28: Service types - standardized or custom?

**Answer:**
- **Mix of standard + custom**
- Standard packages: "Dance Recital Standard", "Concert Full Coverage", etc.
- Each package customizable per event
- Build reusable **service template library**

---

### Q29: Pricing variation

**Answer:**
- Templates have default prices
- **Custom pricing per client** (can override template price)
- No tiered pricing based on event size (manual custom pricing)

---

### Q30: What needs customization vs. standardization?

**Answer:**
- **Email templates:** Customizable per client
- **Contract terms:** Customizable per event
- **Questionnaire questions:** Standard per event type, but editable
- **No locked text anywhere** - full flexibility

---

## SECTION 9: TIMELINE & SCOPE

### Q31: When to start using?

**Answer:**
- **Goal:** Deploy before next busy season
- No specific date yet
- Want system handling scheduling + logistics with minimal friction
- Flexibility if features take longer (quality over speed)

---

### Q32: MINIMUM viable system (3 features)?

**Answer:** Already answered in Q6:
1. Scheduling Dashboard
2. AI Voice Agent
3. Email Automation

But Daniel prefers **full waterfall launch** (complete system day 1)

---

### Q33: Training & onboarding

**Answer:**
- **Daniel will self-train**
- Optional walkthrough videos for operators later
- No formal training program needed initially

---

## SECTION 10: OPEN QUESTIONS

### Q34: What didn't I ask about?

**Answer:** Features already covered:
- Vimeo integration
- Show program automation
- Footage upload links
- Rebooking automation

---

### Q35: Most excited about?

**Answer:**
- "Finally having a **unified logistics and scheduling brain** that reduces chaos and gives peace of mind during event season"
- Voice control for quick tasks
- Not scrambling for info

---

### Q36: Most worried about?

**Answer:**
- Balancing development complexity with tight delivery timelines
- Avoiding burnout while maintaining clarity of purpose
- Making sure it actually reduces stress (not adds complexity)

---

## ADDITIONAL CONTEXT

### Vimeo Integration Details (Clarified):
- **Vimeo plan:** [Need to ask which tier]
- **Auto-generate:** Stream key + RTMP URL for operators
- **Landing page:** Auto-generate embed code (can create Squarespace page manually if needed)
- **Eliminate:** Manual Vimeo event creation every time

### Google Drive Upload Links:
- **Auto-generate per operator per event**
- Links should **NOT expire** (operators upload days later sometimes)
- **Notification when uploaded:** Yes (show in dashboard)

### Service Templates Count:
- Estimate: **5-10 standard services** initially
- Examples:
  - "1-Minute Highlight"
  - "Full Event Recording (3-5 min)"
  - "Dance Recital Standard"
  - "Concert Full Coverage"
  - "Promo Video Package"
- Templates should include default operator count (e.g., "Dance Recital = 2 operators")

### Phase Reordering:
- **"Scheduling first"** means build Registration LAST
- Don't skip Registration entirely - just deprioritize
- Focus on: Scheduling → Execution → Delivery → Registration

---

## ANSWERS TO MY QUESTIONS

### 1. Vimeo Integration:
- **Plan:** Need to ask Daniel which Vimeo tier
- **Landing pages:** Just need embed codes (can create Squarespace page manually)

### 2. Telegram Auto-Groups:
- **Members:** Operators only (NOT clients)
- **After event:** Archive groups (keep for reference, don't delete)

### 3. Service Templates:
- **Count:** 5-10 standard services
- **Include operator assignments:** Yes (default count like "2 operators")

### 4. Footage Upload:
- **Expiration:** NO - links should not expire
- **Notification:** YES - notify when operator uploads

### 5. Voice Agent:
- **Primary use:** Scheduling, status checks, sending reminders
- **Offline:** NO - requires internet

### 6. Phase Reordering:
- **Build Registration last** (not skip entirely)
- Focus: Scheduling → Execution → Delivery → Registration

---

**Status:** ✅ All answers extracted from interview transcript
**Next Step:** Update spec documents with these answers + new features
