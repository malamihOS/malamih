export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://malamih.net";

export const ORGANIZATION = {
  nameEn: "Malamih Creative Company",
  nameAr: "شركة ملامح الإبداعية",
  legalName: "Malamih Creative Company",
  descriptionEn:
    "Full-Service Creative & Marketing Agency helping businesses in Iraq and the Arab world grow through branding, content, digital marketing, and technology.",
  descriptionAr:
    "وكالة إبداعية وتسويقية متكاملة تساعد الشركات في العراق والعالم العربي على النمو من خلال العلامة التجارية والمحتوى والتسويق الرقمي والتقنية.",
  location: "Iraq",
  addressEn: "Iraq, Baghdad, Al Yarmouk",
  addressAr: "العراق، بغداد، اليرموك",
  email: "info@malamih.net",
  phone: "+964 785 555 0510",
  logo: "/malamih-logo.svg",
  sameAs: [
    "https://www.facebook.com/malamihnet/",
    "https://www.instagram.com/malamihnet/",
    "https://www.linkedin.com/company/malamihnet",
  ],
} as const;

export const TARGET_KEYWORDS = {
  en: [
    "Malamih Creative Company",
    "Full-Service Creative & Marketing Agency",
    "Marketing Agency in Iraq",
    "Creative Agency in Iraq",
    "Branding Agency in Iraq",
    "Digital Marketing Agency Iraq",
    "Social Media Agency Iraq",
    "Web Design Agency Iraq",
    "Content Production Iraq",
    "Advertising Agency Iraq",
  ],
  ar: [
    "شركة ملامح الإبداعية",
    "شركة تسويق في العراق",
    "وكالة تسويق في العراق",
    "شركة ماركتنك في العراق",
    "شركة براندنك في العراق",
    "شركة تصميم وتسويق في العراق",
    "وكالة إبداعية في العراق",
    "شركة سوشيال ميديا في العراق",
    "شركة إنتاج محتوى في العراق",
    "شركة إعلانات في العراق",
  ],
} as const;

export type PageSeoKey =
  | "home"
  | "contact"
  | "projects"
  | "projectFallback"
  | "blog"
  | "blogFallback"
  | "terms"
  | "privacy"
  | "notFound";
