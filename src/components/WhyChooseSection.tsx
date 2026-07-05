"use client";

import { motion } from "framer-motion";
import { useSiteMedia, useTranslations } from "@/context/LocaleProvider";
import styles from "./WhyChooseSection.module.css";

const REVEAL = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const CARD_ICONS = [
  (
    <path d="M76,156a32,32,0,1,0,32,32A32,32,0,0,0,76,156Zm0,56a24,24,0,1,1,24-24A24,24,0,0,1,76,212ZM45.17,109.17,62.34,92,45.17,74.83a4,4,0,0,1,5.66-5.66L68,86.34,85.17,69.17a4,4,0,0,1,5.66,5.66L73.66,92l17.17,17.17a4,4,0,0,1-5.66,5.66L68,97.66,50.83,114.83a4,4,0,0,1-5.66-5.66Zm181.66,96a4,4,0,0,1-5.66,5.66L204,193.66l-17.17,17.17a4,4,0,0,1-5.66-5.66L198.34,188l-17.17-17.17a4,4,0,0,1,5.66-5.66L204,182.34l17.17-17.17a4,4,0,0,1,5.66,5.66L209.66,188Zm-46.21-93.41c-5.82,21-23.77,39.15-43.65,44.12a4.09,4.09,0,0,1-1,.12,4,4,0,0,1-1-7.88c16.94-4.24,32.87-20.42,37.88-38.49,3.47-12.53,3.55-31.51-15.74-50.8L148,49.66V80a4,4,0,0,1-8,0V40a4,4,0,0,1,4-4h40a4,4,0,0,1,0,8H153.66l9.17,9.17C180,70.35,186.33,91.16,180.62,111.76Z" />
  ),
  (
    <path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm92,100c0,10.16-22.26,21.21-57.11,25.8C163.61,145.62,164,137,164,128c0-41.16-8.07-75-20.28-90.65A92.14,92.14,0,0,1,220,128ZM128,36c13.24,0,28,37.78,28,92,0,9.45-.46,18.39-1.27,26.73-8.34.81-17.28,1.27-26.73,1.27-54.22,0-92-14.76-92-28A92.1,92.1,0,0,1,128,36ZM37.35,143.72C53,155.93,86.84,164,128,164c9,0,17.62-.39,25.8-1.11C149.21,197.74,138.16,220,128,220A92.14,92.14,0,0,1,37.35,143.72Zm106.37,74.93c8.63-11.06,15.19-31.22,18.3-56.63,25.41-3.11,45.57-9.67,56.63-18.3A92.23,92.23,0,0,1,143.72,218.65Z" />
  ),
  (
    <path d="M216,44H40A12,12,0,0,0,28,56V200a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V56A12,12,0,0,0,216,44ZM40,52H216a4,4,0,0,1,4,4v44H36V56A4,4,0,0,1,40,52ZM36,200V108h64v96H40A4,4,0,0,1,36,200Zm180,4H108V108H220v92A4,4,0,0,1,216,204Z" />
  ),
  (
    <path d="M219.86,47.36a12,12,0,0,0-11.22-11.22c-12-.71-42.82.38-68.35,25.91L134.35,68h-60a11.9,11.9,0,0,0-8.48,3.52L31.52,105.85a12,12,0,0,0,6.81,20.37l39.79,5.55,46.11,46.11,5.55,39.81a12,12,0,0,0,20.37,6.79l34.34-34.35a11.9,11.9,0,0,0,3.52-8.48v-60l5.94-5.94C219.48,90.18,220.57,59.41,219.86,47.36ZM36.21,115.6a3.94,3.94,0,0,1,1-4.09L71.53,77.17A4,4,0,0,1,74.35,76h52L78.58,123.76,39.44,118.3A3.94,3.94,0,0,1,36.21,115.6ZM180,181.65a4,4,0,0,1-1.17,2.83l-34.35,34.34a4,4,0,0,1-6.79-2.25l-5.46-39.15L180,129.65Zm-52-11.31L85.66,128l60.28-60.29c23.24-23.24,51.25-24.23,62.22-23.58a3.93,3.93,0,0,1,3.71,3.71c.65,11-.35,39-23.58,62.22ZM98.21,189.48C94,198.66,80,220,40,220a4,4,0,0,1-4-4c0-40,21.34-54,30.52-58.21a4,4,0,0,1,3.32,7.28c-7.46,3.41-24.43,14.66-25.76,46.85,32.19-1.33,43.44-18.3,46.85-25.76a4,4,0,1,1,7.28,3.32Z" />
  ),
] as const;

export default function WhyChooseSection() {
  const t = useTranslations();
  const { why } = useSiteMedia();

  return (
    <section
      className={`framer-clk980 ${styles.section}`}
      aria-labelledby="why-choose-heading"
    >
      <div className={styles.inner}>
        <motion.div
          className={styles.topGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={REVEAL}
        >
          <div className={styles.labelBlock}>
            <p className={styles.sectionLabel}>
              <span className={styles.sectionNumber}>(03)</span>
              {t.home.why.label}
            </p>
          </div>

          <h2 id="why-choose-heading" className={styles.heading}>
            {t.home.why.headingLine1}
            <br />
            {t.home.why.headingLine2}
          </h2>

          <div className={styles.videoWrap}>
            <video
              className={styles.video}
              src={why.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
            />
          </div>
        </motion.div>

        <div className={styles.cards}>
          {t.home.why.cards.map((card, index) => (
            <motion.article
              key={card.title}
              className={styles.card}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={REVEAL}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon} aria-hidden="true">
                  <svg viewBox="0 0 256 256" focusable="false">
                    {CARD_ICONS[index]}
                  </svg>
                </span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
              </div>
              <p className={styles.cardDescription}>{card.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
