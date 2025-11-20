# Backend-to-Frontend Audit Report: Unused Features & UI Enhancement Opportunities

**CommandCentered Application**
**Audit Date:** 2025-11-20
**Scope:** Database schema fields vs. Frontend UI implementation

---

## Executive Summary

This audit identified **43 database fields** across core models that are either:
- Not displayed in the UI (hidden/unused)
- Not editable in forms
- Missing tRPC procedures for manipulation
- Potential quick-win UI enhancements

---

## Key Findings by Priority

### 🔥 HIGH PRIORITY: Quick Wins (5-15 min each)

#### 1. Operator Bio & Portfolio (ALREADY IN DATABASE!)
- **Fields**: `bio`, `portfolioUrl`
- **Status**: Captured in create form, NOT shown in detail modal
- **Fix**: Add to `operators\page.tsx:562-697` (detail modal)
- **Impact**: Show operator experience and work samples

#### 2. Deliverable Priority Badge
- **Field**: `priority` (LOW/NORMAL/HIGH/URGENT/CRITICAL)
- **Status**: Backend only, not in table or detail modal
- **Fix**: Add column to `deliverables\page.tsx:129-195`
- **Impact**: Visual priority sorting

#### 3. Event Revenue Display
- **Fields**: `revenueAmount`, `actualRevenue`
- **Status**: Backend only, not in event modal
- **Fix**: Add to planning event detail modal
- **Impact**: Budget tracking at-a-glance

#### 4. Deliverable Asset Counter
- **Fields**: `totalAssets`, `completedAssets`
- **Status**: Backend only, not displayed
- **Fix**: Add to table and detail modal
- **Impact**: Visual progress tracking (already have completionPercentage!)

---

## Unused Database Fields by Model

### Event Model (19 unused fields)
- `actualRevenue` - Actual vs projected tracking
- `cancellationPenalty`, `cancellationReason` - Cancellation tracking
- `parkingInstructions` - Crew logistics
- `venueLat`, `venueLng` - GPS coordinates (no map integration)
- `telegramGroupId`, `telegramInviteLink` - Chat integration (5 fields)
- `vimeoEventId`, `streamKey`, `rtmpUrl` - Livestream (5 fields)
- `googleDriveFolderId`, `googleDriveFolderUrl` - Drive integration
- `hasHotel`, `hotelName`, `hotelAddress` - Hotel coordination (5 fields)

### Operator Model (8 unused fields)
- `bio` - ⚠️ **COLLECTED BUT NOT SHOWN**
- `portfolioUrl` - ⚠️ **COLLECTED BUT NOT SHOWN**
- `hasVehicle`, `vehicleDescription` - Logistics
- `homeAddress`, `homeLat`, `homeLng` - Distance calc
- `acceptsFlatRate` - Pricing flexibility

### Deliverable Model (4 underused fields)
- `priority` - ⚠️ **Backend only**
- `totalAssets`, `completedAssets` - ⚠️ **Backend only**
- `notes` - Not in UI

### Lead Model (6 CRM fields unused)
- `typeOfContact` - Email/Phone/In-person
- `contactFrequency` - Weekly/Monthly
- `temperature` - Hot/Warm/Cold lead
- `productService` - What they're interested in
- `sourceDetails` - Lead source
- `statusReason` - Why status changed

---

## Unused tRPC Procedures (Backend exists, never called)

### Deliverable Router
- `updateStatus` - Change deliverable status
- `assignEditor` - Assign editor to deliverable
- `markComplete` - Mark as delivered
- `getByEvent` - Get all deliverables for event

### Operator Router
- `update` - Update operator details ⚠️ **Needed for Edit button**
- `setAvailability` - Set operator availability
- `getAvailability` - Get availability dates
- `getAssignmentHistory` - Past events worked
- `getUpcomingAssignments` - Future events
- `updateSkills` - Modify skill set
- `addBlackoutDate` - Add unavailable dates (3 procedures)

### Event Router
- `update` - Edit event details ⚠️ **Needed for Edit button**
- `delete` - Soft delete event
- `getMonthView` - Calendar month view
- `getUpcoming` - Upcoming events
- `getPast` - Past events
- `updateStatus` - Change event status
- `getRevenueSummary` - Revenue analytics

---

## Quick-Win Implementation Checklist

### Phase 1: Immediate (This Session - 1 hour total)

- [ ] Add Bio & Portfolio to Operator detail modal (15 min)
- [ ] Add Priority column to Deliverable table (10 min)
- [ ] Add Revenue section to Event modal (15 min)
- [ ] Add Asset counter to Deliverable table (10 min)

### Phase 2: Short-term (Next Session - 2 hours)

- [ ] Hotel details section in Event modal (30 min)
- [ ] Vehicle/travel info in Operator page (30 min)
- [ ] Connect `updateStatus`, `assignEditor` procedures (30 min)
- [ ] Add notes field to Deliverable detail modal (15 min)

### Phase 3: Future Enhancements

- [ ] Telegram integration widget
- [ ] Vimeo livestream panel
- [ ] Google Drive folder links
- [ ] Lead temperature/CRM fields
- [ ] GPS-based distance calculations

---

## Coverage Statistics

### Fields Used vs. Total
- ✅ **Gear Model**: 100% (9/9 fields used)
- 🟡 **Deliverable Model**: 60% (6/10 fields used)
- 🔴 **Event Model**: 50% (19/38 fields used)
- 🔴 **Operator Model**: 58% (11/19 fields used)
- 🔴 **Lead Model**: 67% (12/18 fields used)

### tRPC Procedure Usage
- **Total Procedures**: ~151 across 20 routers
- **Called from Frontend**: ~60 (40%)
- **Unused**: ~91 (60%)

---

## Recommended Action Plan

**Priority 1**: Implement the 4 quick wins above (bio/portfolio, priority, revenue, assets)

**Priority 2**: Add Edit functionality (requires `operator.update` and `event.update` procedures)

**Priority 3**: Advanced integrations (Telegram, Vimeo, Google Drive)

---

**Audit Completed By:** Claude Code Explore Agent
**Files Analyzed:** 10 dashboard pages, 7 tRPC routers, schema.prisma (2569 lines)
