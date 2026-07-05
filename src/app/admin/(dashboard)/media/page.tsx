"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/ToastProvider";
import { adminFetch } from "@/lib/admin-client";
import { normalizeUploadUrl } from "@/lib/media-url";

type MediaFile = {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  altEn: string;
  altAr: string;
  createdAt: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await adminFetch<{ files: MediaFile[] }>(
      "/api/admin/media",
    );
    if (fetchError) setError(fetchError);
    else if (data) setFiles(data.files);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleUpload(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    const { data, error: uploadError } = await adminFetch<{ media: MediaFile }>(
      "/api/admin/media",
      { method: "POST", body: formData },
    );

    if (uploadError) {
      setError(uploadError);
      showToast(uploadError, "error");
    } else if (data) {
      setFiles((prev) => [data.media, ...prev]);
      showToast("File uploaded", "success");
    }
    setUploading(false);
  }

  async function copyUrl(url: string) {
    try {
      const normalized = normalizeUploadUrl(url);
      await navigator.clipboard.writeText(
        normalized.startsWith("http")
          ? normalized
          : `${window.location.origin}${normalized}`,
      );
      showToast("URL copied to clipboard", "success");
    } catch {
      showToast("Failed to copy URL", "error");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const { error: delError } = await adminFetch(`/api/admin/media/${deleteId}`, {
      method: "DELETE",
    });
    if (delError) {
      showToast(delError, "error");
    } else {
      setFiles((prev) => prev.filter((f) => f.id !== deleteId));
      showToast("File deleted", "success");
    }
    setDeleteId(null);
  }

  async function saveRename(id: string) {
    const { error: saveError } = await adminFetch(`/api/admin/media/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ originalName: renameValue }),
    });
    if (saveError) {
      showToast(saveError, "error");
    } else {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, originalName: renameValue } : f)),
      );
      showToast("File renamed", "success");
    }
    setRenamingId(null);
  }

  return (
    <>
      <AdminHeader title="Media Library" />
      <div className="admin-content">
        <div className="admin-card">
          <div className="admin-form-actions" style={{ marginTop: 0 }}>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? "Uploading…" : "Upload file"}
            </button>
            <p className="admin-inline-hint" style={{ margin: 0 }}>
              JPEG, PNG, WebP, GIF, SVG (max 10MB) · MP4, WebM (max 50MB)
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm"
            onChange={(e) => {
              void handleUpload(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}

        {loading ? (
          <p>Loading…</p>
        ) : files.length === 0 ? (
          <div className="admin-empty-state">
            <p>No media files yet. Upload images or videos to use across the CMS.</p>
          </div>
        ) : (
          <div className="admin-media-grid">
            {files.map((file) => {
              const isVideo = file.mimeType.startsWith("video/");
              return (
                <article key={file.id} className="admin-media-card">
                  <div className="admin-media-preview">
                    {isVideo ? (
                      <video src={normalizeUploadUrl(file.url)} muted />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={normalizeUploadUrl(file.url)}
                        alt={file.altEn || file.originalName}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="admin-media-meta">
                    {renamingId === file.id ? (
                      <div className="admin-media-rename">
                        <input
                          className="admin-input"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          aria-label="File name"
                        />
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm admin-btn-primary"
                          onClick={() => void saveRename(file.id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm admin-btn-secondary"
                          onClick={() => setRenamingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="admin-media-name" title={file.originalName}>
                        {file.originalName || file.filename}
                      </p>
                    )}
                    <p className="admin-inline-hint">
                      {formatSize(file.size)} · {file.mimeType || "unknown"}
                    </p>
                    <div className="admin-media-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                        onClick={() => void copyUrl(file.url)}
                      >
                        Copy URL
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                        onClick={() => {
                          setRenamingId(file.id);
                          setRenameValue(file.originalName || file.filename);
                        }}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => setDeleteId(file.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete file?"
        message="This will permanently remove the file from the media library and disk."
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
