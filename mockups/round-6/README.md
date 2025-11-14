# Round 6 Mockups - CommandCentered

**Generated:** November 14, 2025
**Based on:** Spec v6.0 + Round 5 Interview Answers
**Status:** Complete (6/6 mockups)

---

## Overview

Round 6 mockups implement all decisions from the Round 5 interview (15 Q&A pairs) with full functional HTML/CSS/JS prototypes. These mockups demonstrate the CommandCentered platform's core features with the updated planning architecture, product tracking system, and customizable dashboard.

**Spec Reference:** `MASTER_SPECIFICATION_FINAL.md` v6.0
**Interview Reference:** `ROUND5_INTERVIEW_ANSWERS.md`

---

## Mockup Files

### 1. Planning Page - Month Calendar (`01-planning-calendar.html`)

**Purpose:** Demonstrate month-view calendar with 3-panel layout for event planning

**Key Features:**
- **Month calendar view** as default (Round 5 Q1 decision)
- **3-panel layout:** Operators (20%) | Kits (20%) | Calendar (60%)
- **Event bars** showing client name, operator initials, kit icons (Q3)
- **Status color-coding:** Booked, Confirmed, Tentative, Proposal
- **Alerts banner:** Missing operators/kits visibility (Q6)
- **Operator availability indicators:** Full Day, Partial Day, Unavailable
- **Kit cards:** List of configured kits with item counts

**Lines of Code:** 700
**Spec Lines:** 939-995 (Planning page architecture)

---

### 2. Event Detail Modal - Shift Builder (`02-event-detail-modal.html`)

**Purpose:** Demonstrate detailed event modal with manual + template shift builder

**Key Features:**
- **80% screen width modal** (design system standard)
- **Event information section:** Client, date, time, venue, hotel info
- **Shift Builder options:**
  - Manual shift creation (Q2)
  - Template selection (Recital, Corporate, Custom) (Q2, Q5)
  - Single-shift checkbox to skip builder (Q2)
- **Shift cards:**
  - Operator assignment with initials
  - Time range display
  - Conflict alerts (overlap-only logic) (Q4)
- **Kit assignment:**
  - Default to event (entire event) (Q12)
  - Per-shift override dropdown (Q12)
- **Smart conflict detection:** Only meaningful overlaps flagged (Q4)

**Lines of Code:** 600
**Spec Lines:** 943-976, 986-990 (Shift builder, conflicts)

---

### 3. Kit Creation Modal (`03-kit-creation-modal.html`)

**Purpose:** Demonstrate step-by-step kit creation with gear selection

**Key Features:**
- **80% screen width modal** (Q11 decision)
- **Step indicator:** Kit Info → Select Gear → Review (Q11)
- **Event-type suggestions banner:** Suggested gear for selected event type (Q9)
- **9 gear category tabs:** Cameras, Lenses, Accessories, Audio, Rigging, Lighting, Stabilizers/Gimbals, Drones, Monitors (Q10)
- **Gear checkboxes:** Select gear items with availability status (Q11)
- **Dependency reminder:** "Suggest, don't assume" pattern (Q8)
  - Example: "Cameras typically need lenses..."
  - Dismissible, gentle UX
- **Link to event checkbox:** Instant assignment to event (Q11)
- **Quick stats:** Items selected, available, conflicts

**Lines of Code:** 750
**Spec Lines:** 1212-1275 (Gear dependencies, categories, kit creation)

---

### 4. Gear Inventory (`04-gear-inventory.html`)

**Purpose:** Demonstrate full gear management with 9 categories and dependency system

**Key Features:**
- **Full page layout** (not modal)
- **Stats cards:** Total gear, available, in use, maintenance
- **Search & filter bar:** Search by name/serial, filter by status, sort options
- **9 category tabs:** Full category taxonomy (Q10)
- **Gear table:**
  - Gear image/icon
  - Name & serial number
  - Status badges (Available, In Use, Maintenance)
  - Current event link (if in use)
  - Purchase date
  - Action buttons (Edit, Delete)
- **Dependency tooltip:** Hover/click to see suggested complementary gear (Q8, Q9)
  - Example: Camera → suggests lenses, batteries, memory cards

**Lines of Code:** 650
**Spec Lines:** 1212-1239 (Gear dependencies & categories)

---

### 5. Dashboard with Customization (`05-dashboard-customization.html`)

**Purpose:** Demonstrate modular dashboard with widget customization system

**Key Features:**
- **"Customize Dashboard" button** in header (Q15)
- **6 widget types displayed:**
  1. Event Pipeline (6-stage progression)
  2. Annual Revenue (progress bar + stats)
  3. Upcoming Events (next 3 events)
  4. Quick Stats (operators, gear, kits, events)
  5. Recent Activity (timeline feed)
  6. Alerts & Notifications (action items)
