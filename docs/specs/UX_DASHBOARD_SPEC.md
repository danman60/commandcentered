# CommandCentered - UX & Dashboard Specification

**Date:** 2025-11-06
**Version:** 1.0
**Status:** Draft - Based on user requirements

---

## 🎯 Core UX Philosophy

**Two-View System:**
1. **Main Console** - At-a-glance operational awareness
2. **Planning Centre** - Drag-and-drop operator/gear assignment

**Commander-Centric:** User is the "Commander" liaising with clients, coordinating crew, managing operations.

**Minimal Clicks:** Every action optimized for speed. No deep menu diving.

---

## 👤 User Roles & Terminology

### The Commander (Tenant/Owner)
- **Role:** Coordinates all operations, assigns crew, manages gear
- **Responsibilities:**
  - Liaise with clients for event details
  - Assign operators to shifts
  - Assign gear to events
  - Send gig sheets to crew
  - Monitor active operations
  - Respond to alerts/warnings

### Operators (Crew)
- Receive gig sheets via email/Telegram
- Join event Telegram groups
- Report to shifts on time
- No login to system (MVP)

---

## 🎮 Navigation Structure

**Single-Level Navigation (Left Sidebar):**

```
⚡ COMMANDCENTERED
├── 🎯 Main Console        (At-a-glance dashboard)
├── 📅 Planning Centre     (Drag-drop calendar + assignment)
├── 📦 Gear Locker         (Equipment management)
└── 👥 Operator Barracks   (Crew management)
```

**No nested menus. No tabs. Just 4 primary views.**

---

## 📊 Main Console (Dashboard)

### Purpose
**At-a-glance operational awareness across all events.**

### Layout
**HUD-style interface with:**
- Top bar: System status, alert count, date/time
- Left sidebar: 4-item navigation
- Center: Active events grid (cards with corner brackets)
- Right sidebar: Critical alerts + system stats

### What Commander Sees

**Active Events Section:**
- All events happening NOW
- Event cards showing:
  - Event name + venue
  - Status (LIVE / STARTING SOON / ISSUE)
  - Crew count / Gear count / Time remaining
  - Telegram chat button with unread count
  - Quick "Details" button

**Critical Alerts Panel (Right Sidebar):**
- 🔴 **CRITICAL** - Blocks event start:
  - No operators assigned (< 48h to event)
  - No gear assigned (< 48h to event)
  - Missing event info (load-in time, venue, client contact)
  - Impossible travel conflict detected

- 🟡 **WARNINGS** - Fix recommended:
  - Gig sheets not sent (< 24h to event)
  - Gear conflict detected
  - Tight schedule (< 30 min buffer between shifts)
  - Shift too long (> 12 hours)

- 🔵 **INFO** - FYI:
  - Event tomorrow reminder
  - Actual hours missing (completed events)
  - Training session scheduled

**System Stats:**
- Active events count
- Operators working now
- Gear deployed
- Today's revenue
- Next 48h event count

### Interactions
- **Click event card** → Opens Planning Centre focused on that event
- **Click Telegram button** → Inline chat modal (or external Telegram app)
- **Click alert** → Opens Planning Centre to fix issue
- **Navigation** → Instant switch between 4 main views

---

## 📅 Planning Centre

### Purpose
**Assign operators and gear with minimal clicks.**

### Layout
**Calendar-based + Event Detail Panel:**
- Top: Week/Month calendar view with events
- Bottom: Selected event detail panel (expanded)
- Drag-and-drop operators from sidebar
- Drag-and-drop gear from sidebar

### Event Information Threshold

**Required Fields (Event cannot be "Ready" without these):**
- Event name
- Event type
- Venue name + address
- Client name + contact
- Load-in time
- Event start time
- Event end time
- Load-out time

**Optional but Warned:**
- Hotel info (for multi-day events)
- Parking instructions
- Special notes

**System Behavior:**
- Event with missing required info → 🔴 CRITICAL alert
- Event < 48h away with gaps → Commander notified via Telegram + Email

### Operator Assignment Flow

**1. Click event on calendar** → Event detail panel expands
**2. Shift list displayed** (if multi-day) or single shift
**3. Drag operator from sidebar** → Drop on shift role
**4. System validates:**
   - No blackout conflict (HARD BLOCK)
   - No impossible travel conflict (HARD BLOCK)
   - Tight schedule? (WARN, allow with confirmation)
**5. Operator assigned** → Card shows operator face + name
**6. Repeat for all shifts**

**Keyboard Shortcut:** Click shift → Type operator name → Enter (fast assignment)

### Gear Assignment Flow

**1. Event selected**
**2. Click "Assign Gear"**
**3. Choose method:**
   - Kit (auto-suggest by event type)
   - Loadout (pre-tagged groups)
   - Individual (search + add)
**4. Gear assigned to ENTIRE EVENT** (setup → teardown)
**5. Vehicle auto-assigned** based on gear volume

### Visual Indicators
- ✅ Event fully staffed (green glow)
- ⚠️ Event missing operators (yellow glow)
- 🔴 Event has critical issue (red glow)
- 📦 Gear assigned badge
- 👥 Operator count badge
- 💬 Telegram group badge

---

## 📦 Gear Locker

### Purpose
**Manage all company gear + operator personal gear.**

### Layout
- Gear list (filterable by category/status)
- Status: Available / Assigned / Needs Repair / Out of Service / Missing
- Click gear item → Detail panel (history, assignments, specs)

### Key Features
- Add/edit/retire gear
- Track location history
- Flag broken items
- View current assignments
- Create gear kits (pre-defined loadouts)
- Create custom loadouts (tagged groups)

### Operator Personal Gear
- Separate tab: "Operator Gear"
- Shows all operators' registered gear
- Can request operator bring their own gear to shift
- Borrowing workflow (request gear from operator not working)

---

## 👥 Operator Barracks

### Purpose
**Manage crew, skills, training, blackout dates.**

### Layout
- Operator list (filterable by status/skill)
- Click operator → Detail panel (skills, history, availability)

### Key Features
- Add/edit operators
- Set hourly rates
- Track skills (tenant-defined, expandable)
- Manage blackout dates
- Record training attendance
- Upgrade skills manually
- View operator assignment history
- Transportation info (vehicle, needs ride)
- Home address (for travel time calculation)

### Skills System
- Skills defined per tenant (videography, photography, directing, professionalism)
- Rated 1-10
- Manual upgrades by Commander after training
- History tracked

---

## 🚨 Commander Alert System

### Alert Delivery Channels

**Dashboard (Always Visible):**
- Alert badge in top nav (count)
- Right sidebar panel (top 5 critical alerts)
- Click alert → Jump to fix location

**Telegram (Real-Time):**
- Commander gets DM from bot for CRITICAL alerts
- "🔴 ALERT: Spring Competition (2 days away) has NO operators assigned. Assign crew now."
- Link to Planning Centre

**Email (Daily Digest):**
- Morning summary at 8am Commander local time
- Lists all CRITICAL + WARNING alerts
- Action items for the day
- Link to dashboard

### Alert Types & Triggers

#### 🔴 CRITICAL (Must fix before event)
| Alert | Trigger | Message |
|-------|---------|---------|
| No Operators | Event < 48h, zero operators | "[Event] has NO operators assigned" |
| No Gear | Event < 48h, zero gear | "[Event] has NO gear assigned" |
| Missing Event Info | Event < 48h, required fields empty | "[Event] missing: [fields]" |
| Impossible Travel | Shift assignment creates impossible schedule | "[Operator] cannot arrive at [Event] in time" |
| Blackout Violation | Attempted assignment during blackout | "[Operator] has blackout [dates]" |

#### 🟡 WARNING (Fix recommended)
| Alert | Trigger | Message |
|-------|---------|---------|
| Gig Sheets Pending | Event < 24h, gig sheet not sent | "Send gig sheets for [X] events" |
| Gear Conflict | Double-booking detected | "[Gear] assigned to 2 overlapping events" |
| Tight Schedule | Buffer < 30 min between shifts | "[Operator] has tight schedule: [details]" |
| Shift Too Long | Single shift > 12 hours | "[Shift] is [X] hours (fatigue risk)" |
| Vehicle Missing | Gear assigned, no vehicle | "[Event] needs vehicle assignment" |

#### 🔵 INFO (FYI)
| Alert | Trigger | Message |
|-------|---------|---------|
| Event Tomorrow | Event in < 24h | "[X] events starting tomorrow" |
| Actual Hours Missing | Event completed, hours not entered | "Enter actual hours for [Event]" |
| Drill Scheduled | Drill in < 7 days | "[Drill] on [Date]" |

### Alert Lifecycle
1. **Created** - Alert generated by system check (runs every hour)
2. **Acknowledged** - Commander clicks "Acknowledge" (keeps alert visible)
3. **Resolved** - Condition fixed, alert auto-dismisses

---

