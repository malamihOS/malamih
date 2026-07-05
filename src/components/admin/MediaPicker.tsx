"use client";

import { useCallback, useEffect, useState } from "react";
import { normalizeUploadUrl } from "@/lib/media-url";

type MediaPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
};

type MediaFile = {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
};

export default function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (res.ok) setFiles(data.files ?? []);
    } catch {
      setFiles([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  if (!open) return null;

  return (
    <div className="admin-dialog-overlay" role="presentation" onClick={onClose}>
      <div
        className="admin-dialog admin-dialog-wide"
        role="dialog"
        aria-label="Media library"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="admin-dialog-title">Choose from media library</h3>
        {loading ? (
          <p>Loading…</p>
        ) : files.length === 0 ? (
          <p className="admin-inline-hint">
            No files in library. Upload files in Media Library first.
          </p>
        ) : (
          <div className="admin-media-picker-grid">
            {files.map((file) => (
              <button
                key={file.id}
                type="button"
                className="admin-media-picker-item"
                onClick={() => {
                  onSelect(normalizeUploadUrl(file.url));
                  onClose();
                }}
              >
                {file.mimeType.startsWith("video/") ? (
                  <video src={normalizeUploadUrl(file.url)} muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={normalizeUploadUrl(file.url)}
                    alt={file.originalName}
                    loading="lazy"
                  />
                )}
                <span>{file.originalName || file.url}</span>
              </button>
            ))}
          </div>
        )}
        <div className="admin-dialog-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
