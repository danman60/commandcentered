# Getting Started with BOOTSTRAPBUILD

**Quick Start Guide for Developers**

---

## What You Have

### 1. Production-Ready Mockups ✅
**Location:** `../mockups/round-7-complete/`
- 10 HTML pages with complete UI
- 95% spec compliant
- Grade A visual design
- All fixes applied (visual audit complete)

### 2. Complete Design System ✅
**File:** `01_DESIGN_SYSTEM.md`
- Color palette with CSS variables
- Typography scale (Inter font)
- Spacing system (4px base unit)
- Effects (shadows, gradients, transitions)
- **Ready to use:** Copy/paste into your project

### 3. Enhancement Roadmap ✅
**File:** `03_OPTIONAL_ENHANCEMENTS.md`
- Prioritized improvements (High/Medium/Low)
- Effort estimates for each feature
- Cost-benefit analysis
- Implementation roadmap

---

## 5-Minute Setup

### Step 1: Review the Mockups
```bash
cd ../mockups/round-7-complete/
# Open any HTML file in browser
open 01-dashboard.html
```

**Look for:**
- Layout patterns you'll need to build
- Component interactions (buttons, forms, modals)
- Color usage in context
- Spacing relationships

### Step 2: Copy Design Tokens

From `01_DESIGN_SYSTEM.md`, copy the CSS variables section:

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

    /* ... rest of tokens */
}
```

Or use Tailwind config (also in `01_DESIGN_SYSTEM.md`)

### Step 3: Set Up Your Project

**Option A: Create React App + Tailwind**
```bash
npx create-react-app commandcentered
cd commandcentered
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Option B: Next.js + Tailwind (Recommended)**
```bash
npx create-next-app@latest commandcentered --typescript --tailwind --app
cd commandcentered
```

**Option C: Vite + React + Tailwind (Fastest)**
```bash
npm create vite@latest commandcentered -- --template react-ts
cd commandcentered
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 4: Configure Tailwind

Update `tailwind.config.js` with CommandCentered colors (from `01_DESIGN_SYSTEM.md`):

```javascript
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
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
                    600: '#475569',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
};
```

### Step 5: Add Inter Font

In your HTML head or _app.tsx:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

Or use `next/font` (Next.js):

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={inter.className}>
            <body>{children}</body>
        </html>
    );
}
```

---

## First Component: Button

Here's a production-ready button matching the design system:

```tsx
// components/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200',
    {
        variants: {
            variant: {
                primary: 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white shadow-[0_4px_12px_rgba(6,182,212,0.3)] hover:translate-y-[-2px] hover:shadow-[0_6px_16px_rgba(6,182,212,0.4)]',
                secondary: 'bg-slate-700/30 text-slate-300 border border-slate-600/50 hover:bg-slate-700/50',
            },
            size: {
                sm: 'px-4 py-2 text-sm',
                md: 'px-5 py-3 text-sm',
                lg: 'px-6 py-3 text-base',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    children: ReactNode;
}

export function Button({ children, variant, size, className, ...props }: ButtonProps) {
    return (
        <button className={buttonVariants({ variant, size, className })} {...props}>
            {children}
        </button>
    );
}
```

**Usage:**
```tsx
<Button variant="primary">Create Lead</Button>
<Button variant="secondary">Cancel</Button>
```

---

## Layout Structure

### App Shell

```tsx
// components/Layout.tsx
export function Layout({ children }) {
    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-800 to-slate-700 text-slate-200">
            {/* Sidebar */}
            <aside className="w-[260px] bg-gradient-to-b from-slate-900 to-slate-950 border-r-2 border-cyan-600/30 shadow-[4px_0_32px_rgba(6,182,212,0.15)]">
                {/* Logo */}
                <div className="p-8 border-b border-cyan-600/20">
                    <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-600 to-purple-500 bg-clip-text text-transparent">
                        CommandCentered
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="p-6">
                    {/* Nav items */}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-gradient-to-r from-cyan-600/15 to-purple-500/15 border-b border-cyan-600/30 px-8 py-6">
                    {/* Page title and actions */}
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
```

---

## Development Workflow

### 1. Build Component by Component
Don't try to build everything at once. Start with:
- Layout shell (sidebar + header)
- Navigation
- One page (Dashboard recommended)
- One widget
- Expand from there

### 2. Reference the Mockups Constantly
Keep the HTML files open while coding. Match:
- Exact colors (use design tokens)
- Spacing (use Tailwind spacing scale)
- Border radius (8px buttons, 12px cards)
- Shadows (copy from design system)

