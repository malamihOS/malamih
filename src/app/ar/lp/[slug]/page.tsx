import LandingPageView, {
  generateLandingMetadata,
} from "@/views/LandingPageView";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return generateLandingMetadata(slug, "ar");
}

export default async function ArabicLandingPage({ params }: PageProps) {
  const { slug } = await params;
  return <LandingPageView slug={slug} locale="ar" />;
}
