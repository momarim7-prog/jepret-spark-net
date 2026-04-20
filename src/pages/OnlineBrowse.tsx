import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Heart, Video } from "lucide-react";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";
import a1 from "@/assets/talent-1.jpg";
import a2 from "@/assets/talent-2.jpg";
import a3 from "@/assets/talent-3.jpg";
import a4 from "@/assets/talent-4.jpg";

const SERVICE_LABELS: Record<string, string> = {
  editin: "Editin",
  desainin: "Desain-in",
  "3din": "3Din",
};

type Level = 1 | 2 | 3;

interface Gig {
  cover: string;
  avatar: string;
  name: string;
  level: Level;
  isAd?: boolean;
  description: string;
  rating: number;
  reviews: string;
  startingFrom: string;
  videoConsult?: boolean;
}

const GIGS_BY_SLUG: Record<string, Gig[]> = {
  editin: [
    { cover: p1, avatar: a2, name: "Hamza R.", level: 2, isAd: true, description: "Saya akan edit video apapun dengan gaya cinematic dan cepat", rating: 4.7, reviews: "117", startingFrom: "Rp 150rb", videoConsult: true },
    { cover: p4, avatar: a3, name: "Zohaib Talib", level: 2, description: "Saya akan jadi cinematic video editor profesional Anda", rating: 4.9, reviews: "205", startingFrom: "Rp 200rb", videoConsult: true },
    { cover: p1, avatar: a1, name: "Muhammad W.", level: 1, description: "Edit reels Instagram dan TikTok yang viral dan engaging", rating: 4.8, reviews: "24", startingFrom: "Rp 90rb" },
    { cover: p4, avatar: a4, name: "Fawad S.", level: 3, description: "Long-form YouTube edit dengan motion graphics premium", rating: 4.9, reviews: "1k+", startingFrom: "Rp 450rb", videoConsult: true },
  ],
  desainin: [
    { cover: p2, avatar: a4, name: "Fouzia S.", level: 1, isAd: true, description: "Desain flyer, poster, banner, dan social media custom", rating: 4.9, reviews: "52", startingFrom: "Rp 75rb" },
    { cover: p5, avatar: a1, name: "Mizan A.", level: 2, description: "Custom graphic design & redesign kebutuhan brand Anda", rating: 5.0, reviews: "282", startingFrom: "Rp 220rb" },
    { cover: p2, avatar: a3, name: "Mustaaqeem", level: 2, description: "Saya akan jadi graphic designer profesional untuk web atau print", rating: 4.9, reviews: "1k+", startingFrom: "Rp 220rb", videoConsult: true },
    { cover: p5, avatar: a2, name: "Yasas R.", level: 2, description: "Desain Instagram post, story, dan template carousel", rating: 4.9, reviews: "1k+", startingFrom: "Rp 220rb" },
  ],
  "3din": [
    { cover: p3, avatar: a3, name: "Reza M.", level: 2, isAd: true, description: "3D product render fotorealistik untuk e-commerce dan iklan", rating: 4.8, reviews: "189", startingFrom: "Rp 350rb", videoConsult: true },
    { cover: p6, avatar: a1, name: "Bayu P.", level: 3, description: "3D animation explainer dan motion graphics premium", rating: 5.0, reviews: "412", startingFrom: "Rp 1.2jt", videoConsult: true },
    { cover: p3, avatar: a4, name: "Dimas A.", level: 1, description: "Modelling 3D produk siap render untuk katalog Anda", rating: 4.7, reviews: "63", startingFrom: "Rp 280rb" },
    { cover: p6, avatar: a2, name: "Anggita R.", level: 2, description: "3D karakter dan environment untuk game & animasi pendek", rating: 4.9, reviews: "311", startingFrom: "Rp 850rb" },
  ],
};

const LevelBadge = ({ level }: { level: Level }) => (
  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-foreground/80">
    Level {level}
    <span className="flex gap-0.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={`inline-block w-1.5 h-1.5 rotate-45 ${
            i < level ? "bg-amber" : "bg-muted-foreground/30"
          }`}
        />
      ))}
    </span>
  </span>
);

const GigCard = ({ gig, index }: { gig: Gig; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="group rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-amber/50 transition-all"
  >
    <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
      <img
        src={gig.cover}
        alt={`${gig.name} — ${gig.description}`}
        width={1024}
        height={640}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <button
        aria-label="Save to favorites"
        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-amber/20 transition-colors"
      >
        <Heart className="w-4 h-4 text-foreground" strokeWidth={2.2} />
      </button>
    </div>

    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={gig.avatar}
            alt={gig.name}
            width={28}
            height={28}
            loading="lazy"
            className="w-7 h-7 rounded-full object-cover border border-border/60 flex-shrink-0"
          />
          <span className="text-xs font-semibold truncate">{gig.name}</span>
          {gig.isAd && (
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
              Ad
            </span>
          )}
        </div>
        <LevelBadge level={gig.level} />
      </div>

      <p className="text-[12px] leading-snug text-foreground/85 line-clamp-2 min-h-[32px]">
        {gig.description}
      </p>

      <div className="flex items-center gap-1 text-[11px]">
        <Star className="w-3 h-3 fill-amber text-amber" />
        <span className="font-bold">{gig.rating}</span>
        <span className="text-muted-foreground">({gig.reviews})</span>
      </div>

      <div className="pt-1 border-t border-border/50 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Mulai dari
          </div>
          <div className="text-sm font-bold text-amber">{gig.startingFrom}</div>
        </div>
        {gig.videoConsult && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Video className="w-3 h-3" />
            <span>Video call</span>
          </div>
        )}
      </div>
    </div>
  </motion.article>
);

const OnlineBrowse = () => {
  const { slug } = useParams();
  const label = (slug && SERVICE_LABELS[slug]) || "Layanan";
  const gigs = (slug && GIGS_BY_SLUG[slug]) || [];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-5 lg:px-10 pt-6 pb-32 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-amber transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Beranda
        </Link>

        <header className="mt-5">
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber font-semibold">
            Online · {label}
          </span>
          <h1 className="font-display text-3xl mt-2 leading-tight">
            Pilih freelancer terbaikmu
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Jelajahi portofolio. Bandingkan rating, level, dan harga.
          </p>
        </header>

        <section className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
          {gigs.map((g, i) => (
            <GigCard key={`${g.name}-${i}`} gig={g} index={i} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default OnlineBrowse;
