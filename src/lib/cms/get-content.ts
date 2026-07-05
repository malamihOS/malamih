import type { Locale } from "@/i18n/config";
import { en as staticEn } from "@/i18n/dictionaries/en";
import { ar as staticAr } from "@/i18n/dictionaries/ar";
import type { Dictionary } from "@/i18n/types";
import { PROJECT_ASSETS } from "@/data/project-assets";
import { prisma } from "@/lib/prisma";
import type {
  CmsProject,
  CmsProjectGallery,
  ContactSettingsData,
  SiteBranding,
  SiteContent,
  SiteMedia,
} from "@/lib/cms/types";
import { buildNavLinksFromMenu, buildTalkLinks } from "@/lib/cms/nav-links";
import { parseJson, pick } from "@/lib/cms/utils";
import { normalizeUploadUrl } from "@/lib/media-url";

function mediaUrl(url: string | null | undefined): string {
  return url ? normalizeUploadUrl(url) : "";
}

const DEFAULT_HERO_SLIDES = [
  {
    imageUrl:
      "https://framerusercontent.com/images/wPiTvVSrHAk94Tes9APNKlRyKbI.png",
    objectPosition: "center",
    animation: { y: 660, scale: 0.3, delay: 0, duration: 1.35, zIndex: 1 },
  },
  {
    imageUrl:
      "https://framerusercontent.com/images/hF2JMM2CfWFcpKzEQoV0UbiYIA.png",
    objectPosition: "center",
    animation: { y: 660, scale: 0.4, delay: 0.45, duration: 2.2, zIndex: 2 },
  },
  {
    imageUrl:
      "https://framerusercontent.com/images/IOJt5fgB3Aq1kSZsd5Ceo1vFVo.png",
    objectPosition: "68.3% 36.4%",
    animation: {
      y: 1020,
      scale: 0.5,
      riseScale: 0.6,
      delay: 0.9,
      duration: 2,
      expandDuration: 1.25,
      zIndex: 3,
    },
  },
];

const DEFAULT_COMMITMENT_SLIDES = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&h=1200&fit=crop&q=80",
];

const DEFAULT_WHY_VIDEO =
  "https://framerusercontent.com/assets/rOQYaZXQCrRwFCBvFvQvQ2Zvm0.mp4";

const DEFAULT_CONTACT_HERO =
  "https://framerusercontent.com/images/SL0n3LZsLnHc5uEjKxOMZdU86Y.jpeg?width=5120&height=5120";

const DEFAULT_TEAM_IMAGES = [
  "https://framerusercontent.com/images/04amVnvBHlmBhxordNiyRXcvqM.png?width=840&height=1200",
  "https://framerusercontent.com/images/PIbRHF6XcYb7rWjIICcekI1HFDg.png?width=840&height=1200",
];

