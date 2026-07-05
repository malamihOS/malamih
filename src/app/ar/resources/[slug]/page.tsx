import LeadMagnetPageView from "@/views/LeadMagnetPageView";

type PageProps = { params: Promise<{ slug: string }> };

export default async function ArabicResourcePage({ params }: PageProps) {
  const { slug } = await params;
  return <LeadMagnetPageView slug={slug} locale="ar" />;
}
