# Phase 3 Integration Architecture

**Project:** CommandCentered Phase 3 - Client Management & Sales Pipeline
**Created:** 2025-01-08
**Status:** Specification Complete

---

## Table of Contents

1. [Overview](#overview)
2. [Suite 1 ↔ Suite 2 Handoff Architecture](#suite-1--suite-2-handoff-architecture)
3. [Stripe Integration](#stripe-integration)
4. [Google Drive Integration](#google-drive-integration)
5. [Email Tracking Integration](#email-tracking-integration)
6. [N8N Replacement Plan](#n8n-replacement-plan)
7. [Security & Compliance](#security--compliance)
8. [Error Handling & Resilience](#error-handling--resilience)

---

## Overview

Phase 3 introduces **Suite 1 (StreamStage Client-facing)** which must seamlessly integrate with **Suite 2 (CommandCentered Logistics)**. The critical handoff occurs when a contract is signed and paid—this triggers event creation in the logistics system.

**Integration Points:**
1. **Contract Signing → Event Creation** (Suite 1 → Suite 2 handoff)
2. **Stripe Payment Processing** (webhooks, invoices, payment schedules)
3. **Google Drive Auto-Folder Creation** (project folders, permissions)
4. **Email Tracking** (proposal views, clicks, opens)
5. **N8N Replacement** (migrate workflows to native Next.js)

**Key Principles:**
- **Idempotency:** All integrations use idempotency keys to prevent duplicate operations
- **Event-Driven:** Webhook-based architecture for real-time updates
- **Atomic Transactions:** Database operations use transactions with rollback on failure
- **Audit Trail:** All integration events logged to `integration_logs` table
- **Graceful Degradation:** System continues functioning if non-critical integrations fail

---

## Suite 1 ↔ Suite 2 Handoff Architecture

### Critical Handoff: Contract Signed → Event Created

**Trigger:** Contract status changes to `'signed'` AND first payment received

**Data Flow:**
```
Contract Signed + Payment Received
  ↓
Create Event in Suite 2
  ↓
Auto-create Google Drive Project Folder
  ↓
Send Client Questionnaire
  ↓
Update Contract with event_id
  ↓
Send Confirmation Email
```

### Implementation Pseudocode

```typescript
// Triggered by Stripe webhook: payment_intent.succeeded
async function handleContractPayment(paymentIntentId: string) {
  const payment = await stripe.paymentIntents.retrieve(paymentIntentId);
  const contractId = payment.metadata.contract_id;

  await db.transaction(async (tx) => {
    // 1. Update payment record
    await tx.payments.update({
      where: { stripe_payment_intent_id: paymentIntentId },
      data: {
        status: 'completed',
        paid_at: new Date()
      }
    });

    // 2. Get contract details
    const contract = await tx.contracts.findUnique({
      where: { id: contractId },
      include: {
        proposal: { include: { lead: true, config_items: true } },
        client: true
      }
    });

    // 3. Check if this is the first payment AND contract is signed
    const isFirstPayment = contract.payments.filter(p => p.status === 'completed').length === 1;
    const isContractSigned = contract.status === 'signed';

    if (isFirstPayment && isContractSigned) {
      // 4. CREATE EVENT IN SUITE 2 (logistics system)
      const event = await tx.events.create({
        data: {
          tenant_id: contract.tenant_id,
          client_id: contract.client_id,
          contract_id: contract.id,

          // Extract from proposal config
          service_type: contract.proposal.service_type,
          event_date: extractEventDate(contract.proposal.config_items),
          venue_name: extractVenueName(contract.proposal.config_items),
          venue_address: extractVenueAddress(contract.proposal.config_items),

          // From contract
          total_amount: contract.total_amount,

          // Initial status
          status: 'pending_questionnaire',

          // Metadata
          created_from_contract: true,
          auto_created: true
        }
      });

      // 5. Link event back to contract
      await tx.contracts.update({
        where: { id: contractId },
        data: { event_id: event.id }
      });

      // 6. Create Google Drive project folder (async, don't block)
      await createProjectFolder({
        event_id: event.id,
        client_name: contract.client.name,
        service_type: contract.proposal.service_type,
        event_date: event.event_date
      });

      // 7. Send client questionnaire
      await sendClientQuestionnaire({
        client_email: contract.client.email,
        client_name: contract.client.name,
        event_id: event.id,
        service_type: contract.proposal.service_type
      });

      // 8. Log integration event
      await tx.integration_logs.create({
        data: {
          tenant_id: contract.tenant_id,
          integration_type: 'suite_handoff',
          event_type: 'contract_to_event',
          entity_type: 'event',
          entity_id: event.id,
          status: 'success',
          metadata: {
            contract_id: contractId,
            payment_intent_id: paymentIntentId,
            auto_created: true
          }
        }
      });

      // 9. Send confirmation email
      await sendEmail({
        to: contract.client.email,
        template: 'contract_confirmed',
        data: {
          client_name: contract.client.name,
          event_date: event.event_date,
          service_type: contract.proposal.service_type,
          next_steps_url: `https://streamstage.app/portal/events/${event.id}/questionnaire`
        }
      });
    }
  });
}
```

### Data Extraction from Proposal Config

```typescript
function extractEventDate(configItems: ProposalConfigItem[]): Date {
  const dateItem = configItems.find(item => item.element_type === 'date_input');
  if (!dateItem?.value) throw new Error('Event date not found in proposal');
  return new Date(dateItem.value);
}

function extractVenueName(configItems: ProposalConfigItem[]): string {
  const venueItem = configItems.find(item =>
    item.element_type === 'text_input' &&
    item.config.label?.toLowerCase().includes('venue')
  );
  return venueItem?.value || 'Unknown Venue';
}

function extractVenueAddress(configItems: ProposalConfigItem[]): string {
  const addressItem = configItems.find(item =>
    item.element_type === 'address_input'
  );
  return addressItem?.value || '';
}
```

### Suite 2 Event Schema (from Phase 2)

```typescript
// events table (exists in Phase 2)
{
  id: UUID,
  tenant_id: UUID,
  client_id: UUID,
  contract_id: UUID | null,  // NEW: Link back to Suite 1

  service_type: ENUM('recital_media', 'event_videography', 'corporate_video', 'concert'),
  event_date: DATE,
  venue_name: VARCHAR(255),
  venue_address: TEXT,

  total_amount: DECIMAL(10,2),
  status: ENUM('pending_questionnaire', 'planning', 'confirmed', 'in_progress', 'completed', 'cancelled'),

  created_from_contract: BOOLEAN DEFAULT false,  // NEW
  auto_created: BOOLEAN DEFAULT false,           // NEW

  created_at: TIMESTAMPTZ,
  updated_at: TIMESTAMPTZ
}
```

### Rollback Strategy

If event creation fails after payment received:
1. Payment status remains `'completed'` (money already collected)
2. Contract status remains `'signed'` (legally binding)
3. Event creation logged as `'failed'` in `integration_logs`
4. Admin alert sent to operations dashboard
5. Manual event creation required via admin panel
6. Retry mechanism: Check for missing events on dashboard load

```typescript
// Daily cron job: Find contracts without events
async function findOrphanedContracts() {
  const orphaned = await db.contracts.findMany({
    where: {
      status: 'signed',
      event_id: null,
      payments: {
        some: { status: 'completed' }
      }
    },
    include: { client: true, proposal: true }
  });

  // Send admin alert
  if (orphaned.length > 0) {
    await sendAdminAlert({
      type: 'orphaned_contracts',
      count: orphaned.length,
      contracts: orphaned.map(c => ({
        id: c.id,
        client: c.client.name,
        signed_at: c.signed_at
      }))
    });
  }

  return orphaned;
}
```

---

## Stripe Integration

### Architecture Overview

**Integration Points:**
1. **Payment Intent Creation** (proposal → contract)
2. **Webhook Handling** (payment success/failure/refunds)
3. **Invoice Generation** (automated billing)
4. **Payment Schedule Tracking** (deposit, milestones, final payment)
5. **Refund Processing** (cancellations, disputes)

### Stripe API Configuration

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Webhook signature verification
export function constructEvent(body: string, signature: string) {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
```

### Payment Intent Creation

```typescript
// When contract is generated from proposal
async function createPaymentSchedule(contractId: string) {
  const contract = await db.contracts.findUnique({
    where: { id: contractId },
    include: { client: true, proposal: true }
  });

  // Extract payment schedule from proposal config
  const schedule = extractPaymentSchedule(contract.proposal.config_items);

  // Create Stripe customer if doesn't exist
  let stripeCustomerId = contract.client.stripe_customer_id;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: contract.client.email,
      name: contract.client.name,
      metadata: {
        tenant_id: contract.tenant_id,
        client_id: contract.client.id
      }
    });

    stripeCustomerId = customer.id;

    await db.clients.update({
      where: { id: contract.client.id },
      data: { stripe_customer_id: stripeCustomerId }
    });
  }

  // Create payment records for each milestone
  for (const milestone of schedule) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(milestone.amount * 100), // Convert to cents
      currency: 'usd',
      customer: stripeCustomerId,
      metadata: {
        tenant_id: contract.tenant_id,
        contract_id: contractId,
        payment_type: milestone.type, // 'deposit', 'milestone', 'final'
        due_date: milestone.due_date.toISOString()
      },
      payment_method_types: ['card'],
      capture_method: 'automatic'
    });

    await db.payments.create({
      data: {
        tenant_id: contract.tenant_id,
        contract_id: contractId,
        stripe_payment_intent_id: paymentIntent.id,
        amount: milestone.amount,
        payment_type: milestone.type,
        due_date: milestone.due_date,
        status: 'pending'
      }
    });
  }
}

function extractPaymentSchedule(configItems: ProposalConfigItem[]) {
  const scheduleItem = configItems.find(item => item.element_type === 'payment_schedule');
  if (!scheduleItem?.config?.schedule) {
    // Default: 50% deposit, 50% on event day
    const totalAmount = calculateTotalAmount(configItems);
    return [
      { type: 'deposit', amount: totalAmount * 0.5, due_date: new Date() },
      { type: 'final', amount: totalAmount * 0.5, due_date: extractEventDate(configItems) }
    ];
  }

  return scheduleItem.config.schedule.map((s: any) => ({
    type: s.type,
    amount: s.amount,
    due_date: new Date(s.due_date)
  }));
}
```

### Webhook Handling

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe, constructEvent } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = constructEvent(body, signature);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
      break;

    case 'charge.refunded':
      await handleRefund(event.data.object as Stripe.Charge);
      break;

    case 'charge.dispute.created':
      await handleDispute(event.data.object as Stripe.Dispute);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // Already implemented above in handleContractPayment()
  await handleContractPayment(paymentIntent.id);

  // Log to integration_logs
  await db.integration_logs.create({
    data: {
      tenant_id: paymentIntent.metadata.tenant_id,
      integration_type: 'stripe',
      event_type: 'payment_intent.succeeded',
      entity_type: 'payment',
      entity_id: paymentIntent.id,
      status: 'success',
      metadata: {
        amount: paymentIntent.amount / 100,
        contract_id: paymentIntent.metadata.contract_id
      }
    }
  });
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  await db.payments.update({
    where: { stripe_payment_intent_id: paymentIntent.id },
    data: {
      status: 'failed',
      failure_reason: paymentIntent.last_payment_error?.message
    }
  });

  // Send email to client
  const payment = await db.payments.findUnique({
    where: { stripe_payment_intent_id: paymentIntent.id },
    include: { contract: { include: { client: true } } }
  });

  await sendEmail({
    to: payment!.contract.client.email,
    template: 'payment_failed',
    data: {
      client_name: payment!.contract.client.name,
      amount: payment!.amount,
      failure_reason: paymentIntent.last_payment_error?.message,
      retry_url: `https://streamstage.app/portal/contracts/${payment!.contract_id}/payments`
    }
  });

  // Log to integration_logs
  await db.integration_logs.create({
    data: {
      tenant_id: paymentIntent.metadata.tenant_id,
      integration_type: 'stripe',
      event_type: 'payment_intent.payment_failed',
      entity_type: 'payment',
      entity_id: paymentIntent.id,
      status: 'failed',
      metadata: {
        amount: paymentIntent.amount / 100,
        error: paymentIntent.last_payment_error?.message
      }
    }
  });
}

