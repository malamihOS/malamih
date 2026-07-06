import type { CmsProjectGallery } from "@/lib/cms/types";

export const GALLERY_IMAGE_KEYS = [
  "cover",
  "hero",
  "mosaicOne.tall",
  "mosaicOne.top",
  "mosaicOne.bottom",
  "mosaicTwo.top",
  "mosaicTwo.bottom",
  "mosaicTwo.tall",
  "wide",
] as const;

export type GalleryImageKey = (typeof GALLERY_IMAGE_KEYS)[number];

export type GalleryPositions = Partial<Record<GalleryImageKey, string>>;

export const DEFAULT_OBJECT_POSITION = "50% 50%";

export const GALLERY_IMAGE_ASPECT: Record<GalleryImageKey, string> = {
  cover: "628 / 660",
  hero: "1280 / 1242",
  "mosaicOne.tall": "632 / 736",
  "mosaicOne.top": "632 / 360",
  "mosaicOne.bottom": "632 / 360",
  "mosaicTwo.top": "632 / 360",
  "mosaicTwo.bottom": "632 / 360",
  "mosaicTwo.tall": "632 / 736",
  wide: "1280 / 512",
};

const POSITION_PRESETS: Record<string, { x: number; y: number }> = {
  center: { x: 50, y: 50 },
  "center center": { x: 50, y: 50 },
  top: { x: 50, y: 0 },
  "center top": { x: 50, y: 0 },
  bottom: { x: 50, y: 100 },
  "center bottom": { x: 50, y: 100 },
  left: { x: 0, y: 50 },
  "left center": { x: 0, y: 50 },
  right: { x: 100, y: 50 },
  "right center": { x: 100, y: 50 },
  "left top": { x: 0, y: 0 },
  "right top": { x: 100, y: 0 },
  "left bottom": { x: 0, y: 100 },
  "right bottom": { x: 100, y: 100 },
};

export function parseObjectPosition(value: string | undefined): { x: number; y: number } {
  const normalized = value?.trim().toLowerCase() ?? "";
  if (!normalized) return { x: 50, y: 50 };

  const preset = POSITION_PRESETS[normalized];
  if (preset) return preset;

  const percentMatch = normalized.match(
    /(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/,
  );
  if (percentMatch) {
    return {
      x: Number(percentMatch[1]),
      y: Number(percentMatch[2]),
    };
  }

  return { x: 50, y: 50 };
}

export function formatObjectPosition(x: number, y: number): string {
  return `${Math.round(x)}% ${Math.round(y)}%`;
}

export function nudgeObjectPosition(
  value: string | undefined,
  deltaX: number,
  deltaY: number,
): string {
  const current = parseObjectPosition(value);
  return formatObjectPosition(
    Math.min(100, Math.max(0, current.x + deltaX)),
    Math.min(100, Math.max(0, current.y + deltaY)),
  );
}

export function createEmptyGalleryPositions(): Record<GalleryImageKey, string> {
  return Object.fromEntries(
    GALLERY_IMAGE_KEYS.map((key) => [key, DEFAULT_OBJECT_POSITION]),
  ) as Record<GalleryImageKey, string>;
}

export function normalizeGalleryPositions(
  raw: GalleryPositions | null | undefined,
): Record<GalleryImageKey, string> {
  const positions = createEmptyGalleryPositions();

  if (!raw) return positions;

  for (const key of GALLERY_IMAGE_KEYS) {
    const value = raw[key]?.trim();
    if (value) {
      positions[key] = formatObjectPosition(
        parseObjectPosition(value).x,
        parseObjectPosition(value).y,
      );
    }
  }

  return positions;
}

export function serializeGalleryPositions(
  positions: Record<GalleryImageKey, string>,
): GalleryPositions | undefined {
  const cleaned: GalleryPositions = {};

  for (const key of GALLERY_IMAGE_KEYS) {
    const value = positions[key]?.trim();
    if (value && value !== DEFAULT_OBJECT_POSITION) {
      cleaned[key] = formatObjectPosition(
        parseObjectPosition(value).x,
        parseObjectPosition(value).y,
      );
    }
  }

  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

export function getGalleryImagePosition(
  gallery: Pick<CmsProjectGallery, "positions">,
  key: GalleryImageKey,
): string {
  const value = gallery.positions?.[key];
  return value?.trim() || DEFAULT_OBJECT_POSITION;
}
