import { createPageMetadata } from "@/i18n/metadata";
import Header from "@/components/Header";
import LegalPage from "@/components/LegalPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
