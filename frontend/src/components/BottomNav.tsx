// src/components/BottomNav.tsx
import { Link, useLocation } from "react-router-dom";
import { Home, Search, CalendarDays } from "lucide-react";

// ⚠️ Profil retiré — réactivé lors de l'upgrade
const tabs = [
  { icon: Home,         label: "Accueil",      path: "/" },
  { icon: Search,       label: "Rechercher",   path: "/rechercher" },
  { icon: CalendarDays, label: "Réservations", path: "/reservations" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex items-stretch h-16"
      style={{ background: "white", borderTop: "1px solid #E2E8F0", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map((tab) => {
        const active = tab.path === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.path);
        const Icon = tab.icon;
        return (
          <Link key={tab.label} to={tab.path}
            className="flex-1 flex flex-col items-center justify-center gap-1 relative transition-all duration-200 active:scale-[0.85]">
            {active && (
              <div className="absolute top-0 rounded-b-sm" style={{ width: 18, height: 3, background: "#0F172A" }} />
            )}
            <Icon size={22} strokeWidth={1.5} style={{ color: active ? "#0F172A" : "#94A3B8" }} />
            <span className="text-[11px] font-jakarta font-medium" style={{ color: active ? "#0F172A" : "#94A3B8" }}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;