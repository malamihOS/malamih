import { createPageMetadata } from "@/i18n/metadata";
import BlogPageView from "@/views/BlogPageView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = { params: Promise<{ tag: string }> };

export async function generateMetadata() {
  return createPageMetadata("en", "blog");
}

export default async function BlogTagPage({ params }: PageProps) {
  const { tag } = await params;
  return (
    <BlogPageView
      locale="en"
      tag={decodeURIComponent(tag)}
      filterTitle={`Tag: ${decodeURIComponent(tag)}`}
    />
  );
}
