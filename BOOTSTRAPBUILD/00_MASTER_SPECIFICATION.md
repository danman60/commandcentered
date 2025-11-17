# CommandCentered - MASTER SPECIFICATION v6.0
## Complete System Requirements After All Interviews

**Date:** 2025-11-14
**Status:** UPDATED - Round 5 Interview Answers Applied
**Rounds Completed:** Initial + Round 1 + Round 2 + Round 3 (Vision) + Round 5 (Planning & Products)
**Total Decisions:** 100+ captured
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

## 🎨 UI/UX CUSTOMIZATION ARCHITECTURE (NEW - Round 5)

### Core Philosophy: Maximum User Customization
**Principle:** "Every commander should be able to customize their interface exactly how they want."

### Customization Features

#### 1. **Dashboard Cards - Moveable/Resizeable/Removable (REQUIRED)**
**Technology:** React Grid Layout library

**Critical Requirements:**
1. **MOVEABLE** - Click and drag cards anywhere on dashboard to reposition
2. **RESIZEABLE** - Click and drag corners/edges to resize width and height
3. **REMOVABLE** - Click "X" button on any card to instantly hide/remove

```typescript
interface DashboardWidget {
  id: string;
  type: 'event_pipeline' | 'annual_revenue' | 'upcoming_events' | 'critical_alerts';
  position: { x: number; y: number };    // Grid position (moveable)
  size: { w: number; h: number };        // Grid size (resizeable)
  visible: boolean;                       // Can be hidden (removable)
}

// User preferences stored in database
interface UserPreferences {
  user_id: string;
  dashboard_layout: DashboardWidget[];   // Persists move/resize/remove state
  // ... other preferences
}
```

**Interaction Specifications:**

**MOVE (Drag to Reposition):**
- **Trigger:** Click and hold anywhere on card (except X button, except interactive elements)
- **Visual Feedback:**
  - Card becomes semi-transparent (opacity: 0.8)
  - Cursor changes to grab/grabbing
  - Other cards shift to show available drop position
  - Drop target highlights with cyan border
- **Behavior:**
  - Cards snap to 12-column grid
  - Other widgets automatically reflow around dragged card
  - Save new position to database on drop
- **Cancel:** Press Escape or drag outside dashboard area

**RESIZE (Drag Corners/Edges):**
- **Trigger:** Hover over card corner or edge → cursor changes to resize icon → click and drag
- **Resize Handles:**
  - 4 corners (diagonal resize)
  - 4 edges (horizontal/vertical resize)
  - Minimum size: 3 grid columns wide, 2 grid rows tall
  - Maximum size: 12 grid columns wide (full width), 8 grid rows tall
- **Visual Feedback:**
  - Resize handles appear on hover (8px × 8px squares at corners)
  - Live preview as user drags (outline shows final size)
  - Cursor changes to resize arrows (↔️ ↕️ ↘️)
- **Behavior:**
  - Other widgets automatically reflow around resized card
  - Save new size to database on release
  - Maintains aspect ratio constraints for certain widgets (e.g., annual revenue progress bar)

