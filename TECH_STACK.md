# CommandCentered Tech Stack Decision

**Date:** November 14, 2025
**Status:** ✅ APPROVED
**Decision Makers:** Project Lead

---

## Technology Stack

### Frontend Framework
**Choice:** **Next.js 14.2+ (App Router)**

**Rationale:**
- React-based (familiar, huge ecosystem)
- App Router (server components, better performance)
- Built-in routing (no extra router needed)
- API routes (backend co-located with frontend)
- Vercel deployment optimized (automatic edge caching)
- TypeScript first-class support
- Excellent DX (Fast Refresh, great error messages)

**Alternatives Considered:**
- ❌ Remix - Smaller ecosystem, fewer resources
- ❌ SvelteKit - Less familiar, smaller talent pool
- ❌ Vite + React Router - More setup, manual optimization

---

### API Layer
**Choice:** **tRPC v10+**

**Rationale:**
- Type-safe end-to-end (frontend knows backend types automatically)
- Works perfectly with Prisma (Prisma types → tRPC types → React types)
- No code generation needed (types inferred at build time)
- Great DX (autocomplete for all API calls)
- Built-in input validation (Zod schemas)
- Lightweight (no GraphQL complexity)
- Perfect for monorepo (frontend + backend in same repo)

**Alternatives Considered:**
- ❌ GraphQL - Overkill, too much boilerplate
- ❌ REST - No type safety, manual typing
- ❌ Server Actions - Too new, limited ecosystem

**tRPC Router Structure:**
```typescript
// Example structure (will detail in API_SPEC.md)
appRouter
  ├── event (create, list, getById, update, delete)
  ├── shift (create, createFromTemplate, list, update, assign)
  ├── operator (create, list, getById, updateAvailability)
  ├── gear (create, list, getById, assign, unassign)
  ├── kit (create, list, getById, update)
  ├── lead (create, list, getById, update, updateProductStatus)
  ├── communication (createTouchpoint, listTouchpoints, sendEmail)
  ├── dashboard (getWidgetPreferences, updateWidgetPreferences)
  └── ... (13 more routers, ~100 procedures total)
```

---

### Database
**Choice:** **PostgreSQL 15+ via Supabase**

**Rationale:**
- PostgreSQL (industry standard, mature, feature-rich)
- Supabase (managed Postgres + Auth + Storage + Realtime)
- Row-Level Security (RLS) built-in (perfect for multi-tenant)
- Free tier generous (500MB database, 2GB storage)
- Automatic backups (Point-in-Time Recovery)
- Connection pooling (PgBouncer built-in)
- PostGIS extension (for venue/hotel mapping)
- Full-text search (for searching events, gear, etc.)

**Supabase Additional Features:**
- **Auth:** Email/password, magic links, OAuth (Google, GitHub)
- **Storage:** File uploads (Google Drive integration might use this)
- **Realtime:** WebSocket subscriptions (live updates for operators)
- **Edge Functions:** Deno runtime (for background jobs)

**Alternatives Considered:**
- ❌ Neon - Newer, less proven
- ❌ PlanetScale - MySQL (Prisma works better with Postgres)
- ❌ AWS RDS - More expensive, manual setup

**Database URL:**
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

---

### ORM
**Choice:** **Prisma 6.16+**

**Rationale:**
- Type-safe database queries
- Schema-first design (matches our approach)
- Excellent migration system (tracks schema changes)
- Works perfectly with tRPC (shared types)
- Great DX (autocomplete for all queries)
- Built-in connection pooling
- Supports all Postgres features (JSON, arrays, enums, etc.)
- Excellent documentation

**Schema Location:** `CommandCentered/schema.prisma` (already complete, 54 tables)

**Migration Workflow:**
```bash
# Generate migration
npx prisma migrate dev --name add_new_table

# Apply to production
npx prisma migrate deploy

# Generate TypeScript types
npx prisma generate
```

---

### Authentication
**Choice:** **Supabase Auth**

**Rationale:**
- Built-in with Supabase (no extra service)
- Supports multiple auth methods (email, magic link, OAuth)
- JWT-based (stateless, scales well)
- Row-Level Security integration (auto-filter by tenant_id)
- User management UI (admin can manage users)
- Email templates customizable
- Rate limiting built-in (prevent brute force)

**Auth Flow:**
1. User signs up → Supabase creates user in `auth.users`
2. Trigger creates UserProfile in `user_profiles` table
3. User assigned to tenant via `tenant_id`
4. All queries auto-filtered by RLS policies
5. JWT stored in httpOnly cookie (XSS-safe)

**Will detail in AUTH_DESIGN.md**

---

### Hosting Platform
**Choice:** **Vercel**

