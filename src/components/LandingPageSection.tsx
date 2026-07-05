"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useLocale } from "@/context/LocaleProvider";
import { readStoredUtmClient } from "@/lib/leads/utm";
import styles from "./LandingPageSection.module.css";

type LandingPageData = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  coverImage: string;
  coverVideo: string;
  relatedService: string;
  ctaText: string;
  formFields: string[];
};

export default function LandingPageSection({ page }: { page: LandingPageData }) {
  const { t } = useLocale();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      company: String(formData.get("company") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
      landingSlug: page.slug,
      relatedService: page.relatedService,
      sourcePage: window.location.pathname,
      ...readStoredUtmClient(),
    };

    try {
      const res = await fetch("/api/landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.section}>
      {page.coverVideo ? (
        <video src={page.coverVideo} className={styles.cover} autoPlay muted loop playsInline />
      ) : page.coverImage ? (
        <div className={styles.coverWrap}>
          <Image src={page.coverImage} alt={page.title} fill className={styles.coverImg} sizes="100vw" priority />
        </div>
      ) : null}

      <div className={styles.inner}>
        <h1 className={styles.headline}>{page.headline || page.title}</h1>
        {page.description ? <p className={styles.description}>{page.description}</p> : null}

        {done ? (
          <p className={styles.success} role="status">{t.growth.inquiry.success}</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {page.formFields.includes("name") ? (
              <input name="name" required placeholder={t.growth.inquiry.name} className={styles.input} />
            ) : null}
            {page.formFields.includes("email") ? (
              <input name="email" type="email" required placeholder={t.growth.inquiry.email} className={styles.input} />
            ) : null}
            {page.formFields.includes("phone") ? (
              <input name="phone" placeholder={t.growth.inquiry.phone} className={styles.input} />
            ) : null}
            {page.formFields.includes("company") ? (
              <input name="company" placeholder={t.growth.inquiry.company} className={styles.input} />
            ) : null}
            {page.formFields.includes("message") ? (
              <textarea name="message" required rows={4} placeholder={t.growth.inquiry.description} className={styles.textarea} />
            ) : null}
            <input type="text" name="website" className={styles.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {error ? <p className={styles.error} role="alert">{error}</p> : null}
            <button type="submit" className={styles.button} disabled={submitting}>
              {submitting ? "..." : page.ctaText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
