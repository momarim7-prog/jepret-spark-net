import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, CalendarClock } from "lucide-react";

const SERVICE_LABELS: Record<string, string> = {
  fotoin: "Fotoin",
  videoin: "Videoin",
  makeupin: "Make-up-in",
  stylein: "Style-in",
  sutradarain: "Sutradarain",
  suarain: "Suarain",
  terangin: "Terangin",
  bantuin: "Bantuin",
  editin: "Editin",
  desainin: "Desain-in",
  "3din": "3Din",
};

const BookTiming = () => {
  const { type, slug } = useParams();
  const navigate = useNavigate();
  const label = (slug && SERVICE_LABELS[slug]) || "Layanan";

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-5 lg:px-10 pt-6 pb-24 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-amber transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <div className="mt-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber font-semibold">
            {type === "onsite" ? "On-site" : "Online"} · {label}
          </span>
          <h1 className="font-display text-3xl mt-3 leading-tight">
            When do you need this service?
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Pilih waktu pemesanan yang paling pas untukmu.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onClick={() => navigate(`/book/${type}/${slug}/now`)}
            className="w-full group relative overflow-hidden rounded-2xl border border-amber/40 bg-gradient-golden p-5 text-left shadow-amber"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-obsidian/30 flex items-center justify-center border border-obsidian/20">
                <Zap className="w-6 h-6 text-obsidian" strokeWidth={2.4} fill="currentColor" />
              </div>
              <div className="flex-1">
                <div className="font-display text-xl text-obsidian">Book NOW</div>
                <div className="text-[11px] text-obsidian/80 font-medium">
                  Talent siap hadir hari ini juga
                </div>
              </div>
              <span className="text-obsidian text-xl">→</span>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            onClick={() => navigate(`/book/${type}/${slug}/later`)}
            className="w-full group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card p-5 text-left shadow-soft hover:border-amber/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber/10 border border-amber/30 flex items-center justify-center">
                <CalendarClock className="w-6 h-6 text-amber" strokeWidth={2.2} />
              </div>
              <div className="flex-1">
                <div className="font-display text-xl">Book for later</div>
                <div className="text-[11px] text-muted-foreground">
                  Jadwalkan untuk tanggal & jam tertentu
                </div>
              </div>
              <span className="text-amber text-xl">→</span>
            </div>
          </motion.button>
        </div>
      </main>
    </div>
  );
};

export default BookTiming;
