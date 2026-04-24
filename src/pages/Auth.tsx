import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const authSchema = z.object({
  email: z.string().trim().email("Email tidak valid").max(255),
  password: z.string().min(6, "Password minimal 6 karakter").max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, role, profile, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    if (!role) {
      navigate("/auth/role", { replace: true });
    } else if (!profile?.onboarding_completed) {
      navigate(role === "client" ? "/onboarding/client" : "/onboarding/freelancer", { replace: true });
    } else {
      navigate(role === "client" ? "/client/home" : "/freelancer/home", { replace: true });
    }
  }, [user, role, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = authSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast({ title: "Periksa input", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/auth/role` },
        });
        if (error) throw error;
        toast({ title: "Akun dibuat", description: "Pilih peran Anda untuk melanjutkan." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message ?? "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl text-gradient-golden tracking-tight">JEPRETIN</h1>
          <p className="text-muted-foreground text-xs tracking-[0.3em] mt-3 uppercase">
            {mode === "signup" ? "Buat akun baru" : "Masuk ke akun Anda"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 glass rounded-2xl p-7">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-background/60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 bg-background/60"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-gradient-golden text-primary-foreground hover:opacity-90 tracking-[0.2em] uppercase"
          >
            {submitting ? "Memproses…" : mode === "signup" ? "Daftar" : "Masuk"}
          </Button>

          {mode === "signup" && (
            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
              Dengan mendaftar, Anda menyetujui{" "}
              <Link to="/terms" className="text-primary underline-offset-2 hover:underline">Syarat & Ketentuan</Link>
              {" "}dan{" "}
              <Link to="/privacy" className="text-primary underline-offset-2 hover:underline">Kebijakan Privasi</Link>.
            </p>
          )}

          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="w-full text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors pt-2"
          >
            {mode === "signup" ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
