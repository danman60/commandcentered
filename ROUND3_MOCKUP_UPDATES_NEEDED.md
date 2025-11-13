# Round 3 Mockup Updates - Remaining Work

**Date:** 2025-11-12
**Status:** Specs complete, 2/7 mockups updated
**Commit:** dff5adb - Round 3 integration (specs, schema, dashboard)

---

## ✅ COMPLETED

### Specifications (100% Complete)
- ✅ MASTER_SPECIFICATION_FINAL.md (v4.0) - All 15 Round 3 features
- ✅ COMPLETE_PAGE_LAYOUTS.md - Detailed UI specs for all pages
- ✅ schema.prisma - 3 new tables + all new fields

### Mockups (2/7 Complete)
- ✅ **01-dashboard.html** - Event Pipeline + Annual Revenue widgets
- ✅ **02-pipeline.html** - Already has CRM structure

---

## 🔄 REMAINING MOCKUP UPDATES (5 files)

Use COMPLETE_PAGE_LAYOUTS.md as the specification for these updates.

### 1. **06-files.html** - Add Livestreams Tab + Service Library

**Tab Navigation (line ~785):**
Add new tab button:
```html
<button class="tab" onclick="switchTab('livestreams-tab')" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%); border: 2px solid #ef4444;">📡 LIVESTREAMS (NEW)</button>
```

**Proposals Tab (line ~800):**
Add Service Library button:
```html
<button class="button" onclick="showModal('service-library-modal')">📚 SERVICE LIBRARY</button>
```

**Before closing </body> tag:**
Add new Livestreams tab content:
```html
<!-- TAB 5: LIVESTREAMS (NEW - Round 3) -->
<div id="livestreams-tab" class="tab-content">
    <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="color: #ef4444;">📡 Vimeo Livestream Events</h2>
            <button class="button" onclick="showModal('create-livestream-modal')">+ CREATE LIVESTREAM</button>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>EVENT</th>
                        <th>VIMEO STATUS</th>
                        <th>STREAM KEY</th>
                        <th>EMBED CODE</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>ABC Dance<br>Nov 15</strong></td>
                        <td><span class="status status-accepted">✅ CREATED</span><br><small>Nov 9</small></td>
                        <td><code style="font-size: 0.75rem; color: #06b6d4;">rtmp://rtmp.vi...</code></td>
                        <td><code style="font-size: 0.75rem; color: #64748b;">&lt;iframe...&gt;</code></td>
                        <td class="flex gap-1">
                            <button class="action-btn" title="Copy Stream Key">📋</button>
                            <button class="action-btn" title="View Landing Page">👁️</button>
                            <button class="action-btn" title="Email Stream Details">📧</button>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>XYZ Concert<br>Nov 8</strong></td>
                        <td><span class="status status-pending">⚠️ NOT CREATED</span></td>
                        <td>-</td>
                        <td>-</td>
                        <td>
                            <button class="button" style="padding: 0.5rem;">GENERATE</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
```

---

### 2. **05-communications.html** - Email Triggers + Telegram

**Before existing tabs close:**
Add Email Automation section:
```html
<!-- Email Automation Triggers (NEW - Round 3) -->
<div class="card mb-4">
    <div class="card-header" style="color: #06b6d4;">📧 Automatic Email Triggers</div>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981;">
            <span style="color: #10b981; font-size: 1.5rem;">✅</span>
            <div style="flex: 1;">
                <div style="font-weight: 700;">Contract signed → send deposit invoice</div>
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981;">
            <span style="color: #10b981; font-size: 1.5rem;">✅</span>
            <div style="flex: 1;">
                <div style="font-weight: 700;">48h before DANCE RECITAL → request show program (NEW)</div>
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981;">
            <span style="color: #10b981; font-size: 1.5rem;">✅</span>
            <div style="flex: 1;">
                <div style="font-weight: 700;">2-4 weeks after delivery → rebooking reminder (NEW)</div>
            </div>
        </div>
    </div>
</div>

<!-- Telegram Bot Setup (NEW - Round 3) -->
<div class="card mb-4">
    <div class="card-header" style="color: #06b6d4;">💬 Telegram Integration</div>
    <div style="padding: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <div>
                <div style="font-weight: 700; margin-bottom: 0.5rem;">Bot Status:</div>
                <div style="color: #10b981; font-weight: 700;">✅ Connected (@CommandCenteredBot)</div>
            </div>
            <button class="button">BOT SETTINGS</button>
        </div>

        <div style="font-weight: 700; margin-bottom: 1rem; color: #64748b;">Auto-Created Event Groups:</div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="background: rgba(6, 182, 212, 0.1); padding: 1rem; border-left: 3px solid #06b6d4;">
                <div style="font-weight: 700; margin-bottom: 0.5rem;">ABC Dance Recital (Nov 15)</div>
                <div style="font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.5rem;">3 members: John Smith, Sarah Lee, Daniel (Commander)</div>
                <button class="button" style="padding: 0.5rem; font-size: 0.75rem;">OPEN GROUP →</button>
            </div>

            <div style="background: rgba(239, 68, 68, 0.1); padding: 1rem; border-left: 3px solid #ef4444;">
                <div style="font-weight: 700; margin-bottom: 0.5rem; color: #ef4444;">Metro Dance (Nov 22)</div>
                <div style="font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.5rem;">⚠️ No group created yet</div>
                <button class="button" style="padding: 0.5rem; font-size: 0.75rem; background: #ef4444;">CREATE GROUP →</button>
            </div>
        </div>
    </div>
</div>
```

---

### 3. **03-planning.html** - Partial Availability Modal + Hotel Fields

