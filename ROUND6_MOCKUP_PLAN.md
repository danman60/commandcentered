# Round 6 Mockup Plan - Based on Spec v6.0

**Date:** November 14, 2025
**Purpose:** Generate mockups incorporating all Round 5 interview decisions
**Status:** Planning Phase

---

## OVERVIEW

**Objective:** Create 6 comprehensive HTML mockups implementing all Round 5 interview answers

**Spec Reference:** MASTER_SPECIFICATION_FINAL.md v6.0
**Interview Reference:** ROUND5_INTERVIEW_ANSWERS.md (15 Q&A)

**Completion Target:** Session 48 (tonight)

---

## MOCKUP PRIORITY ORDER

### Priority 1: Core Planning Experience (CRITICAL)
1. **Planning Page - Month Calendar View** ✅ COMPLETE
2. **Event Detail Modal** - Shift Builder (Manual + Template)

### Priority 2: Resource Management (HIGH)
3. **Kit Creation Modal** - 80% Width, Gear Checkboxes
4. **Gear Page** - 9 Categories, Dependency Suggestions

### Priority 3: Business Operations (MEDIUM)
5. **Dashboard** - Customization Button, Widget System
6. **Pipeline Page** - 4-Product Tracking

---

## DETAILED MOCKUP SPECIFICATIONS

### ✅ 1. Planning Page - Month Calendar View (COMPLETE)

**Status:** ✅ Created - `mockups/round-6/01-planning-calendar.html`

**Implemented Features:**
- [x] 3-panel layout (Operators 20% | Kits 20% | Calendar 60%)
- [x] Month view as default calendar
- [x] Event bars with client name
- [x] Operator initials displayed (JD, ST, MK)
- [x] Kit icons displayed (📷, 🎥)
- [x] Event color by status (Booked=Blue, Pending=Yellow, Completed=Green)
- [x] Alerts banner (events missing operators/kits)
- [x] Operator availability indicators (Available, Partial 2-6 PM, Unavailable)
- [x] Kit cards with item lists
- [x] Click event opens detail modal (alert placeholder)
- [x] View toggle icons (Card/Table/Calendar)
- [x] Full screen button
- [x] Legend with status meanings

**Spec References:**
- Planning Page (lines 939-995)
- Calendar Indicators (Q3)
- Alerts for Missing Assignments

**Lines:** ~700 lines HTML/CSS/JS

---

### 🔄 2. Event Detail Modal - Shift Builder

**File:** `mockups/round-6/02-event-detail-modal.html`

**Round 5 Decisions to Implement:**
- ✅ **Q1 Answer:** Detailed modal opens on event click (not tooltip)
- ✅ **Q2 Answer:** Shift Builder with Manual + Template hybrid options
- ✅ **Q4 Answer:** Smart conflict detection (overlap-only)
- ✅ **Q5 Answer:** Manual shift creation OR templates
- ✅ **Q12 Answer:** Kit defaults to event all day, can override per shift

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                    Event Detail Modal (80%)                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Event Information                                    │  │
│  │ - Client: EMPWR Dance                               │  │
│  │ - Date: Dec 6-7, 2025                               │  │
│  │ - Location: Blue Mountain Resort                    │  │
│  │ - Hotel: Grand Hotel, Check-in: 3 PM               │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Shift Builder                                        │  │
│  │                                                      │  │
│  │ Event Hours: 2 PM - 10 PM                          │  │
│  │                                                      │  │
│  │ [Create Shifts:] [Manual] [Use Template ▼]        │  │
│  │                                                      │  │
│  │ Template Options:                                   │  │
│  │ - Recital: Setup / Event / Teardown               │  │
│  │ - Corporate: Full Day Coverage                     │  │
│  │ - Custom: Define manually                          │  │
│  │                                                      │  │
│  │ Single-shift event?                                │  │
│  │ [√] Skip shift builder (assign to whole event)    │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Shifts (if not single-shift)                        │  │
│  │                                                      │  │
│  │ Shift 1: Setup (2 PM - 4 PM)                       │  │
│  │ - Operators: [JD ▼] [+ Add]                        │  │
│  │                                                      │  │
│  │ Shift 2: Event (4 PM - 8 PM)                       │  │
│  │ - Operators: [JD ▼] [ST ▼] [+ Add]                │  │
│  │ - ⚠️ CONFLICT: JD overlaps with XYZ event         │  │
│  │                                                      │  │
│  │ Shift 3: Teardown (8 PM - 10 PM)                   │  │
│  │ - Operators: [ST ▼] [+ Add]                        │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Kit Assignment                                       │  │
│  │                                                      │  │
│  │ Default for entire event: [Recital Kit A ▼]       │  │
│  │                                                      │  │
│  │ Override per shift?                                │  │
│  │ Shift 1: [Use default]                            │  │
│  │ Shift 2: [Use default]                            │  │
│  │ Shift 3: [Recital Kit B ▼] (override)            │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Conflicts (Smart Detection)                         │  │
│  │                                                      │  │
│  │ ⚠️ John Davis (JD) - Shift 2 overlaps with:       │  │
│  │    • XYZ Corporate (Dec 6, 4-6 PM)                 │  │
│  │                                                      │  │
│  │ ⚠️ Recital Kit A - Double-booked:                 │  │
│  │    • Impact Studios (Dec 6, 3-7 PM)                │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│              [Cancel]  [Save Event]                        │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- 80% screen width modal
- Event info section (client, date, location, hotel)
- Shift Builder with two modes:
  - Manual: Define event hours, create shifts manually
  - Template: Choose from "Recital: Setup/Event/Teardown", "Corporate", etc.
