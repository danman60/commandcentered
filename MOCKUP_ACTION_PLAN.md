# CommandCentered Mockup Action Plan
**Date:** November 17, 2025
**Goal:** Create/update mockups to 100% represent MASTER_SPECIFICATION_FINAL.md v6.0

---

## 🚨 PRIORITY 1: Create Missing Main Dashboard

### 00-dashboard.html (NEW - HIGHEST PRIORITY)

**Why Critical:** User specifically mentioned dashboard missing calendar color bars for events

**Must Include:**

```
┌──────────────────────────────────────────────────────────────┐
│  CommandCentered Dashboard                                    │
│  [Customize Dashboard]                        [🎤 Voice]      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐  ┌──────────────────────────────┐  │
│  │ EVENT PIPELINE   [x]│  │ ANNUAL REVENUE         [x]  │  │
│  │                     │  │                            │  │
│  │ Proposal Sent: 3    │  │ YTD: $125,430             │  │
│  │ Contract Signed: 2  │  │ Goal: $200,000            │  │
│  │ Deposit Paid: 2     │  │ ████████████░░░ 63%       │  │
│  │ Event Confirmed: 5  │  │                            │  │
│  │ Completed: 8        │  │ Month over Month:          │  │
│  │ Delivered: 6        │  │ Nov: $18,500 ▲ +15%       │  │
│  └─────────────────────┘  └──────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ UPCOMING EVENTS (Next 7 Days)                      [x]  │ │
│  │                                                          │ │
│  │ Dec 6-7: EMPWR Dance Recital                           │ │
│  │ ├─ 📍 Blue Mountain Resort                             │ │
│  │ ├─ 👥 JD, ST (operators) | 📷 Kit A, Kit B            │ │
│  │ └─ ⚠️ Missing hotel info                              │ │
│  │                                                          │ │
│  │ Dec 8: Glow Dance Competition                          │ │
│  │ ├─ 📍 Toronto Convention Centre                        │ │
│  │ ├─ 👥 MK, AL (operators) | 📷 Kit C                   │ │
│  │ └─ ✅ Fully scheduled                                  │ │
│  │                                                          │ │
│  │ Dec 9: Corporate Holiday Party                         │ │
│  │ ├─ 📍 Client Office                                    │ │
│  │ ├─ 👥 ❌ No operators assigned                        │ │
│  │ └─ ❌ No kit assigned                                  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────┐  ┌──────────────────────────────┐  │
│  │ CRITICAL ALERTS [x]│  │ COMMUNICATIONS           [x]│  │
│  │                     │  │                            │  │
│  │ ⚠️ 3 events missing│  │ Recent Activity:           │  │
│  │    operators        │  │                            │  │
│  │ ⚠️ 2 events missing│  │ • Proposal sent: EMPWR     │  │
│  │    kits             │  │   (2 hours ago)            │  │
│  │ 🔴 1 contract       │  │ • Contract signed: Glow    │  │
│  │    expiring soon    │  │   (Yesterday)              │  │
│  │                     │  │ • Invoice paid: Studio X   │  │
│  │ [View All Alerts]   │  │   (3 days ago)             │  │
│  └─────────────────────┘  └──────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ CALENDAR COLOR BARS (Monthly Overview)             [x]  │ │
│  │                                                          │ │
│  │ December 2025                                           │ │
│  │ ┌──┬──┬──┬──┬──┬──┬──┐                                │ │
│  │ │Su│Mo│Tu│We│Th│Fr│Sa│                                │ │
│  │ ├──┼──┼──┼──┼──┼──┼──┤                                │ │
│  │ │1 │2 │3 │4 │5 │6 │7 │                                │ │
│  │ │  │  │  │  │  │██│██│ <- EMPWR (Blue = Confirmed)    │ │
│  │ ├──┼──┼──┼──┼──┼──┼──┤                                │ │
│  │ │8 │9 │10│11│12│13│14│                                │ │
│  │ │██│██│  │  │  │██│██│ <- Multiple events             │ │
│  │ │  │  │  │  │  │  │  │    (Yellow = Pending)         │ │
│  │ └──┴──┴──┴──┴──┴──┴──┘                                │ │
│  │                                                          │ │
│  │ Legend: █ Confirmed █ Pending █ Completed              │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  [🎤 Microphone FAB - Fixed Bottom Right]                    │
└──────────────────────────────────────────────────────────────┘
```

