import { Search, Bell, MapPin } from "lucide-react";

const TopBar = () => {
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="px-5 pt-3 pb-3 flex items-center gap-3">
        <div className="flex flex-col leading-none">
          <span className="font-display text-2xl font-black tracking-tight text-gradient-golden">
            Jepretin
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5 flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-amber" />
            Jakarta · 20km
          </span>
        </div>

        <div className="flex-1 ml-2">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-amber transition-colors" />
            <input
              type="text"
              placeholder="Cari Fotoin, Videoin, Editor…"
              className="w-full bg-secondary/60 border border-border/50 rounded-full pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-amber/60 focus:bg-secondary transition-all"
            />
          </div>
        </div>

        <button className="relative p-2.5 rounded-full bg-secondary/60 border border-border/50 hover:border-amber/60 transition-all">
          <Bell className="w-4 h-4 text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber animate-pulse-glow" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
