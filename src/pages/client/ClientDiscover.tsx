import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import ClientLayout from "@/components/client/ClientLayout";
import { SERVICE_CATEGORIES } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Fix Leaflet default icon paths under Vite
const icon = L.divIcon({
  className: "",
  html: `<div style="
    width:30px;height:30px;border-radius:50% 50% 50% 0;
    background:linear-gradient(135deg,hsl(45,93%,58%),hsl(38,92%,50%));
    transform:rotate(-45deg);
    box-shadow:0 4px 12px rgba(245,158,11,.4);
    display:flex;align-items:center;justify-content:center;
    border:2px solid white;
  "><span style="transform:rotate(45deg);color:white;font-weight:700;font-size:14px;">📷</span></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

type Freelancer = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  skills: string[] | null;
  // pseudo-random coords for demo (no lat/lng on profiles yet)
  lat: number;
  lng: number;
};

const RecenterOnFly = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const ClientDiscover = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("all");
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);

  // Default Jakarta
  const center = useMemo<[number, number]>(() => [-6.2, 106.8166], []);

  useEffect(() => {
    (async () => {
      // Get freelancers via user_roles
      const { data: roleRows } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "freelancer");
      const ids = (roleRows ?? []).map((r) => r.user_id);
      if (!ids.length) return setFreelancers([]);

      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, city, skills")
        .in("id", ids);

      // Distribute around Jakarta deterministically using hash of id
      const list: Freelancer[] = (profs ?? []).map((p) => {
        const seed = p.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const dLat = ((seed % 100) - 50) / 1500;
        const dLng = (((seed * 7) % 100) - 50) / 1500;
        return {
          ...p,
          lat: center[0] + dLat,
          lng: center[1] + dLng,
        };
      });
      setFreelancers(list);
    })();
  }, [center]);

  const filtered = useMemo(() => {
    if (category === "all") return freelancers;
    const label = SERVICE_CATEGORIES.find((c) => c.value === category)?.label.toLowerCase();
    return freelancers.filter((f) =>
      (f.skills ?? []).some((s) => s.toLowerCase().includes(label ?? "")),
    );
  }, [freelancers, category]);

  return (
    <ClientLayout>
      <div className="px-5 lg:px-10 pt-8 max-w-5xl mx-auto">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Discover</p>
        <h1 className="font-display text-3xl mb-4">Freelancer di sekitar</h1>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 lg:mx-0 lg:px-0 mb-4">
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-colors",
              category === "all"
                ? "bg-gradient-golden text-primary-foreground border-transparent shadow-amber"
                : "bg-card border-border/50 text-muted-foreground hover:text-foreground",
            )}
          >
            Semua
          </button>
          {SERVICE_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-colors",
                category === c.value
                  ? "bg-gradient-golden text-primary-foreground border-transparent shadow-amber"
                  : "bg-card border-border/50 text-muted-foreground hover:text-foreground",
              )}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden border border-border/50 h-[60vh] min-h-[400px]">
          <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
            <RecenterOnFly center={center} />
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((f) => (
              <Marker key={f.id} position={[f.lat, f.lng]} icon={icon}>
                <Popup>
                  <div className="space-y-1.5 min-w-[160px]">
                    <p className="font-semibold text-sm">{f.full_name ?? "Freelancer"}</p>
                    {f.skills?.length && (
                      <p className="text-xs text-muted-foreground">{f.skills.slice(0, 2).join(" · ")}</p>
                    )}
                    {f.city && <p className="text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> {f.city}</p>}
                    <Button size="sm" className="w-full mt-1" onClick={() => navigate(`/talent/${f.id}`)}>
                      Lihat profil
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Belum ada freelancer pada kategori ini.
          </p>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientDiscover;
