"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/navigation";
import type { Dictionary } from "@/i18n/types";
import type { ContactSettingsData, SiteContent, SiteMedia } from "@/lib/cms/types";

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  t: Dictionary;
  media: SiteMedia;
  projects: SiteContent["projects"];
  contactSettings: ContactSettingsData;
  localizePath: (path: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  content,
  children,
}: {
  locale: Locale;
  content: SiteContent;
  children: ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dictionary: content.dictionary,
      t: content.dictionary,
      media: content.media,
      projects: content.projects,
      contactSettings: content.contactSettings,
      localizePath: (path: string) => localizePath(path, locale),
    }),
    [content, locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }

  return context;
}

export function useTranslations() {
  return useLocale().t;
}

export function useSiteMedia() {
  return useLocale().media;
}

export function useContactSettings() {
  return useLocale().contactSettings;
}
