import LocaleShell from "@/components/LocaleShell";
import GlobalSeoJsonLd from "@/components/GlobalSeoJsonLd";
import { createSiteMetadata } from "@/i18n/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return createSiteMetadata("en");
}

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleShell locale="en">
      <GlobalSeoJsonLd locale="en" />
      {children}
    </LocaleShell>
  );
}
