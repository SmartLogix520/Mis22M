// api/src/app.js
// ⚠️ Ce fichier exporte l'app Express SANS app.listen()
// - Vercel appelle directement cet export comme Serverless Function
// - server.js appelle app.listen() pour le développement local

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import productRoutes from './routes/productRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import rangeRoutes from './routes/rangeRoutes.js';
import favoriteVideoRoutes from './routes/favoriteVideoRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import path from 'path';

dotenv.config();

const app = express();

// ====================================
// MIDDLEWARES
// ====================================

// CORS — Autoriser les requêtes depuis le frontend
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:4173',
];

app.use(cors({
    origin: (origin, callback) => {
        // Autoriser les requêtes sans origin (Postman, curl, etc.)
        if (!origin) return callback(null, true);
        // En production Vercel : même domaine → origin = undefined ou le domaine vercel
        if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
            return callback(null, true);
        }
        callback(new Error('CORS non autorisé'));
    },
    credentials: true
}));

// Parser le body des requêtes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger les requêtes en développement
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} — ${req.method} ${req.path}`);
        next();
    });
}

// Servir les fichiers d'images de façon statique
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ====================================
// ROUTES
// ====================================

// Route de statut / health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '🚀 API Mis22M opérationnelle',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        endpoints: {
            products: '/api/products',
            stores: '/api/stores',
            categories: '/api/categories',
            ranges: '/api/ranges',
            health: '/api/health'
        }
    });
});

// Routes API
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ranges', rangeRoutes);
app.use('/api/favorite-videos', favoriteVideoRoutes);
app.use('/api/upload', uploadRoutes);

// ====================================
// GESTION DES ERREURS
// ====================================
app.use(notFoundHandler);
app.use(errorHandler);

// ====================================
// INITIALISATION DB (pour Vercel — connexion à la première requête)
// ====================================
let isConnected = false;

const ensureDbConnected = async () => {
    if (!isConnected) {
        await connectDatabase();
        isConnected = true;
    }
};

// Middleware pour connecter la DB avant chaque requête (Vercel cold start)
app.use(async (req, res, next) => {
    try {
        await ensureDbConnected();
        next();
    } catch (error) {
        next(error);
    }
});

export default app;
