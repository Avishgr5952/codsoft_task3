import fs from 'fs';
import path from 'path';

export interface StorageResult {
  url: string;
  path: string;
  size: number;
}

export interface IStorageProvider {
  uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    folder: 'resumes' | 'avatars' | 'logos'
  ): Promise<StorageResult>;
  deleteFile(fileUrlOrPath: string): Promise<boolean>;
}

export class LocalStorageProvider implements IStorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    this.ensureDirExists(this.uploadDir);
    this.ensureDirExists(path.join(this.uploadDir, 'resumes'));
    this.ensureDirExists(path.join(this.uploadDir, 'avatars'));
    this.ensureDirExists(path.join(this.uploadDir, 'logos'));
  }

  private ensureDirExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    folder: 'resumes' | 'avatars' | 'logos'
  ): Promise<StorageResult> {
    const targetFolder = path.join(this.uploadDir, folder);
    this.ensureDirExists(targetFolder);

    const ext = path.extname(originalName) || '';
    const baseName = path.basename(originalName, ext);
    const sanitized = this.sanitizeFileName(baseName);
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 8);
    const uniqueFileName = `${sanitized}-${timestamp}-${randomHex}${ext}`;

    const filePath = path.join(targetFolder, uniqueFileName);
    await fs.promises.writeFile(filePath, fileBuffer);

    const publicUrl = `/uploads/${folder}/${uniqueFileName}`;
    return {
      url: publicUrl,
      path: filePath,
      size: fileBuffer.length,
    };
  }

  async deleteFile(fileUrlOrPath: string): Promise<boolean> {
    try {
      let fullPath = fileUrlOrPath;
      if (fileUrlOrPath.startsWith('/uploads/')) {
        fullPath = path.join(process.cwd(), 'public', fileUrlOrPath);
      }
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting file from local storage:', err);
      return false;
    }
  }
}

// Storage provider singleton / factory
let currentStorageProvider: IStorageProvider | null = null;

export function getStorageProvider(): IStorageProvider {
  if (!currentStorageProvider) {
    // Easily configurable to Cloudinary / AWS S3 / Supabase Storage via env
    currentStorageProvider = new LocalStorageProvider();
  }
  return currentStorageProvider;
}
