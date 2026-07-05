"use client";

import { useRef, useState } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import { normalizeUploadUrl } from "@/lib/media-url";

type ImageUploadProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  hint?: string;
};

export default function ImageUpload({
  label = "Image",
  value,
  onChange,
  accept = "image/*,video/mp4,video/webm",
  hint,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const previewUrl = value ? normalizeUploadUrl(value) : "";
  const isVideo = previewUrl.match(/\.(mp4|webm)(\?|$)/i) || value.includes("video");

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-form-group admin-image-upload">
      <label className="admin-label">{label}</label>
      <div className="admin-image-preview">
        {value ? (
          isVideo ? (
            <video src={previewUrl} controls muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" />
          )
        ) : (
          <div className="admin-image-preview-empty">No file</div>
        )}
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={() => setPickerOpen(true)}
        >
          Media library
        </button>
        {value ? (
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => onChange("")}
          >
            Remove
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      <input
        type="url"
        className="admin-input"
        placeholder="Or paste URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label} URL`}
      />
      {hint ? <p className="admin-inline-hint">{hint}</p> : null}
      {error ? <p className="admin-field-error" role="alert">{error}</p> : null}
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={onChange}
      />
    </div>
  );
}
