import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { Camera, Briefcase } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const RoleSelect = () => {
  const navigate = useNavigate();
  const { user, role, loading, refreshProfile } = useAuth();
  const [submitting, setSubmitting] = useState<AppRole | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth", { replace: true });
    } else if (role) {
      navigate(role === "client" ? "/onboarding/client" : "/onboarding/freelancer", { replace: true });
    }
  }, [user, role, loading, navigate]);

  const choose = async (chosen: AppRole) => {
    if (!user) return;
    setSubmitting(chosen);
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: chosen });
    if (error) {
      toast({ title: "Gagal menyimpan peran", description: error.message, variant: "destructive" });
      setSubmitting(null);
      return;
    }
    await refreshProfile();
    navigate(chosen === "client" ? "/onboarding/client" : "/onboarding/freelancer", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 bg-background">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">Selamat datang</p>
          <h1 className="font-display text-5xl md:text-6xl text-gradient-golden">Saya adalah…</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <button
            disabled={!!submitting}
            onClick={() => choose("client")}
            className="group glass rounded-3xl p-8 text-left hover:ring-amber-glow transition-all duration-500 disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-golden flex items-center justify-center mb-6 shadow-amber">
              <Briefcase className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl mb-2">Klien</h2>
            <p className="text-sm text-muted-foreground normal-case tracking-normal">
              Mencari freelancer untuk proyek kreatif Anda
            </p>
            {submitting === "client" && <p className="text-xs text-amber mt-4 tracking-[0.2em]">MEMUAT…</p>}
          </button>

          <button
            disabled={!!submitting}
            onClick={() => choose("freelancer")}
            className="group glass rounded-3xl p-8 text-left hover:ring-amber-glow transition-all duration-500 disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-golden flex items-center justify-center mb-6 shadow-amber">
              <Camera className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl mb-2">Freelancer</h2>
            <p className="text-sm text-muted-foreground normal-case tracking-normal">
              Mencari pekerjaan dan proyek kreatif baru
            </p>
            {submitting === "freelancer" && <p className="text-xs text-amber mt-4 tracking-[0.2em]">MEMUAT…</p>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
