const express = require('express');
const router  = express.Router();
const {
  createOrGetUtilisateur,
  getUtilisateurByPlaque,
  getUtilisateurById,
} = require('../controllers/utilisateurs.controller');

// POST /api/utilisateurs                     → crée ou retrouve par plaque
router.post('/',                   createOrGetUtilisateur);

// GET  /api/utilisateurs/plaque/:plaque      → cherche par numéro de plaque
router.get('/plaque/:plaque',      getUtilisateurByPlaque);

// GET  /api/utilisateurs/:id                 → cherche par id
router.get('/:id',                 getUtilisateurById);

module.exports = router;
