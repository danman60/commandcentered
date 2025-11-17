# CommandCentered Mockup Action Plan (REVISED)
**Date:** November 17, 2025
**Updated:** Corrected page structure (tabs within Files/Settings)

---

## ✅ CORRECTED PAGE STRUCTURE

### Main Navigation (12 Pages Total):
1. **Dashboard** ❌ MISSING ENTIRELY
2. **Pipeline** ✅ Exists (needs updates)
3. **Planning** ✅ Exists (needs updates)
4. **Deliverables** ✅ Exists (needs updates)
5. **Communications** ✅ Exists (needs updates)
6. **Operators** ✅ Exists (needs updates)
7. **Gear** ✅ Exists (needs updates)
8. **Kits** ✅ Exists (via kit-creation-modal)
9. **Files** ✅ Exists (needs 5 additional tabs)
10. **Settings** ✅ Exists (needs 2 additional tabs)
11. **Lead Finder** ✅ Exists (Phase 0)
12. **Campaigns** ✅ Exists (Phase 0)

---

## 🚨 PRIORITY 1: Create Missing Dashboard

### 00-dashboard.html (NEW - CRITICAL)

**The main dashboard doesn't exist!** Must create from scratch.

```html
<!-- Dashboard Layout -->
<div class="dashboard">
  <!-- Header -->
  <header>
    <h1>CommandCentered</h1>
    <button>Customize Dashboard</button>
  </header>

  <!-- Widget Grid (6 widgets) -->
  <div class="widget-grid">
    <!-- 1. Event Pipeline -->
    <div class="widget event-pipeline" draggable="true">
      <button class="widget-close">×</button>
      <h3>Event Pipeline</h3>
      <div class="pipeline-stages">
        <div>Proposal Sent: 3</div>
        <div>Contract Signed: 2</div>
        <div>Deposit Paid: 2</div>
        <div>Event Confirmed: 5</div>
        <div>Completed: 8</div>
        <div>Delivered: 6</div>
      </div>
    </div>

    <!-- 2. Annual Revenue -->
    <div class="widget annual-revenue" draggable="true">
      <button class="widget-close">×</button>
      <h3>Annual Revenue</h3>
      <div>YTD: $125,430</div>
      <div>Goal: $200,000</div>
      <progress value="63" max="100"></progress>
      <div>Nov: $18,500 ▲ +15%</div>
    </div>

    <!-- 3. Upcoming Events -->
    <div class="widget upcoming-events" draggable="true">
      <button class="widget-close">×</button>
      <h3>Upcoming Events (Next 7 Days)</h3>
      <div class="event-list">
        <div class="event">
          <h4>Dec 6-7: EMPWR Dance Recital</h4>
          <div>📍 Blue Mountain Resort</div>
          <div>👥 JD, ST | 📷 Kit A, Kit B</div>
          <div class="warning">⚠️ Missing hotel info</div>
        </div>
        <!-- More events... -->
      </div>
    </div>

    <!-- 4. Critical Alerts -->
    <div class="widget critical-alerts" draggable="true">
      <button class="widget-close">×</button>
      <h3>Critical Alerts</h3>
      <ul>
        <li>⚠️ 3 events missing operators</li>
        <li>⚠️ 2 events missing kits</li>
        <li>🔴 1 contract expiring soon</li>
      </ul>
    </div>

    <!-- 5. Communications Timeline -->
    <div class="widget communications" draggable="true">
      <button class="widget-close">×</button>
      <h3>Recent Communications</h3>
      <ul>
        <li>Proposal sent: EMPWR (2 hours ago)</li>
        <li>Contract signed: Glow (Yesterday)</li>
        <li>Invoice paid: Studio X (3 days ago)</li>
      </ul>
    </div>

    <!-- 6. Calendar Color Bars (USER REQUESTED) -->
    <div class="widget calendar-bars" draggable="true">
      <button class="widget-close">×</button>
      <h3>December 2025</h3>
      <div class="month-grid">
        <!-- Calendar with color-coded event bars -->
        <div class="day">6 <span class="event-bar blue">EMPWR</span></div>
        <div class="day">7 <span class="event-bar blue">EMPWR</span></div>
        <div class="day">8 <span class="event-bar blue">Glow</span></div>
        <div class="day">9 <span class="event-bar yellow">Corp</span></div>
      </div>
      <div class="legend">
        <span class="blue">■</span> Confirmed
        <span class="yellow">■</span> Pending
        <span class="green">■</span> Completed
      </div>
    </div>
  </div>

  <!-- Microphone FAB -->
  <button class="microphone-fab">🎤</button>
</div>
```

---

## 📋 PRIORITY 2: Update Files Page with 6 Tabs

