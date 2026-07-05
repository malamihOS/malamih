import { readFile } from "fs/promises";
import path from "path";
import {
  getObjectFromR2,
  getUploadObjectKey,
  isR2Configured,
} from "@/lib/r2";
import { UPLOAD_DIR } from "@/lib/upload";

const SAFE_FILENAME = /^[\w.-]+$/;

type RouteContext = {
  params: Promise<{ filename: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { filename } = await context.params;

  if (!filename || !SAFE_FILENAME.test(filename)) {
    return new Response("Not found", { status: 404 });
  }

  const localPath = path.join(UPLOAD_DIR, filename);

  try {
    const buffer = await readFile(localPath);
    const contentType = guessContentType(filename);
    return new Response(buffer, {
      headers: buildHeaders(contentType, buffer.byteLength),
    });
  } catch {
    // Fall through to R2 when the file is not on disk.
  }

  if (!isR2Configured()) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const object = await getObjectFromR2(getUploadObjectKey(filename));
    const bytes = await object.body.transformToByteArray();
    const buffer = Buffer.from(bytes);

    return new Response(buffer, {
      headers: buildHeaders(
        object.contentType,
        object.contentLength ?? buffer.byteLength,
        object.cacheControl,
      ),
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

function buildHeaders(
  contentType: string,
  contentLength: number,
  cacheControl = "public, max-age=31536000, immutable",
) {
  return {
    "Content-Type": contentType,
    "Content-Length": String(contentLength),
    "Cache-Control": cacheControl,
  };
}

function guessContentType(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}
