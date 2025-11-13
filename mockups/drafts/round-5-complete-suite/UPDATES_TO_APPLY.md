# Quick Mockup Updates - Copy/Paste Ready

Apply these updates to complete Round 3 integration.

---

## 1. FILES MOCKUP (06-files.html)

### A. Add Livestreams tab button (find line ~789, add after QUESTIONNAIRES button):

```html
<button class="tab" onclick="switchTab('livestreams-tab')" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%); border: 2px solid #ef4444;">📡 LIVESTREAMS (NEW)</button>
```

### B. Add Livestreams tab content (find line ~1084, add BEFORE closing `</div></div></div>`):

```html
        <!-- TAB 5: LIVESTREAMS (NEW - Round 3) -->
        <div id="livestreams-tab" class="tab-content">
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="color: #ef4444;">📡 Vimeo Livestream Events</h2>
                    <button class="button">+ CREATE LIVESTREAM</button>
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
                                    <button class="action-btn" title="View Landing">👁️</button>
                                    <button class="action-btn" title="Email Details">📧</button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>XYZ Concert<br>Nov 8</strong></td>
                                <td><span class="status status-pending">⚠️ NOT CREATED</span></td>
                                <td>-</td>
                                <td>-</td>
                                <td><button class="button" style="padding: 0.5rem;">GENERATE</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
```

### C. Add Service Library button (find line ~802, replace `+ NEW PROPOSAL` button):

```html
<div style="display: flex; gap: 1rem;">
    <button class="button" style="background: #10b981;">📚 SERVICE LIBRARY</button>
    <button class="button" onclick="showModal('proposal-builder-modal')">+ NEW PROPOSAL</button>
</div>
```

---

## 2. COMMUNICATIONS MOCKUP (05-communications.html)

### Add before closing content div (find line with last tab content, add BEFORE `</div></div></div>`):

```html
            <!-- Email Automation (NEW - Round 3) -->
            <div class="card" style="margin-top: 2rem;">
                <div class="card-header" style="color: #06b6d4;">📧 Automatic Email Triggers</div>
                <div style="display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem;">
                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981;">
                        <span style="color: #10b981; font-size: 1.5rem;">✅</span>
                        <div style="flex: 1;"><div style="font-weight: 700;">Contract signed → send deposit invoice</div></div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981;">
                        <span style="color: #10b981; font-size: 1.5rem;">✅</span>
                        <div style="flex: 1;"><div style="font-weight: 700;">48h before DANCE RECITAL → request show program (NEW)</div></div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981;">
                        <span style="color: #10b981; font-size: 1.5rem;">✅</span>
                        <div style="flex: 1;"><div style="font-weight: 700;">2-4 weeks after delivery → rebooking reminder (NEW)</div></div>
                    </div>
                </div>
            </div>

            <!-- Telegram Bot (NEW - Round 3) -->
            <div class="card" style="margin-top: 2rem;">
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
                            <div style="font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.5rem;">3 members: John Smith, Sarah Lee, Daniel</div>
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

## 3. PLANNING MOCKUP (03-planning.html)

### A. Add hotel fields to event modal (find event detail modal, add in form section):

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
    <div style="font-size: 0.875rem; color: #64748b; font-style: italic;">(Shows in gig sheets if filled)</div>
</div>
```

### B. Update operator availability note (find the legend, update it):

Change:
```html
✅ Available  ❌ Unavailable  🕐 Partial  ⚪ No Response
```

To:
```html
✅ Available (Full Day)  ❌ Unavailable  🕐 Partial (Click for times)  ⚪ No Response
```

---

## 4. DELIVERABLES MOCKUP (04-deliverables.html)

### A. Update table headers (find thead, replace):

```html
<thead>
    <tr>
        <th>EVENT</th>
        <th>SERVICE TYPE</th>
        <th>EDITOR</th>
        <th>DRIVE</th>
        <th>STATUS</th>
        <th>DUE</th>
        <th>ACTIONS</th>
    </tr>
</thead>
```

### B. Update first table row (replace first row in tbody):

```html
<tr>
    <td><strong>ABC Dance<br>Nov 15</strong></td>
    <td style="color: #06b6d4;">1 min landscape video</td>
    <td style="color: #10b981;"><a href="mailto:sarah@example.com" style="color: #10b981;">Sarah J.</a><br><small style="color: #64748b;">(email)</small></td>
    <td><button class="action-btn">📁</button></td>
    <td><span class="status status-progress">IN PROGRESS</span></td>
    <td>Nov 29</td>
    <td class="flex gap-1">
        <button class="action-btn">📤</button>
    </td>
</tr>
```

