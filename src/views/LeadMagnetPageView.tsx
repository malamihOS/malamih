import { notFound } from "next/navigation";
import Header from "@/components/Header";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/config";

export default async function LeadMagnetPageView({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const magnet = await prisma.leadMagnet.findUnique({ where: { slug } });
  if (!magnet || magnet.status !== "active") notFound();

  const title = locale === "ar" ? magnet.titleAr : magnet.titleEn;
  const description =
    locale === "ar" ? magnet.descriptionAr : magnet.descriptionEn;

  return (
    <main>
      <Header variant="page" />
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 120px", color: "#fff" }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: 16 }}>{title}</h1>
        {description ? <p style={{ opacity: 0.75, marginBottom: 32 }}>{description}</p> : null}
        <LeadMagnetForm slug={slug} title={title} />
      </section>
    </main>
  );
}