**In Tab 2 (Operator Availability):**
Make the partial day indicator clickable and add modal:

**Before closing </body> tag:**
```html
<!-- Partial Availability Modal (NEW - Round 3) -->
<div id="partial-availability-modal" class="modal" style="display: none;">
    <div class="modal-content" style="max-width: 400px;">
        <div class="modal-header">
            <h2>Partial Availability</h2>
            <button class="close-btn" onclick="closeModal('partial-availability-modal')">×</button>
        </div>
        <div class="modal-body">
            <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(6, 182, 212, 0.1); border-radius: 4px;">
                <div style="font-weight: 700; margin-bottom: 0.5rem;">John Smith - Nov 14</div>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 700;">Start Time</label>
                <select style="width: 100%; padding: 0.75rem; background: #030712; border: 1px solid #1f2937; color: #f9fafb;">
                    <option>9:00 AM</option>
                    <option selected>2:00 PM</option>
                    <option>5:00 PM</option>
                </select>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 700;">End Time</label>
                <select style="width: 100%; padding: 0.75rem; background: #030712; border: 1px solid #1f2937; color: #f9fafb;">
                    <option>12:00 PM</option>
                    <option selected>6:00 PM</option>
                    <option>9:00 PM</option>
                </select>
            </div>
        </div>
        <div class="modal-footer">
            <button class="button button-secondary" onclick="closeModal('partial-availability-modal')">CANCEL</button>
            <button class="button" onclick="savePartialAvailability()">SAVE</button>
            <button class="button" style="background: #10b981;" onclick="setFullDay()">FULL DAY</button>
        </div>
    </div>
</div>
```

**In event detail modal, add hotel fields:**
```html
<div style="border-top: 1px solid #1f2937; padding-top: 1rem; margin-top: 1rem;">
    <div style="font-weight: 700; margin-bottom: 1rem; color: #64748b;">═══ HOTEL INFORMATION (NEW) ═══</div>

    <div style="margin-bottom: 1rem;">
        <label>Hotel Name</label>
        <input type="text" placeholder="Enter hotel name..." style="width: 100%; padding: 0.75rem; background: #030712; border: 1px solid #1f2937; color: #f9fafb;">
    </div>

    <div style="margin-bottom: 1rem;">
        <label>Hotel Address</label>
        <textarea rows="2" placeholder="Enter hotel address..." style="width: 100%; padding: 0.75rem; background: #030712; border: 1px solid #1f2937; color: #f9fafb;"></textarea>
    </div>

    <div style="margin-bottom: 1rem;">
        <label>Check-in Time</label>
        <select style="width: 100%; padding: 0.75rem; background: #030712; border: 1px solid #1f2937; color: #f9fafb;">
            <option>2:00 PM</option>
            <option selected>3:00 PM</option>
            <option>4:00 PM</option>
        </select>
    </div>

    <div style="font-size: 0.875rem; color: #64748b; font-style: italic;">
        (Shows in gig sheets if filled)
    </div>
</div>
```

---

### 4. **04-deliverables.html** - Service Types + Assigned Editor

**Update table headers:**
```html
<th>SERVICE TYPE</th>
<th>EDITOR</th>
<th>DRIVE</th>
<th>STATUS</th>
```

**Update table rows:**
```html
<tr>
    <td><strong>ABC Dance<br>Nov 15</strong></td>
    <td style="color: #06b6d4;">1 min landscape video</td>
    <td style="color: #10b981;"><a href="#" style="color: #10b981;">Sarah J.</a><br><small style="color: #64748b;">(email)</small></td>
    <td><button class="action-btn">📁</button></td>
    <td><span class="status status-progress">IN PROGRESS</span></td>
</tr>
```

**Add "+ NEW DELIVERABLE" button with service type dropdown:**
```html
<!-- Create Deliverable Modal -->
<div id="create-deliverable-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Create Deliverable</h2>
            <button class="close-btn" onclick="closeModal('create-deliverable-modal')">×</button>
        </div>
        <div class="modal-body">
            <div style="margin-bottom: 1.5rem;">
                <label>Service Type</label>
                <select style="width: 100%; padding: 0.75rem; background: #030712; border: 1px solid #1f2937; color: #f9fafb;">
                    <option>Select from library...</option>
                    <option>1 min landscape video</option>
                    <option>3x 10s social media reels</option>
                    <option>Full event highlight (3-5 min)</option>
                    <option>Photo gallery (50+ images)</option>
                    <option>Custom type (enter text)</option>
                </select>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <label>Assigned Editor</label>
                <select style="width: 100%; padding: 0.75rem; background: #030712; border: 1px solid #1f2937; color: #f9fafb;">
                    <option>Select editor...</option>
                    <option>Sarah Johnson</option>
                    <option>John Doe</option>
                    <option>Unassigned</option>
                </select>
            </div>
        </div>
    </div>
</div>
```

---

### 5. **NEW: mobile-commander.html** - Mobile Mockup

Create new file with mobile-optimized version of dashboard:
- 375px width viewport
- Stacked cards instead of grid
- Simplified navigation (hamburger menu)
- Touch-optimized buttons (44px minimum)
- Event Pipeline as vertical list instead of horizontal
- Voice FAB prominent and larger (64px)

Reference: Use 01-dashboard.html as base but adapt for mobile viewport.

---

## Implementation Notes

1. All specs in COMPLETE_PAGE_LAYOUTS.md are the source of truth
2. Use existing card/table/modal styling from current mockups
3. Test all modals open/close with onclick handlers
4. Ensure tactical aesthetic is maintained (dark theme, cyan accents)
5. Voice FAB already exists in all mockups (no changes needed)

---

**Status:** Ready for manual completion or next development session.
