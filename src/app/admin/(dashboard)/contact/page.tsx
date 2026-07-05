"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import BilingualField from "@/components/admin/BilingualField";
import FormField from "@/components/admin/FormField";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch, parseJsonField } from "@/lib/admin-client";

type ContactSettings = {
  phones: string;
  whatsappNumbers: string;
  emails: string;
  addressEn: string;
  addressAr: string;
  mapsUrl: string;
  socialLinks: string;
  workingHoursEn: string;
  workingHoursAr: string;
};

const EMPTY: ContactSettings = {
  phones: "[]",
  whatsappNumbers: "[]",
  emails: "[]",
  addressEn: "",
  addressAr: "",
  mapsUrl: "",
  socialLinks: "[]",
  workingHoursEn: "",
  workingHoursAr: "",
};

export default function ContactSettingsPage() {
  const [settings, setSettings] = useState<ContactSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await adminFetch<{ settings: ContactSettings | null }>("/api/admin/contact");
    if (fetchError) setError(fetchError);
    else if (data?.settings) setSettings(data.settings);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function update<K extends keyof ContactSettings>(key: K, value: ContactSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      ...settings,
      phones: parseJsonField<string[]>(settings.phones, []),
      whatsappNumbers: parseJsonField<{ label: string; url: string }[]>(settings.whatsappNumbers, []),
      emails: parseJsonField<string[]>(settings.emails, []),
      socialLinks: parseJsonField<unknown[]>(settings.socialLinks, []),
    };

    const { error: saveError } = await adminFetch("/api/admin/contact", {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (saveError) setError(saveError);
    else setSuccess("Contact settings saved.");
    setSaving(false);
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Contact Settings" subtitle="Address, email, phone, and social links." />
        <div className="admin-content">Loading…</div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Contact Settings" subtitle="Address, email, phone, and social links." />
      <div className="admin-content">
        <form onSubmit={handleSave}>
          <div className="admin-card">
            <FormField label="Phones (JSON array)" value={settings.phones} onChange={(v) => update("phones", v)} multiline hint='e.g. ["+964 123 456 7890"]' />
            <FormField label="WhatsApp numbers (JSON array)" value={settings.whatsappNumbers} onChange={(v) => update("whatsappNumbers", v)} multiline hint='[{"label":"+964...","url":"https://wa.me/..."}]' />
            <FormField label="Emails (JSON array)" value={settings.emails} onChange={(v) => update("emails", v)} multiline hint='e.g. ["info@malamih.net"]' />
            <BilingualField label="Address" enName="addressEn" arName="addressAr" enValue={settings.addressEn} arValue={settings.addressAr} onEnChange={(v) => update("addressEn", v)} onArChange={(v) => update("addressAr", v)} multiline />
            <FormField label="Google Maps URL" value={settings.mapsUrl} onChange={(v) => update("mapsUrl", v)} />
            <BilingualField label="Working hours" enName="workingHoursEn" arName="workingHoursAr" enValue={settings.workingHoursEn} arValue={settings.workingHoursAr} onEnChange={(v) => update("workingHoursEn", v)} onArChange={(v) => update("workingHoursAr", v)} />
            <FormField label="Social links (JSON array)" value={settings.socialLinks} onChange={(v) => update("socialLinks", v)} multiline hint='[{"key":"facebook","href":"...","labelEn":"...","labelAr":"..."}]' />
          </div>
          <SaveButton loading={saving} error={error} success={success} />
        </form>
      </div>
    </>
  );
}
