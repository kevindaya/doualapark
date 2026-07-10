// src/lib/api.ts
// ─── Couche API centralisée — tous les appels vers le backend ────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// ─── Types qui correspondent exactement à ce que renvoie le backend ──────────

export interface ParkingAPI {
  id: number;
  nom: string;
  quartier: string;
  adresse: string;
  place_occupee: number;
  place_total: number;
  taux_occupation: number;
  note: number;
  distance: number | null;
  prix: number;
  statut: "libre" | "quasi-plein" | "complet";
  couleur: string;
  image: string;
  lat: number;
  lng: number;
}

export interface UtilisateurAPI {
  id_user: number;
  nom: string;
  numero_plaque: string;
}

export interface ReservationAPI {
  id_reservation: number;
  heure_debut: string;
  heure_fin: string;
  prix_reservation: number;
  date_reservation: string;
  statut: "en_cours" | "terminee" | "annulee";
  code_qr: string;
  id_user: number;
  id_parking: number;
  parking_nom?: string;
  parking_adresse?: string;
  parking_quartier?: string;
  parking_image?: string;
  lat?: number;
  lng?: number;
  user_nom?: string;
  numero_plaque?: string;
}

export interface StatsAPI {
  total_parkings: number;
  total_places: number;
  places_occupees: number;
  places_libres: number;
  parkings_libres: number;
  parkings_quasi_pleins: number;
  parkings_complets: number;
  note_moyenne: number;
}

// ─── Helper fetch générique ───────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const json = await res.json();

  if (!res.ok || (typeof json === "object" && json?.success === false)) {
    throw new Error(json?.message || `Erreur ${res.status}`);
  }

  const payload = json?.data ?? json;
  return payload as T;
}

// ─── Parkings ────────────────────────────────────────────────────────────────

export const parkingsAPI = {
  getAll: (params?: { statut?: string; quartier?: string }) => {
    const qs = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    return apiFetch<ParkingAPI[]>(`/parkings${qs}`);
  },

  getById: (id: number) => apiFetch<ParkingAPI>(`/parkings/${id}`),

  getDisponibles: () => apiFetch<ParkingAPI[]>("/parkings/disponibles"),

  getStats: () => apiFetch<StatsAPI>("/parkings/stats"),
};

// ─── Utilisateurs ────────────────────────────────────────────────────────────

export const utilisateursAPI = {
  // Crée ou retrouve un utilisateur par sa plaque
  createOrGet: (nom: string, numero_plaque: string) =>
    apiFetch<UtilisateurAPI>("/utilisateurs", {
      method: "POST",
      body: JSON.stringify({ nom, numero_plaque }),
    }),

  getByPlaque: (plaque: string) =>
    apiFetch<UtilisateurAPI>(
      `/utilisateurs/plaque/${encodeURIComponent(plaque)}`,
    ),

  getById: (id: number) => apiFetch<UtilisateurAPI>(`/utilisateurs/${id}`),
};

// ─── Réservations ─────────────────────────────────────────────────────────────

export interface CreerReservationPayload {
  id_user: number;
  id_parking: number;
  heure_debut: string; // "HH:MM"
  heure_fin: string; // "HH:MM"
  date_reservation?: string; // "YYYY-MM-DD", optionnel (défaut = aujourd'hui)
}

export const reservationsAPI = {
  creer: (payload: CreerReservationPayload) =>
    apiFetch<ReservationAPI>("/reservations", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getByUser: (id_user: number, statut?: string) => {
    const qs = statut ? `?statut=${statut}` : "";
    return apiFetch<ReservationAPI[]>(`/reservations/user/${id_user}${qs}`);
  },

  getById: (id: number) => apiFetch<ReservationAPI>(`/reservations/${id}`),

  getByQR: (code: string) =>
    apiFetch<ReservationAPI>(`/reservations/qr/${code}`),

  terminer: (id: number) =>
    apiFetch<void>(`/reservations/${id}/terminer`, { method: "PATCH" }),

  annuler: (id: number) =>
    apiFetch<void>(`/reservations/${id}/annuler`, { method: "PATCH" }),
};

// ─── Adaptateur : convertit ParkingAPI → format Parking du frontend ──────────
// Utilisé pour garder la compatibilité avec les composants existants
// qui utilisent encore name/address/price/etc.

import type { Parking } from "@/data/parkings";

// ─── Cache-busting pour les images ────────────────────────────────────────────
// Ajoute un paramètre à l'URL pour éviter le cache du navigateur/CDN
function addCacheBusting(imageUrl: string): string {
  if (!imageUrl) return imageUrl;
  try {
    const url = new URL(imageUrl);
    // Ajouter un paramètre de cache-busting si ce n'est pas déjà présent
    if (!url.searchParams.has("v")) {
      url.searchParams.set("v", Math.floor(Date.now() / 60000).toString()); // Change toutes les minutes
    }
    return url.toString();
  } catch {
    // Si c'est une URL invalide, retourner telle quelle
    return imageUrl;
  }
}

export function adaptParking(p: ParkingAPI): Parking {
  return {
    id: p.id,
    name: p.nom,
    quartier: p.quartier,
    address: p.adresse,
    placesUsed: p.place_occupee,
    placesTotal: p.place_total,
    rating: Number(p.note),
    distance: p.distance ? `${p.distance} km` : "—",
    price: p.prix,
    status: p.statut,
    color: p.couleur,
    image: addCacheBusting(p.image),
    lat: Number(p.lat),
    lng: Number(p.lng),
  };
}
