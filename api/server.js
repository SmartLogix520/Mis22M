// api/server.js
// ====================================
// SERVEUR LOCAL POUR DÉVELOPPEMENT
// ====================================
// Utilisé UNIQUEMENT en développement local via : npm run dev
// Sur Vercel, c'est api/index.js qui est utilisé.

import app from './src/app.js';
import { connectDatabase, disconnectDatabase } from './src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        // Connexion à MongoDB via Prisma
        await connectDatabase();

        // Démarrer le serveur Express
        app.listen(PORT, () => {
            console.log('');
            console.log('='.repeat(50));
            console.log(`✅ Serveur Mis22M démarré sur le port ${PORT}`);
            console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`📚 Health: http://localhost:${PORT}/api/health`);
            console.log(`🏪 Stores: http://localhost:${PORT}/api/stores`);
            console.log(`📦 Products: http://localhost:${PORT}/api/products`);
            console.log(`🗂️  Categories: http://localhost:${PORT}/api/categories`);
            console.log(`🎯 Ranges: http://localhost:${PORT}/api/ranges`);
            console.log('='.repeat(50));
            console.log('');
        });
    } catch (error) {
        console.error('❌ Erreur au démarrage du serveur:', error);
        process.exit(1);
    }
};

// Arrêt propre
process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt du serveur...');
    await disconnectDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Arrêt du serveur...');
    await disconnectDatabase();
    process.exit(0);
});

startServer();
