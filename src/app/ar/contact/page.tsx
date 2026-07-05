import { createPageMetadata } from "@/i18n/metadata";
import ContactPageView from "@/views/ContactPageView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return createPageMetadata("ar", "contact");
}

export default function ContactPage() {
  return <ContactPageView />;
}
