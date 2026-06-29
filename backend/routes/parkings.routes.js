const express = require('express');
const router  = express.Router();
const {
  getAllParkings,
  getParkingById,
  getParkingsDisponibles,
  getStatsParkings,
} = require('../controllers/parkings.controller');

// GET /api/parkings/stats        → statistiques globales (avant /:id pour éviter conflit)
router.get('/stats',        getStatsParkings);

// GET /api/parkings/disponibles  → seulement les parkings non complets
router.get('/disponibles',  getParkingsDisponibles);

// GET /api/parkings              → tous les parkings (filtrables par ?statut= &quartier=)
router.get('/',             getAllParkings);

// GET /api/parkings/:id          → un parking par son id
router.get('/:id',          getParkingById);

module.exports = router;
