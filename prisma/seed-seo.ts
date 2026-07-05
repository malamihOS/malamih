import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { TARGET_KEYWORDS } from "../src/lib/seo/constants";

const prisma = new PrismaClient();

const PAGE_SEO = [
  {
    pageKey: "home",
    seoTitleEn: "Malamih Creative Company | Full-Service Creative & Marketing Agency in Iraq",
    seoTitleAr: "شركة ملامح الإبداعية | وكالة إبداعية وتسويقية متكاملة في العراق",
    seoDescEn:
      "Malamih Creative Company is a full-service creative and marketing agency in Iraq offering branding, digital marketing, content production, web design, and performance marketing for Iraqi businesses.",
    seoDescAr:
      "شركة ملامح الإبداعية هي وكالة إبداعية وتسويقية متكاملة في العراق تقدم العلامة التجارية والتسويق الرقمي وإنتاج المحتوى وتصميم المواقع والتسويق بالأداء للشركات العراقية.",
    seoKeywordsEn: TARGET_KEYWORDS.en.join(", "),
    seoKeywordsAr: TARGET_KEYWORDS.ar.join(", "),
  },
  {
    pageKey: "contact",
    seoTitleEn: "Contact Malamih Creative Company | Marketing Agency Iraq",
    seoTitleAr: "تواصل مع شركة ملامح الإبداعية | وكالة تسويق في العراق",
    seoDescEn:
      "Contact Malamih Creative Company in Baghdad, Iraq. Let's discuss branding, marketing, content, and digital growth for your business.",
    seoDescAr:
      "تواصل مع شركة ملامح الإبداعية في بغداد، العراق. لنناقش العلامة التجارية والتسويق والمحتوى والنمو الرقمي لعملك.",
    seoKeywordsEn: "contact marketing agency Iraq, Malamih Creative Company",
    seoKeywordsAr: "تواصل وكالة تسويق العراق, شركة ملامح الإبداعية",
  },
  {
    pageKey: "projects",
    seoTitleEn: "Projects | Malamih Creative & Marketing Agency Iraq",
    seoTitleAr: "المشاريع | شركة ملامح الإبداعية",
    seoDescEn:
      "Explore branding, content, digital, and marketing projects by Malamih Creative Company in Iraq.",
    seoDescAr: "استكشف مشاريع العلامة التجارية والمحتوى والتسويق الرقمي من شركة ملامح الإبداعية في العراق.",
    seoKeywordsEn: "creative agency portfolio Iraq, Malamih projects",
    seoKeywordsAr: "معرض أعمال وكالة إبداعية العراق",
  },
  {
    pageKey: "blog",
    seoTitleEn: "Marketing Blog | Malamih Creative Company Iraq",
    seoTitleAr: "مدونة التسويق | شركة ملامح الإبداعية",
    seoDescEn:
      "Marketing, branding, and digital growth insights for businesses in Iraq and the Arab world.",
    seoDescAr: "رؤى في التسويق والعلامة التجارية والنمو الرقمي للشركات في العراق والعالم العربي.",
    seoKeywordsEn: "marketing blog Iraq, digital marketing insights",
    seoKeywordsAr: "مدونة تسويق العراق, رؤى تسويق رقمي",
  },
  {
    pageKey: "terms",
    seoTitleEn: "Terms & Conditions | Malamih Creative Company",
    seoTitleAr: "الشروط والأحكام | شركة ملامح الإبداعية",
    seoDescEn: "Terms and conditions for Malamih Creative Company services.",
    seoDescAr: "الشروط والأحكام لخدمات شركة ملامح الإبداعية.",
    seoKeywordsEn: "",
    seoKeywordsAr: "",
  },
  {
    pageKey: "privacy",
    seoTitleEn: "Privacy Policy | Malamih Creative Company",
    seoTitleAr: "سياسة الخصوصية | شركة ملامح الإبداعية",
    seoDescEn: "Privacy policy for Malamih Creative Company.",
    seoDescAr: "سياسة الخصوصية لشركة ملامح الإبداعية.",
    seoKeywordsEn: "",
    seoKeywordsAr: "",
  },
  {
    pageKey: "notFound",
    seoTitleEn: "404 Page Not Found | Malamih Creative Company",
    seoTitleAr: "404 الصفحة غير موجودة | شركة ملامح الإبداعية",
    seoDescEn: "The page you are looking for could not be found.",
    seoDescAr: "تعذّر العثور على الصفحة التي تبحث عنها.",
    seoKeywordsEn: "",
    seoKeywordsAr: "",
    noIndex: true,
  },
];

async function main() {
  for (const page of PAGE_SEO) {
    await prisma.pageSeo.upsert({
      where: { pageKey: page.pageKey },
      create: { ...page, ogImageUrl: "", canonicalUrlEn: "", canonicalUrlAr: "", noIndex: page.noIndex ?? false },
      update: page,
    });
  }

  await prisma.siteSettings.updateMany({
    data: {
      defaultSeoTitleEn: PAGE_SEO[0].seoTitleEn,
      defaultSeoTitleAr: PAGE_SEO[0].seoTitleAr,
      defaultSeoDescEn: PAGE_SEO[0].seoDescEn,
      defaultSeoDescAr: PAGE_SEO[0].seoDescAr,
      defaultSeoKeywordsEn: PAGE_SEO[0].seoKeywordsEn,
      defaultSeoKeywordsAr: PAGE_SEO[0].seoKeywordsAr,
      websiteNameEn: "Malamih Creative Company",
      websiteNameAr: "شركة ملامح الإبداعية",
    },
  });

  console.log("Page SEO seeded.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
