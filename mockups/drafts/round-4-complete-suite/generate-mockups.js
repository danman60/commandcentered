// Generate all 11 CommandCentered HTML mockups
// Run with: node generate-mockups.js

const fs = require('fs');
const path = require('path');

// Read the base dashboard HTML template
const dashboardTemplate = fs.readFileSync(path.join(__dirname, '../../dashboard.html'), 'utf8');

// Extract the base structure (head + sidebar + styles)
const headMatch = dashboardTemplate.match(/(<!DOCTYPE html>[\s\S]*?<\/head>)/);
const sidebarMatch = dashboardTemplate.match(/(<div class="sidebar">[\s\S]*?<\/div>\s*<\/div>)/);
const stylesMatch = dashboardTemplate.match(/(<style>[\s\S]*?<\/style>)/);

const baseHead = headMatch ? headMatch[1] : '';
const baseSidebar = sidebarMatch ? sidebarMatch[1] : '';
const baseStyles = stylesMatch ? stylesMatch[1] : '';

// Voice FAB HTML (add to all pages)
const voiceFAB = `
    <!-- Floating Voice FAB -->
    <div style="position: fixed; bottom: 80px; right: 40px; width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #06b6d4 0%, #0e7490 100%); border: 2px solid rgba(6, 182, 212, 0.6); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 0 30px rgba(6, 182, 212, 0.6); z-index: 1000; animation: pulse 2s ease-in-out infinite;">
        <span style="font-size: 28px;">🎤</span>
    </div>
`;

// Page configurations
const pages = [
  {
    filename: '01-dashboard.html',
    title: 'Command Dashboard',
    pageTitle: '⚡ COMMAND DASHBOARD',
    pageSubtitle: 'NOVEMBER 10, 2025 • 22:30 EST',
    activeNav: 'Dashboard',
    content: `<!-- Dashboard content already exists, copy from dashboard.html -->`
  },
  {
    filename: '02-pipeline.html',
    title: 'Pipeline - CommandCentered',
    pageTitle: '⚡ PIPELINE',
    pageSubtitle: 'CRM & LEAD MANAGEMENT',
    activeNav: 'Pipeline',
    content: generatePipelineContent()
  },
  {
    filename: '03-planning.html',
    title: 'Planning - CommandCentered',
    pageTitle: '⚡ PLANNING',
    pageSubtitle: 'SCHEDULING & LOGISTICS',
    activeNav: 'Planning',
    content: generatePlanningContent()
  },
  {
    filename: '04-deliverables.html',
    title: 'Deliverables - CommandCentered',
    pageTitle: '⚡ DELIVERABLES',
    pageSubtitle: 'PRODUCTION & CLIENT FILES',
    activeNav: 'Deliverables',
    content: generateDeliverablesContent()
  },
  {
    filename: '05-communications.html',
    title: 'Communications - CommandCentered',
    pageTitle: '⚡ COMMUNICATIONS',
    pageSubtitle: 'EMAIL & NOTIFICATIONS',
    activeNav: 'Communications',
    content: generateCommunicationsContent()
  },
  {
    filename: '06-files.html',
    title: 'Files - CommandCentered',
    pageTitle: '⚡ FILES',
    pageSubtitle: 'PROPOSALS • CONTRACTS • INVOICES • QUESTIONNAIRES',
    activeNav: 'Files',
    content: generateFilesContent()
  },
  {
    filename: '07-operators.html',
    title: 'Operators - CommandCentered',
    pageTitle: '⚡ OPERATORS',
    pageSubtitle: 'TEAM PROFILES & SKILLS',
    activeNav: 'Operators',
    content: generateOperatorsContent()
  },
  {
    filename: '08-gear.html',
    title: 'Gear - CommandCentered',
    pageTitle: '⚡ GEAR',
    pageSubtitle: 'EQUIPMENT INVENTORY & TRACKING',
    activeNav: 'Gear',
    content: generateGearContent()
  },
  {
    filename: '09-reports.html',
    title: 'Reports - CommandCentered',
    pageTitle: '⚡ REPORTS',
    pageSubtitle: 'REVENUE & ANALYTICS',
    activeNav: 'Reports',
    content: generateReportsContent()
  },
  {
    filename: '10-customize.html',
    title: 'Customize - CommandCentered',
    pageTitle: '⚡ CUSTOMIZE',
    pageSubtitle: 'DASHBOARD & NOTIFICATIONS',
    activeNav: 'Customize',
    content: generateCustomizeContent()
  },
  {
    filename: '11-settings.html',
    title: 'Settings - CommandCentered',
    pageTitle: '⚡ SETTINGS',
    pageSubtitle: 'SYSTEM CONFIGURATION',
    activeNav: 'Settings',
    content: generateSettingsContent()
  }
];

