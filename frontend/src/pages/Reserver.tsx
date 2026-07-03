// src/pages/Reserver.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { parkings } from "@/data/parkings";
import { useParkingById } from "@/hooks/useParkings";
import { useReserver } from "@/hooks/useReservation";
import Footer from "@/components/Footer";
import {
  User, Car, Clock, Shield, Info, ArrowRight, AlertCircle, Loader2,
} from "lucide-react";

const Reserver = () => {
  const { id } = useParams();
  const navigate  = useNavigate();
  const parkingId = Number(id);

  const { parking: parkingAPI, loading: loadingParking } = useParkingById(parkingId);
  const parkingLocal = parkings.find(p => p.id === parkingId) || parkings[0];
  const parking = parkingAPI ?? parkingLocal;

  const [form, setForm]     = useState({ name: "", plate: "", start: "08:00", end: "10:00" });
  const [errors, setErrors] = useState<{ name?: string; plate?: string; time?: string }>({});

  const { soumettre, loading: submitting, error: apiError } = useReserver();

  const duration = (() => {
    const [sh, sm] = form.start.split(":").map(Number);
    const [eh, em] = form.end.split(":").map(Number);
    return Math.max(1, Math.ceil((eh * 60 + em - sh * 60 - sm) / 60));
  })();
  const total = duration * parking.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!form.name.trim())  newErrors.name  = "Champ requis";
    if (!form.plate.trim()) newErrors.plate = "Champ requis";

    const [sh, sm] = form.start.split(":").map(Number);
    const [eh, em] = form.end.split(":").map(Number);
    if (eh * 60 + em <= sh * 60 + sm) {
      newErrors.time = "L'heure de fin doit être après l'heure de début";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const result = await soumettre({
      nom:           form.name.trim(),
      numero_plaque: form.plate.trim(),
      id_parking:    parkingId,
      heure_debut:   form.start,
      heure_fin:     form.end,
    });

    if (result) {
      navigate(`/confirmation/${parking.id}`, {
        state: {
          code_qr:        result.code_qr,
          id_reservation: result.id_reservation,
          prix:           result.prix_reservation,
          heure_debut:    result.heure_debut,
          heure_fin:      result.heure_fin,
          parking_nom:    result.parking_nom ?? parking.name,
          plaque:         form.plate.trim().toUpperCase(),
        },
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0" style={{ background: "#F8FAFC" }}>
      <div className="bg-white flex flex-col items-center justify-center pt-[68px] py-6"
        style={{ borderBottom: "1px solid #E2E8F0" }}>
        <p className="text-xs font-jakarta mb-2" style={{ color: "#94A3B8" }}>
          Accueil / Parkings / {parking.name}
        </p>
        <h1 className="font-space font-bold text-2xl lg:text-3xl" style={{ color: "#0F172A" }}>
          {parking.name}
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <form onSubmit={handleSubmit}
          className="lg:col-span-3 bg-white rounded-2xl p-8 animate-fade-in-up"
          style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

          <h2 className="font-space font-bold text-xl mb-6" style={{ color: "#0F172A" }}>
            Vos informations
          </h2>

          {apiError && (
            <div className="mb-5 rounded-xl px-4 py-3 text-sm font-jakarta flex items-center gap-2"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
              <AlertCircle size={16} /> {apiError}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-xs font-jakarta uppercase tracking-[0.05em] mb-2 flex items-center gap-1.5"
                style={{ color: "#94A3B8" }}>
                <User size={12} strokeWidth={1.5} /> Nom complet
              </label>
              <input
                value={form.name}
                onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }); }}
                placeholder="Ex : Jean Mbarga"
                className="w-full rounded-xl px-4 py-3.5 text-sm font-jakarta focus:outline-none transition-smooth"
                style={{ background: "#F8FAFC", border: errors.name ? "1px solid #EF4444" : "1px solid #E2E8F0", color: "#0F172A" }}
              />
              {errors.name && (
                <p className="text-xs mt-1 font-jakarta flex items-center gap-1" style={{ color: "#EF4444" }}>
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-jakarta uppercase tracking-[0.05em] mb-2 flex items-center gap-1.5"
                style={{ color: "#94A3B8" }}>
                <Car size={12} strokeWidth={1.5} /> Numéro de plaque
              </label>
              <input
                value={form.plate}
                onChange={e => { setForm({ ...form, plate: e.target.value }); setErrors({ ...errors, plate: undefined }); }}
                placeholder="Ex : LT 456 BB"
                className="w-full rounded-xl px-4 py-3.5 text-sm font-jakarta focus:outline-none transition-smooth"
                style={{ background: "#F8FAFC", border: errors.plate ? "1px solid #EF4444" : "1px solid #E2E8F0", color: "#0F172A" }}
              />
              {errors.plate && (
                <p className="text-xs mt-1 font-jakarta flex items-center gap-1" style={{ color: "#EF4444" }}>
                  <AlertCircle size={12} /> {errors.plate}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-jakarta uppercase tracking-[0.05em] mb-2 flex items-center gap-1.5"
                  style={{ color: "#94A3B8" }}>
                  <Clock size={12} strokeWidth={1.5} /> Heure début
                </label>
                <input type="time" value={form.start}
                  onChange={e => { setForm({ ...form, start: e.target.value }); setErrors({ ...errors, time: undefined }); }}
                  className="w-full rounded-xl px-4 py-3.5 text-sm font-jakarta focus:outline-none"
                  style={{ background: "#F8FAFC", border: errors.time ? "1px solid #EF4444" : "1px solid #E2E8F0", color: "#0F172A" }}
                />
              </div>
              <div>
                <label className="text-xs font-jakarta uppercase tracking-[0.05em] mb-2 flex items-center gap-1.5"
                  style={{ color: "#94A3B8" }}>
                  <Clock size={12} strokeWidth={1.5} /> Heure fin
                </label>
                <input type="time" value={form.end}
                  onChange={e => { setForm({ ...form, end: e.target.value }); setErrors({ ...errors, time: undefined }); }}
                  className="w-full rounded-xl px-4 py-3.5 text-sm font-jakarta focus:outline-none"
                  style={{ background: "#F8FAFC", border: errors.time ? "1px solid #EF4444" : "1px solid #E2E8F0", color: "#0F172A" }}
                />
              </div>
            </div>
            {errors.time && (
              <p className="text-xs font-jakarta flex items-center gap-1" style={{ color: "#EF4444" }}>
                <AlertCircle size={12} /> {errors.time}
              </p>
            )}

            <div className="rounded-xl px-4 py-3 text-sm font-jakarta flex items-center gap-2"
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#475569" }}>
              <Clock size={14} strokeWidth={1.5} style={{ color: "#94A3B8" }} />
              Durée : {duration}h — Total estimé :&nbsp;
              <span className="font-bold font-space" style={{ color: "#F59E0B" }}>
                {total.toLocaleString()} FCFA
              </span>
            </div>

            {/* Paiement : info fixe, pas de choix */}
            <div className="rounded-xl px-4 py-4 flex items-start gap-3"
              style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
              <Info size={16} strokeWidth={1.5} style={{ color: "#2563EB", marginTop: 1, flexShrink: 0 }} />
              <div>
                <p className="font-jakarta font-semibold text-sm" style={{ color: "#1D4ED8" }}>
                  Paiement sur place en espèces
                </p>
                <p className="font-jakarta text-xs mt-0.5" style={{ color: "#3B82F6" }}>
                  Réglez directement à l'agent à l'entrée du parking
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || loadingParking}
            className="w-full mt-8 font-jakarta font-bold text-base rounded-[14px] py-4 hover:-translate-y-[2px] transition-smooth active:scale-[0.98] inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{ background: "#0F172A", color: "white" }}>
            {submitting
              ? <><Loader2 size={18} className="animate-spin" /> Réservation en cours…</>
              : <>Confirmer ma réservation <ArrowRight size={18} strokeWidth={1.5} /></>
            }
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4 animate-fade-in-up stagger-2">
          <div className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 className="font-space font-bold text-lg mb-4" style={{ color: "#0F172A" }}>Récapitulatif</h3>
            <div className="rounded-xl p-4 mb-4" style={{ background: "#F8FAFC", borderLeft: "3px solid #2563EB" }}>
              <p className="font-space font-bold text-sm" style={{ color: "#0F172A" }}>{parking.name}</p>
              <p className="text-xs font-jakarta mt-1" style={{ color: "#94A3B8" }}>{parking.address}</p>
            </div>
            <div className="space-y-3 text-sm font-jakarta">
              <div className="flex justify-between">
                <span style={{ color: "#64748B" }}>Tarif horaire</span>
                <span style={{ color: "#0F172A" }}>{parking.price} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#64748B" }}>Durée</span>
                <span style={{ color: "#0F172A" }}>{duration}h</span>
              </div>
              <div className="h-px" style={{ background: "#F1F5F9" }} />
              <div className="flex justify-between">
                <span style={{ color: "#64748B" }}>Total</span>
                <span className="font-space font-bold text-lg" style={{ color: "#F59E0B" }}>
                  {total.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 flex items-center gap-3" style={{ border: "1px solid #E2E8F0" }}>
            <Shield size={18} strokeWidth={1.5} style={{ color: "#94A3B8" }} />
            <span className="text-xs font-jakarta" style={{ color: "#64748B" }}>
              QR code unique généré à la confirmation
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Reserver;