# Comprehensive Mockup Update Plan
**Date:** November 11, 2025, 11:00 PM
**Sources:**
- User feedback (MOCKUP_FEEDBACK_NOV11.md)
- Original GAP_ANALYSIS.md (30 features)
- SPEC_VS_MOCKUP_CROSSCHECK.md
- MASTER_SPECIFICATION_FINAL.md
- Schema.prisma

---

## ✅ ALREADY IMPLEMENTED (From Previous Round)

### **From GAP_ANALYSIS.md:**
1. ✅ Voice Assistant Modal - Added (00-interactive-elements-showcase.html)
2. ✅ Warning/Override System - Added (INFO/WARNING/CRITICAL modals)
3. ✅ Manual Entry Workflow - Added (NEW CLIENT modal)
4. ✅ Multi-Date Contracts UI - Added (modal to add/remove events)
5. ✅ Modal Dialogs - Added (CRUD modals for create/edit/delete)
6. ✅ Loading States - Added (00-polish-elements-showcase.html)
7. ✅ Empty States - Added (00-polish-elements-showcase.html)
8. ✅ Toast Notifications - Added (00-polish-elements-showcase.html)
9. ✅ Hover States - Added (buttons, tables, cards)
10. ✅ Focus States - Added (accessibility rings)

---

## 🚨 CRITICAL MISSING FEATURES (Implement First)

### **1. Proposal Builder** (FILES PAGE)
**Sources:**
- GAP_ANALYSIS.md #8
- COMPLETE_PAGE_LAYOUTS.md lines 391-397
- User feedback: "I'd like to see proposal builder builder too in Files"

**Status:** Documented in spec but NOT in mockup

**What to Add:**
```
FILES PAGE - New Tab or Modal:

┌─────────────────────────────────────────────────────────┐
│ PROPOSAL BUILDER                                         │
├─────────────┬──────────────┬────────────────────────────┤
│ ELEMENTS    │ CANVAS       │ PREVIEW                    │
│             │              │                            │
│ 📹 Video    │ [Drag items  │ [Live preview of          │
│ Coverage    │  here to     │  proposal as client       │
│             │  build       │  will see it]             │
│ 📸 Photo    │  proposal]   │                            │
│ Package     │              │                            │
│             │              │                            │
│ 🎵 Audio    │              │                            │
│ Recording   │              │                            │
│             │              │                            │
│ ✨ Add-ons  │              │                            │
│ (Drone,     │              │                            │
│ Streaming)  │              │                            │
└─────────────┴──────────────┴────────────────────────────┘

[SAVE DRAFT] [SEND TO CLIENT →]
```

**Implementation:** Add "+ NEW PROPOSAL" button to Files page, opens builder modal/page

---

### **2. Shifts** (PLANNING PAGE)
**Sources:**
- User feedback: "break events into shifts"
- Schema: Shift model (lines 218-244)
- Schema: ShiftAssignment model (lines 246-267)

**Status:** Full schema exists but NOT shown in mockup

**What to Add:**
```
PLANNING PAGE - Month View → Click Weekend → Drill into Event:

EVENT: ABC Dance Recital (Nov 15, 2025)
┌─────────────────────────────────────────────────────────┐
│ SHIFTS                                                   │
├──────────────┬──────────────────┬─────────────┬─────────┤
│ Shift Name   │ Time             │ Operator    │ Kit     │
├──────────────┼──────────────────┼─────────────┼─────────┤
│ Setup        │ 9:00 AM - 10:00  │ John Smith  │ Audio   │
│              │                  │             │ Kit     │
├──────────────┼──────────────────┼─────────────┼─────────┤
│ Main         │ 10:00 AM - 2:00  │ John Smith  │ Camera  │
│ Coverage     │                  │ Sarah Lee   │ Kit A   │
│              │                  │             │ Drone   │
├──────────────┼──────────────────┼─────────────┼─────────┤
│ Teardown     │ 2:00 PM - 3:00   │ Sarah Lee   │ Audio   │
│              │                  │             │ Kit     │
└──────────────┴──────────────────┴─────────────┴─────────┘

[+ ADD SHIFT] [ASSIGN OPERATORS] [ASSIGN KITS]
```

