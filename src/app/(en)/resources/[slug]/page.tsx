import LeadMagnetPageView from "@/views/LeadMagnetPageView";

type PageProps = { params: Promise<{ slug: string }> };

export default async function ResourcePage({ params }: PageProps) {
  const { slug } = await params;
  return <LeadMagnetPageView slug={slug} locale="en" />;
}
