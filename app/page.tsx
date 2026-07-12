import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingValue } from "@/components/marketing/MarketingValue";
import { MarketingMethod } from "@/components/marketing/MarketingMethod";
import { MarketingTrust } from "@/components/marketing/MarketingTrust";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#1C1C1C]">
      {/* 1. Hero: The Invitation */}
      <MarketingHero />

      {/* 2. Value: What is this? */}
      <MarketingValue />

      {/* 3. Method: How it works (Zig-Zag) */}
      <MarketingMethod />

      {/* 4. Trust: Why it works */}
      <MarketingTrust />

      {/* 5. Final CTA */}
      <MarketingCTA />

      {/* Existing Footer */}
      <Footer />
    </main>
  );
}
