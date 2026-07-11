// src/lib/localUser.ts
// ─── Identité locale de l'appareil ────────────────────────────────────────────
// Pas d'authentification dans ce projet (voir page Profil : "Connexion disponible
// dans une prochaine version. Vos données sont enregistrées localement.").
// On mémorise simplement l'id_user retourné après la dernière réservation faite
// sur CET appareil, pour que "Mes Réservations" affiche l'historique de cette
// personne plutôt que celui de tout le monde.

const KEY = "doualapark_user";

export interface LocalUser {
  id_user: number;
  nom: string;
  numero_plaque: string;
}

export function getLocalUser(): LocalUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.id_user !== "number") return null;
    return parsed as LocalUser;
  } catch {
    return null;
  }
}

export function setLocalUser(user: LocalUser): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    // localStorage indisponible (navigation privée, quota, etc.) — on ignore,
    // ça ne doit jamais empêcher la réservation de fonctionner.
  }
}
