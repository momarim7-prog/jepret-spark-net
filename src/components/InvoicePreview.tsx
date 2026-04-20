import { Receipt, TrendingDown, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const InvoicePreview = () => {
  return (
    <section className="px-5 lg:px-10 mt-12 max-w-3xl lg:mx-auto">
      <div className="mb-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-amber font-semibold">
          Invoicing Otomatis
        </span>
        <h2 className="font-display text-2xl mt-1">
          Pajak & komisi, <span className="italic text-gradient-golden">beres.</span>
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="rounded-2xl border border-border/60 bg-gradient-card overflow-hidden shadow-deep"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-golden flex items-center justify-center">
              <Receipt className="w-4 h-4 text-primary-foreground" strokeWidth={2.4} />
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-wider">
                INV-2025-0421
              </div>
              <div className="text-sm font-semibold">Brand Campaign · Comfort</div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber bg-amber/10 border border-amber/30 px-2 py-1 rounded-full">
            PAID
          </span>
        </div>

        <div className="px-5 py-4 space-y-2.5">
          {[
            { label: "Subtotal", value: "Rp 1.800.000", muted: false },
            { label: "Komisi platform (12%)", value: "− Rp 216.000", muted: true, icon: TrendingDown },
            { label: "PPh 23 (2%)", value: "− Rp 36.000", muted: true, icon: ShieldCheck },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {row.icon && <row.icon className="w-3 h-3 text-amber" />}
                <span>{row.label}</span>
              </div>
              <span
                className={
                  row.muted
                    ? "font-mono text-foreground/70"
                    : "font-mono text-foreground"
                }
              >
                {row.value}
              </span>
            </div>
          ))}
          <div className="h-px bg-border/60 my-2" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Diterima Talent
            </span>
            <span className="font-display text-2xl font-bold text-gradient-golden">
              Rp 1.548.000
            </span>
          </div>
        </div>

        <div className="bg-secondary/40 px-5 py-3 border-t border-border/40 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-amber" />
          <p className="text-[11px] text-muted-foreground">
            Compliant DJP · Bukti potong otomatis terkirim
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default InvoicePreview;
