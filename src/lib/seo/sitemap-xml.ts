import type { MetadataRoute } from "next";
import { getAllPublishedBlogSlugs } from "@/lib/blog/get-posts";
import { getAllPublishedProjectSlugs } from "@/lib/cms/get-content";
import { absoluteUrl } from "@/lib/seo/urls";

const STATIC_PATHS = [
  "/",
  "/contact",
  "/projects",
  "/blog",
  "/legal/terms-and-conditions",
  "/legal/privacy-policy",
] as const;

export type SitemapPage = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  lastModified: Date;
};

export async function getSitemapPages(): Promise<SitemapPage[]> {
  const [projectSlugs, blogSlugs] = await Promise.all([
    getAllPublishedProjectSlugs(),
    getAllPublishedBlogSlugs(),
  ]);

  const now = new Date();
  const pages: SitemapPage[] = STATIC_PATHS.map((path) => ({
    path,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

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

  return pages;
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

function renderAlternateLinks(path: string) {
  const en = absoluteUrl(path, "en");
  const ar = absoluteUrl(path, "ar");

  return [
    `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}" />`,
    `<xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(ar)}" />`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(en)}" />`,
  ].join("");
}

export function renderSitemapXml(pages: SitemapPage[]) {
  const urls = pages
    .map((page) => {
      const loc = absoluteUrl(page.path, "en");

      return [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${formatLastModified(page.lastModified)}</lastmod>`,
        `    <changefreq>${page.changeFrequency}</changefreq>`,
        `    <priority>${page.priority.toFixed(1)}</priority>`,
        `    ${renderAlternateLinks(page.path)}`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    "</urlset>",
  ].join("\n");
}
