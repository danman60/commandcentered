# CommandCentered

**Production Operations Platform for Video Production Companies**

CommandCentered is a comprehensive event production management system designed for video production companies managing operators, gear, events, and client deliverables. Built with Next.js 16, tRPC, Prisma, and Supabase.

## 🚀 Features

### Core Modules

- **Dashboard** - Real-time overview of events, revenue, operators, and critical alerts
- **Planning Calendar** - Drag-and-drop operator and gear assignment to events and shifts
- **Pipeline** - Lead management and opportunity tracking with CRM features
- **Gear Inventory** - Track cameras, audio equipment, lighting, and custom gear kits
- **Operators** - Manage freelance crew with skills, rates, availability, and ratings
- **Deliverables** - Track client deliverables with Google Drive integration
- **Communications** - Telegram groups and notification log for team coordination
- **Files & Assets** - Document and template management with Supabase Storage
- **Reports** - Financial, performance, and equipment utilization analytics
- **Settings** - Organization settings, integrations, and service templates

### Key Capabilities

✅ **Event Management** - Multi-shift events with operator assignments and gear allocation
✅ **Capacity Management** - Real-time tracking of operator and gear availability
✅ **Gig Sheets** - Generate commander and per-operator sheets with 1-click email
✅ **Operator Ratings** - Performance tracking with automatic average calculation
✅ **Service Templates** - Pre-configured service packages for quick proposal generation
✅ **Google Drive Integration** - Automatic folder creation for deliverables
✅ **Multi-tenant** - Isolated data per organization with secure authentication
✅ **Operator Portal** - Self-service schedule and profile management for crew

## 🛠️ Tech Stack

- **Framework:** Next.js 16.0.3 with App Router and Turbopack
- **Language:** TypeScript 5.x
- **API:** tRPC for end-to-end type-safe APIs
- **Database:** PostgreSQL via Supabase with Prisma ORM
- **Auth:** Supabase Auth with row-level security
- **Storage:** Supabase Storage for file uploads
- **UI:** Tailwind CSS with custom tactical theme
- **Deployment:** Vercel with automatic deployments

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/commandcentered.git
   cd commandcentered/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env.local` file:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DIRECT_URL=your_direct_database_url

   # Optional: External Integrations
   OPENAI_API_KEY=your_openai_key
   VIMEO_ACCESS_TOKEN=your_vimeo_token
   TELEGRAM_BOT_TOKEN=your_telegram_token
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses a comprehensive schema with 40+ models including:

- **Core:** Tenant, UserProfile, Event, Shift, ShiftAssignment
- **Operators:** Operator, OperatorSkill, OperatorAvailability, OperatorRating, OperatorGear
- **Gear:** Gear, GearKit, GearAssignment, GearMovementHistory
- **Deliverables:** Deliverable, DeliverableAsset, DeliverableRevisionHistory
- **CRM:** Lead, LeadNote, Campaign, CampaignLead, Proposal, Contract
- **Communication:** CommunicationTouchpoint, ServiceTemplate, Alert

See `prisma/schema.prisma` for complete schema definition.

## 🔧 Development

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Database Migrations

```bash
# Apply schema changes
npx prisma db push

# Generate Prisma client
npx prisma generate

# View database
npx prisma studio
```

## 🚢 Deployment

### Vercel Deployment

1. Connect repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Setup

1. Create Supabase project
2. Copy database URL and keys to environment variables
3. Run `npx prisma db push` to create schema
4. Enable Row Level Security (RLS) policies in Supabase

## 📁 Project Structure

```
app/
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   │   ├── (auth)/    # Authentication pages
│   │   └── (dashboard)/ # Main application pages
│   ├── components/     # Reusable React components
│   ├── lib/           # Utilities and configurations
│   │   ├── auth/      # Authentication logic
│   │   └── trpc/      # tRPC client setup
│   └── server/        # Backend logic
│       ├── routers/   # tRPC API routers (22 routers)
│       └── trpc.ts    # tRPC server configuration
├── .env.local         # Environment variables (gitignored)
└── package.json       # Dependencies and scripts
```

## 🎨 UI Theme

CommandCentered uses a custom **Tactical UI** theme with:
- Dark slate background (#0f172a)
- Green accent color (#10b981)
- Animated grid overlays
- Tactical scanlines and glow effects
- Responsive design for desktop and mobile

## 🔐 Security

- Row-level security (RLS) on all database tables
- Multi-tenant data isolation via `tenant_id`
- Supabase Auth with email/password
- Service role keys for admin operations
- Secure session management

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is a proprietary production system. Contact the development team for contribution guidelines.

## 📞 Support

For issues or questions, contact the development team or create an issue in the repository.

---

**Built with ❤️ for video production professionals**
