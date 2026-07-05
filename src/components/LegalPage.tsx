"use client";

import Link from "next/link";
import type { LegalSection } from "@/data/legal/types";
import { useLocale, useTranslations } from "@/context/LocaleProvider";
import styles from "./LegalPage.module.css";

type LegalPageProps = {
  type: "terms" | "privacy";
};

function renderParagraph(
  text: string,
  index: number,
  {
    type,
    agencyName,
    termsContact,
    privacyContact,
    contactPage,
    officialWebsite,
    contactHref,
  }: {
    type: "terms" | "privacy";
    agencyName: string;
    termsContact: string;
    privacyContact: string;
    contactPage: string;
    officialWebsite: string;
    contactHref: string;
  },
) {
  if (text === agencyName) {
    return (
      <p key={index} className={styles.paragraph}>
        <strong>{text}</strong>
      </p>
    );
  }

  if (text === termsContact && type === "terms") {
    return (
      <p key={index} className={styles.paragraph}>
        {termsContact}{" "}
        <Link href={contactHref} className={styles.contactLink}>
          {contactPage}
        </Link>
        .
      </p>
    );
  }

  if (text === privacyContact && type === "privacy") {
    if (text.includes(officialWebsite)) {
      const [beforeWebsite, afterWebsite] = text.split(officialWebsite);

      return (
        <p key={index} className={styles.paragraph}>
          {beforeWebsite}
          <Link href={contactHref} className={styles.contactLink}>
            {officialWebsite}
          </Link>
          {afterWebsite}
        </p>
      );
    }

    return (
      <p key={index} className={styles.paragraph}>
        {privacyContact}{" "}
        <Link href={contactHref} className={styles.contactLink}>
          {officialWebsite}
        </Link>
        .
      </p>
    );
  }

  return (
    <p key={index} className={styles.paragraph}>
      {text}
    </p>
  );
}

function renderSection(
  section: LegalSection,
  context: Parameters<typeof renderParagraph>[2],
) {
  return (
    <div key={section.title} className={styles.block}>
      <h2 className={styles.sectionTitle}>{section.title}</h2>

      {section.list ? (
        <>
          {section.paragraphs?.[0]
            ? renderParagraph(section.paragraphs[0], 0, context)
            : null}
          <ul className={styles.list}>
            {section.list.map((item) => (
              <li key={item} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
          {section.paragraphs?.slice(1).map((paragraph, index) =>
            renderParagraph(paragraph, index + 1, context),
          )}
        </>
      ) : (
        section.paragraphs?.map((paragraph, index) =>
          renderParagraph(paragraph, index, context),
        )
      )}
    </div>
  );
}

export default function LegalPage({ type }: LegalPageProps) {
  const t = useTranslations();
  const { localizePath } = useLocale();
  const legal = t.legal[type];
  const dateLabel =
    type === "terms"
      ? t.common.legal.effectiveDate
      : t.common.legal.lastUpdated;

  const paragraphContext = {
    type,
    agencyName: t.common.legal.agencyName,
    termsContact: t.common.legal.termsContact,
    privacyContact: t.common.legal.privacyContact,
    contactPage: t.common.legal.contactPage,
    officialWebsite: t.common.legal.officialWebsite,
    contactHref: localizePath("/contact"),
  };

  return (
    <section className={styles.section} aria-labelledby="legal-page-title">
      <div className={styles.inner}>
        <article className={styles.content}>
          <p className={styles.meta}>
            {dateLabel}: {legal.date}
          </p>
          <h1 id="legal-page-title" className={styles.title}>
            {legal.title}
          </h1>

          <div className={styles.sections}>
            {legal.sections.map((section) =>
              renderSection(section, paragraphContext),
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
