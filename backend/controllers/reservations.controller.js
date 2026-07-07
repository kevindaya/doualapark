// backend/controllers/reservations.controller.js
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// ─── Helpers ────────────────────────────────────────────────────────────────
const genererCodeQR = () => {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `DP-${suffix}`;
};

const calculerPrix = (heureDebut, heureFin, prixHoraire) => {
  const [hD, mD] = heureDebut.split(":").map(Number);
  const [hF, mF] = heureFin.split(":").map(Number);
  const dureeMinutes = hF * 60 + mF - (hD * 60 + mD);
  if (dureeMinutes <= 0) return null;
  return Math.ceil((dureeMinutes / 60) * prixHoraire);
};

const mettreAJourStatutParking = async (client, idParking) => {
  const { rows } = await client.query(
    "SELECT place_occupee, place_total FROM parkings WHERE id = $1",
    [idParking],
  );
  if (!rows.length) return;
  const { place_occupee, place_total } = rows[0];
  const taux = place_occupee / place_total;
  let statut = "libre";
  if (taux >= 1) statut = "complet";
  else if (taux >= 0.8) statut = "quasi-plein";
  const couleur =
    statut === "libre"
      ? "#10B981"
      : statut === "quasi-plein"
        ? "#F97316"
        : "#EF4444";
  await client.query(
    "UPDATE parkings SET statut = $1::statut_parking, couleur = $2 WHERE id = $3",
    [statut, couleur, idParking],
  );
};

// ─── GET /api/reservations/all ──────────────────────────────────────────────
// Toutes les réservations (toutes plaques confondues)
const getAllReservations = async (req, res) => {
  try {
    const { statut } = req.query;
    let query = `
      SELECT
        r.*,
        p.nom         AS parking_nom,
        p.adresse     AS parking_adresse,
        p.quartier    AS parking_quartier,
        p.image       AS parking_image,
        p.lat,
        p.lng,
        u.nom         AS user_nom,
        u.numero_plaque
      FROM reservations r
      JOIN parkings     p ON p.id      = r.id_parking
      JOIN utilisateurs u ON u.id_user = r.id_user
    `;
    const values = [];
    if (statut) {
      values.push(statut);
      query += ` WHERE r.statut = $1`;
    }
    query += ` ORDER BY r.date_reservation DESC, r.heure_debut DESC`;
    const { rows } = await pool.query(query, values);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getAllReservations:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ─── POST /api/reservations ─────────────────────────────────────────────────
const creerReservation = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id_user, id_parking, heure_debut, heure_fin, date_reservation } =
      req.body;
    if (!id_user || !id_parking || !heure_debut || !heure_fin) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Champs obligatoires : id_user, id_parking, heure_debut, heure_fin",
        });
    }
    await client.query("BEGIN");

    const parkingRes = await client.query(
      "SELECT id, nom, prix, place_occupee, place_total, statut FROM parkings WHERE id = $1 FOR UPDATE",
      [id_parking],
    );
    if (!parkingRes.rows.length) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ success: false, message: "Parking introuvable" });
    }
    const parking = parkingRes.rows[0];
    if (parking.statut === "complet") {
      await client.query("ROLLBACK");
      return res
        .status(409)
        .json({ success: false, message: "Ce parking est complet" });
    }

    const userRes = await client.query(
      "SELECT id_user FROM utilisateurs WHERE id_user = $1",
      [id_user],
    );
    if (!userRes.rows.length) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur introuvable" });
    }

    const prix = calculerPrix(heure_debut, heure_fin, parking.prix);
    if (!prix) {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({
          success: false,
          message: "heure_fin doit être après heure_debut",
        });
    }

    let codeQR,
      tentatives = 0;
    do {
      codeQR = genererCodeQR();
      const existing = await client.query(
        "SELECT id_reservation FROM reservations WHERE code_qr = $1",
        [codeQR],
      );
      if (!existing.rows.length) break;
      tentatives++;
    } while (tentatives < 5);

    const dateResa = date_reservation || new Date().toISOString().split("T")[0];
    const { rows } = await client.query(
      `INSERT INTO reservations (heure_debut, heure_fin, prix_reservation, date_reservation, statut, code_qr, id_user, id_parking)
       VALUES ($1, $2, $3, $4, 'en_cours', $5, $6, $7) RETURNING *`,
      [heure_debut, heure_fin, prix, dateResa, codeQR, id_user, id_parking],
    );

    await client.query(
      "UPDATE parkings SET place_occupee = place_occupee + 1 WHERE id = $1",
      [id_parking],
    );
    await mettreAJourStatutParking(client, id_parking);
    await client.query("COMMIT");

    res
      .status(201)
      .json({
        success: true,
        message: "Réservation créée avec succès",
        data: { ...rows[0], parking_nom: parking.nom },
      });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("creerReservation:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  } finally {
    client.release();
  }
};

