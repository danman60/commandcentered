# CommandCentered - ROUND 2 DECISIONS FINAL
## Critical Edge Cases & Implementation Details

**Date:** 2025-01-09
**Status:** ✅ COMPLETE - All edge cases resolved
**Impact:** These decisions prevent major rework later

---

## 🚨 MOST CRITICAL DISCOVERIES

### 1. OPERATOR PORTAL NEEDED (Scope Change)
**Original Plan:** No operator portal
**New Decision:** Minimal operator portal with:
- Partial day availability input (Doodle-style)
- View upcoming events
- Access gig sheets
- Quick links to Telegram groups

**Impact:** Adds new user type and auth flow

---

### 2. VOICE ASSISTANT FULL CRUD
**Original Plan:** Read-only queries
**New Decision:** Full CRUD operations via voice
> "Having the AI voice assistant able to have full CRUD would be killer"

**Impact:** Major feature - affects security model

---

### 3. MULTI-DATE CONTRACTS
**Discovery:** Single contract can cover multiple events
> "Contracts can have multiple dates on them"

**Impact:** Changes contract-event relationship (1-to-many)

---

## SECTION 1: FINANCIAL EDGE CASES ✅

### Partial Payment Handling
**Scenario:** Payment doesn't match invoice
**Decision:** Apply payment, show percentage paid, send notification
```typescript
// Implementation note
payment.percentage_paid = (amount_received / invoice_total) * 100
createAlert({ type: 'partial_payment', amount_received, expected })
```

### Cancellation Policy
**Decision:** Configurable deposit retention
- Default: Non-refundable deposit
- Event deletion cascades rollback of all logistics
- Operators/equipment freed up

### Tax Handling
**Decision:** Hard-coded 13% Ontario HST
- Schema supports variable rates for future
- No current complexity needed

### Chargebacks
**Decision:** Manual handling only
> "It has never happened. I will handle it manually."

### Post-Contract Additions
**Decision:** No contract modification
- Additional services added to final invoice
- No price negotiation after signing

---

## SECTION 2: SCHEDULING REVELATIONS ✅

### Operator Availability Granularity
**Major Change:** Need partial-day availability
- Morning only, afternoon only
- Location restrictions
- NO overtime/holiday rate logic

### Equipment Failures
**Decision:** Not handled by system
- Manual resolution only

### Sick Day Coverage
**Decision:** Manual handling
> "Just make a note that operator did not work and should not get paid"

### Multi-Location Events
**Decision:** Single event with timeline segments
- Never split into multiple events
- Affects travel calculations

### Gear Movement Between Events
**Decision:** Warn but never block
> "I never want to be blocked from doing something as the commander"

---

## SECTION 3: CLIENT MANAGEMENT CLARITY ✅

### Multiple Proposals
**Clarification:** Client builds their own via builder
- No comparison shopping
- No versioning needed
- Can abandon confirmed-but-unsigned

### Recurring Clients
**Decision:** Manual volume discounts
- Multi-date contracts supported
- No automated pricing tiers

### Referral Tracking
**Decision:** Out of scope completely

### Communication Preferences
**Decision:** Simple flags only
- Text vs email preference
- No DNC periods
- No complex routing

### Decision Makers
**Decision:** Single authorized contact
> "We only get changes from our client"

---

## SECTION 4: DATA & LEGAL REQUIREMENTS ✅

### Audit Trail
**Decision:** Full change history required
- Who, what, when on all contract changes
- Backdating explicitly allowed

### Operator Performance
**Decision:** Private commander metrics only
- Only track skill levels
- No complaints/compliments
- Operators see nothing

### Footage Ownership
**Decision:** No mention in contracts
- Defaults to Ontario law (company owns)
- Optional: QR code release form for guests

### Data Access Scoping
**Decision:** Extreme isolation
> "Operators only ever see what is on their gig sheet"
- No pay rate visibility
- No cross-operator data

---

## SECTION 5: AUTOMATION PHILOSOPHY ✅

### Bulk Operations
**Decision:** Not needed
> "I do not think we will need any sort of bulk actions"
- Focus on frictionless single operations

### Template Management
**Decision:** One-click save as template
- Per-client customization
- Except standardized dance recital

### System Blocks
**Decision:** NEVER block the commander
> "Never want hard blocks. Just warnings"
- All validations are overrideable

### Smart Suggestions
**Decision:** Yes to suggestions
- When viewing schedules
- Never intrusive
- Optimization hints

### Capacity Planning
**Decision:** Informational only
> "Almost always I will bring on additional staff or make it work"

---

## SECTION 6: INTEGRATION BOUNDARIES ✅

### Calendar Sync
**Decision:** Business calendar only
- Two-way sync required
- Ignore personal calendars
- Single timezone (EST)

### Accounting Integration
**Decision:** Revenue reporting only
> "CommandCentered can just end at client and revenue side"
- Export PDF/CSV/XLS
- No expense tracking
- No deep QuickBooks integration

### Marketing Attribution
**Decision:** Simple text field
> "Just a how did you hear about us field"
- No complex attribution
- No UTM tracking

---

## SECTION 7: CORE PHILOSOPHY ✅

### Focus on Pain Points
> "If the app can be an expert at scheduling and logistics and get me through the next busy season with less pain and friction with this AI voice agent ability, we are golden"

**Priority Stack:**
1. Scheduling excellence
2. Logistics mastery
3. Voice control
4. Everything else is secondary

### No Overbuilding
> "Not too concerned about [future features] for now"
- Solve current pain
- Don't anticipate needs
- Stay lean

---

## IMPLEMENTATION IMPACTS

### Database Schema Changes

1. **contracts ↔ events relationship**
   - Was: 1-to-1
   - Now: 1-to-many (multi-date contracts)

2. **operator_availability table needed**
   - Partial day slots
   - Location preferences
   - Date ranges

3. **audit_log table needed**
   - Full change tracking
   - User attribution
   - Timestamp + old/new values

### New Components Required

1. **Operator Portal** (new scope)
   - Auth system for operators
   - Availability calendar
   - Gig sheet viewer
   - Telegram links

2. **Voice Assistant Module**
   - Full CRUD permissions
   - Natural language processing
   - Command validation
   - Response generation

3. **Warning System**
   - Never blocking
   - Override capability
   - Logging overrides

### Removed/Simplified Features

1. ❌ Bulk operations
2. ❌ Marketing attribution
3. ❌ Expense tracking
4. ❌ Referral system
5. ❌ Multi-timezone support
6. ❌ Equipment failure workflows
7. ❌ Operator performance tracking
8. ❌ Complex tax rules
9. ❌ Automated volume discounts
10. ❌ Personal calendar sync

---

## KEY INSIGHTS FOR DEVELOPERS

### 1. Commander is God Mode
- Every validation can be overridden
- All warnings are dismissible
- System never says "no"

### 2. Operators are Extremely Limited
- See only their gig sheets
- No financial visibility
- No peer visibility
- Minimal portal access

### 3. Manual > Automated
- Many edge cases handled outside system
- Focus on recording, not enforcing
- Human judgment preferred

### 4. Voice is Primary Interface
- Not just queries - full CRUD
- This is the killer feature
- Worth significant investment

### 5. Keep It Simple
- No bulk operations
- No complex automations
- No blocking validations
- Just reduce friction

---

## NEXT STEPS

1. **Update schema for multi-date contracts**
2. **Design minimal operator portal**
3. **Architect voice CRUD system**
4. **Add audit_log table**
5. **Simplify validation layer**
6. **Remove blocked features from spec**

---

**These Round 2 decisions significantly refine the system design and prevent expensive pivots during implementation.**