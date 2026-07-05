"use client";

import { motion } from "framer-motion";
import BlogCard from "@/components/BlogCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useLocale } from "@/context/LocaleProvider";
import type { CmsBlogPost } from "@/lib/blog/types";
import styles from "./BlogPageSection.module.css";

const REVEAL = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function BlogPageSection({
  posts,
  featured,
  categories,
  activeCategory,
  activeTag,
  filterTitle,
}: {
  posts: CmsBlogPost[];
  featured: CmsBlogPost[];
  categories: { slug: string; name: string; count: number }[];
  activeCategory?: string;
  activeTag?: string;
  filterTitle?: string;
}) {
  const { t, localizePath } = useLocale();

  return (
    <section className={styles.section} aria-labelledby="blog-page-heading">
      <div className={styles.inner}>
        <motion.header
          className={styles.hero}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={REVEAL}
        >
          <div className={styles.heroCopy}>
            <p className={styles.sectionLabel}>
              <span className={styles.sectionNumber}>(05)</span>
              {t.common.nav.blog}
            </p>
            <h1 id="blog-page-heading" className={styles.heading}>
              {filterTitle ?? t.blog.page.headingLine1}
              {!filterTitle ? (
                <>
                  <br />
                  {t.blog.page.headingLine2}
                </>
              ) : null}
            </h1>
            {!filterTitle ? (
              <p className={styles.description}>{t.blog.page.description}</p>
            ) : null}
          </div>
        </motion.header>

        {featured.length > 0 && !activeCategory && !activeTag ? (
          <div className={styles.featured}>
            <h2 className={styles.featuredLabel}>{t.blog.page.featured}</h2>
            <div className={styles.featuredGrid}>
              {featured.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  index={index}
                  href={localizePath(`/blog/${post.slug}`)}
                />
              ))}
            </div>
          </div>
        ) : null}

        {categories.length > 0 ? (
          <div className={styles.filters}>
            <a
              href={localizePath("/blog")}
              className={`${styles.filterChip} ${!activeCategory && !activeTag ? styles.filterActive : ""}`}
            >
              {t.blog.page.allPosts}
            </a>
            {categories.map((category) => (
              <a
                key={category.slug}
                href={localizePath(`/blog/category/${category.slug}`)}
                className={`${styles.filterChip} ${activeCategory === category.slug ? styles.filterActive : ""}`}
              >
                {category.name} ({category.count})
              </a>
            ))}
          </div>
        ) : null}

        <div className={styles.grid}>
          {posts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              index={index}
              href={localizePath(`/blog/${post.slug}`)}
            />
          ))}
        </div>

        <NewsletterSignup sourcePage="/blog" />
      </div>
    </section>
  );
}
