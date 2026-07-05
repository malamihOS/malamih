import JsonLd from "@/components/JsonLd";
import {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo/schema";
import type { Locale } from "@/i18n/config";

export default function GlobalSeoJsonLd({ locale }: { locale: Locale }) {
  return (
    <JsonLd
      data={[
        organizationSchema(locale),
        localBusinessSchema(locale),
        websiteSchema(locale),
      ]}
    />
  );
}
