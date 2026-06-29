// Middleware de validation des IDs numériques dans les params
const validerIdNumerique = (paramName = 'id') => (req, res, next) => {
  const val = req.params[paramName];
  if (!val || isNaN(parseInt(val)) || parseInt(val) <= 0) {
    return res.status(400).json({
      success: false,
      message: `Paramètre invalide : ${paramName} doit être un entier positif`
    });
  }
  next();
};

// Middleware 404 global
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.method} ${req.originalUrl}`
  });
};

// Middleware erreur globale
const errorHandler = (err, req, res, next) => {
  console.error('Erreur non gérée :', err);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
};

module.exports = { validerIdNumerique, notFound, errorHandler };
