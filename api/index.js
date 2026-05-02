// api/index.js
// ====================================
// ENTRY POINT VERCEL SERVERLESS FUNCTION
// ====================================
// Vercel détecte ce fichier dans /api/ et l'expose comme serverless function.
// Toutes les requêtes /api/* sont routées ici via vercel.json.
// ⚠️ Pas de app.listen() ici — Vercel gère le cycle de vie du serveur.

import app from './src/app.js';

export default app;
