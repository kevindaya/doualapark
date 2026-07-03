import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Home, Search, CalendarDays, UserCircle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const links = [
  { icon: Home, label: "Accueil", to: "/" },
  { icon: Search, label: "Rechercher", to: "/rechercher" },
  { icon: CalendarDays, label: "Réservations", to: "/reservations" },
  { icon: UserCircle, label: "Profil", to: "/profil" },
];

const MobileDrawer = ({ open, onClose }: Props) => {
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    < >
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "rgba(15,23,42,0.60)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "78%",
          maxWidth: 300,
          zIndex: 100,
          background: "#FFFFFF",
          boxShadow: open ? "-12px 0 40px rgba(0,0,0,0.5)" : "none",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{ borderBottom: "1px solid #E2E8F0", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div className="flex items-center gap-2.5 "  >
            <div className="w-[34px] h-[34px] rounded-[10px] gradient-primary flex items-center justify-center">
              <span className="font-space font-bold text-white text-sm">P</span>
            </div>
            <span className="font-space font-bold text-base" style={{ color: "#0F172A" }}>
              Douala<span style={{ color: "#2563EB" }}>Park</span>
            </span>
          </div>
          <button onClick={onClose} style={{ color: "#475569", padding: 4 }}>
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: "8px 0" }}>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className="flex items-center gap-3 font-jakarta transition-all duration-150"
                style={{
                  padding: "14px 24px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: isActive ? "#2563EB" : "#0F172A",
                  borderBottom: "1px solid #F1F5F9",
                }}
              >
                <Icon size={20} strokeWidth={1.5} style={{ color: isActive ? "#2563EB" : "#0F172A" }} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: 24, marginTop: "auto" }}>
          <Link
            to="/rechercher"
            onClick={onClose}
            className="block w-full text-center font-jakarta font-bold text-[15px] py-3.5 rounded-xl"
            style={{ background: "#0F172A", color: "white" }}
          >
            Trouver une place →
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