**REMOVE (Click X to Hide):**
- **Trigger:** Click small "X" button in top-right corner of card
- **Button Specs:**
  - Size: 24px × 24px clickable area
  - Icon: × (multiplication sign, NOT letter X)
  - Color: Red (#ef4444) background with white × icon
  - Opacity: 0 (hidden) by default, opacity: 1 on card hover
  - Position: Absolute, top: 12px, right: 12px
  - Border-radius: 6px
  - Hover state: Brighter red (#dc2626), slight scale (1.1)
- **Visual Feedback:**
  - Confirmation toast: "Widget hidden. Restore in Settings or Customize Dashboard."
  - Card fades out (0.2s opacity transition)
  - Other cards immediately reflow to fill space
- **Behavior:**
  - Sets widget.visible = false in database
  - Widget can be restored via "Customize Dashboard" modal (checkbox)
  - Does NOT delete widget permanently
  - Maintains position/size preferences for when re-enabled

**Persistence:**
- All moves, resizes, and removes save to database immediately (no "Save" button)
- Layout restored on next login
- "Reset to Default" button in Settings reverts to original 6-widget layout

**Performance:**
- Smooth 60fps animations during drag/resize
- Debounce database saves (wait 500ms after drag stops before saving)
- Optimistic UI updates (instant visual feedback, async save)

**Widget Customization Modal:**
- **"Customize Dashboard" button** in dashboard header
- Opens modal with checkboxes for each widget type
- Available widgets:
  - Event Pipeline (6-stage visualization)
  - Annual Revenue (progress bar toward goal)
  - Upcoming Events (next 7 days)
  - Communications Timeline (recent touchpoints)
  - Critical Alerts (missing operators/kits)
  - Revenue by Product Focus (future feature)
- Check/uncheck to show/hide widgets
- Changes save immediately
- **Modular architecture** - future users can add new widget types via plugins

#### 2. **View Toggle Icons**
**Change:** Remove full text labels like "Card View" / "Table View"
**New:** Icon-only toggles

```typescript
// Before: <button>Card View</button> <button>Table View</button>
// After: <button><GridIcon /></button> <button><TableIcon /></button>

// Icons for all view types
interface ViewIcons {
  card: <GridIcon />;      // Grid of cards
  table: <TableIcon />;    // Table rows
  calendar: <CalendarIcon />; // Month view
}
```

**Applies to:** All pages with multiple view options (Operators, Planning, etc.)

#### 3. **Left Navigation Customization**

**Features:**
- **Collapsible:** Click button to hide/show sidebar → full screen mode
- **Drag/Drop Reorder:** Drag nav items to change order
- **Double-Click Rename:** Customize nav item labels (e.g., "Communications" → "Comms")

```typescript
interface NavigationItem {
  id: string;
  label: string;              // User-customizable
  default_label: string;      // Original label
  icon: ReactNode;
  order: number;              // User-defined order
  visible: boolean;
}

// Save to user preferences
interface NavigationPreferences {
  collapsed: boolean;
  items: NavigationItem[];
}
```

**Navigation Items:**
- Dashboard
- Pipeline
- Planning
- Deliverables
- Comms (renamed from "Communications")
- Proposals
- Contracts
- Invoices
- Questionnaires
- Files
- Integrations
- Settings

#### 4. **Resizable Panels**
**Applies to:** Contracts page, Planning page (3-panel layout), any multi-panel view

**Technology:** React Resizable library

```typescript
interface PanelLayout {
  panel_id: string;
  width_percent: number;  // % of screen width
  min_width: number;      // Minimum pixels
  max_width: number;      // Maximum pixels
}
```

**Examples:**
- Contracts page: Templates panel (left) | Existing contracts panel (right) with draggable divider
- Planning page: Operators panel | Kits panel | Calendar panel (all resizable)

#### 5. **Settings > Customization Tab**
**Purpose:** Centralize all customization options

**Sections:**
- Dashboard widget selection (checkboxes to show/hide widgets)
- Template customization (proposal/contract/invoice templates)
- Navigation preferences (order, labels, visibility)
- View defaults (card vs table vs calendar)
- Panel layouts (reset to defaults)

#### 6. **Modal Sizing Standard**
**Rule:** All modals should be 80% screen size (not 20%)

**Applies to:**
- Proposal builder
- Contract editor
- Kit creation
- Event detail view
- Operator assignment
- All data-heavy modals

**Exception:** Simple confirmations ("Delete this item?") can stay small.

#### 7. **Sortable Columns (All Tables)**
**Rule:** Every table in the app has sortable columns

**Implementation:**
```typescript
interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;  // Always true
  sort_direction?: 'asc' | 'desc' | null;
}

// Click column header → toggle sort direction
// Visual indicator: ↑ ↓ arrows in header
```

**Applies to:**
- Pipeline (all CRM fields)
- Deliverables (due date, service type, client, status)
- Operators (name, availability, skills)
- Gear/Inventory (status, category, last used)
- All other table views

#### 8. **Microphone FAB (Floating Action Button)**
**Rule:** Voice control accessible from every page

**Implementation:**
```typescript
interface MicrophoneFAB {
  position: 'fixed';
  bottom: '24px';
  right: '24px';
  z_index: 9999;  // Above all other elements
  size: '56px';   // Material Design standard FAB size
  behavior: 'click-to-talk' | 'push-to-talk';
}

// Mobile adjustments
@media (max-width: 768px) {
  bottom: '80px';  // Above mobile nav if present
  right: '16px';
}
```

**Features:**
- **Click to activate:** Microphone icon turns red, listening mode
- **Voice transcription:** Real-time display of spoken words
- **Command execution:** AI parses intent → executes action
- **Visual feedback:** Success/error states
- **Keyboard shortcut:** Cmd/Ctrl + K to activate

**Placement Rules:**
- Must not overlap other fixed elements (see Round 5 feedback)
- Check existing fixed positions: widgets, chat buttons, etc.
- Minimum 16px gap from other fixed elements
- Mobile: Move up if bottom nav exists

**Accessibility:**
- ARIA label: "Voice command"
- Keyboard accessible
- Screen reader friendly

**Implementation Priority:** Week 7-8 (Frontend Build phase)

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

## 🏢 MULTI-TENANT ARCHITECTURE (CRITICAL)

### Core Principle: StreamStage is Tenant #1, Not the Only Tenant

**Business Model:**
- CommandCentered is a **multi-tenant SaaS platform**
- StreamStage (user's company) is the **first tenant**, not the only tenant
- Future tenants: Other video production companies, event agencies, content studios
- Each tenant gets isolated data, custom subdomain, separate billing

**Go-To-Market Strategy:**
- **Phase 1 (Months 1-6):** Build for StreamStage, validate product-market fit
- **Phase 2 (Months 7-12):** Refine based on StreamStage feedback, prepare for multi-tenant
- **Phase 3 (Year 2+):** Sell to other video production companies
  - Target: Mid-size production companies ($500k-$5M annual revenue)
  - Positioning: "HoneyBook for video production companies with scheduling focus"
  - Competitive advantage: Voice control + operator scheduling + Vimeo integration
- **Pricing Model:** Monthly SaaS scaled by company size (see Pricing Tiers below)
- **Goal:** Sellable, sustainable SaaS business serving video production industry

### Tenant Isolation Strategy

**Database Level: Row-Level Security (RLS)**

```sql
-- Every table has tenant_id (UUID)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  -- ... other fields
  CONSTRAINT events_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- RLS Policy: Users can only see their tenant's data
CREATE POLICY tenant_isolation ON events
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Enable RLS on ALL tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
```

**Application Level: Tenant Context**

```typescript
// Middleware sets tenant_id from subdomain or auth token
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const subdomain = req.headers.get('host')?.split('.')[0];

  // Map subdomain to tenant_id
  const tenant = await getTenantBySubdomain(subdomain);

  // Set Supabase context for RLS
  await supabase.rpc('set_tenant_context', {
    tenant_id: tenant.id
  });

  // All subsequent queries auto-filtered by tenant_id
  return next();
}
```

### Tenant Onboarding Flow

**First Tenant (StreamStage):**
```sql
-- Seed data (run once on production deploy)
INSERT INTO tenants (id, subdomain, company_name, plan_tier, created_at)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',  -- Fixed UUID for StreamStage
  'streamstage',
  'StreamStage Productions',
  'founder',  -- Special tier, no billing
  NOW()
);

-- Create first Commander user
INSERT INTO users (id, tenant_id, email, role, created_at)
VALUES (
  gen_random_uuid(),
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'user@streamstage.com',  -- User's actual email
  'COMMANDER',
  NOW()
);
```

**Future Tenants (Self-Service Signup):**
```typescript
// Sign up flow at commandcentered.app/signup
async function createTenant(data: TenantSignup) {
  // 1. Create tenant record
  const tenant = await db.tenants.create({
    data: {
      subdomain: data.company_slug,  // e.g., "acmevideo"
      company_name: data.company_name,
      plan_tier: 'trial',  // 14-day trial, then paid
    }
  });

  // 2. Create Commander user
  const user = await db.users.create({
    data: {
      tenant_id: tenant.id,
      email: data.email,
      role: 'COMMANDER',
    }
  });

  // 3. Send welcome email with subdomain
  await sendEmail({
    to: data.email,
    subject: 'Welcome to CommandCentered',
    body: `Your account is ready at https://${data.company_slug}.commandcentered.app`
  });

  // 4. Redirect to onboarding
  return { subdomain: data.company_slug, tenant_id: tenant.id };
}
```

### Domain Routing

**Subdomain Structure:**
```
streamstage.commandcentered.app      → StreamStage tenant
acmevideo.commandcentered.app        → Future Tenant #2
pixelpro.commandcentered.app         → Future Tenant #3

