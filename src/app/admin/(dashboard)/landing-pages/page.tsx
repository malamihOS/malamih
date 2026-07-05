"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import BilingualField from "@/components/admin/BilingualField";
import FormField from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";

type LandingPage = {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  status: string;
};

export default function LandingPagesAdminPage() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [form, setForm] = useState({
    slug: "",
    titleEn: "",
    titleAr: "",
    headlineEn: "",
    headlineAr: "",
    descriptionEn: "",
    descriptionAr: "",
    coverImage: "",
    coverVideo: "",
    relatedService: "",
    ctaTextEn: "Get Started",
    ctaTextAr: "ابدأ الآن",
    formFieldsJson: '["name","email","phone","company","message"]',
    seoTitleEn: "",
    seoTitleAr: "",
    seoDescEn: "",
    seoDescAr: "",
    status: "draft",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminFetch<{ pages: LandingPage[] }>("/api/admin/landing-pages");
    if (data) setPages(data.pages);
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
    const { error: saveError } = await adminFetch("/api/admin/landing-pages", {
      method,
      body: JSON.stringify(body),
    });
    if (saveError) setError(saveError);
    else {
      setSuccess("Saved.");
      setEditId(null);
      void load();
    }
    setSaving(false);
  }

  return (
    <>
      <AdminHeader title="Landing Pages" />
      <div className="admin-content">
        <form onSubmit={handleSave}>
          <div className="admin-card">
            <FormField label="Slug" value={form.slug} onChange={(v) => setForm((p) => ({ ...p, slug: v }))} />
            <BilingualField label="Title" enName="titleEn" arName="titleAr" enValue={form.titleEn} arValue={form.titleAr} onEnChange={(v) => setForm((p) => ({ ...p, titleEn: v }))} onArChange={(v) => setForm((p) => ({ ...p, titleAr: v }))} />
            <BilingualField label="Headline" enName="headlineEn" arName="headlineAr" enValue={form.headlineEn} arValue={form.headlineAr} onEnChange={(v) => setForm((p) => ({ ...p, headlineEn: v }))} onArChange={(v) => setForm((p) => ({ ...p, headlineAr: v }))} />
            <BilingualField label="Description" enName="descriptionEn" arName="descriptionAr" enValue={form.descriptionEn} arValue={form.descriptionAr} onEnChange={(v) => setForm((p) => ({ ...p, descriptionEn: v }))} onArChange={(v) => setForm((p) => ({ ...p, descriptionAr: v }))} multiline />
            <ImageUpload label="Cover image" value={form.coverImage} onChange={(v) => setForm((p) => ({ ...p, coverImage: v }))} />
            <FormField label="Form fields JSON" value={form.formFieldsJson} onChange={(v) => setForm((p) => ({ ...p, formFieldsJson: v }))} hint='e.g. ["name","email","message"]' />
            <div className="admin-form-group">
              <label className="admin-label">Status</label>
              <select className="admin-select" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <SaveButton loading={saving} error={error} success={success} />
          </div>
        </form>

        {!loading ? (
          <div className="admin-card admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.id}>
                    <td>{p.titleEn}</td>
                    <td>{p.slug}</td>
                    <td>{p.status}</td>
                    <td>/lp/{p.slug}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </>
  );
}
