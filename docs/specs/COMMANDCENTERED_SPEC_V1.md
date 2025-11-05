# CommandCentered - Complete Specification v1.0

**Version:** 1.0.0
**Date:** 2025-11-05
**Status:** ✅ FINALIZED - Ready for Implementation
**Target Launch:** January 2025 (Before Feb-June event season)

**All decisions made. Spec locked. Implementation can begin.**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Core Concepts](#2-core-concepts)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Data Model](#4-data-model)
5. [Business Logic & Workflows](#5-business-logic--workflows)
6. [Validation Rules](#6-validation-rules)
7. [State Machines](#7-state-machines)
8. [Conflict Detection & Resolution](#8-conflict-detection--resolution)
9. [Email & Communications](#9-email--communications)
10. [UI/UX Requirements](#10-uiux-requirements)
11. [Technical Architecture](#11-technical-architecture)
12. [Security & Multi-Tenancy](#12-security--multi-tenancy)
13. [Testing Strategy](#13-testing-strategy)
14. [Implementation Phases](#14-implementation-phases)
15. [Open Questions](#15-open-questions)

---

## 1. Executive Summary

### 1.1 Purpose

CommandCentered is a **logistics command center for videography businesses** managing complex multi-event operations. It solves the problem of coordinating operators, equipment, and vehicles across simultaneous events through visual scheduling, automated conflict detection, and streamlined communication.

### 1.2 Key Problems Solved

1. **Scheduling Chaos** - Manual checklists and spreadsheets for 5-6 operators across multiple daily events
2. **Equipment Conflicts** - Double-booking cameras, lenses, audio gear across simultaneous jobs
3. **Communication Overhead** - Manually creating schedules, packing lists, and operator emails
4. **Vehicle Logistics** - Tracking what gear is in which vehicle for which event
5. **Operator Management** - Tracking skills, rates, availability, and blackout dates

### 1.3 Core Value Propositions

- **Visual drag-and-drop** operator and equipment assignment
- **Automatic conflict detection** (operators, equipment, vehicles)
- **One-click schedule generation** (PDF + HTML email with .ics calendar)
- **Mobile-friendly checklists** for packing and event-day operations
- **Multi-tenant SaaS** architecture for future commercialization

### 1.4 Business Context

- **Primary User:** Videography business owner (you)
- **Event Types:** Dance competitions, recitals, concerts, youth plays
- **Scale:** 5-6 operators, ~50 pieces of equipment, 2 vehicles
- **Timeline:** Multiple events per day during Feb-June season
- **Future:** White-label SaaS for other videography businesses

---

## 2. Core Concepts

### 2.1 Tenant

**Definition:** A videography business using CommandCentered (isolated data environment)

**Properties:**
- Company name
- Owner contact info
- Branding (logo, colors) [FUTURE]
- Subscription status [FUTURE]

**Rules:**
- All data (events, operators, equipment) scoped to tenant
- Complete data isolation between tenants
- RLS enforced at database level

### 2.2 Event

**Definition:** A confirmed videography job with specific date, venue, and requirements

**Properties:**
- Event name
- Event type (dance competition, recital, concert, play, other)
- Venue (name, address, parking instructions)
- Client contact info
- Date and times:
  - Load-in time
  - Event start time
  - Event end time
  - Load-out complete time
- Revenue (optional)
- Special notes/requirements
- Status (confirmed → scheduled → in_progress → completed → archived → cancelled)

**Rules:**
- Events are CONFIRMED bookings (not pipeline/prospects)
- Events can have multiple operators with different roles
- Events can have overlapping times (multiple simultaneous events allowed)
- Events can be edited after confirmation (may trigger conflict warnings)

### 2.3 Operator

**Definition:** A person who works videography events (camera op, audio tech, etc.)

**Properties:**
- Name
- Email
- Phone
- Hourly rate (USD)
- Skills (1-10 scale):
  - Camera skill
  - Directing skill
  - Overall skill (reliability, punctuality, client interaction)
- Avatar [FUTURE: gamified animated avatar]
- Blackout dates (unavailable periods)
- Status (active, inactive)

**Rules:**
- Operators can work multiple roles at same event
- Operators can be assigned to multiple events IF no time conflicts
- System warns if operator assigned during blackout date
- Each operator assignment tracks: role, estimated hours, calculated pay

### 2.4 Equipment

**Definition:** Physical gear used at events (cameras, lenses, audio, lighting, etc.)

**Properties:**
- Name (e.g., "Sony A7SIII Body 1")
- Category (camera, lens, audio, lighting, rigging, laptop, tripod, other)
- Type (e.g., "Camera Body", "24-70mm Lens")
- Status (available, assigned, needs_repair, out_of_service)
- Current location (tracked via equipment_location_history table)
- Tags/Kits (e.g., "Kit A", "Backup", "Primary") - for grouping and quick assignment

**Rules:**
- Equipment can only be assigned to ONE event at a time
- System warns if equipment double-booked across overlapping events
- Equipment marked "needs_repair" or "out_of_service" cannot be assigned
- Equipment auto-returns to "available" when event marked completed
- Location history tracks movements: "In Shop" → "Loaded in Van A" → "At Event X" → "Returned to Shop"
- Tags enable quick kit assignment (assign all items tagged "Kit A" to event at once)

### 2.5 Vehicle

**Definition:** A company vehicle used to transport equipment to events

**Properties:**
- Name (e.g., "Van A", "Truck B")
- Type (van, truck, car, etc.)
- Capacity notes (optional text description)
- Status (active, inactive)

**Rules:**
- Vehicle can be assigned to multiple events IF no time conflicts
- System warns if vehicle double-booked
- Track which equipment is in which vehicle for each event via equipment_assignments.vehicle_id
- Separate from operator personal vehicles (tracked in operators table)

### 2.5.1 Operator Transportation

**Definition:** Tracking which operators have vehicles and who needs rides

**Properties (on Operator):**
- Has vehicle (boolean)
- Vehicle description (optional, e.g., "Honda Civic, Blue")
- Home address (for ride coordination)

**Rules:**
- Operators with vehicles can drive themselves
- Operators without vehicles need ride coordination
- System shows which operators need rides per event
- Owner can assign operators to ride together based on addresses/locations

### 2.6 Assignment (Operator-to-Event)

**Definition:** Links an operator to an event with specific role and compensation

**Properties:**
- Operator
- Event
- Role (e.g., "Camera Op", "Audio Tech", "Director")
- Estimated hours
- Actual hours (entered after event completion)
- Calculated pay (hours × operator's hourly rate)
- Overtime hours (actual_hours - estimated_hours, if positive)
- Status (assigned, confirmed, completed)
- Needs ride (boolean - auto-set based on operator.has_vehicle)
- Ride provider (optional link to another operator who will drive them)

**Rules:**
- Estimated hours calculated from event load_in_time to load_out_time
- Actual hours entered manually after event completes
- Overtime tracked for payroll purposes
- If operator has_vehicle = false, assignment flagged as "needs ride"

### 2.7 Equipment Assignment (Equipment-to-Event)

**Definition:** Links equipment to an event (creates packing list)

**Properties:**
- Equipment
- Event
- Vehicle (which vehicle will transport this item)
- Pack status (needs_packing, packed, at_event, returned)

### 2.8 Packing List

**Definition:** Collection of equipment assigned to an event, organized by vehicle

**Generated From:** All equipment assignments for an event

**Properties:**
- Event
- Equipment items (grouped by vehicle)
- Pack status per item

---

## 3. User Roles & Permissions

### 3.1 Super Admin (System Owner - You)

**Description:** Platform owner, full system access

**Permissions:**
- Manage tenants (create, edit, delete)
- Access all tenant data (for support)
- System configuration
- View analytics across all tenants [FUTURE]

**Access:** Super admin dashboard

### 3.2 Tenant Owner (Videography Business Owner)

**Description:** Primary user managing their business operations

**Permissions:**
- Full access to their tenant's data
- Create/edit/delete events
- Create/edit/delete operators
- Create/edit/delete equipment
- Create/edit/delete vehicles
- Assign operators to events
- Assign equipment to events
- Generate and send schedules
- View all reports and analytics
- Manage tenant settings

**Access:** Full dashboard

### 3.3 Operator (View-Only via Public Link) [FUTURE]

**Description:** Videography crew member receiving assignments

**Permissions:**
- View their own schedule (public link, no login)
- View event details for their assignments
- View equipment list for their events
- Mobile checklist view

**Access:** Public schedule link (e.g., `/schedule/[unique-token]`)

**MVP Decision:** Not implementing operator login for v1. Owner manually sends emails with details.

---

## 4. Data Model

### 4.1 Database Schema (PostgreSQL via Supabase)

#### 4.1.1 tenants
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  company_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT,

  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),

  -- Future: branding, subscription info

  CONSTRAINT tenants_owner_email_unique UNIQUE (owner_email)
);

-- RLS Policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Super admins see all tenants
CREATE POLICY "super_admins_all_tenants" ON tenants
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

-- Tenant owners see only their tenant
CREATE POLICY "tenant_owners_own_tenant" ON tenants
  FOR SELECT USING (id = (auth.jwt() ->> 'tenant_id')::uuid);
```

#### 4.1.2 users (Supabase auth.users extended)
```sql
-- Stored in auth.users, extended with profile
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  role TEXT NOT NULL CHECK (role IN ('super_admin', 'tenant_owner')),

  full_name TEXT NOT NULL,
  phone TEXT,

  CONSTRAINT user_profiles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_profile" ON user_profiles
  FOR ALL USING (id = auth.uid());

CREATE POLICY "super_admins_all_profiles" ON user_profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');
```

#### 4.1.3 events
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('dance_competition', 'recital', 'concert', 'play', 'other')),

  -- Venue details
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  parking_instructions TEXT,

  -- Client info
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,

  -- Timing
  load_in_time TIMESTAMPTZ NOT NULL,
  event_start_time TIMESTAMPTZ NOT NULL,
  event_end_time TIMESTAMPTZ NOT NULL,
  load_out_time TIMESTAMPTZ NOT NULL,

  -- Financial
  revenue_amount DECIMAL(10,2), -- Optional

  -- Notes
  special_notes TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'scheduled', 'in_progress', 'completed', 'archived', 'cancelled')),

  -- Constraints
  CONSTRAINT events_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT events_times_logical CHECK (
    load_in_time <= event_start_time AND
    event_start_time <= event_end_time AND
    event_end_time <= load_out_time
  )
);

-- Indexes
CREATE INDEX events_tenant_id_idx ON events(tenant_id);
CREATE INDEX events_status_idx ON events(status);
CREATE INDEX events_load_in_time_idx ON events(load_in_time);
CREATE INDEX events_event_type_idx ON events(event_type);

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_events" ON events
  FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "super_admin_all_events" ON events
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');
```

#### 4.1.4 operators
```sql
CREATE TABLE operators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  hourly_rate DECIMAL(10,2) NOT NULL,

  -- Skills (1-10)
  camera_skill INTEGER NOT NULL DEFAULT 5 CHECK (camera_skill >= 1 AND camera_skill <= 10),
  directing_skill INTEGER NOT NULL DEFAULT 5 CHECK (directing_skill >= 1 AND directing_skill <= 10),
  overall_skill INTEGER NOT NULL DEFAULT 5 CHECK (overall_skill >= 1 AND overall_skill <= 10), -- Reliability, punctuality, client interaction

  -- Transportation
  has_vehicle BOOLEAN NOT NULL DEFAULT false,
  vehicle_description TEXT, -- e.g., "Honda Civic, Blue"
  home_address TEXT, -- For ride coordination

  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

  CONSTRAINT operators_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT operators_tenant_email_unique UNIQUE (tenant_id, email)
);

-- Indexes
CREATE INDEX operators_tenant_id_idx ON operators(tenant_id);
CREATE INDEX operators_status_idx ON operators(status);
CREATE INDEX operators_has_vehicle_idx ON operators(has_vehicle);

-- RLS
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_operators" ON operators
  FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "super_admin_all_operators" ON operators
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');
```

#### 4.1.5 operator_blackout_dates
```sql
CREATE TABLE operator_blackout_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,

  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,

  reason TEXT,

  CONSTRAINT blackout_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT blackout_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES operators(id),
  CONSTRAINT blackout_dates_logical CHECK (start_date <= end_date)
);

-- Indexes
CREATE INDEX blackout_tenant_id_idx ON operator_blackout_dates(tenant_id);
CREATE INDEX blackout_operator_id_idx ON operator_blackout_dates(operator_id);
CREATE INDEX blackout_dates_idx ON operator_blackout_dates(start_date, end_date);

-- RLS
ALTER TABLE operator_blackout_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_blackouts" ON operator_blackout_dates
  FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
```

#### 4.1.6 operator_assignments (Operator-to-Event)
```sql
CREATE TABLE operator_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,

  role TEXT NOT NULL, -- e.g., "Camera Op", "Audio Tech", "Director"

  -- Time tracking
  estimated_hours DECIMAL(5,2) NOT NULL,
  actual_hours DECIMAL(5,2), -- Entered after event completion
  overtime_hours DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN actual_hours IS NOT NULL AND actual_hours > estimated_hours
    THEN actual_hours - estimated_hours
    ELSE 0 END
  ) STORED,

  calculated_pay DECIMAL(10,2) NOT NULL, -- Auto-calculated: estimated_hours * operator.hourly_rate

  -- Transportation
  needs_ride BOOLEAN NOT NULL DEFAULT false, -- Auto-set based on operator.has_vehicle
  ride_provider_id UUID REFERENCES operators(id) ON DELETE SET NULL, -- Which operator will give them a ride

  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'completed', 'cancelled')),

  notes TEXT,

  CONSTRAINT assignments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT assignments_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id),
  CONSTRAINT assignments_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES operators(id),
  CONSTRAINT assignments_ride_provider_fkey FOREIGN KEY (ride_provider_id) REFERENCES operators(id)
);

-- Indexes
CREATE INDEX assignments_tenant_id_idx ON operator_assignments(tenant_id);
CREATE INDEX assignments_event_id_idx ON operator_assignments(event_id);
CREATE INDEX assignments_operator_id_idx ON operator_assignments(operator_id);
CREATE INDEX assignments_status_idx ON operator_assignments(status);
CREATE INDEX assignments_needs_ride_idx ON operator_assignments(needs_ride);

-- RLS
ALTER TABLE operator_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_assignments" ON operator_assignments
  FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
```

#### 4.1.7 equipment
```sql
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  name TEXT NOT NULL, -- e.g., "Sony A7SIII Body 1"
  category TEXT NOT NULL CHECK (category IN ('camera', 'lens', 'audio', 'lighting', 'rigging', 'laptop', 'tripod', 'other')),
  type TEXT NOT NULL, -- e.g., "Camera Body", "24-70mm Lens"

  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'needs_repair', 'out_of_service')),

  -- Current location (denormalized for quick access, source of truth is location_history)
  current_location TEXT DEFAULT 'In Shop', -- e.g., "Van A", "In Shop", "At Event X"

  -- Tags for kits/grouping (enables quick "assign Kit A" functionality)
  tags TEXT[], -- e.g., ["Kit A", "Primary", "Backup"]

  notes TEXT,

  CONSTRAINT equipment_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Indexes
CREATE INDEX equipment_tenant_id_idx ON equipment(tenant_id);
CREATE INDEX equipment_category_idx ON equipment(category);
CREATE INDEX equipment_status_idx ON equipment(status);
CREATE INDEX equipment_tags_idx ON equipment USING GIN(tags);

-- RLS
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_equipment" ON equipment
  FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
```

#### 4.1.7a equipment_location_history
```sql
CREATE TABLE equipment_location_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,

  location TEXT NOT NULL, -- "In Shop", "Loaded in Van A", "At Event X", "Returned to Shop"
  event_id UUID REFERENCES events(id) ON DELETE SET NULL, -- Optional link to event if relevant

  notes TEXT,

  CONSTRAINT location_history_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT location_history_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  CONSTRAINT location_history_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Indexes
CREATE INDEX location_history_tenant_id_idx ON equipment_location_history(tenant_id);
CREATE INDEX location_history_equipment_id_idx ON equipment_location_history(equipment_id);
CREATE INDEX location_history_created_at_idx ON equipment_location_history(created_at DESC);

-- RLS
ALTER TABLE equipment_location_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_location_history" ON equipment_location_history
  FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
```

#### 4.1.8 vehicles
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  name TEXT NOT NULL, -- e.g., "Van A", "Truck B"
  type TEXT, -- e.g., "van", "truck", "car"
  capacity_notes TEXT, -- Optional description of capacity/features

  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

  notes TEXT,

  CONSTRAINT vehicles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Indexes
CREATE INDEX vehicles_tenant_id_idx ON vehicles(tenant_id);
CREATE INDEX vehicles_status_idx ON vehicles(status);

-- RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_vehicles" ON vehicles
  FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
```

#### 4.1.9 equipment_assignments (Equipment-to-Event)
```sql
CREATE TABLE equipment_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL, -- Which vehicle transports this item

  pack_status TEXT NOT NULL DEFAULT 'needs_packing' CHECK (pack_status IN ('needs_packing', 'packed', 'at_event', 'returned')),

  notes TEXT,

  CONSTRAINT eq_assignments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT eq_assignments_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id),
  CONSTRAINT eq_assignments_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  CONSTRAINT eq_assignments_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),

  -- Prevent duplicate assignments of same equipment to same event
  CONSTRAINT eq_assignments_event_equipment_unique UNIQUE (event_id, equipment_id)
);

-- Indexes
CREATE INDEX eq_assignments_tenant_id_idx ON equipment_assignments(tenant_id);
CREATE INDEX eq_assignments_event_id_idx ON equipment_assignments(event_id);
CREATE INDEX eq_assignments_equipment_id_idx ON equipment_assignments(equipment_id);
CREATE INDEX eq_assignments_vehicle_id_idx ON equipment_assignments(vehicle_id);
CREATE INDEX eq_assignments_pack_status_idx ON equipment_assignments(pack_status);

-- RLS
ALTER TABLE equipment_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_eq_assignments" ON equipment_assignments
  FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
```

#### 4.1.10 event_equipment_templates
```sql
-- Store template equipment lists for different event types
CREATE TABLE event_equipment_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  name TEXT NOT NULL, -- e.g., "Dance Competition Standard", "Recital Package"
  event_type TEXT NOT NULL CHECK (event_type IN ('dance_competition', 'recital', 'concert', 'play', 'other')),

  equipment_tags TEXT[], -- Tags to auto-assign (e.g., ["Kit A", "Audio Standard"])
  equipment_ids UUID[], -- Specific equipment IDs to suggest

  notes TEXT,

  CONSTRAINT templates_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Indexes
CREATE INDEX templates_tenant_id_idx ON event_equipment_templates(tenant_id);
CREATE INDEX templates_event_type_idx ON event_equipment_templates(event_type);

-- RLS
ALTER TABLE event_equipment_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_templates" ON event_equipment_templates
  FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
```

### 4.2 Data Relationships Summary

```
tenants (1) ──< (many) events
tenants (1) ──< (many) operators
tenants (1) ──< (many) equipment
tenants (1) ──< (many) vehicles
tenants (1) ──< (many) user_profiles
tenants (1) ──< (many) event_equipment_templates

operators (1) ──< (many) operator_blackout_dates
operators (1) ──< (many) operator_assignments ──> (1) events
operator_assignments (many) ──> (1) operators [ride_provider]

equipment (1) ──< (many) equipment_location_history
equipment (1) ──< (many) equipment_assignments ──> (1) events
equipment_assignments (many) ──> (1) vehicles [optional]

events (1) ──< (many) operator_assignments
events (1) ──< (many) equipment_assignments
```

### 4.3 Computed Fields (Not Stored)

**Event Computed Fields:**
- `total_operator_cost`: SUM(operator_assignments.calculated_pay) WHERE event_id = event.id
- `total_actual_cost`: SUM(operator_assignments.actual_hours * operator.hourly_rate) WHERE actual_hours IS NOT NULL
- `total_overtime_hours`: SUM(operator_assignments.overtime_hours) WHERE event_id = event.id
- `profit_margin`: event.revenue_amount - total_operator_cost
- `operator_count`: COUNT(operator_assignments) WHERE event_id = event.id
- `equipment_count`: COUNT(equipment_assignments) WHERE event_id = event.id
- `operators_needing_rides`: COUNT(operator_assignments WHERE needs_ride = true)
- `has_conflicts`: Boolean (check conflict detection rules)

**Operator Computed Fields:**
- `total_events_this_month`: COUNT(operator_assignments) WHERE operator_id = operator.id AND month = current_month
- `total_estimated_hours_this_month`: SUM(operator_assignments.estimated_hours) WHERE operator_id = operator.id AND month = current_month
- `total_actual_hours_this_month`: SUM(operator_assignments.actual_hours) WHERE operator_id = operator.id AND month = current_month
- `total_overtime_hours_this_month`: SUM(operator_assignments.overtime_hours) WHERE operator_id = operator.id AND month = current_month
- `total_earnings_this_month`: SUM(operator_assignments.calculated_pay) WHERE operator_id = operator.id AND month = current_month

**Equipment Computed Fields:**
- `utilization_rate`: (Days assigned) / (Total days) over time period
- `current_event`: Event currently assigned to (if status = 'assigned')
- `location_history`: Query equipment_location_history for movement tracking

---

## 5. Business Logic & Workflows

### 5.1 Event Creation Workflow

**Trigger:** User creates new event

**Steps:**
1. Validate all required fields present
2. Validate time logic: load_in <= event_start <= event_end <= load_out
3. Set status = 'confirmed'
4. Calculate event duration (load_in to load_out)
5. Create event record
6. Return event with conflict warnings (if any overlapping events exist)

**Outcome:** Event created, ready for operator/equipment assignment

### 5.2 Operator Assignment Workflow

**Trigger:** User drags operator onto event (or manually assigns)

**Steps:**
1. Check if operator status = 'active'
2. Check operator blackout dates:
   - Query: Does operator have blackout date overlapping event?
   - If YES: Return WARNING (allow override)
3. Check operator time conflicts:
   - Query: Does operator have existing assignment with overlapping times?
   - If YES: Return WARNING (allow override)
4. Calculate estimated_hours:
   - Default: (event.load_out_time - event.load_in_time) in hours
   - Allow manual override
5. Calculate calculated_pay:
   - Formula: estimated_hours × operator.hourly_rate
6. Prompt for role (e.g., "Camera Op", "Audio Tech")
7. Create operator_assignment record
8. Update event.status to 'scheduled' if first operator assigned
9. Return success with assignment details

**Outcome:** Operator assigned to event with role and calculated pay

### 5.3 Equipment Assignment Workflow

**Trigger:** User assigns equipment to event

**Steps:**
1. Check if equipment status IN ('available', 'assigned')
   - If 'needs_repair' or 'out_of_service': Block with error
2. Check equipment time conflicts:
   - Query: Is equipment assigned to another event with overlapping times?
   - If YES: Return WARNING (allow override with confirmation)
3. Prompt for vehicle (optional): Which vehicle will transport this?
4. Create equipment_assignment record with pack_status = 'needs_packing'
5. Update equipment.status = 'assigned'
6. Update equipment.current_location = "Assigned to [Event Name]"
7. Return success

**Outcome:** Equipment added to event's packing list

### 5.4 Packing List Generation Workflow

**Trigger:** User views packing list for event

**Steps:**
1. Query all equipment_assignments WHERE event_id = event.id
2. Include related equipment details (name, category, type)
3. Group by vehicle_id
4. Show pack_status for each item
5. Allow bulk status updates:
   - Mark all as 'packed'
   - Mark all as 'at_event'
   - Mark all as 'returned'

**Outcome:** Organized packing list by vehicle with status tracking

### 5.5 Schedule Email Generation Workflow

**Trigger:** User clicks "Send Schedule" for operator

**Steps:**
1. Gather operator's assigned events (filter by date range if specified)
2. For each event, gather:
   - Event details (name, type, venue, address, parking)
   - Times (load-in, event start/end, load-out)
   - Operator's role
   - Operator's estimated hours and pay
   - Other operators assigned to same event
   - Equipment list for event
   - Special notes
3. Generate HTML email with:
   - Professional layout
   - Calendar view of events
   - Detailed breakdown per event
   - Contact info
4. Generate .ics calendar file for all events
5. Show email preview to user
6. On user confirmation:
   - Send email via email service (SendGrid/Resend/etc.)
   - Log email sent (audit trail)
7. Return success/failure

**Outcome:** Operator receives comprehensive schedule via email with calendar attachment

### 5.6 Event Completion Workflow

**Trigger:** User marks event as 'completed'

**Steps:**
1. Validate event status = 'in_progress' (must be started first)
2. Update event.status = 'completed'
3. Update all operator_assignments.status = 'completed' for this event
4. Update all equipment_assignments.pack_status = 'returned'
5. Update all equipment.status = 'available' for equipment assigned to this event
6. Update equipment.current_location = "In Shop" or previous location
7. Calculate actual operator costs (if actual hours tracked vs. estimated)
8. Return success

**Outcome:** Event marked complete, equipment returned to available pool

### 5.7 Conflict Detection Workflow

**Trigger:** Any assignment (operator or equipment) to event

**Steps:**

**Operator Conflicts:**
1. Query operator_assignments WHERE operator_id = target_operator
2. For each existing assignment:
   - Get event times (load_in to load_out)
   - Check if overlaps with new event times
   - If overlap: Add to conflicts list
3. Query operator_blackout_dates WHERE operator_id = target_operator
4. For each blackout:
   - Check if new event times fall within blackout period
   - If overlap: Add to conflicts list

**Equipment Conflicts:**
1. Query equipment_assignments WHERE equipment_id = target_equipment
2. For each existing assignment:
   - Get event times (load_in to load_out)
   - Check if overlaps with new event times
   - If overlap: Add to conflicts list

**Vehicle Conflicts:**
1. Query equipment_assignments WHERE vehicle_id = target_vehicle
2. Get all events associated with those equipment assignments
3. Check if any event times overlap with new event times
4. If overlap: Add to conflicts list

**Outcome:** Return list of conflicts with details:
```typescript
{
  operator_conflicts: [
    { operator_id, operator_name, conflicting_event_id, conflicting_event_name, times }
  ],
  equipment_conflicts: [
    { equipment_id, equipment_name, conflicting_event_id, conflicting_event_name, times }
  ],
  vehicle_conflicts: [
    { vehicle_id, vehicle_name, conflicting_event_id, conflicting_event_name, times }
  ],
  blackout_conflicts: [
    { operator_id, operator_name, blackout_start, blackout_end, reason }
  ]
}
```

---

## 6. Validation Rules

### 6.1 Event Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| event_name | Required, min 3 chars | "Event name must be at least 3 characters" |
| event_type | Required, enum | "Event type must be one of: dance_competition, recital, concert, play, other" |
| venue_name | Required | "Venue name is required" |
| venue_address | Required | "Venue address is required" |
| load_in_time | Required, valid timestamp | "Load-in time is required" |
| event_start_time | Required, >= load_in_time | "Event start must be after or equal to load-in time" |
| event_end_time | Required, >= event_start_time | "Event end must be after or equal to start time" |
| load_out_time | Required, >= event_end_time | "Load-out time must be after or equal to event end" |
| revenue_amount | Optional, >= 0 | "Revenue must be a positive number" |

### 6.2 Operator Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| name | Required, min 2 chars | "Operator name must be at least 2 characters" |
| email | Required, valid email format | "Valid email address required" |
| hourly_rate | Required, > 0 | "Hourly rate must be greater than 0" |
| camera_skill | Integer 1-10 | "Camera skill must be between 1 and 10" |
| directing_skill | Integer 1-10 | "Directing skill must be between 1 and 10" |
| overall_skill | Integer 1-10 | "Overall skill must be between 1 and 10" |

### 6.3 Equipment Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| name | Required, min 2 chars | "Equipment name must be at least 2 characters" |
| category | Required, enum | "Category must be one of: camera, lens, audio, lighting, rigging, laptop, tripod, other" |
| type | Required | "Equipment type is required" |

### 6.4 Assignment Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| operator_id | Required, exists in operators | "Invalid operator" |
| event_id | Required, exists in events | "Invalid event" |
| role | Required, min 2 chars | "Role is required" |
| estimated_hours | Required, > 0, <= 24 | "Estimated hours must be between 0 and 24" |

### 6.5 Business Rule Validation

| Rule | Check | Action |
|------|-------|--------|
| No inactive operators | operator.status = 'active' | Block assignment with error |
| No broken equipment | equipment.status NOT IN ('needs_repair', 'out_of_service') | Block assignment with error |
| Operator conflict | Overlapping event times | WARN (allow override) |
| Equipment conflict | Overlapping event times | WARN (allow override) |
| Vehicle conflict | Overlapping event times | WARN (allow override) |
| Blackout date | Event falls in blackout period | WARN (allow override) |

---

## 7. State Machines

### 7.1 Event Status State Machine

```
[Create Event]
     ↓
  confirmed → (assign operators) → scheduled → (mark started) → in_progress → (mark completed) → completed → (archive) → archived
     ↓                                                                                                           ↓
     └──────────────────────────────────────────────────────> cancelled <──────────────────────────────────────┘
```

**Valid Transitions:**
- `confirmed → scheduled` (when first operator assigned)
- `confirmed → cancelled` (cancel before scheduling)
- `scheduled → in_progress` (event day starts)
- `scheduled → cancelled` (cancel scheduled event)
- `in_progress → completed` (event ends successfully)
- `in_progress → cancelled` (event cancelled mid-progress - rare)
- `completed → archived` (archive old events)

**Invalid Transitions:**
- `completed → scheduled` (cannot un-complete)
- `cancelled → scheduled` (cannot un-cancel)
- `archived → *` (archived is terminal state)

### 7.2 Operator Assignment Status State Machine

```
[Assign Operator]
     ↓
  assigned → (user confirms) → confirmed → (event completes) → completed
     ↓                             ↓
     └─────────────────────────────┴──────────────────────────> cancelled
```

**Valid Transitions:**
- `assigned → confirmed` (user confirms assignment)
- `assigned → cancelled` (user removes operator before confirmation)
- `confirmed → completed` (event completes)
- `confirmed → cancelled` (operator removed or event cancelled)

### 7.3 Equipment Pack Status State Machine

```
[Assign Equipment to Event]
     ↓
needs_packing → (mark packed) → packed → (arrive at venue) → at_event → (return to shop) → returned
     ↓                            ↓            ↓                  ↓
     └────────────────────────────┴────────────┴──────────────────┴───────────> [Remove from event]
```

**Valid Transitions:**
- `needs_packing → packed` (equipment packed in vehicle)
- `packed → at_event` (vehicle arrives at venue)
- `at_event → returned` (equipment returned to shop)
- Any status → removed (user unassigns equipment from event)

### 7.4 Equipment Status State Machine

```
[Create Equipment]
     ↓
  available → (assign to event) → assigned → (event completes) → available
     ↓                               ↓
     ├───────────────────────────────┴──────────────────────────> needs_repair → (mark repaired) → available
     └────────────────────────────────────────────────────────> out_of_service → (restore) → available
```

**Valid Transitions:**
- `available → assigned` (assigned to event)
- `assigned → available` (event completes or equipment unassigned)
- `available → needs_repair` (mark for repair)
- `assigned → needs_repair` (issue found during event - rare)
- `needs_repair → available` (repair complete)
- `available → out_of_service` (retire equipment)
- `out_of_service → available` (bring back into service)

---

## 8. Conflict Detection & Resolution

### 8.1 Conflict Types

**Type 1: Operator Time Conflict**
- **Condition:** Operator assigned to Event A (12pm-4pm) and Event B (2pm-6pm)
- **Detection:** Query overlapping time ranges for same operator
- **Resolution:** WARN user, allow override with confirmation

**Type 2: Equipment Double-Booking**
- **Condition:** Camera 1 assigned to Event A (12pm-4pm) and Event B (2pm-6pm)
- **Detection:** Query overlapping time ranges for same equipment
- **Resolution:** WARN user, block unless user confirms "I have backup"

**Type 3: Vehicle Conflict**
- **Condition:** Van A transporting gear to Event A (12pm-4pm) and Event B (2pm-6pm)
- **Detection:** Query overlapping time ranges for same vehicle
- **Resolution:** WARN user, suggest splitting load across vehicles

**Type 4: Operator Blackout Date**
- **Condition:** Operator requested off June 15-20, assigned to event June 18
- **Detection:** Query blackout_dates table for date overlap
- **Resolution:** WARN user, block unless user confirms "Emergency override"

### 8.2 Conflict Detection Query

**Pseudocode for Operator Time Conflict:**
```sql
-- Check if operator has overlapping assignments
SELECT oa.id, e.event_name, e.load_in_time, e.load_out_time
FROM operator_assignments oa
JOIN events e ON oa.event_id = e.id
WHERE oa.operator_id = :target_operator_id
  AND oa.status != 'cancelled'
  AND e.status NOT IN ('cancelled', 'completed', 'archived')
  AND (
    -- New event overlaps existing event
    (:new_load_in, :new_load_out) OVERLAPS (e.load_in_time, e.load_out_time)
  );
```

**Pseudocode for Equipment Conflict:**
```sql
-- Check if equipment has overlapping assignments
SELECT ea.id, e.event_name, e.load_in_time, e.load_out_time
FROM equipment_assignments ea
JOIN events e ON ea.event_id = e.id
WHERE ea.equipment_id = :target_equipment_id
  AND e.status NOT IN ('cancelled', 'completed', 'archived')
  AND (
    (:new_load_in, :new_load_out) OVERLAPS (e.load_in_time, e.load_out_time)
  );
```

### 8.3 Conflict Resolution UI Flow

1. **User attempts assignment** (drag operator/equipment to event)
2. **System runs conflict detection** (queries above)
3. **If conflicts found:**
   - Show modal with conflict details:
     - "⚠️ Conflict Detected"
     - List each conflict with times and event names
     - Show conflict type (time overlap, blackout, double-booking)
   - Options:
     - "Cancel" (abort assignment)
     - "Override" (confirm assignment despite conflict) [requires confirmation checkbox]
4. **If no conflicts:**
   - Proceed with assignment
   - Show success message

---

## 9. Email & Communications

### 9.1 Operator Schedule Email

**Trigger:** User clicks "Send Schedule to [Operator]"

**Email Structure:**

**Subject:** `Your Schedule for [Date Range] - [Company Name]`

**Body (HTML):**
```html
<h1>Hi [Operator Name],</h1>

<p>Here's your upcoming schedule for [Date Range]:</p>

<h2>Events Summary</h2>
<ul>
  <li>[Event 1 Name] - [Date] at [Venue]</li>
  <li>[Event 2 Name] - [Date] at [Venue]</li>
</ul>

<h2>Event Details</h2>

<!-- For each event -->
<div style="border: 1px solid #ccc; padding: 20px; margin-bottom: 20px;">
  <h3>[Event Name]</h3>
  <p><strong>Type:</strong> [Event Type]</p>
  <p><strong>Date:</strong> [Date]</p>

  <h4>Timeline</h4>
  <ul>
    <li><strong>Load-In:</strong> [Load-in time]</li>
    <li><strong>Event Start:</strong> [Event start time]</li>
    <li><strong>Event End:</strong> [Event end time]</li>
    <li><strong>Load-Out Complete:</strong> [Load-out time]</li>
  </ul>

  <h4>Venue</h4>
  <p><strong>Name:</strong> [Venue name]</p>
  <p><strong>Address:</strong> [Venue address]</p>
  <p><strong>Parking:</strong> [Parking instructions]</p>

  <h4>Your Assignment</h4>
  <p><strong>Role:</strong> [Role]</p>
  <p><strong>Estimated Hours:</strong> [Hours]</p>
  <p><strong>Pay:</strong> $[Calculated pay]</p>

  <h4>Team</h4>
  <ul>
    <li>[Operator 1] - [Role]</li>
    <li>[Operator 2] - [Role]</li>
  </ul>

  <h4>Equipment</h4>
  <ul>
    <li>[Equipment 1]</li>
    <li>[Equipment 2]</li>
  </ul>

  <h4>Special Notes</h4>
  <p>[Special notes]</p>
</div>

<hr>

<p><strong>Questions?</strong> Contact [Your name] at [Your email] or [Your phone]</p>

<p style="font-size: 12px; color: #666;">
  Calendar files attached - click to add to your calendar!
</p>
```

**Attachments:**
- `.ics` calendar file for each event (importable to Google Calendar, Apple Calendar, Outlook)

**ICS File Format (per event):**
```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CommandCentered//Event Scheduler//EN
BEGIN:VEVENT
UID:[unique-id]@commandcentered.com
DTSTAMP:[current timestamp]
DTSTART:[load_in_time]
DTEND:[load_out_time]
SUMMARY:[Event Name] - [Role]
DESCRIPTION:[Event details, venue, parking, pay, etc.]
LOCATION:[Venue name, address]
END:VEVENT
END:VCALENDAR
```

### 9.2 Email Sending Implementation

**Service:** Use Resend (simple, modern, reliable)

**Steps:**
1. Generate HTML email content from template
2. Generate .ics files for each event
3. Call Resend API:
   ```typescript
   await resend.emails.send({
     from: 'noreply@[tenant-domain].com',
     to: operator.email,
     subject: `Your Schedule for ${dateRange}`,
     html: htmlContent,
     attachments: icsFiles.map(file => ({
       filename: `${eventName}.ics`,
       content: file.content
     }))
   });
   ```
4. Log email sent to audit table
5. Show success/failure to user

**Audit Trail:**
```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id),

  recipient_email TEXT NOT NULL,
  recipient_type TEXT NOT NULL, -- 'operator'
  recipient_id UUID NOT NULL, -- operator.id

  email_type TEXT NOT NULL, -- 'schedule'
  subject TEXT NOT NULL,

  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,

  events_included UUID[], -- Array of event IDs included in email

  CONSTRAINT email_logs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
```

---

## 10. UI/UX Requirements

### 10.1 Calendar View (Primary Dashboard)

**Layout:**
- Full-width calendar (month view default, week/day views available)
- Events displayed as blocks with:
  - Event name
  - Venue name
  - Time range (e.g., "12pm-4pm")
  - Operator count badge (e.g., "3 ops")
  - Equipment count badge (e.g., "12 items")
  - Status indicator color (confirmed=blue, scheduled=green, in_progress=yellow, completed=gray)
- Conflict indicators (red exclamation mark on events with conflicts)

**Interactions:**
- Click event → Open event detail modal
- Drag event → Reschedule (update times, re-run conflict detection)
- Create new event → Click empty date cell

**Sidebars:**
- **Left Sidebar:** Available operators (filterable by skills, availability)
- **Right Sidebar:** Available equipment (filterable by category, status)

**Drag & Drop:**
- Drag operator from left sidebar onto event → Assign operator
- Drag equipment from right sidebar onto event → Assign equipment
- Visual feedback during drag (highlight drop zones, show conflicts in real-time)

### 10.2 Event Detail Modal

**Sections:**

**1. Event Info (Editable)**
- Event name, type, client info
- Venue details, parking
- Times (load-in, event start/end, load-out)
- Revenue (optional)
- Special notes
- Status dropdown

**2. Operators Assigned**
- List of operators with:
  - Name, avatar (future)
  - Role
  - Estimated hours
  - Calculated pay
  - Remove button
- "Add Operator" button → Search/select operator, assign role

**3. Equipment Assigned (Packing List)**
- Grouped by vehicle
- Each item shows:
  - Equipment name
  - Category icon
  - Pack status checkbox
  - Remove button
- "Add Equipment" button → Search/select equipment, assign vehicle

**4. Financial Summary**
- Total operator cost
- Revenue (if entered)
- Profit margin

**5. Actions**
- "Send Schedule to All Operators" button
- "Generate Packing List PDF" button [FUTURE]
- "Mark In Progress" / "Mark Completed" status buttons
- "Delete Event" (with confirmation)

### 10.3 Operators Management Page

**Layout:**
- Table/card view of all operators
- Columns:
  - Name, email, phone
  - Hourly rate
  - Skills (visual bars: camera, directing, overall)
  - Status (active/inactive toggle)
  - Actions (edit, delete, view schedule)

**Filters:**
- Status (active/inactive)
- Skills (camera >= 8, directing >= 7, etc.)
- Availability (filter by date range, exclude blackout dates)

**Create/Edit Operator Form:**
- Name, email, phone
- Hourly rate (number input)
- Skills (3 sliders: camera 1-10, directing 1-10, overall 1-10)
- Blackout dates (date range picker, can add multiple)
- Status toggle

**Gamification [FUTURE]:**
- Animated avatar based on skills
- Visual skill progression
- Event completion badges

### 10.4 Equipment Management Page

**Layout:**
- Table/card view of all equipment
- Columns:
  - Name
  - Category (icon)
  - Type
  - Status (badge color)
  - Current location
  - Tags
  - Actions (edit, delete, mark needs repair)

**Filters:**
- Category (dropdown)
- Status (dropdown)
- Tags (multi-select)
- Search (name, type)

**Create/Edit Equipment Form:**
- Name
- Category (dropdown)
- Type (text input)
- Tags (tag input, create new or select existing)
- Notes

**Bulk Actions:**
- Mark multiple items as "needs repair"
- Assign multiple items to event
- Add tags to multiple items

### 10.5 Vehicles Management Page

**Layout:**
- Simple list/card view of vehicles
- Each vehicle card shows:
  - Name
  - Status (active/inactive)
  - Current load (list of equipment currently in vehicle) [QUESTION: Track persistently or only per-event?]

**Create/Edit Vehicle Form:**
- Name
- Status toggle
- Notes

### 10.6 Mobile Checklist View

**Two Views:**

**Owner View:**
- List of today's events (or selected date)
- For each event:
  - Event name, venue, times
  - Packing list with checkboxes (grouped by vehicle)
  - Operator list with contact info
- Quick actions:
  - Mark equipment as packed/returned (bulk update)
  - Call/text operators
  - View venue address in maps

**Operator View (Public Link):** [FUTURE]
- Operator's upcoming events
- For each event:
  - Event name, venue, times, parking
  - Their role and pay
  - Equipment list
  - Other operators on job
- Add to calendar button

**Design:**
- Mobile-first responsive design
- Large tap targets
- Offline-capable (PWA) [FUTURE]

### 10.7 Reports/Analytics Page [FUTURE]

**Dashboard Widgets:**
- Events this month/quarter/year
- Total operator hours
- Total operator costs
- Revenue vs. costs (profit margin)
- Equipment utilization rates
- Operator performance (events completed, avg hours)

**Filters:**
- Date range
- Event type
- Operator
- Equipment category

---

## 11. Technical Architecture

### 11.1 Tech Stack

**Frontend:**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **State Management:** React Context + tRPC queries (no Zustand needed for MVP)
- **Drag & Drop:** @dnd-kit/core (modern, accessible)
- **Calendar:** react-big-calendar or FullCalendar
- **Forms:** react-hook-form + zod validation

**Backend:**
- **API:** tRPC (type-safe API layer)
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Auth:** Supabase Auth (email/password, future: OAuth)
- **RLS:** Supabase Row Level Security (multi-tenant isolation)
- **Email:** Resend (modern, simple API)
- **File Storage:** Supabase Storage [FUTURE: for avatars, documents]

**Infrastructure:**
- **Hosting:** Vercel (Next.js optimization, edge functions)
- **Database:** Supabase (managed PostgreSQL + RLS + Auth)
- **Domain:** Custom domain with SSL
- **Monitoring:** Vercel Analytics + Sentry [FUTURE]

### 11.2 Project Structure

```
commandcentered/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/
│   │   │   ├── calendar/         # Main calendar view
│   │   │   ├── events/           # Event management
│   │   │   ├── operators/        # Operator management
│   │   │   ├── equipment/        # Equipment management
│   │   │   ├── vehicles/         # Vehicle management
│   │   │   └── reports/          # Analytics [FUTURE]
│   │   ├── api/
│   │   │   └── trpc/[trpc]/      # tRPC API routes
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                   # shadcn components
│   │   ├── calendar/
│   │   ├── events/
│   │   ├── operators/
│   │   └── equipment/
│   ├── server/
│   │   ├── routers/              # tRPC routers
│   │   │   ├── events.ts
│   │   │   ├── operators.ts
│   │   │   ├── equipment.ts
│   │   │   └── vehicles.ts
│   │   ├── services/             # Business logic
│   │   │   ├── eventService.ts
│   │   │   ├── operatorService.ts
│   │   │   ├── equipmentService.ts
│   │   │   ├── conflictService.ts
│   │   │   └── emailService.ts
│   │   ├── context.ts            # tRPC context (auth, tenant)
│   │   └── trpc.ts               # tRPC setup
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client
│   │   ├── prisma.ts             # Prisma client
│   │   └── utils.ts
│   └── types/                    # Shared TypeScript types
├── tests/
│   ├── unit/                     # Unit tests (services)
│   ├── integration/              # Integration tests (API)
│   └── e2e/                      # Playwright E2E tests
├── docs/
│   └── specs/
│       └── COMMANDCENTERED_SPEC_V1.md
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

### 11.3 Multi-Tenant Architecture

**Tenant Isolation Strategy:**

1. **Database Level (RLS):**
   - ALL tables have `tenant_id` column
   - RLS policies enforce `tenant_id = auth.jwt().tenant_id`
   - No query can access another tenant's data

2. **Application Level (tRPC Context):**
   ```typescript
   export const createTRPCContext = async (opts: CreateNextContextOptions) => {
     const supabase = createClient();
     const { data: { user } } = await supabase.auth.getUser();

     if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

     const profile = await prisma.user_profiles.findUnique({
       where: { id: user.id }
     });

     return {
       user,
       tenantId: profile.tenant_id,
       role: profile.role
     };
   };
   ```

3. **Service Layer (Auto-inject tenant_id):**
   ```typescript
   // eventService.ts
   export const createEvent = async (ctx: Context, input: CreateEventInput) => {
     // tenant_id auto-injected from ctx
     return await prisma.events.create({
       data: {
         ...input,
         tenant_id: ctx.tenantId // Always scoped to user's tenant
       }
     });
   };
   ```

4. **Future: Subdomain Routing**
   - `tenant-slug.commandcentered.com`
   - Middleware extracts tenant from subdomain
   - Custom domains: `app.clientdomain.com` → maps to tenant

### 11.4 Authentication Flow

**User Signup:**
1. User enters email/password + company name
2. Create tenant record
3. Create Supabase auth user
4. Create user_profile linked to tenant
5. Store tenant_id in JWT claims
6. Redirect to dashboard

**User Login:**
1. Supabase auth (email/password)
2. Fetch user_profile with tenant_id
3. Store tenant_id in JWT claims
4. All tRPC requests include tenant_id in context

**Authorization Checks:**
- tRPC middleware validates user logged in
- Extract tenant_id from context
- All queries auto-filtered by tenant_id (via RLS)

### 11.5 API Design (tRPC Routers)

**events.ts:**
```typescript
export const eventsRouter = router({
  list: protectedProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      status: z.enum(['confirmed', 'scheduled', 'in_progress', 'completed', 'archived', 'cancelled']).optional()
    }))
    .query(async ({ ctx, input }) => {
      return await eventService.listEvents(ctx, input);
    }),

  create: protectedProcedure
    .input(createEventSchema)
    .mutation(async ({ ctx, input }) => {
      return await eventService.createEvent(ctx, input);
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string().uuid(), data: updateEventSchema }))
    .mutation(async ({ ctx, input }) => {
      return await eventService.updateEvent(ctx, input.id, input.data);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return await eventService.deleteEvent(ctx, input.id);
    }),

  assignOperator: protectedProcedure
    .input(assignOperatorSchema)
    .mutation(async ({ ctx, input }) => {
      return await eventService.assignOperator(ctx, input);
    }),

  assignEquipment: protectedProcedure
    .input(assignEquipmentSchema)
    .mutation(async ({ ctx, input }) => {
      return await eventService.assignEquipment(ctx, input);
    }),

  getPackingList: protectedProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await eventService.getPackingList(ctx, input.eventId);
    }),

  sendScheduleEmail: protectedProcedure
    .input(z.object({ operatorId: z.string().uuid(), dateRange: z.object({ start: z.date(), end: z.date() }) }))
    .mutation(async ({ ctx, input }) => {
      return await emailService.sendOperatorSchedule(ctx, input);
    })
});
```

**Similar routers for:**
- `operators.ts` (CRUD, manage skills, blackout dates)
- `equipment.ts` (CRUD, manage status, track location)
- `vehicles.ts` (CRUD)
- `conflicts.ts` (detect conflicts, get warnings)

### 11.6 Service Layer (Business Logic)

**eventService.ts:**
```typescript
export const eventService = {
  async createEvent(ctx: Context, input: CreateEventInput) {
    // 1. Validate input
    validateEventTimes(input);

    // 2. Create event
    const event = await prisma.events.create({
      data: {
        ...input,
        tenant_id: ctx.tenantId,
        status: 'confirmed'
      }
    });

    // 3. Check for conflicts (warn user if any)
    const conflicts = await conflictService.detectEventConflicts(ctx, event);

    return { event, conflicts };
  },

  async assignOperator(ctx: Context, input: AssignOperatorInput) {
    // 1. Validate operator is active
    const operator = await prisma.operators.findUnique({
      where: { id: input.operatorId, tenant_id: ctx.tenantId }
    });

    if (operator.status !== 'active') {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Operator is not active' });
    }

    // 2. Check conflicts
    const conflicts = await conflictService.detectOperatorConflicts(ctx, {
      operatorId: input.operatorId,
      eventId: input.eventId
    });

    // If conflicts and not override, return warning
    if (conflicts.length > 0 && !input.override) {
      return { status: 'conflict', conflicts };
    }

    // 3. Calculate pay
    const event = await prisma.events.findUnique({ where: { id: input.eventId } });
    const estimatedHours = calculateHours(event.load_in_time, event.load_out_time);
    const calculatedPay = estimatedHours * operator.hourly_rate;

    // 4. Create assignment
    const assignment = await prisma.operator_assignments.create({
      data: {
        tenant_id: ctx.tenantId,
        event_id: input.eventId,
        operator_id: input.operatorId,
        role: input.role,
        estimated_hours: estimatedHours,
        calculated_pay: calculatedPay,
        status: 'assigned'
      }
    });

    // 5. Update event status to 'scheduled' if first operator
    await maybeUpdateEventStatus(ctx, input.eventId);

    return { status: 'success', assignment };
  },

  // ... more methods
};
```

**conflictService.ts:**
```typescript
export const conflictService = {
  async detectOperatorConflicts(ctx: Context, input: { operatorId: string, eventId: string }) {
    const event = await prisma.events.findUnique({ where: { id: input.eventId } });

    // Check time conflicts
    const timeConflicts = await prisma.operator_assignments.findMany({
      where: {
        tenant_id: ctx.tenantId,
        operator_id: input.operatorId,
        status: { not: 'cancelled' },
        event: {
          status: { notIn: ['cancelled', 'completed', 'archived'] },
          OR: [
            // Overlapping time ranges
            {
              load_in_time: { lt: event.load_out_time },
              load_out_time: { gt: event.load_in_time }
            }
          ]
        }
      },
      include: { event: true }
    });

    // Check blackout dates
    const blackoutConflicts = await prisma.operator_blackout_dates.findMany({
      where: {
        tenant_id: ctx.tenantId,
        operator_id: input.operatorId,
        start_date: { lte: event.load_out_time },
        end_date: { gte: event.load_in_time }
      }
    });

    return {
      timeConflicts,
      blackoutConflicts
    };
  },

  async detectEquipmentConflicts(ctx: Context, input: { equipmentId: string, eventId: string }) {
    // Similar logic for equipment
  },

  async detectVehicleConflicts(ctx: Context, input: { vehicleId: string, eventId: string }) {
    // Similar logic for vehicles
  }
};
```

**emailService.ts:**
```typescript
export const emailService = {
  async sendOperatorSchedule(ctx: Context, input: { operatorId: string, dateRange: DateRange }) {
    // 1. Get operator details
    const operator = await prisma.operators.findUnique({
      where: { id: input.operatorId, tenant_id: ctx.tenantId }
    });

    // 2. Get operator's events in date range
    const assignments = await prisma.operator_assignments.findMany({
      where: {
        tenant_id: ctx.tenantId,
        operator_id: input.operatorId,
        status: { not: 'cancelled' },
        event: {
          load_in_time: { gte: input.dateRange.start, lte: input.dateRange.end }
        }
      },
      include: {
        event: {
          include: {
            operator_assignments: { include: { operator: true } },
            equipment_assignments: { include: { equipment: true } }
          }
        }
      },
      orderBy: { event: { load_in_time: 'asc' } }
    });

    // 3. Generate HTML email
    const htmlContent = generateScheduleEmail(operator, assignments);

    // 4. Generate .ics files
    const icsFiles = assignments.map(a => generateICS(a.event, operator, a.role));

    // 5. Send email via Resend
    const result = await resend.emails.send({
      from: 'noreply@commandcentered.com',
      to: operator.email,
      subject: `Your Schedule for ${formatDateRange(input.dateRange)}`,
      html: htmlContent,
      attachments: icsFiles
    });

    // 6. Log email sent
    await prisma.email_logs.create({
      data: {
        tenant_id: ctx.tenantId,
        recipient_email: operator.email,
        recipient_type: 'operator',
        recipient_id: operator.id,
        email_type: 'schedule',
        subject: `Your Schedule for ${formatDateRange(input.dateRange)}`,
        status: result.error ? 'failed' : 'sent',
        error_message: result.error?.message,
        events_included: assignments.map(a => a.event_id)
      }
    });

    return { status: 'sent', emailId: result.id };
  }
};
```

---

## 12. Security & Multi-Tenancy

### 12.1 Security Requirements

**Authentication:**
- Supabase Auth with email/password
- JWT-based sessions
- Refresh tokens handled by Supabase

**Authorization:**
- RLS policies on ALL tables
- tRPC context validates user + tenant
- No direct database access from client

**Data Isolation:**
- ALL queries filtered by tenant_id
- Foreign keys enforce tenant consistency
- No cross-tenant data leakage possible

**Input Validation:**
- Zod schemas for ALL inputs
- Sanitize user input (prevent XSS)
- Rate limiting on API endpoints [FUTURE]

**Secrets Management:**
- Environment variables for sensitive keys
- Vercel encrypted environment variables
- Never commit secrets to git

### 12.2 RLS Policy Examples

**events table:**
```sql
-- Tenant users can only see their own events
CREATE POLICY "tenant_events" ON events
  FOR ALL
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Super admins can see all events
CREATE POLICY "super_admin_all_events" ON events
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'super_admin');
```

**operators table:**
```sql
-- Same pattern for all tables
CREATE POLICY "tenant_operators" ON operators
  FOR ALL
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "super_admin_all_operators" ON operators
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'super_admin');
```

### 12.3 Audit Logging

**Activity Logs Table:**
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  action TEXT NOT NULL, -- e.g., 'event.created', 'operator.assigned', 'equipment.assigned'
  resource_type TEXT NOT NULL, -- 'event', 'operator', 'equipment', etc.
  resource_id UUID NOT NULL,

  details JSONB, -- Additional context

  CONSTRAINT activity_logs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Indexes
CREATE INDEX activity_logs_tenant_id_idx ON activity_logs(tenant_id);
CREATE INDEX activity_logs_user_id_idx ON activity_logs(user_id);
CREATE INDEX activity_logs_resource_idx ON activity_logs(resource_type, resource_id);
```

**Log All Key Actions:**
- Event created/updated/deleted
- Operator assigned/removed
- Equipment assigned/removed
- Email sent
- Status changes

---

## 13. Testing Strategy

### 13.1 Testing Philosophy

**Test Pyramid:**
1. **Unit Tests (Most)** - Test business logic in isolation
2. **Integration Tests (Medium)** - Test API endpoints + database
3. **E2E Tests (Least)** - Test critical user workflows

**Coverage Goals:**
- 80%+ coverage for service layer (business logic)
- 100% coverage for conflict detection logic
- E2E tests for all critical paths

### 13.2 Unit Tests (Vitest)

**Test Services in Isolation:**

**Example: eventService.test.ts**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { eventService } from '@/server/services/eventService';
import { createMockContext } from '../helpers/mockContext';

describe('eventService', () => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createMockContext();
  });

  describe('createEvent', () => {
    it('creates event with valid data', async () => {
      const input = {
        event_name: 'Test Event',
        event_type: 'dance_competition',
        venue_name: 'Test Venue',
        venue_address: '123 Main St',
        load_in_time: new Date('2025-02-01T10:00:00Z'),
        event_start_time: new Date('2025-02-01T12:00:00Z'),
        event_end_time: new Date('2025-02-01T16:00:00Z'),
        load_out_time: new Date('2025-02-01T18:00:00Z')
      };

      const result = await eventService.createEvent(ctx, input);

      expect(result.event).toBeDefined();
      expect(result.event.event_name).toBe('Test Event');
      expect(result.event.status).toBe('confirmed');
      expect(result.event.tenant_id).toBe(ctx.tenantId);
    });

    it('rejects invalid time logic', async () => {
      const input = {
        // load_in AFTER event_start (invalid)
        load_in_time: new Date('2025-02-01T14:00:00Z'),
        event_start_time: new Date('2025-02-01T12:00:00Z'),
        event_end_time: new Date('2025-02-01T16:00:00Z'),
        load_out_time: new Date('2025-02-01T18:00:00Z'),
        // ... other fields
      };

      await expect(eventService.createEvent(ctx, input)).rejects.toThrow('Invalid event times');
    });
  });

  describe('assignOperator', () => {
    it('assigns operator with no conflicts', async () => {
      // Setup: Create event and operator
      const event = await createTestEvent(ctx);
      const operator = await createTestOperator(ctx);

      const result = await eventService.assignOperator(ctx, {
        eventId: event.id,
        operatorId: operator.id,
        role: 'Camera Op'
      });

      expect(result.status).toBe('success');
      expect(result.assignment).toBeDefined();
      expect(result.assignment.calculated_pay).toBeGreaterThan(0);
    });

    it('detects time conflict and returns warning', async () => {
      // Setup: Create two overlapping events
      const event1 = await createTestEvent(ctx, { load_in_time: '2025-02-01T12:00:00Z', load_out_time: '2025-02-01T16:00:00Z' });
      const event2 = await createTestEvent(ctx, { load_in_time: '2025-02-01T14:00:00Z', load_out_time: '2025-02-01T18:00:00Z' });
      const operator = await createTestOperator(ctx);

      // Assign operator to event1
      await eventService.assignOperator(ctx, { eventId: event1.id, operatorId: operator.id, role: 'Camera Op' });

      // Try to assign to overlapping event2
      const result = await eventService.assignOperator(ctx, { eventId: event2.id, operatorId: operator.id, role: 'Camera Op' });

      expect(result.status).toBe('conflict');
      expect(result.conflicts.timeConflicts).toHaveLength(1);
    });

    it('allows conflict override', async () => {
      // Same setup as above, but with override: true
      // ... setup ...

      const result = await eventService.assignOperator(ctx, {
        eventId: event2.id,
        operatorId: operator.id,
        role: 'Camera Op',
        override: true // User confirmed override
      });

      expect(result.status).toBe('success');
    });
  });
});
```

**Test Coverage Areas:**
- Event creation/update/delete
- Operator assignment (all conflict scenarios)
- Equipment assignment (all conflict scenarios)
- Blackout date detection
- Pay calculation
- State transitions
- Validation rules

### 13.3 Integration Tests (Vitest + Test Database)

**Test tRPC API with Real Database:**

**Example: events.api.test.ts**
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createCaller } from '@/server/routers/_app';
import { createTestContext, cleanupTestData } from '../helpers/testContext';

describe('events API', () => {
  let caller: ReturnType<typeof createCaller>;
  let ctx: Context;

  beforeAll(async () => {
    ctx = await createTestContext();
    caller = createCaller(ctx);
  });

  afterAll(async () => {
    await cleanupTestData(ctx);
  });

  it('lists events', async () => {
    const events = await caller.events.list({});
    expect(events).toBeInstanceOf(Array);
  });

  it('creates event', async () => {
    const event = await caller.events.create({
      event_name: 'Integration Test Event',
      // ... other fields
    });

    expect(event.event).toBeDefined();
    expect(event.event.id).toBeTruthy();
  });

  it('enforces tenant isolation', async () => {
    // Create event in tenant A
    const eventA = await caller.events.create({ /* ... */ });

    // Switch to tenant B context
    const ctxB = await createTestContext({ tenantId: 'tenant-b-id' });
    const callerB = createCaller(ctxB);

    // Try to fetch event from tenant A
    const events = await callerB.events.list({});

    // Should not see tenant A's event
    expect(events.find(e => e.id === eventA.event.id)).toBeUndefined();
  });
});
```

### 13.4 E2E Tests (Playwright)

**Test Critical User Workflows:**

**Example: event-scheduling.spec.ts**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Event Scheduling Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as tenant owner
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/calendar');
  });

  test('create event and assign operator', async ({ page }) => {
    // Create new event
    await page.click('[data-testid="create-event-btn"]');
    await page.fill('[name="event_name"]', 'E2E Test Event');
    await page.selectOption('[name="event_type"]', 'dance_competition');
    await page.fill('[name="venue_name"]', 'Test Venue');
    await page.fill('[name="venue_address"]', '123 Test St');
    // ... fill all fields
    await page.click('button[type="submit"]');

    // Verify event appears in calendar
    await expect(page.locator('text=E2E Test Event')).toBeVisible();

    // Open event detail
    await page.click('text=E2E Test Event');

    // Assign operator via drag & drop
    await page.dragAndDrop('[data-operator-id="operator-1"]', '[data-event-id="event-1"]');

    // Verify operator appears in event
    await expect(page.locator('[data-testid="assigned-operators"]')).toContainText('Test Operator');

    // Verify pay is calculated
    await expect(page.locator('[data-testid="operator-pay"]')).toContainText('$');
  });

  test('detects operator conflict', async ({ page }) => {
    // Create two overlapping events
    // Assign same operator to both
    // Verify conflict warning appears
    // ... implementation
  });

  test('sends schedule email', async ({ page }) => {
    // Navigate to event with assigned operator
    // Click "Send Schedule" button
    // Verify email preview modal appears
    // Click "Confirm Send"
    // Verify success message
    // ... implementation
  });
});
```

**E2E Test Coverage:**
- Event creation workflow
- Operator assignment (drag & drop + manual)
- Equipment assignment
- Conflict detection UI
- Email sending
- Packing list generation
- Mobile checklist view

### 13.5 Test Data Management

**Seed Test Data:**
```typescript
// tests/helpers/seed.ts
export const seedTestData = async (tenantId: string) => {
  // Create operators
  const operator1 = await prisma.operators.create({
    data: {
      tenant_id: tenantId,
      name: 'Test Operator 1',
      email: 'op1@test.com',
      hourly_rate: 50,
      camera_skill: 8,
      directing_skill: 7,
      overall_skill: 9
    }
  });

  // Create equipment
  const camera1 = await prisma.equipment.create({
    data: {
      tenant_id: tenantId,
      name: 'Test Camera 1',
      category: 'camera',
      type: 'Camera Body'
    }
  });

  // Create vehicles
  const vanA = await prisma.vehicles.create({
    data: {
      tenant_id: tenantId,
      name: 'Test Van A'
    }
  });

  return { operator1, camera1, vanA };
};
```

### 13.6 CI/CD Testing Pipeline

**GitHub Actions Workflow:**
```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 14. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

**Goal:** Project setup, authentication, multi-tenant architecture

**Tasks:**
- [ ] Initialize Next.js project with TypeScript
- [ ] Setup Supabase project (database + auth)
- [ ] Configure Prisma schema
- [ ] Implement multi-tenant RLS policies
- [ ] Setup tRPC with auth context
- [ ] Implement authentication (login/signup)
- [ ] Create base layout and navigation
- [ ] Setup testing infrastructure (Vitest + Playwright)

**Deliverables:**
- Working auth system
- Multi-tenant database with RLS
- Base project structure
- Test suite scaffolding

**Success Criteria:**
- User can signup and login
- User data scoped to tenant
- RLS policies enforce isolation
- Tests pass in CI

---

### Phase 2: Core Data Management (Weeks 3-4)

**Goal:** CRUD for events, operators, equipment, vehicles

**Tasks:**
- [ ] Implement events CRUD (tRPC API + UI)
- [ ] Implement operators CRUD with skills sliders
- [ ] Implement equipment CRUD with categories/tags
- [ ] Implement vehicles CRUD
- [ ] Implement operator blackout dates
- [ ] Create list/table views for all entities
- [ ] Create forms for creating/editing
- [ ] Write unit tests for all services
- [ ] Write integration tests for all APIs

**Deliverables:**
- Full CRUD for all core entities
- Validated forms
- 80%+ test coverage

**Success Criteria:**
- User can create/edit/delete events
- User can create/edit/delete operators
- User can create/edit/delete equipment
- User can create/edit/delete vehicles
- All validation rules enforced
- All tests pass

---

### Phase 3: Calendar & Assignment (Weeks 5-6)

**Goal:** Visual calendar with drag & drop assignment

**Tasks:**
- [ ] Implement calendar view (month/week/day)
- [ ] Display events on calendar
- [ ] Implement drag & drop for operators
- [ ] Implement drag & drop for equipment
- [ ] Create event detail modal
- [ ] Show assigned operators in event detail
- [ ] Show assigned equipment (packing list) in event detail
- [ ] Calculate and display operator pay
- [ ] Implement conflict detection queries
- [ ] Write conflict detection unit tests
- [ ] Write E2E tests for assignment workflow

**Deliverables:**
- Interactive calendar with events
- Drag & drop operator assignment
- Drag & drop equipment assignment
- Event detail view with assignments

**Success Criteria:**
- User can view events on calendar
- User can drag operator onto event
- User can drag equipment onto event
- Assignment creates records in database
- Pay auto-calculated correctly
- Tests pass

---

### Phase 4: Conflict Detection & Warnings (Week 7)

**Goal:** Detect and warn about conflicts

**Tasks:**
- [ ] Implement operator time conflict detection
- [ ] Implement equipment double-booking detection
- [ ] Implement vehicle conflict detection
- [ ] Implement blackout date detection
- [ ] Create conflict warning modal UI
- [ ] Allow conflict override with confirmation
- [ ] Show conflict indicators on calendar
- [ ] Write comprehensive conflict tests (all scenarios)
- [ ] Write E2E tests for conflict workflows

**Deliverables:**
- Conflict detection for all resource types
- Visual conflict warnings
- Override mechanism

**Success Criteria:**
- System detects operator time conflicts
- System detects equipment double-booking
- System detects vehicle conflicts
- System detects blackout date conflicts
- User sees clear warnings
- User can override with confirmation
- All conflict scenarios tested

---

### Phase 5: Packing Lists & Status Tracking (Week 8)

**Goal:** Equipment packing lists and status tracking

**Tasks:**
- [ ] Implement packing list view (grouped by vehicle)
- [ ] Implement pack status updates (needs_packing → packed → at_event → returned)
- [ ] Implement bulk status updates
- [ ] Implement equipment status state machine
- [ ] Auto-update equipment status based on event status
- [ ] Create mobile-responsive checklist view
- [ ] Write tests for status transitions

**Deliverables:**
- Packing list organized by vehicle
- Equipment status tracking
- Mobile checklist view

**Success Criteria:**
- User can view packing list per event
- User can update pack status per item
- Equipment auto-returns to available when event completes
- Mobile view is usable on phone
- Tests pass

---

### Phase 6: Email & Communication (Week 9)

**Goal:** Schedule email generation and sending

**Tasks:**
- [ ] Setup Resend email service
- [ ] Implement HTML email template
- [ ] Implement .ics calendar file generation
- [ ] Implement email preview modal
- [ ] Implement email sending (manual trigger)
- [ ] Implement email audit logging
- [ ] Write tests for email generation
- [ ] Write E2E test for email sending

**Deliverables:**
- HTML email generation
- Calendar attachment (.ics)
- Email sending via Resend
- Email audit log

**Success Criteria:**
- User can preview schedule email
- User can send schedule to operator
- Operator receives email with all details
- Calendar file imports to Google Calendar/Outlook
- Email send logged to audit table
- Tests pass

---

### Phase 7: Polish & Launch Prep (Week 10)

**Goal:** UI polish, performance, analytics

**Tasks:**
- [ ] Implement event financial summary (cost, revenue, profit)
- [ ] Implement basic analytics dashboard
- [ ] Optimize database queries (indexes)
- [ ] Add loading states and error handling
- [ ] Implement responsive design polish
- [ ] Add keyboard shortcuts [FUTURE]
- [ ] Setup Sentry error tracking
- [ ] Setup Vercel Analytics
- [ ] Write user documentation
- [ ] Perform load testing
- [ ] Final E2E test pass

**Deliverables:**
- Polished UI
- Analytics dashboard
- Documentation
- Production-ready app

**Success Criteria:**
- All pages load in < 2s
- No console errors
- Mobile-friendly
- Documentation complete
- All tests pass
- Ready for production use

---

### Phase 8: Future Enhancements [POST-LAUNCH]

**Features to Add Later:**
- Operator login (view their own schedules)
- Equipment templates (pre-defined kits for event types)
- Automated equipment suggestions
- Gamified operator avatars
- Advanced reporting (utilization rates, profit analysis)
- Multi-language support
- White-label branding per tenant
- Tenant self-registration + billing
- Mobile app (React Native)
- Offline mode (PWA)

---

## 15. Decisions Made (Formerly Open Questions)

### [DECISION 1] Equipment Location Tracking ✅

**Decision:** **Option B** - Separate `equipment_location_history` table with full history tracking

**Rationale:** Need audit trail for equipment movements ("In Shop" → "Loaded in Van A" → "At Event X" → "Returned to Shop")

**Implementation:**
- `equipment.current_location` field for quick access (denormalized)
- `equipment_location_history` table for complete movement history
- Implemented in schema section 4.1.7a

---

### [DECISION 2] Vehicle Load Tracking ✅

**Decision:** **Option A** - Per-Event Only + Operator Transportation Tracking

**Clarification:** Vehicles primarily for event-based equipment transport. Also tracking:
- Which company vehicle is used for which event
- Which operators have personal vehicles
- Which operators need rides (ride coordination)

**Implementation:**
- Vehicle assigned via `equipment_assignments.vehicle_id`
- Operators table includes: `has_vehicle`, `vehicle_description`, `home_address`
- Operator assignments include: `needs_ride`, `ride_provider_id`

---

### [DECISION 3] Equipment Tags/Kits ✅

**Decision:** **Option C** - Simple tags WITH quick assign kit feature

**Implementation:**
- Keep `tags TEXT[]` on equipment table
- Add "quick assign kit" feature (assign all items tagged "Kit A" to event at once)
- Tags enable both organization and bulk operations

---

### [DECISION 4] Event Equipment Templates ✅

**Decision:** **Option B** - Templates stored in database with auto-suggest

**Implementation:**
- New table: `event_equipment_templates` (schema section 4.1.10)
- Templates link to event types (dance_competition, recital, etc.)
- Templates store equipment tags and specific equipment IDs to suggest
- When creating event, system suggests equipment based on event type template

---

### [DECISION 5] Actual Hours Tracking ✅

**Decision:** **Option B** - Track BOTH estimated and actual hours with overtime calculation

**Rationale:** Need to track overtime for payroll purposes

**Implementation:**
- `estimated_hours` (calculated from event load_in to load_out)
- `actual_hours` (manually entered after event completion)
- `overtime_hours` (computed field: actual_hours - estimated_hours if positive)
- Updated in schema section 4.1.6

---

### [DECISION 6] Client Portal ✅

**Decision:** **Option A** - No client access (internal-only system)

**Rationale:** CommandCentered is for internal operations management, not client-facing. Owner sends schedules/details to clients via email/PDF as needed.

**Future:** Could add public read-only links later if requested

---

### [DECISION 7] Recurring Events ✅

**Decision:** **Option B** - "Duplicate Event" feature (one-click copy)

**Rationale:** Events are annual (not weekly/monthly), so simple duplication is sufficient. No need for complex recurrence rules.

**Implementation:** Add "Duplicate Event" button that copies all event details and optionally equipment assignments/operator assignments to new date.

---

### [DECISION 8] Mobile Strategy ✅

**Decision:** **Option A** - Responsive web only (no PWA, no native app)

**Rationale:** Focus on getting core functionality right. Responsive design works on mobile browsers. Can upgrade to PWA later if needed.

**Implementation:** Mobile-first CSS with Tailwind, large tap targets, optimized for phone screens

---

## 16. Success Metrics

**MVP Success Criteria:**
- [ ] User (you) can manage 5-6 operators across multiple daily events
- [ ] User can assign operators and equipment via drag & drop
- [ ] System detects and warns about conflicts
- [ ] User can generate and send schedule emails with calendar attachments
- [ ] User can track equipment packing status
- [ ] Mobile checklist view is usable on phone
- [ ] App is faster than manual checklists/spreadsheets
- [ ] Zero data loss or corruption
- [ ] Multi-tenant isolation verified

**Post-Launch Metrics (Phase 8+):**
- Time saved per event (goal: 50% reduction vs. manual)
- Operator scheduling conflicts reduced (goal: 90% detection rate)
- Equipment double-booking incidents (goal: zero)
- Email open rates (operator engagement)
- User satisfaction score (goal: 8+/10)
- Customer acquisition (if commercializing)

---

## Appendix A: Glossary

**Assignment:** Linking an operator or equipment to an event

**Blackout Date:** Period when operator is unavailable

**Conflict:** Overlapping resource assignment or blackout violation

**Event:** Confirmed videography job with specific date/venue

**Load-In:** Time to arrive and unload equipment before event starts

**Load-Out:** Time to pack up equipment after event ends

**Multi-Tenant:** Architecture where multiple businesses use same app with isolated data

**Operator:** Videography crew member (camera op, audio tech, etc.)

**Outside Hours:** Total time needed including load-in and load-out (not just event hours)

**Packing List:** List of equipment assigned to an event, organized by vehicle

**RLS (Row Level Security):** PostgreSQL feature that enforces data isolation at database level

**Tenant:** A videography business using CommandCentered (you, or future customers)

---

## Appendix B: Database Schema Diagram

```
tenants
  ├── user_profiles (1:many)
  ├── events (1:many)
  ├── operators (1:many)
  ├── equipment (1:many)
  └── vehicles (1:many)

events
  ├── operator_assignments (1:many) → operators (many:1)
  └── equipment_assignments (1:many) → equipment (many:1)
                                      └→ vehicles (many:1, optional)

operators
  └── operator_blackout_dates (1:many)
```

---

**End of Specification v1.0**

---

## Next Steps

1. **Review this spec** - Read through, mark unclear sections
2. **Answer [QUESTION] tags** - Decide on open questions
3. **Approve or revise** - Suggest changes before implementation
4. **Lock spec** - Once approved, this becomes source of truth
5. **Begin Phase 1** - Start implementation following this spec exactly

**Estimated Total Development Time:** 10 weeks to MVP launch (full-time equivalent)

**Estimated Development Cost (if outsourced):** $15k-25k (at $50-75/hr)

**Ongoing Costs:**
- Supabase: $25/month (Pro plan)
- Vercel: $20/month (Pro plan)
- Resend: $20/month (Email Pro)
- Domain: $12/year
- **Total: ~$65/month**

---

*This specification serves as the single source of truth for CommandCentered development. All implementation must match this spec exactly. Any deviations must be documented and approved.*
