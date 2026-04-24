import BottomNav from "@/components/BottomNav";
import HeroSearch from "@/components/HeroSearch";
import ServiceCategories from "@/components/ServiceCategories";
import TalentGrid from "@/components/TalentGrid";
import InvoicePreview from "@/components/InvoicePreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <main className="relative z-10 pb-32 max-w-7xl mx-auto">
        <HeroSearch />
        <ServiceCategories />
        <TalentGrid />
        <InvoicePreview />

        <footer className="px-5 lg:px-10 mt-14 text-center space-y-2">
          <div className="flex justify-center gap-4 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-amber">
            Jepretin · Made in Indonesia
          </div>
        </footer>
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
