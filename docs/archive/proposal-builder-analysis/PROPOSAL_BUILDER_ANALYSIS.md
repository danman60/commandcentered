# Proposal Builder Analysis
# Template Deconstruction for Proposal Builder Builder

**Date:** 2025-11-08
**Status:** Session 1 Complete - All 5 templates analyzed
**Purpose:** Extract patterns from existing proposal builders to inform Proposal Builder Builder meta-tool design

---

## 📊 TEMPLATE SUMMARY

| Template | Service Type | Pricing Model | Unique Elements |
|----------|-------------|---------------|-----------------|
| RecitalBuilderFrontend.html | Dance Recital Media | Tiered by quantity (0-100, 101-200, 201+) | Dancer count input, routine selection |
| MusicSite.html | Event Videography | Package tiers + add-ons | Camera selection cards |
| TributeShowConcert.txt | Concert Videography | Base day rate ($750) + optional add-ons | Quantity controls (TVs, videos) |
| DancePromo.html | Dance Promo Videos | Fixed packages | Video showcase cards |
| CorpVideo.html | Corporate Video | Custom packages | Industry-specific services |

---

## 🎨 UNIVERSAL DESIGN SYSTEM (StreamStage Branding)

**ALL 5 templates use IDENTICAL CSS variables:**

```css
:root {
    --streamstage-primary: #1a1a1a;       /* Dark background */
    --streamstage-secondary: #2a2a2a;     /* Card backgrounds */
    --streamstage-accent: #00bcd4;         /* Cyan - primary actions */
    --streamstage-accent-hover: #00acc1;   /* Cyan - hover state */
    --streamstage-orange: #ff6b35;         /* Incentives/CTAs */
    --streamstage-text: #ffffff;           /* Primary text */
    --streamstage-text-muted: #b0b0b0;     /* Secondary text */
    --streamstage-border: #404040;         /* Border color */
    --streamstage-success: #4caf50;        /* Success/included items */
}
```

**Typography (Consistent):**
- Font Stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Base Font Size: `15px`
- Line Height: `1.4`

**Spacing (Consistent):**
- Section margin: `12-20px`
- Card padding: `10-16px`
- Grid gap: `12px`
- Border radius: `4-8px` (buttons: 6px, cards: 8px, hero: 12px)

---

## 🧩 COMMON UI COMPONENTS (Found in ALL Templates)

### 1. Hero Section
**Purpose:** Service overview + value proposition
**Structure:**
```html
<section class="hero">
    <h2>[Service Name] Package</h2>
    <p>[Description]</p>
    <div class="hero-features">
        <div>✓ Feature 1</div>
        <div>✓ Feature 2</div>
        <div>✓ Feature 3</div>
    </div>
</section>
```
**Styling:**
- Background: `var(--streamstage-secondary)`
- Border: `1px solid var(--streamstage-border)`
- Border Radius: `12px`
- Padding: `16px`
- Text Alignment: `center`

**Builder Requirement:**
- Rich text editor for title + description
- Checkbox list for features
- Icon picker (default: ✓)

---

### 2. Selectable Cards
**Purpose:** Service selection (cameras, add-ons, packages)
**Variants:**
- **Checkbox cards** (select multiple)
- **Radio cards** (select one)
- **Quantity cards** (select + set quantity)

**Base Structure:**
```html
<div class="card" onclick="toggleElement('element-id')">
    <div class="card-header">
        <div class="checkbox" id="checkbox-element-id"></div>
        <div class="status-badge unselected" id="badge-element-id">Select</div>
    </div>
    <h4>[Item Name]</h4>
    <p>[Description]</p>
    <div class="price">+$XXX</div>
</div>
```

**States:**
- **Unselected:** Border `#404040`, badge gray
- **Selected:** Border `#00bcd4`, badge cyan, gradient background
- **Included:** Border green, badge green, non-interactive

**Builder Requirement:**
- Checkbox/radio/quantity selector
- Title + description fields
- Price input (or "Included")
- State management (selected/unselected/included)

---

### 3. Quantity Controls
**Purpose:** Select quantity of items (TVs, videos, highlight reels)
**Structure:**
```html
<div class="quantity-control">
    <span>Quantity:</span>
    <div class="quantity-buttons">
        <button class="qty-btn" onclick="updateQuantity('item-id', -1)">-</button>
        <input type="number" class="qty-input" id="qty-item-id" value="0" min="0">
        <button class="qty-btn" onclick="updateQuantity('item-id', 1)">+</button>
    </div>
</div>
```

