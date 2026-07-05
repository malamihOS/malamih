import Header from "@/components/Header";
import BlogDetailSection from "@/components/BlogDetailSection";
import JsonLd from "@/components/JsonLd";
import { getRelatedBlogPosts } from "@/lib/blog/get-posts";
import {
  blogPostingSchema,
  breadcrumbSchema,
  organizationSchema,
} from "@/lib/seo/schema";
import type { CmsBlogPost } from "@/lib/blog/types";
import type { Locale } from "@/i18n/config";

export default async function BlogDetailPageView({
  locale,
  post,
}: {
  locale: Locale;
  post: CmsBlogPost;
}) {
  const related = await getRelatedBlogPosts(post.slug, locale, 2);

  return (
    <main>
      <JsonLd
        data={[
          organizationSchema(locale),
          blogPostingSchema(locale, post),
          breadcrumbSchema(locale, [
            { name: locale === "ar" ? "الرئيسية" : "Home", path: "/" },
            { name: locale === "ar" ? "المدونة" : "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <Header variant="page" />
      <BlogDetailSection post={post} related={related} />
    </main>
  );
}
