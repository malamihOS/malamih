import FooterSection from "@/components/FooterSection";
import TeamSection from "@/components/TeamSection";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import UtmCapture from "@/components/UtmCapture";
import { LocaleProvider } from "@/context/LocaleProvider";
import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { getSiteContent } from "@/lib/cms/get-content";

export default async function LocaleShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const content = await getSiteContent(locale);

  return (
    <LocaleProvider locale={locale} content={content}>
      <Suspense fallback={null}>
        <UtmCapture />
      </Suspense>
      <AnalyticsTracker />
      {children}
      <TeamSection />
      <FooterSection />
    </LocaleProvider>
  );
}