**Styling:**
- Buttons: `24px × 24px` circular, border `1px`
- Input: `40px` wide, center-aligned, rounded `4px`

**Builder Requirement:**
- Enable/disable quantity control per item
- Min/max quantity limits
- Price multiplier per unit

---

### 4. Investment Summary (Live Pricing)
**Purpose:** Real-time cost calculation + breakdown
**Structure:**
```html
<div class="summary-card">
    <h3 class="section-title">Investment Summary</h3>

    <div class="summary-row">
        <span>Base Package</span>
        <span>$XXX</span>
    </div>

    <div class="summary-row">
        <span>Add-ons</span>
        <span id="addons-total">$0</span>
    </div>

    <!-- Discount Row (conditional) -->
    <div class="summary-row discount-row" id="discount-row" style="display: none;">
        <span id="discount-label">Volume Discount (5%)</span>
        <span id="discount-amount">-$50</span>
    </div>

    <div class="summary-divider">
        <div class="summary-row total-row">
            <span>Total Investment</span>
            <span id="final-total">$XXX</span>
        </div>
    </div>
</div>
```

**Discount Row Styling:**
- Background: `var(--streamstage-success)` (green)
- Color: `white`
- Margin: `4px -8px` (negative to break card padding)
- Border radius: `4px`

**Builder Requirement:**
- Auto-calculate totals from selected items
- Conditional discount display
- Line item breakdown (not just total)

---

### 5. Submission Form
**Purpose:** Collect client info + event details
**Common Fields (found in 4/5 templates):**
- Email (required)
- Organization/Event Name (required)
- Event Date (date picker)
- Event Start Time (dropdown or time picker)
- Notes/Special Requirements (textarea)

**Structure:**
```html
<section class="section">
    <div class="summary-card">
        <h3 class="section-title">Submit Your Proposal</h3>
        <input type="email" class="header-input" id="user-email" placeholder="Your email address" required>
        <input type="text" class="header-input" id="user-organization" placeholder="Organization/Event name" required>
        <input type="date" class="header-input" id="event-date">
        <select class="header-input" id="event-start-time">...</select>
        <textarea class="header-input" id="event-notes" placeholder="Event details..."></textarea>
        <button class="btn" onclick="submitProposal()">Submit Proposal</button>
    </div>
</section>
```

**Builder Requirement:**
- Drag-and-drop form fields
- Field type selector (text, email, date, time, textarea, select)
- Validation rules (required/optional)
- Placeholder text customization

---

### 6. Modals (Confirmation + Success)
**Purpose:** Confirm submission + show success message
**Templates use 2 modals:**

**Confirmation Modal:**
- Shows total investment
- Cancel + Submit buttons
- Requires user confirmation before sending

**Success Modal:**
- ✓ icon + thank you message
- "What happens next" steps
- Contact email link

**Builder Requirement:**
- Custom confirmation message
- Custom success message
- "Next steps" list editor

---

## 💰 PRICING LOGIC PATTERNS

### Pattern 1: Tiered by Quantity (RecitalBuilderFrontend)
**Use Case:** Dance recital media (per-dancer pricing)
**Logic:**
```javascript
const pricingTiers = [
    { min: 0,   max: 100, price: 15 },  // 0-100 dancers = $15/dancer
    { min: 101, max: 200, price: 12 },  // 101-200 = $12/dancer
    { min: 201, max: 999, price: 10 }   // 201+ = $10/dancer
];

function calculatePrice(dancerCount) {
    const tier = pricingTiers.find(t => dancerCount >= t.min && dancerCount <= t.max);
    return dancerCount * tier.price;
}
```

**Builder UI Needed:**
- Table for quantity ranges (min, max, price per unit)
- Add/remove tier rows
- Visual preview of tiered pricing

---

### Pattern 2: Base Day Rate + Add-ons (TributeShowConcert)
**Use Case:** Event videography (fixed base + optional extras)
**Logic:**
```javascript
const basePackage = 750; // Fixed day rate

const addons = {
    'tripod-zoom': 275,
    'roaming-camera': 500,
    'sound-package': 750,
    'tv-display': 150  // Per unit
};

function calculateTotal(selectedAddons, quantities) {
    let total = basePackage;
    selectedAddons.forEach(addon => {
        if (quantities[addon]) {
            total += addons[addon] * quantities[addon];
        } else {
            total += addons[addon];
        }
    });
    return total;
}
```

