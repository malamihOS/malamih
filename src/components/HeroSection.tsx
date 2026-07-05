"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSiteMedia, useTranslations } from "@/context/LocaleProvider";
import type { HeroSlideAnimation } from "@/lib/cms/types";
import styles from "./HeroSection.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

const slideTransition = (delay: number, duration: number) => ({
  type: "tween" as const,
  ease: EASE,
  delay,
  duration,
});

const textTransition = (delay = 0) => ({
  type: "tween" as const,
  ease: EASE,
  duration: 1.15,
  delay,
});

type Slide3Phase = "idle" | "rise" | "expand";

export default function HeroSection() {
  const t = useTranslations();
  const { hero } = useSiteMedia();
  const slides = hero.slides;
  const [ready, setReady] = useState(false);
  const [slide3Phase, setSlide3Phase] = useState<Slide3Phase>("idle");
  const [showText, setShowText] = useState(false);
  const [slidesSettled, setSlidesSettled] = useState(false);

  const regularSlides = slides.slice(0, -1);
  const slide3 = slides[slides.length - 1];
  const slide3Anim = (slide3?.animation ?? {}) as HeroSlideAnimation;

  useEffect(() => {
    window.scrollTo(0, 0);
    setReady(true);
    const textTimer = window.setTimeout(() => setShowText(true), 2100);
    return () => window.clearTimeout(textTimer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    setSlide3Phase("rise");
  }, [ready]);

  const slide3Animate =
    slide3Phase === "idle"
      ? { y: slide3Anim.y ?? 1020, scale: slide3Anim.scale ?? 0.5 }
      : slide3Phase === "rise"
        ? { y: 0, scale: slide3Anim.riseScale ?? 0.6 }
        : { y: 0, scale: 1 };

  const slide3Transition =
    slide3Phase === "rise"
      ? slideTransition(slide3Anim.delay ?? 0.9, slide3Anim.duration ?? 2)
      : slide3Phase === "expand"
        ? slideTransition(0, slide3Anim.expandDuration ?? 1.25)
        : { duration: 0 };

  return (
    <section
      className={styles.hero}
      data-slides-settled={slidesSettled || undefined}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className={styles.slidesStage}>
        {regularSlides.map((slide) => {
          const anim = slide.animation as HeroSlideAnimation;
          return (
            <motion.div
              key={slide.id}
              className={styles.slide}
              style={{ zIndex: anim.zIndex ?? 1 }}
              initial={{ y: anim.y ?? 660, scale: anim.scale ?? 0.3 }}
              animate={
                ready
                  ? { y: 0, scale: anim.scale ?? 0.3 }
                  : { y: anim.y ?? 660, scale: anim.scale ?? 0.3 }
              }
              transition={slideTransition(anim.delay ?? 0, anim.duration ?? 1.35)}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.text}
                fill
                priority
                draggable={false}
                sizes="100vw"
                className={styles.slideImage}
                style={{ objectPosition: slide.objectPosition }}
              />
            </motion.div>
          );
        })}

        {slide3 ? (
          <motion.div
            className={styles.slide}
            style={{ zIndex: slide3Anim.zIndex ?? 3 }}
            initial={{ y: slide3Anim.y ?? 1020, scale: slide3Anim.scale ?? 0.5 }}
            animate={
              ready
                ? slide3Animate
                : { y: slide3Anim.y ?? 1020, scale: slide3Anim.scale ?? 0.5 }
            }
            transition={slide3Transition}
            onAnimationComplete={() => {
              if (slide3Phase === "rise") {
                setSlide3Phase("expand");
                return;
              }
              if (slide3Phase === "expand") {
                setSlidesSettled(true);
              }
            }}
          >
            <Image
              src={slide3.imageUrl}
              alt={slide3.text}
              fill
              priority
              draggable={false}
              sizes="100vw"
              className={styles.slideImage}
              style={{ objectPosition: slide3.objectPosition }}
            />
          </motion.div>
        ) : null}

        <div className={styles.progressiveBlur} aria-hidden />
      </div>

      <div className={styles.overlay} aria-hidden />

      <div className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.titleBlock}>
            <motion.h1
              className={styles.titleMain}
              initial={{ opacity: 0, y: 48 }}
              animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
              transition={textTransition()}
            >
              {t.common.brand.name}
            </motion.h1>
            <motion.h2
              className={styles.titleSub}
              initial={{ opacity: 0, y: 40 }}
              animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={textTransition(0.08)}
            >
              {t.common.brand.creative}
            </motion.h2>
          </div>

          <div className={styles.bottomRow}>
            <motion.ul
              className={styles.categories}
              initial={{ opacity: 0, y: 40 }}
              animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={textTransition(0.14)}
            >
              {t.home.hero.categories.map((category) => (
                <li key={category} className={styles.categoryItem}>
                  {category}
                </li>
              ))}
            </motion.ul>

            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0, y: 60 }}
              animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={textTransition(0.2)}
            >
              {t.home.hero.tagline1}
              <br />
              {t.home.hero.tagline2}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