### 3. Test Responsiveness Early
Even if mobile isn't priority, test at different desktop sizes:
- 1920px (large desktop)
- 1440px (standard desktop)
- 1280px (laptop)
- 1024px (small laptop)

### 4. Use TypeScript
Type safety prevents bugs:
```typescript
interface Lead {
    id: string;
    name: string;
    company: string;
    stage: 'inquiry' | 'proposal' | 'negotiation' | 'won' | 'lost';
    value: number;
    createdAt: Date;
}
```

---

## Common Patterns

### Gradient Text (Logo, Headers)

```tsx
<h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-purple-500 bg-clip-text text-transparent">
    CommandCentered
</h1>
```

### Card with Hover Effect

```tsx
<div className="bg-slate-700/50 border border-slate-600/30 rounded-xl p-5 transition-all duration-200 hover:border-cyan-600/50 hover:-translate-y-0.5">
    {/* Card content */}
</div>
```

### Active Navigation Item

```tsx
<a className="flex items-center gap-3 px-6 py-3 text-slate-400 border-l-4 border-transparent transition-all hover:bg-cyan-600/10 hover:text-cyan-400 hover:border-cyan-600/80 aria-[current=page]:bg-gradient-to-r aria-[current=page]:from-cyan-600/20 aria-[current=page]:to-transparent aria-[current=page]:text-cyan-400 aria-[current=page]:border-cyan-600 aria-[current=page]:shadow-[0_0_10px_rgba(34,211,238,0.5)]">
    Dashboard
</a>
```

### Icon-Only View Toggle

```tsx
<div className="flex gap-1">
    <button
        title="Card View"
        className="p-2 rounded-lg bg-cyan-600/10 border border-cyan-600/30 text-cyan-400 hover:bg-cyan-600/20"
    >
        📇
    </button>
    <button
        title="Table View"
        className="p-2 rounded-lg bg-slate-700/30 border border-slate-600/30 text-slate-400 hover:bg-slate-700/50"
    >
        📊
    </button>
</div>
```

---

## Recommended Libraries

### UI Components (Pick One)
- **Radix UI** (recommended) - Unstyled, accessible primitives
- **Headless UI** - Tailwind's official components
- **shadcn/ui** - Copy/paste Radix + Tailwind components

### Forms
- **React Hook Form** + **Zod** - Best DX, type-safe validation

### Tables
- **TanStack Table** - Powerful, headless table component

### Dates
- **date-fns** - Lightweight date utilities

### Icons
- **Lucide React** - Modern icon library (replace emojis)

### State Management
- **Zustand** - Simple, modern state management
- **TanStack Query** - Server state (fetching, caching)

---

## Next Steps

1. ✅ Set up project (Vite/Next.js + Tailwind)
2. ✅ Configure design tokens (colors, fonts, spacing)
3. ✅ Build layout shell (sidebar + header)
4. ⏳ Build first page (Dashboard recommended)
5. ⏳ Add navigation
6. ⏳ Build remaining pages
7. ⏳ Add forms and interactions
8. ⏳ Connect to backend API

---

## Resources

### In This Folder
- `README.md` - Overview and philosophy
- `01_DESIGN_SYSTEM.md` - Complete design tokens
- `03_OPTIONAL_ENHANCEMENTS.md` - Feature roadmap

### External Mockups
- `../mockups/round-7-complete/` - 10 HTML pages

### Documentation
- `../mockups/round-7-complete/VISUAL_AUDIT_REPORT.md` - Design analysis
- `../mockups/round-7-complete/SPEC_COMPLIANCE_COMPARISON.md` - Feature coverage

---

## Quick Wins

Start with these for immediate visual match:

### 1. Background
```css
body {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}
```

### 2. Sidebar
```css
.sidebar {
    background: linear-gradient(180deg, #0c1220 0%, #030712 100%);
    border-right: 2px solid rgba(6, 182, 212, 0.3);
}
```

### 3. Primary Button
```css
.btn-primary {
    background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
}
```

### 4. Card
```css
.card {
    background: rgba(30, 41, 59, 0.5);
    border: 1px solid rgba(71, 85, 105, 0.3);
    border-radius: 12px;
    padding: 20px;
}

.card:hover {
    border-color: rgba(6, 182, 212, 0.5);
    transform: translateY(-2px);
}
```

---

*You're ready to start building! Refer to the design system for all styling decisions, and reference the mockups for layout patterns.*
