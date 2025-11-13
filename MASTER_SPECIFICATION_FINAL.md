# CommandCentered - MASTER SPECIFICATION v4.0
## Complete System Requirements After All Interviews

**Date:** 2025-11-12
**Status:** UPDATED - Round 3 Vision Interview Complete
**Rounds Completed:** Initial + Round 1 + Round 2 + Round 3 (Vision & Priorities)
**Total Decisions:** 65+ captured
**Phase Priority:** SCHEDULING FIRST (changed from Registration first)

---

## EXECUTIVE SUMMARY

CommandCentered is a **command-and-control system** for StreamStage videography business, not a generic business management platform.

**Core Purpose:** Expert scheduling and logistics with voice control to reduce friction during busy season.

**Philosophy:** Assist decisions, don't make them. Warn, never block. Record reality, don't enforce rules.

---

## 🎯 SYSTEM BOUNDARIES (WHAT IT IS AND ISN'T)

### CommandCentered IS:
- ✅ A scheduling and logistics command center
- ✅ A voice-controlled CRUD system
- ✅ A revenue tracker (not full accounting)
- ✅ A client communication hub
- ✅ A warning system (never blocking)
- ✅ A multi-date contract manager

### CommandCentered IS NOT:
- ❌ A wedding planner
- ❌ An expense tracker
- ❌ A marketing automation platform
- ❌ An operator performance system
- ❌ A bulk operations tool
- ❌ An enforcement system

---

## 🏗️ ARCHITECTURE OVERVIEW

### Three-Domain Architecture

1. **commandcentered.app** - Internal operations
   - Commander dashboard
   - Voice assistant interface
   - Logistics management
   - CRM and pipeline

2. **operators.commandcentered.app** - Operator portal (NEW)
   - Availability management
   - Gig sheet viewing
   - Telegram group links
   - No financial visibility

3. **streamstage.live** - Client-facing
   - Proposal builder
   - Contract signing
   - Payment portal
   - Magic links only (no accounts)

### User Types & Permissions

```typescript
enum UserType {
  COMMANDER = "COMMANDER",           // Full override power
  OPERATOR = "OPERATOR",             // Minimal portal access
  CLIENT = "CLIENT"                  // No login, magic links only
}

// Simple permission model
const permissions = {
  COMMANDER: ["*"],                  // Everything
  OPERATOR: ["own-availability", "view-gig-sheets"],
  CLIENT: ["view-own-data"]          // Via magic links
};
```

---

## 📊 DATABASE SCHEMA (47 Tables)

### Critical Relationships

1. **Multi-Date Contracts** (MAJOR CHANGE)
```sql
-- One contract can cover multiple events
CREATE TABLE contract_events (
  contract_id UUID REFERENCES contracts(id),
  event_id UUID REFERENCES events(id),
  event_date DATE NOT NULL,
  PRIMARY KEY(contract_id, event_id)
);
```

2. **Operator Availability** (NEW)
```sql
CREATE TABLE operator_availability (
  id UUID PRIMARY KEY,
  operator_id UUID REFERENCES operators(id),
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  available_type ENUM('full_day', 'morning', 'afternoon', 'evening', 'custom'),
  max_distance_km INTEGER,
  notes TEXT
);
```

3. **Audit Log** (REQUIRED)
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  entity_type VARCHAR(50),
  entity_id UUID,
  changed_by UUID,
  changed_at TIMESTAMPTZ,
  old_value JSONB,
  new_value JSONB,
  change_type ENUM('CREATE', 'UPDATE', 'DELETE')
);
```

### Schema Decisions Locked

- ✅ Use `operator_equipment` (not `operator_gear`)
- ✅ Keep `proposals.expires_at` for automation
- ✅ Hotel fields on `events` table only
- ✅ Separate `operator_skills` and `skill_definitions` tables
- ✅ Full audit trail on contracts
- ✅ No `operator_hotels` table

---

## 🎤 VOICE ASSISTANT SPECIFICATIONS

### Core Capability: Full CRUD
> "Having the AI voice assistant able to have full CRUD would be killer"

### Command Categories

```typescript
interface VoiceCommands {
  // Scheduling
  "Create event for [client] on [date] at [time]": CreateEvent;
  "Assign [operator] to [event]": AssignOperator;
  "Show me Saturday's schedule": QuerySchedule;

