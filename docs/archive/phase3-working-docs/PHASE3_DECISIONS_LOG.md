# Phase 3 Implementation Decisions - FINAL

**Date:** 2025-01-08
**Source:** Voice transcript from user
**Status:** ✅ Decisions locked, ready for implementation

---

## CRITICAL DECISIONS (Q1-Q8)

### Q1: Payment Schedule Default Rules ✅

**Decision:** Manual payment schedule configuration (like HoneyBook)

**Implementation:**
- Default: 50% on contract signing, 50% on delivery
- User can customize per contract in admin panel
- **NO automation** - Payments are tracked but not auto-charged
- Payment schedule is informational/invoicing tool only
- Stripe integration for manual credit card processing

**Database:**
```sql
-- payment_schedules table stores milestones
CREATE TABLE payment_schedules (
  id UUID PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id),
  milestone_name TEXT, -- 'Deposit', 'Final', 'Milestone 1', etc.
  amount DECIMAL(10,2),
  due_date DATE,
  status TEXT DEFAULT 'pending' -- 'pending', 'paid', 'overdue'
);
```

**UI:**
- Contract creation form has payment schedule builder
- "Add Milestone" button to add custom milestones
- Total must equal contract amount (validation)

---

### Q2: E-Signature Service ✅

**Decision:** SignWell ($8/month)

**Justification:** Cheapest, modern API, sufficient for needs

**Implementation:**
- Sprint 3 (Weeks 5-6)
- SignWell API integration
- Webhook for signature completion events

---

### Q3: Email Service ✅

**Decision:** Mailgun (already set up)

**Justification:** User already has Mailgun account, no migration needed

**Implementation:**
- Use existing Mailgun credentials
- Mailgun API for sending
- Mailgun webhooks for tracking (opens, clicks, bounces)

**Note:** Already familiar with Mailgun from other app

---

### Q4: Proposal Expiration Handling ✅

**Decision:** NO expiration - Proposals don't expire

**Implementation:**
- Remove `expires_at` field from proposals table
- Proposals remain active indefinitely
- User manually closes/archives proposals if needed

**Justification:** Don't want to lose interested clients due to arbitrary deadlines

---

### Q5: Duplicate Lead Handling ✅

**Decision:** Merge + Update (Option C)

**Implementation:**
```typescript
// Lead capture workflow
const existingLead = await db.leads.findFirst({
  where: { tenant_id, email }
});

if (existingLead) {
  // Update existing lead
  await db.leads.update({
    where: { id: existingLead.id },
    data: {
      last_contacted_at: new Date(),
      notes: `${existingLead.notes}\n\n[${new Date().toISOString()}] New inquiry:\n${newMessage}`,
      status: existingLead.status === 'lost' ? 'new' : existingLead.status
    }
  });

  // Send alert
  await createAlert({
    type: 'lead_re_inquired',
    message: `${existingLead.name} submitted another inquiry`
  });
} else {
  // Create new lead
}
```

---

### Q6: Contract Counter-Signature Timing ✅

**Decision:** Auto-counter-sign when sent (pre-signed by vendor)

**Implementation:**
- When contract is generated from proposal, automatically sign as vendor
- Client sees fully-executed contract immediately
- Vendor signature timestamp = contract creation time
- No manual counter-signing step needed

**Justification:** Contract sent = approval implicit, reduces friction

---

### Q7: Suite 1 ↔ Suite 2 Handoff Trigger ✅ **CRITICAL CHANGE**

**Decision:** Contract signed → Auto-create event (NO payment required)

**Implementation:**
```typescript
// Triggered when contract status changes to 'signed'
async function handleContractSigned(contractId: string) {
  const contract = await db.contracts.findUnique({
    where: { id: contractId },
    include: { proposal: { include: { config_items: true } }, client: true }
  });

  // IMMEDIATELY create event (don't wait for payment)
  const event = await db.events.create({
    data: {
      tenant_id: contract.tenant_id,
      client_id: contract.client_id,
      contract_id: contract.id,
      service_type: contract.proposal.service_type,
      event_date: extractEventDate(contract.proposal.config_items),
      venue_name: extractVenueName(contract.proposal.config_items),
      venue_address: extractVenueAddress(contract.proposal.config_items),
      total_amount: contract.total_amount,
      status: 'pending_questionnaire',
      created_from_contract: true
    }
  });

  // Link back
  await db.contracts.update({
    where: { id: contractId },
    data: { event_id: event.id }
  });

  // Send client questionnaire (if enabled)
  await sendClientQuestionnaire({ event_id: event.id });

  // Create alert
  await createAlert({
    type: 'event_created_from_contract',
    message: `Event created: ${contract.client.name} - ${event.service_type}`
  });
}
```

**Payment Tracking:**
- Payments tracked separately in `payments` table
- Linked to contract, but don't block event creation
- Stripe integration for credit card processing (manual, not automated)

**Justification:** User wants event in logistics system as soon as contract signed, payment tracking is separate concern

---

### Q8: Domain Strategy ✅

**Decision:** Two separate domains

**Domains:**
- **streamstage.live** (already exists) - Client-facing portal
  - Proposals, contracts, payments, questionnaires
  - StreamStage branding (professional, clean)
