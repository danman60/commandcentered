# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create new organization (or use existing)
4. Click "New Project"
   - **Name:** commandcentered
   - **Database Password:** (generate strong password - SAVE THIS)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free tier
5. Click "Create new project" (takes ~2 minutes)

## Step 2: Get Connection Credentials

Once project is created:

1. Go to **Project Settings** (gear icon)
2. Go to **Database** section
3. Copy the connection string under "Connection pooling"
   - Mode: Transaction
   - Copy the string that looks like:
     ```
     postgresql://postgres.xxx:***@aws-0-us-east-1.pooler.supabase.com:5432/postgres
     ```
4. Go to **API** section
5. Copy:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **anon public key** (starts with `eyJhbGc...`)
   - **service_role key** (starts with `eyJhbGc...` - different from anon)

## Step 3: Configure Environment Variables

Create `.env.local` in the app directory with these values:

```bash
# Database (from Step 2, #3)
DATABASE_URL="postgresql://postgres.xxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres"

# Supabase (from Step 2, #5)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step 4: Run Database Migration

After setting environment variables:

```bash
cd app
npx prisma migrate dev --name init
```

This will create all 54 tables in your Supabase database.

## Step 5: Verify Tables Created

1. Go to Supabase dashboard
2. Click "Table Editor" (left sidebar)
3. You should see 47+ tables including:
   - tenants
   - user_profiles
   - events
   - shifts
   - operators
   - gear
   - (and 41 more...)

## Next Steps

Once Supabase is configured and tables are created, continue with:
- Day 2: Auth system setup
- Day 3: Dashboard and first endpoint
