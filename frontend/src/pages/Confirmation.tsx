// src/pages/Confirmation.tsx
import { useParams, useLocation, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { parkings } from "@/data/parkings";
import Footer from "@/components/Footer";
import { useState } from "react";
import {
  CheckCircle, MapPin, Car, CalendarDays, Clock,
  CreditCard, Navigation, List, X, AlertTriangle,
} from "lucide-react";

// ─── Type du state passé par Reserver.tsx via navigate ───────────────────────
interface ReservationState {
  code_qr:        string;
  id_reservation: number;
  prix:           number;
  heure_debut:    string;
  heure_fin:      string;
  parking_nom:    string;
  plaque?:        string;
}

const Confirmation = () => {
  const { id }   = useParams();
  const location = useLocation();

  // ── Données réelles venant de Reserver.tsx ──────────────────────────────
  const state = location.state as ReservationState | null;

  // ── Fallback si on arrive directement sur cette URL (sans state) ─────────
  const parkingLocal = parkings.find(p => p.id === Number(id)) || parkings[0];

  const code       = state?.code_qr     ?? "DP-0000";
  const prix       = state?.prix        ?? parkingLocal.price * 2;
  const heureDebut = state?.heure_debut ?? "08:00";
  const heureFin   = state?.heure_fin   ?? "10:00";
  const parkingNom = state?.parking_nom ?? parkingLocal.name;
  const plaque     = state?.plaque      ?? "—";

  // ── Durée calculée depuis les heures ──────────────────────────────────────
  const duree = (() => {
    const [sh, sm] = heureDebut.split(":").map(Number);
    const [eh, em] = heureFin.split(":").map(Number);
    const minutes  = eh * 60 + em - sh * 60 - sm;
    return minutes > 0 ? `${Math.ceil(minutes / 60)}h` : "—";
  })();

  const [qrModal,        setQrModal]        = useState(false);
  const [incidentSheet,  setIncidentSheet]  = useState(false);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parkingNom + " Douala Cameroun")}`;

  const details = [
    { icon: MapPin,      label: "Parking", value: parkingNom },
    { icon: Car,         label: "Plaque",  value: plaque },
    { icon: CalendarDays,label: "Date",    value: new Date().toLocaleDateString("fr-FR") },
    { icon: Clock,       label: "Créneau", value: `${heureDebut} - ${heureFin}` },
    { icon: Clock,       label: "Durée",   value: duree },
    { icon: CreditCard,  label: "Total",   value: `${prix.toLocaleString()} FCFA` },
  ];

  return (
    <div className="min-h-screen pb-20 lg:pb-0" style={{ background: "#F8FAFC" }}>
      <div className="pt-[120px] pb-20 px-6 flex flex-col items-center max-w-[500px] mx-auto">

        {/* ── Icône succès ─────────────────────────────────────────────────── */}
        <div className="relative mb-6 animate-fade-in-up">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
            <CheckCircle size={40} className="text-white" strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 w-20 h-20 rounded-full animate-ring-pulse"
            style={{ border: "2px solid rgba(37,99,235,0.30)" }} />
        </div>

        <h2 className="font-space font-bold text-3xl mb-2 animate-fade-in-up stagger-1"
          style={{ color: "#0F172A" }}>
          Réservation Confirmée !
        </h2>
        <p className="font-jakarta text-base mb-8 animate-fade-in-up stagger-2"
          style={{ color: "#64748B" }}>
          Votre place est sécurisée
        </p>

        {/* ── QR Code (vrai code du backend) ───────────────────────────────── */}
        <div
          className="bg-white rounded-[20px] p-8 flex flex-col items-center w-full mb-6 animate-fade-in-up stagger-3 cursor-pointer"
          style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
          onClick={() => setQrModal(true)}
        >
          <QRCodeSVG
            value={`doualpark://reservation/${code}`}
            size={180}
            fgColor="#2563EB"
            bgColor="white"
            level="M"
          />
          <div className="mt-4 rounded-lg px-4 py-2" style={{ background: "#EFF6FF" }}>
            <span className="font-mono text-sm" style={{ color: "#2563EB" }}>{code}</span>
          </div>
          <p className="text-xs font-jakarta mt-3" style={{ color: "#94A3B8" }}>
            Présentez à l'agent à l'entrée
          </p>
        </div>

        {/* ── Détails réservation ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-6 w-full mb-6 animate-fade-in-up stagger-4"
          style={{ border: "1px solid #E2E8F0" }}>
          <div className="grid grid-cols-2 gap-4">
            {details.map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={i} className="rounded-xl p-3"
                  style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <p className="text-[10px] font-jakarta mb-1 flex items-center gap-1"
                    style={{ color: "#94A3B8" }}>
                    <Icon size={10} strokeWidth={1.5} /> {d.label}
                  </p>
                  <p className="text-sm font-bold font-jakarta" style={{ color: "#0F172A" }}>
                    {d.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="w-full space-y-3 animate-fade-in-up stagger-5">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full font-jakarta font-bold text-base rounded-[14px] py-4 hover:-translate-y-[2px] transition-smooth active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ background: "#0F172A", color: "white" }}
          >
            <Navigation size={18} strokeWidth={1.5} /> Obtenir l'itinéraire
          </a>

          <Link
            to="/reservations"
            className="w-full text-center font-jakarta font-semibold text-base rounded-[14px] py-4 transition-smooth flex items-center justify-center gap-2 hover:bg-[#F8FAFC]"
            style={{ border: "1px solid #E2E8F0", color: "#475569" }}
          >
            <List size={18} strokeWidth={1.5} /> Voir mes réservations
          </Link>

          <button
            onClick={() => setIncidentSheet(true)}
            className="w-full text-center font-jakarta font-medium text-sm rounded-[14px] py-3 transition-smooth flex items-center justify-center gap-2"
            style={{ color: "#94A3B8" }}
          >
            <AlertTriangle size={16} strokeWidth={1.5} /> Signaler un incident
          </button>
        </div>
      </div>

      {/* ── Modal QR agrandi ─────────────────────────────────────────────────── */}
      {qrModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "rgba(15,23,42,0.80)" }}
          onClick={() => setQrModal(false)}
        >
          <button className="absolute top-6 right-6 text-white" onClick={() => setQrModal(false)}>
            <X size={28} strokeWidth={1.5} />
          </button>
          <div className="flex flex-col items-center">
            <QRCodeSVG
              value={`doualpark://reservation/${code}`}
              size={280}
              fgColor="#2563EB"
              bgColor="white"
              level="M"
            />
            <p className="font-mono text-lg mt-4" style={{ color: "#2563EB" }}>{code}</p>
          </div>
        </div>
      )}

      {/* ── Bottom sheet incident ─────────────────────────────────────────────── */}
      {incidentSheet && (
        <div
          className="fixed inset-0 z-[200] flex items-end"
          onClick={() => setIncidentSheet(false)}
        >
          <div className="absolute inset-0" style={{ background: "rgba(15,23,42,0.50)" }} />
          <div
            className="relative w-full bg-white rounded-t-3xl p-6 pb-10 animate-fade-in-up"
            style={{ border: "1px solid #E2E8F0" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "#E2E8F0" }} />
            <h3 className="font-space font-bold text-lg mb-4" style={{ color: "#0F172A" }}>
              Signaler un incident
            </h3>
            <textarea
              placeholder="Décrivez le problème rencontré..."
              className="w-full rounded-xl p-4 text-sm font-jakarta h-24 resize-none focus:outline-none"
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }}
            />
            <button
              onClick={() => setIncidentSheet(false)}
              className="w-full mt-4 font-jakarta font-bold text-sm rounded-xl py-3"
              style={{ background: "#0F172A", color: "white" }}
            >
              Envoyer le signalement
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Confirmation;