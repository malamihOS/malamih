"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import LogoMarquee from "@/components/LogoMarquee";
import { useSiteMedia, useTranslations } from "@/context/LocaleProvider";
import styles from "./CommitmentSection.module.css";

const SLIDE_INTERVAL = 1000;
const COUNT_DURATION = 2000;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function CountUpStat({
  target,
  suffix,
  label,
  start,
}: {
  target: number;
  suffix: string;
  label: string;
  start: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / COUNT_DURATION, 1);
      setCount(Math.round(easeOutCubic(progress) * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [start, target]);

  return (
    <div className={styles.statItem}>
      <span className={styles.statValue} aria-label={`${target}${suffix}`}>
        {count}
        {suffix}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export default function CommitmentSection() {
  const t = useTranslations();
  const { commitment } = useSiteMedia();
  const slides = commitment.slides;
  const stats = commitment.stats;
  const [activeIndex, setActiveIndex] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const element = statsRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const headingLines = t.home.commitment.heading.split("\n");

  return (
    <section className={styles.section} aria-labelledby="commitment-heading">
      <div className={styles.inner}>
        <div className={styles.imageColumn}>
          <div className={styles.slideshow}>
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`${styles.slide} ${index === activeIndex ? styles.slideActive : ""}`}
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className={styles.slideImage}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.contentColumn}>
          <h2 id="commitment-heading" className={styles.heading}>
            {headingLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < headingLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>

          <p className={styles.description}>{t.home.commitment.description}</p>

          <div ref={statsRef} className={styles.stats}>
            {stats.map((stat) => (
              <CountUpStat
                key={stat.id}
                target={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                start={statsVisible}
              />
            ))}
          </div>
        </div>
      </div>

      <LogoMarquee />
    </section>
  );
}
