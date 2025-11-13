// Generate all 11 CommandCentered HTML mockups with FULL CONTENT
// Based on COMPLETE_PAGE_LAYOUTS.md specifications
// Run with: node generate-complete-mockups.js

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
    ${getModals()}
    ${getModalScripts()}
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

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 2px solid rgba(6, 182, 212, 0.3);
        }

        .section-title {
            font-family: 'Orbitron', monospace;
            font-size: 18px;
            font-weight: 900;
            color: #22d3ee;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
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
            transition: all 0.3s;
        }

        .stat-card:hover {
            border-color: #22d3ee;
            box-shadow: 0 8px 40px rgba(6, 182, 212, 0.3);
            transform: translateY(-4px);
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
            transition: all 0.3s;
        }

        button:hover {
            background: linear-gradient(135deg, #06b6d4 0%, #0e7490 100%);
            box-shadow: 0 0 40px rgba(6, 182, 212, 0.6);
            transform: translateY(-2px);
        }

        .tabs {
            display: flex;
            gap: 4px;
            margin-bottom: 28px;
            border-bottom: 2px solid rgba(6, 182, 212, 0.3);
        }

        .tab {
            padding: 14px 28px;
            background: transparent;
            border: none;
            border-bottom: 3px solid transparent;
            color: #64748b;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .tab.active {
            background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, transparent 100%);
            border-bottom-color: #06b6d4;
            color: #22d3ee;
        }

        .badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .badge-new { background: rgba(34, 211, 238, 0.2); color: #22d3ee; }
        .badge-contacted { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .badge-sent { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }
        .badge-signed { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .badge-paid { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .badge-pending { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .badge-warning { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

        .calendar {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 8px;
            margin-top: 20px;
        }

        .calendar-day {
            background: rgba(15, 23, 42, 0.5);
            border: 2px solid rgba(6, 182, 212, 0.3);
            border-radius: 6px;
            padding: 12px 8px;
            min-height: 100px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .calendar-day-number {
            font-family: 'Orbitron', monospace;
            font-size: 18px;
            font-weight: 900;
            color: #e2e8f0;
            margin-bottom: 8px;
        }

        .event-bar {
            height: 6px;
            border-radius: 2px;
            box-shadow: 0 0 8px currentColor;
        }

        @keyframes pulse-voice {
            0%, 100% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.6); }
            50% { box-shadow: 0 0 50px rgba(6, 182, 212, 0.9); }
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2000;
            width: 90%;
            max-width: 600px;
            max-height: 85vh;
            overflow-y: auto;
            background: linear-gradient(135deg, #0c1220 0%, #1e293b 100%);
            border: 2px solid #06b6d4;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(6, 182, 212, 0.4);
        }

        .modal.active {
            display: block;
        }

        .backdrop {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            z-index: 1999;
            backdrop-filter: blur(4px);
        }

        .backdrop.active {
            display: block;
        }

        .modal h2 {
            font-family: 'Orbitron', monospace;
            font-size: 24px;
            font-weight: 900;
            color: #22d3ee;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 12px;
            text-shadow: 0 0 10px rgba(34, 211, 238, 0.6);
        }

        .modal-subtitle {
            color: #64748b;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 28px;
            font-weight: 600;
        }

        .modal h3 {
            font-family: 'Orbitron', monospace;
            font-size: 14px;
            color: #22d3ee;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-top: 28px;
            margin-bottom: 16px;
        }

        .modal input, .modal select, .modal textarea {
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

        .modal input::placeholder {
            color: #64748b;
        }

        .modal input:focus, .modal select:focus, .modal textarea:focus {
            outline: none;
            border-color: #06b6d4;
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
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

        .warning-box {
            background: rgba(245, 158, 11, 0.1);
            border-left: 4px solid #f59e0b;
            padding: 16px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .warning-box p {
            color: #94a3b8;
            margin: 0;
            line-height: 1.6;
        }

        .critical-box {
            background: rgba(239, 68, 68, 0.1);
            border-left: 4px solid #ef4444;
            padding: 16px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .critical-box p {
            color: #94a3b8;
            margin: 0;
            line-height: 1.6;
        }

        .button-group {
            display: flex;
            gap: 12px;
            margin-top: 32px;
        }

        .btn-primary {
            flex: 1;
            padding: 14px 28px;
            background: linear-gradient(135deg, #06b6d4 0%, #0e7490 100%);
            border: 2px solid rgba(6, 182, 212, 0.6);
            border-radius: 6px;
            color: #fff;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-primary:hover {
            box-shadow: 0 0 40px rgba(6, 182, 212, 0.6);
            transform: translateY(-2px);
        }

        .btn-secondary {
            flex: 1;
            padding: 14px 28px;
            background: rgba(30, 41, 59, 0.5);
            border: 2px solid rgba(100, 116, 139, 0.4);
            border-radius: 6px;
            color: #94a3b8;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-secondary:hover {
            background: rgba(30, 41, 59, 0.8);
            border-color: rgba(100, 116, 139, 0.6);
        }

        .btn-warning {
            flex: 1;
            padding: 14px 28px;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            border: 2px solid rgba(245, 158, 11, 0.6);
            border-radius: 6px;
            color: #fff;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-warning:hover {
            box-shadow: 0 0 40px rgba(245, 158, 11, 0.6);
            transform: translateY(-2px);
        }

        .btn-critical {
            flex: 1;
            padding: 14px 28px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            border: 2px solid rgba(239, 68, 68, 0.6);
            border-radius: 6px;
            color: #fff;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-critical:hover {
            box-shadow: 0 0 40px rgba(239, 68, 68, 0.6);
            transform: translateY(-2px);
        }

        .pulse {
            animation: pulse-modal 2s ease-in-out infinite;
        }

        @keyframes pulse-modal {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
        }

        .event-item {
            background: rgba(6, 182, 212, 0.05);
            border: 1px solid rgba(6, 182, 212, 0.3);
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 12px;
        }

        .event-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .event-item-title {
            font-weight: 700;
            color: #22d3ee;
            margin-bottom: 4px;
        }

        .event-item-date {
            color: #94a3b8;
            font-size: 13px;
            margin-bottom: 12px;
        }

        .btn-remove {
            padding: 8px 16px;
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.4);
            border-radius: 4px;
            color: #ef4444;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-remove:hover {
            background: rgba(239, 68, 68, 0.3);
            border-color: rgba(239, 68, 68, 0.6);
        }

        .btn-add {
            width: 100%;
            padding: 14px;
            background: rgba(6, 182, 212, 0.1);
            border: 2px dashed rgba(6, 182, 212, 0.4);
            border-radius: 6px;
            color: #22d3ee;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s;
            margin-bottom: 20px;
        }

        .btn-add:hover {
            background: rgba(6, 182, 212, 0.2);
            border-color: rgba(6, 182, 212, 0.6);
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
  return `<div onclick="showModal('voice-modal')" style="position: fixed; bottom: 80px; right: 40px; width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #06b6d4 0%, #0e7490 100%); border: 2px solid rgba(6, 182, 212, 0.6); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; animation: pulse-voice 2s ease-in-out infinite;">
        <span style="font-size: 28px;">🎤</span>
    </div>`;
}

function getModals() {
  return `
    <!-- Backdrop -->
    <div id="backdrop" class="backdrop" onclick="closeAllModals()"></div>

    <!-- Voice Assistant Modal -->
    <div id="voice-modal" class="modal">
        <h2>🎤 VOICE COMMAND</h2>
        <p class="modal-subtitle">SPEAK YOUR COMMAND</p>

        <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 64px; color: #22d3ee;" class="pulse">🎤</div>
            <p style="color: #64748b; margin-top: 16px; font-weight: 600;">LISTENING...</p>
        </div>

        <div class="info-box">
            <p><strong style="color: #22d3ee;">I HEARD:</strong> "Create event for ABC Dance on Friday at 2pm"</p>
        </div>

        <div class="button-group">
            <button class="btn-primary" onclick="closeAllModals()">✓ CONFIRM</button>
            <button class="btn-secondary" onclick="closeAllModals()">✗ CANCEL</button>
        </div>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid rgba(6, 182, 212, 0.2);">
            <h3>RECENT COMMANDS</h3>
            <div style="color: #94a3b8; font-size: 13px; line-height: 2;">
                <div>"Show me events next week"</div>
                <div>"What's the status of ABC Dance contract?"</div>
                <div>"Send reminder to Jane about questionnaire"</div>
            </div>
        </div>
    </div>

    <!-- Manual Entry Modal (NEW CLIENT) -->
    <div id="manual-entry-modal" class="modal">
        <h2>+ NEW CLIENT + EVENT</h2>
        <p class="modal-subtitle">SKIP PIPELINE • CREATE DRAFT CONTRACT</p>

        <h3>📋 CLIENT INFORMATION</h3>
        <input type="text" placeholder="Client Organization (e.g., ABC Dance Studio)">
        <input type="text" placeholder="Contact Name (e.g., Jane Smith)">
        <input type="tel" placeholder="Phone Number (555-1234)">
        <input type="email" placeholder="Email Address (jane@abcdance.com)">

        <h3>🎬 EVENT INFORMATION</h3>
        <input type="text" placeholder="Event Name (e.g., Fall Showcase)">
        <input type="date" value="2025-11-15">
        <input type="time" value="14:00">
        <input type="text" placeholder="Venue (e.g., Lincoln Center)">

        <label style="display: block; margin-bottom: 8px; color: #94a3b8; font-weight: 600;">Service Type</label>
        <select>
            <option>Dance Recital Media</option>
            <option>Concert Coverage</option>
            <option>Corporate Event</option>
            <option>Promo Video</option>
        </select>

        <div class="info-box">
            <p>ℹ️ <strong>This will create:</strong> Client Record + Event + Draft Contract (skips Lead/Proposal stages)</p>
        </div>

        <div class="button-group">
            <button class="btn-primary" onclick="closeAllModals()">✓ CREATE CLIENT + EVENT</button>
            <button class="btn-secondary" onclick="closeAllModals()">CANCEL</button>
        </div>
    </div>

    <!-- INFO Modal -->
    <div id="info-modal" class="modal">
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
            <div style="font-size: 48px;">ℹ️</div>
            <div>
                <h2>INFO</h2>
                <p class="modal-subtitle">INFORMATION NOTICE</p>
            </div>
        </div>

        <p style="color: #e2e8f0; line-height: 1.8; margin-bottom: 20px;">
            <strong style="color: #22d3ee;">Incomplete Questionnaire:</strong>
            ABC Dance Studio's questionnaire for Fall Showcase (Nov 15) is only 60% complete.
            Event is in 7 days. Missing: Audio preferences, Special requests, Emergency contacts.
        </p>

        <div class="info-box">
            <p>ℹ️ You can send a reminder or proceed without complete information.</p>
        </div>

        <div class="button-group">
            <button class="btn-primary" onclick="closeAllModals()">SEND REMINDER</button>
            <button class="btn-secondary" onclick="closeAllModals()">PROCEED ANYWAY</button>
        </div>
    </div>

    <!-- WARNING Modal -->
    <div id="warning-modal" class="modal">
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
            <div style="font-size: 48px;">⚠️</div>
            <div>
                <h2 style="color: #f59e0b;">WARNING</h2>
                <p class="modal-subtitle">ATTENTION REQUIRED</p>
            </div>
        </div>

        <p style="color: #e2e8f0; line-height: 1.8; margin-bottom: 20px;">
            <strong style="color: #f59e0b;">Equipment Conflict Detected:</strong>
            Camera A (Sony A7S III) is assigned to TWO events on Nov 15:
        </p>
        <ul style="color: #94a3b8; margin: 16px 0 16px 24px; line-height: 1.8;">
            <li>ABC Dance Fall Showcase @ 2:00 PM</li>
            <li>XYZ Concert Coverage @ 6:00 PM</li>
        </ul>

        <div class="warning-box">
            <p>⚠️ Proceeding will create unresolved conflict. Consider reassigning equipment or adjusting schedules.</p>
        </div>

        <div class="button-group">
            <button class="btn-warning" onclick="closeAllModals()">🚨 PROCEED ANYWAY</button>
            <button class="btn-secondary" onclick="closeAllModals()">CANCEL</button>
        </div>
    </div>

    <!-- CRITICAL Modal -->
    <div id="critical-modal" class="modal">
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
            <div style="font-size: 48px;">🚨</div>
            <div>
                <h2 style="color: #ef4444;">CRITICAL</h2>
                <p class="modal-subtitle">SERIOUS PROBLEM DETECTED</p>
            </div>
        </div>

        <p style="color: #e2e8f0; line-height: 1.8; margin-bottom: 20px;">
            <strong style="color: #ef4444;">No Deposit Received:</strong>
            Contract #2025-AB-1234 for Fall Showcase (Nov 15, $4,500) was sent 21 days ago.
            Contract is unsigned and no deposit received. Event is in 7 days.
        </p>

        <div class="critical-box">
            <p>🚨 <strong>Financial Risk:</strong> Proceeding without signed contract and deposit violates company policy. This action will be logged in audit trail.</p>
        </div>

        <div class="button-group">
            <button class="btn-critical" onclick="closeAllModals()">🚨 PROCEED ANYWAY</button>
            <button class="btn-secondary" onclick="closeAllModals()">CANCEL</button>
        </div>
    </div>

    <!-- Multi-Date Contract Modal -->
    <div id="multidate-modal" class="modal">
        <h2>📄 MULTI-DATE CONTRACT</h2>
        <p class="modal-subtitle">MANAGE EVENTS IN THIS CONTRACT</p>

        <h3>📅 EVENTS IN THIS CONTRACT</h3>

        <div class="event-item">
            <div class="event-item-header">
                <div>
                    <div class="event-item-title">Event 1: Fall Showcase</div>
                    <div class="event-item-date">📅 November 15, 2025 • 2:00 PM • Lincoln Center</div>
                </div>
                <button class="btn-remove" onclick="alert('Remove event 1')">REMOVE</button>
            </div>
        </div>

        <div class="event-item">
            <div class="event-item-header">
                <div>
                    <div class="event-item-title">Event 2: Winter Recital</div>
                    <div class="event-item-date">📅 December 20, 2025 • 6:00 PM • City Hall Theatre</div>
                </div>
                <button class="btn-remove" onclick="alert('Remove event 2')">REMOVE</button>
            </div>
        </div>

        <button class="btn-add" onclick="alert('Add event')">+ ADD ANOTHER EVENT</button>

        <div class="info-box">
            <p>ℹ️ <strong>Total Contract Value:</strong> $8,900 • Covers 2 events with bulk discount applied</p>
        </div>

        <div class="button-group">
            <button class="btn-primary" onclick="closeAllModals()">✓ SAVE CHANGES</button>
            <button class="btn-secondary" onclick="closeAllModals()">CANCEL</button>
        </div>
    </div>

    <!-- Create Event Modal -->
    <div id="create-event-modal" class="modal">
        <h2>+ NEW EVENT</h2>
        <p class="modal-subtitle">CREATE NEW EVENT</p>

        <h3>🎬 EVENT DETAILS</h3>
        <input type="text" placeholder="Event Name">
        <input type="date" value="2025-11-20">
        <input type="time" value="18:00">
        <input type="text" placeholder="Venue">

        <label style="display: block; margin-bottom: 8px; color: #94a3b8; font-weight: 600;">Client</label>
        <select>
            <option>ABC Dance Studio</option>
            <option>XYZ Concert Hall</option>
            <option>Smith Productions</option>
        </select>

        <label style="display: block; margin-bottom: 8px; color: #94a3b8; font-weight: 600;">Service Type</label>
        <select>
            <option>Dance Recital Media</option>
            <option>Concert Coverage</option>
            <option>Corporate Event</option>
        </select>

        <div class="button-group">
            <button class="btn-primary" onclick="closeAllModals()">✓ CREATE EVENT</button>
            <button class="btn-secondary" onclick="closeAllModals()">CANCEL</button>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="delete-modal" class="modal">
        <h2 style="color: #ef4444;">⚠️ CONFIRM DELETE</h2>
        <p class="modal-subtitle">THIS ACTION CANNOT BE UNDONE</p>

        <p style="color: #e2e8f0; line-height: 1.8; margin: 24px 0;">
            Are you sure you want to delete <strong style="color: #22d3ee;">"ABC Dance Fall Showcase"</strong>?
        </p>

        <div class="critical-box">
            <p>🚨 <strong>Warning:</strong> This will permanently delete the event, all associated files, and email history. This action cannot be reversed.</p>
        </div>

        <div class="button-group">
            <button class="btn-critical" onclick="closeAllModals()">DELETE PERMANENTLY</button>
            <button class="btn-secondary" onclick="closeAllModals()">CANCEL</button>
        </div>
    </div>
  `;
}

function getModalScripts() {
  return `
    <script>
        function showModal(modalId) {
            closeAllModals();
            document.getElementById('backdrop').classList.add('active');
            document.getElementById(modalId).classList.add('active');
        }

        function closeAllModals() {
            document.getElementById('backdrop').classList.remove('active');
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        }

        // ESC key closes modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });

        // Add click handlers to demonstration buttons
        document.addEventListener('DOMContentLoaded', function() {
            // Example: Add onclick to NEW CLIENT buttons
            document.querySelectorAll('button').forEach(button => {
                if (button.textContent.includes('NEW CLIENT')) {
                    button.setAttribute('onclick', "showModal('manual-entry-modal')");
                }
                if (button.textContent.includes('NEW EVENT')) {
                    button.setAttribute('onclick', "showModal('create-event-modal')");
                }
            });
        });
    </script>
  `;
}

// Content generators for each page
const contentGenerators = {
  dashboard: () => `<div class="dashboard-content">
        <!-- Financial Snapshot -->
        <div class="section">
            <div class="stat-label">FINANCIAL SNAPSHOT</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 16px;">
                <div>
                    <div style="font-size: 11px; font-weight: 700; color: #64748b;">Revenue (30d)</div>
                    <div class="stat-value" style="font-size: 32px;">$24,500</div>
                    <div style="font-size: 12px; font-weight: 700; color: #10b981;">↑ +12%</div>
                </div>
                <div>
                    <div style="font-size: 11px; font-weight: 700; color: #64748b;">Outstanding</div>
                    <div class="stat-value" style="font-size: 32px; color: #f59e0b;">$12,750</div>
                    <div style="font-size: 12px; font-weight: 700; color: #64748b;">4 INVOICES</div>
                </div>
            </div>
            <div style="margin-top: 18px; padding-top: 18px; border-top: 2px solid rgba(6, 182, 212, 0.2); font-size: 14px; font-weight: 700;">
                NET POSITION: <span style="color: #22d3ee; font-size: 18px;">$37,250</span>
            </div>
        </div>

        <!-- Grid Layout -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 28px; margin-bottom: 28px;">
            <!-- Calendar -->
            <div class="section">
                <div class="section-header">
                    <div class="section-title">⚡ NOVEMBER 2025</div>
                    <div style="display: flex; gap: 12px;">
                        <button style="padding: 8px 16px; font-size: 12px;">◀ PREV</button>
                        <button style="padding: 8px 16px; font-size: 12px;">TODAY</button>
                        <button style="padding: 8px 16px; font-size: 12px;">NEXT ▶</button>
                    </div>
                </div>
                <div class="calendar">
                    <div class="calendar-day"><div class="calendar-day-number">1</div></div>
                    <div class="calendar-day">
                        <div class="calendar-day-number">2</div>
                        <div class="event-bar" style="background: linear-gradient(90deg, #06b6d4, #0e7490);"></div>
                        <div class="event-bar" style="background: linear-gradient(90deg, #10b981, #059669);"></div>
                    </div>
                    <div class="calendar-day"><div class="calendar-day-number">3</div></div>
                    <div class="calendar-day"><div class="calendar-day-number">4</div></div>
                    <div class="calendar-day"><div class="calendar-day-number">5</div></div>
                    <div class="calendar-day"><div class="calendar-day-number">6</div></div>
                    <div class="calendar-day"><div class="calendar-day-number">7</div></div>
                </div>
            </div>

            <!-- Critical Alerts -->
            <div class="section">
                <div class="section-header">
                    <div class="section-title">⚠️ CRITICAL ALERTS</div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 14px; border-radius: 4px;">
                        <div style="font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">Equipment Conflict</div>
                        <div style="font-size: 12px; color: #94a3b8;">Camera A double-booked</div>
                        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Nov 15 • 2 events</div>
                    </div>
                    <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 14px; border-radius: 4px;">
                        <div style="font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">Incomplete Questionnaire</div>
                        <div style="font-size: 12px; color: #94a3b8;">ABC Dance Studio</div>
                        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Event in 6 days</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="section">
            <div class="section-header">
                <div class="section-title">⚡ RECENT ACTIVITY</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 14px;">
                <div style="border-left: 4px solid #10b981; padding: 14px; background: rgba(16, 185, 129, 0.05);">
                    <div style="font-weight: 700; color: #e2e8f0;">✓ Contract signed: XYZ Dance Competition</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 6px;">2 HOURS AGO • $4,500 EVENT</div>
                </div>
                <div style="border-left: 4px solid #06b6d4; padding: 14px; background: rgba(6, 182, 212, 0.05);">
                    <div style="font-weight: 700; color: #e2e8f0;">💰 Payment received: ABC Dance Studio</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 6px;">4 HOURS AGO • $2,250 (50% DEPOSIT)</div>
                </div>
            </div>
        </div>
    </div>`,

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
                <div style="font-size: 13px; color: #10b981; font-weight: 700; margin-top: 12px;">↑ 2 THIS WEEK</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">ACTIVE PROPOSALS</div>
                <div class="stat-value">5</div>
                <div style="font-size: 13px; color: #22d3ee; font-weight: 700; margin-top: 12px;">$18,500 VALUE</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">PENDING CONTRACTS</div>
                <div class="stat-value">3</div>
                <div style="font-size: 13px; color: #22d3ee; font-weight: 700; margin-top: 12px;">$12,000 VALUE</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">CONVERSIONS (30D)</div>
                <div class="stat-value">65%</div>
                <div style="font-size: 13px; color: #10b981; font-weight: 700; margin-top: 12px;">↑ +8%</div>
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
                        <td><span class="badge badge-new">NEW</span></td>
                        <td>Nov 8</td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">XYZ Dance Co</td>
                        <td>John Doe</td>
                        <td>Promo Video</td>
                        <td><span class="badge badge-contacted">CONTACTED</span></td>
                        <td>Nov 5</td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">Metro Dance</td>
                        <td>Sarah Johnson</td>
                        <td>Concert Coverage</td>
                        <td><span class="badge badge-sent">PROP SENT</span></td>
                        <td>Oct 28</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`,

  planning: () => `<div class="dashboard-content">
        <div class="section">
            <div class="section-header">
                <div class="section-title">⚡ WEEK OF NOV 10-16, 2025</div>
                <div style="display: flex; gap: 12px;">
                    <button style="padding: 8px 16px; font-size: 12px;">◀ PREV</button>
                    <button style="padding: 8px 16px; font-size: 12px;">TODAY</button>
                    <button style="padding: 8px 16px; font-size: 12px;">NEXT ▶</button>
                </div>
            </div>
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

  deliverables: () => `<div class="dashboard-content">
        <div class="section">
            <div class="section-title">⚡ DELIVERABLES BY EVENT</div>
            <table>
                <thead>
                    <tr>
                        <th>EVENT</th>
                        <th>SERVICE</th>
                        <th>DRIVE</th>
                        <th>STATUS</th>
                        <th>DUE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">ABC Dance Nov 15</td>
                        <td>Recital Media</td>
                        <td><button style="padding: 6px 12px; font-size: 12px;">📁 VIEW</button></td>
                        <td><span class="badge badge-pending">IN PROGRESS</span></td>
                        <td>Nov 29</td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">XYZ Comp Nov 8</td>
                        <td>Concert Coverage</td>
                        <td><button style="padding: 6px 12px; font-size: 12px;">📁 VIEW</button></td>
                        <td><span class="badge badge-contacted">IN REVIEW</span></td>
                        <td>Nov 22</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">⚠️ INCOMPLETE QUESTIONNAIRES</div>
            <table>
                <thead>
                    <tr>
                        <th>EVENT</th>
                        <th>STATUS</th>
                        <th>DAYS UNTIL</th>
                        <th>LAST SENT</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">ABC Dance Nov 15</td>
                        <td><span class="badge badge-pending">Incomplete (50%)</span></td>
                        <td>6 days</td>
                        <td>Nov 5</td>
                        <td><button style="padding: 6px 12px; font-size: 12px;">REMIND</button></td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">Metro Dance Nov 22</td>
                        <td><span class="badge badge-warning">Not Started</span></td>
                        <td>12 days</td>
                        <td>Never</td>
                        <td><button style="padding: 6px 12px; font-size: 12px;">SEND</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`,

  communications: () => `<div class="dashboard-content">
        <div class="tabs">
            <button class="tab active">EMAIL HISTORY</button>
            <button class="tab">TEMPLATES</button>
            <button class="tab">NOTIFICATION LOG</button>
        </div>

        <div class="section">
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <div style="border-left: 4px solid #06b6d4; padding: 18px; background: rgba(6, 182, 212, 0.05);">
                    <div style="font-weight: 700; color: #e2e8f0; font-size: 16px; margin-bottom: 8px;">📧 Proposal sent: ABC Dance Studio</div>
                    <div style="font-size: 13px; color: #94a3b8; margin-bottom: 6px;">Nov 8, 2025 10:30 AM → jane@abcdance.com</div>
                    <div style="font-size: 12px; color: #64748b;">Subject: Dance Recital Media Proposal - Nov 15</div>
                    <div style="display: flex; gap: 12px; margin-top: 12px;">
                        <button style="padding: 8px 16px; font-size: 12px;">VIEW</button>
                        <button style="padding: 8px 16px; font-size: 12px;">REPLY</button>
                    </div>
                </div>
                <div style="border-left: 4px solid #10b981; padding: 18px; background: rgba(16, 185, 129, 0.05);">
                    <div style="font-weight: 700; color: #e2e8f0; font-size: 16px; margin-bottom: 8px;">💬 Reply received: XYZ Dance Competition</div>
                    <div style="font-size: 13px; color: #94a3b8; margin-bottom: 6px;">Nov 7, 2025 2:15 PM ← john@xyzdance.com</div>
                    <div style="font-size: 12px; color: #64748b;">Subject: Re: Concert Coverage Proposal</div>
                    <div style="display: flex; gap: 12px; margin-top: 12px;">
                        <button style="padding: 8px 16px; font-size: 12px;">VIEW</button>
                        <button style="padding: 8px 16px; font-size: 12px;">REPLY</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`,

  files: () => `<div class="dashboard-content">
        <div class="tabs">
            <button class="tab active">PROPOSALS</button>
            <button class="tab">CONTRACTS</button>
            <button class="tab">INVOICES</button>
            <button class="tab">QUESTIONNAIRES</button>
        </div>

        <div style="margin-bottom: 20px;">
            <button>+ NEW PROPOSAL</button>
        </div>

        <div class="section">
            <table>
                <thead>
                    <tr>
                        <th>CLIENT</th>
                        <th>SERVICE</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                        <th>DATE</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">ABC Dance</td>
                        <td>Dance Recital</td>
                        <td>$4,500</td>
                        <td><span class="badge badge-signed">ACCEPTED</span></td>
                        <td>Nov 8</td>
                        <td>
                            <div style="display: flex; gap: 8px; font-size: 18px;">
                                <span style="cursor: pointer;">👁️</span>
                                <span style="cursor: pointer;">📧</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">XYZ Comp</td>
                        <td>Concert Coverage</td>
                        <td>$6,200</td>
                        <td><span class="badge badge-sent">SENT</span></td>
                        <td>Nov 5</td>
                        <td>
                            <div style="display: flex; gap: 8px; font-size: 18px;">
                                <span style="cursor: pointer;">👁️</span>
                                <span style="cursor: pointer;">📧</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`,

  operators: () => `<div class="dashboard-content">
        <div style="margin-bottom: 20px;">
            <button>+ NEW OPERATOR</button>
        </div>

        <div class="section">
            <div class="section-title">⚡ OPERATOR ROSTER</div>
            <table>
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>SKILLS</th>
                        <th>EQUIPMENT</th>
                        <th>AVAILABILITY</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">John Smith</td>
                        <td>📹 Camera ⭐⭐⭐<br>🎥 Editing ⭐⭐</td>
                        <td>Camera A, Drone A</td>
                        <td><span class="badge badge-signed">✅ This week</span></td>
                        <td>
                            <div style="display: flex; gap: 8px; font-size: 18px;">
                                <span style="cursor: pointer;">✏️</span>
                                <span style="cursor: pointer;">📅</span>
                                <span style="cursor: pointer;">💬</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">Sarah Lee</td>
                        <td>📹 Camera ⭐⭐⭐⭐<br>🎵 Audio ⭐⭐⭐⭐</td>
                        <td>Camera B, Audio Kit</td>
                        <td><span class="badge badge-pending">🕐 Partial Fri-Sat</span></td>
                        <td>
                            <div style="display: flex; gap: 8px; font-size: 18px;">
                                <span style="cursor: pointer;">✏️</span>
                                <span style="cursor: pointer;">📅</span>
                                <span style="cursor: pointer;">💬</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">⚡ SKILLS MATRIX</div>
            <table style="margin-top: 20px;">
                <thead>
                    <tr>
                        <th>OPERATOR</th>
                        <th>CAMERA</th>
                        <th>EDITING</th>
                        <th>AUDIO</th>
                        <th>DRONE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">John</td>
                        <td>⭐⭐⭐</td>
                        <td>⭐⭐</td>
                        <td>⭐</td>
                        <td>⭐⭐</td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">Sarah</td>
                        <td>⭐⭐⭐⭐</td>
                        <td>⭐⭐⭐</td>
                        <td>⭐⭐⭐⭐</td>
                        <td>⭐</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`,

  gear: () => `<div class="dashboard-content">
        <div class="tabs">
            <button class="tab active">INVENTORY</button>
            <button class="tab">CALENDAR</button>
            <button class="tab">MAINTENANCE LOG</button>
        </div>

        <div style="margin-bottom: 20px;">
            <button>+ NEW ITEM</button>
        </div>

        <div class="section">
            <table>
                <thead>
                    <tr>
                        <th>ITEM</th>
                        <th>CATEGORY</th>
                        <th>STATUS</th>
                        <th>ASSIGNED TO</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">Camera A<br><span style="font-size: 12px; color: #64748b;">Sony A7S III</span></td>
                        <td>Cameras</td>
                        <td><span class="badge badge-pending">IN USE</span></td>
                        <td>ABC Dance Nov 15</td>
                        <td>
                            <div style="display: flex; gap: 8px; font-size: 18px;">
                                <span style="cursor: pointer;">✏️</span>
                                <span style="cursor: pointer;">📅</span>
                                <span style="cursor: pointer;">🔧</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">Drone Alpha<br><span style="font-size: 12px; color: #64748b;">DJI Inspire 2</span></td>
                        <td>Drones</td>
                        <td><span class="badge badge-signed">AVAILABLE</span></td>
                        <td>—</td>
                        <td>
                            <div style="display: flex; gap: 8px; font-size: 18px;">
                                <span style="cursor: pointer;">✏️</span>
                                <span style="cursor: pointer;">📅</span>
                                <span style="cursor: pointer;">🔧</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">Audio Kit<br><span style="font-size: 12px; color: #64748b;">Zoom F6</span></td>
                        <td>Audio</td>
                        <td><span class="badge badge-warning">MAINTENANCE</span></td>
                        <td>—</td>
                        <td>
                            <div style="display: flex; gap: 8px; font-size: 18px;">
                                <span style="cursor: pointer;">✏️</span>
                                <span style="cursor: pointer;">📅</span>
                                <span style="cursor: pointer;">🔧</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`,

  reports: () => `<div class="dashboard-content">
        <div class="section">
            <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                <button>EXPORT CSV</button>
                <button>EXPORT PDF</button>
                <button>EXPORT QUICKBOOKS</button>
            </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr);">
            <div class="stat-card">
                <div class="stat-label">REVENUE (30D)</div>
                <div class="stat-value" style="font-size: 42px;">$24.5K</div>
                <div style="font-size: 13px; color: #10b981; font-weight: 700; margin-top: 12px;">↑ +12%</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">EVENTS COMPLETED</div>
                <div class="stat-value" style="font-size: 42px;">18</div>
                <div style="font-size: 13px; color: #10b981; font-weight: 700; margin-top: 12px;">↑ +3</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">AVG EVENT VALUE</div>
                <div class="stat-value" style="font-size: 42px;">$1.4K</div>
                <div style="font-size: 13px; color: #64748b; font-weight: 700; margin-top: 12px;">— STABLE</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">⚡ REVENUE BY SERVICE TYPE</div>
            <table>
                <thead>
                    <tr>
                        <th>SERVICE</th>
                        <th>EVENTS</th>
                        <th>REVENUE</th>
                        <th>AVG VALUE</th>
                        <th>TREND</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">Dance Recital</td>
                        <td>8</td>
                        <td>$12,000</td>
                        <td>$1,500</td>
                        <td style="color: #10b981;">↑ +15%</td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">Concert Coverage</td>
                        <td>6</td>
                        <td>$8,500</td>
                        <td>$1,417</td>
                        <td style="color: #10b981;">↑ +8%</td>
                    </tr>
                    <tr>
                        <td style="color: #e2e8f0; font-weight: 600;">Promo Video</td>
                        <td>4</td>
                        <td>$4,000</td>
                        <td>$1,000</td>
                        <td style="color: #64748b;">— 0%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`,

  customize: () => `<div class="dashboard-content">
        <div class="section">
            <div class="section-title">⚡ DASHBOARD WIDGETS</div>
            <div style="margin-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <label style="display: flex; align-items: center; gap: 12px; padding: 16px; background: rgba(6, 182, 212, 0.1); border-radius: 6px; cursor: pointer;">
                    <input type="checkbox" checked style="width: 20px; height: 20px;">
                    <span style="font-weight: 700;">Financial Snapshot</span>
                </label>
                <label style="display: flex; align-items: center; gap: 12px; padding: 16px; background: rgba(6, 182, 212, 0.1); border-radius: 6px; cursor: pointer;">
                    <input type="checkbox" checked style="width: 20px; height: 20px;">
                    <span style="font-weight: 700;">Month Calendar</span>
                </label>
                <label style="display: flex; align-items: center; gap: 12px; padding: 16px; background: rgba(6, 182, 212, 0.1); border-radius: 6px; cursor: pointer;">
                    <input type="checkbox" checked style="width: 20px; height: 20px;">
                    <span style="font-weight: 700;">Critical Alerts</span>
                </label>
                <label style="display: flex; align-items: center; gap: 12px; padding: 16px; background: rgba(6, 182, 212, 0.1); border-radius: 6px; cursor: pointer;">
                    <input type="checkbox" checked style="width: 20px; height: 20px;">
                    <span style="font-weight: 700;">Recent Activity</span>
                </label>
            </div>
        </div>

        <div class="section">
            <div class="section-title">⚡ NOTIFICATION PREFERENCES</div>
            <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 16px;">
                <label style="display: flex; align-items: center; gap: 12px;">
                    <input type="checkbox" checked style="width: 20px; height: 20px;">
                    <span>Email notifications for new leads</span>
                </label>
                <label style="display: flex; align-items: center; gap: 12px;">
                    <input type="checkbox" checked style="width: 20px; height: 20px;">
                    <span>SMS alerts for equipment conflicts</span>
                </label>
                <label style="display: flex; align-items: center; gap: 12px;">
                    <input type="checkbox" checked style="width: 20px; height: 20px;">
                    <span>Telegram notifications for contract signatures</span>
                </label>
                <label style="display: flex; align-items: center; gap: 12px;">
                    <input type="checkbox" style="width: 20px; height: 20px;">
                    <span>Daily digest emails</span>
                </label>
            </div>
        </div>
    </div>`,

  settings: () => `<div class="dashboard-content">
        <div class="section">
            <div class="section-title">⚡ SYSTEM CONFIGURATION</div>
            <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 20px;">
                <div>
                    <label style="font-weight: 700; display: block; margin-bottom: 8px;">Company Name</label>
                    <input type="text" value="StreamStage Live" style="width: 100%; padding: 12px; background: rgba(30, 41, 59, 0.5); border: 2px solid rgba(6, 182, 212, 0.4); border-radius: 4px; color: #e2e8f0; font-size: 14px;">
                </div>
                <div>
                    <label style="font-weight: 700; display: block; margin-bottom: 8px;">Default Email</label>
                    <input type="email" value="info@streamstagelive.com" style="width: 100%; padding: 12px; background: rgba(30, 41, 59, 0.5); border: 2px solid rgba(6, 182, 212, 0.4); border-radius: 4px; color: #e2e8f0; font-size: 14px;">
                </div>
                <div>
                    <label style="font-weight: 700; display: block; margin-bottom: 8px;">Timezone</label>
                    <select style="width: 100%; padding: 12px; background: rgba(30, 41, 59, 0.5); border: 2px solid rgba(6, 182, 212, 0.4); border-radius: 4px; color: #e2e8f0; font-size: 14px;">
                        <option>Eastern Time (ET)</option>
                        <option>Central Time (CT)</option>
                        <option>Mountain Time (MT)</option>
                        <option>Pacific Time (PT)</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">⚠️ ALERT CENTER</div>
            <div style="margin-top: 24px;">
                <table>
                    <thead>
                        <tr>
                            <th>ALERT TYPE</th>
                            <th>THRESHOLD</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="color: #e2e8f0; font-weight: 600;">Equipment Conflicts</td>
                            <td>Immediate</td>
                            <td><button style="padding: 6px 12px; font-size: 12px;">EDIT</button></td>
                        </tr>
                        <tr>
                            <td style="color: #e2e8f0; font-weight: 600;">Incomplete Questionnaires</td>
                            <td>7 days before event</td>
                            <td><button style="padding: 6px 12px; font-size: 12px;">EDIT</button></td>
                        </tr>
                        <tr>
                            <td style="color: #e2e8f0; font-weight: 600;">Unsigned Contracts</td>
                            <td>14 days after send</td>
                            <td><button style="padding: 6px 12px; font-size: 12px;">EDIT</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>`
};

// Page configurations
const pages = [
  { filename: '01-dashboard.html', title: 'Command Dashboard', pageTitle: '⚡ COMMAND DASHBOARD', pageSubtitle: 'NOVEMBER 10, 2025 • 22:30 EST', activeNav: 'Dashboard', content: contentGenerators.dashboard() },
  { filename: '02-pipeline.html', title: 'Pipeline', pageTitle: '⚡ PIPELINE', pageSubtitle: 'CRM & LEAD MANAGEMENT', activeNav: 'Pipeline', content: contentGenerators.pipeline() },
  { filename: '03-planning.html', title: 'Planning', pageTitle: '⚡ PLANNING', pageSubtitle: 'SCHEDULING & LOGISTICS', activeNav: 'Planning', content: contentGenerators.planning() },
  { filename: '04-deliverables.html', title: 'Deliverables', pageTitle: '⚡ DELIVERABLES', pageSubtitle: 'PRODUCTION & CLIENT FILES', activeNav: 'Deliverables', content: contentGenerators.deliverables() },
  { filename: '05-communications.html', title: 'Communications', pageTitle: '⚡ COMMUNICATIONS', pageSubtitle: 'EMAIL & NOTIFICATIONS', activeNav: 'Communications', content: contentGenerators.communications() },
  { filename: '06-files.html', title: 'Files', pageTitle: '⚡ FILES', pageSubtitle: 'PROPOSALS • CONTRACTS • INVOICES', activeNav: 'Files', content: contentGenerators.files() },
  { filename: '07-operators.html', title: 'Operators', pageTitle: '⚡ OPERATORS', pageSubtitle: 'TEAM PROFILES & SKILLS', activeNav: 'Operators', content: contentGenerators.operators() },
  { filename: '08-gear.html', title: 'Gear', pageTitle: '⚡ GEAR', pageSubtitle: 'EQUIPMENT INVENTORY', activeNav: 'Gear', content: contentGenerators.gear() },
  { filename: '09-reports.html', title: 'Reports', pageTitle: '⚡ REPORTS', pageSubtitle: 'REVENUE & ANALYTICS', activeNav: 'Reports', content: contentGenerators.reports() },
  { filename: '10-customize.html', title: 'Customize', pageTitle: '⚡ CUSTOMIZE', pageSubtitle: 'DASHBOARD & NOTIFICATIONS', activeNav: 'Customize', content: contentGenerators.customize() },
  { filename: '11-settings.html', title: 'Settings', pageTitle: '⚡ SETTINGS', pageSubtitle: 'SYSTEM CONFIGURATION', activeNav: 'Settings', content: contentGenerators.settings() }
];

// Generate all pages
pages.forEach(page => {
  const html = generatePage(page);
  fs.writeFileSync(path.join(__dirname, page.filename), html);
  console.log(`✓ Generated ${page.filename} with full content`);
});

console.log('\n✅ All mockups generated successfully with FULL CONTENT!');
console.log('All 11 pages now have representative data and layouts from COMPLETE_PAGE_LAYOUTS.md');
