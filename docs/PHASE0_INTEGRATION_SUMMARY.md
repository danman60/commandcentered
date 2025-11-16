# Phase 0: Lead Generation - Integration Summary

**Date:** November 16, 2025
**Status:** Schema + Mockups Complete ✅

---

## Overview

Added **Lead Finder + Campaigns** as "Phase 0: Lead Generation" - the pre-Pipeline phase for cold outreach.

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 0: LEAD GENERATION (NEW)                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Lead Finder (Apollo.io API)                             │
│     └─> Search: "Dance studios in Ontario, 50+ students"    │
│     └─> Returns: 127 results                                │
│                                                              │
│  2. Create Campaign                                         │
│     └─> Select 50 leads from search results                 │
│     └─> Assign to "Spring Recital 2025" campaign            │
│                                                              │
│  3. Campaign Runs Automatically                             │
│     └─> Day 0: Step 1 (Initial outreach)                    │
│     └─> Day 3: Step 2 (Follow-up with video)                │
│     └─> Day 8: Step 3 (Free checklist)                      │
│     └─> Day 15: Step 4 (Final offer)                        │
│                                                              │
│  4. Track Results                                           │
│     └─> 35 opened (70%)                                     │
│     └─> 5 clicked link (10%)                                │
│     └─> 3 replied (6%)                                      │
│                                                              │
│  5. Auto-Pipeline Entry ──────────────────────────┐         │
│     └─> Replied leads → CRM Pipeline              │         │
└───────────────────────────────────────────────────┼─────────┘
                                                     ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: REGISTRATION (EXISTING) ←─────────────────────────┤
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Pipeline: 3 new leads (from campaign)                   │
│     └─> Status: "New Lead"                                  │
│     └─> Source: "Email Campaign - Spring Recital 2025"      │
│                                                              │
│  2. Nurture & Qualify                                       │
│     └─> Send proposal via Proposal Builder                  │
│     └─> Follow-up calls/emails                              │
│                                                              │
│  3. Contract & Payment                                      │
│     └─> E-signature via SignWell                            │
│     └─> Payment via Stripe                                  │
│                                                              │
│  4. Convert to Event ────────────────────────────┐          │
└──────────────────────────────────────────────────┼──────────┘
                                                    ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: SCHEDULING → PHASE 3: EXECUTION → PHASE 4: DELIVERY│
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema Changes

**Added 5 new models + 4 enums (273 lines)**

### Models

1. **LeadSource** - Prospects from external APIs (Apollo.io)
   - Company info (name, website, phone)
   - Contact details (email, name, title)
   - Business details (type, industry, location)
   - Firmographics (employees, revenue)
   - Enrichment data (technologies, keywords, social profiles)
   - Tracking (alreadyContacted, addedToCrm, crmLeadId)

2. **Campaign** - Multi-step email outreach campaigns
   - Campaign info (name, description, status)
   - Metrics (sent, opened, clicked, replied, opportunities)
   - Settings (fromEmail, fromName, dailyLimit)
   - Schedule (sendDays, sendStartHour, sendEndHour, timezone)

3. **CampaignStep** - Individual steps in sequence
   - Step info (stepNumber, stepName)
   - Timing (delayDays, delayHours)
   - Conditions (sendCondition: ALWAYS, NO_REPLY, NO_OPEN, CLICKED_LINK)
   - Email content (subjectLine, bodyHtml, bodyText)
   - Tracking (sentCount, openedCount, clickedCount, repliedCount)

4. **CampaignLead** - Prospects in a campaign
   - Links to Campaign, LeadSource, and CRM Lead
   - Contact info (cached from LeadSource)
   - Progress (status, currentStep)
   - Metrics (emailsSent, openedCount, clickedCount, repliedCount)
   - Flags (bounced, unsubscribed)

5. **EmailActivity** - Individual email events
   - Activity type (SENT, DELIVERED, OPENED, CLICKED, REPLIED, BOUNCED, MARKED_AS_SPAM, UNSUBSCRIBED)
   - Email details (subjectLine, fromEmail, toEmail, messageId)
   - Tracking (ipAddress, userAgent, linkUrl)

### Enums

- **CampaignStatus**: DRAFT, ACTIVE, PAUSED, COMPLETED
- **StepCondition**: ALWAYS, NO_REPLY, NO_OPEN, CLICKED_LINK
- **CampaignLeadStatus**: SCHEDULED, SENDING, SENT, OPENED, CLICKED, REPLIED, OPPORTUNITY, BOUNCED, UNSUBSCRIBED
- **EmailActivityType**: SENT, DELIVERED, OPENED, CLICKED, REPLIED, BOUNCED, MARKED_AS_SPAM, UNSUBSCRIBED

### Relations Added

**Tenant:**
- `leadSources LeadSource[]`
- `campaigns Campaign[]`

**Lead:**
- `campaignLeads CampaignLead[]` (reverse relation when lead is moved to CRM)

---

## UI Mockups Created

### 1. Lead Finder (`07-lead-finder.html`)

**URL:** `/dashboard/lead-finder`

