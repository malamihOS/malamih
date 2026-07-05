"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "@/context/LocaleProvider";
import ProjectInquiryForm from "@/components/ProjectInquiryForm";
import type { Project, ProjectSection } from "@/data/projects";
import styles from "./ProjectDetail.module.css";

const REVEAL = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function ProjectImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={`${styles.imageFrame} ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={styles.image}
        priority={priority}
      />
    </div>
  );
}

function ContentBlock({ section }: { section: ProjectSection }) {
  return (
    <motion.section
      className={styles.contentBlock}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={REVEAL}
    >
      <p className={styles.blockLabel}>{section.label}</p>
      <div className={styles.blockBody}>
        <h2 className={styles.blockHeading}>{section.heading}</h2>
        <div className={styles.blockText}>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default function ProjectDetail({ project }: { project: Project }) {
  const t = useTranslations();
  const { gallery, sections } = project;
  const labels = t.common.projectDetail;

  return (
    <article className={styles.page}>
      <motion.header
        className={styles.hero}
        initial="hidden"
        animate="visible"
        variants={REVEAL}
      >
        <div className={styles.heroGrid}>
          <div className={styles.heroMain}>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.summary}>{project.summary}</p>
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.liveButton}
            >
              <span>{labels.liveWebsite}</span>
              <span className={styles.liveIcon} aria-hidden="true" data-mirror-rtl>
                <svg viewBox="0 0 256 256" focusable="false">
                  <path d="M218.8,103.8,145.8,30.8a8,8,0,0,0-11.3,11.3l59.4,59.4H40a8,8,0,0,0,0,16H194l-59.4,59.4a8,8,0,0,0,11.3,11.3l73-73a8,8,0,0,0,0-11.3Z" />
                </svg>
              </span>
            </Link>
          </div>

          <dl className={styles.metaList}>
            <div className={styles.metaItem}>
              <dt>{labels.year}</dt>
              <dd>{project.year}</dd>
            </div>
            <div className={styles.metaDivider} aria-hidden="true" />
            <div className={styles.metaItem}>
              <dt>{labels.industry}</dt>
              <dd>{project.industry}</dd>
            </div>
            <div className={styles.metaDivider} aria-hidden="true" />
            <div className={styles.metaItem}>
              <dt>{labels.spaceOfWork}</dt>
              <dd>{project.spaceOfWork}</dd>
            </div>
            <div className={styles.metaDivider} aria-hidden="true" />
            <div className={styles.metaItem}>
              <dt>{labels.timeline}</dt>
              <dd>{project.timeline}</dd>
            </div>
          </dl>
        </div>
      </motion.header>

      <motion.div
        className={styles.heroImageWrap}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={REVEAL}
      >
        <ProjectImage
          src={gallery.hero}
          alt={project.title}
          className={styles.heroImage}
          sizes="100vw"
          priority
        />
      </motion.div>

      <div className={styles.body}>
        <ContentBlock section={sections.introduction} />

        <div className={styles.mosaicOne}>
          <ProjectImage
            src={gallery.mosaicOne.tall}
            alt={`${project.title} ${labels.showcaseAlt}`}
            className={styles.mosaicTall}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className={styles.mosaicStack}>
            <ProjectImage
              src={gallery.mosaicOne.top}
              alt={`${project.title} ${labels.detailAlt}`}
              className={styles.mosaicSmall}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <ProjectImage
              src={gallery.mosaicOne.bottom}
              alt={`${project.title} ${labels.detailAlt}`}
              className={styles.mosaicSmall}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <ContentBlock section={sections.challenges} />

        <div className={styles.mosaicTwo}>
          <div className={styles.mosaicStack}>
            <ProjectImage
              src={gallery.mosaicTwo.top}
              alt={`${project.title} ${labels.detailAlt}`}
              className={styles.mosaicSmall}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <ProjectImage
              src={gallery.mosaicTwo.bottom}
              alt={`${project.title} ${labels.detailAlt}`}
              className={styles.mosaicSmall}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <ProjectImage
            src={gallery.mosaicTwo.tall}
            alt={`${project.title} ${labels.showcaseAlt}`}
            className={styles.mosaicTall}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <ContentBlock section={sections.finalThoughts} />

        <motion.div
          className={styles.wideImageWrap}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={REVEAL}
        >
          <ProjectImage
            src={gallery.wide}
            alt={`${project.title} ${labels.finalAlt}`}
            className={styles.wideImage}
            sizes="100vw"
          />
        </motion.div>

        <ProjectInquiryForm projectSlug={project.slug} projectTitle={project.title} />
      </div>
    </article>
  );
}
