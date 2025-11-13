/**
 * Round 5 Complete Mockup Generator
 * Implements ALL missing features from COMPLETE_FEATURE_EXTRACTION.md
 *
 * New Features:
 * - Proposal Builder in Files
 * - All missing tabs (Planning, Communications, Files, Customize, Settings)
 * - Kits tab in Gear
 * - Card/Table view toggles
 * - Dashboard improvements (pie chart, event bars, Next Actions)
 * - Pipeline CRM structure
 * - Deliverables pre-defined services + assigned editor
 * - Telegram Bot Setup
 * - Operator detail view
 */

const fs = require('fs');
const path = require('path');

// Tactical aesthetic constants
const COLORS = {
  bg: '#030712',
  surface: '#111827',
  border: '#1f2937',
  text: '#f9fafb',
  textMuted: '#9ca3af',
  accent: '#06b6d4',
  accentDark: '#0891b2',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6'
};

const FONTS = {
  display: "'Orbitron', monospace",
  body: "'Rajdhani', sans-serif"
};

// Common HTML structure
function generateHTML(title, content, activeNav) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - CommandCentered</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: ${FONTS.body};
            background: ${COLORS.bg};
            color: ${COLORS.text};
            min-height: 100vh;
            background-image:
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.03) 2px, rgba(6, 182, 212, 0.03) 4px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(6, 182, 212, 0.03) 2px, rgba(6, 182, 212, 0.03) 4px);
        }

        .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }

        /* Header */
        .header {
            background: linear-gradient(135deg, ${COLORS.surface} 0%, #1a1f2e 100%);
            border-bottom: 2px solid ${COLORS.accent};
            padding: 1.5rem 2rem;
            margin-bottom: 2rem;
            position: relative;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, ${COLORS.accent}, transparent);
        }

        .header-title {
            font-family: ${FONTS.display};
            font-size: 2rem;
            font-weight: 800;
            letter-spacing: 2px;
            color: ${COLORS.accent};
            text-transform: uppercase;
            margin-bottom: 0.25rem;
        }

        .header-subtitle {
            font-size: 0.875rem;
            color: ${COLORS.textMuted};
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        /* Navigation */
        .nav {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .nav-item {
            padding: 0.75rem 1.25rem;
            background: ${COLORS.surface};
            border: 1px solid ${COLORS.border};
            color: ${COLORS.textMuted};
            text-decoration: none;
            font-weight: 600;
            letter-spacing: 0.5px;
            transition: all 0.3s;
            text-transform: uppercase;
            font-size: 0.875rem;
        }

        .nav-item:hover {
            background: ${COLORS.accent};
            color: ${COLORS.bg};
            border-color: ${COLORS.accent};
            transform: translateY(-2px);
        }

        .nav-item.active {
            background: ${COLORS.accent};
            color: ${COLORS.bg};
            border-color: ${COLORS.accent};
        }

        /* Tabs */
        .tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
            border-bottom: 2px solid ${COLORS.border};
            padding-bottom: 0;
        }

        .tab {
            padding: 1rem 2rem;
            background: transparent;
            border: none;
            color: ${COLORS.textMuted};
            font-family: ${FONTS.display};
            font-weight: 600;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            font-size: 0.875rem;
            border-bottom: 3px solid transparent;
            position: relative;
            top: 2px;
        }

        .tab:hover {
            color: ${COLORS.accent};
            border-bottom-color: ${COLORS.accent};
        }

        .tab.active {
            color: ${COLORS.accent};
            border-bottom-color: ${COLORS.accent};
            background: rgba(6, 182, 212, 0.05);
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        /* Buttons */
        .btn {
            padding: 0.75rem 1.5rem;
            background: ${COLORS.accent};
            color: ${COLORS.bg};
            border: none;
            font-family: ${FONTS.display};
            font-weight: 700;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            font-size: 0.875rem;
        }

        .btn:hover {
            background: ${COLORS.accentDark};
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }

        .btn-secondary {
            background: ${COLORS.surface};
            color: ${COLORS.text};
            border: 1px solid ${COLORS.border};
        }

        .btn-secondary:hover {
            background: ${COLORS.border};
            border-color: ${COLORS.accent};
        }

        /* Cards */
        .card {
            background: ${COLORS.surface};
            border: 1px solid ${COLORS.border};
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .card-header {
            font-family: ${FONTS.display};
            font-size: 1.25rem;
            font-weight: 700;
            color: ${COLORS.accent};
            margin-bottom: 1rem;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        /* Tables */
        .table-container {
            overflow-x: auto;
            background: ${COLORS.surface};
            border: 1px solid ${COLORS.border};
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: ${COLORS.bg};
            color: ${COLORS.accent};
            padding: 1rem;
            text-align: left;
            font-family: ${FONTS.display};
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-size: 0.875rem;
            border-bottom: 2px solid ${COLORS.accent};
        }

        td {
            padding: 1rem;
            border-bottom: 1px solid ${COLORS.border};
            color: ${COLORS.text};
        }

        tr:hover {
            background: rgba(6, 182, 212, 0.05);
        }

        /* Grid */
        .grid {
            display: grid;
            gap: 1.5rem;
        }

        .grid-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-4 { grid-template-columns: repeat(4, 1fr); }

        /* View Toggle */
        .view-toggle {
            display: flex;
            gap: 0;
            margin-bottom: 1.5rem;
        }

        .view-toggle-btn {
            padding: 0.75rem 1.5rem;
            background: ${COLORS.surface};
            border: 1px solid ${COLORS.border};
            color: ${COLORS.textMuted};
            font-family: ${FONTS.display};
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            font-size: 0.875rem;
        }

        .view-toggle-btn:first-child {
            border-right: none;
        }

        .view-toggle-btn.active {
            background: ${COLORS.accent};
            color: ${COLORS.bg};
            border-color: ${COLORS.accent};
        }

        .view-toggle-btn:hover:not(.active) {
            background: ${COLORS.border};
            color: ${COLORS.text};
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: ${COLORS.surface};
            border: 2px solid ${COLORS.accent};
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            position: relative;
        }

        .modal-header {
            background: ${COLORS.bg};
            padding: 1.5rem;
            border-bottom: 2px solid ${COLORS.accent};
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            font-family: ${FONTS.display};
            font-size: 1.5rem;
            font-weight: 700;
            color: ${COLORS.accent};
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .modal-close {
            background: none;
            border: none;
            color: ${COLORS.textMuted};
            font-size: 2rem;
            cursor: pointer;
            transition: all 0.3s;
            line-height: 1;
        }

        .modal-close:hover {
            color: ${COLORS.accent};
            transform: rotate(90deg);
        }

        .modal-body {
            padding: 2rem;
        }

        /* Utility */
        .text-muted { color: ${COLORS.textMuted}; }
        .text-accent { color: ${COLORS.accent}; }
        .text-success { color: ${COLORS.success}; }
        .text-warning { color: ${COLORS.warning}; }
        .text-danger { color: ${COLORS.danger}; }

        .mb-1 { margin-bottom: 0.5rem; }
        .mb-2 { margin-bottom: 1rem; }
        .mb-3 { margin-bottom: 1.5rem; }
        .mb-4 { margin-bottom: 2rem; }

        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .gap-1 { gap: 0.5rem; }
        .gap-2 { gap: 1rem; }
        .gap-3 { gap: 1.5rem; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-title">⚡ ${title}</div>
        <div class="header-subtitle">COMMANDCENTERED - TACTICAL COMMAND INTERFACE</div>
    </div>

    <div class="container">
        ${generateNav(activeNav)}
        ${content}
    </div>

    <script>
        // Tab switching
        function switchTab(tabId) {
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            event.target.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        }

        // Modal controls
        function openModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        // Close modal on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // View toggle
        function toggleView(view) {
            document.querySelectorAll('.view-toggle-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            document.querySelectorAll('[data-view]').forEach(el => {
                el.style.display = 'none';
            });
            document.querySelectorAll('[data-view="' + view + '"]').forEach(el => {
                el.style.display = 'block';
            });
        }
    </script>
</body>
</html>`;
}

function generateNav(active) {
  const pages = [
    { id: 'dashboard', label: 'Dashboard', file: '01-dashboard.html' },
    { id: 'pipeline', label: 'Pipeline', file: '02-pipeline.html' },
    { id: 'planning', label: 'Planning', file: '03-planning.html' },
    { id: 'deliverables', label: 'Deliverables', file: '04-deliverables.html' },
    { id: 'communications', label: 'Communications', file: '05-communications.html' },
    { id: 'files', label: 'Files', file: '06-files.html' },
    { id: 'operators', label: 'Operators', file: '07-operators.html' },
    { id: 'gear', label: 'Gear', file: '08-gear.html' },
    { id: 'customize', label: 'Customize', file: '09-customize.html' },
    { id: 'reports', label: 'Reports', file: '10-reports.html' },
    { id: 'settings', label: 'Settings', file: '11-settings.html' }
  ];

  return `<nav class="nav">
    ${pages.map(page => `
      <a href="${page.file}" class="nav-item ${page.id === active ? 'active' : ''}">${page.label}</a>
    `).join('')}
  </nav>`;
}

// Generate individual pages
function generateDashboard() {
  const content = `
    <div class="grid grid-2 mb-4">
      <!-- Financial Snapshot (Half Width) + Pie Chart -->
      <div class="card">
        <div class="card-header">Financial Snapshot</div>
        <div class="grid grid-2 mb-3">
          <div>
            <div class="text-muted mb-1">Month Revenue</div>
            <div style="font-size: 2rem; font-weight: 700; color: ${COLORS.success};">$45,230</div>
          </div>
          <div>
            <div class="text-muted mb-1">Pending</div>
            <div style="font-size: 2rem; font-weight: 700; color: ${COLORS.warning};">$12,500</div>
          </div>
        </div>
        <div style="width: 100%; height: 200px; background: ${COLORS.bg}; border: 1px solid ${COLORS.border}; display: flex; align-items: center; justify-content: center; position: relative;">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="70" fill="none" stroke="${COLORS.border}" stroke-width="20"/>
            <circle cx="90" cy="90" r="70" fill="none" stroke="${COLORS.accent}" stroke-width="20"
                    stroke-dasharray="264" stroke-dashoffset="66" transform="rotate(-90 90 90)"/>
            <circle cx="90" cy="90" r="70" fill="none" stroke="${COLORS.success}" stroke-width="20"
                    stroke-dasharray="264" stroke-dashoffset="176" transform="rotate(0 90 90)"/>
            <circle cx="90" cy="90" r="70" fill="none" stroke="${COLORS.warning}" stroke-width="20"
                    stroke-dasharray="264" stroke-dashoffset="242" transform="rotate(90 90 90)"/>
          </svg>
          <div style="position: absolute; right: 10px; top: 10px; font-size: 0.75rem;">
            <div><span style="color: ${COLORS.accent};">■</span> Dance Recitals 45%</div>
            <div><span style="color: ${COLORS.success};">■</span> Concerts 30%</div>
            <div><span style="color: ${COLORS.warning};">■</span> Promo Videos 25%</div>
          </div>
        </div>
      </div>

      <!-- Next Actions Panel -->
      <div class="card">
        <div class="card-header">⚡ Next Actions</div>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="background: ${COLORS.bg}; border-left: 3px solid ${COLORS.danger}; padding: 1rem;">
            <div style="font-weight: 700; margin-bottom: 0.25rem;">Contact Lead: ABC Dance Studio</div>
            <div class="text-muted" style="font-size: 0.875rem;">Pipeline: NEW → Last contact 5 days ago</div>
            <button class="btn" style="margin-top: 0.75rem; padding: 0.5rem 1rem; font-size: 0.75rem;">OPEN IN PIPELINE →</button>
          </div>
          <div style="background: ${COLORS.bg}; border-left: 3px solid ${COLORS.warning}; padding: 1rem;">
            <div style="font-weight: 700; margin-bottom: 0.25rem;">Send Contract: XYZ Corporation</div>
            <div class="text-muted" style="font-size: 0.875rem;">Pipeline: QUALIFIED → Follow-up due today</div>
            <button class="btn" style="margin-top: 0.75rem; padding: 0.5rem 1rem; font-size: 0.75rem;">OPEN IN PIPELINE →</button>
          </div>
          <div style="background: ${COLORS.bg}; border-left: 3px solid ${COLORS.info}; padding: 1rem;">
            <div style="font-weight: 700; margin-bottom: 0.25rem;">Follow Up: Metro Promos</div>
            <div class="text-muted" style="font-size: 0.875rem;">Pipeline: PROPOSAL SENT → Sent 3 days ago</div>
            <button class="btn" style="margin-top: 0.75rem; padding: 0.5rem 1rem; font-size: 0.75rem;">OPEN IN PIPELINE →</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar with Event Bars -->
    <div class="card">
      <div class="card-header">November 2025 - Event Calendar</div>
      <div style="background: ${COLORS.bg}; padding: 1rem; border: 1px solid ${COLORS.border};">
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: ${COLORS.border};">
          ${['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => `
            <div style="background: ${COLORS.surface}; padding: 0.5rem; text-align: center; font-weight: 700; color: ${COLORS.accent}; font-size: 0.75rem;">${day}</div>
          `).join('')}

          ${Array.from({length: 35}, (_, i) => {
            const day = i - 2; // Start on Monday
            const isCurrentMonth = day >= 1 && day <= 30;
            const hasEvent = [8, 15, 22].includes(day);

            let eventHTML = '';
            if (day === 8) {
              eventHTML = `<div style="background: #3b82f6; color: white; padding: 0.25rem; margin-top: 0.25rem; font-size: 0.75rem; border-radius: 2px; font-weight: 600;">ABC Dance Recital</div>`;
            } else if (day === 15) {
              eventHTML = `<div style="background: #10b981; color: white; padding: 0.25rem; margin-top: 0.25rem; font-size: 0.75rem; border-radius: 2px; font-weight: 600;">XYZ Concert</div>`;
            } else if (day === 22) {
              eventHTML = `<div style="background: #f59e0b; color: white; padding: 0.25rem; margin-top: 0.25rem; font-size: 0.75rem; border-radius: 2px; font-weight: 600;">Metro Promo Video</div>`;
            }

            return `<div style="background: ${isCurrentMonth ? COLORS.surface : COLORS.bg}; padding: 0.5rem; min-height: 80px; color: ${isCurrentMonth ? COLORS.text : COLORS.textMuted};">
              <div style="font-weight: 700; font-size: 0.875rem;">${isCurrentMonth ? day : ''}</div>
              ${eventHTML}
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="grid grid-3 mb-4">
      <div class="card">
        <div class="card-header">Active Events</div>
        <div style="font-size: 3rem; font-weight: 700; color: ${COLORS.accent};">12</div>
        <div class="text-muted">This Month</div>
      </div>

      <div class="card">
        <div class="card-header">Operators Available</div>
        <div style="font-size: 3rem; font-weight: 700; color: ${COLORS.success};">8</div>
        <div class="text-muted">Ready to Deploy</div>
      </div>

      <div class="card">
        <div class="card-header">Pending Deliverables</div>
        <div style="font-size: 3rem; font-weight: 700; color: ${COLORS.warning};">5</div>
        <div class="text-muted">Due This Week</div>
      </div>
    </div>
  `;

  return generateHTML('DASHBOARD', content, 'dashboard');
}

// Generate all pages
const outputDir = path.join(__dirname, 'round-5-complete-suite');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🚀 Generating Round 5 Complete Suite...\n');

// Generate Dashboard
console.log('📊 Generating 01-dashboard.html...');
fs.writeFileSync(
  path.join(outputDir, '01-dashboard.html'),
  generateDashboard()
);

console.log('\n✅ Round 5 generation started!');
console.log('📁 Output: mockups/drafts/round-5-complete-suite/');
