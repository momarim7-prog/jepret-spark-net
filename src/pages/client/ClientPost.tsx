import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ClientLayout from "@/components/client/ClientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SERVICE_CATEGORIES } from "@/lib/categories";
import { format } from "date-fns";
import { CalendarIcon, Loader2, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(100),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter").max(2000),
  category: z.string(),
  type: z.enum(["onsite", "remote"]),
});

const ClientPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "fotoin" as string,
    type: "onsite" as "onsite" | "remote",
    date: undefined as Date | undefined,
    time: "10:00",
    location_address: "",
    budget_idr: "",
  });

  const submit = async () => {
    if (!user) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    let scheduledAt: string | null = null;
    if (form.date) {
      const [h, m] = form.time.split(":").map(Number);
      const d = new Date(form.date);
      d.setHours(h || 0, m || 0, 0, 0);
      scheduledAt = d.toISOString();
    }

    setSubmitting(true);
    const { error } = await supabase.from("jobs").insert({
      client_id: user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category as never,
      type: form.type,
      scheduled_at: scheduledAt,
      location_address: form.type === "onsite" ? form.location_address.trim() || null : null,
      budget_idr: form.budget_idr ? parseInt(form.budget_idr, 10) : null,
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Pekerjaan berhasil diposting");
      navigate("/client/bookings");
    }
  };

  return (
    <ClientLayout>
      <div className="px-5 lg:px-10 pt-8 max-w-2xl mx-auto">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Post a Job</p>
        <h1 className="font-display text-3xl mb-8">Buat lowongan baru</h1>

        <div className="space-y-6">
          {/* Category */}
          <div>
            <Label>Kategori layanan</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {SERVICE_CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setForm({ ...form, category: c.value })}
                  className={cn(
                    "rounded-xl py-3 px-2 text-xs font-medium border transition-all",
                    form.category === c.value
                      ? "bg-gradient-golden text-primary-foreground border-transparent shadow-amber"
                      : "bg-card border-border/50 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="block text-base mb-1">{c.emoji}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <Label>Tipe pekerjaan</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {(["onsite", "remote"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={cn(
                    "rounded-xl py-3 text-sm border transition-colors",
                    form.type === t
                      ? "bg-gradient-golden text-primary-foreground border-transparent shadow-amber"
                      : "bg-card border-border/50 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t === "onsite" ? "Onsite (datang ke lokasi)" : "Remote (online)"}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label>Judul pekerjaan</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Foto produk untuk katalog"
              className="mt-2"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Deskripsi & brief</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Jelaskan kebutuhan, gaya, deliverables..."
              className="mt-2 min-h-[120px]"
              maxLength={2000}
            />
          </div>

          {/* Date + time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("mt-2 w-full justify-start font-normal", !form.date && "text-muted-foreground")}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {form.date ? format(form.date, "d MMM yyyy") : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.date}
                    onSelect={(d) => setForm({ ...form, date: d })}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Jam</Label>
              <div className="relative mt-2">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Location (onsite only) */}
          {form.type === "onsite" && (
            <div>
              <Label>Lokasi</Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={form.location_address}
                  onChange={(e) => setForm({ ...form, location_address: e.target.value })}
                  placeholder="Jl. Sudirman No. 1, Jakarta"
                  className="pl-9"
                />
              </div>
            </div>
          )}

          {/* Budget */}
          <div>
            <Label>Budget (opsional, IDR)</Label>
            <Input
              type="number"
              value={form.budget_idr}
              onChange={(e) => setForm({ ...form, budget_idr: e.target.value })}
              placeholder="500000"
              className="mt-2"
            />
          </div>

          <Button
            onClick={submit}
            disabled={submitting}
            className="w-full bg-gradient-golden text-primary-foreground shadow-amber h-12"
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Posting Pekerjaan
          </Button>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientPost;