// Content generators for each page
function generatePipelineContent() {
  return `
    <!-- Pipeline Content -->
    <div class="dashboard-content">
        <!-- Action Buttons -->
        <div style="display: flex; gap: 14px; margin-bottom: 28px;">
            <button style="padding: 14px 28px; background: linear-gradient(135deg, #0e7490 0%, #0c4a6e 100%); border: 2px solid rgba(6, 182, 212, 0.6); border-radius: 6px; color: #e2e8f0; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);">
                ➕ NEW LEAD
            </button>
            <button style="padding: 14px 28px; background: linear-gradient(135deg, #0e7490 0%, #0c4a6e 100%); border: 2px solid rgba(6, 182, 212, 0.6); border-radius: 6px; color: #e2e8f0; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);">
                ⚡ NEW CLIENT
            </button>
            <button style="padding: 14px 28px; background: linear-gradient(135deg, #0e7490 0%, #0c4a6e 100%); border: 2px solid rgba(6, 182, 212, 0.6); border-radius: 6px; color: #e2e8f0; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);">
                📅 NEW EVENT
            </button>
        </div>

        <!-- CRM Widgets Grid -->
        <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
            <div class="stat-card">
                <div class="stat-label">NEW LEADS</div>
                <div class="stat-value" style="font-size: 48px;">8</div>
                <div class="stat-change positive">↑ 2 THIS WEEK</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">ACTIVE PROPOSALS</div>
                <div class="stat-value" style="font-size: 48px;">5</div>
                <div class="stat-change neutral" style="color: #22d3ee;">$18,500 VALUE</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">PENDING CONTRACTS</div>
                <div class="stat-value" style="font-size: 48px;">3</div>
                <div class="stat-change neutral" style="color: #22d3ee;">$12,000 VALUE</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">CONVERSIONS (30D)</div>
                <div class="stat-value" style="font-size: 48px;">65%</div>
                <div class="stat-change positive">↑ +8%</div>
            </div>
        </div>

        <!-- Lead Table -->
        <div class="section" style="margin-top: 28px;">
            <div class="section-header">
                <div class="section-title">⚡ LEAD TABLE</div>
                <div style="display: flex; gap: 12px;">
                    <input type="text" placeholder="SEARCH..." style="padding: 8px 16px; background: rgba(30, 41, 59, 0.5); border: 2px solid rgba(6, 182, 212, 0.4); border-radius: 4px; color: #e2e8f0; font-weight: 600; font-size: 12px;">
                    <select style="padding: 8px 16px; background: rgba(30, 41, 59, 0.5); border: 2px solid rgba(6, 182, 212, 0.4); border-radius: 4px; color: #e2e8f0; font-weight: 600; font-size: 12px;">
                        <option>FILTER: ALL</option>
                        <option>NEW</option>
                        <option>CONTACTED</option>
                        <option>QUALIFIED</option>
                    </select>
                </div>
            </div>

            <!-- Table -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="border-bottom: 2px solid rgba(6, 182, 212, 0.3);">
                        <th style="text-align: left; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">ORGANIZATION</th>
                        <th style="text-align: left; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">CONTACT</th>
                        <th style="text-align: left; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">SERVICE</th>
                        <th style="text-align: left; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">STATUS</th>
                        <th style="text-align: left; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">DATE</th>
                        <th style="text-align: left; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
                        <td style="padding: 18px 14px; color: #e2e8f0; font-weight: 600;">ABC Dance Studio</td>
                        <td style="padding: 18px 14px; color: #94a3b8;">Jane Smith</td>
                        <td style="padding: 18px 14px; color: #94a3b8;">Dance Recital</td>
                        <td style="padding: 18px 14px;"><span style="background: rgba(34, 211, 238, 0.2); color: #22d3ee; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700;">NEW</span></td>
                        <td style="padding: 18px 14px; color: #94a3b8;">Nov 8</td>
                        <td style="padding: 18px 14px; font-size: 18px;">✉️ 📞 ⚡</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
                        <td style="padding: 18px 14px; color: #e2e8f0; font-weight: 600;">XYZ Dance Co</td>
                        <td style="padding: 18px 14px; color: #94a3b8;">John Doe</td>
                        <td style="padding: 18px 14px; color: #94a3b8;">Promo Video</td>
                        <td style="padding: 18px 14px;"><span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700;">CONTACTED</span></td>
                        <td style="padding: 18px 14px; color: #94a3b8;">Nov 5</td>
                        <td style="padding: 18px 14px; font-size: 18px;">📄 💬</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
                        <td style="padding: 18px 14px; color: #e2e8f0; font-weight: 600;">Metro Dance</td>
                        <td style="padding: 18px 14px; color: #94a3b8;">Sarah Johnson</td>
                        <td style="padding: 18px 14px; color: #94a3b8;">Concert Coverage</td>
                        <td style="padding: 18px 14px;"><span style="background: rgba(139, 92, 246, 0.2); color: #8b5cf6; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700;">PROP SENT</span></td>
                        <td style="padding: 18px 14px; color: #94a3b8;">Oct 28</td>
                        <td style="padding: 18px 14px; font-size: 18px;">📊 👁️</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  `;
}

