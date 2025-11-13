# Phase 3 Implementation Answers - VOICE TRANSCRIPT READY

**Instructions:** Record a voice memo answering these questions, then paste the transcript below. I'll parse your answers and update the specs.

**Format:** Just talk through each question naturally. Say things like:
- "Q1, I'll go with option B"
- "For payment schedules, let's do the conservative 50/50 with the 7-day buffer"
- "Skip Q10 for now, we'll do that in Phase 3.5"
- "Q8 about domains - definitely two separate domains, StreamStage is the public brand"

---

## CRITICAL QUESTIONS (Answer These First)

### Q1: Payment Schedule Default Rules
**Question:** What are the default payment schedule rules?

**Options:**
- **A)** Simple 50/50 Split (deposit immediately, final on event day)
- **B)** Conservative 50/50 (deposit immediately, final 7 days before)
- **C)** Progressive 3-milestone (30% signing, 40% at 14 days, 30% at 3 days)
- **D)** Custom per service type

**If final payment not received:**
- Block event creation?
- Alert only?
- Auto-cancel 24h before?
- Manual decision?

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q2: E-Signature Service
**Question:** Which e-signature service?

**Options:**
- **SignWell** ($8/month) - Cheapest, modern API
- **DocuSign** ($25-40/month) - Enterprise, certified compliance
- **HelloSign** ($15-25/month) - Mid-tier

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q3: Email Service
**Question:** Which email service?

**Options:**
- **Resend** - Modern, Next.js-native, free tier sufficient
- **SendGrid** - Industry standard, robust
- **Mailgun** - Developer-friendly

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q4: Proposal Expiration Handling
**Question:** When proposal expires (30 days), what happens?

**Options:**
- **A)** Hard block - Cannot submit, must request new
- **B)** Soft warning - Shows warning but still works
- **C)** Auto-extend - When opened, extends 15 days
- **D)** Manual approval - Expired submissions create alert

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q5: Duplicate Lead Handling
**Question:** Lead submits form but email already exists?

**Options:**
- **A)** Block + notify - Show error, don't create duplicate
- **B)** Allow + flag - Create anyway, mark as duplicate
- **C)** Merge + update - Update existing lead, append notes

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q6: Contract Counter-Signature Timing
**Question:** When do YOU counter-sign the contract?

**Options:**
- **A)** Auto-counter-sign immediately when client signs
- **B)** Manual counter-sign after review
- **C)** Auto-counter-sign after payment received
- **D)** Hybrid - Auto for <$2k, manual for >$2k

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q7: Suite Handoff Trigger (Critical!)
**Question:** Exact conditions to auto-create event?

**Payment trigger:**
- First payment = deposit specifically?
- First payment = any payment received?
- Specific milestone named "Deposit"?

**Contract status:**
- Client signed only?
- Client + vendor counter-signed?
- Signed + 24h cooling-off period?

**If event creation fails (orphaned contract):**
- Daily cron report?
- Automatic retry 3x?
- Manual creation button?
- All of the above?

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q8: Domain Strategy
**Question:** How to separate StreamStage vs CommandCentered brands?

**Options:**
- **A)** Two domains (streamstage.app + commandcentered.app)
- **B)** Subdomain (streamstage.app + app.streamstage.app)
- **C)** Routes (streamstage.app/portal vs /dashboard)

**If two domains, which is primary business brand?**
- StreamStage (public-facing)
- CommandCentered (internal tool)
- Equal (different audiences)

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

## HIGH PRIORITY (Answer During Sprint 1-2)

### Q9: Google Drive Integration in MVP?
**Question:** Auto-folder creation in MVP or Phase 3.5?

**If YES:**
- Client permission: view-only, edit, or comment-only?
- Parent folder: root, specific folder ID, or tenant configurable?
- Failure handling: block event, create anyway + alert, or retry 3x?

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q10: Client Questionnaires in MVP?
**Question:** Pre-event questionnaire in MVP or Phase 3.5?

