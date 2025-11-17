# Navigation Template - Round 7 Complete

## CSS (Add to `<style>` section)

```css
.nav {
    flex: 1;
    padding: 24px 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0;
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
```

## HTML Structure (Add to `<body>`)

```html
<nav class="nav">
    <a href="01-dashboard.html" class="nav-item">
        <span>📊</span>
        <span>Dashboard</span>
    </a>
    <a href="02-pipeline.html" class="nav-item">
        <span>⚡</span>
        <span>Pipeline</span>
    </a>
    <a href="03-planning.html" class="nav-item">
        <span>📅</span>
        <span>Planning</span>
    </a>
    <a href="04-deliverables.html" class="nav-item">
        <span>📦</span>
        <span>Deliverables</span>
    </a>
    <a href="05-communications.html" class="nav-item">
        <span>💬</span>
        <span>Communications</span>
    </a>
    <a href="06-files.html" class="nav-item">
        <span>📁</span>
        <span>Files</span>
    </a>
    <a href="07-operators.html" class="nav-item">
        <span>👥</span>
        <span>Operators</span>
    </a>
    <a href="08-gear.html" class="nav-item">
        <span>🎥</span>
        <span>Gear</span>
    </a>
    <a href="09-reports.html" class="nav-item">
        <span>📈</span>
        <span>Reports</span>
    </a>
    <a href="10-customize.html" class="nav-item">
        <span>⚙️</span>
        <span>Customize</span>
    </a>
    <a href="11-settings.html" class="nav-item">
        <span>🔧</span>
        <span>Settings</span>
    </a>
</nav>
```

## Active State

Add `active` class to the current page's nav-item.

Example for Dashboard:
```html
<a href="01-dashboard.html" class="nav-item active">
```

## Files Needing Navigation

- [x] 01-dashboard.html (has navigation) ✅
- [x] 02-pipeline.html (has navigation) ✅
- [x] 03-planning.html (has navigation) ✅
- [x] 04-deliverables.html (has navigation) ✅
- [x] 05-communications.html (has navigation) ✅
- [x] 06-files.html (has navigation) ✅
- [x] 07-operators.html (has navigation) ✅
- [x] 08-gear.html (has navigation) ✅
- [x] 09-reports.html (has navigation) ✅
- [x] 10-customize.html (has navigation) ✅
- [x] 11-settings.html (has navigation) ✅
