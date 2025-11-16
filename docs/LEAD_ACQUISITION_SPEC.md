# Lead Acquisition System - CommandCentered
**Focus:** Lead Finder + Email Campaigns → Pipeline Integration

**Date:** November 16, 2025
**Source:** Instantly.ai feature audit

---

## Overview

Add cold outreach capabilities to CommandCentered to find and nurture leads before they enter the existing Pipeline system.

**Current Flow (Manual):**
1. ❌ Manual prospecting (Google search, referrals, cold calls)
2. ❌ Manual email outreach
3. ✅ Lead enters Pipeline when they respond
4. ✅ Proposal → Contract → Payment → Event creation

**New Flow (Automated):**
1. ✅ **Lead Finder** - AI-powered search for dance studios, schools, event organizers
2. ✅ **Campaigns** - Automated multi-step email sequences
3. ✅ **Auto-Pipeline Entry** - Interested leads automatically added to Pipeline
4. ✅ Existing Pipeline workflow continues...

---

## 1. Lead Finder (SuperSearch)

**URL:** `/dashboard/lead-finder`

**Purpose:** Find potential clients (dance studios, event organizers, schools) using AI-powered search.

### 1.1 UI Layout

**Left Sidebar - Filters:**
```
┌─────────────────────────────────┐
│ FILTERS                         │
├─────────────────────────────────┤
│ ☐ Skip already in CRM           │
│                                  │
│ Business Type ▼                 │
│   □ Dance Studio                │
│   □ Dance School                │
│   □ Performing Arts Center      │
│   □ Event Venue                 │
│   □ K-12 School                 │
│                                  │
│ Location 🔍                     │
│   [Type city, state, or zip...] │
│                                  │
│ Keywords (optional)             │
│   [recital, performance, show]  │
│                                  │
│ Company Size                    │
│   [Min] [Max] employees         │
│                                  │
│ Revenue Range (optional)        │
│   [Min] [Max] USD               │
│                                  │
│ Website Required                │
│   ☑ Has website                 │
│                                  │
│ [Clear Filters] [Search]        │
└─────────────────────────────────┘
```

**Main Content - Search & Results:**
```
┌──────────────────────────────────────────────────────────┐
│ AI Search (Beta)                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🤖 "Dance studios in Ontario with 100+ students"    │ │
│ │                                      [AI Search]     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ Or use manual filters on the left →                     │
├──────────────────────────────────────────────────────────┤
│ SAVED SEARCHES                 RECENT SEARCHES          │
│ • Ontario Dance Studios (47)   • Toronto Area (12)      │
│ • GTA Schools (103)            • Niagara Region (8)     │
│ [+ Save Current Search]                                 │
├──────────────────────────────────────────────────────────┤
│ RESULTS (127 found)            [Export CSV] [+ Campaign]│
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ☐ Woodstock School of Dance & Yoga                 │ │
│ │    📍 Woodstock, ON · 🌐 woodstockdanceyoga.com    │ │
│ │    📧 info@woodstockdanceyoga.com                  │ │
│ │    👥 10-50 employees · 💰 Est. $100K-500K         │ │
│ │    🏷️ Dance Studio, Yoga, Performing Arts          │ │
│ │    [Add to Campaign] [Add to CRM] [View Details]   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ☐ EMPWR Dance Experience                           │ │
│ │    📍 Guelph, ON · 🌐 empwrdance.com               │ │
│ │    📧 empwrdance@gmail.com                         │ │
│ │    👥 10-50 employees · 💰 Est. $100K-500K         │ │
│ │    🏷️ Dance Studio, Competitions, Training         │ │
│ │    [Add to Campaign] [Add to CRM] [View Details]   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ☐ Grand River Dance Company                        │ │
│ │    📍 Cambridge, ON · 🌐 grandriverdance.com       │ │
│ │    📧 info@grandriverdance.com                     │ │
│ │    👥 10-50 employees · 💰 Est. $50K-250K          │ │
│ │    🏷️ Dance School, Performance Company            │ │
│ │    [Add to Campaign] [Add to CRM] [View Details]   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│                    [Load More Results]                   │
└──────────────────────────────────────────────────────────┘
```

