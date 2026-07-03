// src/hooks/useParkings.ts
// ─── Hooks React pour les parkings ───────────────────────────────────────────

import { useState, useEffect } from "react";
import { parkingsAPI, adaptParking } from "@/lib/api";
import type { ParkingAPI, StatsAPI } from "@/lib/api";
import type { Parking } from "@/data/parkings";

// ─── Hook : liste de tous les parkings (avec fallback données locales) ────────

interface UseParkingsOptions {
  statut?: string;
  quartier?: string;
}

export function useParkings(options?: UseParkingsOptions) {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await parkingsAPI.getAll(options);
        if (!cancelled) setParkings(data.map(adaptParking));
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [options?.statut, options?.quartier]);

  return { parkings, loading, error };
}

// ─── Hook : un seul parking par ID ───────────────────────────────────────────

export function useParkingById(id: number | undefined) {
  const [parking, setParking] = useState<Parking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await parkingsAPI.getById(id);
        if (!cancelled) setParking(adaptParking(data));
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [id]);

  return { parking, loading, error };
}

// ─── Hook : statistiques globales ────────────────────────────────────────────

export function useParkingStats() {
  const [stats, setStats] = useState<StatsAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    parkingsAPI.getStats()
      .then(data => { if (!cancelled) setStats(data); })
      .catch(err => { if (!cancelled) setError((err as Error).message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}