streamstage.operators.commandcentered.app  → StreamStage operators portal
acmevideo.operators.commandcentered.app    → Future Tenant #2 operators

streamstage.live                     → StreamStage client-facing
acmevideo.live (future)              → Future Tenant #2 client-facing
```

**Routing Logic:**
```typescript
// Extract tenant from subdomain
const host = req.headers.host; // "streamstage.commandcentered.app"
const subdomain = host.split('.')[0]; // "streamstage"

// Lookup tenant
const tenant = await db.tenants.findUnique({
  where: { subdomain }
});

if (!tenant) {
  return redirect('/signup'); // Unknown subdomain
}

// Set tenant context for all queries
setTenantContext(tenant.id);
```

### Tenant Schema (Tenants Table)

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain VARCHAR(50) UNIQUE NOT NULL,  -- "streamstage", "acmevideo"
  company_name VARCHAR(255) NOT NULL,

  -- Billing
  plan_tier VARCHAR(50) NOT NULL,  -- 'trial', 'starter', 'pro', 'founder'
  stripe_customer_id VARCHAR(255),
  subscription_status VARCHAR(50),  -- 'active', 'past_due', 'canceled'
  trial_ends_at TIMESTAMPTZ,

  -- Settings
  settings JSONB DEFAULT '{}',  -- Tenant-specific config

  -- Branding (optional future feature)
  logo_url VARCHAR(500),
  primary_color VARCHAR(7),  -- "#1a73e8"

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ  -- Soft delete
);

-- Index for fast subdomain lookup
CREATE UNIQUE INDEX tenants_subdomain_idx ON tenants(subdomain);
```

### Tables WITH tenant_id (ALL data tables)

**Pattern: EVERY table except system tables has tenant_id**

```sql
-- ✅ HAS tenant_id (user data)
events, clients, operators, equipment, invoices, proposals,
contracts, deliverables, leads, communications, etc.

-- ❌ NO tenant_id (system tables)
tenants (itself), audit_log (references tenant_id but not filtered)
```

**Example: Events Table**
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  -- ... all other fields

  CONSTRAINT events_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- RLS Policy
CREATE POLICY tenant_isolation_events ON events
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
```

### Data Isolation Guarantees

**Database Level:**
1. ✅ RLS policies on ALL tables (queries auto-filtered by tenant_id)
2. ✅ Foreign key constraints enforce tenant_id on relations
3. ✅ Indexes include tenant_id for performance
4. ✅ Supabase Auth maps user → tenant_id automatically

**Application Level:**
1. ✅ Middleware extracts tenant from subdomain
2. ✅ All API routes verify tenant_id matches user.tenant_id
3. ✅ No cross-tenant queries possible (RLS blocks at DB)
4. ✅ File uploads namespaced: `/uploads/{tenant_id}/{file}`

**Testing Isolation:**
```sql
-- Create test tenants
INSERT INTO tenants (id, subdomain, company_name) VALUES
  ('tenant-a-uuid', 'testa', 'Test Company A'),
  ('tenant-b-uuid', 'testb', 'Test Company B');

-- Create test data
INSERT INTO events (tenant_id, name) VALUES
  ('tenant-a-uuid', 'Event A1'),
  ('tenant-b-uuid', 'Event B1');

-- Set tenant context to A
SELECT set_config('app.current_tenant_id', 'tenant-a-uuid', false);

-- Query events (should only see Event A1)
SELECT * FROM events;
-- Result: 1 row (Event A1 only)

-- CANNOT see Event B1 even with direct query
SELECT * FROM events WHERE id = 'event-b1-id';
-- Result: 0 rows (RLS blocks)
```

### Pricing Tiers (Future)

```typescript
interface PlanTier {
  name: string;
  monthly_price: number;
  limits: {
    events_per_month: number;
    operators: number;
    storage_gb: number;
  };
}

const PLANS = {
  founder: {  // StreamStage only
    name: 'Founder',
    monthly_price: 0,
    limits: { events_per_month: 999, operators: 999, storage_gb: 999 }
  },
  trial: {
    name: '14-Day Trial',
    monthly_price: 0,
    limits: { events_per_month: 5, operators: 3, storage_gb: 10 }
  },
  starter: {
    name: 'Starter',
    monthly_price: 49,
    limits: { events_per_month: 20, operators: 5, storage_gb: 50 }
  },
  pro: {
    name: 'Pro',
    monthly_price: 149,
    limits: { events_per_month: 100, operators: 20, storage_gb: 200 }
  }
};
```

### StreamStage First Tenant Setup

**Production Deploy Script:**
```bash
# 1. Deploy app to Vercel
vercel deploy --prod

# 2. Run tenant seed (one-time)
psql $DATABASE_URL -f scripts/seed_streamstage_tenant.sql

# 3. Verify tenant exists
psql $DATABASE_URL -c "SELECT * FROM tenants WHERE subdomain = 'streamstage';"

