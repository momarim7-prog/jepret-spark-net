import { Check, Zap, Crown, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Hemat",
    Icon: Leaf,
    price: "750K",
    desc: "Talent verified, fast turnaround",
    perks: ["1 Talent", "2 jam sesi", "20 foto edit"],
    popular: false,
  },
  {
    name: "Comfort",
    Icon: Zap,
    price: "1.8jt",
    desc: "Best for brands & UMKM",
    perks: ["1 Talent senior", "4 jam sesi", "60 foto + 1 reel", "Color grade pro"],
    popular: true,
  },
  {
    name: "Prioritas",
    Icon: Crown,
    price: "4.5jt",
    desc: "Full crew, cinematic delivery",
    perks: ["Crew lengkap", "Full day", "Unlimited deliverables", "Editor dedicated"],
    popular: false,
  },
];

const ServiceTiers = () => {
  return (
    <section className="px-5 mt-10">
      <div className="mb-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-amber font-semibold">
          Paket Booking
        </span>
        <h2 className="font-display text-3xl mt-1.5 leading-tight">
          Tiga tier, <span className="italic text-gradient-golden">satu visi.</span>
        </h2>
      </div>

      <div className="space-y-3">
        {tiers.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className={cn(
              "relative overflow-hidden rounded-2xl p-5 border transition-all",
              t.popular
                ? "border-amber/60 bg-gradient-card ring-amber-glow"
                : "border-border/60 bg-card hover:border-amber/40"
            )}
          >
            {t.popular && (
              <div className="absolute top-0 right-0 bg-gradient-golden text-primary-foreground text-[10px] font-bold tracking-wider px-3 py-1 rounded-bl-xl">
                POPULAR
              </div>
            )}

            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                  t.popular ? "bg-gradient-golden shadow-amber" : "bg-secondary border border-border"
                )}
              >
                <t.Icon
                  className={cn("w-5 h-5", t.popular ? "text-primary-foreground" : "text-amber")}
                  strokeWidth={2.2}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-semibold">{t.name}</h3>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Rp</span>
                    <span className="font-display text-2xl font-bold text-gradient-golden">
                      {t.price}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>

                <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-center gap-1.5 text-[11px] text-foreground/85">
                      <Check className="w-3 h-3 text-amber flex-shrink-0" strokeWidth={3} />
                      <span className="truncate">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tax compliance note */}
      <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary/40 border border-border/40">
        <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Otomatis termasuk <span className="text-amber font-semibold">PPh 23 (2%)</span> & komisi
          platform <span className="text-amber font-semibold">10–15%</span> sesuai regulasi.
        </p>
      </div>
    </section>
  );
};

export default ServiceTiers;
