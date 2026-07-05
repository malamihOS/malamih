"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import LocaleShell from "@/components/LocaleShell";
import NotFoundSection from "@/components/NotFoundSection";
import { getLocaleFromPathname } from "@/i18n/navigation";

export default function NotFoundPageContent() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? "/");

  return (
    <LocaleShell locale={locale}>
      <main>
        <Header variant="page" />
        <NotFoundSection />
      </main>
    </LocaleShell>
  );
}
