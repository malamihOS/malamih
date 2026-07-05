import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LEAD_MAGNETS = [
  {
    slug: "brand-audit-checklist",
    titleEn: "Free Brand Audit Checklist",
    titleAr: "قائمة تدقيق العلامة التجارية المجانية",
    descriptionEn: "A practical checklist to evaluate your brand identity, messaging, and market positioning.",
    descriptionAr: "قائمة عملية لتقييم هوية علامتك التجارية ورسائلك وموقعك في السوق.",
    relatedService: "branding",
    sortOrder: 0,
  },
  {
    slug: "digital-marketing-plan-template",
    titleEn: "Digital Marketing Plan Template",
    titleAr: "قالب خطة التسويق الرقمي",
    descriptionEn: "Structured template for building a 90-day digital marketing plan.",
    descriptionAr: "قالب منظم لبناء خطة تسويق رقمي لمدة 90 يومًا.",
    relatedService: "digital-marketing",
    sortOrder: 1,
  },
  {
    slug: "social-media-content-calendar",
    titleEn: "Social Media Content Calendar",
    titleAr: "تقويم محتوى وسائل التواصل",
    descriptionEn: "Plan and organize your social content across platforms.",
    descriptionAr: "خطط ونظم محتواك على منصات التواصل الاجتماعي.",
    relatedService: "content-production",
    sortOrder: 2,
  },
  {
    slug: "website-seo-checklist",
    titleEn: "Website SEO Checklist",
    titleAr: "قائمة تحسين محركات البحث للمواقع",
    descriptionEn: "Essential on-page and technical SEO checks for your website.",
    descriptionAr: "فحوصات SEO أساسية على الصفحة والتقنية لموقعك.",
    relatedService: "web-development",
    sortOrder: 3,
  },
  {
    slug: "business-growth-audit-template",
    titleEn: "Business Growth Audit Template",
    titleAr: "قالب تدقيق نمو الأعمال",
    descriptionEn: "Framework to assess marketing, sales, and operational growth opportunities.",
    descriptionAr: "إطار لتقييم فرص النمو في التسويق والمبيعات والعمليات.",
    relatedService: "consulting",
    sortOrder: 4,
  },
];

async function main() {
  const existing = await prisma.leadMagnet.count();
  if (existing > 0) {
    console.log(`LeadMagnet table already has ${existing} row(s), skipping growth seed.`);
    return;
  }

  for (const magnet of LEAD_MAGNETS) {
    await prisma.leadMagnet.create({
      data: {
        ...magnet,
        coverImage: "",
        fileUrl: `/resources/${magnet.slug}.pdf`,
        status: "active",
      },
    });
  }

  console.log(`Seeded ${LEAD_MAGNETS.length} lead magnets.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
