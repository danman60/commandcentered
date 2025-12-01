# Proposal Builder Builder - Complete Specification

**Version:** 1.0
**Date:** December 1, 2025
**Status:** Active Development
**Parent Spec:** CLIENTS_PAGE_SPEC.md (Section 10: Proposal Generation)

---

## 1. Executive Summary

### 1.1 What This Is
A **drag-and-drop builder** for creating customizable, modular proposal forms. Think "Webflow for proposals" - clients can design their own proposal layouts with pricing logic, save them as templates, and generate unique URLs for clients to fill out.

### 1.2 What This Is NOT
- ❌ A hardcoded 3-step proposal wizard
- ❌ A simple form with static service checkboxes
- ❌ A proposal viewer/editor for individual proposals

### 1.3 Core Value Proposition
- **For CommandCentered Clients:** Design once, reuse forever - create branded proposal forms matching their business model
- **For Their Customers:** Professional, interactive proposals with real-time pricing calculations
- **For System:** Capture structured proposal data, track conversions, analytics

---

## 2. Architecture Overview

### 2.1 Three-Column Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Header: Template Name | Save | Publish | Preview              │
├──────────────┬──────────────────────────┬──────────────────────┤
│              │                          │                      │
│   ELEMENT    │       CANVAS             │    SETTINGS          │
│   PALETTE    │       (Preview)          │    PANEL             │
│              │                          │                      │
│  ┌────────┐  │  ┌──────────────────┐   │  Selected: Hero      │
│  │ 🎯 Hero│  │  │ HERO SECTION     │   │  ┌────────────────┐  │
│  └────────┘  │  │ [Title Input]    │   │  │ Title:         │  │
│              │  │ [Subtitle]       │   │  │ [Dance Recital]│  │
│  ┌────────┐  │  └──────────────────┘   │  │                │  │
│  │🔢 Number│  │                         │  │ Subtitle:      │  │
│  └────────┘  │  ┌──────────────────┐   │  │ [Media Package]│  │
│              │  │ NUMBER INPUT     │   │  └────────────────┘  │
│  ┌────────┐  │  │ How many dancers?│   │                      │
│  │☑️ Toggle│  │  │ [____] dancers   │   │  Pricing Rules:     │
│  └────────┘  │  └──────────────────┘   │  [+ Add Rule]       │
│              │                          │                      │
│   (More...)  │  [+ Add Element]         │  [Delete Element]   │
└──────────────┴──────────────────────────┴──────────────────────┘
```

### 2.2 User Flow

**Builder Mode (Admins/CDs):**
1. Navigate to Files → Proposals → "Create Template"
2. Drag elements from palette to canvas
3. Configure element settings in right panel
4. Set up pricing rules and calculations
5. Save template → Get shareable URL
6. Publish template (makes it live)

**Client-Facing Mode (Proposal Recipients):**
1. Open unique URL: `commandcentered.vercel.app/proposals/preview/{templateId}`
2. See rendered proposal form
3. Fill out fields (number inputs, checkboxes, etc.)
4. See real-time pricing calculations
5. Submit proposal → Creates lead/opportunity in system

---

## 3. Element Types (17 Total)

### 3.1 Content Elements

#### 3.1.1 Hero Section
**Purpose:** Header with title, subtitle, optional background image
**Schema:**
```typescript
{
  type: 'hero',
  id: string,
  config: {
    title: string,
    subtitle: string,
    backgroundImage?: string,
    textAlign: 'left' | 'center' | 'right',
    backgroundColor?: string,
    textColor?: string
  }
}
```
**UI:** Large heading with subtitle, customizable styling

#### 3.1.2 Rich Text Block
**Purpose:** Formatted text content (descriptions, terms, disclaimers)
**Schema:**
```typescript
{
  type: 'rich_text',
  id: string,
  config: {
    content: string, // HTML string
    fontSize: 'sm' | 'md' | 'lg',
    textAlign: 'left' | 'center' | 'right'
  }
}
```
**UI:** WYSIWYG editor in settings panel

#### 3.1.3 Image
**Purpose:** Standalone image (logo, photo, diagram)
**Schema:**
```typescript
{
  type: 'image',
  id: string,
  config: {
    src: string,
    alt: string,
    width: number, // percentage or px
    alignment: 'left' | 'center' | 'right',
    caption?: string
  }
}
```

#### 3.1.4 Video Embed
**Purpose:** Embedded video (YouTube, Vimeo)
**Schema:**
```typescript
{
  type: 'video',
  id: string,
  config: {
    embedUrl: string,
    aspectRatio: '16:9' | '4:3' | '1:1',
    autoplay: boolean
  }
}
```

---

### 3.2 Input Elements

#### 3.2.1 Number Input
**Purpose:** Quantity selector (# of dancers, hours, days)
**Schema:**
```typescript
{
  type: 'number_input',
  id: string,
  config: {
    label: string,
    placeholder: string,
    min?: number,
    max?: number,
    step?: number,
    defaultValue?: number,
    helpText?: string,
    required: boolean,
    pricingVariable?: string // Used in calculations (e.g., "numDancers")
  }
}
```
**Pricing Integration:** Value can be used in formulas
**Example:** `numDancers * pricePerDancer`

#### 3.2.2 Text Input
**Purpose:** Short text (name, email, event name)
**Schema:**
```typescript
{
  type: 'text_input',
  id: string,
  config: {
    label: string,
    placeholder: string,
    validation?: 'email' | 'phone' | 'url' | 'none',
    required: boolean,
    maxLength?: number
  }
}
```

#### 3.2.3 Textarea
**Purpose:** Long text (event details, special requests)
**Schema:**
```typescript
{
  type: 'textarea',
  id: string,
  config: {
    label: string,
    placeholder: string,
    rows: number,
    maxLength?: number,
    required: boolean
  }
}
```

#### 3.2.4 Date Picker
**Purpose:** Event date, deadline selection
**Schema:**
```typescript
{
  type: 'date_picker',
  id: string,
  config: {
    label: string,
    minDate?: string, // ISO format
    maxDate?: string,
    defaultValue?: string,
    required: boolean,
    helpText?: string
  }
}
```

#### 3.2.5 Dropdown Select
**Purpose:** Single choice from predefined options
**Schema:**
```typescript
{
  type: 'dropdown',
  id: string,
  config: {
    label: string,
    options: Array<{ value: string, label: string, priceModifier?: number }>,
    defaultValue?: string,
    required: boolean,
    helpText?: string
  }
}
```
**Pricing Integration:** Options can have price modifiers
**Example:** Venue size: Small ($0), Medium (+$500), Large (+$1000)

---

### 3.3 Selection Elements

#### 3.3.1 Service Toggles
**Purpose:** Enable/disable services with individual pricing
**Schema:**
```typescript
{
  type: 'service_toggles',
  id: string,
  config: {
    label: string,
    services: Array<{
      id: string,
      name: string,
      description: string,
      basePrice: number,
      icon?: string,
      defaultEnabled: boolean
    }>,
    layout: 'list' | 'grid',
    allowMultiple: boolean
  }
}
```
**Pricing Integration:** Each toggle adds/subtracts from total
**Example:** Multi-Camera ($2500), Highlight Reel ($800), Livestream ($1200)

#### 3.3.2 Checkbox Group
**Purpose:** Multi-select options (add-ons, extras)
**Schema:**
```typescript
{
  type: 'checkbox_group',
  id: string,
  config: {
    label: string,
    options: Array<{
      value: string,
      label: string,
      description?: string,
      priceModifier?: number
    }>,
    layout: 'vertical' | 'horizontal',
    min?: number, // Minimum selections required
    max?: number  // Maximum selections allowed
  }
}
```

#### 3.3.3 Radio Group
**Purpose:** Single-select from mutually exclusive options
**Schema:**
```typescript
{
  type: 'radio_group',
  id: string,
  config: {
    label: string,
    options: Array<{
      value: string,
      label: string,
      description?: string,
      priceModifier?: number
    }>,
    layout: 'vertical' | 'horizontal',
    required: boolean
  }
}
```

---

### 3.4 Pricing Elements

#### 3.4.1 Pricing Tiers
**Purpose:** Tiered pricing based on quantity thresholds
**Schema:**
```typescript
{
  type: 'pricing_tiers',
  id: string,
  config: {
    label: string,
    basedOn: string, // Reference to number_input pricingVariable
    tiers: Array<{
      minQty: number,
      maxQty: number | null, // null = infinity
      pricePerUnit: number,
      label?: string
    }>,
    showCalculation: boolean
  }
}
```
**Example:**
- 1-50 dancers: $15/dancer
- 51-100 dancers: $12/dancer
- 101+ dancers: $10/dancer

#### 3.4.2 Package Tiers (Checkbox Cards)
**Purpose:** Predefined package selection (Basic, Pro, Premium)
**Schema:**
```typescript
{
  type: 'package_tiers',
  id: string,
  config: {
    label: string,
    packages: Array<{
      id: string,
      name: string,
      price: number,
      features: string[],
      recommended?: boolean,
      icon?: string
    }>,
    layout: 'cards' | 'list',
    allowMultiple: boolean
  }
}
```

#### 3.4.3 Pricing Summary
**Purpose:** Live-updating total with breakdown
**Schema:**
```typescript
{
  type: 'pricing_summary',
  id: string,
  config: {
    label: string,
    showBreakdown: boolean,
    showTax: boolean,
    taxRate?: number,
    showDiscount: boolean,
    currencySymbol: string,
    position: 'inline' | 'sticky' // Sticky = always visible
  }
}
```
**Calculation:** Auto-sums all pricing elements in template

---

### 3.5 Action Elements

#### 3.5.1 Submit Button
**Purpose:** Submit proposal form
**Schema:**
```typescript
{
  type: 'submit_button',
  id: string,
  config: {
    label: string,
    variant: 'primary' | 'secondary',
    size: 'sm' | 'md' | 'lg',
    fullWidth: boolean,
    successMessage: string,
    redirectUrl?: string
  }
}
```

#### 3.5.2 Divider
**Purpose:** Visual separator between sections
**Schema:**
```typescript
{
  type: 'divider',
  id: string,
  config: {
    style: 'solid' | 'dashed' | 'dotted',
    color?: string,
    spacing: 'sm' | 'md' | 'lg' // Vertical margin
  }
}
```

---

## 4. Pricing Models (5 Types)

### 4.1 Tiered by Quantity
**Pattern:** Price per unit changes based on quantity
**Formula:** `sum(qty_in_tier * price_per_unit_in_tier)`
**Example:** 45 dancers → (45 × $15) = $675
**Elements Used:** `number_input`, `pricing_tiers`

### 4.2 Base Rate + Add-ons
**Pattern:** Fixed base price + optional extras
**Formula:** `base_price + sum(selected_addons.price)`
**Example:** $2000 base + Livestream ($1200) + Raw Footage ($400) = $3600
**Elements Used:** `service_toggles`, `checkbox_group`

### 4.3 Fixed Package Tiers
**Pattern:** Predefined packages (Basic/Pro/Premium)
**Formula:** `selected_package.price`
**Example:** Pro Package = $4500
**Elements Used:** `package_tiers`

### 4.4 Volume Discounts
**Pattern:** Discount applied at quantity thresholds
**Formula:** `base_total * (1 - discount_percent)`
**Example:** 150 dancers → 15% discount
**Elements Used:** `number_input`, pricing rules with discount logic

### 4.5 Conditional Pricing
**Pattern:** Price changes based on other selections
**Formula:** `if (condition) then price_A else price_B`
**Example:** Weekend event (+$500), Rush delivery (+$300)
**Elements Used:** `dropdown`, `radio_group` with `priceModifier`

---

## 5. Template Storage (Database Schema)

### 5.1 ProposalTemplate Table
```sql
CREATE TABLE proposal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_by UUID NOT NULL REFERENCES users(id),

  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL, -- URL-friendly (e.g., "dance-recital-media")
  description TEXT,

  -- Template structure stored as JSONB
  elements JSONB NOT NULL DEFAULT '[]', -- Array of element objects

  -- Metadata
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, published, archived
  version INT NOT NULL DEFAULT 1,
  is_default BOOLEAN DEFAULT FALSE,

  -- Branding
  theme_config JSONB, -- Custom colors, fonts, logo

  -- Analytics
  views_count INT DEFAULT 0,
  submissions_count INT DEFAULT 0,
  conversion_rate DECIMAL(5,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  UNIQUE(tenant_id, slug),
  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_proposal_templates_tenant ON proposal_templates(tenant_id);
CREATE INDEX idx_proposal_templates_status ON proposal_templates(status);
CREATE INDEX idx_proposal_templates_slug ON proposal_templates(slug);
```

### 5.2 ProposalSubmission Table
```sql
CREATE TABLE proposal_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  template_id UUID NOT NULL REFERENCES proposal_templates(id),

  -- Submitted data (snapshot of form values)
  form_data JSONB NOT NULL,

  -- Calculated pricing
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2),
  discount_amount DECIMAL(10,2),
  total_amount DECIMAL(10,2) NOT NULL,

  -- Contact info (extracted from form_data)
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),

  -- Workflow
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, converted
  converted_to_client_id UUID REFERENCES clients(id),
  converted_to_event_id UUID REFERENCES events(id),

  -- Metadata
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),

  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_template FOREIGN KEY (template_id) REFERENCES proposal_templates(id)
);

