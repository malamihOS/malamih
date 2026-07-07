import type { LegalSection } from "@/data/legal/types";

export type ServiceItem = {
  number: string;
  title: string;
  description?: string;
  tags: string[];
};

export type WhyCard = {
  title: string;
  description: string;
};

export type ProjectSectionContent = {
  label: string;
  heading: string;
  paragraphs: string[];
};

export type ProjectContent = {
  title: string;
  category: string;
  summary: string;
  industry: string;
  spaceOfWork: string;
  timeline: string;
  sections: {
    introduction: ProjectSectionContent;
    challenges: ProjectSectionContent;
    finalThoughts: ProjectSectionContent;
  };
};

export type Dictionary = {
  meta: {
    site: { title: string; description: string };
    pages: {
      home: { title: string; description: string };
      contact: { title: string; description: string };
      projects: { title: string; description: string };
      projectFallback: { title: string; description: string };
      terms: { title: string; description: string };
      privacy: { title: string; description: string };
      notFound: { title: string; description: string };
      blog: { title: string; description: string };
      blogFallback: { title: string; description: string };
    };
  };
  common: {
    brand: { name: string; creative: string; studio: string };
    header: {
      email: string;
      whatsApp: string;
      location: string;
      contactNav: string;
      openMenu: string;
      closeMenu: string;
    };
    nav: {
      home: string;
      projects: string;
      services: string;
      contact: string;
      blog: string;
      faq: string;
    };
    footer: {
      contactUs: string;
      haveProject: string;
      letsTalk: string;
      navigation: string;
      priority: string;
      terms: string;
      privacy: string;
      basedIn: string;
      copyright: string;
      backToTop: string;
      marquee: string[];
    };
    legal: {
      effectiveDate: string;
      lastUpdated: string;
      contactPage: string;
      officialWebsite: string;
      agencyName: string;
      termsContact: string;
      privacyContact: string;
    };
    notFound: {
      label: string;
      title: string;
      description: string;
      backHome: string;
      viewProjects: string;
    };
    projectDetail: {
      liveWebsite: string;
      year: string;
      industry: string;
      spaceOfWork: string;
      timeline: string;
      showcaseAlt: string;
      detailAlt: string;
      finalAlt: string;
    };
    moreProjects: {
      label: string;
      heading: string;
    };
  };
  home: {
    hero: {
      headline: string;
      description: string;
      ctaText: string;
      ctaLink: string;
      categories: string[];
      tagline1: string;
      tagline2: string;
    };
    commitment: {
      slideAlts: string[];
      heading: string;
      description: string;
      stats: { label: string }[];
      marqueeLabel: string;
    };
    projects: {
      label: string;
      headingLine1: string;
      headingLine2: string;
      description: string;
      seeMore: string;
    };
    why: {
      label: string;
      headingLine1: string;
      headingLine2: string;
      description: string;
      cards: WhyCard[];
    };
    services: {
      label: string;
      heading: string;
      items: ServiceItem[];
    };
    team: {
      label: string;
      heading: string;
    };
  };
  contact: {
    heroAlt: string;
    stepLabel: string;
    title: string;
    subtitle: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      company: string;
      companyPlaceholder: string;
      subject: string;
      subjectPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitted: string;
    };
    info: {
      addressTitle: string;
      contactTitle: string;
    };
    team: { caption: string; alt: string }[];
  };
  legal: {
    terms: { title: string; date: string; sections: LegalSection[] };
    privacy: { title: string; date: string; sections: LegalSection[] };
  };
  projects: {
    page: {
      label: string;
      headingLine1: string;
      headingLine2: string;
    };
    items: Record<string, ProjectContent>;
  };
  blog: {
    page: {
      headingLine1: string;
      headingLine2: string;
      description: string;
      featured: string;
      allPosts: string;
    };
    detail: {
      by: string;
      tags: string;
      related: string;
      cta: string;
    };
  };
  growth: {
    newsletter: {
      label: string;
      title: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      submit: string;
      success: string;
    };
    inquiry: {
      title: string;
      name: string;
      company: string;
      phone: string;
      email: string;
      description: string;
      budget: string;
      contactEmail: string;
      contactPhone: string;
      contactWhatsApp: string;
      submit: string;
      success: string;
      close: string;
      inquire: string;
    };
    budget: {
      under5k: string;
      range5k15k: string;
      range15k50k: string;
      range50k100k: string;
      over100k: string;
      notSure: string;
    };
    proposal: {
      title: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      step6: string;
      services: string;
      company: string;
      companyPlaceholder: string;
      contactName: string;
      contactEmail: string;
      contactPhone: string;
      goals: string;
      goalsPlaceholder: string;
      budget: string;
      timeline: string;
      timelinePlaceholder: string;
      next: string;
      back: string;
      submit: string;
      success: string;
    };
    projectInquiry: {
      title: string;
      submit: string;
      success: string;
    };
  };
  site: {
    address: string;
    social: { facebook: string; instagram: string; linkedIn: string };
  };
};
