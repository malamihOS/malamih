"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminFetch } from "@/lib/admin-client";

type Proposal = {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  budgetRange: string;
  timeline: string;
  status: string;
  createdAt: string;
  lead: { fullName: string; email: string } | null;
};

export default function ProposalsAdminPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminFetch<{ proposals: Proposal[] }>("/api/admin/proposals");
    if (data) setProposals(data.proposals);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    await adminFetch("/api/admin/proposals", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    });
    void load();
  }

  return (
    <>
      <AdminHeader title="Proposal Requests" subtitle="Incoming proposal and quote requests." />
      <div className="admin-content">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="admin-card admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Company</th>
                  <th>Budget</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p) => (
                  <tr key={p.id}>
                    <td>{p.contactName}<br /><span className="admin-inline-hint">{p.contactEmail}</span></td>
                    <td>{p.companyName || "—"}</td>
                    <td>{p.budgetRange}</td>
                    <td>{p.timeline}</td>
                    <td>
                      <select
                        className="admin-select"
                        value={p.status}
                        onChange={(e) => void updateStatus(p.id, e.target.value)}
                      >
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="proposal_drafted">Proposal Drafted</option>
                        <option value="sent">Sent</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {proposals.length === 0 ? <p className="admin-inline-hint">No proposal requests yet.</p> : null}
          </div>
        )}
      </div>
    </>
  );
}