- Single-shift option (checkbox to skip shift builder)
- Operator assignment per shift (dropdowns)
- Kit assignment (default to event, override per shift)
- Conflict detection panel (red highlights)
  - Only shows overlapping shifts (not same-day non-overlapping)
  - Shows operator name + conflicting event
  - Shows kit conflicts
- Save/Cancel buttons

**Spec References:**
- Event Detail View (lines 952-959)
- Shift Builder (lines 961-968)
- Conflict Detection (lines 978-984)
- Kit Assignment Logic (Q12 answer)

**Estimated Lines:** ~600 lines

---

### 🔄 3. Kit Creation Modal - 80% Width

**File:** `mockups/round-6/03-kit-creation-modal.html`

**Round 5 Decisions to Implement:**
- ✅ **Q11 Answer:** Step-by-step kit creation flow
- ✅ **Q10 Answer:** 9 gear categories
- ✅ **Q8 Answer:** "Suggest, don't assume" pattern
- ✅ **Q9 Answer:** Event-type gear suggestions

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                   Create Kit Modal (80%)                    │
│                                                             │
│  Step 1: Kit Information                                   │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Kit Name: [________________]                        │  │
│  │ Event: [EMPWR Dance - Dec 6 ▼]                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Step 2: Select Gear                                       │
│                                                             │
│  💡 Suggested for Dance Recital:                          │
│  [Accept All] [Dismiss]                                   │
│  - 2x Sony A7S III (Cameras)                              │
│  - 1x Wireless Audio System (Audio)                       │
│  - 2x LED Panel (Lighting)                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ [Cameras] [Lenses] [Audio] [Rigging] [Lighting]    │  │
│  │ [Stabilizers] [Drones] [Monitors] [Accessories]    │  │
│  │                                                      │  │
│  │ Search: [________________] 🔍                       │  │
│  │                                                      │  │
│  │ Cameras (3 available)                               │  │
│  │ ☐ Sony A7S III #1  [Available]                     │  │
│  │ ☐ Sony A7S III #2  [Available]                     │  │
│  │ ☐ Canon R5        [In Use - Dec 6]                 │  │
│  │                                                      │  │
│  │ Lenses (5 available)                                │  │
│  │ ☐ 24-70mm f/2.8    [Available]                     │  │
│  │ ☐ 70-200mm f/2.8   [Available]                     │  │
│  │ ☐ 50mm f/1.4       [Available]                     │  │
│  │                                                      │  │
│  │ ... (scrollable list)                               │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Selected Items (5):                                       │
│  • Sony A7S III #1 • 24-70mm f/2.8 • Wireless Audio       │
│  • LED Panel #1 • LED Panel #2                            │
│                                                             │
│  💡 Sony A7S III requires:                                │
│  [Add to Kit] Lens, Battery, SD Card                      │
│                                                             │
│              [Cancel]  [Create Kit]                        │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- 80% screen width modal
- Two-step flow: Kit Info → Select Gear
- Kit name input
- Event dropdown (links kit to specific event)
- **Event-type suggestions** (top section)
  - Shows recommended gear for event type
  - "Accept All" or "Dismiss" buttons