// ─── GET /api/reservations/user/:id_user ────────────────────────────────────
const getReservationsUser = async (req, res) => {
  try {
    const { id_user } = req.params;
    const { statut } = req.query;
    let query = `
      SELECT r.*, p.nom AS parking_nom, p.adresse AS parking_adresse,
             p.quartier AS parking_quartier, p.image AS parking_image,
             p.lat, p.lng,
             u.nom AS user_nom, u.numero_plaque
      FROM reservations r
      JOIN parkings     p ON p.id      = r.id_parking
      JOIN utilisateurs u ON u.id_user = r.id_user
      WHERE r.id_user = $1
    `;
    const values = [id_user];
    if (statut) {
      values.push(statut);
      query += ` AND r.statut = $${values.length}`;
    }
    query += ` ORDER BY r.date_reservation DESC, r.heure_debut DESC`;
    const { rows } = await pool.query(query, values);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getReservationsUser:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ─── GET /api/reservations/:id ──────────────────────────────────────────────
const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT r.*, p.nom AS parking_nom, p.adresse AS parking_adresse,
              p.quartier, p.lat, p.lng, u.nom AS user_nom, u.numero_plaque
       FROM reservations r
       JOIN parkings     p ON p.id      = r.id_parking
       JOIN utilisateurs u ON u.id_user = r.id_user
       WHERE r.id_reservation = $1`,
      [id],
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Réservation introuvable" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("getReservationById:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ─── GET /api/reservations/qr/:code ─────────────────────────────────────────
const getReservationByQR = async (req, res) => {
  try {
    const { code } = req.params;
    const { rows } = await pool.query(
      `SELECT r.*, p.nom AS parking_nom, p.adresse AS parking_adresse,
              p.lat, p.lng, u.nom AS user_nom, u.numero_plaque
       FROM reservations r
       JOIN parkings     p ON p.id      = r.id_parking
       JOIN utilisateurs u ON u.id_user = r.id_user
       WHERE r.code_qr = $1`,
      [code.toUpperCase()],
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "QR code invalide" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("getReservationByQR:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ─── PATCH /api/reservations/:id/terminer ───────────────────────────────────
const terminerReservation = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT * FROM reservations WHERE id_reservation = $1 FOR UPDATE",
      [id],
    );
    if (!rows.length) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ success: false, message: "Réservation introuvable" });
    }
    const resa = rows[0];
    if (resa.statut !== "en_cours") {
      await client.query("ROLLBACK");
      return res
        .status(409)
        .json({
          success: false,
          message: `Impossible : la réservation est déjà "${resa.statut}"`,
        });
    }
    await client.query(
      "UPDATE reservations SET statut = 'terminee' WHERE id_reservation = $1",
      [id],
    );
    await client.query(
      "UPDATE parkings SET place_occupee = GREATEST(place_occupee - 1, 0) WHERE id = $1",
      [resa.id_parking],
    );
    await mettreAJourStatutParking(client, resa.id_parking);
    await client.query("COMMIT");
    res.json({ success: true, message: "Réservation terminée, place libérée" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("terminerReservation:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  } finally {
    client.release();
  }
};

// ─── PATCH /api/reservations/:id/annuler ────────────────────────────────────
const annulerReservation = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT * FROM reservations WHERE id_reservation = $1 FOR UPDATE",
      [id],
    );
    if (!rows.length) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ success: false, message: "Réservation introuvable" });
    }
    const resa = rows[0];
    if (resa.statut !== "en_cours") {
      await client.query("ROLLBACK");
      return res
        .status(409)
        .json({
          success: false,
          message: `Impossible : la réservation est déjà "${resa.statut}"`,
        });
    }
    await client.query(
      "UPDATE reservations SET statut = 'annulee' WHERE id_reservation = $1",
      [id],
    );
    await client.query(
      "UPDATE parkings SET place_occupee = GREATEST(place_occupee - 1, 0) WHERE id = $1",
      [resa.id_parking],
    );
    await mettreAJourStatutParking(client, resa.id_parking);
    await client.query("COMMIT");
    res.json({ success: true, message: "Réservation annulée" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("annulerReservation:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllReservations,
  creerReservation,
  getReservationsUser,
  getReservationById,
  getReservationByQR,
  terminerReservation,
  annulerReservation,
};
