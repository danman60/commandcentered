# Design System - CommandCentered

**Version:** 1.0
**Status:** Production Ready
**Source:** Round 7 Complete mockups

---

## Overview

The CommandCentered design system provides a complete foundation for building a consistent, professional tactical operations interface. This system prioritizes clarity, efficiency, and subtle sophistication over flashy aesthetics.

**Design Philosophy:** "Tactical, not theatrical" - Professional command center aesthetic at 6/10 intensity.

---

## Color System

### Primary Colors

#### Cyan (Primary Brand Color)
```css
--cyan-600: #06b6d4;  /* Primary actions, borders, highlights */
--cyan-400: #22d3ee;  /* Hover states, active elements, glow effects */
--cyan-600-rgb: 6, 182, 212;  /* For rgba() with opacity */
```

**Usage:**
- Primary buttons (gradient with cyan-600 to cyan-700)
- Active navigation items
- Borders and dividers (with opacity 0.2-0.3)
- Text links and interactive elements
- Glow effects on hover/active (0.5 opacity)

#### Purple (Accent Color)
```css
--purple-500: #a855f7;  /* Accent in gradients, secondary highlights */
--purple-600: #9333ea;  /* Darker accent for depth */
```

**Usage:**
- Gradient accents (paired with cyan)
- Secondary status indicators
- Visual interest in logos and headers
- Differentiating elements from primary cyan

### Background Colors

#### Dark Backgrounds (Slate Scale)
```css
--slate-950: #030712;   /* Darkest - sidebar base, deep backgrounds */
--slate-900: #0c1220;   /* Dark - sidebar gradient, panel backgrounds */
--slate-800: #0f172a;   /* Medium dark - main background gradient start */
--slate-700: #1e293b;   /* Medium - main background gradient end, cards */
--slate-600: #475569;   /* Lighter - borders, disabled states */
```

**Usage:**
- Body background: `linear-gradient(135deg, slate-800 0%, slate-700 100%)`
- Sidebar: `linear-gradient(180deg, slate-900 0%, slate-950 100%)`
- Cards/Widgets: `rgba(slate-700, 0.5)` with translucency
- Panels: `rgba(slate-800, 0.6)` with backdrop-filter blur

### Text Colors

#### Text Hierarchy (Slate Scale)
```css
--slate-200: #e2e8f0;   /* Primary text - headings, important content */
--slate-300: #cbd5e1;   /* Secondary text - body copy, labels */
--slate-400: #94a3b8;   /* Tertiary text - placeholders, muted content */
--slate-500: #64748b;   /* Quaternary - disabled text, timestamps */
```

**Usage:**
- H1-H3: slate-200 (or gradient text for emphasis)
- Body text: slate-300
- Labels, captions: slate-400
- Disabled/muted: slate-500

### Status Colors

#### Semantic Colors
```css
/* Success */
--green-500: #10b981;   /* Success states, positive indicators */
--green-600: #059669;   /* Darker success for hover */

/* Warning */
--yellow-500: #fbbf24;  /* Warning states, caution indicators */
--yellow-600: #f59e0b;  /* Darker warning */

/* Error */
--red-500: #ef4444;     /* Error states, destructive actions */
--red-600: #dc2626;     /* Darker error for hover */

/* Info */
--blue-500: #3b82f6;    /* Info states, neutral indicators */
--blue-600: #2563eb;    /* Darker blue */
```

**Usage:**
- Success: Completed tasks, successful operations, "sent" badges
- Warning: Caution messages, pending items, "in progress" badges
- Error: Failed operations, validation errors, destructive button hovers
- Info: Neutral information, help text, general notifications

### Border Colors

```css
--border-primary: rgba(6, 182, 212, 0.3);    /* Primary borders - sidebar, headers */
--border-secondary: rgba(6, 182, 212, 0.2);  /* Subtle borders - cards, dividers */
--border-muted: rgba(71, 85, 105, 0.3);      /* Very subtle - internal dividers */
```

