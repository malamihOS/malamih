"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleProvider";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/navigation";
import styles from "./LanguageSwitcher.module.css";

function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

export default function LanguageSwitcher({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) {
  const { locale } = useLocale();
  const pathname = usePathname();

  return (
    <div
      className={`${styles.switcher} ${theme === "light" ? styles.light : ""}`}
      aria-label="Language switcher"
    >
      <Link
        href={switchLocalePath(pathname, "en")}
        className={`${styles.link} ${locale === "en" ? styles.active : ""}`}
        aria-current={locale === "en" ? "true" : undefined}
        onClick={() => setLocaleCookie("en")}
      >
        EN
      </Link>
      <span className={styles.divider} aria-hidden="true">
        |
      </span>
      <Link
        href={switchLocalePath(pathname, "ar")}
        className={`${styles.link} ${locale === "ar" ? styles.active : ""}`}
        aria-current={locale === "ar" ? "true" : undefined}
        onClick={() => setLocaleCookie("ar")}
      >
        AR
      </Link>
    </div>
  );
}
