"use client";

import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import FormField from "@/components/admin/FormField";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";
import { useState } from "react";

export default function NewLeadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    companyName: "",
    phone: "",
    leadSource: "manual",
    notes: "",
    budgetRange: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { data, error: saveError } = await adminFetch<{ lead: { id: string } }>(
      "/api/admin/leads",
      { method: "POST", body: JSON.stringify(form) },
    );

    if (saveError) setError(saveError);
    else if (data?.lead) {
      setSuccess("Lead created.");
      router.push(`/admin/leads/${data.lead.id}`);
    }
    setSaving(false);
  }

  return (
    <>
      <AdminHeader title="Add Lead" />
      <div className="admin-content">
        <form onSubmit={handleSubmit}>
          <div className="admin-card">
            <FormField label="Full name" value={form.fullName} onChange={(v) => setForm((p) => ({ ...p, fullName: v }))} />
            <FormField label="Email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} />
            <FormField label="Company" value={form.companyName} onChange={(v) => setForm((p) => ({ ...p, companyName: v }))} />
            <FormField label="Phone" value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} />
            <FormField label="Budget range" value={form.budgetRange} onChange={(v) => setForm((p) => ({ ...p, budgetRange: v }))} />
            <FormField label="Notes" value={form.notes} onChange={(v) => setForm((p) => ({ ...p, notes: v }))} multiline />
          </div>
          <SaveButton loading={saving} error={error} success={success} label="Create lead" />
        </form>
      </div>
    </>
  );
}
