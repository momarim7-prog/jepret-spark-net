import { Wallet, Plus, Send, FileUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const WalletCard = () => {
  return (
    <section className="px-5 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl p-6 shadow-deep border border-amber/20"
        style={{
          background:
            "radial-gradient(circle at 90% 0%, hsl(38 95% 58% / 0.35), transparent 55%), linear-gradient(135deg, hsl(24 12% 8%) 0%, hsl(24 10% 5%) 100%)",
        }}
      >
        {/* Decorative grain */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber/30 rounded-full blur-3xl" />
        </div>

        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-[0.2em]">Dompet Jepret</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">Rp</span>
              <span className="font-display text-4xl font-bold tracking-tight">
                12.450.000
              </span>
            </div>
            <div className="mt-1.5 inline-flex items-center gap-1.5 bg-amber/10 border border-amber/30 rounded-full px-2.5 py-1">
              <Sparkles className="w-3 h-3 text-amber" />
              <span className="text-[11px] font-semibold text-amber">2,840 pts</span>
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-[10px] text-muted-foreground tracking-wider">
              •••• 8821
            </div>
            <div className="mt-1 text-[10px] text-amber font-semibold">VERIFIED</div>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-3 gap-2">
          {[
            { Icon: Send, label: "Bayar Talent" },
            { Icon: Plus, label: "Top Up" },
            { Icon: FileUp, label: "Transfer File" },
          ].map(({ Icon, label }, i) => (
            <button
              key={label}
              className="group flex flex-col items-center gap-2 py-3 rounded-2xl bg-charcoal-elevated/80 border border-border/40 hover:border-amber/50 hover:bg-charcoal-elevated transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-golden flex items-center justify-center shadow-amber group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4 text-primary-foreground" strokeWidth={2.4} />
              </div>
              <span className="text-[11px] font-medium text-foreground/90">{label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default WalletCard;