## 🎨 Visual Design System

### Color Palette
- **Primary:** `#00ff9d` (cyan-green HUD)
- **Secondary:** `#00b8d4` (cyan blue)
- **Background:** `#000` (black) + `#0a1a1a` (dark panels)
- **Critical:** `#ff3b5c` (red alert)
- **Warning:** `#ffc107` (amber)
- **Info:** `#00b8d4` (cyan)
- **Success:** `#00ff9d` (green)

### HUD Elements
- Corner brackets on cards (glowing)
- Diagonal cut corners (angled edges)
- Hexagonal metric shapes
- Glowing borders + text shadows
- Pulsing status dots
- Tech grid background (subtle)
- Monospace numbers (Orbitron-style)
- All-caps mission control typography

### Typography
- **Headings:** Rajdhani, Orbitron (monospace, all-caps)
- **Body:** Segoe UI, system fonts
- **Numbers:** Orbitron, monospace
- **Letter Spacing:** Increased for headings (1-2px)

### Animations
- Pulse: Status dots, badges (2s loop)
- Glow: Hover effects on cards/buttons
- Shimmer: Subtle on top bar (3s loop)
- Background grid: Slow infinite scroll (20s)

---

## 📱 Mobile Considerations

**Not MVP - Desktop First.**

Future responsive breakpoints:
- Desktop: Full 3-column layout
- Tablet: 2-column (collapse right sidebar)
- Mobile: Single column, bottom nav

---

## 🔄 Workflow Examples

### Scenario 1: New Event Inquiry
1. Client calls: "Can you do our recital on Saturday?"
2. Commander opens Planning Centre
3. Clicks "New Event" on calendar (Saturday)
4. Fills required fields: name, venue, client, times
5. System checks operator availability → Shows conflicts
6. Commander assigns 2 available operators (drag-drop)
7. Commander assigns gear kit (one click)
8. System creates Telegram group
9. Commander sends gig sheets (one click)
10. **Done in < 2 minutes**

### Scenario 2: Last-Minute Cancellation
1. Operator texts Commander: "I'm sick, can't work today"
2. Commander opens Main Console → Sees event card
3. Clicks event card → Planning Centre opens
4. Clicks cancelled operator → "Find Replacement"
5. System suggests 3 available operators (ranked)
6. Commander drags replacement operator to shift
7. System validates (no conflicts)
8. Commander sends updated gig sheet to replacement
9. Telegram group notified: "Change: Sarah replaces John"
10. **Done in < 1 minute**

### Scenario 3: Gear Breaks Mid-Event
1. Operator messages Telegram group: "Camera 2 broke"
2. Commander sees message in Main Console (unread badge)
3. Commander clicks chat → Reads message
4. Commander opens Gear Locker
5. Marks Camera 2 as "Needs Repair"
6. System flags: "Gear broken during event"
7. On event completion, Camera 2 stays "Needs Repair" (not auto-returned)
8. **Gear tracking accurate**

---

## 🎯 Success Metrics

**Commander should be able to:**
- Assign full crew to event: **< 2 minutes**
- Respond to last-minute cancellation: **< 1 minute**
- See all critical alerts: **< 5 seconds** (always visible)
- Switch between views: **< 1 second** (instant nav)
- Send gig sheets: **1 click** (batch send)

**System should provide:**
- Zero missed events (all staffed)
- Zero double-bookings (conflict prevention)
- Zero information gaps (required field validation)
- 100% operator communication (Telegram + gig sheets)

---

## 🚀 Implementation Priority

**Phase 1 (MVP):**
1. Main Console (at-a-glance dashboard)
2. Planning Centre (basic calendar + assignment)
3. Critical alerts (no operators, no gear, missing info)
4. Telegram integration (groups per event)

**Phase 2:**
1. Gear Locker (gear management)
2. Operator Barracks (crew management)
3. Drag-and-drop assignment
4. Gear kits/loadouts
5. Travel time validation

**Phase 3:**
1. Advanced alerts (gig sheets, conflicts, tight schedules)
2. Email digest
3. Drill system
4. Skills tracking
5. Analytics

---

## 📋 Open Questions

1. Should Commander get SMS alerts for CRITICAL issues? (Cost consideration)
2. Real-time vs hourly alert checks? (Performance consideration)
3. Inline Telegram chat vs external app redirect?
4. Calendar view: Week only or Month + Week?
5. Dark mode only or light mode option?

---

**This UX spec defines the Commander's mission control experience. Clean, fast, powerful.**
