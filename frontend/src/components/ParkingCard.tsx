import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Parking, statusConfig } from "@/data/parkings";
import { MapPin, Star, ArrowRight, Eye } from "lucide-react";

const ParkingCard = ({ parking }: { parking: Parking }) => {
  const s = statusConfig[parking.status] ?? statusConfig.libre;
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  // Si l'URL de l'image change (ex: passage du mock data aux vraies données),
  // on redonne une chance à la nouvelle URL au lieu de rester bloqué sur le
  // placeholder à cause d'un échec précédent sur une AUTRE image.
  useEffect(() => {
    setImgError(false);
  }, [parking.image]);

  return (
    <div
      onClick={() => navigate(`/parking/${parking.id}`)}
      style={{
        borderRadius: 16,
        background: "var(--bg-card, #FFFFFF)",
        border: "1px solid var(--border, #E2E8F0)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "#BFDBFE";
        el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border, #E2E8F0)";
        el.style.boxShadow = "none";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div style={{ height: 160, position: "relative", overflow: "hidden" }}>
        {!imgError ? (
          <img
            src={parking.image}
            alt={parking.name}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1E293B, #334155)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="font-space font-bold" style={{ fontSize: 40, color: "rgba(255,255,255,0.3)" }}>
              {parking.name[0]}
            </span>
          </div>
        )}

        {/* Gradient */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 70, background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }} />

        {/* Zone badge */}
        <span
          className="font-jakarta"
          style={{ position: "absolute", top: 10, left: 10, zIndex: 2, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", color: "#0F172A" }}
        >
          {parking.quartier}
        </span>

        {/* Status badge */}
        <span
          className="font-jakarta"
          style={{ position: "absolute", top: 10, right: 10, zIndex: 2, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: s.bgRaw, border: `1px solid ${s.borderRaw}`, color: s.colorRaw, backdropFilter: "blur(8px)" }}
        >
          ● {s.label}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px" }}>
        <h3 className="font-space font-bold" style={{ fontSize: 15, color: "var(--text-1, #0F172A)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {parking.name}
        </h3>
        <p className="font-jakarta" style={{ fontSize: 12, color: "var(--text-2, #64748B)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <MapPin size={11} strokeWidth={1.5} />
          {parking.address}
        </p>

        <div style={{ height: 1, background: "var(--border, #E2E8F0)", margin: "10px 0" }} />

        {/* Stats */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p className="font-space font-bold" style={{ fontSize: 13, color: "var(--text-1, #0F172A)", margin: 0 }}>
              {parking.placesUsed}/{parking.placesTotal}
            </p>
            <p className="font-jakarta" style={{ fontSize: 11, color: "var(--text-3, #94A3B8)", marginTop: 2 }}>Places</p>
          </div>
          <div style={{ width: 1, height: 24, background: "var(--border, #E2E8F0)" }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <p className="font-space font-bold" style={{ fontSize: 13, color: "var(--text-1, #0F172A)", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
              {parking.rating} <Star size={11} fill="#F59E0B" strokeWidth={0} />
            </p>
            <p className="font-jakarta" style={{ fontSize: 11, color: "var(--text-3, #94A3B8)", marginTop: 2 }}>Note</p>
          </div>
          <div style={{ width: 1, height: 24, background: "var(--border, #E2E8F0)" }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <p className="font-space font-bold" style={{ fontSize: 13, color: "var(--text-1, #0F172A)", margin: 0 }}>{parking.distance}</p>
            <p className="font-jakarta" style={{ fontSize: 11, color: "var(--text-3, #94A3B8)", marginTop: 2 }}>Distance</p>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--border, #E2E8F0)", margin: "10px 0" }} />

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span className="font-space font-bold" style={{ fontSize: 20, color: "#F59E0B" }}>
              {parking.price.toLocaleString()}
            </span>
            <span className="font-jakarta" style={{ fontSize: 12, color: "var(--text-3, #94A3B8)", marginLeft: 4 }}>FCFA/h</span>
          </div>

          <div style={{ display: "flex", gap: 8 }} onClick={(e) => e.stopPropagation()}>
            {/* Voir détails */}
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/parking/${parking.id}`); }}
              className="font-jakarta"
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, background: "var(--bg-surface, #F8FAFC)", border: "1px solid var(--border, #E2E8F0)", color: "var(--text-2, #475569)", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#BFDBFE"; (e.currentTarget as HTMLElement).style.color = "#2563EB"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border,#E2E8F0)"; (e.currentTarget as HTMLElement).style.color = "var(--text-2,#475569)"; }}
            >
              <Eye size={13} strokeWidth={1.5} />
              Détails
            </button>

            {/* Réserver */}
            {parking.status !== "complet" ? (
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/reserver/${parking.id}`); }}
                className="font-jakarta"
                style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 8, background: "#0F172A", color: "white", border: "none", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1E293B"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#0F172A"; }}
              >
                Réserver <ArrowRight size={13} strokeWidth={1.5} />
              </button>
            ) : (
              <span className="font-jakarta" style={{ fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 8, background: "var(--bg-surface,#F1F5F9)", color: "var(--text-3,#94A3B8)" }}>
                Complet
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingCard;