import {
  Camera,
  Video,
  Scissors,
  Palette,
  Box,
  Brush,
  Shirt,
  Clapperboard,
  Mic,
  Lightbulb,
  HandHelping,
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { name: "Fotoin", Icon: Camera },
  { name: "Videoin", Icon: Video },
  { name: "Editin", Icon: Scissors },
  { name: "Desain-in", Icon: Palette },
  { name: "3Din", Icon: Box },
  { name: "Make-up-in", Icon: Brush },
  { name: "Style-in", Icon: Shirt },
  { name: "Sutradarain", Icon: Clapperboard },
  { name: "Suarain", Icon: Mic },
  { name: "Terangin", Icon: Lightbulb },
  { name: "Bantuin", Icon: HandHelping },
];

const ServiceCategories = () => {
  return (
    <section className="px-5 mt-6">
      <div className="mb-4">
        <h2 className="font-display text-2xl">Layanan Jepret</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pilih kebutuhan kreatifmu
        </p>
      </div>

      <div className="grid grid-cols-4 gap-x-3 gap-y-5">
        {categories.map((c, i) => (
          <motion.button
            key={c.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.4 }}
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-card border border-border/60 flex items-center justify-center shadow-soft group-hover:border-amber/60 group-hover:shadow-amber transition-all">
              <c.Icon className="w-6 h-6 text-amber" strokeWidth={2.2} />
            </div>
            <span className="text-[11px] font-medium text-foreground/90 text-center leading-tight">
              {c.name}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default ServiceCategories;
