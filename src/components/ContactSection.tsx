"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useContactSettings, useLocale, useSiteMedia } from "@/context/LocaleProvider";
import { readStoredUtmClient } from "@/lib/leads/utm";
import styles from "./ContactSection.module.css";

function PinIcon() {
  return (
    <svg viewBox="0 0 256 256" aria-hidden="true" focusable="false">
      <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 256 256" aria-hidden="true" focusable="false">
      <path d="M224,48H32a16,16,0,0,0-16,16V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V74.2l-96,67.29L32,74.2V64Zm0,128H32V95.81l96,67.29,96-67.29V192Z" />
    </svg>
  );
}

export default function ContactSection() {
  const { t } = useLocale();
  const { contact } = useSiteMedia();
  const contactSettings = useContactSettings();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const primaryEmail = contactSettings.emails[0] ?? "info@malamih.net";
  const primaryWhatsApp = contactSettings.whatsappNumbers[0];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setError("");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      company: String(formData.get("company") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
      sourcePage: window.location.pathname,
      ...readStoredUtmClient(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to send message");
      }

      setSubmitted(true);
      form.reset();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to send message",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.section} aria-labelledby="contact-heading">
      <div className={styles.heroImageWrap}>
        <Image
          src={contact.heroImage}
          alt={t.contact.heroAlt}
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
      </div>

      <div className={styles.contactBox}>
        <p className={styles.stepLabel}>{t.contact.stepLabel}</p>

        <div className={styles.contentColumn}>
          <h1 id="contact-heading" className={styles.title}>
            {t.contact.title}
          </h1>

          <p className={styles.subtitle}>{t.contact.subtitle}</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="contact-name" className={styles.fieldLabel}>
                {t.contact.form.name}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder={t.contact.form.namePlaceholder}
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-email" className={styles.fieldLabel}>
                {t.contact.form.email}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t.contact.form.emailPlaceholder}
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-phone" className={styles.fieldLabel}>
                {t.contact.form.phone}
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder={t.contact.form.phonePlaceholder}
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-company" className={styles.fieldLabel}>
                {t.contact.form.company}
              </label>
              <input
                id="contact-company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder={t.contact.form.companyPlaceholder}
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-subject" className={styles.fieldLabel}>
                {t.contact.form.subject}
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder={t.contact.form.subjectPlaceholder}
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-message" className={styles.fieldLabel}>
                {t.contact.form.message}
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={3}
                placeholder={t.contact.form.messagePlaceholder}
                className={styles.fieldTextarea}
              />
            </div>

            {error ? (
              <p className={styles.formError} role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitted
                ? t.contact.form.submitted
                : submitting
                  ? "..."
                  : t.contact.form.submit}
            </button>
          </form>

          <div className={styles.infoBox}>
            <div className={styles.infoBlock}>
              <div className={styles.infoHeading}>
                <span className={styles.infoIcon}>
                  <PinIcon />
                </span>
                <h2 className={styles.infoTitle}>{t.contact.info.addressTitle}</h2>
              </div>
              <Link
                href={contactSettings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.infoLink}
              >
                {contactSettings.address}
              </Link>
            </div>

            <div className={styles.infoDivider} aria-hidden="true" />

            <div className={styles.infoBlock}>
              <div className={styles.infoHeading}>
                <span className={styles.infoIcon}>
                  <MailIcon />
                </span>
                <h2 className={styles.infoTitle}>{t.contact.info.contactTitle}</h2>
              </div>
              <Link href={`mailto:${primaryEmail}`} className={styles.infoLink}>
                {primaryEmail}
              </Link>
              {primaryWhatsApp ? (
                <Link
                  href={primaryWhatsApp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                >
                  {primaryWhatsApp.label}
                </Link>
              ) : null}
            </div>
          </div>

          <div className={styles.teamGrid}>
            {contact.teamImages.map((item) => (
              <figure key={item.caption} className={styles.teamCard}>
                <div className={styles.teamImageWrap}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 635px"
                    className={styles.teamImage}
                  />
                </div>
                <figcaption className={styles.teamCaption}>
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
