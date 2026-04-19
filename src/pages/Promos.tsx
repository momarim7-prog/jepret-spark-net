import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Copy, Sparkles, Gift, Zap, Crown, Camera } from "lucide-react";
import { toast } from "sonner";

const featured = {
  code: "JEPRET50",
  title: "50% off your first on-site shoot",
  subtitle: "Up to Rp 250.000 · Valid for new users",
  expires: "30 Apr 2026",
};

const promos = [
  {
    code: "VIDEO20",
    Icon: Zap,
    title: "20% off Videoin bookings",
    desc: "Min. spend Rp 1.000.000",
    expires: "Ends 25 Apr",
    tag: "On-site",
  },
  {
    code: "EDITPACK",
    Icon: Sparkles,
    title: "Buy 2 Editin gigs, get 1 free",
    desc: "Applies to gigs under Rp 500K",
    expires: "Ends 30 Apr",
    tag: "Online",
  },
  {
    code: "WEEKEND",
    Icon: Camera,
    title: "Rp 100K off weekend Fotoin",
    desc: "Sat & Sun bookings only",
    expires: "Ends 28 Apr",
    tag: "On-site",
  },
  {
    code: "CROWN",
    Icon: Crown,
    title: "Free upgrade to Level 3 talent",
    desc: "On bookings above Rp 2.000.000",
    expires: "Ends 15 May",
    tag: "Premium",
  },
  {
    code: "FRIEND",
    Icon: Gift,
    title: "Refer a friend, get Rp 75K credit",
    desc: "Both you and your friend earn",
    expires: "No expiry",
    tag: "Referral",
  },
];

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
  toast.success(`Code ${code} copied!`);
};

const Promos = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <main className="relative z-10 pb-32 max-w-md mx-auto px-5 pt-10">
        <header className="mb-6">
          <div className="text-[10px] tracking-[0.3em] uppercase text-amber mb-2">Save More</div>
          <h1 className="font-display text-4xl text-foreground">Promos</h1>
          <p className="text-sm text-muted-foreground mt-2">Hand-picked offers for the creative crowd.</p>
        </header>

        {/* Featured promo */}
        <div className="relative overflow-hidden rounded-3xl p-6 mb-8 bg-gradient-golden shadow-amber">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-glow/30 blur-3xl" />
          <div className="relative">
            <Badge className="bg-background/20 text-primary-foreground border-0 backdrop-blur-sm mb-3">
              ✨ Featured
            </Badge>
            <h2 className="font-display text-2xl text-primary-foreground leading-tight mb-1">{featured.title}</h2>
            <p className="text-xs text-primary-foreground/80 mb-5">{featured.subtitle}</p>
            <button
              onClick={() => copyCode(featured.code)}
              className="w-full flex items-center justify-between bg-background/15 hover:bg-background/25 transition-colors backdrop-blur-md rounded-xl px-4 py-3 border border-background/20"
            >
              <div className="flex flex-col items-start">
                <span className="text-[9px] tracking-[0.2em] uppercase text-primary-foreground/70">Code</span>
                <span className="font-mono text-lg font-bold text-primary-foreground">{featured.code}</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground">
                <Copy className="w-4 h-4" />
                <span className="text-xs font-semibold">Copy</span>
              </div>
            </button>
            <div className="text-[10px] text-primary-foreground/70 mt-3 text-right">Expires {featured.expires}</div>
          </div>
        </div>

        <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">All Promos</h3>
        <ul className="space-y-3">
          {promos.map((p) => (
            <li key={p.code} className="glass rounded-2xl p-4 flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                <p.Icon className="w-5 h-5 text-amber" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="font-semibold text-foreground text-sm truncate">{p.title}</div>
                  <Badge variant="outline" className="text-[9px] shrink-0 border-amber/30 text-amber">
                    {p.tag}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{p.desc}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground">{p.expires}</span>
                  <button
                    onClick={() => copyCode(p.code)}
                    className="flex items-center gap-1.5 bg-secondary hover:bg-secondary/70 transition-colors rounded-lg px-3 py-1.5 border border-dashed border-amber/40"
                  >
                    <span className="font-mono text-xs font-bold text-amber">{p.code}</span>
                    <Copy className="w-3 h-3 text-amber" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav />
    </div>
  );
};

export default Promos;
