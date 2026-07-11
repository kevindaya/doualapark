// src/pages/Reservations.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { reservationsAPI } from "@/lib/api";
import type { ReservationAPI } from "@/lib/api";
import {
  CalendarDays,
  MapPin,
  Clock,
  Car,
  CreditCard,
  X,
  ArrowRight,
  Search,
  Star,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const statusConfig = {
  en_cours: {
    label: "En cours",
    bg: "rgba(37,99,235,0.10)",
    color: "#2563EB",
    border: "rgba(37,99,235,0.25)",
  },
  terminee: {
    label: "Terminée",
    bg: "rgba(16,185,129,0.10)",
    color: "#059669",
    border: "rgba(16,185,129,0.25)",
  },
  annulee: {
    label: "Annulée",
    bg: "rgba(239,68,68,0.10)",
    color: "#DC2626",
    border: "rgba(239,68,68,0.25)",
  },
};

const tabs = ["Toutes", "En cours", "Terminées", "Annulées"];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Calcul distance Haversine
function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const Reservations = () => {
  const [reservations, setReservations] = useState<ReservationAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLocalUser, setHasLocalUser] = useState(false);
  const [activeTab, setActiveTab] = useState("Toutes");
  const [selected, setSelected] = useState<ReservationAPI | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSent, setReviewSent] = useState(false);

  // Charge l'historique d'un utilisateur donné (id_user)
  const loadReservations = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await reservationsAPI.getAll();
      setReservations(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  loadReservations();
}, []);

  // Calculer la distance dynamique quand une réservation est sélectionnée
  useEffect(() => {
    if (!selected) {
      setDistance(null);
      return;
    }

    if (!navigator.geolocation) {
      setDistance(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = haversine(
          pos.coords.latitude,
          pos.coords.longitude,
          selected.lat || 0,
          selected.lng || 0,
        );
        setDistance(dist);
      },
      () => {
        setDistance(null);
      },
      { timeout: 5000, maximumAge: 30000 },
    );
  }, [selected]);

  const handleCancel = async () => {
    if (!selected) return;
    setCancelling(true);
    try {
      await reservationsAPI.annuler(selected.id_reservation);
      setReservations((prev) =>
        prev.map((r) =>
          r.id_reservation === selected.id_reservation
            ? { ...r, statut: "annulee" as const }
            : r,
        ),
      );
      setSelected((prev) => (prev ? { ...prev, statut: "annulee" } : null));
      setCancelConfirm(false);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setCancelling(false);
    }
  };

  const filtered = reservations.filter((r) => {
    if (activeTab === "Toutes") return true;
    if (activeTab === "En cours") return r.statut === "en_cours";
    if (activeTab === "Terminées") return r.statut === "terminee";
    if (activeTab === "Annulées") return r.statut === "annulee";
    return true;
  });

  const totalSpent = reservations
    .filter((r) => r.statut !== "annulee")
    .reduce((s, r) => s + r.prix_reservation, 0);
  const enCours = reservations.filter((r) => r.statut === "en_cours").length;

  return (
    <div
      className="min-h-screen pb-20 lg:pb-0"
      style={{ background: "#F8FAFC" }}
    >
      <div className="pt-[96px] pb-20 px-6 lg:px-20 max-w-5xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1
            className="font-space font-bold text-3xl"
            style={{ color: "#0F172A" }}
          >
            Mes Réservations
          </h1>
          <p className="font-jakarta text-sm mt-1" style={{ color: "#64748B" }}>
            Historique et réservations en cours
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2
              size={32}
              className="animate-spin"
              style={{ color: "#2563EB" }}
            />
          </div>
        )}

        {error && !loading && (
          <div
            className="rounded-xl px-4 py-3 text-sm font-jakarta flex items-center gap-2 mb-6"
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
            }}
          >
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up stagger-1">
              {[
                { label: "Total", value: reservations.length.toString() },
                { label: "En cours", value: enCours.toString() },
                { label: "Dépensé", value: `${totalSpent.toLocaleString()} F` },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4"
                  style={{
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <p
                    className="font-space font-bold text-xl"
                    style={{ color: "#2563EB" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="font-jakarta text-[13px]"
                    style={{ color: "#64748B" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="flex gap-0 mb-6 animate-fade-in-up stagger-2"
              style={{ borderBottom: "1px solid #E2E8F0" }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="font-jakarta text-sm px-4 py-3 transition-smooth relative"
                  style={{
                    color: activeTab === tab ? "#0F172A" : "#94A3B8",
                    fontWeight: activeTab === tab ? 600 : 400,
                  }}
                >
                  {tab}
                  {activeTab === tab && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: "#0F172A" }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-4 animate-fade-in-up stagger-3">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <CalendarDays
                    size={64}
                    strokeWidth={1}
                    style={{ color: "#CBD5E1" }}
                    className="mb-4"
                  />
                  <p
                    className="font-jakarta text-base mb-4"
                    style={{ color: "#64748B" }}
                  >
                    {reservations.length === 0
                      ? "Aucune réservation pour l'instant"
                      : activeTab === "En cours"
                        ? "Aucune réservation en cours"
                        : activeTab === "Terminées"
                          ? "Aucune réservation terminée"
                          : activeTab === "Annulées"
                            ? "Aucune réservation annulée"
                            : "Aucune réservation"}
                  </p>
                  {reservations.length === 0 && (
                    <Link
                      to="/rechercher"
                      className="font-jakarta font-semibold text-sm rounded-[10px] px-6 py-3 inline-flex items-center gap-2"
                      style={{ background: "#0F172A", color: "white" }}
                    >
                      <Search size={16} strokeWidth={1.5} /> Réserver un parking
                    </Link>
                  )}
                </div>
              ) : (
                filtered.map((r) => {
                  const sc = statusConfig[r.statut];
                  return (
                    <div
                      key={r.id_reservation}
                      onClick={() => {
                        setSelected(r);
                        setReviewSent(false);
                        setReviewStars(0);
                        setReviewText("");
                      }}
                      className="bg-white rounded-2xl p-5 transition-smooth cursor-pointer hover:-translate-y-0.5"
                      style={{ border: "1px solid #E2E8F0" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "#BFDBFE";
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          "0 4px 16px rgba(0,0,0,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "#E2E8F0";
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          "none";
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3
                            className="font-space font-bold text-base"
                            style={{ color: "#0F172A" }}
                          >
                            {r.parking_nom ?? `Parking #${r.id_parking}`}
                          </h3>
                          <span
                            className="text-[11px] font-jakarta font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: sc.bg,
                              color: sc.color,
                              border: `1px solid ${sc.border}`,
                            }}
                          >
                            {sc.label}
                          </span>
                        </div>
                        {r.statut === "en_cours" && (
                          <span
                            className="text-[11px] font-jakarta px-2 py-0.5 rounded-full"
                            style={{
                              background: "rgba(239,68,68,0.10)",
                              color: "#DC2626",
                              border: "1px solid rgba(239,68,68,0.25)",
                            }}
                          >
                            Annulable
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        {[
                          {
                            icon: MapPin,
                            text: (r.parking_adresse ?? "—").split(",")[0],
                          },
                          {
                            icon: CalendarDays,
                            text: formatDate(r.date_reservation),
                          },
                          {
                            icon: Clock,
                            text: `${r.heure_debut.slice(0, 5)} - ${r.heure_fin.slice(0, 5)}`,
                          },
                          { icon: Car, text: r.numero_plaque ?? "—" },
                        ].map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 text-xs font-jakarta"
                              style={{ color: "#64748B" }}
                            >
                              <Icon size={12} strokeWidth={1.5} /> {item.text}
                            </div>
                          );
                        })}
                      </div>
                      <div
                        className="flex items-center justify-between pt-3"
                        style={{ borderTop: "1px solid #F1F5F9" }}
                      >
                        <span
                          className="font-space font-bold text-lg"
                          style={{ color: "#F59E0B" }}
                        >
                          {r.prix_reservation.toLocaleString()} FCFA
                        </span>
                        <button
                          className="text-sm font-jakarta font-medium inline-flex items-center gap-1 hover:gap-2 transition-smooth"
                          style={{ color: "#2563EB" }}
                        >
                          Voir détails{" "}
                          <ArrowRight size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal détail */}
      {selected && !cancelConfirm && !reviewModal && (
        <div
          className="fixed inset-0 z-[200] flex items-end lg:items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(15,23,42,0.50)" }}
          />
          <div
            className="relative w-full lg:max-w-md bg-white rounded-t-3xl lg:rounded-2xl p-6 pb-10 animate-fade-in-up"
            style={{ border: "1px solid #E2E8F0" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-10 h-1 rounded-full mx-auto mb-5 lg:hidden"
              style={{ background: "#E2E8F0" }}
            />
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4"
              style={{ color: "#94A3B8" }}
            >
              <X size={20} strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <h3
                className="font-space font-bold text-lg"
                style={{ color: "#0F172A" }}
              >
                {selected.parking_nom ?? `Parking #${selected.id_parking}`}
              </h3>
              <span
                className="text-[11px] font-jakarta font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: statusConfig[selected.statut].bg,
                  color: statusConfig[selected.statut].color,
                }}
              >
                {statusConfig[selected.statut].label}
              </span>
            </div>
            {selected.statut === "en_cours" && (
              <div className="flex flex-col items-center mb-4">
                <QRCodeSVG
                  value={`doualpark://reservation/${selected.code_qr}`}
                  size={150}
                  fgColor="#2563EB"
                  bgColor="white"
                  level="M"
                />
                <div
                  className="mt-3 rounded-lg px-4 py-1.5"
                  style={{ background: "#EFF6FF" }}
                >
                  <span
                    className="font-mono text-sm"
                    style={{ color: "#2563EB" }}
                  >
                    {selected.code_qr}
                  </span>
                </div>
                <p
                  className="text-xs font-jakarta mt-2"
                  style={{ color: "#94A3B8" }}
                >
                  Présentez à l'agent à l'entrée
                </p>
              </div>
            )}
            <div
              className="rounded-xl p-4 mb-4 space-y-3"
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
            >
              {[
                {
                  icon: MapPin,
                  label: "Adresse",
                  value: selected.parking_adresse ?? "—",
                },
                {
                  icon: MapPin,
                  label: "Distance",
                  value:
                    distance !== null
                      ? `${distance.toFixed(1)} km`
                      : "Activez votre géolocalisation",
                },
                {
                  icon: CalendarDays,
                  label: "Date",
                  value: formatDate(selected.date_reservation),
                },
                {
                  icon: Clock,
                  label: "Créneau",
                  value: `${selected.heure_debut.slice(0, 5)} → ${selected.heure_fin.slice(0, 5)}`,
                },
                {
                  icon: Car,
                  label: "Plaque",
                  value: selected.numero_plaque ?? "—",
                },
                {
                  icon: CreditCard,
                  label: "Montant",
                  value: `${selected.prix_reservation.toLocaleString()} FCFA`,
                },
              ].map((d, i) => {
                const Icon = d.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <Icon
                      size={14}
                      strokeWidth={1.5}
                      style={{ color: "#94A3B8" }}
                    />
                    <span
                      className="text-xs font-jakarta w-16"
                      style={{ color: "#94A3B8" }}
                    >
                      {d.label}
                    </span>
                    <span
                      className="text-sm font-jakarta font-medium"
                      style={{ color: "#0F172A" }}
                    >
                      {d.value}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              className="font-mono text-center text-sm mb-4"
              style={{ color: "#94A3B8" }}
            >
              {selected.code_qr}
            </div>
            <div className="space-y-3">
              {selected.statut === "en_cours" && (
                <button
                  onClick={() => setCancelConfirm(true)}
                  className="w-full font-jakarta font-semibold text-sm py-3 rounded-[10px]"
                  style={{
                    background: "rgba(239,68,68,0.10)",
                    color: "#DC2626",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }}
                >
                  Annuler la réservation
                </button>
              )}
              {selected.statut === "terminee" && (
                <button
                  onClick={() => setReviewModal(true)}
                  className="w-full font-jakarta font-semibold text-sm py-3 rounded-[10px]"
                  style={{ background: "#0F172A", color: "white" }}
                >
                  Laisser un avis
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="w-full font-jakarta font-semibold text-sm py-3 rounded-[10px] transition-smooth hover:bg-[#F8FAFC]"
                style={{ border: "1px solid #E2E8F0", color: "#475569" }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation annulation */}
      {cancelConfirm && selected && (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center p-6"
          onClick={() => setCancelConfirm(false)}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(15,23,42,0.50)" }}
          />
          <div
            className="relative bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in-up"
            style={{ border: "1px solid #E2E8F0" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="font-space font-bold text-lg mb-2"
              style={{ color: "#0F172A" }}
            >
              Êtes-vous sûr ?
            </h3>
            <p
              className="font-jakarta text-sm mb-6"
              style={{ color: "#64748B" }}
            >
              Cette action annulera définitivement votre réservation et libérera
              la place.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 font-jakarta font-semibold text-sm py-3 rounded-[10px] inline-flex items-center justify-center gap-2 disabled:opacity-60"
                style={{
                  background: "rgba(239,68,68,0.10)",
                  color: "#DC2626",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                {cancelling ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Annulation…
                  </>
                ) : (
                  "Oui, annuler"
                )}
              </button>
              <button
                onClick={() => setCancelConfirm(false)}
                className="flex-1 font-jakarta font-semibold text-sm py-3 rounded-[10px]"
                style={{ border: "1px solid #E2E8F0", color: "#475569" }}
              >
                Non, garder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal avis */}
      {reviewModal && selected && (
        <div
          className="fixed inset-0 z-[210] flex items-end lg:items-center justify-center"
          onClick={() => setReviewModal(false)}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(15,23,42,0.50)" }}
          />
          <div
            className="relative w-full lg:max-w-sm bg-white rounded-t-3xl lg:rounded-2xl p-6 pb-10 animate-fade-in-up"
            style={{ border: "1px solid #E2E8F0" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-10 h-1 rounded-full mx-auto mb-5 lg:hidden"
              style={{ background: "#E2E8F0" }}
            />
            <h3
              className="font-space font-bold text-lg mb-4"
              style={{ color: "#0F172A" }}
            >
              Votre avis
            </h3>
            {!reviewSent ? (
              <>
                <div className="flex gap-2 justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setReviewStars(s)}>
                      <Star
                        size={28}
                        strokeWidth={1.5}
                        fill={s <= reviewStars ? "#F59E0B" : "none"}
                        style={{
                          color: s <= reviewStars ? "#F59E0B" : "#CBD5E1",
                        }}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Votre avis..."
                  className="w-full rounded-xl p-4 text-sm font-jakarta h-20 resize-none focus:outline-none mb-4"
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    color: "#0F172A",
                  }}
                />
                <button
                  onClick={() => setReviewSent(true)}
                  disabled={reviewStars === 0}
                  className="w-full font-jakarta font-semibold text-sm py-3 rounded-xl disabled:opacity-50"
                  style={{ background: "#0F172A", color: "white" }}
                >
                  Envoyer
                </button>
              </>
            ) : (
              <div className="text-center py-6">
                <CheckCircle
                  size={40}
                  style={{ color: "#059669" }}
                  className="mx-auto mb-3"
                  strokeWidth={1.5}
                />
                <p
                  className="font-jakarta font-semibold"
                  style={{ color: "#059669" }}
                >
                  Avis envoyé
                </p>
                <button
                  onClick={() => {
                    setReviewModal(false);
                    setSelected(null);
                  }}
                  className="mt-4 font-jakarta text-sm"
                  style={{ color: "#94A3B8" }}
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Reservations;
