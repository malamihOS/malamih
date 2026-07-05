"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import FormField from "@/components/admin/FormField";
import { useToast } from "@/components/admin/ToastProvider";
import { getRoleLabel, type AdminRole } from "@/lib/permissions";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "editor" as AdminRole,
  });
  const [creating, setCreating] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load users");
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create user");
      setUsers((prev) => [...prev, data.user]);
      setForm({ email: "", password: "", name: "", role: "editor" });
      showToast("User created", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to create user", "error");
    }
    setCreating(false);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/users?id=${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      showToast("User deleted", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete user", "error");
    }
    setDeleteId(null);
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Users" />
        <div className="admin-content">Loading…</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminHeader title="Users" />
        <div className="admin-content">
          <div className="admin-alert admin-alert-error">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Users" />
      <div className="admin-content">
        <div className="admin-card">
          <h2 className="admin-card-title">Admin users</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name || "—"}</td>
                    <td>{user.email}</td>
                    <td>{getRoleLabel(user.role)}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => setDeleteId(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={handleCreate}>
          <div className="admin-card">
            <h2 className="admin-card-title">Add user</h2>
            <FormField
              label="Name"
              value={form.name}
              onChange={(v) => setForm((p) => ({ ...p, name: v }))}
            />
            <FormField
              label="Email"
              value={form.email}
              onChange={(v) => setForm((p) => ({ ...p, email: v }))}
            />
            <FormField
              label="Password"
              value={form.password}
              onChange={(v) => setForm((p) => ({ ...p, password: v }))}
              hint="Minimum 8 characters"
            />
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="user-role">
                Role
              </label>
              <select
                id="user-role"
                className="admin-select"
                value={form.role}
                onChange={(e) =>
                  setForm((p) => ({ ...p, role: e.target.value as AdminRole }))
                }
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={creating}
            >
              {creating ? "Creating…" : "Create user"}
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete user?"
        message="This user will lose access to the admin dashboard immediately."
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
