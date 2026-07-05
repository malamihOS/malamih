import { notFound } from "next/navigation";
import { createPageMetadata } from "@/i18n/metadata";
import {
  getProjectBySlug,
  getRelatedProjects,
} from "@/data/projects";
import ProjectDetailPageView from "@/views/ProjectDetailPageView";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, "ar");

  if (!project) {
    return createPageMetadata("ar", "projectFallback");
  }

  return {
    title: `${project.seoTitle || project.title} — malamih`,
    description: project.seoDescription || project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, "ar");

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(slug, "ar");

  return (
    <ProjectDetailPageView project={project} relatedProjects={relatedProjects} />
  );
}
