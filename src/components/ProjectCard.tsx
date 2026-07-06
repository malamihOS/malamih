"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./ProjectCard.module.css";

export type ProjectCardData = {
  href: string;
  category: string;
  title: string;
  year: string;
  image: string;
  imagePosition?: string;
};

function SwapText({ text }: { text: string }) {
  return (
    <span className={styles.swapText}>
      <span className={styles.swapLine}>{text}</span>
      <span className={styles.swapLine} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: ProjectCardData;
  index?: number;
}) {
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={project.href} className={styles.cardLink}>
        <div className={styles.thumbnail}>
          <div className={styles.imageWrap}>
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 628px"
              className={styles.cardImage}
              style={{ objectPosition: project.imagePosition ?? "center" }}
            />
          </div>
        </div>

        <div className={styles.cardMeta}>
          <span className={styles.category}>{project.category}</span>
          <div className={styles.titleRow}>
            <SwapText text={project.title} />
          </div>
          <div className={styles.yearRow}>
            <SwapText text={project.year} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
