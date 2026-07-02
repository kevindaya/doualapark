require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const parkingsRoutes     = require('./routes/parkings.routes');
const utilisateursRoutes = require('./routes/utilisateurs.routes');
const reservationsRoutes = require('./routes/reservations.routes');
const { notFound, errorHandler } = require('./middleware/validation');

const app  = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:5173'];

// ─── Middlewares globaux ────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Logs simples (dev) ──────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString('fr-FR')}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    message: '🚗 Douala Park API',
    version: '1.0.0',
    endpoints: {
      parkings:     '/api/parkings',
      utilisateurs: '/api/utilisateurs',
      reservations: '/api/reservations',
    }
  });
});

app.use('/api/parkings',     parkingsRoutes);
app.use('/api/utilisateurs', utilisateursRoutes);
app.use('/api/reservations', reservationsRoutes);


// ─── Erreurs ─────────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Démarrage ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📋 API : http://localhost:${PORT}/api/parkings\n`);
});
