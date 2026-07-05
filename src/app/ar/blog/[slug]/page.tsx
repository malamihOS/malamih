import { notFound } from "next/navigation";
import { createBlogMetadata, createPageMetadata } from "@/i18n/metadata";
import { getAllPublishedBlogSlugs, getBlogPostBySlug } from "@/lib/blog/get-posts";
import BlogDetailPageView from "@/views/BlogDetailPageView";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getAllPublishedBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, "ar");
  if (!post) return createPageMetadata("ar", "blogFallback");
  return createBlogMetadata("ar", post);
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, "ar");
  if (!post) notFound();
  return <BlogDetailPageView locale="ar" post={post} />;
}