### 10-files.html (UPDATE)

**Current:** Single page showing files
**Required:** 6 tabs with different content

```html
<div class="files-page">
  <!-- Tab Navigation -->
  <div class="tabs">
    <button class="tab active">Files</button>
    <button class="tab">Proposals</button>
    <button class="tab">Contracts</button>
    <button class="tab">Questionnaires</button>
    <button class="tab">Invoices</button>
    <button class="tab">Livestreams</button>
  </div>

  <!-- Tab Content -->
  <div class="tab-content">
    <!-- Files Tab (existing) -->
    <div id="files-tab" class="active">
      <!-- Current files content -->
    </div>

    <!-- Proposals Tab (NEW) -->
    <div id="proposals-tab">
      <table>
        <thead>
          <tr>
            <th>Client ↕</th>
            <th>Date Received ↕</th>
            <th>Status ↕</th>
            <th>Value ↕</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>EMPWR Dance</td>
            <td>Nov 15, 2025</td>
            <td><span class="status reviewing">Reviewing</span></td>
            <td>$3,500</td>
            <td>
              <button>View</button>
              <button>Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="fab">+ New Proposal</button>
    </div>

    <!-- Contracts Tab (NEW) -->
    <div id="contracts-tab">
      <div class="split-layout">
        <div class="templates-panel">
          <h3>Templates</h3>
          <ul>
            <li>Standard Contract</li>
            <li>Dance Recital</li>
            <li>Multi-Date Event</li>
            <li>Corporate Package</li>
          </ul>
        </div>
        <div class="contracts-list">
          <table>
            <!-- Contract list -->
          </table>
        </div>
      </div>
    </div>

    <!-- Questionnaires Tab (NEW) -->
    <div id="questionnaires-tab">
      <table>
        <thead>
          <tr>
            <th>Client ↕</th>
            <th>Event Date ↕</th>
            <th>Status ↕</th>
            <th>Days Until Event ↕</th>
          </tr>
        </thead>
        <tbody>
          <tr class="status-red">
            <td>EMPWR Dance</td>
            <td>Dec 6, 2025</td>
            <td><span class="incomplete">Incomplete</span></td>
            <td>5 days ⚠️</td>
          </tr>
          <tr class="status-yellow">
            <td>Glow Dance</td>
            <td>Dec 15, 2025</td>
            <td><span class="pending">Pending</span></td>
            <td>14 days</td>
          </tr>
          <tr class="status-green">
            <td>Studio X</td>
            <td>Dec 20, 2025</td>
            <td><span class="complete">Complete</span></td>
            <td>19 days ✓</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Invoices Tab (NEW) -->
    <div id="invoices-tab">
      <table>
        <thead>
          <tr>
            <th>Invoice # ↕</th>
            <th>Client ↕</th>
            <th>Amount ↕</th>
            <th>Status ↕</th>
            <th>Due Date ↕</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#2025-001</td>
            <td>EMPWR Dance</td>
            <td>$3,500 + HST</td>
            <td><span class="paid">Paid</span></td>
            <td>Nov 30, 2025</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Livestreams Tab (NEW) -->
    <div id="livestreams-tab">
      <table>
        <thead>
          <tr>
            <th>Event ↕</th>
            <th>Viewing Page ↕</th>
            <th>Stream Key</th>
            <th>RTMP URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>EMPWR Recital</td>
            <td>streamstage.live/empwr-2025</td>
            <td>live_abc123...</td>
            <td>rtmp://a.rtmp.youtube.com/...</td>
            <td>
              <button>Copy Credentials</button>
              <button>View Embed</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="vimeo-button">Generate Vimeo Stream</button>
    </div>
  </div>
</div>
```

---

## 🔧 PRIORITY 3: Update Settings Page with Tabs

### 12-settings.html (UPDATE)

**Current:** Basic settings
**Required:** Add Customization and Integrations tabs

