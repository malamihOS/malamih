"use client";

import {
  DEFAULT_OBJECT_POSITION,
  formatObjectPosition,
  nudgeObjectPosition,
  parseObjectPosition,
} from "@/lib/cms/gallery-position";
import { normalizeUploadUrl } from "@/lib/media-url";

type ProjectImagePositionProps = {
  imageUrl: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: string;
};

export default function ProjectImagePosition({
  imageUrl,
  value,
  onChange,
  aspectRatio = "4 / 3",
}: ProjectImagePositionProps) {
  const previewUrl = normalizeUploadUrl(imageUrl);
  const { x, y } = parseObjectPosition(value);
  const objectPosition = value || DEFAULT_OBJECT_POSITION;

  function updatePosition(nextX: number, nextY: number) {
    onChange(formatObjectPosition(nextX, nextY));
  }

  return (
    <div className="admin-image-position">
      <div className="admin-image-position-head">
        <span className="admin-image-position-label">Image position</span>
        <span className="admin-image-position-value">{objectPosition}</span>
      </div>

      <div
        className="admin-image-position-preview"
        style={{ aspectRatio }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt=""
          style={{ objectPosition }}
        />
      </div>

      <div className="admin-image-position-controls">
        <div className="admin-image-position-arrows" aria-label="Nudge image position">
          <span />
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm"
            onClick={() => onChange(nudgeObjectPosition(value, 0, -5))}
            aria-label="Move up"
          >
            ↑
          </button>
          <span />
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm"
            onClick={() => onChange(nudgeObjectPosition(value, -5, 0))}
            aria-label="Move left"
          >
            ←
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm"
            onClick={() => onChange(DEFAULT_OBJECT_POSITION)}
            aria-label="Reset to center"
          >
            ⊙
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm"
            onClick={() => onChange(nudgeObjectPosition(value, 5, 0))}
            aria-label="Move right"
          >
            →
          </button>
          <span />
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm"
            onClick={() => onChange(nudgeObjectPosition(value, 0, 5))}
            aria-label="Move down"
          >
            ↓
          </button>
          <span />
        </div>

        <label className="admin-image-position-slider">
          <span>Left / Right</span>
          <input
            type="range"
            min={0}
            max={100}
            value={x}
            onChange={(event) => updatePosition(Number(event.target.value), y)}
          />
        </label>
        <label className="admin-image-position-slider">
          <span>Up / Down</span>
          <input
            type="range"
            min={0}
            max={100}
            value={y}
            onChange={(event) => updatePosition(x, Number(event.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
