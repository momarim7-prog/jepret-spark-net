import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Camera, ArrowRight, ArrowLeft } from "lucide-react";

const WORK_TYPES = ["Foto", "Video", "Desain Grafis", "Editing", "Ilustrasi", "Voice Over", "Music"];

const schema = z.object({
  full_name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  account_type: z.enum(["individual", "company"]),
  company_name: z.string().trim().max(150).optional(),
  city: z.string().trim().min(2, "Kota wajib diisi").max(100),
  work_needed: z.array(z.string()).min(1, "Pilih minimal satu jenis pekerjaan"),
});

const ClientOnboarding = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<"individual" | "company">("individual");
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [workNeeded, setWorkNeeded] = useState<string[]>([]);

  const TOTAL = 4;

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File terlalu besar", description: "Maksimal 5MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Gagal upload", description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
    }
    setUploading(false);
  };

  const toggleWork = (w: string) => {
    setWorkNeeded((prev) => (prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]));
  };

  const next = () => {
    if (step === 1 && fullName.trim().length < 2) {
      toast({ title: "Nama wajib diisi", variant: "destructive" });
      return;
    }
    if (step === 2 && accountType === "company" && companyName.trim().length < 2) {
      toast({ title: "Nama perusahaan wajib diisi", variant: "destructive" });
      return;
    }
    if (step === 3 && city.trim().length < 2) {
      toast({ title: "Kota wajib diisi", variant: "destructive" });
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL));
  };

  const submit = async () => {
    if (!user) return;
    const parsed = schema.safeParse({
      full_name: fullName,
      account_type: accountType,
      company_name: companyName,
      city,
      work_needed: workNeeded,
    });
    if (!parsed.success) {
      toast({ title: "Periksa input", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: parsed.data.full_name,
        avatar_url: avatarUrl,
        account_type: parsed.data.account_type,
        company_name: accountType === "company" ? parsed.data.company_name : null,
        city: parsed.data.city,
        work_needed: parsed.data.work_needed,
        onboarding_completed: true,
      })
      .eq("id", user.id);
    if (error) {
      toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }
    await refreshProfile();
    navigate("/client/home", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col px-5 py-10 max-w-xl mx-auto w-full">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Onboarding Klien · {step}/{TOTAL}</p>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-golden transition-all duration-500" style={{ width: `${(step / TOTAL) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 glass rounded-3xl p-7 space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl mb-2">Halo, siapa nama Anda?</h2>
              <p className="text-sm text-muted-foreground normal-case tracking-normal">Plus foto profil (opsional)</p>
            </div>
            <div className="flex items-center gap-5">
              <Avatar className="w-20 h-20 ring-2 ring-amber/30">
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback className="bg-charcoal-elevated"><Camera className="w-6 h-6 text-muted-foreground" /></AvatarFallback>
              </Avatar>
              <div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="text-xs tracking-[0.2em] uppercase"
                >
                  {uploading ? "Mengupload…" : avatarUrl ? "Ganti foto" : "Upload foto"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Nama Lengkap</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-12 bg-background/60" placeholder="Nama lengkap Anda" maxLength={100} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl mb-2">Individu atau perusahaan?</h2>
            </div>
            <RadioGroup value={accountType} onValueChange={(v) => setAccountType(v as "individual" | "company")} className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background/40 cursor-pointer hover:border-amber/50">
                <RadioGroupItem value="individual" />
                <span className="text-sm uppercase tracking-wider">Individu</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background/40 cursor-pointer hover:border-amber/50">
                <RadioGroupItem value="company" />
                <span className="text-sm uppercase tracking-wider">Perusahaan</span>
              </label>
            </RadioGroup>
            {accountType === "company" && (
              <div className="space-y-2">
                <Label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Nama Perusahaan</Label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="h-12 bg-background/60" maxLength={150} />
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl mb-2">Di mana lokasi Anda?</h2>
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Kota</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} className="h-12 bg-background/60" placeholder="Jakarta, Bandung, Surabaya…" maxLength={100} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl mb-2">Jenis pekerjaan apa yang biasa Anda butuhkan?</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {WORK_TYPES.map((w) => (
                <label key={w} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${workNeeded.includes(w) ? "border-amber bg-amber/10" : "border-border bg-background/40"}`}>
                  <Checkbox checked={workNeeded.includes(w)} onCheckedChange={() => toggleWork(w)} />
                  <span className="text-sm uppercase tracking-wider">{w}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1 h-12 tracking-[0.2em] uppercase">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
        )}
        {step < TOTAL ? (
          <Button onClick={next} className="flex-1 h-12 bg-gradient-golden text-primary-foreground tracking-[0.2em] uppercase">
            Lanjut <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={submitting || workNeeded.length === 0} className="flex-1 h-12 bg-gradient-golden text-primary-foreground tracking-[0.2em] uppercase">
            {submitting ? "Menyimpan…" : "Selesai"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClientOnboarding;
