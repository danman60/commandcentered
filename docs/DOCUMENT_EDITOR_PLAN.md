# Document Editor & AI Content Generation Plan

**Status:** Planning Phase
**Created:** November 24, 2025
**Priority:** HIGH - Professional document editing in-app

---

## Overview

Add in-app document editing capabilities with AI-assisted content generation. This transforms the Files section from file storage into a full document management + editing system.

---

## Phase 5: In-App Document Editor with AI

### 5.1 Rich Text Editor Integration

**Technology Choice: Tiptap + React**

Why Tiptap:
- Built on ProseMirror (robust, extensible)
- React components
- Markdown support
- Collaborative editing ready
- Extension system
- Modern, maintained

**Installation:**
```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
npm install @tiptap/extension-placeholder
npm install @tiptap/extension-character-count
npm install @tiptap/extension-table
npm install @tiptap/extension-image
npm install @tiptap/extension-link
```

**Basic Implementation:**
```typescript
// DocumentEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

interface DocumentEditorProps {
  content: string;
  onSave: (content: string) => Promise<void>;
  placeholder?: string;
  editable?: boolean;
}

export function DocumentEditor({
  content,
  onSave,
  placeholder = 'Start writing...',
  editable = true,
}: DocumentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      // Autosave after 2 seconds of inactivity
      clearTimeout(autosaveTimeout);
      autosaveTimeout = setTimeout(() => {
        onSave(editor.getHTML());
      }, 2000);
    },
  });

  return (
    <div className="document-editor">
      {editor && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} className="prose max-w-none" />
      {editor && (
        <div className="mt-2 text-xs text-slate-400">
          {editor.storage.characterCount.characters()} characters
        </div>
      )}
    </div>
  );
}
```

**Toolbar Component:**
```typescript
// EditorToolbar.tsx
interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div className="editor-toolbar flex items-center gap-1 p-2 border-b border-slate-700 bg-slate-800 rounded-t-lg">
      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        icon={<Bold className="w-4 h-4" />}
        title="Bold"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        icon={<Italic className="w-4 h-4" />}
        title="Italic"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        icon={<Underline className="w-4 h-4" />}
        title="Underline"
      />

      <ToolbarSeparator />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        text="H1"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        text="H2"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        text="H3"
      />

      <ToolbarSeparator />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        icon={<List className="w-4 h-4" />}
        title="Bullet List"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        icon={<ListOrdered className="w-4 h-4" />}
        title="Numbered List"
      />

      <ToolbarSeparator />

      {/* Insert */}
      <ToolbarButton
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
        icon={<Table className="w-4 h-4" />}
        title="Insert Table"
      />
      <ToolbarButton
        onClick={() => {
          const url = window.prompt('Enter image URL');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        icon={<Image className="w-4 h-4" />}
        title="Insert Image"
      />
      <ToolbarButton
        onClick={() => {
          const url = window.prompt('Enter link URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        icon={<Link className="w-4 h-4" />}
        title="Insert Link"
      />

      <ToolbarSeparator />

      {/* AI Assist */}
      <ToolbarButton
        onClick={() => {/* AI generation */}}
        icon={<Sparkles className="w-4 h-4" />}
        title="AI Assist"
        className="bg-green-500/20 hover:bg-green-500/30"
      />
    </div>
  );
}
```

### 5.2 Persistent Fields / Template System

**Use Case:** Proposals, Contracts, Invoices with merge fields

