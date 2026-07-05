import { createPageMetadata } from "@/i18n/metadata";
import HomePage from "@/views/HomePage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return createPageMetadata("ar", "home");
}

export default function Page() {
  return <HomePage />;
}
