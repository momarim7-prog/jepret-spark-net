import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ClientLayout from "@/components/client/ClientLayout";
import HeroSearch from "@/components/HeroSearch";
import ServiceCategories from "@/components/ServiceCategories";
import { Button } from "@/components/ui/button";
import { PlusCircle, ClipboardList, MapPin, Sparkles } from "lucide-react";

const ClientHome = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ active: 0, completed: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("jobs")
        .select("status")
        .eq("client_id", user.id);
      const list = data ?? [];
      setStats({
        active: list.filter((j) => ["posted", "accepted", "in_progress"].includes(j.status)).length,
        completed: list.filter((j) => ["completed", "paid"].includes(j.status)).length,
      });
    })();
  }, [user]);

  return (
    <ClientLayout>
      <div className="px-5 lg:px-10 pt-8 max-w-5xl mx-auto">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Selamat datang</p>
          <h1 className="font-display text-3xl lg:text-4xl">{profile?.full_name ?? "Klien"}</h1>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => navigate("/client/post")}
            className="rounded-2xl p-5 text-left bg-gradient-golden text-primary-foreground shadow-amber hover:scale-[1.02] transition-transform"
          >
            <PlusCircle className="w-5 h-5 mb-2" />
            <p className="font-display text-lg leading-tight">Post a Job</p>
            <p className="text-xs opacity-80 mt-1">Cari talent baru</p>
          </button>
          <button
            onClick={() => navigate("/client/bookings")}
            className="rounded-2xl p-5 text-left bg-card border border-border/50 hover:border-amber/40 transition-colors"
          >
            <ClipboardList className="w-5 h-5 mb-2 text-amber" />
            <p className="font-display text-lg leading-tight">Bookings</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.active} aktif · {stats.completed} selesai
            </p>
          </button>
        </div>

        <HeroSearch />
        <ServiceCategories />

        <div className="mt-10 rounded-2xl border border-border/50 p-6 bg-card/50">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber mt-0.5" />
            <div className="flex-1">
              <p className="font-display text-lg">Temukan freelancer di sekitar</p>
              <p className="text-xs text-muted-foreground mt-1">
                Lihat kreator terdekat di peta — disaring berdasarkan kategori.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate("/client/discover")}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Buka Peta
              </Button>
            </div>
          </div>
        </div>

        <footer className="mt-14 text-center space-y-2">
          <div className="flex justify-center gap-4 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            <a href="/terms" className="hover:text-foreground">Terms</a>
            <span>·</span>
            <a href="/privacy" className="hover:text-foreground">Privacy</a>
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-amber">Jepretin · Made in Indonesia</div>
        </footer>
      </div>
    </ClientLayout>
  );
};

export default ClientHome;