- **9 category tabs** (Cameras, Lenses, Accessories, Audio, Rigging, Lighting, Stabilizers/Gimbals, Drones, Monitors)
- Search bar (filters items)
- Checkboxes for each gear item
- Availability status per item (Available, In Use, Needs Repair)
- Selected items summary
- **"Suggest, don't assume" dependency reminder**
  - Shows when camera selected: "Sony A7S III requires: Lens, Battery, SD Card"
  - "Add to Kit" button (user decides, not automatic)
- Create Kit / Cancel buttons

**Spec References:**
- Kit Creation Flow (lines 1250-1262)
- Gear Categories (lines 1212-1221)
- Gear Dependencies (lines 1223-1232)
- Event-Type Gear Suggestions (lines 1234-1239)

**Estimated Lines:** ~700 lines

---

### 🔄 4. Gear Page - 9 Categories & Dependencies

**File:** `mockups/round-6/04-gear-inventory.html`

**Round 5 Decisions to Implement:**
- ✅ **Q10 Answer:** 9 gear categories
- ✅ **Q8 Answer:** "Suggest, don't assume" dependency pattern
- ✅ **Q9 Answer:** Event-type recommendations

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Gear Inventory                                             │
│                                                             │
│  [All] [Cameras] [Lenses] [Accessories] [Audio]           │
│  [Rigging] [Lighting] [Stabilizers] [Drones] [Monitors]   │
│                                                             │
│  View: [📊] [📋]  Filter: [Available ▼]  [+ Add Gear]    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Cameras (12 items)                                  │  │
│  │                                                      │  │
│  │ ┌──────────────────────────────────────────────┐  │  │
│  │ │ Sony A7S III #1                              │  │  │
│  │ │ Status: ✓ Perfect                            │  │  │
│  │ │ Last Used: Dec 6, 2025 (EMPWR Dance)        │  │  │
│  │ │ Location: Studio A                           │  │  │
│  │ │ Next Maintenance: Jan 15, 2026              │  │  │
│  │ │                                              │  │  │
│  │ │ 💡 Requires: Lens, Battery, SD Card         │  │  │
│  │ │ [View Dependencies]                         │  │  │
│  │ └──────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │ ┌──────────────────────────────────────────────┐  │  │
│  │ │ Canon R5                                     │  │  │
│  │ │ Status: ⚠️ Needs Repair                     │  │  │
│  │ │ Issue: HDMI port loose                      │  │  │
│  │ │ Can be used: Yes (use adapters)             │  │  │
│  │ │ Last Used: Nov 28, 2025                     │  │  │
│  │ │ [Schedule Repair]                           │  │  │
│  │ └──────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │ ┌──────────────────────────────────────────────┐  │  │
│  │ │ Sony A7 IV                                   │  │  │
│  │ │ Status: ❌ Unusable                         │  │  │
│  │ │ Issue: Sensor damage                        │  │  │
│  │ │ Cannot be used: Awaiting repair             │  │  │
│  │ │ [View Repair History]                       │  │  │
│  │ └──────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Event-Type Recommendations:                               │
│  [View All] [Edit]                                         │
│                                                             │
│  Dance Recital:                                            │
│  • 2x Cameras (Sony A7S III or Canon R5)                  │
│  • 1x Wireless Audio System                               │
│  • 2x LED Panels                                           │
│                                                             │
│  Corporate Event:                                          │
│  • 1x Camera + Gimbal                                      │
│  • 1x Wireless Lav Mic                                     │
│  • 1x LED Panel                                            │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- **9 category tabs** (All + 9 specific categories)
- View toggle (Card/Table)
- Filter by status (Available, Needs Repair, Unusable)
- Gear cards showing:
  - Item name + ID
  - Status indicator (✓ Perfect, ⚠️ Needs Repair, ❌ Unusable)
  - Status explanation
  - Last used date + event
  - Location
  - Next maintenance date
- **Dependency information** per item
  - "💡 Requires: Lens, Battery, SD Card"
  - "View Dependencies" button
  - **"Suggest, don't assume" pattern** - informational only
- Maintenance tracking
  - "Schedule Repair" button for items needing repair
  - "View Repair History" link
- **Event-Type Recommendations section** (bottom)
  - Shows recommended gear lists per event type
  - "View All" / "Edit" buttons

