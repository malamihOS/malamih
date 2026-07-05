import { createPageMetadata } from "@/i18n/metadata";
import ContactPageView from "@/views/ContactPageView";

export async function generateMetadata() {
  return createPageMetadata("en", "contact");
}

export default function ContactPage() {
  return <ContactPageView />;
}