---

## Typography

### Font Families

#### Primary Font: Inter
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Characteristics:**
- Humanist sans-serif
- Excellent readability at small sizes
- Wide language support
- Variable font available for performance

**How to Load:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

**Or use system fonts only (no external load):**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
             'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Font Weights

```css
--font-regular: 400;    /* Body text, general content */
--font-semibold: 600;   /* Subheadings, emphasis, labels */
--font-bold: 700;       /* Headings, primary navigation, buttons */
```

**Usage Guidelines:**
- Regular (400): Body paragraphs, descriptions, most text
- Semibold (600): Form labels, card titles, secondary buttons
- Bold (700): Page headings, primary buttons, active nav items

**Avoid:**
- Font-weight 300 (too light on dark backgrounds)
- Font-weight 800-900 (too aggressive, breaks consistency)

### Type Scale

```css
--text-xs: 12px;        /* Small labels, timestamps, metadata */
--text-sm: 14px;        /* Body text, form inputs, secondary content */
--text-base: 16px;      /* Primary body text, default size */
--text-lg: 20px;        /* Card titles, section headings */
--text-xl: 24px;        /* Logo, sidebar brand text */
--text-2xl: 28px;       /* Page titles in header */
--text-3xl: 32px;       /* Dashboard headings, hero text */
```

### Line Heights

```css
--leading-none: 1;      /* Icons, single-line titles */
--leading-tight: 1.25;  /* Headings, compact text */
--leading-normal: 1.5;  /* Body text, readable paragraphs */
--leading-relaxed: 1.75; /* Long-form content (if needed) */
```

**Usage:**
- Headings: 1.25 (tight)
- Body: 1.5 (normal)
- Forms: 1.5 (normal)

### Text Transforms

**Rule:** Use natural case for all text (no uppercase transforms)

**Rationale:**
- Better readability
- More professional appearance
- Consistent with modern UI trends
- Avoid aggressive/military aesthetic

**Exception:** None. If emphasis needed, use font-weight or color instead.

---

## Spacing System

### Base Unit: 4px

All spacing values are multiples of 4px for visual rhythm and consistency.

```css
--space-1: 4px;     /* 0.25rem */
--space-2: 8px;     /* 0.5rem */
--space-3: 12px;    /* 0.75rem */
--space-4: 16px;    /* 1rem */
--space-5: 20px;    /* 1.25rem */
--space-6: 24px;    /* 1.5rem */
--space-8: 32px;    /* 2rem */
--space-10: 40px;   /* 2.5rem */
--space-12: 48px;   /* 3rem */
```

### Spacing Guidelines

#### Gaps (Between Elements)
- **Small gaps:** 8-12px (space-2 to space-3) - Between related items in a list/group
- **Medium gaps:** 16-20px (space-4 to space-5) - Between sections within a card
- **Large gaps:** 24-32px (space-6 to space-8) - Between distinct sections/cards

#### Padding (Inside Containers)
- **Compact:** 12px (space-3) - Dense tables, compact lists
- **Default:** 20px (space-5) - Cards, widgets, panels
- **Spacious:** 32px (space-8) - Main content areas, page padding

#### Margins (Around Blocks)
- **Small:** 16px (space-4) - Between cards in a grid
- **Medium:** 20px (space-5) - Between major sections
- **Large:** 32px (space-6) - Top/bottom page margins

---

## Effects & Animations

### Border Radius

```css
--radius-sm: 6px;   /* Small buttons, tags, badges */
--radius-md: 8px;   /* Default buttons, inputs, cards */
--radius-lg: 12px;  /* Large cards, modals, panels */
--radius-xl: 16px;  /* Hero sections, special containers */
--radius-full: 9999px; /* Pills, circular avatars */
```

**Usage:**
- Buttons: 8px (md)
- Input fields: 8px (md)
- Cards: 12px (lg)
- Badges/tags: 6px (sm)
- Avatar icons: 9999px (full)

### Shadows

