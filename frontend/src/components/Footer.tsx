// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

// ⚠️ "Mon profil" retiré — réactivé lors de l'upgrade
const footerLinks = [
  { label: "Accueil",              to: "/" },
  { label: "Rechercher un parking", to: "/rechercher" },
  { label: "Mes réservations",      to: "/reservations" },
  { label: "Comment ça marche",     to: "/#steps" },
];

const Footer = () => (
  <footer style={{ background: "#0F172A", padding: "64px 48px 32px" }}>
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-[38px] h-[38px] rounded-[10px] gradient-primary flex items-center justify-center">
            <span className="font-space font-bold text-white text-lg">P</span>
          </div>
          <span className="font-space font-bold text-lg">
            <span style={{ color: "white" }}>Douala</span>
            <span style={{ color: "#2563EB" }}>Park</span>
          </span>
        </div>
        <p className="font-jakarta text-sm leading-[1.7] max-w-[280px]" style={{ color: "rgba(255,255,255,0.55)" }}>
          DoualaPark révolutionne le stationnement à Douala. Trouvez et réservez votre place en moins de 30 secondes, directement depuis votre smartphone.
        </p>
        <p className="text-xs font-jakarta mt-6" style={{ color: "rgba(255,255,255,0.35)" }}>© 2025 DoualaPark. Tous droits réservés.</p>
      </div>

      <div>
        <p className="text-[13px] font-bold font-jakarta uppercase tracking-[1px] mb-5" style={{ color: "white" }}>Liens rapides</p>
        <div className="flex flex-col gap-3">
          {footerLinks.map((l) => (
            <Link key={l.to} to={l.to} className="font-jakarta text-sm transition-smooth" style={{ color: "rgba(255,255,255,0.55)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[13px] font-bold font-jakarta uppercase tracking-[1px] mb-5" style={{ color: "white" }}>Suivez-nous</p>
        <p className="font-jakarta text-sm mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>
          Restez informé des nouveautés DoualaPark et des parkings disponibles.
        </p>
        <div className="grid grid-cols-4 gap-3">
          {["Facebook", "Instagram", "Twitter", "WhatsApp"].map((name) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-smooth"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}>
                <span className="text-white text-sm font-bold">{name[0]}</span>
              </div>
              <span className="text-[11px] font-jakarta" style={{ color: "rgba(255,255,255,0.45)" }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "40px 0 24px" }} />

    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
      <p className="text-[13px] font-jakarta inline-flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.40)" }}>
        Développé avec <Heart size={14} style={{ color: "#EF4444" }} fill="#EF4444" /> au Cameroun
      </p>
      <p className="text-[13px] font-jakarta" style={{ color: "rgba(255,255,255,0.40)" }}>
        Politique de confidentialité · Conditions d'utilisation
      </p>
    </div>
  </footer>
);

export default Footer;