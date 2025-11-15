# CommandCentered E2E Test Plan v1.0

**Date:** November 14, 2025
**Spec Version:** v6.0 (95% confidence)
**Mockup Suite:** Round 6 Complete (13/13 pages)
**Test Framework:** Playwright (TypeScript)
**Status:** READY FOR IMPLEMENTATION

---

## EXECUTIVE SUMMARY

This E2E test plan provides comprehensive test coverage for all CommandCentered workflows based on:
- Complete spec v6.0 (MASTER_SPECIFICATION_FINAL.md)
- All 15 Round 5 interview decisions (Q1-Q15)
- Complete Round 6 mockup suite (13 HTML pages)
- All identified user workflows and features

**Total Test Scenarios:** 85+
**Priority Breakdown:** P0 (Critical): 25 | P1 (High): 35 | P2 (Medium): 25+

---

## TEST STRATEGY

### Testing Approach
1. **Page-Level Tests** - UI elements, interactions, validations (13 pages)
2. **Workflow Tests** - End-to-end user journeys (cross-page flows)
3. **Integration Tests** - Data consistency across features
4. **Visual Regression** - Screenshot comparisons for UI consistency
5. **Accessibility Tests** - ARIA labels, keyboard navigation, screen readers

### Test Environment
- **Development:** Static HTML mockups (current Round 6)
- **Staging:** Next.js application with test database
- **Production:** Live application with production-like data

### Test Data Strategy
- **Fixtures:** Pre-defined test data for consistent results
- **Factories:** Dynamic test data generation for edge cases
- **Teardown:** Clean database state after each test suite

---

## TEST COVERAGE MATRIX

### By Page (13 Pages)

| Page | Test Scenarios | Priority | Complexity | Status |
|------|---------------|----------|------------|--------|
| 01: Planning Calendar | 12 | P0 | High | Pending |
| 02: Event Detail Modal | 10 | P0 | High | Pending |
| 03: Kit Creation Modal | 8 | P1 | Medium | Pending |
| 04: Gear Inventory | 6 | P1 | Medium | Pending |
| 05: Dashboard | 8 | P1 | Medium | Pending |
| 06: Pipeline | 10 | P0 | High | Pending |
| 07: Communications | 7 | P1 | Medium | Pending |
| 08: Deliverables | 6 | P1 | Low | Pending |
| 09: Operators | 5 | P2 | Low | Pending |
| 10: Files & Assets | 4 | P2 | Low | Pending |
| 11: Reports | 3 | P2 | Low | Pending |
| 12: Settings | 4 | P2 | Low | Pending |
| 13: Operator Portal | 4 | P2 | Low | Pending |
| **Integration Tests** | 8 | P0 | Very High | Pending |

**Total:** 95 test scenarios

### By Feature Category

| Category | Scenarios | Pages Covered |
|----------|-----------|---------------|
| Event Management | 15 | Planning, Event Detail |
| Scheduling & Conflicts | 12 | Planning, Event Detail, Operators |
| Gear & Kit Management | 10 | Gear Inventory, Kit Creation |
| Client Relationship (CRM) | 8 | Pipeline |
| Communications | 7 | Communications |
| Deliverables Tracking | 6 | Deliverables |
| Dashboard Customization | 8 | Dashboard |
| Multi-tenant Isolation | 5 | All pages |
| Voice Control (Future) | TBD | All pages |

### By Round 5 Decision (Q1-Q15)

| Decision | Test Coverage | Scenarios |
|----------|---------------|-----------|
| Q1: Month calendar view | ✅ | 3 |
| Q2: Shift builder hybrid | ✅ | 5 |
| Q3: Calendar indicators | ✅ | 2 |
| Q4: Conflict rules | ✅ | 4 |
| Q5: Shift calculation | ✅ | 3 |
| Q6: Major products | ✅ | 4 |
| Q7: Product tracking | ✅ | 6 |
| Q8: Gear dependencies | ✅ | 3 |
| Q9: Event-type suggestions | ✅ | 2 |
| Q10: Gear categories | ✅ | 2 |
| Q11: Kit creation flow | ✅ | 5 |
| Q12: Kit assignment logic | ✅ | 3 |
| Q13: Communication touchpoints | ✅ | 8 |
| Q14: Automated emails | ✅ | 7 |
| Q15: Dashboard customization | ✅ | 6 |

---

## PAGE-SPECIFIC TEST SCENARIOS

### 01: Planning Calendar (12 Scenarios) - P0 CRITICAL

**Spec Lines:** 939-995, 973-1029

#### Navigation & View Tests (P0)
1. **TC-PLAN-001:** Verify month calendar loads with current month by default (Q1)
   - **Given:** User navigates to Planning page
   - **When:** Page loads
   - **Then:** Current month calendar is displayed with all days visible
   - **Assertion:** Calendar title shows current month/year

2. **TC-PLAN-002:** Verify 3-panel layout renders correctly (Operators | Kits | Calendar)
   - **Given:** User is on Planning page
   - **Then:** Three panels are visible with correct widths (20% | 20% | 60%)
   - **Assertion:** All panel headers visible, panels resizable

3. **TC-PLAN-003:** Verify month navigation (previous/next buttons)
   - **Given:** User is viewing November 2025 calendar
   - **When:** User clicks "Next Month" button
   - **Then:** Calendar updates to December 2025
   - **When:** User clicks "Previous Month" button
   - **Then:** Calendar updates to November 2025

#### Event Display Tests (P0)
4. **TC-PLAN-004:** Verify event bars display client name, operator initials, kit icons (Q3)
   - **Given:** Events exist on calendar
   - **Then:** Each event bar shows:
     - Client name (e.g., "EMPWR Dance")
     - Operator initials (e.g., "JD, ST")
     - Kit icons (camera symbol)
   - **Assertion:** All elements visible and correctly positioned

