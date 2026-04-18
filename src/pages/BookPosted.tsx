import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, Bell } from "lucide-react";
import TalentGrid from "@/components/TalentGrid";

const BookPosted = () => {
  const { type, slug } = useParams();
  const { state } = useLocation() as { state: { occasion?: string } | null };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-md mx-auto px-5 pt-6 pb-32 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-amber transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Beranda
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 rounded-3xl border border-amber/40 bg-gradient-card p-6 shadow-amber relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber/20 blur-3xl" />

          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
              className="w-14 h-14 rounded-2xl bg-amber/15 border border-amber/40 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="w-7 h-7 text-amber" strokeWidth={2.4} />
            </motion.div>

            <span className="text-[10px] uppercase tracking-[0.3em] text-amber font-semibold">
              Job posted
            </span>
            <h1 className="font-display text-2xl mt-2 leading-tight">
              Job is posted!
            </h1>
            <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
              All the talent in the area are notified. While you wait, discover
              high-value talent in the area!
            </p>

            {state?.occasion && (
              <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                <Bell className="w-3.5 h-3.5 text-amber" />
                <span className="truncate">
                  Listing: <span className="text-foreground/90 font-medium">{state.occasion}</span>
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <TalentGrid />
      </main>
    </div>
  );
};

export default BookPosted;
