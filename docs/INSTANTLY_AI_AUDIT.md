# Instantly.ai - Complete Feature Audit for CommandCentered Replication

**Date:** November 16, 2025
**Platform:** Instantly.ai (https://app.instantly.ai)
**Purpose:** Document all features and workflows for recreation in CommandCentered

---

## Executive Summary

Instantly.ai is an AI-powered cold email outreach platform with comprehensive lead generation, campaign management, CRM, and analytics capabilities. The platform combines automated lead finding, multi-step email sequences, unified inbox management, and AI-powered reply assistance.

**Core Value Propositions:**
- AI-powered lead generation and prospecting
- Automated multi-step email campaigns with A/B testing
- Unified inbox across multiple email accounts
- CRM with lead tracking and pipeline management
- Email deliverability optimization (warmup, inbox placement testing)
- AI agents for automated email replies

**Technology Stack (Observed):**
- Frontend: Next.js (React-based, evident from `_next/static/` paths)
- Real-time features: WebSocket connections for live updates
- Third-party integrations: Intercom (customer support), analytics tracking
- Multi-account email management via IMAP/SMTP connections

---

## 1. Navigation Structure

### Primary Navigation (Left Sidebar)

**Top Section - Core Workflow:**
1. **Copilot** (AI Assistant) - Chat interface with quick actions
2. **Lead Finder** (SuperSearch) - AI-powered lead generation
3. **Email Accounts** - Email account management and warmup monitoring
4. **Campaigns** - Campaign creation and management
5. **Unibox** - Unified inbox for all connected accounts
6. **Analytics** - Performance metrics and reporting
7. **CRM** - Lead tracking and pipeline management
8. **Website Visitors** - Track who visits your website
9. **Inbox Placement** - Email deliverability testing
10. **AI Agents** - Automated reply agents configuration

**Bottom Section - Settings/Tools:**
- Settings/Configuration
- Accelerator (onboarding/tips)
- User profile dropdown

**Top Bar:**
- Current page title
- Credits remaining badge (e.g., "64 credits")
- "Get All Features" upgrade button
- Organization selector dropdown ("My Organization...")

---

## 2. Feature Breakdown by Section

### 2.1 Copilot (AI Assistant)

**URL:** `/app/copilot`

**Purpose:** AI-powered assistant for campaign creation, lead finding, analytics, and general workspace management.

**Features:**
- **Chat Interface:**
  - Natural language input field: "Ask Instantly AI or type / to see prompts..."
  - Voice input button (microphone icon)
  - File attachment button
  - Chat history sidebar with previous conversations

- **Quick Action Buttons:**
  1. Find Ideal Prospects
  2. Generate a Full Campaign
  3. Write a Sequence
  4. Campaign Ideas
  5. Weekly Analytics
  6. Best Performing Campaigns
  7. Get Advice
  8. Audit My Workspace

- **Sidebar Navigation:**
  - New chat
  - Memory (AI context/preferences)
  - Tasks (AI-generated task list)
  - Settings (Copilot configuration)
  - Chat history organized by date ("Older")

- **Stats Display:**
  - Actions: 86
  - Time saved: 8 hours

**CommandCentered Equivalent:**
This maps to the **AI Voice Agent** feature in CommandCentered. Instead of chat-only, CommandCentered will support both voice and text input for event/operator/kit management.

---

### 2.2 Lead Finder (SuperSearch)

**URL:** `/app/lead-finder`

**Purpose:** AI-powered B2B lead discovery with advanced filtering.

**Features:**

**AI Search:**
- Natural language search bar
- Example: "Engineers in New York in software companies with more than 500 employees"
- "AI Search" button to execute

**Manual Filters (Left Sidebar):**
- **Skip already owned** - Checkbox to exclude existing contacts
- **Job Titles** - Expandable multi-select
- **Location** - Combobox with autocomplete
- **Industry and Keywords** - Expandable tags input
- **Employees** - Range input (min-max)
- **Revenue** - Range input (min-max revenue)
- **Lookalike domain** - Text input (e.g., "google.com")
- **Domains** - Multi-value text input with tag chips
- **Job Listing** - Combobox (appears disabled, premium feature)
- **Technologies** - Multi-value tags
- **News** - Keyword search for recent company news
- **Funding Type** - Multi-select (Seed, Series A, etc.)
- **Name** - Person name search (appears disabled)
- **Company Name** - Expandable multi-select
- **One lead per company** - Checkbox

**Saved/Recent Searches:**
- Saved Searches section (empty state: "No saved searches")
- Recent Searches section (empty state: "No saved searches")

**Top Tabs:**
- SuperSearch (current view)
- Lead Lists (imported/saved lead lists)

**CommandCentered Equivalent:**
Not directly applicable. CommandCentered focuses on internal operations (operators, events, kits) rather than external lead generation. However, the **Pipeline** feature has some CRM-like lead tracking for prospective clients.

---

### 2.3 Email Accounts

**URL:** `/app/accounts`

**Purpose:** Manage connected email accounts, monitor warmup health, and track sending limits.

**Features:**

**Account List:**
- **Columns:**
  - Checkbox (bulk select)
  - Email address
  - Emails sent (current/limit, e.g., "0 of 30")
  - Health score (percentage with color coding, e.g., "100%")
  - Actions (View account, more options)

**Current Accounts:**
1. daniel@streamstageproductions.com - 0 of 30 sent, 100% health
2. info@studiosage.ai - 0 of 30 sent, 100% health

**Top Actions:**
- Search bar
- Filter: "All statuses" dropdown
- Grid/list view toggle
- **"+ Add New"** button (primary action)

**Account Detail View (inferred):**
- SMTP/IMAP configuration
- Daily sending limit settings
- Warmup schedule configuration
- Warmup health monitoring
- Email signature settings
- Reply-to configuration

**CommandCentered Equivalent:**
Not directly applicable. CommandCentered uses Mailgun for transactional emails (invoices, confirmations) but doesn't manage multiple sending accounts for cold outreach. The **Communications** page in CommandCentered handles email automation triggers (show program reminders, rebooking follow-ups).

---

### 2.4 Campaigns

**URL:** `/app/campaigns`

**Purpose:** Create, manage, and monitor multi-step email outreach campaigns.

**Features:**

**Campaign List View:**
- **Columns:**
  - Checkbox (bulk select)
  - Name
  - Status (Draft, Active, Paused, Completed)
  - Progress (percentage + progress bar)
  - Sent (total emails sent)
  - Click (total link clicks)
  - Replied (count + percentage)
  - Opportunities (count + potential revenue)
  - Actions (edit, duplicate, delete)

**Sample Campaigns:**
1. **RentechDemo** - Draft, no stats yet
2. **Lead Collection** - Draft, no stats yet
3. **Recital Video StreamStage** - Completed, 19% progress, 81 sent, 1 click, 1 reply (5.9%)

**Top Actions:**
- Search bar
- Filter: "All statuses" dropdown
- Sort: "Newest first" dropdown
- Grid/list view toggle
- **"+ Add New"** button (create campaign)

**Campaign Detail View (Analytics Tab):**

**URL:** `/app/campaign/{id}/analytics`

**Header:**
- Campaign name breadcrumb
- Back arrow to campaigns list
- Play/pause button (campaign control)
- More options menu

**Progress Bar:**
- Overall completion percentage (e.g., "0% completed")
- Visual progress bar

**Tabs:**
- **Analytics** (current)
- **Leads** (lead list for this campaign)
- **Sequences** (email sequence builder)
- **Schedule** (sending schedule configuration)
- **Options** (campaign settings)
- **Subsequences** (conditional follow-up sequences)

**Analytics Tab Content:**

**Status Summary:**
- Status badge (Completed, Active, etc.)
- Progress percentage with mini progress bar

**Key Metrics (Cards):**
1. **Sequence started:** 17
2. **Open rate:** 71% | 12 (opens)
3. **Click rate:** 6% | 1 (clicks)
4. **Opportunities:** 0 | $0
5. **Conversions:** 0 | $0

**Time Range Filter:**
- "Last 4 weeks" dropdown
- Share button (export/share analytics)

**Performance Chart:**
- Line chart with toggleable metrics:
  - Sent
  - Total opens
  - Unique opens
  - Total replies
  - Total clicks
  - Unique clicks
- X-axis: Date range (e.g., Oct 17 - Nov 16)
- Y-axis: Count (0-12)
- Export options: Download SVG, PNG, CSV

**Step Analytics Table:**
- Tabs: "Step Analytics" | "Activity"
- **Columns:**
  - STEP (Step 1, Step 2, etc.)
  - SENT (emails sent at this step)
  - OPENED (opens + percentage)
  - REPLIED (replies + percentage)
  - CLICKED (clicks + percentage)
  - OPPORTUNITIES (count)

**A/B Testing:**
- Each step shows variant performance (e.g., "A" variant)
- Checkbox to enable/disable variants

**Sample Step Analytics:**
- Step 1 (Variant A): 17 sent, 11 opened (64.71%), 0 replied, 0 clicked
- Step 2 (Variant A): 12 sent, 8 opened (66.67%), 0 replied, 0 clicked
- Step 3 (Variant A): 17 sent, 9 opened (52.94%), 0 replied, 1 clicked (5.88%)
- Step 4 (Variant A): 25 sent, 10 opened (40%), 1 replied (4%), 0 clicked
- Step 5 (Variant A): 10 sent, 3 opened (30%), 0 replied, 0 clicked

**CommandCentered Equivalent:**
The **Communications** page in CommandCentered handles automated email triggers, but doesn't have multi-step sequences. The closest analog is the **Event Pipeline** on the Dashboard, which tracks client progression through stages (Proposal → Contract → Payment → Execution → Delivered).

**Potential CommandCentered Enhancement:**
Add a "Communication Sequences" feature to automate multi-touchpoint client engagement (e.g., proposal sent → 48h follow-up → 1 week reminder → close-out).

---

### 2.5 Unibox (Unified Inbox)

**URL:** `/app/unibox`

**Purpose:** Single unified inbox showing emails from all connected accounts with conversation management.

**Features:**

**Filters (Left Sidebar):**
- **Status** - Filter by read/unread, replied/not replied
- **All Campaigns** - Filter by specific campaign
- **All Inboxes** - Filter by specific email account
- **More** - Additional filters

**Tabs:**
- **Primary** - Important emails (default)
- **Others** - Less important emails

**Search:**
- "Search mail" input field
- Search icon button

**Email List:**
- **Columns (per email):**
  - Avatar/icon
  - Checkbox (for selection)
  - Sender email address
  - Date received
  - Subject line
  - Preview snippet
  - Star/important indicator
  - Reply reminder badge (e.g., "Received 10 days ago. Reply?")

**Sample Emails:**
1. invoice+statements@stripe.com - Nov 16 - "Your receipt from Instantly #2952-8894"
2. empwrdance@gmail.com - Nov 8 - "Re: Kim reply"
3. info@woodstockdanceyoga.com - Nov 7 - "Re: Black Friday" (with reply reminder)
4. daniel@streamstageproductions.com - Oct 28 - "Secure your recital date before Dec 31"
5. info@woodstockdanceyoga.com - Oct 6 - "Re: Your customized contract"
6. danieljohnabrahamson@gmail.com - Oct 2 - "Proposal Submitted"
7. info@woodstockdanceyoga.com - Sep 22 - "Re: Still Waiting on Last Years Recital Video?"
8. misslaura@grandriverdance.com - Sep 11 - "Re: Extra DVDs"
9. misslaura@grandriverdance.com - Sep 9 - "Extra DVDs"

**Bottom Actions:**
- "Load more" button (pagination)

**Right Panel (Email Detail - not shown in current view):**
- Full email conversation thread
- Reply composer
- Quick actions (mark as opportunity, assign to campaign, etc.)

**Mobile App Promotion:**
- QR code for Unibox mobile app download
- "Stay connected. Take Unibox with you anywhere."

**CommandCentered Equivalent:**
Not directly applicable. CommandCentered doesn't have a unified inbox feature. However, the **Communications** page could be enhanced to show a log of all automated emails sent to clients/operators.

---

### 2.6 Analytics

**URL:** `/app/analytics/overview`

**Purpose:** Workspace-wide analytics across all campaigns and accounts.

**Features:**

**Top Actions:**
- **Share** - Export/share analytics report
- **Filter** - Campaign/account filters
- **Last 4 weeks** - Time range dropdown
- Settings gear icon

**Key Metrics (Cards):**
1. **Total sent:** 81
2. **Open rate:** 70.59%
3. **Click rate:** 5.88%
4. **Reply rate:** 5.88%
5. **Opportunities:** 0 | $0

**Performance Chart:**
- Line chart with toggleable metrics (same as campaign view)
- Date range: Last 4 weeks
- Export options: SVG, PNG, CSV

**Tabs:**
- **Campaign Analytics** (current)
- **Account Analytics** (performance by email account)

**Campaign Analytics Table:**
- **Columns:**
  - CAMPAIGN (name + status)
  - SEQUENCE STARTED
  - OPENED (count + percentage)
  - REPLIED (count + percentage)
  - OPPORTUNITIES (count + revenue)
  - ACTIONS

**Sample Row:**
- Recital Video StreamStage (Completed) - 17 started, 12 opened (70.6%), 1 replied (5.9%), 0 opportunities

**CommandCentered Equivalent:**
CommandCentered's **Dashboard** serves a similar purpose, showing:
- Event Pipeline (Proposal → Delivered stages)
- Annual Revenue Summary (motivational progress bar)
- Upcoming Events widget
- Recent Activity feed
- Alert/notification widgets

**Enhancement Opportunity:**
Add email analytics to the Dashboard to track automated email performance (open rates, click rates for proposals/contracts/invoices).

---

### 2.7 CRM

**URL:** `/app/crm`

**Purpose:** Lead and contact management with email/call/SMS tracking.

**Features:**

**Top Tabs:**
- **Everything** (all interactions)
- **Emails**
- **Calls**
- **SMS**
- **Tasks**

**Left Sidebar Sections:**
1. **Inbox (4 items)** - Expandable section
   - Done (completed items)
   - Upcoming (future tasks)
2. **Opportunities** - Leads marked as opportunities
3. **All Leads** - Complete lead database
4. **Lists** - Custom lead lists/segments
5. **Campaigns** - CRM view of campaigns
6. **Salesflows** - Automated sales workflows
7. **Website Visitors** - Visitors tracked via pixel
8. **Reports** - CRM reporting

**Main Content Area (Inbox View):**

**Top Actions:**
- Checkbox (select all)
- Filter: "All statuses"
- Sort: "Newest first"
- Filter: "All Users" (team member filter)

**Lead/Contact List:**
- **Columns:**
  - Checkbox
  - Avatar icon
  - Contact email/name
  - Status indicator
  - Subject/last interaction
  - Date
  - Expandable detail panel (right side)

**Sample Leads in Inbox:**
1. support@instantly.ai - Nov 16 - "Your receipt from Instantly #2952-8894"
2. info@oadance.com - Nov 8 - "Re: Kim reply"
3. info@woodstockdanceyoga.com - Nov 7 - "Re: Black Friday"
4. info@legendsacademycambridge.com - Oct 28 - "Secure your recital date before Dec 31"

**Lead Detail Panel (inferred from structure):**
- Contact information
- Email/call/SMS history
- Tasks and notes
- Tags and custom fields
- Pipeline stage
- Deal value
- Last contacted date
- Next follow-up date

**CommandCentered Equivalent:**
CommandCentered's **Pipeline** page (section 2 of COMPLETE_PAGE_LAYOUTS.md) serves as the CRM, with features like:
- Lead status tracking (New Lead → Proposal Sent → Contract Sent → Paid → Scheduled)
- CRM fields: Last Contacted, Next Follow-Up, Contact Frequency
- Product/service tracking (multi-depth: 4 products per client)
- Revenue tracking
- Notes and tags

**Alignment:**
CommandCentered's CRM is well-aligned with Instantly's approach, but tailored for event/production management rather than cold outreach.

---

### 2.8 Website Visitors

**URL:** `/app/website-visitors`

**Purpose:** Track and identify companies visiting your website via tracking pixel.

**Features:**

**Left Sidebar:**
- **Website Visitors** (current section)
- **Setup** - Configuration and pixel installation
- **Billing** - Visitor tracking pricing

**Main Content (Empty State):**
- "0 website visitors"
- Time range filter: "Last 7 days"
- Filter button
- "Create View" button (custom views/segments)
- **Complete Setup** button (primary CTA)
- "See Video" link (Loom tutorial)
- Illustration graphic (empty state)

**Expected Features (when set up):**
- Company identification (domain, company name, employee count)
- Visitor behavior tracking (pages visited, time on site)
- Lead enrichment (append visitor data to CRM)
- Alerts for high-value visitors
- Integration with campaigns (auto-add visitors to sequences)

**CommandCentered Equivalent:**
Not applicable. CommandCentered is a private event management system, not a marketing tool.

---

### 2.9 Inbox Placement

**URL:** `/app/inbox-placement`

**Purpose:** Test email deliverability across major email providers.

**Features:**

**Main Content (Empty State):**
- "👋 Add a new test to get started"
- Search bar
- Filter: "All statuses"
- Sort: "Newest first"
- **"+ Add New"** button (create test)

**Expected Features (when set up):**
- Email provider testing (Gmail, Outlook, Yahoo, etc.)
- Inbox/spam folder placement reporting
- Authentication checks (SPF, DKIM, DMARC)
- Sender reputation monitoring
- Recommendations for deliverability improvement

**CommandCentered Equivalent:**
Not applicable. CommandCentered uses Mailgun for transactional emails, which handles deliverability monitoring.

---

### 2.10 AI Agents

**URL:** `/app/ai-agents`

**Purpose:** Configure AI-powered automation agents for email replies and lead qualification.

**Features:**

**Agent List:**
- **Columns:**
  - NAME (agent name)
  - STATUS (Active/Inactive)
  - TYPE (AI Reply Agent, Lead Qualifier, etc.)
  - CONFIGURATION TYPE (HITL, Fully Automated, etc.)
  - EXECUTIONS (number of times agent has run)
  - ACTIONS (edit, delete, view logs)

**Current Agent:**
- **Name:** Default Inbox Manager Agent
- **Status:** Active (green badge)
- **Type:** AI Reply Agent
- **Configuration:** HITL (Human-In-The-Loop)
- **Executions:** 29

**Top Actions:**
- Search bar
- Sort: "Newest first"
- **"+ Add New"** button (create agent)

**Agent Types (inferred):**
1. **AI Reply Agent** - Auto-respond to incoming emails
2. **Lead Qualifier** - Score and categorize leads
3. **Meeting Scheduler** - Auto-schedule meetings
4. **Opportunity Detector** - Flag high-intent replies

**Configuration Types:**
- **HITL (Human-In-The-Loop)** - Agent suggests, human approves
- **Fully Automated** - Agent executes without approval
- **Review Mode** - Agent drafts, human edits before sending

**CommandCentered Equivalent:**
CommandCentered has an **AI Voice Agent** feature (MASTER_SPECIFICATION_FINAL.md) with full CRUD capabilities:
- Voice input: "Create an event for Woodstock Dance, June 15th, 4-camera shoot"
- Text input: Natural language commands
- Context awareness: Understands "add 2 cameras to the June 15 event"
- Multi-operation: "Create kit, assign to event, and notify operators"

**Enhancement Opportunity:**
Add AI agents for automated operator communication:
- "Gig sheet ready" auto-notification
- "Availability request" auto-follow-up
- "Footage uploaded" confirmation check

---

## 3. Key Workflows

### 3.1 Lead Generation → Campaign Creation

**Workflow:**
1. **Lead Finder:** Search for leads using AI or manual filters
2. **Save Leads:** Export leads to a list
3. **Create Campaign:** Click "+ Add New" in Campaigns
4. **Build Sequence:** Add email steps (Step 1, Step 2, etc.)
5. **Assign Leads:** Attach lead list to campaign
6. **Configure Schedule:** Set sending times and daily limits
7. **Launch Campaign:** Activate campaign to start sending

**CommandCentered Equivalent:**
1. **Pipeline:** Add new lead manually or via web form
2. **Proposal Builder:** Create customized proposal
3. **Send Proposal:** Email proposal to client
4. **Track Pipeline:** Monitor lead status (Proposal Sent → Contract Sent → Paid)
5. **Create Event:** Convert paid lead to scheduled event

---

### 3.2 Email Account Warmup

**Workflow:**
1. **Add Email Account:** Connect via SMTP/IMAP
2. **Configure Warmup:** Set warmup schedule (gradual sending increase)
3. **Monitor Health:** Check health score daily (aim for 100%)
4. **Adjust Limits:** Increase daily sending limit as health improves
5. **Go Live:** Start sending campaigns once warmup complete

**CommandCentered Equivalent:**
Not applicable. CommandCentered doesn't use warmup since it sends transactional emails (not cold outreach).

---

### 3.3 Campaign Monitoring → Opportunity Conversion

**Workflow:**
1. **Launch Campaign:** Activate campaign
2. **Monitor Analytics:** Check open rates, click rates, reply rates
3. **Review Replies:** Unibox shows all incoming replies
4. **Mark Opportunities:** Flag high-intent replies as opportunities
5. **Move to CRM:** Assign opportunity value and next follow-up
6. **Close Deal:** Track conversion in CRM

**CommandCentered Equivalent:**
1. **Send Proposal:** Email proposal via Proposal Builder
2. **Monitor Pipeline:** Check Pipeline page for status updates
3. **Follow Up:** Manual or automated follow-up emails (Communications page)
4. **Client Responds:** Client signs contract and pays
5. **Create Event:** Convert to scheduled event in Planning page
6. **Execution:** Assign operators, create shifts, execute event

---

### 3.4 AI Copilot Assistance

**Workflow:**
1. **Open Copilot:** Click Copilot in sidebar
2. **Ask Question:** Type or speak query (e.g., "Show me my best performing campaigns")
3. **Review Results:** AI provides analytics, insights, or action suggestions
4. **Take Action:** Click suggested actions (e.g., "Duplicate this campaign")
5. **Iterate:** Ask follow-up questions

**CommandCentered Equivalent:**
1. **Activate AI Agent:** Voice or text input from Dashboard
2. **Command:** "Show me all events for June"
3. **AI Responds:** Lists events with details
4. **Follow-Up:** "Add a 5th camera to the June 15 event"
5. **Confirmation:** AI executes and confirms

---

## 4. Data Model (Inferred)

### Core Entities

**1. User/Account**
- user_id
- email
- organization_id
- role (Admin, User, Viewer)
- created_at

**2. Organization**
- organization_id
- name
- plan (Free, Growth, Hyper Growth)
- credits_remaining
- created_at

**3. EmailAccount**
- email_account_id
- user_id
- email_address
- smtp_host
- smtp_port
- imap_host
- imap_port
- daily_limit (e.g., 30 emails/day)
- warmup_status (Active, Paused, Complete)
- health_score (0-100%)
- emails_sent_today
- created_at

**4. Lead**
- lead_id
- email
- first_name
- last_name
- company_name
- job_title
- location
- industry
- employee_count
- revenue
- technologies (JSON array)
- source (SuperSearch, Import, Manual)
- status (New, Contacted, Replied, Opportunity, Converted, Lost)
- opportunity_value
- last_contacted_at
- next_follow_up_at
- created_at

**5. LeadList**
- list_id
- user_id
- name
- description
- lead_count
- created_at

**6. LeadListMembership**
- lead_id
- list_id
- added_at

**7. Campaign**
- campaign_id
- user_id
- name
- status (Draft, Active, Paused, Completed)
- progress_percentage
- sequence_started_count
- opened_count
- clicked_count
- replied_count
- opportunities_count
- conversions_count
- opportunity_revenue
- conversion_revenue
- created_at
- launched_at

**8. CampaignSequenceStep**
- step_id
- campaign_id
- step_number (1, 2, 3, etc.)
- delay_days (e.g., 3 days after previous step)
- delay_hours
- subject_line
- body_html
- body_text
- include_unsubscribe_link (boolean)
- created_at

**9. CampaignSequenceVariant**
- variant_id
- step_id
- variant_letter (A, B, C)
- subject_line
- body_html
- body_text
- is_active (boolean)
- sent_count
- opened_count
- clicked_count
- replied_count

**10. CampaignLead**
- campaign_lead_id
- campaign_id
- lead_id
- current_step_id
- status (Scheduled, Sending, Sent, Opened, Clicked, Replied, Bounced, Unsubscribed)
- started_at
- completed_at

**11. EmailActivity**
- activity_id
- campaign_lead_id
- email_account_id
- activity_type (Sent, Delivered, Opened, Clicked, Replied, Bounced, Marked as Spam)
- step_id
- variant_id
- occurred_at
- ip_address (for opens/clicks)
- user_agent (for opens/clicks)
- link_url (for clicks)

**12. Conversation**
- conversation_id
- lead_id
- email_account_id
- campaign_id (nullable)
- subject
- last_message_at
- is_read (boolean)
- is_starred (boolean)
- status (Inbox, Done, Archived)

**13. Message**
- message_id
- conversation_id
- direction (Inbound, Outbound)
- from_email
- to_email
- subject
- body_html
- body_text
- sent_at
- received_at

**14. AIAgent**
- agent_id
- user_id
- name
- type (AI Reply Agent, Lead Qualifier, Meeting Scheduler)
- configuration_type (HITL, Fully Automated, Review Mode)
- is_active (boolean)
- execution_count
- prompt_template
- created_at

**15. AIAgentExecution**
- execution_id
- agent_id
- conversation_id (nullable)
- lead_id (nullable)
- input_data (JSON)
- output_data (JSON)
- status (Pending, Approved, Rejected, Executed)
- executed_at

---

## 5. UI/UX Patterns

### Design System

**Colors:**
- Primary blue: `#4A7DFF` (buttons, active states)
- Success green: `#10B981` (completed status, health score 100%)
- Warning orange: `#F59E0B` (draft status, low health)
- Error red: `#EF4444` (failed, bounced)
- Neutral grays: `#F3F4F6` (backgrounds), `#6B7280` (text secondary)

**Typography:**
- Sans-serif font (appears to be Inter or similar)
- Headers: Bold, larger sizes
- Body: Regular weight, 14-16px
- Metrics: Large bold numbers for key stats

**Iconography:**
- Simple line icons (feather-style)
- Consistent icon set throughout
- Icons used for navigation, actions, status indicators

**Spacing:**
- Consistent 8px grid system
- Generous padding in cards and containers
- Clear visual hierarchy with spacing

**Components:**

**1. Card Component:**
- White background
- Subtle shadow
- Rounded corners (8px)
- Padding: 16-24px
- Used for: Metric cards, list items, detail panels

**2. Table Component:**
- Sticky header row
- Alternating row colors (subtle zebra striping)
- Hover states on rows
- Action buttons on hover
- Sortable columns

**3. Button Styles:**
- **Primary:** Blue background, white text
- **Secondary:** White background, gray border, gray text
- **Ghost:** No background, icon only, appears on hover
- **Icon buttons:** Circular, subtle background on hover

**4. Filter/Dropdown:**
- Pill-shaped background
- Dropdown arrow icon
- Opens modal/popover for complex filters

**5. Progress Bar:**
- Thin horizontal bar
- Color-coded (green for complete, blue for in-progress)
- Percentage label

**6. Badge/Chip:**
- Small rounded pill
- Color-coded by status (green, orange, gray, red)
- Uppercase text in some cases

**7. Empty States:**
- Centered illustration
- Large heading
- Descriptive text
- Primary CTA button
- Often includes video tutorial link

**8. Search Input:**
- Icon prefix (magnifying glass)
- Placeholder text
- Full-width or fixed width depending on context

**CommandCentered Alignment:**
CommandCentered's UX_SPECIFICATION_LOCKED.md defines a "tactical aesthetic" with:
- Dark mode optimized
- Military/command center vibe (vs. Instantly's clean SaaS aesthetic)
- High information density
- Grid-based layouts
- Prominent status indicators

**Key Difference:** Instantly uses a light, airy SaaS design. CommandCentered aims for a more data-dense, tactical interface. Both approaches are valid for their respective use cases.

---

## 6. CommandCentered Feature Mapping

### Features to Replicate

**1. AI Assistant (Copilot → CommandCentered AI Voice Agent)**
- ✅ **Already Planned:** CommandCentered has AI Voice Agent in spec
- **Enhancements from Instantly:**
  - Add quick action buttons (e.g., "Show upcoming events," "Operator availability this week")
  - Add stats display (e.g., "Actions completed: 86," "Time saved: 8 hours")
  - Add chat history sidebar (previous voice/text interactions)
  - Add "Memory" feature (AI remembers preferences, frequently used kits, etc.)

**2. Unified Dashboard (Analytics → CommandCentered Dashboard)**
- ✅ **Already Planned:** Dashboard with Event Pipeline, Annual Revenue, Upcoming Events
- **Enhancements from Instantly:**
  - Add time range filters ("Last 4 weeks," "Last 3 months," etc.)
  - Add "Share" button to export dashboard reports
  - Add performance chart (e.g., events completed over time, revenue trend)

**3. CRM Inbox (CRM Inbox → CommandCentered Communications)**
- ⚠️ **Partially Planned:** Communications page handles email automation triggers
- **Enhancements from Instantly:**
  - Add "Inbox" section showing all automated emails sent
  - Add "Done" and "Upcoming" subsections
  - Add email open/click tracking for proposals and contracts
  - Add reply detection and threading

**4. Lead/Client Pipeline (CRM Pipeline → CommandCentered Pipeline)**
- ✅ **Already Planned:** Pipeline with CRM fields (Last Contacted, Next Follow-Up, Contact Frequency)
- **Alignment:** CommandCentered's Pipeline is well-aligned with Instantly's CRM
- **Enhancements from Instantly:**
  - Add "Opportunities" vs. "All Leads" split view
  - Add custom lists/segments (e.g., "Dance Recitals," "Corporate Events")
  - Add bulk actions (e.g., "Move selected to Proposal Sent")

**5. Campaign-Style Automation (Campaigns → CommandCentered Communication Sequences)**
- ❌ **Not Currently Planned**
- **New Feature Opportunity:**
  - Create "Communication Sequences" for multi-touchpoint client engagement
  - Example sequence: Proposal sent → 48h follow-up → 1 week reminder → Close-out
  - Track open rates, click rates, reply rates per sequence step
  - A/B test subject lines and email copy

**6. Analytics & Reporting (Analytics → CommandCentered Dashboard + Reports)**
- ⚠️ **Partially Planned:** Dashboard has widgets, but no dedicated Reports section
- **New Feature Opportunity:**
  - Add "Reports" page with downloadable reports (PDF, CSV)
  - Event performance by month/quarter/year
  - Operator utilization rates
  - Revenue breakdown by service type
  - Client acquisition cost and lifetime value

### Features NOT to Replicate

**1. Lead Finder (SuperSearch)**
- **Reason:** CommandCentered is for internal operations, not lead generation
- **Alternative:** Clients come from external marketing (website, referrals, etc.)

**2. Email Account Management**
- **Reason:** CommandCentered uses Mailgun for transactional emails, doesn't need multi-account warmup
- **Alternative:** Mailgun handles deliverability and reputation management

**3. Inbox Placement Testing**
- **Reason:** Not needed for transactional emails
- **Alternative:** Mailgun provides deliverability monitoring

**4. Website Visitors Tracking**
- **Reason:** CommandCentered is a private SaaS tool, not a marketing platform
- **Alternative:** Google Analytics for website traffic (separate from app)

**5. AI Agents (Email Auto-Reply)**
- **Reason:** CommandCentered doesn't have inbound email management (yet)
- **Potential Future:** If adding "Client Portal" with messaging, could add AI auto-responders

---

## 7. Technical Implementation Notes

### Architecture Patterns (Observed)

**1. Real-Time Updates:**
- WebSocket connections for live data (e.g., campaign stats updating)
- Server-sent events for notifications
- **CommandCentered:** Use Supabase Realtime for live updates (already planned)

**2. Infinite Scroll / Pagination:**
- "Load more" buttons for long lists (emails, leads)
- Lazy loading of data to improve performance
- **CommandCentered:** Implement pagination on Planning page (month view with many events)

**3. Optimistic UI:**
- Instant feedback when clicking actions (e.g., starring an email)
- Background sync to server
- **CommandCentered:** Use for operator availability toggling (instant UI update, sync to DB)

**4. Batch Operations:**
- Checkbox selection for bulk actions (e.g., delete multiple campaigns)
- Action bar appears when items selected
- **CommandCentered:** Add to Planning page (bulk assign operators to shifts)

**5. Empty States:**
- Clear call-to-action when no data exists
- Helpful onboarding (e.g., "Complete Setup" button, video tutorial)
- **CommandCentered:** Add empty states for new tenants (e.g., "Create your first event")

**6. Toast Notifications:**
- Success/error messages appear briefly at top/bottom
- Auto-dismiss after 3-5 seconds
- **CommandCentered:** Use for action confirmations (e.g., "Operator assigned to shift")

**7. Modal Workflows:**
- Complex actions in modals (e.g., creating a campaign)
- Multi-step wizards for onboarding
- **CommandCentered:** Already using modals for Kit Creation, Event Detail, etc.

**8. Search & Filtering:**
- Client-side filtering for small datasets (< 100 items)
- Server-side search for large datasets (leads, emails)
- Debounced search input (300ms delay)
- **CommandCentered:** Implement server-side search for Gear Inventory (9 categories, many items)

### Performance Optimizations (Observed)

**1. Code Splitting:**
- Next.js automatic code splitting (evident from `_next/static/chunks/pages/` URLs)
- Lazy load heavy components (e.g., chart library)
- **CommandCentered:** Use Next.js 14 App Router with automatic code splitting

**2. Image Optimization:**
- Next.js Image component for responsive images
- WebP format for illustrations
- **CommandCentered:** Use for operator avatars, event photos

**3. Data Fetching:**
- React Query or SWR for data caching (inferred from fast navigation)
- Prefetch data on hover (e.g., hovering over campaign prefetches detail page)
- **CommandCentered:** Use tRPC with React Query for caching

**4. CDN & Caching:**
- Static assets served from CDN
- Aggressive caching headers for JS/CSS
- **CommandCentered:** Vercel Edge Network handles this automatically

---

## 8. Screenshots Reference

**Captured Screenshots:**
1. `instantly-01-copilot.png` - AI Assistant interface
2. `instantly-02-lead-finder.png` - SuperSearch with filters
3. `instantly-03-email-accounts.png` - Email account list
4. `instantly-04-campaigns.png` - Campaign list view
5. `instantly-05-unibox.png` - Unified inbox
6. `instantly-06-analytics.png` - Analytics dashboard
7. `instantly-07-crm.png` - CRM inbox view
8. `instantly-08-website-visitors.png` - Website visitors (empty state)
9. `instantly-09-inbox-placement.png` - Inbox placement (empty state)
10. `instantly-10-ai-agents.png` - AI Agents list
11. `instantly-11-campaign-analytics.png` - Campaign detail analytics

---

## 9. Next Steps for CommandCentered

### Immediate Priorities (Week 2-3)

**1. Validate Schema Against Instantly Patterns:**
- ✅ Review `schema.prisma` to ensure support for:
  - Multi-step communication sequences (if adding this feature)
  - Email tracking (opens, clicks, replies)
  - AI agent execution logs
  - Pipeline status transitions

**2. Enhance Specifications:**
- **MASTER_SPECIFICATION_FINAL.md:**
  - Add "Communication Sequences" feature (optional, inspired by Campaigns)
  - Add email analytics to Communications page (open/click tracking)
  - Add bulk actions to Planning page (multi-shift assignment)
- **COMPLETE_PAGE_LAYOUTS.md:**
  - Add "Reports" page layout (downloadable analytics)
  - Add empty states to all pages (onboarding-friendly)
- **UX_SPECIFICATION_LOCKED.md:**
  - Define toast notification patterns
  - Define empty state patterns
  - Define bulk action UI patterns

**3. Create API_SPEC.md:**
- Document all tRPC procedures inspired by Instantly's workflows:
  - `ai.chat.send` (Copilot chat)
  - `ai.quickAction` (Copilot quick actions)
  - `events.list` (with filters, search, pagination)
  - `operators.bulkAssign` (bulk shift assignment)
  - `communications.trackOpen` (email open tracking)
  - `communications.trackClick` (email click tracking)
  - `reports.generate` (downloadable reports)

### Medium-Term Enhancements (Week 4-6)

**1. Communication Sequences (New Feature):**
- Multi-step automated client communication
- Open/click tracking for proposals and contracts
- A/B testing for email subject lines
- Sequence analytics (conversion rates by step)

**2. Enhanced Analytics:**
- Performance charts (events over time, revenue trend)
- Operator utilization reports
- Client lifetime value calculations
- Downloadable reports (PDF, CSV, Excel)

**3. AI Agent Enhancements:**
- Quick action buttons in Copilot interface
- Chat history sidebar
- AI "Memory" feature (preferences, frequently used kits)
- Stats display (actions completed, time saved)

### Long-Term Opportunities (Week 7-10)

**1. Client Portal with Messaging:**
- Magic link access for clients (already planned)
- Add messaging/chat between client and Commander
- AI auto-responders for common questions
- Email-to-message threading (like Unibox)

**2. Advanced Pipeline Management:**
- Custom lead segments/lists (e.g., "Dance Recitals," "Corporate Events")
- Opportunities vs. All Leads split view
- Bulk pipeline actions (e.g., "Move 10 leads to Proposal Sent")
- Pipeline stage automation (e.g., auto-move to "Contract Sent" when contract signed)

**3. Mobile Commander App:**
- Mobile dashboard (similar to Instantly's mobile app promotion)
- Push notifications for operator responses, client replies
- Quick actions (approve shifts, respond to messages)
- Voice input for AI commands on-the-go

---

## 10. Conclusion

Instantly.ai provides excellent patterns for CommandCentered to adopt, particularly in:
1. **AI Assistant UX** - Quick actions, chat history, stats display
2. **Analytics Dashboard** - Time range filters, performance charts, exportable reports
3. **CRM Inbox** - Unified view of all communications, threaded conversations
4. **Campaign-Style Automation** - Multi-step sequences with tracking and analytics
5. **Empty States & Onboarding** - Clear CTAs, video tutorials, helpful guidance

**Key Differentiators:**
- **Instantly:** Cold email outreach, lead generation, multi-account management
- **CommandCentered:** Event production management, operator scheduling, equipment tracking

**Strategic Recommendation:**
Focus on replicating Instantly's **UX patterns** and **analytics capabilities** while maintaining CommandCentered's unique **tactical aesthetic** and **production-focused workflows**. Add "Communication Sequences" as a new feature to automate multi-touchpoint client engagement, but don't replicate lead generation or email warmup (not applicable to CommandCentered's use case).

**Spec Confidence:** 95% → Validate schema against these patterns → Ready for Week 2 implementation.

---

**End of Audit**
