import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, Calendar, MapPin, Clock, FileText } from "lucide-react";
import { z } from "zod";
import TalentMap from "@/components/TalentMap";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SERVICE_LABELS: Record<string, string> = {
  fotoin: "Fotoin",
  videoin: "Videoin",
  makeupin: "Make-up-in",
  stylein: "Style-in",
  sutradarain: "Sutradarain",
  suarain: "Suarain",
  terangin: "Terangin",
  bantuin: "Bantuin",
};

const jobSchema = z.object({
  occasion: z.string().trim().min(2, "Occasion wajib diisi").max(120),
  when: z.string().trim().min(1, "Waktu wajib diisi").max(60),
  where: z.string().trim().min(2, "Lokasi wajib diisi").max(200),
  duration: z.string().trim().min(1, "Durasi wajib diisi").max(40),
  notes: z.string().trim().max(1000).optional(),
});

const Field = ({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Briefcase;
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
      <Icon className="w-3.5 h-3.5 text-amber" />
      {label}
    </label>
    {children}
  </div>
);

const BookNow = () => {
  const { type, slug } = useParams();
  const navigate = useNavigate();
  const label = (slug && SERVICE_LABELS[slug]) || "Layanan";

  const [form, setForm] = useState({
    occasion: "",
    when: "ASAP (hari ini)",
    where: "",
    duration: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = jobSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    navigate(`/book/${type}/${slug}/posted`, { state: form });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-5 lg:px-10 pt-6 pb-24 relative z-10">
        <Link
          to={`/book/${type}/${slug}`}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-amber transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <div className="mt-5">
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber font-semibold">
            Book NOW · {label}
          </span>
          <h1 className="font-display text-2xl mt-2 leading-tight">
            Talent terdekat di sekitarmu
          </h1>
        </div>

        <div className="mt-4">
          <TalentMap />
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <h2 className="font-display text-xl">Detail pekerjaan</h2>

          <Field icon={Briefcase} label="What's the occasion?">
            <Input
              value={form.occasion}
              onChange={(e) => setForm({ ...form, occasion: e.target.value })}
              placeholder="Contoh: Wedding outdoor, product shoot…"
              maxLength={120}
            />
          </Field>

          <Field icon={Calendar} label="When?">
            <Input
              value={form.when}
              onChange={(e) => setForm({ ...form, when: e.target.value })}
              placeholder="ASAP / 18:00 hari ini"
              maxLength={60}
            />
          </Field>

          <Field icon={MapPin} label="Where?">
            <Input
              value={form.where}
              onChange={(e) => setForm({ ...form, where: e.target.value })}
              placeholder="Alamat lengkap atau landmark"
              maxLength={200}
            />
          </Field>

          <Field icon={Clock} label="Job duration?">
            <Input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="Contoh: 3 jam"
              maxLength={40}
            />
          </Field>

          <Field icon={FileText} label="Notes">
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Detail tambahan, gear, dress code, dll."
              maxLength={1000}
              rows={4}
            />
          </Field>

          <button
            type="submit"
            className="w-full mt-2 rounded-2xl bg-gradient-golden text-obsidian font-display text-lg py-4 shadow-amber hover:opacity-95 transition-all"
          >
            Post Job Listing →
          </button>
        </form>
      </main>
    </div>
  );
};

export default BookNow;