function generatePlanningContent() {
  return `
    <!-- Planning Content -->
    <div class="dashboard-content">
        <!-- Tabs -->
        <div style="display: flex; gap: 4px; margin-bottom: 28px; border-bottom: 2px solid rgba(6, 182, 212, 0.3);">
            <button style="padding: 14px 28px; background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, transparent 100%); border: none; border-bottom: 3px solid #06b6d4; color: #22d3ee; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; cursor: pointer;">
                CALENDAR VIEW
            </button>
            <button style="padding: 14px 28px; background: transparent; border: none; border-bottom: 3px solid transparent; color: #64748b; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; cursor: pointer;">
                OPERATOR AVAILABILITY
            </button>
            <button style="padding: 14px 28px; background: transparent; border: none; border-bottom: 3px solid transparent; color: #64748b; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; cursor: pointer;">
                EQUIPMENT SCHEDULE
            </button>
        </div>

        <!-- Week Calendar -->
        <div class="section">
            <div class="section-header">
                <div class="section-title">⚡ WEEK OF NOV 10-16, 2025</div>
                <div style="display: flex; gap: 12px;">
                    <button style="padding: 8px 16px; background: rgba(6, 182, 212, 0.2); border: 2px solid rgba(6, 182, 212, 0.4); border-radius: 4px; color: #22d3ee; font-weight: 700; font-size: 12px; cursor: pointer; text-transform: uppercase;">◀ PREV</button>
                    <button style="padding: 8px 16px; background: rgba(6, 182, 212, 0.2); border: 2px solid rgba(6, 182, 212, 0.4); border-radius: 4px; color: #22d3ee; font-weight: 700; font-size: 12px; cursor: pointer; text-transform: uppercase;">TODAY</button>
                    <button style="padding: 8px 16px; background: rgba(6, 182, 212, 0.2); border: 2px solid rgba(6, 182, 212, 0.4); border-radius: 4px; color: #22d3ee; font-weight: 700; font-size: 12px; cursor: pointer; text-transform: uppercase;">NEXT ▶</button>
                </div>
            </div>

            <!-- Schedule Grid -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="border-bottom: 2px solid rgba(6, 182, 212, 0.3);">
                        <th style="text-align: left; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; width: 120px;">OPERATOR</th>
                        <th style="text-align: center; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">MON 10</th>
                        <th style="text-align: center; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">TUE 11</th>
                        <th style="text-align: center; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">WED 12</th>
                        <th style="text-align: center; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">THU 13</th>
                        <th style="text-align: center; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">FRI 14</th>
                        <th style="text-align: center; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">SAT 15</th>
                        <th style="text-align: center; padding: 14px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">SUN 16</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
                        <td style="padding: 18px 14px; color: #e2e8f0; font-weight: 700;">John Smith</td>
                        <td style="padding: 18px 14px;"></td>
                        <td style="padding: 18px 14px; text-align: center;">
                            <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.1) 100%); border: 2px solid rgba(6, 182, 212, 0.5); border-radius: 4px; padding: 8px; font-size: 11px; font-weight: 700; color: #22d3ee;">
                                2PM<br>ABC Dance<br>📷 Cam A
                            </div>
                        </td>
                        <td style="padding: 18px 14px;"></td>
                        <td style="padding: 18px 14px;"></td>
                        <td style="padding: 18px 14px; text-align: center;">
                            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 100%); border: 2px solid rgba(16, 185, 129, 0.5); border-radius: 4px; padding: 8px; font-size: 11px; font-weight: 700; color: #10b981;">
                                6PM<br>XYZ Recital<br>📷 🚁
                            </div>
                        </td>
                        <td style="padding: 18px 14px; text-align: center;">
                            <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 100%); border: 2px solid rgba(139, 92, 246, 0.5); border-radius: 4px; padding: 8px; font-size: 11px; font-weight: 700; color: #8b5cf6;">
                                10AM<br>Metro Dance<br>📷
                            </div>
                        </td>
                        <td style="padding: 18px 14px;"></td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
                        <td style="padding: 18px 14px; color: #e2e8f0; font-weight: 700;">Sarah Lee</td>
                        <td style="padding: 18px 14px;"></td>
                        <td style="padding: 18px 14px;"></td>
                        <td style="padding: 18px 14px; text-align: center;">
                            <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(245, 158, 11, 0.1) 100%); border: 2px solid rgba(245, 158, 11, 0.5); border-radius: 4px; padding: 8px; font-size: 11px; font-weight: 700; color: #f59e0b;">
                                3PM<br>Promo Video<br>🎥
                            </div>
                        </td>
                        <td style="padding: 18px 14px;"></td>
                        <td style="padding: 18px 14px; text-align: center;">
                            <div style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.1) 100%); border: 2px solid rgba(236, 72, 153, 0.5); border-radius: 4px; padding: 8px; font-size: 11px; font-weight: 700; color: #ec4899;">
                                6PM<br>XYZ Recital<br>🎵
                            </div>
                        </td>
                        <td style="padding: 18px 14px; text-align: center;">
                            <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.1) 100%); border: 2px solid rgba(6, 182, 212, 0.5); border-radius: 4px; padding: 8px; font-size: 11px; font-weight: 700; color: #22d3ee;">
                                10AM<br>Metro Dance<br>🎵
                            </div>
                        </td>
                        <td style="padding: 18px 14px; text-align: center;">
                            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 100%); border: 2px solid rgba(16, 185, 129, 0.5); border-radius: 4px; padding: 8px; font-size: 11px; font-weight: 700; color: #10b981;">
                                2PM<br>Elite Dance<br>📷 🎥
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  `;
}

