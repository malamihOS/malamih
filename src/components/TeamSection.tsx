"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSiteMedia, useTranslations } from "@/context/LocaleProvider";
import styles from "./TeamSection.module.css";

const REVEAL = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function TeamSection() {
  const t = useTranslations();
  const { team } = useSiteMedia();
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!team.visible || team.members.length === 0) {
    return null;
  }

  return (
    <section
      id="team"
      className={styles.section}
      aria-labelledby="team-heading"
    >
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={REVEAL}
        >
          <p className={styles.sectionLabel}>
            <span className={styles.sectionNumber}>(05)</span>
            {t.home.team.label}
          </p>
          <h2 id="team-heading" className={styles.heading}>
            {t.home.team.heading}
          </h2>
        </motion.header>

        <div className={styles.grid}>
          {team.members.map((member, index) => {
            const isActive = activeId === member.id;

            return (
              <motion.article
                key={member.id}
                className={`${styles.member} ${isActive ? styles.memberActive : ""}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={{
                  ...REVEAL,
                  visible: {
                    ...REVEAL.visible,
                    transition: {
                      ...REVEAL.visible.transition,
                      delay: index * 0.08,
                    },
                  },
                }}
                onClick={() => setActiveId(isActive ? null : member.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveId(isActive ? null : member.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`${member.name}, ${member.position}`}
              >
                <div className={styles.imageWrap}>
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.image}
                  />
                </div>
                <div className={styles.meta}>
                  <h3 className={styles.name}>{member.name}</h3>
                  <p className={styles.position}>{member.position}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
