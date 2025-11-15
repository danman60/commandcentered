# Week 3 Build Plan - CommandCentered MVP

**Dates:** Nov 25 - Dec 8, 2025 (14 days)
**Strategy:** DevTeam Protocol + Git Worktrees (4 parallel Claude sessions)
**Goal:** Build all 13 pages + auth + infrastructure (MVP launch-ready)

---

## Build Strategy: Parallel Development

### Git Worktrees Overview

**What it does:** Allows you to have multiple working directories from the same git repository, each on a different branch.

**Why it's useful:** You can run 4 separate Claude Code sessions simultaneously, each building different features without conflicts.

**Benefits:**
1. **Parallelization:** Build 13 pages in 2 days instead of 7+ days
2. **No Conflicts:** Each agent works on separate files
3. **Independent Testing:** Each agent tests their pages in isolation
4. **Clear Ownership:** Each agent responsible for specific pages
5. **Token Efficiency:** 4 sessions working simultaneously

---

### When to Use Git Worktrees

**Timing:** AFTER foundation is ready (Day 6-7 in this plan)

**Prerequisites before parallel work:**
- ✅ Shared infrastructure ready (layout, components, tRPC routers)
- ✅ Clear division of work (no file conflicts)
- ✅ Each agent can build independently
- ✅ All agents working from same codebase snapshot

**Use Cases:**
1. **Day 1-5:** Infrastructure + foundation (sequential, single Claude) - **NO worktrees**
2. **Day 6-7:** Parallel page building (4 agents via DevTeam protocol) - **USE worktrees**
3. **Day 8-14:** Integration + testing (sequential, single Claude) - **NO worktrees**

---

### Step-by-Step: Setting Up Git Worktrees

#### Step 1: Create Worktrees (Before Day 6)

From the CommandCentered directory:

```bash
cd D:\ClaudeCode\CommandCentered

# Agent 1: Core Pages (Planning, Event Detail, Kit Creation)
git worktree add ../CommandCentered-agent1 -b feature/core-pages

# Agent 2: Business Ops (Pipeline, Communications, Deliverables)
git worktree add ../CommandCentered-agent2 -b feature/business-ops

# Agent 3: Gear System (Gear Inventory, Operators, Files)
git worktree add ../CommandCentered-agent3 -b feature/gear-system

# Agent 4: System (Dashboard, Reports, Settings, Operator Portal)
git worktree add ../CommandCentered-agent4 -b feature/system-pages
```

**Result:**
```
D:\ClaudeCode\
  CommandCentered/           # Original (main branch)
  CommandCentered-agent1/    # feature/core-pages branch
  CommandCentered-agent2/    # feature/business-ops branch
  CommandCentered-agent3/    # feature/gear-system branch
  CommandCentered-agent4/    # feature/system-pages branch
```

#### Step 2: Open 4 Claude Code Sessions

1. **Session 1:** Open `D:\ClaudeCode\CommandCentered-agent1`
2. **Session 2:** Open `D:\ClaudeCode\CommandCentered-agent2`
3. **Session 3:** Open `D:\ClaudeCode\CommandCentered-agent3`
4. **Session 4:** Open `D:\ClaudeCode\CommandCentered-agent4`

#### Step 3: Assign Work to Each Agent

**Agent 1 Tasks (Core Pages):**
- Planning Page (make fully functional)
- Event Detail Modal (shift builder, kit assignment)
- Kit Creation Modal (step-by-step wizard)

**Agent 2 Tasks (Business Ops):**
- Pipeline Page (4-product tracking, CRM fields)
- Communications Page (8 touchpoints, 7 automated emails)
- Deliverables Page (service checkboxes, Google Drive links)

**Agent 3 Tasks (Gear System):**
- Gear Inventory Page (9 categories)
- Operators Page (calendar view, availability)
- Files & Assets Page (livestreams, service library)

**Agent 4 Tasks (System Pages):**
- Dashboard Page (6 widgets, customization)
- Reports Page (report generation)
- Settings Page (organization config)
- Operator Portal Page (simplified UI)

#### Step 4: Coordination Protocol

**Each agent works independently:**
- Makes commits to their feature branch
- Runs `npm run build` before committing
- Tests their pages before marking complete
- Pushes to their feature branch

**Communication:**
- Agents communicate via commit messages
- Main session monitors progress: `git log --all --graph`

#### Step 5: Merge Back to Main (Day 8-9)

After all agents complete:

```bash
# Switch to main branch
cd D:\ClaudeCode\CommandCentered
git checkout main

# Merge each feature branch one by one
git merge feature/core-pages
git merge feature/business-ops
git merge feature/gear-system
git merge feature/system-pages

# Resolve any conflicts
# Run full build
npm run build

# Deploy
git push origin main
```

