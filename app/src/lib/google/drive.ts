/**
 * Google Drive API Client
 *
 * Integration with Google Drive for file management using googleapis package.
 * - Create folders
 * - Upload files
 * - Share folders/files
 * - Get folder metadata
 *
 * API Documentation: https://developers.google.com/drive/api/v3/reference
 *
 * Authentication:
 * - Requires Service Account credentials from Google Cloud Console
 * - Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_KEY environment variables
 */

import { google } from 'googleapis';

export interface GoogleDriveCredentials {
  clientEmail: string;
  privateKey: string;
  projectId?: string;
}

export interface DriveFolder {
  id: string;
  name: string;
  webViewLink: string;
  createdTime?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  webContentLink?: string;
}

/**
 * Google Drive API Client using Service Account
 */
export class GoogleDriveClient {
  private drive;
  private auth;

  constructor(credentials: GoogleDriveCredentials) {
    // Create Google Auth instance with service account credentials
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.clientEmail,
        private_key: credentials.privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
        project_id: credentials.projectId,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    // Initialize Drive API client
    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  /**
   * Create a folder in Google Drive
   */
  async createFolder(folderName: string, parentFolderId?: string): Promise<DriveFolder> {
    const fileMetadata: any = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    if (parentFolderId) {
      fileMetadata.parents = [parentFolderId];
    }

    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name, webViewLink, createdTime',
    });

    if (!response.data.id) {
      throw new Error('Failed to create folder: No folder ID returned');
    }

    return {
      id: response.data.id,
      name: response.data.name || folderName,
      webViewLink: response.data.webViewLink || '',
      createdTime: response.data.createdTime || undefined,
    };
  }

  /**
   * Share a folder with specific users or make it public
   */
  async shareFolder(
    folderId: string,
    emails?: string[],
    makePublic: boolean = false
  ): Promise<void> {
    if (makePublic) {
      // Make folder publicly accessible
      await this.drive.permissions.create({
        fileId: folderId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } else if (emails && emails.length > 0) {
      // Share with specific users
      for (const email of emails) {
        await this.drive.permissions.create({
          fileId: folderId,
          requestBody: {
            role: 'writer',
            type: 'user',
            emailAddress: email,
          },
          sendNotificationEmail: false, // Don't spam users
        });
      }
    }
  }

  /**
   * Get folder metadata
   */
  async getFolder(folderId: string): Promise<DriveFolder> {
    const response = await this.drive.files.get({
      fileId: folderId,
      fields: 'id, name, webViewLink, createdTime',
    });

    if (!response.data.id) {
      throw new Error('Folder not found');
    }

    return {
      id: response.data.id,
      name: response.data.name || '',
      webViewLink: response.data.webViewLink || '',
      createdTime: response.data.createdTime || undefined,
    };
  }

  /**
   * List files in a folder
   */
  async listFiles(folderId: string): Promise<DriveFile[]> {
    const response = await this.drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
      orderBy: 'createdTime desc',
    });

    return (response.data.files || []).map((file) => ({
      id: file.id || '',
      name: file.name || '',
      mimeType: file.mimeType || '',
      webViewLink: file.webViewLink || '',
      webContentLink: file.webContentLink || undefined,
    }));
  }
}

/**
 * Create Google Drive client with service account credentials
 *
 * Credentials can be obtained from:
 * 1. Create service account in Google Cloud Console
 * 2. Download JSON key file
 * 3. Extract client_email and private_key
 * 4. Add to environment variables or tenant settings
 */
export function createGoogleDriveClient(
  credentials: GoogleDriveCredentials
): GoogleDriveClient {
  if (!credentials.clientEmail || !credentials.privateKey) {
    throw new Error(
      'Google Drive requires service account credentials (clientEmail and privateKey).\n' +
      'Create a service account at https://console.cloud.google.com/iam-admin/serviceaccounts'
    );
  }

  return new GoogleDriveClient(credentials);
}

/**
 * Helper function to get credentials from environment variables
 */
export function getGoogleDriveCredentialsFromEnv(): GoogleDriveCredentials | null {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.GOOGLE_PROJECT_ID;

  if (!clientEmail || !privateKey) {
    return null;
  }

  return {
    clientEmail,
    privateKey,
    projectId,
  };
}
