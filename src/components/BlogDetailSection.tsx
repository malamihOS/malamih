"use client";

import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import BlogContent from "@/components/BlogContent";
import BlogCoverImage from "@/components/BlogCoverImage";
import Breadcrumbs from "@/components/Breadcrumbs";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useLocale } from "@/context/LocaleProvider";
import type { CmsBlogPost } from "@/lib/blog/types";
import styles from "./BlogDetailSection.module.css";

export default function BlogDetailSection({
  post,
  related,
}: {
  post: CmsBlogPost;
  related: CmsBlogPost[];
}) {
  const { t, localizePath, locale } = useLocale();
  const dateLocale = locale === "ar" ? "ar-IQ" : "en";

  return (
    <section className={styles.section} aria-labelledby="blog-detail-title">
      <div className={styles.inner}>
        <Breadcrumbs
          items={[
            { label: t.common.nav.home, href: "/" },
            { label: t.common.nav.blog, href: "/blog" },
            { label: post.title },
          ]}
        />

        <article className={styles.article}>
          <header className={styles.header}>
            <div className={styles.meta}>
              <Link
                href={localizePath(`/blog/category/${post.categorySlug}`)}
                className={styles.category}
              >
                {post.category}
              </Link>
              <time dateTime={post.publishedAt} className={styles.date}>
                {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <h1 id="blog-detail-title" className={styles.title}>
              {post.title}
            </h1>
            <p className={styles.excerpt}>{post.excerpt}</p>
            <p className={styles.author}>
              {t.blog.detail.by} {post.author}
            </p>
          </header>

          {post.coverImage ? (
            <div className={styles.heroImageWrap}>
              <BlogCoverImage
                src={post.coverImage}
                alt={post.coverAlt || post.title}
                priority
                sizes="100vw"
                className={styles.heroImage}
              />
            </div>
          ) : null}

          <BlogContent blocks={post.content} />

          {post.tags.length > 0 ? (
            <div className={styles.tags}>
              <span className={styles.tagsLabel}>{t.blog.detail.tags}</span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={localizePath(`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`)}
                  className={styles.tag}
                >
                  {tag}
                </Link>
              ))}
            </div>
          ) : null}

          <div className={styles.cta}>
            <p className={styles.ctaText}>{t.blog.detail.cta}</p>
            <Link href={localizePath("/contact")} className={styles.ctaButton}>
              {t.common.footer.letsTalk}
            </Link>
          </div>

          <NewsletterSignup sourcePage={`/blog/${post.slug}`} />
        </article>

        {related.length > 0 ? (
          <div className={styles.related}>
            <h2 className={styles.relatedTitle}>{t.blog.detail.related}</h2>
            <div className={styles.relatedGrid}>
              {related.map((item, index) => (
                <BlogCard
                  key={item.id}
                  post={item}
                  index={index}
                  href={localizePath(`/blog/${item.slug}`)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