5. **TC-PLAN-005:** Verify event color-coding by status
   - **Given:** Events with different statuses exist (Booked, Confirmed, Tentative, Proposal)
   - **Then:** Event bars display correct colors:
     - Booked: Green
     - Confirmed: Green
     - Tentative: Orange
     - Proposal: Cyan
   - **Assertion:** Colors match design system

6. **TC-PLAN-006:** Verify click event opens Event Detail Modal
   - **Given:** User sees event on calendar
   - **When:** User clicks event bar
   - **Then:** Event Detail Modal opens at 80% screen width
   - **Assertion:** Modal contains event information and shift builder

#### Alerts & Indicators Tests (P1)
7. **TC-PLAN-007:** Verify alerts banner for missing operators/kits
   - **Given:** Events exist with missing operator or kit assignments
   - **Then:** Alerts banner displays at top of page
   - **And:** Alert shows list of incomplete events
   - **Assertion:** Alert count matches incomplete events

8. **TC-PLAN-008:** Verify operator availability indicators (Full Day, Partial Day, Unavailable)
   - **Given:** Operators panel is visible
   - **Then:** Each operator shows availability indicator
   - **Assertion:** Indicators match operator availability status

#### Panel Interactions (P1)
9. **TC-PLAN-009:** Verify operators panel displays all operators
   - **Given:** Operators exist in database
   - **Then:** Operators panel lists all operators with avatars and names
   - **Assertion:** Operator count matches database

10. **TC-PLAN-010:** Verify kits panel displays all kits
    - **Given:** Kits exist in database
    - **Then:** Kits panel lists all kits with item counts
    - **Assertion:** Kit count matches database

#### Customization (P1)
11. **TC-PLAN-011:** Verify panel resizing (draggable dividers)
    - **Given:** User is on Planning page
    - **When:** User drags divider between panels
    - **Then:** Panel widths adjust accordingly
    - **Assertion:** New widths persist after page refresh

12. **TC-PLAN-012:** Verify full-screen mode (collapse navigation)
    - **Given:** User is on Planning page
    - **When:** User clicks collapse navigation button
    - **Then:** Left navigation hides, Planning page takes full width
    - **Assertion:** Full-screen mode enabled, F11 or hotkey triggers

---

### 02: Event Detail Modal - Shift Builder (10 Scenarios) - P0 CRITICAL

**Spec Lines:** 943-976, 986-1002

#### Modal Display Tests (P0)
13. **TC-EVENT-001:** Verify Event Detail Modal opens at 80% screen width (Q11)
    - **Given:** User clicks event on calendar
    - **When:** Modal opens
    - **Then:** Modal width is 80% of viewport
    - **Assertion:** Modal dimensions match design system standard

14. **TC-EVENT-002:** Verify event information section displays correctly
    - **Given:** Event Detail Modal is open
    - **Then:** Event information displays:
      - Client name
      - Date and time
      - Venue/location
      - Hotel information (if applicable)
    - **Assertion:** All fields populated from event data

#### Shift Builder Tests (P0)
15. **TC-EVENT-003:** Verify shift builder options: Manual + Template (Q2, Q5)
    - **Given:** Event Detail Modal is open
    - **Then:** Two shift creation options visible:
      - "Create Manually" button
      - "Use Template" dropdown
    - **Assertion:** Both options functional

16. **TC-EVENT-004:** Verify template dropdown contains templates (Recital, Corporate, Custom)
    - **Given:** User selects "Use Template" option
    - **Then:** Dropdown shows available templates:
      - Recital (Setup / Event / Teardown)
      - Corporate
      - Custom
    - **Assertion:** Templates match database

17. **TC-EVENT-005:** Verify single-shift checkbox skips shift builder (Q2)
    - **Given:** Event Detail Modal is open
    - **When:** User checks "Single Shift Event" checkbox
    - **Then:** Shift builder section is hidden
    - **And:** Operator/kit assignment applies to entire event
    - **Assertion:** Shift builder disabled, direct assignment enabled

18. **TC-EVENT-006:** Verify manual shift creation
    - **Given:** User selects "Create Manually"
    - **When:** User clicks "Add Shift" button
    - **Then:** New shift card appears with time range inputs
    - **Assertion:** Shift added to event

19. **TC-EVENT-007:** Verify template-based shift creation
    - **Given:** User selects "Use Template" → "Recital"
    - **When:** Template is applied
    - **Then:** 3 shifts created: Setup, Event, Teardown
    - **Assertion:** Shifts match template definition

#### Assignment Tests (P1)
20. **TC-EVENT-008:** Verify kit assignment: Event default + per-shift override (Q12)
    - **Given:** Event has kit assigned at event level
    - **Then:** All shifts inherit default kit
    - **When:** User overrides kit for specific shift
    - **Then:** Shift-level kit assignment takes precedence
    - **Assertion:** Default and override logic correct

21. **TC-EVENT-009:** Verify operator assignment per shift
    - **Given:** Shifts are created
    - **When:** User assigns operator to shift
    - **Then:** Operator name appears in shift card
    - **Assertion:** Assignment persists

#### Conflict Detection Tests (P0)
22. **TC-EVENT-010:** Verify overlap-only conflict detection (Q4)
    - **Given:** Operator "JD" is assigned to:
      - Event A: 2 PM - 5 PM
      - Event B: 6 PM - 9 PM (same day)
    - **Then:** NO conflict warning (same day, non-overlapping)
    - **Given:** Event C: 4 PM - 7 PM (overlaps Event A)
    - **Then:** Conflict warning displayed in red
    - **Assertion:** Only overlapping shifts trigger conflicts

---

