import { normalizeUploadUrl } from "@/lib/media-url";

export const BLOG_FALLBACK_COVER =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=630&fit=crop";

export function blogImageUrl(url: string | null | undefined): string {
  const normalized = normalizeUploadUrl(url?.trim() ?? "");
  return normalized || BLOG_FALLBACK_COVER;
}
