import type { CmsProjectGallery } from "@/lib/cms/types";
import {
  createEmptyGalleryPositions,
  normalizeGalleryPositions,
  serializeGalleryPositions,
  type GalleryImageKey,
} from "@/lib/cms/gallery-position";
import { DEFAULT_PROJECT_SECTIONS } from "@/lib/cms/normalize-project";

export const PROJECT_SECTION_KEYS = [
  "introduction",
  "challenges",
  "finalThoughts",
] as const;

export type ProjectSectionKey = (typeof PROJECT_SECTION_KEYS)[number];

export const PROJECT_SECTION_META: Record<
  ProjectSectionKey,
  { title: string; defaultLabelEn: string; defaultLabelAr: string }
> = {
  introduction: {
    title: "Introduction",
    defaultLabelEn: DEFAULT_PROJECT_SECTIONS.introduction.label,
    defaultLabelAr: "مقدمة",
  },
  challenges: {
    title: "Challenges",
    defaultLabelEn: DEFAULT_PROJECT_SECTIONS.challenges.label,
    defaultLabelAr: "التحديات",
  },
  finalThoughts: {
    title: "Final thoughts",
    defaultLabelEn: DEFAULT_PROJECT_SECTIONS.finalThoughts.label,
    defaultLabelAr: "خاتمة",
  },
};

export type GalleryFormState = {
  hero: string;
  mosaicOne: { tall: string; top: string; bottom: string };
  mosaicTwo: { top: string; bottom: string; tall: string };
  wide: string;
  positions: Record<GalleryImageKey, string>;
};

export type SectionFormState = {
  labelEn: string;
  labelAr: string;
  headingEn: string;
  headingAr: string;
  paragraphsEn: string;
  paragraphsAr: string;
};

export type SectionsFormState = Record<ProjectSectionKey, SectionFormState>;

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

type StoredProjectSections = Partial<Record<ProjectSectionKey, StoredProjectSection>>;

export const EMPTY_GALLERY: GalleryFormState = {
  hero: "",
  mosaicOne: { tall: "", top: "", bottom: "" },
  mosaicTwo: { top: "", bottom: "", tall: "" },
  wide: "",
  positions: createEmptyGalleryPositions(),
};

export function paragraphsToText(paragraphs: string[]): string {
  return paragraphs.join("\n\n");
}

export function paragraphsFromText(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function parseJsonRecord<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseGalleryFromProject(
  galleryJson: string | null | undefined,
  coverImage = "",
): GalleryFormState {
  const raw = parseJsonRecord<Partial<CmsProjectGallery>>(galleryJson, {});

  return {
    hero: raw.hero ?? coverImage ?? "",
    mosaicOne: {
      tall: raw.mosaicOne?.tall ?? "",
      top: raw.mosaicOne?.top ?? "",
      bottom: raw.mosaicOne?.bottom ?? "",
    },
    mosaicTwo: {
      top: raw.mosaicTwo?.top ?? "",
      bottom: raw.mosaicTwo?.bottom ?? "",
      tall: raw.mosaicTwo?.tall ?? "",
    },
    wide: raw.wide ?? "",
    positions: normalizeGalleryPositions(raw.positions),
  };
}

function parseSectionForm(
  raw: StoredProjectSection | undefined,
  defaultLabelEn: string,
  defaultLabelAr: string,
): SectionFormState {
  const hasBilingual =
    raw?.labelEn !== undefined ||
    raw?.labelAr !== undefined ||
    raw?.headingEn !== undefined ||
    raw?.headingAr !== undefined ||
    raw?.paragraphsEn !== undefined ||
    raw?.paragraphsAr !== undefined;

  if (hasBilingual) {
    return {
      labelEn: raw?.labelEn ?? raw?.label ?? defaultLabelEn,
      labelAr: raw?.labelAr ?? defaultLabelAr,
      headingEn: raw?.headingEn ?? raw?.heading ?? "",
      headingAr: raw?.headingAr ?? "",
      paragraphsEn: paragraphsToText(raw?.paragraphsEn ?? raw?.paragraphs ?? []),
      paragraphsAr: paragraphsToText(raw?.paragraphsAr ?? []),
    };
  }

  return {
    labelEn: raw?.label ?? defaultLabelEn,
    labelAr: defaultLabelAr,
    headingEn: raw?.heading ?? "",
    headingAr: "",
    paragraphsEn: paragraphsToText(raw?.paragraphs ?? []),
    paragraphsAr: "",
  };
}

export function parseSectionsFromProject(
  sectionsJson: string | null | undefined,
): SectionsFormState {
  const raw = parseJsonRecord<StoredProjectSections>(sectionsJson, {});

  return {
    introduction: parseSectionForm(
      raw.introduction,
      PROJECT_SECTION_META.introduction.defaultLabelEn,
      PROJECT_SECTION_META.introduction.defaultLabelAr,
    ),
    challenges: parseSectionForm(
      raw.challenges,
      PROJECT_SECTION_META.challenges.defaultLabelEn,
      PROJECT_SECTION_META.challenges.defaultLabelAr,
    ),
    finalThoughts: parseSectionForm(
      raw.finalThoughts,
      PROJECT_SECTION_META.finalThoughts.defaultLabelEn,
      PROJECT_SECTION_META.finalThoughts.defaultLabelAr,
    ),
  };
}

export function serializeGallery(
  gallery: GalleryFormState,
  coverImage = "",
): CmsProjectGallery {
  const hero = gallery.hero || coverImage;

  return {
    hero,
    mosaicOne: { ...gallery.mosaicOne },
    mosaicTwo: { ...gallery.mosaicTwo },
    wide: gallery.wide,
    positions: serializeGalleryPositions(gallery.positions),
  };
}

function serializeSection(section: SectionFormState): StoredProjectSection {
  return {
    labelEn: section.labelEn,
    labelAr: section.labelAr,
    headingEn: section.headingEn,
    headingAr: section.headingAr,
    paragraphsEn: paragraphsFromText(section.paragraphsEn),
    paragraphsAr: paragraphsFromText(section.paragraphsAr),
  };
}

export function serializeSections(sections: SectionsFormState): StoredProjectSections {
  return {
    introduction: serializeSection(sections.introduction),
    challenges: serializeSection(sections.challenges),
    finalThoughts: serializeSection(sections.finalThoughts),
  };
}

export function parseServicesField(value: string | null | undefined): string {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map(String).join(", ");
    }
  } catch {
    // fall through
  }
  return value;
}

export function serializeServicesField(value: string): string[] {
  return value
    .split(",")
    .map((service) => service.trim())
    .filter(Boolean);
}