  // Logistics
  "What equipment is available on [date]": QueryEquipment;
  "Add drone to [client]'s package": UpdatePackage;

  // Financial
  "How much has [client] paid": QueryPayment;
  "Send invoice to [client]": CreateInvoice;

  // Status
  "What's the status of [client]'s contract": QueryStatus;
  "Mark [operator] as unavailable on [date]": UpdateAvailability;
}
```

### Safety Protocols

```typescript
interface VoiceConfirmation {
  required: boolean;
  conditions: [
    "DELETE operations",
    "Financial changes > $500",
    "Contract modifications",
    "Bulk updates"
  ];
  format: "I heard [action]. Confirm?";
}
```

---

## 💰 FINANCIAL SYSTEM

### Payment Philosophy
- **Manual processing only** - No automatic charging
- **Flexible installments** - Client pays when ready
- **Percentage tracking** - Shows partial payment status
- **Ontario HST only** - 13% hard-coded (schema supports more)

### What We Track
- ✅ Revenue by client
- ✅ Payment status
- ✅ Invoice amounts
- ✅ Contract values

### What We DON'T Track
- ❌ Expenses
- ❌ Profit margins
- ❌ Operator costs
- ❌ Equipment ROI

### E-Transfer Innovation
```typescript
interface ETransferRecognition {
  scanIncomingEmails: true;
  autoMatch: {
    firstTime: "manual",
    subsequent: "automatic"
  };
  notifyCommander: true;
}
```

---

## ⚠️ WARNING SYSTEM ARCHITECTURE

### Core Principle: Never Block the Commander

```typescript
enum ValidationLevel {
  INFO = "INFO",           // FYI only
  WARNING = "WARNING",     // Potential issue
  CRITICAL = "CRITICAL"    // Serious problem
  // NO "ERROR" or "BLOCK"
}

interface ValidationResponse {
  level: ValidationLevel;
  message: string;
  canOverride: true;  // ALWAYS true
  proceedAnyway: () => Promise<void>;
}
```

### Example Warnings
- "Equipment double-booked" → Override available
- "Operator already assigned" → Override available
- "No deposit received" → Override available
- "Contract unsigned" → Override available

---

## 👥 OPERATOR PORTAL (NEW SCOPE)

### Minimal Features Only
```typescript
interface OperatorPortal {
  features: [
    "View upcoming events",
    "Update availability (Doodle-style)",
    "Access gig sheets",
    "Telegram group links"
  ];

