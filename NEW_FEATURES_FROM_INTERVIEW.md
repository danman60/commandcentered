# NEW Features from Interview (Not Yet in Mockups/Spec)

**Date:** November 12, 2025
**Source:** Vision & Priorities Interview (Round 3)

---

## 🆕 CRITICAL NEW FEATURES

### 1. **Vimeo Livestream Integration** ⭐ HIGH PRIORITY
**What:** Automatic creation of livestream events via Vimeo API
**Workflow:**
- When event is created in CommandCentered → auto-create Vimeo livestream event
- Fetch stream key + RTMP URL for operators
- Generate embed code for client landing page
- Create client-specific landing URL
- Eliminate manual Vimeo/Squarespace setup per event

**Current State:** NOT in mockups or spec
**Impact:** Huge time saver - eliminates manual Vimeo setup for every livestream event

**Where to Add:**
- Files page → new "Livestream" tab OR
- Event detail view → "Generate Livestream" button
- Dashboard → show livestream status per event

---

### 2. **Dance Recital Show Program Automation** ⭐ MEDIUM PRIORITY
**What:** 48-hour pre-event reminder for clients to upload show program PDF
**Workflow:**
- 48 hours before dance recital event → auto-send email to client
- Request PDF of show program (for post-production titling)
- Track who has uploaded vs. not uploaded
- Show upload status in dashboard

**Current State:** NOT in mockups or spec
**Impact:** Eliminates last-minute scrambling for show programs

**Where to Add:**
- Communications page → add to automatic reminder triggers
- Files page → Questionnaires tab → add "Show Program Upload" status
- Dashboard → Critical Alerts panel → flag missing show programs

---

### 3. **Operator Footage Upload Links** ⭐ HIGH PRIORITY
**What:** Auto-generate Google Drive upload links per operator per event
**Workflow:**
- When operators are assigned to event → auto-create Google Drive folder
- Generate unique upload link per operator
- Send upload link in gig sheet
- Track upload status (who uploaded, when, file count)
- Show in operator portal

**Current State:** Google Drive integration mentioned, but NOT upload link generation
**Impact:** Streamlines post-event footage collection

**Where to Add:**
- Operators detail view → "Upload Link" column per event
- Event detail view → "Footage Status" section showing who uploaded
- Gear page → Equipment Schedule tab → could show upload status

---

### 4. **Rebooking Automation** ⭐ MEDIUM PRIORITY
**What:** Automatic reminder to past clients to book again
**Workflow:**
- After event delivery complete → schedule follow-up email
- Send 2-4 weeks after delivery: "Book your next event"
- Track rebooking success rate

**Current State:** NOT in mockups or spec
**Impact:** Increases repeat business without manual follow-up

**Where to Add:**
- Communications page → add to automatic email triggers
- Pipeline page → show "Rebook Opportunity" status for past clients
- Dashboard → Next Actions panel → "Follow up with past clients"

---

### 5. **Annual Revenue Summary Dashboard** ⭐ LOW PRIORITY
**What:** Simple, motivational revenue visualization
**Workflow:**
- Show total annual revenue to date
- Simple progress bar or chart
- Not deep analytics, just "feel good" summary

**Current State:** Reports page has charts, but not annual summary focus
**Impact:** Motivational / awareness

**Where to Add:**
- Dashboard → add "Annual Revenue" widget (can be toggled in Customize page)
- Reports page → add "Annual Summary" view

---

### 6. **Client Pipeline Overview** ⭐ MEDIUM PRIORITY
**What:** Visual pipeline showing event lifecycle status
**Workflow:**
- Show where each event is: Proposal → Contract → Execution → Delivery
- Visual progress indicators per event
- Quick status at-a-glance

**Current State:** Pipeline page exists but is CRM-focused (leads), not event lifecycle
**Impact:** Clarity on event status

**Where to Add:**
- Dashboard → add "Event Pipeline" visualization
- Could be Kanban board style or progress bars
- Pipeline page → add separate "Event Progress" view vs. "Lead Pipeline"

---

