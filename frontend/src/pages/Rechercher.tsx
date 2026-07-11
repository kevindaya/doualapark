// src/pages/Rechercher.tsx
import { useState, useMemo, useEffect, useRef } from "react";
import { useParkings } from "@/hooks/useParkings";
import { useUserLocation } from "@/hooks/useUserLocation";
import type { Parking } from "@/data/parkings";
import ParkingCard from "@/components/ParkingCard";
import { Search, Map, LocateFixed, MapPin, X, Loader2 } from "lucide-react";

// ── Haversine ────────────────────────────────────────────────────────────────
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const FILTRES = ["Le plus proche", "Moins cher", "Mieux noté", "Disponible"];

// Centre de Douala — utilisé comme fallback
const DOUALA_CENTER = { lat: 4.0511, lng: 9.7679 };

// ── Composant carte Leaflet ──────────────────────────────────────────────────
interface MapProps {
  data: Parking[];
  userPosition: { lat: number; lng: number } | null;
  mapCenter: { lat: number; lng: number } | null;
}

const LeafletMap = ({ data, userPosition, mapCenter }: MapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const markersRef   = useRef<any[]>([]);

  // Init carte une seule fois
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = async () => {
      if (!containerRef.current) return;
      const L = (await import("leaflet")).default;
      (window as any)._L = L;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
      });

      // Centre initial = position user si dispo, sinon Douala centre-ville (Akwa)
      const startCenter = userPosition ?? DOUALA_CENTER;

      const map = L.map(containerRef.current, {
        center: [startCenter.lat, startCenter.lng],
        zoom: 14,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap", maxZoom: 19,
      }).addTo(map);

      setTimeout(() => map.invalidateSize(), 150);
      mapRef.current = map;
    };

    initMap();

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // Recentre quand mapCenter ou userPosition change
  useEffect(() => {
    if (!mapRef.current) return;
    const target = mapCenter ?? userPosition;
    if (target) mapRef.current.setView([target.lat, target.lng], 14, { animate: true });
  }, [mapCenter, userPosition]);

  // Reconstruit les marqueurs quand data change
  useEffect(() => {
    const L = (window as any)._L;
    if (!mapRef.current || !L) return;

    // Supprime anciens marqueurs
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Marqueur position utilisateur (point bleu)
    if (userPosition) {
      const userIcon = L.divIcon({
        html: `<div style="width:14px;height:14px;background:#2563EB;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(37,99,235,0.25)"></div>`,
        className: "", iconSize: [14, 14], iconAnchor: [7, 7],
      });
      const userMarker = L.marker([userPosition.lat, userPosition.lng], { icon: userIcon })
        .bindPopup("<strong style='color:#2563EB'>📍 Votre position</strong>")
        .addTo(mapRef.current);
      markersRef.current.push(userMarker);
    }

    // Marqueurs parkings — uniquement les 5 parkings de Douala
    data.forEach(p => {
      if (!p.lat || !p.lng) return;
      const color = p.status === "libre" ? "#059669" : p.status === "quasi-plein" ? "#EA580C" : "#DC2626";
      const label = p.status === "libre" ? "● Libre" : p.status === "quasi-plein" ? "● Quasi-plein" : "● Complet";
      const libres = p.placesTotal - p.placesUsed;

      const marker = L.marker([p.lat, p.lng])
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:160px;padding:4px 0">
            <strong style="color:#0F172A;font-size:13px;display:block;margin-bottom:6px">${p.name}</strong>
            <div style="color:#64748B;font-size:12px;margin-bottom:2px">💰 ${p.price.toLocaleString()} FCFA/h</div>
            <div style="color:#64748B;font-size:12px;margin-bottom:6px">🅿️ ${libres} place${libres > 1 ? "s" : ""} libre${libres > 1 ? "s" : ""}</div>
            <div style="color:${color};font-size:12px;font-weight:600;margin-bottom:10px">${label}</div>
            ${p.status !== "complet"
              ? `<a href="/reserver/${p.id}" style="display:block;text-align:center;background:#0F172A;color:white;padding:7px 0;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none">Réserver</a>`
              : `<div style="text-align:center;background:#FEF2F2;color:#DC2626;padding:7px 0;border-radius:8px;font-size:12px;font-weight:600">Complet</div>`
            }
          </div>
        `)
        .addTo(mapRef.current);
      markersRef.current.push(marker);
    });
  }, [data, userPosition]);

  return <div ref={containerRef} style={{ height: "100%", width: "100%", minHeight: "inherit" }} />;
};

// ── Page Rechercher ──────────────────────────────────────────────────────────
const Rechercher = () => {
  const { parkings: allParkings, loading: parkingsLoading } = useParkings();
  const { userPos, geoLoading, geoError, locateMe, clearGeoError, setGeoError } = useUserLocation();

  const [activeFilter, setActiveFilter] = useState("Le plus proche");
  const [search,       setSearch]       = useState("");
  const [showMap,      setShowMap]      = useState(false);
  const [mobileView,   setMobileView]   = useState<"list" | "map">("list");
  const [isMobile,     setIsMobile]     = useState(false);

  // Recherche de lieu pour centrer la carte
  const [placeInput,  setPlaceInput]  = useState("");
  const [mapCenter,   setMapCenter]   = useState<{ lat: number; lng: number } | null>(null);
  const [geocoding,   setGeocoding]   = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowMap(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Demande automatique de la position dès l'arrivée sur la page — plus besoin
  // de cliquer "Ma position" manuellement. Ne se redéclenche pas si on l'a déjà
  // (le contexte la garde en mémoire tant qu'on ne quitte pas complètement le site).
  useEffect(() => {
    if (!userPos) locateMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recentre la carte dès que la position est connue. Le clic manuel sur
  // "Ma position" bascule en plus la vue mobile sur la carte (le déclenchement
  // automatique au chargement, lui, reste discret et ne change pas la vue).
  const manualLocateRef = useRef(false);
  useEffect(() => {
    if (userPos) {
      setMapCenter(userPos);
      if (manualLocateRef.current && isMobile) {
        setMobileView("map");
        manualLocateRef.current = false;
      }
    }
  }, [userPos, isMobile]);

  const handleLocateClick = () => {
    manualLocateRef.current = true;
    locateMe();
  };

  // Centrer sur un lieu via Nominatim
  const geocodePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeInput.trim()) return;
    setGeocoding(true);
    setGeoError(null);
    try {
      const url  = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeInput + " Douala Cameroun")}&format=json&limit=1`;
      const res  = await fetch(url, { headers: { "Accept-Language": "fr" } });
      const data = await res.json();
      if (data.length > 0) {
        const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        setMapCenter(coords);
        if (isMobile) setMobileView("map");
        setPlaceInput("");
      } else {
        setGeoError(`"${placeInput}" introuvable. Essayez : Akwa, Bonanjo, Deido, Bali, Bonapriso`);
      }
    } catch {
      setGeoError("Erreur réseau lors de la recherche.");
    } finally {
      setGeocoding(false);
    }
  };

  // Calcule la distance réelle depuis la position utilisateur
  const parkingsAvecDistance = useMemo(() => {
    if (!userPos) return allParkings;
    return allParkings.map(p => ({
      ...p,
      _distNum: haversine(userPos.lat, userPos.lng, p.lat, p.lng),
      distance: `${haversine(userPos.lat, userPos.lng, p.lat, p.lng).toFixed(1)} km`,
    }));
  }, [allParkings, userPos]);

  const filtered = useMemo(() => {
    let list = parkingsAvecDistance.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.quartier.toLowerCase().includes(search.toLowerCase())
    );
    if (activeFilter === "Disponible")      list = list.filter(p => p.status === "libre");
    if (activeFilter === "Moins cher")      list = [...list].sort((a, b) => a.price - b.price);
    if (activeFilter === "Mieux noté")      list = [...list].sort((a, b) => b.rating - a.rating);
    if (activeFilter === "Le plus proche") {
      list = [...list].sort((a: any, b: any) =>
        (a._distNum ?? parseFloat(a.distance)) - (b._distNum ?? parseFloat(b.distance))
      );
    }
    return list;
  }, [parkingsAvecDistance, search, activeFilter]);

  return (
    <div style={{ paddingTop: 68, minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F8FAFC" }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: isMobile ? "16px 20px" : "20px 48px" }}>
        <h1 className="font-space font-bold" style={{ fontSize: isMobile ? 22 : 28, color: "#0F172A", margin: 0 }}>
          Trouver un parking
        </h1>
        <p className="font-jakarta" style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>
          {filtered.length} parking{filtered.length > 1 ? "s" : ""} à Douala
          {userPos && <span style={{ color: "#2563EB" }}> · trié par distance réelle</span>}
        </p>
      </div>

      {/* Barre de contrôles */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: isMobile ? "12px 16px" : "14px 48px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Ligne 1 : recherche parking + Ma position + toggle carte mobile */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Champ recherche parking */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 14px" }}>
            <Search size={16} strokeWidth={1.5} style={{ color: "#94A3B8", flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un parking ou quartier..."
              className="font-jakarta"
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#0F172A" }}
            />
            {search && <button onClick={() => setSearch("")}><X size={14} style={{ color: "#94A3B8" }} /></button>}
          </div>

          {/* Bouton Ma position */}
          <button onClick={handleLocateClick} disabled={geoLoading}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: isMobile ? "10px 12px" : "10px 16px",
              borderRadius: 10, border: `1.5px solid ${userPos ? "#2563EB" : "#E2E8F0"}`,
              background: userPos ? "#EFF6FF" : "#F8FAFC",
              color: userPos ? "#2563EB" : "#475569",
              fontSize: 13, fontWeight: 600, cursor: geoLoading ? "wait" : "pointer",
              whiteSpace: "nowrap", flexShrink: 0,
            }}>
            {geoLoading
              ? <Loader2 size={15} strokeWidth={1.5} className="animate-spin" />
              : <LocateFixed size={15} strokeWidth={1.5} />
            }
            {!isMobile && (userPos ? "✓ Localisé" : "Ma position")}
          </button>

          {/* Toggle liste/carte — mobile seulement */}
          {isMobile && (
            <button onClick={() => setMobileView(v => v === "list" ? "map" : "list")}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "10px 12px",
                borderRadius: 10, border: "1px solid #E2E8F0",
                background: mobileView === "map" ? "#0F172A" : "#F8FAFC",
                color: mobileView === "map" ? "white" : "#475569",
                fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0,
              }}>
              <Map size={15} strokeWidth={1.5} />
              {mobileView === "map" ? "Liste" : "Carte"}
            </button>
          )}
        </div>

        {/* Ligne 2 : centrer la carte sur un lieu */}
        <form onSubmit={geocodePlace} style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 12px" }}>
            <MapPin size={14} strokeWidth={1.5} style={{ color: "#94A3B8", flexShrink: 0 }} />
            <input value={placeInput} onChange={e => setPlaceInput(e.target.value)}
              placeholder="Centrer la carte sur un quartier (ex: Akwa, Bonanjo...)"
              className="font-jakarta"
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#0F172A" }}
            />
          </div>
          <button type="submit" disabled={geocoding || !placeInput.trim()}
            style={{
              padding: "8px 16px", borderRadius: 10, background: "#0F172A", color: "white",
              fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              opacity: geocoding || !placeInput.trim() ? 0.5 : 1,
            }}>
            {geocoding ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            {!isMobile && "Centrer"}
          </button>
        </form>

        {/* Message erreur géo */}
        {geoError && (
          <div style={{ fontSize: 12, color: "#DC2626", padding: "6px 12px", background: "#FEF2F2", borderRadius: 8, border: "1px solid #FECACA", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{geoError}</span>
            <button onClick={() => setGeoError(null)} style={{ color: "#DC2626", fontWeight: 700, marginLeft: 8 }}>✕</button>
          </div>
        )}

        {/* Filtres */}
        {(!isMobile || mobileView === "list") && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {FILTRES.map(f => {
              const isActive = activeFilter === f;
              return (
                <button key={f} onClick={() => setActiveFilter(f)} className="font-jakarta"
                  style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, padding: "7px 14px", borderRadius: 20, cursor: "pointer", whiteSpace: "nowrap", border: `1px solid ${isActive ? "#0F172A" : "#E2E8F0"}`, background: isActive ? "#0F172A" : "#fff", color: isActive ? "#fff" : "#475569" }}>
                  {f === "Le plus proche" && userPos ? "📍 Le plus proche" : f}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: isMobile ? "calc(100vh - 260px)" : "calc(100vh - 220px)" }}>

        {/* Mobile — liste */}
        {isMobile && mobileView === "list" && (
          <div style={{ width: "100%", overflowY: "auto", padding: "16px 16px 100px", display: "flex", flexDirection: "column", gap: 14 }}>
            <p className="font-jakarta" style={{ fontSize: 12, color: "#94A3B8" }}>
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              {userPos && " · distances réelles calculées"}
            </p>
            {parkingsLoading
              ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0", gap: 10 }}>
                  <Loader2 size={32} className="animate-spin" style={{ color: "#2563EB" }} />
                  <p className="font-jakarta" style={{ color: "#64748B", fontSize: 14 }}>Chargement des parkings…</p>
                </div>
              : filtered.length === 0
              ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0", gap: 10 }}>
                  <Search size={40} strokeWidth={1} color="#CBD5E1" />
                  <p className="font-jakarta" style={{ color: "#64748B", fontSize: 14 }}>Aucun parking trouvé</p>
                </div>
              : filtered.map(p => <ParkingCard key={p.id} parking={p} />)
            }
          </div>
        )}

        {/* Mobile — carte */}
        {isMobile && mobileView === "map" && (
          <div style={{ width: "100%", height: "100%", minHeight: 400 }}>
            {showMap
              ? <LeafletMap data={filtered.length > 0 ? filtered : allParkings} userPosition={userPos} mapCenter={mapCenter} />
              : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Loader2 size={24} className="animate-spin" style={{ color: "#2563EB" }} />
                </div>
            }
          </div>
        )}

        {/* Desktop — liste gauche */}
        {!isMobile && (
          <div style={{ width: "44%", borderRight: "1px solid #E2E8F0", background: "#F8FAFC", overflowY: "auto", padding: "20px 20px 40px", display: "flex", flexDirection: "column", gap: 14 }}>
            <p className="font-jakarta" style={{ fontSize: 13, color: "#94A3B8" }}>
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              {userPos && " · triés par distance"}
            </p>
            {parkingsLoading
              ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 0", gap: 12 }}>
                  <Loader2 size={36} className="animate-spin" style={{ color: "#2563EB" }} />
                  <p className="font-jakarta" style={{ color: "#64748B", fontSize: 14 }}>Chargement des parkings…</p>
                </div>
              : filtered.length === 0
              ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 0", gap: 12 }}>
                  <Search size={48} strokeWidth={1} color="#CBD5E1" />
                  <p className="font-jakarta" style={{ color: "#64748B", fontSize: 14 }}>Aucun parking trouvé</p>
                </div>
              : filtered.map(p => <ParkingCard key={p.id} parking={p} />)
            }
          </div>
        )}

        {/* Desktop — carte droite */}
        {!isMobile && (
          <div style={{ width: "56%", position: "relative" }}>
            {showMap
              ? <div style={{ position: "absolute", inset: 0 }}>
                  <LeafletMap data={filtered.length > 0 ? filtered : allParkings} userPosition={userPos} mapCenter={mapCenter} />
                </div>
              : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Loader2 size={24} className="animate-spin" style={{ color: "#2563EB" }} />
                </div>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Rechercher;