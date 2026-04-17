import { Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import t1 from "@/assets/talent-1.jpg";
import t2 from "@/assets/talent-2.jpg";
import t3 from "@/assets/talent-3.jpg";
import t4 from "@/assets/talent-4.jpg";

const talents = [
  { name: "Anggita R.", role: "Videografer · Cinema", rating: 4.9, jobs: 142, dist: "3.2km", img: t1 },
  { name: "Reza Mahendra", role: "Fotografer · Editorial", rating: 4.8, jobs: 89, dist: "5.1km", img: t2 },
  { name: "Bayu Pratama", role: "Sound Engineer", rating: 5.0, jobs: 67, dist: "Remote", img: t3 },
  { name: "Dimas Aditya", role: "Designer · Branding", rating: 4.9, jobs: 211, dist: "Remote", img: t4 },
];

const TalentGrid = () => {
  return (
    <section className="px-5 mt-12">
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-amber font-semibold">
            Featured Portfolio
          </span>
          <h2 className="font-display text-2xl mt-1">Talent terdekat</h2>
        </div>
        <button className="text-xs text-amber font-medium">Lihat peta →</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {talents.map((t, i) => (
          <motion.button
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card text-left hover:border-amber/50 transition-all"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={t.img}
                alt={`${t.name} — ${t.role}`}
                width={768}
                height={1024}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />

              {/* Rating badge */}
              <div className="absolute top-2.5 right-2.5 glass rounded-full px-2 py-1 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber text-amber" />
                <span className="text-[11px] font-bold">{t.rating}</span>
              </div>

              {/* Distance badge */}
              <div className="absolute top-2.5 left-2.5 bg-obsidian/70 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1 border border-border/40">
                <MapPin className="w-2.5 h-2.5 text-amber" />
                <span className="text-[10px] font-medium">{t.dist}</span>
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-0 inset-x-0 p-3">
                <h3 className="font-semibold text-sm leading-tight">{t.name}</h3>
                <p className="text-[10.5px] text-muted-foreground mt-0.5">{t.role}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-foreground/60">{t.jobs} projects</span>
                  <span className="text-[10px] font-bold text-amber tracking-wider">BOOK →</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default TalentGrid;
