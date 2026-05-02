// api/src/routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Créer le dossier s'il n'existe pas
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // limite 10MB
});

// Endpoint pour uploader plusieurs images
router.post('/', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Aucun fichier uploadé' });
        }

        // Construire l'URL de base du serveur pour les URLs absolues
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        // Retourner les URLs absolues — le frontend pourra accéder via http://localhost:5001/uploads/filename.ext
        const urls = req.files.map(file => {
            return `${baseUrl}/uploads/${file.filename}`;
        });

        // Wrapper dans le format ApiSuccessResponse attendu par le client
        res.json({
            success: true,
            message: `${urls.length} image(s) uploadée(s) avec succès`,
            data: { urls },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de l\'upload', error: error.message });
    }
});

export default router;
