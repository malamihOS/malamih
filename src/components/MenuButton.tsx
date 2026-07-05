"use client";

import { useTranslations } from "@/context/LocaleProvider";
import styles from "./MenuButton.module.css";

export default function MenuButton({
  open,
  onClick,
  theme = "dark",
}: {
  open: boolean;
  onClick: () => void;
  theme?: "dark" | "light";
}) {
  const t = useTranslations();

  return (
    <div className="framer-lc81n5-container">
      <button
        type="button"
        data-framer-name="Menu"
        className={`framer-0ewQt framer-1n963yy ${open ? "framer-v-ctr1nv" : "framer-v-1n963yy"} ${styles.button} ${open ? styles.open : ""} ${theme === "light" ? styles.light : ""}`}
        onClick={onClick}
        aria-label={open ? t.common.header.closeMenu : t.common.header.openMenu}
        aria-expanded={open}
      >
        <span className={`${styles.line} ${styles.lineTop}`} data-framer-name="Line" />
        <span className={`${styles.line} ${styles.lineBottom}`} data-framer-name="Line" />
      </button>
    </div>
  );
}
