import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { ORGANIZATION, SITE_URL } from "@/lib/seo/constants";
import { buildFaviconMetadata } from "@/lib/seo/favicon";
import { absoluteUrl, alternateUrls } from "@/lib/seo/urls";

export type SeoInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  faviconUrl?: string;
};

export function buildMetadata(input: SeoInput): Metadata {
  const {
    locale,
    path,
    title,
    description,
    keywords = [],
    ogImage,
    canonical,
    noIndex = false,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    faviconUrl,
  } = input;

  const alternates = alternateUrls(path);
  const canonicalUrl = canonical ?? alternates[locale];
  const image = ogImage || `${SITE_URL}${ORGANIZATION.logo}`;
  const siteName =
    locale === "ar" ? ORGANIZATION.nameAr : ORGANIZATION.nameEn;

  return {
    ...buildFaviconMetadata(faviconUrl),
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: alternates.en,
        ar: alternates.ar,
        "x-default": alternates.en,
      },
    },
    openGraph: {
      type: type === "article" ? "article" : "website",
      locale: locale === "ar" ? "ar_IQ" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_IQ"],
      url: canonicalUrl,
      title,
      description,
      siteName,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(type === "article" && publishedTime
        ? { publishedTime, modifiedTime, authors: author ? [author] : undefined }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function pickSeoText(
  en: string,
  ar: string,
  locale: Locale,
  fallback = "",
) {
  const value = locale === "ar" ? ar || en : en || ar;
  return value || fallback;
}
