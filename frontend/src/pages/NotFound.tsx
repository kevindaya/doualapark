import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => { console.error("404 Error:", location.pathname); }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6" style={{ background: "#F8FAFC" }}>
      <div className="text-center">
        <h1 className="font-space font-bold text-6xl mb-2" style={{ color: "#0F172A" }}>404</h1>
        <p className="font-jakarta text-lg mb-6" style={{ color: "#64748B" }}>Page introuvable</p>
        <Link to="/" className="font-jakarta font-semibold text-sm inline-flex items-center gap-2 rounded-[10px] px-6 py-3 transition-smooth hover:-translate-y-0.5"
          style={{ background: "#0F172A", color: "white" }}>
          <Home size={16} strokeWidth={1.5} /> Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
