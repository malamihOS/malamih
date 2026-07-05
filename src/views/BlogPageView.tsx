import Header from "@/components/Header";
import BlogPageSection from "@/components/BlogPageSection";
import JsonLd from "@/components/JsonLd";
import {
  getBlogCategories,
  getBlogPosts,
  getFeaturedBlogPosts,
} from "@/lib/blog/get-posts";
import { breadcrumbSchema, websiteSchema } from "@/lib/seo/schema";
import type { Locale } from "@/i18n/config";

export default async function BlogPageView({
  locale,
  categorySlug,
  tag,
  filterTitle,
}: {
  locale: Locale;
  categorySlug?: string;
  tag?: string;
  filterTitle?: string;
}) {
  const [posts, featured, categories] = await Promise.all([
    categorySlug
      ? import("@/lib/blog/get-posts").then((m) =>
          m.getBlogPostsByCategory(categorySlug, locale),
        )
      : tag
        ? import("@/lib/blog/get-posts").then((m) =>
            m.getBlogPostsByTag(tag, locale),
          )
        : getBlogPosts(locale),
    categorySlug || tag ? Promise.resolve([]) : getFeaturedBlogPosts(locale, 3),
    getBlogCategories(locale),
  ]);

  return (
    <main>
      <JsonLd
        data={[
          websiteSchema(locale),
          breadcrumbSchema(locale, [
            { name: locale === "ar" ? "الرئيسية" : "Home", path: "/" },
            { name: locale === "ar" ? "المدونة" : "Blog", path: "/blog" },
          ]),
        ]}
      />
      <Header variant="page" />
      <BlogPageSection
        posts={posts}
        featured={featured}
        categories={categories}
        activeCategory={categorySlug}
        activeTag={tag}
        filterTitle={filterTitle}
      />
    </main>
  );
}