### 03: Kit Creation Modal (8 Scenarios) - P1 HIGH

**Spec Lines:** 1212-1275

#### Modal Flow Tests (P1)
23. **TC-KIT-001:** Verify kit creation modal opens at 80% screen width (Q11)
    - **Given:** User clicks "Create Kit" button
    - **When:** Modal opens
    - **Then:** Modal width is 80% of viewport
    - **Assertion:** Design system standard followed

24. **TC-KIT-002:** Verify step indicator (Kit Info → Select Gear → Review) (Q11)
    - **Given:** Kit creation modal is open
    - **Then:** Step indicator shows 3 steps with Step 1 active
    - **When:** User completes Step 1 and clicks "Next"
    - **Then:** Step 2 becomes active
    - **Assertion:** Step navigation functional

25. **TC-KIT-003:** Verify event-type suggestions banner (Q9)
    - **Given:** User selects event type "Dance Recital"
    - **Then:** Suggestions banner displays recommended gear
    - **Assertion:** Suggestions match event type

#### Gear Selection Tests (P1)
26. **TC-KIT-004:** Verify 9 gear category tabs (Q10)
    - **Given:** User is on "Select Gear" step
    - **Then:** 9 category tabs visible:
      - Cameras, Lenses, Accessories, Audio, Rigging, Lighting, Stabilizers, Drones, Monitors
    - **Assertion:** Tab count and labels correct

27. **TC-KIT-005:** Verify gear checkboxes with availability status
    - **Given:** User selects "Cameras" tab
    - **Then:** All cameras display as checkboxes
    - **And:** Availability status shown (Available, In Use, Maintenance)
    - **Assertion:** Checkbox state and status correct

28. **TC-KIT-006:** Verify dependency reminders: "Suggest, don't assume" pattern (Q8)
    - **Given:** User selects "Sony A7S III" camera
    - **Then:** Dependency reminder appears: "Consider: Lens, Battery, SD Card"
    - **And:** Reminder is dismissible (X button)
    - **But:** User can proceed without selecting suggested items
    - **Assertion:** Suggestion shown, not enforced

#### Quick Actions (P2)
29. **TC-KIT-007:** Verify "Link to Event" checkbox for instant assignment
    - **Given:** User creates kit
    - **When:** User checks "Link to Event" and selects event
    - **Then:** Kit is assigned to event immediately upon creation
    - **Assertion:** Kit appears in event's assigned kits

30. **TC-KIT-008:** Verify quick stats (Items selected, available, conflicts)
    - **Given:** User selects gear items
    - **Then:** Stats update in real-time:
      - "5 items selected"
      - "3 available, 2 in use"
      - "1 conflict" (if double-booked)
    - **Assertion:** Stats match selections

---

### 04: Gear Inventory (6 Scenarios) - P1 HIGH

**Spec Lines:** 1212-1239

#### Page Display Tests (P1)
31. **TC-GEAR-001:** Verify stats cards (Total, Available, In Use, Maintenance)
    - **Given:** User navigates to Gear Inventory page
    - **Then:** 4 stat cards display:
      - Total Gear: 50
      - Available: 35
      - In Use: 10
      - Maintenance: 5
    - **Assertion:** Stats match database counts

32. **TC-GEAR-002:** Verify 9 category tabs navigation (Q10)
    - **Given:** User is on Gear Inventory page
    - **Then:** 9 category tabs visible
    - **When:** User clicks "Lenses" tab
    - **Then:** Gear table filters to show only lenses
    - **Assertion:** Tab navigation and filtering functional

#### Search & Filter Tests (P1)
33. **TC-GEAR-003:** Verify search by name/serial number
    - **Given:** Gear inventory has 50 items
    - **When:** User types "Sony A7S" in search bar
    - **Then:** Table filters to show only matching items
    - **Assertion:** Search results accurate

34. **TC-GEAR-004:** Verify filter by status (Available, In Use, Maintenance)
    - **Given:** User is on Gear Inventory page
    - **When:** User selects "Available" from status filter
    - **Then:** Table shows only available gear
    - **Assertion:** Filter applied correctly

#### Dependencies & Links (P1)
35. **TC-GEAR-005:** Verify dependency tooltips (Q8, Q9)
    - **Given:** User hovers over "Sony A7S III" camera
    - **Then:** Tooltip displays: "Suggested: Lens, Battery, SD Card"
    - **Assertion:** Dependencies shown, hover-triggered

36. **TC-GEAR-006:** Verify current event links
    - **Given:** Gear item "Camera 1" is assigned to "EMPWR Dance Event"
    - **Then:** "Current Event" column shows "EMPWR Dance" as clickable link
    - **When:** User clicks link
    - **Then:** Navigates to event detail page
    - **Assertion:** Link navigation functional

---

### 05: Dashboard with Customization (8 Scenarios) - P1 HIGH

**Spec Lines:** 950-965

#### Widget Display Tests (P1)
37. **TC-DASH-001:** Verify 6 widget types render correctly (Q15)
    - **Given:** User navigates to Dashboard
    - **Then:** 6 default widgets visible:
      - Event Pipeline (6-stage)
      - Annual Revenue (progress bar + stats)
      - Upcoming Events (next 3)
      - Quick Stats (operators, gear, kits, events)
      - Recent Activity (timeline)
      - Alerts & Notifications
    - **Assertion:** All widgets render with correct data

38. **TC-DASH-002:** Verify Event Pipeline widget (6-stage progression)
    - **Given:** Event Pipeline widget is visible
    - **Then:** 6 stages shown:
      - Proposal → Booked → Confirmed → Event → Editing → Delivered
    - **And:** Event count per stage displayed
    - **Assertion:** Stage progression accurate