// Add more content generators for remaining pages...
function generateDeliverablesContent() { return `<div class="dashboard-content"><div class="section"><h2>Deliverables Content - See COMPLETE_PAGE_LAYOUTS.md for full spec</h2></div></div>`; }
function generateCommunicationsContent() { return `<div class="dashboard-content"><div class="section"><h2>Communications Content - See COMPLETE_PAGE_LAYOUTS.md for full spec</h2></div></div>`; }
function generateFilesContent() { return `<div class="dashboard-content"><div class="section"><h2>Files Content - See COMPLETE_PAGE_LAYOUTS.md for full spec</h2></div></div>`; }
function generateOperatorsContent() { return `<div class="dashboard-content"><div class="section"><h2>Operators Content - See COMPLETE_PAGE_LAYOUTS.md for full spec</h2></div></div>`; }
function generateGearContent() { return `<div class="dashboard-content"><div class="section"><h2>Gear Content - See COMPLETE_PAGE_LAYOUTS.md for full spec</h2></div></div>`; }
function generateReportsContent() { return `<div class="dashboard-content"><div class="section"><h2>Reports Content - See COMPLETE_PAGE_LAYOUTS.md for full spec</h2></div></div>`; }
function generateCustomizeContent() { return `<div class="dashboard-content"><div class="section"><h2>Customize Content - See COMPLETE_PAGE_LAYOUTS.md for full spec</h2></div></div>`; }
function generateSettingsContent() { return `<div class="dashboard-content"><div class="section"><h2>Settings Content - See COMPLETE_PAGE_LAYOUTS.md for full spec</h2></div></div>`; }

// Generate each page
pages.forEach(page => {
  if (page.filename === '01-dashboard.html') {
    // Just copy dashboard.html with voice FAB added
    const dashHTML = dashboardTemplate.replace('</body>', `${voiceFAB}\n</body>`);
    fs.writeFileSync(path.join(__dirname, page.filename), dashHTML);
    console.log(`✓ Generated ${page.filename}`);
    return;
  }

  // Update sidebar active state
  const updatedSidebar = baseSidebar.replace(
    new RegExp(`<a href="[^"]*" class="nav-item[^"]*">\\s*<span class="nav-icon">[^<]*</span>\\s*<span>${page.activeNav}</span>`, 'g'),
    `<a href="${page.filename}" class="nav-item active"><span class="nav-icon">📊</span><span>${page.activeNav}</span>`
  );

  const html = `
${baseHead.replace('<title>Command Dashboard - CommandCentered</title>', `<title>${page.title}</title>`)}
<body>
    ${updatedSidebar}

    <!-- Main Content -->
    <div class="main-content">
        <!-- Top Bar -->
        <div class="top-bar">
            <div class="top-bar-left">
                <h1>${page.pageTitle}</h1>
                <p>${page.pageSubtitle}</p>
            </div>
            <div class="top-bar-right">
                <div class="status-indicator">● SYSTEMS OPERATIONAL</div>
                <div class="alert-indicator">
                    🔔
                    <span class="alert-badge">3</span>
                </div>
                <div class="user-avatar">DA</div>
            </div>
        </div>

        ${page.content}
    </div>

    ${voiceFAB}
</body>
</html>
  `;

  fs.writeFileSync(path.join(__dirname, page.filename), html);
  console.log(`✓ Generated ${page.filename}`);
});

console.log('\n✅ All mockups generated successfully!');
console.log('Note: Some pages show placeholder content. Reference COMPLETE_PAGE_LAYOUTS.md for full specifications.');
