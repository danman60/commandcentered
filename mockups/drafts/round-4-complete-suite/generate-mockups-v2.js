// Generate all 11 CommandCentered HTML mockups with proper desktop widescreen layout
// Run with: node generate-mockups-v2.js

const fs = require('fs');
const path = require('path');

// Complete HTML template generator
function generatePage(config) {
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

    ${getVoiceFAB()}
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
            font-size: 24px;
            font-weight: 900;
            color: #22d3ee;
            text-transform: uppercase;
            letter-spacing: 3px;
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
            color: #94a3b8;
            text-decoration: none;
            transition: all 0.3s;
            border-left: 4px solid transparent;
            font-weight: 700;
            font-size: 16px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .nav-item:hover {
            background: rgba(6, 182, 212, 0.1);
            color: #22d3ee;
            border-left-color: rgba(6, 182, 212, 0.8);
        }

        .nav-item.active {
            background: linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, transparent 100%);
            color: #22d3ee;
            border-left-color: #06b6d4;
            text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
        }

        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            min-width: 0;
        }

        .top-bar {
            background: linear-gradient(90deg, #0c1220 0%, #1e293b 100%);
            border-bottom: 2px solid rgba(6, 182, 212, 0.3);
            padding: 18px 36px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            flex-shrink: 0;
        }

        .top-bar-left h1 {
            font-family: 'Orbitron', monospace;
            font-size: 26px;
            font-weight: 900;
            color: #22d3ee;
            text-transform: uppercase;
            letter-spacing: 3px;
            text-shadow: 0 0 10px rgba(34, 211, 238, 0.8);
        }

        .top-bar-left p {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-weight: 600;
        }

        .top-bar-right {
            display: flex;
            gap: 18px;
            align-items: center;
        }

        .status-indicator {
            padding: 8px 16px;
            background: rgba(16, 185, 129, 0.2);
            border: 1px solid rgba(16, 185, 129, 0.5);
            border-radius: 4px;
            color: #10b981;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .user-avatar {
            width: 44px;
            height: 44px;
            border-radius: 6px;
            background: linear-gradient(135deg, #0e7490 0%, #0c4a6e 100%);
            border: 2px solid rgba(6, 182, 212, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #22d3ee;
            font-weight: 900;
            font-size: 18px;
            text-shadow: 0 0 10px rgba(34, 211, 238, 0.8);
        }

        .dashboard-content {
            flex: 1;
            overflow-y: auto;
            padding: 28px 36px;
        }

        .section {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%);
            border: 2px solid rgba(6, 182, 212, 0.4);
            border-radius: 8px;
            padding: 28px;
            margin-bottom: 28px;
        }

        .section-title {
            font-family: 'Orbitron', monospace;
            font-size: 18px;
            font-weight: 900;
            color: #22d3ee;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 20px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            margin-bottom: 28px;
        }

        .stat-card {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%);
            border: 2px solid rgba(6, 182, 212, 0.4);
            border-radius: 8px;
            padding: 28px;
        }

        .stat-label {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 12px;
        }

        .stat-value {
            font-family: 'Orbitron', monospace;
            font-size: 48px;
            font-weight: 900;
            color: #22d3ee;
            text-shadow: 0 0 15px rgba(34, 211, 238, 0.6);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th {
            text-align: left;
            padding: 14px;
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            border-bottom: 2px solid rgba(6, 182, 212, 0.3);
        }

        td {
            padding: 18px 14px;
            color: #94a3b8;
            border-bottom: 1px solid rgba(6, 182, 212, 0.2);
        }

        button {
            padding: 14px 28px;
            background: linear-gradient(135deg, #0e7490 0%, #0c4a6e 100%);
            border: 2px solid rgba(6, 182, 212, 0.6);
            border-radius: 6px;
            color: #e2e8f0;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
        }

        @keyframes pulse-voice {
            0%, 100% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.6); }
            50% { box-shadow: 0 0 50px rgba(6, 182, 212, 0.9); }
        }
    </style>`;
}

function getSidebar(activeNav) {
  const items = [
    { name: 'Dashboard', icon: '📊', href: '01-dashboard.html' },
    { name: 'Pipeline', icon: '⚡', href: '02-pipeline.html' },
    { name: 'Planning', icon: '📅', href: '03-planning.html' },
    { name: 'Deliverables', icon: '📦', href: '04-deliverables.html' },
    { name: 'Communications', icon: '💬', href: '05-communications.html' },
    { name: 'Files', icon: '📁', href: '06-files.html' },
    { name: 'Operators', icon: '👥', href: '07-operators.html' },
    { name: 'Gear', icon: '🎥', href: '08-gear.html' },
    { name: 'Reports', icon: '📈', href: '09-reports.html' },
    { name: 'Customize', icon: '⚙️', href: '10-customize.html' },
    { name: 'Settings', icon: '🔧', href: '11-settings.html' }
  ];

  return `<div class="sidebar">
        <div class="logo">
            <div class="logo-text">
                <span>⚡</span>
                <span>COMMAND</span>
            </div>
            <div class="logo-subtitle">StreamStage Operations</div>
        </div>
        <nav class="nav">
            ${items.map(item => `
            <a href="${item.href}" class="nav-item${item.name === activeNav ? ' active' : ''}">
                <span>${item.icon}</span>
                <span>${item.name}</span>
            </a>`).join('')}
        </nav>
    </div>`;
}

function getTopBar(title, subtitle) {
  return `<div class="top-bar">
            <div class="top-bar-left">
                <h1>${title}</h1>
                <p>${subtitle}</p>
            </div>
            <div class="top-bar-right">
                <div class="status-indicator">● SYSTEMS OPERATIONAL</div>
                <div class="user-avatar">DA</div>
            </div>
        </div>`;
}

function getVoiceFAB() {
  return `<div style="position: fixed; bottom: 80px; right: 40px; width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #06b6d4 0%, #0e7490 100%); border: 2px solid rgba(6, 182, 212, 0.6); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; animation: pulse-voice 2s ease-in-out infinite;">
        <span style="font-size: 28px;">🎤</span>
    </div>`;
}

// Content generators
const contentGenerators = {
  pipeline: () => `<div class="dashboard-content">
        <div style="display: flex; gap: 14px; margin-bottom: 28px;">
            <button>➕ NEW LEAD</button>
            <button>⚡ NEW CLIENT</button>
            <button>📅 NEW EVENT</button>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">NEW LEADS</div>
                <div class="stat-value">8</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">ACTIVE PROPOSALS</div>
                <div class="stat-value">5</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">PENDING CONTRACTS</div>
                <div class="stat-value">3</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">CONVERSIONS (30D)</div>
                <div class="stat-value">65%</div>
            </div>
        </div>
        <div class="section">
            <div class="section-title">⚡ LEAD TABLE</div>
            <table>
                <thead>
                    <tr>
                        <th>ORGANIZATION</th>
                        <th>CONTACT</th>
                        <th>SERVICE</th>
                        <th>STATUS</th>
                        <th>DATE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">ABC Dance Studio</td>
                        <td>Jane Smith</td>
                        <td>Dance Recital</td>
                        <td><span style="background: rgba(34, 211, 238, 0.2); color: #22d3ee; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700;">NEW</span></td>
                        <td>Nov 8</td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">XYZ Dance Co</td>
                        <td>John Doe</td>
                        <td>Promo Video</td>
                        <td><span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700;">CONTACTED</span></td>
                        <td>Nov 5</td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">Metro Dance</td>
                        <td>Sarah Johnson</td>
                        <td>Concert Coverage</td>
                        <td><span style="background: rgba(139, 92, 246, 0.2); color: #8b5cf6; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700;">PROP SENT</span></td>
                        <td>Oct 28</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`,

  planning: () => `<div class="dashboard-content">
        <div class="section">
            <div class="section-title">⚡ WEEK OF NOV 10-16, 2025</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 120px;">OPERATOR</th>
                        <th>MON 10</th>
                        <th>TUE 11</th>
                        <th>WED 12</th>
                        <th>THU 13</th>
                        <th>FRI 14</th>
                        <th>SAT 15</th>
                        <th>SUN 16</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 700;">John Smith</td>
                        <td></td>
                        <td style="text-align: center;">
                            <div style="background: rgba(6, 182, 212, 0.3); border: 2px solid rgba(6, 182, 212, 0.5); border-radius: 4px; padding: 8px; font-size: 11px; color: #22d3ee;">
                                2PM<br>ABC Dance<br>📷 Cam A
                            </div>
                        </td>
                        <td></td>
                        <td></td>
                        <td style="text-align: center;">
                            <div style="background: rgba(16, 185, 129, 0.3); border: 2px solid rgba(16, 185, 129, 0.5); border-radius: 4px; padding: 8px; font-size: 11px; color: #10b981;">
                                6PM<br>XYZ Recital<br>📷 🚁
                            </div>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 700;">Sarah Lee</td>
                        <td></td>
                        <td></td>
                        <td style="text-align: center;">
                            <div style="background: rgba(245, 158, 11, 0.3); border: 2px solid rgba(245, 158, 11, 0.5); border-radius: 4px; padding: 8px; font-size: 11px; color: #f59e0b;">
                                3PM<br>Promo Video<br>🎥
                            </div>
                        </td>
                        <td></td>
                        <td style="text-align: center;">
                            <div style="background: rgba(236, 72, 153, 0.3); border: 2px solid rgba(236, 72, 153, 0.5); border-radius: 4px; padding: 8px; font-size: 11px; color: #ec4899;">
                                6PM<br>XYZ Recital<br>🎵
                            </div>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`,

  default: (pageName) => `<div class="dashboard-content">
        <div class="section">
            <div class="section-title">⚡ ${pageName.toUpperCase()} CONTENT</div>
            <p style="color: #64748b; line-height: 1.8;">
                Full page specification available in <strong>COMPLETE_PAGE_LAYOUTS.md</strong>.<br>
                This is a placeholder mockup showing the tactical aesthetic and desktop widescreen layout.
            </p>
        </div>
    </div>`
};

// Page configurations
const pages = [
  { filename: '01-dashboard.html', title: 'Command Dashboard', pageTitle: '⚡ COMMAND DASHBOARD', pageSubtitle: 'NOVEMBER 10, 2025 • 22:30 EST', activeNav: 'Dashboard', content: contentGenerators.default('Dashboard') },
  { filename: '02-pipeline.html', title: 'Pipeline', pageTitle: '⚡ PIPELINE', pageSubtitle: 'CRM & LEAD MANAGEMENT', activeNav: 'Pipeline', content: contentGenerators.pipeline() },
  { filename: '03-planning.html', title: 'Planning', pageTitle: '⚡ PLANNING', pageSubtitle: 'SCHEDULING & LOGISTICS', activeNav: 'Planning', content: contentGenerators.planning() },
  { filename: '04-deliverables.html', title: 'Deliverables', pageTitle: '⚡ DELIVERABLES', pageSubtitle: 'PRODUCTION & CLIENT FILES', activeNav: 'Deliverables', content: contentGenerators.default('Deliverables') },
  { filename: '05-communications.html', title: 'Communications', pageTitle: '⚡ COMMUNICATIONS', pageSubtitle: 'EMAIL & NOTIFICATIONS', activeNav: 'Communications', content: contentGenerators.default('Communications') },
  { filename: '06-files.html', title: 'Files', pageTitle: '⚡ FILES', pageSubtitle: 'PROPOSALS • CONTRACTS • INVOICES', activeNav: 'Files', content: contentGenerators.default('Files') },
  { filename: '07-operators.html', title: 'Operators', pageTitle: '⚡ OPERATORS', pageSubtitle: 'TEAM PROFILES & SKILLS', activeNav: 'Operators', content: contentGenerators.default('Operators') },
  { filename: '08-gear.html', title: 'Gear', pageTitle: '⚡ GEAR', pageSubtitle: 'EQUIPMENT INVENTORY', activeNav: 'Gear', content: contentGenerators.default('Gear') },
  { filename: '09-reports.html', title: 'Reports', pageTitle: '⚡ REPORTS', pageSubtitle: 'REVENUE & ANALYTICS', activeNav: 'Reports', content: contentGenerators.default('Reports') },
  { filename: '10-customize.html', title: 'Customize', pageTitle: '⚡ CUSTOMIZE', pageSubtitle: 'DASHBOARD & NOTIFICATIONS', activeNav: 'Customize', content: contentGenerators.default('Customize') },
  { filename: '11-settings.html', title: 'Settings', pageTitle: '⚡ SETTINGS', pageSubtitle: 'SYSTEM CONFIGURATION', activeNav: 'Settings', content: contentGenerators.default('Settings') }
];

// Generate all pages
pages.forEach(page => {
  const html = generatePage(page);
  fs.writeFileSync(path.join(__dirname, page.filename), html);
  console.log(`✓ Generated ${page.filename}`);
});

console.log('\n✅ All mockups generated successfully with desktop widescreen layout!');