**Builder UI Needed:**
- Base package price input
- Add-on list with individual prices
- Checkbox: "Allow quantity" (for items like TVs)

---

### Pattern 3: Fixed Package Tiers (DancePromo)
**Use Case:** Pre-defined packages (Bronze/Silver/Gold)
**Logic:**
```javascript
const packages = {
    bronze: { price: 500, features: [...] },
    silver: { price: 1000, features: [...] },
    gold: { price: 2500, features: [...] }
};

function selectPackage(tier) {
    return packages[tier].price;
}
```

**Builder UI Needed:**
- Package tier creator (name, price, feature list)
- Mutual exclusivity (select only one package)
- Visual comparison table

---

### Pattern 4: Volume Discounts (TributeShowConcert)
**Use Case:** Incentivize larger orders
**Logic:**
```javascript
const discountTiers = [
    { threshold: 3000, pct: 15 },  // $3000+ = 15% off
    { threshold: 2000, pct: 10 },  // $2000+ = 10% off
    { threshold: 1000, pct: 5 }    // $1000+ = 5% off
];

function calculateDiscount(subtotal) {
    const tier = discountTiers.find(t => subtotal >= t.threshold);
    return tier ? (tier.pct / 100) * subtotal : 0;
}
```

**Builder UI Needed:**
- Discount threshold table (spend amount, discount %)
- Sort tiers automatically (highest to lowest)
- Preview "next tier" incentive message

---

### Pattern 5: Conditional Pricing (RecitalBuilderFrontend)
**Use Case:** Bundle discounts (video + photo = 10% off)
**Logic:**
```javascript
function applyConditionalDiscounts(selectedServices) {
    let discount = 0;
    if (selectedServices.includes('video') && selectedServices.includes('photo')) {
        discount = 0.10; // 10% off when both selected
    }
    return discount;
}
```

**Builder UI Needed:**
- IF/THEN rule builder
- Condition: "When [Service A] AND [Service B] selected"
- Action: "Apply [X]% discount" OR "Add $[Y] fee"

---

## 🔧 UNIQUE ELEMENTS PER TEMPLATE

### RecitalBuilderFrontend (Dance Recital Media)
**Unique:**
- **Dancer count input** (large number input, center-aligned, 140px wide, 50px tall)
- **Routine selection** (checkbox list of routines)
- **Service toggle cards** (video, streaming, photos, photos only, video only)
- **Tiered pricing display** (visual breakdown of tiers with active tier highlighted)

**Pricing Complexity:**
- Per-dancer pricing with volume discounts
- Service-specific multipliers (video vs. photo)
- Routine-based pricing (per routine fees)

**Builder Elements Needed:**
1. Number input (large, prominent)
2. Tiered pricing calculator UI
3. Service toggle card grid
4. Routine checkbox list

---

### MusicSite.html (Event Videography)
**Unique:**
- **Camera selection cards** (1-cam, 2-cam, 3-cam packages)
- **Package tier selector** (radio buttons styled as cards)
- **Add-on grid** (additional services beyond base package)

**Pricing Complexity:**
- Base package selection (mutually exclusive)
- Add-ons priced individually
- No volume discounts

**Builder Elements Needed:**
1. Radio card grid (select one package)
2. Checkbox card grid (select multiple add-ons)
3. Simple addition (no tiers)

---

### TributeShowConcert.txt (Concert Videography)
**Unique:**
- **Base package highlight** (green border, "Included" badge)
- **Quantity controls on items** (TVs, videos)
- **Volume discount tiers** (5%, 10%, 15% at thresholds)
- **Incentive cards** (orange border, "Add $X to save Y%")
- **Vimeo video embeds** (example videos in cards)

**Pricing Complexity:**
- Fixed base day rate ($750)
- Per-unit pricing (TVs, videos)
- Volume discounts with visual incentives
- Live calculation of "next tier" savings

**Builder Elements Needed:**
1. Base package card (non-selectable, always included)
2. Quantity control UI
3. Volume discount tier table
4. Incentive card generator (auto-calculate next tier)
5. Video embed field (iframe support)

---

### DancePromo.html (Dance Promo Videos)
**Unique:**
- **Package comparison grid** (side-by-side Bronze/Silver/Gold)
- **Video portfolio embeds** (showcase past work)
- **Fixed packages** (no add-ons, just select tier)

**Pricing Complexity:**
- Simplest model (select package, no add-ons)
- No volume discounts
- No quantity controls

**Builder Elements Needed:**
1. Package tier creator (3-column grid)
2. Feature list per package
3. Video showcase embed

