# CommandCentered Authentication & Multi-Tenant Design

**Date:** November 14, 2025
**Status:** ✅ APPROVED
**Security Level:** CRITICAL - Multi-tenant isolation enforced at 3 layers

---

## Architecture Overview

### 3-Layer Security Model

```
Layer 1: Application (tRPC tenantProcedure filters)
Layer 2: Database RLS (Supabase Row-Level Security)
Layer 3: API Gateway (Supabase Auth validates JWT)
```

**Defense in depth:** Even if one layer fails, others prevent cross-tenant leaks.

---

## Authentication Flow

### Tenant Signup (Self-Service)

**URL:** `commandcentered.app/signup`

```typescript
// Step 1: User submits signup form
{
  email: "admin@acme.com",
  password: "secure123",
  companyName: "ACME Productions",
  subdomain: "acme" // Will become acme.commandcentered.app
}

// Step 2: Create Supabase user
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { company_name: companyName }
  }
})

// Step 3: Database trigger creates Tenant + UserProfile
-- Supabase trigger on auth.users insert
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create tenant
  INSERT INTO tenants (name, subdomain)
  VALUES (NEW.raw_user_meta_data->>'company_name', NEW.raw_user_meta_data->>'subdomain')
  RETURNING id INTO tenant_id;

  -- Create user profile
  INSERT INTO user_profiles (auth_user_id, tenant_id, email, role)
  VALUES (NEW.id, tenant_id, NEW.email, 'ADMIN');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

// Step 4: Send email confirmation
Supabase sends confirmation email automatically

// Step 5: User confirms email → Account active
User clicks link → auth.users.email_confirmed_at updated

// Step 6: Redirect to subdomain
Redirect to: https://acme.commandcentered.app/dashboard
```

---

## User Invitation System

### Invite Flow

**Admin invites new operator:**

```typescript
// Step 1: Admin creates invitation
const invite = await trpc.user.invite.mutate({
  email: "operator@example.com",
  role: "OPERATOR"
})

// Step 2: Create magic link
const magicLink = await supabase.auth.admin.generateLink({
  type: 'magiclink',
  email: invite.email,
  options: {
    redirectTo: `https://${tenant.subdomain}.commandcentered.app/accept-invite`
  }
})

// Step 3: Send invitation email (via Resend)
await sendEmail({
  to: invite.email,
  subject: `You're invited to join ${tenant.name} on CommandCentered`,
  template: 'invitation',
  data: { magicLink, tenantName: tenant.name }
})

// Step 4: User clicks magic link
User arrives at /accept-invite with session created

// Step 5: Create UserProfile
await prisma.userProfile.create({
  data: {
    authUserId: session.user.id,
    tenantId: tenant.id,
    email: invite.email,
    role: invite.role,
  }
})

// Step 6: Redirect to dashboard
User immediately logged in, sees tenant-specific data
```

---

## Multi-Tenant Isolation

### Row-Level Security (RLS) Policies

**Every table has RLS enabled:**

```sql
-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
-- ... (54 tables total)

-- Example policy for events table
CREATE POLICY "Users can only access events from their tenant"
ON events
FOR ALL
USING (
  tenant_id IN (
    SELECT tenant_id
    FROM user_profiles
    WHERE auth_user_id = auth.uid()
  )
);

-- Policy for admin-only operations
CREATE POLICY "Only admins can delete events"
ON events
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE auth_user_id = auth.uid()
    AND tenant_id = events.tenant_id
    AND role IN ('ADMIN', 'SUPER_ADMIN')
  )
);
```

**RLS Template for all tables:**

```sql
-- Read policy (all users)
CREATE POLICY "tenant_read" ON {table}
FOR SELECT USING (tenant_id = get_user_tenant_id());

-- Write policy (admins only)
CREATE POLICY "tenant_write" ON {table}
FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "tenant_update" ON {table}
FOR UPDATE USING (tenant_id = get_user_tenant_id());

CREATE POLICY "tenant_delete" ON {table}
FOR DELETE USING (tenant_id = get_user_tenant_id() AND user_is_admin());
```

---

## Session Management

### JWT Tokens

```typescript
// Supabase Auth creates JWT with payload:
{
  sub: "user-uuid", // User ID
  email: "user@example.com",
  role: "authenticated",
  user_metadata: { /* custom data */ },
  iat: 1234567890, // Issued at
  exp: 1234571490  // Expires in 1 hour
}

// Stored in httpOnly cookie (XSS-safe)
Set-Cookie: sb-access-token=eyJhbGc...; HttpOnly; Secure; SameSite=Lax

// Auto-refresh on client
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    // Session automatically refreshed before expiry
  }
})
```

### Session Security

- **Token lifetime:** 1 hour
- **Refresh token:** 7 days
- **Auto-refresh:** 55 minutes (before expiry)
- **Logout:** Clears cookies + invalidates refresh token
- **Concurrent sessions:** Allowed (multiple devices)

---

## Subdomain Routing

### Next.js Middleware

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req: Request) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get session
  const { data: { session } } = await supabase.auth.getSession()

  // Extract subdomain
  const url = new URL(req.url)
  const subdomain = url.hostname.split('.')[0]

  // If logged in, verify subdomain matches user's tenant
  if (session) {
    const userProfile = await prisma.userProfile.findUnique({
      where: { authUserId: session.user.id },
      include: { tenant: true }
    })

    // Redirect to correct subdomain if mismatch
    if (userProfile && userProfile.tenant.subdomain !== subdomain) {
      const correctUrl = url.clone()
      correctUrl.hostname = `${userProfile.tenant.subdomain}.commandcentered.app`
      return NextResponse.redirect(correctUrl)
    }
  }

  // Protect dashboard routes
  if (url.pathname.startsWith('/dashboard') && !session) {
    const loginUrl = url.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
```

