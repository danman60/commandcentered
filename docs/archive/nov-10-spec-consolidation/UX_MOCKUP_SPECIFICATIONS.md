# CommandCentered UX Mockup Specifications
## Professional Operations Interface (Military Styling -20%)

**Date:** November 10, 2025
**Purpose:** Define exact mockup requirements for design sprint

---

## 🎨 DESIGN SYSTEM FOUNDATION

### Brand Personality: "Professional Command Center"
- **Was:** Military tactical operations
- **Now:** Professional business operations
- **Feel:** Confident, clear, efficient, trustworthy

### Color Palette

```scss
// Primary Palette
$primary-900: #1e3a8a;    // Deep blue - headers
$primary-700: #1d4ed8;    // Royal blue - primary actions
$primary-500: #3b82f6;    // Bright blue - hover states
$primary-100: #dbeafe;    // Light blue - backgrounds

// Semantic Colors
$success-600: #059669;    // Forest green - confirmations
$warning-500: #f59e0b;    // Amber - warnings (softer than red)
$danger-600: #dc2626;     // Clear red - errors/critical
$info-600: #0891b2;       // Cyan - information

// Neutral Grays
$gray-900: #111827;       // Near black - primary text
$gray-700: #374151;       // Dark gray - secondary text
$gray-500: #6b7280;       // Medium gray - placeholders
$gray-300: #d1d5db;       // Light gray - borders
$gray-100: #f3f4f6;       // Off white - backgrounds
$white: #ffffff;          // Pure white - cards

// Accent (for special elements)
$accent-purple: #7c3aed;  // Indigo purple - voice indicator
```

### Typography

```scss
// Font Stack
$font-primary: 'Inter', system-ui, sans-serif;
$font-mono: 'JetBrains Mono', 'SF Mono', monospace;

// Type Scale
$text-xs: 0.75rem;     // 12px - labels
$text-sm: 0.875rem;    // 14px - body small
$text-base: 1rem;      // 16px - body default
$text-lg: 1.125rem;    // 18px - body large
$text-xl: 1.25rem;     // 20px - section headers
$text-2xl: 1.5rem;     // 24px - page headers
$text-3xl: 1.875rem;   // 30px - dashboard numbers
$text-4xl: 2.25rem;    // 36px - hero numbers

// Font Weights
$font-normal: 400;     // Body text
$font-medium: 500;     // Emphasized text
$font-semibold: 600;   // Section headers
$font-bold: 700;       // Page headers
```

### Spacing System

```scss
// Base unit: 4px
$space-1: 0.25rem;   // 4px - tight
$space-2: 0.5rem;    // 8px - close
$space-3: 0.75rem;   // 12px - comfortable
$space-4: 1rem;      // 16px - default
$space-6: 1.5rem;    // 24px - section spacing
$space-8: 2rem;      // 32px - component spacing
$space-12: 3rem;     // 48px - layout spacing
$space-16: 4rem;     // 64px - page sections
```

---

## 📐 LAYOUT STRUCTURE

### Desktop Grid (1920px default)
```
|--Sidebar--|----------Main Content----------|--Details--|
   240px              1320px                    360px

Mobile: Stack all vertically
Tablet: Sidebar collapses, Details below
```

### Navigation Architecture

```typescript
interface Navigation {
  primary: [
    { icon: "📊", label: "Dashboard", path: "/" },
    { icon: "👥", label: "Leads", path: "/leads" },
    { icon: "📋", label: "Events", path: "/events" },
    { icon: "👷", label: "Operators", path: "/operators" },
    { icon: "💰", label: "Financials", path: "/financials" }
  ],

  secondary: [
    { icon: "🎤", label: "Voice Command", shortcut: "Cmd+K" },
    { icon: "🔔", label: "Notifications", badge: 3 },
    { icon: "⚙️", label: "Settings" }
  ]
}
```

---

## 🖼️ MOCKUP 1: COMMAND DASHBOARD

### Layout: Modular Card Grid

```
┌─────────────────────────────────────────────────────┐
│ CommandCentered         [🎤] [🔔3] [User]          │
├───────────┬─────────────────────────────────────────┤
│           │ Hello, Daniel          November 10, 2025│
│ Dashboard │                                         │
│ Leads     │ ┌─────────────┐ ┌─────────────┐        │
│ Events    │ │Revenue This │ │ Next Event  │        │
│ Operators │ │   Month     │ │  In 3 hrs   │        │
│ Financial │ │  $24,500    │ │ABC Dance    │        │
│           │ └─────────────┘ └─────────────┘        │
│           │                                         │
│ [Voice]   │ ┌──────────────────────────────┐       │
│           │ │     This Week's Schedule     │       │
│           │ │ Mo Tu We Th Fr Sa Su         │       │
│           │ │ 2  1  3  2  5  8  2          │       │
│           │ └──────────────────────────────┘       │
│           │                                         │
│           │ ┌──────────────────────────────┐       │
│           │ │    Recent Activity           │       │
│           │ │ • Contract signed: XYZ       │       │
│           │ │ • Payment received: ABC     │       │
│           │ │ • New lead: Dance Plus      │       │
│           │ └──────────────────────────────┘       │
└───────────┴─────────────────────────────────────────┘
```

