// src/hooks/useUserLocation.tsx
// ─── Position utilisateur partagée dans toute l'app ──────────────────────────
// Avant : userPos vivait en useState local dans Rechercher.tsx → perdu à chaque
// changement de page (il fallait recliquer "Ma position" à chaque fois).
// Maintenant : contexte monté au-dessus des routes → survit à la navigation.

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Coords {
  lat: number;
  lng: number;
}

interface UserLocationContextValue {
  userPos: Coords | null;
  geoLoading: boolean;
  geoError: string | null;
  locateMe: () => void;
  clearGeoError: () => void;
  setGeoError: (msg: string | null) => void;
}

const UserLocationContext = createContext<UserLocationContextValue | null>(null);

export function UserLocationProvider({ children }: { children: ReactNode }) {
  const [userPos, setUserPos] = useState<Coords | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Géolocalisation non supportée par votre navigateur.");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
      },
      () => {
        setGeoError("Position refusée. Vérifiez les permissions de votre navigateur.");
        setGeoLoading(false);
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  const clearGeoError = useCallback(() => setGeoError(null), []);

  return (
    <UserLocationContext.Provider value={{ userPos, geoLoading, geoError, locateMe, clearGeoError, setGeoError }}>
      {children}
    </UserLocationContext.Provider>
  );
}

export function useUserLocation() {
  const ctx = useContext(UserLocationContext);
  if (!ctx) {
    throw new Error("useUserLocation doit être utilisé à l'intérieur de <UserLocationProvider>");
  }
  return ctx;
}