**Implementation:**
- Month view shows events
- Click event → drill down to shifts
- Show shift assignments
- Drag operators/kits to shifts

---

### **3. Gear Kits** (GEAR PAGE)
**Sources:**
- User feedback: "Needs Kits section where individual items can be added to kits"
- Schema: GearKit model (lines 775-790)
- GAP_ANALYSIS.md implied in equipment conflict detection

**Status:** Full schema exists but NOT shown in mockup

**What to Add:**
```
GEAR PAGE - New "KITS" Tab:

┌─────────────────────────────────────────────────────────┐
│ [Inventory] [Calendar] [Maintenance] [KITS] ← NEW TAB   │
└─────────────────────────────────────────────────────────┘

KITS SECTION:
┌──────────────────────┬──────────────────────────────────┐
│ Standard Dance Kit   │ ✓ Camera A (Sony A7S III)        │
│ [EDIT] [DEPLOY]      │ ✓ Tripod (Manfrotto)             │
│                      │ ✓ Audio Kit (Zoom F6)            │
│                      │ ✓ Memory Cards (2x 256GB)        │
│                      │ ✓ Extra Batteries (4x)           │
├──────────────────────┼──────────────────────────────────┤
│ Drone Package        │ ✓ Drone Alpha (DJI Mavic 3)      │
│ [EDIT] [DEPLOY]      │ ✓ Drone Batteries (3x)           │
│                      │ ✓ ND Filters Set                 │
├──────────────────────┼──────────────────────────────────┤
│ Audio Kit            │ ✓ Zoom F6 Recorder               │
│ [EDIT] [DEPLOY]      │ ✓ Lavalier Mics (2x)             │
│                      │ ✓ Boom Mic                       │
└──────────────────────┴──────────────────────────────────┘

[+ CREATE NEW KIT]

DEPLOY KIT TO EVENT:
When deploying, check if all items available
If conflict: ⚠️ "Camera A already assigned to XYZ Concert on Nov 15"
[REASSIGN] [SWAP ITEM] [PROCEED ANYWAY]
```

**Implementation:**
- Add Kits tab to Gear page
- List kits with contents
- Deploy kit to event (not individual items)
- Missing item detection logic

---

### **4. Deliverables - Pre-defined Services + Editor Assignment** (DELIVERABLES PAGE)
**Sources:**
- User feedback: "Services should be pre-defined product offerings"
- User feedback: "Column for assigned editor; click to email them"
- Schema: Deliverable.assignedEditorId (line 810)
- Schema: Deliverable.deliverableType (line 805)

**Status:** Schema exists, partially in mockup (missing dropdown + editor)

**What to Add:**
```
DELIVERABLES PAGE:

┌────────────────┬─────────────┬─────────────┬──────────────┐
│ Event          │ Service     │ Editor      │ Status       │
├────────────────┼─────────────┼─────────────┼──────────────┤
│ ABC Dance      │ 1 min       │ [John Doe]  │ ⬤ In        │
│ Recital        │ landscape   │ 📧 Email    │   Progress  │
├────────────────┼─────────────┼─────────────┼──────────────┤
│ XYZ Concert    │ 3x 10s      │ [Sarah Lee] │ ⭕ Not      │
│                │ social      │ 📧 Email    │   Started   │
│                │ reels       │             │              │
└────────────────┴─────────────┴─────────────┴──────────────┘

Service Dropdown Options:
- 1 min landscape video
- 3x 10s social media reels
- Full event highlight (3-5 min)
- Photo gallery (50+ images)
- Custom (enter type)

Click editor name → Opens mailto: link
```

**Implementation:**
- Service type dropdown (pre-defined + custom)
- Assigned Editor column
- Click editor → email link
- (Future: Google Drive activity notifications)

