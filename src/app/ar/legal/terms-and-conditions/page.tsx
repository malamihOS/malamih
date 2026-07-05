import { createPageMetadata } from "@/i18n/metadata";
import Header from "@/components/Header";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata() {
  return createPageMetadata("ar", "terms");
}

export default function TermsAndConditionsPage() {
  return (
    <main>
      <Header variant="page" />
      <LegalPage type="terms" />
    </main>
  );
}