39. **TC-DASH-003:** Verify Annual Revenue widget (progress bar + stats)
    - **Given:** Annual Revenue widget is visible
    - **Then:** Progress bar shows revenue toward goal
    - **And:** Stats show: YTD revenue, goal, % complete
    - **Assertion:** Revenue calculation correct

#### Customization Tests (P0)
40. **TC-DASH-004:** Verify "Customize Dashboard" button opens modal (Q15)
    - **Given:** User is on Dashboard
    - **When:** User clicks "Customize Dashboard" button in header
    - **Then:** Customization modal opens
    - **Assertion:** Modal displays widget checkboxes

41. **TC-DASH-005:** Verify widget customization modal: Checkbox list with descriptions (Q15)
    - **Given:** Customization modal is open
    - **Then:** 6 checkboxes displayed with descriptions:
      - [ ] Event Pipeline - "6-stage event progression"
      - [ ] Annual Revenue - "Progress toward revenue goal"
      - etc.
    - **When:** User unchecks "Recent Activity"
    - **Then:** Changes save immediately, modal closes
    - **And:** Dashboard no longer shows Recent Activity widget
    - **Assertion:** Widget visibility persists after page refresh

42. **TC-DASH-006:** Verify widget "X" button (hide on hover) (Q15)
    - **Given:** User hovers over "Quick Stats" widget
    - **Then:** Small "X" button appears in top-right corner
    - **When:** User clicks "X"
    - **Then:** Widget is hidden
    - **And:** Preference saved to database
    - **Assertion:** Hidden widget does not reappear on refresh

#### Layout Tests (P2)
43. **TC-DASH-007:** Verify modular grid layout (full, half, third, quarter sizes)
    - **Given:** Dashboard has widgets of different sizes
    - **Then:** Widgets arranged in grid:
      - Event Pipeline: Full width
      - Annual Revenue: Half width
      - Upcoming Events: Half width
      - Quick Stats: Quarter width
    - **Assertion:** Grid layout responsive

44. **TC-DASH-008:** Verify drag-and-drop widget reordering (Future feature)
    - **Given:** User enables drag mode
    - **When:** User drags "Annual Revenue" widget
    - **Then:** Widget can be repositioned
    - **And:** Layout preference saved
    - **Assertion:** New layout persists

---

### 06: Pipeline with 4-Product Tracking (10 Scenarios) - P0 CRITICAL

**Spec Lines:** 929-950, 1069-1082, 943-969

#### Client Display Tests (P0)
45. **TC-PIPE-001:** Verify client cards layout with CRM fields (Q13)
    - **Given:** User navigates to Pipeline page
    - **Then:** Client cards display in grid layout
    - **And:** Each card shows:
      - Client name
      - Last Contacted date
      - Next Follow-Up date
      - Contact Frequency
      - Client status badge (Hot Lead, Warm Lead, Cold Lead)
    - **Assertion:** All CRM fields visible

46. **TC-PIPE-002:** Verify client status badges (Hot, Warm, Cold)
    - **Given:** Clients with different statuses exist
    - **Then:** Status badges display correct colors:
      - Hot Lead: Red
      - Warm Lead: Orange
      - Cold Lead: Cyan
    - **Assertion:** Colors match design system

#### Product Tracking Tests (P0)
47. **TC-PIPE-003:** Verify 4-product tracking section (Q6)
    - **Given:** Client card is expanded
    - **Then:** 4 product tracking sections visible:
      1. Studio Sage Chatbot
      2. Dance Recital Package
      3. Competition Software
      4. Core Video Production Services
    - **Assertion:** All 4 products displayed

48. **TC-PIPE-004:** Verify multi-depth product tracking: Checkbox, status, revenue, notes (Q7)
    - **Given:** Product "Dance Recital Package" is tracked for client
    - **Then:** Product section shows:
      - [ ] Checkbox (interested indicator)
      - Status badge: "Proposal" (Discussing, Proposal, Won, Lost)
      - Revenue: "$8,500"
      - Notes field: "Waiting for contract signature"
    - **Assertion:** All tracking fields present

49. **TC-PIPE-005:** Verify product status progression (Q7)
    - **Given:** Product status is "Discussing"
    - **When:** User clicks status badge and selects "Proposal"
    - **Then:** Status updates to "Proposal"
    - **And:** Database updated
    - **Assertion:** Status change persists

50. **TC-PIPE-006:** Verify revenue tracking per product (Q7)
    - **Given:** Client has multiple products:
      - Dance Recital: $8,500
      - Competition Software: $12,000
    - **Then:** Total client revenue: $20,500
    - **Assertion:** Revenue calculation correct

51. **TC-PIPE-007:** Verify notes field per product (Q7)
    - **Given:** Product tracking section is visible
    - **When:** User clicks notes field and types "Follow up next week"
    - **Then:** Notes save to database
    - **Assertion:** Notes persist and display on reload

#### Quick Actions Tests (P1)
52. **TC-PIPE-008:** Verify quick actions (Log Contact, Send Email, View Details)
    - **Given:** Client card is visible
    - **Then:** 3 quick action buttons present:
      - "Log Contact"
      - "Send Email"
      - "View Details"
    - **When:** User clicks "Log Contact"
    - **Then:** Contact logging modal opens
    - **Assertion:** All quick actions functional

#### Inline Editing (P1)
53. **TC-PIPE-009:** Verify inline editing for all fields
    - **Given:** Client card displays "Last Contacted: Nov 10, 2025"
    - **When:** User clicks "Last Contacted" field
    - **Then:** Field becomes editable
    - **When:** User changes date to "Nov 12, 2025" and presses Enter
    - **Then:** Database updates, field displays new value
    - **Assertion:** Inline editing works for all fields

