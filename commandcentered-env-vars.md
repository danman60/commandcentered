# CommandCentered - Environment Variables

Copy these to your Vercel project settings:

## Vercel Environment Variables

**Go to:** Vercel Dashboard → commandcentered → Settings → Environment Variables

**Add these 4 variables:**

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://netbsyvxrhrqxyzqflmd.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ldGJzeXZ4cmhycXh5enFmbG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzg1ODIsImV4cCI6MjA2NzkxNDU4Mn0.YhbxfX2iooW1aL30ZzctuuLRaIdGTTfMnz5Pc66fDCc
```

### 3. DATABASE_URL
```
postgresql://postgres.netbsyvxrhrqxyzqflmd:CVXJBm6k0f4a9QBZ@aws-0-us-east-2.pooler.supabase.com:6543/postgres
```

### 4. DIRECT_URL
```
postgresql://postgres.netbsyvxrhrqxyzqflmd:CVXJBm6k0f4a9QBZ@aws-0-us-east-2.pooler.supabase.com:5432/postgres
```

**Note:** Build hash and timestamp are automatically generated at build time via `next.config.ts`. No manual setup required!

---

## Instructions:

1. Go to: https://vercel.com/dashboard
2. Select "commandcentered" project
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar
5. Add each variable above
6. Select all environments: Production, Preview, Development
7. Click "Save"
8. Redeploy your project

---

## Login Credentials:

**Production URL:** https://commandcentered-6j4vjotop-danman60s-projects.vercel.app/login

**Email:** daniel@streamstageproductions.com
**Password:** CommandCentered123!

---

Generated: 2025-11-19