async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string;

  await db.payments.update({
    where: { stripe_payment_intent_id: paymentIntentId },
    data: {
      status: 'refunded',
      refunded_at: new Date(),
      refund_amount: charge.amount_refunded / 100
    }
  });

  // Log to integration_logs
  await db.integration_logs.create({
    data: {
      tenant_id: charge.metadata.tenant_id,
      integration_type: 'stripe',
      event_type: 'charge.refunded',
      entity_type: 'payment',
      entity_id: paymentIntentId,
      status: 'success',
      metadata: {
        refund_amount: charge.amount_refunded / 100,
        reason: charge.refunds?.data[0]?.reason
      }
    }
  });
}

async function handleDispute(dispute: Stripe.Dispute) {
  const chargeId = dispute.charge as string;
  const charge = await stripe.charges.retrieve(chargeId);
  const paymentIntentId = charge.payment_intent as string;

  await db.payments.update({
    where: { stripe_payment_intent_id: paymentIntentId },
    data: {
      status: 'disputed',
      dispute_reason: dispute.reason
    }
  });

  // Send urgent admin alert
  await sendAdminAlert({
    type: 'payment_dispute',
    payment_intent_id: paymentIntentId,
    amount: dispute.amount / 100,
    reason: dispute.reason,
    evidence_due_by: new Date(dispute.evidence_details!.due_by! * 1000)
  });

  // Log to integration_logs
  await db.integration_logs.create({
    data: {
      tenant_id: charge.metadata.tenant_id,
      integration_type: 'stripe',
      event_type: 'charge.dispute.created',
      entity_type: 'payment',
      entity_id: paymentIntentId,
      status: 'action_required',
      metadata: {
        dispute_id: dispute.id,
        amount: dispute.amount / 100,
        reason: dispute.reason
      }
    }
  });
}
```

### Invoice Generation

```typescript
// Generate Stripe invoice for payment schedule
async function generateStripeInvoice(contractId: string) {
  const contract = await db.contracts.findUnique({
    where: { id: contractId },
    include: { client: true, payments: true }
  });

  const invoice = await stripe.invoices.create({
    customer: contract!.client.stripe_customer_id!,
    auto_advance: false, // Don't auto-finalize
    collection_method: 'send_invoice',
    days_until_due: 30,
    metadata: {
      tenant_id: contract!.tenant_id,
      contract_id: contractId
    }
  });

  // Add line items for each payment
  for (const payment of contract!.payments) {
    await stripe.invoiceItems.create({
      customer: contract!.client.stripe_customer_id!,
      invoice: invoice.id,
      amount: Math.round(payment.amount * 100),
      currency: 'usd',
      description: `${payment.payment_type} - Due ${payment.due_date.toLocaleDateString()}`,
      metadata: {
        payment_id: payment.id
      }
    });
  }

  // Finalize and send
  await stripe.invoices.finalizeInvoice(invoice.id);
  await stripe.invoices.sendInvoice(invoice.id);

  // Update contract with invoice ID
  await db.contracts.update({
    where: { id: contractId },
    data: { stripe_invoice_id: invoice.id }
  });

  return invoice;
}
```

### PCI Compliance Notes

**CRITICAL:** Never store credit card numbers, CVV, or full card details in our database.

- ✅ Use Stripe Elements for card input (PCI-compliant iframe)
- ✅ Store only `stripe_customer_id`, `stripe_payment_intent_id`
- ✅ Use Stripe.js for client-side tokenization
- ❌ Never log full card numbers
- ❌ Never transmit card data through our servers
- ✅ Use Stripe webhooks for payment status updates

---

## Google Drive Integration

### Architecture Overview

**Purpose:** Auto-create organized project folders when contract is signed.

**Folder Structure:**
```
StreamStage Projects/
  ├── 2025/
  │   ├── [Client Name] - [Service Type] - [Event Date]/
  │   │   ├── 01_Raw_Footage/
  │   │   ├── 02_Edited_Files/
  │   │   ├── 03_Final_Deliverables/
  │   │   ├── 04_Client_Questionnaire/
  │   │   └── 05_Contract_Documents/
