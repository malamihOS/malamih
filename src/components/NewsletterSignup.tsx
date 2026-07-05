"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "@/context/LocaleProvider";
import { readStoredUtmClient } from "@/lib/leads/utm";
import styles from "./NewsletterSignup.module.css";

type NewsletterSignupProps = {
  sourcePage?: string;
  variant?: "inline" | "block";
};

export default function NewsletterSignup({
  sourcePage = "",
  variant = "block",
}: NewsletterSignupProps) {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          sourcePage: sourcePage || window.location.pathname,
          website: "",
          ...readStoredUtmClient(),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to subscribe");
      setDone(true);
      setEmail("");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`${styles.wrap} ${styles[variant]}`}>
      <p className={styles.label}>{t.growth.newsletter.label}</p>
      <p className={styles.title}>{t.growth.newsletter.title}</p>
      {done ? (
        <p className={styles.success} role="status">
          {t.growth.newsletter.success}
        </p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.growth.newsletter.namePlaceholder}
            className={styles.input}
            autoComplete="name"
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.growth.newsletter.emailPlaceholder}
            className={styles.input}
            required
            autoComplete="email"
          />
          <input type="text" name="website" className={styles.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />
          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className={styles.button} disabled={submitting}>
            {submitting ? "..." : t.growth.newsletter.submit}
          </button>
        </form>
      )}
    </div>
  );
}
