# CommandCentered - Project Setup & Architecture
**Date:** November 11, 2025
**Status:** Pre-Development (Design Phase)
**Target Launch:** January 1, 2026

---

## 🏗️ DEPLOYMENT ARCHITECTURE

### **Frontend: Vercel**
- **Repository:** This git repo (D:\ClaudeCode\CommandCentered)
- **Framework:** Next.js (App Router)
- **Domains:**
  - `commandcentered.app` - Main application (Commander interface)
  - `operators.commandcentered.app` - Operator portal (minimal UI)
  - `streamstage.live` - Client-facing (proposals, contracts, payments)
- **Deployment:** Git push → Vercel auto-deploy
- **Environment:** Production + Staging (preview deployments)

### **Backend: Supabase**
- **Database:** PostgreSQL (47 tables, see schema.prisma)
- **Auth:** Supabase Auth (COMMANDER, OPERATOR, CLIENT roles)
- **Storage:** Supabase Storage (contracts, invoices, deliverables)
- **Functions:** Supabase Edge Functions (email triggers, webhooks)
- **Row-Level Security:** Tenant isolation (multi-tenant)

### **Integrations:**
- **OpenAI:** Voice transcription (Whisper) + command parsing (GPT-4)
- **Mailgun:** Email sending (existing account)
- **Stripe:** Payment processing (manual triggers)
- **Google Drive:** Folder creation + file sync
- **Telegram:** Group creation for events
- **SignWell:** E-signature ($8/mo)

---

## 📂 REPOSITORY STRUCTURE

```
CommandCentered/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main app (commandcentered.app)
│   ├── (operators)/              # Operator portal
│   └── (client)/                 # Client-facing
├── components/                   # React components
│   ├── ui/                       # Base components (modals, buttons, tables)
│   ├── dashboard/                # Dashboard-specific components
│   ├── pipeline/                 # Pipeline-specific components
│   └── shared/                   # Shared across domains
├── lib/                          # Utilities
│   ├── supabase/                 # Supabase client + helpers
│   ├── openai/                   # Voice assistant integration
│   └── validations/              # Warning/override system
├── docs/                         # Documentation
│   ├── specs/                    # Requirements specs
│   └── archive/                  # Old versions
├── mockups/                      # HTML mockups (design reference)
│   └── drafts/
│       └── round-4-complete-suite/  # Current mockups
├── prisma/                       # Prisma schema (reference only)
│   └── schema.prisma             # Database schema (deployed to Supabase manually)
├── public/                       # Static assets
└── supabase/                     # Supabase config (migrations, functions)
    ├── migrations/               # SQL migrations
    └── functions/                # Edge functions
```

---

## 🚀 DEPLOYMENT WORKFLOW

### **Development → Production Flow:**

```
1. Local Development
   ├── Code changes in D:\ClaudeCode\CommandCentered
   ├── Test locally (npm run dev)
   └── Supabase local instance (optional)

2. Git Commit + Push
   ├── git add .
   ├── git commit -m "feat: Add voice assistant modal"
   └── git push origin main

3. Vercel Auto-Deploy
   ├── Detects push to main
   ├── Builds Next.js app
   ├── Deploys to commandcentered.app
   └── Preview URL for testing

4. Supabase Migrations
   ├── Apply migrations manually via Supabase Dashboard
   ├── Or use Supabase CLI: supabase db push
   └── RLS policies applied automatically
```

### **Branch Strategy:**
- `main` → Production (auto-deploys to Vercel)
- `staging` → Staging environment (preview deployments)
- `feature/*` → Feature branches (preview deployments per PR)

---

## 🔧 LOCAL DEVELOPMENT SETUP

### **Prerequisites:**
- Node.js 18+
- Git
- Supabase CLI (optional for local dev)

### **Initial Setup:**
```bash
# Clone repo
git clone [repo-url] CommandCentered
cd CommandCentered

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add Supabase URL + anon key
# Add OpenAI API key
# Add Mailgun API key

# Run development server
npm run dev
# Opens at http://localhost:3000
```

### **Environment Variables (.env.local):**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI (Voice Assistant)
OPENAI_API_KEY=sk-...

# Mailgun (Email)
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=mg.commandcentered.app

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Google Drive (optional)
GOOGLE_DRIVE_CLIENT_ID=...
GOOGLE_DRIVE_CLIENT_SECRET=...

# Telegram (optional)
TELEGRAM_BOT_TOKEN=...
```

---

## 📊 DATABASE MANAGEMENT

### **Supabase Project:**
- **Project Name:** CommandCentered
- **Database:** PostgreSQL 15
- **Schema:** 47 tables (see prisma/schema.prisma)
- **RLS:** Enabled (tenant_id isolation)

### **Migration Workflow:**
```bash
# Option 1: Supabase Dashboard (recommended for now)
1. Go to Supabase Dashboard > SQL Editor
2. Paste migration SQL
3. Run migration
4. Verify with Table Editor

# Option 2: Supabase CLI (after setup)
supabase db push
supabase db pull  # Sync schema changes
```

### **Database Seeding:**
```bash
# Seed test data for development
npm run seed:dev

