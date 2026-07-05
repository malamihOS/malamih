import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { prisma } from "@/lib/prisma";

export default async function ProjectsListPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <AdminHeader title="Projects">
        <Link href="/admin/projects/new" className="admin-btn admin-btn-primary admin-btn-sm">
          New project
        </Link>
      </AdminHeader>
      <div className="admin-content">
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Homepage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.titleEn}</td>
                  <td>{project.slug}</td>
                  <td>
                    <StatusBadge status={project.status} />
                  </td>
                  <td>{project.showOnHomepage ? "Yes" : "No"}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Link href={`/admin/projects/${project.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 ? <p className="admin-inline-hint">No projects yet.</p> : null}
        </div>
      </div>
    </>
  );
}
