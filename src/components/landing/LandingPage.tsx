import React, { useState } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { WorkflowSection } from './WorkflowSection';
import { FeatureShowcase } from './FeatureShowcase';
import { SmartTemplatesSection } from './SmartTemplatesSection';
import { ComparisonSection } from './ComparisonSection';
import { TargetAudienceSection } from './TargetAudienceSection';
import { PricingSection } from './PricingSection';
import { FAQSection } from './FAQSection';
import { FinalCTASection } from './FinalCTASection';
import { LandingFooter } from './LandingFooter';
import { DemoModal } from './DemoModal';

interface LandingPageProps {
  onOpenLogin: () => void;
  onLaunchApp?: () => void;
  currentUser?: { name: string; role: string; division: string } | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onLaunchApp,
  currentUser,
}) => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans selection:bg-[#81C303]/30 selection:text-slate-900 overflow-x-hidden">
      {/* Sticky Navigation Header */}
      <LandingNavbar
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
        onOpenLogin={onOpenLogin}
        onLaunchApp={onLaunchApp}
        currentUser={currentUser}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection
          onOpenDemoModal={() => setIsDemoModalOpen(true)}
          onLaunchDemo={onLaunchApp}
        />

        {/* 2. Problem Section */}
        <ProblemSection />

        {/* 3. Solution / How It Works */}
        <WorkflowSection onOpenDemoModal={() => setIsDemoModalOpen(true)} />

        {/* 4. Core Feature Showcase */}
        <FeatureShowcase onOpenDemoModal={() => setIsDemoModalOpen(true)} />

        {/* 5. Smart Estimate Templates */}
        <SmartTemplatesSection onOpenDemoModal={() => setIsDemoModalOpen(true)} />

        {/* 6. Traditional vs KardeCalc Comparison */}
        <ComparisonSection onOpenDemoModal={() => setIsDemoModalOpen(true)} />

        {/* 7. Who Is It For */}
        <TargetAudienceSection />

        {/* 8. Annual Pricing (₹8,000 vs ₹12,000) */}
        <PricingSection
          onOpenDemoModal={() => setIsDemoModalOpen(true)}
        />

        {/* 9. FAQ Section */}
        <FAQSection />

        {/* 10. Final High-Impact CTA */}
        <FinalCTASection
          onOpenDemoModal={() => setIsDemoModalOpen(true)}
          onOpenLogin={onOpenLogin}
        />
      </main>

      {/* Footer */}
      <LandingFooter
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
        onOpenLogin={onOpenLogin}
      />

      {/* 3-Day Demo Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onLaunchDemo={onLaunchApp}
      />
    </div>
  );
};
