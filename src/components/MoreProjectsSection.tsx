"use client";

import ProjectCard from "@/components/ProjectCard";
import { useLocale } from "@/context/LocaleProvider";
import type { Project } from "@/data/projects";
import { getProjectCardData } from "@/data/projects";
import styles from "./MoreProjectsSection.module.css";

export default function MoreProjectsSection({
  projects,
}: {
  projects: Project[];
}) {
  const { locale, t } = useLocale();

  return (
    <section className={styles.section} aria-labelledby="more-projects-heading">
      <div className={styles.header}>
        <p className={styles.sectionLabel}>
          <span className={styles.sectionNumber}>(03)</span>
          {t.common.moreProjects.label}
        </p>
        <h2 id="more-projects-heading" className={styles.heading}>
          {t.common.moreProjects.heading}
        </h2>
      </div>

      <div className={styles.grid}>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={getProjectCardData(project, locale)}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