---

## 🎯 HIGH PRIORITY UPDATES

### **5. Dashboard Redesign** (DASHBOARD PAGE)
**Sources:**
- User feedback: "Financial snapshot can be half the width, try a pie chart"
- User feedback: "Calendar month view needs bars with names"
- User feedback: "Include Next Actions that reports from pipeline"
- GAP_ANALYSIS.md #26 (Calendar improvements)

**What to Change:**
```
DASHBOARD - NEW LAYOUT:

┌──────────────────────┬──────────────────────────────────┐
│ FINANCIAL SNAPSHOT   │ NEXT ACTIONS                     │
│ (Half width)         │                                  │
│                      │ ⚡ Contact Lead: ABC Dance       │
│ [Pie Chart showing   │    Due: Today                    │
│  revenue by          │    [CONTACT →]                   │
│  service type]       │                                  │
│                      │ ⚡ Send Contract: XYZ Corp        │
│ Dance: $15K          │    Due: Tomorrow                 │
│ Concert: $8K         │    [SEND →]                      │
│ Promo: $5K           │                                  │
└──────────────────────┴──────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ CALENDAR - NOVEMBER 2025                                 │
├──────┬──────┬──────┬──────┬──────┬──────┬──────┬────────┤
│ SUN  │ MON  │ TUE  │ WED  │ THU  │ FRI  │ SAT  │        │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼────────┤
│      │      │      │      │      │ 1    │ 2    │        │
│      │      │      │      │      │ ABC  │      │        │
│      │      │      │      │      │ Dance│      │        │
│      │      │      │      │      │ 2pm  │      │        │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼────────┤
│ 3    │ 4    │ 5    │ 6    │ 7    │ 8    │ 9    │        │
│      │ XYZ  │      │      │      │ Metro│      │        │
│      │ Conc │      │      │      │ Promo│      │        │
│      │ 6pm  │      │      │      │ 10am │      │        │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┴────────┘

Event Bars:
- Span across days if multi-day event
- Show event name ON bar (not just color)
- Color per client (e.g., ABC Dance always blue)
```

**Implementation:**
- Financial snapshot: half width + pie chart
- Next Actions panel: pull from Pipeline (overdue leads, pending contracts)
- Calendar: event bars with names (Google Calendar style)
- Client color consistency (same client = same color everywhere)

---

### **6. Pipeline - CRM Structure** (PIPELINE PAGE)
**Sources:**
- User feedback: "needs to better match our current system SEE ATTACHMENT XLSX"
- UXinspo/CurrentCRM.PNG shows full CRM structure
- GAP_ANALYSIS.md #12 (Filters needed)

**What to Change:**
```
PIPELINE PAGE - MATCH CRM XLSX:

[NEW LEAD] [NEW CLIENT] [NEW EVENT]  [Filter: All ▾] [Search...]

┌──────────────┬──────────┬────────────┬──────────────┬──────────────┬────────┬───────┐
│ Organization │ Contact  │ Type of    │ Last         │ Next         │ Status │ Notes │
│              │          │ Contact    │ Contacted    │ Follow-Up    │        │       │
├──────────────┼──────────┼────────────┼──────────────┼──────────────┼────────┼───────┤
│ ABC Dance    │ Jane     │ Dance      │ Nov 10       │ Nov 15       │ 🔵 NEW │ Int-  │
│ Studio       │ Smith    │ Recital    │ (yesterday)  │ (overdue!)   │        │ erest │
│              │ 555-1234 │            │              │              │        │ in... │
├──────────────┼──────────┼────────────┼──────────────┼──────────────┼────────┼───────┤
│ XYZ Concert  │ Bob      │ Concert    │ Nov 5        │ Nov 18       │ 🟢 CON-│ Send  │
│ Hall         │ Johnson  │ Coverage   │              │ (3 days)     │ TACTED │ prop- │
│              │ 555-5678 │            │              │              │        │ osal  │
└──────────────┴──────────┴────────────┴──────────────┴──────────────┴────────┴───────┘

Columns to Add:
- Last Contacted (date)
- Next Follow-Up (date with urgency)
- Contact Frequency (weekly/biweekly/monthly)
- Type of Contact (product/service)

Color-code Next Follow-Up:
- Green: ≥3 days away
- Orange: 1-2 days away
- Red: Overdue
```

