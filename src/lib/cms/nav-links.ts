import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { CmsNavLink, ContactSettingsData } from "@/lib/cms/types";
import { pick } from "@/lib/cms/utils";

type MenuItemJson = {
  key?: string;
  href: string;
  labelEn?: string;
  labelAr?: string;
  visible?: boolean;
  external?: boolean;
};

const DEFAULT_NAV_KEYS = [
  "home",
  "projects",
  "blog",
  "services",
  "contact",
  "faq",
] as const;

const DEFAULT_NAV_HREFS: Record<(typeof DEFAULT_NAV_KEYS)[number], string> = {
  home: "/",
  projects: "/projects",
  blog: "/blog",
  services: "/#services",
  contact: "/contact",
  faq: "/#faq",
};

export function buildNavLinksFromMenu(
  items: MenuItemJson[],
  locale: Locale,
  staticNav: Dictionary["common"]["nav"],
): CmsNavLink[] {
  const visibleItems = items.filter((item) => item.visible !== false);

  let links: CmsNavLink[];

  if (visibleItems.length > 0) {
    links = visibleItems.map((item) => ({
      key: item.key ?? item.href,
      href: item.href,
      label:
        pick(item.labelEn ?? "", item.labelAr ?? "", locale) ||
        (item.key ? staticNav[item.key as keyof typeof staticNav] : "") ||
        item.href,
      external: item.external,
    }));
  } else {
    links = DEFAULT_NAV_KEYS.map((key) => ({
      key,
      href: DEFAULT_NAV_HREFS[key],
      label: staticNav[key],
    }));
  }

  const hasBlog = links.some(
    (link) =>
      link.key === "blog" ||
      link.href === "/blog" ||
      link.href.endsWith("/blog"),
  );

  if (!hasBlog) {
    const projectsIndex = links.findIndex((link) => link.key === "projects");
    const blogLink: CmsNavLink = {
      key: "blog",
      href: DEFAULT_NAV_HREFS.blog,
      label: staticNav.blog,
    };

    if (projectsIndex >= 0) {
      links.splice(projectsIndex + 1, 0, blogLink);
    } else {
      links.push(blogLink);
    }
  }

  return links;
}

export function buildTalkLinks(contact: ContactSettingsData): CmsNavLink[] {
  const links: CmsNavLink[] = [];

  const whatsapp = contact.whatsappNumbers[0];
  if (whatsapp) {
    links.push({
      key: "whatsapp",
      href: whatsapp.url,
      label: whatsapp.label,
      external: true,
    });
  }

  const email = contact.emails[0];
  if (email) {
    links.push({
      key: "email",
      href: `mailto:${email}`,
      label: email,
    });
  }

  return links;
}