**If YES:**
- Trigger: when contract signed, when paid, or manual?
- Incomplete handling: block event, send reminders, or alert only?
- Templates: 1 generic or 5 service-specific?

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q11: Stripe Features for MVP
**Question:** Which Stripe features are MUST-HAVE?

**Check what you need:**
- Payment Intents (required)
- Customers (required)
- Invoices (required)
- Webhooks (required)
- Refunds?
- Payment Schedules (auto-charge)?
- ACH payments?
- Apple/Google Pay?
- Subscriptions?

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q12: Proposal Builder Builder UX
**Question:** Which layout for admin builder interface?

**Options:**
- **A)** 3-column (Elements | Canvas | Settings) - Like Webflow
- **B)** 2-column (Elements | Canvas+Settings) - Simpler
- **C)** Modal-based (Canvas, click element → modal) - Like Typeform

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q13: CRM View
**Question:** CRM table view, kanban board, or both?

**Options:**
- **A)** Table only (faster to build)
- **B)** Kanban only (visual pipeline)
- **C)** Both with toggle

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q14: Alert Notification Sounds
**Question:** Should alerts play sounds?

**Options:**
- **A)** CRITICAL alerts only
- **B)** CRITICAL + HIGH alerts
- **C)** No sounds (visual only)
- **D)** User-configurable per alert type

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q15: Lead Source Tracking
**Question:** Which lead sources should be tracked?

**Proposed list:**
- Website Form
- Referral
- Repeat Client
- Instagram, Facebook, TikTok
- Google Search/Ads
- Email Campaign
- Trade Show
- Cold Outreach
- Other

**Add or remove any?**

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q16: Email Template Management
**Question:** How to manage email templates?

**Options:**
- **A)** Code (TypeScript + React Email) - Version controlled
- **B)** Database (WYSIWYG editor) - Edit in admin
- **C)** External (SendGrid/Resend dashboard)

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q17: Pre-Built Proposal Templates
**Question:** How many templates ship with MVP?

**Options:**
- **A)** Zero (build from scratch)
- **B)** One generic
- **C)** Five service-specific (Recital, Event, Corporate, Concert, Promo)
- **D)** One + clone feature

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

### Q18: Analytics Dashboard Scope
**Question:** Analytics in MVP, Phase 3.5, or Phase 4+?

**Proposed metrics:**
- Lead conversion rate
- Avg time to conversion
- Pipeline value
- Revenue by service type
- Proposal view/signature rates

**YOUR ANSWER:**
```
[Paste voice transcript here]
```

---

## MEDIUM PRIORITY (Can Answer Later)

### Q19-Q28: Implementation Details

**If you want to answer these now, feel free. Otherwise, we'll handle during implementation.**

**Quick answers welcome:**
- "Q19 through Q28, use your recommendations"
- "Q22 JSONB structure looks good"
- "Q24 use Supabase Realtime"
- Or answer individually

**YOUR ANSWER:**
```
[Paste voice transcript here for any Q19-Q28 answers]
```

---

## LOW PRIORITY (Defer to Phase 3.5)

### Q29-Q35: Future Features

**These can wait. Just note if you have strong opinions:**

**YOUR ANSWER:**
```
[Paste any thoughts on Q29-Q35 here]
```

---

## AFTER YOU PASTE TRANSCRIPT

**What I'll do:**
1. Parse your answers
2. Update SPEC_V2_LOCKED.md to v2.6 with your decisions
3. Update all relevant spec documents
4. Create `DECISIONS_LOG.md` documenting choices
5. Begin Sprint 1 (Database foundation)

**Tips for voice recording:**
- Don't worry about being formal
- Reference questions by number ("Q1, let's go with B")
- Say "use your recommendation" or "skip for now" when needed
- Add context if you have specific reasons
- Total recording: probably 10-15 minutes for critical questions

**Ready when you are!** 🎤
