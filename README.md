# CommandCentered

> Logistics command center for videography businesses

**Status:** ✅ Specification Complete - Ready for Implementation

---

## What is CommandCentered?

CommandCentered is a comprehensive operations management system for videography businesses managing complex multi-event operations. It solves the chaos of coordinating operators, equipment, and vehicles across simultaneous events.

### Core Features

- 📅 **Visual calendar** with drag-and-drop scheduling
- 👥 **Operator management** with skills, rates, and ride coordination
- 📦 **Equipment tracking** with location history and kit assignments
- ⚠️ **Automatic conflict detection** (operators, equipment, vehicles)
- 📧 **One-click schedule emails** with calendar attachments
- 📱 **Mobile-friendly** packing lists and checklists
- ⏱️ **Overtime tracking** for accurate payroll
- 🏢 **Multi-tenant SaaS** architecture

---

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** tRPC, Prisma, PostgreSQL (Supabase)
- **Auth:** Supabase Auth with RLS
- **Infrastructure:** Vercel, Resend
- **Testing:** Vitest (unit), Playwright (E2E)

---

## Documentation

- **[Complete Specification](docs/specs/COMMANDCENTERED_SPEC_V1.md)** - 60-page comprehensive spec (SOURCE OF TRUTH)
- **[Quick Summary](SPEC_SUMMARY.md)** - Quick reference guide
- **[Project Status](PROJECT_STATUS.md)** - Current status and roadmap
- **[Project Config](PROJECT.md)** - Project configuration

---

## Database Schema

11 tables with Row Level Security (RLS) for multi-tenant isolation:

1. `tenants` - Isolated business environments
2. `user_profiles` - User accounts (extends Supabase auth)
3. `events` - Videography jobs
4. `operators` - Crew members
5. `operator_blackout_dates` - Unavailable periods
6. `operator_assignments` - Operators → Events
7. `equipment` - Cameras, lenses, audio, etc.
8. `equipment_location_history` - Movement audit trail
9. `vehicles` - Company vehicles
10. `equipment_assignments` - Equipment → Events
11. `event_equipment_templates` - Pre-defined equipment lists

---

## Implementation Roadmap

**Phase 1-2: Foundation + CRUD** (Weeks 1-4)
- Project setup, auth, database schema
- CRUD for events, operators, equipment, vehicles

**Phase 3-4: Calendar + Conflicts** (Weeks 5-7)
- Visual calendar with drag & drop
- Conflict detection and warnings

**Phase 5-6: Packing + Emails** (Weeks 8-9)
- Packing lists with status tracking
- Email generation and sending

**Phase 7: Polish + Launch** (Week 10)
- Analytics dashboard
- Performance optimization
- Documentation

**Target Launch:** January 2025

---

## Development Approach

Following best practices learned from CompPortal:

✅ **Spec-first development** - Complete data model before UI
✅ **Business logic defined upfront** - No guesswork during implementation
✅ **Testing strategy planned early** - Unit + integration + E2E
✅ **All decisions documented** - No ambiguity
✅ **Multi-tenant from day 1** - RLS enforced at database level

**Result:** No technical debt, clean architecture, maintainable codebase

---

## Getting Started (Coming Soon)

```bash
# Clone repo
git clone [repo-url]
cd CommandCentered

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Add Supabase URL, anon key, etc.

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

---

## License

[To be determined]

---

## Contact

[Your contact info]

---

**Built with [Claude Code](https://claude.com/claude-code)**