### 7. **Standardized Service Templates** ⭐ HIGH PRIORITY
**What:** Pre-defined deliverable templates that can be reused
**Workflow:**
- Define standard services: "1-Minute Highlight", "Full Event Recording", etc.
- Each service has default duration, price, deliverables
- Can be customized per event, but starts with template
- Build reusable service library

**Current State:** Deliverables page has "Pre-defined service offerings" dropdown, but NOT full library management
**Impact:** Consistency + speed when creating proposals

**Where to Add:**
- Files page → Proposals tab → "Service Library" button opens modal
- Settings page → new "Services" tab to manage template library
- Deliverables page → "Add Service" pulls from library

---

### 8. **Event-Specific Telegram Group Auto-Creation** ⭐ HIGH PRIORITY
**What:** Auto-create Telegram group per event with operators
**Workflow:**
- When event created + operators assigned → create Telegram group
- Auto-invite Daniel + assigned operators
- Post gig sheet to group automatically
- Send event updates to group

**Current State:** Communications page has "Telegram Bot Setup" section, but NOT auto-group creation
**Impact:** Eliminates manual group creation for every event

**Where to Add:**
- Communications page → Telegram section → show "Auto-created groups" status
- Event detail view → "Telegram Group" link + status
- Settings page → Integrations tab → Telegram → add "Auto-create groups" toggle

---

### 9. **Hotel Information in Gig Sheets** ⭐ MEDIUM PRIORITY
**What:** Include hotel booking info in operator gig sheets
**Workflow:**
- When creating event → option to add hotel name, address, check-in time
- Include in gig sheet sent to operators
- Show in operator portal

**Current State:** NOT in mockups or spec
**Impact:** Convenience for multi-day events

**Where to Add:**
- Planning page → Event detail modal → add "Hotel Info" section
- Operators page → Detail view → Assignments tab → show hotel info per event
- Could add to schema: `events.hotel_name`, `events.hotel_address`

---

### 10. **Partial-Day Availability (Doodle-Style)** ⭐ MEDIUM PRIORITY
**What:** Operators can mark partial availability (e.g., "available 2-6pm")
**Workflow:**
- Operator availability grid shows time ranges, not just full-day yes/no
- Uses symbols: ✅ (all day), 🕐 (partial), ❌ (unavailable), ⚪ (no response)
- Partial times shown like "2-6PM" or "AM only"

**Current State:** Planning page → Operator Availability tab SHOWS this, but NOT fully functional
**Impact:** More accurate scheduling

**Where to Add:**
- Planning page → Operator Availability tab → make time entry functional
- Operators page → Detail view → Availability tab → add time range inputs
- Schema: `operator_availability.start_time`, `operator_availability.end_time`

---

### 11. **AI Voice Agent (Full CRUD)** ⭐ CRITICAL PRIORITY
**What:** Voice-controlled system for common tasks
**Workflow:**
- "Assign John to Saturday's event"
- "What's the status of ABC Dance contract?"
- "Send reminder to Metro Promo about their invoice"
- Full CRUD operations via voice

**Current State:** NOT in mockups or spec
**Impact:** Massive UX improvement, especially mobile

**Where to Add:**
- Global component → floating voice button in bottom-right
- Accessible from every page
- Could add to Customize page → Dashboard Widgets → "Voice Command Widget"

---

### 12. **Editor Role & Access** ⭐ LOW PRIORITY (Future)
**What:** Separate user role for post-production editors
**Workflow:**
- Editors see only footage folders + delivery status
- Can mark deliverables as "In Progress" or "Complete"
- Upload final files to client delivery folder

**Current State:** Deliverables page has "Assigned Editor" column, but NO editor portal
**Impact:** Better post-production workflow

**Where to Add:**
- New "Editor Portal" (simplified view)
- Operators-style page but for editors
- Settings page → Account tab → add "Editor" role

---

### 13. **Phase Priority Change** ⭐ CRITICAL
**What:** Reorder development phases
**Old Order:** Registration → Scheduling → Execution → Delivery
**New Order:** **Scheduling → Execution → Delivery → Registration**

**Reasoning:** Scheduling is the immediate pain point, registration can be manual

**Where to Update:**
- MASTER_BUSINESS_LOGIC.md → reorder phases
- All planning documents
- Development roadmap

---