---

### CorpVideo.html (Corporate Video Production)
**Unique:**
- **Industry-specific categories** (corporate, training, promotional)
- **Deliverable type selector** (social media, web, broadcast)
- **Timeline/deadline fields** (rush fees)

**Pricing Complexity:**
- Industry-based pricing (different rates per vertical)
- Deliverable-based pricing (4K vs. HD, social vs. broadcast)
- Rush fee multipliers (deadline-based)

**Builder Elements Needed:**
1. Category dropdown (industry vertical)
2. Deliverable type checkboxes
3. Timeline/deadline selector
4. Conditional pricing rules (if rush = +30%)

---

## 📋 CRM DATA STRUCTURE (For Targeting Interface)

**Columns (from CRM Data.html):**
1. **Studio Name** (text)
2. **Phone #** (formatted text)
3. **Email** (email)
4. **Type of Contact** (text - dropdown?)
5. **Last Contacted** (date)
6. **Next Follow-Up** (date - calculated field?)
7. **Contact Frequency** (text - "Weekly", "Monthly", etc.)
8. **Contacted Button** (checkbox - marks contact as done)
9. **Studio Promo** (status badges: "Not Interested", "Not Contacted", "Previous Client", "Purchased")
10. **Recital** (status badges: same as above + "Interested", "Penciled")
11. **Studio Sage** (status badges: "Not Contacted", "Proposal Sent")
12. **Notes** (long text field)
13. **Recital Date** (date)

**Status Badge Colors (from HTML):**
- **Not Interested:** Light blue (`#bfe5ff` bg, `#1a485b` text)
- **Not Contacted:** Light green (`#c8efcd` bg, `#2d5954` text)
- **Previous Client:** Medium blue (`#aacfff` bg, `#294751` text)
- **Purchased:** Dark blue/gray (`#597687` bg, `#f6f8ff` text - white text!)
- **Interested:** Red background (`#ff0000` - **WARNING COLOR**)
- **Penciled:** Medium green (`#74bfa2` bg, `#143530` text)
- **Proposal Sent:** Cyan (`#81d4fa` bg, `#000000` text)

**Row Highlighting:**
- **Red rows:** High priority (e.g., Dance In Style Studio, 7Attitudes, Generations)
- Indicates: Needs immediate follow-up

**CRM Interface Requirements:**
1. Spreadsheet-style table view
2. Status badge dropdowns (multi-select per product column)
3. Auto-calculated "Next Follow-Up" based on frequency
4. Checkbox for "Contacted" (updates Last Contacted date)
5. Color-coded rows for priority
6. Filter by status badges
7. Sort by Last Contacted, Next Follow-Up, Studio Name
8. Notes field with rich text
9. Export to CSV

---

## 🎯 PROPOSAL BUILDER BUILDER - ELEMENT TYPES REQUIRED

Based on analysis of all 5 templates, the Builder needs these draggable elements:

### Input Elements
1. **Number Input** (dancer count, guest count, hours)
   - Size variants (small/medium/large)
   - Min/max validation
   - Step increment
   - Placeholder text

2. **Text Input** (name, organization, venue)
   - Single line
   - Placeholder text
   - Validation (required/optional, email format, phone format)

3. **Textarea** (special requests, notes)
   - Rows (height control)
   - Character limit
   - Placeholder text

4. **Date Picker** (event date, deadline)
   - Min/max date range
   - Default value

5. **Time Picker** (start time, end time)
   - 12/24 hour format
   - Dropdown or native input

6. **Dropdown/Select** (event type, package tier, industry)
   - Options list (add/remove options)
   - Default selection

7. **File Upload** (shot lists, inspiration, reference videos)
   - Accepted file types
   - Max file size
   - Multiple files toggle

### Selection Elements
8. **Checkbox Card** (select multiple services)
   - Title + description
   - Price (or "Included")
   - Selected state styling
   - Quantity control toggle

9. **Radio Card** (select one package)
   - Title + description + price
   - Feature list
   - Mutually exclusive selection

10. **Service Toggle** (video/photo/streaming)
    - Icon + label
    - Binary on/off
    - Price modifier

11. **Quantity Control** (TVs, videos, cameras)
    - +/- buttons
    - Min/max limits
    - Price per unit

### Display Elements
12. **Hero Section** (service overview)
    - Title (rich text)
    - Description (rich text)
    - Feature list (checkmarks)

13. **Section Divider** (category headers)
    - Title
    - Subtitle (optional)
    - Styling (center/left aligned)

