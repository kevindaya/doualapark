// src/hooks/useParkings.ts
// ─── Hooks React pour les parkings ───────────────────────────────────────────
// Migré vers React Query (déjà installé et déjà branché dans App.tsx via
// QueryClientProvider, mais pas utilisé auparavant).
//
// Pourquoi : avant, useState/useEffect repartait de zéro à CHAQUE montage du
// composant (donc à chaque fois qu'on quittait "Rechercher" et qu'on y
// revenait) → nouveau fetch, nouveau flash de "0 résultat" pendant le
// chargement. React Query garde les données en cache : en revisitant la page,
// les données précédentes s'affichent instantanément pendant qu'un
// rafraîchissement silencieux se fait en arrière-plan.

import { useQuery } from "@tanstack/react-query";
import { parkingsAPI, adaptParking } from "@/lib/api";
import type { StatsAPI } from "@/lib/api";

interface UseParkingsOptions {
  statut?: string;
  quartier?: string;
}

// ─── Hook : liste de tous les parkings ───────────────────────────────────────

export function useParkings(options?: UseParkingsOptions) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["parkings", options?.statut, options?.quartier],
    queryFn: async () => {
      const rows = await parkingsAPI.getAll(options);
      return rows.map(adaptParking);
    },
    staleTime: 60_000,
    retry: 1,
  });

  return {
    parkings: data ?? [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}

// ─── Hook : un seul parking par ID ───────────────────────────────────────────

export function useParkingById(id: number | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["parking", id],
    queryFn: async () => {
      const row = await parkingsAPI.getById(id as number);
      return adaptParking(row);
    },
    enabled: typeof id === "number" && !Number.isNaN(id),
    staleTime: 60_000,
    retry: 1,
  });

  return {
    parking: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}

// ─── Hook : statistiques globales ────────────────────────────────────────────

export function useParkingStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["parking-stats"],
    queryFn: () => parkingsAPI.getStats(),
    staleTime: 60_000,
    retry: 1,
  });

  return {
    stats: (data ?? null) as StatsAPI | null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
