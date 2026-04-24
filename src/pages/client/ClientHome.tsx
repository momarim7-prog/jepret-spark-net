import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import HeroSearch from "@/components/HeroSearch";
import ServiceCategories from "@/components/ServiceCategories";
import TalentGrid from "@/components/TalentGrid";
import InvoicePreview from "@/components/InvoicePreview";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClientHome = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative">
      <main className="relative z-10 pb-32 max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-5 lg:px-10 pt-6">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Selamat datang</p>
            <p className="font-display text-2xl">{profile?.full_name ?? "Klien"}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => { await signOut(); navigate("/auth"); }}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
        <HeroSearch />
        <ServiceCategories />
        <TalentGrid />
        <InvoicePreview />
        <footer className="px-5 lg:px-10 mt-14 text-center space-y-2">
          <div className="flex justify-center gap-4 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            <a href="/terms" className="hover:text-foreground">Terms</a>
            <span>·</span>
            <a href="/privacy" className="hover:text-foreground">Privacy</a>
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-amber">Jepretin · Made in Indonesia</div>
        </footer>
      </main>
      <BottomNav />
    </div>
  );
};

export default ClientHome;
