import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { pick } from "@/lib/cms/utils";
import { blogImageUrl } from "@/lib/blog/media";
import type { CmsBlogPost } from "@/lib/blog/types";
import { parseBlogContent, parseTags } from "@/lib/blog/types";

function pickBlogField(en: string, ar: string, locale: Locale): string {
  const primary = pick(en, ar, locale).trim();
  if (primary) return primary;
  return pick(en, ar, locale === "ar" ? "en" : "ar").trim();
}

function resolveBlogContent(
  contentEn: string,
  contentAr: string,
  locale: Locale,
) {
  const primary = parseBlogContent(locale === "ar" ? contentAr : contentEn);
  if (primary.length > 0) return primary;
  return parseBlogContent(locale === "ar" ? contentEn : contentAr);
}

function resolveBlogTags(tagsEn: string, tagsAr: string, locale: Locale) {
  const primary = parseTags(locale === "ar" ? tagsAr : tagsEn);
  if (primary.length > 0) return primary;
  return parseTags(locale === "ar" ? tagsEn : tagsAr);
}

function mapPost(
  post: Awaited<ReturnType<typeof fetchPosts>>[number],
  locale: Locale,
): CmsBlogPost {
  const coverImage = blogImageUrl(post.coverImage);
  const ogImageUrl = blogImageUrl(post.ogImageUrl || post.coverImage);

  return {
    id: post.id,
    slug: post.slug,
    title: pickBlogField(post.titleEn, post.titleAr, locale),
    excerpt: pickBlogField(post.excerptEn, post.excerptAr, locale),
    content: resolveBlogContent(post.contentEn, post.contentAr, locale),
    coverImage,
    coverAlt: pickBlogField(post.coverAltEn, post.coverAltAr, locale) || pickBlogField(post.titleEn, post.titleAr, locale),
    category: pickBlogField(post.categoryEn, post.categoryAr, locale),
    categorySlug: post.categorySlug,
    tags: resolveBlogTags(post.tagsEn, post.tagsAr, locale),
    author: post.author,
    publishedAt: post.publishedAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    featured: post.featured,
    seoTitle: pickBlogField(post.seoTitleEn, post.seoTitleAr, locale),
    seoDescription: pickBlogField(post.seoDescEn, post.seoDescAr, locale),
    seoKeywords: pickBlogField(post.seoKeywordsEn, post.seoKeywordsAr, locale),
    ogImageUrl,
    canonicalUrl: post.canonicalUrl,
    noIndex: post.noIndex,
  };
}

async function fetchPosts(where: Record<string, unknown> = {}) {
  return prisma.blogPost.findMany({
    where: { status: "published", ...where },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });
}

export async function getAllPublishedBlogSlugs() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "published", noIndex: false },
      select: { slug: true },
    });
    return posts.map((p) => p.slug);
  } catch {
    return [];
  }
}

export async function getBlogPosts(locale: Locale) {
  const posts = await fetchPosts();
  return posts.map((post) => mapPost(post, locale));
}

export async function getBlogPostBySlug(slug: string, locale: Locale) {
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "published" },
  });
  if (!post) return null;
  return mapPost(post, locale);
}

export async function getFeaturedBlogPosts(locale: Locale, limit = 3) {
  const posts = await fetchPosts({ featured: true });
  return posts.slice(0, limit).map((post) => mapPost(post, locale));
}

export async function getBlogPostsByCategory(
  categorySlug: string,
  locale: Locale,
) {
  const posts = await fetchPosts({ categorySlug });
  return posts.map((post) => mapPost(post, locale));
}

export async function getBlogPostsByTag(tag: string, locale: Locale) {
  const posts = await fetchPosts();
  const normalized = tag.toLowerCase();
  return posts
    .filter((post) => {
      const tags = resolveBlogTags(post.tagsEn, post.tagsAr, locale).map((t) =>
        t.toLowerCase(),
      );
      return tags.includes(normalized);
    })
    .map((post) => mapPost(post, locale));
}

export async function getRelatedBlogPosts(
  slug: string,
  locale: Locale,
  limit = 3,
) {
  const current = await prisma.blogPost.findFirst({
    where: { slug, status: "published" },
  });
  if (!current) return [];

  const posts = await fetchPosts({ slug: { not: slug } });
  const currentTags = new Set(resolveBlogTags(current.tagsEn, current.tagsAr, locale));

  const scored = posts.map((post) => {
    let score = 0;
    if (post.categorySlug === current.categorySlug) score += 2;
    resolveBlogTags(post.tagsEn, post.tagsAr, locale).forEach((tag) => {
      if (currentTags.has(tag)) score += 1;
    });
    return { post, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => mapPost(post, locale));
}

export async function getBlogCategories(locale: Locale) {
  const posts = await fetchPosts();
  const map = new Map<string, { slug: string; name: string; count: number }>();

  for (const post of posts) {
    const slug = post.categorySlug;
    const name = pickBlogField(post.categoryEn, post.categoryAr, locale);
    const existing = map.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(slug, { slug, name, count: 1 });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export async function getBlogTags(locale: Locale) {
  const posts = await fetchPosts();
  const map = new Map<string, number>();

  for (const post of posts) {
    const tags = resolveBlogTags(post.tagsEn, post.tagsAr, locale);
    for (const tag of tags) {
      const key = tag.toLowerCase();
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }

  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getPageSeo(pageKey: string) {
  return prisma.pageSeo.findUnique({ where: { pageKey } });
}

export async function getAllPageSeo() {
  return prisma.pageSeo.findMany();
}
