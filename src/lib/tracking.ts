import { prisma } from "@/lib/prisma";

const EMPTY_TRACKING_SETTINGS = {
  googleAnalyticsId: "",
  googleTagManagerId: "",
  metaPixelId: "",
  tiktokPixelId: "",
  linkedInInsightTag: "",
  googleSiteVerification: "",
  metaDomainVerification: "",
};

export async function getTrackingSettings() {
  try {
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
  } catch {
    return EMPTY_TRACKING_SETTINGS;
  }
}
