// src/components/Navbar.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import MobileDrawer from "./MobileDrawer";

const navLinks = [
  { label: "Accueil",      to: "/" },
  { label: "Rechercher",   to: "/rechercher" },
  { label: "Réservations", to: "/reservations" },
  // { label: "Profil",       to: "/profil" },
];

const Navbar = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-6 lg:px-12 transition-smooth"
        style={{
          background: "var(--bg-card, rgba(255,255,255,0.95))",
          borderBottom: "1px solid var(--border, #E2E8F0)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <Link to="/" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
          <div className="w-[38px] h-[38px] rounded-[10px] gradient-primary flex items-center justify-center" style={{ flexShrink: 0 }}>
            <span className="font-space font-bold text-white text-lg">P</span>
          </div>
          <span className="font-space font-bold text-lg">
            <span style={{ color: "var(--text-1, #0F172A)" }}>Douala</span>
            <span style={{ color: "#2563EB" }}>Park</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link key={link.to} to={link.to}
                className="font-jakarta text-[14px] font-medium transition-smooth relative"
                style={{ textDecoration: "none", color: active ? "#2563EB" : "var(--text-2, #475569)", fontWeight: active ? 600 : 500 }}>
                {link.label}
                {active && (
                  <span style={{ position: "absolute", bottom: -4, left: 0, right: 0, height: 2, borderRadius: 2, background: "#2563EB" }} />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/rechercher"
            className="hidden lg:inline-flex font-jakarta font-semibold text-sm rounded-[50px] px-5 py-2.5 hover:-translate-y-0.5 transition-smooth items-center gap-2"
            style={{ background: "#0F172A", color: "white", textDecoration: "none" }}>
            <Search size={15} strokeWidth={1.5} /> Trouver une place
          </Link>
          <button className="lg:hidden p-2 rounded-lg"
            style={{ color: "var(--text-1, #0F172A)", background: "var(--bg-surface, #F8FAFC)", border: "1px solid var(--border, #E2E8F0)" }}
            onClick={() => setDrawerOpen(true)}>
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default Navbar;