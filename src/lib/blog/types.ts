import type { Locale } from "@/i18n/config";

export type BlogContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type CmsBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: BlogContentBlock[];
  coverImage: string;
  coverAlt: string;
  category: string;
  categorySlug: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string;
  canonicalUrl: string;
  noIndex: boolean;
};

export function parseBlogContent(raw: string): BlogContentBlock[] {
  try {
    const parsed = JSON.parse(raw) as BlogContentBlock[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
