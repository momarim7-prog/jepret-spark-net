import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, KeyRound } from "lucide-react";

// Mock talents (offset around user location)
const TALENT_OFFSETS = [
  { name: "Anggita R.", dx: 0.008, dy: 0.005 },
  { name: "Reza M.", dx: -0.011, dy: 0.003 },
  { name: "Bayu P.", dx: 0.004, dy: -0.009 },
  { name: "Dimas A.", dx: -0.006, dy: -0.012 },
  { name: "Sarah W.", dx: 0.013, dy: -0.004 },
];

const TalentMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState<string>(
    () => localStorage.getItem("mapbox_token") || ""
  );
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    if (!token || !mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const initMap = (lng: number, lat: number) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [lng, lat],
        zoom: 13,
        attributionControl: false,
      });
      mapRef.current = map;

      map.on("load", () => {
        // User marker
        const userEl = document.createElement("div");
        userEl.className =
          "w-5 h-5 rounded-full bg-amber border-2 border-background shadow-amber animate-pulse-glow";
        new mapboxgl.Marker({ element: userEl })
          .setLngLat([lng, lat])
          .addTo(map);

        // Talent markers
        TALENT_OFFSETS.forEach((t) => {
          const el = document.createElement("div");
          el.className =
            "w-8 h-8 rounded-full bg-card border-2 border-amber/70 flex items-center justify-center text-[10px] font-bold text-amber shadow-soft";
          el.textContent = t.name.charAt(0);
          new mapboxgl.Marker({ element: el })
            .setLngLat([lng + t.dx, lat + t.dy])
            .setPopup(
              new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
                `<div style="font-family: 'Talina', sans-serif; padding: 4px 6px; color: #111;"><strong>${t.name}</strong><br/><span style="font-size:10px;opacity:.7">Available now</span></div>`
              )
            )
            .addTo(map);
        });
      });
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => initMap(pos.coords.longitude, pos.coords.latitude),
        () => initMap(106.8456, -6.2088), // Jakarta fallback
        { timeout: 5000 }
      );
    } else {
      initMap(106.8456, -6.2088);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token]);

  const saveToken = () => {
    if (!tokenInput.trim()) return;
    localStorage.setItem("mapbox_token", tokenInput.trim());
    setToken(tokenInput.trim());
  };

  if (!token) {
    return (
      <div className="w-full h-[260px] rounded-2xl border border-border/60 bg-gradient-card flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="w-10 h-10 rounded-full bg-amber/10 border border-amber/30 flex items-center justify-center">
          <KeyRound className="w-4 h-4 text-amber" />
        </div>
        <div>
          <div className="text-sm font-semibold">Masukkan Mapbox token</div>
          <p className="text-[10.5px] text-muted-foreground mt-1">
            Ambil public token gratis di mapbox.com → Account → Tokens
          </p>
        </div>
        <div className="w-full flex gap-2 mt-1">
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="pk.eyJ1Ijoi…"
            className="flex-1 bg-background/60 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber/60"
          />
          <button
            onClick={saveToken}
            className="px-3 py-2 rounded-lg bg-amber text-obsidian text-xs font-bold"
          >
            Simpan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[260px] rounded-2xl overflow-hidden border border-border/60 shadow-deep">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-3 left-3 glass rounded-full px-3 py-1.5 flex items-center gap-1.5 z-10">
        <MapPin className="w-3 h-3 text-amber" />
        <span className="text-[10px] font-semibold">
          {TALENT_OFFSETS.length} talent tersedia
        </span>
      </div>
    </div>
  );
};

export default TalentMap;
