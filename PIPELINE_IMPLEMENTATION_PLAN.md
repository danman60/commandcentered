# Product-Focused Pipeline Implementation Plan
**Decision:** Option A - Build product-focused pipeline to match mockup
**Estimated Time:** 10-15 hours
**Date Started:** 2025-11-19 02:15 EST

---

## 🎯 GOAL

Transform simple stage-based Kanban into product-focused pipeline with:
- Multi-product tracking per client (4 products)
- Revenue tracking per product per client
- Temperature-based lead scoring (Hot/Warm/Cold)
- Contact frequency tracking (Last Contacted, Next Follow-Up)

---

## 📊 CURRENT STATE (Production)

**Simple Kanban Pipeline:**
- 6 stages: New → Contacted → Qualified → Proposal → Engaged → Converted
- Single status per lead
- No product tracking
- No revenue per product
- Basic lead management

**File:** `app/src/app/(dashboard)/pipeline/page.tsx`

---

## 🎯 TARGET STATE (Mockup)

**Product-Focused Pipeline:**
- Client cards with contact information
- 4 products per client:
  1. Studio Sage Chatbot
  2. Dance Recital Package
  3. Competition Software
  4. Core Video Production

**Product Status:** Won, Lost, Not Interested, Proposal Sent, Discussing, Not Applicable

**Revenue Tracking:** Revenue amount per product per client

**Contact Tracking:**
- Last Contacted date
- Next Follow-Up date
- Contact Frequency (Weekly, Bi-weekly, Monthly)

**Lead Temperature:** Hot Lead, Warm Lead, Cold Lead

---

## 📋 IMPLEMENTATION PHASES

### Phase 1: Database Schema (30 min)
**Tables to create:**

1. **products** - Master product catalog
   - id, name, description, default_price

2. **client_products** - Product tracking per client
   - id, client_id, product_id, status, revenue, notes

3. **client_contacts** - Contact tracking
   - id, client_id, last_contacted, next_followup, frequency

**Migration file:** `supabase/migrations/YYYYMMDDHHMMSS_product_pipeline.sql`

### Phase 2: tRPC Procedures (1-2 hours)
**New procedures:**
- `pipeline.getClients` - Get all clients with products
- `pipeline.updateClientProduct` - Update product status/revenue
- `pipeline.updateClientContact` - Update contact dates
- `pipeline.updateClientTemperature` - Update lead temperature

**File:** `app/src/server/api/routers/pipeline.ts`

### Phase 3: UI Components (3-4 hours)
**Components to create:**

1. **ClientCard** - Main client card with all info
2. **ProductTracker** - Product grid with status badges
3. **ContactInfo** - Contact dates and frequency
4. **TemperatureBadge** - Hot/Warm/Cold indicator

**Files:**
- `app/src/components/pipeline/ClientCard.tsx`
- `app/src/components/pipeline/ProductTracker.tsx`
- `app/src/components/pipeline/ContactInfo.tsx`

### Phase 4: Main Pipeline Page (2-3 hours)
**Layout:**
- Search and filters (All Statuses, Sort by)
- Client cards in list view
- Product focus section
- Action buttons (Log Contact, Send Email, View Details)

**File:** `app/src/app/(dashboard)/pipeline/page.tsx` (major refactor)

### Phase 5: Testing & Refinement (2-3 hours)
- Seed test data (EMPWR, Glow, ABC Studio from mockup)
- Test all CRUD operations
- Verify visual match with mockup
- Performance optimization

---

## 🗄️ DATABASE SCHEMA DETAILS

