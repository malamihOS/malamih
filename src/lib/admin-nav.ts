import { NAV_PERMISSIONS, type Permission } from "@/lib/permissions";

export type AdminNavItem = {
  href: string;
  label: string;
  description?: string;
  exact?: boolean;
};

export type AdminNavSection = {
  id: string;
  title: string;
  description: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    id: "overview",
    title: "Overview",
    description: "Performance snapshot",
    items: [
      { href: "/admin", label: "Dashboard", description: "KPIs & quick links", exact: true },
      { href: "/admin/analytics", label: "Analytics", description: "Traffic & conversions" },
    ],
  },
  {
    id: "content",
    title: "Website content",
    description: "Homepage & pages",
    items: [
      { href: "/admin/hero", label: "Hero", description: "Homepage hero & slides" },
      { href: "/admin/why", label: "Why Malamih", description: "Value proposition section" },
      { href: "/admin/services", label: "Services", description: "Service cards & tags" },
      { href: "/admin/logos", label: "Client logos", description: "Logo marquee" },
      { href: "/admin/team", label: "Team", description: "Team members section" },
      { href: "/admin/projects", label: "Projects", description: "Portfolio & case studies" },
      { href: "/admin/blog", label: "Blog", description: "Articles & categories" },
    ],
  },
  {
    id: "seo-media",
    title: "SEO & media",
    description: "Search & assets",
    items: [
      { href: "/admin/seo", label: "Page SEO", description: "Titles, meta & OG images" },
      { href: "/admin/media", label: "Media library", description: "Uploaded images & files" },
    ],
  },
  {
    id: "communication",
    title: "Communication",
    description: "Contact & inbox",
    items: [
      { href: "/admin/contact", label: "Contact settings", description: "Address, email & social" },
      { href: "/admin/messages", label: "Messages", description: "Contact form inbox" },
    ],
  },
  {
    id: "growth",
    title: "Growth & CRM",
    description: "Leads & campaigns",
    items: [
      { href: "/admin/leads", label: "Leads CRM", description: "Pipeline & follow-ups" },
      { href: "/admin/newsletter", label: "Newsletter", description: "Subscribers list" },
      { href: "/admin/lead-magnets", label: "Lead magnets", description: "Download resources" },
      { href: "/admin/proposals", label: "Proposals", description: "Proposal requests" },
      { href: "/admin/landing-pages", label: "Landing pages", description: "Campaign pages" },
    ],
  },
  {
    id: "system",
    title: "System",
    description: "Settings & tools",
    items: [
      { href: "/admin/settings", label: "Site settings", description: "Brand, nav & footer" },
      { href: "/admin/integrations", label: "Integrations", description: "Gmail, pixels & tags" },
      { href: "/admin/export", label: "Backup & export", description: "Download CMS data" },
      { href: "/admin/users", label: "Users", description: "Admin accounts" },
    ],
  },
];

export function getNavPermission(href: string): Permission | undefined {
  return NAV_PERMISSIONS[href];
}