**Schema Updates Needed:**
```sql
ALTER TABLE leads ADD COLUMN last_contacted_date TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN next_followup_date TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN contact_frequency VARCHAR(20);
ALTER TABLE leads ADD COLUMN product_service VARCHAR(100);
```

---

### **7. Planning - Month View Default** (PLANNING PAGE)
**Sources:**
- User feedback: "should default to a month view"
- User feedback: "user can PIN certain weekends to top"
- User feedback: "click into weekends (smoothly animate) to see events"
- GAP_ANALYSIS.md #27

**What to Change:**
```
PLANNING PAGE - NEW DEFAULT:

[MONTH VIEW] [Week View]  ← Toggle (month default)

PINNED WEEKENDS (Always Visible):
┌─────────────────────────────────────────────────────────┐
│ 📌 NOV 15-16 Weekend                      [UNPIN] [EXPAND]│
│ 3 events • 2 operators • 5 gear conflicts                │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ 📌 NOV 22-23 Weekend                      [UNPIN] [EXPAND]│
│ 5 events • 4 operators • No conflicts                    │
└─────────────────────────────────────────────────────────┘

ALL WEEKENDS (Scrollable):
┌─────────────────────────────────────────────────────────┐
│ NOVEMBER 2025                                            │
├──────┬──────┬──────┬──────┬──────┬──────┬──────┬────────┤
│ Week │ MON  │ TUE  │ WED  │ THU  │ FRI  │ SAT  │ SUN    │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼────────┤
│ Nov  │      │      │      │      │ ABC  │ XYZ  │        │
│ 1-2  │      │      │      │      │ Dance│ Conc │        │
│ [PIN]│      │      │      │      │ 2pm  │ 6pm  │        │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┴────────┘

Click weekend → Smooth expand animation → Show events → Show shifts
```

**Schema Updates Needed:**
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

### **8. Communications - Telegram Bot Setup** (COMMUNICATIONS PAGE)
**Sources:**
- User feedback: "should have telegram bot setup page"
- MASTER_SPECIFICATION_FINAL.md line 298 (Telegram integration)
- GAP_ANALYSIS.md #29

**What to Add:**
```
COMMUNICATIONS PAGE - New Tab:

[Email History] [Templates] [Notification Log] [TELEGRAM] ← NEW

TELEGRAM BOT SETUP:
┌─────────────────────────────────────────────────────────┐
│ BOT STATUS: ✅ Connected                                 │
│ Bot Token: 1234567890:ABC...                            │
│ [RECONNECT BOT]                                          │
└─────────────────────────────────────────────────────────┘

EVENTS WITHOUT TELEGRAM GROUPS:
┌────────────────────────────┬─────────────┬──────────────┐
│ Event                       │ Date        │ Action       │
├────────────────────────────┼─────────────┼──────────────┤
│ ⚠️ ABC Dance Recital        │ Nov 15      │ [SETUP TG →] │
├────────────────────────────┼─────────────┼──────────────┤
│ ⚠️ XYZ Concert Coverage     │ Nov 20      │ [SETUP TG →] │
└────────────────────────────┴─────────────┴──────────────┘

TELEGRAM GROUPS (With Links):
┌────────────────────────────┬─────────────┬──────────────┐
│ Event                       │ Date        │ Group        │
├────────────────────────────┼─────────────┼──────────────┤
│ ✅ Metro Promo Shoot        │ Nov 22      │ [OPEN TG →]  │
│                             │             │ 5 members    │
└────────────────────────────┴─────────────┴──────────────┘

Research: Can Telegram embed widget for inline chat?
```

---