---

## 5. MOBILE MOCKUP (NEW FILE: mobile-commander.html)

Create new file with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>CommandCentered Mobile</title>
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Rajdhani', sans-serif;
            background: #030712;
            color: #e2e8f0;
            max-width: 375px;
            margin: 0 auto;
            padding-bottom: 80px;
        }
        .header {
            padding: 1rem;
            background: linear-gradient(180deg, #0c1220 0%, #030712 100%);
            border-bottom: 2px solid rgba(6, 182, 212, 0.3);
        }
        .logo-text {
            font-family: 'Orbitron', monospace;
            font-size: 18px;
            font-weight: 900;
            color: #22d3ee;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .card {
            background: linear-gradient(135deg, #0c1220 0%, #030712 100%);
            border: 2px solid rgba(6, 182, 212, 0.3);
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem;
        }
        .card-header {
            color: #06b6d4;
            font-weight: 700;
            font-size: 0.875rem;
            margin-bottom: 0.75rem;
            letter-spacing: 1px;
        }
        .metric {
            font-size: 2rem;
            font-weight: 700;
            color: #06b6d4;
            margin: 0.5rem 0;
        }
        .pipeline-stage {
            background: rgba(6, 182, 212, 0.1);
            border-left: 3px solid #06b6d4;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
        }
        .stage-name {
            font-size: 0.75rem;
            color: #64748b;
            font-weight: 700;
        }
        .stage-count {
            font-size: 1.5rem;
            font-weight: 700;
            color: #06b6d4;
        }
        .stage-value {
            color: #10b981;
            font-weight: 600;
        }
        .voice-fab {
            position: fixed;
            bottom: 16px;
            right: 16px;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
            border: 3px solid rgba(34, 211, 238, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            box-shadow: 0 8px 32px rgba(6, 182, 212, 0.6);
            z-index: 1000;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-text">⚡ COMMAND</div>
        <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">Nov 12, 2025 • 16:30 EST</div>
    </div>

    <div class="card">
        <div class="card-header">FINANCIAL SNAPSHOT</div>
        <div style="display: flex; justify-content: space-between;">
            <div>
                <div style="font-size: 0.75rem; color: #64748b;">Revenue (30d)</div>
                <div class="metric">$24.5K</div>
            </div>
            <div>
                <div style="font-size: 0.75rem; color: #64748b;">Outstanding</div>
                <div class="metric" style="color: #f59e0b;">$12.7K</div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header">📊 EVENT PIPELINE</div>
        <div class="pipeline-stage">
            <div class="stage-name">PROPOSAL SENT</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="stage-count">5</div>
                <div class="stage-value">$18K</div>
            </div>
        </div>
        <div class="pipeline-stage">
            <div class="stage-name">CONTRACT SIGNED</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="stage-count">3</div>
                <div class="stage-value">$12K</div>
            </div>
        </div>
        <div class="pipeline-stage">
            <div class="stage-name">DEPOSIT PAID</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="stage-count">8</div>
                <div class="stage-value">$32K</div>
            </div>
        </div>
        <div class="pipeline-stage">
            <div class="stage-name">EVENT CONFIRMED</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="stage-count">12</div>
                <div class="stage-value">$48K</div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header">⚠️ CRITICAL ALERTS</div>
        <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 0.75rem; margin-bottom: 0.5rem;">
            <div style="font-weight: 700; color: #ef4444; margin-bottom: 0.25rem;">Equipment Conflict</div>
            <div style="font-size: 0.875rem; color: #94a3b8;">Camera A double-booked Nov 15</div>
        </div>
        <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 0.75rem;">
            <div style="font-weight: 700; color: #ef4444; margin-bottom: 0.25rem;">Unsigned Contract</div>
            <div style="font-size: 0.875rem; color: #94a3b8;">Metro Promo - 7 days ago</div>
        </div>
    </div>

    <div class="voice-fab">🎤</div>
</body>
</html>
```

---

## APPLICATION NOTES:

1. **Files** - 2 edits (tab button + tab content + Service Library button)
2. **Communications** - 1 edit (add 2 card sections before closing div)
3. **Planning** - 2 edits (hotel fields in modal + update legend)
4. **Deliverables** - 2 edits (update headers + update first row)
5. **Mobile** - NEW FILE (375px viewport, simplified dashboard)

**Total Time:** ~15-20 minutes to apply all updates

**Result:** All 7 mockups complete for Round 3!
