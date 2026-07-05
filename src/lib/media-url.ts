export function normalizeUploadUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("/uploads/")) return url;

  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/uploads\/([^/]+)$/);
    if (match) return `/uploads/${match[1]}`;
  } catch {
    // Not an absolute URL — return as-is.
  }

  return url;
}