### 1.2 Data Model

```prisma
// Lead source data (external database/API)
model LeadSource {
  id              String   @id @default(cuid())
  tenant_id       String

  // Company Info
  company_name    String
  website         String?
  phone           String?

  // Primary Contact
  contact_email   String
  contact_name    String?
  contact_title   String?

  // Business Details
  business_type   String   // "Dance Studio", "School", etc.
  industry        String   // "Performing Arts", "Education"
  location_city   String
  location_state  String
  location_zip    String?
  location_country String  @default("Canada")

  // Firmographics
  employee_count  Int?
  revenue_range   String?  // "$100K-500K"

  // Enrichment
  technologies    String[] // ["WordPress", "Stripe"]
  keywords        String[] // ["recital", "performance"]
  social_linkedin String?
  social_facebook String?
  social_instagram String?

  // Tracking
  already_contacted Boolean @default(false)
  added_to_crm      Boolean @default(false)
  crm_lead_id       String? // Links to Lead model when added to CRM

  found_at        DateTime @default(now())
  last_updated_at DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenant_id], references: [id])

  @@index([tenant_id, already_contacted])
  @@index([tenant_id, business_type])
  @@index([tenant_id, location_state])
}
```

### 1.3 Search API

**tRPC Procedure:**
```typescript
// server/api/routers/leads.ts

export const leadsRouter = createTRPCRouter({
  search: protectedProcedure
    .input(z.object({
      // AI Search
      aiQuery: z.string().optional(),

      // Manual Filters
      businessTypes: z.array(z.string()).optional(),
      locationCity: z.string().optional(),
      locationState: z.string().optional(),
      locationCountry: z.string().default("Canada"),
      keywords: z.array(z.string()).optional(),
      employeeMin: z.number().optional(),
      employeeMax: z.number().optional(),
      revenueMin: z.number().optional(),
      revenueMax: z.number().optional(),
      requireWebsite: z.boolean().default(true),
      skipAlreadyContacted: z.boolean().default(true),

      // Pagination
      limit: z.number().default(25),
      offset: z.number().default(0),
    }))
    .query(async ({ ctx, input }) => {
      // If AI query provided, parse it into filters
      if (input.aiQuery) {
        const parsedFilters = await parseAIQuery(input.aiQuery);
        // Merge with manual filters
      }

      // Search external lead database (Apollo.io, ZoomInfo, etc.)
      const results = await searchLeadDatabase({
        ...input,
        tenantId: ctx.session.user.tenantId,
      });

      return {
        leads: results,
        total: results.length,
        hasMore: results.length === input.limit,
      };
    }),

  addToCRM: protectedProcedure
    .input(z.object({
      leadSourceId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const leadSource = await ctx.db.leadSource.findUnique({
        where: { id: input.leadSourceId },
      });

      // Create Lead in existing CRM (Pipeline)
      const lead = await ctx.db.lead.create({
        data: {
          tenant_id: ctx.session.user.tenantId,
          company_name: leadSource.company_name,
          contact_name: leadSource.contact_name,
          contact_email: leadSource.contact_email,
          contact_phone: leadSource.phone,
          website: leadSource.website,
          location: `${leadSource.location_city}, ${leadSource.location_state}`,
          status: "New Lead", // Initial Pipeline status
          source: "Lead Finder",
          notes: `Added from Lead Finder search. Business type: ${leadSource.business_type}`,
        },
      });

      // Mark LeadSource as added to CRM
      await ctx.db.leadSource.update({
        where: { id: input.leadSourceId },
        data: {
          added_to_crm: true,
          crm_lead_id: lead.id,
        },
      });

      return lead;
    }),
});
```

### 1.4 Integration with External APIs

**Option 1: Apollo.io API (Recommended)**
- 200M+ business contacts
- Advanced filters (industry, location, company size)
- Email verification included
- Cost: ~$99/month for 2,000 credits

**Option 2: ZoomInfo API**
- Premium B2B database
- Higher accuracy, more expensive
- Cost: Custom pricing (~$15K/year+)

