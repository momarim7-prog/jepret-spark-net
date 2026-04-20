import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, Camera, Zap, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import hero from "@/assets/talent-1.jpg";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

const talent = {
  name: "Andra Wijaya",
  role: "Fotoin",
  level: 3,
  location: "Senopati, Jakarta",
  rating: 4.9,
  jobs: 142,
  response: "~8 min",
  bio: "Fotografer berbasis di Jakarta dengan spesialisasi wedding, portrait, dan editorial. Sudah bekerja sama dengan 100+ klien sejak 2019.",
  specialties: ["Wedding", "Portrait", "Editorial", "Outdoor"],
  startPrice: "850.000",
};

const tiers = [
  {
    name: "Basic",
    price: "850K",
    duration: "1 jam",
    perks: ["15 foto edit", "1 lokasi", "Delivery 3 hari"],
  },
  {
    name: "Standard",
    price: "1.8jt",
    duration: "3 jam",
    perks: ["50 foto edit", "2 lokasi", "Delivery 2 hari", "1 reel bonus"],
    popular: true,
  },
  {
    name: "Premium",
    price: "3.5jt",
    duration: "Full day",
    perks: ["Unlimited foto", "Multi lokasi", "Same-day preview"],
  },
];

const portfolio = [p1, p2, p3, p4, p5, p6];

const reviews = [
  {
    name: "Sarah Putri",
    avatar: "https://i.pravatar.cc/100?img=47",
    rating: 5,
    date: "2 minggu lalu",
    text: "Hasil fotonya keren banget! Andra sangat profesional dan punya banyak ide kreatif untuk wedding kami.",
  },
  {
    name: "Rizki Hakim",
    avatar: "https://i.pravatar.cc/100?img=12",
    rating: 5,
    date: "1 bulan lalu",
    text: "Editorial shoot untuk brand kami selesai tepat waktu. Color grading-nya cinematic, recommended!",
  },
  {
    name: "Dewi Anjani",
    avatar: "https://i.pravatar.cc/100?img=32",
    rating: 4,
    date: "2 bulan lalu",
    text: "Portrait session yang seru, suasananya nyaman. Akan booking lagi untuk project berikutnya.",
  },
];

const TalentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState(1);

  return (
    <div className="min-h-screen bg-background pb-32 relative">
      <div className="max-w-md mx-auto relative">
        {/* Hero */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img src={hero} alt={talent.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

          <Link
            to="/"
            className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="absolute bottom-0 inset-x-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-amber font-bold px-2 py-1 rounded-full border border-amber/40 bg-obsidian/50">
                {talent.role} · Level {talent.level}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-foreground/80">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber" />
                </span>
                Online
              </span>
            </div>
            <h1 className="font-display text-3xl font-semibold leading-tight">{talent.name}</h1>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-amber" />
              <span>{talent.location}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <section className="px-5 -mt-6 relative z-10">
          <div className="grid grid-cols-3 gap-2">
            {[
              { Icon: Star, label: "Rating", value: talent.rating, fill: true },
              { Icon: Camera, label: "Jobs", value: talent.jobs },
              { Icon: Zap, label: "Respon", value: talent.response },
            ].map((s) => (
              <div
                key={s.label}
                className="glass rounded-2xl border border-border/60 p-3 flex flex-col items-center text-center"
              >
                <s.Icon
                  className={cn("w-4 h-4 text-amber mb-1", s.fill && "fill-amber")}
                />
                <span className="font-display text-base font-semibold">{s.value}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="px-5 mt-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-amber font-semibold">
            About
          </span>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{talent.bio}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {talent.specialties.map((s) => (
              <span
                key={s}
                className="text-[11px] px-2.5 py-1 rounded-full border border-amber/40 text-amber/90 bg-amber/5"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Tiers */}
        <section className="px-5 mt-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-amber font-semibold">
            Pilih Paket
          </span>
          <h2 className="font-display text-2xl mt-1">Service tiers</h2>

          <div className="space-y-3 mt-4">
            {tiers.map((t, i) => (
              <motion.button
                key={t.name}
                onClick={() => setSelectedTier(i)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "w-full text-left rounded-2xl p-4 border transition-all",
                  selectedTier === i
                    ? "border-amber/60 shadow-amber bg-gradient-card"
                    : "border-border/60 bg-card hover:border-amber/40"
                )}
              >
                <div className="flex items-baseline justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{t.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{t.duration}</p>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Rp</span>
                    <span className="font-display text-xl font-bold text-gradient-golden">
                      {t.price}
                    </span>
                  </div>
                </div>
                <ul className="mt-3 grid grid-cols-1 gap-1">
                  {t.perks.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-1.5 text-[11px] text-foreground/85"
                    >
                      <Check className="w-3 h-3 text-amber flex-shrink-0" strokeWidth={3} />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Portfolio */}
        <section className="px-5 mt-8">
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-amber font-semibold">
                Portfolio
              </span>
              <h2 className="font-display text-2xl mt-1">Recent work</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {portfolio.map((src, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden aspect-square border border-border/60 group"
              >
                <img
                  src={src}
                  alt={`Portfolio ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <button className="mt-3 w-full text-xs text-amber font-medium py-2">
            View all →
          </button>
        </section>

        {/* Reviews */}
        <section className="px-5 mt-8">
          <h2 className="font-display text-2xl mb-3">What clients say</h2>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.name} className="glass rounded-2xl p-4 border border-border/60">
                <div className="flex items-center gap-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber/30"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold">{r.name}</h4>
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < r.rating ? "fill-amber text-amber" : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{r.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-foreground/85 mt-2.5 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-20 inset-x-0 z-40 px-4">
        <div className="max-w-md mx-auto glass rounded-2xl border border-border/60 p-3 flex items-center gap-3 shadow-deep">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">From</p>
            <p className="font-display text-lg font-bold text-gradient-golden leading-tight">
              Rp {talent.startPrice}
            </p>
          </div>
          <button
            onClick={() => navigate("/book/onsite/fotoin")}
            className="flex-1 bg-gradient-golden text-primary-foreground font-bold text-sm py-3 px-4 rounded-xl shadow-amber"
          >
            Book {talent.name.split(" ")[0]}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default TalentProfile;
