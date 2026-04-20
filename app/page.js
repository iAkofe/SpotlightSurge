import Header from "@/components/Header/Header";
import HeroSection from "@/components/HeroSection/HeroSection";
import AuthorSpotlightSection from "@/components/AuthorSpotlightSection/AuthorSpotlightSection";
import ImpactSection from "@/components/ImpactSection/ImpactSection";
import FeaturedBookSection from "@/components/FeaturedBookSection/FeaturedBookSection";
import AwardsSection from "@/components/AwardsSection/AwardsSection";
import LaunchSection from "@/components/LaunchSection/LaunchSection";
import MemoriesSection from "@/components/MemoriesSection/MemoriesSection";
import ServicesSection from "@/components/ServicesSection/ServicesSection";
import RecentPostsSection from "@/components/RecentPostsSection/RecentPostsSection";
import CtaSection from "@/components/CtaSection/CtaSection";
import NewsletterSection from "@/components/NewsletterSection/NewsletterSection";
import Footer from "@/components/Footer/Footer";
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AuthorSpotlightSection />
        <ImpactSection />
        <FeaturedBookSection />
        <AwardsSection />
        <LaunchSection />
        <MemoriesSection />
        <ServicesSection />
        <RecentPostsSection />
        <CtaSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