#### Filtering (P1)
54. **TC-PIPE-010:** Verify filter by product focus
    - **Given:** Pipeline has 20 clients
    - **When:** User selects filter "Dance Recital Package"
    - **Then:** Only clients with Dance Recital interest are shown
    - **Assertion:** Filter applied correctly

---

### 07: Communications (7 Scenarios) - P1 HIGH

**Spec Lines:** 1069-1093

#### Touchpoint Display Tests (P1)
55. **TC-COMM-001:** Verify 8 communication touchpoints tracked (Q13)
    - **Given:** User navigates to Communications page
    - **Then:** 8 touchpoint stages visible:
      1. Initial contact email
      2. Proposal sent
      3. Contract sent/signed
      4. Questionnaire sent/completed
      5. Invoice sent/paid
      6. Pre-event reminders
      7. Post-event follow-up
      8. Rebooking outreach
    - **Assertion:** All touchpoints displayed

56. **TC-COMM-002:** Verify progress bar shows touchpoint completion
    - **Given:** Client has completed 4/8 touchpoints
    - **Then:** Progress bar shows 50% completion
    - **And:** Completed touchpoints marked with checkmark
    - **And:** Pending touchpoints grayed out
    - **Assertion:** Progress bar accurate

57. **TC-COMM-003:** Verify click touchpoint to view email history
    - **Given:** User sees "Proposal sent" touchpoint
    - **When:** User clicks touchpoint
    - **Then:** Email history panel opens showing proposal emails
    - **Assertion:** Email history displayed

#### Automated Emails Tests (P1)
58. **TC-COMM-004:** Verify 7 automated email types (Q14)
    - **Given:** Automated emails table is visible
    - **Then:** 7 email types listed:
      1. Show Program Reminder
      2. Rebooking Follow-Up
      3. Contract Reminder
      4. Questionnaire Reminder
      5. Payment Reminder
      6. Delivery Notification
      7. Thank-You/Feedback
    - **Assertion:** All email types present

59. **TC-COMM-005:** Verify automated emails table (Client, Email Type, Status, Date)
    - **Given:** Automated emails table is visible
    - **Then:** Columns display:
      - Client name
      - Email type
      - Status (Sent/Pending/Failed)
      - Date sent
    - **Assertion:** Table data accurate

60. **TC-COMM-006:** Verify email status indicators (Sent, Pending, Failed)
    - **Given:** Emails with different statuses exist
    - **Then:** Status badges display correct colors:
      - Sent: Green
      - Pending: Orange
      - Failed: Red
    - **Assertion:** Status colors correct

#### Telegram Integration Tests (P2)
61. **TC-COMM-007:** Verify Telegram integration section
    - **Given:** User scrolls to bottom of Communications page
    - **Then:** Telegram integration panel visible
    - **And:** Active Telegram groups per event shown
    - **And:** "Create New Group" button visible
    - **Assertion:** Telegram section functional

---

### 08: Deliverables (6 Scenarios) - P1 HIGH

**Spec Lines:** 1032-1066

#### Table Display Tests (P1)
62. **TC-DELIV-001:** Verify deliverables table displays all deliverables
    - **Given:** User navigates to Deliverables page
    - **Then:** Table shows all deliverables with columns:
      - Due date
      - Client
      - Service type
      - Assigned editor
      - Status
      - Google Drive folder
    - **Assertion:** All columns visible

63. **TC-DELIV-002:** Verify sortable columns (all columns)
    - **Given:** Deliverables table is visible
    - **When:** User clicks "Due Date" column header
    - **Then:** Table sorts by due date (ascending)
    - **When:** User clicks again
    - **Then:** Table sorts by due date (descending)
    - **Assertion:** All columns sortable

64. **TC-DELIV-003:** Verify overdue date highlighting
    - **Given:** Deliverable has due date: Nov 10, 2025 (past)
    - **Then:** Due date displays in red
    - **Assertion:** Overdue highlighting functional

#### Service Checkboxes Tests (P1)
65. **TC-DELIV-004:** Verify checkboxes per service type
    - **Given:** Deliverable row for "EMPWR Dance"
    - **Then:** Service checkboxes displayed:
      - [✓] 1-min highlight
      - [✓] 3-min video
      - [ ] Reels
      - [✓] Raw footage
    - **Assertion:** Checkboxes reflect completion status

66. **TC-DELIV-005:** Verify checkbox toggle updates database
    - **Given:** "Reels" checkbox is unchecked
    - **When:** User clicks "Reels" checkbox
    - **Then:** Checkbox becomes checked
    - **And:** Database updates service completion status
    - **Assertion:** Checkbox state persists

#### Google Drive Integration Tests (P1)
67. **TC-DELIV-006:** Verify Google Drive folder column (Click to open, Right-click to copy)
    - **Given:** Deliverable has Google Drive folder link
    - **When:** User clicks folder icon
    - **Then:** Google Drive folder opens in new tab
    - **When:** User right-clicks folder icon
    - **Then:** Folder link copied to clipboard
    - **Assertion:** Both actions functional

---

### 09: Operators (5 Scenarios) - P2 MEDIUM

**Spec Lines:** 1190-1207

#### View Toggle Tests (P2)
68. **TC-OPER-001:** Verify 3 view options (Card, Table, Calendar)
    - **Given:** User navigates to Operators page
    - **Then:** 3 view toggle buttons visible:
      - Card view icon
      - Table view icon
      - Calendar view icon
    - **When:** User clicks "Calendar" icon
    - **Then:** View switches to calendar layout
    - **Assertion:** View toggle functional

69. **TC-OPER-002:** Verify calendar view displays operator availability
    - **Given:** User selects "Calendar" view
    - **Then:** Month calendar displays
    - **And:** Operator initials shown on available days (e.g., "JD, ST, MK" on Dec 6)
    - **Assertion:** Availability indicators correct

