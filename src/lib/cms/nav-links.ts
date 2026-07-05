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

  if (visibleItems.length > 0) {
    return visibleItems.map((item) => ({
      key: item.key ?? item.href,
      href: item.href,
      label:
        pick(item.labelEn ?? "", item.labelAr ?? "", locale) ||
        (item.key ? staticNav[item.key as keyof typeof staticNav] : "") ||
        item.href,
      external: item.external,
    }));
  }

  return DEFAULT_NAV_KEYS.map((key) => ({
    key,
    href: DEFAULT_NAV_HREFS[key],
    label: staticNav[key],
  }));
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