**Layout:**
- Left sidebar: Filters (business type, location, size, revenue)
- Main content:
  - AI search bar (Beta)
  - Saved searches + Recent searches
  - Results list (127 leads)
  - Lead cards with company info, tags, actions

**Key Features:**
- Checkbox filters: Business type, website required, skip already in CRM
- Manual filters: Location, keywords, company size, revenue range
- AI search: "Dance studios in Ontario with 100+ students"
- Bulk actions: Export CSV, Add to Campaign
- Per-lead actions: Add to Campaign, Add to CRM, View Details

### 2. Campaigns List (`08-campaigns.html`)

**URL:** `/dashboard/campaigns`

**Layout:**
- Header with "+ Create Campaign" button
- Filters: Search, status dropdown, sort dropdown
- Table with columns:
  - Name (with creation/last sent dates)
  - Status (Active, Paused, Draft, Completed)
  - Progress (percentage bar)
  - Sent (current/total)
  - Opened (count + %)
  - Replied (count + %)
  - Opportunities (count + revenue)
  - Actions (view, pause/resume, more)

**Sample Campaigns:**
- Spring Recital 2025: Active, 45% complete, 127/180 sent, 70% open, 9.4% reply, 3 opps ($8,400)
- Summer Camp Services: Paused, 18% complete, 43/240 sent, 72% open, 4.7% reply, 0 opps
- Corporate Events 2025: Draft, 0% complete, not launched
- Fall Festival Q4 2024: Completed, 100% complete, 156/156 sent, 63% open, 5.1% reply, 2 opps ($5,200)

### 3. Campaign Detail (`08b-campaign-detail.html`)

**URL:** `/dashboard/campaigns/[id]`

**Tabs:**
- Analytics (performance charts)
- **Sequence (current view)**
- Leads (180 leads in campaign)
- Schedule (sending times, daily limits)
- Settings (campaign configuration)

**Sequence Builder:**
- Step cards with:
  - Step number, name, delay settings
  - Condition badges (ALWAYS, NO_REPLY, etc.)
  - Subject line preview
  - Email body with variable highlighting ({{contact_name}}, {{company_name}})
  - Per-step stats (sent, opened, clicked, replied + percentages)
  - Actions (edit, delete, test email)

**Sample Sequence:**
1. **Step 1: Initial Outreach** - Send immediately - 127 sent, 70% open, 9.4% click, 3.1% reply
2. **Step 2: Follow-Up (No Reply)** - 3 days after, if no reply - 89 sent, 72% open, 9% click, 3.4% reply
3. **Step 3: Value Add** - 5 days after, if no reply - 64 sent, 64% open, 7.8% click, 7.8% reply
4. **Step 4: Final Follow-Up** - 7 days after, if no reply - 41 sent, 54% open, 4.9% click, 0% reply

---

## Navigation Integration

**Add to main navigation:**

```
Dashboard
├─ Lead Generation (NEW)
│  ├─ Lead Finder
│  └─ Campaigns
├─ Pipeline (EXISTING)
├─ Planning
├─ Deliverables
├─ Files
└─ Communications
```

**OR as top-level items:**

```
Dashboard
Lead Finder (NEW)
Campaigns (NEW)
Pipeline
Planning
Deliverables
Files
Communications
```

**Recommendation:** Keep under "Lead Generation" parent to distinguish from existing Pipeline.

---

## Implementation Priority

**Phasing within Phase 0:**

### Week 3: Lead Finder
- [ ] Apollo.io API integration
- [ ] Search UI with filters
- [ ] Results display
- [ ] "Add to Campaign" and "Add to CRM" actions

### Week 4: Campaign Builder
- [ ] Campaign creation flow
- [ ] Sequence builder (step editor)
- [ ] Campaign list view
- [ ] Campaign detail/analytics view

### Week 5: Campaign Execution
- [ ] Background job (runs every 5 minutes)
- [ ] Email sending via Mailgun
- [ ] Open/click tracking (tracking pixel + link wrapping)
- [ ] Reply detection (Mailgun webhook)

### Week 6: Pipeline Integration
- [ ] Auto-move replied leads to Pipeline
- [ ] Campaign source badges in Pipeline
- [ ] Email activity timeline in Lead detail
- [ ] Test full flow end-to-end

---

## Costs

**Monthly:**
- Apollo.io API: $99/month (2,000 credits)
- Mailgun: $35/month (50,000 emails)
- **Total:** ~$134/month

**One-time:**
- Development: ~3.5 weeks (Weeks 3-6)

**ROI:**
- Current: 10-20 leads/month (manual)
- With automation: 100-200 leads/month (10x)
- Close rate: 5% → 5-10 new clients/month
- Avg client value: $2,500
- **Additional monthly revenue:** $12,500-$25,000

---

## Next Steps

1. ✅ Schema updated (5 models, 4 enums added)
2. ✅ Mockups created (07-lead-finder, 08-campaigns, 08b-campaign-detail)
3. ⏭️ Get user approval on phasing strategy
4. ⏭️ Finalize navigation placement
5. ⏭️ Create tRPC router specs (Week 2)
6. ⏭️ Begin implementation (Week 3)

---

**Status:** Ready for review and implementation planning.