```

### Google Drive API Setup

**Service Account Configuration:**
1. Create service account in Google Cloud Console
2. Enable Google Drive API
3. Download JSON credentials
4. Store encrypted in database (tenant-specific API keys)

**Required Scopes:**
- `https://www.googleapis.com/auth/drive.file` (create/modify files we create)
- `https://www.googleapis.com/auth/drive.metadata.readonly` (read folder structure)

### Implementation

```typescript
// lib/google-drive.ts
import { google } from 'googleapis';

async function getGoogleDriveClient(tenantId: string) {
  // Get tenant's encrypted Google API credentials
  const tenant = await db.tenants.findUnique({
    where: { id: tenantId },
    select: { google_service_account_json: true }
  });

  if (!tenant?.google_service_account_json) {
    throw new Error('Google Drive not configured for tenant');
  }

  // Decrypt credentials
  const credentials = JSON.parse(
    decrypt(tenant.google_service_account_json)
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });

  return google.drive({ version: 'v3', auth });
}

async function createProjectFolder(params: {
  event_id: string;
  client_name: string;
  service_type: string;
  event_date: Date;
}) {
  const event = await db.events.findUnique({
    where: { id: params.event_id },
    select: { tenant_id: true }
  });

  const drive = await getGoogleDriveClient(event!.tenant_id);

  // Get or create year folder
  const year = params.event_date.getFullYear();
  const yearFolder = await getOrCreateFolder(drive, `${year}`, 'root');

  // Create project folder
  const projectFolderName = `${params.client_name} - ${params.service_type} - ${params.event_date.toLocaleDateString()}`;
  const projectFolder = await drive.files.create({
    requestBody: {
      name: projectFolderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [yearFolder.id]
    },
    fields: 'id, webViewLink'
  });

  // Create subfolders
  const subfolders = [
    '01_Raw_Footage',
    '02_Edited_Files',
    '03_Final_Deliverables',
    '04_Client_Questionnaire',
    '05_Contract_Documents'
  ];

  for (const subfolder of subfolders) {
    await drive.files.create({
      requestBody: {
        name: subfolder,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [projectFolder.data.id]
      }
    });
  }

  // Update event with Drive folder link
  await db.events.update({
    where: { id: params.event_id },
    data: {
      google_drive_folder_id: projectFolder.data.id,
      google_drive_folder_url: projectFolder.data.webViewLink
    }
  });

  // Log integration event
  await db.integration_logs.create({
    data: {
      tenant_id: event!.tenant_id,
      integration_type: 'google_drive',
      event_type: 'folder_created',
      entity_type: 'event',
      entity_id: params.event_id,
      status: 'success',
      metadata: {
        folder_id: projectFolder.data.id,
        folder_url: projectFolder.data.webViewLink
      }
    }
  });

  return projectFolder.data;
}

async function getOrCreateFolder(drive: any, name: string, parentId: string) {
  // Search for existing folder
  const response = await drive.files.list({
    q: `name='${name}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0];
  }

  // Create folder if doesn't exist
  const folder = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId]
    },
    fields: 'id, name'
  });

  return folder.data;
}

