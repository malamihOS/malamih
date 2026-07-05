"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleProvider";
import styles from "./NotFoundSection.module.css";

export default function NotFoundSection() {
  const { t, localizePath } = useLocale();

  return (
    <section className={styles.section} aria-labelledby="not-found-title">
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.label}>{t.common.notFound.label}</p>
          <p className={styles.code} aria-hidden="true">
            404
          </p>
          <h1 id="not-found-title" className={styles.title}>
            {t.common.notFound.title}
          </h1>
          <p className={styles.description}>{t.common.notFound.description}</p>

          <div className={styles.actions}>
            <Link href={localizePath("/")} className={styles.primaryButton}>
              <span>{t.common.notFound.backHome}</span>
              <span className={styles.buttonIcon} aria-hidden="true" data-mirror-rtl>
                <svg viewBox="0 0 256 256" focusable="false">
                  <path d="M218.8,103.8,145.8,30.8a8,8,0,0,0-11.3,11.3l59.4,59.4H40a8,8,0,0,0,0,16H194l-59.4,59.4a8,8,0,0,0,11.3,11.3l73-73a8,8,0,0,0,0-11.3Z" />
                </svg>
              </span>
            </Link>
            <Link href={localizePath("/projects")} className={styles.secondaryButton}>
              {t.common.notFound.viewProjects}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
