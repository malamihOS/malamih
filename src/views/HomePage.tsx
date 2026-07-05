import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CommitmentSection from "@/components/CommitmentSection";
import ProjectsSection from "@/components/ProjectsSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import ServicesSection from "@/components/ServicesSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <Header />
      <CommitmentSection />
      <ProjectsSection />
      <WhyChooseSection />
      <ServicesSection />
    </main>
  );
}