- **Widget "X" button:** Small close button on hover (Q15)
- **Customization modal:**
  - Checkbox list of all widget types (Q15)
  - Widget descriptions
  - Save preferences
- **Modular grid layout:** Widgets can be different sizes (full, half, third, quarter width)

**Lines of Code:** 750
**Spec Lines:** 950-965 (Dashboard customization)

---

### 6. Pipeline with 4-Product Tracking (`06-pipeline-products.html`)

**Purpose:** Demonstrate CRM with multi-depth product tracking per client

**Key Features:**
- **Client cards layout:** Grid of detailed client cards
- **CRM fields per client:**
  - Last Contacted (Q13)
  - Next Follow-Up (Q13)
  - Contact Frequency (Q13)
- **Client status badges:** Hot Lead, Warm Lead, Cold Lead
- **4-product tracking section per client:** (Q6, Q7)
  1. Studio Sage Chatbot
  2. Dance Recital Package
  3. Competition Software
  4. Core Video Production Services
- **Multi-depth product tracking:** (Q7)
  - Checkbox (interested?)
  - Status badge (Discussing, Proposal, Won, Lost)
  - Revenue (actual or projected)
  - Notes (detailed client feedback)
- **Quick actions:** Log Contact, Send Email, View Details

**Lines of Code:** 750
**Spec Lines:** 929-950 (Product focus tracking), 1069-1082 (CRM structure)

---

## Design System Standards

All mockups follow the CommandCentered design system:

- **Color Scheme:** Tactical dark theme (slate/navy backgrounds)
- **Accent Colors:** Cyan (#06b6d4) and Purple (#a855f7) gradients
- **Typography:** Inter font family, clear hierarchy
- **Border Radius:** 8-12px for cards/modals
- **Glassmorphism:** Subtle backdrop blur effects
- **Status Colors:**
  - Green (#10b981): Confirmed, Available, Won
  - Orange (#fb923c): In Use, Tentative, Discussing
  - Red (#ef4444): Alerts, Maintenance, Lost
  - Cyan (#06b6d4): Proposal, Cold Lead

---

## Round 5 Interview Decisions Implemented

| Decision | Mockup | Feature |
|----------|--------|---------|
| Q1: Month calendar view | 01 | Month view as default, click for detail |
| Q2: Shift builder hybrid | 02 | Manual + template options |
| Q3: Calendar indicators | 01 | Operator initials + kit icons on events |
| Q4: Conflict rules | 02 | Overlap-only detection, no same-day warnings |
| Q5: Shift calculation | 02 | Manual + template hybrid |
| Q6: Major products | 06 | 4 products tracked per client |
| Q7: Product tracking | 06 | Status, revenue, notes, checkbox per product |
| Q8: Gear dependencies | 03, 04 | "Suggest, don't assume" pattern |
| Q9: Event-type suggestions | 03 | Banner with suggested gear |
| Q10: Gear categories | 03, 04 | 9 categories confirmed |
| Q11: Kit creation flow | 03 | 80% modal, step-by-step, checkboxes |
| Q12: Kit assignment logic | 02 | Event default, shift override |
| Q13: Communication touchpoints | 06 | Last Contacted, Next Follow-Up, Frequency |
| Q14: Automated emails | (not in mockups) | Backend logic only |
| Q15: Dashboard customization | 05 | Checkbox modal, modular widgets |

---

## Interactive Features

All mockups include functional JavaScript:

- **Calendar navigation:** Month switching
- **Shift builder:** Template selection, manual creation
- **Kit creation:** Category switching, gear selection
- **Product tracking:** Checkbox toggles
- **Dashboard customization:** Modal open/close, widget visibility
- **Search & filter:** Real-time filtering (demo)

---

## Usage

Open any HTML file in a modern browser to view the mockup. No server or build process required.

**Recommended browsers:**
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+

---

## Next Steps (Week 2)

1. **Schema validation:** Verify `schema.prisma` supports all mockup features
2. **API design:** Create `API_SPEC.md` with tRPC endpoint contracts
3. **Gap fixing:** Add missing tables/fields before Week 3 backend build

**Readiness:** All mockups complete. Ready for Week 2 schema validation gate.

---

## File Summary

| File | Lines | Purpose |
|------|-------|---------|
| `01-planning-calendar.html` | 700 | Month calendar with 3-panel layout |
| `02-event-detail-modal.html` | 600 | Shift builder with conflict detection |
| `03-kit-creation-modal.html` | 750 | Step-by-step kit creation |
| `04-gear-inventory.html` | 650 | Full gear management page |
| `05-dashboard-customization.html` | 750 | Modular dashboard with widgets |
| `06-pipeline-products.html` | 750 | CRM with 4-product tracking |
| **Total** | **4,200** | **6 complete mockups** |

---

**Created:** Session 49
**Spec Version:** v6.0 (95% confidence)
**Status:** ✅ Complete - Ready for Week 2 schema validation