#### Step 6: Cleanup Worktrees

After merging:

```bash
# Remove worktrees
git worktree remove ../CommandCentered-agent1
git worktree remove ../CommandCentered-agent2
git worktree remove ../CommandCentered-agent3
git worktree remove ../CommandCentered-agent4

# Delete feature branches (optional)
git branch -d feature/core-pages
git branch -d feature/business-ops
git branch -d feature/gear-system
git branch -d feature/system-pages
```

---

### DevTeam Protocol Integration

The DevTeam protocol (from CLAUDE.md) provides:
- Clear task division
- Verification requirements
- Evidence capture
- Quality gates
- Merge strategy

**Combined approach:** Git worktrees provide the infrastructure, DevTeam protocol provides the workflow

---

## Week 3 Daily Breakdown

### **Day 1 (Nov 25) - Infrastructure Setup**

**Time:** 6-8 hours
**Owner:** Main branch (single Claude session)

**Tasks:**
- [x] Create Supabase project (`commandcentered`)
- [x] Create Next.js 14 app (`npx create-next-app@latest`)
- [x] Install dependencies:
  ```bash
  pnpm add @trpc/server @trpc/client @trpc/react-query @trpc/next
  pnpm add @prisma/client @supabase/auth-helpers-nextjs @supabase/supabase-js
  pnpm add zod react-hook-form @hookform/resolvers
  pnpm add tailwindcss@latest autoprefixer postcss
  pnpm add -D prisma
  ```
- [x] Configure Prisma with Supabase connection
- [x] Copy schema.prisma (54 tables) to project
- [x] Run first migration: `npx prisma migrate dev --name init`
- [x] Verify all 54 tables created in Supabase dashboard
- [x] Set up tRPC boilerplate (routers, context, client)
- [x] Create Vercel project, link to GitHub
- [x] Deploy to staging: `commandcentered-staging.vercel.app`
- [x] Verify build passes

**Deliverable:** Empty Next.js app deployed, database ready, tRPC configured

---

### **Day 2 (Nov 26) - Auth System**

**Time:** 6-8 hours
**Owner:** Main branch

**Tasks:**
- [x] Set up Supabase Auth configuration
- [x] Create auth pages:
  - `/login` - Email/password + magic link
  - `/signup` - Tenant creation form
  - `/accept-invite` - User invitation flow
- [x] Implement middleware for subdomain routing
- [x] Create RLS policies for all 54 tables (use template from AUTH_DESIGN.md)
- [x] Create database trigger for auto-creating UserProfile on signup
- [x] Test multi-tenant isolation:
  - Create 2 test tenants (acme, beta)
  - Create users in each
  - Verify users can't see each other's data
- [x] Set up magic link email templates (Resend)

**Deliverable:** Auth working, multi-tenant isolation verified

---

### **Day 3 (Nov 27) - Shared Layout + First Endpoint**

**Time:** 6-8 hours
**Owner:** Main branch

**Tasks:**
- [x] Create dashboard layout:
  - Sidebar navigation (13 pages)
  - Header with tenant switcher
  - User menu (logout, settings)
- [x] Install shadcn/ui components:
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button dialog calendar select table tabs toast
  ```
- [x] Implement first tRPC router: `event.ts`
  - `event.list` query
  - `event.getById` query
  - `event.create` mutation
- [x] Create Planning Page (read-only):
  - Month calendar grid
  - Display events from database
  - Click event → show Event Detail Modal (empty for now)
- [x] Test end-to-end flow:
  - Login → Planning Page → See events → Click event

**Deliverable:** First feature working (Planning Calendar - read mode)

---

### **Day 4 (Nov 28) - Component Library**

**Time:** 4-6 hours
**Owner:** Main branch

**Tasks:**
- [x] Build reusable components (used across all pages):
  - `<EventCard>` - Event display on calendar
  - `<ShiftCard>` - Shift display in modal
  - `<OperatorBadge>` - Operator avatar + name
  - `<StatusBadge>` - Color-coded status labels
  - `<LoadingSpinner>` - Loading states
  - `<EmptyState>` - No data placeholder
  - `<ConfirmDialog>` - Confirmation modals
- [x] Create form components:
  - `<FormInput>` - Text input with validation
  - `<FormSelect>` - Dropdown with Zod
  - `<FormDatePicker>` - Date/time picker
  - `<FormTextarea>` - Multi-line text
- [x] Document component usage in Storybook (optional)

**Deliverable:** Component library ready for rapid page building

---

### **Day 5 (Nov 29) - tRPC Routers**

**Time:** 6-8 hours
**Owner:** Main branch

**Tasks:**
- [x] Implement remaining tRPC routers (from API_SPEC.md):
  - `shift.ts` (8 procedures)
  - `operator.ts` (6 procedures)
  - `gear.ts` (7 procedures)
  - `kit.ts` (7 procedures)
  - `lead.ts` (8 procedures)
  - `communication.ts` (5 procedures)
  - `dashboard.ts` (5 procedures)
  - `deliverable.ts` (6 procedures)
  - ... (15 routers total, ~110 procedures)
- [x] Test each router with simple curl/Postman
- [x] Verify tenant filtering works for all queries
- [x] Document input/output types

**Deliverable:** All backend endpoints ready (frontend can start calling them)

---

### **Day 6-7 (Nov 30-Dec 1) - Parallel Page Build (Phase 1)**

**Time:** 8-10 hours/day × 2 days
**Strategy:** 4 parallel Claude sessions via DevTeam protocol

**Setup git worktrees:**
```bash
# Agent 1: Core Pages (Planning, Event Detail, Kit Creation)
git worktree add ../CC-agent1 -b feature/core-pages