70. **TC-OPER-003:** Verify card view displays operator cards
    - **Given:** User selects "Card" view
    - **Then:** Operator cards display:
      - Avatar
      - Name
      - Role
      - Event count
      - Rating
      - Skill tags
      - Availability status
    - **Assertion:** All card fields visible

#### Operator Details Tests (P2)
71. **TC-OPER-004:** Verify skill tags display
    - **Given:** Operator card is visible
    - **Then:** Skill tags shown: "Multi-Camera, Livestream, Audio, Drone"
    - **Assertion:** Skills match operator profile

72. **TC-OPER-005:** Verify availability status (Available/Unavailable with date ranges)
    - **Given:** Operator is unavailable Dec 10-15
    - **Then:** Card shows "Unavailable: Dec 10-15"
    - **Assertion:** Availability dates accurate

---

### 10: Files & Assets (4 Scenarios) - P2 MEDIUM

**Spec Lines:** 1107-1125

#### Tab Navigation Tests (P2)
73. **TC-FILES-001:** Verify 5 tabs (Documents, Contracts, Proposals, Livestreams, Service Library)
    - **Given:** User navigates to Files page
    - **Then:** 5 tabs visible in tab bar
    - **When:** User clicks "Livestreams" tab
    - **Then:** Livestreams content displays
    - **Assertion:** Tab navigation functional

74. **TC-FILES-002:** Verify Livestreams tab displays Vimeo streams
    - **Given:** User is on "Livestreams" tab
    - **Then:** Vimeo livestream events displayed:
      - Event name
      - Stream key
      - RTMP URL
      - Embed code
    - **Assertion:** All livestream fields visible

75. **TC-FILES-003:** Verify copy buttons (Stream Key, RTMP URL)
    - **Given:** Livestream item is visible
    - **When:** User clicks "Copy Stream Key" button
    - **Then:** Stream key copied to clipboard
    - **When:** User clicks "Copy RTMP URL" button
    - **Then:** RTMP URL copied to clipboard
    - **Assertion:** Copy actions functional

#### Service Library Tests (P2)
76. **TC-FILES-004:** Verify Service Library tab displays templates
    - **Given:** User is on "Service Library" tab
    - **Then:** Service templates displayed:
      - Dance Recital Package ($8,500)
      - Competition Coverage ($6,200)
      - Corporate Event ($4,500)
      - Content Capture Day ($3,800)
      - Wedding Video ($5,500)
      - Livestream Only ($1,800)
    - **Assertion:** All templates with pricing visible

---

### 11: Reports (3 Scenarios) - P2 MEDIUM

#### Report Display Tests (P2)
77. **TC-REPORT-001:** Verify 6 report cards displayed
    - **Given:** User navigates to Reports page
    - **Then:** 6 report cards visible:
      - Revenue Report
      - Event Summary
      - Operator Performance
      - Pipeline Conversion
      - Deliverables Status
      - Gear Utilization
    - **Assertion:** All report cards present

78. **TC-REPORT-002:** Verify "Generate Report" buttons functional
    - **Given:** User sees "Revenue Report" card
    - **When:** User clicks "Generate Report" button
    - **Then:** Report generation initiated (loading state)
    - **Assertion:** Generate action triggered

79. **TC-REPORT-003:** Verify custom report builder option
    - **Given:** User is on Reports page
    - **Then:** "Custom Report" button visible in header
    - **When:** User clicks "Custom Report"
    - **Then:** Custom report builder modal opens
    - **Assertion:** Custom builder accessible

---

### 12: Settings (4 Scenarios) - P2 MEDIUM

#### Settings Navigation Tests (P2)
80. **TC-SETT-001:** Verify sidebar navigation (7 sections)
    - **Given:** User navigates to Settings page
    - **Then:** Sidebar shows 7 sections:
      - Organization
      - Profile
      - Notifications
      - Email
      - Billing
      - Security
      - Integrations
    - **When:** User clicks "Profile"
    - **Then:** Profile settings content displays
    - **Assertion:** Sidebar navigation functional

81. **TC-SETT-002:** Verify organization settings (Company name, Currency, Time zone, Date format)
    - **Given:** User is on "Organization" settings
    - **Then:** Settings fields visible:
      - Company Name: "StreamStage Productions"
      - Currency: "USD"
      - Time Zone: "America/Toronto (EST/EDT)"
      - Date Format: "MM/DD/YYYY (US)"
    - **Assertion:** All settings fields editable

82. **TC-SETT-003:** Verify settings save functionality
    - **Given:** User changes "Company Name" to "StreamStage Media"
    - **When:** User clicks "Save Changes" button
    - **Then:** Settings saved to database
    - **And:** Success message displayed
    - **Assertion:** Changes persist after page refresh

83. **TC-SETT-004:** Verify multi-section settings interface
    - **Given:** User navigates between settings sections
    - **Then:** Each section loads correct content
    - **And:** Sidebar highlights active section
    - **Assertion:** Section switching functional

---

### 13: Operator Portal (4 Scenarios) - P2 MEDIUM

#### Portal Display Tests (P2)
84. **TC-PORTAL-001:** Verify operator-focused UI displays
    - **Given:** Operator logs into operators.commandcentered.app
    - **Then:** Simplified interface loads with operator name "John Davis"
    - **And:** User avatar displayed
    - **Assertion:** Operator portal accessible

85. **TC-PORTAL-002:** Verify "My Upcoming Events" section
    - **Given:** Operator has 2 upcoming events
    - **Then:** Events displayed:
      - EMPWR Dance Experience - Dec 6, 2025 at 4:00 PM
      - XYZ Corporate Event - Dec 15, 2025 at 9:00 AM
    - **And:** Each event shows: Location, Time, Role
    - **And:** Status badge: "Confirmed"
    - **Assertion:** Event details accurate

