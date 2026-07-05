import type { MetadataRoute } from "next";
import { getAllPublishedBlogSlugs } from "@/lib/blog/get-posts";
import { getAllPublishedProjectSlugs } from "@/lib/cms/get-content";
import { SITE_URL } from "@/lib/seo/constants";
import { absoluteUrl } from "@/lib/seo/urls";

const STATIC_PATHS = [
  "/",
  "/contact",
  "/projects",
  "/blog",
  "/legal/terms-and-conditions",
  "/legal/privacy-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, blogSlugs] = await Promise.all([
    getAllPublishedProjectSlugs(),
    getAllPublishedBlogSlugs(),
  ]);

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    entries.push({
      url: absoluteUrl(path, "en"),
      lastModified: now,
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : 0.8,
      alternates: {
        languages: {
          en: absoluteUrl(path, "en"),
          ar: absoluteUrl(path, "ar"),
        },
      },
    });
  }

  for (const slug of projectSlugs) {
    entries.push({
      url: absoluteUrl(`/projects/${slug}`, "en"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: absoluteUrl(`/projects/${slug}`, "en"),
          ar: absoluteUrl(`/projects/${slug}`, "ar"),
        },
      },
    });
  }

  for (const slug of blogSlugs) {
    entries.push({
      url: absoluteUrl(`/blog/${slug}`, "en"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: {
        languages: {
          en: absoluteUrl(`/blog/${slug}`, "en"),
          ar: absoluteUrl(`/blog/${slug}`, "ar"),
        },
      },
    });
  }

  return entries;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