```css
/* Button Shadows */
--shadow-button: 0 4px 12px rgba(6, 182, 212, 0.3);
--shadow-button-hover: 0 6px 16px rgba(6, 182, 212, 0.4);

/* Card Shadows */
--shadow-card: 0 2px 8px rgba(0, 0, 0, 0.3);
--shadow-card-hover: 0 4px 16px rgba(6, 182, 212, 0.15);

/* Sidebar Shadow */
--shadow-sidebar: 4px 0 32px rgba(6, 182, 212, 0.15);

/* Modal Shadow */
--shadow-modal: 0 20px 60px rgba(0, 0, 0, 0.5);
```

**Usage:**
- Primary buttons: cyan-tinted shadow
- Cards: dark shadow (subtle depth)
- Sidebar: cyan-tinted shadow (brand reinforcement)
- Modals: heavy dark shadow (clear elevation)

### Text Shadows (Glow Effects)

```css
/* Active State Glow (Subtle) */
--glow-active: 0 0 10px rgba(34, 211, 238, 0.5);

/* Hover State Glow (If needed) */
--glow-hover: 0 0 8px rgba(34, 211, 238, 0.3);
```

**Usage:**
- Active navigation items: 0.5 opacity glow
- Hover states: Optional, use sparingly (0.3 opacity)
- Never use on static text (headers, body copy)

### Backdrop Effects

```css
/* Panel Blur */
--backdrop-blur: blur(10px);

/* Panel Backgrounds with Blur */
.panel-translucent {
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(10px);
}
```

**Usage:**
- Planning page panels
- Modal overlays
- Translucent cards (optional enhancement)

### Transitions

```css
/* Default Transition */
--transition-base: all 0.2s ease;

/* Specific Properties */
--transition-colors: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
--transition-transform: transform 0.2s ease;
--transition-opacity: opacity 0.15s ease;
```

**Usage:**
- Buttons: all 0.2s (hover lift + color change)
- Links: color 0.2s (smooth color transition)
- Modals: opacity 0.15s (quick fade in/out)
- Hover states: transform 0.2s (lift effect)

### Hover Effects

```css
/* Button Lift */
.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-button-hover);
}

/* Card Lift */
.card:hover {
    transform: translateY(-2px);
    border-color: rgba(6, 182, 212, 0.5);
}

/* Link Brightness */
.link:hover {
    color: var(--cyan-400);
}
```

**Guidelines:**
- Lift amount: 2px (subtle, not exaggerated)
- Combined effects: Lift + shadow increase or lift + border color change
- Duration: 0.2s (quick but not jarring)

---

## Gradients

### Primary Gradient (Cyan to Purple)

```css
/* Logo, Headers */
background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

**Usage:**
- Logo text
- Page title headers
- Important headings (sparingly)

### Background Gradients

```css
/* Body Background */
background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);

