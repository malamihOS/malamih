"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import BilingualField from "@/components/admin/BilingualField";
import FormField from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";

const PAGE_KEYS = [
  { key: "home", label: "Homepage" },
  { key: "contact", label: "Contact" },
  { key: "projects", label: "Projects" },
  { key: "blog", label: "Blog" },
  { key: "terms", label: "Terms & Conditions" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "notFound", label: "404 Page" },
];

type PageSeo = {
  pageKey: string;
  seoTitleEn: string;
  seoTitleAr: string;
  seoDescEn: string;
  seoDescAr: string;
  seoKeywordsEn: string;
  seoKeywordsAr: string;
  ogImageUrl: string;
  canonicalUrlEn: string;
  canonicalUrlAr: string;
  noIndex: boolean;
};

export default function AdminSeoPage() {
  const [activeKey, setActiveKey] = useState("home");
  const [form, setForm] = useState<PageSeo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pages, setPages] = useState<PageSeo[]>([]);

  useEffect(() => {
    adminFetch<{ pages: PageSeo[] }>("/api/admin/seo").then((result) => {
      if (!result.data) return;
      setPages(result.data.pages);
      const current = result.data.pages.find((p) => p.pageKey === activeKey);
      setForm(
        current ?? {
          pageKey: activeKey,
          seoTitleEn: "",
          seoTitleAr: "",
          seoDescEn: "",
          seoDescAr: "",
          seoKeywordsEn: "",
          seoKeywordsAr: "",
          ogImageUrl: "",
          canonicalUrlEn: "",
          canonicalUrlAr: "",
          noIndex: false,
        },
      );
    });
  }, [activeKey]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await adminFetch<{ page: PageSeo }>("/api/admin/seo", {
      method: "PUT",
      body: JSON.stringify(form),
    });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("SEO settings saved");
    }
    setLoading(false);
  }

  if (!form) return <div className="admin-loading">Loading...</div>;

  return (
    <div>
      <AdminHeader title="Page SEO" />
      <div className="admin-tabs">
        {PAGE_KEYS.map((page) => (
          <button
            key={page.key}
            type="button"
            className={`admin-tab${activeKey === page.key ? " active" : ""}`}
            onClick={() => setActiveKey(page.key)}
          >
            {page.label}
          </button>
        ))}
      </div>

      <form className="admin-form" onSubmit={handleSave}>
        {error ? <p className="admin-error">{error}</p> : null}
        {success ? <p className="admin-success">{success}</p> : null}

        <BilingualField
          label="SEO Title"
          enName="seoTitleEn"
          arName="seoTitleAr"
          enValue={form.seoTitleEn}
          arValue={form.seoTitleAr}
          onEnChange={(v) => setForm({ ...form, seoTitleEn: v })}
          onArChange={(v) => setForm({ ...form, seoTitleAr: v })}
        />
        <BilingualField
          label="SEO Description"
          enName="seoDescEn"
          arName="seoDescAr"
          enValue={form.seoDescEn}
          arValue={form.seoDescAr}
          onEnChange={(v) => setForm({ ...form, seoDescEn: v })}
          onArChange={(v) => setForm({ ...form, seoDescAr: v })}
          multiline
        />
        <BilingualField
          label="SEO Keywords"
          enName="seoKeywordsEn"
          arName="seoKeywordsAr"
          enValue={form.seoKeywordsEn}
          arValue={form.seoKeywordsAr}
          onEnChange={(v) => setForm({ ...form, seoKeywordsEn: v })}
          onArChange={(v) => setForm({ ...form, seoKeywordsAr: v })}
        />
        <ImageUpload
          label="Open Graph Image"
          value={form.ogImageUrl}
          onChange={(v) => setForm({ ...form, ogImageUrl: v })}
        />
        <FormField
          label="Canonical URL EN"
          value={form.canonicalUrlEn}
          onChange={(v) => setForm({ ...form, canonicalUrlEn: v })}
        />
        <FormField
          label="Canonical URL AR"
          value={form.canonicalUrlAr}
          onChange={(v) => setForm({ ...form, canonicalUrlAr: v })}
        />
        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={form.noIndex}
            onChange={(e) => setForm({ ...form, noIndex: e.target.checked })}
          />
          No Index
        </label>
        <SaveButton loading={loading} label="Save SEO" />
      </form>
    </div>
  );
}
