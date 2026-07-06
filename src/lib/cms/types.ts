import type { Locale } from "@/i18n/config";
import type { Dictionary, ProjectContent } from "@/i18n/types";

export type HeroSlideAnimation = {
  y?: number;
  scale?: number;
  riseScale?: number;
  delay?: number;
  duration?: number;
  expandDuration?: number;
  zIndex?: number;
};

export type HeroSlideData = {
  id: string;
  imageUrl: string;
  text: string;
  objectPosition: string;
  sortOrder: number;
  visible: boolean;
  animation: HeroSlideAnimation;
};

export type WhySlideData = {
  id: string;
  imageUrl: string;
  alt: string;
  sortOrder: number;
  visible: boolean;
};

export type WhyStatData = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  sortOrder: number;
  visible: boolean;
};

export type WhyCardData = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  visible: boolean;
};

export type TeamMemberData = {
  id: string;
  imageUrl: string;
  name: string;
  position: string;
  sortOrder: number;
  visible: boolean;
};

export type ClientLogoData = {
  id: string;
  imageUrl: string;
  name: string;
  link: string;
  sortOrder: number;
  visible: boolean;
};

export type ContactSettingsData = {
  phones: string[];
  whatsappNumbers: { label: string; url: string }[];
  emails: string[];
  address: string;
  mapsUrl: string;
  socialLinks: { key: string; href: string; label: string }[];
  workingHours: string;
};

export type CmsNavLink = {
  key: string;
  href: string;
  label: string;
  external?: boolean;
};

export type SiteBranding = {
  logoUrl: string;
  faviconUrl: string;
};

export type SiteMedia = {
  hero: {
    slides: HeroSlideData[];
    videoUrl?: string;
  };
  commitment: {
    slides: WhySlideData[];
    stats: WhyStatData[];
  };
  why: {
    videoUrl: string;
    cards: WhyCardData[];
  };
  logos: ClientLogoData[];
  team: {
    visible: boolean;
    members: TeamMemberData[];
  };
  contact: {
    heroImage: string;
    teamImages: { src: string; caption: string; alt: string }[];
  };
};

export type CmsProjectGallery = {
  hero: string;
  mosaicOne: { tall: string; top: string; bottom: string };
  mosaicTwo: { top: string; bottom: string; tall: string };
  wide: string;
  positions?: Partial<
    Record<
      | "cover"
      | "hero"
      | "mosaicOne.tall"
      | "mosaicOne.top"
      | "mosaicOne.bottom"
      | "mosaicTwo.top"
      | "mosaicTwo.bottom"
      | "mosaicTwo.tall"
      | "wide",
      string
    >
  >;
};

export type CmsProject = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  industry: string;
  spaceOfWork: string;
  timeline: string;
  year: string;
  liveUrl: string;
  cardImage: string;
  gallery: CmsProjectGallery;
  sections: ProjectContent["sections"];
  clientName: string;
  servicesUsed: string[];
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
  showOnHomepage: boolean;
  sortOrder: number;
};

export type SiteContent = {
  dictionary: Dictionary;
  media: SiteMedia;
  projects: CmsProject[];
  contactSettings: ContactSettingsData;
  branding: SiteBranding;
  navLinks: CmsNavLink[];
  footerNavLinks: CmsNavLink[];
  talkLinks: CmsNavLink[];
};

export type LocalizedSiteContent = SiteContent & {
  locale: Locale;
};
