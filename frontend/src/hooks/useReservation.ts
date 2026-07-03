// src/hooks/useReservation.ts
// ─── Hooks React pour les réservations ───────────────────────────────────────

import { useState, useEffect } from "react";
import { reservationsAPI, utilisateursAPI } from "@/lib/api";
import type { ReservationAPI } from "@/lib/api";

// ─── Hook principal : soumettre une réservation ───────────────────────────────
// Gère : création utilisateur → création réservation → retourne le résultat

interface ReserverPayload {
  nom: string;
  numero_plaque: string;
  id_parking: number;
  heure_debut: string;
  heure_fin: string;
  date_reservation?: string;
}

interface UseReserverResult {
  soumettre: (payload: ReserverPayload) => Promise<ReservationAPI | null>;
  reservation: ReservationAPI | null;
  loading: boolean;
  error: string | null;
}

export function useReserver(): UseReserverResult {
  const [reservation, setReservation] = useState<ReservationAPI | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const soumettre = async (payload: ReserverPayload): Promise<ReservationAPI | null> => {
    setLoading(true);
    setError(null);

    try {
      // Étape 1 : créer ou récupérer l'utilisateur via sa plaque
      const utilisateur = await utilisateursAPI.createOrGet(
        payload.nom,
        payload.numero_plaque
      );

      // Étape 2 : créer la réservation
      const result = await reservationsAPI.creer({
        id_user: utilisateur.id_user,
        id_parking: payload.id_parking,
        heure_debut: payload.heure_debut,
        heure_fin: payload.heure_fin,
        date_reservation: payload.date_reservation,
      });

      setReservation(result);
      return result;
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { soumettre, reservation, loading, error };
}

// ─── Hook : historique des réservations d'un utilisateur ─────────────────────

export function useReservationsUser(id_user: number | null) {
  const [reservations, setReservations] = useState<ReservationAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id_user) return;
    let cancelled = false;

    setLoading(true);
    reservationsAPI.getByUser(id_user)
      .then(data => { if (!cancelled) setReservations(data); })
      .catch(err => { if (!cancelled) setError((err as Error).message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id_user]);

  return { reservations, loading, error };
}

// ─── Hook : retrouver un utilisateur par plaque (pour la page Profil) ─────────

export function useUtilisateurByPlaque(plaque: string | null) {
  const [utilisateur, setUtilisateur] = useState<{ id_user: number; nom: string; numero_plaque: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chercher = async (p: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await utilisateursAPI.getByPlaque(p);
      setUtilisateur(data);
      return data;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (plaque) chercher(plaque);
  }, [plaque]);

  return { utilisateur, loading, error, chercher };
}
