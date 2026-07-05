"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import BilingualField from "@/components/admin/BilingualField";
import ImageUpload from "@/components/admin/ImageUpload";
import SaveButton from "@/components/admin/SaveButton";
import { adminFetch } from "@/lib/admin-client";

type TeamConfig = {
  labelEn: string;
  labelAr: string;
  headingEn: string;
  headingAr: string;
  visible: boolean;
};

type TeamMember = {
  id?: string;
  imageUrl: string;
  nameEn: string;
  nameAr: string;
  positionEn: string;
  positionAr: string;
  sortOrder: number;
  visible: boolean;
};

const EMPTY_CONFIG: TeamConfig = {
  labelEn: "",
  labelAr: "",
  headingEn: "",
  headingAr: "",
  visible: true,
};

export default function TeamAdminPage() {
  const [config, setConfig] = useState<TeamConfig>(EMPTY_CONFIG);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await adminFetch<{
      config: TeamConfig;
      members: TeamMember[];
    }>("/api/admin/team");

    if (fetchError) setError(fetchError);
    else if (data) {
      setConfig(data.config);
      setMembers(data.members);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveAll() {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { error: saveError } = await adminFetch("/api/admin/team", {
      method: "PUT",
      body: JSON.stringify({
        config,
        members: members.map((member, index) => ({
          ...member,
          sortOrder: index,
        })),
      }),
    });

    if (saveError) setError(saveError);
    else {
      setSuccess("Team section saved.");
      void load();
    }
    setSaving(false);
  }

  function updateMember(index: number, patch: Partial<TeamMember>) {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  function reorder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= members.length) return;
    const next = [...members];
    [next[index], next[target]] = [next[target], next[index]];
    setMembers(next);
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Team" />
        <div className="admin-content">Loading…</div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Team">
        <SaveButton label="Save all" loading={saving} type="button" onClick={() => void saveAll()} />
      </AdminHeader>
      <div className="admin-content">
        {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
        {success ? <div className="admin-alert admin-alert-success">{success}</div> : null}

        <div className="admin-card">
          <h2 className="admin-card-title">Section settings</h2>
          <BilingualField
            label="Section label"
            enName="teamLabelEn"
            arName="teamLabelAr"
            enValue={config.labelEn}
            arValue={config.labelAr}
            onEnChange={(v) => setConfig((c) => ({ ...c, labelEn: v }))}
            onArChange={(v) => setConfig((c) => ({ ...c, labelAr: v }))}
          />
          <BilingualField
            label="Heading"
            enName="teamHeadingEn"
            arName="teamHeadingAr"
            enValue={config.headingEn}
            arValue={config.headingAr}
            onEnChange={(v) => setConfig((c) => ({ ...c, headingEn: v }))}
            onArChange={(v) => setConfig((c) => ({ ...c, headingAr: v }))}
          />
          <label className="admin-checkbox-row">
            <input
              type="checkbox"
              checked={config.visible}
              onChange={(e) => setConfig((c) => ({ ...c, visible: e.target.checked }))}
            />
            Show team section on site
          </label>
        </div>

        <div className="admin-list-item-header" style={{ margin: "1.5rem 0 1rem" }}>
          <strong>Team members</strong>
          <button
            type="button"
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={() =>
              setMembers((prev) => [
                ...prev,
                {
                  imageUrl: "",
                  nameEn: "",
                  nameAr: "",
                  positionEn: "",
                  positionAr: "",
                  sortOrder: prev.length,
                  visible: true,
                },
              ])
            }
          >
            Add member
          </button>
        </div>

        {members.map((member, i) => (
          <div key={member.id ?? `new-${i}`} className="admin-card">
            <div className="admin-list-item-header">
              <strong>{member.nameEn || `Member ${i + 1}`}</strong>
              <div className="admin-list-item-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm"
                  onClick={() => reorder(i, -1)}
                  disabled={i === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-icon admin-btn-sm"
                  onClick={() => reorder(i, 1)}
                  disabled={i === members.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => setMembers((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  Remove
                </button>
              </div>
            </div>
            <ImageUpload
              value={member.imageUrl}
              onChange={(url) => updateMember(i, { imageUrl: url })}
            />
            <BilingualField
              label="Name"
              enName={`memberNameEn-${i}`}
              arName={`memberNameAr-${i}`}
              enValue={member.nameEn}
              arValue={member.nameAr}
              onEnChange={(v) => updateMember(i, { nameEn: v })}
              onArChange={(v) => updateMember(i, { nameAr: v })}
            />
            <BilingualField
              label="Position"
              enName={`memberPositionEn-${i}`}
              arName={`memberPositionAr-${i}`}
              enValue={member.positionEn}
              arValue={member.positionAr}
              onEnChange={(v) => updateMember(i, { positionEn: v })}
              onArChange={(v) => updateMember(i, { positionAr: v })}
            />
            <label className="admin-checkbox-row">
              <input
                type="checkbox"
                checked={member.visible}
                onChange={(e) => updateMember(i, { visible: e.target.checked })}
              />
              Visible
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
