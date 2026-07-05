import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

export const ALLOWED_UPLOAD_TYPES = new Set([
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
]);

export type UploadResult = {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
};

export function validateUploadFile(file: File): string | null {
  if (!file.type || !ALLOWED_UPLOAD_TYPES.has(file.type)) {
    return "File type not allowed. Use JPEG, PNG, WebP, GIF, SVG, MP4, or WebM.";
  }

  const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (file.size > maxSize) {
    return `File too large (max ${isVideo ? "50MB" : "10MB"})`;
  }

  if (file.size === 0) {
    return "File is empty";
  }

  const ext = path.extname(file.name).toLowerCase();
  const blocked = [".exe", ".js", ".html", ".php", ".sh", ".bat", ".cmd"];
  if (blocked.includes(ext)) {
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

  const ext =
    path.extname(file.name) ||
    (ALLOWED_VIDEO_TYPES.has(file.type) ? ".mp4" : ".png");
  const filename = `${randomUUID()}${ext}`;

  await ensureUploadDir();
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return {
    filename,
    url: `/uploads/${filename}`,
    mimeType: file.type,
    size: file.size,
  };
}

export function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad/.test(ua)) return "tablet";
  if (/mobile|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}
