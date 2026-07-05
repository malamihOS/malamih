import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { en } from "../src/i18n/dictionaries/en";
import { ar } from "../src/i18n/dictionaries/ar";
import { PROJECT_ASSETS } from "../src/data/project-assets";

const prisma = new PrismaClient();

const HERO_SLIDES = [
  {
    imageUrl:
      "https://framerusercontent.com/images/wPiTvVSrHAk94Tes9APNKlRyKbI.png",
    objectPosition: "center",
    sortOrder: 0,
    animationJson: JSON.stringify({
      y: 660,
      scale: 0.3,
      delay: 0,
      duration: 1.35,
      zIndex: 1,
    }),
  },
  {
    imageUrl:
      "https://framerusercontent.com/images/hF2JMM2CfWFcpKzEQoV0UbiYIA.png",
    objectPosition: "center",
    sortOrder: 1,
    animationJson: JSON.stringify({
      y: 660,
      scale: 0.4,
      delay: 0.45,
      duration: 2.2,
      zIndex: 2,
    }),
  },
  {
    imageUrl:
      "https://framerusercontent.com/images/IOJt5fgB3Aq1kSZsd5Ceo1vFVo.png",
    objectPosition: "68.3% 36.4%",
    sortOrder: 2,
    animationJson: JSON.stringify({
      y: 1020,
      scale: 0.5,
      riseScale: 0.6,
      delay: 0.9,
      duration: 2,
      expandDuration: 1.25,
      zIndex: 3,
    }),
  },
];

const COMMITMENT_SLIDES = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&h=1200&fit=crop&q=80",
];