**Implementation:**
```typescript
// Template with merge fields
interface DocumentTemplate {
  id: string;
  name: string;
  category: 'proposal' | 'contract' | 'invoice' | 'email' | 'custom';
  content: string; // HTML with merge fields like {{client_name}}
  fields: TemplateField[];
}

interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  defaultValue?: string;
  options?: string[]; // For select type
}

// Example: Proposal template
const proposalTemplate: DocumentTemplate = {
  id: 'proposal-default',
  name: 'Standard Event Proposal',
  category: 'proposal',
  content: `
    <h1>Event Production Proposal</h1>
    <p>Prepared for: <strong>{{client_name}}</strong></p>
    <p>Date: {{current_date}}</p>

    <h2>Event Details</h2>
    <p>Event Name: {{event_name}}</p>
    <p>Event Date: {{event_date}}</p>
    <p>Location: {{event_location}}</p>

    <h2>Services Proposed</h2>
    {{services_list}}

    <h2>Pricing</h2>
    <table>
      <tr>
        <td>Subtotal:</td>
        <td>{{subtotal}}</td>
      </tr>
      <tr>
        <td>Tax ({{tax_rate}}%):</td>
        <td>{{tax_amount}}</td>
      </tr>
      <tr>
        <td><strong>Total:</strong></td>
        <td><strong>{{total_amount}}</strong></td>
      </tr>
    </table>

    <h2>Terms & Conditions</h2>
    {{terms_content}}
  `,
  fields: [
    { key: 'client_name', label: 'Client Name', type: 'text', required: true },
    { key: 'event_name', label: 'Event Name', type: 'text', required: true },
    { key: 'event_date', label: 'Event Date', type: 'date', required: true },
    { key: 'event_location', label: 'Location', type: 'text', required: true },
    { key: 'services_list', label: 'Services', type: 'textarea', required: true },
    { key: 'subtotal', label: 'Subtotal', type: 'number', required: true },
    { key: 'tax_rate', label: 'Tax Rate', type: 'number', required: true, defaultValue: '13' },
  ],
};

// Render template with data
function renderTemplate(template: DocumentTemplate, data: Record<string, any>): string {
  let rendered = template.content;

  // Replace merge fields
  template.fields.forEach((field) => {
    const value = data[field.key] || field.defaultValue || '';
    rendered = rendered.replace(new RegExp(`{{${field.key}}}`, 'g'), String(value));
  });

  // Auto-calculate fields
  if (data.subtotal && data.tax_rate) {
    const taxAmount = (data.subtotal * data.tax_rate) / 100;
    const total = data.subtotal + taxAmount;
    rendered = rendered.replace('{{tax_amount}}', `$${taxAmount.toFixed(2)}`);
    rendered = rendered.replace('{{total_amount}}', `$${total.toFixed(2)}`);
  }

  // Current date
  rendered = rendered.replace('{{current_date}}', new Date().toLocaleDateString());

  return rendered;
}

// Template editor UI
export function TemplateEditor({ template }: { template: DocumentTemplate }) {
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const rendered = renderTemplate(template, fieldValues);
    setPreview(rendered);
  }, [fieldValues, template]);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left: Field inputs */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Fill Template Fields</h3>
        {template.fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={fieldValues[field.key] || ''}
                onChange={(e) => setFieldValues({ ...fieldValues, [field.key]: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded"
                rows={4}
              />
            ) : field.type === 'select' && field.options ? (
              <select
                value={fieldValues[field.key] || ''}
                onChange={(e) => setFieldValues({ ...fieldValues, [field.key]: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded"
              >
                <option value="">Select...</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={fieldValues[field.key] || ''}
                onChange={(e) => setFieldValues({ ...fieldValues, [field.key]: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded"
              />
            )}
          </div>
        ))}
      </div>

      {/* Right: Live preview */}
      <div>
        <h3 className="text-xl font-bold mb-4">Preview</h3>
        <div
          className="prose prose-invert max-w-none bg-white text-black p-8 rounded shadow-lg"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      </div>
    </div>
  );
}
```

### 5.3 AI Content Generation & Editing

**Integration: OpenAI GPT-4 for document assistance**

**Features:**
1. Generate full documents from prompts
2. Improve/rewrite selected text
3. Expand/shorten content
4. Change tone (professional, casual, formal)
5. Fix grammar/spelling
6. Translate content

