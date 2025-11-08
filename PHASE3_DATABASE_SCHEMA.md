# Phase 3: Database Schema Design
# Client Management & Sales Pipeline

**Date:** 2025-11-08
**Status:** Session 2 - Database Schema Design
**Version:** Draft 1.0

---

## 📊 SCHEMA OVERVIEW

**Phase 3 adds 18 new tables to support:**
- Proposal Builder Builder (meta-tool for creating proposal forms)
- Lead & Inquiry Management
- Proposal Submission & Review
- Contract Generation & E-Signature
- Payment Processing (Stripe integration)
- Client Questionnaires
- CRM & Outreach Tracking
- Email Communication Tracking
- Google Drive Integration

**Total Schema After Phase 3:** 45 tables (27 from Phases 1 & 2 + 18 new)

---

## 🏗️ TABLE DEFINITIONS

### 1. `proposal_templates`
**Purpose:** Store Proposal Builder Builder configurations (admin-created proposal forms)

```sql
CREATE TABLE proposal_templates (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Template Info
    name VARCHAR(255) NOT NULL,                    -- "Dance Recital Media", "Event Videography"
    slug VARCHAR(255) NOT NULL,                    -- URL slug: "dance-recital-media"
    service_type VARCHAR(100),                     -- "recital", "event", "concert", "promo", "corporate"
    description TEXT,                              -- Internal notes about this template

    -- Configuration (JSON)
    config_json JSONB NOT NULL DEFAULT '{}'::jsonb, -- Full template config (see structure below)

    -- Metadata
    published_at TIMESTAMPTZ,                      -- NULL = draft, NOT NULL = live
    created_by UUID REFERENCES users(id),          -- Admin who created it
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    UNIQUE(tenant_id, slug),
    CHECK(slug ~ '^[a-z0-9-]+$')                   -- Enforce URL-safe slugs
);

CREATE INDEX idx_proposal_templates_tenant ON proposal_templates(tenant_id);
CREATE INDEX idx_proposal_templates_slug ON proposal_templates(tenant_id, slug);
CREATE INDEX idx_proposal_templates_published ON proposal_templates(tenant_id, published_at) WHERE published_at IS NOT NULL;

-- RLS Policy
ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON proposal_templates FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

**`config_json` Structure:**
```json
{
  "branding": {
    "primaryColor": "#00bcd4",
    "logo": "https://streamstage.com/logo.png"
  },
  "elements": [
    {
      "id": "hero-1",
      "type": "hero",
      "position": 0,
      "config": {
        "title": "Dance Recital Media Package",
        "description": "Professional videography for your recital",
        "features": ["✓ Multi-camera coverage", "✓ Professional editing", "✓ Fast delivery"]
      }
    },
    {
      "id": "dancer-count-1",
      "type": "number_input",
      "position": 1,
      "config": {
        "label": "Number of Dancers",
        "placeholder": "Enter dancer count",
        "min": 0,
        "max": 999,
        "required": true,
        "size": "large"
      }
    },
    {
      "id": "service-grid-1",
      "type": "checkbox_card_grid",
      "position": 2,
      "config": {
        "title": "Select Services",
        "columns": 3,
        "cards": [
          {
            "id": "video-service",
            "title": "Video Recording",
            "description": "Professional multi-camera video",
            "price": 500,
            "included": false
          }
        ]
      }
    }
  ],
  "pricing": {
    "baseCurrency": "CAD",
    "rules": [
      {
        "type": "tiered",
        "field": "dancer-count-1",
        "tiers": [
          {"min": 0, "max": 100, "pricePerUnit": 15},
          {"min": 101, "max": 200, "pricePerUnit": 12},
          {"min": 201, "max": 999, "pricePerUnit": 10}
        ]
      },
      {
        "type": "volume_discount",
        "thresholds": [
          {"amount": 1000, "discountPct": 5},
          {"amount": 2000, "discountPct": 10},
          {"amount": 3000, "discountPct": 15}
        ]
      },
      {
        "type": "conditional_discount",
        "condition": {
          "operator": "AND",
          "fields": ["video-service", "photo-service"]
        },
        "discountPct": 10
      }
    ]
  },
  "submission": {
    "emailNotification": "danieljohnabrahamson@gmail.com",
    "confirmationMessage": "Thank you! We'll review your proposal within 24 hours.",
    "successSteps": [
      "Daniel will review your proposal within 24 hours",
      "You'll receive a detailed quote and timeline",
      "We'll schedule a consultation call"
    ]
  }
}
```

---

### 2. `leads`
**Purpose:** Track inquiries and potential clients

```sql
CREATE TABLE leads (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Contact Info
    email VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    phone VARCHAR(50),
    contact_name VARCHAR(255),

    -- Lead Source
    source VARCHAR(100),                           -- "website_form", "referral", "advertising", "event"
    source_details TEXT,                           -- Additional context

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'new',    -- "new", "contacted", "qualified", "proposal_sent", "converted", "lost"
    status_reason TEXT,                            -- Why lost? Why qualified?

    -- Assignment
    assigned_to UUID REFERENCES users(id),         -- Who's handling this lead?

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_contacted_at TIMESTAMPTZ,
    next_follow_up_at TIMESTAMPTZ,

    -- Search
    search_vector TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('english', COALESCE(organization, '') || ' ' || COALESCE(contact_name, '') || ' ' || COALESCE(email, ''))
    ) STORED
);

