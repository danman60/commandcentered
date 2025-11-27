# Clients Page Specification

**Version:** 1.0
**Date:** November 27, 2025
**Status:** Draft - Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Data Model](#data-model)
3. [Navigation](#navigation)
4. [Page Structure](#page-structure)
5. [Table View](#table-view)
6. [Add Client Modal](#add-client-modal)
7. [Client Detail Modal](#client-detail-modal)
8. [Backend Requirements](#backend-requirements)
9. [Validation Rules](#validation-rules)
10. [UI/UX Specifications](#uiux-specifications)

---

## 1. Overview

The Clients page provides centralized client management with full relationship tracking. Clients are the core entity that events, deliverables, contracts, and communications link to.

**Core Functionality:**
- View all clients in sortable, searchable table
- Add new clients with complete contact information
- View detailed client profile with all linked entities
- Track communication history and last contact date
- Manage client status (Active/Inactive/Blacklisted)
- Store client-specific Google Drive folder
- Maintain free-form notes per client

**User Roles:**
- All authenticated users can view clients (tenant-scoped)
- Only Competition Directors and Super Admins can create/edit clients

---

## 2. Data Model

### 2.1 Client Schema (Enhanced)

```prisma
model Client {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  tenantId String @map("tenant_id") @db.Uuid
  tenant   Tenant @relation(fields: [tenantId], references: [id], onDelete: Restrict)

  leadId String? @map("lead_id") @db.Uuid
  lead   Lead?   @relation(fields: [leadId], references: [id], onDelete: SetNull)

  // Contact Information
  organization String  @db.VarChar(255)  // REQUIRED
  contactName  String? @map("contact_name") @db.VarChar(255)
  email        String  @db.VarChar(255)  // REQUIRED
  phone        String? @db.VarChar(50)
  website      String? @db.VarChar(500)

  // Address
  addressLine1 String? @map("address_line1") @db.VarChar(255)
  addressLine2 String? @map("address_line2") @db.VarChar(255)
  city         String? @db.VarChar(100)
  province     String? @db.VarChar(100)
  postalCode   String? @map("postal_code") @db.VarChar(20)
  country      String? @default("Canada") @db.VarChar(100)

  // Business Info
  industry String? @db.VarChar(100)
  size     String? @db.VarChar(50)  // Options: 1-10, 11-50, 51-200, 201-500, 500+

  // Status
  status      ClientStatus @default(ACTIVE)
  statusNotes String?      @map("status_notes") @db.Text

  // Metrics (auto-calculated)
  totalRevenue Decimal @default(0) @map("total_revenue") @db.Decimal(10, 2)
  totalEvents  Int     @default(0) @map("total_events")

  // Visual customization
  brandColor String? @map("brand_color") @db.VarChar(7)  // Hex color code

  // Google Drive integration
  googleDriveFolderId  String? @map("google_drive_folder_id") @db.VarChar(255)
  googleDriveFolderUrl String? @map("google_drive_folder_url") @db.VarChar(500)

  // Notes (NEW)
  notes String? @db.Text

  // Relations
  events                   Event[]
  contracts                Contract[]
  communicationTouchpoints CommunicationTouchpoint[]
  files                    File[]
  deliverables             Deliverable[]

  @@index([tenantId])
  @@index([leadId])
  @@index([status])
  @@map("clients")
  @@schema("commandcentered")
}

enum ClientStatus {
  ACTIVE      @map("active")      // Current client
  INACTIVE    @map("inactive")    // Past client, not blacklisted
  BLACKLISTED @map("blacklisted") // Do not contact

  @@map("client_status")
  @@schema("commandcentered")
}
```

### 2.2 Related Models

**CommunicationTouchpoint** - Used to calculate "Last Contacted"
```prisma
model CommunicationTouchpoint {
  id        String   @id @default(dbgenerated("gen_random_uuid()"))
  clientId  String?  @map("client_id") @db.Uuid
  client    Client?  @relation(...)

  touchpointType TouchpointType   // EMAIL, CALL, MEETING, etc.
  status         TouchpointStatus // PENDING, COMPLETED
  completedAt    DateTime?
  notes          String?
}
```

---

## 3. Navigation

### 3.1 Sidebar Link

**Location:** Main navigation sidebar (app/src/components/Sidebar.tsx)
**Position:** After "Pipeline", before "Planning"
**Icon:** 👥 (people emoji)
**Label:** "Clients"
**Route:** `/clients`
**Active State:** Green gradient background when on `/clients` route

**Implementation:**
```tsx
<Link
  href="/clients"
  className={isActive ? 'bg-gradient-to-r from-green-500/20...' : '...'}
>
  <span className="text-2xl">👥</span>
  <span>Clients</span>
</Link>
```

### 3.2 Route Structure

```
/clients              → Main clients table view
/clients/[id]         → Not used (detail modal instead)
```

---

## 4. Page Structure

### 4.1 File Location

**Path:** `app/src/app/(dashboard)/clients/page.tsx`

### 4.2 Page Layout

```tsx
<div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
  {/* Header */}
  <div className="flex-shrink-0 bg-gradient-to-r from-green-500/10...">
    <h1>👥 Clients</h1>
    <p>Manage client relationships and track interactions</p>
    <button>➕ Add Client</button>
  </div>

  {/* Search & Filters */}
  <div className="flex-shrink-0 px-8 py-4 bg-slate-900/60">
    <input placeholder="Search by organization, contact, or email..." />
    <select>Status Filter</select>
    <select>Industry Filter</select>
  </div>

  {/* Clients Table */}
  <div className="flex-1 overflow-auto px-8 py-6">
    <table>...</table>
  </div>

  {/* Modals */}
  <AddClientModal />
  <ClientDetailModal />
</div>
```

---

## 5. Table View

### 5.1 Columns (All Sortable)

| Column | Width | Content | Sort Key |
|--------|-------|---------|----------|
| Organization | 20% | Client org name + contact name subtitle | `organization` |
| Status | 10% | Badge with color (Active=green, Inactive=gray, Blacklisted=red) | `status` |
| Industry | 15% | Industry or "—" if empty | `industry` |
| Total Events | 10% | Count, click to filter events by client | `totalEvents` |
| Total Revenue | 12% | Formatted currency | `totalRevenue` |
| Last Contacted | 15% | Date from most recent touchpoint, or "Never" | calculated |
| Google Drive | 8% | Link icon if URL exists | n/a |
| Actions | 10% | View Details button | n/a |

### 5.2 Table Features

**Sorting:**
- Default sort: Organization (A-Z)
- Click column headers to sort
- Visual indicators: ↑ ↓ or ⇅

**Search:**
- Searches: organization, contactName, email
- Case-insensitive
- Real-time filtering (no submit button)

**Filters:**
- Status dropdown: All / Active / Inactive / Blacklisted
- Industry dropdown: All / [list of unique industries]
- Filters combine with AND logic

**Empty State:**
```
No clients found. Create your first client to get started.
[Add Client Button]
```

### 5.3 Row Interaction

- **Click row** → Opens Client Detail Modal
- **Click Google Drive icon** → Opens Drive folder in new tab (stops propagation)
- **Hover** → bg-green-500/5 background

### 5.4 Status Badges

```tsx
// Active
<span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full">
  Active
</span>

// Inactive
<span className="px-3 py-1 bg-slate-600/20 text-slate-400 rounded-full">
  Inactive
</span>

// Blacklisted
<span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full">
  Blacklisted
</span>
```

---

## 6. Add Client Modal

### 6.1 Modal Specifications

**Size:** 60vw width, max-h-90vh
**Title:** "Add New Client"
**Layout:** 2-column grid for form fields

### 6.2 Form Fields

**Contact Information Section:**
```tsx
<div className="grid grid-cols-2 gap-4">
  <div className="col-span-2">
    <label>Organization *</label>
    <input type="text" required />
  </div>

  <div>
    <label>Contact Name</label>
    <input type="text" />
  </div>

  <div>
    <label>Email *</label>
    <input type="email" required />
  </div>

  <div>
    <label>Phone</label>
    <input type="tel" />
  </div>

  <div>
    <label>Website</label>
    <input type="url" placeholder="https://" />
  </div>
</div>
```

**Address Section:**
```tsx
<h3>Address</h3>
<div className="grid grid-cols-2 gap-4">
  <div className="col-span-2">
    <label>Street Address</label>
    <input type="text" />
  </div>

  <div className="col-span-2">
    <label>Address Line 2</label>
    <input type="text" />
  </div>

  <div>
    <label>City</label>
    <input type="text" />
  </div>

  <div>
    <label>Province/State</label>
    <input type="text" />
  </div>

  <div>
    <label>Postal Code</label>
    <input type="text" />
  </div>

  <div>
    <label>Country</label>
    <input type="text" defaultValue="Canada" />
  </div>
</div>
```

**Business Information Section:**
```tsx
<div className="grid grid-cols-2 gap-4">
  <div>
    <label>Industry</label>
    <input type="text" placeholder="e.g., Dance, Theater, Music" />
  </div>

  <div>
    <label>Company Size</label>
    <select>
      <option value="">Select size</option>
      <option value="1-10">1-10 employees</option>
      <option value="11-50">11-50 employees</option>
      <option value="51-200">51-200 employees</option>
      <option value="201-500">201-500 employees</option>
      <option value="500+">500+ employees</option>
    </select>
  </div>

  <div className="col-span-2">
    <label>Brand Color</label>
    <input type="color" defaultValue="#06b6d4" />
    <span className="text-xs text-slate-400">
      Used for visual identification throughout the app
    </span>
  </div>
</div>
```

**Convert from Lead (Optional):**
```tsx
<div>
  <label>Convert from Lead (Optional)</label>
  <select>
    <option value="">Not converted from a lead</option>
    {leads.map(lead => (
      <option key={lead.id} value={lead.id}>
        {lead.companyName}
      </option>
    ))}
  </select>
</div>
```

### 6.3 Action Buttons

```tsx
<div className="flex gap-3 pt-4">
  <button
    type="button"
    onClick={onClose}
    className="flex-1 bg-slate-700 hover:bg-slate-600..."
  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={isSubmitting}
    className="flex-1 bg-gradient-to-r from-green-500 to-green-600..."
  >
    {isSubmitting ? 'Creating...' : 'Create Client'}
  </button>
</div>
```

### 6.4 Behavior

- **On Success:** Close modal, refresh table, show success toast
- **On Error:** Show error message below form
- **Validation:** Client-side and server-side (see Validation Rules section)

---

## 7. Client Detail Modal

### 7.1 Modal Specifications

**Size:** 60vw width, max-h-90vh
**Title:** Organization name (dynamic)
**Scrollable:** Yes (overflow-y-auto)

### 7.2 Header Section

```tsx
<div className="px-6 py-4 border-b border-green-500/20">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {/* Brand Color Indicator */}
      <div
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: client.brandColor || '#06b6d4' }}
      />

      <h2 className="text-2xl font-bold text-white">
        {client.organization}
      </h2>

      {/* Status Badge (Inline Editable) */}
      <StatusBadge
        status={client.status}
        onUpdate={(newStatus) => updateStatus(newStatus)}
      />
    </div>

    <div className="flex items-center gap-3">
      <button onClick={toggleEditMode}>
        {isEditMode ? 'Cancel' : '✏️ Edit'}
      </button>
      <button onClick={onClose}>×</button>
    </div>
  </div>
</div>
```

### 7.3 Contact Information Section

**Layout:** 2-column grid

```tsx
<div className="p-6">
  <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label>Contact Person</label>
      {isEditMode ? (
        <input value={contactName} onChange={...} />
      ) : (
        <div className="px-4 py-2 bg-slate-800/40 rounded-lg">
          {client.contactName || '—'}
        </div>
      )}
    </div>

    <div>
      <label>Email</label>
      {isEditMode ? (
        <input type="email" value={email} onChange={...} />
      ) : (
        <div className="px-4 py-2 bg-slate-800/40 rounded-lg">
          <a href={`mailto:${client.email}`} className="text-green-400">
            {client.email}
          </a>
        </div>
      )}
    </div>

    <div>
      <label>Phone</label>
      {/* Same pattern */}
    </div>

    <div>
      <label>Website</label>
      {/* Link if not edit mode */}
    </div>

    <div className="col-span-2">
      <label>Full Address</label>
      {isEditMode ? (
        // Address edit fields
      ) : (
        <div className="px-4 py-2 bg-slate-800/40 rounded-lg">
          {formatAddress(client)}
        </div>
      )}
    </div>

    <div>
      <label>Industry</label>
      {/* Same pattern */}
    </div>

    <div>
      <label>Company Size</label>
      {/* Same pattern */}
    </div>
  </div>
</div>
```

### 7.4 Key Metrics Section

**Layout:** 3-column grid with metric cards

```tsx
<div className="px-6 pb-6">
  <h3 className="text-lg font-bold text-white mb-4">Overview</h3>

  <div className="grid grid-cols-3 gap-4">
    {/* Total Events Card */}
    <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">
      <div className="text-sm text-slate-400 mb-1">Total Events</div>
      <div className="text-3xl font-bold text-white">
        {client.totalEvents || 0}
      </div>
      <button className="text-xs text-green-400 mt-2">
        View Events →
      </button>
    </div>

    {/* Total Revenue Card */}
    <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">
      <div className="text-sm text-slate-400 mb-1">Total Revenue</div>
      <div className="text-3xl font-bold text-white">
        ${formatCurrency(client.totalRevenue)}
      </div>
    </div>

    {/* Last Contacted Card */}
    <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">
      <div className="text-sm text-slate-400 mb-1">Last Contacted</div>
      <div className="text-xl font-bold text-white">
        {lastContacted ? formatDate(lastContacted) : 'Never'}
      </div>
      <div className="text-xs text-slate-500 mt-1">
        {lastContactedType}
      </div>
    </div>
  </div>
</div>
```

### 7.5 Linked Events Section

```tsx
<div className="px-6 pb-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-bold text-white">Events ({events.length})</h3>
    <button className="text-sm bg-green-500/20 px-3 py-1 rounded">
      + Create Event for Client
    </button>
  </div>

  {events.length > 0 ? (
    <div className="space-y-2">
      {events.map(event => (
        <div
          key={event.id}
          className="p-3 bg-slate-800/60 rounded-lg hover:bg-slate-800 cursor-pointer"
          onClick={() => openEventDetail(event.id)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">{event.eventName}</div>
              <div className="text-sm text-slate-400">
                {formatDate(event.loadInTime)} • {event.venueName}
              </div>
            </div>
            <StatusBadge status={event.status} />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 text-slate-500">
      No events yet. Create an event for this client.
    </div>
  )}
</div>
```

### 7.6 Linked Deliverables Section

**Same pattern as Events section**

```tsx
<div className="px-6 pb-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-bold text-white">
      Deliverables ({deliverables.length})
    </h3>
    <button>+ Create Deliverable for Client</button>
  </div>

  {/* Deliverable cards with status, due date, event name */}
</div>
```

### 7.7 Communication History Section

```tsx
<div className="px-6 pb-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-bold text-white">
      Communication History ({touchpoints.length})
    </h3>
    <button>+ Add Touchpoint</button>
  </div>

  <div className="space-y-2">
    {touchpoints.map(tp => (
      <div key={tp.id} className="p-3 bg-slate-800/60 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{getIcon(tp.touchpointType)}</span>
            <div>
              <div className="font-semibold text-slate-200">
                {tp.touchpointType}
              </div>
              <div className="text-sm text-slate-400">
                {formatDate(tp.completedAt || tp.createdAt)}
              </div>
            </div>
          </div>
          <StatusBadge status={tp.status} />
        </div>
        {tp.notes && (
          <div className="mt-2 text-sm text-slate-400 pl-11">
            {tp.notes}
          </div>
        )}
      </div>
    ))}
  </div>
</div>
```

### 7.8 Google Drive Section

**Same pattern as Deliverables page**

```tsx
<div className="px-6 pb-6">
  <h3 className="text-lg font-bold text-white mb-3">Google Drive Folder</h3>

  {isGoogleDriveEditMode ? (
    <div>
      <input
        type="url"
        value={googleDriveUrl}
        onChange={(e) => setGoogleDriveUrl(e.target.value)}
        placeholder="https://drive.google.com/drive/folders/..."
      />
      <div className="flex gap-3 mt-3">
        <button onClick={cancelGoogleDrive}>Cancel</button>
        <button onClick={saveGoogleDrive}>Save Folder</button>
      </div>
    </div>
  ) : (
    <div>
      {client.googleDriveFolderUrl ? (
        <a
          href={client.googleDriveFolderUrl}
          target="_blank"
          className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg"
        >
          <span className="text-2xl">📁</span>
          <div>
            <div className="font-semibold text-green-300">Client Folder</div>
            <div className="text-xs text-slate-400">Click to open</div>
          </div>
        </a>
      ) : (
        <div className="text-center py-6 text-slate-500">
          No folder linked
        </div>
      )}
      <button onClick={editGoogleDrive} className="w-full mt-3">
        {client.googleDriveFolderUrl ? 'Update Link' : 'Add Link'}
      </button>
    </div>
  )}
</div>
```

### 7.9 Notes Section

**Same pattern as Deliverables notes with autosave**

```tsx
<div className="px-6 pb-6">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-lg font-bold text-white">Notes</h3>
    {saveStatus === 'saving' && (
      <span className="text-sm text-yellow-400">Saving...</span>
    )}
    {saveStatus === 'saved' && (
      <span className="text-sm text-green-400">✓ Saved</span>
    )}
  </div>

  <textarea
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    placeholder="Client notes, preferences, history, or any other relevant information..."
    className="w-full h-64 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 resize-vertical font-mono text-sm"
  />

  <div className="text-xs text-slate-500 mt-2">
    Notes autosave 1 second after you stop typing
  </div>
</div>
```

---

## 8. Backend Requirements

### 8.1 Enhanced Client Router

**File:** `app/src/server/routers/client.ts`

#### 8.1.1 List Query Enhancement

```typescript
list: tenantProcedure
  .input(z.object({
    search: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLACKLISTED']).optional(),
    industry: z.string().optional(),
  }).optional())
  .query(async ({ ctx, input }) => {
    return ctx.prisma.client.findMany({
      where: {
        tenantId: ctx.tenantId,
        ...(input?.search && {
          OR: [
            { organization: { contains: input.search, mode: 'insensitive' } },
            { contactName: { contains: input.search, mode: 'insensitive' } },
            { email: { contains: input.search, mode: 'insensitive' } },
          ],
        }),
        ...(input?.status && { status: input.status }),
        ...(input?.industry && { industry: input.industry }),
      },
      include: {
        _count: {
          select: {
            events: true,
            deliverables: true,
            communicationTouchpoints: true,
          },
        },
        communicationTouchpoints: {
          where: { status: 'COMPLETED' },
          orderBy: { completedAt: 'desc' },
          take: 1,
          select: {
            completedAt: true,
            touchpointType: true,
          },
        },
      },
      orderBy: { organization: 'asc' },
    });
  });
```

#### 8.1.2 GetById Query Enhancement

```typescript
getById: tenantProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    return ctx.prisma.client.findFirst({
      where: {
        id: input.id,
        tenantId: ctx.tenantId,
      },
      include: {
        events: {
          orderBy: { loadInTime: 'desc' },
          take: 20,
        },
        deliverables: {
          include: {
            event: {
              select: {
                eventName: true,
              },
            },
          },
          orderBy: { dueDate: 'asc' },
          take: 20,
        },
        communicationTouchpoints: {
          orderBy: { completedAt: 'desc' },
          take: 20,
        },
        files: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  });
```

#### 8.1.3 Create Mutation Enhancement

```typescript
create: tenantProcedure
  .input(z.object({
    leadId: z.string().uuid().optional(),
    organization: z.string().min(1),
    contactName: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional().default('Canada'),
    industry: z.string().optional(),
    size: z.string().optional(),
    brandColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.client.create({
      data: {
        tenantId: ctx.tenantId,
        ...input,
      },
    });
  });
```

#### 8.1.4 Update Mutation Enhancement

```typescript
update: tenantProcedure
  .input(z.object({
    id: z.string().uuid(),
    organization: z.string().min(1).optional(),
    contactName: z.string().optional().nullable(),
    email: z.string().email().optional(),
    phone: z.string().optional().nullable(),
    website: z.string().url().optional().nullable(),
    addressLine1: z.string().optional().nullable(),
    addressLine2: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    province: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    country: z.string().optional(),
    industry: z.string().optional().nullable(),
    size: z.string().optional().nullable(),
    brandColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional().nullable(),
    googleDriveFolderId: z.string().optional().nullable(),
    googleDriveFolderUrl: z.string().url().optional().nullable(),
    notes: z.string().optional().nullable(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;

    const client = await ctx.prisma.client.findFirst({
      where: { id, tenantId: ctx.tenantId },
    });
    if (!client) throw new Error('Client not found');

    return ctx.prisma.client.update({
      where: { id },
      data,
    });
  });
```

#### 8.1.5 Update Status Mutation (NEW)

```typescript
updateStatus: tenantProcedure
  .input(z.object({
    id: z.string().uuid(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLACKLISTED']),
    statusNotes: z.string().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const client = await ctx.prisma.client.findFirst({
      where: { id: input.id, tenantId: ctx.tenantId },
    });
    if (!client) throw new Error('Client not found');

    return ctx.prisma.client.update({
      where: { id: input.id },
      data: {
        status: input.status,
        statusNotes: input.statusNotes,
      },
    });
  });
```

#### 8.1.6 Get Industries Query (NEW)

```typescript
getIndustries: tenantProcedure
  .query(async ({ ctx }) => {
    const clients = await ctx.prisma.client.findMany({
      where: {
        tenantId: ctx.tenantId,
        industry: { not: null },
      },
      select: {
        industry: true,
      },
      distinct: ['industry'],
    });

    return clients
      .map(c => c.industry)
      .filter(Boolean)
      .sort();
  });
```

---

## 9. Validation Rules

### 9.1 Client-Side Validation

**Organization:**
- Required
- Min length: 1 character
- Max length: 255 characters

**Email:**
- Required
- Valid email format
- Max length: 255 characters

**Phone:**
- Optional
- Max length: 50 characters
- No specific format required (international support)

**Website:**
- Optional
- Valid URL format if provided
- Must start with http:// or https://

**Brand Color:**
- Optional
- Must be valid hex color (#RRGGBB format)
- Default: #06b6d4 (cyan)

**Google Drive URL:**
- Optional
- Valid URL format
- Extract folder ID if full URL provided

### 9.2 Server-Side Validation

All validations enforced via Zod schemas in tRPC procedures (see Backend Requirements).

**Additional Checks:**
- Tenant isolation: All queries filtered by `tenantId`
- Client exists check on updates
- Email uniqueness per tenant (optional - discuss with user)

---

## 10. UI/UX Specifications

### 10.1 Color Palette

**Brand Color (Green):**
- Primary: `#10b981` (green-500)
- Light: `#34d399` (green-400)
- Dark: `#059669` (green-600)
- Backgrounds: `bg-green-500/10`, `bg-green-500/20`

**Status Colors:**
- Active: Green (`text-green-300`, `bg-green-500/20`)
- Inactive: Gray (`text-slate-400`, `bg-slate-600/20`)
- Blacklisted: Red (`text-red-300`, `bg-red-500/20`)

**Backgrounds:**
- Page: `bg-slate-950`
- Cards: `bg-slate-900/60`
- Inputs: `bg-slate-800`
- Borders: `border-slate-700`

### 10.2 Typography

**Headings:**
- Page title: `text-3xl font-bold`
- Section headings: `text-lg font-bold text-white`
- Labels: `text-sm font-semibold text-slate-300`

**Body:**
- Primary text: `text-white` or `text-slate-200`
- Secondary text: `text-slate-400`
- Placeholder: `text-slate-500`

### 10.3 Spacing

- Page padding: `px-8 py-6`
- Section margins: `mb-6`
- Grid gaps: `gap-4`
- Button padding: `px-4 py-2` (small), `px-5 py-3` (large)

### 10.4 Animations

**Hover States:**
- Table rows: `hover:bg-green-500/5 transition-colors`
- Buttons: `hover:from-green-400 hover:to-green-500 transition-all`

**Loading States:**
- Button: Show "Creating...", "Saving...", or "Loading..."
- Disabled state: `opacity-50 cursor-not-allowed`

**Status Indicators:**
- Autosave: Fade in/out with 2-second delay

### 10.5 Responsive Behavior

**Modal Widths:**
- Desktop: `60vw`
- Tablet: `80vw`
- Mobile: `95vw`

**Table:**
- Horizontal scroll on small screens
- Fixed column headers

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Update sidebar navigation with Clients link
- [ ] Create `/clients` route and page file
- [ ] Add clients page structure (header, filters, table container)
- [ ] Implement table with sortable headers
- [ ] Add search and filter functionality

### Phase 2: Add Client
- [ ] Create AddClientModal component
- [ ] Implement form with validation
- [ ] Wire up client.create mutation
- [ ] Test form submission and error handling

### Phase 3: Client Detail
- [ ] Create ClientDetailModal component
- [ ] Implement contact info section with edit mode
- [ ] Add key metrics cards
- [ ] Build linked events section
- [ ] Build linked deliverables section
- [ ] Add communication history section
- [ ] Implement Google Drive link section
- [ ] Add notes section with autosave

### Phase 4: Backend
- [ ] Enhance client.list query with filters and last contacted
- [ ] Enhance client.getById with all relations
- [ ] Add client.updateStatus mutation
- [ ] Add client.getIndustries query
- [ ] Test all mutations and queries

### Phase 5: Polish
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test all user flows
- [ ] Verify responsive behavior
- [ ] Build and deploy

---

**End of Specification**
