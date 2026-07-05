"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import BilingualField from "@/components/admin/BilingualField";
import FormField from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";

type Logo = {
  id: string;
  imageUrl: string;
  nameEn: string;
  nameAr: string;
  link: string;
  sortOrder: number;
  visible: boolean;
};

export default function LogosAdminPage() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await adminFetch<{ logos: Logo[] }>("/api/admin/logos");
    if (fetchError) setError(fetchError);
    else if (data) setLogos(data.logos);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveLogo(logo: Logo) {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = logo.id
      ? logo
      : {
          imageUrl: logo.imageUrl,
          nameEn: logo.nameEn,
          nameAr: logo.nameAr,
          link: logo.link,
          sortOrder: logo.sortOrder,
          visible: logo.visible,
        };

    const method = logo.id ? "PUT" : "POST";
    const { error: saveError } = await adminFetch("/api/admin/logos", {
      method,
      body: JSON.stringify(payload),
    });

    if (saveError) setError(saveError);
    else {
      setSuccess("Logo saved.");
      void load();
    }
    setSaving(false);
  }

  async function deleteLogo(id: string) {
    if (!confirm("Delete this logo?")) return;
    const { error: delError } = await adminFetch(`/api/admin/logos?id=${id}`, { method: "DELETE" });
    if (delError) setError(delError);
    else void load();
  }

  async function reorder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= logos.length) return;
    const next = [...logos];
    [next[index], next[target]] = [next[target], next[index]];
    setLogos(next);
    await adminFetch("/api/admin/logos", {
      method: "PUT",
      body: JSON.stringify({ reorder: next.map((l) => l.id) }),
    });
  }

  function updateLogo(index: number, patch: Partial<Logo>) {
    setLogos((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Client Logos" subtitle="Logo marquee displayed on the homepage." />
        <div className="admin-content">Loading…</div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Client Logos" subtitle="Logo marquee displayed on the homepage.">
        <button
          type="button"
          className="admin-btn admin-btn-primary admin-btn-sm"
          onClick={() =>
            setLogos((p) => [
              ...p,
              {
                id: "",
                imageUrl: "",
                nameEn: "",
                nameAr: "",
                link: "",
                sortOrder: p.length,
                visible: true,
              },
            ])
          }
        >
          Add logo
        </button>
      </AdminHeader>
      <div className="admin-content">
        {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
        {success ? <div className="admin-alert admin-alert-success">{success}</div> : null}

        {logos.map((logo, i) => (
          <div key={logo.id || `new-${i}`} className="admin-card">
            <div className="admin-list-item-header">
              <strong>{logo.nameEn || `Logo ${i + 1}`}</strong>
              <div className="admin-list-item-actions">
                <button type="button" className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm" onClick={() => void reorder(i, -1)} disabled={i === 0}>↑</button>
                <button type="button" className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm" onClick={() => void reorder(i, 1)} disabled={i === logos.length - 1}>↓</button>
                {logo.id ? (
                  <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => void deleteLogo(logo.id)}>Delete</button>
                ) : null}
              </div>
            </div>
            <ImageUpload value={logo.imageUrl} onChange={(url) => updateLogo(i, { imageUrl: url })} />
            <BilingualField label="Name" enName={`nameEn-${i}`} arName={`nameAr-${i}`} enValue={logo.nameEn} arValue={logo.nameAr} onEnChange={(v) => updateLogo(i, { nameEn: v })} onArChange={(v) => updateLogo(i, { nameAr: v })} />
            <FormField label="Link" value={logo.link} onChange={(v) => updateLogo(i, { link: v })} />
            <label className="admin-checkbox-row">
              <input type="checkbox" checked={logo.visible} onChange={(e) => updateLogo(i, { visible: e.target.checked })} />
              Visible
            </label>
            <div style={{ marginTop: "1rem" }}>
              <SaveButton
                label={logo.id ? "Update logo" : "Create logo"}
                loading={saving}
                type="button"
                onClick={() => void saveLogo(logo)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
