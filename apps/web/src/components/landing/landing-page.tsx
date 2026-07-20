import { AudiencesSection } from "./audiences-section";
import { BrandingSection } from "./branding-section";
import { ComparisonSection } from "./comparison-section";
import { ProposalFlowAnimation } from "./proposal-flow-animation";
import { EarlyAccessSection } from "./early-access-section";
import { FaqSection } from "./faq-section";
import { FeaturesSection } from "./features-section";
import { FinalCtaSection } from "./final-cta-section";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";
import { PricingSection } from "./pricing-section";
import { ProblemSection } from "./problem-section";
import { SolutionSection } from "./solution-section";
import { TemplatesSection } from "./templates-section";

type LandingPageProps = {
  isAuthenticated: boolean;
};

export function LandingPage({ isAuthenticated }: LandingPageProps) {
  return (
    <main className="app-gradient-bg min-h-screen overflow-x-hidden text-foreground">
      <LandingHeader isAuthenticated={isAuthenticated} />
      <HeroSection isAuthenticated={isAuthenticated} />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <BrandingSection />
      <TemplatesSection />
      <HowItWorksSection />
      <ProposalFlowAnimation />
      <AudiencesSection />
      <ComparisonSection />
      <PricingSection isAuthenticated={isAuthenticated} />
      <EarlyAccessSection />
      <FaqSection />
      <FinalCtaSection isAuthenticated={isAuthenticated} />
      <LandingFooter />
    </main>
  );
}
