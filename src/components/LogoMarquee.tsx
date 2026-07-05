"use client";

import Image from "next/image";
import Link from "next/link";
import MalamihLogo from "@/components/MalamihLogo";
import { useSiteMedia, useTranslations } from "@/context/LocaleProvider";
import styles from "./LogoMarquee.module.css";

const LOGOS_PER_GROUP = 10;
const GROUP_COUNT = 4;

function MarqueeGroup({
  hidden = false,
  useCmsLogos,
}: {
  hidden?: boolean;
  useCmsLogos: boolean;
}) {
  const { logos } = useSiteMedia();

  return (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {Array.from({ length: LOGOS_PER_GROUP }, (_, index) => (
        <div key={index} className={styles.logoItem}>
          <span className={styles.logoImage}>
            {useCmsLogos && logos[index] ? (
              logos[index].link ? (
                <Link href={logos[index].link} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={logos[index].imageUrl}
                    alt={logos[index].name}
                    width={120}
                    height={40}
                    className={styles.clientLogo}
                  />
                </Link>
              ) : (
                <Image
                  src={logos[index].imageUrl}
                  alt={logos[index].name}
                  width={120}
                  height={40}
                  className={styles.clientLogo}
                />
              )
            ) : (
              <MalamihLogo />
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function MarqueeRow({
  reverse = false,
  useCmsLogos,
}: {
  reverse?: boolean;
  useCmsLogos: boolean;
}) {
  return (
    <div className={styles.mask}>
      <div
        className={`${styles.track} ${reverse ? styles.trackReverse : ""}`}
      >
        {Array.from({ length: GROUP_COUNT }, (_, index) => (
          <MarqueeGroup key={index} hidden={index > 0} useCmsLogos={useCmsLogos} />
        ))}
      </div>
    </div>
  );
}

export default function LogoMarquee() {
  const t = useTranslations();
  const { logos } = useSiteMedia();
  const useCmsLogos = logos.length > 0;

  return (
    <div className="framer-vh60ur-container" id="brands">
      <section className={styles.brands} aria-label={t.home.commitment.marqueeLabel}>
        <MarqueeRow useCmsLogos={useCmsLogos} />
        <MarqueeRow reverse useCmsLogos={useCmsLogos} />
      </section>
    </div>
  );
}
