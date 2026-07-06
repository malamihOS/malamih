import { NextResponse } from "next/server";
import { buildSitemapXml, buildStaticSitemapXml } from "@/lib/seo/sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const XML_HEADERS = {
  "Content-Type": "text/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
  "X-Content-Type-Options": "nosniff",
};

export async function GET() {
  try {
    const xml = await buildSitemapXml();
    return new NextResponse(xml, {
      status: 200,
      headers: XML_HEADERS,
    });
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return new NextResponse(buildStaticSitemapXml(), {
      status: 200,
      headers: XML_HEADERS,
    });
  }
}
