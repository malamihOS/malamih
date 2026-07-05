import { createPageMetadata } from "@/i18n/metadata";
import BlogPageView from "@/views/BlogPageView";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return createPageMetadata("ar", "blog");
}

export default function BlogPage() {
  return <BlogPageView locale="ar" />;
}
