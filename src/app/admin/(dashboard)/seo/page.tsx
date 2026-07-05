"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import BilingualField from "@/components/admin/BilingualField";
import FormField from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";

const PAGE_GROUPS = [
  {
    title: "Main pages",
    pages: [
      { key: "home", label: "Homepage", path: "/" },
      { key: "contact", label: "Contact", path: "/contact" },
      { key: "projects", label: "Projects", path: "/projects" },
      { key: "blog", label: "Blog", path: "/blog" },
    ],
  },
  {
    title: "Legal & system",
    pages: [
      { key: "terms", label: "Terms & Conditions", path: "/legal/terms-and-conditions" },
      { key: "privacy", label: "Privacy Policy", path: "/legal/privacy-policy" },
      { key: "notFound", label: "404 Page", path: "/404" },
    ],
  },
] as const;

type PageDef = (typeof PAGE_GROUPS)[number]["pages"][number];

const ALL_PAGES: PageDef[] = PAGE_GROUPS.flatMap((group) => [...group.pages]);

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

const EMPTY_FORM = (pageKey: string): PageSeo => ({
  pageKey,
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
});

export default function AdminSeoPage() {
  const [activeKey, setActiveKey] = useState("home");
  const [form, setForm] = useState<PageSeo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pages, setPages] = useState<PageSeo[]>([]);

  const loadPages = useCallback(async () => {
    setLoading(true);
    const result = await adminFetch<{ pages: PageSeo[] }>("/api/admin/seo");
    if (result.data) {
      setPages(result.data.pages);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadPages();
  }, [loadPages]);

  useEffect(() => {
    const current = pages.find((page) => page.pageKey === activeKey);
    setForm(current ?? EMPTY_FORM(activeKey));
    setError(null);
    setSuccess(null);
  }, [activeKey, pages]);

  const activePage = ALL_PAGES.find((page) => page.key === activeKey);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    const result = await adminFetch<{ page: PageSeo }>("/api/admin/seo", {
      method: "PUT",
      body: JSON.stringify(form),
    });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("SEO settings saved successfully.");
      await loadPages();
    }

    setSaving(false);
  }

  return (
    <>
      <AdminHeader
        title="Page SEO"
        subtitle="Manage search titles, descriptions, social previews, and indexing for each public page."
      />

      <div className="admin-content">
        <div className="admin-seo-layout">
          <aside className="admin-seo-nav" aria-label="Select page">
            {PAGE_GROUPS.map((group) => (
              <div key={group.title} className="admin-seo-nav-group">
                <p className="admin-seo-nav-group-title">{group.title}</p>
                <div className="admin-seo-nav-list">
                  {group.pages.map((page) => {
                    const saved = pages.some((item) => item.pageKey === page.key);
                    return (
                      <button
                        key={page.key}
                        type="button"
                        className={`admin-seo-nav-item${activeKey === page.key ? " active" : ""}`}
                        onClick={() => setActiveKey(page.key)}
                      >
                        <span className="admin-seo-nav-item-label">{page.label}</span>
                        <span className="admin-seo-nav-item-path">{page.path}</span>
                        <span className={`admin-seo-nav-item-status${saved ? " saved" : ""}`}>
                          {saved ? "Configured" : "Default"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>

          <div className="admin-seo-panel">
            {loading || !form ? (
              <div className="admin-loading-card">Loading page SEO settings…</div>
            ) : (
              <form onSubmit={handleSave}>
                <div className="admin-seo-panel-head">
                  <div>
                    <p className="admin-kicker">Editing</p>
                    <h2 className="admin-seo-panel-title">{activePage?.label ?? activeKey}</h2>
                    <p className="admin-seo-panel-path">{activePage?.path}</p>
                  </div>
                </div>

                {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
                {success ? <div className="admin-alert admin-alert-success">{success}</div> : null}

                <div className="admin-card">
                  <div className="admin-card-head">
                    <h3 className="admin-card-title">Search appearance</h3>
                    <p className="admin-card-desc">
                      Title and description shown in Google results for English and Arabic.
                    </p>
                  </div>
                  <BilingualField
                    label="SEO title"
                    enName="seoTitleEn"
                    arName="seoTitleAr"
                    enValue={form.seoTitleEn}
                    arValue={form.seoTitleAr}
                    onEnChange={(v) => setForm({ ...form, seoTitleEn: v })}
                    onArChange={(v) => setForm({ ...form, seoTitleAr: v })}
                  />
                  <BilingualField
                    label="SEO description"
                    enName="seoDescEn"
                    arName="seoDescAr"
                    enValue={form.seoDescEn}
                    arValue={form.seoDescAr}
                    onEnChange={(v) => setForm({ ...form, seoDescEn: v })}
                    onArChange={(v) => setForm({ ...form, seoDescAr: v })}
                    multiline
                  />
                  <BilingualField
                    label="SEO keywords"
                    enName="seoKeywordsEn"
                    arName="seoKeywordsAr"
                    enValue={form.seoKeywordsEn}
                    arValue={form.seoKeywordsAr}
                    onEnChange={(v) => setForm({ ...form, seoKeywordsEn: v })}
                    onArChange={(v) => setForm({ ...form, seoKeywordsAr: v })}
                  />
                </div>

                <div className="admin-card">
                  <div className="admin-card-head">
                    <h3 className="admin-card-title">Social preview</h3>
                    <p className="admin-card-desc">
                      Open Graph image used when the page is shared on social platforms.
                    </p>
                  </div>
                  <ImageUpload
                    label="Open Graph image"
                    value={form.ogImageUrl}
                    onChange={(v) => setForm({ ...form, ogImageUrl: v })}
                  />
                </div>

                <div className="admin-card">
                  <div className="admin-card-head">
                    <h3 className="admin-card-title">Canonical URLs</h3>
                    <p className="admin-card-desc">
                      Optional override for the preferred URL in each language. Leave blank to use the default.
                    </p>
                  </div>
                  <div className="admin-grid admin-grid-2">
                    <FormField
                      label="Canonical URL (English)"
                      type="url"
                      value={form.canonicalUrlEn}
                      onChange={(v) => setForm({ ...form, canonicalUrlEn: v })}
                      hint="https://malamih.net/..."
                    />
                    <FormField
                      label="Canonical URL (Arabic)"
                      type="url"
                      value={form.canonicalUrlAr}
                      onChange={(v) => setForm({ ...form, canonicalUrlAr: v })}
                      hint="https://malamih.net/ar/..."
                    />
                  </div>
                </div>

                <div className="admin-card">
                  <div className="admin-card-head">
                    <h3 className="admin-card-title">Search engine indexing</h3>
                    <p className="admin-card-desc">
                      Control whether search engines should index this page.
                    </p>
                  </div>
                  <label className="admin-toggle-row">
                    <input
                      type="checkbox"
                      checked={form.noIndex}
                      onChange={(e) => setForm({ ...form, noIndex: e.target.checked })}
                    />
                    <span>
                      <strong>Hide from search engines (noindex)</strong>
                      <span className="admin-inline-hint">
                        Enable this for pages that should not appear in Google results.
                      </span>
                    </span>
                  </label>
                </div>

                <SaveButton loading={saving} label="Save page SEO" />
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
