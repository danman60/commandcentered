# CommandCentered UX Specification - LOCKED
**Date:** 2025-11-10
**Status:** Approved for Implementation
**Purpose:** Complete UI/UX reference for development - follow to the letter

---

## 🎨 DESIGN SYSTEM

### Color Palette (Tactical Theme)
```css
/* Backgrounds */
--bg-primary: #030712;           /* Main background */
--bg-secondary: #0c1220;         /* Sidebar, cards */
--bg-tertiary: #1e293b;          /* Hover states */

/* Accents */
--accent-primary: #22d3ee;       /* Cyan - primary actions, highlights */
--accent-secondary: #06b6d4;     /* Darker cyan - borders, glows */
--accent-dark: #0e7490;          /* Darkest cyan - gradients */

/* Status Colors */
--success: #10b981;              /* Green - positive actions */
--warning: #f59e0b;              /* Orange - needs attention */
--error: #ef4444;                /* Red - critical issues */
--info: #06b6d4;                 /* Cyan - informational */

/* Event Color Bars */
--event-cyan: linear-gradient(90deg, #06b6d4, #0e7490);
--event-green: linear-gradient(90deg, #10b981, #059669);
--event-purple: linear-gradient(90deg, #8b5cf6, #6d28d9);
--event-orange: linear-gradient(90deg, #f59e0b, #d97706);
--event-pink: linear-gradient(90deg, #ec4899, #db2777);

/* Text */
--text-primary: #e2e8f0;         /* Main content */
--text-secondary: #94a3b8;       /* Labels, metadata */
--text-tertiary: #64748b;        /* Hints, placeholders */
```

### Typography
```css
/* Primary Font - Command Style */
font-family: 'Orbitron', monospace;
/* Use for: Headlines, dashboard titles, stat values, logo */

/* Secondary Font - Tactical Readable */
font-family: 'Rajdhani', monospace, sans-serif;
/* Use for: Body text, navigation, tables, forms */

/* Font Sizes */
--text-xs: 10px;     /* Metadata, timestamps */
--text-sm: 12px;     /* Labels, captions */
--text-base: 14px;   /* Body text */
--text-lg: 16px;     /* Nav items, headers */
--text-xl: 18px;     /* Section titles */
--text-2xl: 24px;    /* Page titles */
--text-3xl: 32px;    /* Stat values */
--text-4xl: 38px;    /* Hero numbers */
```

### Visual Effects
```css
/* Tactical Grid Background */
background-image:
  repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.05) 2px, rgba(6, 182, 212, 0.05) 4px),
  repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(6, 182, 212, 0.05) 2px, rgba(6, 182, 212, 0.05) 4px),
  radial-gradient(ellipse at center, #0a1628 0%, #030712 100%);
background-size: 40px 40px, 40px 40px, 100% 100%;

/* Text Glow Effect */
text-shadow:
  0 0 10px rgba(34, 211, 238, 0.8),
  0 0 20px rgba(34, 211, 238, 0.5),
  0 0 30px rgba(34, 211, 238, 0.3);

/* Border Glow */
box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);

/* Animated Pulse (for borders) */
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
```

---

## 📐 NAVIGATION STRUCTURE

### Left Sidebar Menu (Final)
```
⚡ COMMAND                    (Logo)
  StreamStage Operations      (Subtitle)

📊 Dashboard                  (Month calendar, financial, alerts)
🎯 Pipeline                   (CRM widgets, lead management)
📅 Planning                   (Scheduling, operators, equipment)
🎬 Deliverables               (Drive folders, upload tracking, questionnaires)
💬 Communications             (Email history, templates, notifications)
📄 Files                      (Proposals, contracts, invoices, questionnaires)
👷 Operators                  (Profiles, skills, availability)
📦 Gear                       (Equipment inventory, calendar)
📊 Reports                    (Revenue, utilization, exports)
⚙️ Customize                  (Widgets, notifications, templates)
🔧 Settings                   (Integrations, business info, alert center)

🎤 VOICE COMMAND              (Bottom button)
```

