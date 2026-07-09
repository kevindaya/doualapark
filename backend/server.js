require("dotenv").config();
const express = require("express");
const cors = require("cors");

const parkingsRoutes = require("./routes/parkings.routes");
const utilisateursRoutes = require("./routes/utilisateurs.routes");
const reservationsRoutes = require("./routes/reservations.routes");
const { notFound, errorHandler } = require("./middleware/validation");

const app = express();
const PORT = process.env.PORT || 3000;
// ─── Configuration CORS améliorée ──────────────────────────────────────────
// Accepte :
//   1. Les origines configurées en env (séparées par des virgules)
//   2. Les domaines Vercel automatiquement (*.vercel.app)
//   3. localhost en développement
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : ["http://localhost:3000", "http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    // Pas d'origine = requête same-origin ou mobile
    if (!origin) {
      return callback(null, true);
    }

    // Vérifier liste blanche
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Accepter les domaines Vercel
    if (origin.includes(".vercel.app") || origin.includes("localhost")) {
      return callback(null, true);
    }

    // Refuser les autres
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 3600,
};

// ─── Middlewares globaux ────────────────────────────────────────────────────
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Middleware Cache-Control ──────────────────────────────────────────────────
// Évite que les données ne soient trop cachées sur le réseau mobile/CDN
app.use((req, res, next) => {
  // Cache-Control: public, max-age=60 (1 minute) → permet le cache local mais oblige un rafraîchissement
  res.setHeader("Cache-Control", "public, max-age=60, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  next();
});

// ─── Logs simples (dev) ──────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(
    `[${new Date().toLocaleTimeString("fr-FR")}] ${req.method} ${req.path}`,
  );
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    message: "🚗 Douala Park API",
    version: "1.0.0",
    endpoints: {
      parkings: "/api/parkings",
      utilisateurs: "/api/utilisateurs",
      reservations: "/api/reservations",
    },
  });
});

app.use("/api/parkings", parkingsRoutes);
app.use("/api/utilisateurs", utilisateursRoutes);
app.use("/api/reservations", reservationsRoutes);

// ─── Erreurs ─────────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Démarrage ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📋 API : http://localhost:${PORT}/api/parkings\n`);
});
