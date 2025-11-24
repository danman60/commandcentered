# Comprehensive Inline Editing & File Management Implementation Plan

**Status:** Planning Phase
**Created:** November 23, 2025
**Scope:** Files Management (All Phases) + Inline Editing System-Wide

---

## Overview

This plan addresses two major enhancement areas:
1. **Full-Featured File Management** (Files page - 4 phases)
2. **System-Wide Inline Editing** (Pipeline, Deliverables, and all tables)

Both are critical spec requirements from `BOOTSTRAPBUILD/00_MASTER_SPECIFICATION.md`.

---

## Part 1: Files Management (All 4 Phases)

### Phase 1: Core File Actions (WEEK 1)

#### 1.1 File Actions Menu
**Goal:** Connect existing backend CRUD to UI

**Implementation:**
```typescript
// FileActionsMenu.tsx
interface FileActionsMenuProps {
  file: File;
  onDownload: (file: File) => void;
  onRename: (file: File) => void;
  onDelete: (file: File) => void;
  onEditMetadata: (file: File) => void;
}

export function FileActionsMenu({ file, ...actions }: FileActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className="p-2 hover:bg-slate-700/50 rounded">
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => actions.onDownload(file)}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => actions.onRename(file)}>
          <Edit className="w-4 h-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => actions.onEditMetadata(file)}>
          <FileText className="w-4 h-4 mr-2" />
          Edit Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => actions.onDelete(file)}
          className="text-red-500"
        >
          <Trash className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**Actions to implement:**
- [x] Download → Open Supabase Storage URL in new tab
- [x] Rename → Modal with input field, calls `file.update` mutation
- [x] Delete → Confirmation modal, calls `file.delete` mutation
- [x] Edit metadata → Modal with description + category fields, calls `file.update`

#### 1.2 File Details Modal
**Opens when:** Click file name in table

**Modal structure:**
```typescript
interface FileDetailsModalProps {
  file: File;
  isOpen: boolean;
  onClose: () => void;
}

// Modal sections:
// 1. File preview (images, PDFs via iframe)
// 2. Metadata display (name, size, type, uploaded by, date)
// 3. Associations (event, client, lead)
// 4. Editable description field
// 5. Editable category dropdown
// 6. Action buttons (Download, Rename, Delete)
```

**Features:**
- Image preview for image files
- PDF preview via `<iframe src={filePath}>`
- Video/audio player for media files
- Metadata displayed in clean grid
- Inline edit for description (click to edit, blur to save)
- Category dropdown with live update
- Associated event/client/lead shown with navigation links

#### 1.3 Bulk Operations
**Selection UI:**
```typescript
// Checkbox column added to files table
const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