CREATE INDEX idx_proposal_submissions_tenant ON proposal_submissions(tenant_id);
CREATE INDEX idx_proposal_submissions_template ON proposal_submissions(template_id);
CREATE INDEX idx_proposal_submissions_status ON proposal_submissions(status);
CREATE INDEX idx_proposal_submissions_email ON proposal_submissions(contact_email);
```

### 5.3 Example JSONB Structure
```json
{
  "elements": [
    {
      "id": "hero-1",
      "type": "hero",
      "order": 0,
      "config": {
        "title": "Dance Recital Media Package",
        "subtitle": "Professional videography for your studio",
        "textAlign": "center",
        "backgroundColor": "#1a1a1a",
        "textColor": "#ffffff"
      }
    },
    {
      "id": "number-1",
      "type": "number_input",
      "order": 1,
      "config": {
        "label": "How many dancers will perform?",
        "placeholder": "Enter number",
        "min": 1,
        "max": 500,
        "defaultValue": 50,
        "required": true,
        "pricingVariable": "numDancers"
      }
    },
    {
      "id": "pricing-1",
      "type": "pricing_tiers",
      "order": 2,
      "config": {
        "label": "Pricing per Dancer",
        "basedOn": "numDancers",
        "tiers": [
          { "minQty": 1, "maxQty": 50, "pricePerUnit": 15 },
          { "minQty": 51, "maxQty": 100, "pricePerUnit": 12 },
          { "minQty": 101, "maxQty": null, "pricePerUnit": 10 }
        ],
        "showCalculation": true
      }
    },
    {
      "id": "services-1",
      "type": "service_toggles",
      "order": 3,
      "config": {
        "label": "Add-On Services",
        "services": [
          {
            "id": "highlight",
            "name": "Highlight Reel",
            "description": "3-5 minute edited video",
            "basePrice": 800,
            "defaultEnabled": false
          },
          {
            "id": "livestream",
            "name": "Livestream",
            "description": "Live streaming to unlimited viewers",
            "basePrice": 1200,
            "defaultEnabled": false
          }
        ],
        "layout": "grid",
        "allowMultiple": true
      }
    },
    {
      "id": "summary-1",
      "type": "pricing_summary",
      "order": 4,
      "config": {
        "label": "Total Investment",
        "showBreakdown": true,
        "showTax": true,
        "taxRate": 0.13,
        "currencySymbol": "$",
        "position": "sticky"
      }
    },
    {
      "id": "submit-1",
      "type": "submit_button",
      "order": 5,
      "config": {
        "label": "Request This Proposal",
        "variant": "primary",
        "size": "lg",
        "fullWidth": true,
        "successMessage": "Thank you! We'll review your request and get back to you within 24 hours."
      }
    }
  ],
  "theme_config": {
    "primaryColor": "#3b82f6",
    "fontFamily": "Inter, sans-serif",
    "borderRadius": "8px"
  }
}
```

---

## 6. API Endpoints (tRPC Procedures)

### 6.1 Template Management

#### `proposalTemplate.create`
**Input:**
```typescript
{
  name: string,
  slug: string,
  description?: string,
  elements: ElementSchema[]
}
```
**Returns:** `ProposalTemplate`
**Auth:** CD, SA

#### `proposalTemplate.update`
**Input:**
```typescript
{
  id: string,
  name?: string,
  description?: string,
  elements?: ElementSchema[],
  theme_config?: ThemeConfig
}
```
**Returns:** `ProposalTemplate`
**Auth:** CD, SA

#### `proposalTemplate.publish`
**Input:** `{ id: string }`
**Returns:** `{ publishedUrl: string }`
**Effect:** Sets `status = 'published'`, `published_at = NOW()`

#### `proposalTemplate.list`
**Input:**
```typescript
{
  status?: 'draft' | 'published' | 'archived',
  limit?: number,
  offset?: number
}
```
**Returns:** `ProposalTemplate[]`
**Auth:** CD, SA

#### `proposalTemplate.duplicate`
**Input:** `{ id: string, newName: string }`
**Returns:** `ProposalTemplate` (new copy)

#### `proposalTemplate.delete`
**Input:** `{ id: string }`
**Returns:** `void`
**Effect:** Soft delete (`status = 'archived'`)

---

### 6.2 Public Endpoints (No Auth)

#### `proposalTemplate.getBySlug`
**Input:** `{ slug: string }`
**Returns:** `ProposalTemplate` (only if `status = 'published'`)
**Used by:** Public proposal preview page

#### `proposalSubmission.create`
**Input:**
```typescript
{
  templateId: string,
  formData: Record<string, any>,
  contactName: string,
  contactEmail: string,
  contactPhone?: string
}
```
**Returns:** `ProposalSubmission`
**Effect:**
- Creates submission record
- Calculates pricing from form data
- Increments `template.submissions_count`
- Triggers notification to CD

---

### 6.3 Submission Management

#### `proposalSubmission.list`
**Input:**
```typescript
{
  status?: string,
  templateId?: string,
  limit?: number,
  offset?: number
}
```
**Returns:** `ProposalSubmission[]`
**Auth:** CD, SA

#### `proposalSubmission.getById`
**Input:** `{ id: string }`
**Returns:** `ProposalSubmission`

#### `proposalSubmission.approve`
**Input:** `{ id: string }`
**Returns:** `ProposalSubmission`
**Effect:** Sets `status = 'approved'`

#### `proposalSubmission.convertToClient`
**Input:**
```typescript
{
  submissionId: string,
  clientData: Partial<Client>,
  createEvent: boolean
}
```
**Returns:** `{ client: Client, event?: Event }`
**Effect:**
- Creates client from submission data
- Optionally creates event
- Sets `submission.status = 'converted'`
- Links via `submission.converted_to_client_id`

---

## 7. Builder UI Components

### 7.1 Element Palette (Left Sidebar)

**Location:** `/src/components/proposal-builder/ElementPalette.tsx`

**Structure:**
```tsx
<div className="element-palette">
  <div className="palette-search">
    <input placeholder="Search elements..." />
  </div>

  <div className="palette-categories">
    <div className="category">
      <h4>Content</h4>
      <ElementItem type="hero" icon="🎯" label="Hero Section" />
      <ElementItem type="rich_text" icon="📝" label="Rich Text" />
      <ElementItem type="image" icon="🖼️" label="Image" />
      <ElementItem type="video" icon="🎥" label="Video" />
    </div>

    <div className="category">
      <h4>Inputs</h4>
      <ElementItem type="number_input" icon="🔢" label="Number Input" />
      <ElementItem type="text_input" icon="✏️" label="Text Input" />
      <ElementItem type="textarea" icon="📄" label="Textarea" />
      <ElementItem type="date_picker" icon="📅" label="Date Picker" />
      <ElementItem type="dropdown" icon="▼" label="Dropdown" />
    </div>

    <div className="category">
      <h4>Selections</h4>
      <ElementItem type="service_toggles" icon="☑️" label="Service Toggles" />
      <ElementItem type="checkbox_group" icon="☐" label="Checkbox Group" />
      <ElementItem type="radio_group" icon="◉" label="Radio Group" />
    </div>

    <div className="category">
      <h4>Pricing</h4>
      <ElementItem type="pricing_tiers" icon="💰" label="Pricing Tiers" />
      <ElementItem type="package_tiers" icon="📦" label="Package Tiers" />
      <ElementItem type="pricing_summary" icon="🧾" label="Pricing Summary" />
    </div>

    <div className="category">
      <h4>Actions</h4>
      <ElementItem type="submit_button" icon="✉️" label="Submit Button" />
      <ElementItem type="divider" icon="—" label="Divider" />
    </div>
  </div>
