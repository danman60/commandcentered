# Spec vs Mockup Cross-Check
**Date:** November 11, 2025
**Purpose:** Ensure ALL spec features are visible in mockups

---

## ✅ FEATURES ALREADY IN SPEC + SCHEMA

### **Shifts** (SPEC: MASTER_SPECIFICATION_FINAL.md, Schema: lines 218-244)
- ✅ Schema has `Shift` model
- ✅ Schema has `ShiftAssignment` model
- ✅ Fields: shiftName, startTime, endTime, isOverlapShift, rolesNeeded
- ❌ **NOT in COMPLETE_PAGE_LAYOUTS.md** - Missing layout spec
- ❌ **NOT in current mockups** - Not visible

**What needs to show in Planning page:**
- Events broken into shifts (morning/afternoon/evening or custom times)
- Shift assignments (operator + role)
- Kit assignments per shift
- Overlap shifts (multiple operators on same shift)

---

### **Gear Kits** (Schema: lines 775-790)
- ✅ Schema has `GearKit` model
- ✅ Fields: kitName, description, gearIds[], isActive
- ❌ **NOT in COMPLETE_PAGE_LAYOUTS.md** - Missing layout spec
- ❌ **NOT in current mockups** - Not visible

**What needs to show in Gear page:**
- Kits tab (alongside Inventory, Calendar, Maintenance)
- Kit list (e.g., "Standard Dance Kit", "Drone Package", "Audio Kit")
- Kit contents (list of gear items in each kit)
- Deploy kit to event (not individual items)
- Missing item detection (warn if kit item unavailable)

---

### **Deliverables with Assigned Editor** (Schema: lines 794-824)
- ✅ Schema has `Deliverable` model
- ✅ Schema has `assignedEditorId` field (line 810)
- ✅ Schema has `Editor` model relation
- ✅ Schema has `deliverableType` field (line 805)
- ⚠️ **PARTIAL in COMPLETE_PAGE_LAYOUTS.md** - Shows deliverables but not pre-defined types
- ⚠️ **PARTIAL in current mockups** - Shows progress but no editor assignment

**What needs to show in Deliverables page:**
- Pre-defined deliverable types dropdown:
  - "1 min landscape video"
  - "3x 10s social media reels"
  - "Full event highlight (3-5 min)"
  - "Photo gallery (50+ images)"
  - Custom types allowed
- Assigned Editor column
- Click editor name to email them (mailto: link)
- **Google Drive activity notifications** (NEW - not in schema yet)

---

### **Proposal Builder** (COMPLETE_PAGE_LAYOUTS.md: lines 391-397)
- ✅ **IN SPEC** - COMPLETE_PAGE_LAYOUTS.md has layout (lines 391-397)
- ❌ **NOT in current mockups** - Files page shows table only, no builder

**What needs to show in Files page:**
- "+ NEW PROPOSAL" button opens builder
- Drag-drop elements (Video Coverage, Photo Package, Add-ons)
- Live preview canvas
- Service type selection
- Pricing configuration
- **Reference:** COMPLETE_PAGE_LAYOUTS.md lines 391-397

---

### **Next Actions Panel** (Inferred from Pipeline)
- ⚠️ **IMPLIED in spec** - Lead statuses suggest next actions
- ❌ **NOT explicitly documented**
- ❌ **NOT in current mockups**

**What needs to show on Dashboard:**
- "Contact Lead: ABC Dance" (from NEW leads)
- "Send Contract: XYZ Corp" (from QUALIFIED leads)
- "Follow up: Metro Promos" (from leads with overdue follow-up)
- Link to Pipeline for details

---

### **Client Color Consistency**
- ❌ **NOT in spec** - New requirement from feedback
- ❌ **NOT in schema** - No client.color field
- ❌ **NOT in current mockups**

**What needs to show:**
- Each client assigned a color (generated on client create)
- All events for that client use same color
- Color persists across Dashboard calendar, Planning calendar, Files page

**Schema addition needed:**
```sql
ALTER TABLE clients ADD COLUMN assigned_color VARCHAR(7); -- e.g., "#FF5733"
```

---

### **Pinned Weekends**
- ❌ **NOT in spec** - New requirement from feedback
- ❌ **NOT in schema** - No weekend pinning logic
- ❌ **NOT in current mockups**

**What needs to show in Planning:**
- Pin icon on weekend headers
- Pinned weekends always visible at top
- Scrollable list of unpinned weekends below