# 4. Create first Commander user via Supabase Auth
# (or signup flow at streamstage.commandcentered.app/signup)

# 5. Verify RLS policies
psql $DATABASE_URL -f scripts/verify_rls_policies.sql
```

**Seed Script:**
```sql
-- scripts/seed_streamstage_tenant.sql
BEGIN;

-- Create StreamStage tenant
INSERT INTO tenants (id, subdomain, company_name, plan_tier)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'streamstage',
  'StreamStage Productions',
  'founder'
) ON CONFLICT (subdomain) DO NOTHING;

-- Verify
SELECT * FROM tenants WHERE subdomain = 'streamstage';

COMMIT;
```

### Week 2 Multi-Tenant Validation

Add to Week 2 checklist:

- [ ] Every table has tenant_id column (except system tables)
- [ ] RLS policies created for ALL tables
- [ ] RLS policies tested (tenant A can't see tenant B data)
- [ ] Middleware extracts tenant from subdomain
- [ ] API routes verify tenant_id matches auth user
- [ ] File uploads namespaced by tenant_id
- [ ] StreamStage seed script ready
- [ ] Tenant signup flow designed (for future tenants)

---

## 📊 DATABASE SCHEMA (50+ Tables)

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

### AI Agent Architecture (NEW - Round 5 Deep Dive)

**Layered System:**

**Layer 1: Voice-to-Text (Easy)**
- OpenAI Whisper API
- User speaks → app converts to text → sends to AI
- Accuracy: ~95% for clear audio
- Latency: ~1-2 seconds

**Layer 2: AI Decision Engine (Medium)**
- GPT-4 parses intent from transcription
- Example: "When is Impact dance recital?" → AI understands: Query events table
- AI generates SQL or API call based on intent
- Returns structured command to execute

```typescript
interface VoiceIntent {
  action: 'query' | 'create' | 'update' | 'delete';
  entity: 'event' | 'operator' | 'kit' | 'client' | 'email';
  parameters: Record<string, any>;
  sql_query?: string;
  confidence: number;  // 0-1 confidence score
}
```

**Layer 3: Database Access (Medium)**
- AI executes query on Supabase
- Read operations: direct execution
- Write operations: require confirmation (see Safety Protocols)
- Returns answer in natural language

**Layer 4: Gmail Integration (Hard)**
- For queries like "When did I talk about pricing with Client X?"
- AI searches Gmail via API for keyword in email threads
- Scans subject lines + body text
- Returns: "You discussed pricing on Oct 12 in email thread 'Re: Proposal'"

**Layer 5: CRUD via Voice (Hard)**
- "Add operator John to Impact recital"
- AI parses → creates database record
- Requires validation: "Did you mean Impact Dance Recital on March 15? Confirm."
- On confirmation → executes mutation

**N8N Option:**
- User has n8n experience
- Can orchestrate: OpenAI → Supabase → Gmail
- BUT: Easier to build directly in Next.js with API routes
- n8n useful for testing workflows before coding

**Implementation Complexity:**
- **Week 5-6 (Integrations Phase):** Voice-to-text + simple queries
- **Week 7-8:** CRUD operations with confirmations
- **Week 9-10:** Gmail search + advanced queries

**UI Placement:**
- Microphone button on main dashboard (always visible)
- Click to talk, release to process
- Show transcription in real-time
- Display AI response as text + execute action

### Command Categories

```typescript
interface VoiceCommands {
  // Scheduling
  "Create event for [client] on [date] at [time]": CreateEvent;
  "Assign [operator] to [event]": AssignOperator;
  "Show me Saturday's schedule": QuerySchedule;
  "When is [client]'s event?": QueryEvent;

  // Logistics
  "What equipment is available on [date]": QueryEquipment;
  "Add drone to [client]'s package": UpdatePackage;
  "Which operators are available Saturday?": QueryOperatorAvailability;

  // Financial
  "How much has [client] paid": QueryPayment;
  "Send invoice to [client]": CreateInvoice;

  // Status
  "What's the status of [client]'s contract": QueryStatus;
  "Mark [operator] as unavailable on [date]": UpdateAvailability;

  // Email Search (NEW - with Gmail integration)
  "When did I talk about pricing with [client]?": SearchGmail;
  "When did I last contact [client]?": QueryLastContacted;
  "Who do I need to talk to today?": QueryFollowUps;
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
    "Bulk updates",
    "CREATE operations (new events, operators, etc.)"
  ];
  format: "I heard [action]. Confirm?";
  voice_response: "Say 'yes' to confirm or 'cancel' to abort";
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

## 📄 PAGE-SPECIFIC REQUIREMENTS (Round 5 Updates)

### Pipeline Page

**Click-to-Edit Fields:**
- ALL fields should be inline-editable
- Click field → edit mode → blur or Enter to save → updates database
- Applies to: Contact Name, Company, Status, Frequency, Product Focus, all custom fields

```typescript
interface InlineEditField {
  field_name: string;
  current_value: any;
  onClick: () => setEditMode(true);
  onBlur: () => saveToDatabase();
  onEnter: () => saveToDatabase();
}
```

**Product Focus Tracking:**
- **4 Major Products:**
  1. **Studio Sage Chatbot** - AI assistant for dance studios
  2. **Dance Recital Package** - Recital video production services
  3. **Competition Software** - Dance competition management platform
  4. **Core Video Production Services** - Umbrella for all media production

- **Multi-Depth Tracking Per Client:**
  - Each product tracked separately with:
    - **Status progression:** Not Interested → Contacted → Proposal Sent → Active → Completed
    - **Revenue amount** per product (tracks multiple revenue streams per client)
    - **Notes field** per product (specific notes for each product line)
    - **"Interested" checkbox** for quick tagging (visual indicator in table)

- **Filters:**
  - Filter by product focus (show all clients interested in specific product)
  - Filter by status within product (e.g., all Dance Recital proposals sent)
  - Combined filters (e.g., Active Competition Software clients)

