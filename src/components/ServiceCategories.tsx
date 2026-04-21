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
  MapPin,
  Wifi,
  Layers,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const onsiteCategories = [
  { name: "Fotoin\n", Icon: Camera, slug: "fotoin" },
  { name: "Videoin", Icon: Video, slug: "videoin" },
  { name: "Make-up-in", Icon: Brush, slug: "makeupin" },
  { name: "Style-in", Icon: Shirt, slug: "stylein" },
  { name: "Sutradarain", Icon: Clapperboard, slug: "sutradarain" },
  { name: "Suarain", Icon: Mic, slug: "suarain" },
  { name: "Terangin", Icon: Lightbulb, slug: "terangin" },
  { name: "Bantuin", Icon: HandHelping, slug: "bantuin" },
];

const onlineCategories = [
  { name: "Editin", Icon: Scissors, slug: "editin" },
  { name: "Desain-in", Icon: Palette, slug: "desainin" },
  { name: "3Din", Icon: Box, slug: "3din" },
];

const CategoryGrid = ({
  items,
  startDelay = 0,
  type,
}: {
  items: { name: string; Icon: typeof Camera; slug: string }[];
  startDelay?: number;
  type: "onsite" | "online";
}) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-3 gap-y-5">
      {items.map((c, i) => (
        <motion.button
          key={c.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: startDelay + i * 0.03, duration: 0.4 }}
          onClick={() =>
            navigate(
              type === "online"
                ? `/online/${c.slug}`
                : `/book/${type}/${c.slug}`
            )
          }
          className="group flex flex-col items-center gap-2"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-card border border-border/60 flex items-center justify-center shadow-soft group-hover:border-amber/60 group-hover:shadow-amber transition-all">
            <c.Icon className="w-9 h-9 text-amber" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-medium text-foreground/90 text-center leading-tight">
            {c.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

const ServiceCategories = () => {
  const navigate = useNavigate();
  return (
    <section className="px-5 lg:px-10 mt-6">
      <div className="mb-4">
        <h2 className="font-display text-2xl">Layanan Jepret</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pilih kebutuhan kreatifmu
        </p>
      </div>

      {/* On-site */}
      <div className="mb-2 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-amber/10 border border-amber/30 flex items-center justify-center">
          <MapPin className="w-3.5 h-3.5 text-amber" strokeWidth={2.4} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-tight">
            On-site
          </h3>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Talenta hadir di lokasi kamu
          </p>
        </div>
      </div>
      <div className="mb-6">
        <CategoryGrid items={onsiteCategories} type="onsite" />
      </div>

      {/* Online */}
      <div className="mb-2 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-amber/10 border border-amber/30 flex items-center justify-center">
          <Wifi className="w-3.5 h-3.5 text-amber" strokeWidth={2.4} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-tight">
            Online
          </h3>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Dikerjakan jarak jauh, hasil dikirim digital
          </p>
        </div>
      </div>
      <CategoryGrid items={onlineCategories} startDelay={0.24} type="online" />

      {/* Bulk Booking CTA */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        onClick={() => navigate("/bulk-booking")}
        className="group relative w-full mt-6 overflow-hidden rounded-2xl border border-amber/40 bg-gradient-card p-4 flex items-center gap-4 shadow-soft hover:shadow-amber hover:border-amber transition-all"
      >
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-amber/15 blur-3xl group-hover:bg-amber/25 transition-colors" />
        <div className="relative w-12 h-12 rounded-xl bg-gradient-golden flex items-center justify-center shadow-amber shrink-0">
          <Layers className="w-5 h-5 text-primary-foreground" strokeWidth={2.4} />
        </div>
        <div className="relative flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[9px] tracking-[0.2em] uppercase text-amber font-semibold">New</span>
            <span className="text-[9px] text-muted-foreground">·</span>
            <span className="text-[10px] text-muted-foreground">Save up to 25%</span>
          </div>
          <h3 className="font-semibold text-foreground text-sm leading-tight mt-0.5">
            Bulk Booking
          </h3>
          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
            Book multiple services for one project
          </p>
        </div>
        <ArrowRight className="relative w-4 h-4 text-amber group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </section>
  );
};

export default ServiceCategories;
