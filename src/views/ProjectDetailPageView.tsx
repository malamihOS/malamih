import Header from "@/components/Header";
import MoreProjectsSection from "@/components/MoreProjectsSection";
import ProjectDetail from "@/components/ProjectDetail";
import type { Project } from "@/data/projects";

export default function ProjectDetailPageView({
  project,
  relatedProjects,
}: {
  project: Project;
  relatedProjects: Project[];
}) {
  return (
    <main>
      <Header variant="page" />
      <ProjectDetail project={project} />
      <MoreProjectsSection projects={relatedProjects} />
    </main>
  );
}
