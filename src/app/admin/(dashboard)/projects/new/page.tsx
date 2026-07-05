"use client";

import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  const router = useRouter();

  return (
    <>
      <AdminHeader title="New Project" />
      <div className="admin-content">
        <ProjectForm
          onSaved={(id) => {
            router.push(`/admin/projects/${id}`);
            router.refresh();
          }}
        />
      </div>
    </>
  );
}