```sql
-- Products master table
CREATE TABLE commandcentered.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  default_price DECIMAL(10,2),
  category TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Client products (junction table with status/revenue)
CREATE TABLE commandcentered.client_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES commandcentered.tenants(id),
  client_id UUID NOT NULL REFERENCES commandcentered.clients(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES commandcentered.products(id),
  status TEXT NOT NULL, -- Won, Lost, Not Interested, Proposal Sent, Discussing, Not Applicable
  revenue DECIMAL(10,2) DEFAULT 0,
  projected_revenue DECIMAL(10,2),
  notes TEXT,
  UNIQUE(client_id, product_id)
);

-- Client contact tracking
CREATE TABLE commandcentered.client_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES commandcentered.tenants(id),
  client_id UUID NOT NULL REFERENCES commandcentered.clients(id) ON DELETE CASCADE,
  last_contacted TIMESTAMPTZ,
  next_followup TIMESTAMPTZ,
  contact_frequency TEXT, -- Weekly, Bi-weekly, Monthly
  temperature TEXT, -- Hot Lead, Warm Lead, Cold Lead
  UNIQUE(client_id)
);

-- Indexes
CREATE INDEX idx_client_products_tenant ON commandcentered.client_products(tenant_id);
CREATE INDEX idx_client_products_client ON commandcentered.client_products(client_id);
CREATE INDEX idx_client_contacts_tenant ON commandcentered.client_contacts(tenant_id);
CREATE INDEX idx_client_contacts_client ON commandcentered.client_contacts(client_id);

-- RLS Policies
ALTER TABLE commandcentered.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandcentered.client_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandcentered.client_contacts ENABLE ROW LEVEL SECURITY;

-- Products are global (no tenant isolation)
CREATE POLICY "Products are viewable by all authenticated users"
  ON commandcentered.products FOR SELECT
  TO authenticated
  USING (true);

-- Client products tenant isolation
CREATE POLICY "Users can view their tenant's client products"
  ON commandcentered.client_products FOR SELECT
  TO authenticated
  USING (tenant_id = (SELECT tenant_id FROM commandcentered.user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can modify their tenant's client products"
  ON commandcentered.client_products FOR ALL
  TO authenticated
  USING (tenant_id = (SELECT tenant_id FROM commandcentered.user_profiles WHERE auth_user_id = auth.uid()));

-- Client contacts tenant isolation
CREATE POLICY "Users can view their tenant's client contacts"
  ON commandcentered.client_contacts FOR SELECT
  TO authenticated
  USING (tenant_id = (SELECT tenant_id FROM commandcentered.user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can modify their tenant's client contacts"
  ON commandcentered.client_contacts FOR ALL
  TO authenticated
  USING (tenant_id = (SELECT tenant_id FROM commandcentered.user_profiles WHERE auth_user_id = auth.uid()));
```

---

## 📝 SEED DATA (From Mockup)

```sql
-- Insert default products
INSERT INTO commandcentered.products (name, description, default_price, category) VALUES
('Studio Sage Chatbot', 'AI chatbot for dancer FAQ automation', 2400, 'Software'),
('Dance Recital Package', 'Multi-camera recital with livestream', 8500, 'Video'),
('Competition Software', 'Custom competition management software', 18000, 'Software'),
('Core Video Production', 'Event coverage with edited highlights', 6200, 'Video');

-- Example client product tracking (for EMPWR)
-- (Will be inserted via tRPC after clients table exists)
```

---

## ⏱️ ESTIMATED TIMELINE

| Phase | Time | Status |
|-------|------|--------|
| Database Schema | 30 min | Pending |
| tRPC Procedures | 1-2 hours | Pending |
| UI Components | 3-4 hours | Pending |
| Main Pipeline Page | 2-3 hours | Pending |
| Testing | 2-3 hours | Pending |
| **Total** | **10-15 hours** | **In Progress** |

---

## 🚀 NEXT STEPS

1. Create database migration
2. Apply migration via Supabase MCP
3. Update Prisma schema
4. Generate TypeScript types
5. Create tRPC procedures
6. Build UI components
7. Refactor Pipeline page
8. Seed test data
9. Test and verify

---

**Status:** Ready to begin Phase 1 (Database Schema)
