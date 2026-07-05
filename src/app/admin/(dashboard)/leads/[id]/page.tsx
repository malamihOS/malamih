"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import FormField from "@/components/admin/FormField";
import SaveButton from "@/components/admin/SaveButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminFetch } from "@/lib/admin-client";
import { getLeadStatusLabel } from "@/lib/leads/types";

type PageProps = { params: Promise<{ id: string }> };

type LeadDetail = {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  whatsApp: string;
  city: string;
  country: string;
  industry: string;
  leadSource: string;
  interestedServices: string;
  budgetRange: string;
  notes: string;
  status: string;
  priority: string;
  assignedTo: string;
  score: number;
  qualityLabel: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  lastContactDate: string | null;
  nextFollowUpDate: string | null;
  createdAt: string;
  submissions: { id: string; formType: string; message: string; createdAt: string }[];
  proposals: { id: string; status: string; createdAt: string }[];
};

export default function LeadDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [leadId, setLeadId] = useState<string | null>(null);
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [status, setStatus] = useState("new");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void params.then((p) => setLeadId(p.id));
  }, [params]);

  const load = useCallback(async () => {
    if (!leadId) return;
    setLoading(true);
    const { data } = await adminFetch<{ lead: LeadDetail }>(`/api/admin/leads/${leadId}`);
    if (data?.lead) {
      setLead(data.lead);
      setStatus(data.lead.status);
      setPriority(data.lead.priority);
      setAssignedTo(data.lead.assignedTo);
      setNotes(data.lead.notes);
      setFollowUp(
        data.lead.nextFollowUpDate
          ? new Date(data.lead.nextFollowUpDate).toISOString().slice(0, 10)
          : "",
      );
    }
    setLoading(false);
  }, [leadId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!leadId) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { error: saveError } = await adminFetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
        priority,
        assignedTo,
        notes,
        nextFollowUpDate: followUp || null,
        lastContactDate: new Date().toISOString(),
      }),
    });

    if (saveError) setError(saveError);
    else {
      setSuccess("Lead updated.");
      void load();
    }
    setSaving(false);
  }

  if (loading || !lead) {
    return (
      <>
        <AdminHeader title="Lead" />
        <div className="admin-content">{loading ? "Loading…" : "Lead not found."}</div>
      </>
    );
  }

  let services: string[] = [];
  try {
    services = JSON.parse(lead.interestedServices) as string[];
  } catch {
    services = [];
  }

  return (
    <>
      <AdminHeader title={lead.fullName} />
      <div className="admin-content">
        <div className="admin-card">
          <div className="admin-grid admin-grid-3">
            <div>
              <p className="admin-inline-hint">Score</p>
              <p className="admin-stat">{lead.score}%</p>
            </div>
            <div>
              <p className="admin-inline-hint">Quality</p>
              <StatusBadge status={lead.qualityLabel} />
            </div>
            <div>
              <p className="admin-inline-hint">Status</p>
              <p>{getLeadStatusLabel(lead.status)}</p>
            </div>
          </div>
          <p><strong>Email:</strong> {lead.email}</p>
          <p><strong>Company:</strong> {lead.companyName || "—"}</p>
          <p><strong>Phone:</strong> {lead.phone || "—"}</p>
          <p><strong>Source:</strong> {lead.leadSource}</p>
          <p><strong>Services:</strong> {services.join(", ") || "—"}</p>
          <p><strong>Budget:</strong> {lead.budgetRange || "—"}</p>
          {(lead.utmSource || lead.utmCampaign) ? (
            <div style={{ marginTop: "1rem" }}>
              <strong>UTM:</strong>
              <p className="admin-inline-hint">
                source={lead.utmSource || "—"} · medium={lead.utmMedium || "—"} · campaign={lead.utmCampaign || "—"}
              </p>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSave}>
          <div className="admin-card">
            <div className="admin-form-group">
              <label className="admin-label">Status</label>
              <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="meeting_scheduled">Meeting Scheduled</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Priority</label>
              <select className="admin-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <FormField label="Assigned to" value={assignedTo} onChange={setAssignedTo} />
            <FormField label="Notes" value={notes} onChange={setNotes} multiline />
            <FormField label="Next follow-up" value={followUp} onChange={setFollowUp} hint="YYYY-MM-DD" />
            <p className="admin-inline-hint">
              Reminder notifications (email/WhatsApp) can be enabled when integrations are configured.
            </p>
          </div>
          <SaveButton loading={saving} error={error} success={success} label="Save lead" />
        </form>

        {lead.submissions.length > 0 ? (
          <div className="admin-card">
            <h2 className="admin-card-title">Related submissions</h2>
            {lead.submissions.map((s) => (
              <div key={s.id} style={{ marginBottom: "0.75rem" }}>
                <strong>{s.formType}</strong> — {new Date(s.createdAt).toLocaleString()}
                <p className="admin-inline-hint">{s.message.slice(0, 200)}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
