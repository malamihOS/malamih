"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "@/context/LocaleProvider";
import { readStoredUtmClient } from "@/lib/leads/utm";
import styles from "./ServiceInquiryForm.module.css";

type ServiceInquiryFormProps = {
  serviceSlug: string;
  serviceTitle: string;
  onClose?: () => void;
};

export default function ServiceInquiryForm({
  serviceSlug,
  serviceTitle,
  onClose,
}: ServiceInquiryFormProps) {
  const { t } = useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      company: String(formData.get("company") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      service: serviceSlug,
      description: String(formData.get("description") ?? ""),
      budgetRange: String(formData.get("budgetRange") ?? ""),
      contactMethod: String(formData.get("contactMethod") ?? ""),
      website: String(formData.get("website") ?? ""),
      sourcePage: window.location.pathname,
      ...readStoredUtmClient(),
    };

    try {
      const res = await fetch("/api/inquiry/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to submit");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className={styles.panel} role="status">
        <p>{t.growth.inquiry.success}</p>
        {onClose ? (
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            {t.growth.inquiry.close}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <form className={styles.panel} onSubmit={handleSubmit}>
      <p className={styles.heading}>
        {t.growth.inquiry.title} — {serviceTitle}
      </p>
      <div className={styles.grid}>
        <input name="name" required placeholder={t.growth.inquiry.name} className={styles.input} />
        <input name="company" placeholder={t.growth.inquiry.company} className={styles.input} />
        <input name="phone" type="tel" placeholder={t.growth.inquiry.phone} className={styles.input} />
        <input name="email" type="email" required placeholder={t.growth.inquiry.email} className={styles.input} />
      </div>
      <textarea
        name="description"
        required
        rows={3}
        placeholder={t.growth.inquiry.description}
        className={styles.textarea}
      />
      <div className={styles.grid}>
        <select name="budgetRange" className={styles.input} defaultValue="">
          <option value="" disabled>
            {t.growth.inquiry.budget}
          </option>
          <option value="under-5k">{t.growth.budget.under5k}</option>
          <option value="5k-15k">{t.growth.budget.range5k15k}</option>
          <option value="15k-50k">{t.growth.budget.range15k50k}</option>
          <option value="50k-100k">{t.growth.budget.range50k100k}</option>
          <option value="100k+">{t.growth.budget.over100k}</option>
          <option value="not-sure">{t.growth.budget.notSure}</option>
        </select>
        <select name="contactMethod" className={styles.input} defaultValue="email">
          <option value="email">{t.growth.inquiry.contactEmail}</option>
          <option value="phone">{t.growth.inquiry.contactPhone}</option>
          <option value="whatsapp">{t.growth.inquiry.contactWhatsApp}</option>
        </select>
      </div>
      <input type="text" name="website" className={styles.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "..." : t.growth.inquiry.submit}
        </button>
        {onClose ? (
          <button type="button" className={styles.cancel} onClick={onClose}>
            {t.growth.inquiry.close}
          </button>
        ) : null}
      </div>
    </form>
  );
}
