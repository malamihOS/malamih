"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminFetch } from "@/lib/admin-client";
import { getLeadStatusLabel } from "@/lib/leads/types";

type Lead = {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  leadSource: string;
  status: string;
  priority: string;
  score: number;
  qualityLabel: string;
  nextFollowUpDate: string | null;
  createdAt: string;
};

export default function LeadsListPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [qualityFilter, setQualityFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (qualityFilter) params.set("quality", qualityFilter);
    const url = `/api/admin/leads${params.toString() ? `?${params}` : ""}`;
    const { data } = await adminFetch<{ leads: Lead[] }>(url);
    if (data) setLeads(data.leads);
    setLoading(false);
  }, [statusFilter, qualityFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <AdminHeader title="Leads CRM" />
      <div className="admin-content">
        <div className="admin-form-actions" style={{ marginTop: 0, marginBottom: "1rem" }}>
          <Link href="/admin/leads/new" className="admin-btn admin-btn-primary admin-btn-sm">
            Add lead
          </Link>
          <Link href="/admin/leads/follow-ups" className="admin-btn admin-btn-secondary admin-btn-sm">
            Follow-ups
          </Link>
        </div>

        <div className="admin-filter-bar">
          <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="meeting_scheduled">Meeting Scheduled</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
          <select className="admin-select" value={qualityFilter} onChange={(e) => setQualityFilter(e.target.value)}>
            <option value="">All quality</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
          </select>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : leads.length === 0 ? (
          <div className="admin-empty-state">No leads yet.</div>
        ) : (
          <div className="admin-card admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Score</th>
                  <th>Quality</th>
                  <th>Status</th>
                  <th>Follow-up</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.fullName}</td>
                    <td>{lead.email}</td>
                    <td>{lead.leadSource}</td>
                    <td>{lead.score}%</td>
                    <td>
                      <StatusBadge status={lead.qualityLabel} />
                    </td>
                    <td>{getLeadStatusLabel(lead.status)}</td>
                    <td>
                      {lead.nextFollowUpDate
                        ? new Date(lead.nextFollowUpDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <Link href={`/admin/leads/${lead.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
