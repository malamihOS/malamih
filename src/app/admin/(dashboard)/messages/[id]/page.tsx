"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import SaveButton from "@/components/admin/SaveButton";
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
  sourcePage: string;
  createdAt: string;
};

type PageProps = { params: Promise<{ id: string }> };

export default function MessageDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [messageId, setMessageId] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [status, setStatus] = useState("new");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void params.then((p) => setMessageId(p.id));
  }, [params]);

  const load = useCallback(async () => {
    if (!messageId) return;
    setLoading(true);
    const { data, error: fetchError } = await adminFetch<{ message: Message }>(
      `/api/admin/messages/${messageId}`,
    );
    if (fetchError) setError(fetchError);
    else if (data) {
      setMessage(data.message);
      setStatus(data.message.status);
    }
    setLoading(false);
  }, [messageId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!messageId) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { error: saveError } = await adminFetch(`/api/admin/messages/${messageId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    if (saveError) setError(saveError);
    else {
      setSuccess("Status updated.");
      void load();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!messageId || !confirm("Delete this message?")) return;
    setDeleting(true);
    const { error: delError } = await adminFetch(`/api/admin/messages/${messageId}`, {
      method: "DELETE",
    });
    if (delError) {
      setError(delError);
      setDeleting(false);
    } else {
      router.push("/admin/messages");
    }
  }

  if (loading || !message) {
    return (
      <>
        <AdminHeader title="Message" />
        <div className="admin-content">{loading ? "Loading…" : "Message not found."}</div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title={`Message from ${message.name}`} />
      <div className="admin-content">
        <div className="admin-card">
          <p><strong>Type:</strong> {getFormTypeLabel(message.formType)}</p>
          <p><strong>Date:</strong> {new Date(message.createdAt).toLocaleString()}</p>
          {message.sourcePage ? <p><strong>Source page:</strong> {message.sourcePage}</p> : null}
          <p><strong>Status:</strong> <StatusBadge status={message.status} /></p>
          <p><strong>Name:</strong> {message.name}</p>
          <p><strong>Email:</strong> <a href={`mailto:${message.email}`}>{message.email}</a></p>
          {message.phone ? <p><strong>Phone:</strong> {message.phone}</p> : null}
          {message.company ? <p><strong>Company:</strong> {message.company}</p> : null}
          {message.subject ? <p><strong>Subject:</strong> {message.subject}</p> : null}
          <div style={{ marginTop: "1rem" }}>
            <strong>Message:</strong>
            <p style={{ whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>{message.message}</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="admin-card">
            <div className="admin-form-group">
              <label className="admin-label">Status</label>
              <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="admin-form-actions">
            <SaveButton loading={saving} error={error} success={success} label="Update status" />
            <button type="button" className="admin-btn admin-btn-danger" disabled={deleting} onClick={() => void handleDelete()}>
              {deleting ? "Deleting…" : "Delete message"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