14. **Base Package Card** (always-included items)
    - Non-interactive
    - "Included" badge (green)
    - Feature list

15. **Video Embed** (portfolio examples)
    - Vimeo/YouTube iframe
    - Title/caption
    - Aspect ratio

16. **Pricing Summary** (live calculation)
    - Line items (auto-generated)
    - Discount row (conditional)
    - Total (bold, highlighted)

17. **Incentive Card** (upsell messages)
    - Auto-calculated "next tier" savings
    - Orange/attention-grabbing styling
    - Icon + message

### Grid Layouts
18. **2-Column Grid**
19. **3-Column Grid**
20. **4-Column Grid**
21. **Custom Grid** (user-defined columns)

---

## 🧮 PRICING LOGIC BUILDER REQUIREMENTS

### Pricing Rule Types
1. **Fixed Price** (flat fee for item/package)
2. **Per-Unit Price** (quantity × unit price)
3. **Tiered Pricing** (quantity ranges with different rates)
4. **Volume Discount** (% off at spend thresholds)
5. **Conditional Discount** (if A + B selected, then X% off)
6. **Conditional Fee** (if rush delivery, then +$Y)
7. **Base Package** (included in all proposals)

### Visual Pricing Builder UI
**Tiered Pricing Editor:**
```
Tier 1: 0 - 100 dancers × $15 = $0 - $1,500
Tier 2: 101 - 200 dancers × $12 = $1,212 - $2,400
Tier 3: 201+ dancers × $10 = $2,010+

[+ Add Tier]
```

**Volume Discount Editor:**
```
Spend $1,000+ → 5% off
Spend $2,000+ → 10% off
Spend $3,000+ → 15% off

[+ Add Discount Tier]
```

**Conditional Pricing Editor:**
```
IF [Video Service] AND [Photo Service] are both selected
THEN Apply 10% discount

IF [Event Date] is within 14 days
THEN Add $500 rush fee

[+ Add Rule]
```

---

## 📐 PROPOSAL BUILDER WORKFLOW (User Perspective)

**Admin Workflow (YOU - in CommandCentered):**
1. Navigate to "Proposal Builder Builder"
2. Create new proposal template
3. Name template (e.g., "Dance Recital Media")
4. Drag elements from sidebar to canvas
5. Configure each element (titles, prices, validation)
6. Set pricing logic (tiers, discounts, conditionals)
7. Preview proposal builder (client view)
8. Publish → Get shareable link
9. Copy link: `streamstage.com/proposals/dance-recital-media`

**Client Workflow (THEY - StreamStage branded):**
1. Receive link from you via email
2. Open proposal builder (`streamstage.com/proposals/[slug]`)
3. See StreamStage branding (NOT CommandCentered)
4. Fill out proposal form:
   - Select services (checkboxes/radios)
   - Enter quantities (dancer count, TVs, videos)
   - Provide event details (date, time, venue)
5. Watch live pricing update as they select items
6. See incentive messages ("Add $250 to save 10%!")
7. Submit proposal → Confirmation modal
8. Receive success message → "We'll review and get back to you"

**Your Workflow (Review):**
1. Get email notification: "New proposal from [Client Name]"
2. Open CommandCentered → Lead Dashboard
3. View submitted proposal with selections + pricing
4. Review → Accept or Request Changes
5. If Accepted → Auto-generate contract
6. Send contract via e-signature system

---

## 🎨 BUILDER INTERFACE MOCKUP REQUIREMENTS

### Left Sidebar (Elements Palette)
**Categories:**
- **Inputs** (text, number, date, time, textarea, select, file upload)
- **Selections** (checkbox card, radio card, toggle, quantity)
- **Display** (hero, section, base package, video embed, summary, incentive)
- **Layout** (2-col grid, 3-col grid, 4-col grid)

**Drag-and-Drop:**
- Drag element from sidebar → Drop on canvas
- Visual drop zones (blue dashed border)
- Snap to grid
- Auto-scroll canvas when dragging near edges

### Center Canvas (Preview)
**Live Preview:**
- Shows proposal builder as client will see it
- StreamStage branding applied
- Click elements to edit (opens right panel)
- Reorder elements (drag handles)
- Delete elements (trash icon on hover)

### Right Panel (Element Settings)
**Context-Sensitive:**
- Changes based on selected element
- Example: Checkbox Card selected
  - Title (text input)
  - Description (textarea)
  - Price (number input)
  - Allow Quantity (toggle)
  - Required (toggle)