**Spec References:**
- Gear Categories (lines 1212-1221)
- Gear Dependencies (lines 1223-1232)
- Event-Type Gear Suggestions (lines 1234-1239)
- Gear Status Indicators (lines 1146-1165)

**Estimated Lines:** ~650 lines

---

### 🔄 5. Dashboard - Customization System

**File:** `mockups/round-6/05-dashboard-customizable.html`

**Round 5 Decisions to Implement:**
- ✅ **Q15 Answer:** "Customize Dashboard" button with checkbox modal
- ✅ **Q15 Answer:** 6 widget types (Event Pipeline, Annual Revenue, Upcoming Events, Communications Timeline, Critical Alerts, Revenue by Product Focus)
- ✅ **Spec:** Drag/drop/resize cards
- ✅ **Spec:** Small "X" button to hide widgets

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                    [Customize Dashboard] [⚙️]    │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐       │
│  │ Event Pipeline    [X]│  │ Annual Revenue   [X]│       │
│  │                      │  │                      │       │
│  │ Proposal Sent: 3    │  │ $125,000 / $200,000 │       │
│  │ Contract Signed: 5  │  │ ████████░░░░  62%   │       │
│  │ Deposit Paid: 4     │  │                      │       │
│  │ Confirmed: 8        │  │ Nov: $45k           │       │
│  │ Completed: 12       │  │ Dec: $32k (so far)  │       │
│  │ Delivered: 15       │  │                      │       │
│  │ [View Pipeline →]   │  │ [View Details →]    │       │
│  └──────────────────────┘  └──────────────────────┘       │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Upcoming Events                                [X]│   │
│  │                                                    │   │
│  │ Dec 6-7: EMPWR Dance (2 days)                    │   │
│  │ Dec 13-14: Glow Dance (2 days) ⚠️ Missing ops   │   │
│  │ Dec 20: XYZ Corporate                            │   │
│  │ Dec 28: New Year Concert                         │   │
│  │                                                    │   │
│  │ [View Calendar →]                                │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐       │
│  │ Critical Alerts  [X]│  │ Comms Timeline   [X]│       │
│  │                      │  │                      │       │
│  │ ⚠️ 3 events missing │  │ Today:              │       │
│  │    operators         │  │ • Contract sent     │       │
│  │ ⚠️ 2 events missing │  │   (ABC Corp)        │       │
│  │    kits              │  │                      │       │
│  │ ⚠️ 1 proposal       │  │ Yesterday:          │       │
│  │    expires in 2 days │  │ • Proposal sent     │       │
│  │                      │  │   (XYZ Inc)         │       │
│  │ [View All →]        │  │                      │       │
│  └──────────────────────┘  │ [View Timeline →]   │       │
│                             └──────────────────────┘       │
└─────────────────────────────────────────────────────────────┘