**Option 3: Hunter.io + Clearbit**
- Hunter.io for email finding
- Clearbit for company enrichment
- Cost: ~$49/month (Hunter) + $99/month (Clearbit)

**Implementation:**
```typescript
// lib/leadDatabase.ts

import axios from 'axios';

export async function searchLeadDatabase(params: SearchParams) {
  // Example using Apollo.io API
  const response = await axios.post(
    'https://api.apollo.io/v1/mixed_people/search',
    {
      api_key: process.env.APOLLO_API_KEY,

      // Filters
      q_organization_keyword_tags: params.keywords,
      person_titles: ["Owner", "Director", "Manager"],
      organization_locations: [`${params.locationCity}, ${params.locationState}`],
      organization_num_employees_ranges: [
        params.employeeMin && params.employeeMax
          ? `${params.employeeMin},${params.employeeMax}`
          : undefined
      ],

      // Pagination
      page: Math.floor(params.offset / params.limit) + 1,
      per_page: params.limit,
    }
  );

  return response.data.people.map(person => ({
    company_name: person.organization.name,
    website: person.organization.website_url,
    contact_email: person.email,
    contact_name: person.name,
    contact_title: person.title,
    business_type: inferBusinessType(person.organization.keywords),
    location_city: person.organization.city,
    location_state: person.organization.state,
    employee_count: person.organization.estimated_num_employees,
    revenue_range: person.organization.estimated_annual_revenue_range,
  }));
}

function inferBusinessType(keywords: string[]): string {
  if (keywords.includes('dance') || keywords.includes('ballet')) return "Dance Studio";
  if (keywords.includes('school')) return "School";
  if (keywords.includes('event')) return "Event Venue";
  return "Other";
}
```

---

## 2. Campaigns (Email Sequences)

**URL:** `/dashboard/campaigns`

**Purpose:** Automated multi-step email campaigns to nurture leads from Lead Finder into the Pipeline.

### 2.1 Campaign List View

```
┌────────────────────────────────────────────────────────────────┐
│ CAMPAIGNS                                [+ Create Campaign]   │
├────────────────────────────────────────────────────────────────┤
│ [Search...] [All Statuses ▼] [Newest First ▼]                │
├────────────────────────────────────────────────────────────────┤
│ NAME              STATUS    SENT  OPENED  REPLIED  OPPORTUNITIES│
├────────────────────────────────────────────────────────────────┤
│ ☐ Spring Recital  Active    127   89      12       3 ($8,400)  │
│   2025 Outreach             70%   62%     9.4%                  │
│   ━━━━━━━━━━━━━━━ 45% complete                                │
│                                                                  │
│ ☐ Summer Camp     Paused    43    31      2        0 ($0)      │
│   Services                  24%   72%     4.7%                  │
│   ━━━━━━━━━━━━━━━ 18% complete                                │
│                                                                  │
│ ☐ Corporate       Draft     0     0       0        0 ($0)      │
│   Events 2025                                                   │
│   ━━━━━━━━━━━━━━━ 0% complete                                 │
└────────────────────────────────────────────────────────────────┘
```

### 2.2 Campaign Detail View

**URL:** `/dashboard/campaigns/[id]`

**Tabs:**
- **Analytics** - Performance metrics
- **Sequence** - Email builder (Step 1, 2, 3, etc.)
- **Leads** - Lead list for this campaign
- **Schedule** - Sending times and limits
- **Settings** - Campaign configuration

