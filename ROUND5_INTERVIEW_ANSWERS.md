# CommandCentered - Round 5 Interview Answers

**Date:** November 14, 2025
**Session:** Round 5 Planning & Product Decisions
**Context:** User provided comprehensive answers to 15 clarification questions from Round 5 mockup feedback

---

## INTERVIEW SUMMARY

This document captures every confirmed design and workflow decision from the Round 5 interview session.

**Total Decisions:** 15
**Areas Covered:** Planning page, scheduling, products, gear management, communication, dashboard customization
**Status:** All answers applied to MASTER_SPECIFICATION_FINAL.md v6.0

---

## Q1: Planning Page — Calendar View

**Question:** What calendar view should the Planning page use by default?

**Answer:**
- **Main Planning page uses Month view by default** for high-level visibility
- Clicking any event opens a **detailed modal** for granular scheduling
- The calendar shows **operator initials and kit icons** directly in the event bars
- Dashboard and Planning page both include **alerts for events missing operators or kits**

**Outcome:** ✅ Month view for overview, detailed modal for shift-level work

**Applied to Spec:** Lines 943, 953, 970-976, 986-990

---

## Q2: Event Detail View — Shift Breakdown

**Question:** How should shift management work within event details?

**Answer:**
- System includes a **Shift Builder within the event modal**
- You can define event hours (e.g., 2 PM – 10 PM) and either create shifts manually or use templates
- Operators are assigned **per shift**
- Kits default to the **entire event** but can be overridden per shift
- **Single-shift events can skip the shift builder entirely**
- Conflicts are flagged visually in **red** (operators or kits double-booked)

**Outcome:** ✅ Flexible shift management, never forced; conflict warnings only

**Applied to Spec:** Lines 961-968, 978-984

---

## Q3: Calendar Indicators

**Question:** What information should event bars display on the calendar?

**Answer:**
Each event bar displays:
- **Client name** (e.g., "EMPWR Dance")
- **Operator initials** (JD, ST)
- **Kit icons** (camera symbol, etc.)
- Compact but informative

**Event color indicates status:** Booked, Pending, Completed

**Outcome:** ✅ Quick visual clarity without needing to open events

**Applied to Spec:** Lines 970-976

---

## Q4: Conflict Rules

**Question:** When should the system flag scheduling conflicts?

**Answer:**
Conflicts trigger **only when they matter:**
- Overlapping shifts for the **same operator**
- Operator marked **unavailable**
- Kit **double-booked** on overlapping events

**No warnings for same-day non-overlapping work**

**Outcome:** ✅ Smart conflict logic, not over-sensitive

**Applied to Spec:** Lines 978-984

---

## Q5: Shift Calculation Logic

**Question:** How should shifts be created and calculated?

**Answer:**
**Combination of Manual + Template options:**
- You can build shifts **manually** or pick **templates** (e.g., "Recital: Setup / Event / Teardown")
- The system can suggest even splits but **never locks you in**

**Outcome:** ✅ Manual precision with template convenience

**Applied to Spec:** Lines 963-965

---

## Q6-Q7: Major Products & Product Focus Tracking

**Question:** What are the core products, and how should product tracking work?

**Answer:**

**Confirmed Product Lineup (4 Products):**
1. **Studio Sage Chatbot** - AI assistant for dance studios
2. **Dance Recital Package** - Recital video production services
3. **Competition Software** - Dance competition management platform
4. **Core Video Production Services** - Umbrella service for all media production

**Product Focus Tracking:**
Each client record tracks:
- **Status progression:** Not Interested → Contacted → Proposal Sent → Active → Completed
- **Revenue amount** per product
- **Notes field** per product
- **Checkbox** for quick "Interested" tagging

**Outcome:** ✅ Core media production as umbrella, other products as distinct focuses tracked per client; multi-depth tracking with both high-level and detailed views

**Applied to Spec:** Lines 929-950

---

## Q8: Gear Dependencies

**Question:** How should gear dependency suggestions work?

**Answer:**
When a camera is added (e.g., Sony A7S III), the system shows a **gentle reminder** to add required items (lens, battery, card).

**You remain in full control—no auto-insertion.**

**Outcome:** ✅ "Suggest, don't assume" design pattern

**Applied to Spec:** Lines 1223-1232

---

## Q9: Event-Type Gear Suggestions

**Question:** Should event types have recommended gear lists?

**Answer:**
Each **Event Type** (Recital, Content Capture, Competition) includes a **recommended gear checklist**.

When creating a kit, the system **suggests items automatically based on event type**.

**Outcome:** ✅ Context-aware kit building speeds setup while staying flexible

**Applied to Spec:** Lines 1234-1239

---

## Q10: Gear Categories

**Question:** What gear categories should the system support?

**Answer:**