Customize Dashboard Modal (when button clicked):
┌──────────────────────────────────────┐
│ Customize Dashboard                  │
│                                      │
│ Select widgets to display:          │
│                                      │
│ ☑ Event Pipeline                    │
│ ☑ Annual Revenue                    │
│ ☑ Upcoming Events                   │
│ ☑ Communications Timeline            │
│ ☑ Critical Alerts                   │
│ ☐ Revenue by Product Focus (NEW)   │
│                                      │
│ Tip: You can also click the X       │
│ on any widget to hide it.           │
│                                      │
│          [Cancel]  [Save]           │
└──────────────────────────────────────┘
```

**Key Features:**
- **"Customize Dashboard" button** in header
- **Widget cards** with features:
  - Drag handles (implied, visual indicator)
  - Resize handles (corners)
  - Small "X" button top-right (hide widget)
  - Card shadow and hover effects
- **6 widget types:**
  1. Event Pipeline (6-stage progress)
  2. Annual Revenue (progress bar, month comparison)
  3. Upcoming Events (next 7 days list)
  4. Communications Timeline (recent touchpoints)
  5. Critical Alerts (warnings panel)
  6. Revenue by Product Focus (future - greyed out in modal)
- **Customization Modal:**
  - Checkbox list for each widget type
  - Check/uncheck to show/hide
  - "Cancel" / "Save" buttons
  - Opens when "Customize Dashboard" clicked
- **Grid layout** with flexible positioning
- **Modular architecture** note (can add new widget types)

**Spec References:**
- Dashboard Cards (lines 49-89)
- Widget Customization Modal (lines 77-89)
- Event Pipeline Visualization (lines 1516-1531)
- Annual Revenue Summary (lines 1505-1514)

**Estimated Lines:** ~750 lines

---

### 🔄 6. Pipeline Page - 4-Product Tracking

**File:** `mockups/round-6/06-pipeline-products.html`

**Round 5 Decisions to Implement:**
- ✅ **Q6-Q7 Answer:** 4 major products tracked per client
- ✅ **Q6-Q7 Answer:** Multi-depth tracking (status, revenue, notes per product)
- ✅ **Spec:** Click-to-edit all fields

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Pipeline - CRM                                             │
│                                                             │
│  View: [All Clients ▼]  Filter: [Product ▼] [Status ▼]   │
│  [+ New Lead]                                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Contact  │ Company │ Primary │ Status │ Revenue │...│  │
│  │          │         │ Product │        │         │   │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │ John Doe │ ABC     │ Dance   │ Active │ $5,000  │...│  │
│  │          │ Studios │ Recital │        │         │   │  │
│  │          │         │ Package │        │         │   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Click row to expand:                                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ABC Studios - Product Tracking                      │  │
│  │                                                      │  │
│  │ ┌──────────────────────────────────────────────┐  │  │
│  │ │ Studio Sage Chatbot              ☑ Interested│  │  │
│  │ │ Status: [Contacted ▼]                        │  │  │
│  │ │ Revenue: [$______]                           │  │  │
│  │ │ Notes: [Waiting for budget approval...    ] │  │  │
│  │ │                                              │  │  │
│  │ │ Not Interested → Contacted → Proposal Sent →│  │  │
│  │ │ Active → Completed                           │  │  │
│  │ └──────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │ ┌──────────────────────────────────────────────┐  │  │
│  │ │ Dance Recital Package           ☑ Interested│  │  │
│  │ │ Status: [Active ▼]                          │  │  │
│  │ │ Revenue: [$5,000]                           │  │  │
│  │ │ Notes: [Annual contract signed...        ] │  │  │
│  │ │                                              │  │  │
│  │ │ Progress: ████████████░░  Active            │  │  │
│  │ └──────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │ ┌──────────────────────────────────────────────┐  │  │
│  │ │ Competition Software            ☐ Interested│  │  │
│  │ │ Status: [Not Interested ▼]                  │  │  │
│  │ │ (disabled, greyed out)                       │  │  │
│  │ └──────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │ ┌──────────────────────────────────────────────┐  │  │
│  │ │ Core Video Production          ☑ Interested│  │  │
│  │ │ Status: [Completed ▼]                       │  │  │
│  │ │ Revenue: [$3,200]                           │  │  │
│  │ │ Notes: [Delivered highlight reel...      ] │  │  │
│  │ └──────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │ Total Revenue (ABC Studios): $8,200                │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Pipeline table view (collapsed by default)
- Shows primary product per client in table
- **Click row to expand** → shows all 4 products
- **4 product cards per client:**
  1. Studio Sage Chatbot
  2. Dance Recital Package
  3. Competition Software
  4. Core Video Production Services
- **Per-product tracking:**
  - "Interested" checkbox (visual indicator)
  - Status dropdown (Not Interested → Contacted → Proposal Sent → Active → Completed)
  - Revenue input field
  - Notes textarea
  - Progress bar (visual status)
- **All fields click-to-edit** (inline editing)
  - Click field → edit mode
  - Blur or Enter → saves to database
  - Applies to: Contact Name, Company, Status, Revenue, Notes
- **Filters:**
  - Filter by product focus
  - Filter by status within product
  - Combined filters
- Total revenue calculation per client (sum of all products)
- **UI Design:**
  - Product cards with checkboxes
  - Greyed out when "Not Interested" unchecked
  - Color-coded status progress bars

**Spec References:**
- Product Focus Tracking (lines 929-950)
- Click-to-Edit Fields (lines 918-926)
- Multi-Depth Tracking (Q6-Q7 answers)

**Estimated Lines:** ~700 lines

---

## IMPLEMENTATION NOTES

### Design System Consistency
All mockups use:
- **Color Palette:** Tactical dark theme with cyan/purple gradients
- **Typography:** -apple-system, BlinkMacSystemFont, 'Segoe UI'
- **Spacing:** 4px base unit (4, 8, 12, 16, 20, 24, 32px)
- **Border Radius:** 6px (buttons), 8px (cards), 12px (modals)
- **Shadows:** Subtle glows with brand colors
- **Glassmorphism:** backdrop-filter: blur(10px) on panels

### Modal Standards
- **80% screen width** for data-heavy modals
- **Centered vertically**
- **Overlay with backdrop blur**
- **ESC key to close**
- **Click overlay to close**
- **Save/Cancel buttons bottom-right**

### Interaction Patterns
- **Hover effects:** translateY(-1px) or translateX(2px)
- **Active states:** Background color change + border highlight
- **Disabled states:** opacity: 0.5 + pointer-events: none
- **Loading states:** Spinner + "Loading..." text
- **Click feedback:** Scale transform or box-shadow pulse

### Accessibility
- **ARIA labels** on all interactive elements
- **Keyboard navigation** support (Tab, Enter, ESC)
- **Screen reader** friendly labels
- **Color contrast** WCAG AA compliant
- **Focus indicators** visible on keyboard focus

---

## FILE NAMING CONVENTION

```
mockups/round-6/
├── 01-planning-calendar.html          ✅ COMPLETE
├── 02-event-detail-modal.html         🔄 TODO
├── 03-kit-creation-modal.html         🔄 TODO
├── 04-gear-inventory.html             🔄 TODO
├── 05-dashboard-customizable.html     🔄 TODO
├── 06-pipeline-products.html          🔄 TODO
└── README.md                           🔄 TODO (summary)
```

---

## ROUND 6 SUMMARY FEATURES

### What's New from Round 5 Interview:
1. ✅ **Planning Page:** Month view default, operator initials, kit icons on event bars
2. 🔄 **Event Detail:** Shift builder (manual + template), smart conflict detection
3. 🔄 **Kit Creation:** 80% modal, gear checkboxes, event-type suggestions, dependency reminders
4. 🔄 **Gear Page:** 9 categories, "suggest don't assume" dependencies, status indicators
5. 🔄 **Dashboard:** Customization button, 6 widgets, drag/drop/resize, small X buttons
6. 🔄 **Pipeline:** 4-product tracking, multi-depth per client, click-to-edit fields

### Spec v6.0 Compliance:
- All 15 Round 5 interview answers implemented
- All page-specific requirements (lines 909-1278) covered
- UI/UX customization architecture (lines 42-238) demonstrated
- Multi-tenant safe (no hard-coded data)

---

## ESTIMATED COMPLETION TIME

**Per Mockup:** 30-45 minutes
**Total for 5 remaining:** 2.5-3.5 hours

**Schedule:**
- Mockup 2 (Event Detail): 45 min
- Mockup 3 (Kit Creation): 40 min
- Mockup 4 (Gear Page): 35 min
- Mockup 5 (Dashboard): 40 min
- Mockup 6 (Pipeline): 40 min
- README + Commit: 20 min

**Total:** ~3.5 hours

---

## SUCCESS CRITERIA

### Mockup Quality Checklist (Per File)
- [ ] Implements all relevant Round 5 decisions
- [ ] References spec v6.0 line numbers in comments
- [ ] Consistent with design system
- [ ] Tactical aesthetic maintained
- [ ] Interactive elements have click handlers (alerts for demo)
- [ ] Responsive layout (works at 1440px+ screens)
- [ ] Clean HTML structure
- [ ] Organized CSS (grouped by section)
- [ ] Comments explaining key sections
- [ ] No console errors

### Set Completion Checklist
- [ ] All 6 mockups created
- [ ] README.md with overview and links
- [ ] Consistent naming convention
- [ ] All files committed to repo
- [ ] Session documentation updated

---

## NEXT STEPS

1. **Continue Generation:** Create mockups 2-6 in sequence
2. **Review:** Quick visual check of each mockup in browser
3. **Document:** Create README.md summarizing Round 6 mockups
4. **Commit:** Single commit with all 6 mockups
5. **Update Trackers:** Add Round 6 completion to PROJECT_STATUS.md

---

**Plan Status:** ✅ READY FOR EXECUTION
**Current Progress:** 1/6 mockups complete (17%)
**Next Action:** Generate mockup 2 (Event Detail Modal)

---

**Document Created:** November 14, 2025
**Last Updated:** November 14, 2025
**Session:** 48 - CommandCentered Round 6 Mockups