**Analytics Tab:**
```
┌────────────────────────────────────────────────────────────────┐
│ ← Campaigns / Spring Recital 2025 Outreach                    │
│                                                    [▶ Resume]   │
├────────────────────────────────────────────────────────────────┤
│ Status: Active                45% complete  [Last 4 weeks ▼]  │
├────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │ SENT     │ │ OPENED   │ │ REPLIED  │ │ OPPS     │         │
│ │   127    │ │   89     │ │   12     │ │    3     │         │
│ │          │ │   70%    │ │   9.4%   │ │  $8,400  │         │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
├────────────────────────────────────────────────────────────────┤
│ PERFORMANCE OVER TIME                                          │
│                                                                 │
│  12 │                                       ●                  │
│  10 │                         ●                                │
│   8 │             ●                                            │
│   6 │     ●                                                    │
│   4 │                                                          │
│   2 │ ●                                                        │
│   0 └────────────────────────────────────────────────────     │
│     Oct 17    Oct 24    Oct 31    Nov 7     Nov 14           │
│                                                                 │
│     — Sent  — Opened  — Replied                               │
├────────────────────────────────────────────────────────────────┤
│ STEP ANALYTICS                                                 │
│                                                                 │
│ STEP          SENT    OPENED      REPLIED    CLICKED   OPPS   │
│ Step 1         127    89 (70%)    4 (3.1%)   12 (9%)    1     │
│ Step 2          89    64 (72%)    3 (3.4%)    8 (9%)    1     │
│ Step 3          64    41 (64%)    5 (7.8%)    5 (8%)    1     │
│ Step 4 (final)  41    22 (54%)    0 (0%)      2 (5%)    0     │
└────────────────────────────────────────────────────────────────┘
```

**Sequence Builder Tab:**
```
┌────────────────────────────────────────────────────────────────┐
│ EMAIL SEQUENCE                                [+ Add Step]     │
├────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ STEP 1: Initial Outreach        [Edit] [Delete] [Test]  │  │
│ │ Delay: Send immediately                                  │  │
│ │                                                           │  │
│ │ Subject: Capture every moment of your spring recital     │  │
│ │                                                           │  │
│ │ Hi {{contact_name}},                                     │  │
│ │                                                           │  │
│ │ I noticed {{company_name}} is coming up on its spring    │  │
│ │ recital season. As a fellow dance community member, I    │  │
│ │ know how special these performances are for your dancers │  │
│ │ and their families.                                      │  │
│ │                                                           │  │
│ │ StreamStage Productions specializes in multi-camera      │  │
│ │ recital filming with same-day delivery. Our packages     │  │
│ │ start at $2,500 for a 2-camera shoot.                   │  │
│ │                                                           │  │
│ │ Would you like to see samples from similar studios?      │  │
│ │                                                           │  │
│ │ Best,                                                     │  │
│ │ Daniel                                                    │  │
│ │ StreamStage Productions                                  │  │
│ │ [Book a Call]                                            │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ STEP 2: Follow-Up (No Reply)   [Edit] [Delete] [Test]  │  │
│ │ Delay: 3 days after Step 1                              │  │
│ │ Condition: Only send if no reply to Step 1              │  │
│ │                                                           │  │
│ │ Subject: Quick question about {{company_name}}'s recital │  │
│ │                                                           │  │
│ │ Hi {{contact_name}},                                     │  │
│ │                                                           │  │
│ │ Following up on my previous email. I wanted to share a   │  │
│ │ quick sample reel from a recent studio we worked with... │  │
│ │                                                           │  │
│ │ [Watch 2-Min Sample Reel]                               │  │
│ │                                                           │  │
│ │ If you're not interested, just let me know and I'll     │  │
│ │ remove you from my list.                                │  │
│ │                                                           │  │
│ │ Best,                                                     │  │
│ │ Daniel                                                    │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ STEP 3: Value Add              [Edit] [Delete] [Test]  │  │
│ │ Delay: 5 days after Step 2                              │  │
│ │ Condition: Only send if no reply to Steps 1-2           │  │
│ │                                                           │  │
│ │ Subject: Free checklist: Recital day preparation        │  │
│ │                                                           │  │
│ │ Hi {{contact_name}},                                     │  │
│ │                                                           │  │
│ │ Whether or not you're interested in video services, I    │  │
│ │ wanted to share this free resource we created for dance  │  │
│ │ studio directors...                                      │  │
│ │                                                           │  │
│ │ [Download Free Checklist]                               │  │
│ │                                                           │  │
│ │ If this was helpful, I'd love to chat about your recital.│  │
│ │                                                           │  │
│ │ Best,                                                     │  │
│ │ Daniel                                                    │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ STEP 4: Final Follow-Up        [Edit] [Delete] [Test]  │  │
│ │ Delay: 7 days after Step 3                              │  │
│ │ Condition: Only send if no reply to Steps 1-3           │  │
│ │                                                           │  │
│ │ Subject: Last follow-up for {{company_name}}            │  │
│ │                                                           │  │
│ │ Hi {{contact_name}},                                     │  │
│ │                                                           │  │
│ │ I won't bother you again after this. Just wanted to make│  │
│ │ one last offer: If you book by end of month, I can offer│  │
│ │ 15% off our standard package.                           │  │
│ │                                                           │  │
│ │ If you're all set for video, no problem at all. Best of │  │
│ │ luck with your spring recital!                          │  │
│ │                                                           │  │
│ │ Daniel                                                    │  │
│ └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### 2.3 Data Model

```prisma
model Campaign {
  id              String   @id @default(cuid())
  tenant_id       String

  // Campaign Info
  name            String
  description     String?
  status          CampaignStatus @default(DRAFT)

  // Metrics
  total_leads     Int      @default(0)
  sequence_started Int     @default(0)
  emails_sent     Int      @default(0)
  opened_count    Int      @default(0)
  clicked_count   Int      @default(0)
  replied_count   Int      @default(0)
  opportunities_count Int  @default(0)
  opportunity_revenue Decimal @default(0) @db.Decimal(10, 2)

  // Settings
  from_email      String   // "daniel@streamstageproductions.com"
  from_name       String   // "Daniel from StreamStage"
  daily_limit     Int      @default(50) // Max emails per day

  // Schedule
  send_days       String[] // ["Monday", "Tuesday", "Wednesday"]
  send_start_hour Int      @default(9)  // 9 AM
  send_end_hour   Int      @default(17) // 5 PM
  timezone        String   @default("America/Toronto")

  created_at      DateTime @default(now())
  launched_at     DateTime?
  paused_at       DateTime?
  completed_at    DateTime?

  tenant          Tenant   @relation(fields: [tenant_id], references: [id])
  steps           CampaignStep[]
  leads           CampaignLead[]

  @@index([tenant_id, status])
}