**Key Features:**
1. All 6 widgets with data
2. Calendar color bars (user's specific request)
3. Drag/drop indicators (dotted borders on hover)
4. "X" close buttons on each widget
5. Microphone FAB bottom-right
6. "Customize Dashboard" button

---

## 📋 PRIORITY 2: Create Missing Core Pages

### 14-proposals.html (NEW)
**Features:**
- Proposal list with "Date Received" column
- 80% modal for proposal builder
- Service template selector
- Live preview
- Status tracking (Submitted, Reviewing, Accepted, Rejected)

### 15-contracts.html (NEW)
**Features:**
- Two-panel layout (Templates | Existing Contracts)
- Resizable divider
- Templates always visible on left
- Contract editor opens at 80% screen
- Multi-date contract support

### 16-questionnaires.html (NEW)
**Features:**
- Color coding (Yellow=Pending >7 days, Red=<7 days, Green=Complete)
- Incomplete sorted to top automatically
- No huge white button
- Links to event details

### 17-invoices.html (NEW)
**Features:**
- Invoice list with payment status
- Manual payment processing
- E-transfer recognition
- HST calculation (13% Ontario)

### 18-integrations.html (NEW)
**Features:**
- Gmail OAuth setup
- Google Drive connection
- Telegram bot configuration
- Vimeo API settings
- Stripe payment setup
- SignWell e-signature
- Mailgun email
- OpenAI (Whisper + GPT-4)

---

## 🔧 PRIORITY 3: Update Existing Mockups

### Critical Updates by Page:

#### 1. 06-pipeline-products.html
**ADD:**
- Inline click-to-edit ALL fields
- 4 product columns with checkboxes:
  - Studio Sage Chatbot
  - Dance Recital Package
  - Competition Software
  - Core Video Production
- Status/Revenue/Notes per product
- Product focus filters

#### 2. 01-planning-calendar.html
**ADD:**
- Event bars with operator initials (JD, ST)
- Kit icons (📷, 🎥)
- Status colors (Blue=Booked, Yellow=Pending, Green=Completed)
- Red conflict highlights
- Full screen button (F11)
- Alerts banner at top

#### 3. 08-deliverables.html
**ADD:**
- Google Drive folder column
- Click to open folder
- Right-click to copy link
- Service type checkboxes
- Assigned editor column

#### 4. 07-communications.html
**ADD:**
- Top section: "Automated Emails" (7 types)
- Progress bar per client
- 8 communication touchpoints
- Gmail sync status
- Telegram groups list

#### 5. 09-operators.html
**ADD:**
- Calendar view toggle (3rd option)
- Month grid with operator initials
- Color coding for availability

#### 6. 04-gear-inventory.html
**ADD:**
- 9 category tabs
- Status badges (Perfect/Needs Repair/Unusable)
- Dependency suggestions
- Maintenance log section

#### 7. 10-files.html
**ADD:**
- Livestreams tab
- Vimeo columns (stream_key, rtmp_url, embed_code)
- "Generate Vimeo Stream" button
- Service Library section

#### 8. 12-settings.html
**ADD:**
- Customization tab with:
  - Dashboard widget checkboxes
  - Template management
  - Navigation preferences
  - View defaults
  - Panel layout reset

---

## 🌐 PRIORITY 4: Global UI Elements (All Pages)

### Add to EVERY Mockup:

1. **Microphone FAB**
```css
position: fixed;
bottom: 24px;
right: 24px;
width: 56px;
height: 56px;
background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%);
border-radius: 50%;
z-index: 9999;
```

2. **Icon-Only View Toggles**
- Replace "Card View | Table View | Calendar View"
- With: [📊] [📋] [📅]

3. **Sortable Column Headers**
- Add ↑↓ arrows to all table headers
- Click to sort ascending/descending

4. **80% Modal Standard**
- All data-heavy modals: width: 80vw; height: 80vh;

5. **Resizable Panel Dividers**
- Add draggable dividers between panels
- Cursor: col-resize or row-resize

---

## 🎯 IMPLEMENTATION SEQUENCE

### Phase 1: Foundation (Day 1)
1. Create 00-dashboard.html with all widgets ✅
2. Create proposals, contracts, questionnaires pages
3. Create invoices, integrations pages

### Phase 2: Updates (Day 2)
1. Update pipeline with 4-product tracking
2. Update planning with event bars
3. Update deliverables with Google Drive
4. Update communications with automation

### Phase 3: Polish (Day 3)
1. Add Microphone FAB to all pages
2. Convert to icon toggles
3. Add sortable columns
4. Add resizable panels
5. Implement 80% modal standard

### Phase 4: Integration (Day 4)
1. Verify Phase 0 → Phase 1 flow
2. Test navigation between all pages
3. Ensure consistent branding
4. Final review against spec

---

## ✅ SUCCESS CRITERIA

**Mockups are complete when:**
1. All 18+ pages exist
2. Dashboard shows calendar color bars
3. Every spec feature is visually represented
4. Microphone FAB on every page
5. All tables have sortable columns
6. All modals follow 80% standard
7. Phase 0 (Lead Gen) flows into Phase 1 (Pipeline)
8. Consistent tactical aesthetic design
9. All customization features shown
10. Voice control UI visible

---

## 📊 METRICS

**Current Coverage:** 40% of spec features
**Target Coverage:** 100% of spec features
**Pages to Create:** 6 new pages
**Pages to Update:** 8 existing pages
**Global Elements:** 5 UI patterns to add everywhere

**Estimated Time:**
- New pages: 2 hours each (12 hours)
- Updates: 1 hour each (8 hours)
- Global elements: 4 hours
- **Total: ~24 hours of work**

---

**Ready to begin implementation!**