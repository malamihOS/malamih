import { getAllPublishedBlogSlugs } from "@/lib/blog/get-posts";
import { getAllPublishedProjectSlugs } from "@/lib/cms/get-content";
import { SITE_URL } from "@/lib/seo/constants";
import { localizePath } from "@/i18n/navigation";

const STATIC_PATHS = [
  "/",
  "/contact",
  "/projects",
  "/blog",
  "/legal/terms-and-conditions",
  "/legal/privacy-policy",
] as const;

type SitemapPage = {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  lastModified: Date;
};

function siteBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL || "https://malamih.net").replace(
    /\/$/,
    "",
  );
}

function absoluteUrl(path: string, locale: "en" | "ar" = "en") {
  const localized = localizePath(path, locale);
  const normalized = localized.startsWith("/") ? localized : `/${localized}`;
  return `${siteBaseUrl()}${normalized}`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatLastModified(date: Date) {
  return date.toISOString().slice(0, 10);
}

function buildStaticPages(now = new Date()): SitemapPage[] {
  return STATIC_PATHS.map((path) => ({
    path,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}

async function getSitemapPages(): Promise<SitemapPage[]> {
  const now = new Date();
  const pages = buildStaticPages(now);

  try {
    const [projectSlugs, blogSlugs] = await Promise.all([
      getAllPublishedProjectSlugs(),
      getAllPublishedBlogSlugs(),
    ]);

    for (const slug of projectSlugs) {
      pages.push({
        path: `/projects/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    for (const slug of blogSlugs) {
      pages.push({
        path: `/blog/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }
  } catch {
    // Static pages are enough if CMS lookups fail.
  }

  return pages;
}

function renderUrlEntry(page: SitemapPage) {
  const loc = absoluteUrl(page.path, "en");
  const en = absoluteUrl(page.path, "en");
  const ar = absoluteUrl(page.path, "ar");

  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${formatLastModified(page.lastModified)}</lastmod>`,
    `    <changefreq>${page.changeFrequency}</changefreq>`,
    `    <priority>${page.priority.toFixed(1)}</priority>`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}" />`,
    `    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(ar)}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(en)}" />`,
    "  </url>",
  ].join("\n");
}

export function renderSitemapXml(pages: SitemapPage[]) {
  const body = pages.map(renderUrlEntry).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    body,
    "</urlset>",
  ].join("\n");
}

export function buildStaticSitemapXml() {
  return renderSitemapXml(buildStaticPages());
}

export async function buildSitemapXml() {
  const pages = await getSitemapPages();
  return renderSitemapXml(pages);
}