- **commandcentered.app** (new) - Internal operations
  - CRM, lead management, logistics, scheduling
  - CommandCentered branding (tactical HUD)

**Primary Brand:** StreamStage (public-facing business)

**Deployment:**
- Both domains point to same Next.js app
- Route-based branding: `if (domain === 'streamstage.live') → client theme`
- Separate authentication contexts (clients vs. admins)

---

## BONUS FEATURE REQUEST: Auto-Deploy Proposals to StreamStage ✅

**User Request:** "It would be awesome if the app commandcentered could automatically deploy these proposals to URLs on streamstage domain"

**Implementation:**

**Workflow:**
1. Admin creates proposal template in CommandCentered app
2. Click "Publish" → Generates unique slug
3. Proposal URL: `https://streamstage.live/proposals/{slug}`
4. Admin sends link to client via email
5. Client fills proposal → Submission goes to CommandCentered

**Technical:**
```typescript
// Proposal template publication
async function publishProposalTemplate(templateId: string) {
  const template = await db.proposal_templates.findUnique({
    where: { id: templateId }
  });

  // Generate slug if not exists
  const slug = template.slug || generateSlug(template.name);

  await db.proposal_templates.update({
    where: { id: templateId },
    data: {
      slug,
      published_at: new Date(),
      published_url: `https://streamstage.live/proposals/${slug}`
    }
  });

  return `https://streamstage.live/proposals/${slug}`;
}
```

**Routes:**
- `/proposals/[slug]` - Client-facing proposal form (StreamStage theme)
- Dynamic route rendering from JSONB config
- Live pricing calculator (client-side JavaScript)

---

## HIGH PRIORITY DECISIONS (Q9-Q18)

### Q9: Google Drive Integration ✅

**Decision:** YES - Google Drive integration in MVP (Sprint 5)

**Implementation:**

**Shared Drive Setup:**
- User already has shared drive
- Store shared drive ID in tenant settings
- Create project folders under shared drive root (or specific parent folder)

**Auto-Folder Creation:**
```typescript
// When contract signed → Create folder
async function createProjectFolder(eventId: string) {
  const event = await db.events.findUnique({
    where: { id: eventId },
    include: { client: true }
  });

  // Create folder in shared drive
  const folder = await googleDrive.createFolder({
    name: `${event.client.name} - ${event.service_type} - ${formatDate(event.event_date)}`,
    parentFolderId: SHARED_DRIVE_PARENT_ID,
    driveId: SHARED_DRIVE_ID
  });

  // Share with client (view-only)
  await googleDrive.shareFolder({
    folderId: folder.id,
    email: event.client.email,
    role: 'reader'
  });

  // Update event
  await db.events.update({
    where: { id: eventId },
    data: {
      google_drive_folder_id: folder.id,
      google_drive_folder_url: folder.webViewLink
    }
  });
}
```

**BONUS FEATURE: Email Notifications on Folder Updates**

**User Request:** "They would get automatic emails when the folders are updated managed through the app"

**Implementation:**
- Google Drive API webhook for file changes
- Watch folder for changes (file added, modified)
- Send email to client: "New files added to your project folder"
- Managed through CommandCentered app (enable/disable per event)

```typescript
// Watch folder for changes
await googleDrive.files.watch({
  fileId: folderId,
  requestBody: {
    id: `folder-watch-${eventId}`,
    type: 'web_hook',
    address: `https://commandcentered.app/api/webhooks/google-drive`
  }
});