function buildDictionary(
  locale: Locale,
  staticBase: Dictionary,
  data: Awaited<ReturnType<typeof fetchCmsData>>,
): Dictionary {
  const hero = data.heroConfig;
  const why = data.whyConfig;
  const site = data.siteSettings;
  const contact = data.contactSettings;
  const homeProjects = parseJson<Record<string, string>>(
    site?.homeProjectsJson ?? "{}",
    {},
  );
  const contactPage = parseJson<Record<string, string>>(
    site?.contactPageJson ?? "{}",
    {},
  );
  const footerContent = parseJson<Record<string, unknown>>(
    site?.footerContentJson ?? "{}",
    {},
  );

  const visibleServices = data.services
    .filter((s) => s.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const visibleWhyCards = data.whyCards
    .filter((c) => c.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const visibleStats = data.whyStats
    .filter((s) => s.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const visibleCommitmentSlides = data.whySlides
    .filter((s) => s.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    ...staticBase,
    meta: {
      ...staticBase.meta,
      site: {
        title:
          pick(
            site?.defaultSeoTitleEn ?? staticBase.meta.site.title,
            site?.defaultSeoTitleAr ?? staticAr.meta.site.title,
            locale,
          ) || staticBase.meta.site.title,
        description:
          pick(
            site?.defaultSeoDescEn ?? staticBase.meta.site.description,
            site?.defaultSeoDescAr ?? staticAr.meta.site.description,
            locale,
          ) || staticBase.meta.site.description,
      },
    },
    common: {
      ...staticBase.common,
      brand: {
        name: pick(
          site?.websiteNameEn ||
            hero?.headlineEn ||
            hero?.brandNameEn ||
            staticBase.common.brand.name,
          site?.websiteNameAr ||
            hero?.headlineAr ||
            hero?.brandNameAr ||
            staticAr.common.brand.name,
          locale,
        ),
        creative: pick(
          hero?.brandCreativeEn ?? staticBase.common.brand.creative,
          hero?.brandCreativeAr ?? staticAr.common.brand.creative,
          locale,
        ),
        studio: staticBase.common.brand.studio,
      },
      footer: {
        ...staticBase.common.footer,
        ...(footerContent as Partial<Dictionary["common"]["footer"]>),
        contactUs: pick(
          (footerContent.contactUsEn as string) ?? staticBase.common.footer.contactUs,
          (footerContent.contactUsAr as string) ?? staticAr.common.footer.contactUs,
          locale,
        ),
        haveProject: pick(
          (footerContent.haveProjectEn as string) ??
            staticBase.common.footer.haveProject,
          (footerContent.haveProjectAr as string) ??
            staticAr.common.footer.haveProject,
          locale,
        ),
        letsTalk: pick(
          (footerContent.letsTalkEn as string) ?? staticBase.common.footer.letsTalk,
          (footerContent.letsTalkAr as string) ?? staticAr.common.footer.letsTalk,
          locale,
        ),
        navigation: pick(
          (footerContent.navigationEn as string) ??
            staticBase.common.footer.navigation,
          (footerContent.navigationAr as string) ??
            staticAr.common.footer.navigation,
          locale,
        ),
        priority: pick(
          (footerContent.priorityEn as string) ?? staticBase.common.footer.priority,
          (footerContent.priorityAr as string) ?? staticAr.common.footer.priority,
          locale,
        ),
        terms: pick(
          (footerContent.termsEn as string) ?? staticBase.common.footer.terms,
          (footerContent.termsAr as string) ?? staticAr.common.footer.terms,
          locale,
        ),
        privacy: pick(
          (footerContent.privacyEn as string) ?? staticBase.common.footer.privacy,
          (footerContent.privacyAr as string) ?? staticAr.common.footer.privacy,
          locale,
        ),
        basedIn: pick(
          (footerContent.basedInEn as string) ?? staticBase.common.footer.basedIn,
          (footerContent.basedInAr as string) ?? staticAr.common.footer.basedIn,
          locale,
        ),
        copyright: pick(
          (footerContent.copyrightEn as string) ??
            staticBase.common.footer.copyright,
          (footerContent.copyrightAr as string) ??
            staticAr.common.footer.copyright,
          locale,
        ),
        backToTop: pick(
          (footerContent.backToTopEn as string) ??
            staticBase.common.footer.backToTop,
          (footerContent.backToTopAr as string) ?? staticAr.common.footer.backToTop,
          locale,
        ),
      },
    },
    home: {
      hero: {
        headline: pick(
          hero?.headlineEn ||
            site?.websiteNameEn ||
            hero?.brandNameEn ||
            staticBase.home.hero.headline,
          hero?.headlineAr ||
            site?.websiteNameAr ||
            hero?.brandNameAr ||
            staticAr.home.hero.headline,
          locale,
        ),
        description: pick(
          hero?.descriptionEn ?? staticBase.home.hero.description,
          hero?.descriptionAr ?? staticAr.home.hero.description,
          locale,
        ),
        ctaText: pick(
          hero?.ctaTextEn ?? staticBase.home.hero.ctaText,
          hero?.ctaTextAr ?? staticAr.home.hero.ctaText,
          locale,
        ),
        ctaLink: hero?.ctaLink || staticBase.home.hero.ctaLink,
        categories: parseJson<string[]>(
          locale === "ar"
            ? (hero?.categoriesAr ?? "[]")
            : (hero?.categoriesEn ?? "[]"),
          staticBase.home.hero.categories,
        ),
        tagline1: pick(
          hero?.tagline1En ?? staticBase.home.hero.tagline1,
          hero?.tagline1Ar ?? staticAr.home.hero.tagline1,
          locale,
        ),
        tagline2: pick(
          hero?.tagline2En ?? staticBase.home.hero.tagline2,
          hero?.tagline2Ar ?? staticAr.home.hero.tagline2,
          locale,
        ),
      },
      commitment: {
        slideAlts: visibleCommitmentSlides.map((slide) =>
          pick(slide.altEn, slide.altAr, locale),
        ),
        heading: pick(
          why?.commitmentHeadingEn ?? staticBase.home.commitment.heading,
          why?.commitmentHeadingAr ?? staticAr.home.commitment.heading,
          locale,
        ),
        description: pick(
          why?.commitmentDescEn ?? staticBase.home.commitment.description,
          why?.commitmentDescAr ?? staticAr.home.commitment.description,
          locale,
        ),
        stats: visibleStats.map((stat) => ({
          label: pick(stat.labelEn, stat.labelAr, locale),
        })),
        marqueeLabel: pick(
          why?.marqueeLabelEn ?? staticBase.home.commitment.marqueeLabel,
          why?.marqueeLabelAr ?? staticAr.home.commitment.marqueeLabel,
          locale,
        ),
      },
      projects: {
        label: pick(
          homeProjects.labelEn ?? staticBase.home.projects.label,
          homeProjects.labelAr ?? staticAr.home.projects.label,
          locale,
        ),
        headingLine1: pick(
          homeProjects.headingLine1En ?? staticBase.home.projects.headingLine1,
          homeProjects.headingLine1Ar ?? staticAr.home.projects.headingLine1,
          locale,
        ),
        headingLine2: pick(
          homeProjects.headingLine2En ?? staticBase.home.projects.headingLine2,
          homeProjects.headingLine2Ar ?? staticAr.home.projects.headingLine2,
          locale,
        ),
        description: pick(
          homeProjects.descriptionEn ?? staticBase.home.projects.description,
          homeProjects.descriptionAr ?? staticAr.home.projects.description,
          locale,
        ),
        seeMore: pick(
          homeProjects.seeMoreEn ?? staticBase.home.projects.seeMore,
          homeProjects.seeMoreAr ?? staticAr.home.projects.seeMore,
          locale,
        ),
      },
      why: {
        label: pick(
          why?.labelEn ?? staticBase.home.why.label,
          why?.labelAr ?? staticAr.home.why.label,
          locale,
        ),
        headingLine1: pick(
          why?.titleLine1En ?? staticBase.home.why.headingLine1,
          why?.titleLine1Ar ?? staticAr.home.why.headingLine1,
          locale,
        ),
        headingLine2: pick(
          why?.titleLine2En ?? staticBase.home.why.headingLine2,
          why?.titleLine2Ar ?? staticAr.home.why.headingLine2,
          locale,
        ),
        description: pick(
          why?.descriptionEn ?? staticBase.home.why.description,
          why?.descriptionAr ?? staticAr.home.why.description,
          locale,
        ),
        cards: visibleWhyCards.map((card) => ({
          title: pick(card.titleEn, card.titleAr, locale),
          description: pick(card.descriptionEn, card.descriptionAr, locale),
        })),
      },
      services: {
        label: staticBase.home.services.label,
        heading: staticBase.home.services.heading,
        items: visibleServices.map((service) => ({
          number: service.number,
          title: pick(service.titleEn, service.titleAr, locale),
          tags: parseJson<string[]>(
            locale === "ar" ? service.tagsAr : service.tagsEn,
            [],
          ),
        })),
      },
      team: {
        label: pick(
          data.teamConfig?.labelEn ?? staticBase.home.team.label,
          data.teamConfig?.labelAr ?? staticAr.home.team.label,
          locale,
        ),
        heading: pick(
          data.teamConfig?.headingEn ?? staticBase.home.team.heading,
          data.teamConfig?.headingAr ?? staticAr.home.team.heading,
          locale,
        ),
      },
    },
    contact: {
      ...staticBase.contact,
      heroAlt: pick(
        contactPage.heroAltEn ?? staticBase.contact.heroAlt,
        contactPage.heroAltAr ?? staticAr.contact.heroAlt,
        locale,
      ),
      stepLabel: pick(
        contactPage.stepLabelEn ?? staticBase.contact.stepLabel,
        contactPage.stepLabelAr ?? staticAr.contact.stepLabel,
        locale,
      ),
      title: pick(
        contactPage.titleEn ?? staticBase.contact.title,
        contactPage.titleAr ?? staticAr.contact.title,
        locale,
      ),
      subtitle: pick(
        contactPage.subtitleEn ?? staticBase.contact.subtitle,
        contactPage.subtitleAr ?? staticAr.contact.subtitle,
        locale,
      ),
      form: {
        name: pick(
          contactPage.nameEn ?? staticBase.contact.form.name,
          contactPage.nameAr ?? staticAr.contact.form.name,
          locale,
        ),
        namePlaceholder: pick(
          contactPage.namePlaceholderEn ?? staticBase.contact.form.namePlaceholder,
          contactPage.namePlaceholderAr ?? staticAr.contact.form.namePlaceholder,
          locale,
        ),
        email: pick(
          contactPage.emailEn ?? staticBase.contact.form.email,
          contactPage.emailAr ?? staticAr.contact.form.email,
          locale,
        ),
        emailPlaceholder: pick(
          contactPage.emailPlaceholderEn ??
            staticBase.contact.form.emailPlaceholder,
          contactPage.emailPlaceholderAr ?? staticAr.contact.form.emailPlaceholder,
          locale,
        ),
        phone: pick(
          staticBase.contact.form.phone,
          staticAr.contact.form.phone,
          locale,
        ),
        phonePlaceholder: pick(
          staticBase.contact.form.phonePlaceholder,
          staticAr.contact.form.phonePlaceholder,
          locale,
        ),
        company: pick(
          staticBase.contact.form.company,
          staticAr.contact.form.company,
          locale,
        ),
        companyPlaceholder: pick(
          staticBase.contact.form.companyPlaceholder,
          staticAr.contact.form.companyPlaceholder,
          locale,
        ),
        subject: pick(
          staticBase.contact.form.subject,
          staticAr.contact.form.subject,
          locale,
        ),
        subjectPlaceholder: pick(
          staticBase.contact.form.subjectPlaceholder,
          staticAr.contact.form.subjectPlaceholder,
          locale,
        ),
        message: pick(
          contactPage.messageEn ?? staticBase.contact.form.message,
          contactPage.messageAr ?? staticAr.contact.form.message,
          locale,
        ),
        messagePlaceholder: pick(
          contactPage.messagePlaceholderEn ??
            staticBase.contact.form.messagePlaceholder,
          contactPage.messagePlaceholderAr ??
            staticAr.contact.form.messagePlaceholder,
          locale,
        ),
        submit: pick(
          contactPage.submitEn ?? staticBase.contact.form.submit,
          contactPage.submitAr ?? staticAr.contact.form.submit,
          locale,
        ),
        submitted: pick(
          contactPage.submittedEn ?? staticBase.contact.form.submitted,
          contactPage.submittedAr ?? staticAr.contact.form.submitted,
          locale,
        ),
      },
      info: {
        addressTitle: pick(
          contactPage.addressTitleEn ?? staticBase.contact.info.addressTitle,
          contactPage.addressTitleAr ?? staticAr.contact.info.addressTitle,
          locale,
        ),
        contactTitle: pick(
          contactPage.contactTitleEn ?? staticBase.contact.info.contactTitle,
          contactPage.contactTitleAr ?? staticAr.contact.info.contactTitle,
          locale,
        ),
      },
      team: staticBase.contact.team.map((item, index) => ({
        caption: pick(
          (contactPage[`teamCaption${index}En`] as string) ?? item.caption,
          (contactPage[`teamCaption${index}Ar`] as string) ??
            staticAr.contact.team[index]?.caption ??
            item.caption,
          locale,
        ),
        alt: pick(
          (contactPage[`teamAlt${index}En`] as string) ?? item.alt,
          (contactPage[`teamAlt${index}Ar`] as string) ??
            staticAr.contact.team[index]?.alt ??
            item.alt,
          locale,
        ),
      })),
    },
    projects: {
      page: staticBase.projects.page,
      items: buildProjectItems(data.projects, locale),
    },
    site: {
      address: pick(
        contact?.addressEn ?? staticBase.site.address,
        contact?.addressAr ?? staticAr.site.address,
        locale,
      ),
      social: buildSocialLabels(contact, staticBase, locale),
    },
  };
}

function buildSocialLabels(
  contact: Awaited<ReturnType<typeof fetchCmsData>>["contactSettings"],
  staticBase: Dictionary,
  locale: Locale,
): Dictionary["site"]["social"] {
  const socialLinks = parseJson<
    { key: string; href: string; labelEn?: string; labelAr?: string }[]
  >(contact?.socialLinks ?? "[]", []);

  if (socialLinks.length === 0) {
    return staticBase.site.social;
  }

  const labels = { ...staticBase.site.social };

  for (const link of socialLinks) {
    const key = link.key as keyof Dictionary["site"]["social"];
    if (key in labels) {
      labels[key] = pick(
        link.labelEn ?? labels[key],
        link.labelAr ?? labels[key],
        locale,
      );
    }
  }

  return labels;
}

function buildBranding(
  site: Awaited<ReturnType<typeof fetchCmsData>>["siteSettings"],
): SiteBranding {
  return {
    logoUrl: mediaUrl(site?.logoUrl),
    faviconUrl: mediaUrl(site?.faviconUrl),
  };
}

function buildSiteNavigation(
  locale: Locale,
  staticBase: Dictionary,
  site: Awaited<ReturnType<typeof fetchCmsData>>["siteSettings"],
  contactSettings: ContactSettingsData,
) {
  const headerMenu = parseJson<
    {
      key?: string;
      href: string;
      labelEn?: string;
      labelAr?: string;
      visible?: boolean;
      external?: boolean;
    }[]
  >(site?.headerMenuJson ?? "[]", []);
  const footerLinks = parseJson<
    {
      key?: string;
      href: string;
      labelEn?: string;
      labelAr?: string;
      visible?: boolean;
      external?: boolean;
    }[]
  >(site?.footerLinksJson ?? "[]", []);

  return {
    navLinks: buildNavLinksFromMenu(headerMenu, locale, staticBase.common.nav),
    footerNavLinks: buildNavLinksFromMenu(
      footerLinks.length > 0 ? footerLinks : headerMenu,
      locale,
      staticBase.common.nav,
    ),
    talkLinks: buildTalkLinks(contactSettings),
  };
}

function buildProjectItems(
  projects: Awaited<ReturnType<typeof fetchCmsData>>["projects"],
  locale: Locale,
): Dictionary["projects"]["items"] {
  const items: Dictionary["projects"]["items"] = {};

  for (const project of projects) {
    if (project.status !== "published") continue;

    const sections = parseJson<ProjectContent["sections"]>(
      project.sectionsJson,
      {} as ProjectContent["sections"],
    );

    items[project.slug] = {
      title: pick(project.titleEn, project.titleAr, locale),
      category: pick(project.categoryEn, project.categoryAr, locale),
      summary: pick(project.shortDescEn, project.shortDescAr, locale),
      industry: pick(project.industryEn, project.industryAr, locale),
      spaceOfWork: pick(project.spaceOfWorkEn, project.spaceOfWorkAr, locale),
      timeline: project.timeline,
      sections,
    };
  }

  return items;
}

type ProjectContent = Dictionary["projects"]["items"][string];

async function fetchCmsData() {
  const [
    heroConfig,
    heroSlides,
    whyConfig,
    whySlides,
    whyStats,
    whyCards,
    clientLogos,
    teamConfig,
    teamMembers,
    projects,
    services,
    contactSettings,
    siteSettings,
  ] = await Promise.all([
    prisma.heroConfig.findFirst(),
    prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.whyMalamihConfig.findFirst(),
    prisma.whyMalamihSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.whyMalamihStat.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.whyMalamihCard.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.clientLogo.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.teamConfig.findFirst(),
    prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.project.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.service.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.contactSettings.findFirst(),
    prisma.siteSettings.findFirst(),
  ]);

  return {
    heroConfig,
    heroSlides,
    whyConfig,
    whySlides,
    whyStats,
    whyCards,
    clientLogos,
    teamConfig,
    teamMembers,
    projects,
    services,
    contactSettings,
    siteSettings,
  };
}

function buildMedia(
  locale: Locale,
  data: Awaited<ReturnType<typeof fetchCmsData>>,
  staticBase: Dictionary,
): SiteMedia {
  const heroSlides =
    data.heroSlides.filter((s) => s.visible).length > 0
      ? data.heroSlides
          .filter((s) => s.visible)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((slide) => ({
            id: slide.id,
            imageUrl: mediaUrl(slide.imageUrl),
            text: pick(slide.textEn, slide.textAr, locale),
            objectPosition: slide.objectPosition,
            sortOrder: slide.sortOrder,
            visible: slide.visible,
            animation: parseJson(slide.animationJson, {}),
          }))
      : DEFAULT_HERO_SLIDES.map((slide, index) => ({
          id: `default-${index}`,
          imageUrl: slide.imageUrl,
          text: "",
          objectPosition: slide.objectPosition,
          sortOrder: index,
          visible: true,
          animation: slide.animation,
        }));

  const commitmentSlides =
    data.whySlides.filter((s) => s.visible).length > 0
      ? data.whySlides
          .filter((s) => s.visible)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((slide) => ({
            id: slide.id,
            imageUrl: mediaUrl(slide.imageUrl),
            alt: pick(slide.altEn, slide.altAr, locale),
            sortOrder: slide.sortOrder,
            visible: slide.visible,
          }))
      : DEFAULT_COMMITMENT_SLIDES.map((src, index) => ({
          id: `default-commitment-${index}`,
          imageUrl: src,
          alt: staticBase.home.commitment.slideAlts[index] ?? "",
          sortOrder: index,
          visible: true,
        }));

  const whyCards = data.whyCards
    .filter((c) => c.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((card) => ({
      id: card.id,
      title: pick(card.titleEn, card.titleAr, locale),
      description: pick(card.descriptionEn, card.descriptionAr, locale),
      imageUrl: mediaUrl(card.imageUrl),
      sortOrder: card.sortOrder,
      visible: card.visible,
    }));

  const logos = data.clientLogos
    .filter((l) => l.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((logo) => ({
      id: logo.id,
      imageUrl: mediaUrl(logo.imageUrl),
      name: pick(logo.nameEn, logo.nameAr, locale),
      link: logo.link,
      sortOrder: logo.sortOrder,
      visible: logo.visible,
    }));

  const contactPage = parseJson<Record<string, string>>(
    data.siteSettings?.contactPageJson ?? "{}",
    {},
  );

  const visibleStats = data.whyStats
    .filter((s) => s.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const commitmentStats =
    visibleStats.length > 0
      ? visibleStats.map((stat) => ({
          id: stat.id,
          value: stat.value,
          suffix: stat.suffix,
          label: pick(stat.labelEn, stat.labelAr, locale),
          sortOrder: stat.sortOrder,
          visible: stat.visible,
        }))
      : [
          { id: "s1", value: 50, suffix: "+", label: staticBase.home.commitment.stats[0]?.label ?? "", sortOrder: 0, visible: true },
          { id: "s2", value: 20, suffix: "+", label: staticBase.home.commitment.stats[1]?.label ?? "", sortOrder: 1, visible: true },
          { id: "s3", value: 100, suffix: "%", label: staticBase.home.commitment.stats[2]?.label ?? "", sortOrder: 2, visible: true },
        ];

  return {
    hero: { slides: heroSlides },
    commitment: { slides: commitmentSlides, stats: commitmentStats },
    why: {
      videoUrl: mediaUrl(data.whyConfig?.videoUrl) || DEFAULT_WHY_VIDEO,
      cards: whyCards,
    },
    logos,
    team: {
      visible: data.teamConfig?.visible ?? true,
      members: data.teamMembers
        .filter((member) => member.visible)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((member) => ({
          id: member.id,
          imageUrl: mediaUrl(member.imageUrl),
          name: pick(member.nameEn, member.nameAr, locale),
          position: pick(member.positionEn, member.positionAr, locale),
          sortOrder: member.sortOrder,
          visible: member.visible,
        })),
    },
    contact: {
      heroImage: mediaUrl(contactPage.heroImage) || DEFAULT_CONTACT_HERO,
      teamImages: [
        {
          src: mediaUrl(contactPage.teamImage0) || DEFAULT_TEAM_IMAGES[0],
          caption: pick(
            contactPage.teamCaption0En ?? staticBase.contact.team[0].caption,
            contactPage.teamCaption0Ar ?? staticBase.contact.team[0].caption,
            locale,
          ),
          alt: pick(
            contactPage.teamAlt0En ?? staticBase.contact.team[0].alt,
            contactPage.teamAlt0Ar ?? staticBase.contact.team[0].alt,
            locale,
          ),
        },
        {
          src: mediaUrl(contactPage.teamImage1) || DEFAULT_TEAM_IMAGES[1],
          caption: pick(
            contactPage.teamCaption1En ?? staticBase.contact.team[1].caption,
            contactPage.teamCaption1Ar ?? staticBase.contact.team[1].caption,
            locale,
          ),
          alt: pick(
            contactPage.teamAlt1En ?? staticBase.contact.team[1].alt,
            contactPage.teamAlt1Ar ?? staticBase.contact.team[1].alt,
            locale,
          ),
        },
      ],
    },
  };
}

function buildProjects(
  projects: Awaited<ReturnType<typeof fetchCmsData>>["projects"],
  locale: Locale,
): CmsProject[] {
  return projects
    .filter((p) => p.status === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((project) => {
      const gallery = parseJson<CmsProjectGallery>(project.galleryJson, {
        hero: project.coverImage,
        mosaicOne: { tall: "", top: "", bottom: "" },
        mosaicTwo: { top: "", bottom: "", tall: "" },
        wide: "",
      });

      return {
        slug: project.slug,
        title: pick(project.titleEn, project.titleAr, locale),
        category: pick(project.categoryEn, project.categoryAr, locale),
        summary: pick(project.shortDescEn, project.shortDescAr, locale),
        industry: pick(project.industryEn, project.industryAr, locale),
        spaceOfWork: pick(project.spaceOfWorkEn, project.spaceOfWorkAr, locale),
        timeline: project.timeline,
        year: project.year,
        liveUrl: project.projectUrl,
        cardImage: mediaUrl(project.coverImage) || mediaUrl(gallery.hero),
        gallery,
        sections: parseJson(project.sectionsJson, {} as CmsProject["sections"]),
        clientName: project.clientName,
        servicesUsed: parseJson<string[]>(project.servicesUsed, []),
        seoTitle: pick(project.seoTitleEn, project.seoTitleAr, locale),
        seoDescription: pick(project.seoDescEn, project.seoDescAr, locale),
        status: project.status as "draft" | "published",
        showOnHomepage: project.showOnHomepage,
        sortOrder: project.sortOrder,
      };
    });
}

function buildContactSettings(
  contact: Awaited<ReturnType<typeof fetchCmsData>>["contactSettings"],
  locale: Locale,
  staticBase: Dictionary,
): ContactSettingsData {
  const socialLinks = parseJson<
    { key: string; href: string; labelEn?: string; labelAr?: string }[]
  >(contact?.socialLinks ?? "[]", []);

  return {
    phones: parseJson<string[]>(contact?.phones ?? "[]", []),
    whatsappNumbers: parseJson<{ label: string; url: string }[]>(
      contact?.whatsappNumbers ?? "[]",
      [{ label: "+964 785 555 0510", url: "https://wa.me/9647855550510" }],
    ),
    emails: parseJson<string[]>(
      contact?.emails ?? "[]",
      ["info@malamih.net"],
    ),
    address: pick(
      contact?.addressEn ?? staticBase.site.address,
      contact?.addressAr ?? staticAr.site.address,
      locale,
    ),
    mapsUrl:
      contact?.mapsUrl ?? "https://maps.app.goo.gl/8TwNGxaDbShY2ZxH6",
    socialLinks: socialLinks.map((link) => ({
      key: link.key,
      href: link.href,
      label: pick(link.labelEn ?? link.key, link.labelAr ?? link.key, locale),
    })),
    workingHours: pick(
      contact?.workingHoursEn ?? "",
      contact?.workingHoursAr ?? "",
      locale,
    ),
  };
}

export async function getSiteContent(locale: Locale): Promise<SiteContent> {
  try {
    const data = await fetchCmsData();
    const staticBase = locale === "ar" ? staticAr : staticEn;
    const contactSettings = buildContactSettings(
      data.contactSettings,
      locale,
      staticBase,
    );
    const navigation = buildSiteNavigation(
      locale,
      staticBase,
      data.siteSettings,
      contactSettings,
    );

    return {
      dictionary: buildDictionary(locale, staticBase, data),
      media: buildMedia(locale, data, staticBase),
      projects: buildProjects(data.projects, locale),
      contactSettings,
      branding: buildBranding(data.siteSettings),
      navLinks: navigation.navLinks,
      footerNavLinks: navigation.footerNavLinks,
      talkLinks: navigation.talkLinks,
    };
  } catch (error) {
    console.error("[getSiteContent] Failed to load CMS data:", error);
    return getStaticFallback(locale);
  }
}

function getStaticFallback(locale: Locale): SiteContent {
  const dictionary = locale === "ar" ? staticAr : staticEn;
  const entries = Object.entries(dictionary.projects.items);

  return {
    dictionary,
    media: {
      hero: {
        slides: DEFAULT_HERO_SLIDES.map((slide, index) => ({
          id: `static-${index}`,
          imageUrl: slide.imageUrl,
          text: "",
          objectPosition: slide.objectPosition,
          sortOrder: index,
          visible: true,
          animation: slide.animation,
        })),
      },
      commitment: {
        slides: DEFAULT_COMMITMENT_SLIDES.map((src, index) => ({
          id: `static-commitment-${index}`,
          imageUrl: src,
          alt: dictionary.home.commitment.slideAlts[index] ?? "",
          sortOrder: index,
          visible: true,
        })),
        stats: [
          { id: "s1", value: 50, suffix: "+", label: dictionary.home.commitment.stats[0]?.label ?? "", sortOrder: 0, visible: true },
          { id: "s2", value: 20, suffix: "+", label: dictionary.home.commitment.stats[1]?.label ?? "", sortOrder: 1, visible: true },
          { id: "s3", value: 100, suffix: "%", label: dictionary.home.commitment.stats[2]?.label ?? "", sortOrder: 2, visible: true },
        ],
      },
      why: {
        videoUrl: DEFAULT_WHY_VIDEO,
        cards: dictionary.home.why.cards.map((card, index) => ({
          id: `static-card-${index}`,
          title: card.title,
          description: card.description,
          imageUrl: "",
          sortOrder: index,
          visible: true,
        })),
      },
      logos: [],
      team: {
        visible: false,
        members: [],
      },
      contact: {
        heroImage: DEFAULT_CONTACT_HERO,
        teamImages: dictionary.contact.team.map((item, index) => ({
          src: DEFAULT_TEAM_IMAGES[index] ?? "",
          caption: item.caption,
          alt: item.alt,
        })),
      },
    },
    projects: entries.map(([slug, content], index) => ({
      slug,
      title: content.title,
      category: content.category,
      summary: content.summary,
      industry: content.industry,
      spaceOfWork: content.spaceOfWork,
      timeline: content.timeline,
      year: "2025",
      liveUrl: "",
      cardImage: "",
      gallery: {
        hero: "",
        mosaicOne: { tall: "", top: "", bottom: "" },
        mosaicTwo: { top: "", bottom: "", tall: "" },
        wide: "",
      },
      sections: content.sections,
      clientName: "",
      servicesUsed: [],
      seoTitle: content.title,
      seoDescription: content.summary,
      status: "published" as const,
      showOnHomepage: index >= entries.length - 2,
      sortOrder: index,
    })),
    contactSettings: {
      phones: [],
      whatsappNumbers: [
        { label: "+964 785 555 0510", url: "https://wa.me/9647855550510" },
      ],
      emails: ["info@malamih.net"],
      address: dictionary.site.address,
      mapsUrl: "https://maps.app.goo.gl/8TwNGxaDbShY2ZxH6",
      socialLinks: [
        { key: "facebook", href: "https://www.facebook.com/malamihnet/", label: dictionary.site.social.facebook },
        { key: "instagram", href: "https://www.instagram.com/malamihnet/", label: dictionary.site.social.instagram },
        { key: "linkedIn", href: "https://www.linkedin.com/company/malamihnet", label: dictionary.site.social.linkedIn },
      ],
      workingHours: "",
    },
    branding: {
      logoUrl: "",
      faviconUrl: "",
    },
    navLinks: buildNavLinksFromMenu([], locale, dictionary.common.nav),
    footerNavLinks: buildNavLinksFromMenu([], locale, dictionary.common.nav),
    talkLinks: buildTalkLinks({
      phones: [],
      whatsappNumbers: [
        { label: "+964 785 555 0510", url: "https://wa.me/9647855550510" },
      ],
      emails: ["info@malamih.net"],
      address: dictionary.site.address,
      mapsUrl: "https://maps.app.goo.gl/8TwNGxaDbShY2ZxH6",
      socialLinks: [],
      workingHours: "",
    }),
  };
}

export async function getAllPublishedProjectSlugs() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "published" },
      select: { slug: true },
    });
    if (projects.length > 0) {
      return projects.map((p) => p.slug);
    }
  } catch {
    // fall through
  }
  return PROJECT_ASSETS.map((p) => p.slug);
}

export async function getCmsProjectBySlug(slug: string, locale: Locale) {
  const content = await getSiteContent(locale);
  return content.projects.find((p) => p.slug === slug);
}

export async function getHomepageProjects(locale: Locale) {
  const content = await getSiteContent(locale);
  const homepage = content.projects.filter((p) => p.showOnHomepage);
  if (homepage.length > 0) return homepage.slice(-2);
  return content.projects.slice(-2);
}

export async function getAllProjectsForLocale(locale: Locale) {
  const content = await getSiteContent(locale);
  return content.projects;
}

export async function getRelatedCmsProjects(
  slug: string,
  locale: Locale,
  limit = 2,
) {
  const content = await getSiteContent(locale);
  return content.projects.filter((p) => p.slug !== slug).slice(0, limit);
}
