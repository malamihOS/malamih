import { createPageMetadata } from "@/i18n/metadata";
import ProjectsPageView from "@/views/ProjectsPageView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return createPageMetadata("en", "projects");
}

export default function ProjectsPage() {
  return <ProjectsPageView />;
}
