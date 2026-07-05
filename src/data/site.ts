export const SITE_MAPS_URL = "https://maps.app.goo.gl/8TwNGxaDbShY2ZxH6";

export const SITE_EMAIL = "info@malamih.net";

export const SITE_WHATSAPP_URL = "https://wa.me/9647855550510";

export const SITE_WHATSAPP_LABEL = "+964 785 555 0510";

export const SOCIAL_LINKS = [
  { key: "facebook" as const, href: "https://www.facebook.com/malamihnet/" },
  { key: "instagram" as const, href: "https://www.instagram.com/malamihnet/" },
  { key: "linkedIn" as const, href: "https://www.linkedin.com/company/malamihnet" },
];

export const TALK_LINKS = [
  { label: SITE_WHATSAPP_LABEL, href: SITE_WHATSAPP_URL },
  { label: SITE_EMAIL, href: `mailto:${SITE_EMAIL}` },
] as const;
