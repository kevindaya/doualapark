// backend/routes/reservations.routes.js
const express = require('express');
const router  = express.Router();
const {
  getAllReservations,
  creerReservation,
  getReservationsUser,
  getReservationById,
  getReservationByQR,
  terminerReservation,
  annulerReservation,
} = require('../controllers/reservations.controller');

// ⚠️ L'ordre est important : les routes spécifiques AVANT /:id

// GET  /api/reservations/all              → toutes les réservations
router.get('/all',               getAllReservations);

// POST /api/reservations                  → nouvelle réservation
router.post('/',                 creerReservation);

// GET  /api/reservations/user/:id_user    → historique d'un utilisateur
router.get('/user/:id_user',     getReservationsUser);

// GET  /api/reservations/qr/:code         → scan QR code
router.get('/qr/:code',          getReservationByQR);

// GET  /api/reservations/:id              → détail d'une réservation
router.get('/:id',               getReservationById);

// PATCH /api/reservations/:id/terminer   → terminer
router.patch('/:id/terminer',    terminerReservation);

// PATCH /api/reservations/:id/annuler    → annuler
router.patch('/:id/annuler',     annulerReservation);

module.exports = router;