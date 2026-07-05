import LocaleShell from "@/components/LocaleShell";
import GlobalSeoJsonLd from "@/components/GlobalSeoJsonLd";
import { createSiteMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  return createSiteMetadata("ar");
}

export default function ArabicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleShell locale="ar">
      <GlobalSeoJsonLd locale="ar" />
      {children}
    </LocaleShell>
  );
}
