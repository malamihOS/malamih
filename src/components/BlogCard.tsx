"use client";

import Link from "next/link";
import BlogCoverImage from "@/components/BlogCoverImage";
import type { CmsBlogPost } from "@/lib/blog/types";
import { useLocale } from "@/context/LocaleProvider";
import styles from "./BlogCard.module.css";

export default function BlogCard({
  post,
  index = 0,
  href,
}: {
  post: CmsBlogPost;
  index?: number;
  href: string;
}) {
  const { locale } = useLocale();
  const dateLocale = locale === "ar" ? "ar-IQ" : "en";

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <BlogCoverImage
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            sizes="(max-width: 768px) 100vw, 400px"
            className={styles.image}
            loading={index < 2 ? "eager" : "lazy"}
          />
        </div>
      </Link>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.category}>{post.category}</span>
          <time dateTime={post.publishedAt} className={styles.date}>
            {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
        <h2 className={styles.title}>
          <Link href={href}>{post.title}</Link>
        </h2>
        <p className={styles.excerpt}>{post.excerpt}</p>
        {post.tags.length > 0 ? (
          <div className={styles.tags}>
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