**Implementation:**
```typescript
// AIDocumentAssistant.ts
export class AIDocumentAssistant {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate full document from prompt
   */
  async generateDocument(params: {
    type: 'proposal' | 'contract' | 'email' | 'invoice';
    context: {
      clientName?: string;
      eventName?: string;
      eventDate?: string;
      services?: string[];
      amount?: number;
    };
    instructions?: string;
  }): Promise<string> {
    const systemPrompt = this.getSystemPrompt(params.type);
    const userPrompt = this.buildGenerationPrompt(params);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || '';
  }

  /**
   * Improve/rewrite selected text
   */
  async improveText(params: {
    text: string;
    instruction: 'improve' | 'professional' | 'casual' | 'formal' | 'expand' | 'shorten';
  }): Promise<string> {
    const instructions = {
      improve: 'Improve this text by making it clearer, more concise, and more professional.',
      professional: 'Rewrite this text in a more professional tone.',
      casual: 'Rewrite this text in a more casual, friendly tone.',
      formal: 'Rewrite this text in a more formal, business-appropriate tone.',
      expand: 'Expand this text with more details and context while maintaining the core message.',
      shorten: 'Shorten this text while keeping the key points and message.',
    };

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional writing assistant. Provide only the rewritten text without explanations.',
        },
        {
          role: 'user',
          content: `${instructions[params.instruction]}\n\nText to rewrite:\n${params.text}`,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || '';
  }

  /**
   * Fix grammar and spelling
   */
  async fixGrammar(text: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Fix grammar and spelling errors. Return only the corrected text without explanations.',
        },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
    });

    return completion.choices[0].message.content || '';
  }

  /**
   * Generate specific sections
   */
  async generateSection(params: {
    sectionType: 'executive_summary' | 'terms' | 'services' | 'pricing' | 'bio';
    context: Record<string, any>;
  }): Promise<string> {
    const prompts = {
      executive_summary: 'Generate a professional executive summary for a proposal',
      terms: 'Generate standard terms and conditions for an event production contract',
      services: 'Generate a detailed services section describing event production services',
      pricing: 'Generate a pricing breakdown with line items',
      bio: 'Generate a professional company bio',
    };

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional business writer specializing in event production.',
        },
        {
          role: 'user',
          content: `${prompts[params.sectionType]}\n\nContext: ${JSON.stringify(params.context, null, 2)}`,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || '';
  }

  private getSystemPrompt(type: string): string {
    const prompts = {
      proposal: 'You are a professional proposal writer for event production companies. Create compelling, professional proposals.',
      contract: 'You are a legal contract writer. Create clear, professional contracts for event production services.',
      email: 'You are a professional business communicator. Write clear, friendly emails.',
      invoice: 'You are a professional accountant. Create clear, accurate invoices.',
    };

    return prompts[type] || prompts.email;
  }

  private buildGenerationPrompt(params: any): string {
    return `Generate a ${params.type} with the following details:

Client: ${params.context.clientName}
Event: ${params.context.eventName}
Date: ${params.context.eventDate}
Services: ${params.context.services?.join(', ')}
Amount: $${params.context.amount}

Additional instructions: ${params.instructions || 'None'}`;
  }
}
```