**Confirmed Categories (9 Categories):**
1. **Cameras** - Sony A7S III, Canon R5, etc.
2. **Lenses** - 24-70mm, 70-200mm, primes
3. **Accessories** - Batteries, cards, HDMI, etc.
4. **Audio** - Microphones, recorders, mixers
5. **Rigging** - Tripods, monopods, sliders, jibs
6. **Lighting** - LED panels, softboxes
7. **Stabilizers / Gimbals** - DJI Ronin, handheld stabilizers
8. **Drones** - DJI Mavic, FPV drones
9. **Monitors** - Field monitors, preview screens

**Outcome:** ✅ Comprehensive and expandable gear taxonomy

**Applied to Spec:** Lines 1212-1221

---

## Q11: Kit Creation Flow

**Question:** What's the step-by-step workflow for creating kits?

**Answer:**

**Kit Creation Flow (Step-by-Step):**
1. Click **Create Kit** from Planning page
2. Modal opens (**~80% width**)
3. Fill **Kit Name** and choose **Event**
4. **Browse or search** full gear inventory with **checkboxes**
5. Click **Create Kit**
6. Kit instantly links to that event

**Outcome:** ✅ Fast modal-based workflow; visually rich and centralized

**Applied to Spec:** Lines 1250-1262

---

## Q12: Kit Assignment Logic

**Question:** How should kits be assigned to events and shifts?

**Answer:**

**Kit Assignment Logic:**
- **Default:** Kits remain with the event all day
- **Operators rotate by shift**
- Kits can be **swapped mid-event** if necessary (e.g., different setups)
- **Never restrict by rule**—manual overrides allowed

**Outcome:** ✅ Flexible resource allocation respecting real-world workflow

**Applied to Spec:** Lines 1264-1269

---

## Q13: Communication Touchpoints

**Question:** What communication touchpoints should be tracked?

**Answer:**

**Tracked Touchpoints (8 Touchpoints):**
1. Initial contact email
2. Proposal sent
3. Contract sent / signed
4. Questionnaire sent / completed
5. Invoice sent / paid
6. Pre-event reminders
7. Post-event follow-up
8. Rebooking outreach

**Outcome:** ✅ Full communication lifecycle visible in timeline and progress bar

**Applied to Spec:** Lines 1069-1082

---

## Q14: Automated Emails

**Question:** What automated email types should the system support?

**Answer:**

**Automations Included (7 Automated Email Types):**
1. **Show Program Reminder** (48h before recital)
2. **Rebooking Follow-Up** (2-4 weeks after delivery)
3. **Contract signature reminder**
4. **Questionnaire completion reminder**
5. **Payment due reminder**
6. **Delivery notification**
7. **Thank-You / Feedback request**

**Outcome:** ✅ End-to-end automated communication suite

**Applied to Spec:** Lines 1497-1530

---

## Q15: Dashboard Customization

**Question:** How should dashboard customization work?

**Answer:**

**Dashboard Customization:**
- A **"Customize Dashboard" button** opens a modal with **checkboxes for each widget**:
  - Event Pipeline
  - Annual Revenue
  - Upcoming Events
  - Communications Timeline
  - Revenue by Product Focus (future)
- Option to **hide widgets with small "X" buttons**
- Future users can **add new widget types** later (modular architecture)

**Outcome:** ✅ Fully user-customizable dashboard with growth room

**Applied to Spec:** Lines 77-89

---

## SUMMARY TABLE

| Category | Core Choice |
|----------|-------------|
| Calendar View | Month default + click-for-detail |
| Shifts | Manual + Template hybrid |
| Conflicts | Only meaningful overlaps |
| Products | 4 key focuses tracked per client |
| Gear Logic | Smart reminders, manual control |
| Event Types | Recommended gear lists |
| Communication | Full pipeline + automation |
| Dashboard UX | Modular, customizable widgets |

---

## SPECIFICATION STATUS

**Before Round 5:** v5.0 (15 questions pending)
**After Round 5:** v6.0 (all questions answered)

**Changes Applied:**
- Planning page: 65 lines updated
- Product tracking: 22 lines added
- Gear dependencies: 28 lines updated
- Kit creation flow: 26 lines updated
- Communication touchpoints: 28 lines updated
- Dashboard customization: 15 lines enhanced

**Total Additions:** ~184 lines of specification detail
**Confidence Level:** 95% (ready for Week 2 schema validation)

---

## NEXT STEPS

1. **Week 2 Schema Validation** (Nov 25-Dec 1)
   - Walk through every mockup element
   - Verify schema.prisma supports all decisions
   - Create API_SPEC.md with endpoint contracts
   - Fix any schema gaps before backend build

2. **Week 3-5 Backend Build** (Dec 2-22)
   - Implement scheduling services based on Planning page decisions
   - Build product tracking system with multi-depth support
   - Create gear dependency suggestion system
   - Implement kit creation workflow

3. **Week 6-8 Frontend Build** (Dec 23-Jan 12)
   - Build Planning page with month view + event modals
   - Implement shift builder with manual/template options
   - Create dashboard with customizable widget system
   - Build gear management with category tabs

---

**Document Created:** November 14, 2025
**Last Updated:** November 14, 2025
**Status:** ✅ Complete - All 15 questions answered and applied
