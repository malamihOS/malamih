"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminFetch } from "@/lib/admin-client";

type Subscriber = {
  id: string;
  email: string;
  name: string;
  status: string;
  sourcePage: string;
  createdAt: string;
};

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminFetch<{ subscribers: Subscriber[] }>("/api/admin/newsletter");
    if (data) setSubscribers(data.subscribers);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <AdminHeader title="Newsletter" />
      <div className="admin-content">
        <p className="admin-inline-hint">
          Marketing emails are not sent automatically unless SMTP is configured in Integrations.
        </p>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="admin-card admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id}>
                    <td>{s.email}</td>
                    <td>{s.name || "—"}</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td>{s.sourcePage || "—"}</td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {subscribers.length === 0 ? (
              <p className="admin-inline-hint">No subscribers yet.</p>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
