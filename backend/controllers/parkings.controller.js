const pool = require('../config/db');

// ─── GET /api/parkings ──────────────────────────────────────────────────────
// Retourne tous les parkings, avec filtres optionnels : ?statut=libre&quartier=Akwa
const getAllParkings = async (req, res) => {
  try {
    const { statut, quartier } = req.query;
    const conditions = [];
    const values = [];

    if (statut) {
      values.push(statut);
      conditions.push(`statut = $${values.length}`);
    }
    if (quartier) {
      values.push(`%${quartier}%`);
      conditions.push(`quartier ILIKE $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await pool.query(
      `SELECT
         id, nom, quartier, adresse,
         place_occupee, place_total,
         ROUND((place_occupee::numeric / NULLIF(place_total,0)) * 100, 1) AS taux_occupation,
         note, distance, prix, statut, couleur, image, lat, lng
       FROM parkings
       ${where}
       ORDER BY statut ASC, note DESC`,
      values
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getAllParkings:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─── GET /api/parkings/:id ──────────────────────────────────────────────────
const getParkingById = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `SELECT
         p.*,
         ROUND((p.place_occupee::numeric / NULLIF(p.place_total,0)) * 100, 1) AS taux_occupation,
         COUNT(r.id_reservation) FILTER (WHERE r.statut = 'en_cours') AS reservations_actives
       FROM parkings p
       LEFT JOIN reservations r ON r.id_parking = p.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Parking introuvable' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getParkingById:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─── GET /api/parkings/disponibles ─────────────────────────────────────────
// Parkings avec au moins une place libre
const getParkingsDisponibles = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nom, quartier, adresse,
              (place_total - place_occupee) AS places_libres,
              place_total, note, distance, prix, statut, couleur, image, lat, lng
       FROM parkings
       WHERE statut != 'complet'
       ORDER BY note DESC, distance ASC`
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getParkingsDisponibles:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─── GET /api/parkings/stats ────────────────────────────────────────────────
// Statistiques globales pour le dashboard
const getStatsParkings = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         COUNT(*)                                          AS total_parkings,
         SUM(place_total)                                 AS total_places,
         SUM(place_occupee)                               AS places_occupees,
         SUM(place_total - place_occupee)                 AS places_libres,
         COUNT(*) FILTER (WHERE statut = 'libre')         AS parkings_libres,
         COUNT(*) FILTER (WHERE statut = 'quasi-plein')   AS parkings_quasi_pleins,
         COUNT(*) FILTER (WHERE statut = 'complet')       AS parkings_complets,
         ROUND(AVG(note), 1)                              AS note_moyenne
       FROM parkings`
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getStatsParkings:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { getAllParkings, getParkingById, getParkingsDisponibles, getStatsParkings };
