import type { Metadata } from "next";

const ICONS = "/icons";

export const FAVICON_METADATA: Pick<
  Metadata,
  "icons" | "manifest" | "themeColor" | "other"
> = {
  icons: {
    icon: [
      { url: `${ICONS}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
      { url: `${ICONS}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
      { url: `${ICONS}/favicon-96x96.png`, sizes: "96x96", type: "image/png" },
      {
        url: `${ICONS}/android-icon-192x192.png`,
        sizes: "192x192",
        type: "image/png",
      },
    ],
    shortcut: `${ICONS}/favicon.ico`,
    apple: [
      { url: `${ICONS}/apple-icon-57x57.png`, sizes: "57x57", type: "image/png" },
      { url: `${ICONS}/apple-icon-60x60.png`, sizes: "60x60", type: "image/png" },
      { url: `${ICONS}/apple-icon-72x72.png`, sizes: "72x72", type: "image/png" },
      { url: `${ICONS}/apple-icon-76x76.png`, sizes: "76x76", type: "image/png" },
      {
        url: `${ICONS}/apple-icon-114x114.png`,
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: `${ICONS}/apple-icon-120x120.png`,
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: `${ICONS}/apple-icon-144x144.png`,
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: `${ICONS}/apple-icon-152x152.png`,
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: `${ICONS}/apple-icon-180x180.png`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: `${ICONS}/manifest.json`,
  themeColor: "#ffffff",
  other: {
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": `${ICONS}/ms-icon-144x144.png`,
    "msapplication-config": `${ICONS}/browserconfig.xml`,
  },
};

export function buildFaviconMetadata(
  faviconUrl?: string | null,
): Pick<Metadata, "icons" | "manifest" | "themeColor" | "other"> {
  if (!faviconUrl) {
    return FAVICON_METADATA;
  }

  return {
    icons: {
      icon: [{ url: faviconUrl }],
      shortcut: faviconUrl,
      apple: [{ url: faviconUrl }],
    },
    manifest: FAVICON_METADATA.manifest,
    themeColor: FAVICON_METADATA.themeColor,
    other: FAVICON_METADATA.other,
  };
}
