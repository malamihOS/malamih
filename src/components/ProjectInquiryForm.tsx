"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "@/context/LocaleProvider";
import { readStoredUtmClient } from "@/lib/leads/utm";
import styles from "./ServiceInquiryForm.module.css";

type ProjectInquiryFormProps = {
  projectSlug: string;
  projectTitle: string;
};

export default function ProjectInquiryForm({
  projectSlug,
  projectTitle,
}: ProjectInquiryFormProps) {
  const { t } = useLocale();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/inquiry/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          company: String(formData.get("company") ?? ""),
          message: String(formData.get("message") ?? ""),
          projectSlug,
          projectTitle,
          website: String(formData.get("website") ?? ""),
          sourcePage: window.location.pathname,
          ...readStoredUtmClient(),
        }),
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

  if (done) {
    return (
      <div className={styles.panel} role="status">
        <p>{t.growth.projectInquiry.success}</p>
      </div>
    );
  }

  return (
    <form className={styles.panel} onSubmit={handleSubmit}>
      <p className={styles.heading}>
        {t.growth.projectInquiry.title} — {projectTitle}
      </p>
      <div className={styles.grid}>
        <input name="name" required placeholder={t.growth.inquiry.name} className={styles.input} />
        <input name="email" type="email" required placeholder={t.growth.inquiry.email} className={styles.input} />
        <input name="phone" placeholder={t.growth.inquiry.phone} className={styles.input} />
        <input name="company" placeholder={t.growth.inquiry.company} className={styles.input} />
      </div>
      <textarea name="message" required rows={3} placeholder={t.growth.inquiry.description} className={styles.textarea} />
      <input type="text" name="website" className={styles.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? "..." : t.growth.projectInquiry.submit}
      </button>
    </form>
  );
}
