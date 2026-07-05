import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/navigation";
import type { CmsProject } from "@/lib/cms/types";
import {
  getAllProjectsForLocale,
  getCmsProjectBySlug,
  getHomepageProjects,
  getRelatedCmsProjects,
  getAllPublishedProjectSlugs,
} from "@/lib/cms/get-content";

export type ProjectSection = CmsProject["sections"]["introduction"];

export type Project = CmsProject;

export async function getAllProjectSlugs() {
  return getAllPublishedProjectSlugs();
}

export async function getProjectBySlug(slug: string, locale: Locale) {
  return getCmsProjectBySlug(slug, locale);
}

export async function getAllProjects(locale: Locale) {
  return getAllProjectsForLocale(locale);
}

export async function getRelatedProjects(
  slug: string,
  locale: Locale,
  limit = 2,
) {
  return getRelatedCmsProjects(slug, locale, limit);
}

export async function getLatestProjects(limit: number, locale: Locale) {
  const projects = await getHomepageProjects(locale);
  return projects.slice(-limit);
}

export function getProjectCardData(project: CmsProject, locale: Locale) {
  return {
    href: localizePath(`/projects/${project.slug}`, locale),
    category: project.category,
    title: project.title,
    year: project.year,
    image: project.cardImage,
  };
}
