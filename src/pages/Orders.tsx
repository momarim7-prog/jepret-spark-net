import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Camera, Video, Palette, Sparkles, Clock, MapPin, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type OrderStatus = "in_progress" | "scheduled" | "completed" | "cancelled";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  in_progress: { label: "In Progress", className: "bg-amber/20 text-amber border-amber/30" },
  scheduled: { label: "Scheduled", className: "bg-secondary text-foreground border-border" },
  completed: { label: "Completed", className: "bg-muted text-muted-foreground border-border" },
  cancelled: { label: "Cancelled", className: "bg-destructive/20 text-destructive border-destructive/30" },
};

const orders = [
  {
    id: "JPT-1042",
    service: "Fotoin",
    Icon: Camera,
    talent: "Andra Wijaya",
    occasion: "Birthday Shoot",
    when: "Today · 7:00 PM",
    where: "Senopati, Jakarta",
    price: "Rp 850.000",
    status: "in_progress" as OrderStatus,
  },
  {
    id: "JPT-1038",
    service: "Videoin",
    Icon: Video,
    talent: "Maya Lestari",
    occasion: "Wedding Reception",
    when: "Sat, 26 Apr · 4:00 PM",
    where: "Kemang, Jakarta",
    price: "Rp 3.200.000",
    status: "scheduled" as OrderStatus,
  },
  {
    id: "JPT-1029",
    service: "Editin",
    Icon: Sparkles,
    talent: "Rendy Pratama",
    occasion: "Reels Edit Pack",
    when: "Delivered · 12 Apr",
    where: "Online",
    price: "Rp 450.000",
    status: "completed" as OrderStatus,
  },
  {
    id: "JPT-1021",
    service: "Desain-in",
    Icon: Palette,
    talent: "Sinta Halim",
    occasion: "Logo & Brand Kit",
    when: "Delivered · 02 Apr",
    where: "Online",
    price: "Rp 1.100.000",
    status: "completed" as OrderStatus,
  },
  {
    id: "JPT-1015",
    service: "MakeUp-in",
    Icon: Sparkles,
    talent: "Bella Anindya",
    occasion: "Engagement Shoot",
    when: "Cancelled · 28 Mar",
    where: "PIK 2, Jakarta",
    price: "Rp 600.000",
    status: "cancelled" as OrderStatus,
  },
];

const Orders = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background relative">
      <main className="relative z-10 pb-32 max-w-6xl mx-auto px-5 lg:px-10 pt-10">
        <header className="mb-8">
          <div className="text-[10px] tracking-[0.3em] uppercase text-amber mb-2">Your Bookings</div>
          <h1 className="font-display text-4xl text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-2">Track every gig you've booked.</p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orders.map((o) => {
            const cfg = statusConfig[o.status];
            return (
              <li key={o.id}>
                <button
                  onClick={() => navigate("/")}
                  className="w-full text-left glass rounded-2xl p-4 hover:border-amber/40 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-golden flex items-center justify-center shrink-0 shadow-amber">
                      <o.Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="font-semibold text-foreground truncate">{o.occasion}</div>
                        <Badge variant="outline" className={cfg.className}>
                          {cfg.label}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {o.service} · with <span className="text-foreground/80">{o.talent}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {o.when}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {o.where}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                        <span className="font-mono text-[10px] text-muted-foreground">{o.id}</span>
                        <span className="flex items-center gap-1 text-sm font-semibold text-amber">
                          {o.price}
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </main>
      <BottomNav />
    </div>
  );
};

export default Orders;
