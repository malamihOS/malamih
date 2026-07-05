"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import FormField from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";

type Magnet = {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  coverImage: string;
  fileUrl: string;
  relatedService: string;
  status: string;
};

const EMPTY = {
  slug: "",
  titleEn: "",
  titleAr: "",
  descriptionEn: "",
  descriptionAr: "",
  coverImage: "",
  fileUrl: "",
  relatedService: "",
  status: "active",
};

export default function LeadMagnetsAdminPage() {
  const [magnets, setMagnets] = useState<Magnet[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminFetch<{ magnets: Magnet[] }>("/api/admin/lead-magnets");
    if (data) setMagnets(data.magnets);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    const method = editId ? "PUT" : "POST";
    const body = editId ? { ...form, id: editId } : form;
    const { error: saveError } = await adminFetch("/api/admin/lead-magnets", {
      method,
      body: JSON.stringify(body),
    });
    if (saveError) setError(saveError);
    else {
      setSuccess("Saved.");
      setForm(EMPTY);
      setEditId(null);
      void load();
    }
    setSaving(false);
  }

  return (
    <>
      <AdminHeader title="Lead Magnets" subtitle="Downloadable resources and gated content." />
      <div className="admin-content">
        <form onSubmit={handleSave}>
          <div className="admin-card">
            <h2 className="admin-card-title">{editId ? "Edit" : "Add"} lead magnet</h2>
            <FormField label="Slug" value={form.slug} onChange={(v) => setForm((p) => ({ ...p, slug: v }))} />
            <FormField label="Title EN" value={form.titleEn} onChange={(v) => setForm((p) => ({ ...p, titleEn: v }))} />
            <FormField label="Title AR" value={form.titleAr} onChange={(v) => setForm((p) => ({ ...p, titleAr: v }))} />
            <FormField label="Description EN" value={form.descriptionEn} onChange={(v) => setForm((p) => ({ ...p, descriptionEn: v }))} multiline />
            <FormField label="Description AR" value={form.descriptionAr} onChange={(v) => setForm((p) => ({ ...p, descriptionAr: v }))} multiline />
            <ImageUpload label="Cover" value={form.coverImage} onChange={(v) => setForm((p) => ({ ...p, coverImage: v }))} />
            <ImageUpload label="File (PDF/doc)" value={form.fileUrl} onChange={(v) => setForm((p) => ({ ...p, fileUrl: v }))} accept="*/*" />
            <FormField label="Related service" value={form.relatedService} onChange={(v) => setForm((p) => ({ ...p, relatedService: v }))} />
            <SaveButton loading={saving} error={error} success={success} />
          </div>
        </form>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="admin-card admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Public URL</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {magnets.map((m) => (
                  <tr key={m.id}>
                    <td>{m.titleEn}</td>
                    <td>{m.slug}</td>
                    <td>{m.status}</td>
                    <td>/resources/{m.slug}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                        onClick={() => {
                          setEditId(m.id);
                          setForm({
                            slug: m.slug,
                            titleEn: m.titleEn,
                            titleAr: m.titleAr,
                            descriptionEn: m.descriptionEn,
                            descriptionAr: m.descriptionAr,
                            coverImage: m.coverImage,
                            fileUrl: m.fileUrl,
                            relatedService: m.relatedService,
                            status: m.status,
                          });
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
