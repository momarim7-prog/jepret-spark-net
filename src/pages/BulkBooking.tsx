import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  Video,
  Brush,
  Shirt,
  Clapperboard,
  Mic,
  Lightbulb,
  HandHelping,
  Scissors,
  Palette,
  Box,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  FileText,
  Layers,
  Check,
  Sparkles,
} from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Service = {
  slug: string;
  name: string;
  Icon: typeof Camera;
  group: "On-site" | "Online";
  basePrice: number;
};

const SERVICES: Service[] = [
  { slug: "fotoin", name: "Fotoin", Icon: Camera, group: "On-site", basePrice: 350000 },
  { slug: "videoin", name: "Videoin", Icon: Video, group: "On-site", basePrice: 500000 },
  { slug: "makeupin", name: "Make-up-in", Icon: Brush, group: "On-site", basePrice: 400000 },
  { slug: "stylein", name: "Style-in", Icon: Shirt, group: "On-site", basePrice: 350000 },
  { slug: "sutradarain", name: "Sutradarain", Icon: Clapperboard, group: "On-site", basePrice: 600000 },
  { slug: "suarain", name: "Suarain", Icon: Mic, group: "On-site", basePrice: 300000 },
  { slug: "terangin", name: "Terangin", Icon: Lightbulb, group: "On-site", basePrice: 300000 },
  { slug: "bantuin", name: "Bantuin", Icon: HandHelping, group: "On-site", basePrice: 150000 },
  { slug: "editin", name: "Editin", Icon: Scissors, group: "Online", basePrice: 400000 },
  { slug: "desainin", name: "Desain-in", Icon: Palette, group: "Online", basePrice: 350000 },
  { slug: "3din", name: "3Din", Icon: Box, group: "Online", basePrice: 500000 },
];

const bulkSchema = z.object({
  occasion: z.string().trim().min(2, "Occasion wajib diisi").max(120),
  when: z.string().trim().min(1, "Waktu wajib diisi").max(60),
  where: z.string().trim().min(2, "Lokasi wajib diisi").max(200),
  duration: z.string().trim().min(1, "Durasi wajib diisi").max(40),
  notes: z.string().trim().max(1000).optional(),
});

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

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

const BulkBooking = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    occasion: "",
    when: "",
    where: "",
    duration: "",
    notes: "",
  });

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const { subtotal, discount, total, count } = useMemo(() => {
    const picked = SERVICES.filter((s) => selected.has(s.slug));
    const sub = picked.reduce((acc, s) => acc + s.basePrice, 0);
    const c = picked.length;
    // Tiered bundle discount
    const rate = c >= 4 ? 0.25 : c === 3 ? 0.18 : c === 2 ? 0.1 : 0;
    const disc = Math.round(sub * rate);
    return { subtotal: sub, discount: disc, total: sub - disc, count: c };
  }, [selected]);

  const onsite = SERVICES.filter((s) => s.group === "On-site");
  const online = SERVICES.filter((s) => s.group === "Online");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (count < 2) {
      toast.error("Pilih minimal 2 layanan untuk bulk booking");
      return;
    }
    const result = bulkSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    toast.success(`Bulk booking dipost — ${count} layanan`);
    navigate(`/book/onsite/${SERVICES.find((s) => selected.has(s.slug))!.slug}/posted`, {
      state: { ...form, bulk: Array.from(selected) },
    });
  };

  const ServiceTile = ({ s }: { s: Service }) => {
    const active = selected.has(s.slug);
    return (
      <button
        type="button"
        onClick={() => toggle(s.slug)}
        className={`group relative flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all ${
          active
            ? "border-amber bg-amber/10 shadow-amber"
            : "border-border/60 bg-gradient-card hover:border-amber/50"
        }`}
      >
        {active && (
          <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber flex items-center justify-center shadow-amber">
            <Check className="w-3 h-3 text-obsidian" strokeWidth={3} />
          </span>
        )}
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
            active ? "bg-gradient-golden" : "bg-amber/10 border border-amber/30"
          }`}
        >
          <s.Icon
            className={`w-7 h-7 ${active ? "text-obsidian" : "text-amber"}`}
            strokeWidth={2.2}
          />
        </div>
        <span className="text-[11px] font-medium text-foreground/90 leading-tight text-center">
          {s.name}
        </span>
        <span className="text-[10px] text-muted-foreground">
          dari {formatIDR(s.basePrice).replace("Rp", "Rp ")}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-5 lg:px-10 pt-6 pb-40 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-amber transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <div className="mt-5 flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-golden flex items-center justify-center shadow-amber shrink-0">
            <Layers className="w-6 h-6 text-obsidian" strokeWidth={2.4} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber font-semibold">
              Bulk Booking
            </span>
            <h1 className="font-display text-2xl leading-tight mt-1">
              One project, multiple talents
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Pilih beberapa layanan sekaligus dengan satu jadwal & lokasi. Hemat hingga 25%.
            </p>
          </div>
        </div>

        {/* Tier indicator */}
        <div className="mt-5 rounded-2xl border border-amber/30 bg-amber/5 p-3 flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-amber shrink-0" />
          <div className="text-[11px] text-foreground/90 leading-snug">
            <span className="font-semibold text-amber">Bundle discount:</span>{" "}
            2 layanan = 10% · 3 = 18% · 4+ = 25%
          </div>
        </div>

        {/* Selection */}
        <section className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg">Pilih layanan</h2>
            <span className="text-[11px] text-muted-foreground">
              {count} dipilih
            </span>
          </div>

          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            On-site
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {onsite.map((s) => (
              <ServiceTile key={s.slug} s={s} />
            ))}
          </div>

          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-5 mb-2">
            Online
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {online.map((s) => (
              <ServiceTile key={s.slug} s={s} />
            ))}
          </div>
        </section>

        {/* Project details */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <h2 className="font-display text-lg">Detail proyek</h2>

          <Field icon={Briefcase} label="What's the occasion?">
            <Input
              value={form.occasion}
              onChange={(e) => setForm({ ...form, occasion: e.target.value })}
              placeholder="Contoh: Wedding, brand campaign…"
              maxLength={120}
            />
          </Field>

          <Field icon={Calendar} label="When?">
            <Input
              value={form.when}
              onChange={(e) => setForm({ ...form, when: e.target.value })}
              placeholder="Tanggal & jam"
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
              placeholder="Contoh: 6 jam"
              maxLength={40}
            />
          </Field>

          <Field icon={FileText} label="Notes">
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Brief kreatif, mood board, gear, dress code…"
              maxLength={1000}
              rows={4}
            />
          </Field>
        </form>
      </main>

      {/* Sticky summary bar */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 inset-x-0 z-20 border-t border-border/60 bg-background/95 backdrop-blur-md"
      >
        <div className="max-w-5xl mx-auto px-5 lg:px-10 py-3">
          {count > 0 && (
            <div className="flex items-center justify-between text-[11px] mb-2">
              <span className="text-muted-foreground">
                Subtotal <span className="line-through">{formatIDR(subtotal)}</span>
              </span>
              <span className="text-amber font-semibold">
                − {formatIDR(discount)} bundle
              </span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {count === 0 ? "Belum ada layanan" : `${count} layanan dipilih`}
              </div>
              <div className="font-display text-xl text-foreground">
                {formatIDR(total)}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={count < 2}
              className="rounded-2xl bg-gradient-golden text-obsidian font-display text-base px-6 py-3 shadow-amber disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-all"
            >
              Post Bulk Job →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BulkBooking;