// Share folder with client (view-only)
async function shareProjectFolderWithClient(eventId: string, clientEmail: string) {
  const event = await db.events.findUnique({
    where: { id: eventId },
    select: { tenant_id: true, google_drive_folder_id: true }
  });

  if (!event?.google_drive_folder_id) {
    throw new Error('Project folder not created yet');
  }

  const drive = await getGoogleDriveClient(event.tenant_id);

  // Create permission for client
  await drive.permissions.create({
    fileId: event.google_drive_folder_id,
    requestBody: {
      type: 'user',
      role: 'reader', // View-only access
      emailAddress: clientEmail
    },
    sendNotificationEmail: true,
    emailMessage: 'Your project folder is ready! You can view all files here.'
  });

  // Log integration event
  await db.integration_logs.create({
    data: {
      tenant_id: event.tenant_id,
      integration_type: 'google_drive',
      event_type: 'folder_shared',
      entity_type: 'event',
      entity_id: eventId,
      status: 'success',
      metadata: {
        folder_id: event.google_drive_folder_id,
        shared_with: clientEmail,
        permission: 'reader'
      }
    }
  });
}
```

### Error Handling

```typescript
async function createProjectFolderWithRetry(params: any, maxRetries = 3) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await createProjectFolder(params);
    } catch (error) {
      lastError = error as Error;
      console.error(`Google Drive folder creation failed (attempt ${attempt}/${maxRetries}):`, error);

      // Log failure
      await db.integration_logs.create({
        data: {
          tenant_id: (await db.events.findUnique({ where: { id: params.event_id } }))!.tenant_id,
          integration_type: 'google_drive',
          event_type: 'folder_creation_failed',
          entity_type: 'event',
          entity_id: params.event_id,
          status: 'failed',
          metadata: {
            attempt,
            error: (error as Error).message
          }
        }
      });

      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  // All retries failed - send admin alert but don't block workflow
  await sendAdminAlert({
    type: 'google_drive_folder_creation_failed',
    event_id: params.event_id,
    client_name: params.client_name,
    error: lastError?.message,
    action: 'Manual folder creation required'
  });

  // Don't throw - allow workflow to continue
  console.error('Google Drive folder creation failed after all retries');
}
```

---

## Email Tracking Integration

### Architecture Overview

**Purpose:** Track when clients open/view/click links in proposal emails.

**Integration Options:**
1. **SendGrid** (primary recommendation)
2. **Mailgun** (alternative)
3. **Resend** (modern option)

### SendGrid Integration

**Features Used:**
- Email sending API
- Event Webhooks (open, click, bounce, spam)
- Template management
- Tracking pixels

```typescript
// lib/sendgrid.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendProposalEmail(params: {
  lead_id: string;
  proposal_id: string;
  client_email: string;
  client_name: string;
  proposal_url: string;
}) {
  const lead = await db.leads.findUnique({
    where: { id: params.lead_id },
    select: { tenant_id: true }
  });

  // Create email tracking record BEFORE sending
  const tracking = await db.email_tracking.create({
    data: {
      tenant_id: lead!.tenant_id,
      lead_id: params.lead_id,
      proposal_id: params.proposal_id,
      email_type: 'proposal_sent',
      recipient_email: params.client_email,
      status: 'pending'
    }
  });

  const msg = {
    to: params.client_email,
    from: {
      email: 'proposals@streamstage.app',
      name: 'StreamStage'
    },
    subject: `Your Custom Proposal - ${params.client_name}`,
    templateId: 'd-xxxxxxxxxxxxx', // SendGrid template ID
    dynamicTemplateData: {
      client_name: params.client_name,
      proposal_url: params.proposal_url
    },
    trackingSettings: {
      clickTracking: { enable: true },
      openTracking: { enable: true }
    },
    customArgs: {
      tracking_id: tracking.id,
      lead_id: params.lead_id,
      proposal_id: params.proposal_id,
      tenant_id: lead!.tenant_id
    }
  };

  try {
    await sgMail.send(msg);

    await db.email_tracking.update({
      where: { id: tracking.id },
      data: {
        status: 'sent',
        sent_at: new Date()
      }
    });

    // Log integration event
    await db.integration_logs.create({
      data: {
        tenant_id: lead!.tenant_id,
        integration_type: 'sendgrid',
        event_type: 'email_sent',
        entity_type: 'proposal',
        entity_id: params.proposal_id,
        status: 'success',
        metadata: {
          tracking_id: tracking.id,
          recipient: params.client_email
        }
      }
    });
  } catch (error) {
    await db.email_tracking.update({
      where: { id: tracking.id },
      data: {
        status: 'failed',
        failure_reason: (error as Error).message
      }
    });

    throw error;
  }
}
```

### SendGrid Webhook Handler

```typescript
// app/api/webhooks/sendgrid/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const events = await req.json();

  for (const event of events) {
    const trackingId = event.tracking_id;
    if (!trackingId) continue;

    switch (event.event) {
      case 'open':
        await handleEmailOpened(trackingId, event);
        break;

      case 'click':
        await handleEmailClicked(trackingId, event);
        break;

      case 'bounce':
        await handleEmailBounced(trackingId, event);
        break;

      case 'spam_report':
        await handleSpamReport(trackingId, event);
        break;
    }
  }

  return NextResponse.json({ received: true });
}

