'use client';

import { useState } from 'react';
import {
  MoreVertical,
  Download,
  Edit,
  FileText,
  Trash,
  Loader2,
} from 'lucide-react';

interface File {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: bigint;
  fileType: string;
  description?: string | null;
  category?: string | null;
}

interface FileActionsMenuProps {
  file: File;
  onDownload: (file: File) => void;
  onRename: (file: File) => void;
  onDelete: (file: File) => void;
  onEditMetadata: (file: File) => void;
}

/**
 * FileActionsMenu - Dropdown menu for file operations
 *
 * Features:
 * - Download file
 * - Rename file
 * - Edit metadata (description, category)
 * - Delete file
 */
export function FileActionsMenu({
  file,
  onDownload,
  onRename,
  onDelete,
  onEditMetadata,
}: FileActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-slate-700/50 rounded transition-colors"
        title="File actions"
      >
        <MoreVertical className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-1 z-20 bg-slate-800 border border-slate-700 rounded-lg shadow-lg min-w-[180px] py-1">
            <button
              onClick={() => handleAction(() => onDownload(file))}
              className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-slate-700/50 transition-colors text-slate-300"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>

            <button
              onClick={() => handleAction(() => onRename(file))}
              className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-slate-700/50 transition-colors text-slate-300"
            >
              <Edit className="w-4 h-4" />
              <span>Rename</span>
            </button>

            <button
              onClick={() => handleAction(() => onEditMetadata(file))}
              className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-slate-700/50 transition-colors text-slate-300"
            >
              <FileText className="w-4 h-4" />
              <span>Edit Details</span>
            </button>

            <div className="h-px bg-slate-700 my-1" />

            <button
              onClick={() => handleAction(() => onDelete(file))}
              className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-red-500/20 transition-colors text-red-400"
            >
              <Trash className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * FileRenameModal - Modal for renaming files
 */
interface FileRenameModalProps {
  file: File;
  isOpen: boolean;
  onClose: () => void;
  onRename: (fileId: string, newName: string) => Promise<void>;
}

export function FileRenameModal({
  file,
  isOpen,
  onClose,
  onRename,
}: FileRenameModalProps) {
  const [fileName, setFileName] = useState(file.fileName);
  const [isRenaming, setIsRenaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileName.trim()) {
      setError('File name cannot be empty');
      return;
    }

    if (fileName === file.fileName) {
      onClose();
      return;
    }

    setIsRenaming(true);
    setError(null);

    try {
      await onRename(file.id, fileName);
      onClose();
    } catch (error) {
      console.error('Rename failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to rename file');
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Rename File</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              disabled={isRenaming}
              autoFocus
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded focus:outline-none focus:border-green-500 text-slate-100"
            />
            {error && (
              <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isRenaming}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRenaming}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isRenaming && <Loader2 className="w-4 h-4 animate-spin" />}
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * FileDeleteModal - Confirmation modal for file deletion
 */
interface FileDeleteModalProps {
  file: File;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (fileId: string) => Promise<void>;
}

export function FileDeleteModal({
  file,
  isOpen,
  onClose,
  onDelete,
}: FileDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await onDelete(file.id);
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete file');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-red-400 mb-4">Delete File?</h2>

        <p className="text-slate-300 mb-2">
          Are you sure you want to delete this file?
        </p>
        <p className="text-slate-400 mb-4 font-mono text-sm">
          {file.fileName}
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-400">{error}</p>
        )}

        <p className="text-sm text-slate-500 mb-6">
          This action cannot be undone. The file will be permanently deleted from storage.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * FileMetadataModal - Modal for editing file metadata
 */
interface FileMetadataModalProps {
  file: File;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (fileId: string, data: { description?: string; category?: string }) => Promise<void>;
}

export function FileMetadataModal({
  file,
  isOpen,
  onClose,
  onUpdate,
}: FileMetadataModalProps) {
  const [description, setDescription] = useState(file.description || '');
  const [category, setCategory] = useState(file.category || 'documents');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsUpdating(true);
    setError(null);

    try {
      await onUpdate(file.id, { description, category });
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to update file');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Edit File Details</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              File Name
            </label>
            <input
              type="text"
              value={file.fileName}
              disabled
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded text-slate-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isUpdating}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded focus:outline-none focus:border-green-500 text-slate-100"
            >
              <option value="documents">Documents</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
              <option value="audio">Audio</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUpdating}
              rows={3}
              placeholder="Add a description..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded focus:outline-none focus:border-green-500 text-slate-100"
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
