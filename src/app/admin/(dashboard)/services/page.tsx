"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import BilingualField from "@/components/admin/BilingualField";
import FormField from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch, parseJsonField } from "@/lib/admin-client";

type Service = {
  id: string;
  number: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  tagsEn: string;
  tagsAr: string;
  iconUrl: string;
  sortOrder: number;
  visible: boolean;
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await adminFetch<{ services: Service[] }>("/api/admin/services");
    if (fetchError) setError(fetchError);
    else if (data) setServices(data.services);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function updateService(index: number, patch: Partial<Service>) {
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  async function saveService(service: Service) {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      ...(service.id ? { id: service.id } : {}),
      number: service.number,
      titleEn: service.titleEn,
      titleAr: service.titleAr,
      descriptionEn: service.descriptionEn,
      descriptionAr: service.descriptionAr,
      tagsEn: parseJsonField<string[]>(service.tagsEn, []),
      tagsAr: parseJsonField<string[]>(service.tagsAr, []),
      iconUrl: service.iconUrl,
      sortOrder: service.sortOrder,
      visible: service.visible,
    };

    const method = service.id ? "PUT" : "POST";
    const { error: saveError } = await adminFetch("/api/admin/services", {
      method,
      body: JSON.stringify(payload),
    });

    if (saveError) setError(saveError);
    else {
      setSuccess("Service saved.");
      void load();
    }
    setSaving(false);
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service?")) return;
    const { error: delError } = await adminFetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    if (delError) setError(delError);
    else void load();
  }

  async function reorder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= services.length) return;
    const next = [...services];
    [next[index], next[target]] = [next[target], next[index]];
    setServices(next);
    await adminFetch("/api/admin/services", {
      method: "PUT",
      body: JSON.stringify({ reorder: next.map((s) => s.id) }),
    });
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Services" />
        <div className="admin-content">Loading…</div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Services">
        <button
          type="button"
          className="admin-btn admin-btn-primary admin-btn-sm"
          onClick={() =>
            setServices((p) => [
              ...p,
              {
                id: "",
                number: String(p.length + 1).padStart(2, "0"),
                titleEn: "",
                titleAr: "",
                descriptionEn: "",
                descriptionAr: "",
                tagsEn: "[]",
                tagsAr: "[]",
                iconUrl: "",
                sortOrder: p.length,
                visible: true,
              },
            ])
          }
        >
          Add service
        </button>
      </AdminHeader>
      <div className="admin-content">
        {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
        {success ? <div className="admin-alert admin-alert-success">{success}</div> : null}

        {services.map((service, i) => (
          <div key={service.id || `new-${i}`} className="admin-card">
            <div className="admin-list-item-header">
              <strong>{service.titleEn || `Service ${i + 1}`}</strong>
              <div className="admin-list-item-actions">
                <button type="button" className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm" onClick={() => void reorder(i, -1)} disabled={i === 0}>↑</button>
                <button type="button" className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm" onClick={() => void reorder(i, 1)} disabled={i === services.length - 1}>↓</button>
                {service.id ? (
                  <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => void deleteService(service.id)}>Delete</button>
                ) : null}
              </div>
            </div>
            <FormField label="Number" value={service.number} onChange={(v) => updateService(i, { number: v })} />
            <BilingualField label="Title" enName={`titleEn-${i}`} arName={`titleAr-${i}`} enValue={service.titleEn} arValue={service.titleAr} onEnChange={(v) => updateService(i, { titleEn: v })} onArChange={(v) => updateService(i, { titleAr: v })} />
            <BilingualField label="Description" enName={`descEn-${i}`} arName={`descAr-${i}`} enValue={service.descriptionEn} arValue={service.descriptionAr} onEnChange={(v) => updateService(i, { descriptionEn: v })} onArChange={(v) => updateService(i, { descriptionAr: v })} multiline />
            <FormField label="Tags EN (JSON array)" value={service.tagsEn} onChange={(v) => updateService(i, { tagsEn: v })} />
            <FormField label="Tags AR (JSON array)" value={service.tagsAr} onChange={(v) => updateService(i, { tagsAr: v })} dir="rtl" />
            <ImageUpload label="Icon" value={service.iconUrl} onChange={(url) => updateService(i, { iconUrl: url })} />
            <label className="admin-checkbox-row">
              <input type="checkbox" checked={service.visible} onChange={(e) => updateService(i, { visible: e.target.checked })} />
              Visible
            </label>
            <div style={{ marginTop: "1rem" }}>
              <SaveButton label={service.id ? "Update service" : "Create service"} loading={saving} type="button" onClick={() => void saveService(service)} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
