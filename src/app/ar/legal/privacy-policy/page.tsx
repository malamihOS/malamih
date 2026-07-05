import { createPageMetadata } from "@/i18n/metadata";
import Header from "@/components/Header";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata() {
  return createPageMetadata("ar", "privacy");
}

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Header variant="page" />
      <LegalPage type="privacy" />
    </main>
  );
}
