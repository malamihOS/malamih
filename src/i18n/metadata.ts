import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getSiteContent } from "@/lib/cms/get-content";
import { getPageSeo } from "@/lib/blog/get-posts";
import { prisma } from "@/lib/prisma";
import { buildMetadata, pickSeoText } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/constants";
import type { PageSeoKey } from "@/lib/seo/constants";
import { en as staticEn } from "@/i18n/dictionaries/en";
import { ar as staticAr } from "@/i18n/dictionaries/ar";

type PageKey = PageSeoKey;

export async function createPageMetadata(
  locale: Locale,
  page: PageKey,
  overrides?: Partial<Metadata>,
): Promise<Metadata> {
  const [content, pageSeo, siteSettings] = await Promise.all([
    getSiteContent(locale),
    getPageSeo(page).catch(() => null),
    prisma.siteSettings.findFirst().catch(() => null),
  ]);

  const staticMeta =
    locale === "ar" ? staticAr.meta.pages[page] : staticEn.meta.pages[page];

  const title =
    pickSeoText(
      pageSeo?.seoTitleEn ?? "",
      pageSeo?.seoTitleAr ?? "",
      locale,
      content.dictionary.meta.pages[page]?.title ?? staticMeta.title,
    ) || staticMeta.title;

  const description =
    pickSeoText(
      pageSeo?.seoDescEn ?? "",
      pageSeo?.seoDescAr ?? "",
      locale,
      content.dictionary.meta.pages[page]?.description ?? staticMeta.description,
    ) || staticMeta.description;

  const keywordsRaw = pickSeoText(
    pageSeo?.seoKeywordsEn ?? "",
    pageSeo?.seoKeywordsAr ?? "",
    locale,
  );

  const path =
    page === "home"
      ? "/"
      : page === "notFound"
        ? "/404"
        : page === "blogFallback"
          ? "/blog"
          : page === "projectFallback"
            ? "/projects"
            : `/${page === "terms" ? "legal/terms-and-conditions" : page === "privacy" ? "legal/privacy-policy" : page}`;

  const meta = buildMetadata({
    locale,
    path,
    title,
    description,
    keywords: keywordsRaw ? keywordsRaw.split(",").map((k) => k.trim()) : [],
    ogImage:
      pageSeo?.ogImageUrl ||
      siteSettings?.ogImageUrl ||
      `${SITE_URL}/malamih-logo.svg`,
    canonical:
      locale === "ar"
        ? pageSeo?.canonicalUrlAr || undefined
        : pageSeo?.canonicalUrlEn || undefined,
    noIndex: pageSeo?.noIndex ?? false,
  });

  return { ...meta, ...overrides };
}

export async function createProjectMetadata(
  locale: Locale,
  title: string,
  description: string,
  slug: string,
  options?: {
    ogImage?: string;
    keywords?: string[];
    noIndex?: boolean;
    canonical?: string;
  },
): Promise<Metadata> {
  const content = await getSiteContent(locale);
  const suffix = content.dictionary.meta.site.title.includes("malamih")
    ? "malamih"
    : "malamih";

  return buildMetadata({
    locale,
    path: `/projects/${slug}`,
    title: `${title} — ${suffix}`,
    description,
    ogImage: options?.ogImage,
    keywords: options?.keywords,
    noIndex: options?.noIndex,
    canonical: options?.canonical,
  });
}

export async function createBlogMetadata(
  locale: Locale,
  post: {
    slug: string;
    title: string;
    seoTitle: string;
    seoDescription: string;
    excerpt: string;
    ogImageUrl: string;
    coverImage: string;
    seoKeywords: string;
    noIndex: boolean;
    canonicalUrl: string;
    author: string;
    publishedAt: string;
    updatedAt?: string;
  },
): Promise<Metadata> {
  const suffix = locale === "ar" ? "ملامح" : "malamih";
  const title = post.seoTitle || `${post.title} — ${suffix}`;

  return buildMetadata({
    locale,
    path: `/blog/${post.slug}`,
    title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords
      ? post.seoKeywords.split(",").map((k) => k.trim())
      : [],
    ogImage: post.ogImageUrl || post.coverImage,
    canonical: post.canonicalUrl || undefined,
    noIndex: post.noIndex,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
    author: post.author,
  });
}

export async function createSiteMetadata(locale: Locale): Promise<Metadata> {
  const content = await getSiteContent(locale);

  return buildMetadata({
    locale,
    path: "/",
    title: content.dictionary.meta.site.title,
    description: content.dictionary.meta.site.description,
  });
}