/* Sidebar Background */
background: linear-gradient(180deg, #0c1220 0%, #030712 100%);

/* Header Background */
background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
```

### Button Gradients

```css
/* Primary Button */
background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
```

---

## Layout

### Container Widths

```css
--container-full: 100%;
--container-wide: 1400px;
--container-default: 1200px;
--container-narrow: 800px;
```

### Sidebar

```css
--sidebar-width: 260px;
--sidebar-collapsed: 72px; /* Icon-only mode, future enhancement */
```

### Grid System

```css
/* 12-Column Grid (Dashboard widgets) */
.grid-12 {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 20px;
}

/* Widget Sizes */
.widget-full { grid-column: span 12; }    /* Full width */
.widget-half { grid-column: span 6; }     /* Half width */
.widget-third { grid-column: span 4; }    /* Third width */
.widget-quarter { grid-column: span 3; }  /* Quarter width */
```

### Z-Index Layers

```css
--z-base: 0;        /* Base content */
--z-dropdown: 10;   /* Dropdowns, tooltips */
--z-sticky: 20;     /* Sticky headers */
--z-sidebar: 30;    /* Fixed sidebar */
--z-modal: 40;      /* Modals, overlays */
--z-toast: 50;      /* Notifications */
```

---

## Iconography

### Icon Library

**Recommendation:** Lucide React or Heroicons

**Size Scale:**
```css
--icon-sm: 16px;    /* Inline with text, small buttons */
--icon-md: 20px;    /* Default size, most buttons */
--icon-lg: 24px;    /* Page icons, sidebar icons */
--icon-xl: 32px;    /* Hero icons, large headers */
```

### Icon Usage

**Navigation:**
- Sidebar: 20px icons with 14px gap to text
- Header actions: 20px icons in buttons

**Status Indicators:**
- Success: ✅ or checkmark (green-500)
- Warning: ⚠️ or alert-triangle (yellow-500)
- Error: 🔴 or x-circle (red-500)

**Emojis (Current Approach):**
Round 7 uses emojis for quick prototyping. For production:
- Replace with SVG icons for consistency
- Maintain 20px size for most icons
- Use icon library for accessibility (proper labels)

---

## Opacity Scale

```css
--opacity-0: 0;      /* Fully transparent */
--opacity-10: 0.1;   /* Very subtle overlay */
--opacity-20: 0.2;   /* Border translucency */
--opacity-30: 0.3;   /* Subdued backgrounds */
--opacity-40: 0.4;   /* Semi-transparent overlays */
--opacity-50: 0.5;   /* Half transparent, glow effects */
--opacity-60: 0.6;   /* Translucent panels (with blur) */
--opacity-80: 0.8;   /* Nearly opaque, strong overlays */
--opacity-100: 1;    /* Fully opaque */
```

**Usage:**
- Borders: 0.2-0.3
- Card backgrounds: 0.5-0.6 (with translucency)
- Glow effects: 0.3-0.5
- Modal overlays: 0.8
- Disabled states: 0.4-0.5

---

## Accessibility

### Color Contrast Requirements

**WCAG 2.1 AA Compliance:**
- Normal text (< 18px): 4.5:1 contrast ratio
- Large text (≥ 18px): 3:1 contrast ratio

**Verification:**
- slate-200 on slate-800: 10.8:1 ✅
- slate-300 on slate-700: 8.5:1 ✅
- slate-400 on slate-700: 5.2:1 ✅
- cyan-400 on slate-800: 6.7:1 ✅

### Focus States

```css
/* Keyboard Focus Ring */
:focus-visible {
    outline: 2px solid #22d3ee;
    outline-offset: 2px;
}

/* Button Focus */
.btn:focus-visible {
    outline: 2px solid #22d3ee;
    outline-offset: 2px;
}
```

---

## Implementation

### CSS Variables Setup

```css
:root {
    /* Colors */
    --cyan-600: #06b6d4;
    --cyan-400: #22d3ee;
    --purple-500: #a855f7;

    /* Backgrounds */
    --slate-950: #030712;
    --slate-900: #0c1220;
    --slate-800: #0f172a;
    --slate-700: #1e293b;

    /* Text */
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-400: #94a3b8;

    /* Spacing */
    --space-2: 8px;
    --space-4: 16px;
    --space-6: 24px;
    --space-8: 32px;

    /* Effects */
    --radius-md: 8px;
    --radius-lg: 12px;
    --shadow-button: 0 4px 12px rgba(6, 182, 212, 0.3);
    --transition-base: all 0.2s ease;
}
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            colors: {
                cyan: {
                    600: '#06b6d4',
                    400: '#22d3ee',
                },
                purple: {
                    500: '#a855f7',
                },
                slate: {
                    950: '#030712',
                    900: '#0c1220',
                    800: '#0f172a',
                    700: '#1e293b',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                },
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            spacing: {
                // Already includes 4px base unit scale
            },
            borderRadius: {
                'md': '8px',
                'lg': '12px',
            },
        },
    },
};
```

---

*This design system provides all tokens and guidelines needed for consistent implementation across CommandCentered.*
