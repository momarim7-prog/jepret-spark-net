import BottomNav from "@/components/BottomNav";
import HeroSearch from "@/components/HeroSearch";
import ServiceCategories from "@/components/ServiceCategories";
import WalletCard from "@/components/WalletCard";
import ServiceTiers from "@/components/ServiceTiers";
import TalentGrid from "@/components/TalentGrid";
import InvoicePreview from "@/components/InvoicePreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <main className="relative z-10 pb-32 max-w-md mx-auto">
        <HeroSearch />
        <ServiceCategories />
        <WalletCard />
        <ServiceTiers />
        <TalentGrid />
        <InvoicePreview />

        <footer className="px-5 mt-14 text-center">
          <div className="font-display italic text-lg text-muted-foreground">
            "No more <span className="line-through">WhatsApp</span> bottleneck."
          </div>
          <div className="mt-2 text-[10px] tracking-[0.3em] uppercase text-amber">
            Jepretin · Made in Indonesia
          </div>
        </footer>
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