</div>
```

**Drag Behavior:**
- Each `ElementItem` is draggable (HTML5 drag API)
- On drag start: Store element type in `dataTransfer`
- On drop in canvas: Create new element with default config

---

### 7.2 Canvas Area (Center)

**Location:** `/src/components/proposal-builder/Canvas.tsx`

**Structure:**
```tsx
<div className="canvas-area">
  <div className="canvas-header">
    <input
      className="template-name-input"
      value={templateName}
      onChange={handleNameChange}
      placeholder="Untitled Template"
    />
  </div>

  <div className="canvas-content" onDrop={handleDrop} onDragOver={handleDragOver}>
    {elements.length === 0 ? (
      <div className="empty-canvas">
        <p>Drag elements here to start building</p>
      </div>
    ) : (
      elements.map((element, index) => (
        <CanvasElement
          key={element.id}
          element={element}
          isSelected={selectedElementId === element.id}
          onSelect={() => setSelectedElementId(element.id)}
          onMoveUp={() => moveElement(index, 'up')}
          onMoveDown={() => moveElement(index, 'down')}
          onDelete={() => deleteElement(element.id)}
        />
      ))
    )}

    <button className="add-element-button" onClick={openPalette}>
      + Add Element
    </button>
  </div>

  <div className="canvas-footer">
    <Button variant="secondary" onClick={handleSaveDraft}>
      Save Draft
    </Button>
    <Button variant="primary" onClick={handlePublish}>
      Publish Template
    </Button>
  </div>