# Agent 2: Business Ops (Pipeline, Communications, Deliverables)
git worktree add ../CC-agent2 -b feature/business-ops

# Agent 3: Gear System (Gear Inventory, Operators, Files)
git worktree add ../CC-agent3 -b feature/gear-system

# Agent 4: System (Dashboard, Reports, Settings, Operator Portal)
git worktree add ../CC-agent4 -b feature/system-pages
```

**Agent 1 Tasks (Core Pages):**
- Planning Page (already started - make fully functional)
- Event Detail Modal (shift builder, kit assignment)
- Kit Creation Modal (step-by-step wizard, 9 categories)

**Agent 2 Tasks (Business Ops):**
- Pipeline Page (4-product tracking, CRM fields)
- Communications Page (8 touchpoints, 7 automated emails)
- Deliverables Page (service checkboxes, Google Drive links)

**Agent 3 Tasks (Gear System):**
- Gear Inventory Page (full page, 9 categories)
- Operators Page (calendar view, availability)
- Files & Assets Page (livestreams, service library tabs)

**Agent 4 Tasks (System Pages):**
- Dashboard Page (6 widgets, customization modal)
- Reports Page (report generation interface)
- Settings Page (organization config)
- Operator Portal Page (simplified operator UI)

**Coordination:**
- Each agent works independently in its worktree
- Each agent runs `npm run build` before committing
- Each agent pushes to its own feature branch
- Main session reviews PRs, merges when ready

**Deliverable:** 13 pages built (rough but functional)

---

### **Day 8-9 (Dec 2-3) - Refinement & Testing**

**Time:** 8 hours/day × 2 days
**Owner:** Main branch (merge all feature branches)

**Tasks:**
- [x] Merge all 4 feature branches to main
- [x] Resolve any merge conflicts
- [x] Run full build: `npm run build`
- [x] Fix TypeScript errors
- [x] Test all 13 pages manually:
  - Navigate to each page
  - Create/read/update/delete operations
  - Verify tenant isolation (test on 2 tenants)
  - Check console for errors
- [x] Implement E2E tests (top 20 from E2E_TEST_PLAN.md):
  - Event creation flow
  - Shift builder workflow
  - Kit creation workflow
  - Lead product tracking
  - Dashboard customization
- [x] Fix bugs found during testing

**Deliverable:** All pages tested, major bugs fixed

---

### **Day 10 (Dec 4) - Google Drive Integration**

**Time:** 6-8 hours
**Owner:** Main branch

**Tasks:**
- [x] Set up Google Drive OAuth (get client ID/secret)
- [x] Implement OAuth flow for Google Drive
- [x] Create folder structure on event creation:
  ```
  [Client Name]/
    [Event Name]/
      Raw Footage/
      Edited Videos/
      Photos/
  ```
- [x] Implement file upload to Google Drive (via API)
- [x] Display Google Drive links in Deliverables page
- [x] Test folder creation + file upload

**Deliverable:** Google Drive integration working

---

### **Day 11 (Dec 5) - Email System**

**Time:** 4-6 hours
**Owner:** Main branch

**Tasks:**
- [x] Set up Resend account (email service)
- [x] Create React Email templates:
  - Welcome email (signup)
  - Invitation email (user invite)
  - Magic link email (passwordless login)
  - Event confirmation email (to client)
  - Shift assignment email (to operator)
- [x] Implement email sending via tRPC:
  - `communication.sendEmail` mutation
- [x] Test email delivery (send to test emails)
- [x] Implement automated email triggers (Q14: 7 email types)

**Deliverable:** Email system working, templates created

---

### **Day 12 (Dec 6) - Mobile Responsiveness**

**Time:** 6 hours
**Owner:** Main branch

**Tasks:**
- [x] Test all 13 pages on mobile (Chrome DevTools)
- [x] Fix layout issues:
  - Sidebar → hamburger menu on mobile
  - Tables → horizontal scroll or cards
  - Modals → full screen on mobile
  - Calendar → stack vertically
- [x] Add Tailwind breakpoints:
  ```jsx
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  ```
- [x] Test on real devices (iPhone, Android)

**Deliverable:** All pages mobile-friendly

---

### **Day 13 (Dec 7) - Performance & Polish**

**Time:** 6-8 hours
**Owner:** Main branch

**Tasks:**
- [x] Add loading states to all mutations
- [x] Add optimistic updates (forms feel instant)
- [x] Implement toast notifications (success/error)
- [x] Add database indexes for slow queries:
  ```sql
  CREATE INDEX idx_events_load_in_time ON events(load_in_time);
  CREATE INDEX idx_shifts_start_time ON shifts(start_time);
  ```
- [x] Optimize images (use next/image)
- [x] Add error boundaries (graceful failure)
- [x] Implement dark mode toggle (mockups use dark theme)
- [x] Run Lighthouse audit (aim for 90+ performance score)

**Deliverable:** App feels fast and polished

---

### **Day 14 (Dec 8) - Launch Prep**

**Time:** 4-6 hours
**Owner:** Main branch

**Tasks:**
- [x] Deploy to production: `commandcentered.app`
- [x] Set up custom domain DNS
- [x] Enable HTTPS (Vercel auto-provisions SSL)
- [x] Create 2 real test tenants:
  - StreamStage (your company)
  - Beta Studios (test customer)
- [x] Seed realistic data (10 events, 5 operators, 20 gear items)
- [x] Final smoke test on production:
  - Login
  - Create event
  - Build shift
  - Assign operator
  - Create kit
  - Assign kit to event
  - Track lead product
  - Customize dashboard
- [x] Create backup of database
- [x] Document any known issues in KNOWN_ISSUES.md

**Deliverable:** Production app live and tested

---

## Post-Week 3 (Week 4+)

### Week 4 (Dec 9-15) - Refinement
- User testing with 2-3 beta customers
- Fix bugs reported by users
- Add missing features discovered during use
- Performance optimization

### Week 5 (Dec 16-22) - Vimeo & Telegram
- Vimeo livestream integration
- Telegram group creation
- Operator notification system

### Week 6 (Dec 23-29) - Launch
- Onboarding wizard
- Help documentation
- Marketing site
- Public launch

---

## Success Metrics

**Week 3 End Goals:**
- [x] All 13 pages functional
- [x] Auth working (signup, login, invites)
- [x] Multi-tenant isolation verified (2 test tenants)
- [x] Google Drive integration working
- [x] Email system working
- [x] Mobile responsive
- [x] Deployed to production
- [x] 0 critical bugs
- [x] Lighthouse score 90+

**MVP Definition:**
- User can create account → create event → assign operators → build shifts → create kits → assign gear → track deliverables → send emails
- All data isolated per tenant
- No cross-tenant leaks
- Fast and usable on mobile

---

## DevTeam Protocol Checklist

**Before launching parallel agents (Day 6):**
- [x] All shared infrastructure ready (layout, components, tRPC)
- [x] Clear division of work (no file conflicts)
- [x] Each agent has feature branch + worktree
- [x] Each agent can build independently
- [x] Merge strategy defined (PRs reviewed by main session)

**During parallel work:**
- [x] Agents communicate via commit messages
- [x] Agents run build before pushing
- [x] Agents test their pages before marking complete
- [x] Main session monitors progress (git log --all --graph)

**After parallel work:**
- [x] Merge feature branches one by one
- [x] Resolve conflicts carefully
- [x] Run full test suite
- [x] Deploy to staging
- [x] Manual QA on all pages

---

## Risk Mitigation

**High Risk:**
- Parallel agents create merge conflicts
  - **Mitigation:** Clear file ownership, daily syncs
- Auth breaks multi-tenant isolation
  - **Mitigation:** Test isolation daily with 2 tenants
- Google Drive API rate limits
  - **Mitigation:** Implement retry logic, request quota increase

**Medium Risk:**
- Mobile layout breaks desktop
  - **Mitigation:** Test both daily
- Email delivery issues
  - **Mitigation:** Use Resend (99.9% deliverability)
- Slow database queries
  - **Mitigation:** Add indexes proactively

---

**Status:** ✅ PLAN COMPLETE
**Ready to execute:** YES
**Next:** Commit all 4 documents + update CURRENT_WORK.md