# Seed production tenant (StreamStage)
npm run seed:production
```

---

## 🎯 MULTI-TENANT SETUP

### **Tenant Structure:**
- Each tenant = 1 business (e.g., StreamStage)
- Tenant ID = UUID in `tenants` table
- All data rows have `tenant_id` foreign key
- RLS policies filter by `auth.jwt() ->> 'tenant_id'`

### **Your Tenant (StreamStage):**
- **Tenant ID:** (will be generated on first deploy)
- **Subdomain:** `streamstage.commandcentered.app` (optional)
- **Domain:** `commandcentered.app` (primary)
- **Role:** COMMANDER (full access)

### **Additional Tenants (Future):**
- Multi-tenant ready but not marketing yet
- Can add more videography businesses later
- Each gets isolated data via RLS

---

## 🔐 AUTHENTICATION FLOW

### **User Types:**
1. **COMMANDER** (You, Daniel)
   - Full system access
   - Override all warnings
   - Access to admin/testing tools

2. **OPERATOR** (Team members)
   - operators.commandcentered.app portal
   - View own events, update availability
   - No financial visibility

3. **CLIENT** (Magic links only)
   - streamstage.live portal
   - View proposals, sign contracts, make payments
   - No login credentials (magic link via email)

### **Auth Implementation:**
```typescript
// Supabase Auth + RLS
const { data: user } = await supabase.auth.getUser()
const role = user.user_metadata.role // COMMANDER | OPERATOR | CLIENT
const tenantId = user.user_metadata.tenant_id

// All queries automatically filtered by tenant_id via RLS
const { data: events } = await supabase
  .from('events')
  .select('*')
  // tenant_id filter applied by RLS policy
```

---

## 📦 TECH STACK SUMMARY

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Frontend Framework** | Next.js 14 (App Router) | React, SSR, API routes, Vercel integration |
| **Styling** | Tailwind CSS | Matches tactical aesthetic, rapid iteration |
| **Database** | Supabase (PostgreSQL) | Multi-tenant RLS, Auth, Storage, Edge Functions |
| **ORM** | Prisma (reference only) | Schema definition, type generation |
| **Auth** | Supabase Auth | Built-in, RLS integration, magic links |
| **Deployment** | Vercel | Auto-deploy, preview URLs, edge functions |
| **Voice AI** | OpenAI (Whisper + GPT-4) | Transcription + command parsing |
| **Email** | Mailgun | Existing account, reliable |
| **Payments** | Stripe | Industry standard, manual processing |
| **E-Signatures** | SignWell | $8/mo, simple API |
| **File Storage** | Supabase Storage + Google Drive | Contracts in Supabase, deliverables in Drive |

---

## 🔄 CI/CD PIPELINE

### **Automated Checks (GitHub Actions):**
```yaml
# .github/workflows/ci.yml
- Lint (ESLint)
- Type check (TypeScript)
- Build (Next.js)
- Test (Playwright for E2E)
```

### **Deployment Triggers:**
- Push to `main` → Auto-deploy production
- Push to `staging` → Auto-deploy staging
- Pull request → Preview deployment (unique URL)

### **Rollback Strategy:**
- Vercel: Instant rollback via dashboard
- Database: Migration rollback scripts in `supabase/migrations/`

---

## 📋 PRE-LAUNCH CHECKLIST

### **Week 11 (Dec 30 - Jan 5):**
- [ ] Vercel project created and linked to GitHub
- [ ] Supabase production project created
- [ ] All 47 tables migrated to production DB
- [ ] RLS policies tested and enabled
- [ ] Environment variables set in Vercel
- [ ] Custom domains configured (commandcentered.app, operators.commandcentered.app, streamstage.live)
- [ ] SSL certificates active
- [ ] Mailgun domain verified
- [ ] Stripe account in live mode
- [ ] OpenAI API key with sufficient credits
- [ ] Google Drive API enabled
- [ ] Telegram bot created

### **StreamStage Tenant Setup:**
- [ ] Create tenant row in production DB
- [ ] Create Commander user (daniel@streamstage.live)
- [ ] Seed initial data (operators, gear, clients)
- [ ] Test end-to-end workflows
- [ ] Import existing StreamStage events (if any)

---

## 🚨 IMPORTANT NOTES

### **Git Sync to Vercel:**
- **Status:** Will be connected after initial Next.js app is created
- **Trigger:** Push to `main` branch auto-deploys
- **URL:** commandcentered.app (production)

### **Supabase Backend:**
- **Status:** Production project to be created Week 11
- **Migrations:** Applied manually via Supabase Dashboard or CLI
- **Connection:** Next.js app connects via environment variables

### **Multi-Tenant Isolation:**
- **Critical:** All queries MUST filter by tenant_id
- **Enforced:** RLS policies on every table
- **Testing:** Test with 2+ tenants before launch (StreamStage + test tenant)

### **Voice Assistant API Costs:**
- OpenAI Whisper: ~$0.006 per minute of audio
- GPT-4 command parsing: ~$0.03 per command
- **Budget:** ~$50/month for moderate usage (100 commands/day)

---

## 📞 SUPPORT & RESOURCES

### **Documentation:**
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com/docs
- Vercel: https://vercel.com/docs

### **Project Docs:**
- Spec: `MASTER_SPECIFICATION_FINAL.md`
- Schema: `schema.prisma`
- API Contract: `API_SPEC.md` (to be created Week 3)
- Mockups: `mockups/drafts/round-4-complete-suite/`

---

**Status:** Ready to begin Week 1 (mockup iteration). Deployment architecture documented and locked.
