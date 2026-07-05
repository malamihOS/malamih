"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminFetch } from "@/lib/admin-client";

type Lead = {
  id: string;
  fullName: string;
  email: string;
  nextFollowUpDate: string | null;
  status: string;
  qualityLabel: string;
};

export default function FollowUpsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminFetch<{ leads: Lead[] }>("/api/admin/leads");
    if (data) {
      const now = Date.now();
      const filtered = data.leads
        .filter((l) => l.nextFollowUpDate)
        .sort(
          (a, b) =>
            new Date(a.nextFollowUpDate!).getTime() -
            new Date(b.nextFollowUpDate!).getTime(),
        );
      setLeads(filtered);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const now = Date.now();

  return (
    <>
      <AdminHeader title="Follow-up Reminders" subtitle="Upcoming and overdue lead follow-ups." />
      <div className="admin-content">
        <p className="admin-inline-hint">
          Upcoming and overdue follow-ups. Email/WhatsApp reminders require future integration setup.
        </p>
        {loading ? (
          <p>Loading…</p>
        ) : leads.length === 0 ? (
          <div className="admin-empty-state">No follow-ups scheduled.</div>
        ) : (
          <div className="admin-card admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Follow-up date</th>
                  <th>Status</th>
                  <th>Quality</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const overdue =
                    lead.nextFollowUpDate &&
                    new Date(lead.nextFollowUpDate).getTime() < now;
                  return (
                    <tr key={lead.id} style={overdue ? { background: "#fef2f2" } : undefined}>
                      <td>{lead.fullName}</td>
                      <td>
                        {lead.nextFollowUpDate
                          ? new Date(lead.nextFollowUpDate).toLocaleDateString()
                          : "—"}
                        {overdue ? " (overdue)" : ""}
                      </td>
                      <td>{lead.status}</td>
                      <td>
                        <StatusBadge status={lead.qualityLabel} />
                      </td>
                      <td>
                        <Link href={`/admin/leads/${lead.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
