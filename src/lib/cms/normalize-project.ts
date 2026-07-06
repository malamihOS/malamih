import type { CmsProjectGallery } from "@/lib/cms/types";
import type { ProjectContent, ProjectSectionContent } from "@/i18n/types";
import { normalizeUploadUrl } from "@/lib/media-url";

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

export function normalizeProjectSections(
  raw: Partial<ProjectContent["sections"]> | null | undefined,
): ProjectContent["sections"] {
  return {
    introduction: normalizeSection(raw?.introduction, DEFAULT_PROJECT_SECTIONS.introduction.label),
    challenges: normalizeSection(raw?.challenges, DEFAULT_PROJECT_SECTIONS.challenges.label),
    finalThoughts: normalizeSection(raw?.finalThoughts, DEFAULT_PROJECT_SECTIONS.finalThoughts.label),
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
