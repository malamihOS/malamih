"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import FormField from "@/components/admin/FormField";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";

type IntegrationsSettings = {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFromEmail: string;
  smtpFromName: string;
  smtpEnabled: boolean;
  notifyEmail: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  metaPixelId: string;
  tiktokPixelId: string;
  linkedInInsightTag: string;
  googleSiteVerification: string;
  metaDomainVerification: string;
};

const EMPTY: IntegrationsSettings = {
  smtpHost: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPass: "",
  smtpFromEmail: "",
  smtpFromName: "Malamih Creative Company",
  smtpEnabled: false,
  notifyEmail: "",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  metaPixelId: "",
  tiktokPixelId: "",
  linkedInInsightTag: "",
  googleSiteVerification: "",
  metaDomainVerification: "",
};

export default function IntegrationsPage() {
  const [settings, setSettings] = useState<IntegrationsSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await adminFetch<{
      settings: IntegrationsSettings | null;
    }>("/api/admin/integrations");
    if (fetchError) setError(fetchError);
    else if (data?.settings) {
      setSettings({
        ...EMPTY,
        ...data.settings,
        smtpPass: data.settings.smtpPass === "••••••••" ? "" : data.settings.smtpPass,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function update<K extends keyof IntegrationsSettings>(
    key: K,
    value: IntegrationsSettings[K],
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { error: saveError } = await adminFetch("/api/admin/integrations", {
      method: "PUT",
      body: JSON.stringify(settings),
    });

    if (saveError) setError(saveError);
    else setSuccess("Integrations saved. Tracking scripts will appear on the public site.");
    setSaving(false);
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Integrations" />
        <div className="admin-content">Loading…</div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Integrations & Email" />
      <div className="admin-content">
        <form onSubmit={handleSave}>
          <div className="admin-card">
            <h2 className="admin-card-title">Tracking & verification</h2>
            <p className="admin-inline-hint">
              IDs are injected on the public site without code changes. Leave blank to disable.
            </p>
            <FormField
              label="Google Analytics Measurement ID"
              value={settings.googleAnalyticsId}
              onChange={(v) => update("googleAnalyticsId", v)}
              hint="e.g. G-XXXXXXXXXX"
            />
            <FormField
              label="Google Tag Manager ID"
              value={settings.googleTagManagerId}
              onChange={(v) => update("googleTagManagerId", v)}
              hint="e.g. GTM-XXXXXXX"
            />
            <FormField
              label="Meta Pixel ID"
              value={settings.metaPixelId}
              onChange={(v) => update("metaPixelId", v)}
            />
            <FormField
              label="TikTok Pixel ID"
              value={settings.tiktokPixelId}
              onChange={(v) => update("tiktokPixelId", v)}
            />
            <FormField
              label="LinkedIn Insight Tag"
              value={settings.linkedInInsightTag}
              onChange={(v) => update("linkedInInsightTag", v)}
            />
            <FormField
              label="Google Search Console verification"
              value={settings.googleSiteVerification}
              onChange={(v) => update("googleSiteVerification", v)}
            />
            <FormField
              label="Meta domain verification"
              value={settings.metaDomainVerification}
              onChange={(v) => update("metaDomainVerification", v)}
            />
          </div>

          <div className="admin-card">
            <h2 className="admin-card-title">SMTP email</h2>
            <p className="admin-inline-hint">
              Emails are only sent when SMTP is enabled and configured. Contact form notifications and auto-replies use these settings.
            </p>
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={settings.smtpEnabled}
                onChange={(e) => update("smtpEnabled", e.target.checked)}
              />
              Enable SMTP
            </label>
            <FormField
              label="SMTP host"
              value={settings.smtpHost}
              onChange={(v) => update("smtpHost", v)}
            />
            <FormField
              label="SMTP port"
              value={String(settings.smtpPort)}
              onChange={(v) => update("smtpPort", Number(v) || 587)}
            />
            <FormField
              label="SMTP username"
              value={settings.smtpUser}
              onChange={(v) => update("smtpUser", v)}
            />
            <FormField
              label="SMTP password"
              value={settings.smtpPass}
              onChange={(v) => update("smtpPass", v)}
              hint="Leave blank to keep existing password"
            />
            <FormField
              label="From email"
              value={settings.smtpFromEmail}
              onChange={(v) => update("smtpFromEmail", v)}
            />
            <FormField
              label="From name"
              value={settings.smtpFromName}
              onChange={(v) => update("smtpFromName", v)}
            />
            <FormField
              label="Admin notification email"
              value={settings.notifyEmail}
              onChange={(v) => update("notifyEmail", v)}
              hint="Receives new contact form submissions"
            />
          </div>

          <SaveButton loading={saving} error={error} success={success} />
        </form>
      </div>
    </>
  );
}
