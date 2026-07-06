import {
  getFallbackSitemapXml,
  getSitemapPages,
  renderSitemapXml,
} from "@/lib/seo/sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const pages = await getSitemapPages();
    const xml = renderSitemapXml(pages);

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation failed:", error);

    return new Response(getFallbackSitemapXml(), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  }
}
