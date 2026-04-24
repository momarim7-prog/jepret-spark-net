import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Camera, ArrowRight, ArrowLeft } from "lucide-react";

const SKILLS = [
  "Fotografer",
  "Videografer",
  "Editor Video",
  "Editor Foto",
  "Desainer Grafis",
  "Ilustrator",
  "Music Producer",
  "Voice Over",
  "Animator",
  "3D Artist",
];

const schema = z.object({
  full_name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  bio: z.string().trim().min(10, "Bio minimal 10 karakter").max(500),
  skills: z.array(z.string()).min(1, "Pilih minimal satu skill"),
  service_radius_km: z.number().int().min(1).max(500),
  city: z.string().trim().min(2, "Kota wajib diisi").max(100),
});

const FreelancerOnboarding = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [radius, setRadius] = useState(20);
  const [city, setCity] = useState("");

  const TOTAL = 5;

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

  const toggleSkill = (s: string) => {
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const next = () => {
    if (step === 1 && fullName.trim().length < 2) {
      toast({ title: "Nama wajib diisi", variant: "destructive" });
      return;
    }
    if (step === 2 && bio.trim().length < 10) {
      toast({ title: "Bio minimal 10 karakter", variant: "destructive" });
      return;
    }
    if (step === 3 && skills.length === 0) {
      toast({ title: "Pilih minimal satu skill", variant: "destructive" });
      return;
    }
    if (step === 4 && city.trim().length < 2) {
      toast({ title: "Kota wajib diisi", variant: "destructive" });
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL));
  };

  const submit = async () => {
    if (!user) return;
    const parsed = schema.safeParse({
      full_name: fullName,
      bio,
      skills,
      service_radius_km: radius,
      city,
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
        bio: parsed.data.bio,
        skills: parsed.data.skills,
        service_radius_km: parsed.data.service_radius_km,
        city: parsed.data.city,
        onboarding_completed: true,
      })
      .eq("id", user.id);
    if (error) {
      toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }
    await refreshProfile();
    navigate("/freelancer/home", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col px-5 py-10 max-w-xl mx-auto w-full">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Onboarding Freelancer · {step}/{TOTAL}</p>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-golden transition-all duration-500" style={{ width: `${(step / TOTAL) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 glass rounded-3xl p-7 space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl mb-2">Halo, siapa nama Anda?</h2>
              <p className="text-sm text-muted-foreground normal-case tracking-normal">Plus foto profil</p>
            </div>
            <div className="flex items-center gap-5">
              <Avatar className="w-20 h-20 ring-2 ring-amber/30">
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback className="bg-charcoal-elevated"><Camera className="w-6 h-6 text-muted-foreground" /></AvatarFallback>
              </Avatar>
              <div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
                <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} className="text-xs tracking-[0.2em] uppercase">
                  {uploading ? "Mengupload…" : avatarUrl ? "Ganti foto" : "Upload foto"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Nama Lengkap</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-12 bg-background/60" maxLength={100} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl mb-2">Ceritakan tentang diri Anda</h2>
              <p className="text-sm text-muted-foreground normal-case tracking-normal">Bio singkat untuk klien</p>
            </div>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} maxLength={500} className="bg-background/60 normal-case tracking-normal" placeholder="Saya seorang fotografer dengan pengalaman 5 tahun…" />
            <p className="text-xs text-muted-foreground">{bio.length}/500</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl mb-2">Apa keahlian Anda?</h2>
              <p className="text-sm text-muted-foreground normal-case tracking-normal">Pilih semua yang sesuai</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SKILLS.map((s) => (
                <label key={s} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${skills.includes(s) ? "border-amber bg-amber/10" : "border-border bg-background/40"}`}>
                  <Checkbox checked={skills.includes(s)} onCheckedChange={() => toggleSkill(s)} />
                  <span className="text-sm uppercase tracking-wider">{s}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
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

        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl mb-2">Radius layanan Anda?</h2>
              <p className="text-sm text-muted-foreground normal-case tracking-normal">Seberapa jauh Anda bersedia bekerja</p>
            </div>
            <div className="space-y-6 py-4">
              <div className="text-center">
                <span className="font-display text-6xl text-gradient-golden">{radius}</span>
                <span className="text-xl text-muted-foreground ml-2">KM</span>
              </div>
              <Slider value={[radius]} min={1} max={200} step={1} onValueChange={(v) => setRadius(v[0])} />
              <div className="flex justify-between text-[10px] tracking-[0.2em] text-muted-foreground">
                <span>1 KM</span><span>200 KM</span>
              </div>
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
          <Button onClick={submit} disabled={submitting} className="flex-1 h-12 bg-gradient-golden text-primary-foreground tracking-[0.2em] uppercase">
            {submitting ? "Menyimpan…" : "Selesai"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FreelancerOnboarding;
