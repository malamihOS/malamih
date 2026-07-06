import type { MetadataRoute } from "next";
import {
  getFallbackSitemapEntries,
  getSitemapEntries,
} from "@/lib/seo/sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    return await getSitemapEntries();
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return getFallbackSitemapEntries();
  }
}
