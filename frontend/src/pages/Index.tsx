import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { Search, CalendarDays, CheckCircle, ArrowRight, MapPin, Users, Clock, Zap, Map, CreditCard, Shield, Smartphone, X } from "lucide-react";

const steps = [
  { num: "01", icon: Search, title: "Localisez", text: "Visualisez les parkings disponibles autour de vous sur la carte interactive de Douala." },
  { num: "02", icon: CalendarDays, title: "Réservez", text: "Choisissez votre créneau. Entrez votre nom et plaque. Aucun compte requis." },
  { num: "03", icon: CheckCircle, title: "Stationnez", text: "Présentez votre QR code. Payez sur place. Garez-vous sans stress." },
];

const stats = [
  { icon: MapPin, value: "5", label: "Parkings" },
  { icon: Users, value: "10+", label: "Utilisateurs" },
  { icon: Clock, value: "30 sec", label: "Réservation" },
  { icon: Zap, value: "0 FCFA", label: "Inscription" },
];

const features = [
  { icon: Map, title: "Carte en temps réel", text: "Visualisez les parkings et leur disponibilité directement sur la carte." },
  { icon: Zap, title: "Réservation instantanée", text: "Réservez en quelques secondes, sans créer de compte." },
  { icon: CreditCard, title: "Paiement simplifié", text: "En espèces sur place." },
  { icon: Shield, title: "Sécurité garantie", text: "QR code unique et suivi de chaque réservation." },
  { icon: Clock, title: "Historique complet", text: "Retrouvez toutes vos réservations passées et en cours." },
  { icon: Smartphone, title: "Application mobile", text: "Accédez à DoualaPark depuis n'importe quel smartphone." },
];