  cannotSee: [
    "Other operators",
    "Pay rates",
    "Client details",
    "Financial data",
    "Performance metrics"
  ];
}
```

### Availability Management
- Partial day slots (morning/afternoon/evening)
- Location preferences
- NOT complex (no overtime, no holiday rates)

---

## 📧 COMMUNICATION SYSTEM

### Email Architecture
- **Two-way sync** with email client
- **Parse updates** from client emails
- **Configurable reminders** - not hard-coded
- **Template-based** with variables

### Notification Routing
```typescript
interface NotificationConfig {
  channels: ["email", "SMS", "telegram", "in_app"];
  configurable: true;  // User sets per event type
  granular: true;      // Different settings per notification
}
```

---

## 📁 INTEGRATIONS

### Required Integrations
1. **Stripe** - Credit card payments (manual)
2. **SignWell** - Basic e-signatures ($8/mo)
3. **Mailgun** - Email sending (existing)
4. **Google Drive** - Auto folder creation + operator upload links
5. **Telegram** - Auto event group creation with operators
6. **Vimeo** - Livestream event creation (CRITICAL)
7. **OpenAI** - Voice transcription (Whisper) + command parsing (GPT-4)

### Vimeo Integration (NEW - CRITICAL)
**Purpose:** Eliminate manual livestream setup for every event

**Workflow:**
1. When event created → auto-create Vimeo livestream event via API
2. Fetch stream key + RTMP URL for operators
3. Generate embed code for client landing page
4. Store `vimeo_event_id`, `stream_key`, `embed_code` in events table
5. Provide landing URL to client (can create Squarespace page manually)

**Requirements:**
- Vimeo plan tier: [TBD - ask user]
- API rate limits: [Research needed]
- Eliminates: Manual Vimeo/Squarespace setup per event

### Google Drive Integration (EXPANDED)
**Purpose:** Auto folder creation + operator footage upload

**Workflow:**
1. When event created → auto-create folder structure:
   - `/Clients/[Client Name]/[Event Name]/Raw Footage/`
   - `/Clients/[Client Name]/[Event Name]/Deliverables/`
2. When operators assigned → generate unique upload links per operator
3. Upload links **DO NOT expire** (operators upload days later)
4. Track upload status: who uploaded, when, file count
5. Notify Commander when footage uploaded

**Requirements:**
- Google Drive API with service account
- Webhook notifications for file uploads
- Upload link generation per operator

### Telegram Integration (EXPANDED)
**Purpose:** Auto-create event groups with operators

**Workflow:**
1. When event created + operators assigned → auto-create Telegram group
2. Auto-invite: Commander + assigned operators (NOT clients)
3. Post gig sheet to group automatically
4. Send event updates to group
5. After event → archive group (keep for reference, don't delete)

**Requirements:**
- Telegram Bot API token
- Group creation permissions
- Message posting capabilities

### Integration Boundaries
- **Calendar**: Business only, two-way sync
- **Accounting**: Export revenue reports only
- **Marketing**: Simple "how did you hear" field

---

## 📦 SERVICE TEMPLATES (NEW - HIGH PRIORITY)

### Purpose
Build reusable service library for consistent proposals and faster event creation.

### Service Template Structure
```typescript
interface ServiceTemplate {
  id: string;
  name: string;                    // "1-Minute Highlight", "Dance Recital Standard"
  description: string;
  default_duration_hours: number;  // 4, 8, 12
  default_price: number;           // Can be overridden per client
  default_operator_count: number;  // 1, 2, 3+
  deliverable_types: string[];     // ["1 min landscape video", "3x 10s reels"]
  event_type: string;              // "Dance Recital", "Concert", "Corporate"
  is_active: boolean;
}
```

### Standard Services (Initial Set)
1. **1-Minute Highlight** - Single operator, quick turnaround
2. **Full Event Recording (3-5 min)** - Standard coverage
3. **Dance Recital Standard** - 2 operators, show program tracking
4. **Concert Full Coverage** - Multi-camera, audio focus
5. **Promo Video Package** - Brand-focused deliverables

### Workflow
1. Commander creates service templates in Settings
2. When creating proposal → select from template library
3. Template populates default values (price, duration, operator count)
4. Commander can customize per event
5. Reuse templates across clients

---

## 📧 EMAIL AUTOMATION (EXPANDED)

### Automatic Triggers (Updated)

**Contract & Payment Flow:**
1. **Contract signed** → send deposit invoice
2. **Deposit paid** → send technical questionnaire
3. **Payment overdue** → automatic reminder (configurable delay)

**Pre-Event Flow:**
4. **1 month before event** → missing info reminders
5. **48 hours before DANCE RECITAL** → request show program PDF (NEW)
6. **48 hours before any event** → send operator details + schedule

**Post-Event Flow:**
7. **After event** → thank-you + replay/deliverable notice
8. **2-4 weeks after delivery** → rebooking reminder (NEW)

### Dance Recital Show Program (NEW - MEDIUM PRIORITY)
**Purpose:** Automate last-minute show program collection for titling

**Workflow:**
1. 48 hours before dance recital event → auto-send email to client
2. Request PDF upload of show program
3. Track upload status in dashboard
4. Show in Critical Alerts panel if missing
5. Link to questionnaire upload interface

**Requirements:**
- Event type detection (is_dance_recital flag)
- File upload endpoint for show programs
- Email template with upload link
- Dashboard alert when missing

### Rebooking Automation (NEW - MEDIUM PRIORITY)
**Purpose:** Increase repeat business without manual follow-up

**Workflow:**
1. After event delivery marked complete → schedule follow-up
2. Wait 2-4 weeks (configurable)
3. Send automated "Book your next event" email
4. Track rebooking conversion rate
5. Link back to proposal/contact form

---

## 👥 OPERATOR PORTAL (EXPANDED)

### What Operators See (Updated)
- ✅ Upcoming assignments with dates/times
- ✅ Event details: venue, call time, arrival time
- ✅ Hotel info (if multi-day event) - **NEW**
- ✅ Client contact information
- ✅ Gear list assigned to them
- ✅ Payment details for their shift
- ✅ **Direct upload links for footage** (Google Drive) - **NEW**
- ✅ Telegram group link for event coordination

### Partial-Day Availability (EXPANDED)
**What changed:** Not just full-day yes/no, but time ranges

**Availability Types:**
- ✅ Full Day (9am-11pm)
- 🕐 Partial Day with time range ("2-6pm", "AM only", "PM only")
- ❌ Unavailable
- ⚪ No Response

**UI Pattern:**
- Doodle-style availability grid (already in Planning mockup Tab 2)
- Click to toggle: ✅ → 🕐 (opens time picker) → ❌ → ⚪
- Time inputs: start_time, end_time fields in operator_availability table
- Operators set this in Operator Portal → My Availability

### Hotel Information (NEW)
**Fields added to events table:**
- `hotel_name` (VARCHAR)
- `hotel_address` (TEXT)
- `hotel_checkin_time` (TIME)

**Shows in:**
- Gig sheets sent to operators
- Operator portal event detail view
- Planning page event modal

---

## 🎨 CLIENT EXPERIENCE (CLARIFIED)

### Email-Only Interaction (CRITICAL DECISION)
**What changed:** Clients NEVER log in, all interactions via email

**Client Touchpoints:**
1. **Proposal** → Magic link in email to view/accept
2. **Contract** → Magic link to sign (SignWell integration)
3. **Invoice** → Magic link to pay (Stripe)
4. **Questionnaire** → Magic link to fill form
5. **Show Program Upload** → Magic link to upload file
6. **Deliverable Download** → Magic link to Google Drive folder

**Reasoning:**
- Simpler for clients (no passwords, no accounts)
- Less to build (no client portal authentication)
- More professional (email-based workflow)

**Architecture Impact:**
- Magic links with UUID tokens
- Token expiration: 7 days default (configurable per link type)
- Tokens tied to client_id in database
- No client_users table needed

---

## 📊 DASHBOARD ENHANCEMENTS (NEW)

### Annual Revenue Summary (NEW - LOW PRIORITY)
**Purpose:** Simple, motivational revenue visualization

**Widget shows:**
- Total annual revenue to date
- Progress bar toward goal (optional)
- Month-over-month comparison
- NOT deep analytics, just "feel good" summary

**Placement:** Dashboard → customizable widget (can toggle on/off)

### Event Pipeline Visualization (NEW - MEDIUM PRIORITY)
**Purpose:** Visual overview of event lifecycle status

**Pipeline Stages:**
1. Proposal Sent
2. Contract Signed
3. Deposit Paid
4. Event Confirmed
5. Event Completed
6. Delivered

**Shows:**
- Count per stage
- Kanban-style board OR progress bars
- Quick status at-a-glance
- Click to view event details

**Placement:** Dashboard → main panel OR separate Pipeline view

---

## 🚫 FEATURES EXPLICITLY EXCLUDED

Based on Round 2 discoveries:

1. **No bulk operations** - "I do not think we will need any"
2. **No expense tracking** - Revenue only
3. **No operator metrics** - Just skill levels
4. **No referral system** - Out of scope
5. **No wedding features** - "We do not do weddings"
6. **No timezone complexity** - EST only
7. **No automated discounts** - Manual only
8. **No equipment failure workflows** - Handle manually
9. **No chargeback automation** - Never happens
10. **No personal calendar sync** - Business calendar only

---

## 🎯 IMPLEMENTATION PRIORITIES (UPDATED - Round 3)

### Phase Priority Change (CRITICAL)
**Old Order:** Registration → Scheduling → Execution → Delivery
**New Order:** **SCHEDULING → EXECUTION → DELIVERY → REGISTRATION**

**Reasoning:** Scheduling is the immediate pain point. Registration can remain manual longer.

### PHASE 1: SCHEDULING (Weeks 1-4) - HIGHEST PRIORITY
**Sprint 1-2: Foundation**
- Database schema (47 tables + new fields)
- Multi-tenant RLS
- Operator availability (with partial-day support)
- Equipment/kit management
- Basic CRUD operations

**Sprint 3-4: Scheduling Core**
- Operator assignment interface
- Equipment conflict detection
- Availability checking (Doodle-style)
- Shift management
- Travel time warnings

### PHASE 2: EXECUTION (Weeks 5-7)
**Sprint 5-6: Event Management**
- Event creation workflow
- Gig sheet generation
- Telegram auto-group creation
- Hotel information tracking
- Vimeo livestream integration

**Sprint 7: Operator Portal**
- Operator availability interface
- Gig sheet viewer
- Footage upload links (Google Drive)
- Simple operator auth

### PHASE 3: DELIVERY (Weeks 8-9)
**Sprint 8: Deliverables**
- Deliverable tracking
- Service templates
- Editor assignment
- Google Drive folder creation
- Upload status tracking

**Sprint 9: Client Communication**
- Email automation triggers
- Show program reminders
- Rebooking automation
- Magic link system

### PHASE 4: REGISTRATION (Weeks 10-12) - LOWEST PRIORITY
**Sprint 10-11: Lead & Proposal**
- CRM pipeline
- Proposal builder
- Service template library
- Contract generation

**Sprint 12: Polish & Launch**
- Voice assistant (full CRUD)
- Dashboard customization
- Annual revenue widget
- Event pipeline visualization
- Production deployment

### Day-1 Must-Haves (If Forced to Choose 3)
1. **Scheduling Dashboard** - Operator & event management
2. **AI Voice Agent** - Full CRUD voice control
3. **Email Automation** - Proposal → contract → execution → delivery flow

**Note:** User prefers FULL WATERFALL LAUNCH (complete system day 1), but above is phased approach if needed.

---

## 📏 SUCCESS METRICS

### Primary Goals
1. **Reduce scheduling friction** - Measured by time per booking
2. **Enable voice control** - Measured by commands per day
3. **Survive busy season** - June without meltdown

### Non-Goals
- Complex automation
- Predictive analytics
- Multi-business scaling (yet)

---

## 🔒 CORE TRUTHS (Never Forget)

1. **Commander Mode** - System never blocks you
2. **Voice First** - Primary interface, not add-on
3. **Record Reality** - Track what happened, don't prevent
4. **Assist Decisions** - Information, not automation
5. **Simple Wins** - No bulk ops, no complex rules

---

## ✅ SPECIFICATION UPDATED (v4.0)

This document represents the complete system specification after all interviews and refinements, including Round 3 Vision & Priorities interview.

**Total decisions captured:** 65+
**Edge cases resolved:** 40+
**Features excluded:** 10+
**New features added (Round 3):** 15
**Architecture locked:** Yes
**Phase priority:** SCHEDULING FIRST

**Ready for implementation.**

---

## APPENDIX: Quick Reference

### Key Files
- `SCHEMA_DECISIONS_FINAL.md` - Round 1 schema decisions
- `ROUND_2_DECISIONS_FINAL.md` - Edge case resolutions
- `INTERVIEW_ANSWERS_COMPLETE.md` - Round 3 vision interview (Nov 12, 2025)
- `NEW_FEATURES_FROM_INTERVIEW.md` - 15 new features from Round 3
- `schema.prisma` - Complete database schema (needs updates for Round 3 features)

### Critical Enums
```typescript
LeadStatus: NEW | CONTACTED | QUALIFIED | CONVERTED | LOST
ProposalStatus: SUBMITTED | REVIEWING | ACCEPTED | REJECTED
ContractStatus: DRAFT | SENT | SIGNED | CANCELLED
EventStatus: PENDING | CONFIRMED | COMPLETED | CANCELLED
PaymentStatus: PENDING | SUCCEEDED | FAILED | REFUNDED
ValidationLevel: INFO | WARNING | CRITICAL // Never ERROR/BLOCK
AvailabilityType: FULL_DAY | MORNING | AFTERNOON | EVENING | CUSTOM | UNAVAILABLE
```

### Magic Numbers
- 13% - Ontario HST (hard-coded)
- 47 - Total database tables (will increase with service_templates, magic_links tables)
- 3 - User types (Commander, Operator, Client)
- 0 - Bulk operations needed
- 7 - Magic link expiration (days)
- 5-10 - Standard service templates (initial set)

### New Integrations (Round 3)
- **Vimeo API** - Livestream creation (CRITICAL)
- **OpenAI API** - Whisper (transcription) + GPT-4 (command parsing)
- **Google Drive API** - Upload links + folder creation (EXPANDED)
- **Telegram Bot API** - Auto-group creation (EXPANDED)

---

**End of Specification v4.0**