- **UI Design:**
  - Pipeline table shows primary product focus per client
  - Click client row → detail view shows all products with status/revenue/notes
  - Checkbox column for each product in detail view

**CRM Enhancements (Already in spec):**
- Last Contacted, Next Follow-Up, Contact Frequency columns (from Round 3)

---

### Planning Page

**Architecture:**
- **3-Panel Layout:** Operators panel | Kits panel | Calendar panel
  - **Calendar View:** Month view by default for high-level visibility
  - All panels resizable (draggable dividers)
  - Panels show drag targets when dragging operators/kits

**Full Screen Mode:**
- Button to collapse left navigation → Planning takes full screen
- Essential for drag/drop workflows
- Keyboard shortcut: F11 or custom hotkey

**Event Detail View:**
- Click event on calendar → opens **detailed modal** for granular scheduling
- Event detail modal shows:
  - Event info (client, date, location, hotel)
  - **Shift Builder** (see below)
  - Operator assignment per shift
  - Kit assignment (defaults to entire event, can override per shift)
  - Conflicts highlighted in **red** (operators or kits double-booked)

**Shift Builder (within Event Modal):**
- Define event hours (e.g., 2 PM – 10 PM)
- **Two options for shift creation:**
  1. **Manual:** Create shifts manually with custom times
  2. **Templates:** Use pre-defined templates (e.g., "Recital: Setup / Event / Teardown")
- **Single-shift events can skip shift builder entirely** (assign operators/kits to whole event)
- Operators assigned per shift
- Kits default to entire event, can be overridden per shift if needed

**Calendar Indicators (Event Bars):**
- Each event bar displays:
  - **Client name** (e.g., "EMPWR Dance")
  - **Operator initials** (JD, ST)
  - **Kit icons** (camera symbol, etc.)
- **Event color indicates status:** Booked, Pending, Completed
- Compact but informative design

**Conflict Detection:**
- Conflicts trigger **only when they matter:**
  - Overlapping shifts for same operator
  - Operator marked unavailable
  - Kit double-booked on overlapping events
- **No warnings for same-day non-overlapping work**
- Visual indicator: Red highlight on conflicting events/shifts

**Alerts for Missing Assignments:**
- Dashboard and Planning page show alerts for:
  - Events missing operators
  - Events missing kits
- Alert panel shows list of incomplete events

**Main Planning View - Panels:**
- **Operators Panel:** List of all operators with availability indicators
- **Kits Panel:** List of all kits with assignment status
- **Calendar Panel:** Month view showing all events with operator initials + kit icons

---

### Deliverables Page

**Multiple Deliverables Per Client:**
- Schema already supports (deliverables table has client_id + event_id)
- Table view shows all deliverables across all clients
- Filter by client, event, service type, status

**Sortable Columns:**
- All columns sortable (due date, client, service type, assigned editor, status)
- Click header to toggle sort direction

**Google Drive Folder Column:**
```typescript
interface DeliverableRow {
  // ... existing fields
  folder_link: string;     // Google Drive folder URL
  folder_actions: {
    click: () => window.open(folder_link);           // Open folder
    rightClick: () => navigator.clipboard.writeText(folder_link); // Copy link
  };
}
```

**Checkboxes Per Service Type:**
```typescript
interface ServiceDeliverable {
  service_type: string;  // "1-min highlight", "3-min full event", "Reels"
  completed: boolean;    // Checkbox per service
}

// Example row:
// Client: EMPWR Dance | Event: Spring Recital
// Services: [✓] 1-min highlight  [✓] 3-min video  [ ] 3x Reels  [✓] Raw footage
```

---

### Communications Page (Renamed: "Comms")

**Layout Changes:**
1. **Top Section: "Automated Emails"** (primary card)
   - Shows all automated email triggers
   - Table view: Client | Email Type | Status (Sent/Pending/Failed) | Date Sent
   - Progress bar per client showing communication workflow completion
   - Click email to view template or edit

2. **Bottom Section: "Telegram Integration"**
   - Merge "Telegram Bot Setup" and "Telegram Integration" into one panel
   - Show active Telegram groups per event
   - Button to create new group
   - Invite operators to group

**Communication Touch Points (8 Tracked Touchpoints):**
1. **Initial contact email** - First outreach to potential client
2. **Proposal sent** - Proposal delivered to client
3. **Contract sent / signed** - Contract lifecycle tracking
4. **Questionnaire sent / completed** - Technical questionnaire for event details
5. **Invoice sent / paid** - Payment tracking
6. **Pre-event reminders** - Reminders before event date
7. **Post-event follow-up** - Thank-you and delivery notification
8. **Rebooking outreach** - Follow-up for repeat business

**Progress Bar:**
- Visual progress bar shows: Initial Contact → Proposal → Contract → Questionnaire → Invoice → Event → Delivery → Rebooking
- Color-coded status indicators (pending, sent, completed)
- Click touchpoint to view email history and status

**Gmail Integration:**
- Track "Last Contacted" by scanning Gmail for sent emails to client
- Update communication log automatically when user emails client externally
- Requires Gmail OAuth read access
- (Already answered in Q&A section)

---

### Proposals Page

**New Column: "Date Received"**
```typescript
interface ProposalRow {
  // ... existing fields
  date_received: Date;  // When client received the proposal
  date_viewed: Date;    // When client opened magic link (optional tracking)
  date_accepted: Date;  // When client accepted
}
```

**Proposal Builder Modal:**
- Opens at 80% screen size (not small modal)
- Full proposal editor with all sections visible
- Service template selector (from service library)
- Live preview of proposal

---

### Contracts Page

**Full Screen Layout:**
```
┌─────────────────┬──────────────────────────┐
│  Templates      │  Existing Contracts      │
│  (Left Panel)   │  (Right Panel)           │
│                 │                          │
│  - Standard     │  [Contract List]         │
│  - Dance Recital│                          │
│  - Multi-Date   │  Click to preview →      │
│  - Custom       │                          │
│                 │                          │
│  [Resizable Divider]                       │
└─────────────────┴──────────────────────────┘
```

