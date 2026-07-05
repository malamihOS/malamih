"use client";

import Link from "next/link";
import { useLenis } from "lenis/react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useLocale } from "@/context/LocaleProvider";
import { SITE_MAPS_URL, SOCIAL_LINKS, TALK_LINKS } from "@/data/site";
import styles from "./FooterSection.module.css";

const MARQUEE_REPEAT = 4;

function BackToTopButton({ label }: { label: string }) {
  const lenis = useLenis();

  function handleClick() {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      className={styles.backToTop}
      onClick={handleClick}
      aria-label={label}
    >
      <svg viewBox="0 0 256 256" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M205.66,117.66l-72-72a8,8,0,0,0-11.32,0l-72,72A8,8,0,0,0,56,133.66H200a8,8,0,0,0,11.32-16Z"
        />
      </svg>
    </button>
  );
}

function ArrowIcon() {
  return (
    <svg
      className={styles.arrowIcon}
      viewBox="0 0 256 256"
      aria-hidden="true"
      focusable="false"
      data-mirror-rtl
    >
      <path
        fill="currentColor"
        d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"
      />
    </svg>
  );
}

function SwapText({ text }: { text: string }) {
  return (
    <span className={styles.swapText}>
      <span className={styles.swapLine}>{text}</span>
      <span className={styles.swapLine} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

function FooterLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const isExternal =
    external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

  return (
    <Link
      href={href}
      className={styles.footerLink}
      {...(isExternal && !href.startsWith("mailto:") && !href.startsWith("tel:")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <span className={styles.linkText}>
        <SwapText text={label} />
      </span>
      <ArrowIcon />
    </Link>
  );
}

function NavColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <nav className={styles.navGroup} aria-label={title}>
      <p className={styles.sectionLabel}>{title}</p>
      {links.map((link) => (
        <FooterLink key={link.href} href={link.href} label={link.label} />
      ))}
    </nav>
  );
}

function MarqueeGroup({
  items,
  hidden = false,
}: {
  items: string[];
  hidden?: boolean;
}) {
  return (
    <div className={styles.marqueeGroup} aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <h2 key={`${item}-${index}`} className={styles.marqueeText}>
          {item}
        </h2>
      ))}
    </div>
  );
}

export default function FooterSection() {
  const { t, localizePath } = useLocale();

  const navLinks = [
    { label: t.common.nav.home, href: localizePath("/") },
    { label: t.common.nav.projects, href: localizePath("/projects") },
    { label: t.common.nav.blog, href: localizePath("/blog") },
    { label: t.common.nav.services, href: `${localizePath("/")}#services` },
    { label: t.common.nav.contact, href: localizePath("/contact") },
  ];

  const priorityLinks = [
    {
      label: t.common.footer.terms,
      href: localizePath("/legal/terms-and-conditions"),
    },
    {
      label: t.common.footer.privacy,
      href: localizePath("/legal/privacy-policy"),
    },
  ];

  return (
    <div className={`framer-a4cglu-container ${styles.container}`}>
      <footer className={styles.footer}>
        <div className={styles.inner}>
          <div className={styles.topRow}>
            <div className={styles.socialRow}>
              {SOCIAL_LINKS.map((link) => (
                <FooterLink
                  key={link.key}
                  href={link.href}
                  label={t.site.social[link.key]}
                  external
                />
              ))}
            </div>

            <BackToTopButton label={t.common.footer.backToTop} />
          </div>

          <div className={styles.grid}>
            <div className={styles.contactCol}>
              <div className={styles.contactIntro}>
                <p className={styles.sectionLabel}>{t.common.footer.contactUs}</p>
                <h2 className={styles.contactHeading}>{t.common.footer.haveProject}</h2>
              </div>
              <NewsletterSignup sourcePage="/" variant="inline" />
            </div>

            <div className={styles.navCol}>
              <NavColumn title={t.common.footer.letsTalk} links={TALK_LINKS} />
              <NavColumn title={t.common.footer.navigation} links={navLinks} />
              <NavColumn title={t.common.footer.priority} links={priorityLinks} />
            </div>
          </div>

          <div className={styles.marqueeWrap} aria-hidden="true">
            <div className={styles.marqueeTrack}>
              {Array.from({ length: MARQUEE_REPEAT * 2 }, (_, index) => (
                <MarqueeGroup
                  key={index}
                  items={t.common.footer.marquee}
                  hidden={index > 0}
                />
              ))}
            </div>
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.credit}>
              <span className={styles.creditLabel}>{t.common.footer.basedIn}</span>
              <Link href={SITE_MAPS_URL} className={styles.creditLink} target="_blank" rel="noopener noreferrer">
                <span className={styles.creditText}>
                  <SwapText text={t.site.address} />
                </span>
              </Link>
            </div>

            <p className={styles.copyright}>{t.common.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