enum CampaignStatus {
  DRAFT
  ACTIVE
  PAUSED
  COMPLETED
}

model CampaignStep {
  id              String   @id @default(cuid())
  campaign_id     String

  step_number     Int      // 1, 2, 3, 4
  step_name       String   // "Initial Outreach", "Follow-Up"

  // Timing
  delay_days      Int      @default(0) // Days after previous step
  delay_hours     Int      @default(0) // Additional hours

  // Conditions
  send_condition  StepCondition @default(ALWAYS)

  // Email Content
  subject_line    String
  body_html       String   @db.Text
  body_text       String   @db.Text

  // Tracking
  sent_count      Int      @default(0)
  opened_count    Int      @default(0)
  clicked_count   Int      @default(0)
  replied_count   Int      @default(0)

  created_at      DateTime @default(now())

  campaign        Campaign @relation(fields: [campaign_id], references: [id], onDelete: Cascade)

  @@index([campaign_id, step_number])
}

enum StepCondition {
  ALWAYS           // Send to everyone
  NO_REPLY         // Only if no reply to previous steps
  NO_OPEN          // Only if didn't open previous steps
  CLICKED_LINK     // Only if clicked link in previous step
}

model CampaignLead {
  id              String   @id @default(cuid())
  campaign_id     String
  lead_source_id  String?  // Links to LeadSource (from Lead Finder)
  crm_lead_id     String?  // Links to Lead (when moved to CRM)

  // Contact Info (cached from LeadSource)
  contact_email   String
  contact_name    String?
  company_name    String

  // Campaign Progress
  status          CampaignLeadStatus @default(SCHEDULED)
  current_step    Int      @default(0)

  // Metrics
  emails_sent     Int      @default(0)
  opened_count    Int      @default(0)
  clicked_count   Int      @default(0)
  replied_count   Int      @default(0)
  bounced         Boolean  @default(false)
  unsubscribed    Boolean  @default(false)

  // Important Dates
  started_at      DateTime?
  last_email_sent_at DateTime?
  last_opened_at  DateTime?
  last_clicked_at DateTime?
  replied_at      DateTime?
  completed_at    DateTime?

  campaign        Campaign @relation(fields: [campaign_id], references: [id], onDelete: Cascade)
  activities      EmailActivity[]

  @@index([campaign_id, status])
  @@index([contact_email])
}