// Bulk actions bar (appears when files selected)
{selectedFiles.length > 0 && (
  <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-lg px-6 py-3 shadow-lg flex items-center gap-4">
    <span className="text-slate-300">{selectedFiles.length} files selected</span>
    <Button variant="secondary" onClick={handleSelectAll}>
      Select All
    </Button>
    <Button variant="secondary" onClick={handleDeselectAll}>
      Deselect All
    </Button>
    <Button variant="danger" onClick={handleBulkDelete}>
      Delete Selected
    </Button>
  </div>
)}
```

**Features:**
- Checkbox in each file row
- "Select all" checkbox in header
- Bulk delete with confirmation ("Delete 5 files?")
- Bulk move to category
- Selection count indicator
- Clear selection button

**Success Criteria:**
- ✅ Download opens file in new tab
- ✅ Rename updates filename in database
- ✅ Delete removes file from Supabase Storage + database
- ✅ Edit metadata saves description and category
- ✅ File details modal shows all info
- ✅ Bulk delete works for multiple files

---

### Phase 2: Enhanced Upload Experience (WEEK 2)

#### 2.1 Drag & Drop Upload Zone
**Implementation:**
```typescript
// DragDropUploadZone.tsx
export function DragDropUploadZone({ onFilesDropped }: { onFilesDropped: (files: File[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    onFilesDropped(files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center transition-all
        ${isDragging
          ? 'border-green-500 bg-green-500/10'
          : 'border-slate-700 bg-slate-800/50'
        }
      `}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
      <p className="text-lg text-slate-300 mb-2">
        Drop files here to upload
      </p>
      <p className="text-sm text-slate-400">
        or click to browse
      </p>
    </div>
  );
}
```

**Features:**
- Visual feedback during drag (border color change)
- Accepts multiple files at once
- Shows file count during drag
- Integrates with existing upload flow

#### 2.2 Actual Supabase Storage Upload
**Critical Fix:** Currently only saves metadata!

**Implementation:**
```typescript
// useFileUpload.ts
export function useFileUpload() {
  const supabase = createClient();
  const createFile = trpc.file.create.useMutation();
  const queryClient = useQueryClient();

  const uploadFile = async (
    file: File,
    metadata: {
      category?: string;
      description?: string;
      eventId?: string;
      clientId?: string;
      leadId?: string;
    },
    onProgress?: (progress: number) => void
  ) => {
    // 1. Upload to Supabase Storage
    const tenantId = getTenantId(); // From context
    const timestamp = Date.now();
    const storagePath = `${tenantId}/${timestamp}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(storagePath, file, {
        onUploadProgress: (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          onProgress?.(percent);
        },
      });

    if (uploadError) throw uploadError;

    // 2. Get public URL
    const { data: urlData } = supabase.storage
      .from('files')
      .getPublicUrl(storagePath);

    // 3. Create database record
    await createFile.mutateAsync({
      fileName: file.name,
      fileType: file.type,
      filePath: urlData.publicUrl,
      fileSize: file.size,
      ...metadata,
    });

    // 4. Invalidate queries
    queryClient.invalidateQueries(['file.list']);
  };

  return { uploadFile };
}
```

**Features:**
- Actual file bytes uploaded to Supabase Storage
- Real-time progress tracking
- Error handling
- Automatic cleanup on failure
- Tenant-namespaced paths

#### 2.3 Multi-File Upload with Progress
**UI Structure:**
```typescript
// UploadProgressList.tsx
interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  error?: string;
}

export function UploadProgressList({ uploads }: { uploads: UploadItem[] }) {
  return (
    <div className="space-y-2">
      {uploads.map((upload) => (
        <div key={upload.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
          <FileIcon type={upload.file.type} />
          <div className="flex-1">
            <p className="text-sm text-slate-300">{upload.file.name}</p>
            <Progress value={upload.progress} className="h-1 mt-1" />
          </div>
          {upload.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {upload.status === 'failed' && <XCircle className="w-5 h-5 text-red-500" />}
        </div>
      ))}
    </div>
  );
}
```

**Features:**
- Progress bar per file
- File name and size display
- Success/failure indicators
- Cancellation support
- Batch upload queue

**Success Criteria:**
- ✅ Drag & drop works
- ✅ Files actually upload to Supabase Storage
- ✅ Progress shown during upload
- ✅ Multiple files upload simultaneously
- ✅ Error handling for failed uploads

---

### Phase 3: Organization & Search (WEEK 3)

#### 3.1 Search & Filter Bar
**UI Implementation:**
```typescript
// FileSearchFilters.tsx
interface FileSearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterCategory: (category: string | null) => void;
  onFilterType: (type: string | null) => void;
  onFilterDateRange: (start: Date | null, end: Date | null) => void;
}

export function FileSearchFilters({ ...filters }: FileSearchFiltersProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Search input */}
      <div className="flex-1">
        <Input
          placeholder="Search files..."
          icon={<Search />}
          onChange={(e) => filters.onSearch(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <Select onValueChange={(value) => filters.onFilterCategory(value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="documents">Documents</SelectItem>
          <SelectItem value="images">Images</SelectItem>
          <SelectItem value="videos">Videos</SelectItem>
        </SelectContent>
      </Select>

      {/* Type filter */}
      <Select onValueChange={(value) => filters.onFilterType(value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="image">Images</SelectItem>
          <SelectItem value="video">Videos</SelectItem>
        </SelectContent>
      </Select>

      {/* Date range picker */}
      <DateRangePicker
        onChange={(range) => filters.onFilterDateRange(range.start, range.end)}
      />
    </div>
  );
}
```

**Features:**
- Live search (debounced)
- Category dropdown filter
- File type filter
- Date range picker
- "Clear filters" button
- Filter count indicator

#### 3.2 Sortable Table Headers
**Implementation:**
```typescript
// Sortable column headers for files table
interface SortConfig {
  key: 'name' | 'size' | 'date' | 'type';
  direction: 'asc' | 'desc';
}

const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });

const handleSort = (key: SortConfig['key']) => {
  setSortConfig((prev) => ({
    key,
    direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
  }));
};

// Table header
<thead>
  <tr>
    <th onClick={() => handleSort('name')}>
      Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
    </th>
    <th onClick={() => handleSort('size')}>
      Size {sortConfig.key === 'size' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
    </th>
    <th onClick={() => handleSort('date')}>
      Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
    </th>
  </tr>
</thead>
```

**Sorting logic:**
```typescript
const sortedFiles = useMemo(() => {
  const sorted = [...files];
  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortConfig.key) {
      case 'name':
        comparison = a.fileName.localeCompare(b.fileName);
        break;
      case 'size':
        comparison = Number(a.fileSize) - Number(b.fileSize);
        break;
      case 'date':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'type':
        comparison = a.fileType.localeCompare(b.fileType);
        break;
    }

    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}, [files, sortConfig]);
```

#### 3.3 Category Management
**Features:**
- Visual category badges (color-coded)
- Quick filter by category
- Create custom categories
- Assign multiple categories per file (tags)

**Success Criteria:**
- ✅ Search by name works instantly
- ✅ Filter by category shows only matching files
- ✅ Sort by name/size/date works
- ✅ Date range filter works
- ✅ All filters can be cleared at once

---

### Phase 4: Advanced Features (WEEK 4+)

#### 4.1 File Versioning
**Schema addition:**
```prisma
model FileVersion {
  id              String   @id @default(uuid())
  fileId          String   @map("file_id")
  versionNumber   Int      @map("version_number")
  filePath        String   @map("file_path")
  fileSize        BigInt   @map("file_size")
  uploadedById    String   @map("uploaded_by_id")
  createdAt       DateTime @default(now()) @map("created_at")

  file            File     @relation(fields: [fileId], references: [id], onDelete: Cascade)
  uploadedBy      User     @relation(fields: [uploadedById], references: [id])

  @@map("file_versions")
}

// Add to File model:
model File {
  // ... existing fields
  versions        FileVersion[]
}
```

**Features:**
- Upload new version of existing file
- Version history in file details modal
- Download specific version
- Revert to previous version
- Version comparison

#### 4.2 File Sharing (Magic Links)
**Implementation:**
```typescript
// Generate shareable link
const generateShareLink = async (fileId: string, options: {
  expiresInDays?: number;
  requirePassword?: boolean;
  password?: string;
}) => {
  const token = generateSecureToken();

  await prisma.fileShareLink.create({
    data: {
      fileId,
      token,
      expiresAt: addDays(new Date(), options.expiresInDays || 7),
      password: options.password ? await hashPassword(options.password) : null,
    },
  });

  return `${process.env.NEXT_PUBLIC_URL}/shared/${token}`;
};
```

**Features:**
- Generate shareable link
- Set expiration date
- Optional password protection
- Track downloads
- Revoke link

#### 4.3 In-App File Preview
**Preview types:**
- Images: Direct `<img>` display
- PDFs: `<iframe>` or React PDF viewer
- Videos: HTML5 video player
- Audio: HTML5 audio player
- Documents: Google Docs viewer or preview service

**Success Criteria:**
- ✅ Upload new version tracked
- ✅ Version history accessible
- ✅ Shareable links work
- ✅ Password protection works
- ✅ File preview renders correctly

---

## Part 2: System-Wide Inline Editing

### Spec Requirements (Lines 986-990, 1952)
**"ALL fields should be inline-editable"** - applies to:
1. Pipeline (CRM fields)
2. Deliverables (due date, status, service type)
3. All table views across the app

### 2.1 Reusable InlineEdit Component

**Generic inline edit component:**
```typescript
// InlineEditField.tsx
interface InlineEditFieldProps<T> {
  value: T;
  onSave: (newValue: T) => Promise<void>;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  options?: Array<{ label: string; value: T }>; // For select type
  placeholder?: string;
  className?: string;
}

export function InlineEditField<T>({
  value,
  onSave,
  type,
  options,
  placeholder,
  className,
}: InlineEditFieldProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (currentValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(currentValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Save failed:', error);
      setCurrentValue(value); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className={`cursor-pointer hover:bg-slate-700/30 px-2 py-1 rounded transition-colors ${className}`}
        title="Click to edit"
      >
        {value || <span className="text-slate-500">{placeholder || 'Click to edit'}</span>}
      </div>
    );
  }

  return (
    <div className="relative">
      {type === 'select' && options ? (
        <select
          value={currentValue as string}
          onChange={(e) => setCurrentValue(e.target.value as T)}
          onBlur={handleSave}
          autoFocus
          className="w-full px-2 py-1 bg-slate-800 border border-green-500 rounded focus:outline-none"
        >
          {options.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={currentValue as string}
          onChange={(e) => setCurrentValue(e.target.value as T)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          rows={3}
          className="w-full px-2 py-1 bg-slate-800 border border-green-500 rounded focus:outline-none"
        />
      ) : (
        <input
          type={type}
          value={currentValue as string}
          onChange={(e) => setCurrentValue(e.target.value as T)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full px-2 py-1 bg-slate-800 border border-green-500 rounded focus:outline-none"
        />
      )}
      {isSaving && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Loader2 className="w-4 h-4 animate-spin text-green-500" />
        </div>
      )}
    </div>
  );
}
```

### 2.2 Pipeline Page - All Fields Editable

**Apply to all CRM fields:**
```typescript
// Pipeline page implementation
export function PipelineRow({ lead }: { lead: Lead }) {
  const updateLead = trpc.lead.update.useMutation();

  return (
    <tr>
      <td>
        <InlineEditField
          value={lead.organization}
          onSave={async (newValue) => {
            await updateLead.mutateAsync({
              id: lead.id,
              organization: newValue,
            });
          }}
          type="text"
          placeholder="Company name"
        />
      </td>
      <td>
        <InlineEditField
          value={lead.contactName}
          onSave={async (newValue) => {
            await updateLead.mutateAsync({
              id: lead.id,
              contactName: newValue,
            });
          }}
          type="text"
          placeholder="Contact name"
        />
      </td>
      <td>
        <InlineEditField
          value={lead.status}
          onSave={async (newValue) => {
            await updateLead.mutateAsync({
              id: lead.id,
              status: newValue,
            });
          }}
          type="select"
          options={[
            { label: 'New', value: 'NEW' },
            { label: 'Contacted', value: 'CONTACTED' },
            { label: 'Qualified', value: 'QUALIFIED' },
            { label: 'Converted', value: 'CONVERTED' },
            { label: 'Lost', value: 'LOST' },
          ]}
        />
      </td>
      {/* ... all other fields ... */}
    </tr>
  );
}
```

**Editable fields:**
- Organization name
- Contact name
- Contact email
- Contact phone
- Status (dropdown)
- Product focus
- Event type
- Budget range
- Notes
- All custom fields

### 2.3 Deliverables Page - Sortable & Editable

**Spec requirements (lines 1090-1120):**
- All columns sortable
- Google Drive folder column with click/right-click
- Checkboxes per service type
- Due date editable
- Status editable
- Assigned editor editable

**Implementation:**
```typescript
// Deliverables page
export function DeliverableRow({ deliverable }: { deliverable: Deliverable }) {
  const updateDeliverable = trpc.deliverable.update.useMutation();

  return (
    <tr>
      <td>{deliverable.client.organization}</td>
      <td>{deliverable.event.eventName}</td>
      <td>
        <InlineEditField
          value={deliverable.dueDate.toISOString().split('T')[0]}
          onSave={async (newValue) => {
            await updateDeliverable.mutateAsync({
              id: deliverable.id,
              dueDate: new Date(newValue),
            });
          }}
          type="date"
        />
      </td>
      <td>
        <InlineEditField
          value={deliverable.status}
          onSave={async (newValue) => {
            await updateDeliverable.mutateAsync({
              id: deliverable.id,
              status: newValue,
            });
          }}
          type="select"
          options={[
            { label: 'Pending', value: 'PENDING' },
            { label: 'In Progress', value: 'IN_PROGRESS' },
            { label: 'Completed', value: 'COMPLETED' },
            { label: 'Delivered', value: 'DELIVERED' },
          ]}
        />
      </td>
      <td>
        {/* Google Drive folder - click to open, right-click to copy */}
        <button
          onClick={() => window.open(deliverable.googleDriveFolderUrl, '_blank')}
          onContextMenu={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(deliverable.googleDriveFolderUrl);
          }}
          className="text-green-500 hover:underline flex items-center gap-2"
        >
          <FolderIcon className="w-4 h-4" />
          Open Folder
        </button>
      </td>
      <td>
        {/* Service checkboxes */}
        <div className="flex gap-2">
          {deliverable.services.map((service) => (
            <label key={service.id} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={service.completed}
                onChange={(e) => {
                  updateDeliverable.mutate({
                    id: deliverable.id,
                    serviceId: service.id,
                    completed: e.target.checked,
                  });
                }}
              />
              <span className="text-xs">{service.name}</span>
            </label>
          ))}
        </div>
      </td>
    </tr>
  );
}
```

### 2.4 Universal Table Sorting Component

**Reusable sortable table header:**
```typescript
// SortableTableHeader.tsx
interface SortableTableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: { key: string; direction: 'asc' | 'desc' };
  onSort: (key: string) => void;
}

export function SortableTableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
}: SortableTableHeaderProps) {
  const isActive = currentSort.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  return (
    <th
      onClick={() => onSort(sortKey)}
      className="cursor-pointer hover:bg-slate-800/50 transition-colors px-4 py-3 text-left"
    >
      <div className="flex items-center gap-2">
        <span>{label}</span>
        {isActive && (
          <span className="text-green-500">
            {direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );
}
```

**Usage across all tables:**
- Pipeline table
- Deliverables table
- Files table
- Operators table
- Gear table
- Proposals table
- Contracts table
- All other tables

---

## Implementation Timeline

### Week 1: Files Phase 1 + InlineEdit Component
- Day 1-2: File actions menu (download, rename, delete)
- Day 3-4: File details modal
- Day 5: Bulk operations
- **Deliverable:** Files page has full CRUD in UI

### Week 2: Files Phase 2 + Pipeline Inline Editing
- Day 1-2: Drag & drop upload
- Day 3-4: Actual Supabase Storage upload with progress
- Day 5: Apply inline editing to Pipeline page
- **Deliverable:** Files upload works properly, Pipeline fully editable

### Week 3: Files Phase 3 + Deliverables Inline Editing
- Day 1-2: Search & filter bar
- Day 3-4: Sortable columns for all tables
- Day 5: Apply inline editing to Deliverables page
- **Deliverable:** Files searchable/sortable, Deliverables fully editable

### Week 4: Files Phase 4 (Advanced)
- Day 1-2: File versioning
- Day 3-4: File sharing (magic links)
- Day 5: In-app preview
- **Deliverable:** Advanced file features complete

---

## Testing Checklist

### Files Management
- [ ] Upload file → appears in list
- [ ] Download file → opens in new tab
- [ ] Rename file → name updates in table
- [ ] Delete file → removed from Supabase + database
- [ ] Edit metadata → description/category saves
- [ ] Bulk delete → multiple files deleted
- [ ] Drag & drop → files upload
- [ ] Search → finds files by name
- [ ] Filter → shows only matching category
- [ ] Sort → columns sort correctly

### Inline Editing
- [ ] Pipeline: Click field → edit mode
- [ ] Pipeline: Blur → saves to database
- [ ] Pipeline: Enter key → saves
- [ ] Pipeline: Escape key → cancels edit
- [ ] Deliverables: Due date editable
- [ ] Deliverables: Status dropdown works
- [ ] Deliverables: Service checkboxes toggle
- [ ] All tables: Headers sortable

### Cross-Tenant Isolation
- [ ] Files namespaced by tenant_id
- [ ] Upload to wrong tenant → blocked
- [ ] View other tenant's files → blocked
- [ ] Edit other tenant's files → blocked

---

## Success Criteria

### Files Management Complete When:
✅ All 4 phases implemented
✅ Files actually upload to Supabase Storage
✅ Download/rename/delete work
✅ Drag & drop works
✅ Search/filter/sort work
✅ Bulk operations work
✅ File versioning works (Phase 4)
✅ Shareable links work (Phase 4)

### Inline Editing Complete When:
✅ InlineEditField component reusable
✅ Pipeline: All fields editable
✅ Deliverables: All fields editable
✅ All tables: Headers sortable
✅ Save on blur/Enter works
✅ Cancel on Escape works
✅ Loading states shown during save

---

## Technical Debt to Address

1. **Current upload doesn't save files** - Only saves metadata, no actual file bytes
2. **No file download links** - Backend has URL, UI doesn't expose it
3. **No inline editing** - Backend has update mutations, UI doesn't use them
4. **No table sorting** - Need client-side + backend sorting
5. **No bulk operations** - Need selection UI + batch mutations

---

## Notes

- Backend mutations already exist for most operations
- Focus on **connecting UI to backend**
- InlineEditField component is **reusable across entire app**
- Sortable headers use same component everywhere
- All changes must respect **tenant isolation**
- Google Drive integration already works (folder creation)
- Supabase Storage already configured

---

**Next Step:** Review plan → Begin Phase 1 implementation → Deploy incrementally