**Schema addition needed:**
```sql
CREATE TABLE pinned_weekends (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  weekend_start_date DATE NOT NULL,
  pinned_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### **Telegram Bot Setup**
- ✅ **IN SPEC** - MASTER_SPECIFICATION_FINAL.md line 298: "Telegram - Event group creation"
- ⚠️ **IMPLIED in Operator Portal** - Gig sheets show Telegram links
- ❌ **NOT in COMPLETE_PAGE_LAYOUTS.md Communications page**
- ❌ **NOT in current mockups**

**What needs to show in Communications page:**
- Telegram Bot Setup section
- Show events without Telegram group (alert/warning)
- "Setup Telegram Group" button per event
- Telegram embed/chat (if technically possible)

---

### **CRM Pipeline Columns**
- ⚠️ **PARTIAL in schema** - Has Lead model but missing some fields
- ❌ **NOT in COMPLETE_PAGE_LAYOUTS.md** - Pipeline layout doesn't match XLSX structure
- ❌ **NOT in current mockups** - Pipeline layout too simple

**Current schema (Lead model):**
- ✅ Has: organization, contactName, email, phone, status
- ❌ Missing: lastContactedDate, nextFollowupDate, contactFrequency

**What needs to show in Pipeline:**
- Match CRM_System.xlsx structure (see UXinspo/CurrentCRM.PNG)
- Columns: Organization, Contact, Type of Contact, Last Contacted, Next Follow-Up, Contact Frequency, Status, Product/Service, Notes
- Pipeline stages: Lead → Contacted → Qualified → Proposal Sent → Negotiation → Won/Lost

**Schema additions needed:**
```sql
ALTER TABLE leads ADD COLUMN last_contacted_date TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN next_followup_date TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN contact_frequency VARCHAR(20); -- 'weekly', 'biweekly', 'monthly'
ALTER TABLE leads ADD COLUMN product_service VARCHAR(100); -- 'Dance Recital', 'Concert', etc.
```

---

### **Card/Table View Toggle**
- ❌ **NOT in spec** - New requirement from feedback
- ❌ **NOT in current mockups**

**What needs to show on EVERY page:**
- Toggle button (Card View / Table View)
- Card view: Visual cards with images, quick stats
- Table view: Dense data table (current default)
- Pages to add toggle: Operators, Gear, Deliverables, Pipeline (optional)

---

### **Operator Detail View**
- ⚠️ **IMPLIED in spec** - Operator portal has detail pages
- ❌ **NOT in COMPLETE_PAGE_LAYOUTS.md Operators page**
- ❌ **NOT in current mockups** - Only list view

**What needs to show when clicking operator:**
- Full operator profile (modal or dedicated page)
- Editable fields: name, email, phone, skills, availability
- Skills matrix with ratings
- Upcoming events for this operator
- Equipment owned
- Assignment history

---

## 🚨 MISSING FROM MOCKUPS (In Spec but Not Visible)

### **Critical Missing:**
1. **Proposal Builder** - In spec (COMPLETE_PAGE_LAYOUTS.md:391-397), not in mockup
2. **Shifts** - In schema, not in Planning page mockup
3. **Gear Kits** - In schema, not in Gear page mockup
4. **Assigned Editor** - In schema, not in Deliverables page mockup

### **High Priority Missing:**
5. **Next Actions Panel** - Logical feature, not in Dashboard mockup
6. **Telegram Bot Setup** - In spec (integrations), not in Communications mockup
7. **CRM Structure** - Simplified in mockup, needs to match XLSX

### **Medium Priority Missing:**
8. **Client Color Consistency** - Not in spec or mockup (need to add)
9. **Pinned Weekends** - Not in spec or mockup (need to add)
10. **Card/Table Toggle** - Not in spec or mockup (need to add)
11. **Operator Detail View** - Not in mockup

---

## 📋 ACTION ITEMS

### **Immediate (Add to Mockups):**
- [ ] **Files page:** Add Proposal Builder UI (drag-drop elements, canvas, preview)
- [ ] **Planning page:** Show shift breakdown UI (events → shifts → operator assignments)
- [ ] **Gear page:** Add Kits tab with kit management UI
- [ ] **Deliverables page:** Add Assigned Editor column with email link, pre-defined service types dropdown
- [ ] **Dashboard:** Add Next Actions panel pulling from Pipeline
- [ ] **Dashboard:** Add pie chart for revenue breakdown
- [ ] **Dashboard:** Calendar event bars with names (Google Calendar style)
- [ ] **Pipeline:** Restructure to match CRM XLSX (Last Contacted, Next Follow-Up, etc.)
- [ ] **Communications:** Add Telegram Bot Setup section
- [ ] **Operators:** Add card/table toggle + detail view on click
- [ ] **All pages:** Apply card/table view toggle pattern

### **Spec Updates Needed:**
- [ ] Add to COMPLETE_PAGE_LAYOUTS.md: Shift breakdown UI (Planning page)
- [ ] Add to COMPLETE_PAGE_LAYOUTS.md: Gear Kits section (Gear page)
- [ ] Add to COMPLETE_PAGE_LAYOUTS.md: Telegram setup (Communications page)
- [ ] Add to schema: client.assigned_color field
- [ ] Add to schema: pinned_weekends table
- [ ] Add to schema: Lead model fields (lastContactedDate, nextFollowupDate, contactFrequency)
- [ ] Document: Google Drive activity webhooks (Deliverables integration)

### **Research Required:**
- [ ] Telegram embed capabilities (can we embed chat in Communications page?)
- [ ] Google Drive webhook setup (Drive API for activity notifications)

---

## 🎯 PRIORITY ORDER FOR MOCKUP UPDATES

### **Sprint 1 (Tonight):**
1. Proposal Builder in Files page (drag-drop UI)
2. Shifts in Planning page (event breakdown)
3. Gear Kits tab in Gear page
4. Assigned Editor in Deliverables page

### **Sprint 2 (Tomorrow):**
5. Dashboard Next Actions panel
6. Dashboard pie chart + calendar event bars
7. Pipeline CRM structure (match XLSX)
8. Telegram Bot Setup in Communications

### **Sprint 3 (This Week):**
9. Card/Table toggle on all pages
10. Operator detail view
11. Client color consistency
12. Pinned weekends

---

**Status:** Ready to implement
**Next Step:** Update mockups to show all spec features
**Blockers:** None - all info available in schema + feedback
