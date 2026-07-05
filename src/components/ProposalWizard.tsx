"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleProvider";
import { readStoredUtmClient } from "@/lib/leads/utm";
import { SERVICE_INQUIRY_SLUGS } from "@/lib/leads/types";
import styles from "./ProposalWizard.module.css";

const SERVICE_LABELS: Record<string, { en: string; ar: string }> = {
  branding: { en: "Branding", ar: "العلامة التجارية" },
  "digital-marketing": { en: "Digital Marketing", ar: "التسويق الرقمي" },
  "content-production": { en: "Content Production", ar: "إنتاج المحتوى" },
  "web-development": { en: "Web Development", ar: "تطوير المواقع" },
  "business-automation": { en: "Business Automation", ar: "أتمتة الأعمال" },
  consulting: { en: "Consulting", ar: "الاستشارات" },
};

export default function ProposalWizard() {
  const { t, locale } = useLocale();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [goals, setGoals] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function toggleService(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName,
          contactEmail,
          contactPhone,
          companyName,
          selectedServices: selected,
          goals,
          budgetRange,
          timeline,
          website: "",
          sourcePage: window.location.pathname,
          ...readStoredUtmClient(),
        }),
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
      <div className={styles.wrap}>
        <p className={styles.success} role="status">
          {t.growth.proposal.success}
        </p>
        <Link href="/" className={styles.link}>
          {t.common.notFound.backHome}
        </Link>
      </div>
    );
  }

  const steps = [
    t.growth.proposal.step1,
    t.growth.proposal.step2,
    t.growth.proposal.step3,
    t.growth.proposal.step4,
    t.growth.proposal.step5,
    t.growth.proposal.step6,
  ];

  return (
    <form className={styles.wrap} onSubmit={handleSubmit}>
      <h1 className={styles.title}>{t.growth.proposal.title}</h1>
      <p className={styles.steps} aria-live="polite">
        {steps[step - 1]} ({step}/6)
      </p>

      {step === 1 ? (
        <div className={styles.fieldGroup}>
          <p className={styles.label}>{t.growth.proposal.services}</p>
          <div className={styles.chips}>
            {SERVICE_INQUIRY_SLUGS.map((slug) => (
              <button
                key={slug}
                type="button"
                className={`${styles.chip} ${selected.includes(slug) ? styles.chipActive : ""}`}
                onClick={() => toggleService(slug)}
              >
                {locale === "ar" ? SERVICE_LABELS[slug].ar : SERVICE_LABELS[slug].en}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className={styles.fieldGroup}>
          <input className={styles.input} value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder={t.growth.proposal.companyPlaceholder} />
          <input className={styles.input} value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder={t.growth.proposal.contactName} required />
          <input className={styles.input} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder={t.growth.proposal.contactEmail} required />
          <input className={styles.input} type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder={t.growth.proposal.contactPhone} />
        </div>
      ) : null}

      {step === 3 ? (
        <textarea className={styles.textarea} value={goals} onChange={(e) => setGoals(e.target.value)} placeholder={t.growth.proposal.goalsPlaceholder} required rows={5} />
      ) : null}

      {step === 4 ? (
        <select className={styles.input} value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} required>
          <option value="" disabled>{t.growth.proposal.budget}</option>
          <option value="under-5k">{t.growth.budget.under5k}</option>
          <option value="5k-15k">{t.growth.budget.range5k15k}</option>
          <option value="15k-50k">{t.growth.budget.range15k50k}</option>
          <option value="50k-100k">{t.growth.budget.range50k100k}</option>
          <option value="100k+">{t.growth.budget.over100k}</option>
          <option value="not-sure">{t.growth.budget.notSure}</option>
        </select>
      ) : null}

      {step === 5 ? (
        <input className={styles.input} value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder={t.growth.proposal.timelinePlaceholder} required />
      ) : null}

      {step === 6 ? (
        <div className={styles.review}>
          <p><strong>{t.growth.proposal.services}:</strong> {selected.join(", ")}</p>
          <p><strong>{t.growth.proposal.company}:</strong> {companyName || "—"}</p>
          <p><strong>{t.growth.proposal.contactName}:</strong> {contactName}</p>
          <p><strong>{t.growth.proposal.contactEmail}:</strong> {contactEmail}</p>
          <p><strong>{t.growth.proposal.budget}:</strong> {budgetRange}</p>
          <p><strong>{t.growth.proposal.timeline}:</strong> {timeline}</p>
        </div>
      ) : null}

      {error ? <p className={styles.error} role="alert">{error}</p> : null}

      <div className={styles.actions}>
        {step > 1 ? (
          <button type="button" className={styles.secondary} onClick={() => setStep((s) => s - 1)}>
            {t.growth.proposal.back}
          </button>
        ) : null}
        {step < 6 ? (
          <button
            type="button"
            className={styles.primary}
            disabled={step === 1 && selected.length === 0}
            onClick={() => setStep((s) => s + 1)}
          >
            {t.growth.proposal.next}
          </button>
        ) : (
          <button type="submit" className={styles.primary} disabled={submitting}>
            {submitting ? "..." : t.growth.proposal.submit}
          </button>
        )}
      </div>
    </form>
  );
}