### Floating Voice FAB
- **Position:** Bottom-right, 80px from bottom, 40px from right
- **Size:** 64px diameter
- **Color:** Gradient cyan (#06b6d4 → #0e7490)
- **Icon:** Microphone (🎤)
- **Glow:** Pulsing cyan shadow
- **Behavior:** Always visible, click to activate voice input
- **Z-index:** 1000 (above all content)

---

## 📊 DASHBOARD (Page 1)

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│ Financial Snapshot Card (Full Width)           │
├─────────────────────────────────────────────────┤
│ Month Calendar (2/3 width) │ Critical Alerts   │
│                             │ (1/3 width)       │
├─────────────────────────────┴───────────────────┤
│ Recent Activity Feed (Full Width)               │
└─────────────────────────────────────────────────┘
```

### Financial Snapshot Card
**Layout:** Side-by-side metrics with summary
```
FINANCIAL SNAPSHOT
├─ Revenue (30d)              Outstanding
│  $24,500                    $12,750
│  ↑ +12%                     4 INVOICES
└─ NET POSITION: $37,250
```

**Color Coding:**
- Revenue: Green (#10b981)
- Outstanding: Orange (#f59e0b)
- Net Position: Cyan (#22d3ee)

### Month Calendar View
**Features:**
- ✅ Full month grid (7x5 = 35 days)
- ✅ Previous/Today/Next navigation buttons
- ✅ Today highlighted with cyan glow
- ✅ **Color-coded event bars** (5-6px height, stacked vertically)
- ✅ Previous month days at 40% opacity
- ✅ Min cell height: 120px (to fit event bars)

**Event Bar Colors:**
- Cyan: Dance recitals
- Green: Promo videos
- Purple: Concerts
- Orange: Corporate events
- Pink: Special projects

**Interaction:**
- Click day → Weekend view (Fri-Sun context)
- Click event bar → Event detail page

### Critical Alerts Panel (NEW)
**Position:** Right sidebar, below financial snapshot

**Content:**
- Equipment double-bookings
- Operator conflicts
- Missing venue addresses
- Incomplete questionnaires (< 7 days)
- Unsigned contracts (event < 14 days)
- Overdue payments

**Alert Format:**
```
⚠️ [CRITICAL/WARNING/INFO]
Title: "Equipment Conflict: Camera A"
Meta: "Nov 15 • ABC Dance + XYZ Recital"
Action: "RESOLVE →"
```

### Recent Activity Feed
**Max Items:** 5 most recent
**Item Types:**
- ✓ Success (green) - Contracts signed, payments received
- 💰 Info (cyan) - New leads, proposals sent
- ⚠️ Warning (orange) - Overdue items, incomplete data
- 🎬 Success (green) - Deliverables complete

---

## 🎯 PIPELINE PAGE (Page 2 - NEW)

### Layout Structure
```
┌────────────────────────────────────────────────┐
│ Pipeline Widgets (Grid 2x2)                   │
├────────────────────────────────────────────────┤
│ Lead Table (Full Width, Sortable/Filterable)  │
└────────────────────────────────────────────────┘
```

### Pipeline Widgets (4 Cards)
1. **New Leads** - Uncontacted (status=NEW)
2. **Active Proposals** - Sent, awaiting decision (status=SUBMITTED/REVIEWING)
3. **Pending Contracts** - Sent, not signed (status=SENT)
4. **Conversions (30d)** - Lead→Contract rate

**Widget Format:**
```
LABEL
Big Number (Orbitron font, 38px, cyan)
Change indicator (↑/↓ + percentage)
```

### Lead Table
**Columns:**
- Organization Name
- Contact Name
- Service Type
- Lead Status (badge)
- Last Contacted
- Quick Actions (Email, Call, Convert)

**Filters:**
- Status (NEW, CONTACTED, QUALIFIED, CONVERTED, LOST)
- Service Type
- Date Range

**Default View:** Active only (status != LOST)

---

## 📅 PLANNING PAGE (Page 3)

### Layout Tabs
```
[ Calendar View ] [ Operator Availability ] [ Equipment Schedule ]
```

### Calendar View
**Type:** Week view with drag-and-drop
**Rows:** Operators (y-axis)
**Columns:** Days of week (x-axis)
**Cells:** Event blocks (draggable)

**Event Block Format:**
```
┌──────────────────────┐
│ 2:00 PM - 6:00 PM   │
│ ABC Dance Recital    │
│ 📷 Camera A, Drone   │
│ ⚠️ Missing address  │
└──────────────────────┘
```

**Warning Indicators:**
- ⚠️ Yellow border: Missing info
- 🔴 Red border: Conflict detected
- ✅ Green border: Fully ready

### Operator Availability (Doodle-style)
**Layout:** Grid (operators × dates)
**Cell States:**
- ✅ Available (green)
- 🕐 Partial (yellow) - with time slots
- ❌ Unavailable (red)
- ⚪ No response (gray)

### Equipment Schedule
**Layout:** Timeline (equipment × dates)
**Shows:** Assigned events per equipment item
**Highlights:** Double-bookings in red

---

## 🎬 DELIVERABLES PAGE (Page 4)

### Layout Structure
```
┌────────────────────────────────────────────────┐
│ Deliverables Table                             │
│ (Grouped by Event)                             │
├────────────────────────────────────────────────┤
│ Questionnaires Section (NEW)                   │
│ (Incomplete questionnaires with reminders)     │
└────────────────────────────────────────────────┘
```

### Deliverables Table
**Columns:**
- Event Name
- Service Type
- Drive Folder (link)
- Status (In Progress, Review, Delivered)
- Delivery Date
- Actions (Upload, Notify Client)

### Questionnaires Section
**Shows:**
- Events with incomplete questionnaires
- Days until event
- Last reminder sent
- Action: "Send Reminder" button

**Alert Colors:**
- Green: >14 days until event
- Orange: 7-14 days until event
- Red: <7 days until event

---

## 💬 COMMUNICATIONS PAGE (Page 5 - NEW)

### Layout Tabs
```
[ Email History ] [ Templates ] [ Notification Log ]
```

### Email History
**View:** Timeline of all sent/received emails
**Filters:** Lead/Client, Date Range, Email Type
**Actions:** Reply, Forward, Archive

### Templates
**Categories:**
- Proposal emails
- Contract emails
- Reminder emails
- Questionnaire requests
- Delivery notifications

**Template Editor:**
- Handlebars syntax
- Variable preview
- Test send

### Notification Log
**Shows:** All automated notifications sent
**Types:** Email, SMS, Telegram, In-app

---

## 📄 FILES PAGE (Page 6)

### Layout Tabs
```
[ Proposals ] [ Contracts ] [ Invoices ] [ Questionnaires ]
```

### Proposals Tab
**View:** Table + Builder
**Table Columns:** Client, Service Type, Amount, Status, Date Sent
**Builder:** 3-column layout (Elements | Canvas | Preview)

### Contracts Tab
**View:** Table + Viewer/Editor
**Features:** Multi-date contract support, audit trail, SignWell integration

### Invoices Tab
**View:** Table + Payment Tracker
**Features:** Stripe integration, E-transfer recognition, payment milestones

### Questionnaires Tab (NEW)
**Management Interface:**
- Configure questions per service type
- View completed questionnaires
- Download responses as CSV

---

## 👷 OPERATORS PAGE (Page 7)

### Layout Structure
```
┌────────────────────────────────────────────────┐
│ Operator Roster Table                          │
├────────────────────────────────────────────────┤
│ Skills Matrix (Expandable)                     │
└────────────────────────────────────────────────┘
```

### Operator Roster
**Columns:**
- Name
- Skills (badges)
- Equipment Proficiency
- Availability This Week
- Quick Actions (Edit, View Schedule, Message)

### Skills Matrix
**View:** Grid (operators × skills)
**Levels:** Beginner, Intermediate, Advanced, Expert

---

## 📦 GEAR PAGE (Page 8)

### Layout Tabs
```
[ Inventory ] [ Calendar ] [ Maintenance Log ]
```

### Inventory Tab
**View:** Table with categories
**Categories:** Cameras, Drones, Audio, Lighting, Accessories
**Columns:** Item Name, Category, Status, Assigned To, Last Maintenance

### Calendar Tab
**View:** Timeline (equipment × dates)
**Shows:** Event assignments, double-bookings in red

---

## 📊 REPORTS PAGE (Page 9)

### Layout Structure
```
┌────────────────────────────────────────────────┐
│ Filter Bar (Date Range, Service Type, Client) │
├────────────────────────────────────────────────┤
│ Revenue Charts (2x2 Grid)                      │
├────────────────────────────────────────────────┤
│ Export Buttons (CSV, PDF, QuickBooks)          │
└────────────────────────────────────────────────┘
```

### Revenue Charts
1. **Monthly Revenue** - Bar chart (last 12 months)
2. **By Service Type** - Pie chart
3. **By Client** - Table (top 10)
4. **Payment Status** - Donut chart (Paid, Pending, Overdue)

---

## ⚙️ CUSTOMIZE PAGE (Page 10)

### Layout Tabs
```
[ Dashboard Widgets ] [ Notifications ] [ Templates ] [ Alerts ]
```

### Dashboard Widgets Tab
**Feature:** Drag-and-drop widget configuration
**Available Widgets:**
- Financial Snapshot
- Month Calendar
- Critical Alerts
- Recent Activity
- New Leads
- Active Proposals
- Pending Contracts
- Upcoming Events
- Incomplete Questionnaires
- Overdue Payments

### Notifications Tab
**Configure:**
- Email notification routing
- SMS notification preferences
- Telegram notification types
- In-app notification settings

### Alerts Tab
**Configure:**
- Alert thresholds (days before event)
- Questionnaire reminder cadence
- Equipment conflict warnings
- Operator double-booking alerts

---

## 🔧 SETTINGS PAGE (Page 11)

### Layout Tabs
```
[ Integrations ] [ Business Profile ] [ Alert Center ] [ Account Security ]
```

### Alert Center Tab (NEW)
**Shows:** All system warnings/overrides
**Features:**
- Override history
- Warning configuration
- Critical alert escalation settings

---

## 🎤 VOICE INTERFACE

### Floating Action Button (FAB)
**Position:** Fixed, bottom-right (80px bottom, 40px right)
**Size:** 64px diameter
**Style:**
```css
background: linear-gradient(135deg, #06b6d4, #0e7490);
border: 2px solid rgba(6, 182, 212, 0.6);
box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);
animation: pulse 2s ease-in-out infinite;
```

### Voice Command Modal
**Trigger:** Click FAB
**Layout:** Full-screen overlay with centered command input
**Features:**
- Real-time transcription
- Command preview
- Confirmation for destructive actions
- Command history (last 10)

---

## 🚨 WARNING/OVERRIDE SYSTEM

### Display Pattern
**Inline Warnings:** Appear contextually where triggered
**Format:**
```
┌────────────────────────────────────┐
│ ⚠️ [LEVEL]                        │
│ Warning Message Here               │
│                                    │
│ [OVERRIDE ANYWAY] [CANCEL]        │
└────────────────────────────────────┘
```

**Levels:**
- 🔵 INFO - FYI only
- 🟡 WARNING - Potential issue
- 🔴 CRITICAL - Serious problem
- ❌ NEVER "ERROR" or "BLOCK"

**Commander Override:** All warnings can be dismissed with "OVERRIDE ANYWAY" button

---

## 📱 RESPONSIVE DESIGN

### Desktop (>1440px)
- Sidebar: 260px fixed width
- Main content: Flex 1
- Grid layouts: 2-3 columns

### Tablet (768px - 1440px)
- Sidebar: Collapsible
- Grid layouts: 2 columns
- Calendar: Week view default

### Mobile (<768px)
- Sidebar: Hidden, hamburger menu
- Grid layouts: 1 column
- Calendar: Day view default
- Voice FAB: 56px diameter

---

## ✅ IMPLEMENTATION CHECKLIST

When building, verify:
- [ ] Color palette matches exactly (#030712, #22d3ee, etc.)
- [ ] Fonts: Orbitron for headers, Rajdhani for body
- [ ] Tactical grid background on all pages
- [ ] Cyan glow effects on hover/focus
- [ ] Voice FAB always visible (z-index: 1000)
- [ ] Month calendar with color-coded event bars
- [ ] Critical Alerts panel on dashboard
- [ ] Pipeline page with 4 CRM widgets
- [ ] Communications page between Deliverables and Files
- [ ] Questionnaires in Files page
- [ ] Alert Center in Settings page
- [ ] All warnings allow override
- [ ] Responsive breakpoints at 768px and 1440px

---

**This document is the source of truth for UI/UX implementation. Follow to the letter.**
