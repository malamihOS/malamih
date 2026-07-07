import type { MetadataRoute } from "next";
import type { Locale } from "@/i18n/config";
import {
  getAllPublishedBlogSlugs,
  getBlogCategories,
  getBlogTags,
} from "@/lib/blog/get-posts";
import { getAllPublishedProjectSlugs } from "@/lib/cms/get-content";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo/urls";

const STATIC_PAGES: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/projects", changeFrequency: "monthly", priority: 0.8 },
  { path: "/proposal", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/legal/privacy-policy", changeFrequency: "yearly", priority: 0.5 },
  { path: "/legal/terms-and-conditions", changeFrequency: "yearly", priority: 0.5 },
];

const LOCALES: Locale[] = ["en", "ar"];

function createEntry(
  path: string,
  locale: Locale,
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>,
  priority: number,
  lastModified: Date,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path, locale),
    lastModified,
    changeFrequency,
    priority,
  };
}

function createLocalizedEntries(
  path: string,
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>,
  priority: number,
  lastModified: Date,
): MetadataRoute.Sitemap {
  return LOCALES.map((locale) =>
    createEntry(path, locale, changeFrequency, priority, lastModified),
  );
}

export function getFallbackSitemapEntries(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_PAGES.flatMap((page) =>
    createLocalizedEntries(page.path, page.changeFrequency, page.priority, now),
  );
}

async function getResourceSlugs(): Promise<string[]> {
  try {
    const resources = await prisma.leadMagnet.findMany({
      where: { status: "active" },
      select: { slug: true },
    });
    return resources.map((resource) => resource.slug);
  } catch {
    return [];
  }
}

export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PAGES.flatMap((page) =>
    createLocalizedEntries(page.path, page.changeFrequency, page.priority, now),
  );

  const [projectResult, blogResult, categoryResult, tagResult, resourceResult] =
    await Promise.allSettled([
      getAllPublishedProjectSlugs(),
      getAllPublishedBlogSlugs(),
      getBlogCategories("en"),
      getBlogTags("en"),
      getResourceSlugs(),
    ]);

  const projectSlugs =
    projectResult.status === "fulfilled" ? projectResult.value : [];
  const blogSlugs = blogResult.status === "fulfilled" ? blogResult.value : [];
  const categories =
    categoryResult.status === "fulfilled" ? categoryResult.value : [];
  const tags = tagResult.status === "fulfilled" ? tagResult.value : [];
  const resourceSlugs =
    resourceResult.status === "fulfilled" ? resourceResult.value : [];

  for (const slug of projectSlugs) {
    entries.push(
      ...createLocalizedEntries(`/projects/${slug}`, "monthly", 0.7, now),
    );
  }

  for (const slug of blogSlugs) {
    entries.push(
      ...createLocalizedEntries(`/blog/${slug}`, "weekly", 0.75, now),
    );
  }

  for (const category of categories) {
    entries.push(
      ...createLocalizedEntries(
        `/blog/category/${category.slug}`,
        "weekly",
        0.6,
        now,
      ),
    );
  }

  for (const { tag } of tags) {
    const encodedTag = encodeURIComponent(tag.toLowerCase());
    entries.push(
      ...createLocalizedEntries(`/blog/tag/${encodedTag}`, "weekly", 0.55, now),
    );
  }

  for (const slug of resourceSlugs) {
    entries.push(
      ...createLocalizedEntries(`/resources/${slug}`, "monthly", 0.65, now),
    );
  }

  return entries;
}