enum CampaignLeadStatus {
  SCHEDULED  // Waiting to start
  SENDING    // In progress
  SENT       // All steps sent
  OPENED     // Opened at least one email
  CLICKED    // Clicked link
  REPLIED    // Replied to email
  OPPORTUNITY // Marked as opportunity (moved to CRM)
  BOUNCED    // Email bounced
  UNSUBSCRIBED // Opted out
}

model EmailActivity {
  id              String   @id @default(cuid())
  campaign_lead_id String

  activity_type   EmailActivityType
  step_number     Int

  // Email Details
  subject_line    String
  from_email      String
  to_email        String
  message_id      String?  // Email Message-ID header

  // Tracking
  ip_address      String?
  user_agent      String?
  link_url        String?  // For click events

  occurred_at     DateTime @default(now())

  campaign_lead   CampaignLead @relation(fields: [campaign_lead_id], references: [id], onDelete: Cascade)

  @@index([campaign_lead_id, activity_type])
  @@index([message_id])
}

enum EmailActivityType {
  SENT
  DELIVERED
  OPENED
  CLICKED
  REPLIED
  BOUNCED
  MARKED_AS_SPAM
  UNSUBSCRIBED
}
```

### 2.4 Campaign Execution Engine

**Background Job (runs every 5 minutes):**
```typescript
// lib/campaignEngine.ts

export async function processCampaigns() {
  const activeCampaigns = await db.campaign.findMany({
    where: { status: "ACTIVE" },
    include: { steps: true, leads: true },
  });

  for (const campaign of activeCampaigns) {
    await processCampaignLeads(campaign);
  }
}

async function processCampaignLeads(campaign: Campaign) {
  const now = new Date();
  const hour = now.getHours();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });

  // Check sending hours
  if (hour < campaign.send_start_hour || hour >= campaign.send_end_hour) {
    return; // Outside sending hours
  }

  // Check sending days
  if (!campaign.send_days.includes(day)) {
    return; // Not a sending day
  }

  // Get leads ready for next step
  const readyLeads = await db.campaignLead.findMany({
    where: {
      campaign_id: campaign.id,
      status: { in: ["SCHEDULED", "SENDING"] },
      unsubscribed: false,
      bounced: false,
    },
    orderBy: { started_at: "asc" },
    take: campaign.daily_limit,
  });

  let sentToday = 0;

  for (const lead of readyLeads) {
    if (sentToday >= campaign.daily_limit) break;

    const nextStep = campaign.steps.find(s => s.step_number === lead.current_step + 1);
    if (!nextStep) {
      // No more steps, mark as completed
      await db.campaignLead.update({
        where: { id: lead.id },
        data: { status: "SENT", completed_at: now },
      });
      continue;
    }

    // Check if enough time has passed
    const delayMs = (nextStep.delay_days * 24 * 60 * 60 * 1000) + (nextStep.delay_hours * 60 * 60 * 1000);
    const lastSentAt = lead.last_email_sent_at || lead.started_at;
    if (lastSentAt && now.getTime() - lastSentAt.getTime() < delayMs) {
      continue; // Not ready yet
    }

    // Check send condition
    if (nextStep.send_condition === "NO_REPLY" && lead.replied_count > 0) {
      continue; // Already replied, skip rest of sequence
    }

    // Send email
    await sendCampaignEmail(campaign, lead, nextStep);
    sentToday++;
  }
}

