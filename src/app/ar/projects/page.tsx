import { createPageMetadata } from "@/i18n/metadata";
import ProjectsPageView from "@/views/ProjectsPageView";

export async function generateMetadata() {
  return createPageMetadata("ar", "projects");
}

export default function ProjectsPage() {
  return <ProjectsPageView />;
}
