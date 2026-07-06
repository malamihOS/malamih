"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import FormField from "@/components/admin/FormField";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";
import { GMAIL_SMTP_HOST, GMAIL_SMTP_PORT } from "@/lib/gmail-smtp";

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
  smtpHost: GMAIL_SMTP_HOST,
  smtpPort: GMAIL_SMTP_PORT,
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
      body: JSON.stringify({
        ...settings,
        smtpHost: GMAIL_SMTP_HOST,
        smtpPort: GMAIL_SMTP_PORT,
        smtpUser: settings.smtpFromEmail.trim().toLowerCase(),
        smtpFromEmail: settings.smtpFromEmail.trim().toLowerCase(),
      }),
    });

    if (saveError) setError(saveError);
    else setSuccess("Integrations saved. Tracking scripts will appear on the public site.");
    setSaving(false);
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Integrations" subtitle="Gmail, tracking pixels, and third-party tags." />
        <div className="admin-content">Loading…</div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Integrations & Email" subtitle="Gmail, tracking pixels, and third-party tags." />
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
            <h2 className="admin-card-title">Gmail email</h2>
            <p className="admin-inline-hint">
              Use your Google Workspace or Gmail address with a Google App Password.
              Contact form notifications and auto-replies are sent through Gmail SMTP.
            </p>
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={settings.smtpEnabled}
                onChange={(e) => update("smtpEnabled", e.target.checked)}
              />
              Enable Gmail email sending
            </label>
            <FormField
              label="Gmail address"
              type="email"
              value={settings.smtpFromEmail}
              onChange={(v) => update("smtpFromEmail", v)}
              hint="e.g. info@malamih.net or your @gmail.com address"
            />
            <FormField
              label="Google App Password"
              type="password"
              value={settings.smtpPass}
              onChange={(v) => update("smtpPass", v)}
              hint="16-character App Password from Google Account → Security → 2-Step Verification → App passwords. Leave blank to keep the saved password."
            />
            <FormField
              label="From name"
              value={settings.smtpFromName}
              onChange={(v) => update("smtpFromName", v)}
              hint="Shown to recipients, e.g. Malamih Creative Company"
            />
            <FormField
              label="Admin notification email"
              value={settings.notifyEmail}
              onChange={(v) => update("notifyEmail", v)}
              hint="Receives contact, inquiry, proposal, newsletter, and all other website submissions."
            />
          </div>

          <SaveButton loading={saving} error={error} success={success} />
        </form>
      </div>
    </>
  );
}