async function handleEmailOpened(trackingId: string, event: any) {
  const tracking = await db.email_tracking.findUnique({
    where: { id: trackingId },
    include: { lead: true }
  });

  if (!tracking) return;

  // Update email tracking
  await db.email_tracking.update({
    where: { id: trackingId },
    data: {
      opened_at: new Date(event.timestamp * 1000),
      open_count: { increment: 1 }
    }
  });

  // Update lead status
  if (tracking.lead.status === 'new') {
    await db.leads.update({
      where: { id: tracking.lead_id },
      data: { status: 'proposal_viewed' }
    });
  }

  // Create alert for user
  await db.alerts.create({
    data: {
      tenant_id: tracking.tenant_id,
      alert_type: 'proposal_viewed',
      entity_type: 'proposal',
      entity_id: tracking.proposal_id,
      message: `${tracking.lead.name} opened your proposal`,
      priority: 'medium',
      read: false
    }
  });

  // Log integration event
  await db.integration_logs.create({
    data: {
      tenant_id: tracking.tenant_id,
      integration_type: 'sendgrid',
      event_type: 'email_opened',
      entity_type: 'proposal',
      entity_id: tracking.proposal_id!,
      status: 'success',
      metadata: {
        tracking_id: trackingId,
        timestamp: new Date(event.timestamp * 1000)
      }
    }
  });
}

