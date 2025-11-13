# Phase 3 Alerts & Notifications System

**Project:** CommandCentered Phase 3 - Client Management & Sales Pipeline
**Created:** 2025-01-08
**Status:** Specification Complete

---

## Table of Contents

1. [Overview](#overview)
2. [Alert Types & Triggers](#alert-types--triggers)
3. [Database Schema](#database-schema)
4. [Alert Priority System](#alert-priority-system)
5. [Notification Delivery Channels](#notification-delivery-channels)
6. [Alert Rules Engine](#alert-rules-engine)
7. [User Preferences](#user-preferences)
8. [Alert Aggregation & Batching](#alert-aggregation--batching)
9. [Real-time Updates (WebSocket)](#real-time-updates-websocket)
10. [UI Components](#ui-components)

---

## Overview

The Alerts & Notifications system provides real-time awareness of critical business events across the entire client lifecycle - from lead capture through project completion.

**Key Principles:**
- **Action-oriented:** Every alert should enable immediate action
- **Context-rich:** Include all info needed to respond without clicking away
- **Priority-aware:** High-priority alerts demand immediate attention
- **Non-intrusive:** Low-priority alerts batch and aggregate
- **User-configurable:** Full control over what, when, and how alerts are delivered

**Design Philosophy:**
- In-app alerts (primary) - Real-time dashboard notifications
- Email notifications (secondary) - Configurable per alert type
- No SMS/Slack (eliminated complexity, all in CommandCentered)

---

## Alert Types & Triggers

### 1. Lead Management Alerts

#### New Lead Captured
**Trigger:** New lead created via website form or manual entry
**Priority:** HIGH
**Message:** `New lead: [Name] - [Service Type]`
**Context:**
```json
{
  "lead_id": "uuid",
  "lead_name": "Studio ABC",
  "email": "studio@example.com",
  "phone": "(555) 123-4567",
  "service_type": "Dance Recital Media",
  "event_date": "2025-06-15",
  "source": "website_form",
  "message": "Interested in 2-camera package..."
}
```
**Actions:**
- View Lead Details
- Send Proposal
- Mark as Contacted

#### Lead Inactive (7 Days)
**Trigger:** Lead created >7 days ago, status still 'new', no proposal sent
**Priority:** MEDIUM
**Message:** `Lead inactive for 7 days: [Name]`
**Context:**
```json
{
  "lead_id": "uuid",
  "lead_name": "Studio ABC",
  "days_inactive": 7,
  "last_contacted": "2025-01-01T10:00:00Z"
}
```
**Actions:**
- Send Follow-up Email
- Send Proposal
- Mark as Disqualified

#### Lead Going Cold (14 Days)
**Trigger:** Proposal sent >14 days ago, no response
**Priority:** LOW
**Message:** `Proposal unopened for 14 days: [Name]`
**Actions:**
- Send Reminder
- Mark as Lost

---

### 2. Proposal Alerts

#### Proposal Viewed
**Trigger:** Email tracking detects proposal opened (SendGrid webhook)
**Priority:** MEDIUM
**Message:** `[Name] opened your proposal - HIGH ENGAGEMENT!`
**Context:**
```json
{
  "lead_id": "uuid",
  "proposal_id": "uuid",
  "lead_name": "Studio ABC",
  "opened_at": "2025-01-08T14:32:00Z",
  "open_count": 3,
  "time_since_sent": "2 hours"
}
```
**Actions:**
- View Proposal Details
- Send Follow-up Email
- Call Client

#### Proposal Link Clicked
**Trigger:** Client clicks CTA link in proposal email
**Priority:** HIGH
**Message:** `[Name] clicked proposal link - READY TO SUBMIT!`
**Context:**
```json
{
  "lead_id": "uuid",
  "proposal_id": "uuid",
  "lead_name": "Studio ABC",
  "clicked_url": "https://streamstage.app/proposals/recital-media?lead=123",
  "clicked_at": "2025-01-08T14:35:00Z"
}
```
**Actions:**
- View Live Proposal Activity
- Send Encouragement Email

#### Proposal Submitted
**Trigger:** Client submits proposal form (lead status → 'proposal_submitted')
**Priority:** CRITICAL
**Message:** `NEW PROPOSAL SUBMISSION: [Name] - $[Amount]`
**Context:**
```json
{
  "lead_id": "uuid",
  "proposal_id": "uuid",
  "lead_name": "Studio ABC",
  "service_type": "Dance Recital Media",
  "total_amount": 2500.00,
  "submitted_at": "2025-01-08T15:00:00Z",
  "selected_items": [
    "2-Camera Setup",
    "Drone Footage",
    "Same-Day Highlight Reel"
  ]
}
```
**Actions:**
- Review Proposal
- Generate Contract
- Call to Confirm

#### Proposal Expiring Soon (3 Days)
**Trigger:** Proposal sent >27 days ago (30-day validity)
**Priority:** MEDIUM
**Message:** `Proposal expiring in 3 days: [Name]`
**Actions:**
- Extend Deadline
- Send Reminder
- Mark as Lost

---

### 3. Contract Alerts

#### Contract Pending Signature
**Trigger:** Contract generated but not signed after 48 hours
**Priority:** MEDIUM
**Message:** `Contract unsigned for 48h: [Name]`
**Context:**
```json
{
  "contract_id": "uuid",
  "client_name": "Studio ABC",
  "total_amount": 2500.00,
  "sent_at": "2025-01-06T10:00:00Z",
  "hours_pending": 48
}
```
**Actions:**
- Resend Contract Email
- Call Client
- View Contract

#### Contract Signed
**Trigger:** Client completes e-signature
**Priority:** HIGH
**Message:** `CONTRACT SIGNED: [Name] - $[Amount]`
**Context:**
```json
{
  "contract_id": "uuid",
  "client_name": "Studio ABC",
  "total_amount": 2500.00,
  "signed_at": "2025-01-08T16:00:00Z",
  "next_step": "Awaiting deposit payment"
}
```
**Actions:**
- View Contract
- Send Payment Link
- Create Event (if auto-create disabled)

#### Contract Viewed But Not Signed
**Trigger:** Email tracking shows contract opened 3+ times but not signed
**Priority:** MEDIUM
**Message:** `Contract viewed 3x but not signed: [Name]`
**Context:**
```json
{
  "contract_id": "uuid",
  "client_name": "Studio ABC",
  "view_count": 3,
  "last_viewed": "2025-01-08T12:00:00Z",
  "sent_at": "2025-01-07T10:00:00Z"
}
```
**Actions:**
- Call to Address Concerns
- Offer Revision
- Send FAQ

---

### 4. Payment Alerts

#### Payment Received
**Trigger:** Stripe webhook: payment_intent.succeeded
**Priority:** MEDIUM
**Message:** `Payment received: [Name] - $[Amount] ([Type])`
**Context:**
```json
{
  "payment_id": "uuid",
  "contract_id": "uuid",
  "client_name": "Studio ABC",
  "amount": 1250.00,
  "payment_type": "deposit",
  "paid_at": "2025-01-08T16:30:00Z",
  "remaining_balance": 1250.00
}
```
**Actions:**
- View Payment Details
- Send Receipt
- View Contract

#### Payment Due Soon (3 Days)
**Trigger:** Payment due_date in 3 days, status still 'pending'
**Priority:** MEDIUM
**Message:** `Payment due in 3 days: [Name] - $[Amount]`
**Context:**
```json
{
  "payment_id": "uuid",
  "contract_id": "uuid",
  "client_name": "Studio ABC",
  "amount": 1250.00,
  "payment_type": "final",
  "due_date": "2025-01-11",
  "days_until_due": 3
}
```
**Actions:**
- Send Payment Reminder
- Call Client
- Extend Deadline

#### Payment Overdue
**Trigger:** Payment due_date passed, status still 'pending'
**Priority:** HIGH
**Message:** `PAYMENT OVERDUE: [Name] - $[Amount] (Due [Date])`
**Context:**
```json
{
  "payment_id": "uuid",
  "contract_id": "uuid",
  "client_name": "Studio ABC",
  "amount": 1250.00,
  "payment_type": "final",
  "due_date": "2025-01-05",
  "days_overdue": 3
}
```
**Actions:**
- Send Urgent Reminder
- Call Immediately
- Pause Project

#### Payment Failed
**Trigger:** Stripe webhook: payment_intent.payment_failed
**Priority:** CRITICAL
**Message:** `PAYMENT FAILED: [Name] - $[Amount] - [Reason]`
**Context:**
```json
{
  "payment_id": "uuid",
  "contract_id": "uuid",
  "client_name": "Studio ABC",
  "amount": 1250.00,
  "failure_reason": "Insufficient funds",
  "failed_at": "2025-01-08T16:45:00Z"
}
```
**Actions:**
- Call Client Immediately
- Send Retry Link
- Offer Alternative Payment

#### Payment Disputed
**Trigger:** Stripe webhook: charge.dispute.created
**Priority:** CRITICAL
**Message:** `PAYMENT DISPUTE: [Name] - $[Amount] - [Reason]`
**Context:**
```json
{
  "payment_id": "uuid",
  "contract_id": "uuid",
  "client_name": "Studio ABC",
  "amount": 1250.00,
  "dispute_reason": "Product not received",
  "evidence_due_by": "2025-01-15",
  "stripe_dispute_id": "dp_xxxxx"
}
```
**Actions:**
- View Dispute Details
- Submit Evidence
- Contact Stripe Support

---

### 5. Client Questionnaire Alerts

#### Questionnaire Incomplete (7 Days Before Event)
**Trigger:** Event date in 7 days, questionnaire not completed
**Priority:** HIGH
**Message:** `Client questionnaire incomplete: [Name] - Event in 7 days`
**Context:**
```json
{
  "event_id": "uuid",
  "client_name": "Studio ABC",
  "event_date": "2025-01-15",
  "days_until_event": 7,
  "questionnaire_sent": "2025-01-01",
  "completion_pct": 30
}
```
**Actions:**
- Send Urgent Reminder
- Call Client
- View Questionnaire Status

#### Questionnaire Partially Completed
**Trigger:** Questionnaire started but not finished after 48 hours
**Priority:** MEDIUM
**Message:** `Questionnaire 50% complete: [Name]`
**Actions:**
- Send Gentle Reminder
- Offer Phone Consultation

#### Questionnaire Completed
**Trigger:** Client submits all questionnaire sections
**Priority:** LOW
**Message:** `Client questionnaire completed: [Name]`
**Actions:**
- Review Responses
- Confirm Event Details
- Create Shot List

---

### 6. Pre-Event Alerts

#### Missing Event Info (14 Days Before)
**Trigger:** Event in 14 days, critical fields missing (venue address, contact, timeline)
**Priority:** HIGH
**Message:** `Missing event info: [Name] - Event in 14 days`
**Context:**
```json
{
  "event_id": "uuid",
  "client_name": "Studio ABC",
  "event_date": "2025-01-22",
  "missing_fields": ["venue_address", "venue_contact", "event_timeline"]
}
```
**Actions:**
- Request Missing Info
- Call Client
- View Event Details

#### Gear Not Assigned (7 Days Before)
**Trigger:** Event in 7 days, no gear kits assigned
**Priority:** HIGH
**Message:** `No gear assigned: [Event Name] - [Date]`
**Actions:**
- Assign Gear Kit
- View Event Logistics
- Check Availability

#### Operators Not Assigned (7 Days Before)
**Trigger:** Event in 7 days, no operators assigned
**Priority:** CRITICAL
**Message:** `NO OPERATORS ASSIGNED: [Event Name] - [Date]`
**Actions:**
- Assign Operators
- View Schedule Conflicts
- Post to Crew Board

#### Event Tomorrow
**Trigger:** Event date is tomorrow
**Priority:** MEDIUM
**Message:** `Event tomorrow: [Event Name] - [Venue]`
**Context:**
```json
{
  "event_id": "uuid",
  "event_name": "Studio ABC Spring Recital",
  "event_date": "2025-01-09",
  "venue_name": "Theater Hall",
  "venue_address": "123 Main St",
  "assigned_operators": ["John Doe", "Jane Smith"],
  "gear_kits": ["Kit A", "Kit B"]
}
```
**Actions:**
- View Event Checklist
- Confirm with Operators
- Pack Gear

---

### 7. Deliverable Alerts

#### Deliverable Deadline Approaching (3 Days)
**Trigger:** Deliverable due in 3 days, status not 'completed'
**Priority:** MEDIUM
**Message:** `Deliverable due in 3 days: [Event Name] - [Type]`
**Context:**
```json
{
  "deliverable_id": "uuid",
  "event_id": "uuid",
  "client_name": "Studio ABC",
  "deliverable_type": "Final Edit",
  "due_date": "2025-01-11",
  "status": "in_progress"
}
```
**Actions:**
- View Deliverable Status
- Update Progress
- Request Extension

#### Deliverable Overdue
**Trigger:** Deliverable due_date passed, status not 'completed'
**Priority:** CRITICAL
**Message:** `DELIVERABLE OVERDUE: [Event Name] - [Type] (Due [Date])`
**Actions:**
- Mark Complete
- Send Client Update
- Escalate Issue

#### Deliverable Completed
**Trigger:** Deliverable status → 'completed'
**Priority:** LOW
**Message:** `Deliverable completed: [Event Name] - [Type]`
**Actions:**
- Send to Client
- Upload to Drive
- Mark as Delivered

---

### 8. System Alerts

#### Integration Failure (Stripe/Google Drive/Email)
**Trigger:** Integration health check detects >50% failure rate
**Priority:** CRITICAL
**Message:** `INTEGRATION FAILURE: [Service] - [Failure Rate]%`
**Context:**
```json
{
  "integration": "stripe",
  "failure_rate": 75,
  "recent_errors": [
    "Connection timeout",
    "API key invalid",
    "Rate limit exceeded"
  ],
  "first_failure": "2025-01-08T12:00:00Z"
}
```
**Actions:**
- View Integration Logs
- Check API Status
- Retry Failed Operations

#### Database Backup Failed
**Trigger:** Daily backup cron job fails
**Priority:** CRITICAL
**Message:** `DATABASE BACKUP FAILED - IMMEDIATE ACTION REQUIRED`
**Actions:**
- View Backup Logs
- Run Manual Backup
- Check Storage

#### Orphaned Contract Detected
**Trigger:** Daily cron finds contract signed + paid but no event created
**Priority:** HIGH
**Message:** `Orphaned contract: [Client Name] - Missing event`
**Actions:**
- Create Event Manually
- View Contract Details
- Check Integration Logs

---

## Database Schema

### alerts Table

```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  -- Classification
  alert_type VARCHAR(100) NOT NULL, -- 'new_lead', 'payment_received', etc.
  priority ENUM('low', 'medium', 'high', 'critical') NOT NULL,
  category ENUM('lead', 'proposal', 'contract', 'payment', 'event', 'deliverable', 'system') NOT NULL,

  -- Entity reference (polymorphic)
  entity_type VARCHAR(50) NOT NULL, -- 'lead', 'contract', 'payment', etc.
  entity_id UUID NOT NULL,

  -- Content
  message TEXT NOT NULL,
  context_json JSONB NOT NULL DEFAULT '{}'::jsonb, -- Full context for quick actions

  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  dismissed BOOLEAN DEFAULT false,
  dismissed_at TIMESTAMPTZ,

  -- Delivery tracking
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- Auto-dismiss after X days

  -- Indexes
  INDEX idx_alerts_tenant_unread (tenant_id, read, created_at DESC),
  INDEX idx_alerts_priority (tenant_id, priority, created_at DESC),
  INDEX idx_alerts_entity (entity_type, entity_id)
);

-- RLS Policy
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY alerts_tenant_isolation ON alerts
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### alert_preferences Table

```sql
CREATE TABLE alert_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  -- Alert type configuration
  alert_type VARCHAR(100) NOT NULL,

  -- Delivery channels
  in_app_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT false,

  -- Timing
  email_immediately BOOLEAN DEFAULT false,
  email_digest_frequency ENUM('none', 'daily', 'weekly') DEFAULT 'none',

  -- Auto-dismiss rules
  auto_dismiss_after_days INTEGER,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, alert_type)
);
```

---

## Alert Priority System

### Priority Levels

**CRITICAL** (Red)
- Requires immediate action
- Potential revenue/data loss
- System failures
- Examples: Payment disputed, operators not assigned 24h before event, integration failure

**HIGH** (Orange)
- Requires action within 24 hours
- Significant business impact
- Examples: New proposal submission, payment overdue, contract signed

**MEDIUM** (Yellow)
- Requires action within 48-72 hours
- Moderate business impact
- Examples: Proposal viewed, payment due soon, lead inactive 7 days

**LOW** (Green)
- Informational, action optional
- Minimal time sensitivity
- Examples: Deliverable completed, questionnaire completed, lead going cold 14 days

### Priority-Based UI Treatment

```typescript
const PRIORITY_STYLES = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-900',
    icon: 'text-red-600',
    badge: 'bg-red-600 text-white',
    pulse: true, // Animated pulse effect
    sound: true  // Play notification sound
  },
  high: {
    bg: 'bg-orange-50',
    border: 'border-orange-500',
    text: 'text-orange-900',
    icon: 'text-orange-600',
    badge: 'bg-orange-600 text-white',
    pulse: false,
    sound: false
  },
  medium: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    text: 'text-yellow-900',
    icon: 'text-yellow-600',
    badge: 'bg-yellow-600 text-white',
    pulse: false,
    sound: false
  },
  low: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-900',
    icon: 'text-green-600',
    badge: 'bg-green-600 text-white',
    pulse: false,
    sound: false
  }
};
```

---

## Notification Delivery Channels

### In-App Alerts (Primary)

**Location:** Top-right corner notification bell icon

**Features:**
- Real-time badge count (unread alerts)
- Dropdown panel with recent alerts (last 20)
- Priority-based sorting (critical → low)
- Quick actions inline (mark read, dismiss, primary action)
- Link to full Alert Center

**Component Structure:**
```tsx
<AlertBell>
  <Badge count={unreadCount} />
  <DropdownPanel>
    {alerts.map(alert => (
      <AlertCard
        priority={alert.priority}
        message={alert.message}
        timestamp={alert.created_at}
        actions={getQuickActions(alert)}
      />
    ))}
    <ViewAllLink href="/alerts" />
  </DropdownPanel>
</AlertBell>
```

### Email Notifications (Secondary)

**Delivery Modes:**
1. **Immediate** - Send email instantly (critical/high only)
2. **Daily Digest** - Batch all alerts from last 24h, send at 9am
3. **Weekly Digest** - Batch all alerts from last 7 days, send Monday 9am
4. **Disabled** - No email for this alert type

**Email Template:**
```html
<h1>CommandCentered Alert: [Type]</h1>
<p><strong>Priority:</strong> [CRITICAL/HIGH/MEDIUM/LOW]</p>
<p><strong>Message:</strong> [Message]</p>

<h2>Quick Context</h2>
<ul>
  [Context details from context_json]
</ul>

<a href="https://commandcentered.app/alerts/[id]" class="cta">
  View in CommandCentered →
</a>
```

---

## Alert Rules Engine

### Rule Definition

```typescript
interface AlertRule {
  alert_type: string;
  trigger_condition: string; // SQL WHERE clause or event name
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'lead' | 'proposal' | 'contract' | 'payment' | 'event' | 'deliverable' | 'system';
  message_template: string; // Handlebars template
  context_extractor: (entity: any) => Record<string, any>;
  quick_actions: QuickAction[];
}

interface QuickAction {
  label: string;
  action_type: 'link' | 'mutation' | 'email';
  action_config: {
    url?: string;
    mutation?: string;
    email_template?: string;
  };
}
```

### Example Rule: Proposal Submitted

```typescript
const proposalSubmittedRule: AlertRule = {
  alert_type: 'proposal_submitted',
  trigger_condition: 'lead.status = proposal_submitted',
  priority: 'critical',
  category: 'proposal',

  message_template: 'NEW PROPOSAL SUBMISSION: {{lead.name}} - ${{proposal.total_amount}}',

  context_extractor: (lead) => ({
    lead_id: lead.id,
    proposal_id: lead.active_proposal_id,
    lead_name: lead.name,
    email: lead.email,
    phone: lead.phone,
    service_type: lead.service_type,
    total_amount: lead.active_proposal.total_amount,
    submitted_at: lead.updated_at,
    selected_items: lead.active_proposal.config_items
      .filter(item => item.selected)
      .map(item => item.config.label)
  }),

  quick_actions: [
    {
      label: 'Review Proposal',
      action_type: 'link',
      action_config: {
        url: '/proposals/{{proposal_id}}'
      }
    },
    {
      label: 'Generate Contract',
      action_type: 'mutation',
      action_config: {
        mutation: 'generateContract',
        params: { proposal_id: '{{proposal_id}}' }
      }
    },
    {
      label: 'Call Client',
      action_type: 'link',
      action_config: {
        url: 'tel:{{phone}}'
      }
    }
  ]
};
```

### Alert Creation Service

```typescript
async function createAlert(params: {
  tenant_id: string;
  alert_type: string;
  entity_type: string;
  entity_id: string;
  context?: Record<string, any>;
}) {
  const rule = ALERT_RULES[params.alert_type];
  if (!rule) throw new Error(`Unknown alert type: ${params.alert_type}`);

  // Extract context if not provided
  const context = params.context || await rule.context_extractor(
    await getEntity(params.entity_type, params.entity_id)
  );

  // Render message template
  const message = Handlebars.compile(rule.message_template)(context);

  // Create alert
  const alert = await db.alerts.create({
    data: {
      tenant_id: params.tenant_id,
      alert_type: params.alert_type,
      priority: rule.priority,
      category: rule.category,
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      message,
      context_json: context,
      expires_at: getExpiryDate(rule.priority) // Critical: 7 days, Low: 1 day
    }
  });

  // Check user preferences for email delivery
  const prefs = await db.alert_preferences.findUnique({
    where: {
      tenant_id_alert_type: {
        tenant_id: params.tenant_id,
        alert_type: params.alert_type
      }
    }
  });

  if (prefs?.email_enabled && prefs.email_immediately) {
    await sendAlertEmail(alert);
  }

  // Send real-time WebSocket notification
  await sendWebSocketNotification(params.tenant_id, alert);

  return alert;
}
```

---

## User Preferences

### Preference Configuration UI

**Per Alert Type:**
- ✅ Enable/disable in-app notifications
- ✅ Enable/disable email notifications
- ✅ Email delivery mode (immediate, daily digest, weekly digest)
- ✅ Auto-dismiss after X days

**Global Settings:**
- 🔕 Do Not Disturb mode (pause all non-critical alerts)
- 🕒 Quiet hours (no emails between 10pm-8am)
- 🔊 Enable notification sounds
- 📧 Daily digest delivery time

### Default Preferences (on tenant creation)

```typescript
const DEFAULT_ALERT_PREFERENCES = {
  // Critical alerts - always email immediately
  payment_disputed: { in_app: true, email: true, email_immediately: true },
  payment_failed: { in_app: true, email: true, email_immediately: true },
  operators_not_assigned: { in_app: true, email: true, email_immediately: true },
  deliverable_overdue: { in_app: true, email: true, email_immediately: true },

  // High priority - in-app + daily digest
  proposal_submitted: { in_app: true, email: true, email_immediately: false, digest: 'daily' },
  contract_signed: { in_app: true, email: true, email_immediately: false, digest: 'daily' },
  payment_overdue: { in_app: true, email: true, email_immediately: false, digest: 'daily' },

  // Medium priority - in-app only
  proposal_viewed: { in_app: true, email: false },
  payment_received: { in_app: true, email: false },
  contract_pending_signature: { in_app: true, email: false },

  // Low priority - in-app, auto-dismiss 1 day
  deliverable_completed: { in_app: true, email: false, auto_dismiss_after_days: 1 },
  questionnaire_completed: { in_app: true, email: false, auto_dismiss_after_days: 1 }
};
```

---

## Alert Aggregation & Batching

### Daily Digest Email

**Sent:** 9:00 AM daily
**Contains:** All alerts from last 24h that have email enabled + digest mode

```typescript
async function generateDailyDigest(tenantId: string) {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const alerts = await db.alerts.findMany({
    where: {
      tenant_id: tenantId,
      created_at: { gte: yesterday },
      email_sent: false
    },
    include: {
      preferences: true
    }
  });

  // Filter to only alerts with digest enabled
  const digestAlerts = alerts.filter(a =>
    a.preferences?.email_enabled &&
    a.preferences?.email_digest_frequency === 'daily'
  );

  if (digestAlerts.length === 0) return;

  // Group by category
  const grouped = groupBy(digestAlerts, 'category');

  await sendEmail({
    to: getTenantOwnerEmail(tenantId),
    template: 'daily_digest',
    data: {
      date: new Date().toLocaleDateString(),
      total_count: digestAlerts.length,
      critical_count: digestAlerts.filter(a => a.priority === 'critical').length,
      high_count: digestAlerts.filter(a => a.priority === 'high').length,
      grouped_alerts: grouped
    }
  });

  // Mark as email sent
  await db.alerts.updateMany({
    where: { id: { in: digestAlerts.map(a => a.id) } },
    data: { email_sent: true, email_sent_at: new Date() }
  });
}
```

### In-App Aggregation

**Group similar alerts:**
```
"3 payments due this week"
"5 proposals unopened for 7+ days"
"2 events tomorrow"
```

```typescript
async function aggregateAlerts(tenantId: string) {
  const alerts = await db.alerts.findMany({
    where: {
      tenant_id: tenantId,
      read: false,
      dismissed: false
    }
  });

  // Group by alert_type
  const grouped = groupBy(alerts, 'alert_type');

  return Object.entries(grouped).map(([type, items]) => {
    if (items.length === 1) {
      return items[0]; // Single alert, show normally
    }

    // Multiple alerts of same type - aggregate
    return {
      id: `aggregated_${type}`,
      alert_type: type,
      priority: Math.max(...items.map(i => PRIORITY_RANK[i.priority])),
      category: items[0].category,
      message: `${items.length} ${type.replace(/_/g, ' ')} alerts`,
      context_json: { count: items.length, alert_ids: items.map(i => i.id) },
      aggregated: true,
      items
    };
  });
}
```

---

## Real-time Updates (WebSocket)

### WebSocket Integration

**Server-side (Supabase Realtime):**
```typescript
// Subscribe to alerts table changes
supabase
  .channel('alerts')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'alerts',
      filter: `tenant_id=eq.${tenantId}`
    },
    (payload) => {
      // Broadcast to connected clients
      broadcastAlert(tenantId, payload.new);
    }
  )
  .subscribe();
```

**Client-side (React):**
```typescript
function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { session } = useSession();

  useEffect(() => {
    const channel = supabase
      .channel('alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
          filter: `tenant_id=eq.${session.tenant_id}`
        },
        (payload) => {
          const newAlert = payload.new as Alert;

          // Add to state
          setAlerts(prev => [newAlert, ...prev]);

          // Show toast notification
          if (newAlert.priority === 'critical') {
            toast.error(newAlert.message, {
              action: getQuickAction(newAlert)
            });
            playNotificationSound();
          } else if (newAlert.priority === 'high') {
            toast.warning(newAlert.message);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [session.tenant_id]);

  return alerts;
}
```

---

## UI Components

### Alert Bell Component

```tsx
function AlertBell() {
  const { alerts } = useAlerts();
  const unreadCount = alerts.filter(a => !a.read && !a.dismissed).length;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full"
      >
        <BellIcon className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <AlertDropdown alerts={alerts} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
```

### Alert Dropdown Panel

```tsx
function AlertDropdown({ alerts, onClose }: Props) {
  const recent = alerts.slice(0, 20);
  const grouped = groupBy(recent, (a) => {
    const today = isToday(a.created_at);
    const yesterday = isYesterday(a.created_at);
    if (today) return 'Today';
    if (yesterday) return 'Yesterday';
    return 'Earlier';
  });

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[600px] overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={markAllAsRead}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Mark all read
        </button>
      </div>

      {Object.entries(grouped).map(([timeGroup, items]) => (
        <div key={timeGroup}>
          <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600">
            {timeGroup}
          </div>
          {items.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      ))}

      <div className="p-4 border-t border-gray-200">
        <Link
          href="/alerts"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all alerts →
        </Link>
      </div>
    </div>
  );
}
```

### Alert Card Component

```tsx
function AlertCard({ alert }: { alert: Alert }) {
  const styles = PRIORITY_STYLES[alert.priority];
  const actions = getQuickActions(alert);

  return (
    <div
      className={`p-4 border-l-4 ${styles.border} ${alert.read ? 'bg-white' : styles.bg} hover:bg-gray-50 cursor-pointer`}
      onClick={() => markAsRead(alert.id)}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-1 ${styles.icon}`}>
          {getAlertIcon(alert.category)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-medium ${styles.text}`}>
              {alert.message}
            </p>
            <span className={`text-xs px-2 py-1 rounded-full ${styles.badge} flex-shrink-0`}>
              {alert.priority.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {formatRelativeTime(alert.created_at)}
          </p>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-2">
            {actions.slice(0, 2).map(action => (
              <button
                key={action.label}
                onClick={(e) => {
                  e.stopPropagation();
                  executeAction(action);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            dismissAlert(alert.id);
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
```

### Full Alert Center Page

**Route:** `/dashboard/alerts`

**Features:**
- Filter by category (lead, proposal, contract, payment, event, deliverable, system)
- Filter by priority (critical, high, medium, low)
- Filter by status (unread, read, all)
- Batch actions (mark all read, dismiss all)
- Search alerts
- Export to CSV

```tsx
function AlertCenter() {
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    status: 'unread'
  });

  const { alerts } = useAlerts();
  const filtered = applyFilters(alerts, filters);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Alert Center</h1>
        <div className="flex gap-2">
          <button onClick={markAllAsRead}>Mark all read</button>
          <button onClick={dismissAll}>Dismiss all</button>
          <button onClick={exportToCSV}>Export</button>
        </div>
      </div>

      <AlertFilters filters={filters} onChange={setFilters} />

      <div className="space-y-2">
        {filtered.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
```

---

## Summary

This alerts & notifications system provides:

✅ **Comprehensive Coverage** - 25+ alert types across entire client lifecycle
✅ **Priority-Based Delivery** - Critical alerts demand immediate attention
✅ **Multi-Channel** - In-app (primary) + email (configurable)
✅ **Real-time Updates** - WebSocket integration for instant notifications
✅ **User Control** - Full preference customization per alert type
✅ **Smart Aggregation** - Daily digests prevent email overload
✅ **Action-Oriented** - Quick actions inline for immediate response
✅ **Context-Rich** - All info needed without clicking away

**Next Steps:**
- Session 7: Spec Documentation (HoneyBook matrix, update SPEC_V2_LOCKED.md)
- Session 8: Additional UI Mockups (4 more HTML files)
- Session 9: Final Questions List
- Session 10: Documentation & Handoff

---

*Alerts & Notifications specification complete. Ready for implementation.*