**Rationale:**
- Next.js optimized (made by same company)
- Zero-config deployment (push to GitHub → auto-deploy)
- Edge functions (run code closer to users)
- Automatic HTTPS (SSL certificates managed)
- Preview deployments (every PR gets its own URL)
- Serverless functions (no server management)
- CDN included (static assets cached globally)
- Excellent DX (deploy in seconds)

**Free Tier:**
- 100GB bandwidth/month
- Unlimited serverless function invocations
- Unlimited preview deployments
- Custom domains

**Deployment Flow:**
```
git push origin main
  → Vercel detects push
  → Runs build (npm run build)
  → Deploys to production (commandcentered.vercel.app)
  → Updates DNS (commandcentered.app)
```

---

### Styling
**Choice:** **Tailwind CSS v3+**

**Rationale:**
- Utility-first (fast development)
- Great with Next.js (official integration)
- No CSS file management (styles in JSX)
- Tree-shaking (only used styles in bundle)
- Dark mode built-in (matches mockups)
- Responsive design easy (breakpoint utilities)
- Consistent design system (spacing, colors, etc.)

**Already used in mockups** - can copy classes directly to components

**Design System Colors (from mockups):**
```js
// tailwind.config.js
colors: {
  primary: '#06b6d4', // Cyan
  secondary: '#a855f7', // Purple
  dark: {
    900: '#0f172a', // Slate background
    800: '#1e293b',
    700: '#334155',
  }
}
```

---

### UI Components
**Choice:** **shadcn/ui + Radix UI**

**Rationale:**
- Unstyled components (full control over design)
- Accessible (WCAG AA compliant)
- Composable (build complex UIs from primitives)
- TypeScript-native
- Works great with Tailwind
- Copy-paste components (no npm package, full ownership)
- Matches mockup patterns (modals, dropdowns, calendars)

**Components we'll use:**
- Dialog (Event Detail Modal, Kit Creation Modal)
- Calendar (Planning Page, Operators availability)
- Select (dropdowns everywhere)
- Table (Gear Inventory, Deliverables, etc.)
- Tabs (Files & Assets, Gear categories)
- Toast (success/error notifications)

---

### Form Handling
**Choice:** **React Hook Form + Zod**

**Rationale:**
- React Hook Form (minimal re-renders, great performance)
- Zod (schema validation, works with tRPC)
- Type-safe forms (validation schemas define types)
- Error handling built-in
- Works with shadcn/ui form components

**Example:**
```typescript
const eventSchema = z.object({
  eventName: z.string().min(1, "Event name required"),
  eventType: z.enum(["RECITAL", "CORPORATE", "CONCERT"]),
  venueName: z.string().min(1, "Venue required"),
  loadInTime: z.date(),
  loadOutTime: z.date(),
})

type EventFormData = z.infer<typeof eventSchema>
```

---

### State Management
**Choice:** **React Context + tRPC for server state**

**Rationale:**
- Most state is server state (tRPC handles caching)
- Client state minimal (UI toggles, modals, etc.)
- React Context sufficient for shared UI state
- No need for Redux/Zustand (tRPC does heavy lifting)

**If needed later:** Zustand (lightweight, TypeScript-friendly)

---

### Real-Time Updates (Future)
**Choice:** **Supabase Realtime**

