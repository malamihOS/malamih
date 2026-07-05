import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import {
  deleteFromR2,
  getPublicUploadUrl,
  getUploadObjectKey,
  isR2Configured,
  resolveR2ObjectKey,
  uploadToR2,
} from "@/lib/r2";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
export const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

export const ALLOWED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "text/plain",
]);

export const ALLOWED_UPLOAD_TYPES = new Set([
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
]);

export type UploadResult = {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
};

const BLOCKED_EXTENSIONS = new Set([
  ".exe",
  ".js",
  ".html",
  ".php",
  ".sh",
  ".bat",
  ".cmd",
]);

function getMaxUploadSize(mimeType: string): number {
  if (ALLOWED_VIDEO_TYPES.has(mimeType)) return MAX_VIDEO_SIZE;
  if (ALLOWED_DOCUMENT_TYPES.has(mimeType)) return MAX_DOCUMENT_SIZE;
  return MAX_IMAGE_SIZE;
}

function defaultExtension(mimeType: string): string {
  if (ALLOWED_VIDEO_TYPES.has(mimeType)) return ".mp4";
  if (mimeType === "application/pdf") return ".pdf";
  if (mimeType === "application/zip") return ".zip";
  if (mimeType === "text/plain") return ".txt";
  return ".png";
}

export function validateUploadFile(file: File): string | null {
  if (!file.type || !ALLOWED_UPLOAD_TYPES.has(file.type)) {
    return "File type not allowed. Use JPEG, PNG, WebP, GIF, SVG, MP4, WebM, PDF, DOC, DOCX, PPT, PPTX, ZIP, or TXT.";
  }

  const maxSize = getMaxUploadSize(file.type);

  if (file.size > maxSize) {
    const label = ALLOWED_VIDEO_TYPES.has(file.type)
      ? "50MB"
      : ALLOWED_DOCUMENT_TYPES.has(file.type)
        ? "25MB"
        : "10MB";
    return `File too large (max ${label})`;
  }

  if (file.size === 0) {
    return "File is empty";
  }

  const ext = path.extname(file.name).toLowerCase();
  if (BLOCKED_EXTENSIONS.has(ext)) {
    return "File extension not allowed";
  }

  return null;
}

export async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function saveUploadFile(file: File): Promise<UploadResult> {
  const error = validateUploadFile(file);
  if (error) throw new Error(error);

  const ext = path.extname(file.name) || defaultExtension(file.type);
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isR2Configured()) {
    const key = getUploadObjectKey(filename);
    await uploadToR2(key, buffer, file.type);

    return {
      filename,
      url: getPublicUploadUrl(filename),
      mimeType: file.type,
      size: file.size,
    };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Cloudflare R2 is not configured. Set R2_* environment variables in production.",
    );
  }

  await ensureUploadDir();
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return {
    filename,
    url: `/uploads/${filename}`,
    mimeType: file.type,
    size: file.size,
  };
}

export async function deleteUploadFile(media: {
  filename: string;
  url: string;
}): Promise<void> {
  const r2Key = resolveR2ObjectKey(media.filename, media.url);
  if (r2Key) {
    await deleteFromR2(r2Key);
    return;
  }

  if (media.url.startsWith("/uploads/")) {
    try {
      await unlink(path.join(UPLOAD_DIR, media.filename));
    } catch {
      // File may already be removed from disk
    }
  }
}

export function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad/.test(ua)) return "tablet";
  if (/mobile|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}
