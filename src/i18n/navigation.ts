import type { Locale } from "./config";
import { defaultLocale } from "./config";

export function localizePath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (locale === defaultLocale) {
    return normalized === "/ar" ? "/" : normalized.replace(/^\/ar(?=\/|$)/, "") || "/";
  }

  if (normalized === "/") {
    return "/ar";
  }

  if (normalized.startsWith("/ar")) {
    return normalized;
  }

  return `/ar${normalized}`;
}

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en";
}

export function stripLocaleFromPathname(pathname: string): string {
  if (pathname === "/ar") {
    return "/";
  }

  if (pathname.startsWith("/ar/")) {
    return pathname.slice(3) || "/";
  }

  return pathname;
}

export function switchLocalePath(pathname: string, locale: Locale): string {
  return localizePath(stripLocaleFromPathname(pathname), locale);
}