**Rationale:**
- Built-in with Supabase
- WebSocket-based
- Subscribe to database changes
- Perfect for operator coordination (see who's online)
- Live event updates (shifts assigned, gear checked out)

**Use cases:**
- Operator sees shift assigned in real-time
- Calendar updates when colleague creates event
- Gear status updates live (available → in use)

**Implementation:** Phase 2 (not MVP)

---

### File Storage
**Choice:** **Supabase Storage + Google Drive integration**

**Rationale:**
- Supabase Storage for app files (avatars, uploads)
- Google Drive for deliverables (existing customer workflow)
- Google Drive API for folder creation, file uploads

**Storage Structure:**
```
Supabase Storage:
  └── avatars/
      └── operators/
      └── clients/

Google Drive:
  └── [Client Name]/
      └── [Event Name]/
          └── Raw Footage/
          └── Edited Videos/
          └── Photos/
```

---

### Email Service
**Choice:** **Resend**

**Rationale:**
- Modern API (better than SendGrid/Mailgun)
- Great DX (React Email templates)
- Generous free tier (100 emails/day)
- Built for developers
- Excellent deliverability

**Alternatives:**
- SendGrid - Old API, complex pricing
- Mailgun - Similar to Resend, slightly more expensive
- AWS SES - Cheap but complex setup

**Email Templates:** React Email (write emails in React, render to HTML)

---

### Development Tools

**Package Manager:** pnpm (faster than npm, uses less disk space)

**Code Quality:**
- ESLint (catch bugs, enforce style)
- Prettier (code formatting)
- TypeScript strict mode (maximum type safety)
- Husky (pre-commit hooks for linting)

**Testing:**
- Playwright (E2E tests, already have test plan)
- Vitest (unit tests, if needed)

**Monitoring (Post-Launch):**
- Vercel Analytics (page views, performance)
- Sentry (error tracking)
- Supabase Dashboard (database metrics)

---

## Project Structure

```
CommandCentered/
├── prisma/
│   ├── schema.prisma (our 54 tables)
│   └── migrations/ (auto-generated)
├── src/
│   ├── app/ (Next.js App Router)
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/
│   │   │   ├── planning/
│   │   │   ├── pipeline/
│   │   │   ├── gear/
│   │   │   └── ... (11 more pages)
│   │   ├── api/
│   │   │   └── trpc/[trpc]/route.ts (tRPC handler)
│   │   └── layout.tsx
│   ├── server/
│   │   ├── routers/ (tRPC routers)
│   │   │   ├── event.ts
│   │   │   ├── shift.ts
│   │   │   └── ... (13 routers)
│   │   ├── context.ts (auth, db)
│   │   └── trpc.ts (tRPC setup)
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   └── ... (feature components)
│   ├── lib/
│   │   ├── prisma.ts (database client)
│   │   ├── supabase.ts (auth client)
│   │   └── utils.ts
│   └── types/ (shared types)
├── public/ (static assets)
├── .env.local (secrets)
└── package.json
```

---

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For migrations (bypasses pooler)

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..." # Server-side only

# Email
RESEND_API_KEY="re_xxx"

# Google Drive (Phase 2)
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"

# Vimeo (Phase 2)
VIMEO_ACCESS_TOKEN="xxx"

# App
NEXT_PUBLIC_APP_URL="https://commandcentered.app"
```

---

## Cost Estimation (Monthly)

### Free Tier Limits
- **Supabase Free:** 500MB DB, 1GB storage, 50K users, 2 million edge function invocations
- **Vercel Hobby:** 100GB bandwidth, unlimited deployments
- **Resend Free:** 3,000 emails/month

### When We'll Need to Pay
**At ~10 active tenants:**
- Supabase Pro: $25/month (8GB DB, 100GB storage)
- Vercel Pro: $20/month (1TB bandwidth, team features)
- Resend Pro: $20/month (50K emails/month)

**Total: ~$65/month for 10 tenants = $6.50/tenant**

**Pricing recommendation:** $49/month per tenant = ~$43/month profit per tenant

---

## Migration Path (Existing CompPortal Users)

**If you want to migrate CompPortal to this stack:**

1. Keep schema similar (54 tables → adapt to CommandCentered)
2. Build new UI with mockups
3. Migrate data via SQL scripts
4. Deploy alongside CompPortal
5. Switch tenants over gradually

**Or:** Keep CompPortal separate, CommandCentered is new product

---

## Next Steps (Day 1-5)

**Day 1 (Tomorrow):**
- [ ] Create Supabase project
- [ ] Create Next.js app with create-next-app
- [ ] Install dependencies (tRPC, Prisma, Tailwind, shadcn)
- [ ] Connect Prisma to Supabase
- [ ] Run migrations (create all 54 tables)

**Day 2:**
- [ ] Set up tRPC (routers, context, client)
- [ ] Set up Supabase Auth (login, signup flows)
- [ ] Create shared layout with navigation
- [ ] Deploy to Vercel (staging environment)

**Day 3:**
- [ ] Build first API endpoint (event.list)
- [ ] Build Planning Page (read-only first)
- [ ] Confirm end-to-end works (DB → tRPC → UI)

**Day 4:**
- [ ] Implement RLS policies (multi-tenant isolation)
- [ ] Test with 2 test tenants
- [ ] Verify no cross-tenant leaks

**Day 5:**
- [ ] Build Event Detail Modal (view event)
- [ ] Build event.getById endpoint
- [ ] Full CRUD for events (create, update, delete)

**After 5 days:** We have a working app with auth, one complete feature, and proven multi-tenant isolation.

---

## Decision Log

| Decision | Alternatives | Reason |
|----------|-------------|--------|
| Next.js 14 | Remix, SvelteKit | Best ecosystem, Vercel optimized |
| tRPC | GraphQL, REST | Type safety, simple setup |
| Supabase | Neon, RDS | Auth + DB + Storage in one |
| Vercel | AWS, Fly.io | Next.js optimized, zero config |
| Tailwind | CSS Modules, Styled Components | Fast dev, already in mockups |
| shadcn/ui | Material UI, Chakra | Full control, accessible |
| React Hook Form | Formik | Performance, DX |
| Zod | Yup, Joi | Works with tRPC, type inference |

---

**Status:** ✅ APPROVED
**Ready to build:** YES
**Next:** Create API_SPEC.md