const Index = () => {
  const [stepModal, setStepModal] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* HERO */}
      <section className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1600&q=80')" }} />
        <div className="absolute inset-0 z-[1]"
          style={{ background: "linear-gradient(to bottom, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.65) 60%, rgba(10,15,30,0.85) 100%)" }} />

        <div className="relative z-[2] max-w-[700px] mx-auto text-center px-6">
          <div className="animate-fade-in-up stagger-1 inline-flex items-center gap-2 px-4 py-[6px] rounded-full mb-7"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <span className="w-[6px] h-[6px] rounded-full animate-pulse-dot" style={{ background: "#10B981" }} />
            <span className="text-[13px] font-jakarta font-medium text-white">Parking intelligent à Douala</span>
          </div>

          <h1 className="animate-fade-in-up stagger-2 font-space font-extrabold text-[38px] lg:text-[64px] leading-[1.05] tracking-[-2px] text-white mb-5">
            Le futur du parking urbain à Douala
          </h1>

          <p className="animate-fade-in-up stagger-3 font-jakarta text-lg max-w-[520px] mx-auto mb-9 leading-[1.7]" style={{ color: "rgba(255,255,255,0.80)" }}>
            Trouvez, réservez et accédez à votre place en moins de 30 secondes. Sans compte, sans stress.
          </p>

          <div className="animate-fade-in-up stagger-4 flex flex-wrap justify-center gap-3">
            <Link to="/rechercher" className="font-jakarta font-bold text-[15px] rounded-[50px] px-8 py-[15px] hover:-translate-y-[2px] transition-smooth inline-flex items-center gap-2 active:scale-[0.98]"
              style={{ background: "white", color: "#0F172A" }}>
              <Search size={18} strokeWidth={1.5} />
              Trouver une place
            </Link>
            <a href="#steps" className="font-jakarta font-semibold text-[15px] text-white rounded-[50px] px-8 py-[15px] transition-smooth hover:bg-white/10 inline-flex items-center gap-2"
              style={{ border: "1.5px solid rgba(255,255,255,0.40)" }}>
              Comment ça marche
              <ArrowRight size={16} strokeWidth={1.5} />
            </a>
          </div>

          <div className="animate-fade-in-up stagger-5 flex items-center justify-center gap-12 mt-14">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-12">
                {i > 0 && <div className="h-10 w-px hidden sm:block" style={{ background: "rgba(255,255,255,0.15)" }} />}
                <div className="text-center">
                  <p className="font-space font-bold text-[30px] text-white">{stat.value}</p>
                  <p className="font-jakarta text-[13px]" style={{ color: "rgba(255,255,255,0.65)" }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-white py-7 px-6 lg:px-12" style={{ borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex items-center gap-4">
                {i > 0 && <div className="h-10 w-px hidden sm:block" style={{ background: "#E2E8F0" }} />}
                <div className="flex items-center gap-3">
                  <Icon size={20} style={{ color: "#2563EB" }} strokeWidth={1.5} />
                  <div>
                    <p className="font-space font-bold text-xl lg:text-[22px]" style={{ color: "#0F172A" }}>{stat.value}</p>
                    <p className="font-jakarta text-[14px]" style={{ color: "#64748B" }}>{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STEPS */}
      <section id="steps" className="py-24 px-6 lg:px-12" style={{ background: "#F8FAFC" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-5 h-px" style={{ background: "#2563EB" }} />
            <span className="text-xs font-jakarta tracking-[0.15em] uppercase font-medium" style={{ color: "#2563EB" }}>Processus</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-[42px]" style={{ color: "#0F172A" }}>Réservez en 3 étapes</h2>
          <p className="font-jakarta text-[17px] mt-2 mb-16" style={{ color: "#64748B" }}>Simple, rapide et accessible depuis tout smartphone.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i}
                  className={`relative p-10 bg-white transition-smooth hover:shadow-md ${
                    i === 0 ? "rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none" :
                    i === 2 ? "rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none" : ""
                  }`}
                  style={{ border: "1px solid #E2E8F0", borderRight: i < 2 ? undefined : undefined }}
                >
                  <span className="absolute top-4 right-4 font-space text-[80px] font-bold leading-none" style={{ color: "#F1F5F9" }}>{step.num}</span>
                  <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-6" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                    <Icon size={24} style={{ color: "#2563EB" }} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-space font-bold text-[22px] mb-3" style={{ color: "#0F172A" }}>{step.title}</h3>
                  <p className="font-jakarta text-sm leading-[1.7] mb-4" style={{ color: "#64748B" }}>{step.text}</p>
                  <button onClick={() => setStepModal(i)} className="text-sm font-jakarta font-medium inline-flex items-center gap-1 hover:gap-2 transition-smooth hover:underline"
                    style={{ color: "#2563EB" }}>
                    En savoir plus <ArrowRight size={14} strokeWidth={1.5} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-5 h-px" style={{ background: "#2563EB" }} />
            <span className="text-xs font-jakarta tracking-[0.15em] uppercase font-medium" style={{ color: "#2563EB" }}>Fonctionnalités</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-[42px] mb-16" style={{ color: "#0F172A" }}>Tout ce dont vous avez besoin</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="rounded-2xl p-7 transition-all duration-250 hover:-translate-y-1 hover:shadow-md hover:bg-white"
                  style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#BFDBFE"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; }}
                >
                  <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-4" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                    <Icon size={24} style={{ color: "#2563EB" }} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-space font-bold text-base mb-2" style={{ color: "#0F172A" }}>{feat.title}</h3>
                  <p className="font-jakarta text-sm leading-[1.6]" style={{ color: "#64748B" }}>{feat.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 lg:mx-12 mb-20 mt-10">
        <div className="rounded-3xl px-8 lg:px-16 py-[72px] flex flex-col lg:flex-row items-center justify-between gap-8 gradient-cta">
          <div>
            <h2 className="font-space font-bold text-3xl lg:text-[38px] text-white mb-3">Prêt à simplifier vos déplacements ?</h2>
            <p className="font-jakarta text-base" style={{ color: "rgba(255,255,255,0.70)" }}>Trouvez votre parking idéal en quelques clics.</p>
          </div>
          <Link to="/rechercher" className="font-jakarta font-bold text-base rounded-[50px] px-10 py-4 hover:-translate-y-[2px] transition-smooth whitespace-nowrap inline-flex items-center gap-2 active:scale-[0.98]"
            style={{ background: "white", color: "#0F172A" }}>
            <Search size={18} strokeWidth={1.5} />
            Rechercher un parking
          </Link>
        </div>
      </section>

      {/* Step modal */}
      {stepModal !== null && (
        <div className="fixed inset-0 z-[200] flex items-end lg:items-center justify-center" onClick={() => setStepModal(null)}>
          <div className="absolute inset-0" style={{ background: "rgba(15,23,42,0.50)" }} />
          <div className="relative w-full lg:max-w-md bg-white rounded-t-3xl lg:rounded-2xl p-6 pb-10 animate-fade-in-up"
            style={{ border: "1px solid #E2E8F0" }} onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5 lg:hidden" style={{ background: "#E2E8F0" }} />
            <button onClick={() => setStepModal(null)} className="absolute top-4 right-4" style={{ color: "#94A3B8" }}>
              <X size={20} strokeWidth={1.5} />
            </button>
            <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-4" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
              {(() => { const Icon = steps[stepModal].icon; return <Icon size={24} style={{ color: "#2563EB" }} strokeWidth={1.5} />; })()}
            </div>
            <h3 className="font-space font-bold text-xl mb-3" style={{ color: "#0F172A" }}>Étape {steps[stepModal].num} — {steps[stepModal].title}</h3>
            <p className="font-jakarta text-sm leading-[1.8]" style={{ color: "#64748B" }}>{steps[stepModal].text}</p>
            <p className="font-jakarta text-sm leading-[1.8] mt-3" style={{ color: "#64748B" }}>
              {stepModal === 0 && "Utilisez la carte interactive pour repérer les parkings autour de vous. Filtrez par prix, distance ou disponibilité."}
              {stepModal === 1 && "Remplissez simplement votre nom et numéro de plaque. Choisissez l'heure de début et de fin. Aucun compte n'est nécessaire."}
              {stepModal === 2 && "Un QR code unique est généré pour votre réservation. Présentez-le à l'agent à l'entrée du parking."}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Index;
