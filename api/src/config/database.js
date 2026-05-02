// api/src/config/database.js
import { PrismaClient } from '@prisma/client';

// Instance unique de Prisma Client (singleton pour éviter trop de connexions)
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
});

export const connectDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Connexion à MongoDB réussie via Prisma');
    } catch (error) {
        console.error('❌ Erreur de connexion à MongoDB:', error);
        throw error;
    }
};

export const disconnectDatabase = async () => {
    await prisma.$disconnect();
    console.log('🔌 Déconnexion de MongoDB');
};

export default prisma;
