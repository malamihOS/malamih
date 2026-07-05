"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MalamihLogo from "@/components/MalamihLogo";
import MenuButton from "@/components/MenuButton";
import SiteMenu from "@/components/SiteMenu";
import { useContactSettings, useLocale } from "@/context/LocaleProvider";
import styles from "./Header.module.css";

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

function ContactItem({
  label,
  href,
  value,
  external = false,
  className,
}: {
  label: string;
  href: string;
  value: string;
  external?: boolean;
  className?: string;
}) {
  return (
    <div className={`${styles.contactItem} ${className ?? ""}`}>
      <span className={styles.contactLabel}>{label}</span>
      <Link
        href={href}
        className={styles.contactLink}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <SwapText text={value} />
      </Link>
    </div>
  );
}

export default function Header({
  variant = "overlay",
}: {
  variant?: "overlay" | "page" | "light";
}) {
  const { t, localizePath, contactSettings, branding } = useLocale();
  const primaryEmail = contactSettings.emails[0] ?? "info@malamih.net";
  const primaryWhatsApp = contactSettings.whatsappNumbers[0];
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((current) => !current), []);

  const headerClassName = [
    styles.header,
    variant === "page" ? styles.headerPage : "",
    variant === "light" ? styles.headerLight : "",
    menuOpen ? styles.headerMenuOpen : "",
  ]
    .filter(Boolean)
    .join(" ");

  const showContactNav = variant !== "light";

  return (
    <>
      <header className={headerClassName}>
        <div className={styles.inner}>
          <Link
            href={localizePath("/")}
            className={styles.logo}
            aria-label={t.common.brand.name}
          >
            <MalamihLogo src={branding.logoUrl || undefined} />
          </Link>

          <div className={styles.actions}>
            {showContactNav ? (
              <nav className={styles.nav} aria-label={t.common.header.contactNav}>
                <ContactItem
                  label={t.common.header.email}
                  href={`mailto:${primaryEmail}`}
                  value={primaryEmail}
                />
                <ContactItem
                  label={t.common.header.whatsApp}
                  href={primaryWhatsApp?.url ?? "https://wa.me/9647855550510"}
                  value={primaryWhatsApp?.label ?? "+964 785 555 0510"}
                  external
                />
                <ContactItem
                  label={t.common.header.location}
                  href={contactSettings.mapsUrl}
                  value={contactSettings.address}
                  external
                  className="framer-1tu8236"
                />
              </nav>
            ) : null}

            <LanguageSwitcher theme={variant === "light" ? "light" : "dark"} />
            <MenuButton
              open={menuOpen}
              onClick={toggleMenu}
              theme={variant === "light" ? "light" : "dark"}
            />
          </div>
        </div>
      </header>

      <SiteMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