</div>
```

**Canvas Element Component:**
```tsx
<div className={cn("canvas-element", { selected: isSelected })} onClick={onSelect}>
  <div className="element-controls">
    <button onClick={onMoveUp}>↑</button>
    <button onClick={onMoveDown}>↓</button>
    <button onClick={() => onSelect()}>✎</button>
    <button onClick={onDelete}>✕</button>
  </div>

  <div className="element-label">{element.type.toUpperCase()}</div>

  <div className="element-preview">
    {renderPreview(element)}
  </div>
</div>
```

---

### 7.3 Settings Panel (Right Sidebar)

**Location:** `/src/components/proposal-builder/SettingsPanel.tsx`

**Dynamic based on selected element type:**

```tsx
{selectedElement ? (
  <div className="settings-panel">
    <h3>{selectedElement.type} Settings</h3>

    {/* Render type-specific settings */}
    {selectedElement.type === 'number_input' && (
      <NumberInputSettings
        element={selectedElement}
        onChange={handleSettingsChange}
      />
    )}

    {selectedElement.type === 'service_toggles' && (
      <ServiceTogglesSettings
        element={selectedElement}
        onChange={handleSettingsChange}
      />
    )}

    {/* ... more type-specific settings components ... */}

    <div className="settings-actions">
      <Button variant="danger" onClick={handleDeleteElement}>
        Delete Element
      </Button>
    </div>
  </div>
) : (
  <div className="settings-panel-empty">
    <p>Select an element to edit its settings</p>
  </div>
)}
```

**Example: NumberInputSettings Component:**
```tsx
function NumberInputSettings({ element, onChange }) {
  return (
    <>
      <div className="settings-group">
        <label>Label</label>
        <input
          type="text"
          value={element.config.label}
          onChange={(e) => onChange({ ...element.config, label: e.target.value })}
        />
      </div>

      <div className="settings-group">
        <label>Placeholder</label>
        <input
          type="text"
          value={element.config.placeholder}
          onChange={(e) => onChange({ ...element.config, placeholder: e.target.value })}
        />
      </div>

      <div className="settings-row">
        <div className="settings-group">
          <label>Min Value</label>
          <input
            type="number"
            value={element.config.min ?? ''}
            onChange={(e) => onChange({ ...element.config, min: Number(e.target.value) })}
          />
        </div>

        <div className="settings-group">
          <label>Max Value</label>
          <input
            type="number"
            value={element.config.max ?? ''}
            onChange={(e) => onChange({ ...element.config, max: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="settings-group">
        <label>Default Value</label>
        <input
          type="number"
          value={element.config.defaultValue ?? ''}
          onChange={(e) => onChange({ ...element.config, defaultValue: Number(e.target.value) })}
        />
      </div>

      <div className="settings-group">
        <label>
          <input
            type="checkbox"
            checked={element.config.required}
            onChange={(e) => onChange({ ...element.config, required: e.target.checked })}
          />
          Required field
        </label>
      </div>

      <div className="settings-group">
        <label>Pricing Variable Name</label>
        <input
          type="text"
          value={element.config.pricingVariable ?? ''}
          onChange={(e) => onChange({ ...element.config, pricingVariable: e.target.value })}
          placeholder="e.g., numDancers"
        />
        <p className="help-text">Use this name in pricing formulas</p>
      </div>
    </>
  );
}
```

---

## 8. Client-Facing Renderer

### 8.1 Public Preview Page

**Route:** `/proposals/preview/[slug]`
**Location:** `/src/app/proposals/preview/[slug]/page.tsx`

**Functionality:**
1. Fetch template by slug (public endpoint)
2. Render elements in order
3. Handle form state (React Hook Form)
4. Calculate pricing in real-time
5. Submit form data

**Structure:**
```tsx
export default function ProposalPreviewPage({ params }: { params: { slug: string } }) {
  const { data: template } = api.proposalTemplate.getBySlug.useQuery({ slug: params.slug });
  const submitProposal = api.proposalSubmission.create.useMutation();

  const { register, handleSubmit, watch } = useForm();
  const formValues = watch();

  // Real-time pricing calculation
  const calculatedTotal = useMemo(() => {
    return calculatePricing(template?.elements || [], formValues);
  }, [template, formValues]);

  const onSubmit = async (data: any) => {
    await submitProposal.mutateAsync({
      templateId: template!.id,
      formData: data,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
    });
  };

  return (
    <div className="proposal-preview">
      <form onSubmit={handleSubmit(onSubmit)}>
        {template?.elements.map((element) => (
          <ElementRenderer
            key={element.id}
            element={element}
            register={register}
            formValues={formValues}
          />
        ))}
      </form>
    </div>
  );
}
```

### 8.2 Element Renderer Component

**Location:** `/src/components/proposal-builder/ElementRenderer.tsx`

**Functionality:** Renders correct UI component based on element type

```tsx
export function ElementRenderer({ element, register, formValues }) {
  switch (element.type) {
    case 'hero':
      return (
        <div className="hero-section" style={{
          backgroundColor: element.config.backgroundColor,
          color: element.config.textColor,
          textAlign: element.config.textAlign
        }}>
          <h1>{element.config.title}</h1>
          <p>{element.config.subtitle}</p>
        </div>
      );

    case 'number_input':
      return (
        <div className="form-group">
          <label>{element.config.label}</label>
          <input
            type="number"
            {...register(element.config.pricingVariable || element.id)}
            placeholder={element.config.placeholder}
            min={element.config.min}
            max={element.config.max}
            defaultValue={element.config.defaultValue}
            required={element.config.required}
          />
          {element.config.helpText && <p className="help-text">{element.config.helpText}</p>}
        </div>
      );

    case 'service_toggles':
      return (
        <div className="service-toggles">
          <h3>{element.config.label}</h3>
          <div className={cn("services-grid", element.config.layout)}>
            {element.config.services.map((service) => (
              <label key={service.id} className="service-card">
                <input
                  type="checkbox"
                  {...register(`services.${service.id}`)}
                  defaultChecked={service.defaultEnabled}
                />
                <div className="service-content">
                  {service.icon && <span className="service-icon">{service.icon}</span>}
                  <h4>{service.name}</h4>
                  <p>{service.description}</p>
                  <p className="service-price">${service.basePrice.toLocaleString()}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      );

    case 'pricing_summary':
      return (
        <div className={cn("pricing-summary", { sticky: element.config.position === 'sticky' })}>
          <h3>{element.config.label}</h3>
          {element.config.showBreakdown && (
            <div className="pricing-breakdown">
              {/* Calculate and show line items */}
            </div>
          )}
          <div className="pricing-total">
            <span>Total:</span>
            <span>{element.config.currencySymbol}{calculatedTotal.toLocaleString()}</span>
          </div>
        </div>
      );

    case 'submit_button':
      return (
        <Button
          type="submit"
          variant={element.config.variant}
          size={element.config.size}
          fullWidth={element.config.fullWidth}
        >
          {element.config.label}
        </Button>
      );

    // ... more element types ...

    default:
      return null;
  }
}
```

---

## 9. Pricing Calculation Engine

### 9.1 Core Function

**Location:** `/src/lib/proposal-pricing.ts`

```typescript
export interface PricingResult {
  subtotal: number;
  lineItems: Array<{
    label: string;
    quantity?: number;
    unitPrice?: number;
    total: number;
  }>;
  taxAmount?: number;
  discountAmount?: number;
  total: number;
}

export function calculatePricing(
  elements: ElementSchema[],
  formValues: Record<string, any>
): PricingResult {
  const lineItems: PricingResult['lineItems'] = [];
  let subtotal = 0;

  // 1. Process number inputs with pricing tiers
  elements.forEach((element) => {
    if (element.type === 'number_input' && element.config.pricingVariable) {
      const quantity = formValues[element.config.pricingVariable];

      // Find associated pricing_tiers element
      const tierElement = elements.find(
        (el) => el.type === 'pricing_tiers' && el.config.basedOn === element.config.pricingVariable
      );

      if (tierElement && quantity) {
        const tier = findMatchingTier(tierElement.config.tiers, quantity);
        if (tier) {
          const total = quantity * tier.pricePerUnit;
          lineItems.push({
            label: element.config.label,
            quantity,
            unitPrice: tier.pricePerUnit,
            total,
          });
          subtotal += total;
        }
      }
    }

    // 2. Process service toggles
    if (element.type === 'service_toggles') {
      element.config.services.forEach((service) => {
        if (formValues.services?.[service.id]) {
          lineItems.push({
            label: service.name,
            total: service.basePrice,
          });
          subtotal += service.basePrice;
        }
      });
    }

    // 3. Process dropdown/radio with price modifiers
    if (element.type === 'dropdown' || element.type === 'radio_group') {
      const selectedValue = formValues[element.id];
      const selectedOption = element.config.options.find((opt) => opt.value === selectedValue);
      if (selectedOption?.priceModifier) {
        lineItems.push({
          label: `${element.config.label}: ${selectedOption.label}`,
          total: selectedOption.priceModifier,
        });
        subtotal += selectedOption.priceModifier;
      }
    }

    // 4. Process package tiers
    if (element.type === 'package_tiers') {
      element.config.packages.forEach((pkg) => {
        if (formValues[`package.${pkg.id}`]) {
          lineItems.push({
            label: pkg.name,
            total: pkg.price,
          });
          subtotal += pkg.price;
        }
      });
    }
  });

  // 5. Calculate tax
  const pricingSummary = elements.find((el) => el.type === 'pricing_summary');
  let taxAmount = 0;
  if (pricingSummary?.config.showTax && pricingSummary.config.taxRate) {
    taxAmount = subtotal * pricingSummary.config.taxRate;
  }

  const total = subtotal + taxAmount;

  return {
    subtotal,
    lineItems,
    taxAmount,
    total,
  };
}

function findMatchingTier(tiers: any[], quantity: number) {
  return tiers.find(
    (tier) => quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty)
  );
}
```

---

## 10. Implementation Phases

### Phase 1: Core Builder (Week 1)
**Goal:** Functional drag-and-drop builder with basic elements

**Tasks:**
1. ✅ Create database schema (ProposalTemplate, ProposalSubmission tables)
2. ✅ Migration: `create_proposal_builder_tables.sql`
3. ✅ Create tRPC router: `proposalTemplate.ts`
4. ✅ Build Element Palette component (left sidebar)
5. ✅ Build Canvas component (center area)
6. ✅ Build Settings Panel component (right sidebar)
7. ✅ Implement drag-and-drop (HTML5 Drag API)
8. ✅ Implement element ordering (move up/down)
9. ✅ Implement 5 basic elements:
   - Hero Section
   - Number Input
   - Service Toggles
   - Pricing Summary
   - Submit Button
10. ✅ Template save/load functionality
11. ✅ Basic canvas preview rendering

**Success Criteria:**
- Can drag elements to canvas
- Can reorder elements
- Can configure basic settings
- Can save template as draft
- Elements render in canvas preview

---

### Phase 2: Client-Facing Renderer (Week 2)
**Goal:** Public proposal pages with working forms

**Tasks:**
1. ✅ Create public route: `/proposals/preview/[slug]`
2. ✅ Build ElementRenderer component
3. ✅ Implement form state management (React Hook Form)
4. ✅ Implement pricing calculation engine
5. ✅ Real-time pricing updates
6. ✅ Form validation
7. ✅ Submission handling (create ProposalSubmission record)
8. ✅ Success/error states
9. ✅ Mobile responsive design
10. ✅ Publish workflow (draft → published)

**Success Criteria:**
- Published template accessible at unique URL
- Form fields render correctly
- Pricing calculates in real-time
- Submission creates database record
- Mobile-friendly layout

---

### Phase 3: Advanced Elements (Week 3)
**Goal:** Complete all 17 element types

**Tasks:**
1. ✅ Implement remaining 12 element types:
   - Rich Text Block
   - Image
   - Video Embed
   - Text Input
   - Textarea
   - Date Picker
   - Dropdown Select
   - Checkbox Group
   - Radio Group
   - Pricing Tiers
   - Package Tiers
   - Divider
2. ✅ Settings panels for each type
3. ✅ Renderers for each type
4. ✅ Element validation logic
5. ✅ Complex pricing scenarios (conditional, volume discounts)

**Success Criteria:**
- All 17 elements draggable and configurable
- All elements render correctly in preview
- Complex pricing models work
- Validation catches configuration errors

---

### Phase 4: Polish & Workflows (Week 4)
**Goal:** Production-ready with full workflow integration

**Tasks:**
1. ✅ Template duplication
2. ✅ Template analytics (views, submissions, conversion rate)
3. ✅ Submission list page (for CDs)
4. ✅ Submission detail modal
5. ✅ Convert submission to client workflow
6. ✅ Email notifications on submission
7. ✅ Template versioning
8. ✅ Theming system (custom colors, fonts)
9. ✅ Preview mode (see form as client would)
10. ✅ Export template as JSON (backup)
11. ✅ Import template from JSON
12. ✅ Element search in palette
13. ✅ Keyboard shortcuts (delete, duplicate, reorder)

**Success Criteria:**
- CDs can manage submissions
- One-click convert to client + event
- Template reusability (duplicate + edit)
- Analytics tracking working
- Professional UI/UX

---

## 11. Design System

### 11.1 StreamStage CSS Variables (from mockup)
```css
:root {
  /* Colors */
  --color-bg-dark: #1a1a1a;
  --color-bg-medium: #2a2a2a;
  --color-bg-light: #333333;
  --color-border: #404040;
  --color-text-primary: #ffffff;
  --color-text-secondary: #888888;
  --color-accent: #3b82f6;
  --color-accent-hover: #2563eb;
  --color-success: #10b981;
  --color-danger: #ef4444;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Typography */
  --font-family: 'Inter', -apple-system, sans-serif;
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 20px;
  --font-size-xxl: 24px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### 11.2 Component Styles

**Element Palette:**
```css
.element-palette {
  width: 240px;
  background: var(--color-bg-medium);
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
  padding: var(--spacing-md);
}

.element-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
  background: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: move;
  transition: all 0.2s;
}

.element-item:hover {
  background: var(--color-bg-dark);
  border-color: var(--color-accent);
}
```

**Canvas:**
```css
.canvas-area {
  flex: 1;
  background: var(--color-bg-dark);
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.canvas-element {
  position: relative;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-medium);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  transition: border-color 0.2s;
}

.canvas-element.selected {
  border-color: var(--color-accent);
}

.element-controls {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  gap: var(--spacing-xs);
  opacity: 0;
  transition: opacity 0.2s;
}

.canvas-element:hover .element-controls {
  opacity: 1;
}
```

**Settings Panel:**
```css
.settings-panel {
  width: 320px;
  background: var(--color-bg-medium);
  border-left: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.settings-group {
  margin-bottom: var(--spacing-md);
}

.settings-group label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.settings-group input[type="text"],
.settings-group input[type="number"],
.settings-group textarea,
.settings-group select {
  width: 100%;
  padding: var(--spacing-sm);
  background: var(--color-bg-dark);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
}
```

---

## 12. Testing Requirements

### 12.1 Unit Tests
- Element config validation
- Pricing calculation logic
- JSONB serialization/deserialization
- Form validation rules

### 12.2 Integration Tests
- Drag-and-drop workflow
- Template save/load
- Publish workflow
- Submission creation
- Convert to client workflow

### 12.3 E2E Tests (Playwright)
```typescript
test('TC-PROPOSAL-001: Create template with basic elements', async ({ page }) => {
  await page.goto('/files?tab=proposals');
  await page.click('text=Create Template');

  // Drag hero element
  await page.dragAndDrop('[data-element="hero"]', '.canvas-area');

  // Configure hero settings
  await page.fill('[name="title"]', 'Test Proposal');

  // Save template
  await page.click('text=Save Draft');

  expect(await page.textContent('.success-message')).toContain('Template saved');
});

test('TC-PROPOSAL-002: Client submits proposal', async ({ page }) => {
  await page.goto('/proposals/preview/test-template');

  // Fill form
  await page.fill('[name="numDancers"]', '75');
  await page.check('[name="services.highlight"]');

  // Verify pricing calculation
  const total = await page.textContent('.pricing-total');
  expect(total).toContain('$1,700'); // 75 * $12 + $800

  // Submit
  await page.fill('[name="contactEmail"]', 'test@example.com');
  await page.click('text=Request This Proposal');

  expect(await page.textContent('.success-message')).toContain('Thank you');
});
```

---

## 13. Success Metrics

### 13.1 Builder Performance
- Template creation time: < 5 minutes
- Element drag responsiveness: < 100ms
- Auto-save frequency: Every 30 seconds
- Canvas render time: < 500ms for 20 elements

### 13.2 Client-Facing Performance
- Page load time: < 2 seconds
- Pricing calculation: < 50ms
- Form submission: < 1 second
- Mobile-friendly: 100% responsive

### 13.3 Business Metrics
- Template reuse rate: > 50%
- Submission conversion rate: Track in analytics
- Average proposal value: Track per template
- Time saved vs. manual proposals: > 80%

---

## 14. Future Enhancements (Post-MVP)

### 14.1 Advanced Features
- Conditional logic (show element if another element has value)
- Multi-page proposals (wizard-style)
- File upload element (clients upload event flyers, etc.)
- Signature pad element (digital signatures)
- Payment integration (Stripe checkout in proposal)
- Recurring proposal templates (subscription-based)

### 14.2 Collaboration
- Team comments on submissions
- Approval workflow (multiple reviewers)
- Version history with rollback
- Template sharing between tenants (marketplace)

### 14.3 Analytics Dashboard
- Conversion funnel (views → submissions → clients)
- Drop-off points in forms
- A/B testing for templates
- Revenue attribution by template

---

**End of Specification**
