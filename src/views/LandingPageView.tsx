import { notFound } from "next/navigation";
import Header from "@/components/Header";
import LandingPageSection from "@/components/LandingPageSection";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";

function parseFormFields(json: string) {
  try {
    return JSON.parse(json) as string[];
  } catch {
    return ["name", "email", "phone", "company", "message"];
  }
}

export async function getLandingPage(slug: string, locale: Locale) {
  const page = await prisma.landingPage.findUnique({ where: { slug } });
  if (!page || page.status !== "published") return null;

  return {
    slug: page.slug,
    title: locale === "ar" ? page.titleAr : page.titleEn,
    headline: locale === "ar" ? page.headlineAr : page.headlineEn,
    description: locale === "ar" ? page.descriptionAr : page.descriptionEn,
    coverImage: page.coverImage,
    coverVideo: page.coverVideo,
    relatedService: page.relatedService,
    ctaText: locale === "ar" ? page.ctaTextAr : page.ctaTextEn,
    formFields: parseFormFields(page.formFieldsJson),
    seoTitle: locale === "ar" ? page.seoTitleAr : page.seoTitleEn,
    seoDesc: locale === "ar" ? page.seoDescAr : page.seoDescEn,
  };
}

export async function generateLandingMetadata(slug: string, locale: Locale) {
  const page = await getLandingPage(slug, locale);
  if (!page) return {};
  return buildMetadata({
    locale,
    path: locale === "ar" ? `/ar/lp/${slug}` : `/lp/${slug}`,
    title: page.seoTitle || page.title,
    description: page.seoDesc || page.description,
    ogImage: page.coverImage,
  });
}

export default async function LandingPageView({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const page = await getLandingPage(slug, locale);
  if (!page) notFound();

  return (
    <main>
      <Header variant="page" />
      <LandingPageSection page={page} />
    </main>
  );
}
