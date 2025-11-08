# CommandCentered - Streamlined UX Patterns

**Date:** 2025-11-07
**Purpose:** Document the "critical info + click-to-expand" design pattern for CommandCentered

---

## Core Philosophy

**Anti-Pattern:** Information overload, walls of text, everything visible at once
**Solution:** Show only critical info at-a-glance, hide details in modals/popovers

### Key Principles

1. **Scannable at-a-glance** - Users should understand system state in 3 seconds
2. **Progressive disclosure** - Click to reveal more detail only when needed
3. **Dense but not cluttered** - Use visual hierarchy (colors, sizes, spacing)
4. **Modal-first for details** - Full context in overlay, not inline
5. **Quick stats everywhere** - Numbers speak louder than descriptions

---

## Pattern Library

### 1. Dashboard Pattern

**At-a-Glance:**
- Quick stats bar (5 metrics: active events, this week, ops deployed, alerts, gear available)
- System alerts banner (2-3 most critical alerts with quick actions)
- Event cards showing:
  - Event name + location (1 line each)
  - Date range + day count
  - Status badges (ops, gear, vehicles, hotel)
  - Mini timeline (2 upcoming shifts max)
  - Status indicator (alert/all set/draft)

**Click-to-Expand:**
- Full event detail modal with:
  - Complete event info grid
  - All shifts with assignments
  - Complete gear list
  - Hotel details
  - Telegram group info
  - Action buttons

**Files:** `streamlined-01-dashboard.html`

---

### 2. List View Pattern (Events)

**At-a-Glance:**
- Table/grid with critical columns only:
  - Event name + venue
  - Date + shift count
  - Crew status (avatars + count)
  - Gear count
  - Overall status
- Color-coded status indicators (red alert, green all set, yellow caution)
- Hover effects for interactivity hints

**Click-to-Expand:**
- Simplified modal with tabs:
  - Quick stats at top (4 numbers)
  - Alert banner if needed
  - Tabbed details (shifts, gear, hotel, communication)
  - Compact shift list (expand for more)
  - Action buttons in footer

**Files:** `streamlined-02-events-list.html`

---

### 3. Operator Card Pattern

**At-a-Glance:**
- Avatar with initials (color-coded)
- Name + primary role
- Availability indicator (green dot = available, red = blackout, yellow = deployed)
- 3 quick stats (events count, hourly rate, skill average)
- Visual skill bars (3 skills max on card)
- Status badge (next deployment, blackout, new operator, top performer)
- Personal gear count

**Click-to-Expand:**
- Full operator modal with:
  - 5 quick stats (events, rate, skills, gear, blackouts)
  - Tabbed sections (upcoming, skills, personal gear, history, blackouts)
  - Compact event list with expandable details
  - Action buttons

**Visual Hierarchy:**
- Gradient avatar (unique color per operator)
- Skill bars use consistent colors (video=blue, photo=purple, directing=green)
- Status badges with background colors matching urgency

**Files:** `streamlined-03-operators-list.html`

---

### 4. Gear Card Pattern

**At-a-Glance:**
- Icon/image placeholder (gradient background)
- Gear name + category
- Serial number
- Status badge with context:
  - Deployed → Event name
  - Available → "In office"
  - Maintenance → Reason
  - Broken → Issue description
- 2 quick stats (purchase value, use count)

**Click-to-Expand:**
- Gear detail modal with:
  - 4 quick stats (status, value, uses, purchase date)
  - Current deployment/location card
  - Tabbed sections (history, specs, maintenance log)
  - Compact deployment history list
  - Location tracking with operator assignment
  - Action buttons

**Status Color System:**
- Available: Green
- Deployed: Blue
- Maintenance: Yellow
- Broken: Red

**Files:** `streamlined-04-gear-list.html`

---

### 5. Calendar Pattern

**At-a-Glance:**
- Month grid with day numbers
- Small event pills (10px font, colored by type)
- Background shading for busy days
- Color legend (blue=events, purple=drills, red=blackouts)
- Mini stats below calendar (4 metrics)

**Hover/Click-to-Expand:**
- Event popover (NOT full modal):
  - Event name + date
  - Location, operators, gear counts (icons)
  - Alert banner if needed
  - 2 action buttons (view details, assign operator)
- Positioned dynamically near clicked event pill
- Dismisses on outside click

**Visual Patterns:**
- Event pills with emoji prefixes (⚠️ for alerts)
- Background colors indicate event density
- Today highlighted with blue background
- Past dates grayed out slightly

**Files:** `streamlined-05-calendar.html`

---

## Component Patterns

### Quick Stats Grid

**Structure:**
```html
<div class="grid grid-cols-{3-5} gap-4 text-center">
  <div>
    <div class="text-2xl font-bold text-{color}-600">{number}</div>
    <div class="text-xs text-gray-600 mt-1">{label}</div>
  </div>
</div>
```

