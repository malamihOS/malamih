import { prisma } from "@/lib/prisma";

export async function getTrackingSettings() {
  const settings = await prisma.siteSettings.findFirst();
  return {
    googleAnalyticsId: settings?.googleAnalyticsId ?? "",
    googleTagManagerId: settings?.googleTagManagerId ?? "",
    metaPixelId: settings?.metaPixelId ?? "",
    tiktokPixelId: settings?.tiktokPixelId ?? "",
    linkedInInsightTag: settings?.linkedInInsightTag ?? "",
    googleSiteVerification: settings?.googleSiteVerification ?? "",
    metaDomainVerification: settings?.metaDomainVerification ?? "",
  };
}
