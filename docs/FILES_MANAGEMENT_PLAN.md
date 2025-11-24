# Files Management Enhancement Plan

**Status:** Planning Phase
**Created:** November 23, 2025
**Priority:** HIGH - Core feature gap identified

---

## Current State Analysis

### ✅ Backend Capabilities (Fully Implemented)
1. **File CRUD Operations**
   - `create` - Upload file metadata to database
   - `list` - List files with filtering (event, client, lead, category)
   - `getById` - Get single file details
   - `update` - Rename file, edit description/category
   - `delete` - Delete file + Supabase Storage cleanup

2. **Integrations**
   - Google Drive folder creation
   - Vimeo livestreams listing
   - Supabase Storage (file storage backend)

### ❌ Missing UI Features (Backend Ready, UI Missing)
1. **File Actions**
   - Rename file (update mutation exists)
   - Delete file (delete mutation exists)
   - Download file (need direct link)
   - Edit metadata (update mutation exists)

2. **File Management**
   - File preview/viewer
   - Bulk operations (select multiple, delete/move)
   - Search/filter files
   - Sort by name, size, date, type
   - File details modal
   - Drag & drop upload

3. **Organization**
   - Tag files by event/client/lead
   - Categories/folders view
   - Recent files
   - Favorites/starred

---

## Specification Requirements

From `BOOTSTRAPBUILD/00_MASTER_SPECIFICATION.md`:

### Files Page Structure (Lines 1992-1998)
**Multi-tab layout:**
- Files tab (default) - General document management
- Proposals tab - Proposal documents
- Contracts tab - Contract documents
- Questionnaires tab - Client questionnaires
- Invoices tab - Invoice documents
- Livestreams tab - Vimeo livestreams

### Google Drive Integration (Lines 1394-1401, 1456-1483)
**Auto-folder creation:**
- When event created → `/Clients/[Client Name]/[Event Name]/Raw Footage/`
- When event created → `/Clients/[Client Name]/[Event Name]/Deliverables/`
- Generate unique upload links per operator
- Upload links DO NOT expire
- Track upload status: who uploaded, when, file count
- Notify Commander when footage uploaded

**API Capabilities:**
- Create folders programmatically ✅
- Generate shareable upload links (non-expiring) ❌
- Set folder permissions (private, client-accessible, public) ❌
- Track file uploads via webhooks ❌
- Get folder ID + shareable URL ✅

### File Upload Requirements (Lines 585, 697)
- File uploads namespaced by tenant_id: `/uploads/{tenant_id}/{file}` ✅
- Supabase Storage integration ✅

---

## Proposed Enhancement Plan

### Phase 1: Core File Actions (HIGH PRIORITY)
**Goal:** Connect existing backend to UI

1. **File Actions Menu** (per file row)
   - Download button → Direct link to Supabase Storage URL
   - Rename button → Modal with inline edit (calls `update` mutation)
   - Delete button → Confirmation modal (calls `delete` mutation)
   - Edit metadata → Modal to edit description, category (calls `update` mutation)

2. **File Details Modal**
   - Click file name → Opens modal with:
     - File preview (images, PDFs via iframe)
     - Metadata (name, size, type, uploaded by, date)
     - Associated event/client/lead
     - Description field (editable)
     - Category dropdown (editable)
     - Download, Rename, Delete actions

3. **Bulk Operations**
   - Checkbox selection (select multiple files)
   - Bulk delete (with confirmation)
   - Bulk move to category
   - Select all / Deselect all

### Phase 2: Enhanced Upload Experience (MEDIUM PRIORITY)

1. **Drag & Drop Upload**
   - Drop zone in Documents tab
   - Visual feedback during drag
   - Multi-file upload support
   - Progress indicators

2. **Upload Modal Improvements**
   - File preview before upload
   - Actual Supabase Storage upload (not just metadata)
   - Associate with event/client/lead during upload
   - Category selection during upload
   - Description field during upload

3. **Upload Link Generation**
   - Generate unique upload links per operator
   - Non-expiring links
   - Track who uploaded via link
   - Notify Commander when uploaded

### Phase 3: Organization & Search (MEDIUM PRIORITY)

1. **Search & Filter**
   - Search by file name
   - Filter by category
   - Filter by event/client/lead
   - Filter by date range
   - Filter by file type (PDF, Image, Video, etc.)

