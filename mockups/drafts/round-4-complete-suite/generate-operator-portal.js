// Generate 4 Operator Portal HTML mockups
// Based on COMPLETE_PAGE_LAYOUTS.md lines 875-1113
// Run with: node generate-operator-portal.js

const fs = require('fs');
const path = require('path');

// Complete HTML template generator
function generateOperatorPage(config) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;900&display=swap" rel="stylesheet">
    ${getStyles()}
</head>
<body>
    ${getSidebar(config.activeNav)}

    <div class="main-content">
        ${getTopBar(config.pageTitle, config.pageSubtitle)}
        ${config.content}
    </div>
</body>
</html>`;
}

function getStyles() {
  return `<style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Rajdhani', monospace, sans-serif;
            background: #030712;
            background-image:
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.05) 2px, rgba(6, 182, 212, 0.05) 4px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(6, 182, 212, 0.05) 2px, rgba(6, 182, 212, 0.05) 4px),
                radial-gradient(ellipse at center, #0a1628 0%, #030712 100%);
            background-size: 40px 40px, 40px 40px, 100% 100%;
            color: #e2e8f0;
            display: flex;
            height: 100vh;
            overflow: hidden;
            min-width: 1200px;
        }

        .sidebar {
            width: 260px;
            background: linear-gradient(180deg, #0c1220 0%, #030712 100%);
            border-right: 2px solid rgba(6, 182, 212, 0.3);
            display: flex;
            flex-direction: column;
            box-shadow: 4px 0 32px rgba(6, 182, 212, 0.15);
            position: relative;
            flex-shrink: 0;
        }

        .logo {
            padding: 28px 24px;
            border-bottom: 2px solid rgba(6, 182, 212, 0.3);
            background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, transparent 100%);
        }

        .logo-text {
            font-family: 'Orbitron', monospace;
            font-size: 18px;
            font-weight: 900;
            color: #22d3ee;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(34, 211, 238, 0.8);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-subtitle {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 6px;
            font-weight: 600;
        }

        .nav {
            flex: 1;
            padding: 24px 0;
            overflow-y: auto;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 14px 24px;
            color: #64748b;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
        }

        .nav-item:hover {
            background: rgba(6, 182, 212, 0.1);
            color: #22d3ee;
        }

        .nav-item.active {
            background: linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, transparent 100%);
            border-left: 4px solid #06b6d4;
            color: #22d3ee;
            padding-left: 20px;
        }

        .main-content {
            flex: 1;
            overflow-y: auto;
            padding: 32px 40px;
        }

        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding-bottom: 24px;
            border-bottom: 2px solid rgba(6, 182, 212, 0.3);
        }

        .top-bar h1 {
            font-family: 'Orbitron', monospace;
            font-size: 32px;
            font-weight: 900;
            color: #22d3ee;
            text-transform: uppercase;
            letter-spacing: 4px;
            text-shadow: 0 0 20px rgba(34, 211, 238, 0.6);
        }

        .top-bar p {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 6px;
            font-weight: 600;
        }

        .section {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%);
            border: 2px solid rgba(6, 182, 212, 0.4);
            border-radius: 12px;
            padding: 28px;
            margin-bottom: 28px;
        }

        .section-title {
            font-family: 'Orbitron', monospace;
            font-size: 14px;
            font-weight: 900;
            color: #22d3ee;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 20px;
            text-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
        }

        .event-card {
            background: rgba(15, 23, 42, 0.6);
            border: 2px solid rgba(6, 182, 212, 0.3);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 16px;
        }

        .event-date {
            font-family: 'Orbitron', monospace;
            font-size: 12px;
            color: #22d3ee;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .event-title {
            font-size: 18px;
            font-weight: 700;
            color: #e2e8f0;
            margin-bottom: 12px;
        }

        .event-detail {
            color: #94a3b8;
            font-size: 14px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        button {
            padding: 12px 24px;
            background: linear-gradient(135deg, #0e7490 0%, #0c4a6e 100%);
            border: 2px solid rgba(6, 182, 212, 0.6);
            border-radius: 6px;
            color: #e2e8f0;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            transition: all 0.3s;
        }

        button:hover {
            background: linear-gradient(135deg, #06b6d4 0%, #0e7490 100%);
            box-shadow: 0 0 40px rgba(6, 182, 212, 0.6);
            transform: translateY(-2px);
        }

        .calendar-grid {
            display: grid;
            grid-template-columns: auto repeat(7, 1fr);
            gap: 8px;
            margin-top: 20px;
        }

        .calendar-header {
            font-family: 'Orbitron', monospace;
            font-size: 12px;
            font-weight: 700;
            color: #64748b;
            text-align: center;
            padding: 12px;
        }

        .calendar-cell {
            background: rgba(15, 23, 42, 0.5);
            border: 2px solid rgba(6, 182, 212, 0.3);
            border-radius: 6px;
            padding: 20px 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            min-height: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .calendar-cell:hover {
            background: rgba(6, 182, 212, 0.1);
            border-color: #06b6d4;
        }

        .calendar-cell.available {
            background: rgba(16, 185, 129, 0.1);
            border-color: rgba(16, 185, 129, 0.4);
        }

        .calendar-cell.unavailable {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.4);
        }

        .calendar-cell.partial {
            background: rgba(245, 158, 11, 0.1);
            border-color: rgba(245, 158, 11, 0.4);
        }

        .calendar-cell.booked {
            background: rgba(6, 182, 212, 0.2);
            border-color: #06b6d4;
            cursor: not-allowed;
        }

        .calendar-icon {
            font-size: 32px;
            margin-bottom: 8px;
        }

        .calendar-label {
            font-size: 11px;
            color: #64748b;
            font-weight: 700;
        }

        .info-box {
            background: rgba(34, 211, 238, 0.1);
            border-left: 4px solid #22d3ee;
            padding: 16px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .info-box p {
            color: #94a3b8;
            margin: 0;
            line-height: 1.6;
        }

        .checklist {
            list-style: none;
            padding: 0;
        }

        .checklist li {
            padding: 12px 0;
            color: #94a3b8;
            border-bottom: 1px solid rgba(6, 182, 212, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .checklist input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        input[type="text"], input[type="email"], input[type="tel"], select {
            width: 100%;
            padding: 12px;
            margin-bottom: 16px;
            background: rgba(15, 23, 42, 0.7);
            border: 2px solid rgba(6, 182, 212, 0.4);
            border-radius: 6px;
            color: #e2e8f0;
            font-family: 'Rajdhani', sans-serif;
            font-size: 14px;
            font-weight: 500;
        }

        input:focus, select:focus {
            outline: none;
            border-color: #06b6d4;
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
        }

        label {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #94a3b8;
            margin-bottom: 12px;
            cursor: pointer;
        }

        label input[type="checkbox"] {
            width: 20px;
            height: 20px;
        }
    </style>`;
}

function getSidebar(activeNav) {
  const items = [
    { name: 'My Events', icon: '📅', href: 'operator-01-my-events.html' },
    { name: 'Availability', icon: '🗓️', href: 'operator-02-availability.html' },
    { name: 'Gig Sheets', icon: '📋', href: 'operator-03-gig-sheets.html' },
    { name: 'Settings', icon: '⚙️', href: 'operator-04-settings.html' }
  ];

  const navHtml = items.map(item => `
        <a href="${item.href}" class="nav-item ${item.name === activeNav ? 'active' : ''}">
            <span style="font-size: 20px;">${item.icon}</span>
            <span>${item.name}</span>
        </a>
    `).join('');

  return `<div class="sidebar">
        <div class="logo">
            <div class="logo-text">⚡ OPERATOR PORTAL</div>
            <div class="logo-subtitle">StreamStage Operations</div>
        </div>
        <div class="nav">
            ${navHtml}
        </div>
    </div>`;
}

function getTopBar(title, subtitle) {
  return `<div class="top-bar">
            <div>
                <h1>${title}</h1>
                <p>${subtitle}</p>
            </div>
        </div>`;
}

// Content generators for each page
const contentGenerators = {
  myEvents: () => `<div>
        <div class="section">
            <div class="section-title">THIS WEEK</div>

            <div class="event-card">
                <div class="event-date">📅 FRI, NOV 15 • 10:00 AM - 2:00 PM</div>
                <div class="event-title">ABC Dance Recital</div>
                <div class="event-detail">📍 123 Main St, Toronto</div>
                <div class="event-detail">📦 Camera A, Drone Alpha, Audio Kit</div>
                <button style="margin-top: 12px;">VIEW GIG SHEET →</button>
            </div>

            <div class="event-card">
                <div class="event-date">📅 SAT, NOV 16 • 6:00 PM - 10:00 PM</div>
                <div class="event-title">XYZ Concert Coverage</div>
                <div class="event-detail">📍 456 Queen St, Toronto</div>
                <div class="event-detail">📦 Camera A, Camera B</div>
                <button style="margin-top: 12px;">VIEW GIG SHEET →</button>
            </div>
        </div>

        <div class="section">
            <div class="section-title">NEXT WEEK (NOV 18-24)</div>

            <div class="event-card">
                <div class="event-date">📅 WED, NOV 20 • 3:00 PM - 5:00 PM</div>
                <div class="event-title">Metro Promo Video Shoot</div>
                <div class="event-detail">📍 789 King St, Toronto</div>
                <div class="event-detail">📦 Camera A, Lighting Kit</div>
                <button style="margin-top: 12px;">VIEW GIG SHEET →</button>
            </div>
        </div>
    </div>`,

  availability: () => `<div>
        <div class="section">
            <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                <button>MARK UNAVAILABLE</button>
                <button>MARK PARTIAL</button>
                <button>CUSTOM RANGE →</button>
            </div>

            <div class="calendar-grid">
                <div class="calendar-header">YOU</div>
                <div class="calendar-header">NOV 15</div>
                <div class="calendar-header">NOV 16</div>
                <div class="calendar-header">NOV 17</div>
                <div class="calendar-header">NOV 18</div>
                <div class="calendar-header">NOV 19</div>
                <div class="calendar-header">NOV 20</div>
                <div class="calendar-header">NOV 21</div>

                <div class="calendar-cell" style="grid-column: 1;"></div>

                <div class="calendar-cell booked">
                    <div class="calendar-icon">⚠️</div>
                    <div class="calendar-label">BOOKED</div>
                </div>

                <div class="calendar-cell booked">
                    <div class="calendar-icon">⚠️</div>
                    <div class="calendar-label">BOOKED</div>
                </div>

                <div class="calendar-cell available">
                    <div class="calendar-icon">✅</div>
                    <div class="calendar-label">AVAILABLE</div>
                </div>

                <div class="calendar-cell available">
                    <div class="calendar-icon">✅</div>
                    <div class="calendar-label">AVAILABLE</div>
                </div>

                <div class="calendar-cell available">
                    <div class="calendar-icon">✅</div>
                    <div class="calendar-label">AVAILABLE</div>
                </div>

                <div class="calendar-cell partial">
                    <div class="calendar-icon">🕐</div>
                    <div class="calendar-label">3-6PM</div>
                </div>

                <div class="calendar-cell unavailable">
                    <div class="calendar-icon">❌</div>
                    <div class="calendar-label">UNAVAILABLE</div>
                </div>
            </div>

            <div style="margin-top: 28px;">
                <h3 style="font-family: 'Orbitron', monospace; color: #22d3ee; font-size: 12px; margin-bottom: 16px;">LEGEND</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; color: #94a3b8; font-size: 13px;">
                    <div>✅ Available (click to mark unavailable)</div>
                    <div>❌ Unavailable (click to mark available)</div>
                    <div>🕐 Partial (click to set time range)</div>
                    <div>⚠️ Booked (cannot change - event assigned)</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">QUICK MARK</div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <button>UNAVAILABLE THIS WEEKEND</button>
                <button>UNAVAILABLE NEXT WEEK</button>
                <button>AVAILABLE ALL WEEK</button>
            </div>
        </div>
    </div>`,

  gigSheets: () => `<div>
        <div class="section">
            <div class="section-title">🎬 EVENT DETAILS</div>
            <div style="color: #e2e8f0; line-height: 1.8;">
                <div style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">ABC Dance Recital</div>
                <div style="color: #94a3b8;">Friday, November 15, 2025</div>
                <div style="color: #94a3b8;">10:00 AM - 2:00 PM (4 hours)</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📍 LOCATION</div>
            <div style="color: #e2e8f0; line-height: 1.8;">
                <div style="font-weight: 700;">ABC Dance Studio</div>
                <div style="color: #94a3b8;">123 Main Street, Toronto ON M5V 1A1</div>
                <div style="margin-top: 12px; display: flex; gap: 12px;">
                    <button>VIEW MAP →</button>
                    <button>GET DIRECTIONS →</button>
                </div>
                <div style="margin-top: 16px; color: #94a3b8; line-height: 1.8;">
                    <div>🅿️ Parking: Rear lot, enter via alley</div>
                    <div>🚪 Entrance: Side door (knock, Jane will let you in)</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📦 EQUIPMENT CHECKLIST</div>
            <ul class="checklist">
                <li><input type="checkbox"> Camera A (Sony A7S III) - Serial #12345</li>
                <li><input type="checkbox"> Drone Alpha (DJI Mavic 3) - Serial #67890</li>
                <li><input type="checkbox"> Audio Kit (Zoom F6 + 2x Lavs)</li>
                <li><input type="checkbox"> Lighting Kit (2x LED Panels)</li>
                <li><input type="checkbox"> Extra Batteries (Camera x4, Drone x3)</li>
                <li><input type="checkbox"> Memory Cards (2x 256GB SD)</li>
            </ul>
        </div>

        <div class="section">
            <div class="section-title">👥 TEAM</div>
            <div style="color: #94a3b8; line-height: 2;">
                <div><strong style="color: #22d3ee;">John Smith (You)</strong> - Camera & Drone</div>
                <div>Sarah Lee - Audio</div>
                <div>Daniel Abrahamson - Director / Commander</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">💬 TELEGRAM GROUP</div>
            <button>JOIN GROUP: ABC Dance Nov 15 →</button>
            <div style="margin-top: 12px; color: #94a3b8; font-size: 13px;">
                Members: John, Sarah, Daniel<br>
                Quick access to event coordination
            </div>
        </div>

        <div class="section">
            <div class="section-title">📋 EVENT NOTES & INSTRUCTIONS</div>
            <div style="color: #94a3b8; line-height: 1.8;">
                <div>• Arrive 30 mins early for setup (9:30 AM)</div>
                <div>• Parking available in rear lot</div>
                <div>• 3 acts, 5-minute breaks between</div>
                <div>• Film from balcony (best angle for wide shots)</div>
                <div>• Client wants drone footage of exterior</div>
                <div>• Contact venue manager for access to balcony</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📞 CONTACTS</div>
            <div style="color: #94a3b8; line-height: 1.8;">
                <div><strong style="color: #e2e8f0;">Client:</strong> Jane Smith (555-1234) - jane@abcdance.com</div>
                <div><strong style="color: #e2e8f0;">Venue:</strong> ABC Dance Studio (555-5678)</div>
                <div><strong style="color: #e2e8f0;">Director:</strong> Daniel Abrahamson (555-0001)</div>
                <div style="margin-top: 16px; color: #ef4444; font-weight: 700;">🚨 EMERGENCY CONTACT: Daniel (555-0001)</div>
            </div>
        </div>

        <div class="section">
            <div style="display: flex; gap: 12px;">
                <button>📤 EXPORT TO PDF</button>
                <button>📧 EMAIL TO ME</button>
                <button>🖨️ PRINT</button>
            </div>
        </div>
    </div>`,

  settings: () => `<div>
        <div class="section">
            <div class="section-title">👤 PROFILE</div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 8px; color: #94a3b8; font-weight: 600;">Name</label>
                <input type="text" value="John Smith">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 8px; color: #94a3b8; font-weight: 600;">Email</label>
                <input type="email" value="john@streamstage.live">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 8px; color: #94a3b8; font-weight: 600;">Phone</label>
                <input type="tel" value="555-0123">
            </div>
            <button>SAVE CHANGES</button>
        </div>

        <div class="section">
            <div class="section-title">🔔 NOTIFICATION PREFERENCES</div>
            <label>
                <input type="checkbox" checked>
                Email me when assigned to new event
            </label>
            <label>
                <input type="checkbox" checked>
                Email me 24 hours before event
            </label>
            <label>
                <input type="checkbox">
                SMS reminders (optional, costs may apply)
            </label>
            <label>
                <input type="checkbox" checked>
                Telegram notifications
            </label>
        </div>

        <div class="section">
            <div class="section-title">🗓️ CALENDAR SYNC</div>
            <p style="color: #94a3b8; margin-bottom: 16px;">Sync my events to:</p>
            <label>
                <input type="checkbox">
                Google Calendar
            </label>
            <label>
                <input type="checkbox">
                Apple Calendar
            </label>
            <label>
                <input type="checkbox">
                Outlook Calendar
            </label>
        </div>

        <div class="section">
            <div class="section-title">🔒 ACCOUNT</div>
            <div style="display: flex; gap: 12px;">
                <button>CHANGE PASSWORD</button>
                <button style="background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4); color: #ef4444;">LOGOUT</button>
            </div>
        </div>
    </div>`
};

// Page configurations
const pages = [
  {
    filename: 'operator-01-my-events.html',
    title: 'My Events - Operator Portal',
    pageTitle: '⚡ MY UPCOMING EVENTS',
    pageSubtitle: 'YOUR ASSIGNED EVENTS',
    activeNav: 'My Events',
    content: contentGenerators.myEvents()
  },
  {
    filename: 'operator-02-availability.html',
    title: 'Availability - Operator Portal',
    pageTitle: '⚡ MY AVAILABILITY',
    pageSubtitle: 'SET YOUR AVAILABILITY',
    activeNav: 'Availability',
    content: contentGenerators.availability()
  },
  {
    filename: 'operator-03-gig-sheets.html',
    title: 'Gig Sheets - Operator Portal',
    pageTitle: '⚡ GIG SHEET: ABC DANCE RECITAL',
    pageSubtitle: 'EVENT BRIEF & DETAILS',
    activeNav: 'Gig Sheets',
    content: contentGenerators.gigSheets()
  },
  {
    filename: 'operator-04-settings.html',
    title: 'Settings - Operator Portal',
    pageTitle: '⚡ SETTINGS',
    pageSubtitle: 'PROFILE & PREFERENCES',
    activeNav: 'Settings',
    content: contentGenerators.settings()
  }
];

// Generate all pages
pages.forEach(page => {
  const html = generateOperatorPage(page);
  fs.writeFileSync(path.join(__dirname, page.filename), html);
  console.log(`✓ Generated ${page.filename}`);
});

console.log('\n✅ All operator portal mockups generated successfully!');
