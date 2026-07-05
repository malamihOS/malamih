import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/admin-route";

export async function GET() {
  return withAdmin(
    async () => {
      const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const [
        totalEvents,
        pageViews,
        visits,
        submissions,
        localeBreakdown,
        deviceBreakdown,
        topPages,
        recentEvents,
      ] = await Promise.all([
        prisma.analyticsEvent.count(),
        prisma.analyticsEvent.count({ where: { eventType: "page_view" } }),
        prisma.analyticsEvent.count({ where: { eventType: "visit" } }),
        prisma.contactSubmission.count(),
        prisma.analyticsEvent.groupBy({
          by: ["locale"],
          _count: { id: true },
          where: { createdAt: { gte: since30 } },
        }),
        prisma.analyticsEvent.groupBy({
          by: ["deviceType"],
          _count: { id: true },
          where: { createdAt: { gte: since30 } },
        }),
        prisma.analyticsEvent.groupBy({
          by: ["path"],
          _count: { id: true },
          where: {
            eventType: "page_view",
            createdAt: { gte: since30 },
          },
          orderBy: { _count: { id: "desc" } },
          take: 10,
        }),
        prisma.analyticsEvent.findMany({
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
      ]);

      const blogPaths = topPages.filter((p) => p.path.includes("/blog/"));
      const projectPaths = topPages.filter((p) => p.path.includes("/projects/"));

      const referrers = await prisma.analyticsEvent.groupBy({
        by: ["referrer"],
        _count: { id: true },
        where: {
          createdAt: { gte: since30 },
          referrer: { not: "" },
        },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      });

      const settings = await prisma.siteSettings.findFirst();
      const trackingConfigured = Boolean(
        settings?.googleAnalyticsId ||
          settings?.googleTagManagerId ||
          settings?.metaPixelId,
      );

      return NextResponse.json({
        summary: {
          totalEvents,
          pageViews,
          visits,
          submissions,
          trackingConfigured,
        },
        localeBreakdown: localeBreakdown.map((row) => ({
          locale: row.locale,
          count: row._count.id,
        })),
        deviceBreakdown: deviceBreakdown.map((row) => ({
          device: row.deviceType,
          count: row._count.id,
        })),
        topPages: topPages.map((row) => ({
          path: row.path,
          views: row._count.id,
        })),
        topBlogPosts: blogPaths.map((row) => ({
          path: row.path,
          views: row._count.id,
        })),
        topProjects: projectPaths.map((row) => ({
          path: row.path,
          views: row._count.id,
        })),
        trafficSources: referrers.map((row) => ({
          referrer: row.referrer,
          count: row._count.id,
        })),
        recentEvents,
        placeholders: {
          googleAnalytics: !settings?.googleAnalyticsId,
          metaPixel: !settings?.metaPixelId,
          note: "Configure tracking IDs in Integrations to enable external analytics.",
        },
      });
    },
    "analytics",
  );
}