CREATE INDEX idx_leads_tenant ON leads(tenant_id);
CREATE INDEX idx_leads_status ON leads(tenant_id, status);
CREATE INDEX idx_leads_assigned ON leads(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_leads_follow_up ON leads(next_follow_up_at) WHERE next_follow_up_at IS NOT NULL;
CREATE INDEX idx_leads_search ON leads USING gin(search_vector);

-- RLS Policy
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON leads FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 3. `proposals`
**Purpose:** Client proposal submissions (from Proposal Builder forms)

```sql
CREATE TABLE proposals (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Relationships
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    template_id UUID NOT NULL REFERENCES proposal_templates(id) ON DELETE RESTRICT,

    -- Client Selections (JSON from form submission)
    selections_json JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Event Details (from submission form)
    event_date DATE,
    event_start_time TIME,
    event_venue VARCHAR(255),
    event_notes TEXT,

    -- Pricing
    subtotal_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'CAD',

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- "submitted", "reviewing", "accepted", "rejected", "expired"
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,

    -- Metadata
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,                          -- Proposal validity period (e.g., 30 days)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_proposals_tenant ON proposals(tenant_id);
CREATE INDEX idx_proposals_lead ON proposals(lead_id);
CREATE INDEX idx_proposals_status ON proposals(tenant_id, status);
CREATE INDEX idx_proposals_event_date ON proposals(event_date);
CREATE INDEX idx_proposals_reviewed ON proposals(reviewed_by) WHERE reviewed_by IS NOT NULL;

-- RLS Policy
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON proposals FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

**`selections_json` Structure:**
```json
{
  "dancerCount": 150,
  "selectedServices": {
    "video-service": true,
    "photo-service": true,
    "streaming-service": false
  },
  "quantities": {
    "tv-display": 2,
    "highlight-video": 1
  },
  "formFields": {
    "email": "director@studio.com",
    "organization": "ABC Dance Studio",
    "phone": "(555) 123-4567"
  },
  "pricingBreakdown": {
    "lineItems": [
      {"name": "Dancer count (150 × $12)", "amount": 1800},
      {"name": "Video Service", "amount": 500},
      {"name": "Photo Service", "amount": 400},
      {"name": "TV Display (2 × $150)", "amount": 300}
    ],
    "subtotal": 3000,
    "discount": {"type": "volume", "pct": 10, "amount": 300},
    "total": 2700
  }
}
```

---

### 4. `proposal_line_items`
**Purpose:** Itemized breakdown of proposal selections (for reporting/analysis)

```sql
CREATE TABLE proposal_line_items (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,

    -- Line Item Details
    service_name VARCHAR(255) NOT NULL,
    service_description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,

    -- Categorization
    category VARCHAR(100),                         -- "production", "deliverable", "add-on"

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_proposal_line_items_proposal ON proposal_line_items(proposal_id);
CREATE INDEX idx_proposal_line_items_category ON proposal_line_items(category);
```

---

### 5. `contracts`
**Purpose:** Auto-generated contracts from accepted proposals

```sql
CREATE TABLE contracts (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Relationships
    proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE RESTRICT,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

    -- Contract Content
    contract_number VARCHAR(100) NOT NULL,         -- "CNT-2025-001"
    contract_template_id UUID,                     -- Reference to contract template (future)
    contract_text TEXT NOT NULL,                   -- Populated contract content
    contract_pdf_url VARCHAR(500),                 -- Generated PDF (Google Drive or Supabase Storage)

    -- Terms
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
    deposit_amount DECIMAL(10, 2),
    payment_terms TEXT,                            -- "50% deposit, 50% on event day"

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'draft',  -- "draft", "sent", "signed", "cancelled", "expired"
    sent_at TIMESTAMPTZ,
    signed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    UNIQUE(tenant_id, contract_number)
);

CREATE INDEX idx_contracts_tenant ON contracts(tenant_id);
CREATE INDEX idx_contracts_proposal ON contracts(proposal_id);
CREATE INDEX idx_contracts_lead ON contracts(lead_id);
CREATE INDEX idx_contracts_status ON contracts(tenant_id, status);
CREATE INDEX idx_contracts_number ON contracts(tenant_id, contract_number);

-- RLS Policy
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON contracts FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 6. `contract_signatures`
**Purpose:** Track e-signature requests and completions

```sql
CREATE TABLE contract_signatures (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,

    -- Signer Info
    signer_email VARCHAR(255) NOT NULL,
    signer_name VARCHAR(255),
    signer_role VARCHAR(100),                      -- "client", "witness", "guarantor"

    -- Signature
    signature_data TEXT,                           -- Base64 signature image or DocuSign/HelloSign ID
    signature_ip VARCHAR(100),                     -- IP address of signer
    signature_timestamp TIMESTAMPTZ,

    -- Request Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- "pending", "sent", "viewed", "signed", "declined"
    request_sent_at TIMESTAMPTZ,
    last_reminded_at TIMESTAMPTZ,
    reminder_count INTEGER NOT NULL DEFAULT 0,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contract_signatures_contract ON contract_signatures(contract_id);
CREATE INDEX idx_contract_signatures_status ON contract_signatures(status);
CREATE INDEX idx_contract_signatures_email ON contract_signatures(signer_email);
```

---

### 7. `invoices`
**Purpose:** Payment requests sent to clients

```sql
CREATE TABLE invoices (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Relationships
    contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

    -- Invoice Info
    invoice_number VARCHAR(100) NOT NULL,          -- "INV-2025-001"
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,

    -- Amounts
    subtotal_amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0,
    amount_due DECIMAL(10, 2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
    currency VARCHAR(3) NOT NULL DEFAULT 'CAD',

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'draft',  -- "draft", "sent", "paid", "partial", "overdue", "cancelled"
    sent_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,

    -- Payment Link (Stripe)
    stripe_invoice_id VARCHAR(255),
    payment_link_url VARCHAR(500),

    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    UNIQUE(tenant_id, invoice_number)
);

CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_invoices_contract ON invoices(contract_id);
CREATE INDEX idx_invoices_lead ON invoices(lead_id);
CREATE INDEX idx_invoices_status ON invoices(tenant_id, status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_stripe ON invoices(stripe_invoice_id) WHERE stripe_invoice_id IS NOT NULL;

-- RLS Policy
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoices FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 8. `invoice_line_items`
**Purpose:** Itemized charges on invoices

```sql
CREATE TABLE invoice_line_items (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

    -- Line Item
    description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,

    -- Categorization
    category VARCHAR(100),                         -- "service", "product", "fee", "discount"

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoice_line_items_invoice ON invoice_line_items(invoice_id);
```

---

### 9. `payments`
**Purpose:** Payment tracking (Stripe integration)

```sql
CREATE TABLE payments (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Relationships
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,

    -- Payment Info
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    payment_method VARCHAR(50),                    -- "credit_card", "debit_card", "bank_transfer", "check", "cash"

    -- Stripe Details
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    stripe_payment_method_id VARCHAR(255),

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- "pending", "succeeded", "failed", "refunded", "disputed"
    failure_reason TEXT,

    -- Refunds
    refund_amount DECIMAL(10, 2) DEFAULT 0,
    refunded_at TIMESTAMPTZ,
    refund_reason TEXT,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX idx_payments_stripe_charge ON payments(stripe_charge_id) WHERE stripe_charge_id IS NOT NULL;

-- RLS Policy
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON payments FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 10. `payment_schedules`
**Purpose:** Milestone-based payment tracking

```sql
CREATE TABLE payment_schedules (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Relationships
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,

    -- Milestone
    milestone_name VARCHAR(255) NOT NULL,          -- "Deposit", "Pre-Event Payment", "Final Payment"
    milestone_description TEXT,
    due_date DATE,
    due_trigger VARCHAR(100),                      -- "contract_signed", "X_days_before_event", "event_completion"

    -- Amount
    amount DECIMAL(10, 2) NOT NULL,
    amount_type VARCHAR(50) NOT NULL,              -- "fixed", "percentage"
    percentage DECIMAL(5, 2),                      -- If amount_type = "percentage", % of total

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- "pending", "due", "paid", "overdue", "waived"
    paid_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_schedules_tenant ON payment_schedules(tenant_id);
CREATE INDEX idx_payment_schedules_contract ON payment_schedules(contract_id);
CREATE INDEX idx_payment_schedules_invoice ON payment_schedules(invoice_id);
CREATE INDEX idx_payment_schedules_status ON payment_schedules(tenant_id, status);
CREATE INDEX idx_payment_schedules_due_date ON payment_schedules(due_date);

-- RLS Policy
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON payment_schedules FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 11. `clients`
**Purpose:** Master client records (post-conversion)

```sql
CREATE TABLE clients (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Relationships
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

    -- Client Info
    organization VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(500),

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Canada',

    -- Business Info
    industry VARCHAR(100),                         -- "dance_studio", "event_venue", "corporate"
    size VARCHAR(50),                              -- "small", "medium", "large"

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'active',  -- "active", "inactive", "blacklisted"
    status_notes TEXT,

    -- Lifetime Value
    total_revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_events INTEGER NOT NULL DEFAULT 0,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Search
    search_vector TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('english', COALESCE(organization, '') || ' ' || COALESCE(contact_name, '') || ' ' || COALESCE(email, ''))
    ) STORED
);

CREATE INDEX idx_clients_tenant ON clients(tenant_id);
CREATE INDEX idx_clients_lead ON clients(lead_id);
CREATE INDEX idx_clients_status ON clients(tenant_id, status);
CREATE INDEX idx_clients_search ON clients USING gin(search_vector);

-- RLS Policy
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON clients FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 12. `client_questionnaires`
**Purpose:** Post-booking info gathering (event details, preferences)

```sql
CREATE TABLE client_questionnaires (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Relationships
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,

    -- Questionnaire
    questionnaire_template_id UUID,                -- Future: Reference to template
    questions_json JSONB NOT NULL,                 -- Questions to ask
    responses_json JSONB,                          -- Client responses

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- "pending", "sent", "partial", "completed"
    sent_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    reminder_sent_at TIMESTAMPTZ,
    reminder_count INTEGER NOT NULL DEFAULT 0,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_client_questionnaires_tenant ON client_questionnaires(tenant_id);
CREATE INDEX idx_client_questionnaires_contract ON client_questionnaires(contract_id);
CREATE INDEX idx_client_questionnaires_status ON client_questionnaires(tenant_id, status);

-- RLS Policy
ALTER TABLE client_questionnaires ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON client_questionnaires FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 13. `email_tracking`
**Purpose:** Email communication log (SendGrid/Mailgun integration)

```sql
CREATE TABLE email_tracking (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Relationships (polymorphic)
    related_entity_type VARCHAR(100),              -- "lead", "proposal", "contract", "invoice"
    related_entity_id UUID,

    -- Email Details
    email_provider_id VARCHAR(255),                -- SendGrid/Mailgun message ID
    to_email VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body_text TEXT,
    body_html TEXT,

    -- Template Info
    template_name VARCHAR(255),
    template_variables JSONB,

    -- Tracking
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    bounce_reason TEXT,
    complained_at TIMESTAMPTZ,                     -- Spam complaint

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'sent',    -- "sent", "delivered", "opened", "clicked", "bounced", "complained"

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_tracking_tenant ON email_tracking(tenant_id);
CREATE INDEX idx_email_tracking_entity ON email_tracking(related_entity_type, related_entity_id);
CREATE INDEX idx_email_tracking_to ON email_tracking(to_email);
CREATE INDEX idx_email_tracking_provider ON email_tracking(email_provider_id);
CREATE INDEX idx_email_tracking_sent ON email_tracking(sent_at);

-- RLS Policy
ALTER TABLE email_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON email_tracking FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 14. `crm_organizations`
**Purpose:** CRM tracking for all studios/venues (not just clients)

```sql
CREATE TABLE crm_organizations (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Organization Info
    name VARCHAR(255) NOT NULL,
    website VARCHAR(500),
    phone VARCHAR(50),
    email VARCHAR(255),

    -- Address
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Canada',

    -- Classification
    organization_type VARCHAR(100),                -- "dance_studio", "event_venue", "corporate", "competition"
    size VARCHAR(50),                              -- "small", "medium", "large"

    -- Products Offered (from CRM Data analysis)
    studio_promo_status VARCHAR(100),              -- "not_contacted", "not_interested", "previous_client", "purchased", "interested", "penciled", "proposal_sent"
    recital_status VARCHAR(100),
    studio_sage_status VARCHAR(100),

    -- Outreach
    last_contacted_at DATE,
    next_follow_up_at DATE,
    contact_frequency VARCHAR(50),                 -- "weekly", "monthly", "quarterly"

    -- Notes
    notes TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Search
    search_vector TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(notes, ''))
    ) STORED
);

CREATE INDEX idx_crm_organizations_tenant ON crm_organizations(tenant_id);
CREATE INDEX idx_crm_organizations_type ON crm_organizations(organization_type);
CREATE INDEX idx_crm_organizations_follow_up ON crm_organizations(next_follow_up_at) WHERE next_follow_up_at IS NOT NULL;
CREATE INDEX idx_crm_organizations_search ON crm_organizations USING gin(search_vector);

-- RLS Policy
ALTER TABLE crm_organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON crm_organizations FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 15. `crm_contacts`
**Purpose:** Contact persons at CRM organizations

```sql
CREATE TABLE crm_contacts (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Relationships
    organization_id UUID NOT NULL REFERENCES crm_organizations(id) ON DELETE CASCADE,

    -- Contact Info
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),                            -- "Director", "Owner", "Marketing Manager"
    email VARCHAR(255),
    phone VARCHAR(50),

    -- Social
    linkedin_url VARCHAR(500),

    -- Status
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,     -- Primary contact for this org?
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crm_contacts_tenant ON crm_contacts(tenant_id);
CREATE INDEX idx_crm_contacts_org ON crm_contacts(organization_id);
CREATE INDEX idx_crm_contacts_primary ON crm_contacts(organization_id, is_primary) WHERE is_primary = TRUE;

-- RLS Policy
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON crm_contacts FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 16. `crm_interactions`
**Purpose:** Outreach tracking (calls, emails, meetings)

```sql
CREATE TABLE crm_interactions (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Relationships
    organization_id UUID NOT NULL REFERENCES crm_organizations(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Who made contact?

    -- Interaction Details
    interaction_type VARCHAR(50) NOT NULL,         -- "call", "email", "meeting", "demo", "proposal_sent"
    subject VARCHAR(500),
    notes TEXT,
    outcome VARCHAR(100),                          -- "positive", "neutral", "negative", "no_response"

    -- Follow-Up
    requires_follow_up BOOLEAN NOT NULL DEFAULT FALSE,
    follow_up_date DATE,
    follow_up_notes TEXT,

    -- Metadata
    interaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crm_interactions_tenant ON crm_interactions(tenant_id);
CREATE INDEX idx_crm_interactions_org ON crm_interactions(organization_id);
CREATE INDEX idx_crm_interactions_contact ON crm_interactions(contact_id);
CREATE INDEX idx_crm_interactions_user ON crm_interactions(user_id);
CREATE INDEX idx_crm_interactions_date ON crm_interactions(interaction_date);
CREATE INDEX idx_crm_interactions_follow_up ON crm_interactions(follow_up_date) WHERE follow_up_date IS NOT NULL;

-- RLS Policy
ALTER TABLE crm_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON crm_interactions FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 17. `google_drive_folders`
**Purpose:** Track auto-created Google Drive folders for projects

```sql
CREATE TABLE google_drive_folders (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Relationships (polymorphic)
    related_entity_type VARCHAR(100) NOT NULL,     -- "contract", "event", "client"
    related_entity_id UUID NOT NULL,

    -- Google Drive Info
    folder_id VARCHAR(255) NOT NULL,               -- Google Drive folder ID
    folder_name VARCHAR(255) NOT NULL,
    folder_url VARCHAR(500) NOT NULL,

    -- Permissions
    shared_with_emails TEXT[],                     -- Array of emails with access
    permission_level VARCHAR(50) DEFAULT 'writer', -- "viewer", "commenter", "writer", "owner"

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'active',  -- "active", "archived", "deleted"

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_google_drive_folders_tenant ON google_drive_folders(tenant_id);
CREATE INDEX idx_google_drive_folders_entity ON google_drive_folders(related_entity_type, related_entity_id);
CREATE INDEX idx_google_drive_folders_folder_id ON google_drive_folders(folder_id);

-- RLS Policy
ALTER TABLE google_drive_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON google_drive_folders FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### 18. `system_settings`
**Purpose:** Tenant-level configuration (Stripe keys, email settings, branding)

```sql
CREATE TABLE system_settings (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

    -- Stripe Configuration
    stripe_publishable_key VARCHAR(500),
    stripe_secret_key VARCHAR(500),                -- ENCRYPTED
    stripe_webhook_secret VARCHAR(500),            -- ENCRYPTED

    -- Email Configuration
    email_provider VARCHAR(50),                    -- "sendgrid", "mailgun", "ses"
    email_api_key VARCHAR(500),                    -- ENCRYPTED
    email_from_address VARCHAR(255),
    email_from_name VARCHAR(255),

    -- Google Drive Configuration
    google_drive_enabled BOOLEAN DEFAULT FALSE,
    google_drive_parent_folder_id VARCHAR(255),
    google_drive_credentials JSONB,                -- ENCRYPTED OAuth credentials

    -- Branding
    company_name VARCHAR(255),
    company_logo_url VARCHAR(500),
    primary_color VARCHAR(7),                      -- Hex color
    secondary_color VARCHAR(7),

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    UNIQUE(tenant_id)
);

CREATE INDEX idx_system_settings_tenant ON system_settings(tenant_id);

-- RLS Policy
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON system_settings FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

## 🔗 RELATIONSHIPS & DATA FLOW

### Lead → Proposal → Contract → Event Flow

```
1. LEAD CAPTURE
   ↓
   leads (status = "new")
   ↓
2. PROPOSAL SUBMISSION (via Proposal Builder)
   ↓
   proposals (linked to lead)
   + proposal_line_items
   ↓
3. PROPOSAL REVIEW
   ↓
   proposals (status = "accepted")
   ↓
4. CONTRACT GENERATION
   ↓
   contracts (auto-generated from proposal)
   + contract_signatures
   + payment_schedules
   ↓
5. E-SIGNATURE
   ↓
   contracts (status = "signed")
   ↓
6. CLIENT CONVERSION
   ↓
   clients (created from lead)
   + client_questionnaires (sent)
   ↓
7. EVENT CREATION (in logistics system)
   ↓
   events (auto-created from contract)
   ↓
8. INVOICING
   ↓
   invoices + invoice_line_items
   ↓
9. PAYMENT COLLECTION
   ↓
   payments (Stripe integration)
```

---

## 🔒 SECURITY & PRIVACY

### Data Encryption
**Fields requiring encryption (at rest):**
- `system_settings.stripe_secret_key`
- `system_settings.stripe_webhook_secret`
- `system_settings.email_api_key`
- `system_settings.google_drive_credentials`

**Encryption Method:** Supabase Vault (if available) or `pgcrypto` with per-tenant keys

### PCI Compliance
**For Stripe integration:**
- ✅ NEVER store credit card numbers
- ✅ Use Stripe Payment Links or Checkout (client-side)
- ✅ Store only `stripe_payment_intent_id` and `stripe_charge_id`
- ✅ Webhooks for payment status updates

### RLS Policies
**All tables have tenant isolation:**
```sql
CREATE POLICY tenant_isolation ON [table_name]
FOR ALL
USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

## 📊 TOTAL SCHEMA SUMMARY

**Phase 3 Tables:** 18 new tables
**Phase 1 & 2 Tables:** 27 existing tables
**Total Tables:** 45 tables

**Phase 3 Table List:**
1. `proposal_templates` (Proposal Builder Builder configs)
2. `leads` (Inquiry tracking)
3. `proposals` (Client submissions)
4. `proposal_line_items` (Itemized selections)
5. `contracts` (Auto-generated contracts)
6. `contract_signatures` (E-signature tracking)
7. `invoices` (Payment requests)
8. `invoice_line_items` (Itemized charges)
9. `payments` (Stripe payments)
10. `payment_schedules` (Milestone payments)
11. `clients` (Master client records)
12. `client_questionnaires` (Post-booking info)
13. `email_tracking` (Email communication log)
14. `crm_organizations` (CRM targeting)
15. `crm_contacts` (Contact persons)
16. `crm_interactions` (Outreach tracking)
17. `google_drive_folders` (Auto-created folders)
18. `system_settings` (Tenant configuration)

---

## ✅ SESSION 2 STATUS

**Database Schema Design:** COMPLETE

**Next Steps (Session 3):**
- Workflow specifications (pseudocode for all flows)
- State machine validation rules
- Trigger functions for automation

---

**Files Referenced:**
- PROPOSAL_BUILDER_ANALYSIS.md (Session 1 output)
- OVERNIGHT_SPEC_PLAN.md (Master plan)
