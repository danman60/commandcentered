# Mockup Feedback - November 11, 2025
**Feedback Session:** Round 4 Complete Suite
**Reviewer:** Daniel (User)
**Status:** Captured, ready to implement

---

## 📋 DASHBOARD (01-dashboard.html)

### **Financial Snapshot**
- [ ] **Make half width** (currently full width)
- [ ] **Add pie chart for revenue breakdown** (currently just numbers)
  - Show revenue by service type or client
  - Use tactical aesthetic colors

### **Calendar Month View**
- [ ] **Add event bars with names** (currently just color bars)
  - Reference: Google Calendar style (SEE SCREENSHOT in UXinspo)
  - Show event name ON the bar
  - Multi-day events span across days
- [ ] **Client color consistency**
  - Each client gets assigned color
  - All events for that client use same color
  - Color persists across all views

### **Next Actions Panel**
- [ ] **Add "Next Actions" section** (NEW - not in current mockup)
  - Pull from Pipeline page
  - Examples: "Contact Lead: ABC Dance", "Send Contract: XYZ Corp", "Follow up: Metro Promos"
  - Actionable items with due dates
  - Link to Pipeline for details

---

## 📋 PIPELINE (02-pipeline.html)

### **Match Current CRM System**
- [ ] **Reference XLSX attachment** (CRM data page in UXinspo folder)
- [ ] **Show products in sales pipeline stages**
  - Different products (Dance Recital, Concert, Promo Video, etc.)
  - Pipeline stages: Lead → Contacted → Qualified → Proposal Sent → Negotiation → Won/Lost
- [ ] **Add columns:**
  - [ ] Last Contacted (date)
  - [ ] Next Followup Due (date with urgency indicator)
  - [ ] Product/Service type
  - [ ] Pipeline stage
- [ ] **Better match existing workflow** (see XLSX for current structure)

---

## 📋 PLANNING (03-planning.html)

### **Default to Month View**
- [ ] **Month view as default** (currently shows week view)
- [ ] **Pin weekends to top** (user can pin specific weekends)
  - Pinned weekends always visible at top
  - Scrollable list of other weekends below

### **Click into Weekends**
- [ ] **Smooth animation** when clicking weekend
- [ ] **Show events for that weekend**
- [ ] **Break events into shifts** (check MASTER_SPECIFICATION_FINAL.md for shift logic)
- [ ] **Assign operators and kits to events**
  - Drag-drop operators
  - Drag-drop kits
  - Show conflicts visually

---

## 📋 DELIVERABLES (04-deliverables.html)

### **Pre-defined Service Offerings**
- [ ] **Services as products** (not custom text)
  - Examples: "1 min landscape", "3x 10s socials/reels", "Full event coverage"
  - **Check spec:** Does MASTER_SPECIFICATION_FINAL.md track service_type as product offerings?
  - If not in spec, add to schema/spec

### **Assigned Editor Column**
- [ ] **Add "Assigned Editor" column**
- [ ] **Click to email** (mailto: link or inline composer)
- [ ] Show editor name and contact

### **Google Drive Activity Notifications**
- [ ] **Notification for new activity in Google Drive**
  - When client uploads files
  - When deliverables added
  - **Implementation:** Google Drive webhook → notify Commander
  - **Check:** Is this in spec? If not, add to integrations

---

## 📋 COMMUNICATIONS (05-communications.html)

### **Telegram Bot Setup**
- [ ] **Add Telegram Bot setup page** (NEW section)
  - Configure bot for events
  - Show events without Telegram setup (alert/warning)
  - Quick "Setup Telegram Group" button per event

### **Telegram Embed/Chat**
- [ ] **Embed Telegram chat?**
  - Can Telegram widget embed into page to chat with specific events?
  - Research: Telegram Web embed capabilities
  - If possible: Inline chat per event
  - If not: Link to open Telegram app/web

---

## 📋 OPERATORS (07-operators.html)

### **Card View / Table View Toggle**
- [ ] **Add view toggle** (card view / table view)
  - **Apply to EVERY page** (operators, gear, deliverables, etc.)
  - Card view: Visual cards with quick stats, photos, availability
  - Table view: Dense data table (current view)

### **Operator Cards**
- [ ] **Show individual people with quick stats**
  - Photo/avatar
  - Availability this week (✅ ❌ 🕐)
  - Skills summary (camera ⭐⭐⭐⭐, drone ⭐⭐)
  - Upcoming events count

### **Detail View**
- [ ] **Click into operator for detail view**
  - Full profile
  - Edit details (inline or modal)
  - Skills matrix
  - Availability calendar
  - Assignment history
  - Equipment owned

---

## 📋 GEAR (08-gear.html)

### **Kits Section** (CRITICAL - NEW)
- [ ] **Add "Kits" tab** (Inventory / Calendar / Maintenance / **Kits** ← NEW)
- [ ] **Kit management:**
  - Create kits (e.g., "Standard Dance Kit", "Drone Package", "Audio Kit")
  - Add individual items to kits
  - Deploy kits to events (not individual items)
- [ ] **Missing Item Detection Logic**
  - When kit deployed to event, check if all items available
  - Warn if items already assigned elsewhere (conflict)
  - **Check spec:** MASTER_SPECIFICATION_FINAL.md for kit logic
  - **Reference:** Screenshots/XLSX in UXinspo folder top section

---

## 📋 CLEANUP TASKS

### **Remove Examples**
- [ ] **Remove incomplete questionnaires** from mockup examples
- [ ] **Files in UXinspo folder** (4 files) - remove from mockups

---

## 📁 REFERENCE FILES TO REVIEW

**User mentioned these files in UXinspo folder:**
1. **Google Calendar screenshot** - for event bars with names
2. **CRM XLSX** - current pipeline system structure
3. **Gear Kits screenshots/XLSX** - kit management examples
4. **(4 files to remove)** - incomplete questionnaire examples

**Action:** Review these files before implementing changes

---

## 🎯 PRIORITY ORDER

### **Critical (Implement First):**
1. **Gear Kits section** - Missing core functionality
2. **Pipeline structure** - Needs to match current system (XLSX)
3. **Planning month view** - Default view change + weekend drill-down
4. **Deliverables service offerings** - Pre-defined products

### **High Priority:**
1. **Dashboard calendar** - Event bars with names + client colors
2. **Dashboard Next Actions** - Pull from pipeline
3. **Operators card/table view** - Apply everywhere
4. **Communications Telegram setup** - New section

### **Medium Priority:**
1. **Dashboard pie chart** - Revenue visualization
2. **Deliverables editor assignment** - Email integration
3. **Google Drive notifications** - Integration feature

### **Research Required:**
1. **Telegram embed** - Is it possible? Research capabilities
2. **Service offerings in spec** - Does schema track pre-defined products?
3. **Kits in spec** - Is kit logic documented in MASTER_SPECIFICATION_FINAL.md?

---

## 📝 NEXT STEPS

1. **Review reference files in UXinspo folder**
2. **Check specs for:**
   - Service offerings / product definitions
   - Kit management logic
   - Shift breakdown logic
3. **Create updated mockups with changes**
4. **Second feedback round**

---

**Feedback captured by:** Claude Code
**Date:** November 11, 2025, 10:30 PM EST
**Status:** Ready to implement
