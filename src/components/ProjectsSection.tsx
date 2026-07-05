"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProjectListingCard from "@/components/ProjectListingCard";
import { useLocale } from "@/context/LocaleProvider";
import { getProjectCardData } from "@/data/projects";
import styles from "./ProjectsSection.module.css";

const REVEAL = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ProjectsSection() {
  const { locale, t, localizePath, projects } = useLocale();
  const homepageProjects = projects
    .filter((project) => project.showOnHomepage)
    .slice(-2);

  const cards = homepageProjects.map((project) =>
    getProjectCardData(project, locale),
  );

  return (
    <section
      className={`framer-1a8qshy ${styles.section}`}
      aria-labelledby="projects-heading"
    >
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={REVEAL}
        >
          <div className={styles.headerContent}>
            <p className={styles.sectionLabel}>
              <span className={styles.sectionNumber}>(02)</span>
              {t.home.projects.label}
            </p>
            <h2 id="projects-heading" className={styles.heading}>
              {t.home.projects.headingLine1}
              <br />
              {t.home.projects.headingLine2}
            </h2>
            <p className={styles.description}>{t.home.projects.description}</p>
          </div>

          <div className={styles.headerFade} aria-hidden="true" />
          <div className={styles.divider} aria-hidden="true" />
        </motion.div>

        <div className={styles.grid}>
          {cards.map((project, index) => (
            <ProjectListingCard key={project.href} project={project} index={index} />
          ))}
        </div>

        <div className={styles.footer}>
          <Link href={localizePath("/projects")} className={styles.ctaButton}>
            <span>{t.home.projects.seeMore}</span>
            <span className={styles.ctaIcon} aria-hidden="true" data-mirror-rtl>
              <svg viewBox="0 0 256 256" focusable="false">
                <path d="M218.8,103.8,145.8,30.8a8,8,0,0,0-11.3,11.3l59.4,59.4H40a8,8,0,0,0,0,16H194l-59.4,59.4a8,8,0,0,0,11.3,11.3l73-73a8,8,0,0,0,0-11.3Z" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
