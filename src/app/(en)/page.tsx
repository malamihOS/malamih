import { createPageMetadata } from "@/i18n/metadata";
import HomePage from "@/views/HomePage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return createPageMetadata("en", "home");
}

export default function Page() {
  return <HomePage />;
}
