import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const UPLOAD_KEY_PREFIX = "uploads";

let client: S3Client | null = null;

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME,
  );
}

function getR2Client(): S3Client {
  if (!isR2Configured()) {
    throw new Error("Cloudflare R2 is not configured");
  }

  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  return client;
}

export function getUploadObjectKey(filename: string): string {
  return `${UPLOAD_KEY_PREFIX}/${filename}`;
}

export function getPublicUploadUrl(filename: string): string {
  return `/uploads/${filename}`;
}

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  const bucket = process.env.R2_BUCKET_NAME!;
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType || "application/octet-stream",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  await client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export async function getObjectFromR2(key: string) {
  const response = await getR2Client().send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    }),
  );

  if (!response.Body) {
    throw new Error("Empty object body");
  }

  return {
    body: response.Body,
    contentType: response.ContentType ?? "application/octet-stream",
    contentLength: response.ContentLength,
    cacheControl: response.CacheControl,
  };
}

export async function deleteFromR2(key: string): Promise<void> {
  if (!isR2Configured()) return;

  try {
    await getR2Client().send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      }),
    );
  } catch {
    // Object may already be removed from R2
  }
}

export function resolveR2ObjectKey(filename: string, url: string): string | null {
  if (!isR2Configured()) return null;

  if (url.startsWith("/uploads/")) {
    return getUploadObjectKey(filename);
  }

  const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (publicBase && url.startsWith(`${publicBase}/`)) {
    return url.slice(publicBase.length + 1);
  }

  return getUploadObjectKey(filename);
}