### 14. **Email-Only Client Experience (No Portal)** ⭐ CRITICAL
**What:** Clients never log in, only receive beautiful HTML emails
**Workflow:**
- All client interactions via email links
- Contract signing → link in email
- Invoice payment → link in email
- Questionnaire → link in email
- Deliverable download → link in email

**Current State:** Some mockups imply client login (e.g., Files page), but may not be needed
**Impact:** Simpler for clients, less to build

**Where to Update:**
- Remove any "client portal" mockups/features
- Focus on email templates + magic links
- Files page → contracts/invoices should generate shareable links

---

### 15. **Waterfall Launch (Full System Day 1)** ⭐ CRITICAL
**What:** Launch complete system at once, not MVP phases
**Reasoning:** Daniel wants full pipeline working (proposal → delivery) from day 1
**Impact:** Larger initial build, but better user experience

**Where to Update:**
- Development roadmap
- MVP definition
- Don't build "stripped down" version

---

## 📊 FEATURE SUMMARY

### By Priority:

**CRITICAL (Must Have Day 1):**
1. Vimeo Livestream Integration
2. Operator Footage Upload Links
3. Standardized Service Templates
4. Event-Specific Telegram Group Auto-Creation
5. AI Voice Agent
6. Phase Priority Change (Scheduling first)
7. Email-Only Client Experience
8. Waterfall Launch Strategy

**HIGH PRIORITY (Nice to Have Soon):**
- (none in this category - all moved to Critical or Medium)

**MEDIUM PRIORITY (Can Wait):**
9. Dance Recital Show Program Automation
10. Rebooking Automation
11. Client Pipeline Overview
12. Hotel Information in Gig Sheets
13. Partial-Day Availability (time ranges)

**LOW PRIORITY (Future Enhancement):**
14. Annual Revenue Summary Dashboard
15. Editor Role & Access

---

## 🎯 NEXT STEPS

### 1. **Update Spec Documents:**
- MASTER_BUSINESS_LOGIC.md → add new features
- PHASE1_SPEC.md → reorder to "Scheduling first"
- Create integration specs for Vimeo, Telegram auto-groups

### 2. **Update Mockups:**
- **Files page:** Add "Livestream" tab or button
- **Communications page:** Add "Show Program Reminder" to triggers
- **Communications page:** Show "Auto-created Telegram groups" status
- **Operators page:** Add "Upload Link" generation
- **Planning page:** Make partial-day availability functional
- **Dashboard:** Add "Event Pipeline" visualization
- **Global:** Add floating voice button

### 3. **Schema Updates:**
- Add Vimeo fields: `events.vimeo_event_id`, `events.stream_key`, `events.embed_code`
- Add hotel fields: `events.hotel_name`, `events.hotel_address`, `events.hotel_checkin_time`
- Add upload fields: `operators.upload_link`, `events.footage_upload_status`
- Add service template fields: `service_templates` table
- Add partial availability: `operator_availability.start_time`, `operator_availability.end_time`

### 4. **Integration Planning:**
- Vimeo API research + implementation plan
- Telegram Bot API for auto-group creation
- Google Drive API for upload link generation

---

## ❓ QUESTIONS TO CLARIFY

1. **Vimeo Integration:**
   - Which Vimeo plan do you have? (affects API limits)
   - Do you want auto-generated landing pages, or just embed codes?

2. **Telegram Auto-Groups:**
   - Should clients be invited to Telegram groups, or operators only?
   - What happens to groups after event is over? (archive, delete, keep?)

3. **Service Templates:**
   - How many standard services do you have? (~5? ~20?)
   - Should templates include operator assignments? (e.g., "Dance Recital Standard" = 2 operators)

4. **Footage Upload:**
   - Should upload links expire after X days?
   - Notification when operator uploads footage?

5. **Voice Agent:**
   - What's the primary use case? (scheduling, status checks, sending reminders?)
   - Should it work offline, or require internet?

6. **Phase Reordering:**
   - Does "Scheduling first" mean skip Registration entirely at launch?
   - Or just build Registration last?

---

**Total New Features:** 15
**Critical Priority:** 8
**Medium Priority:** 5
**Low Priority:** 2

**Next Action:** Discuss which features to add to mockups first, then update spec.