**Usage:** Dashboard summary, modal headers, section summaries
**Colors:** Blue (primary counts), Green (success/money), Red (alerts), Purple (special metrics), Gray (neutral)

---

### Status Badge

**Structure:**
```html
<span class="stat-badge bg-{color}-100 text-{color}-700">
  {icon} {text}
</span>
```

**CSS:**
```css
.stat-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}
```

**Color System:**
- Blue: Operators, primary info
- Green: Gear, success states
- Purple: Vehicles, special features
- Orange: Hotels, warnings
- Red: Alerts, errors
- Yellow: Drafts, cautions
- Gray: Neutral, completed

---

### Alert Banner

**Structure:**
```html
<div class="bg-red-50 border border-red-200 rounded-lg p-4">
  <div class="flex items-start gap-3">
    <span class="text-red-600 font-mono">!</span>
    <div class="flex-1">
      <div class="text-sm font-semibold text-red-900">{title}</div>
      <div class="text-xs text-red-700 mt-1">{description}</div>
    </div>
    <button class="text-blue-600 text-xs font-semibold hover:underline">
      {action}
    </button>
  </div>
</div>
```

**Variants:**
- Red: Critical alerts (missing operators, impossible schedules)
- Yellow: Warnings (conflicts, cautions)
- Blue: Info (deployments, status updates)
- Green: Success (all set, completed)

---

### Modal Pattern

**Structure:**
```html
<div class="fixed inset-0 modal-backdrop hidden items-center justify-center z-50" onclick="close()">
  <div class="bg-white rounded-lg shadow-2xl max-w-{size} w-full mx-4 max-h-[85vh] overflow-y-auto" onclick="event.stopPropagation()">

    <!-- Sticky Header -->
    <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
      <h2>{title}</h2>
      <button onclick="close()">×</button>
    </div>

    <!-- Content -->
    <div class="p-6 space-y-6">
      <!-- Quick stats -->
      <!-- Alerts -->
      <!-- Tabbed sections -->
    </div>

    <!-- Sticky Footer -->
    <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
      <!-- Action buttons -->
    </div>

  </div>
</div>
```

**Sizes:**
- Small: max-w-lg (operators, gear)
- Medium: max-w-3xl (events, details)
- Large: max-w-4xl (complex workflows)

**Backdrop:**
```css
.modal-backdrop {
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
}
```

---

### Skill Bar Visualization

**Structure:**
```html
<div class="flex items-center gap-2">
  <div class="text-xs text-gray-600 w-16">{skill}</div>
  <div class="flex-1 bg-gray-100 rounded-full h-1.5">
    <div class="bg-{color}-600 h-1.5 rounded-full" style="width: {percent}%"></div>
  </div>
  <div class="text-xs font-semibold text-gray-900">{rating}</div>
</div>
```

**Usage:** Operator cards, operator profiles
**Colors:** Consistent per skill type (video=blue, photo=purple, directing=green)

---

### Avatar Stack Pattern

**Structure:**
```html
<div class="flex -space-x-2">
  <div class="w-6 h-6 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-blue-700">
    J
  </div>
  <div class="w-6 h-6 bg-purple-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-purple-700">
    S
  </div>
  <div class="w-6 h-6 bg-orange-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-orange-700">
    +3
  </div>
</div>
```

**Usage:** Event lists, crew assignments
**Max shown:** 3 avatars + overflow count

---

## Typography Hierarchy

### Sizes
- **Page title:** `text-2xl font-bold` (24px)
- **Modal title:** `text-lg font-bold` (18px)
- **Card title:** `text-sm font-bold` (14px)
- **Body text:** `text-sm` (14px)
- **Secondary text:** `text-xs` (12px)
- **Badge/pill text:** `text-xs` (12px, 10px on calendar)
- **Stats numbers:** `text-2xl font-bold` (24px)

### Colors
- **Primary text:** `text-gray-900`
- **Secondary text:** `text-gray-600`
- **Muted text:** `text-gray-500`
- **Success:** `text-green-600`
- **Warning:** `text-yellow-600`
- **Error:** `text-red-600`
- **Info:** `text-blue-600`

---

## Spacing System

### Padding
- **Page container:** `p-6`
- **Card:** `p-4`
- **Modal:** `px-6 py-4` (header/footer), `p-6` (content)
- **Alert banner:** `p-4`
- **Badge:** `px-2 py-1` (small), `px-3 py-1.5` (medium)

### Gaps
- **Grid gap:** `gap-4` (16px default)
- **Flex gap:** `gap-2` (8px small), `gap-3` (12px medium), `gap-4` (16px large)
- **Section spacing:** `space-y-6` (24px between sections)

### Margins
- **Section bottom:** `mb-6` (24px)
- **Card bottom:** `mb-3` (12px)
- **Element spacing:** `mt-1` (4px), `mt-2` (8px), `mt-3` (12px)

---

## Interactive States