async function handleEmailClicked(trackingId: string, event: any) {
  const tracking = await db.email_tracking.findUnique({
    where: { id: trackingId },
    include: { lead: true }
  });

  if (!tracking) return;

  await db.email_tracking.update({
    where: { id: trackingId },
    data: {
      clicked_at: new Date(event.timestamp * 1000),
      click_count: { increment: 1 },
      clicked_url: event.url
    }
  });

  // Update lead status to "engaged"
  await db.leads.update({
    where: { id: tracking.lead_id },
    data: { status: 'engaged' }
  });

  // Create high-priority alert
  await db.alerts.create({
    data: {
      tenant_id: tracking.tenant_id,
      alert_type: 'proposal_link_clicked',
      entity_type: 'proposal',
      entity_id: tracking.proposal_id,
      message: `${tracking.lead.name} clicked proposal link - HIGH ENGAGEMENT!`,
      priority: 'high',
      read: false
    }
  });
}

async function handleEmailBounced(trackingId: string, event: any) {
  await db.email_tracking.update({
    where: { id: trackingId },
    data: {
      status: 'bounced',
      failure_reason: event.reason
    }
  });

  // Mark lead email as invalid
  const tracking = await db.email_tracking.findUnique({
    where: { id: trackingId }
  });

  await db.leads.update({
    where: { id: tracking!.lead_id },
    data: { email_valid: false }
  });
}

async function handleSpamReport(trackingId: string, event: any) {
  const tracking = await db.email_tracking.findUnique({
    where: { id: trackingId }
  });

  // Auto-unsubscribe lead
  await db.leads.update({
    where: { id: tracking!.lead_id },
    data: {
      email_unsubscribed: true,
      status: 'disqualified'
    }
  });

  // Send admin alert
  await sendAdminAlert({
    type: 'spam_report',
    lead_id: tracking!.lead_id,
    email: tracking!.recipient_email
  });
}
```

### Email Templates

**Template Variables (SendGrid Dynamic Templates):**

```handlebars
<!-- proposal_sent template -->
<html>
  <body>
    <h1>Hi {{client_name}},</h1>
    <p>Your custom proposal is ready!</p>
    <a href="{{proposal_url}}" class="cta-button">View Your Proposal</a>
    <p>This proposal is valid for 30 days.</p>
  </body>
