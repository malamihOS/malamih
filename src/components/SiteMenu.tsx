"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleProvider";
import { SOCIAL_LINKS } from "@/data/site";
import styles from "./SiteMenu.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

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

function MenuLink({
  href,
  label,
  external = false,
  className,
  onClick,
  showArrow = false,
}: {
  href: string;
  label: string;
  external?: boolean;
  className?: string;
  onClick?: () => void;
  showArrow?: boolean;
}) {
  const isMailto = href.startsWith("mailto:");

  return (
    <Link
      href={href}
      className={className}
      onClick={onClick}
      {...(external || isMailto
        ? isMailto
          ? {}
          : { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <span className={showArrow ? styles.linkText : undefined}>
        <SwapText text={label} />
      </span>
      {showArrow ? <ArrowIcon /> : null}
    </Link>
  );
}

function LiveClock({ locale }: { locale: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) {
    return (
      <div className={styles.clock}>
        <span className={styles.clockLine}>&nbsp;</span>
        <span className={styles.clockLine}>&nbsp;</span>
      </div>
    );
  }

  const dateLocale = locale === "ar" ? "ar-IQ" : "en-US";
  const date = new Intl.DateTimeFormat(dateLocale, {
    month: "long",
    day: "numeric",
    timeZone: "Asia/Baghdad",
  }).format(now);

  const time = new Intl.DateTimeFormat(dateLocale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Baghdad",
  }).format(now);

  return (
    <div className={styles.clock}>
      <span className={styles.clockLine}>{date}</span>
      <span className={styles.clockLine}>{time}</span>
    </div>
  );
}

export default function SiteMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t, locale, localizePath } = useLocale();
  const lenis = useLenis();
  const pathname = usePathname();

  const navLinks = [
    { label: t.common.nav.home, href: localizePath("/") },
    { label: t.common.nav.projects, href: localizePath("/projects") },
    { label: t.common.nav.blog, href: localizePath("/blog") },
    { label: t.common.nav.services, href: `${localizePath("/")}#services` },
    { label: t.common.nav.contact, href: localizePath("/contact") },
    { label: t.common.nav.faq, href: `${localizePath("/")}#faq` },
  ];

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;

    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      lenis?.start();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, lenis, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div className={`framer-12kians ${styles.panel}`}>
            <motion.div
              className={styles.menuRow}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.05 }}
            >
              <div className={styles.promo}>
                <h2 className={styles.brandTitle}>
                  {t.common.brand.name}
                  <br />
                  {t.common.brand.creative}
                </h2>

                <LiveClock locale={locale} />

                <div className={styles.social}>
                  {SOCIAL_LINKS.map((link) => (
                    <MenuLink
                      key={link.key}
                      href={link.href}
                      label={t.site.social[link.key]}
                      external
                      className={styles.socialLink}
                    />
                  ))}
                </div>
              </div>

              <nav className={styles.mainMenu} aria-label="Main menu">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: 0.08 + index * 0.05,
                    }}
                  >
                    <MenuLink
                      href={link.href}
                      label={link.label}
                      className={styles.navLink}
                      onClick={onClose}
                      showArrow
                    />
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