### **9. Operators - Card/Table Toggle + Detail View** (OPERATORS PAGE)
**Sources:**
- User feedback: "Card view/table view (i pretty much want this for every page)"
- User feedback: "We need detail view when clicked into"
- GAP_ANALYSIS.md #14 (CRUD modals)

**What to Add:**
```
OPERATORS PAGE:

[CARD VIEW] [Table View] ← Toggle

CARD VIEW:
┌─────────────────────┐ ┌─────────────────────┐
│ 👤 John Smith       │ │ 👤 Sarah Lee        │
│                     │ │                     │
│ Camera: ⭐⭐⭐⭐    │ │ Audio: ⭐⭐⭐⭐     │
│ Drone:  ⭐⭐⭐      │ │ Camera: ⭐⭐⭐       │
│                     │ │                     │
│ This Week:          │ │ This Week:          │
│ ✅ Mon-Wed          │ │ ✅ Mon-Fri          │
│ ❌ Thu-Sun          │ │ 🕐 Sat (3-6pm)      │
│                     │ │                     │
│ Upcoming: 3 events  │ │ Upcoming: 2 events  │
│ [VIEW DETAILS →]    │ │ [VIEW DETAILS →]    │
└─────────────────────┘ └─────────────────────┘

Click operator → DETAIL VIEW MODAL:
┌─────────────────────────────────────────────────────────┐
│ OPERATOR: JOHN SMITH                          [EDIT]    │
├─────────────────────────────────────────────────────────┤
│ 📧 john@streamstage.live                                │
│ 📱 555-1234                                              │
│                                                          │
│ SKILLS:                                                  │
│ Camera: ⭐⭐⭐⭐  Drone: ⭐⭐⭐                          │
│ Audio:  ⭐⭐      Editing: ⭐⭐⭐                        │
│                                                          │
│ EQUIPMENT OWNED:                                         │
│ - Sony A7S III (Personal Camera)                        │
│ - DJI Mavic Mini                                         │
│                                                          │
│ UPCOMING EVENTS (Next 30 Days):                          │
│ Nov 15: ABC Dance Recital (Camera Lead)                 │
│ Nov 20: XYZ Concert (Drone)                             │
│ Nov 22: Metro Promo (Camera + Audio)                    │
│                                                          │
│ AVAILABILITY:                                            │
│ [Calendar view showing next 2 weeks]                    │
└─────────────────────────────────────────────────────────┘
```

**Apply to All Pages:**
- Operators (as shown above)
- Gear (card shows item photo, status, next booking)
- Deliverables (card shows event poster, progress, editor)
- Pipeline (card shows client logo, last contacted, next action)

---

## 📊 MEDIUM PRIORITY

### **10. Drag-and-Drop Scheduling** (PLANNING PAGE)
**Source:** GAP_ANALYSIS.md #6

**Status:** Static table, no drag interaction

**What to Add:**
- Drag operators onto shifts
- Drag gear/kits onto events
- Visual feedback during drag (highlight drop zones)
- Conflict detection on drop (red border if double-booked)

---

### **11. Equipment Conflict Detection** (GEAR + PLANNING)
**Source:** GAP_ANALYSIS.md #7

**Status:** Visual ⚠️ only, no real-time warnings

**What to Add:**
- Real-time detection when assigning gear
- Modal warning: "Camera A already assigned to XYZ Concert 6pm-10pm"
- Show conflict on Planning calendar (red border on gear icon)
- Conflict resolution options: [REASSIGN] [SWAP] [PROCEED ANYWAY]

---

### **12. E-Transfer Recognition** (PIPELINE or DASHBOARD)
**Source:**
- GAP_ANALYSIS.md #9
- MASTER_SPECIFICATION_FINAL.md lines 201-211

**Status:** Not in mockups (backend feature)

**What to Add (Visual Only):**
- Dashboard widget: "Recent E-Transfers"
- Show pending matches: "E-transfer $500 received → Match to client?"
- Auto-matched: "✅ $500 from ABC Dance matched to Invoice #1234"

