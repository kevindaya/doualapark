const pool = require('../config/db');

// ─── POST /api/utilisateurs ─────────────────────────────────────────────────
// Crée ou retrouve un utilisateur par sa plaque (pas d'auth, identif. par plaque)
const createOrGetUtilisateur = async (req, res) => {
  try {
    const { nom, numero_plaque } = req.body;

    if (!nom || !numero_plaque) {
      return res.status(400).json({
        success: false,
        message: 'nom et numero_plaque sont obligatoires'
      });
    }

    const plaque = numero_plaque.trim().toUpperCase();

    // Cherche d'abord si la plaque existe déjà
    const existing = await pool.query(
      'SELECT * FROM utilisateurs WHERE numero_plaque = $1',
      [plaque]
    );

    if (existing.rows.length) {
      return res.json({ success: true, data: existing.rows[0], nouveau: false });
    }

    // Sinon, crée
    const { rows } = await pool.query(
      'INSERT INTO utilisateurs (nom, numero_plaque) VALUES ($1, $2) RETURNING *',
      [nom.trim(), plaque]
    );

    res.status(201).json({ success: true, data: rows[0], nouveau: true });
  } catch (err) {
    console.error('createOrGetUtilisateur:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─── GET /api/utilisateurs/plaque/:plaque ───────────────────────────────────
// Retrouve un utilisateur par son numéro de plaque
const getUtilisateurByPlaque = async (req, res) => {
  try {
    const plaque = req.params.plaque.trim().toUpperCase();

    const { rows } = await pool.query(
      'SELECT * FROM utilisateurs WHERE numero_plaque = $1',
      [plaque]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getUtilisateurByPlaque:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─── GET /api/utilisateurs/:id ──────────────────────────────────────────────
const getUtilisateurById = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'SELECT * FROM utilisateurs WHERE id_user = $1',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getUtilisateurById:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { createOrGetUtilisateur, getUtilisateurByPlaque, getUtilisateurById };
