import { Search, User } from "lucide-react";
import heroImg from "@/assets/hero-talent.jpg";

const HeroSearch = () => {
  return (
    <section className="relative">
      {/* Background image */}
      <div className="relative h-[280px] md:h-[420px] lg:h-[520px] overflow-hidden">
        <img
          src={heroImg}
          alt="Indonesian creative talent in cinematic crimson light"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/20 to-background" />
        <div className="absolute inset-0 bg-gradient-radial-amber" />

        {/* Top bar: search + profile */}
        <div className="relative z-10 px-5 lg:px-10 pt-6 flex items-center gap-3 max-w-7xl mx-auto">
          <div className="flex-1 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari Fotoin, Videoin, Editor…"
              className="w-full bg-background/95 backdrop-blur-sm border border-border/50 rounded-full pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-amber/60 shadow-deep transition-all"
            />
          </div>
          <button
            aria-label="Profile"
            className="relative w-12 h-12 rounded-full bg-background/95 border border-border/50 flex items-center justify-center shadow-deep hover:border-amber/60 transition-all"
          >
            <User className="w-5 h-5 text-foreground" strokeWidth={2.2} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber animate-pulse-glow" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
