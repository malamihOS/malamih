import { prisma } from "@/lib/prisma";

const DEFAULT_GOOGLE_ANALYTICS_ID = "G-2XC5NT6CBP";

const EMPTY_TRACKING_SETTINGS = {
  googleAnalyticsId: DEFAULT_GOOGLE_ANALYTICS_ID,
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
      googleAnalyticsId:
        settings?.googleAnalyticsId || DEFAULT_GOOGLE_ANALYTICS_ID,
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