**Features:**
- Resizable panels (drag divider left/right)
- Templates on left (always visible)
- Existing contracts on right (click to open full editor)
- Contract editor opens at 80% screen size

---

### Questionnaires Page

**UI Changes:**
- Remove huge white button (visual cleanup)
- Incomplete questionnaires sorted to top automatically
- Color coding:
  - **Yellow:** Pending, event >7 days away
  - **Red:** Incomplete, event <7 days away (alert state)
  - **Green:** Completed

**Data Flow:**
- Questionnaire responses auto-populate event detail in Planning
- Hotel info, special requests, show program → all visible in event hover/detail view

---

### Livestreams Page (Files Tab)

**New Column: "Viewing Page"**
```typescript
interface LivestreamRow {
  // ... existing fields
  viewing_page_url: string;  // streamstage.live/[event-slug]
  vimeo_event_id: string;
  stream_key: string;
  embed_code: string;
  rtmp_url: string;
}
```

**One-Button Vimeo Generation:**
- Button: "Generate Vimeo Stream"
- Click → API call to Vimeo → creates livestream event
- Auto-populates stream_key, rtmp_url, embed_code
- Shows success message with all credentials

---

### Operators Page

**Remove Old Navigation:**
- Clean up any old nav buttons at top of page (from legacy mockups)

**Calendar View Option:**
- Add third view toggle: Card | Table | Calendar
- Calendar view shows month grid with all operator availability
- Each operator gets color coding + initials on their available days
- Visual: Month calendar with operator initials in each day cell

**Example:**
```
Monday Oct 14:  JD, ST, MK (3 operators available)
Tuesday Oct 15: JD, MK (2 operators available)
Wednesday Oct 16: (no operators available - show as empty)
```

---

### Gear/Inventory Page

**Tabs for Categories:**
- Tabs: All | Cameras | Audio | Rigging | Lighting | [Other categories TBD - Interview Q10]
- Click tab → filters table to that category
- Each category can have subcategories (e.g., Cameras > Lenses > Accessories)

**Status Indicators:**
```typescript
enum GearStatus {
  PERFECT = "PERFECT",        // Green
  NEEDS_REPAIR = "NEEDS_REPAIR", // Yellow
  UNUSABLE = "UNUSABLE"       // Red
}

interface GearItem {
  // ... existing fields
  status: GearStatus;
  needs_repair: boolean;      // Flag for maintenance
  last_maintenance: Date;
}
```

**Visual:**
- Red badge: "Cannot be used"
- Yellow badge: "Can be used but needs repair"
- Green badge: "Perfect condition"

**Gear Categories (9 Core Categories):**
1. **Cameras** - Sony A7S III, Canon R5, etc.
2. **Lenses** - 24-70mm, 70-200mm, primes
3. **Accessories** - Batteries, SD cards, HDMI cables, adapters
4. **Audio** - Microphones, recorders, mixers
5. **Rigging** - Tripods, monopods, sliders, jibs
6. **Lighting** - LED panels, softboxes, practical lights
7. **Stabilizers / Gimbals** - DJI Ronin, handheld stabilizers
8. **Drones** - DJI Mavic, FPV drones
9. **Monitors** - Field monitors, preview screens

**Gear Dependencies ("Suggest, Don't Assume" Pattern):**
- When camera added → **gentle reminder** shows:
  - "Camera requires: Lens, Battery, SD Card"
  - Shows list of missing dependencies with checkboxes
  - User remains in full control (can dismiss or add items)
  - **No auto-insertion** - commander decides what to add
- Pattern applies to all dependent gear:
  - Audio recorder → requires SD card, batteries
  - Gimbal → requires camera, batteries
  - Drone → requires batteries, SD cards, controller

**Event-Type Gear Suggestions:**
- Each **Event Type** (Recital, Content Capture, Competition) has **recommended gear checklist**
- When creating kit for event → system suggests items based on event type
- Example: "Dance Recital" event → suggests 2 cameras, wireless audio, LED lights
- **Context-aware kit building** speeds setup while staying flexible
- User can accept all, accept some, or ignore suggestions

**Maintenance Log:**
- Track repair history per item
- Flag items needing attention
- Filter by status (show only items needing repair)

---

### Kits Page

**Kit Creation Flow (Step-by-Step):**
1. Click **"Create Kit"** button from Planning page (or Kits page)
2. Modal opens at **80% screen width**
3. Fill **Kit Name** (e.g., "Recital Kit A", "Corporate Package 1")
4. Choose **Event** from dropdown (links kit to specific event)
5. **Browse or search** full gear inventory:
   - Gear organized by category tabs (Cameras, Audio, Rigging, etc.)
   - Checkboxes next to each item
   - Search bar filters items by name
   - Shows availability status (available, in use, needs repair)
6. Click **"Create Kit"**
7. Kit instantly links to selected event
8. Modal closes, kit appears in Kits panel and event detail

**Kit Assignment Logic:**
- **Default behavior:** Kits remain with the event all day
- **Operators rotate by shift** (operators change, kits stay)
- **Kits can be swapped mid-event** if necessary (e.g., different setups)
- **Manual overrides always allowed** - never restricted by rule
- **Flexible resource allocation** respecting real-world workflow

**Kit Management:**
- Live preview of kit contents in modal
- Edit kit after creation (add/remove items)
- Duplicate kit for similar events
- Kit templates for recurring event types (future feature)

---

## 📁 INTEGRATIONS

### Required Integrations
1. **Stripe** - Credit card payments (manual)
2. **SignWell** - Basic e-signatures ($8/mo)
3. **Mailgun** - Email sending (existing)
4. **Gmail API** - Communication tracking + "Last Contacted" sync (NEW - Round 5)
5. **Google Drive API** - Auto folder creation + operator upload links + one-click folder access
6. **Telegram Bot API** - Auto event group creation with operators (RECOMMENDED over Discord)
7. **Vimeo API** - Livestream event creation (CRITICAL)
8. **OpenAI API** - Voice transcription (Whisper) + command parsing (GPT-4)

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

