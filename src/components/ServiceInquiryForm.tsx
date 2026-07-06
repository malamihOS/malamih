"use client";

import { FormEvent, useState } from "react";
import InquirySelect from "@/components/InquirySelect";
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
  const [budgetRange, setBudgetRange] = useState("");
  const [contactMethod, setContactMethod] = useState("email");

  const budgetOptions = [
    { value: "under-5k", label: t.growth.budget.under5k },
    { value: "5k-15k", label: t.growth.budget.range5k15k },
    { value: "15k-50k", label: t.growth.budget.range15k50k },
    { value: "50k-100k", label: t.growth.budget.range50k100k },
    { value: "100k+", label: t.growth.budget.over100k },
    { value: "not-sure", label: t.growth.budget.notSure },
  ];

  const contactOptions = [
    { value: "email", label: t.growth.inquiry.contactEmail },
    { value: "phone", label: t.growth.inquiry.contactPhone },
    { value: "whatsapp", label: t.growth.inquiry.contactWhatsApp },
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (!budgetRange) {
      setError(t.growth.inquiry.budget);
      setSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      company: String(formData.get("company") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      service: serviceSlug,
      description: String(formData.get("description") ?? ""),
      budgetRange,
      contactMethod,
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
        <InquirySelect
          name="budgetRange"
          value={budgetRange}
          onChange={setBudgetRange}
          placeholder={t.growth.inquiry.budget}
          options={budgetOptions}
        />
        <InquirySelect
          name="contactMethod"
          value={contactMethod}
          onChange={setContactMethod}
          placeholder={t.growth.inquiry.contactEmail}
          options={contactOptions}
        />
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
