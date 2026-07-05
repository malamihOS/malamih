import type { Locale } from "@/i18n/config";
import { ORGANIZATION, SITE_URL } from "@/lib/seo/constants";
import { absoluteUrl } from "@/lib/seo/urls";
import type { CmsBlogPost } from "@/lib/blog/types";

type BreadcrumbItem = { name: string; path: string };

export function organizationSchema(locale: Locale) {
  const name = locale === "ar" ? ORGANIZATION.nameAr : ORGANIZATION.nameEn;
  const description =
    locale === "ar" ? ORGANIZATION.descriptionAr : ORGANIZATION.descriptionEn;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    alternateName: ["malamih", "Malamih Creative Company", "شركة ملامح الإبداعية"],
    url: SITE_URL,
    logo: `${SITE_URL}${ORGANIZATION.logo}`,
    description,
    email: ORGANIZATION.email,
    telephone: ORGANIZATION.phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IQ",
      addressLocality: locale === "ar" ? "بغداد" : "Baghdad",
      addressRegion: locale === "ar" ? "العراق" : "Iraq",
    },
    sameAs: ORGANIZATION.sameAs,
  };
}

export function localBusinessSchema(locale: Locale) {
  const org = organizationSchema(locale);
  return {
    ...org,
    "@type": ["LocalBusiness", "ProfessionalService"],
    areaServed: {
      "@type": "Country",
      name: locale === "ar" ? "العراق" : "Iraq",
    },
    priceRange: "$$",
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: locale === "ar" ? ORGANIZATION.nameAr : ORGANIZATION.nameEn,
    url: SITE_URL,
    inLanguage: locale === "ar" ? "ar-IQ" : "en-US",
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.nameEn,
      logo: `${SITE_URL}${ORGANIZATION.logo}`,
    },
  };
}

export function breadcrumbSchema(
  locale: Locale,
  items: BreadcrumbItem[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, locale),
    })),
  };
}

export function blogPostingSchema(
  locale: Locale,
  post: CmsBlogPost,
) {
  const title = post.title;
  const description = post.seoDescription || post.excerpt;
  const image = post.ogImageUrl || post.coverImage || `${SITE_URL}${ORGANIZATION.logo}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.nameEn,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}${ORGANIZATION.logo}`,
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`, locale),
    inLanguage: locale === "ar" ? "ar-IQ" : "en-US",
    keywords: post.tags.join(", "),
    articleSection: post.category,
  };
}

export function creativeWorkSchema(
  locale: Locale,
  project: {
    title: string;
    summary: string;
    slug: string;
    coverImage: string;
    year: string;
    industry: string;
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`, locale),
    image: project.coverImage,
    dateCreated: project.year,
    about: project.industry,
    creator: {
      "@type": "Organization",
      name: ORGANIZATION.nameEn,
    },
  };
}

export function serviceSchema(
  locale: Locale,
  service: { title: string; description: string; tags: string[] },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: locale === "ar" ? ORGANIZATION.nameAr : ORGANIZATION.nameEn,
    },
    areaServed: {
      "@type": "Country",
      name: locale === "ar" ? "العراق" : "Iraq",
    },
    serviceType: service.tags.slice(0, 5).join(", "),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function jsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  return JSON.stringify(data);
}
