import { createPageMetadata } from "@/i18n/metadata";
import BlogPageView from "@/views/BlogPageView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return createPageMetadata("en", "blog");
}

export default function BlogPage() {
  return <BlogPageView locale="en" />;
}
