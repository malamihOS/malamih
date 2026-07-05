"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastProvider";

const EXPORT_ITEMS = [
  { type: "leads", label: "Leads CRM", formats: ["csv"] },
  { type: "newsletter", label: "Newsletter subscribers", formats: ["csv"] },
  { type: "proposals", label: "Proposal requests", formats: ["csv"] },
  { type: "lead-magnet-downloads", label: "Lead magnet downloads", formats: ["csv"] },
  { type: "projects", label: "Projects", formats: ["json", "csv"] },
  { type: "blog", label: "Blog posts", formats: ["json", "csv"] },
  { type: "messages", label: "Contact submissions", formats: ["json", "csv"] },
  { type: "services", label: "Services", formats: ["json", "csv"] },
  { type: "full", label: "Full CMS data", formats: ["json"] },
];

export default function ExportPage() {
  const { showToast } = useToast();

  function download(type: string, format: string) {
    const url = `/api/admin/export?type=${type}&format=${format}`;
    window.open(url, "_blank");
    showToast(`Export started (${type}.${format})`, "success");
  }

  return (
    <>
      <AdminHeader title="Backup & Export" />
      <div className="admin-content">
        <div className="admin-card">
          <h2 className="admin-card-title">Export data</h2>
          <p className="admin-inline-hint">
            Download CMS content for backup or migration. Exports include all bilingual fields.
          </p>

          <div className="admin-export-list">
            {EXPORT_ITEMS.map((item) => (
              <div key={item.type} className="admin-export-row">
                <span>{item.label}</span>
                <div className="admin-export-actions">
                  {item.formats.map((format) => (
                    <button
                      key={format}
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => download(item.type, format)}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title">Import (limited)</h2>
          <p className="admin-inline-hint">
            Safe project JSON import is supported via API POST /api/admin/export with type projects.
            Full import is not enabled to prevent accidental data overwrites.
          </p>
        </div>
      </div>
    </>
  );
}
