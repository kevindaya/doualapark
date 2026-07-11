import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { User, Car, Bell, CreditCard, Clock, Settings, Shield, ChevronRight, Info, X, Smartphone, Banknote, Trash2 } from "lucide-react";

interface Vehicle { id: number; brand: string; model: string; color: string; plate: string; }

const VEHICLES_KEY = "doualapark_vehicles";

function loadVehicles(): Vehicle[] {
  try {
    const raw = localStorage.getItem(VEHICLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const Profil = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>(loadVehicles);
  const [modal, setModal] = useState<string | null>(null);
  const [vehicleForm, setVehicleForm] = useState({ brand: "", model: "", color: "", plate: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [notifReservation, setNotifReservation] = useState(true);
  const [notifReminder, setNotifReminder] = useState(true);
  const [notifOffers, setNotifOffers] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mobile");

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  // Sauvegarde à chaque changement — survit maintenant à un changement de page.
  useEffect(() => {
    try {
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
    } catch {
      // localStorage indisponible — on ignore, ça ne doit pas casser l'app.
    }
  }, [vehicles]);

  const handleSaveVehicle = () => {
    if (!vehicleForm.plate.trim()) return;
    setVehicles(prev => [...prev, { id: Date.now(), ...vehicleForm }]);
    setVehicleForm({ brand: "", model: "", color: "", plate: "" });
    setModal(null);
  };

  const handleDeleteVehicle = (id: number) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    setDeleteConfirm(null);
  };

  const menuItems = [
    { icon: Car, title: "Mes véhicules", sub: "Gérer vos véhicules", action: () => setModal("vehicles") },
    { icon: Bell, title: "Notifications", sub: "Paramètres de notifications", action: () => setModal("notifications") },
    { icon: CreditCard, title: "Moyens de paiement", sub: "Mobile Money, Carte", action: () => setModal("payment") },
    { icon: Clock, title: "Historique", sub: "Voir vos réservations", action: () => navigate("/reservations") },
    { icon: Settings, title: "Paramètres", sub: "Préférences de l'app", action: () => setModal("settings") },
    { icon: Shield, title: "Confidentialité", sub: "Politique de données", action: () => setModal("privacy") },
  ];

  const inputStyle: React.CSSProperties = {
    background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10,
    padding: "12px 16px", color: "#0F172A", fontSize: 15,
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0" style={{ background: "#F8FAFC" }}>
      <div className="pt-[96px] pb-20 px-6 lg:px-20 max-w-lg mx-auto">
        <div className="mb-6 animate-fade-in-up">
          <h1 className="font-space font-bold text-[28px]" style={{ color: "#0F172A" }}>Mon Profil</h1>
          <p className="font-jakarta text-sm" style={{ color: "#64748B" }}>Vos préférences et historique</p>
        </div>

        <div className="rounded-xl p-3 px-4 mb-6 flex items-center gap-2 animate-fade-in-up stagger-1"
          style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
          <Info size={16} strokeWidth={1.5} style={{ color: "#2563EB" }} />
          <p className="font-jakarta text-[13px]" style={{ color: "#1D4ED8" }}>
            Connexion disponible dans une prochaine version. Vos données sont enregistrées localement.
          </p>
        </div>

        <div className="bg-white rounded-[20px] p-8 text-center mb-5 animate-fade-in-up stagger-2"
          style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="w-[72px] h-[72px] rounded-full mx-auto flex items-center justify-center gradient-primary">
            <User size={32} strokeWidth={1.5} style={{ color: "white" }} />
          </div>
          <h2 className="font-space font-bold text-xl mt-3.5" style={{ color: "#0F172A" }}>Invité</h2>
          <p className="font-jakarta text-sm mt-1" style={{ color: "#94A3B8" }}>Aucun compte connecté</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in-up stagger-3">
          {[{ value: "0", label: "Réservations" }, { value: "0", label: "Favoris" }, { value: "0 FCFA", label: "Dépensé" }].map((s, i) => (
            <div key={i} className="bg-white rounded-[14px] p-4 text-center" style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <p className="font-space font-bold text-[22px]" style={{ color: "#2563EB" }}>{s.value}</p>
              <p className="font-jakarta text-[12px] mt-1" style={{ color: "#64748B" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {vehicles.length > 0 && (
          <div className="mb-4 space-y-2 animate-fade-in-up stagger-4">
            {vehicles.map(v => (
              <div key={v.id} className="bg-white rounded-xl p-4 flex items-center justify-between" style={{ border: "1px solid #E2E8F0" }}>
                <div>
                  <p className="font-space font-bold text-sm" style={{ color: "#0F172A" }}>{v.plate}</p>
                  <p className="font-jakarta text-xs" style={{ color: "#64748B" }}>{v.brand} {v.model} {v.color && `· ${v.color}`}</p>
                </div>
                <button onClick={() => setDeleteConfirm(v.id)} className="p-1 rounded-lg transition-smooth" style={{ color: "#EF4444" }}>
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl overflow-hidden animate-fade-in-up stagger-4" style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={i} onClick={item.action}
                className="w-full flex items-center p-4 px-5 transition-all duration-150 hover:bg-[#F8FAFC]"
                style={{ borderBottom: i < menuItems.length - 1 ? "1px solid #F8FAFC" : undefined }}>
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center mr-3.5" style={{ background: "#EFF6FF" }}>
                  <Icon size={18} strokeWidth={1.5} style={{ color: "#2563EB" }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-space font-semibold text-[15px]" style={{ color: "#0F172A" }}>{item.title}</p>
                  <p className="font-jakarta text-[12px]" style={{ color: "#94A3B8" }}>{item.sub}</p>
                </div>
                <ChevronRight size={18} strokeWidth={1.5} style={{ color: "#CBD5E1" }} />
              </button>
            );
          })}
        </div>
      </div>

      {modal === "vehicles" && (
        <BottomSheet onClose={() => setModal(null)} title="Ajouter un véhicule">
          <div className="space-y-4">
            <input placeholder="Marque (ex: Toyota)" value={vehicleForm.brand} onChange={e => setVehicleForm({ ...vehicleForm, brand: e.target.value })} className="w-full font-jakarta focus:outline-none" style={inputStyle} />
            <input placeholder="Modèle (ex: Corolla)" value={vehicleForm.model} onChange={e => setVehicleForm({ ...vehicleForm, model: e.target.value })} className="w-full font-jakarta focus:outline-none" style={inputStyle} />
            <input placeholder="Couleur (ex: Gris)" value={vehicleForm.color} onChange={e => setVehicleForm({ ...vehicleForm, color: e.target.value })} className="w-full font-jakarta focus:outline-none" style={inputStyle} />
            <input placeholder="Plaque* (ex: LT 456 BB)" value={vehicleForm.plate} onChange={e => setVehicleForm({ ...vehicleForm, plate: e.target.value })} className="w-full font-jakarta focus:outline-none" style={inputStyle} />
          </div>
          <button onClick={handleSaveVehicle} disabled={!vehicleForm.plate.trim()} className="w-full mt-5 font-jakarta font-bold text-sm py-3.5 rounded-xl disabled:opacity-50"
            style={{ background: "#0F172A", color: "white" }}>Enregistrer</button>
          <button onClick={() => setModal(null)} className="w-full mt-2 font-jakarta text-sm py-3 rounded-xl hover:bg-[#F8FAFC]"
            style={{ border: "1px solid #E2E8F0", color: "#475569" }}>Annuler</button>
        </BottomSheet>
      )}

      {modal === "notifications" && (
        <BottomSheet onClose={() => setModal(null)} title="Notifications">
          <div className="space-y-4">
            <ToggleRow label="Réservations confirmées" checked={notifReservation} onChange={setNotifReservation} />
            <ToggleRow label="Rappel 30 min avant" checked={notifReminder} onChange={setNotifReminder} />
            <ToggleRow label="Offres et nouveautés" checked={notifOffers} onChange={setNotifOffers} />
          </div>
          <button onClick={() => setModal(null)} className="w-full mt-5 font-jakarta font-bold text-sm py-3.5 rounded-xl"
            style={{ background: "#0F172A", color: "white" }}>Enregistrer</button>
        </BottomSheet>
      )}

      {modal === "payment" && (
        <BottomSheet onClose={() => setModal(null)} title="Moyens de paiement">
          <div className="space-y-3">
            {[{ id: "mobile", icon: Smartphone, label: "Mobile Money" }, { id: "card", icon: CreditCard, label: "Carte bancaire" }, { id: "cash", icon: Banknote, label: "Espèces" }].map(m => {
              const Icon = m.icon;
              return (
                <button key={m.id} onClick={() => setPaymentMethod(m.id)} className="w-full flex items-center gap-3 p-4 rounded-xl transition-smooth"
                  style={{ background: paymentMethod === m.id ? "#EFF6FF" : "#F8FAFC", border: `1.5px solid ${paymentMethod === m.id ? "#2563EB" : "#E2E8F0"}` }}>
                  <Icon size={20} strokeWidth={1.5} style={{ color: paymentMethod === m.id ? "#2563EB" : "#94A3B8" }} />
                  <span className="font-jakarta text-sm font-medium" style={{ color: "#0F172A" }}>{m.label}</span>
                  {paymentMethod === m.id && <div className="ml-auto w-4 h-4 rounded-full gradient-primary" />}
                </button>
              );
            })}
          </div>
          <button onClick={() => setModal(null)} className="w-full mt-5 font-jakarta font-bold text-sm py-3.5 rounded-xl"
            style={{ background: "#0F172A", color: "white" }}>Enregistrer</button>
        </BottomSheet>
      )}

      {modal === "settings" && (
        <BottomSheet onClose={() => setModal(null)} title="Paramètres">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-jakarta text-sm" style={{ color: "#0F172A" }}>Langue</span>
              <span className="font-jakarta text-sm" style={{ color: "#94A3B8" }}>Français</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-jakarta text-sm" style={{ color: "#0F172A" }}>Thème</span>
              <span className="font-jakarta text-sm" style={{ color: "#94A3B8" }}>Mode clair</span>
            </div>
          </div>
          <button onClick={() => setModal(null)} className="w-full mt-5 font-jakarta text-sm py-3 rounded-xl hover:bg-[#F8FAFC]"
            style={{ border: "1px solid #E2E8F0", color: "#475569" }}>Fermer</button>
        </BottomSheet>
      )}

      {modal === "privacy" && (
        <BottomSheet onClose={() => setModal(null)} title="Confidentialité">
          <p className="font-jakarta text-sm leading-[1.8]" style={{ color: "#64748B" }}>
            DoualaPark respecte votre vie privée. Vos données personnelles (nom, plaque) sont utilisées uniquement pour gérer vos réservations.
            Aucune information n'est partagée avec des tiers. Les données sont stockées localement sur votre appareil.
          </p>
          <button onClick={() => setModal(null)} className="w-full mt-5 font-jakarta text-sm py-3 rounded-xl hover:bg-[#F8FAFC]"
            style={{ border: "1px solid #E2E8F0", color: "#475569" }}>Fermer</button>
        </BottomSheet>
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-6" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0" style={{ background: "rgba(15,23,42,0.50)" }} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in-up" style={{ border: "1px solid #E2E8F0" }} onClick={e => e.stopPropagation()}>
            <h3 className="font-space font-bold text-lg mb-2" style={{ color: "#0F172A" }}>Supprimer ce véhicule ?</h3>
            <p className="font-jakarta text-sm mb-6" style={{ color: "#64748B" }}>Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteVehicle(deleteConfirm)} className="flex-1 font-jakarta font-semibold text-sm py-3 rounded-[10px]"
                style={{ background: "rgba(239,68,68,0.10)", color: "#DC2626", border: "1px solid rgba(239,68,68,0.25)" }}>Supprimer</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 font-jakarta font-semibold text-sm py-3 rounded-[10px]"
                style={{ border: "1px solid #E2E8F0", color: "#475569" }}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const BottomSheet = ({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-[200] flex items-end lg:items-center justify-center" onClick={onClose}>
    <div className="absolute inset-0" style={{ background: "rgba(15,23,42,0.50)" }} />
    <div className="relative w-full lg:max-w-sm bg-white rounded-t-3xl lg:rounded-2xl p-6 pb-10 animate-fade-in-up"
      style={{ border: "1px solid #E2E8F0", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
      <div className="w-10 h-1 rounded-full mx-auto mb-5 lg:hidden" style={{ background: "#E2E8F0" }} />
      <button onClick={onClose} className="absolute top-4 right-4" style={{ color: "#94A3B8" }}><X size={20} strokeWidth={1.5} /></button>
      <h3 className="font-space font-bold text-lg mb-5" style={{ color: "#0F172A" }}>{title}</h3>
      {children}
    </div>
  </div>
);

const ToggleRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between">
    <span className="font-jakarta text-sm" style={{ color: "#0F172A" }}>{label}</span>
    <button onClick={() => onChange(!checked)} className="w-11 h-6 rounded-full relative transition-smooth"
      style={{ background: checked ? "#2563EB" : "#E2E8F0" }}>
      <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-smooth" style={{ left: checked ? 22 : 2, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
    </button>
  </div>
);

export default Profil;
