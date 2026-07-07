-- NETTOYAGE DES DONNÉES DE TEST
-- Supprimer les réservations de test
DELETE FROM reservations WHERE id_reservation IN (1, 2);

-- Supprimer les utilisateurs de test (garder juste les vrais)
DELETE FROM utilisateurs WHERE id_user IN (3, 4, 5);

-- Vérification finale
SELECT * FROM utilisateurs;
SELECT * FROM reservations;
