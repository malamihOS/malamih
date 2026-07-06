"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminFetch } from "@/lib/admin-client";
import { getFormTypeLabel } from "@/lib/admin-notifications";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  status: string;
  formType: string;
  createdAt: string;
};

export default function MessagesListPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const url = statusFilter
      ? `/api/admin/messages?status=${statusFilter}`
      : "/api/admin/messages";
    const { data, error: fetchError } = await adminFetch<{ messages: Message[] }>(url);
    if (fetchError) setError(fetchError);
    else if (data) setMessages(data.messages);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <AdminHeader
        title="Messages"
        subtitle="Contact, inquiries, proposals, landing pages, and other website submissions."
      />
      <div className="admin-content">
        <div className="admin-filter-bar">
          <label className="admin-label" style={{ margin: 0 }}>Filter:</label>
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="admin-card admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id}>
                    <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td>{getFormTypeLabel(msg.formType)}</td>
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.subject || "—"}</td>
                    <td>
                      <StatusBadge status={msg.status} />
                    </td>
                    <td>
                      <Link href={`/admin/messages/${msg.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {messages.length === 0 ? <p className="admin-inline-hint">No messages found.</p> : null}
          </div>
        )}
      </div>
    </>
  );
}
