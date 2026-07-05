"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "@/context/LocaleProvider";
import { readStoredUtmClient } from "@/lib/leads/utm";
import styles from "./LeadMagnetForm.module.css";

type LeadMagnetFormProps = {
  slug: string;
  title: string;
};

export default function LeadMagnetForm({ slug, title }: LeadMagnetFormProps) {
  const { t } = useLocale();
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/lead-magnets/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          company: String(formData.get("company") ?? ""),
          website: String(formData.get("website") ?? ""),
          sourcePage: window.location.pathname,
          ...readStoredUtmClient(),
        }),
      });
      const data = (await res.json()) as { error?: string; downloadUrl?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setDownloadUrl(data.downloadUrl ?? "");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (done && downloadUrl) {
    return (
      <div className={styles.wrap}>
        <p className={styles.success} role="status">{t.growth.leadMagnet.success}</p>
        <a href={downloadUrl} className={styles.downloadBtn} download target="_blank" rel="noopener noreferrer">
          {t.growth.leadMagnet.download}: {title}
        </a>
      </div>
    );
  }

  return (
    <form className={styles.wrap} onSubmit={handleSubmit}>
      <input name="name" required placeholder={t.growth.leadMagnet.name} className={styles.input} />
      <input name="email" type="email" required placeholder={t.growth.leadMagnet.email} className={styles.input} />
      <input name="phone" placeholder={t.growth.leadMagnet.phone} className={styles.input} />
      <input name="company" placeholder={t.growth.leadMagnet.company} className={styles.input} />
      <input type="text" name="website" className={styles.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      <button type="submit" className={styles.button} disabled={submitting}>
        {submitting ? "..." : t.growth.leadMagnet.submit}
      </button>
    </form>
  );
}
