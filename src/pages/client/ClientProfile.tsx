import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ClientLayout from "@/components/client/ClientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Camera, Save } from "lucide-react";

const ClientProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const [form, setForm] = useState({
    full_name: "",
    company_name: "",
    city: "",
    avatar_url: "",
    account_type: "individual",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        company_name: profile.company_name ?? "",
        city: profile.city ?? "",
        avatar_url: profile.avatar_url ?? "",
        account_type: profile.account_type ?? "individual",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("jobs").select("status").eq("client_id", user.id);
      const list = data ?? [];
      setStats({
        total: list.length,
        completed: list.filter((j) => ["completed", "paid"].includes(j.status)).length,
      });
    })();
  }, [user]);

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      toast.error(error.message);
    } else {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setForm((f) => ({ ...f, avatar_url: data.publicUrl }));
      toast.success("Foto diperbarui");
    }
    setUploading(false);
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        company_name: form.account_type === "company" ? form.company_name : null,
        city: form.city,
        avatar_url: form.avatar_url || null,
        account_type: form.account_type,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profil tersimpan");
      refreshProfile();
    }
  };

  return (
    <ClientLayout>
      <div className="px-5 lg:px-10 pt-8 max-w-2xl mx-auto">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Profil</p>
        <h1 className="font-display text-3xl mb-8">Pengaturan akun</h1>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={form.avatar_url} />
                <AvatarFallback>{(form.full_name || "K").slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber text-primary-foreground flex items-center justify-center cursor-pointer shadow-amber">
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </label>
            </div>
            <div className="flex-1">
              <p className="font-display text-xl leading-tight">{form.full_name || "Belum diatur"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
              <div className="flex gap-4 mt-2 text-xs">
                <span><b className="text-amber">{stats.total}</b> total bookings</span>
                <span><b className="text-amber">{stats.completed}</b> selesai</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Label>Nama lengkap</Label>
            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-2" />
          </div>

          <div>
            <Label>Tipe akun</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {["individual", "company"].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, account_type: t })}
                  className={`rounded-xl py-3 text-sm border transition-colors ${
                    form.account_type === t
                      ? "bg-gradient-golden text-primary-foreground border-transparent shadow-amber"
                      : "bg-card border-border/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "individual" ? "Individu" : "Perusahaan"}
                </button>
              ))}
            </div>
          </div>

          {form.account_type === "company" && (
            <div>
              <Label>Nama perusahaan</Label>
              <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} className="mt-2" />
            </div>
          )}

          <div>
            <Label>Kota</Label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Jakarta" className="mt-2" />
          </div>

          <Button onClick={save} disabled={saving} className="w-full bg-gradient-golden text-primary-foreground shadow-amber">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Simpan perubahan
          </Button>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientProfile;