**UI for AI Assistance:**
```typescript
// AIAssistMenu.tsx
interface AIAssistMenuProps {
  editor: Editor;
  selectedText: string;
}

export function AIAssistMenu({ editor, selectedText }: AIAssistMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const aiAssistant = new AIDocumentAssistant();

  const handleImprove = async (instruction: 'improve' | 'professional' | 'casual') => {
    const improved = await aiAssistant.improveText({
      text: selectedText,
      instruction,
    });

    editor.chain().focus().deleteSelection().insertContent(improved).run();
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded hover:bg-green-500/20 transition-colors">
          <Sparkles className="w-4 h-4 text-green-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>AI Assist</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {selectedText ? (
          <>
            <DropdownMenuItem onClick={() => handleImprove('improve')}>
              <Wand2 className="w-4 h-4 mr-2" />
              Improve Writing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleImprove('professional')}>
              <Briefcase className="w-4 h-4 mr-2" />
              Make Professional
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleImprove('casual')}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Make Casual
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => {
              const fixed = await aiAssistant.fixGrammar(selectedText);
              editor.chain().focus().deleteSelection().insertContent(fixed).run();
            }}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Fix Grammar
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => {/* Show generation modal */}}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Full Document
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {/* Show section generator */}}>
              <List className="w-4 h-4 mr-2" />
              Generate Section
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 5.4 Copy/Paste with Rich Formatting

**Built-in with Tiptap:**
- Copy from Word → Preserves formatting
- Copy from Google Docs → Preserves formatting
- Paste images → Auto-upload to Supabase Storage
- Paste tables → Renders as HTML tables

**Custom paste handling:**
```typescript
// Custom paste handler
editor.configure({
  extensions: [
    StarterKit,
    Image.extend({
      addProseMirrorPlugins() {
        return [
          new Plugin({
            key: new PluginKey('imagePaste'),
            props: {
              handlePaste(view, event) {
                const items = Array.from(event.clipboardData?.items || []);

                items.forEach(async (item) => {
                  if (item.type.indexOf('image') === 0) {
                    event.preventDefault();

                    const file = item.getAsFile();
                    if (!file) return;

                    // Upload to Supabase Storage
                    const url = await uploadImageToStorage(file);

                    // Insert into editor
                    view.dispatch(
                      view.state.tr.replaceSelectionWith(
                        view.state.schema.nodes.image.create({ src: url })
                      )
                    );
                  }
                });

                return false;
              },
            },
          }),
        ];
      },
    }),
  ],
});
```

### 5.5 Autosave & Version History

**Autosave Implementation:**
```typescript
// useAutosave.ts
export function useAutosave(
  editor: Editor,
  onSave: (content: string) => Promise<void>,
  debounceMs = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          await onSave(editor.getHTML());
          setLastSaved(new Date());
        } catch (error) {
          console.error('Autosave failed:', error);
        } finally {
          setIsSaving(false);
        }
      }, debounceMs);
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      clearTimeout(timeoutRef.current);
    };
  }, [editor, onSave, debounceMs]);

  return { isSaving, lastSaved };
}

// Usage
const { isSaving, lastSaved } = useAutosave(editor, async (content) => {
  await updateDocument.mutateAsync({ id: documentId, content });
});

// Show autosave status
<div className="text-xs text-slate-400">
  {isSaving ? (
    <span className="flex items-center gap-1">
      <Loader2 className="w-3 h-3 animate-spin" />
      Saving...
    </span>
  ) : lastSaved ? (
    `Last saved at ${lastSaved.toLocaleTimeString()}`
  ) : (
    'No changes'
  )}
</div>
```

### 5.6 Database Schema Additions

**New table: Documents**
```prisma
model Document {
  id              String    @id @default(uuid())
  tenantId        String    @map("tenant_id")
  title           String
  content         String    @db.Text // HTML content
  contentJson     Json?     @map("content_json") @db.JsonB // Tiptap JSON for better editing
  category        String    @default("document") // 'proposal', 'contract', 'email', 'invoice', 'custom'
  templateId      String?   @map("template_id") // If created from template
  eventId         String?   @map("event_id")
  clientId        String?   @map("client_id")
  leadId          String?   @map("lead_id")
  fileId          String?   @map("file_id") // Link to File if saved as file
  createdById     String    @map("created_by_id")
  lastEditedById  String    @map("last_edited_by_id")
  lastEditedAt    DateTime  @default(now()) @map("last_edited_at")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  template        DocumentTemplate? @relation(fields: [templateId], references: [id])
  event           Event?    @relation(fields: [eventId], references: [id])
  client          Client?   @relation(fields: [clientId], references: [id])
  lead            Lead?     @relation(fields: [leadId], references: [id])
  file            File?     @relation(fields: [fileId], references: [id])
  createdBy       User      @relation("DocumentCreator", fields: [createdById], references: [id])
  lastEditedBy    User      @relation("DocumentEditor", fields: [lastEditedById], references: [id])
  versions        DocumentVersion[]

  @@map("documents")
}

model DocumentVersion {
  id              String    @id @default(uuid())
  documentId      String    @map("document_id")
  versionNumber   Int       @map("version_number")
  content         String    @db.Text
  contentJson     Json?     @map("content_json") @db.JsonB
  createdById     String    @map("created_by_id")
  createdAt       DateTime  @default(now()) @map("created_at")

  document        Document  @relation(fields: [documentId], references: [id], onDelete: Cascade)
  createdBy       User      @relation(fields: [createdById], references: [id])

  @@map("document_versions")
}