### Hover Effects
```css
/* List rows */
.list-row:hover {
  background: #f9fafb;
}

/* Cards */
.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

/* Event pills */
.event-pill:hover {
  transform: translateX(2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### Transitions
```css
transition: all 0.15s ease;
```

**Apply to:** Cards, rows, buttons, pills

---

## Responsive Breakpoints

### Grid Columns
- **Dashboard event cards:** `grid-cols-2` (2 per row)
- **Operator cards:** `grid-cols-3` (3 per row)
- **Gear cards:** `grid-cols-4` (4 per row)
- **Quick stats:** `grid-cols-3` to `grid-cols-6` (varies by context)

### Mobile Strategy
- Reduce grid columns (2 → 1, 3 → 2, 4 → 2)
- Stack quick stats vertically
- Full-width modals
- Smaller text sizes
- Reduce padding

**Note:** Responsive implementation pending, these mockups target 1440px+ desktop

---

## Animation Guidelines

### Use Animation For:
- Modal open/close (fade in backdrop, slide up content)
- Popover appearance (fade in + slight scale)
- Hover states (subtle transform/shadow)
- Status changes (color transitions)

### Don't Animate:
- Static content rendering
- Data loading (use skeleton loaders instead)
- Navigation (instant feedback)

### Duration
- Fast: 150ms (hover, clicks)
- Medium: 250ms (modals, popovers)
- Slow: 350ms (page transitions)

---

## Accessibility Considerations

### Color Contrast
- All text meets WCAG AA standards
- Status indicators use color + icons/text
- Hover states visible without color

### Keyboard Navigation
- All modals closable with ESC key
- Tab order follows visual hierarchy
- Focus indicators on all interactive elements

### Screen Readers
- Semantic HTML (buttons, nav, headers)
- ARIA labels for status indicators
- Alt text for icons (where applicable)

---

## File Organization

### Mockup Files
1. `streamlined-01-dashboard.html` - Main dashboard with event cards + modals
2. `streamlined-02-events-list.html` - Event list view with table + simplified modal
3. `streamlined-03-operators-list.html` - Operator cards with skill bars + full modal
4. `streamlined-04-gear-list.html` - Gear cards with status + deployment history modal
5. `streamlined-05-calendar.html` - Calendar grid with event popovers

### Pattern Usage
- **Dashboard:** Quick stats + cards + full modals
- **List views:** Table/grid + simplified modals
- **Card grids:** Dense info cards + detailed modals
- **Calendar:** Grid + lightweight popovers (NOT full modals)

---

## Implementation Notes

### Tailwind CSS
All mockups use Tailwind CDN for rapid prototyping. Production should:
- Use Tailwind config with custom colors
- Purge unused styles
- Add custom components for badges, modals, cards

### JavaScript Behavior
- Modal open/close functions
- Popover positioning (dynamic)
- Outside click detection
- Escape key handling

### Component Library (Future)
Consider shadcn/ui for:
- Modal/Dialog component
- Popover component
- Badge component
- Card component
- Button variants

---

## Design Tokens (Proposed)

### Colors
```js
colors: {
  primary: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red',
  info: 'purple',
  neutral: 'gray',

  // Semantic aliases
  deployed: 'blue',
  available: 'green',
  maintenance: 'yellow',
  broken: 'red',

  // Skill colors
  video: 'blue',
  photo: 'purple',
  directing: 'green',
}
```

### Spacing
```js
spacing: {
  'card': '1rem',      // 16px
  'modal': '1.5rem',   // 24px
  'section': '1.5rem', // 24px
  'grid': '1rem',      // 16px
}
```

### Border Radius
```js
borderRadius: {
  'card': '0.5rem',    // 8px
  'badge': '0.375rem', // 6px
  'modal': '0.5rem',   // 8px
}
```

---

## Future Enhancements

### Phase 1 (Current)
- ✅ Dashboard with event cards
- ✅ Event list view
- ✅ Operator cards
- ✅ Gear cards
- ✅ Calendar with popovers

### Phase 2 (Next)
- [ ] Shift assignment modal with drag-and-drop
- [ ] Conflict resolution workflow
- [ ] Gear kit builder
- [ ] Travel time visualization
- [ ] Telegram integration UI

### Phase 3 (Future)
- [ ] Mobile-responsive layouts
- [ ] Dark mode support
- [ ] Keyboard shortcuts overlay
- [ ] Bulk actions (multi-select)
- [ ] Advanced filters/search

---

## Key Takeaways

1. **Information density ≠ clutter** - Use visual hierarchy, not more space
2. **Modals are your friend** - Keep primary views scannable, hide details
3. **Consistency is critical** - Same patterns across all views
4. **Color has meaning** - Blue (info), Green (success), Red (alert), Yellow (caution)
5. **Stats speak louder** - Numbers > descriptions wherever possible

**Philosophy:** Show me what I need to know in 3 seconds, let me click for the rest.

---

*End of UX Pattern Documentation*
