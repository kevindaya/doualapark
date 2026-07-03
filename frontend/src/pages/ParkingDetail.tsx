import { useParams, useNavigate, Link } from "react-router-dom";
import { parkings, statusConfig } from "@/data/parkings";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, Star, Clock, Shield, Zap, Camera, Lightbulb, Accessibility, Car, Navigation } from "lucide-react";
import { useRef, useEffect } from "react";

// ── Mini carte vanilla Leaflet ──────────────────────────────────────────────
const MiniMap = ({ lat, lng, name }: { lat: number; lng: number; name: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const init = async () => {
      if (!ref.current) return;
      const L = (await import("leaflet")).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
      });
      const map = L.map(ref.current, { center: [lat, lng], zoom: 15, scrollWheelZoom: false, zoomControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map);
      L.marker([lat, lng]).addTo(map);
      setTimeout(() => map.invalidateSize(), 100);
      mapRef.current = map;
    };
    init();
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [lat, lng]);

  return <div ref={ref} style={{ height: "100%", width: "100%" }} />;
};

const amenities = [
  { icon: Shield, label: "Surveillance 24h/24" },
  { icon: Camera, label: "Vidéosurveillance" },
  { icon: Lightbulb, label: "Éclairage" },
  { icon: Zap, label: "Bornes électriques" },
  { icon: Accessibility, label: "Accès PMR" },
  { icon: Car, label: "Couvert" },
];

const reviews = [
  { name: "Jean M.", rating: 5, comment: "Très bien situé, sécurisé.", time: "il y a 2 jours" },
  { name: "Marie F.", rating: 4, comment: "Propre et accessible.", time: "il y a 1 semaine" },
  { name: "Paul N.", rating: 4, comment: "Pratique pour le centre.", time: "il y a 2 semaines" },
];

const ParkingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const parking = parkings.find((p) => p.id === Number(id)) || parkings[0];
  const s = statusConfig[parking.status];
  const available = parking.placesTotal - parking.placesUsed;

  return (
    <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--bg-surface,#F8FAFC)" }}>

      {/* Back */}
      <div style={{ background: "var(--bg-card,#FFFFFF)", borderBottom: "1px solid var(--border,#E2E8F0)", padding: "12px 20px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500, color: "var(--text-2,#475569)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Retour
        </button>
      </div>

      {/* Hero image — haute qualité */}
      <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
        <img
          src={`${parking.image.split("?")[0]}?w=1200&q=90&fit=crop`}
          alt={parking.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
        <div style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: s.bgRaw, border: `1px solid ${s.borderRaw}`, color: s.colorRaw, marginBottom: 6, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            ● {s.label}
          </span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "white", margin: 0, fontFamily: "Space Grotesk, sans-serif", lineHeight: 1.2 }}>
            {parking.name}
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.80)", margin: "5px 0 0", display: "flex", alignItems: "center", gap: 4, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            <MapPin size={12} strokeWidth={1.5} /> {parking.address}
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: "var(--bg-card,#FFFFFF)", borderBottom: "1px solid var(--border,#E2E8F0)", display: "flex" }}>
        {[
          { value: `${parking.rating}/5`, label: "Note", icon: <Star size={15} fill="#F59E0B" strokeWidth={0} /> },
          { value: parking.distance, label: "Distance", icon: <Navigation size={15} strokeWidth={1.5} style={{ color: "#2563EB" }} /> },
          { value: `${available}/${parking.placesTotal}`, label: "Places libres", icon: <Car size={15} strokeWidth={1.5} style={{ color: "#10B981" }} /> },
        ].map((stat, i) => (
          <div key={i} style={{ flex: 1, padding: "14px 8px", textAlign: "center", borderRight: i < 2 ? "1px solid var(--border,#E2E8F0)" : "none" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{stat.icon}</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1,#0F172A)", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>{stat.value}</p>
            <p style={{ fontSize: 11, color: "var(--text-3,#94A3B8)", margin: "2px 0 0", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px 40px" }}>

        {/* Grid desktop: 2 colonnes / mobile: 1 colonne */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 16 }} className="detail-grid">

          {/* ── Tarif + Réserver ── */}
          <div style={{ background: "var(--bg-card,#FFFFFF)", border: "1px solid var(--border,#E2E8F0)", borderRadius: 14, padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div>
              <p style={{ fontSize: 12, color: "var(--text-3,#94A3B8)", margin: "0 0 2px", fontFamily: "Plus Jakarta Sans, sans-serif" }}>Tarif horaire</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#F59E0B", fontFamily: "Space Grotesk, sans-serif" }}>{parking.price.toLocaleString()}</span>
                <span style={{ fontSize: 13, color: "var(--text-3,#94A3B8)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>FCFA/h</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-3,#94A3B8)", margin: "2px 0 0", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Journalier : {(parking.price * 8).toLocaleString()} FCFA
              </p>
            </div>
            {parking.status !== "complet" ? (
              <Link
                to={`/reserver/${parking.id}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 24px", borderRadius: 10, background: "#0F172A", color: "white", fontWeight: 700, fontSize: 14, textDecoration: "none", fontFamily: "Plus Jakarta Sans, sans-serif", flexShrink: 0 }}
              >
                Réserver cette place →
              </Link>
            ) : (
              <div style={{ padding: "12px 24px", borderRadius: 10, background: "var(--bg-surface,#F1F5F9)", color: "var(--text-3,#94A3B8)", fontWeight: 600, fontSize: 14, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Parking complet
              </div>
            )}
          </div>

          {/* ── Disponibilité ── */}
          <div style={{ background: "var(--bg-card,#FFFFFF)", border: "1px solid var(--border,#E2E8F0)", borderRadius: 14, padding: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1,#0F172A)", margin: "0 0 12px", fontFamily: "Space Grotesk, sans-serif" }}>
              Disponibilité
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              {/* Barre de progression */}
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ height: 8, borderRadius: 4, background: "var(--bg-surface,#F1F5F9)", overflow: "hidden", marginBottom: 6 }}>
                  <div style={{
                    height: "100%",
                    width: `${(parking.placesUsed / parking.placesTotal) * 100}%`,
                    borderRadius: 4,
                    background: available > 20 ? "#10B981" : available > 5 ? "#F59E0B" : "#EF4444",
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <p style={{ fontSize: 12, color: "var(--text-2,#475569)", margin: 0, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {parking.placesUsed} places occupées sur {parking.placesTotal}
                </p>
              </div>
              {/* Chiffre dispo */}
              <div style={{ textAlign: "center", padding: "10px 16px", borderRadius: 10, background: available > 0 ? "#ECFDF5" : "#FEF2F2", border: `1px solid ${available > 0 ? "#BBF7D0" : "#FECACA"}` }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: available > 0 ? "#059669" : "#DC2626", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>{available}</p>
                <p style={{ fontSize: 11, color: available > 0 ? "#059669" : "#DC2626", margin: "2px 0 0", fontFamily: "Plus Jakarta Sans, sans-serif" }}>libres</p>
              </div>
            </div>
          </div>

          {/* ── Équipements ── */}
          <div style={{ background: "var(--bg-card,#FFFFFF)", border: "1px solid var(--border,#E2E8F0)", borderRadius: 14, padding: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1,#0F172A)", margin: "0 0 14px", fontFamily: "Space Grotesk, sans-serif" }}>
              Équipements
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {amenities.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px", borderRadius: 10, background: "var(--bg-surface,#F8FAFC)", border: "1px solid var(--border,#E2E8F0)", textAlign: "center" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={16} strokeWidth={1.5} style={{ color: "#2563EB" }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-1,#0F172A)", fontFamily: "Plus Jakarta Sans, sans-serif", lineHeight: 1.3 }}>{a.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Horaires + Localisation ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="hours-map-grid">

            {/* Horaires */}
            <div style={{ background: "var(--bg-card,#FFFFFF)", border: "1px solid var(--border,#E2E8F0)", borderRadius: 14, padding: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1,#0F172A)", margin: "0 0 14px", fontFamily: "Space Grotesk, sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                <Clock size={16} strokeWidth={1.5} style={{ color: "#2563EB" }} /> Horaires
              </h2>
              {[["Lun – Ven", "06:00 – 22:00"], ["Samedi", "07:00 – 22:00"], ["Dimanche", "08:00 – 20:00"]].map(([d, h]) => (
                <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--border,#E2E8F0)" }}>
                  <span style={{ fontSize: 13, color: "var(--text-2,#475569)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{d}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1,#0F172A)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{h}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, background: "#ECFDF5" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", fontFamily: "Plus Jakarta Sans, sans-serif" }}>Ouvert maintenant</span>
              </div>
            </div>

            {/* Mini carte */}
            <div style={{ background: "var(--bg-card,#FFFFFF)", border: "1px solid var(--border,#E2E8F0)", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, minHeight: 150 }}>
                <MiniMap lat={parking.lat} lng={parking.lng} name={parking.name} />
              </div>
              <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border,#E2E8F0)" }}>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(parking.name + " Douala")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 13, fontWeight: 600, color: "#2563EB", textDecoration: "none", fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  <Navigation size={13} strokeWidth={1.5} />
                  Obtenir l'itinéraire
                </a>
              </div>
            </div>
          </div>

          {/* ── Avis ── */}
          <div style={{ background: "var(--bg-card,#FFFFFF)", border: "1px solid var(--border,#E2E8F0)", borderRadius: 14, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1,#0F172A)", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>Avis</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={14} fill="#F59E0B" strokeWidth={0} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1,#0F172A)", fontFamily: "Space Grotesk, sans-serif" }}>{parking.rating}</span>
                <span style={{ fontSize: 12, color: "var(--text-3,#94A3B8)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>/5</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {reviews.map((r, i) => (
                <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: "var(--bg-surface,#F8FAFC)", border: "1px solid var(--border,#E2E8F0)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", fontFamily: "Space Grotesk, sans-serif" }}>{r.name[0]}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1,#0F172A)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{r.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={11} strokeWidth={0} fill={j < r.rating ? "#F59E0B" : "var(--border,#E2E8F0)"} />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-2,#475569)", margin: 0, fontFamily: "Plus Jakarta Sans, sans-serif" }}>{r.comment}</p>
                  <p style={{ fontSize: 11, color: "var(--text-3,#94A3B8)", margin: "4px 0 0", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{r.time}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />

      {/* CSS responsive inline */}
      <style>{`
        @media (min-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .detail-grid > *:first-child {
            grid-column: 1 / -1;
          }
          .hours-map-grid {
            grid-column: 1 / -1;
          }
          .detail-grid > *:last-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 480px) {
          .hours-map-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ParkingDetail;