model DocumentTemplate {
  id              String    @id @default(uuid())
  tenantId        String    @map("tenant_id")
  name            String
  category        String
  content         String    @db.Text
  contentJson     Json?     @map("content_json") @db.JsonB
  fields          Json      @db.JsonB // Array of TemplateField
  isSystem        Boolean   @default(false) @map("is_system") // Built-in vs custom
  isActive        Boolean   @default(true) @map("is_active")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  documents       Document[]

  @@map("document_templates")
}
```

---

## User Workflows

### Workflow 1: Create Proposal from Template
1. Files page → "New Document" button → "From Template"
2. Select "Event Proposal" template
3. Fill in fields (client, event, services, pricing)
4. Live preview updates as fields filled
5. Click "Generate" → AI fills in descriptions
6. Edit in rich text editor
7. Autosave every 2 seconds
8. Export as PDF or send via email

### Workflow 2: Edit Existing Document
1. Files page → Click document name
2. Opens in document editor
3. Make changes
4. AI Assist: Select text → "Improve Writing"
5. Autosave
6. Version history accessible via dropdown
7. Save as new version manually if major changes

### Workflow 3: Generate Contract from Scratch
1. Files page → "New Document" → "AI Generate"
2. Select "Contract" type
3. Fill in context (client, event, services)
4. AI generates full contract
5. Review and edit in rich text editor
6. Add custom clauses
7. Save and attach to event

### Workflow 4: Copy Text from External Source
1. Open document in editor
2. Copy formatted text from Word/Google Docs
3. Paste into editor → Formatting preserved
4. Images auto-upload to Supabase Storage
5. Adjust formatting with toolbar
6. Save

---

## Implementation Timeline

### Week 5: Document Editor Foundation
- Day 1-2: Install Tiptap, basic editor component
- Day 3-4: Toolbar with formatting options
- Day 5: Autosave implementation

### Week 6: Template System
- Day 1-2: Template schema + CRUD
- Day 3-4: Template editor UI with merge fields
- Day 5: Live preview rendering

### Week 7: AI Integration
- Day 1-2: OpenAI integration
- Day 3-4: AI assist menu + generation
- Day 5: Improve/rewrite functionality

### Week 8: Polish & Export
- Day 1-2: Version history UI
- Day 3-4: Export to PDF
- Day 5: Email integration (send document via email)

---

## Success Criteria

### Document Editor Complete When:
✅ Rich text editing works (bold, italic, headings, lists)
✅ Images paste from clipboard and auto-upload
✅ Tables can be inserted and edited
✅ Autosave every 2 seconds
✅ Character count shown
✅ Links can be inserted

### Template System Complete When:
✅ Templates can be created and edited
✅ Merge fields work ({{client_name}})
✅ Live preview updates as fields filled
✅ Templates can be saved and reused
✅ System templates provided (proposal, contract, invoice)

### AI Integration Complete When:
✅ Generate full document from prompt
✅ Improve/rewrite selected text
✅ Change tone (professional, casual, formal)
✅ Fix grammar and spelling
✅ Generate specific sections
✅ Context aware (knows client, event, services)

---

## Technical Considerations

### Performance
- Large documents (10,000+ words) → Use virtualization
- Autosave → Debounce to avoid excessive API calls
- AI generation → Show loading state, allow cancellation

### Security
- Tenant isolation on documents (tenant_id filter)
- Version history accessible only to document creator + admins
- Templates can be system-wide or tenant-specific

### User Experience
- Keyboard shortcuts (Ctrl+B for bold, etc.)
- Undo/redo history
- Focus mode (distraction-free writing)
- Word count/character count
- Reading time estimate

---

## Notes

- Tiptap is production-ready and actively maintained
- OpenAI GPT-4 for best quality AI generation
- Version history critical for document editing
- Export to PDF using jsPDF or Puppeteer
- Email integration reuses existing Mailgun setup

---

**Status:** Phase 5 planned, ready for implementation after Phases 1-4