86. **TC-PORTAL-003:** Verify "My Availability" calendar
    - **Given:** Operator is on availability section
    - **Then:** Month calendar displays (December 2025)
    - **And:** Available days highlighted in green
    - **And:** Unavailable days grayed out
    - **And:** Booked days marked
    - **Assertion:** Availability calendar functional

87. **TC-PORTAL-004:** Verify availability toggle (Click days to toggle)
    - **Given:** Operator sees availability calendar
    - **When:** Operator clicks "Dec 8" (currently unavailable)
    - **Then:** Day toggles to "Available" (green)
    - **When:** Operator clicks "Update Availability" button
    - **Then:** Changes saved to database
    - **Assertion:** Availability toggle persists

---

## INTEGRATION WORKFLOWS (8 Scenarios) - P0 CRITICAL

These tests span multiple pages and verify end-to-end user journeys.

### Event Creation to Completion Workflow (P0)
88. **TC-INTEG-001:** Create event → Assign operators/kits → Track deliverables → Mark complete
    - **Given:** User is on Planning page
    - **When:** User creates new event "Spring Recital"
    - **And:** Assigns operators JD, ST
    - **And:** Assigns kit "Recital Kit 1"
    - **And:** Creates 3 shifts: Setup, Event, Teardown
    - **Then:** Event appears on calendar with operator initials + kit icons
    - **When:** User navigates to Deliverables page
    - **Then:** Deliverable created for "Spring Recital"
    - **When:** User checks service checkboxes
    - **Then:** Deliverable marked complete
    - **Assertion:** Full workflow completes successfully

### Conflict Detection Workflow (P0)
89. **TC-INTEG-002:** Create overlapping event → Verify conflict alert → Resolve conflict
    - **Given:** Event A: Dec 6, 2:00 PM - 5:00 PM, Operator JD
    - **When:** User creates Event B: Dec 6, 4:00 PM - 7:00 PM, Operator JD
    - **Then:** Conflict alert displayed in Event Detail Modal
    - **And:** Planning page shows red highlight on conflicting events
    - **When:** User reassigns Event B to Operator ST
    - **Then:** Conflict alert clears
    - **Assertion:** Conflict detection and resolution functional

### Kit Creation to Event Assignment Workflow (P0)
90. **TC-INTEG-003:** Create kit → Select gear → Assign to event → Verify availability
    - **Given:** User opens Kit Creation Modal
    - **When:** User creates "Corporate Kit" with:
      - 2 Sony A7S III cameras
      - 2 Lenses
      - 4 Batteries
      - Audio equipment
    - **And:** Checks "Link to Event" → Selects "XYZ Corporate Event"
    - **Then:** Kit created and assigned to event
    - **When:** User navigates to Gear Inventory
    - **Then:** Selected gear marked "In Use" for "XYZ Corporate Event"
    - **Assertion:** Kit creation → gear assignment → availability update complete

### Pipeline to Proposal Workflow (P0)
91. **TC-INTEG-004:** Add client → Track products → Send proposal → Convert to event
    - **Given:** User adds new client "ABC Studios"
    - **When:** User marks client interested in "Dance Recital Package"
    - **And:** Updates product status to "Proposal"
    - **And:** Enters revenue: $8,500
    - **Then:** Pipeline shows ABC Studios with Recital interest
    - **When:** Proposal converts to booked event
    - **Then:** Event created on Planning calendar
    - **And:** Client moves to "Active" status
    - **Assertion:** Pipeline → proposal → event conversion complete

### Communication Lifecycle Workflow (P0)
92. **TC-INTEG-005:** Initial contact → Proposal → Contract → Event → Follow-up (8 touchpoints)
    - **Given:** New client "XYZ Dance" added
    - **When:** User logs "Initial contact email" touchpoint
    - **Then:** Progress bar shows 1/8 complete
    - **When:** User logs: Proposal sent, Contract signed, Questionnaire completed, Invoice paid
    - **Then:** Progress bar shows 5/8 complete
    - **When:** Event completes
    - **When:** User logs: Post-event follow-up, Rebooking outreach
    - **Then:** Progress bar shows 8/8 complete
    - **And:** Communication lifecycle complete
    - **Assertion:** All 8 touchpoints tracked correctly

### Multi-Tenant Data Isolation Workflow (P0)
93. **TC-INTEG-006:** Verify tenant A cannot see tenant B data
    - **Given:** Tenant "StreamStage" has 10 events
    - **And:** Tenant "Competitor Co" has 5 events
    - **When:** User logs in as StreamStage tenant
    - **Then:** Dashboard shows 10 events
    - **And:** Planning calendar shows only StreamStage events
    - **When:** User logs in as Competitor Co tenant
    - **Then:** Dashboard shows 5 events
    - **And:** Planning calendar shows only Competitor Co events
    - **Assertion:** Multi-tenant isolation verified

### Dashboard Customization Persistence Workflow (P1)
94. **TC-INTEG-007:** Customize dashboard → Verify persistence across sessions
    - **Given:** User customizes dashboard:
      - Hides "Recent Activity" widget
      - Rearranges "Annual Revenue" to top
      - Resizes "Event Pipeline" to full width
    - **When:** User saves customization
    - **Then:** Dashboard updates immediately
    - **When:** User logs out and logs back in
    - **Then:** Dashboard shows saved customization
    - **Assertion:** Customization persists across sessions

### Operator Availability to Assignment Workflow (P1)
95. **TC-INTEG-008:** Operator sets availability → Verify in Planning → Assign to event
    - **Given:** Operator JD logs into Operator Portal
    - **When:** JD marks Dec 10-15 as "Unavailable"
    - **Then:** Availability saved
    - **When:** Commander views Planning page
    - **Then:** JD shows unavailable Dec 10-15
    - **When:** Commander attempts to assign JD to event on Dec 12
    - **Then:** Conflict warning displayed: "JD unavailable"
    - **Assertion:** Operator availability propagates to Planning