---

### **13. Tab Navigation Logic** (MULTIPLE PAGES)
**Source:** GAP_ANALYSIS.md #11

**Status:** Visual only, no show/hide content

**What to Add:**
- Active tab content visible
- Inactive tab content hidden
- Tab switching animation (fade/slide)

**Pages with tabs:**
- Communications (Email History, Templates, Notification Log, Telegram)
- Files (Proposals, Contracts, Invoices, Questionnaires)
- Gear (Inventory, Calendar, Maintenance, Kits)

---

### **14. Filters and Search** (ALL LIST PAGES)
**Source:** GAP_ANALYSIS.md #12

**Status:** Search boxes present but no filter dropdowns

**What to Add:**
- Pipeline: Filter by status, service type, date range
- Gear: Filter by status (Available, In Use, Maintenance)
- Operators: Filter by skills, availability
- Search: Real-time filter as you type

---

### **15. Sortable Tables** (ALL LIST PAGES)
**Source:** GAP_ANALYSIS.md #13

**Status:** Column headers static

**What to Add:**
- Click column header to sort
- Arrow indicators (↑ ascending, ↓ descending)
- Remember sort state

---

## 🎨 POLISH

### **16. Client Color Consistency**
**Source:** User feedback

**Schema Update:**
```sql
ALTER TABLE clients ADD COLUMN assigned_color VARCHAR(7); -- e.g., "#FF5733"
```

**Implementation:**
- Generate color on client create (consistent hash or random)
- Use same color everywhere:
  - Dashboard calendar
  - Planning calendar
  - Pipeline (colored dot next to org name)
  - Files page (colored border on proposals/contracts)

---

### **17. Notification Center** (TOP BAR)
**Source:** GAP_ANALYSIS.md #16

**What to Add:**
- Bell icon in top bar
- Badge with unread count
- Dropdown panel with recent notifications
- "Mark all as read" button

---

### **18. Export Functionality** (REPORTS PAGE)
**Source:** GAP_ANALYSIS.md #15

**What to Add:**
- [EXPORT CSV] button
- [EXPORT PDF] button
- [EXPORT TO QUICKBOOKS] button
- Date range selector for reports

---

## 📋 IMPLEMENTATION PRIORITY

### **TONIGHT (Critical - 3-4 hours):**
1. ✅ Proposal Builder (Files page)
2. ✅ Shifts (Planning page drill-down)
3. ✅ Gear Kits (Gear page new tab)
4. ✅ Deliverables updates (pre-defined services, editor column)

### **TOMORROW (High Priority - 3-4 hours):**
5. Dashboard redesign (half-width financial, pie chart, event bars, Next Actions)
6. Pipeline CRM structure (match XLSX columns)
7. Planning month view (default view, pinned weekends)
8. Telegram Bot Setup (Communications page)

### **THIS WEEK (Medium Priority - 4-5 hours):**
9. Operators card/table toggle + detail view
10. Drag-and-drop scheduling
11. Equipment conflict detection
12. Client color consistency

### **NEXT WEEK (Polish - 2-3 hours):**
13. Tab navigation logic
14. Filters and search
15. Sortable tables
16. Notification center
17. Export functionality

---

## ✅ READY TO IMPLEMENT

All requirements documented. All reference materials available:
- ✅ MASTER_SPECIFICATION_FINAL.md
- ✅ COMPLETE_PAGE_LAYOUTS.md
- ✅ schema.prisma
- ✅ UXinspo/CurrentCRM.PNG (CRM structure)
- ✅ UXinspo/GoogleMapsBars.PNG (calendar event bars)
- ✅ User feedback captured (MOCKUP_FEEDBACK_NOV11.md)
- ✅ Original gap analysis (GAP_ANALYSIS.md)

**Total Estimated Time:** 12-16 hours across 4 days

**Starting with:** Proposal Builder, Shifts, Gear Kits, Deliverables (tonight)

---

**Status:** READY TO BEGIN
