import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/seo/constants";

export function absoluteUrl(path: string, locale: Locale = "en") {
  const localized = localizePath(path, locale);
  const normalized = localized.startsWith("/") ? localized : `/${localized}`;
  return `${SITE_URL.replace(/\/$/, "")}${normalized}`;
}

export function alternateUrls(path: string) {
  return {
    en: absoluteUrl(path, "en"),
    ar: absoluteUrl(path, "ar"),
  };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDateIso(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toISOString();
}
