"use client";

import { motion } from "framer-motion";
import ProjectListingCard from "@/components/ProjectListingCard";
import { useLocale } from "@/context/LocaleProvider";
import { getProjectCardData } from "@/data/projects";
import styles from "./ProjectsPageSection.module.css";

const REVEAL = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ProjectsPageSection() {
  const { locale, t, projects } = useLocale();
  const cards = projects.map((project) => getProjectCardData(project, locale));

  return (
    <section
      className={`framer-y0ck3m ${styles.section}`}
      aria-labelledby="projects-page-heading"
    >
      <div className={styles.inner}>
        <motion.header
          className={styles.hero}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={REVEAL}
        >
          <div className={styles.heroCopy}>
            <p className={styles.sectionLabel}>
              <span className={styles.sectionNumber}>(02)</span>
              {t.projects.page.label}
            </p>
            <h1 id="projects-page-heading" className={styles.heading}>
              {t.projects.page.headingLine1}
              <br />
              {t.projects.page.headingLine2}
            </h1>
          </div>
        </motion.header>

        <div className={styles.list}>
          {cards.map((project, index) => (
            <ProjectListingCard
              key={project.href}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
