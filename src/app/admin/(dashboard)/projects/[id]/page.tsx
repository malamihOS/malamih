import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <>
      <AdminHeader title={`Edit: ${project.titleEn}`} />
      <div className="admin-content">
        <ProjectForm project={project} />
      </div>
    </>
  );
}