2. **Sorting**
   - Sort by name (A-Z, Z-A)
   - Sort by size (smallest first, largest first)
   - Sort by date (newest first, oldest first)
   - Sort by type

3. **Categories & Tags**
   - Visual category badges
   - Quick filter by category
   - Tag system for flexible organization
   - Favorites/starred files

### Phase 4: Advanced Features (LOW PRIORITY)

1. **File Versioning**
   - Track file versions
   - Upload new version
   - Download previous versions
   - Version history

2. **File Sharing**
   - Generate shareable links
   - Set expiration dates
   - Password protection
   - Track downloads

3. **File Preview**
   - In-app preview for images
   - PDF viewer
   - Video player
   - Audio player

---

## Technical Implementation Details

### File Download Implementation
```typescript
// Option 1: Supabase Storage Public URL
const downloadUrl = file.filePath; // Already contains full URL
window.open(downloadUrl, '_blank');

// Option 2: Signed URL (for private files)
const supabase = createClient();
const { data } = await supabase.storage
  .from('files')
  .createSignedUrl(filePath, 60); // 60 seconds expiry
window.open(data.signedUrl, '_blank');
```

### Actual File Upload to Supabase Storage
```typescript
// Frontend: Upload file to Supabase Storage
const uploadFile = async (file: File) => {
  const supabase = createClient();
  const filePath = `${tenantId}/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from('files')
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('files')
    .getPublicUrl(filePath);

  // Create file record in database
  await createFile.mutateAsync({
    fileName: file.name,
    fileType: file.type,
    filePath: urlData.publicUrl,
    fileSize: file.size,
    category: 'documents',
  });
};
```

### File Actions Menu Component
```typescript
<DropdownMenu>
  <DropdownMenuTrigger>⋮</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => downloadFile(file)}>
      Download
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => openRenameModal(file)}>
      Rename
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => openEditModal(file)}>
      Edit Details
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      onClick={() => deleteFile(file)}
      className="text-red-500"
    >
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Database Schema Review

Current `File` model (from schema):
```prisma
model File {
  id              String   @id @default(uuid())
  tenantId        String   @map("tenant_id")
  fileName        String   @map("file_name")
  fileType        String   @map("file_type")
  filePath        String   @map("file_path")
  fileSize        BigInt   @map("file_size")
  category        String?  @default("documents")
  description     String?
  eventId         String?  @map("event_id")
  clientId        String?  @map("client_id")
  leadId          String?  @map("lead_id")
  uploadedById    String   @map("uploaded_by_id")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  tenant          Tenant   @relation(fields: [tenantId], references: [id])
  event           Event?   @relation(fields: [eventId], references: [id])
  client          Client?  @relation(fields: [clientId], references: [id])
  lead            Lead?    @relation(fields: [leadId], references: [id])
  uploadedBy      User     @relation(fields: [uploadedById], references: [id])
}
```

**Schema is complete - no changes needed!**

---

## Priority Recommendations

### Immediate (Next Session)
1. Add file actions menu (Download, Rename, Delete)
2. Implement actual Supabase Storage upload
3. Add file details modal

### Short Term (This Week)
1. Drag & drop upload
2. Search & filter
3. Bulk operations

### Long Term (Future Enhancements)
1. File versioning
2. Shareable links
3. Advanced preview

---

## Success Criteria

### Phase 1 Complete When:
- ✅ User can download files
- ✅ User can rename files
- ✅ User can delete files
- ✅ User can edit file metadata
- ✅ File details modal shows all info
- ✅ Bulk delete works

### Phase 2 Complete When:
- ✅ Drag & drop upload works
- ✅ Files actually upload to Supabase Storage
- ✅ Upload progress shown
- ✅ Multi-file upload works

### Phase 3 Complete When:
- ✅ Search by name works
- ✅ Filter by category/type works
- ✅ Sort by name/size/date works
- ✅ UI is intuitive and fast

---

## Notes

- Backend is **production-ready** - all mutations exist and tested
- Focus on **connecting UI to existing backend**
- Google Drive integration already works for folder creation
- Supabase Storage already configured
- No schema changes needed
- No new tRPC procedures needed for Phase 1

---

**Next Steps:** Review plan with user, prioritize features, begin Phase 1 implementation.
