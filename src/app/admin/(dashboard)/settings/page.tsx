"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import BilingualField from "@/components/admin/BilingualField";
import FormField from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch, parseJsonField } from "@/lib/admin-client";

type SiteSettings = {
  websiteNameEn: string;
  websiteNameAr: string;
  logoUrl: string;
  faviconUrl: string;
  defaultSeoTitleEn: string;
  defaultSeoTitleAr: string;
  defaultSeoDescEn: string;
  defaultSeoDescAr: string;
  ogImageUrl: string;
  headerMenuJson: string;
  footerContentJson: string;
  footerLinksJson: string;
  homeProjectsJson: string;
  contactPageJson: string;
};

const EMPTY: SiteSettings = {
  websiteNameEn: "",
  websiteNameAr: "",
  logoUrl: "",
  faviconUrl: "",
  defaultSeoTitleEn: "",
  defaultSeoTitleAr: "",
  defaultSeoDescEn: "",
  defaultSeoDescAr: "",
  ogImageUrl: "",
  headerMenuJson: "[]",
  footerContentJson: "{}",
  footerLinksJson: "[]",
  homeProjectsJson: "{}",
  contactPageJson: "{}",
};

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await adminFetch<{ settings: SiteSettings | null }>("/api/admin/settings");
    if (fetchError) setError(fetchError);
    else if (data?.settings) setSettings(data.settings);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      parseJsonField(settings.headerMenuJson, []);
      parseJsonField(settings.footerContentJson, {});
      parseJsonField(settings.footerLinksJson, []);
      parseJsonField(settings.homeProjectsJson, {});
      parseJsonField(settings.contactPageJson, {});
    } catch {
      setError("Invalid JSON in one of the JSON fields");
      setSaving(false);
      return;
    }

    const payload = {
      ...settings,
      headerMenuJson: parseJsonField(settings.headerMenuJson, []),
      footerContentJson: parseJsonField(settings.footerContentJson, {}),
      footerLinksJson: parseJsonField(settings.footerLinksJson, []),
      homeProjectsJson: parseJsonField(settings.homeProjectsJson, {}),
      contactPageJson: parseJsonField(settings.contactPageJson, {}),
    };

    const { error: saveError } = await adminFetch("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (saveError) setError(saveError);
    else setSuccess("Site settings saved.");
    setSaving(false);
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Site Settings" subtitle="Brand name, navigation, footer, and global options." />
        <div className="admin-content">Loading…</div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Site Settings" subtitle="Brand name, navigation, footer, and global options." />
      <div className="admin-content">
        <form onSubmit={handleSave}>
          <div className="admin-card">
            <h2 className="admin-card-title">General</h2>
            <BilingualField label="Website name" enName="websiteNameEn" arName="websiteNameAr" enValue={settings.websiteNameEn} arValue={settings.websiteNameAr} onEnChange={(v) => update("websiteNameEn", v)} onArChange={(v) => update("websiteNameAr", v)} />
            <ImageUpload label="Logo" value={settings.logoUrl} onChange={(v) => update("logoUrl", v)} />
            <ImageUpload label="Favicon" value={settings.faviconUrl} onChange={(v) => update("faviconUrl", v)} />
            <ImageUpload label="OG image" value={settings.ogImageUrl} onChange={(v) => update("ogImageUrl", v)} />
          </div>

          <div className="admin-card">
            <h2 className="admin-card-title">Default SEO</h2>
            <BilingualField label="SEO title" enName="defaultSeoTitleEn" arName="defaultSeoTitleAr" enValue={settings.defaultSeoTitleEn} arValue={settings.defaultSeoTitleAr} onEnChange={(v) => update("defaultSeoTitleEn", v)} onArChange={(v) => update("defaultSeoTitleAr", v)} />
            <BilingualField label="SEO description" enName="defaultSeoDescEn" arName="defaultSeoDescAr" enValue={settings.defaultSeoDescEn} arValue={settings.defaultSeoDescAr} onEnChange={(v) => update("defaultSeoDescEn", v)} onArChange={(v) => update("defaultSeoDescAr", v)} multiline />
          </div>

          <div className="admin-card">
            <h2 className="admin-card-title">Navigation & content JSON</h2>
            <FormField label="Header menu JSON" value={settings.headerMenuJson} onChange={(v) => update("headerMenuJson", v)} multiline hint="Array of { key, href, labelEn, labelAr, visible }" />
            <FormField label="Footer content JSON" value={settings.footerContentJson} onChange={(v) => update("footerContentJson", v)} multiline />
            <FormField label="Footer links JSON" value={settings.footerLinksJson} onChange={(v) => update("footerLinksJson", v)} multiline />
            <FormField label="Home projects section JSON" value={settings.homeProjectsJson} onChange={(v) => update("homeProjectsJson", v)} multiline hint="labelEn/Ar, headingLine1En/Ar, etc." />
            <FormField label="Contact page JSON" value={settings.contactPageJson} onChange={(v) => update("contactPageJson", v)} multiline hint="Form labels, hero image, team images from seed" />
          </div>

          <SaveButton loading={saving} error={error} success={success} />
        </form>
      </div>
    </>
  );
}