// Webhook handler
async function handleFolderChange(notification: GoogleDriveNotification) {
  const event = await findEventByFolderId(notification.resourceId);

  // Send email to client
  await sendEmail({
    to: event.client.email,
    subject: 'New files in your project folder',
    template: 'folder_updated',
    data: {
      folder_url: event.google_drive_folder_url,
      event_name: event.service_type
    }
  });
}
```

**Client Permissions:** View-only (reader role)

**Failure Handling:** Create event anyway, send alert to manually create folder

---

### Q10: Client Questionnaires ✅

**Decision:** YES - Client questionnaires in MVP (Sprint 5)

**User Request:** "Build like a client touch email flow once they've signed contract"

**Workflow:**
1. Contract signed → Event created
2. Auto-send questionnaire email
3. Client fills questionnaire (pre-event details)
4. Alert if questionnaire incomplete X days before event
5. Email reminders (automated flow)

**Implementation:**

**Email Flow Trigger:**
```typescript
// When contract signed (same trigger as event creation)
async function handleContractSigned(contractId: string) {
  // ... create event ...

  // Send questionnaire
  await sendClientQuestionnaire({
    event_id: event.id,
    client_email: contract.client.email,
    client_name: contract.client.name,
    questionnaire_url: `https://streamstage.live/portal/events/${event.id}/questionnaire`
  });
}
```

**Questionnaire Schema:**
```sql
CREATE TABLE questionnaires (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  service_type TEXT, -- Different questions per service type
  questions JSONB, -- Flexible question structure
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  event_id UUID REFERENCES events(id),
  questionnaire_id UUID REFERENCES questionnaires(id),
  responses JSONB, -- Client answers
  completed BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Alert System:**
- Daily cron job: Check events 14 days away with incomplete questionnaire
- Send reminder email to client
- Alert Commander: "Questionnaire incomplete for [Event Name]"

**Templates:** 5 service-specific questionnaire templates (same as proposal templates)

---

### Q11: Stripe Features for MVP ✅

**Decision:** Basic credit card processing only

**Features Needed:**
- ✅ Payment Intents (one-time charges)
- ✅ Customers (client records)
- ✅ Invoices (manual invoice generation)
- ✅ Webhooks (payment success/failure)
- ❌ NO Payment Schedules (no auto-charging)
- ❌ NO ACH payments (cards only)
- ❌ NO Apple/Google Pay (not needed)
- ❌ NO Subscriptions (not applicable)

**Use Case:** Replace HoneyBook's credit card processing

**Workflow:**
1. Contract signed → Payment schedule created (informational)
2. Commander sends Stripe invoice manually (via admin panel)
3. Client pays via credit card (Stripe hosted page)
4. Webhook updates payment status
5. Payment marked as 'paid' in database

**No automation** - All payments initiated manually by Commander

---

### Q12: Proposal Builder Builder UX ✅

**Decision:** Use recommendation (3-column layout)

**Justification:** Already have tactical-10 mockup, professional workflow

---

### Q13: CRM View ✅

**Decision:** Both table and kanban with toggle

**Implementation:**
- Default: Table view (data-dense, sortable, filterable)
- Toggle to Kanban board (visual pipeline)
- View preference saved per user

---

### Q14: Alert Notification Sounds ✅

**Decision:** No audio in app (visual only)

**Implementation:**
- All alerts silent
- Badge count + panel only
- No notification sounds

---

### Q15: Lead Source Tracking ✅

**Decision:** Proposed list is good

**Lead Sources:**
- Website Form
- Referral
- Repeat Client
- Instagram, Facebook, TikTok
- Google Search (Organic)
- Google Ads
- Email Campaign
- Trade Show / Event
- Cold Outreach
- Other (free text)

---

### Q16: Email Template Management ✅

**Decision:** Code-based (TypeScript + HTML emails)

**Justification:** "HTML emails working well in my other app"

**Implementation:**
- React Email components
- Stored in codebase (`/emails` directory)
- Type-safe, version controlled
- Mailgun for delivery

---

### Q17: Pre-Built Proposal Templates ✅

**Decision:** 4 service-specific templates (not 5)

**Templates:**
1. Dance Recital Media
2. Dance Promo Videos
3. Concert Coverage
4. Event Videography

**Note:** User specified 4, not 5. Corporate Video Production not mentioned.

---

### Q18: Analytics Dashboard ✅

**Decision:** NOT in MVP - Defer to later

**Justification:** "Don't need analytics quite yet, it's more about logistics"

**Priority:** Phase 3.5 or later

---

## MEDIUM PRIORITY - Use Recommendations

**Q19-Q28:** User deferred, use recommended defaults from questions document

---

## LOW PRIORITY - Defer to Phase 3.5+

**Q29-Q35:** Defer to post-MVP

---

## CRITICAL SPEC CHANGES SUMMARY

### 1. Payment Trigger REMOVED ✅
- **OLD:** Contract signed + first payment → Create event
- **NEW:** Contract signed → Create event (payment not required)
- Payment tracking is separate, informational only

### 2. Email Service Changed ✅
- **OLD:** Resend (recommended)
- **NEW:** Mailgun (user already set up)

### 3. Proposal Expiration REMOVED ✅
- **OLD:** Proposals expire after 30 days
- **NEW:** Proposals never expire (active indefinitely)

### 4. Auto-Counter-Signature ✅
- Contracts pre-signed by vendor when sent
- No manual counter-signing step

### 5. Domain Clarification ✅
- **streamstage.live** (already exists, not .app)
- commandcentered.app (new)

### 6. Pre-Built Templates Count ✅
- **OLD:** 5 templates (including Corporate)
- **NEW:** 4 templates (Recital, Promo, Concert, Event)

### 7. NEW FEATURE: Auto-Deploy Proposals ✅
- Publish proposal template → Live URL on streamstage.live
- Dynamic proposal rendering from JSONB config

### 8. NEW FEATURE: Google Drive Email Notifications ✅
- Watch folders for changes
- Auto-email client when files added

### 9. NEW FEATURE: Client Touch Email Flow ✅
- Contract signed → Questionnaire sent
- Automated email reminders
- Alerts for missing info

---

## NEXT STEPS

1. ✅ Decisions logged
2. 🔜 Update SPEC_V2_LOCKED.md to v2.6
3. 🔜 Update PHASE3_DATABASE_SCHEMA.md (remove payment trigger)
4. 🔜 Update PHASE3_INTEGRATION_ARCHITECTURE.md (Mailgun, new features)
5. 🔜 Update PHASE3_WORKFLOWS.md (contract signed trigger)
6. 🔜 Begin Sprint 1 (Database foundation)

---

**Decisions locked and ready for implementation! 🚀**
