import { HeroSection } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { TrendingAgentsSection } from "@/components/landing/trending-agents";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { PricingSection } from "@/components/landing/pricing";
import { FAQSection } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta";
import { getTrendingAgents } from "@/actions/agent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const trendingResult = await getTrendingAgents(6);
  const trendingAgents = trendingResult.success && trendingResult.data ? trendingResult.data : [];

  return (
    <>
      <HeroSection />
      <TrendingAgentsSection agents={trendingAgents} />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}