**Pricing Logic Tab:**
- Add pricing rules
- Test pricing calculator
- Preview discount messages

### Top Bar (Actions)
- Save Draft
- Preview (opens new tab with client view)
- Publish (generates shareable link)
- Settings (proposal name, slug, metadata)

---

## 🔗 INTEGRATION POINTS

### Proposal Submission → Lead Creation
**When client submits proposal:**
1. Create `leads` record with contact info
2. Create `proposals` record with selections
3. Create `proposal_line_items` for each selected service
4. Calculate total investment + store in `proposals.total_amount`
5. Send email notification to you
6. Send confirmation email to client

### Proposal Accepted → Contract Generation
**When you accept proposal:**
1. Create `contracts` record from proposal data
2. Populate contract template with:
   - Client name, email
   - Service selections
   - Pricing breakdown
   - Event date/time/venue
3. Generate PDF contract
4. Send e-signature request

### Contract Signed → Event Creation
**When client signs contract:**
1. Create event in `events` table (logistics system)
2. Populate event details from contract:
   - Date, time, venue
   - Required services (cameras, crew, gear)
3. Trigger logistics workflow (assign ops, gear, vehicles)
4. Send client questionnaire for additional details

---

## 📊 DATABASE SCHEMA IMPLICATIONS

### New Tables Needed (Phase 3)

**`proposal_templates`** (Builder configurations)
- `id`, `tenant_id`, `name`, `slug`, `service_type`
- `config_json` (stores element layout + pricing rules)
- `created_at`, `updated_at`, `published_at`

**`proposal_template_elements`** (Individual elements in templates)
- `id`, `template_id`, `element_type`, `position`, `config_json`

**`leads`** (Inquiry tracking)
- `id`, `tenant_id`, `email`, `organization`, `phone`, `source`
- `status` (new, contacted, qualified, lost)
- `created_at`, `updated_at`

**`proposals`** (Client submissions)
- `id`, `tenant_id`, `lead_id`, `template_id`
- `selections_json` (selected services + quantities)
- `total_amount`, `discount_amount`, `final_amount`
- `event_date`, `event_time`, `notes`
- `status` (submitted, reviewing, accepted, rejected)
- `created_at`, `updated_at`

**`proposal_line_items`** (Selected services)
- `id`, `proposal_id`, `service_name`, `quantity`, `unit_price`, `total_price`

---

## ✅ SESSION 1 COMPLETE

**Files Analyzed:**
- ✅ RecitalBuilderFrontend.html (943 lines)
- ✅ MusicSite.html (CSS + structure)
- ✅ TributeShowConcert.txt (1,219 lines - COMPLETE HTML)
- ✅ DancePromo.html (CSS + structure)
- ✅ CorpVideo.html (CSS + structure)
- ✅ CRM Data.html (300 lines - spreadsheet structure)

**Patterns Extracted:**
- ✅ Universal StreamStage design system (colors, typography, spacing)
- ✅ 6 common UI components (hero, cards, quantity, summary, form, modals)
- ✅ 5 pricing logic patterns (tiered, base+addons, packages, volume discounts, conditional)
- ✅ 5 unique elements per template (17 total element types needed)
- ✅ CRM data structure (13 columns, status badges, priority highlighting)

**Key Insights:**
1. **100% design consistency** across all 5 templates (same CSS variables)
2. **Modular component structure** (cards, grids, sections) perfect for builder
3. **Complex pricing logic** can be abstracted into visual rule builders
4. **Client-facing vs. Internal split** confirmed (StreamStage vs. CommandCentered)
5. **CRM integration** needed for outreach tracking → proposal → contract → event workflow

**Next Steps (Session 2):**
- Design Phase 3 database schema (proposal builder tables)
- Document pricing logic pseudocode
- Create workflow specifications (lead → proposal → contract → event)

---

**Files Referenced:**
- RecitalBuilderFrontend.html (D:\ClaudeCode\RecitalBuilderFrontend.html)
- MusicSite.html (C:\Users\Danie\OneDrive\Desktop\MusicSite.html)
- TributeShowConcert.txt (C:\Users\Danie\OneDrive\Desktop\TributeShowConcert.txt)
- DancePromo.html (C:\Users\Danie\OneDrive\Desktop\DancePromo.html)
- CorpVideo.html (C:\Users\Danie\OneDrive\Desktop\CorpVideo.html)
- CRM Data.html (C:\Users\Danie\Downloads\CRM Data.html)
