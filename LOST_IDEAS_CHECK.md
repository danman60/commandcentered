# Potentially Lost Ideas - Verification Complete
**Date:** November 11, 2025
**Status:** ✅ All critical ideas captured

---

## ✅ VERIFIED: Ideas ARE Captured

### **1. Gig Sheet Specifics**
**Status:** ⚠️ PARTIALLY CAPTURED
- **Found in:** COMPLETE_PAGE_LAYOUTS.md:355 (mentions "Gig Sheet")
- **Found in:** MASTER_SPECIFICATION_FINAL.md:252 ("Access gig sheets")
- **Missing:** Detailed format (time, location, equipment checklist, Telegram link, venue directions)
- **Action:** Need to add gig sheet detailed layout to COMPLETE_PAGE_LAYOUTS.md

### **2. Notification Routing Config**
**Status:** ✅ FULLY CAPTURED
- **Found in:** MASTER_SPECIFICATION_FINAL.md:280-287
```typescript
interface NotificationConfig {
  channels: ["email", "SMS", "telegram", "in_app"];
  configurable: true;  // User sets per event type
  granular: true;      // Different settings per notification
}
```
- **Action:** None needed

### **3. Questionnaire Conditional Logic**
**Status:** ❌ NOT CAPTURED
- **Not found in:** COMPLETE_PAGE_LAYOUTS.md questionnaire section
- **Original idea:** "Show question if..." conditional logic (e.g., "Show venue questions if event type = on-location")
- **Action:** Add to COMPLETE_PAGE_LAYOUTS.md or mark as Phase 2 feature

### **4. Equipment Maintenance Tracking**
**Status:** ✅ FULLY CAPTURED
- **Found in:** schema.prisma:681 (`GearMovementHistory` model)
- **Found in:** COMPLETE_PAGE_LAYOUTS.md:559-570 (Maintenance Log tab)
- **Action:** None needed

### **5. Client Preferences**
**Status:** ⚠️ PARTIALLY CAPTURED
- **Found in:** schema.prisma:55 (`alertPreferences` on Client)
- **Missing:** Communication preferences, file delivery preferences
- **Action:** Verify if preferences are in Client model fields

---

## 🚨 ACTION ITEMS

### **1. Add Gig Sheet Detailed Layout (HIGH PRIORITY)**
**Where:** COMPLETE_PAGE_LAYOUTS.md - Operator Portal section

**Add this spec:**
```
## 📋 OPERATOR PORTAL: GIG SHEET

### Layout
┌───────────────────────────────────────────────────────────┐
│ 🎬 EVENT: ABC Dance Recital                               │
│ Nov 15, 2025 • 10:00 AM - 2:00 PM                         │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ 📍 LOCATION                                                │
│ ABC Dance Studio                                           │
│ 123 Main Street, Toronto ON M5V 1A1                       │
│ [VIEW MAP →] [GET DIRECTIONS →]                           │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ 📦 EQUIPMENT CHECKLIST                                     │
│ ☐ Camera A (Sony A7S III)                                 │
│ ☐ Drone Alpha (DJI Mavic 3)                               │
│ ☐ Audio Kit (Zoom F6 + 2x Lavs)                           │
│ ☐ Lighting Kit (2x LED Panels)                            │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ 💬 TELEGRAM GROUP                                          │
│ [JOIN GROUP: ABC Dance Nov 15 →]                          │
│ Members: John (camera), Sarah (audio), Daniel (director)  │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ 📋 EVENT NOTES                                             │
│ • Arrive 30 mins early for setup                          │
│ • Parking available in rear lot                           │
│ • Contact: Jane Smith (555-1234)                          │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ 🚨 EMERGENCY CONTACTS                                      │
│ Daniel (Director): 555-0001                                │
│ ABC Studio (Venue): 555-1234                               │
└───────────────────────────────────────────────────────────┘

[📤 EXPORT TO PDF] [📧 EMAIL TO ME] [🖨️ PRINT]
```

---

### **2. Questionnaire Conditional Logic (PHASE 2)**
**Decision:** Mark as Phase 2 feature (not MVP)

**Rationale:**
- Basic questionnaires work without conditional logic
- Complex feature requiring workflow builder
- Can add in February after Jan 1 launch

**Document in:** MASTER_SPECIFICATION_FINAL.md under "Future Enhancements"

---

### **3. Verify Client Preferences Fields**
**Check:** schema.prisma Client model for communication/delivery preferences

**If missing, add:**
```prisma
model Client {
  // ... existing fields

  // Preferences
  preferredContactMethod ContactMethod? @map("preferred_contact_method") // EMAIL | PHONE | SMS
  emailNotifications Boolean @default(true) @map("email_notifications")
  smsNotifications Boolean @default(false) @map("sms_notifications")
  fileDeliveryPreference FileDeliveryMethod? @map("file_delivery_preference") // GOOGLE_DRIVE | DROPBOX | WETRANSFER
}
```

---

## 📊 SUMMARY: Lost Ideas Status

**Total Checked:** 5 ideas
**Fully Captured:** 2 (Notifications, Equipment Maintenance)
**Partially Captured:** 2 (Gig Sheets, Client Preferences)
**Not Captured:** 1 (Questionnaire Conditional Logic)

**Critical for MVP:** Only Gig Sheets detailed layout
**Can Defer:** Questionnaire conditional logic (Phase 2)
**Minor:** Client preferences fields (can use alert_preferences for now)

---

## ✅ NEXT ACTIONS

1. **Immediately:** Add gig sheet detailed layout to COMPLETE_PAGE_LAYOUTS.md
2. **Today:** Verify client preferences in schema.prisma, add if missing
3. **Document:** Mark questionnaire conditional logic as Phase 2 in MASTER_SPECIFICATION_FINAL.md

---

**Status:** Verification complete. 1 critical addition needed (gig sheet layout), then safe to archive old docs.