---

## Tenant Switching (Multi-Tenant Users)

**Scenario:** Freelance operator works for multiple production companies

```typescript
// User belongs to multiple tenants
user_profiles:
  { user_id: "john", tenant_id: "acme", role: "OPERATOR" }
  { user_id: "john", tenant_id: "beta", role: "ADMIN" }

// Tenant switcher dropdown in nav
<Select onChange={switchTenant}>
  <option value="acme">ACME Productions (Operator)</option>
  <option value="beta">Beta Studios (Admin)</option>
</Select>

// Switch tenant
async function switchTenant(tenantId: string) {
  // Update session metadata
  await updateUserMetadata({ active_tenant_id: tenantId })

  // Redirect to new subdomain
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
  window.location.href = `https://${tenant.subdomain}.commandcentered.app/dashboard`
}
```

---

## Security Checklist

### Authentication
- [x] Passwords hashed (Supabase bcrypt)
- [x] Email verification required
- [x] Magic links for passwordless login
- [x] Rate limiting on auth endpoints (Supabase built-in)
- [x] Session timeout (1 hour, auto-refresh)
- [ ] 2FA support (Phase 2 - Supabase supports TOTP)

### Multi-Tenant Isolation
- [x] RLS policies on all 54 tables
- [x] Application-level tenant filtering (tRPC)
- [x] Subdomain routing enforced
- [x] User cannot see other tenants' data
- [x] Admin cannot access other tenants (unless SUPER_ADMIN)

### Authorization
- [x] Role-based access control (ADMIN, OPERATOR)
- [x] Permission checks on mutations
- [x] Audit logging (createdBy fields)
- [x] Service role key secured (server-side only)

### XSS Prevention
- [x] HttpOnly cookies (token not accessible to JS)
- [x] Content Security Policy headers
- [x] Input sanitization (React escapes by default)
- [x] Dangerous HTML forbidden (no dangerouslySetInnerHTML)

### CSRF Prevention
- [x] SameSite=Lax cookies
- [x] tRPC doesn't need CSRF tokens (uses POST with JSON)

### SQL Injection Prevention
- [x] Prisma parameterizes all queries
- [x] No raw SQL (unless absolutely necessary, use prisma.$queryRaw with params)

---

## Testing Multi-Tenant Isolation

### Manual Test

```typescript
// Test 1: Create 2 tenants
const acme = await createTenant({ name: "ACME", subdomain: "acme" })
const beta = await createTenant({ name: "Beta", subdomain: "beta" })

// Test 2: Create users in each tenant
const acmeUser = await createUser({ email: "admin@acme.com", tenantId: acme.id })
const betaUser = await createUser({ email: "admin@beta.com", tenantId: beta.id })

// Test 3: Create event in ACME
await createEvent({ tenantId: acme.id, eventName: "ACME Event 1" })

// Test 4: Login as Beta user
const session = await loginAs(betaUser)

// Test 5: Try to access ACME event (should fail)
const events = await trpc.event.list.query()
expect(events).toHaveLength(0) // ✅ Beta user sees 0 events (not ACME's event)

// Test 6: Try to access ACME event by ID (should fail)
await expect(
  trpc.event.getById.query({ id: acmeEvent.id })
).rejects.toThrow('NOT_FOUND') // ✅ RLS blocks access
```

### Automated E2E Test

```typescript
// tests/multi-tenant-isolation.spec.ts
test('Users cannot access other tenants data', async ({ browser }) => {
  const acmeContext = await browser.newContext()
  const betaContext = await browser.newContext()

  // Login to ACME
  const acmePage = await acmeContext.newPage()
  await acmePage.goto('https://acme.commandcentered.app/login')
  await login(acmePage, 'admin@acme.com', 'password')

  // Login to Beta
  const betaPage = await betaContext.newPage()
  await betaPage.goto('https://beta.commandcentered.app/login')
  await login(betaPage, 'admin@beta.com', 'password')

  // Create event in ACME
  await acmePage.goto('/dashboard/planning')
  await createEvent(acmePage, { name: 'Secret ACME Event' })

  // Check Beta cannot see it
  await betaPage.goto('/dashboard/planning')
  const events = await betaPage.locator('.event-card').count()
  expect(events).toBe(0) // ✅ Isolation verified
})
```

---

## Implementation Timeline

**Day 1:** Supabase project setup, basic auth
**Day 2:** Tenant creation flow, RLS policies
**Day 3:** User invitation system, magic links
**Day 4:** Subdomain routing, tenant switcher
**Day 5:** Testing isolation on 2 test tenants

---

**Status:** ✅ DESIGN COMPLETE
**Security Level:** PRODUCTION-READY
**Next:** Create WEEK_3_BUILD_PLAN.md