### Gmail Integration (NEW - Round 5)
**Purpose:** Auto-track client communication without manual data entry

**Capabilities:**
- OAuth Gmail access (read sent/received emails)
- Watch for emails to/from client addresses
- Update "Last Contacted" timestamp when Commander emails client
- Search email threads for keywords ("pricing", "contract", "proposal")
- Answer voice queries: "When did I talk about pricing with [Client]?"

**Workflow:**
1. Commander grants Gmail OAuth read access
2. App registers webhook for sent/received emails
3. When email sent to client → log timestamp + update Last Contacted
4. Voice assistant can search email content for keywords
5. Dashboard shows communication timeline

**Privacy Note:**
- Requires read access to Gmail (some users hesitate)
- Only scans emails to/from known client addresses
- Can be disabled per user preference

**How HoneyBook Does It:**
- HoneyBook tracks client emails even if sent outside their platform
- Same pattern: Gmail API + webhooks

**Implementation:** Medium complexity, high value for communication tracking

---

### Google Drive Integration (EXPANDED - Round 5)
**Purpose:** Auto folder creation + operator upload links + one-click folder access

**Enhanced Workflow:**
1. When event created → auto-create folder structure:
   - `/Clients/[Client Name]/[Event Name]/Raw Footage/`
   - `/Clients/[Client Name]/[Event Name]/Deliverables/`
2. When operators assigned → generate unique upload links per operator
3. Upload links **DO NOT expire** (operators upload days later)
4. Track upload status: who uploaded, when, file count
5. Notify Commander when footage uploaded
6. **NEW:** Deliverables table has "Folder" column
7. **NEW:** Click folder icon → opens folder in new tab
8. **NEW:** Right-click folder icon → copies shareable link to clipboard

**API Capabilities:**
- Create folders programmatically
- Generate shareable upload links (non-expiring)
- Set folder permissions (private, client-accessible, public)
- Track file uploads via webhooks
- Get folder ID + shareable URL

**UI Integration:**
- Deliverables page: Folder column with click/right-click actions
- Planning page: Event detail shows folder link
- Files page: Direct access to all client folders

**Requirements:**
- Google Drive API with service account
- Webhook notifications for file uploads
- Upload link generation per operator

---

### Telegram vs Discord Decision (NEW - Round 5)
**Question:** Should we use Telegram or Discord for operator group chats?

**Recommendation: TELEGRAM (Primary), Discord (Optional Future)**

**Why Telegram Wins:**
- ✅ **Simpler API** - Easier phone-based invites, group creation
- ✅ **Mobile-First** - Better for operators on-the-go
- ✅ **Event-Specific Groups** - Perfect for temporary event coordination
- ✅ **No Server Overhead** - Groups are simple, no complex server setup
- ✅ **International** - Works globally (operators traveling)

**Discord Use Case:**
- Company-wide community (persistent)
- Voice channels for team meetings
- More complex permissions

**Implementation Plan:**
1. **Phase 1:** Telegram only (auto-create event groups)
2. **Phase 2 (Optional):** Add Discord bot for company community
3. **No Bridge:** Telegram bots can't join Discord (separate platforms)

**Telegram Bot Cannot:**
- ❌ Join Discord servers
- ❌ Bridge messages between Telegram/Discord

**Can Do Both:**
- Telegram for event-specific operator groups
- Discord for company-wide community (separate integration)

---

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

### Automatic Triggers (7 Automated Email Types)

**Email Automation Overview:**
- All automated emails fully customizable (templates, timing, conditions)
- Can be enabled/disabled per email type
- Trigger conditions configurable per tenant

**1. Show Program Reminder (48h before recital)**
- **Trigger:** 48 hours before dance recital event
- **Purpose:** Request show program PDF for titling
- **Content:** Request PDF upload, link to upload interface

**2. Rebooking Follow-Up (2-4 weeks after delivery)**
- **Trigger:** 2-4 weeks after delivery marked complete (configurable delay)
- **Purpose:** Increase repeat business
- **Content:** "Book your next event" email, link to proposal/contact form

**3. Contract Signature Reminder**
- **Trigger:** X days after contract sent, not yet signed (configurable)
- **Purpose:** Gentle reminder to sign contract
- **Content:** Link to sign contract, deadline notice

**4. Questionnaire Completion Reminder**
- **Trigger:** X days after questionnaire sent, not completed (configurable)
- **Purpose:** Collect technical event details
- **Content:** Link to complete questionnaire, importance notice

**5. Payment Due Reminder**
- **Trigger:** Payment overdue (configurable grace period)
- **Purpose:** Collect outstanding payments
- **Content:** Invoice details, payment link, friendly reminder

**6. Delivery Notification**
- **Trigger:** When deliverable marked complete
- **Purpose:** Notify client their video is ready
- **Content:** Link to Google Drive folder, download instructions

**7. Thank-You / Feedback Request**
- **Trigger:** After event completion (configurable delay)
- **Purpose:** Build relationship, collect testimonials
- **Content:** Thank-you message, feedback form link, review request

**Additional Pre-Event Triggers (Non-Automated):**
- 1 month before event → missing info reminders (manual)
- 48 hours before any event → send operator details + schedule (manual with template)

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

### North Star Metric
**"Less Mental Load"** - If the system reduces stress during event season, it's working.

> "Finally having a unified logistics and scheduling brain that reduces chaos and gives peace of mind during event season"

**Measured by:**
- Calm efficiency (not data volume)
- Reduced time scrambling for contract/event details
- Fewer operator scheduling conflicts
- Less manual follow-up needed

