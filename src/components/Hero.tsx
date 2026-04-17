import { motion } from "framer-motion";
import heroImg from "@/assets/hero-talent.jpg";
import { ArrowUpRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative px-5 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-border/60 shadow-deep"
      >
        <img
          src={heroImg}
          alt="Indonesian creative talent in cinematic golden hour light"
          width={1536}
          height={1536}
          className="w-full h-[460px] object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-radial-amber" />

        {/* Top badge */}
        <div className="absolute top-5 left-5 flex items-center gap-2 glass rounded-full pl-2 pr-4 py-1.5">
          <span className="w-6 h-6 rounded-full bg-gradient-golden flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-primary-foreground" />
          </span>
          <span className="text-[11px] font-medium tracking-wide">
            Indonesia's Creative Network
          </span>
        </div>

        {/* Headline */}
        <div className="absolute bottom-0 inset-x-0 p-6 pb-7">
          <h1 className="font-display text-5xl leading-[0.95] text-balance">
            Cahaya emas,
            <br />
            <span className="italic text-gradient-golden">talenta nyata.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Booking fotografer, videografer & editor terverifikasi. Tanpa lelah chat WA.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button className="group flex items-center gap-2 bg-gradient-golden text-primary-foreground font-semibold text-sm pl-5 pr-2 py-2 rounded-full shadow-amber hover:scale-[1.02] transition-transform">
              Mulai Booking
              <span className="w-7 h-7 rounded-full bg-obsidian/20 flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </button>
            <button className="text-sm font-medium text-foreground/90 px-4 py-2.5 rounded-full border border-border/70 hover:border-amber/60 transition-colors">
              Saya Talent
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