async function sendCampaignEmail(
  campaign: Campaign,
  lead: CampaignLead,
  step: CampaignStep
) {
  // Replace variables
  const subject = replaceVariables(step.subject_line, lead);
  const bodyHtml = replaceVariables(step.body_html, lead);
  const bodyText = replaceVariables(step.body_text, lead);

  // Add tracking pixels and links
  const trackingPixelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/track/open/${lead.id}/${step.step_number}`;
  const trackedHtml = bodyHtml + `<img src="${trackingPixelUrl}" width="1" height="1" />`;
  const trackedLinks = addLinkTracking(trackedHtml, lead.id, step.step_number);

  // Send via Mailgun
  await sendEmail({
    from: `${campaign.from_name} <${campaign.from_email}>`,
    to: lead.contact_email,
    subject,
    html: trackedLinks,
    text: bodyText,
    headers: {
      "X-Campaign-ID": campaign.id,
      "X-Lead-ID": lead.id,
      "X-Step": step.step_number.toString(),
      "List-Unsubscribe": `<${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe/${lead.id}>`,
    },
  });

  // Record activity
  await db.emailActivity.create({
    data: {
      campaign_lead_id: lead.id,
      activity_type: "SENT",
      step_number: step.step_number,
      subject_line: subject,
      from_email: campaign.from_email,
      to_email: lead.contact_email,
    },
  });

  // Update lead
  await db.campaignLead.update({
    where: { id: lead.id },
    data: {
      current_step: step.step_number,
      emails_sent: { increment: 1 },
      last_email_sent_at: new Date(),
      status: "SENDING",
    },
  });

  // Update campaign
  await db.campaign.update({
    where: { id: campaign.id },
    data: { emails_sent: { increment: 1 } },
  });

  // Update step
  await db.campaignStep.update({
    where: { id: step.id },
    data: { sent_count: { increment: 1 } },
  });
}

function replaceVariables(text: string, lead: CampaignLead): string {
  return text
    .replace(/{{contact_name}}/g, lead.contact_name || "there")
    .replace(/{{company_name}}/g, lead.company_name)
    .replace(/{{first_name}}/g, lead.contact_name?.split(" ")[0] || "there");
}
```

### 2.5 Email Tracking

**Open Tracking:**
```typescript
// app/api/email/track/open/[leadId]/[stepNumber]/route.ts

export async function GET(
  req: Request,
  { params }: { params: { leadId: string; stepNumber: string } }
) {
  const { leadId, stepNumber } = params;

  // Record open
  await db.emailActivity.create({
    data: {
      campaign_lead_id: leadId,
      activity_type: "OPENED",
      step_number: parseInt(stepNumber),
      ip_address: req.headers.get("x-forwarded-for") || "unknown",
      user_agent: req.headers.get("user-agent") || "unknown",
    },
  });

  // Update lead
  await db.campaignLead.update({
    where: { id: leadId },
    data: {
      opened_count: { increment: 1 },
      last_opened_at: new Date(),
      status: "OPENED",
    },
  });

  // Return 1x1 transparent pixel
  return new Response(
    Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"),
    { headers: { "Content-Type": "image/gif" } }
  );
}
```

**Click Tracking:**
```typescript
// app/api/email/track/click/[leadId]/[stepNumber]/route.ts

export async function GET(
  req: Request,
  { params }: { params: { leadId: string; stepNumber: string } }
) {
  const { leadId, stepNumber } = params;
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing target URL", { status: 400 });
  }

  // Record click
  await db.emailActivity.create({
    data: {
      campaign_lead_id: leadId,
      activity_type: "CLICKED",
      step_number: parseInt(stepNumber),
      link_url: targetUrl,
      ip_address: req.headers.get("x-forwarded-for") || "unknown",
      user_agent: req.headers.get("user-agent") || "unknown",
    },
  });

  // Update lead
  await db.campaignLead.update({
    where: { id: leadId },
    data: {
      clicked_count: { increment: 1 },
      last_clicked_at: new Date(),
      status: "CLICKED",
    },
  });

  // Redirect to actual URL
  return Response.redirect(targetUrl);
}
```

---

## 3. Integration with Existing Pipeline

### 3.1 Auto-Move Replied Leads to CRM

**Background Job (monitors replies):**
```typescript
// lib/replyMonitor.ts

export async function monitorReplies() {
  // Get leads who have replied but not yet in CRM
  const repliedLeads = await db.campaignLead.findMany({
    where: {
      replied_count: { gt: 0 },
      crm_lead_id: null, // Not yet in CRM
    },
  });

  for (const campaignLead of repliedLeads) {
    // Create Lead in Pipeline
    const lead = await db.lead.create({
      data: {
        tenant_id: campaignLead.campaign.tenant_id,
        company_name: campaignLead.company_name,
        contact_name: campaignLead.contact_name,
        contact_email: campaignLead.contact_email,
        status: "New Lead",
        source: "Email Campaign",
        notes: `Replied to campaign: ${campaignLead.campaign.name}\nLast reply: ${campaignLead.replied_at}`,
        last_contacted_at: new Date(),
      },
    });

    // Link CampaignLead to CRM Lead
    await db.campaignLead.update({
      where: { id: campaignLead.id },
      data: {
        crm_lead_id: lead.id,
        status: "OPPORTUNITY",
      },
    });

    // Update campaign opportunity count
    await db.campaign.update({
      where: { id: campaignLead.campaign_id },
      data: {
        opportunities_count: { increment: 1 },
      },
    });
  }
}
```

### 3.2 Pipeline View Shows Campaign Source

**Enhance Pipeline table to show source:**
```typescript
// app/dashboard/pipeline/page.tsx

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Company</TableHead>
      <TableHead>Contact</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Source</TableHead> {/* NEW */}
      <TableHead>Last Contacted</TableHead>
      <TableHead>Next Follow-Up</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {leads.map(lead => (
      <TableRow key={lead.id}>
        <TableCell>{lead.company_name}</TableCell>
        <TableCell>{lead.contact_name}</TableCell>
        <TableCell>
          <Badge>{lead.status}</Badge>
        </TableCell>
        <TableCell>
          {lead.source === "Email Campaign" && (
            <Badge variant="secondary">
              📧 Campaign
            </Badge>
          )}
          {lead.source === "Lead Finder" && (
            <Badge variant="secondary">
              🔍 Lead Finder
            </Badge>
          )}
        </TableCell>
        {/* ... */}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 4. Implementation Roadmap

### Phase 1: Lead Finder (Week 3-4)
- [ ] Set up Apollo.io API account
- [ ] Create `LeadSource` model in schema
- [ ] Build Lead Finder UI (filters, search, results)
- [ ] Implement `leadsRouter.search` tRPC procedure
- [ ] Add "Add to Campaign" and "Add to CRM" actions
- [ ] Test with sample searches (Ontario dance studios)

### Phase 2: Campaign Builder (Week 4-5)
- [ ] Create `Campaign`, `CampaignStep`, `CampaignLead` models
- [ ] Build Campaign list view
- [ ] Build Campaign detail view (Analytics tab)
- [ ] Build Sequence Builder (email editor)
- [ ] Add variable replacement ({{contact_name}}, etc.)
- [ ] Test campaign creation and step configuration

### Phase 3: Campaign Execution (Week 5-6)
- [ ] Implement campaign engine (background job)
- [ ] Set up Mailgun for campaign sending
- [ ] Add email tracking (opens, clicks)
- [ ] Add reply detection (Mailgun webhook)
- [ ] Test with small campaign (10 leads)
- [ ] Monitor deliverability and metrics

### Phase 4: Pipeline Integration (Week 6)
- [ ] Auto-move replied leads to Pipeline
- [ ] Add campaign source badges in Pipeline
- [ ] Add email activity timeline in Lead detail
- [ ] Test full flow: Lead Finder → Campaign → Pipeline → Proposal

---

## 5. Costs & Resources

**Monthly Costs:**
- Apollo.io API: $99/month (2,000 credits)
- Mailgun: $35/month (50,000 emails)
- **Total:** ~$134/month

**Development Time:**
- Phase 1 (Lead Finder): 1 week
- Phase 2 (Campaign Builder): 1 week
- Phase 3 (Campaign Execution): 1 week
- Phase 4 (Pipeline Integration): 3 days
- **Total:** ~3.5 weeks

**ROI:**
- Current: Manual prospecting (10-20 leads/month)
- With automation: 100-200 leads/month (10x increase)
- Close rate: 5% → 5-10 new clients/month
- Average client value: $2,500
- **Additional revenue:** $12,500-$25,000/month

---

**End of Spec**