---

## VISUAL REGRESSION TESTS

### Screenshot Comparison Tests (All Pages)
- **TC-VISUAL-001 to TC-VISUAL-013:** Capture baseline screenshots of all 13 pages
- **Threshold:** 95% pixel match (allow minor anti-aliasing differences)
- **Tool:** Playwright visual comparisons
- **Frequency:** Run on every commit to detect unintended UI changes

---

## ACCESSIBILITY TESTS

### ARIA & Keyboard Navigation (All Pages)
- **TC-A11Y-001:** Verify all buttons have ARIA labels
- **TC-A11Y-002:** Verify all form inputs have labels
- **TC-A11Y-003:** Verify keyboard navigation (Tab, Enter, Esc)
- **TC-A11Y-004:** Verify screen reader compatibility
- **TC-A11Y-005:** Verify color contrast meets WCAG AA standards

---

## PERFORMANCE TESTS

### Load Time & Responsiveness
- **TC-PERF-001:** Page load time < 2 seconds
- **TC-PERF-002:** Time to interactive < 3 seconds
- **TC-PERF-003:** Calendar rendering < 500ms for 100 events
- **TC-PERF-004:** Table sorting < 200ms for 1000 rows
- **TC-PERF-005:** Search filtering < 100ms

---

## TEST IMPLEMENTATION NOTES

### Playwright Test Structure

```typescript
// tests/01-planning-calendar.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Planning Calendar Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Planning page
    await page.goto('/planning');
  });

  test('TC-PLAN-001: Verify month calendar loads with current month', async ({ page }) => {
    // Assertions
    const calendarTitle = page.locator('.calendar-title');
    await expect(calendarTitle).toContainText('November 2025');

    // Verify all days visible
    const calendarDays = page.locator('.calendar-day');
    await expect(calendarDays).toHaveCount(30); // November has 30 days
  });

  test('TC-PLAN-004: Verify event bars display client name, operator initials, kit icons', async ({ page }) => {
    // Locate first event bar
    const eventBar = page.locator('.event-bar').first();

    // Verify client name
    await expect(eventBar.locator('.client-name')).toContainText('EMPWR Dance');

    // Verify operator initials
    await expect(eventBar.locator('.operator-initials')).toContainText('JD, ST');

    // Verify kit icon present
    await expect(eventBar.locator('.kit-icon')).toBeVisible();
  });
});
```

### Test Data Fixtures

```typescript
// tests/fixtures/events.ts
export const testEvents = [
  {
    id: '1',
    client_name: 'EMPWR Dance',
    date: '2025-12-06',
    time: '16:00',
    status: 'confirmed',
    operators: ['JD', 'ST'],
    kits: ['Recital Kit 1']
  },
  // ... more test events
];
```

### Database Seeding

```typescript
// tests/helpers/seed-database.ts
import { prisma } from '@/lib/prisma';
import { testEvents } from '../fixtures/events';

export async function seedTestData() {
  // Clear existing test data
  await prisma.event.deleteMany({
    where: { tenant_id: 'test-tenant' }
  });

  // Seed events
  await prisma.event.createMany({
    data: testEvents
  });
}
```

---

## TEST EXECUTION STRATEGY

### Priority Levels
- **P0 (Critical):** Run on every commit, block deployment if failing
- **P1 (High):** Run on every PR, required for merge
- **P2 (Medium):** Run nightly, fix within 1 week

### CI/CD Integration
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install
      - name: Run P0 tests
        run: npx playwright test --grep "@p0"
      - name: Run P1 tests
        run: npx playwright test --grep "@p1"
```

### Test Tagging
```typescript
test('TC-PLAN-001: Verify month calendar loads @p0 @smoke', async ({ page }) => {
  // Test implementation
});

test('TC-PIPE-003: Verify 4-product tracking @p0 @integration', async ({ page }) => {
  // Test implementation
});
```

---

## SUCCESS METRICS

### Coverage Goals
- **Unit Test Coverage:** 80%+
- **Integration Test Coverage:** 90%+ of critical workflows
- **E2E Test Coverage:** 100% of P0 scenarios, 90% of P1 scenarios
- **Visual Regression:** 100% of pages

### Quality Gates
- **Build Pass Rate:** 95%+
- **Test Execution Time:** < 15 minutes for full suite
- **Flaky Test Rate:** < 2%

---

## NEXT STEPS

1. **Week 2 (Schema Validation):**
   - Review test plan with user
   - Validate test coverage against spec v6.0
   - Identify any missing test scenarios

2. **Week 3-5 (Backend Build):**
   - Implement backend endpoints
   - Write integration tests for tRPC procedures
   - Seed test database

3. **Week 6-8 (Frontend Build):**
   - Implement E2E tests in parallel with frontend development
   - Run tests against live application (not mockups)
   - Fix failing tests

4. **Week 9 (Integration & Testing):**
   - Run full E2E test suite
   - Fix all failing tests
   - Achieve 100% P0 coverage

5. **Week 10 (Deployment):**
   - Run smoke tests on production
   - Monitor test execution in CI/CD
   - Maintain test suite post-launch

---

**Test Plan Status:** ✅ COMPLETE - Ready for Review
**Spec Coverage:** 100% of v6.0 features
**Round 5 Decisions:** 15/15 covered
**Total Scenarios:** 95+
**Next Phase:** Week 2 Schema Validation

---

**Created:** November 14, 2025
**Author:** Claude Code (Session 49)
**Project:** CommandCentered
**Version:** 1.0