```html
<div class="settings-page">
  <!-- Tab Navigation -->
  <div class="tabs">
    <button class="tab active">General</button>
    <button class="tab">Customization</button>
    <button class="tab">Integrations</button>
    <button class="tab">Billing</button>
  </div>

  <!-- Tab Content -->
  <div class="tab-content">
    <!-- General Tab (existing) -->
    <div id="general-tab" class="active">
      <!-- Current settings content -->
    </div>

    <!-- Customization Tab (NEW) -->
    <div id="customization-tab">
      <h3>Dashboard Widgets</h3>
      <div class="widget-checkboxes">
        <label><input type="checkbox" checked> Event Pipeline</label>
        <label><input type="checkbox" checked> Annual Revenue</label>
        <label><input type="checkbox" checked> Upcoming Events</label>
        <label><input type="checkbox" checked> Critical Alerts</label>
        <label><input type="checkbox" checked> Communications</label>
        <label><input type="checkbox" checked> Calendar Color Bars</label>
      </div>

      <h3>Navigation Preferences</h3>
      <div class="nav-settings">
        <label><input type="checkbox"> Collapsible Sidebar</label>
        <label><input type="checkbox"> Allow Drag/Drop Reorder</label>
        <label><input type="checkbox"> Enable Double-Click Rename</label>
      </div>

      <h3>View Defaults</h3>
      <div class="view-settings">
        <label>Planning Page:
          <select>
            <option>Card View</option>
            <option>Table View</option>
            <option selected>Calendar View</option>
          </select>
        </label>
      </div>

      <button>Reset to Defaults</button>
    </div>

    <!-- Integrations Tab (NEW) -->
    <div id="integrations-tab">
      <div class="integration-list">
        <!-- Gmail -->
        <div class="integration-card">
          <h3>Gmail</h3>
          <p>Track client communication automatically</p>
          <button class="connect">Connect Gmail Account</button>
        </div>

        <!-- Google Drive -->
        <div class="integration-card">
          <h3>Google Drive</h3>
          <p>Auto-create folders, upload links</p>
          <button class="connected">✓ Connected</button>
        </div>

        <!-- Telegram -->
        <div class="integration-card">
          <h3>Telegram</h3>
          <p>Auto-create event groups</p>
          <input type="text" placeholder="Bot Token">
          <button>Save</button>
        </div>

        <!-- Vimeo -->
        <div class="integration-card">
          <h3>Vimeo</h3>
          <p>Auto-create livestream events</p>
          <input type="text" placeholder="API Key">
          <button>Save</button>
        </div>

        <!-- Stripe -->
        <div class="integration-card">
          <h3>Stripe</h3>
          <p>Payment processing</p>
          <button class="connected">✓ Connected</button>
        </div>

        <!-- SignWell -->
        <div class="integration-card">
          <h3>SignWell</h3>
          <p>E-signatures for contracts</p>
          <button>Connect</button>
        </div>

        <!-- Mailgun -->
        <div class="integration-card">
          <h3>Mailgun</h3>
          <p>Email sending</p>
          <input type="text" placeholder="API Key">
          <button>Save</button>
        </div>

        <!-- OpenAI -->
        <div class="integration-card">
          <h3>OpenAI</h3>
          <p>Voice control (Whisper + GPT-4)</p>
          <input type="text" placeholder="API Key">
          <button>Save</button>
        </div>
      </div>
    </div>

    <!-- Billing Tab (existing or new) -->
    <div id="billing-tab">
      <!-- Billing content -->
    </div>
  </div>
</div>
```

---

## 📊 REVISED MOCKUP COUNT

### What Actually Needs Creating:
1. **00-dashboard.html** - Main dashboard (CRITICAL)

### What Needs Major Updates:
1. **10-files.html** - Add 5 new tabs (Proposals, Contracts, Questionnaires, Invoices, Livestreams)
2. **12-settings.html** - Add 2 new tabs (Customization, Integrations)

### What Needs Minor Updates (existing mockups):
1. **06-pipeline-products.html** - Add 4-product tracking
2. **01-planning-calendar.html** - Add event bars with initials
3. **08-deliverables.html** - Add Google Drive column
4. **07-communications.html** - Add automation section
5. **09-operators.html** - Add calendar view
6. **04-gear-inventory.html** - Add 9 category tabs

### Global Updates (ALL mockups):
- Add Microphone FAB (bottom-right)
- Convert to icon-only view toggles
- Add sortable columns (↕ arrows)
- Implement 80% modal standard
- Add resizable panel dividers

---

## ✅ SIMPLIFIED ACTION ITEMS

### Day 1: Foundation
1. **CREATE** 00-dashboard.html with all 6 widgets + calendar bars
2. **UPDATE** 10-files.html with 6 tabs
3. **UPDATE** 12-settings.html with Customization + Integrations tabs

### Day 2: Feature Updates
1. Update remaining 6 mockups with missing features
2. Add global UI elements (Microphone FAB, sortables, etc.)

### Day 3: Polish & Verify
1. Ensure all spec features are represented
2. Verify navigation flow
3. Check Phase 0 → Phase 1 integration

---

## 📈 IMPROVED STRUCTURE BENEFITS

**Before:** 18+ separate pages
**After:** 12 pages with smart tab organization

**Benefits:**
- Cleaner navigation
- Related features grouped together
- Fewer clicks to access documents
- Better mental model for users
- Easier to implement

---

**This revised structure is much cleaner! Ready to implement?**