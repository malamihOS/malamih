import { createPageMetadata } from "@/i18n/metadata";
import BlogPageView from "@/views/BlogPageView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  return createPageMetadata("ar", "blog");
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <BlogPageView
      locale="ar"
      categorySlug={slug}
      filterTitle={slug.replace(/-/g, " ")}
    />
  );
}