### Key Components

#### Revenue Card
```scss
.revenue-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  .label {
    color: $gray-500;
    font-size: $text-sm;
    font-weight: $font-medium;
  }

  .value {
    color: $gray-900;
    font-size: $text-3xl;
    font-weight: $font-bold;
    margin-top: 8px;
  }

  .change {
    color: $success-600;
    font-size: $text-sm;
    margin-top: 4px;
  }
}
```

#### Week Calendar Heat Map
- Color intensity shows event density
- Click day to see events
- Today highlighted with border

---

## 🖼️ MOCKUP 2: EVENT MANAGEMENT

### Multi-Day Event View

```
┌─────────────────────────────────────────────────────┐
│ ABC Dance Recital          [Edit] [Voice] [More]   │
├─────────────────────────────────────────────────────┤
│ Saturday, June 15, 2025 • 2:00 PM                   │
│ Grand Theatre, 123 Main St                          │
│                                                      │
│ ┌──Status──┐ ┌──Contract──┐ ┌──Payment──┐         │
│ │ Confirmed│ │   Signed   │ │ 50% Paid  │         │
│ └───────────┘ └────────────┘ └───────────┘         │
│                                                      │
│ Operators                   Equipment               │
│ ┌─────────────────────┐    ┌──────────────────┐   │
│ │ 👤 John - Video     │    │ 📹 Camera A      │   │
│ │ 👤 Sarah - Photo    │    │ 📷 Camera B      │   │
│ │ [+ Add Operator]    │    │ 🚁 Drone Kit     │   │
│ └─────────────────────┘    │ [+ Add Equipment] │   │
│                             └──────────────────┘   │
│                                                      │
│ Timeline                                            │
│ ├──12PM──┬──2PM───┬──4PM───┬──6PM───┬──8PM──┤    │
│ │ Setup  │ Event  │ Event  │ Wrap   │       │    │
│                                                      │
│ Deliverables                                        │
│ □ Full ceremony video (Due: June 22)               │
│ □ Highlight reel (Due: June 17)                    │
│ ☑ Photos edited (Complete)                         │
└─────────────────────────────────────────────────────┘
```

### Status Pills Design

```scss
.status-pill {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: $text-sm;
  font-weight: $font-medium;

  &.confirmed {
    background: $success-100;
    color: $success-700;
  }

  &.warning {
    background: $warning-100;
    color: $warning-700;
  }

  &.critical {
    background: $danger-100;
    color: $danger-700;
  }
}
```

---

## 🖼️ MOCKUP 3: LEAD PIPELINE

### Kanban View

```
┌─────────────────────────────────────────────────────┐
│ Lead Pipeline                    [+ New] [Voice]    │
├─────────────────────────────────────────────────────┤
│ New (3)        Contacted (2)    Proposal (4)       │
│                                                      │
│ ┌──────────┐   ┌──────────┐    ┌──────────┐      │
│ │Studio ABC│   │Dance Plus│    │Elite Dance│      │
│ │June Event│   │July 4th  │    │Recital    │      │
│ │$2,500 est│   │$3,200 est│    │$4,500     │      │
│ │[Contact] │   │[Follow up]│    │[View]     │      │
│ └──────────┘   └──────────┘    └──────────┘      │
│                                                      │
│ ┌──────────┐                    ┌──────────┐      │
│ │XYZ Studio│                    │Metro Dance│      │
│ │Fall Show │                    │Competition│      │
│ │$1,800 est│                    │$5,200     │      │
│ └──────────┘                    └──────────┘      │
└─────────────────────────────────────────────────────┘
```

### Lead Card Design

```scss
.lead-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 4px solid transparent;
  cursor: move;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }

  &.high-value {
    border-left-color: $accent-purple;
  }

  .client-name {
    font-weight: $font-semibold;
    color: $gray-900;
  }

  .event-type {
    font-size: $text-sm;
    color: $gray-600;
  }

  .value {
    font-size: $text-lg;
    color: $primary-700;
    font-weight: $font-bold;
  }
}
```

---

## 🖼️ MOCKUP 4: VOICE COMMAND INTERFACE

### Overlay Design (Activated by Cmd+K or Voice Button)

```
┌─────────────────────────────────────────────────────┐
│                                                [ESC] │
│         🎤 Voice Command Active                     │
│                                                      │
│   ┌─────────────────────────────────────────┐      │
│   │ What would you like me to do?          │      │
│   └─────────────────────────────────────────┘      │
│                                                      │
│   "Create event for ABC Dance on Saturday"          │
│                                                      │
│   Understanding: Create new event                   │
│   Client: ABC Dance Studio                          │
│   Date: Saturday, November 16, 2025                 │
│                                                      │
│   [Confirm] [Edit] [Cancel]                        │
│                                                      │
│   Recent Commands:                                  │
│   • Check Saturday's schedule                       │
│   • Assign John to tomorrow's event                │
│   • Send invoice to Metro Dance                    │
└─────────────────────────────────────────────────────┘
```

