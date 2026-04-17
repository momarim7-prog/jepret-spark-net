import { Camera, Video, Mic, Palette, Scissors, MapPin, Wifi } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { name: "Fotoin", Icon: Camera, type: "On-site", radius: "20km", color: "from-amber-glow to-amber" },
  { name: "Videoin", Icon: Video, type: "On-site", radius: "20km", color: "from-amber to-amber-deep" },
  { name: "Suarain", Icon: Mic, type: "On-site", radius: "20km", color: "from-amber-glow to-amber-deep" },
  { name: "Desainin", Icon: Palette, type: "Remote", radius: "Anywhere", color: "from-amber to-amber-glow" },
  { name: "Editin", Icon: Scissors, type: "Remote", radius: "Anywhere", color: "from-amber-deep to-amber" },
];

const ServiceCategories = () => {
  return (
    <section className="px-5 mt-10">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl">Layanan</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Pilih kebutuhan kreatifmu</p>
        </div>
        <button className="text-xs text-amber font-medium">Semua →</button>
      </div>

      <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c, i) => (
          <motion.button
            key={c.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="group flex-shrink-0 w-[140px] bg-gradient-card border border-border/60 rounded-2xl p-4 text-left hover:border-amber/50 transition-all"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3 shadow-amber group-hover:scale-110 transition-transform`}>
              <c.Icon className="w-5 h-5 text-primary-foreground" strokeWidth={2.2} />
            </div>
            <h3 className="font-semibold text-sm">{c.name}</h3>
            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground">
              {c.type === "On-site" ? (
                <MapPin className="w-3 h-3 text-amber" />
              ) : (
                <Wifi className="w-3 h-3 text-amber" />
              )}
              <span>{c.radius}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default ServiceCategories;
