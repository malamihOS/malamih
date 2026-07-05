import { createPageMetadata } from "@/i18n/metadata";
import Header from "@/components/Header";
import LegalPage from "@/components/LegalPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return createPageMetadata("en", "terms");
}

export default function TermsAndConditionsPage() {
  return (
    <main>
      <Header variant="page" />
      <LegalPage type="terms" />
    </main>
  );
}
