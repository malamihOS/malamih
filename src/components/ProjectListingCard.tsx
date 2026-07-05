"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ProjectCardData } from "@/components/ProjectCard";
import styles from "./ProjectListingCard.module.css";

export default function ProjectListingCard({
  project,
  index = 0,
}: {
  project: ProjectCardData;
  index?: number;
}) {
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.75,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={project.href} className={styles.cardLink}>
        <div className={styles.media}>
          <div className={styles.imageWrap}>
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.cardImage}
            />
          </div>

          <div className={styles.meta}>
            <p className={styles.category}>{project.category}</p>
            <h2 className={styles.title}>{project.title}</h2>
            <p className={styles.year}>{project.year}</p>
          </div>
        </div>

        <div className={styles.spacer} aria-hidden="true" />
      </Link>
    </motion.article>
  );
}