async function main() {
  const existing = await prisma.heroConfig.findFirst();
  if (existing) {
    console.log("Database already seeded, skipping.");
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@malamih.net";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Malamih@2025";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.create({
    data: {
      email: adminEmail,
      passwordHash,
      role: "super_admin",
      name: "Super Admin",
    },
  });

  await prisma.heroConfig.create({
    data: {
      headlineEn: en.common.brand.name,
      headlineAr: ar.common.brand.name,
      descriptionEn: en.home.hero.tagline1,
      descriptionAr: ar.home.hero.tagline1,
      ctaTextEn: "",
      ctaTextAr: "",
      ctaLink: "/contact",
      tagline1En: en.home.hero.tagline1,
      tagline1Ar: ar.home.hero.tagline1,
      tagline2En: en.home.hero.tagline2,
      tagline2Ar: ar.home.hero.tagline2,
      categoriesEn: JSON.stringify(en.home.hero.categories),
      categoriesAr: JSON.stringify(ar.home.hero.categories),
      brandNameEn: en.common.brand.name,
      brandNameAr: ar.common.brand.name,
      brandCreativeEn: en.common.brand.creative,
      brandCreativeAr: ar.common.brand.creative,
    },
  });

  for (const slide of HERO_SLIDES) {
    await prisma.heroSlide.create({ data: { ...slide, visible: true } });
  }

  await prisma.whyMalamihConfig.create({
    data: {
      labelEn: en.home.why.label,
      labelAr: ar.home.why.label,
      titleLine1En: en.home.why.headingLine1,
      titleLine1Ar: ar.home.why.headingLine1,
      titleLine2En: en.home.why.headingLine2,
      titleLine2Ar: ar.home.why.headingLine2,
      descriptionEn: en.home.commitment.description,
      descriptionAr: ar.home.commitment.description,
      videoUrl:
        "https://framerusercontent.com/assets/rOQYaZXQCrRwFCBvFvQvQ2Zvm0.mp4",
      commitmentHeadingEn: en.home.commitment.heading,
      commitmentHeadingAr: ar.home.commitment.heading,
      commitmentDescEn: en.home.commitment.description,
      commitmentDescAr: ar.home.commitment.description,
      marqueeLabelEn: en.home.commitment.marqueeLabel,
      marqueeLabelAr: ar.home.commitment.marqueeLabel,
    },
  });

  for (const [index, src] of COMMITMENT_SLIDES.entries()) {
    await prisma.whyMalamihSlide.create({
      data: {
        imageUrl: src,
        altEn: en.home.commitment.slideAlts[index] ?? "",
        altAr: ar.home.commitment.slideAlts[index] ?? "",
        sortOrder: index,
        visible: true,
      },
    });
  }

  const stats = [
    { value: 50, suffix: "+", labelEn: "Successful Projects", labelAr: "مشروع ناجح" },
    { value: 20, suffix: "+", labelEn: "Business Partners", labelAr: "شريك أعمال" },
    { value: 100, suffix: "%", labelEn: "Tailored Solutions", labelAr: "حلول مخصصة" },
  ];

  for (const [index, stat] of stats.entries()) {
    await prisma.whyMalamihStat.create({
      data: { ...stat, sortOrder: index, visible: true },
    });
  }

  for (const [index, card] of en.home.why.cards.entries()) {
    const arCard = ar.home.why.cards[index];
    await prisma.whyMalamihCard.create({
      data: {
        titleEn: card.title,
        titleAr: arCard?.title ?? card.title,
        descriptionEn: card.description,
        descriptionAr: arCard?.description ?? card.description,
        sortOrder: index,
        visible: true,
      },
    });
  }

  for (const [index] of Array.from({ length: 6 }).entries()) {
    await prisma.clientLogo.create({
      data: {
        imageUrl: "/malamih-logo.svg",
        nameEn: "malamih",
        nameAr: "malamih",
        link: "",
        sortOrder: index,
        visible: true,
      },
    });
  }

  for (const [index, assets] of PROJECT_ASSETS.entries()) {
    const contentEn = en.projects.items[assets.slug];
    const contentAr = ar.projects.items[assets.slug];
    if (!contentEn) continue;

    await prisma.project.create({
      data: {
        slug: assets.slug,
        titleEn: contentEn.title,
        titleAr: contentAr?.title ?? contentEn.title,
        shortDescEn: contentEn.summary,
        shortDescAr: contentAr?.summary ?? contentEn.summary,
        categoryEn: contentEn.category,
        categoryAr: contentAr?.category ?? contentEn.category,
        industryEn: contentEn.industry,
        industryAr: contentAr?.industry ?? contentEn.industry,
        spaceOfWorkEn: contentEn.spaceOfWork,
        spaceOfWorkAr: contentAr?.spaceOfWork ?? contentEn.spaceOfWork,
        timeline: contentEn.timeline,
        year: assets.year,
        projectUrl: assets.liveUrl,
        coverImage: assets.cardImage,
        galleryJson: JSON.stringify(assets.gallery),
        sectionsJson: JSON.stringify(contentEn.sections),
        seoTitleEn: contentEn.title,
        seoTitleAr: contentAr?.title ?? contentEn.title,
        seoDescEn: contentEn.summary,
        seoDescAr: contentAr?.summary ?? contentEn.summary,
        status: "published",
        showOnHomepage: index >= PROJECT_ASSETS.length - 2,
        sortOrder: index,
      },
    });
  }

  for (const [index, service] of en.home.services.items.entries()) {
    const arService = ar.home.services.items[index];
    await prisma.service.create({
      data: {
        number: service.number,
        titleEn: service.title,
        titleAr: arService?.title ?? service.title,
        tagsEn: JSON.stringify(service.tags),
        tagsAr: JSON.stringify(arService?.tags ?? service.tags),
        sortOrder: index,
        visible: true,
      },
    });
  }

  await prisma.contactSettings.create({
    data: {
      phones: JSON.stringify([]),
      whatsappNumbers: JSON.stringify([
        { label: "+964 785 555 0510", url: "https://wa.me/9647855550510" },
      ]),
      emails: JSON.stringify(["info@malamih.net"]),
      addressEn: en.site.address,
      addressAr: ar.site.address,
      mapsUrl: "https://maps.app.goo.gl/8TwNGxaDbShY2ZxH6",
      socialLinks: JSON.stringify([
        {
          key: "facebook",
          href: "https://www.facebook.com/malamihnet/",
          labelEn: en.site.social.facebook,
          labelAr: ar.site.social.facebook,
        },
        {
          key: "instagram",
          href: "https://www.instagram.com/malamihnet/",
          labelEn: en.site.social.instagram,
          labelAr: ar.site.social.instagram,
        },
        {
          key: "linkedIn",
          href: "https://www.linkedin.com/company/malamihnet",
          labelEn: en.site.social.linkedIn,
          labelAr: ar.site.social.linkedIn,
        },
      ]),
      workingHoursEn: "",
      workingHoursAr: "",
    },
  });

  await prisma.siteSettings.create({
    data: {
      websiteNameEn: en.common.brand.name,
      websiteNameAr: ar.common.brand.name,
      logoUrl: "/malamih-logo.svg",
      faviconUrl: "/malamih-logo.svg",
      defaultSeoTitleEn: en.meta.site.title,
      defaultSeoTitleAr: ar.meta.site.title,
      defaultSeoDescEn: en.meta.site.description,
      defaultSeoDescAr: ar.meta.site.description,
      homeProjectsJson: JSON.stringify({
        labelEn: en.home.projects.label,
        labelAr: ar.home.projects.label,
        headingLine1En: en.home.projects.headingLine1,
        headingLine1Ar: ar.home.projects.headingLine1,
        headingLine2En: en.home.projects.headingLine2,
        headingLine2Ar: ar.home.projects.headingLine2,
        descriptionEn: en.home.projects.description,
        descriptionAr: ar.home.projects.description,
        seeMoreEn: en.home.projects.seeMore,
        seeMoreAr: ar.home.projects.seeMore,
      }),
      contactPageJson: JSON.stringify({
        heroAltEn: en.contact.heroAlt,
        heroAltAr: ar.contact.heroAlt,
        stepLabelEn: en.contact.stepLabel,
        stepLabelAr: ar.contact.stepLabel,
        titleEn: en.contact.title,
        titleAr: ar.contact.title,
        subtitleEn: en.contact.subtitle,
        subtitleAr: ar.contact.subtitle,
        nameEn: en.contact.form.name,
        nameAr: ar.contact.form.name,
        namePlaceholderEn: en.contact.form.namePlaceholder,
        namePlaceholderAr: ar.contact.form.namePlaceholder,
        emailEn: en.contact.form.email,
        emailAr: ar.contact.form.email,
        emailPlaceholderEn: en.contact.form.emailPlaceholder,
        emailPlaceholderAr: ar.contact.form.emailPlaceholder,
        messageEn: en.contact.form.message,
        messageAr: ar.contact.form.message,
        messagePlaceholderEn: en.contact.form.messagePlaceholder,
        messagePlaceholderAr: ar.contact.form.messagePlaceholder,
        submitEn: en.contact.form.submit,
        submitAr: ar.contact.form.submit,
        submittedEn: en.contact.form.submitted,
        submittedAr: ar.contact.form.submitted,
        addressTitleEn: en.contact.info.addressTitle,
        addressTitleAr: ar.contact.info.addressTitle,
        contactTitleEn: en.contact.info.contactTitle,
        contactTitleAr: ar.contact.info.contactTitle,
        heroImage:
          "https://framerusercontent.com/images/SL0n3LZsLnHc5uEjKxOMZdU86Y.jpeg?width=5120&height=5120",
        teamImage0:
          "https://framerusercontent.com/images/04amVnvBHlmBhxordNiyRXcvqM.png?width=840&height=1200",
        teamImage1:
          "https://framerusercontent.com/images/PIbRHF6XcYb7rWjIICcekI1HFDg.png?width=840&height=1200",
        teamCaption0En: en.contact.team[0].caption,
        teamCaption0Ar: ar.contact.team[0].caption,
        teamCaption1En: en.contact.team[1].caption,
        teamCaption1Ar: ar.contact.team[1].caption,
        teamAlt0En: en.contact.team[0].alt,
        teamAlt0Ar: ar.contact.team[0].alt,
        teamAlt1En: en.contact.team[1].alt,
        teamAlt1Ar: ar.contact.team[1].alt,
      }),
      footerContentJson: JSON.stringify({
        contactUsEn: en.common.footer.contactUs,
        contactUsAr: ar.common.footer.contactUs,
        haveProjectEn: en.common.footer.haveProject,
        haveProjectAr: ar.common.footer.haveProject,
        letsTalkEn: en.common.footer.letsTalk,
        letsTalkAr: ar.common.footer.letsTalk,
        navigationEn: en.common.footer.navigation,
        navigationAr: ar.common.footer.navigation,
        priorityEn: en.common.footer.priority,
        priorityAr: ar.common.footer.priority,
        termsEn: en.common.footer.terms,
        termsAr: ar.common.footer.terms,
        privacyEn: en.common.footer.privacy,
        privacyAr: ar.common.footer.privacy,
        basedInEn: en.common.footer.basedIn,
        basedInAr: ar.common.footer.basedIn,
        copyrightEn: en.common.footer.copyright,
        copyrightAr: ar.common.footer.copyright,
        backToTopEn: en.common.footer.backToTop,
        backToTopAr: ar.common.footer.backToTop,
      }),
      headerMenuJson: JSON.stringify([
        { key: "home", href: "/", labelEn: en.common.nav.home, labelAr: ar.common.nav.home, visible: true },
        { key: "projects", href: "/projects", labelEn: en.common.nav.projects, labelAr: ar.common.nav.projects, visible: true },
        { key: "services", href: "/#services", labelEn: en.common.nav.services, labelAr: ar.common.nav.services, visible: true },
        { key: "contact", href: "/contact", labelEn: en.common.nav.contact, labelAr: ar.common.nav.contact, visible: true },
      ]),
      footerLinksJson: JSON.stringify([]),
    },
  });

  console.log("Database seeded successfully.");
  console.log(`Admin login: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
