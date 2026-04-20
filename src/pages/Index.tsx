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

        <footer className="px-5 lg:px-10 mt-14 text-center">
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