</html>
```

**Template IDs (stored in database):**
```typescript
const EMAIL_TEMPLATES = {
  proposal_sent: 'd-proposal-sent-xxxxx',
  proposal_reminder: 'd-proposal-reminder-xxxxx',
  contract_sent: 'd-contract-sent-xxxxx',
  payment_reminder: 'd-payment-reminder-xxxxx',
  payment_received: 'd-payment-received-xxxxx',
  questionnaire_sent: 'd-questionnaire-sent-xxxxx'
};
```

---

## N8N Replacement Plan

### Current N8N Workflows (to replace)

**User's existing N8N automations:**
1. Lead capture from website forms → Google Sheets
2. Email notifications on new leads
3. CRM status updates → Slack notifications
4. Google Drive folder creation (manual trigger)
5. Follow-up email sequences

### Migration Strategy

**Phase 1: Critical Workflows (Immediate)**
- Move lead capture to Next.js API routes
- Migrate email notifications to SendGrid
- Replace Google Sheets logging with database inserts

**Phase 2: CRM Workflows**
- Replace Slack notifications with in-app alerts
- Move status update automations to database triggers

**Phase 3: Advanced Automations**
- Implement follow-up email sequences in app
- Auto-folder creation (already designed above)

### Lead Capture Migration

**Before (N8N):**
```
Website Form → Webhook → N8N → Google Sheets + Email
```

**After (Next.js):**
```
Website Form → Next.js API → Database + Email + Alerts
```

**Implementation:**

```typescript
// app/api/leads/capture/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.json();

  // Validate
  const validated = validateLeadData(formData);

  // Check for duplicate
  const existingLead = await db.leads.findFirst({
    where: {
      tenant_id: formData.tenant_id,
      email: validated.email
    }
  });

  if (existingLead) {
    // Update existing lead
    await db.leads.update({
      where: { id: existingLead.id },
      data: {
        last_contacted: new Date(),
        notes: `${existingLead.notes}\n\nNew inquiry: ${validated.message}`
      }
    });

    return NextResponse.json({
      success: true,
      lead_id: existingLead.id,
      status: 'updated'
    });
  }

  // Create new lead
  const lead = await db.leads.create({
    data: {
      tenant_id: validated.tenant_id,
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      company_name: validated.company_name,
      service_type: validated.service_type,
      event_date: validated.event_date,
      status: 'new',
      source: 'website_form',
      notes: validated.message
    }
  });

  // Send email notification (replaces N8N)
  await sendEmail({
    to: 'daniel@streamstage.app', // User's email
    template: 'new_lead_notification',
    data: {
      lead_name: lead.name,
      lead_email: lead.email,
      service_type: lead.service_type,
      lead_url: `https://commandcentered.app/leads/${lead.id}`
    }
  });

  // Create in-app alert (replaces Slack notification)
  await db.alerts.create({
    data: {
      tenant_id: lead.tenant_id,
      alert_type: 'new_lead',
      entity_type: 'lead',
      entity_id: lead.id,
      message: `New lead: ${lead.name} - ${lead.service_type}`,
      priority: 'high',
      read: false
    }
  });

  // Auto-send proposal email if service type matches template
  const template = await db.proposal_templates.findFirst({
    where: {
      tenant_id: lead.tenant_id,
      service_type: lead.service_type,
      published_at: { not: null }
    }
  });

  if (template) {
    // Auto-generate proposal URL
    const proposalUrl = `https://streamstage.app/proposals/${template.slug}?lead_id=${lead.id}`;

    await sendProposalEmail({
      lead_id: lead.id,
      proposal_id: template.id,
      client_email: lead.email,
      client_name: lead.name,
      proposal_url: proposalUrl
    });
  }

  return NextResponse.json({
    success: true,
    lead_id: lead.id,
    status: 'created'
  });
}
```

### Follow-up Email Sequences (Replace N8N)

**Implementation with Database Triggers + Cron Jobs:**

```typescript
// Database schema for email sequences
CREATE TABLE email_sequences (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  trigger_event ENUM('lead_created', 'proposal_sent', 'contract_pending'),
  active BOOLEAN DEFAULT true
);

CREATE TABLE email_sequence_steps (
  id UUID PRIMARY KEY,
  sequence_id UUID NOT NULL REFERENCES email_sequences(id),
  delay_days INTEGER NOT NULL,
  email_template_id VARCHAR(255) NOT NULL,
  step_order INTEGER NOT NULL
);

