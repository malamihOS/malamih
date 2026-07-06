import type { CmsProjectGallery } from "@/lib/cms/types";
import type { Locale } from "@/i18n/config";
import type { ProjectContent, ProjectSectionContent } from "@/i18n/types";
import { normalizeUploadUrl } from "@/lib/media-url";

type StoredProjectSection = {
  label?: string;
  heading?: string;
  paragraphs?: string[];
  labelEn?: string;
  labelAr?: string;
  headingEn?: string;
  headingAr?: string;
  paragraphsEn?: string[];
  paragraphsAr?: string[];
};

const EMPTY_SECTION: ProjectSectionContent = {
  label: "",
  heading: "",
  paragraphs: [],
};

export const DEFAULT_PROJECT_SECTIONS: ProjectContent["sections"] = {
  introduction: { ...EMPTY_SECTION, label: "Introduction" },
  challenges: { ...EMPTY_SECTION, label: "Challenges" },
  finalThoughts: { ...EMPTY_SECTION, label: "Final thoughts" },
};

function pickLocaleText(
  en: string | undefined,
  ar: string | undefined,
  locale: Locale,
  legacy?: string,
): string {
  if (locale === "ar") {
    return ar ?? legacy ?? en ?? "";
  }
  return en ?? legacy ?? ar ?? "";
}

function normalizeSection(
  section: Partial<ProjectSectionContent> | undefined,
  fallbackLabel: string,
): ProjectSectionContent {
  return {
    label: section?.label ?? fallbackLabel,
    heading: section?.heading ?? "",
    paragraphs: Array.isArray(section?.paragraphs) ? section.paragraphs : [],
  };
}

function normalizeStoredSection(
  section: StoredProjectSection | undefined,
  fallbackLabel: string,
  locale: Locale,
): ProjectSectionContent {
  const hasBilingual =
    section?.labelEn !== undefined ||
    section?.labelAr !== undefined ||
    section?.headingEn !== undefined ||
    section?.headingAr !== undefined ||
    section?.paragraphsEn !== undefined ||
    section?.paragraphsAr !== undefined;

  if (!hasBilingual) {
    return normalizeSection(section, fallbackLabel);
  }

  const paragraphs =
    locale === "ar"
      ? (section.paragraphsAr ?? section.paragraphs ?? [])
      : (section.paragraphsEn ?? section.paragraphs ?? []);

  return {
    label:
      pickLocaleText(section.labelEn, section.labelAr, locale, section.label) ||
      fallbackLabel,
    heading: pickLocaleText(
      section.headingEn,
      section.headingAr,
      locale,
      section.heading,
    ),
    paragraphs: Array.isArray(paragraphs) ? paragraphs : [],
  };
}

export function normalizeProjectSections(
  raw: Partial<ProjectContent["sections"]> | null | undefined,
  locale: Locale = "en",
): ProjectContent["sections"] {
  const stored = raw as Partial<Record<keyof ProjectContent["sections"], StoredProjectSection>>;

  return {
    introduction: normalizeStoredSection(
      stored?.introduction,
      DEFAULT_PROJECT_SECTIONS.introduction.label,
      locale,
    ),
    challenges: normalizeStoredSection(
      stored?.challenges,
      DEFAULT_PROJECT_SECTIONS.challenges.label,
      locale,
    ),
    finalThoughts: normalizeStoredSection(
      stored?.finalThoughts,
      DEFAULT_PROJECT_SECTIONS.finalThoughts.label,
      locale,
    ),
  };
}

function normalizeGalleryUrl(url: string | undefined): string {
  return url ? normalizeUploadUrl(url) : "";
}

export function normalizeProjectGallery(
  raw: Partial<CmsProjectGallery> | null | undefined,
  coverImage = "",
): CmsProjectGallery {
  const hero = normalizeGalleryUrl(raw?.hero || coverImage);

  return {
    hero,
    mosaicOne: {
      tall: normalizeGalleryUrl(raw?.mosaicOne?.tall),
      top: normalizeGalleryUrl(raw?.mosaicOne?.top),
      bottom: normalizeGalleryUrl(raw?.mosaicOne?.bottom),
    },
    mosaicTwo: {
      top: normalizeGalleryUrl(raw?.mosaicTwo?.top),
      bottom: normalizeGalleryUrl(raw?.mosaicTwo?.bottom),
      tall: normalizeGalleryUrl(raw?.mosaicTwo?.tall),
    },
    wide: normalizeGalleryUrl(raw?.wide),
  };
}

export function hasGalleryImage(url: string | undefined): url is string {
  return Boolean(url && url.trim());
}