### Primary Goals
1. **Reduce scheduling friction** - Measured by time per booking
2. **Enable voice control** - Measured by commands per day
3. **Survive busy season** - June without meltdown
4. **Improve user well-being** - Stress reduction, peace of mind

### Success Indicators
- ✅ No more scrambling for info
- ✅ Seamless automated client communication
- ✅ Minimal manual scheduling friction
- ✅ Operators always know their assignments
- ✅ Commander can manage weekends at a glance without stress

### Non-Goals
- Complex automation
- Predictive analytics
- Deep analytics dashboards
- Multi-business scaling (yet)

---

## 🔒 CORE TRUTHS (Never Forget)

1. **Commander Mode** - System never blocks you
2. **Voice First** - Primary interface, not add-on
3. **Record Reality** - Track what happened, don't prevent
4. **Assist Decisions** - Information, not automation
5. **Simple Wins** - No bulk ops, no complex rules
6. **Full Flexibility** - No locked text anywhere
   - All email templates fully editable
   - All contract terms customizable
   - All questionnaire questions editable
   - No hard-coded client-facing text
   - Commander can override any default

---

## ✅ SPECIFICATION UPDATED (v6.0)

This document represents the complete system specification after all interviews and refinements, including Round 5 Planning & Product Decisions.

**Total decisions captured:** 100+
**Edge cases resolved:** 40+
**Features excluded:** 10+
**New features added (Round 3):** 15
**UX/UI enhancements (Round 5):** 20+
**Planning & Product decisions (Round 5):** 15 questions answered
**Architecture locked:** Yes (with customization layer added)
**Phase priority:** SCHEDULING FIRST
**Specification confidence:** 95%

**Ready for Week 2 schema validation.**

---

## APPENDIX: Quick Reference

### Key Files
- `SCHEMA_DECISIONS_FINAL.md` - Round 1 schema decisions
- `ROUND_2_DECISIONS_FINAL.md` - Edge case resolutions
- `INTERVIEW_ANSWERS_COMPLETE.md` - Round 3 vision interview (Nov 12, 2025)
- `NEW_FEATURES_FROM_INTERVIEW.md` - 15 new features from Round 3
- `ROUND5_MOCKUP_FEEDBACK.md` - UX/UI feedback (Nov 13, 2025)
- `ROUND5_INTERVIEW_QUESTIONS.md` - 15 clarification questions (pending answers)
- `schema.prisma` - Complete database schema (needs updates for Round 3+5 features)

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
- **Google Drive API** - Upload links + folder creation (EXPANDED Round 5)
- **Telegram Bot API** - Auto-group creation (EXPANDED)

### New Integrations (Round 5)
- **Gmail API** - Communication tracking, "Last Contacted" sync
- **React Grid Layout** - Dashboard drag/drop/resize
- **React Resizable** - Panel resizing across app
- **dnd-kit** - Modern drag/drop library

---

## SUMMARY OF ROUND 5 CHANGES (Nov 13, 2025)

### UX/UI Customization (NEW)
1. **Dashboard cards:** Drag/drop/resize with saved preferences
2. **View toggles:** Icon-only (remove text labels)
3. **Left navigation:** Collapsible, drag/drop reorder, double-click rename
4. **Resizable panels:** All multi-panel views have draggable dividers
5. **Modal sizing:** Standard 80% screen size for data-heavy modals
6. **Sortable columns:** Every table in the app
7. **Settings > Customization tab:** Centralize all customization options

### Page-Specific Enhancements
1. **Pipeline:** Click-to-edit all fields, product focus tracking [PENDING]
2. **Planning:** 3-panel layout, full screen mode, event detail view [PENDING details]
3. **Deliverables:** Google Drive folder column with click/copy, checkboxes per service
4. **Comms:** Renamed from Communications, email automation at top, Telegram at bottom
5. **Proposals:** Date Received column
6. **Contracts:** Full screen with templates/existing split view
7. **Questionnaires:** Color coding (yellow/red/green), incomplete sorted to top
8. **Livestreams:** Viewing page column, one-button Vimeo generation
9. **Operators:** Calendar view option, remove old nav
10. **Gear/Inventory:** Tabs per category, status indicators (red/yellow/green)

### Integration Enhancements
1. **Gmail:** Auto-track communication, search emails via voice
2. **Google Drive:** Click/right-click folder actions in Deliverables
3. **Telegram vs Discord:** Telegram primary (simpler API, mobile-first)
4. **AI Voice Agent:** 5-layer architecture detailed (Whisper → GPT-4 → Supabase → Gmail)

### Pending Clarifications (15 Interview Questions)
- Planning page architecture (calendar view, shift workflow, conflict rules)
- Product focus tracking structure
- Gear dependencies and categories
- Kit assignment workflow
- Communication touch points list
- Automated email types
- Dashboard customization UX

---

## 📄 PAGE STRUCTURE CLARIFICATION (Nov 17, 2025)

### Navigation Structure - 10 Main Pages:

1. **Dashboard** - Main landing page with widgets
2. **Pipeline** - CRM with product tracking
3. **Planning** - Calendar/scheduling view
4. **Deliverables** - Delivery tracking
5. **Communications** - Email & messaging hub
6. **Operators** - Operator management
7. **Gear** - Equipment inventory
8. **Kits** - Kit management
9. **Files** - Multi-tab page with:
   - Files tab (default)
   - Proposals tab
   - Contracts tab
   - Questionnaires tab
   - Invoices tab
   - Livestreams tab
10. **Settings** - Multi-tab page with:
    - General settings tab
    - Customization tab
    - Integrations tab
    - Billing tab

### Phase 0 Pages (Lead Generation):
- **Lead Finder** - Separate page for finding leads
- **Campaigns** - Separate page for email campaigns

### Important Notes:
- **Files page** consolidates all document management into tabs
- **Settings page** consolidates all configuration including integrations
- No separate pages for Proposals, Contracts, Questionnaires, Invoices, or Integrations
- This reduces navigation complexity while keeping related features together

---

**End of Specification v6.0**