// Cron job to send scheduled emails
async function processEmailSequences() {
  const pendingSteps = await db.email_sequence_queue.findMany({
    where: {
      scheduled_for: { lte: new Date() },
      sent_at: null
    },
    include: {
      step: { include: { sequence: true } },
      lead: true
    }
  });

  for (const item of pendingSteps) {
    try {
      await sendEmail({
        to: item.lead.email,
        template: item.step.email_template_id,
        data: {
          client_name: item.lead.name,
          // ... other dynamic data
        }
      });

      await db.email_sequence_queue.update({
        where: { id: item.id },
        data: { sent_at: new Date() }
      });
    } catch (error) {
      console.error(`Failed to send sequence email: ${error}`);
    }
  }
}

// Run every 15 minutes
setInterval(processEmailSequences, 15 * 60 * 1000);
```

---

## Security & Compliance

### Data Encryption

**Encrypted Fields:**
- `tenants.stripe_secret_key` (pgcrypto)
- `tenants.google_service_account_json` (pgcrypto)
- `tenants.sendgrid_api_key` (pgcrypto)

**Implementation:**

```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encryption functions
CREATE OR REPLACE FUNCTION encrypt_field(data TEXT, key TEXT)
RETURNS BYTEA AS $$
BEGIN
  RETURN pgp_sym_encrypt(data, key);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrypt_field(data BYTEA, key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(data, key);
END;
$$ LANGUAGE plpgsql;

-- Usage in application
const encryptedKey = await db.$executeRaw`
  SELECT encrypt_field(${stripeKey}, ${process.env.ENCRYPTION_KEY})
`;
```

### PCI Compliance Checklist

- ✅ Never store card numbers, CVV, expiration dates
- ✅ Use Stripe.js for client-side tokenization
- ✅ All payment processing via Stripe API
- ✅ Webhook signature verification enforced
- ✅ HTTPS enforced on all endpoints
- ✅ API keys encrypted at rest
- ✅ Access logs for all payment operations

### GDPR Compliance

**Data Retention:**
- Leads: 2 years of inactivity → soft delete
- Email tracking: 1 year → purge
- Integration logs: 90 days → archive to S3

**Data Export:**
```typescript
async function exportClientData(clientId: string) {
  const client = await db.clients.findUnique({
    where: { id: clientId },
    include: {
      leads: true,
      proposals: true,
      contracts: true,
      payments: true,
      events: true
    }
  });

  return {
    personal_info: {
      name: client.name,
      email: client.email,
      phone: client.phone
    },
    proposals: client.proposals,
    contracts: client.contracts,
    payments: client.payments.map(p => ({
      amount: p.amount,
      date: p.paid_at,
      // NO card details
    })),
    events: client.events
  };
}
```

---

## Error Handling & Resilience

### Retry Strategy

**Exponential Backoff:**
```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
```

### Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime: Date | null = null;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold = 5,
    private timeout = 60000 // 1 minute
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime!.getTime() > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = new Date();

    if (this.failureCount >= this.threshold) {
      this.state = 'open';
    }
  }
}

// Usage
const stripeCircuitBreaker = new CircuitBreaker();

await stripeCircuitBreaker.execute(async () => {
  return await stripe.paymentIntents.create({ ... });
});
```

### Integration Health Monitoring

```typescript
// Cron job: Check integration health every 5 minutes
async function monitorIntegrationHealth() {
  const integrations = ['stripe', 'google_drive', 'sendgrid'];

  for (const integration of integrations) {
    const recentLogs = await db.integration_logs.findMany({
      where: {
        integration_type: integration,
        created_at: { gte: new Date(Date.now() - 15 * 60 * 1000) } // Last 15 min
      }
    });

    const failureRate = recentLogs.filter(l => l.status === 'failed').length / recentLogs.length;

    if (failureRate > 0.5) {
      // >50% failure rate - send critical alert
      await sendAdminAlert({
        type: 'integration_health_critical',
        integration,
        failure_rate: failureRate,
        recent_errors: recentLogs.filter(l => l.status === 'failed').slice(0, 5)
      });
    }
  }
}
```

---

## Summary

This integration architecture ensures:

✅ **Seamless Suite 1 → Suite 2 handoff** (contract signed → event created)
✅ **Robust payment processing** (Stripe webhooks, retry logic, PCI compliance)
✅ **Automated project setup** (Google Drive folders, permissions)
✅ **Real-time engagement tracking** (email opens, clicks, proposal views)
✅ **N8N independence** (all workflows migrated to Next.js)
✅ **Production-grade resilience** (circuit breakers, retries, health monitoring)
✅ **Complete audit trail** (integration_logs table for all events)

**Next Steps:**
- Session 6: Alerts & Notifications System
- Session 7: Spec Documentation (update SPEC_V2_LOCKED.md, HoneyBook matrix)
- Session 8: Additional UI Mockups
- Session 9: Final Questions List
- Session 10: Documentation & Handoff

---

*Integration architecture complete. Ready for implementation.*
