import {
  DeleteObjectCommand,
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
      process.env.R2_BUCKET_NAME &&
      process.env.R2_PUBLIC_URL,
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
  const base = process.env.R2_PUBLIC_URL!.replace(/\/$/, "");
  return `${base}/${getUploadObjectKey(filename)}`;
}

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: body,
      ContentType: contentType || "application/octet-stream",
    }),
  );
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

  const publicBase = process.env.R2_PUBLIC_URL!.replace(/\/$/, "");
  if (url.startsWith(`${publicBase}/`)) {
    return url.slice(publicBase.length + 1);
  }

  return getUploadObjectKey(filename);
}
