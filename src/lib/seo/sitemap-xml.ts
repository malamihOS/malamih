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

type SitemapPage = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  lastModified: Date;
};

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

  let projectSlugs: string[] = [];
  let blogSlugs: string[] = [];

  try {
    [projectSlugs, blogSlugs] = await Promise.all([
      getAllPublishedProjectSlugs(),
      getAllPublishedBlogSlugs(),
    ]);
  } catch {
    // Keep static pages even if CMS lookups fail.
  }

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

function toSitemapEntry(page: SitemapPage): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(page.path, "en"),
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates: {
      languages: {
        en: absoluteUrl(page.path, "en"),
        ar: absoluteUrl(page.path, "ar"),
      },
    },
  };
}

export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const pages = await getSitemapPages();
  return pages.map(toSitemapEntry);
}

export function getFallbackSitemapEntries(): MetadataRoute.Sitemap {
  return buildStaticPages().map(toSitemapEntry);
}