### Voice UI States

```scss
.voice-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);

  .voice-modal {
    background: white;
    border-radius: 16px;
    padding: 32px;
    max-width: 600px;
    margin: 100px auto;

    .listening-indicator {
      animation: pulse 2s infinite;
      color: $accent-purple;
    }
  }
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
```

---

## 🖼️ MOCKUP 5: WARNING/OVERRIDE PATTERN

### Non-Blocking Warning Dialog

```
┌─────────────────────────────────────────────────────┐
│  ⚠️ Equipment Scheduling Conflict                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Camera A is already assigned to:                   │
│  • Metro Dance Competition (2:00 PM - 6:00 PM)     │
│                                                      │
│  You're trying to assign it to:                     │
│  • ABC Studio Recital (4:00 PM - 8:00 PM)         │
│                                                      │
│  This creates a 2-hour overlap.                     │
│                                                      │
│  ┌─────────────────┐  ┌──────────────────┐        │
│  │ Find Alternative │  │ Assign Anyway    │        │
│  └─────────────────┘  └──────────────────┘        │
│                                                      │
│  [✓] Don't show this type of warning again         │
└─────────────────────────────────────────────────────┘
```

### Warning Design Principles

```scss
.warning-dialog {
  border-top: 4px solid $warning-500;

  .warning-icon {
    color: $warning-500;
    font-size: 24px;
  }

  .conflict-details {
    background: $gray-100;
    padding: 12px;
    border-radius: 8px;
    font-family: $font-mono;
    font-size: $text-sm;
  }

  .action-buttons {
    display: flex;
    gap: 12px;

    .secondary-action {
      background: $gray-200;
      color: $gray-700;
    }

    .override-action {
      background: $primary-700;
      color: white;
      font-weight: $font-semibold;
    }
  }
}
```

---

## 📱 MOBILE CONSIDERATIONS

### Mobile Dashboard (iPhone 14 Pro - 393px)

```
┌─────────────┐
│ ☰ Command   │
├─────────────┤
│ Revenue     │
│ $24,500     │
│ +12% ↑      │
├─────────────┤
│ Next Event  │
│ 3:00 PM     │
│ ABC Dance   │
├─────────────┤
│ Quick Acts  │
│ [📞][📧][🎤]│
├─────────────┤
│ Today       │
│ • Event 1   │
│ • Event 2   │
│ • Event 3   │
└─────────────┘
```

### Touch Targets
- Minimum 44px × 44px
- 8px spacing between targets
- Thumb-reachable actions at bottom

---

## 🎭 INTERACTION PATTERNS

### Form Validation
```typescript
interface ValidationFeedback {
  timing: "onChange" | "onBlur" | "onSubmit";
  style: "inline" | "tooltip" | "summary";
  severity: "info" | "warning" | "error";
  dismissible: boolean;
}
```

### Loading States
```scss
.skeleton-loader {
  background: linear-gradient(
    90deg,
    $gray-200 0%,
    $gray-100 50%,
    $gray-200 100%
  );
  animation: shimmer 2s infinite;
}
```

### Empty States
```
┌─────────────────────────────────┐
│                                 │
│         🎬                      │
│                                 │
│    No events this week          │
│                                 │
│    [Create Event] or say        │
│    "Create new event"           │
│                                 │
└─────────────────────────────────┘
```

---

## ✨ MICRO-INTERACTIONS

### Button Behaviors
- Hover: Slight lift + shadow
- Active: Scale 0.98
- Disabled: Opacity 0.5
- Loading: Spinner replace text

### Card Interactions
- Hover: Elevate 2px
- Dragging: Opacity 0.8
- Drop zone: Dashed border

### Voice Feedback
- Listening: Pulsing purple ring
- Processing: Spinning ring
- Success: Green check
- Error: Red X with retry

---

## 🎯 DESIGN DELIVERABLES NEEDED

### Priority 1 (Must Have)
1. Dashboard desktop + mobile
2. Event detail page
3. Lead pipeline kanban
4. Voice command overlay
5. Warning/override dialog

### Priority 2 (Should Have)
6. Proposal builder
7. Operator schedule view
8. Financial summary
9. Settings page
10. Contract view

### Priority 3 (Nice to Have)
11. Email templates
12. Print layouts
13. Report designs
14. Onboarding flow
15. Help documentation

---

## 📏 DESIGN PRINCIPLES SUMMARY

1. **Professional > Tactical** - Business tool, not military
2. **Clarity > Atmosphere** - Function over form
3. **Assistive > Restrictive** - Warn, don't block
4. **Voice-First** - Visual supports voice
5. **Dense but Digestible** - Show lots, organize well
6. **Speed Matters** - Every click counts

---

This specification provides enough detail to create professional mockups that move away from heavy military styling while maintaining the "command center" efficiency feel.